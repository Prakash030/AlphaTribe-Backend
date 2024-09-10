import { Schema, model } from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';

const postSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  stockSymbol: { type: String, required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  tags: [String],
  likes: [{ type: Schema.Types.ObjectId, ref: 'User' }],
}, { timestamps: true });

postSchema.plugin(mongoosePaginate);

export default model('Posts', postSchema);
