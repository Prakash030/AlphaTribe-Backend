// posts.test.js
import { createPost, getPosts, getPostById, deletePost, likePost, unlikePost } from '../services/posts.service.js';
import Posts from '../models/Posts.js';
import Comments from '../models/Comments.js';

jest.mock('../models/Posts.js');
jest.mock('../models/Comments.js');

describe('Post Management Functions', () => {
    beforeEach(() => {
        jest.resetAllMocks();
    });

    test('createPost should create and return a post', async () => {
        const newPost = { _id: '123', user: 'user1', stockSymbol: 'AAPL', title: 'Test Post', description: 'Test Description', tags: ['tech'] };
   
        Posts.prototype.save = jest.fn().mockResolvedValue(newPost);
        
        const result = await createPost('user1', 'AAPL', 'Test Post', 'Test Description', ['tech']);
        
        expect(result).toEqual(newPost);
        
        expect(Posts.prototype.save).toHaveBeenCalled();
      });
      

    test('getPosts should return paginated and sorted posts', async () => {
        const posts = [{ _id: '123', stockSymbol: 'AAPL', title: 'Test Post', description: 'Test Description', likes: [], createdAt: new Date() }];
        const result = {
            docs: posts,
            totalDocs: 1,
            totalPages: 1,
            page: 1,
            limit: 10
        };
        Posts.paginate.mockResolvedValue(result);

        const response = await getPosts(1, 10, 'AAPL', ['tech'], 'date');
        expect(response).toEqual({
            success: true,
            posts: [{
                postId: '123',
                stockSymbol: 'AAPL',
                title: 'Test Post',
                description: 'Test Description',
                likesCount: 0,
                createdAt: posts[0].createdAt
            }],
            pagination: {
                currentPage: 1,
                pageSize: 10,
                totalItems: 1,
                totalPages: 1
            }
        });
        expect(Posts.paginate).toHaveBeenCalledWith({ stockSymbol: 'AAPL', tags: { $in: ['tech'] } }, {
            page: 1,
            limit: 10,
            sort: { createdAt: -1 }
        });
    });

    test('getPostById should return post with comments', async () => {
        const post = { _id: '123', stockSymbol: 'AAPL', title: 'Test Post', description: 'Test Description', likes: [] };
        const comments = [{ _id: '456', userId: 'user1', comment: 'Great post!', createdAt: new Date() }];
        
        Posts.findById.mockResolvedValue(post);
        
        Comments.find.mockReturnValue({
            sort: jest.fn().mockResolvedValue(comments)
        });

        const result = await getPostById('123');
    
        expect(result).toEqual({
            postId: '123',
            stockSymbol: 'AAPL',
            title: 'Test Post',
            description: 'Test Description',
            likesCount: 0,
            comments: [{
                commentId: '456',
                userId: 'user1',
                comment: 'Great post!',
                createdAt: comments[0].createdAt
            }]
        });
        
        expect(Posts.findById).toHaveBeenCalledWith('123');
        expect(Comments.find).toHaveBeenCalledWith({ postId: '123' });
        expect(Comments.find().sort).toHaveBeenCalledWith({ createdAt: -1 });
    });
    
    test('deletePost should delete post and its comments', async () => {
        const post = { _id: '123' };
        Posts.findByIdAndDelete.mockResolvedValue(post);
        Comments.deleteMany.mockResolvedValue({ deletedCount: 1 });

        const result = await deletePost('123');
        expect(result).toEqual(post);
        expect(Posts.findByIdAndDelete).toHaveBeenCalledWith('123');
        expect(Comments.deleteMany).toHaveBeenCalledWith({ postId: '123' });
    });

    test('likePost should add user to post likes and return the new likes count', async () => {
        const post = { _id: '123', likes: ['user2'], save: jest.fn().mockResolvedValue({ likes: ['user2', 'user1'] }) };
        const req = {
            app: {
                get: jest.fn().mockReturnValue({
                    emit: jest.fn()
                })
            }
        };
        Posts.findById.mockResolvedValue(post);
    
        const result = await likePost('123', 'user1', req);
        expect(result).toBe(2);
        expect(Posts.findById).toHaveBeenCalledWith('123');
        expect(post.save).toHaveBeenCalled();
        expect(req.app.get).toHaveBeenCalledWith('socketio');
        expect(req.app.get().emit).toHaveBeenCalledWith('postLiked', { success: true, message: 'Post liked' });
    });
    

    test('likePost should throw error if post is already liked by user', async () => {
        const post = { _id: '123', likes: ['user1'] };
        Posts.findById.mockResolvedValue(post);

        await expect(likePost('123', 'user1')).rejects.toThrow('Post already liked');
    });

    test('unlikePost should remove user from post likes and return the new likes count', async () => {
        const mockLikesArray = {
            includes: jest.fn().mockReturnValue(true),
            pull: jest.fn(),
            length: 0
        };
        const post = { _id: '123', likes: mockLikesArray, save: jest.fn().mockResolvedValue({ likes: [] }) };
        const req = {
            app: {
                get: jest.fn().mockReturnValue({
                    emit: jest.fn()
                })
            }
        };
        
        Posts.findById.mockResolvedValue(post);
    
        const result = await unlikePost('123', 'user1', req);
    
        expect(result).toBe(0);
        expect(Posts.findById).toHaveBeenCalledWith('123');
        expect(mockLikesArray.pull).toHaveBeenCalledWith('user1');
        expect(post.save).toHaveBeenCalled();
        expect(req.app.get).toHaveBeenCalledWith('socketio');
        expect(req.app.get().emit).toHaveBeenCalledWith('postUnliked', { success: true, message: 'Post unliked' });
    });
    
    
    test('createPost should handle errors', async () => {
        Posts.prototype.save.mockRejectedValue(new Error('Database error'));

        await expect(createPost('user1', 'AAPL', 'Test Post', 'Test Description', ['tech'])).rejects.toThrow('Database error');
    });

    test('getPosts should handle errors', async () => {
        Posts.paginate.mockRejectedValue(new Error('Database error'));

        await expect(getPosts(1, 10, 'AAPL', ['tech'], 'date')).rejects.toThrow('Database error');
    });

    test('getPostById should handle errors', async () => {
        Posts.findById.mockRejectedValue(new Error('Database error'));

        await expect(getPostById('123')).rejects.toThrow('Database error');
    });

    test('deletePost should handle errors', async () => {
        Posts.findByIdAndDelete.mockRejectedValue(new Error('Database error'));

        await expect(deletePost('123')).rejects.toThrow('Database error');
    });

    test('likePost should handle errors', async () => {
        Posts.findById.mockRejectedValue(new Error('Database error'));

        await expect(likePost('123', 'user1')).rejects.toThrow('Database error');
    });

    test('unlikePost should handle errors', async () => {
        Posts.findById.mockRejectedValue(new Error('Database error'));

        await expect(unlikePost('123', 'user1')).rejects.toThrow('Database error');
    });
});
