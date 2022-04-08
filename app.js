const express = require("express")













app.get("/", (req, res) => {
    res.redirect('/post')
})

module.exports = app;