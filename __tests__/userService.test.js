// user.test.js
import { register, login, getUserById, updateUser } from '../services/user.service.js';
import User from '../models/User.js';

jest.mock('../models/User.js');

describe('User Management Functions', () => {
    beforeEach(() => {
        jest.resetAllMocks();
    });

    test('register should create and return a new user', async () => {
        const newUser = { _id: '123', username: 'testuser', email: 'test@example.com', password: 'password' };
        User.prototype.save.mockResolvedValue(newUser);

        const result = await register('testuser', 'test@example.com', 'password');
        expect(result).toEqual(newUser);
        expect(User.prototype.save).toHaveBeenCalled();
        expect(User.prototype.save).toHaveBeenCalledWith();
    });

    test('login should return user if email and password are correct', async () => {
        const user = { _id: '123', email: 'test@example.com', matchPassword: jest.fn().mockResolvedValue(true) };
        User.findOne.mockResolvedValue(user);

        const result = await login('test@example.com', 'password');
        expect(result).toEqual(user);
        expect(User.findOne).toHaveBeenCalledWith({ email: 'test@example.com' });
        expect(user.matchPassword).toHaveBeenCalledWith('password');
    });

    test('login should throw error if user not found', async () => {
        User.findOne.mockResolvedValue(null);

        await expect(login('test@example.com', 'password')).rejects.toThrow('User not found');
    });

    test('login should throw error if password is incorrect', async () => {
        const user = { _id: '123', email: 'test@example.com', matchPassword: jest.fn().mockResolvedValue(false) };
        User.findOne.mockResolvedValue(user);

        await expect(login('test@example.com', 'password')).rejects.toThrow('Password is incorrect');
    });

    test('getUserById should return user without password', async () => {
        const user = { _id: '123', username: 'testuser', email: 'test@example.com' };
        User.findById.mockResolvedValue(user);
        User.findById.mockReturnValue({ select: jest.fn().mockResolvedValue(user) });

        const result = await getUserById('123');
        expect(result).toEqual(user);
        expect(User.findById).toHaveBeenCalledWith('123');
        expect(User.findById().select).toHaveBeenCalledWith('-password');
    });

    test('updateUser should update and return the user', async () => {
        const updatedUser = { _id: '123', username: 'updateduser', email: 'updated@example.com' };
        User.findByIdAndUpdate.mockResolvedValue(updatedUser);

        const result = await updateUser('123', { username: 'updateduser', email: 'updated@example.com' });
        expect(result).toEqual(updatedUser);
        expect(User.findByIdAndUpdate).toHaveBeenCalledWith('123', { username: 'updateduser', email: 'updated@example.com' }, { new: true });
    });

    // Additional test cases

    test('register should handle errors', async () => {
        User.prototype.save.mockRejectedValue(new Error('Database error'));

        await expect(register('testuser', 'test@example.com', 'password')).rejects.toThrow('Database error');
    });

    test('login should handle errors', async () => {
        User.findOne.mockRejectedValue(new Error('Database error'));

        await expect(login('test@example.com', 'password')).rejects.toThrow('Database error');
    });

    test('updateUser should handle errors', async () => {
        User.findByIdAndUpdate.mockRejectedValue(new Error('Database error'));

        await expect(updateUser('123', { username: 'updateduser', email: 'updated@example.com' })).rejects.toThrow('Database error');
    });
});
