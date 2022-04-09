const User = require('../models/user')
const bcrypt = require('bcrypt')
const userValidation = require('../helpers/userValidations')

async function postJoin(req, res) {
    // #swagger.tags = ['user']
    try {
        const { userId, nickName, password, confirmPassword } =
            await userValidation.validateAsync(req.body)
        //비번 확인

        if (password !== confirmPassword) {
            res.status(400).json({
                success: false,
                msg: '비밀번호가 일치하지 않습니다',
            })
            return
        }

        //email, nickname 중복검사
        const existUser = await User.exists({ $or: [{ userId }, { nickName }] })
        if (existUser) {
            res.status(400).json({
                success: false,
                msg: '이메일 또는 닉네임이 이미 존재합니다',
            })
            return
        }
        const hashedPw = bcrypt.hashSync(password, 10)

        await User.create({
            userId,
            nickName,
            password: hashedPw,
        })
        res.status(201).json({ success: true, msg: '회원가입 완료!' })
    } catch (error) {
        res.status(400).json({ success: false, message: error.message })
    }
}

function sendAuth(req, res) {
    // #swagger.tags = ['user']
    res.send({ user: req.user, success: true })
}

module.exports = { postJoin, sendAuth }
