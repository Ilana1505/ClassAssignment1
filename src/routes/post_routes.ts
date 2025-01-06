import express from 'express';
import PostController from '../controllers/post_controllers';
import {authMiddleware} from '../controllers/auth_controllers';

const router = express.Router();

router.post('/',authMiddleware, PostController.CreateItem.bind(PostController));

router.get('/', PostController.GetAll.bind(PostController));

router.get('/:id', PostController.GetById.bind(PostController));

router.put('/:id', PostController.UpdateItem.bind(PostController));

router.delete('/:id',authMiddleware, PostController.DeleteItem.bind(PostController));

export default router;


      
