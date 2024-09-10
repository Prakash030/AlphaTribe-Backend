import { Schema, model } from 'mongoose';

const commentSchema = new Schema({
  postId: { type: Schema.Types.ObjectId, ref: 'Post', required: true },
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  comment: { type: String, required: true },
}, { timestamps: true });

export default model('Comments', commentSchema);
