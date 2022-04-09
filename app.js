const express = require("express")
const cors = require("cors")
const routes = require("./routes")
const connect = require("./models")
const cookieParser = require('cookie-parser');
require('dotenv').config()

//1. passport 등록 => 전략 정의
const passport = require('passport')
const passportConfig = require('./config/passport')
const app = express()



connect()

//미들웨어
app.use(cors())
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

//passport 사용한다고 express에게 말함
app.use(passport.initialize())
passportConfig();
app.use(cookieParser());
app.use('/', routes)
// app.get("/", (req, res) => {
//     res.redirect('/post')
// })


module.exports = app
