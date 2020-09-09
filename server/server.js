import express from 'express'
import path from 'path'
import cors from 'cors'
import bodyParser from 'body-parser'
import sockjs from 'sockjs'
import { renderToStaticNodeStream } from 'react-dom/server'
import React from 'react'

import cookieParser from 'cookie-parser'
import axios from 'axios'
import config from './config'
import Html from '../client/html'

const { readFile, writeFile, stat, unlink } = require('fs').promises

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
  res.set({
    'x-skillcrucial-user': '351542e2-893e-4a6f-80bd-8a9d3449afc5',
    'Access-Control-Expose-Headers': 'X-SKILLCRUCIAL-USER',
    'Content-Type': 'application/json; charset=utf-8'
  })
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

server.get('/api/v1/users', (req, res) => {
  stat(`${__dirname}/users.json`)
    .then((data) => {
      if (data.size) {
        readFile(`${__dirname}/users.json`, { encoding: 'utf-8' }).then((users) => {
          res.send(users)
        })
      }
    })
    .catch((err) => {
      if (err) {
        axios.get('https://jsonplaceholder.typicode.com/users').then(({ data }) => {
          writeFile(`${__dirname}/users.json`, JSON.stringify(data), { encoding: 'utf-8' }).then(
            () => {
              res.send(data)
            }
          )
        })
      }
    })
})

server.post('/api/v1/users', (req, res) => {
  readFile(`${__dirname}/users.json`, { encoding: 'utf-8' }).then((users) => {
    const usersObj = JSON.parse(users)
    const user = req.body
    const newUsers = [...usersObj, user]

    writeFile(`${__dirname}/users.json`, JSON.stringify(newUsers), { encoding: 'utf-8' }).then(
      () => {
        res.send(JSON.stringify({ status: 'success', id: user.id }))
      }
    )
  })
})

server.patch('/api/v1/users/:id', (req, res) => {
  readFile(`${__dirname}/users.json`, { encoding: 'utf-8' }).then((users) => {
    const usersObj = JSON.parse(users)
    const { body } = req
    const { id } = req.params
    const newUsers = usersObj.map((user) => {
      if (+id === user.id) {
        return {
          ...user,
          ...body
        }
      }
      return user
    })
    writeFile(`${__dirname}/users.json`, JSON.stringify(newUsers), { encoding: 'utf-8' }).then(
      () => {
        res.send(JSON.stringify({ status: 'success', id }))
      }
    )
  })
})

server.delete('/api/v1/users/:id', (req, res) => {
  readFile(`${__dirname}/users.json`, { encoding: 'utf-8' }).then((users) => {
    const usersObj = JSON.parse(users)
    const { id } = req.params
    const newUsers = usersObj.filter((user) => user.id !== +id)
    writeFile(`${__dirname}/users.json`, JSON.stringify(newUsers), { encoding: 'utf-8' }).then(
      () => {
        res.send(JSON.stringify({ status: 'success', id }))
      }
    )
  })
})

server.delete('/api/v1/users', (req, res) => {
  unlink(`${__dirname}/users.json`).then(() => {
    res.send(JSON.stringify({ status: 'success' }))
  })
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
