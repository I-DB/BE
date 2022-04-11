const express = require("express");
const router = express.Router();
const passport = require('passport')
const postCtrl = require("../controllers/postController");

// 메인페이지 불러오기
router.get("/", postCtrl.showPost);

// 게시글 작성
router.post("/", passport.authenticate('jwt', { session: false }), postCtrl.applyPost);

// 게시글 수정
router.patch("/:postId", passport.authenticate('jwt', { session: false }), postCtrl.updatePost);

// 게시글 삭제
router.delete("/:postId", passport.authenticate('jwt', { session: false }), postCtrl.deletePost);

// 상세게시글 불러오기
router.get("/:postId", postCtrl.detailPost);

// 좋아요
router.patch("/like/:postId", passport.authenticate('jwt', { session: false }), postCtrl.likePost);

// 좋아요 취소
router.patch("/unlike/:postId", passport.authenticate('jwt', { session: false }), postCtrl.unlikePost);

// 댓글 작성
router.post("/:postId/comment", passport.authenticate('jwt', { session: false }), postCtrl.applyComment);

// 댓글 수정
router.patch("/:postId/comment", passport.authenticate('jwt', { session: false }), postCtrl.updateComment);

// 댓글 삭제
router.delete("/:postId/comment", passport.authenticate('jwt', { session: false }), postCtrl.deleteComment);

module.exports = router;