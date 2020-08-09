import express from "express";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";
import cors from "cors";
import mongoose from "mongoose";
import morgan from "morgan";

import projectRouter from "./routes/projectRouter";
import taskRouter from "./routes/taskRouter";
import userRouter from "./routes/userRouter";
import authRouter from "./routes/authRouter";
import cardsRouter from "./routes/cardsRouter";

import error from "./middleware/error";

require("dotenv").config();
require("express-async-errors");

const app = express();
// create application/json parser
var jsonParser = bodyParser.json();
// create application/x-www-form-urlencoded parser
var urlencodedParser = bodyParser.urlencoded({ extended: true });
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "OPTIONS, GET, POST, PUT, PATCH, DELETE"
  );
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  next();
});

app.use(
  cors({ origin: process.env.FRONT_URL, credentials: true }),
  cookieParser(),
  jsonParser,
  urlencodedParser,
  morgan("tiny")
);
app.use("/api/projects", projectRouter);
app.use("/api/tasks", taskRouter);
app.use("/api/users", userRouter);
app.use("/api/auth", authRouter);
app.use("/api/cards", cardsRouter);

app.use(error);

const connectDb = async () => {
  return await mongoose.connect(
    process.env.MONGO_URI,
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
      useFindAndModify: false
    },
    () => {
      console.log("DB connected");
    }
  );
};
connectDb()
  .then(async () => {
    const server = app.listen(process.env.PORT || 8080);
    const io = require("socket.io")(server);
    io.on("connection", (socket) => {
      console.log("client connected");
    });
  })
  .catch((err) => {
    console.log(err);
  });
