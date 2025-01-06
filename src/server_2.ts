//ILANA-BARKIN-209295120-DANA-ELAZRA-208228528
import express,{Express} from "express";
const app = express();
import dotenv from "dotenv";
dotenv.config();
import mongoose from "mongoose";
import bodyParser from "body-parser";
import PostRoute from "./routes/post_routes";
import CommentRoute from "./routes/comment_routes" ;

const initApp = async () => {
  return new Promise<Express>((resolve, reject) => {
    const db = mongoose.connection;
    db.on("error", (error) => {
      console.error(error);
    });
    db.once("open", () => {
      console.log("Connected to MongoDB");
    });

    if (process.env.DB_URI === undefined) {
      console.error("DB_URI is not defined");
      reject();
    } else {
        mongoose.connect(process.env.DB_URI).then(() => {
      
        app.use(bodyParser.json());
        app.use(bodyParser.urlencoded({ extended: true }));

        app.use("/posts", PostRoute);
        app.use("/comments", CommentRoute);
        
        resolve(app);
      });
    }
  });
};

export default initApp;