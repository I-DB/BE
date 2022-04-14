const Post = require('../models/post')

async function showPost(req, res, next) {
	// #swagger.tags = ['post']
	const postArr = await Post.find()
	let result = postArr.sort((a, b) => b.createdAt - a.createdAt)
	res.send({ success: true, result })
}

async function applyPost(req, res) {
	// #swagger.tags = ['post']
	const { title, content } = req.body
	const { userId, nickName } = req.user

	await Post.create({ title, content, userId, nickName })

	res.json({ success: true })
}

async function updatePost(req, res) {
	// #swagger.tags = ['post']
	const { postId } = req.params
	const { title, content } = req.body

	await Post.updateOne({ _id: postId }, { $set: { title, content } })
	res.json({ success: true })
}

async function deletePost(req, res) {
	// #swagger.tags = ['post']
	const { postId } = req.params

	await Post.deleteOne({ _id: postId })
	res.json({ success: true })
}

async function detailPost(req, res) {
	// #swagger.tags = ['post']
	const { postId } = req.params
	const result = await Post.findOne({ _id: postId })
	res.send({ success: true, result })
}

async function likePost(req, res) {
	// #swagger.tags = ['post']
	const { postId } = req.params
	const { userId } = req.user

	await Post.updateOne({ _id: postId }, { $push: { liked: userId } })

	res.json({ success: true })
}

async function unlikePost(req, res) {
	// #swagger.tags = ['post']
	const { postId } = req.params
	const { userId } = req.user

	await Post.updateOne({ _id: postId }, { $pull: { liked: userId } })

	res.json({ success: true })
}

async function applyComment(req, res) {
	// #swagger.tags = ['comment']
	const { user } = req
	const { content } = req.body
	const { postId } = req.params

	await Post.updateOne(
		{ _id: postId },
		{
			$push: {
				comment: { nickName: user.nickName, userId: user.userId, content },
			},
		}
	)

	const currentPost = await Post.findOne({ _id: postId })
	const currentComment = currentPost.comment

	let result = currentComment[currentComment.length-1].id

	res.json({ success: true, result })
}

async function updateComment(req, res) {
	// #swagger.tags = ['comment']
	const { postId } = req.params
	const { commentId, content } = req.body

	await Post.updateOne(
		{
			_id: postId,
			comment: {
				$elemMatch: {
					_id: commentId,
				},
			},
		},
		{
			$set: { 'comment.$.content': content },
		}
	)

	res.json({ success: true })
}

async function deleteComment(req, res) {
	// #swagger.tags = ['comment']
	const { postId } = req.params
	const { commentId } = req.body

	await Post.updateOne(
		{ _id: postId },
		{ $pull: { comment: { _id: commentId } } }
	)
	res.json({ success: true })
}

async function searchPost(req, res) {
	// #swagger.tags = ['post']
	const { keyword } = req.body
	const result = await Post.find({ $or: [{ title: { $regex: keyword } }, { content: { $regex: keyword } }] })

	res.send({ success: true, result })
}

module.exports = {
	applyPost,
	showPost,
	detailPost,
	updatePost,
	deletePost,
	likePost,
	unlikePost,
	applyComment,
	updateComment,
	deleteComment,
	searchPost
}
