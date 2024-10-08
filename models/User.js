import pkg from 'bcryptjs';
const { genSalt, hash, compare } = pkg;
import { Schema, model } from 'mongoose';

const userSchema = new Schema({
  username: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  bio: { type: String, default: '' },
  profilePicture: { type: String, default: '' },
}, { timestamps: true });

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await genSalt(10);
  this.password = await hash(this.password, salt);
  next();
});

userSchema.methods.matchPassword = async function (enteredPassword) {
  return await compare(enteredPassword, this.password);
};

export default model('User', userSchema);
