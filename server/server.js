/* eslint-disable import/no-duplicates */
import express from 'express'
import path from 'path'
import axios from 'axios'
import cors from 'cors'
import bodyParser from 'body-parser'
import sockjs from 'sockjs'
import cookieParser from 'cookie-parser'
import Html from '../client/html'

let connections = []

const port = process.env.PORT || 3000
const server = express()
const { readFile, writeFile, unlink } = require('fs').promises

const setHeders = (req, res, next) => {
  res.set('x-skillcrucial-user', 'fb1209b1-fabc-4e52-bd8e-a9bf47ba392a')
  res.set('Access-Control-Expose-Headers', 'X-SKILLCRUCIAL-USER')
  next()
}

const fileWrite = async (users) => {
  return writeFile(`${__dirname}/users.json`, JSON.stringify(users), { encoding: 'utf8' })
}

const fileRead = async () => {
  return readFile(`${__dirname}/users.json`, { encoding: 'utf8' })
    .then((data) => JSON.parse(data))
    .catch(async () => {
      const { data: users } = await axios('https://jsonplaceholder.typicode.com/users')
      await fileWrite(users)
      return users
    })
}

server.use(setHeders)

server.use(cors())

server.use(express.static(path.resolve(__dirname, '../dist/assets')))
server.use(bodyParser.urlencoded({ limit: '50mb', extended: true, parameterLimit: 50000 }))
server.use(bodyParser.json({ limit: '50mb', extended: true }))

server.use(cookieParser())

server.get('', async (req, res) => {
  const users = await fileRead()
  res.json(users)
})

server.post('/api/v1/users/', async (req, res) => {
  const newUser = req.body
  let users = await fileRead()
  const newId = parseInt(users[users.length - 1].id, 10) + 1
  newUser.id = newId
  const arr = [...users, newUser]
  await fileWrite(arr)
  users = await fileRead()
  if (users[users.length - 1].id === newId) {
    res.json({ status: 'success', id: newId })
    res.status(200)
  } else {
    res.status(500)
  }
  res.end()
})

server.patch('/api/v1/users/:userId', async (req, res) => {
  const { userId } = req.params
  const newData = req.body
  const users = await fileRead()
  const newArr = users.map((it) => {
    if (it.id === +userId) {
      return Object.assign(it, newData)
    }
    return it
  })
  await fileWrite(newArr)
  res.json({ status: 'success', id: userId })
})

server.delete('/api/v1/users/:userId', async (req, res) => {
  const { userId } = req.params
  const users = await fileRead()
  const newArr = users.filter((it) => it.id !== +userId)

  if (users.length !== newArr.length) {
    await fileWrite(newArr)
    res.json({ status: 'success', id: userId })
  } else {
    res.status(404)
  }
  res.end()
})

server.delete('/api/v1/users/', async (req, res) => {
  await unlink(`${__dirname}/users.json`)
  res.status(200)
  res.end()
})

// server.get('/api/v1/users/take/:number', async (req, res) => {
//   const { number } = req.params
//   const { data: users } = await axios('https://jsonplaceholder.typicode.com/users')
//   res.json(users.slice(0, +number))
// })

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