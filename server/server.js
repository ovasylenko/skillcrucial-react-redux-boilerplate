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
// const { readFile, writeFile, stat, unlink, appendFile } = require("fs").promises
const { readFile, writeFile, unlink } = require('fs').promises

let connections = []

const port = process.env.PORT || 8090
const server = express()

const setHeaders = (req, res, next) => {
  res.set('x-skillcrucial-user', '065d57cc-b8b2-4f45-95c6-e2fbdecce304')
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

// server.get('/api/v1/users', async (req, res) => {
//   const url = 'https://jsonplaceholder.typicode.com/users'
//   const text = await axios(url).then((users) => JSON.stringify(users.data))
//   writeFile(`${__dirname}/users.json`, text, { encoding: 'utf8' })
//   res.json(JSON.parse(text))
// })

// server.get('/api/v1/users', async (req, res) => {
//   const url = 'https://jsonplaceholder.typicode.com/users'
//   const data = await readFile(`${__dirname}/users.json`)
//     .then((file) => {
//       return JSON.parse(file)
//     })
//     .catch(async () => {     
//       const text = await axios(url).then((users) => JSON.stringify(users.data))
//       writeFile(`${__dirname}/users.json`, text, { encoding: 'utf8' })
//       return JSON.parse(text)
//     })
//   res.json(data)
// })

const siteUrl = 'https://jsonplaceholder.typicode.com/users'

const writeToFile = (text) => {
  writeFile(`${__dirname}/users.json`, JSON.stringify(text), { encoding: 'utf8' })
}

const readFromFile = (siteAddress) => {
  const url = siteAddress
  return readFile(`${__dirname}/users.json`)
    .then((file) => {
      return JSON.parse(file)
    })
    .catch(async () => {     
      const text = await axios(url).then(users => users.data)
      text.sort((a,b) => a.id - b.id)
      writeToFile(text)
      return text
    })
}

server.get('/api/v1/users', async (req, res) => {
  const text = await readFromFile(siteUrl)
  res.json(text)
})

server.post('/api/v1/users', async (req, res) => {
  const text = await readFromFile(siteUrl)
  const newUser = req.body
  newUser.id = (text.length === 0) ? 1 : text[text.length - 1].id + 1
  writeToFile([...text, newUser])
  res.json({status: 'success', id: newUser.id})
})

server.patch('/api/v1/users/:userId', async (req, res) => {
  const { userId } = req.params
  const update = req.body
  const text = await readFromFile(siteUrl)
  const userToMod = text.find((it) => it.id === +userId)
  const userMoodified = { ...userToMod, ...update }
  const newText = text.reduce((acc, rec) => {
    return (rec.id === userMoodified.id) ? [ ...acc, userMoodified ] : [ ...acc, rec ]
  }, [])
  writeToFile(newText)
  res.json({status: 'success', id: userToMod.id})
})

server.delete('/api/v1/users/:userId', async (req, res) => {
  const { userId } = req.params
  const text = await readFromFile(siteUrl)
  const userToDel = text.find((it) => it.id === +userId)
  const newText = text.reduce((acc, rec) => {
    if (rec.id !== userToDel.id) { 
      return [ ...acc, rec ]
    }
    return acc
  }, [])
  writeToFile(newText)
  res.json({status: 'success', id: userToDel.id})
})

server.delete('/api/v1/users', (req, res) => {
  unlink(`${__dirname}/users.json`)
  res.json({ status: 'ok' })
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
