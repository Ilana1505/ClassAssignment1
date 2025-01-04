import express,{Request,Response} from 'express';
import postControllers from '../controllers/post_controllers';

const router = express.Router();

router.post('/', postControllers.CreatePost);

router.get('/', postControllers.GetAllPosts);

router.get('/:id', postControllers.GetPostById);

router.put('/:id', (req: Request, res: Response) => {
    postControllers.UpdatePost(req, res);
});

router.delete('/:id', postControllers.DeletePost);

export default router;


      
