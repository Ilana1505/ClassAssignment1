import express from 'express';
import PostController from '../controllers/post_controllers';

const router = express.Router();

router.post('/', PostController.CreateItem.bind(PostController));

router.get('/', PostController.GetAll.bind(PostController));

router.get('/:id', PostController.GetById.bind(PostController));

router.put('/:id', PostController.UpdateItem.bind(PostController));

router.delete('/:id', PostController.DeleteItem.bind(PostController));

export default router;


      
