import PostModel,{iPost} from "../models/post_models";
import CreateController from "./base_controllers";

const PostController = CreateController<iPost>(PostModel);

export default PostController;