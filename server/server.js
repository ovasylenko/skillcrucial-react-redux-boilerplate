import express from 'express'
import path from 'path'
import axios from 'axios'
import cors from 'cors'
import bodyParser from 'body-parser'
import sockjs from 'sockjs'
import { renderToStaticNodeStream } from 'react-dom/server'
import React from 'react'

import cookieParser from 'cookie-parser'
import config from './config'
import Html from '../client/html'

const { writeFile, readFile, unlink } = require('fs').promises

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

const setHeaders = (req, res, next) => {
  res.set('x-skillcrucial-user', 'f682d1b5-e9f3-4e70-b8a8-59ff2191ee30')
  res.set('Access-Control-Expose-Headers', 'X-SKILLCRUCIAL-USER')
  next()
}

const middleware = [
  cors(),
  express.static(path.resolve(__dirname, '../dist/assets')),
  bodyParser.urlencoded({ limit: '50mb', extended: true, parameterLimit: 50000 }),
  bodyParser.json({ limit: '50mb', extended: true }),
  cookieParser(),
  setHeaders
]

middleware.forEach((it) => server.use(it))

const usersUrl = 'https://jsonplaceholder.typicode.com/users'

function userfileExist() {
  const fileData = readFile(`${__dirname}/users.json`)
    .then((data) => {
      return JSON.parse(data)
    })
    .catch(async () => {
      const newUsers = await axios(usersUrl).then((it) => it.data)
      newUsers.sort((a, b) => a.id - b.id)
      writeFile(`${__dirname}/users.json`, JSON.stringify(newUsers.data), { encoding: 'utf8' })
      return newUsers
    })
  return fileData
}

server.get('/api/v1/users', async (req, res) => {
  const newData = await userfileExist()
  res.json(newData)
})

function userfileWrite(file) {
  writeFile(`${__dirname}/users.json`, JSON.stringify(file), { encoding: 'utf8' })
}

server.post('/api/v1/users', async (req, res) => {
  const newUser = req.body
  const userData = await userfileExist()
  newUser.id = userData.length === 0 ? 1 : userData[userData.length - 1].id + 1
  userfileWrite([...userData, newUser])
  res.json({ status: 'success', id: newUser.id })
})

server.patch('/api/v1/users/:userId', async (req, res) => {
  const { userId } = req.params
  const newUser = req.body
  const userData = await userfileExist()
  const objUserId = userData.find((it) => it.id === +userId)
  const newObjUserId = { ...objUserId, ...newUser }
  const newData = userData.map((it) => (it.id === newObjUserId.id ? newObjUserId : it))
  userfileWrite(newData)
  res.json({ status: 'success', id: userId })
})

server.delete('/api/v1/users/:userId', async (req, res) => {
  const { userId } = req.params
  const userData = await userfileExist()
  const objUserId = userData.find((it) => it.id === +userId)
  const newData = userData.filter((it) => it.id !== objUserId.id)
  userfileWrite(newData)
  res.json({ status: 'success', id: userId })
})

server.delete('/api/v1/users', (req, res) => {
  unlink(`${__dirname}/users.json`)
    .then(() => res.json({ status: 'success' }))
    .catch(() => res.send(''))
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
