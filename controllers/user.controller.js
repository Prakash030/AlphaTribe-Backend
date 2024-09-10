import { register, login, updateUser, getUserById } from "../services/user.service.js";
import jwt from 'jsonwebtoken';


export const registerUser = async (req, res, next) => {
    try {
        const username = req.body.userName;
        const email = req.body.email;
        const password = req.body.password;
        if(!username || !email || !password){
            throw new Error('Please provide all fields');
        }
        const user = await register(username, email, password);

        res.status(201).json({ success: true, message: 'User registered successfully', userId: user._id });
    } catch (error) {
        next(error);
    }
}

export const loginUser = async (req, res, next) => {
    try {
        const email = req.body.email;
        const password = req.body.password;
        if(!email || !password){
            throw new Error('Please provide all fields');
        }
        const user = await login(email, password);

        if(!user){
            throw new Error('Invalid credentials');
        }

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });

        res.status(200).json({ token, user: { id: user._id, username: user.username, email: user.email } });
    } catch (error) {
        next(error);
    }
}

export const getUser = async (req, res, next) => {
    try {
        const userId = req.params.userId;
        if(!userId){
            throw new Error('Please provide user id');
        }
        const user = await getUserById(userId);
        if(!user){
            throw new Error('User not found');
        }
        res.status(200).json({ user });
    } catch (error) {
        next(error);
    }
}

export const updateUserController = async (req, res, next) => {
    try {
        const userId = req.user._id;
        const username = req.body.username;
        const bio = req.body.bio;
        const profilePicture = req.body.profilePicture;
        if(!userId){
            throw new Error('Unauthorized user');
        }
        await updateUser(userId, { username, bio, profilePicture });
        res.status(200).json({ success: true, message: 'Profile updated' });
    } catch (error) {
        next(error);
    }
}