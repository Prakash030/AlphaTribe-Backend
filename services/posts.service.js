import Posts from "../models/Posts.js";
import Comments from "../models/Comments.js";

export const createPost = async (user, stockSymbol, title, description, tags) => {
    try {
        const newPost = new Posts({
            user,
            stockSymbol,
            title,
            description,
            tags,
          });
          
          const savedPost = await newPost.save(); // Save the post
          return savedPost; 
    } catch (error) {
        throw new Error(error.message);
    }
}

export const getPosts = async (page, limit, stockSymbol, tags, sortBy) => {
    const query = {};
    try {
        if (stockSymbol) {
            query.stockSymbol = stockSymbol;
        }
        if (tags) {
            query.tags = { $in: tags };
        }

        let sortCriteria = {};
        if (sortBy === 'date') {
            sortCriteria = { createdAt: -1 };
        } else if (sortBy === 'likes') {
            sortCriteria = { likes: -1 };
        }

        const result = await Posts.paginate(query, {
            page,
            limit,
            sort: sortCriteria
        });
        const { docs: posts, totalDocs: totalItems, totalPages, page: currentPage, limit: pageSize } = result;

        return {
            success: true,
            posts: posts.map(post => ({
                postId: post._id,
                stockSymbol: post.stockSymbol,
                title: post.title,
                description: post.description,
                likesCount: post.likes.length,
                createdAt: post.createdAt
            })),
            pagination: {
                currentPage,
                pageSize,
                totalItems,
                totalPages
            }
        };
    } catch (error) {
        throw new Error(error.message);
    }
};


export const getPostById = async (postId) => {
    try {
        const post = await Posts.findById(postId);
        if (!post) {
            throw new Error('Post not found');
        }
        const comments = await Comments.find({ postId }).sort({ createdAt: -1 });
        const postDetails = {
            postId: post._id,
            stockSymbol: post.stockSymbol,
            title: post.title,
            description: post.description,
            likesCount: post.likes.length,
            comments: comments.map(comment => ({
                commentId: comment._id,
                userId: comment.userId,
                comment: comment.comment,
                createdAt: comment.createdAt
            }))
        };
        return postDetails;
    } catch (error) {
        throw new Error(error.message);
    }
}

export const deletePost = async (postId) => {
    try{
        const post = await Posts.findByIdAndDelete(postId);
        if(!post){
            throw new Error('Post not found');
        }
        await Comments.deleteMany({postId});

        return post;
    }catch(err){
        throw new Error(err);
    }
}

export const likePost = async (postId, userId, req) => {
    try {
        const post = await Posts.findById(postId)
        console.log(post);
        if (!post) {
            throw new Error('Post not found');
        }
        if (post.likes.includes(userId)) {
            throw new Error('Post already liked');
        } else {
            post.likes.push(userId);
        }
        await post.save();
        const io = req.app.get('socketio');
        io.emit('postLiked', { success: true, message: 'Post liked' });
        return post.likes.length;
    } catch (error) {
        throw new Error(error.message);
    }
}

export const unlikePost = async (postId, userId, req) => {
    try {
        const post = await Posts.findById(postId);
        if (!post) {
            throw new Error('Post not found');
        }
        if (post.likes.includes(userId)) {
            post.likes.pull(userId);
        }
        await post.save();

        const io = req.app.get('socketio');
        io.emit('postUnliked', { success: true, message: 'Post unliked' });

        return post.likes.length;
    } catch (error) {
        throw new Error(error.message);
    }
}