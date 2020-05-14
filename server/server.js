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

// get /api/v1/users - получает всех юзеров из файла users.json, если его нет - получает данные с сервиса https://jsonplaceholder.typicode.com/users и заполняет файл users.json y и возвращает данные
server.get('/api/v1/users', (req, res) => {
  readFile(`${__dirname}/users.json`, { encoding: 'utf8' })
    .then((data) => res.json(JSON.parse(data)))
    .catch(async () => {
      // console.log(err)
      const users = await axios('https://jsonplaceholder.typicode.com/users').then(
        (data) => data.data
      )
      writeFile(`${__dirname}/users.json`, JSON.stringify(users), {
        encoding: 'utf8'
      }) // .then((data) => console.log(data))
      res.json(users)
    })
})

server.post('/api/v1/users/', async (req, res) => {
  // res.json(req.body)
  // console.log(req.params)
  let newUser = req.body
  readFile(`${__dirname}/users.json`, { encoding: 'utf8' })
    .then((data) => {
      const arr = JSON.parse(data)
      const lastId = arr[arr.length - 1].id
      newUser = { id: `${lastId * 1 + 1}` * 1, ...newUser }
      const users = arr.concat(newUser)
      writeFile(`${__dirname}/users.json`, JSON.stringify(users), {
        encoding: 'utf8'
      })
      res.json({ status: 'success', id: `${lastId * 1 + 1}` * 1 })
    })
    .catch(async () => {
      // console.log(err)
      let users = await axios('https://jsonplaceholder.typicode.com/users').then(
        (data) => data.data
      )
      const lastId = users[users.length - 1].id
      newUser = { id: `${lastId * 1 + 1}` * 1, ...newUser }
      users = users.concat(newUser)
      writeFile(`${__dirname}/users.json`, JSON.stringify(users), {
        encoding: 'utf8'
      }) // .then((data) => console.log(data))
      res.json({ status: 'success', id: `${lastId * 1 + 1}` * 1 })
    })
  readFile(`${__dirname}/users.json`, {
    encoding: 'utf8'
  })
})

server.patch('/api/v1/users/:userId', (req, res) => {
  const id = req.params
  let newUser = req.body
  newUser = { id: id.userId * 1, ...newUser }
  readFile(`${__dirname}/users.json`, { encoding: 'utf8' })
    .then((data) => {
      let users = JSON.parse(data)
      let flag = false
      users = users.map((it) => {
        if (it.id === 1 * id.userId) {
          flag = true
          return { ...it, ...newUser }
        }
        return it
      }, [])
      if (!flag) users = [...users, newUser]
      writeFile(`${__dirname}/users.json`, JSON.stringify(users), {
        encoding: 'utf8'
      })
      res.json({ status: 'success', id: 1 * id.userId })
    })
    .catch(() => {
      writeFile(`${__dirname}/users.json`, JSON.stringify(newUser), {
        encoding: 'utf8'
      })
      res.json({ status: 'success', id: 1 * id.userId })
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
    .catch(async () => {
      // console.log(err)
    })
})

server.delete('/api/v1/users/', (req, res) => {
  unlink(`${__dirname}/users.json`)
  res.json({ status: 'succesfully deleted' })
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
