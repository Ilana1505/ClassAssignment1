const express = require('express');
const router = express.Router();
const CommentController = require('../controllers/comment_controllers');

router.post('/', CommentController.CreateComment);

router.get('/', CommentController.GetAllComments);

router.get('/:id', CommentController.GetCommentById);

router.get('/post/:postId', CommentController.GetCommentsByPostId);

router.put('/:id', CommentController.UpdateComment);

router.delete('/:id', CommentController.DeleteComment);

module.exports = router;
