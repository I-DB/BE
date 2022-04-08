const express = require("express")
const cors = require("cors")
const cookieParser = require("cookie-parser")
const routes = require("./routes")
const connect = require("./models")
const app = express()





app.use(cors())




app.get("/", (req, res) => {
    res.redirect('/post')
})

module.exports = app;