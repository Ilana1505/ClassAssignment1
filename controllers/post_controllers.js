const PostModel = require("../models/post_models");

const CreatePost = async (req, res) => {
    const postBody = req.body;
    try {
      const post = await PostModel.create(postBody);
      res.status(201).send(post);
    } catch (error) {
      res.status(400).send({ error: error.message });
    }
};

const GetAllPosts = async (req, res) => {
  try {
      const posts = await PostModel.find();
      res.send(posts);
  } catch (error) {
      res.status(400).send({ error: error.message });
  }
};


const GetPostById = async (req, res) => {
  const postId = req.params.id;
  try {
    const post = await PostModel.findById(postId);
    if (post) {
      res.send(post);
    } else {
      res.status(404).send("Post not found");
    }
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
};

const UpdatePost = async (req, res) => {
    const postId = req.params.id;
    const { title, content } = req.body;
  
    try {
      if (!title || !content) {
        return res.status(400).send({ message: "Missing required fields" });
      }
  
      const updatedPost = await PostModel.findByIdAndUpdate(postId, { title, content }, { new: true });
  
      if (!updatedPost) {
        return res.status(404).send({ message: "Post not found" });
      }
  
      res.send(updatedPost);
    } catch (error) {
      res.status(400).send({ error: error.message });
    }
};
  

const DeletePost = async (req, res) => {
    const postId = req.params.id;
    try {
      const deletePost = await PostModel.findByIdAndDelete(postId);
      if (deletePost) {
        res.send({ message: "Post deleted successfully", data: deletePost });
      } else {
        res.status(404).send("Post not found");
      }
    } catch (error) {
      res.status(400).send({ error: error.message });
    }
};
  
module.exports = {
  CreatePost,
  GetAllPosts,
  GetPostById,
  UpdatePost,
  DeletePost,
};

