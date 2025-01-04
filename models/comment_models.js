const mongoose = require('mongoose');

const CommentSchema = new mongoose.Schema({
  comment: { type: String, required: true },
  postId: { type: String, required: true },
  sender: { type: String, required: true },
});

const CommentModel = mongoose.model('comments', CommentSchema);
module.exports = CommentModel;
