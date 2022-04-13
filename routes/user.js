const express = require('express')
const userController = require('../controllers/userController')
const AuthTokenController = require('../controllers/AuthTokenController')
const passport = require('passport')
const router = express.Router()
const { checkTokens } = require("../middlewares/user")

router.post("/join", userController.postJoin)

router.get(
    '/auth',
    checkTokens,
    passport.authenticate("jwt", { session: false }),
    userController.sendAuth
)


router.post(
    '/login',
    passport.authenticate('local', { session: false }),
    AuthTokenController.create
)


// router.post("/token", AuthTokenController.makeToken)







module.exports = router
