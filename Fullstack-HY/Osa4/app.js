const config = require('./utils/config')
const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const cors = require('cors')
const blogsRouter = require('./controllers/blogs')
const middleware = require('./utils/middleware')
const mongoose = require('mongoose')
const logger = require('./utils/logger')
const usersRouter = require('./controllers/users')
logger.info('connecting to', config.MONGODB_URI)
const loginRouter = require('./controllers/login')
const tEx = require('./utils/getTokenFrom')




mongoose.connect(config.MONGODB_URI, { useNewUrlParser: true })
  .then(() => {
    logger.info('connected to MongoDB')
  })
  .catch((error) => {
    logger.error('error connection to MongoDB:', error.message)
  })

  
app.use(tEx.ExtractToken)

app.use(bodyParser.json())
app.use(express.static('build'))
app.use(cors())
app.use('/login', loginRouter)
app.use('/users', usersRouter)
app.use('/', blogsRouter)









app.use(middleware.requestLogger)
app.use(middleware.unknownEndpoint)

app.use(middleware.errorHandler)
  
  





module.exports = app