import PostModel from "../models/post_models";
import { Request, Response } from "express";

const CreatePost = async (req: Request, res: Response) => {
  const postBody = req.body;
  try {
    const post = await PostModel.create(postBody);
    res.status(201).send(post);
  } catch (error) {
    res.status(400).send(error);
  }
};

const GetAllPosts = async (req: Request, res: Response) => {
  const filter = req.query.sender;
  try {
    if (filter) {
      const posts = await PostModel.find({ sender: filter });
      res.send(posts);
    } else {
      const posts = await PostModel.find();
      res.send(posts);
    }
  } catch (error) {
    res.status(400).send(error);
  }
};

const GetPostById = async (req: Request, res: Response) => {
  const postId = req.params.id;
  try {
    const post = await PostModel.findById(postId);
    if (post) {
      res.send(post);
    } else {
      res.status(404).send("Post not found");
    }
  } catch (error) {
    res.status(400).send(error);
  }
};

const UpdatePost = async (req: Request, res: Response) => {
  const postId = req.params.id;
  const { title, content } = req.body;
  try {
    if (!title || !content) {
      return res.status(400).send({ message: "Missing required fields" });
    }
    const updatedPost = await PostModel.findByIdAndUpdate(
      postId,
      { title, content },
      { new: true }
    );
    if (!updatedPost) {
      return res.status(404).send({ message: "Post not found" });
    }
    res.status(200).send(updatedPost); 
  } catch (error) {
    res.status(400).send(error);
  }
};

const DeletePost = async (req: Request, res: Response) => {
  const postId = req.params.id;
  try {
    await PostModel.findByIdAndDelete(postId);
    res.status(200).send();
  } catch (error) {
    res.status(404).send(error); // שגיאה במידה והפוסט לא נמצא
  }
};

export default {
  CreatePost,
  GetAllPosts,
  GetPostById,
  UpdatePost,
  DeletePost,
};
