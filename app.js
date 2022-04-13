const express = require('express')
const cors = require('cors')
const routes = require('./routes')
const connect = require('./models')
const cookieParser = require('cookie-parser')
const swaggerUi = require('swagger-ui-express')
const swaggerFile = require('./swagger-output')
const expressBasicAuth = require('express-basic-auth')
const morgan = require('morgan')

require('dotenv').config()

//1. passport 등록 => 전략 정의
const passport = require('passport')
const passportConfig = require('./passport/BearerStrategy')
const flash = require('connect-flash')
const app = express()

connect()

//미들웨어
app.use(
	cors({
		origin: '*',
		credentials: true,
	})
)
app.use(express.urlencoded({ extended: false }))
app.use(express.json())
app.use(express.static('public'))
app.use((req, res, next) => {
	//x-Powerd-By 제거
	res.removeHeader('X-Powered-By')
	next()
})

app.use(
	['/swagger'],
	expressBasicAuth({
		challenge: true,
		users: {
			[process.env.SWAGGER_USER]: process.env.SWAGGER_PASSWORD,
		},
	})
)
app.use(morgan('dev'))
//passport 사용한다고 express에게 말함
app.use(passport.initialize())
passportConfig()
app.use(cookieParser())
app.use(flash())

app.use('/swagger', swaggerUi.serve, swaggerUi.setup(swaggerFile))
app.use('/', routes)
app.use((req, res, next) => {
	res.status(404).send('요청하신 페이지를 찾을 수 없습니다')
})

module.exports = app
