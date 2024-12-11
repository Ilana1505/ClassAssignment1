const express = require('express');
const dotenv = require('dotenv').config();
const connectDB = require('./config/db'); 
const postRoutes = require('./routes/posts');

const app = express();
const PORT = process.env.PORT || 3000;  // הגדרת פורט לשרת

// התחברות למסד הנתונים
connectDB();  

app.use(express.json());

app.use('/posts', postRoutes);

app.get("/", (req, res) => {
    res.send("Server is up and running");
});

// הפעלת השרת
app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});





