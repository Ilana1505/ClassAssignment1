import mongoose from "mongoose";

const PostSchema = new mongoose.Schema({
    title: { type: String, required: true },
    content: { type: String, required: true },
    sender: { type: String, required: true },
});

const PostModel = mongoose.model('posts', PostSchema);
export default PostModel;

