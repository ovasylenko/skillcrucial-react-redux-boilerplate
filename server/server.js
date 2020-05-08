/* eslint-disable import/no-duplicates */
import express from 'express'
import path from 'path'
import axios from 'axios'
import cors from 'cors'
import bodyParser from 'body-parser'
import sockjs from 'sockjs'

import cookieParser from 'cookie-parser'
import Html from '../client/html'

const { readFile, writeFile, unlink } = require('fs').promises

let connections = []

const port = process.env.PORT || 3000
const server = express()

server.use(cors())

server.use(express.static(path.resolve(__dirname, '../dist/assets')))
server.use(bodyParser.urlencoded({ limit: '50mb', extended: true, parameterLimit: 50000 }))
server.use(bodyParser.json({ limit: '50mb', extended: true }))

server.use((req, res, next) => {
  res.set('x-skillcrucial-user', '38128149-efce-4a54-8111-21e4a765e6ef')
  res.set('Access-Control-Expose-Headers', 'X-SKILLCRUCIAL-USER')
  next()
})

server.use(cookieParser())

server.get('/api/v1/users', (req, res) => {
  readFile(`${__dirname}/users.json`, { encoding: 'utf8' })
    .then((data) => res.json(JSON.parse(data)))
    .catch(async (err) => {
      console.log(err)
      const users = await axios('https://jsonplaceholder.typicode.com/users')
      .then((data) => data.data)
      writeFile(`${__dirname}/users.json`, JSON.stringify(users), {
        encoding: 'utf8'
      }) // .then((data) => console.log(data))
      res.json(users)
    })
})

server.post('/api/v1/users/', async (req, res) => {
  readFile(`${__dirname}/users.json`, {
    encoding: 'utf8'
  })
    .then((data) => {
      const arr = JSON.parse(data)
      const lastId = arr[arr.length - 1].id
      const users = arr.concat({ id: `${lastId + 1}` * 1 })
      writeFile(`${__dirname}/users.json`, JSON.stringify(users), {
        encoding: 'utf8'
      })
      res.json({ status: 'success', id: `${lastId + 1}` * 1 })
    })
    .catch(async (err) => {
      console.log(err)
    })
  // res.json('test')
})

server.patch('/api/v1/users/:userId', (req, res) => {
  const id = req.params
  readFile(`${__dirname}/users.json`, {
    encoding: 'utf8'
  })
    .then((data) => {
      let users = JSON.parse(data)
      let flag = false
      users = users.reduce((acc, rec) => {
        if (rec.id === 1 * id.userId) {
          flag = true
          return [...acc, rec]
        } 
        return [...acc, rec]
      }, [])
      if (!flag) users = [...users, { id: id.userId * 1 }]
      writeFile(`${__dirname}/users.json`, JSON.stringify(users), {
        encoding: 'utf8'
      })
      res.json({ status: 'success', id: 1 * id.userId })
    })
    .catch(async (err) => {
      console.log(err)
    })
})

server.delete('/api/v1/users/:userId', (req, res) => {
  const id = req.params
  readFile(`${__dirname}/users.json`, {
    encoding: 'utf8'
  })
    .then((data) => {
      let users = JSON.parse(data)
      users = users.reduce((acc, rec) => {
        if (rec.id === 1 * id.userId) return acc
        return [...acc, rec]
      }, [])
      writeFile(`${__dirname}/users.json`, JSON.stringify(users), {
        encoding: 'utf8'
      })
      res.json({ status: 'success', id: 1 * id.userId })
    })
    .catch(async (err) => {
      console.log(err)
    })
})

server.delete('/api/v1/users/', (req, res) => {
  unlink(`${__dirname}/users.json`)
  res.json({ status: 'succesfully deleted'})
})

server.use('/api/', (req, res) => {
  res.status(404)
  res.end()
})

const echo = sockjs.createServer()
echo.on('connection', (conn) => {
  connections.push(conn)
  conn.on('data', async () => {})

  conn.on('close', () => {
    connections = connections.filter((c) => c.readyState !== 3)
  })
})

server.get('/', (req, res) => {
  // const body = renderToString(<Root />);
  const title = 'Server side Rendering'
  res.send(
    Html({
      body: '',
      title
    })
  )
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

echo.installHandlers(app, { prefix: '/ws' })

// eslint-disable-next-line no-console
console.log(`Serving at http://localhost:${port}`)
