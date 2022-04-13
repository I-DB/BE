const { verifyToken } = require("../helpers/jwt")
const { verifyRefreshToken } = require("../helpers/jwt")
const RefreshTokenSchema = require("../models/refreshToken")
const jwt = require("jsonwebtoken")
require('dotenv').config()

module.exports = {
    async checkTokens(req, res, next) {

        const { authorization } = req.headers
        const [tokenType, tokenValue] = authorization.split(' ');

        if (tokenValue === undefined) {
            return res.status(403).json({ message: "토큰이 만료되어 다시 로그인해주세요!" })
        }

        const accessToken = verifyToken(tokenValue)
        const { userId } = accessToken
        const find_token_in_schema = await RefreshTokenSchema.findOne({ userId }).then((token) => token.token)
        const refreshToken = verifyRefreshToken(find_token_in_schema)

        //access token이 만료
        if (accessToken === null) {
            if (refreshToken === null) {
                //case 1access token과 refresh token이 모두 만료
                return res.status(403).json({ message: "토큰이 만료되어 다시 로그인해주세요!" })
            } else {
                //case 2 access token만료, refresh token 유효
                const refreshTokeninDB = await RefreshTokenSchema.findOne({}).then((token) => token.token)
                const user = jwt.verify(refreshTokeninDB, process.env.REFRESH_TOKEN);
                const newAccessToken = jwt.sign({ userId: user.userId, nickName: user.nickName }, process.env.ACCESS_TOKEN, { expiresIn: process.env.VALID_ACCESS_TOKEN_TIME })
                const userInfo = verifyToken(newAccessToken)
                res.status(200).json({ userInfo, newAccessToken })
            }
        } else {
            //access token은 유효
            if (refreshToken === null) {
                //case 3 access token은 유효한데 refresh token은 만료 
                const user = verifyToken(tokenValue)
                const newRefreshToken = jwt.sign({ user }, process.env.REFRESH_TOKEN, { expiresIn: process.env.VALID_REFRESH_TOKEN_TIME })
                await RefreshTokenSchema.findOneAndUpdate({ user: user._id },
                    { token: newRefreshToken },
                    { new: true })

                next()
            } else {
                //case 4 둘 다 유효한 경우
                next()
            }
        }


    }
}
