import express from 'express';
import CommentController from '../controllers/comment_controllers';

const router = express.Router(); 

router.post('/',CommentController.CreateItem.bind(CommentController));

router.get('/', CommentController.GetAll.bind(CommentController));

router.get('/post/:postId', CommentController.GetAll.bind(CommentController));

router.get('/:id', CommentController.GetById.bind(CommentController));

router.put('/:id', CommentController.UpdateItem.bind(CommentController));

router.delete('/:id', CommentController.DeleteItem.bind(CommentController));

export default router;
