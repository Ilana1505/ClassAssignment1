const express = require('express');
const dotenv = require('dotenv').config();
const connectDB = require('./config/db'); 
const postRoutes = require('./routes/posts');

const app = express();
const PORT = process.env.PORT || 3000;  // אם ה-PORT לא מוגדר בסביבה, נשתמש ב-3000

// חיבור ל-MongoDB
connectDB();  // חיבור ל-MongoDB דרך connectDB

// הגדרת פרסוס של JSON
app.use(express.json());

// הגדרת הנתיבים (routes)
app.use('/posts', postRoutes);

// Endpoint לבדוק אם השרת עובד
app.get("/", (req, res) => {
    res.send("Server is up and running");
});

// הפעלת השרת
app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});





