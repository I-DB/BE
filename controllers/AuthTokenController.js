const jwt = require('jsonwebtoken')
const passport = require('passport')
require('dotenv').config()
const accessToken = process.env.ACCESS_TOKEN

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
            const token = jwt.sign(user.toJSON(), accessToken, { expiresIn: "30m" });
            res.cookie("token", token);
            return res.json({ user, token });
        });
    })(req, res);
};
