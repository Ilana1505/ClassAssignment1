const express = require('express');
const ClassAssignment1 = express();
const dotenv = require('dotenv').config();
const PORT = process.env.PORT;

const connectDB = require('./config/db'); 
const postRoutes = require('./routes/posts');

connectDB(); // MongoDB -חיבור ל 

ClassAssignment1.get("/",(req,res) => {
    res.send("test");
});

ClassAssignment1.use(express.json());
ClassAssignment1.use('/posts', postRoutes);

ClassAssignment1.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});
