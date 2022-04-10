const jwt = require('jsonwebtoken')
const passport = require('passport')
require('dotenv').config()
const accessTokenSecret = process.env.ACCESS_TOKEN
const refreshTokenSecret = process.env.REFRESH_TOKEN

//refreshTokens가 생성되면 이 배열에 넣어준다.
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
            const token = jwt.sign(user.toJSON(), accessTokenSecret, { expiresIn: "30s" });
            const refreshToken = jwt.sign(user.toJSON(), refreshTokenSecret, { expiresIn: "3m" })
            // cookie.set('jwt', refreshToken)
            refreshTokens.push(refreshToken)
            res.cookie("token", token);
            return res.json({ user, token, refreshToken });
        });
    })(req, res);
};



exports.makeToken = async function (req, res) {
    const refreshToken = req.header("x-auth-token");
    console.log("resfreshToken!!!!", refreshToken)

    if (!refreshToken) {
        res.status(401).json({
            errors: [{
                msg: "토큰을 찾을 수 없습니다."
            }]
        })
    }
    if (!refreshTokens.includes(refreshToken)) {
        res.status(403).json({
            errors: [{
                msg: "refreshToken이 유효하지 않습니다."
            }]
        })
    }

    try {
        const user = await jwt.verify(refreshToken, refreshTokenSecret);

        const { userId } = user
        const accessToken = await jwt.sign(
            { userId }, accessTokenSecret, { expiresIn: "30s" }
        )
        res.json({ accessToken })
    } catch (error) {
        res.status(403).json({
            errors: [
                { msg: "유효하지 않은 토큰" }
            ]
        })
    }
}

