const mongoose = require('mongoose');
const Comment = require('../models/Comment');

// יצירת תגובה חדשה
const create = (req, res) => {
  const { comment, owner, postId } = req.body;

  const newComment = new Comment({
    comment,
    owner,
    postId
  });

  newComment.save()
    .then(comment => res.status(201).json(comment))
    .catch(err => res.status(500).json({ message: 'Error creating comment' }));
};

// קבלת כל התגובות
const getAll = (req, res) => {
  Comment.find()
    .then(comments => res.status(200).json(comments))
    .catch(err => res.status(500).json({ message: 'Error fetching comments' }));
};

// קבלת תגובה לפי מזהה
const getById = (req, res) => {
  const id = req.params.id;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: 'Invalid comment ID' });
  }

  Comment.findById(id)
    .then(comment => {
      if (!comment) {
        return res.status(404).json({ message: 'Comment not found' });
      }
      res.json(comment);
    })
    .catch(err => res.status(500).json({ message: 'Error fetching comment' }));
};

// מחיקת תגובה
const deleteItem = (req, res) => {
  const id = req.params.id;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: 'Invalid comment ID' });
  }

  Comment.findByIdAndDelete(id)
    .then(deletedComment => {
      if (!deletedComment) {
        return res.status(404).json({ message: 'Comment not found' });
      }
      res.status(200).json({ message: 'Comment deleted' });
    })
    .catch(err => res.status(500).json({ message: 'Error deleting comment' }));
};

module.exports = {
  create,
  getAll,
  getById,
  deleteItem
};
