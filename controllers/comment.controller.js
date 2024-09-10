import { createComment, deleteComment } from "../services/comment.service.js";

export const createCommentController = async (req, res, next) => {
    try {
        const userId = req.user._id;
        const postId = req.params.postId;
        const comment = req.body.comment;
        if(!comment || comment.trim() === ''){
            throw new Error('Comment cannot be empty');
        }
        const newComment = await createComment(userId, postId, comment, req);
        res.status(200).json({success: true, commentId: newComment?._id, message: "Comment added successfully"});
    } catch (error) {
        next(error);     
    }
}

export const deleteCommentController = async (req, res, next) => {
    try {
        const commentId = req.params.commentId;
        if(!commentId){
            throw new Error('Comment id not provided');
        }
        const deletedComment = await deleteComment(commentId, req);
        if(!deletedComment){
            throw new Error('Comment not found');
        }
        res.status(200).json({success: true, message: "Comment deleted successfully"});
    } catch (error) {
        next(error);
    }
}