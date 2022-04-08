const mongoose = require("mongoose")

const postSchema = new mongoose.Schema({

    title: { type: String, required: true },
    content: { type: String, required: true },
    nickName: { type: String, required: true },
    userId: { type: String, required: true },
    comment: [
		{
			nickName: { type: String, required: true },
			userId: { type: String,	required: true },
			content: { type: String, required: true },
		},
	],

}, {timestamps: true})

const User = mongoose.model("Post", postSchema)
module.exports = User