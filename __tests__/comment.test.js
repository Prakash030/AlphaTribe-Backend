import Comments from "../models/Comments.js";
import { createComment, deleteComment } from "../services/comment.service.js"

jest.mock('../models/Comments.js'); // Mock the Comments model

test('createComment should save a comment and emit a WebSocket event', async () => {
    const req = {
        app: {
            get: jest.fn().mockReturnValue({
                emit: jest.fn()
            })
        }
    };

    const mockComment = {
        _id: 'comment123',
        userId: 'user1',
        postId: 'post1',
        comment: 'This is a test comment',
        save: jest.fn().mockResolvedValue({ _id: 'comment123' })
    };

    Comments.mockImplementation(() => mockComment);

    const result = await createComment('user1', 'post1', 'This is a test comment', req);

    expect(Comments).toHaveBeenCalledWith({ userId: 'user1', postId: 'post1', comment: 'This is a test comment' });
    expect(mockComment.save).toHaveBeenCalled();
    expect(result).toEqual(mockComment);
    expect(req.app.get).toHaveBeenCalledWith('socketio');
    expect(req.app.get().emit).toHaveBeenCalledWith('createComment', {
        success: true,
        commentId: 'comment123',
        message: "Comment added successfully"
    });

    
});

test('deleteComment should delete a comment and emit a WebSocket event', async () => {
    const req = {
        app: {
            get: jest.fn().mockReturnValue({
                emit: jest.fn() // Mock the emit function of socketio
            })
        }
    };

    const mockComment = {
        _id: 'comment123',
        userId: 'user1',
        postId: 'post1',
        comment: 'This is a test comment'
    };
    Comments.findByIdAndDelete.mockResolvedValue(mockComment);

    const result = await deleteComment('comment123', req);

    expect(Comments.findByIdAndDelete).toHaveBeenCalledWith('comment123');
    expect(result).toEqual(mockComment);
    expect(req.app.get).toHaveBeenCalledWith('socketio');
    expect(req.app.get().emit).toHaveBeenCalledWith('commentDeleted', {
        success: true,
        message: "Comment deleted successfully"
    })
})
