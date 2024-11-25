const express = require('express');
const dotenv = requaire('dotenv').config();
const app = express();
const PORT = process.env.PORT;

app.get("/",(req,res) => {
    res.send("test");
});

app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});
