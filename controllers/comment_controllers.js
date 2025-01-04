const CommentModel = require("../models/comment_models");

const CreateComment = async (req, res) => {
    const commentBody = req.body;
    try {
      const comment = await CommentModel.create(commentBody);
      res.status(201).send(comment);
    } catch (error) {
      res.status(400).send({ error: error.message });
    }
};


const GetAllComments = async (req, res) => {
    const filter = req.query.sender;
    try {
      let comments;
      if (filter) {
        comments = await CommentModel.find({ sender: filter });
      } else {
        comments = await CommentModel.find();
      }
      res.send(comments);
    } catch (error) {
      res.status(400).send({ error: error.message });
    }
};


const GetCommentById = async (req, res) => {
  const commentId = req.params.id;
  try {
    const comment = await CommentModel.findById(commentId);
    if (comment) {
      res.send(comment);
    } else {
      res.status(404).send("comment not found");
    }
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
};


const GetCommentsByPostId = async (req, res) => {
  const postId = req.params.postId;
  try {
    const comments = await CommentModel.find({ postId: postId });
    if (comments.length > 0) {
      res.send(comments);
    } else {
      res.status(404).send("No comments found for this post");
    }
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
};


const UpdateComment = async (req, res) => {
    const commentId = req.params.id;
    const { comment } = req.body;
  
    try {
      if (!comment) {
        return res.status(400).send({ message: "Missing required fields" });
      }
  
      const updatedComment = await CommentModel.findByIdAndUpdate(commentId, {comment}, { new: true });
  
      if (!updatedComment) {
        return res.status(404).send({ message: "Comment not found" });
      }
  
      res.send(updatedComment);
    } catch (error) {
      res.status(400).send({ error: error.message });
    }
};


const DeleteComment = async (req, res) => {
    const commentId = req.params.id;
    try {
      const deleteComment = await CommentModel.findByIdAndDelete(commentId);
      if (deleteComment) {
        res.send({ message: "Comment deleted successfully", data: deleteComment });
      } else {
        res.status(404).send("Comment not found");
      }
    } catch (error) {
      res.status(400).send({ error: error.message });
    }
};


module.exports = {
  CreateComment,
  GetAllComments,
  GetCommentById,
  GetCommentsByPostId,
  UpdateComment,
  DeleteComment,
};

