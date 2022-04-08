const Post = require("../models/post");
// const Comment = require("../models/comment");

async function showPost(req, res, next) {
	const postArr = await Post.find();
    let post = postArr.sort((a,b) => b.updatedAt - a.updatedAt)
    res.send({ post });
}

async function applyPost(req, res) {
    const { title, content } = req.body;
    const { userId, nickName } = res.local.user;
    
    await Post.create({ title, content, userId, nickName });
    
    res.json({ "success" : true });
}

async function updatePost (req, res) {
    const { postId } = req.params;  
    const { title, contents, date, time } = req.body;

    await Post.updateOne({ postId: Number(postId) }, { $set: { title, contents, date, time } });
    res.json({ result: "success" })

}

async function deletePost (req, res) {
    const { postId } = req.params

    await Post.deleteOne({ postId: postId })
    res.json({ result: "success" })
}

async function detailPost (req, res) {
    const { postId } = req.params;
    const post = await Post.findOne({ postId });
    res.send({ post });
}

async function likePost (req, res) {

}

async function unlikePost (req, res) {

}

module.exports = { applyPost, showPost, detailPost, updatePost, deletePost, likePost, unlikePost };




// async function showComment(req, res) {
//     const { postId } = req.params;

//     const comment = await Comment.find({ postId });
//     res.send({
//         comment
//     });
// }

// async function applyComment(req, res) {
//     try {
//         console.log(res.locals)
//         const { user } = res.locals;
//         const { comment } = req.body;
//         const { postId } = req.params;

//         const commentAmount = await Comment.find();

//         if (commentAmount.length) {
//             const commentSorted = commentAmount.sort((a,b) => b.commentId - a.commentId)
//             const MaxCommentNum = commentSorted[0]['commentId']
//             const commentId = MaxCommentNum + 1
//             await Comment.create({ postId, comment, nickname : user.nickname, commentId });
//         } else {
//             const commentId = 1
//             await Comment.create({ postId, comment, nickname : user.nickname, commentId });
//         }

//         res.send({
//             message: "댓글 등록 완료!",
//         });
//     } catch (err) {
//         res.status(401).send({
//             message: "댓글을 입력해주세요.",
//         });
//     }
// }

// async function updateComment(req, res) {
//     const { comment, commentId } = req.body;

//     await Comment.updateOne({ commentId }, { $set: { comment } })
//     res.send({
//         message: "댓글 수정 완료!",
//     });
// }

// async function deleteComment(req, res) {
//     console.log(req.body)
//     try {
//         const { commentId } = req.body;
//         await Comment.deleteOne({ commentId });
//         res.send({
//             Message: "댓글 삭제 완료!",
//         });
//     } catch (err) {
//         res.send({
//             message: "자신이 작성한 댓글만 삭제할 수 있습니다.",
//         });
//     }
// }

// module.exports = { showComment, applyComment, updateComment, deleteComment };