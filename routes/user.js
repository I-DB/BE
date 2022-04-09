const express = require('express')

const userController = require("../controllers/userController")
const AuthTokenController = require('../controllers/AuthTokenController');
const passport = require('passport')
const router = express.Router()

router.post("/join", userController.postJoin)


router.get("/auth", passport.authenticate('jwt', { session: false }), userController.sendAuth);

router.post("/login", passport.authenticate("local", { session: false }), AuthTokenController.create)






module.exports = router











