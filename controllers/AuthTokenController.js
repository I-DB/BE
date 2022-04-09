const jwt = require('jsonwebtoken')
const passport = require('passport')
require('dotenv').config()
const accessTokenSecret = process.env.ACCESS_TOKEN
const refreshTokenSecret = process.env.REFRESH_TOKEN

let refreshTokens = [];

//토큰 발급
exports.create = function (req, res) {
    passport.authenticate('local', { session: false }, (err, user) => {
        if (err || !user) {
            return res.status(400).json({
                message: '에러 발생! ',
                user: user
            });
        }
        req.login(user, { session: false }, (err) => {
            if (err) {
                res.send(err);
            }
            // jwt.sign('token내용', 'JWT secretkey')
            const token = jwt.sign(user.toJSON(), accessTokenSecret, { expiresIn: "10m" });
            const refreshToken = jwt.sign(user.toJSON(), refreshTokenSecret, { expiresIn: "30m" })
            refreshTokens.push(refreshToken)
            console.log("@@@@", refreshTokens)
            res.cookie("token", token);
            return res.json({ user, token, refreshToken });
        });
    })(req, res);
};
