const Post = require("../models/post");

async function showPost(req, res, next) {
	const postArr = await Post.find();
    let result = postArr.sort((a,b) => b.createdAt - a.createdAt)
    res.send({ "success" : true, result });
}

async function applyPost(req, res) {
    const { title, content } = req.body;
    const { userId, nickName } = res.locals.user;
        
    await Post.create({ title, content, userId, nickName });
    
    res.json({ "success" : true });
}

async function updatePost (req, res) {
    const { postId } = req.params;  
    const { title, content } = req.body;

    await Post.updateOne({ _id : postId }, { $set: { title, content } });
    res.json({ "success" : true })

}

async function deletePost (req, res) {
    const { postId } = req.params

    await Post.deleteOne({ _id : postId })
    res.json({ "success" : true })
}

async function detailPost (req, res) {
    const { postId } = req.params;
    const result = await Post.findOne({ _id : postId });
    res.send({ "success" : true, result });
}

async function likePost (req, res) {
    const { postId } = req.params;
    const { userId } = res.locals.user;

    await Post.updateOne({ _id : postId }, { $push: { liked : userId } } )

    res.json({ "success" : true })
}

async function unlikePost (req, res) {
    const { postId } = req.params;
    const { userId } = res.locals.user;

    await Post.updateOne({ _id : postId }, { $pull: { liked : userId } } )

    res.json({ "success": true })
}

async function applyComment(req, res) {
    const { user } = res.locals;
    const { content } = req.body;
    const { postId } = req.params;

    await Post.updateOne({ _id : postId }, { $push: { comment: { nickName: user.nickName, userId: user.userId, content } } })

    res.json({ "success": true })
}

async function updateComment(req, res) {
    const { postId } = req.params;
    const { commentId, content } = req.body;
    
    // await Post.updateOne({ _id : postId, comment: { _id: commentId} }, { $set: { comment: { content } } });
    res.json({ "success": true }) ////미구현
}

async function deleteComment(req, res) {
    const { postId } = req.params;
    const { commentId } = req.body;

    await Post.updateOne({ _id: postId }, { $pull: { comment: { _id: commentId } } });
    res.json({ "success": true })
}

module.exports = { applyPost, showPost, detailPost, updatePost, deletePost, likePost, unlikePost, applyComment, updateComment, deleteComment };
