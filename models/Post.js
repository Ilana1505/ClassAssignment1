const mongoose = require('mongoose');

// הגדרת הסכימה לפוסט
const PostSchema = new mongoose.Schema({
    title: { type: String, required: true },
    content: { type: String, required: true },
    sender: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
});

// יצירת מודל לפוסט
const Post = mongoose.model('Post', PostSchema);
module.exports = Post;

