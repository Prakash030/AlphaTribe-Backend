import { createPost, getPosts, getPostById, deletePost, likePost, unlikePost } from "../services/posts.service.js";

export const createPostController = async (req, res, next) => {
    try {
        const user = req.user._id;
        if(!user){
            throw new Error('Please login to create a post');
        }
        const { stockSymbol, title, description, tags } = req.body;
        if(!stockSymbol || !title || !description){
            throw new Error('Please provide all fields');
        }
        const post = await createPost(user, stockSymbol, title, description, tags);
        res.status(201).json({ success: true, postId: post._id, message: 'Post created successfully' });
    } catch (error) {
        next(error);
    }
}

export const getPostsController = async (req, res, next) => {
    try {
        // const userId = req.user._id;
        // if(!userId){
        //     throw new Error('Please login to view posts');
        // }
        let page = parseInt(req.query.page);
        let limit = parseInt(req.query.limit);
        const stockSymbol = req.query.stockSymbol;
        const tags = req.query.tags;
        const sortBy = req.query.sortBy;
        if (!page || !limit) {
            page = 1;
            limit = 10;
        }
        const posts = await getPosts(page, limit, stockSymbol, tags, sortBy);
        res.status(200).json({ posts });
    } catch (error) {
        next(error);
    }
}

export const getPostByIdController = async (req, res, next) => {
    try {
        // const userId = req.user._id;
        // if(!userId){
        //     throw new Error('Please login to view a post');
        // }
        const postId = req.params.postId;
        if(!postId){
            throw new Error('Post id not provided');
        }
        const post = await getPostById(postId);
        if(!post){
            throw new Error('Post not found');
        }
        res.status(200).json({ post });
    } catch (error) {
        next(error);
    }
}

export const deletePostController = async (req, res, next) => {
    try {
        const userId = req.user._id;
        if(!userId){
            throw new Error('Please login to delete a post');
        }
        const postId = req.params.postId;
        if(!postId){
            throw new Error('Post id not provided');
        }
        const deletedPost = await deletePost(postId);
        if(!deletedPost){
            throw new Error('Post not found');
        }
        res.status(200).json({ success: true, message: 'Post deleted successfully' });
    } catch (error) {
        next(error);
    }
}

export const likePostController = async (req, res, next) => {
    try {
        const userId = req.user._id;
        if(!userId){
            throw new Error('Please login to like a post');
        }
        const postId = req.params.postId;
        if(!postId){
            throw new Error('Post id not provided');
        }
        await likePost(postId, userId, req);
        
        res.status(200).json({ success: true, message: 'Post liked' });
    } catch (error) {
        next(error);
    }
}

export const unlikePostController = async (req, res, next) => {
    try {
        const userId = req.user._id;
        if(!userId){
            throw new Error('Please login to unlike a post');
        }
        const postId = req.params.postId;
        if(!postId){
            throw new Error('Post id not provided');
        }
        await unlikePost(postId, userId, req);
        
        res.status(200).json({ success: true, message: 'Post unliked' });
    } catch (error) {
        next(error);
    }
}