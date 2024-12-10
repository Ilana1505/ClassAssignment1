const mongoose = require('mongoose');
const Post = require('../models/Post');

// פונקציה לשליפת כל הפוסטים
const getAllPosts = (req, res) => {
    Post.find()
        .then(posts => res.status(200).json(posts))
        .catch(err => res.status(500).json({ message: "Error fetching posts" }));
};

// פונקציה לשליפת פוסט לפי מזהה
const getPostById = (req, res) => {
    const postId = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(postId)) {
        return res.status(400).json({ message: 'Invalid post ID' });
    }

    Post.findById(postId)
        .then(post => {
            if (!post) {
                return res.status(404).json({ message: 'Post not found' });
            }
            res.json(post);
        })
        .catch(err => {
            console.error(err);
            res.status(500).json({ message: 'Error fetching post' });
        });
};

// פונקציה ליצירת פוסט חדש
const createPost = (req, res) => {
    const { title, content, sender } = req.body;

    const newPost = new Post({
        title,
        content,
        sender
    });

    newPost.save()
        .then(post => res.status(201).json(post))
        .catch(err => {
            console.error(err);
            res.status(500).json({ message: 'Error creating post' });
        });
};

// פונקציה למחיקת פוסט
const deletePost = (req, res) => {
    const postId = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(postId)) {
        return res.status(400).json({ message: 'Invalid post ID' });
    }

    Post.findByIdAndDelete(postId)
        .then(deletedPost => {
            if (!deletedPost) {
                return res.status(404).json({ message: 'Post not found' });
            }
            res.json({ message: 'Post deleted' });
        })
        .catch(err => {
            console.error(err);
            res.status(500).json({ message: 'Error deleting post' });
        });
};

module.exports = {
    getAllPosts,
    getPostById,
    createPost,
    deletePost,
};

