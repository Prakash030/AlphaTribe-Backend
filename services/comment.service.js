import Comments from "../models/Comments.js";

export const createComment = async (userId, postId, comment, req) => {
    try{
        const newComment = new Comments({
            userId,
            postId,
            comment
        });
        await newComment.save();
        const io = req.app.get('socketio');
        io.emit('createComment', { success: true, commentId: newComment?._id, message: "Comment added successfully" });
        return newComment;
    }catch(err){
        throw new Error(err);
    }
}

export const deleteComment = async (commentId, req) => {
    try{
        const comment = await Comments.findByIdAndDelete(commentId);
        if(!comment){
            throw new Error('Comment not found');
        }
        const io = req.app.get('socketio');
        io.emit('commentDeleted', { success: true, message: "Comment deleted successfully" });
        return comment
    }catch(err){
        throw new Error(err);
    }
}