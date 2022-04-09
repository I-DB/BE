const User = require("../models/user");
const bcrypt = require("bcrypt");
const userValidation = require("../helpers/userValidations");

async function postJoin(req, res) {
    try {
        const { userId, nickName, password, confirmPassword } = await userValidation.validateAsync(req.body);
        //비번 확인

        if (password !== confirmPassword) {
            res.status(400).json({
                success: false, msg: "비밀번호가 일치하지 않습니다",
            })
            return;
        }

        //email, nickname 중복검사
        const existUser = await User.exists({ $or: [{ userId }, { nickName }] })
        if (existUser) {
            res.status(400).json({
                success: false, msg: "이메일 또는 닉네임이 이미 존재합니다",
            })
            return;
        }
        const hashedPw = bcrypt.hashSync(password, 10);

        await User.create({
            userId,
            nickName,
            password: hashedPw
        })
        res.status(201).json({ success: true, msg: "회원가입 완료!" })
    } catch (error) {
        res.status(400).json({ success: false, message: error.message })
    }

}

function sendAuth(req, res) {
    res.send({ user: req.user, success: true, });
}


module.exports = { postJoin, sendAuth }

// function postLogin() {

//     return async (req, res) => {
//         const { userId, password } = req.body;
//         if (userId === "" || password === "") {
//             res.status(400).json({
//                 success: false, msg: "이메일과 비밀번호를 입력해주세요!"
//             })
//             return;
//         }
//         const existUser = await User.findOne({ userId })
//         if (!existUser) {
//             res.status(400).json({
//                 success: false, msg: "해당하는 아이디가 혹은 비밀번호가 틀렸습니다."
//             })
//             return;
//         }
//         const decodedPassword = existUser.password;
//         if (!bcrypt.compareSync(password, decodedPassword)) {
//             res.status(400).json({
//                 success: false, msg: "이메일 또는 비밀번호가 틀렸습니다.",
//             });
//             return;
//         }
//         //입력한 이메일을 db에서 찾아서 user에 넣어줘

//         const user = await User.findOne({ userId });
//         //토큰 생성
//         const token = jwt.sign({ userId: user.userId, nickName: user.nickName }, key)

//         res.status(201).send({
//             success: true, token, msg: "로그인성공",
//         });
//     }
// }




