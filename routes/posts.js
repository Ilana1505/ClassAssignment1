const express = require('express');
const router = express.Router();
const Post = require('../models/Post');

// יצירת פוסט חדש
router.post('/', async (req, res) => {
    try {
        const { title, content, sender } = req.body;
        const newPost = new Post({ title, content, sender });
        const savedPost = await newPost.save(); 
        res.status(201).json(savedPost); // 201- יצירת פוסט חדש
    } catch (err) {
        res.status(500).json({ message: err.message }); // 500- תקלה כללית בשרת
    }
});

// קבלת כל הפוסטים
router.get('/', async (req, res) => {
    try {
        const posts = await Post.find();
        res.json(posts);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// קבלת פוסט לפי מזהה
router.get('/:postId', async (req, res) => {
    try {
        const post = await Post.findById(req.params.postId);
        if (!post) return res.status(404).json({ message: 'Post not found' }); // 404- לא נמצא
        res.json(post);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// קבלת פוסטים לפי המזהה של השולח
router.get('/', async (req, res) => {
    try {
        const { sender } = req.query;
        if (sender) {
            const posts = await Post.find({ sender });
            return res.json(posts);
        }
        res.status(400).json({ message: 'Sender ID is required' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// עדכון פוסט
router.put('/:postId', async (req, res) => {
    try {
        const { title, content } = req.body;
        const updatedPost = await Post.findByIdAndUpdate(
            req.params.postId,
            { title, content },
            { new: true }
        );
        if (!updatedPost) return res.status(404).json({ message: 'Post not found' });
        res.json(updatedPost);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;

      
