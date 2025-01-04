import mongoose from 'mongoose';

const CommentSchema = new mongoose.Schema({
  comment: { type: String, required: true },
  postId: { type: String, required: true },
  sender: { type: String, required: true },
});

const CommentModel = mongoose.model('comments', CommentSchema);
export default CommentModel;
