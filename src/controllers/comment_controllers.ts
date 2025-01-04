import CommentModel from "../models/comment_models";
import { Request, Response } from "express";

const CreateComment = async (req: Request, res: Response) => {
  const commentBody = req.body;
  try {
    const comment = await CommentModel.create(commentBody);
    res.status(201).send(comment);
  } catch (error) {
    res.status(400).send(error);
  }
};

const GetAllComments = async (req: Request, res: Response) => {
  const filter = req.query.sender;
  try {
    if (filter) {
      const comments = await CommentModel.find({ sender: filter });
      res.send(comments);
    } else {
      const comments = await CommentModel.find();
      res.send(comments);
    }
  } catch (error) {
    res.status(400).send(error);
  }
};

const GetCommentById = async (req: Request, res: Response) => {
  const commentId = req.params.id;
  try {
    const comment = await CommentModel.findById(commentId);
    if (comment != null) {
      res.send(comment);
    } else {
      res.status(404).send("Comment not found");
    }
  } catch (error) {
    res.status(400).send(error);
  }
};

const GetCommentsByPostId = async (req: Request, res: Response) => {
  const postId = req.params.postId;
  try {
    const comments = await CommentModel.find({ postId: postId });
    res.status(200).send(comments); 
  } catch (error) {
    res.status(400).send(error);
  }
};

const UpdateComment = async (req: Request, res: Response) => {
  const commentId = req.params.id;
  const { comment } = req.body;
  try {
    if (!comment) {
     return res.status(400).send({ message: "Missing required fields" });
    }
    const updatedComment = await CommentModel.findByIdAndUpdate(
      commentId,
      { comment },
      { new: true }
    );
    if (!updatedComment) {
      return res.status(404).send({ message: "Comment not found" });
    }
    res.send(updatedComment);
  } catch (error) {
    res.status(400).send(error);
  }
};

const DeleteComment = async (req: Request, res: Response) => {
  const commentId = req.params.id;
  try {
    await CommentModel.findByIdAndDelete(commentId);
    res.status(200).send();
  } catch (error) {
    res.status(404).send(error); 
  }
};

export default {
  CreateComment,
  GetAllComments,
  GetCommentById,
  GetCommentsByPostId,
  UpdateComment,
  DeleteComment,
};
