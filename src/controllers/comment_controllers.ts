import CommentModel,{iComment} from "../models/comment_models";
import CreateController from "./base_controllers";

const CommentController = CreateController<iComment>(CommentModel);

export default CommentController;
