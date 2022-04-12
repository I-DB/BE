const jwt = require('jsonwebtoken');
const refreshToken = require('../models/refreshToken');


function verifyToken(token) {
    try {
        console.log("토큰 검사하러 왔어요")
        const result = jwt.verify(token, process.env.ACCESS_TOKEN);
        console.log("#######", result)
        return result
    } catch (e) {
        console.log("$$$", "만료되면 열로 가냐?")
        return null
    }
}



function verifyRefreshToken(refreshToken) {
    try {
        console.log("리프레쉬토큰 검사하러 왔어요")
        const resultr = jwt.verify(refreshToken, process.env.REFRESH_TOKEN);
        return resultr
    } catch (e) {
        if (e.name === 'TokenExpiredError') {
            console.log("####", "만료되면 일루 옴")
            return null
        }
    }
}


module.exports = { verifyToken, verifyRefreshToken }
