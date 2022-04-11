const mongoose = require('mongoose')

const refreshTokenSchema = new mongoose.Schema({
    token: String,
    user: {
        type: userId,
        ref: 'User'
    }
})





module.exports = mongoose.model('RefreshToken', refreshTokenSchema)