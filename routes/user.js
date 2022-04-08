const express = require('express')

const userController = require("../controllers/userController")
const AuthTokenController = require('../controllers/AuthTokenController');
const passport = require('passport')

const router = express.Router()

router.post("/join", async (req, res) => {
    console.log("DDDDD", req.body)
})

router.get("/auth", passport.authenticate('jwt', { session: false }), AuthTokenController.create)

router.post("/login", passport.authenticate('local', { session: false }), AuthTokenController.create)






module.exports = router











