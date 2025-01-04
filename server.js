//ILANA-BARKIN-209295120-DANA-ELAZRA-208228528
const express = require('express');
const app = express();
const dotenv = require('dotenv').config();
const port = process.env.PORT || 3000;

const mongoose = require("mongoose");
mongoose.connect(process.env.DB_URI);
const db = mongoose.connection;
db.on("error", (error) => console.error(error));
db.once("open", () => console.log("Connected to database"));

const bodyParser = require("body-parser");
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const PostRoute = require("./routes/post_routes");
app.use("/posts", PostRoute);

const CommentRoute = require("./routes/comment_routes");
app.use("/comments", CommentRoute);

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});