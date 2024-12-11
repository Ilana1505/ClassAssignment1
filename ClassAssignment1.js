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

const app = express();
const PORT = process.env.PORT || 3000;  // אם ה-PORT לא מוגדר בסביבה, נשתמש ב-3000

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





