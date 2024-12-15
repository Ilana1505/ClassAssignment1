const express = require('express');
const app = express();
const dotenv = require('dotenv').config();
const PORT = process.env.PORT || 3000;
const connectDB = require('./config/db'); 
const mongoose = require("mongoose");
mongoose.connect(process.env.DB_URI);
const db = mongoose.connection;
db.on("error", (error) => console.error(error));
db.once("open", () => console.log("Connected to database"));



const postRoutes = require('./routes/posts');
const commentRoutes = require('./routes/comments'); // הוספ



// חיבור ל-MongoDB
connectDB();  // חיבור ל-MongoDB דרך connectDB

// הגדרת פרסוס של JSON
app.use(express.json());

// הגדרת הנתיבים (routes)
app.use('/posts', postRoutes);  // חיבור לנתיב של פוסטים
app.use('/comments', commentRoutes);  // חיבור לנתיב של תגובות


// Endpoint לבדוק אם השרת עובד
app.get("/", (req, res) => {
    res.send("Server is up and running");
});

// הפעלת השרת
app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});





