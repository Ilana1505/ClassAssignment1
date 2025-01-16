import PostModel,{iPost} from "../models/post_models";
import { Request, Response } from "express";
import BaseController from "./base_controllers";

class PostController extends BaseController <iPost>{
    constructor() {
        super(PostModel);
    }

    async CreateItem(req: Request, res: Response) {
        const _id = req.query.userId;
        if (!_id) {
         res.status(400).send("userId is required")
         return;
        }
        const post = {
            ...req.body,
            sender: _id
        }
        req.body = post;
        return super.CreateItem(req, res);
    }
}

export default new PostController();
