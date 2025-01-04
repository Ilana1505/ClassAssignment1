//ILANA-BARKIN-209295120-DANA-ELAZRA-208228528
import express,{Express} from "express";
const app = express();
import dotenv from "dotenv";
dotenv.config();
import mongoose from "mongoose";
import bodyParser from "body-parser";
import postRoute from "./routes/post_routes";
import commentRoute from "./routes/comment_routes" ;

const db = mongoose.connection;
db.on("error", (error) => console.error(error));
db.once("open", () => console.log("Connected to database"));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use("/posts", postRoute);
app.use("/comments", commentRoute);

const initApp = () => {
  return new Promise<Express>(async (resolve, reject) => {
    if (process.env.DB_URI == undefined) {
      reject("DB_CONNECTION is not defined");
    } else {
      await mongoose.connect(process.env.DB_URI);
      resolve(app);
    }
  });
}

export default initApp; 
