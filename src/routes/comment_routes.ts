import express,{Request,Response} from 'express';
import commentsController from '../controllers/comment_controllers';

const router = express.Router(); 

router.post('/', commentsController.CreateComment);

router.get('/', commentsController.GetAllComments);

router.get('/:id', commentsController.GetCommentById);

router.get('/post/:postId', commentsController.GetCommentsByPostId);

router.put('/:id', (req: Request, res: Response) => {
    commentsController.UpdateComment(req, res);
});

router.delete('/:id', commentsController.DeleteComment);

export default router;
