const express = require('express');
const router = express.Router();
const PostControllers = require('../controllers/post_controllers');

router.post('/', PostControllers.CreatePost);

router.get('/', PostControllers.GetAllPosts);

router.get('/:id', PostControllers.GetPostById);

router.put('/:id', PostControllers.UpdatePost);

router.delete('/:id', PostControllers.DeletePost);

module.exports = router;


      
