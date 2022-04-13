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
                const newAccessToken = jwt.sign({ userId: user.userId, nickName: user.nickName }, process.env.ACCESS_TOKEN, { expiresIn: "10m" })

                console.log("newtoken", newAccessToken)
                console.log("access 만료되서 refresh로 새로 access 만들었어요")


                const userInfo = verifyToken(newAccessToken)
                res.status(200).json({ userInfo, newAccessToken })
            }
        } else {
            //access token은 유효
            if (refreshToken === null) {
                //case 3 access token은 유효한데 refresh token은 만료 
                const user = verifyToken(tokenValue)
                console.log("뉴리프레쉬토큰 만들기과정", user)
                const newRefreshToken = jwt.sign({ user }, process.env.REFRESH_TOKEN, { expiresIn: '10s' })
                await RefreshTokenSchema.findOneAndUpdate({ user: user._id },
                    { token: newRefreshToken },
                    { new: true })

                console.log("newRefresh", newRefreshToken)
                console.log("access는 있는데 refresh만료되서 만들었어요")
                next()
            } else {
                //case 4 둘 다 유효한 경우
                console.log("둘다 유효해!")
                next()
            }
        }


    }
}
