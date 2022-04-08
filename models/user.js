const mongoose = require("mongoose")

const userSchema = new mongoose.Schema({

    userId: { type: String, required: true, unique: true },
    nickName: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    timestamps: true

})

// userSchema.pre('save', async function () {
//     this.password = await bcrypt.hash(this.password, 5)
// })


const User = mongoose.model("User", userSchema)
module.exports = User