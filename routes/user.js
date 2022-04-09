const express = require('express')

const userController = require("../controllers/userController")
const AuthTokenController = require('../controllers/AuthTokenController');
const passport = require('passport')
const router = express.Router()

router.post("/join", userController.postJoin)


router.get("/auth", passport.authenticate('jwt', { session: false }))

router.post("/login", AuthTokenController.create)






module.exports = router











