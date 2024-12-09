const express = require('express');
const app = express();
const dotenv = require('dotenv').config();
const PORT = process.env.PORT;

const mongoose = require('mongoose');
mongoose.connect(process.env.DB_URI);
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', function() {
     console.log("Connection Successful!");
});

const connectDB = require('./config/db'); 
const postRoutes = require('./routes/posts');

connectDB(); // MongoDB -חיבור ל 

app.get("/",(req,res) => {
    res.send("test");
});

app.use(express.json());
app.use('/posts', postRoutes);

app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});




