const express = require('express');
const router = express.Router();
const commentsController = require('../controllers/comment_controllers');

router.post('/', commentsController.CreateComment);

router.get('/', commentsController.GetAllComments);

router.get('/:id', commentsController.GetCommentById);

router.get('/post/:postId', commentsController.GetCommentsByPostId);

router.put('/:id', commentsController.UpdateComment);

router.delete('/:id', commentsController.DeleteComment);

module.exports = router;
