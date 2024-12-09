const express = require('express');
const router = express.Router();

const postControllers = require('../controllers/post_controllers');

router.get('/', postControllers.getAllPosts);
router.get('/:id', postControllers.getPostById);
router.post('/', postControllers.createPost);
router.delete('/:id', postControllers.deletePost);  


module.exports = router;

      
