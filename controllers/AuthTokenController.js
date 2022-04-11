const jwt = require('jsonwebtoken')
const passport = require('passport')
const RefreshTokenSchema = require("../models/refreshToken")
require('dotenv').config()


//refreshTokens가 생성되면 이 배열에 넣어준다.
let refreshTokens = [];

//토큰 발급
exports.create = function (req, res) {
    // #swagger.tags = ['user']
    passport.authenticate('local', { session: false }, (err, user) => {

        if (err || !user) {
            return res.status(400).json({
                message: '에러 발생! ',
                user: user
            });
        }
        req.login(user, { session: false }, async (err) => {
            if (err) {
                res.send(err);
            }
            // jwt.sign('token내용', 'JWT secretkey')
            const token = jwt.sign(user.toJSON(), process.env.ACCESS_TOKEN, { expiresIn: "10m" });
            const refreshToken = jwt.sign(user.toJSON(), process.env.REFRESH_TOKEN, { expiresIn: "30m" })
            const find_token_in_schema = await RefreshTokenSchema.findOne({ user: user._id })
            if (!find_token_in_schema) {
                const refreshTokenSchema = new RefreshTokenSchema({
                    token: refreshToken,
                    user: user._id,
                    userId: user.userId
                })
                await refreshTokenSchema.save();
            } else {
                let new_token = await RefreshTokenSchema.findOneAndUpdate({ user: user._id },
                    { token: refreshToken },
                    { new: true })
            }
            // refreshTokens.push(refreshToken)
            res.cookie("token", token);
            const { userId, nickName } = user
            return res.json({ succcss: true, userId, nickName, token, refreshToken });
        });
    })(req, res);
};



exports.makeToken = async function (req, res) {
    const refreshToken = req.header("x-auth-token");

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
        const user = await jwt.verify(refreshToken, process.env.REFRESH_TOKEN);

        const { userId } = user
        const accessToken = await jwt.sign(
            { userId }, process.env.ACCESS_TOKEN, { expiresIn: "30s" }
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

