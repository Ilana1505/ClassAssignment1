import CommentModel,{iComment} from "../models/comment_models";
import BaseController  from "./base_controllers";

class CommentController extends BaseController<iComment> {
    constructor() {
        super(CommentModel);
    }
}

export default new CommentController();
