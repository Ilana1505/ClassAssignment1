const express = require('express');
const router = express.Router();
const commentsController = require('../controllers/commentscontroller_');

// יצירת תגובה חדשה
router.post('/', commentsController.create.bind(commentsController));

// קבלת כל התגובות
router.get('/', commentsController.getAll.bind(commentsController));

// קבלת תגובה לפי מזהה
router.get('/:id', commentsController.getById.bind(commentsController));

// מחיקת תגובה
router.delete('/:id', commentsController.deleteItem.bind(commentsController));

module.exports = router;
