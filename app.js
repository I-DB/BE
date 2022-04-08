const express = require("express")
const cors = require("cors")
const routes = require("./routes")
const connect = require("./models")
//1. passport 등록 => 전략 정의
const passport = require('passport');
const passportConfig = require('./config/passport');
const app = express()



// connect()

//미들웨어
app.use(cors())
app.use(express.urlencoded({ extended: true }));

//passport 사용한다고 express에게 말함
app.use(passport.initialize())
//session을 사용하여 passport 동작시킨다고 express에게 알림
app.use(passport.session())
passportConfig();




app.get("/", (req, res) => {
    res.redirect('/post')
})

module.exports = app;