const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/authMiddleware");
const postCtrl = require("../controllers/postController");

// 메인페이지 불러오기
router.get("/", postCtrl.showPost);

// 게시글 작성
router.post("/", authMiddleware, postCtrl.applyPost);

// 게시글 수정
router.patch("/:postId", authMiddleware, postCtrl.updatePost);

// 게시글 삭제
router.delete("/:postId", authMiddleware, postCtrl.deletePost);

// 상세게시글 불러오기
router.get("/:postId", postCtrl.detailPost);

// 좋아요
router.patch("/like", authMiddleware, postCtrl.likePost);

// 좋아요 취소
router.patch("/unlike", authMiddleware, postCtrl.unlikePost);

// 댓글 작성
router.post("/comment/:postId", authMiddleware, postCtrl.applyComment);

// 댓글 수정
router.patch("/comment/:postId", authMiddleware, postCtrl.updateComment);

// 댓글 삭제
router.delete("/comment/:postId", authMiddleware, postCtrl.deleteComment);

module.exports = router;