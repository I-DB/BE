const express = require('express')
const routes = require('./routes')
const connect = require('./models')
const cors = require('cors')
const app = express()

// env 불러오기
require('dotenv').config()

//MongoDB Connection
connect()

//MiddleWare
app.use(express.static('views'))
app.use(express.json())
app.use(express.urlencoded())
app.use((req, res, next) => {
	//x-Powerd-By 제거
	res.removeHeader('X-Powered-By')
	next()
})
app.use(cors())
app.use('/api', routes)

module.exports = app
