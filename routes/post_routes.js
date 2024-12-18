const express = require('express');
const router = express.Router();
const postControllers = require('../controllers/post_controllers');

router.post('/', postControllers.CreatePost);

router.get('/', postControllers.GetAllPosts);

router.get('/:id', postControllers.GetPostById);

router.put('/:id', postControllers.UpdatePost);

router.delete('/:id', postControllers.DeletePost);

module.exports = router;


      
