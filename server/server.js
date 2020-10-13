import express from 'express'
import path from 'path'
import cors from 'cors'
import bodyParser from 'body-parser'
import sockjs from 'sockjs'
import { renderToStaticNodeStream } from 'react-dom/server'
import React from 'react'
import axios from 'axios'

import cookieParser from 'cookie-parser'
import config from './config'
import Html from '../client/html'

const { readFile, writeFile, unlink } = require("fs").promises; 

const setHeaders = (req, res, next) => {
  res.set({
  'x-skillcrucial-user': 'e75ae02a-45e3-4bbb-b660-b0ea81b02dcd',
  'Access-Control-Expose-Headers': 'X-SKILLCRUCIAL-USER'
})
  next()
}

const Root = () => ''

try {
  // eslint-disable-next-line import/no-unresolved
  // ;(async () => {
  //   const items = await import('../dist/assets/js/root.bundle')
  //   console.log(JSON.stringify(items))

  //   Root = (props) => <items.Root {...props} />
  //   console.log(JSON.stringify(items.Root))
  // })()
  console.log(Root)
} catch (ex) {
  console.log(' run yarn build:prod to enable ssr')
}

let connections = []

const port = process.env.PORT || 8090
const server = express()

const middleware = [
  cors(),
  express.static(path.resolve(__dirname, '../dist/assets')),
  bodyParser.urlencoded({ limit: '50mb', extended: true, parameterLimit: 50000 }),
  bodyParser.json({ limit: '50mb', extended: true }),
  cookieParser(),
  setHeaders
]

middleware.forEach((it) => server.use(it))

server.get('/api/v1/users', (req, res) => {
  readFile(`${__dirname}/users.json`, { encoding: "utf8" })
    .then((users) => {
      res.send(users)
    })
    .catch(async () => {
      const users = await axios('https://jsonplaceholder.typicode.com/users').then(({data}) => data)
      writeFile(`${__dirname}/users.json`, JSON.stringify(users), {encoding : "utf8" })
      res.send(users)
    })
})

server.post('/api/v1/users', (req, res) => {
  const { body } = req
  readFile(`${__dirname}/users.json`, { encoding: 'utf8' })
  .then((objUsers) => {
    const users = JSON.parse(objUsers)
    const lastId = users[users.length - 1].id + 1
    const newUser = {
      id: lastId,
      ...body
    }
    const newUsers = [...users, newUser]
    writeFile(`${__dirname}/users.json`, JSON.stringify(newUsers), { encoding: 'utf8' })
    res.send({ status: 'success', id: newUser.id })
  })
})

server.patch('/api/v1/users/:userId', (req, res) => {
  const {body} = req
  readFile(`${__dirname}/users.json`, { encoding: 'utf8' })
  .then((objUsers) => {
    const users = JSON.parse(objUsers)
    const id = +req.params.userId
    const newUsers = users.map((user) => {
      if (user.id === id) {
        return {
          ...user,
          ...body
        }
      }
      return user
    })
    writeFile(`${__dirname}/users.json`, JSON.stringify(newUsers), { encoding: 'utf8' })
    res.send({ status: 'success', id })
  })
})

server.delete('/api/v1/users/:userId', (req, res) => {
  readFile(`${__dirname}/users.json`, { encoding: 'utf8' })
  .then((objUsers) => {
    const users = JSON.parse(objUsers)
    const id = +req.params.userId
    const newUsers = users.filter((user) => user.id !== id)
    writeFile(`${__dirname}/users.json`, JSON.stringify(newUsers), { encoding: 'utf8' })
    res.send({ status: 'success', id })
  })
})

server.delete('/api/v1/users', (req, res) => {
  unlink(`${__dirname}/users.json`, {encoding : "utf8" })
  res.send({ status: 'success' })
})

server.use('/api/', (req, res) => {
  res.status(404)
  res.end()
})

const [htmlStart, htmlEnd] = Html({
  body: 'separator',
  title: 'Skillcrucial - Become an IT HERO'
}).split('separator')

server.get('/', (req, res) => {
  const appStream = renderToStaticNodeStream(<Root location={req.url} context={{}} />)
  res.write(htmlStart)
  appStream.pipe(res, { end: false })
  appStream.on('end', () => {
    res.write(htmlEnd)
    res.end()
  })
})

server.get('/*', (req, res) => {
  const initialState = {
    location: req.url
  }

  return res.send(
    Html({
      body: '',
      initialState
    })
  )
})

const app = server.listen(port)

if (config.isSocketsEnabled) {
  const echo = sockjs.createServer()
  echo.on('connection', (conn) => {
    connections.push(conn)
    conn.on('data', async () => {})

    conn.on('close', () => {
      connections = connections.filter((c) => c.readyState !== 3)
    })
  })
  echo.installHandlers(app, { prefix: '/ws' })
}
console.log(`Serving at http://localhost:${port}`)
