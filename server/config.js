require('dotenv').config()


const options = {
  port: process.env.PORT,
  app: process.env.APP,
  env: process.env.NODE_ENV,
}

export default options
