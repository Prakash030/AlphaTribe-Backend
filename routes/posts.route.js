import { createPostController, getPostsController, getPostByIdController, deletePostController, likePostController, unlikePostController } from "../controllers/posts.controller.js";
import { createCommentController, deleteCommentController } from "../controllers/comment.controller.js";
import express from "express";
import { authMiddleware } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post('/', authMiddleware, createPostController);
router.get('/', getPostsController);
router.get('/:postId', getPostByIdController);
router.delete('/:postId', authMiddleware, deletePostController);
router.post('/:postId/comments', authMiddleware, createCommentController);
router.delete('/:postId/comments/:commentId', authMiddleware, deleteCommentController);
router.post('/:postId/like', authMiddleware, likePostController);
router.delete('/:postId/like', authMiddleware, unlikePostController);

export default router;