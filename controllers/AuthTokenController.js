const jwt = require('jsonwebtoken')
const passport = require('passport')
const RefreshTokenSchema = require('../models/refreshToken')

require('dotenv').config()

//refreshTokens가 생성되면 이 배열에 넣어준다.
// let refreshTokens = [];

//토큰 발급
exports.create = function (req, res) {
	// #swagger.tags = ['user']
	passport.authenticate('local', { session: false }, (err, user, info) => {
		if (err || !user) {
			return res.status(401).json({
				message: info.message,
				user: user,
			})
		}
		// process.env.VALID_REFRESH_TOKEN_TIME
		// process.env.VALID_REFRESH_TOKEN_TIME
		req.login(user, { session: false }, async (err) => {
			if (err) {
				res.send(err)
			}
			// jwt.sign('token내용', 'JWT secretkey')
			const token = jwt.sign(user.toJSON(), process.env.ACCESS_TOKEN, {
				expiresIn: "1m"
			})
			const refreshToken = jwt.sign(user.toJSON(), process.env.REFRESH_TOKEN, {
				expiresIn: "2m"
			})
			const find_token_in_schema = await RefreshTokenSchema.findOne({ user: user._id })
			if (!find_token_in_schema) {
				const refreshTokenSchema = new RefreshTokenSchema({
					token: refreshToken,
					user: user._id,
					userId: user.userId,
				})
				await refreshTokenSchema.save()
			} else {
				await RefreshTokenSchema.findOneAndUpdate(
					{ user: user._id },
					{ token: refreshToken },
					{ new: true }
				)
			}
			// { sameSite: 'None', secure: true }
			res.cookie('token', token, { sameSite: 'None', secure: true, httpOnly: true })
			res.cookie('refreshToken', refreshToken, { sameSite: 'None', secure: true, httpOnly: true })

			return res.json({ succcss: true, token, refreshToken })
		})
	})(req, res)
}
