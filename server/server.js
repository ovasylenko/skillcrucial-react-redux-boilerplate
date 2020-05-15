/* eslint-disable import/no-duplicates */
import express from 'express'
import path from 'path'
import cors from 'cors'
import axios from 'axios'
import bodyParser from 'body-parser'
import sockjs from 'sockjs'
import cookieParser from 'cookie-parser'
import Html from '../client/html'

let connections = []

const { readFile, writeFile, unlink, stat } = require('fs').promises // , stat

const setHeaders = (req, res, next) => {
  res.set('x-skillcrucial-user', '642a63c6-22c9-4488-858c-f460f095d567')
  res.set('Access-Control-Expose-Headers', 'X-SKILLCRUCIAL-USER')
  return next()
}

const fileSave = async (users) => {
  return writeFile(`${__dirname}/test.json`, JSON.stringify(users), { encoding: 'utf8' })
}

const fileRead = async () => {
  return readFile(`${__dirname}/test.json`, { encoding: 'utf8' })
    .then((data) => {
      return JSON.parse(data)
    })
    .catch(async () => {
      const { data: users } = await axios('https://jsonplaceholder.typicode.com/users')
      await fileSave(users)
      return users
    })
}

const fileCheck = async () => {
  return stat(`${__dirname}/test.json`)
    .then(() => {
      return readFile(`${__dirname}/test.json`, { encoding: 'utf8' }).then((data) =>
        JSON.parse(data)
      )
    })
    .catch(() => {
      writeFile(`${__dirname}/test.json`, JSON.stringify([]), { encoding: 'utf8' })
      return readFile(`${__dirname}/test.json`, { encoding: 'utf8' }).then((data) =>
        JSON.parse(data)
      )
    })
}

const port = process.env.PORT || 3000
const server = express()

server.use(cors())

server.use(express.static(path.resolve(__dirname, '../dist/assets')))
server.use(bodyParser.urlencoded({ limit: '50mb', extended: true, parameterLimit: 50000 }))
server.use(bodyParser.json({ limit: '50mb', extended: true }))

server.use(cookieParser())

server.use(setHeaders)

server.get('/api/v1/users', async (req, res) => {
  const users = await fileRead()
  res.json(users)
})

server.delete('/api/v1/users', async (req, res) => {
  await unlink(`${__dirname}/test.json`)
  res.json({ status: 'ok' })
})

server.post('/api/v1/users', async (req, res) => {
  const users = await fileCheck()
  const newUserBody = req.body
  newUserBody.id = users.length + 1
  const newUsersFile = [...users, newUserBody]
  fileSave(newUsersFile)
  res.json({ status: 'success', id: newUserBody.id })
})

server.patch('/api/v1/users/:userId', async (req, res) => {
  const users = await fileRead()
  const { userId } = req.params
  const newUserBody = req.body
  const newUsers = users.map((it) => (it.id === +userId ? Object.assign(it, newUserBody) : it))
  fileSave(newUsers)
  res.json({ status: 'success', id: userId })
})

server.delete('/api/v1/users/:userId', async (req, res) => {
  const users = await fileRead()
  const { userId } = req.params
  users.splice(+userId - 1, 1)
  fileSave(users)
  res.json({ status: 'success', id: userId })
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
