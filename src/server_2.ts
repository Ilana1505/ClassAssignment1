//ILANA-BARKIN-209295120-DANA-ELAZRA-208228528
import express,{Express} from "express";
const app = express();
import dotenv from "dotenv";
dotenv.config();
import mongoose from "mongoose";
import bodyParser from "body-parser";
import PostRoute from "./routes/post_routes";
import CommentRoute from "./routes/comment_routes" ;
import AuthRoute from "./routes/auth_routes";
import swaggerJsDoc from "swagger-jsdoc";
import swaggerUI from "swagger-ui-express";



app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "*");
  res.header("Access-Control-Allow-Headers", "*");
  next();
});
app.use("/posts", PostRoute);
app.use("/comments", CommentRoute);
app.use("/auth", AuthRoute);

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Web Dev 2025 REST API",
      version: "1.0.0",
      description: "REST server including authentication using JWT",
    },
    servers: [{ url: "http://localhost:" + process.env.PORT, },],
  },
  apis: ["./src/routes/*.ts"],
};

const specs = swaggerJsDoc(options);
app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(specs));

const initApp = (): Promise<Express> => {
  return new Promise<Express>((resolve, reject) => {
    const db = mongoose.connection;
    db.on("error", console.error.bind(console, "connection error:"));
    db.once("open", function () { console.log("Connected to the database") });

    if (!process.env.DB_URI) {
      reject("DB_URI is not defined");
    } else {
        mongoose.connect(process.env.DB_URI).then(() => {
        resolve(app);
      })
       .catch((error) => {
        reject(error);
      });
    }
  });
};

export default initApp;