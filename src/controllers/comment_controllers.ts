import CommentModel,{iComment} from "../models/comment_models";
import { Request, Response } from "express";
import BaseController  from "./base_controllers";

class CommentController extends BaseController<iComment> {
    constructor() {
        super(CommentModel);
    }

      async CreateItem(req: Request, res: Response) {
            const _id = req.query.userId;
            const comment = {
                ...req.body,
                sender: _id
            }
            req.body = comment;
            return super.CreateItem(req, res);
        }

}

export default new CommentController();
