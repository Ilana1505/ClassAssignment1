const express = require('express');
const ClassAssignment1 = express();
const dotenv = require('dotenv').config();
const PORT = process.env.PORT;

ClassAssignment1.get("/",(req,res) => {
    res.send("test");
});

ClassAssignment1.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});
