import express from 'express';
import CommentController from '../controllers/comment_controllers';
import {authMiddleware} from '../controllers/auth_controllers';

const router = express.Router(); 

router.post('/',authMiddleware, CommentController.CreateItem.bind(CommentController));

router.get('/', CommentController.GetAll.bind(CommentController));

router.get('/post/:postId', CommentController.GetAll.bind(CommentController));

router.get('/:id', CommentController.GetById.bind(CommentController));

router.put('/:id', CommentController.UpdateItem.bind(CommentController));

router.delete('/:id',authMiddleware, CommentController.DeleteItem.bind(CommentController));

export default router;
