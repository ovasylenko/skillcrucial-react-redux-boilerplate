require('dotenv').config()

const options = {
  port: process.env.PORT,
  clientPort: process.env.CLIENT_PORT,
  app: process.env.APP,
  env: process.env.NODE_ENV,
  isSocketsEnabled: process.env.ENABLE_SOCKETS
}

export default options
