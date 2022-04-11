const jwt = require('jsonwebtoken')
const passport = require('passport')
const RefreshTokenSchema = require("../models/refreshToken")

require('dotenv').config()


//refreshTokens가 생성되면 이 배열에 넣어준다.
// let refreshTokens = [];

//토큰 발급
exports.create = function (req, res) {
    // #swagger.tags = ['user']
    passport.authenticate('local', { session: false }, (err, user, info) => {

        if (err || !user) {
            return res.status(400).json({
                reason: '에러 발생! ',
                user: user
            });
        }

        if (info) {
            return res.status(401).json({ message: info.reason })
        }
        req.login(user, { session: false }, async (err) => {
            if (err) {
                res.send(err);
            }
            // jwt.sign('token내용', 'JWT secretkey')
            const token = jwt.sign(user.toJSON(), process.env.ACCESS_TOKEN, { expiresIn: "10m" });
            const refreshToken = jwt.sign(user.toJSON(), process.env.REFRESH_TOKEN, { expiresIn: "50m" })
            const find_token_in_schema = await RefreshTokenSchema.findOne({ user: user._id })
            if (!find_token_in_schema) {
                const refreshTokenSchema = new RefreshTokenSchema({
                    token: refreshToken,
                    user: user._id,
                    userId: user.userId
                })
                await refreshTokenSchema.save();
            } else {
                await RefreshTokenSchema.findOneAndUpdate({ user: user._id },
                    { token: refreshToken },
                    { new: true })
            }

            res.cookie("token", token, {
                httpOnly: true,
                sameSite: 'none',
                secure: true,
            });


            return res.json({ succcss: true, token, refreshToken });
        });
    })(req, res);
};



exports.makeToken = async function (req, res) {
    const userId = req.body.userId;
    const refreshTokenfrom_header = req.header("x-auth-token");

    const refreshToken = await RefreshTokenSchema.findOne({ userId }).then((token) => token.token)
    if (!refreshTokenfrom_header) {
        res.status(401).json({
            errors: [{
                msg: "토큰을 찾을 수 없습니다."
            }]
        })
    }

    if (refreshTokenfrom_header === refreshToken) {
        try {
            const user = jwt.verify(refreshToken, process.env.REFRESH_TOKEN);

            const { userId } = user
            const accessToken = jwt.sign(
                { userId }, process.env.ACCESS_TOKEN, { expiresIn: "30m" }
            )
            res.json({ accessToken })
        } catch (error) {
            res.status(403).json({
                errors: [
                    { msg: "유효하지 않은 토큰" }
                ]
            })
        }
    } else {
        res.status(401).json({
            errors: [{
                msg: "토큰이 다릅니다."
            }]
        })
    }
}

exports.checkAuthenticated = function (req, res, next) {
    const token = req.cookies;

    const refreshToken = req.header("x-auth-token");
    const result = "";

    try {
        jwt.decode(token);
        const { exp } = jwt.decode(refreshToken)
        if (exp < (new Date().getTime() + 1) / 1000) {
            result = false;
            return result;
        }
    } catch (err) {
        return false;
    }
    if (result) {
        next()
    } else {
        return false
    }
}
