import CommentModel,{iComment} from "../models/comment_models";
import { Request, Response } from "express";
import CreateController from "./base_controllers";

const CommentController = CreateController<iComment>(CommentModel);

export default CommentController;
