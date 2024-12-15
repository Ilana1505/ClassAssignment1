const mongoose = require('mongoose');

// הגדרת הסכימה לתגובה
const CommentSchema = new mongoose.Schema({
  comment: {
    type: String,
    required: true,
  },
  owner: {
    type: String,
    required: true,
  },
  postId: {
    type: String,
    required: true,
  },
});

// יצירת מודל לתגובה
const Comment = mongoose.model('Comment', CommentSchema);
module.exports = Comment;
