import User from "../models/User.js";

export const register = async (username, email, password) => {
    try {
        const existingUser = await User.findOne({email});
        if(existingUser){
            throw new Error('User already exists');
        }
        const user = new User({
            username,
            email,
            password
        });
        return await user.save();
    } catch (error) {
        throw new Error(error);
    }
}

export const login = async (email, password) => {
    try {
        const user = await User.findOne({
            email
        });
        if (!user) {
            throw new Error('User not found');
        }
        const isMatch = await user.matchPassword(password);
        if (!isMatch) {
            throw new Error('Password is incorrect');
        }
        return user;
    }catch(error){
        throw new Error(error);
    }
}

export const getUserById = async (userId) => {
    try{
        const user = User.findById(userId).select('-password');
        return user;
    }catch{
        throw new Error(error);
    }
}

export const updateUser = async (userId, userData) => {
    try {
        const user = User.findByIdAndUpdate(userId, userData, {new: true});
        return user;
    }
    catch(error){
        throw new Error(error);
    }
}