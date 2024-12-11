const express = require('express');
const router = express.Router();
const postControllers = require('../controllers/postcontrollers');

// יצירת פוסט חדש
router.post('/', postControllers.createPost);

// קבלת כל הפוסטים
router.get('/', postControllers.getAllPosts);

// קבלת פוסט לפי מזהה
router.get('/:id', postControllers.getPostById);

// עדכון פוסט
router.put('/:id', postControllers.updatePost);

// מחיקת פוסט
router.delete('/:id', postControllers.deletePost);

module.exports = router;


      
