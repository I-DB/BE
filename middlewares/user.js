const { verifyToken } = require("../helpers/jwt")
const { verifyRefreshToken } = require("../helpers/jwt")
const RefreshTokenSchema = require("../models/refreshToken")
const jwt = require("jsonwebtoken")

module.exports = {
    async checkTokens(req, res, next) {

        const { authorization } = req.headers
        const [tokenType, tokenValue] = authorization.split(' ');
        if (tokenValue === undefined) {
            return res.status(403).json({ message: "토큰이 만료되어 다시 로그인해주세요!" })
        }

        // const accessToken = verifyToken(req.cookies.token)
        const accessToken = verifyToken(tokenValue)
        const { userId } = req.body
        const find_token_in_schema = await RefreshTokenSchema.findOne({ userId }).then((token) => token.token)
        const refreshToken = verifyRefreshToken(find_token_in_schema)

        //access token이 만료
        if (accessToken === null) {
            if (refreshToken === null) {
                //case 1access token과 refresh token이 모두 만료
                return res.status(403).json({ message: "토큰이 만료되어 다시 로그인해주세요!" })
            } else {
                //case 2 access token만료, refresh token 유효
                const { userId } = req.body;
                const refreshTokeninDB = await RefreshTokenSchema.findOne({ userId }).then((token) => token.token)
                // const { userId } = user
                const user = jwt.verify(refreshTokeninDB, process.env.REFRESH_TOKEN);
                const newAccessToken = jwt.sign({ userId },
                    process.env.ACCESS_TOKEN,
                    { expiresIn: "20s" })

                console.log("newtoken", newAccessToken)
                const v = verifyToken(newAccessToken)
                console.log("새로 발급받은 accesstoken", v)
                console.log("access 만료되서 refresh로 새로 access 만들었어요")
                res.cookie('token', newAccessToken)
                req.cookies.token = newAccessToken
                next()
            }
        } else {
            //access token은 유효
            if (refreshToken === null) {
                //case 3 access token은 유효한데 refresh token은 만료 

                const newRefreshToken = jwt.sign(user.toJSON(), process.env.REFRESH_TOKEN, { expiresIn: '24h' })
                console.log("newRefresh", newRefreshToken)
                const refreshTokenSchema = new RefreshTokenSchema({
                    token: newRefreshToken,
                    user: user._id,
                    userId: user.userId
                })
                await refreshTokenSchema.save();

                console.log("access는 있는데 refresh만료되서 만들었어요")


                res.cookie('refreshToken', newRefreshToken)
                req.cookies.refreshToken = newRefreshToken
                next()
            } else {
                //case 4 둘 다 유효한 경우
                console.log("둘다 유효해!")
                next()
            }
        }


    }
}
