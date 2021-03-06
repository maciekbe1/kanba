import express from "express";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import morgan from "morgan";

import projectRouter from "./routes/projectRouter";
import taskRouter from "./routes/taskRouter";
import userRouter from "./routes/userRouter";
import authRouter from "./routes/authRouter";
import cardsRouter from "./routes/cardsRouter";
// import cors from "cors";
import error from "./middleware/error";
const path = require("path");

require("dotenv").config();
require("express-async-errors");

const app = express();
// create application/json parser
var jsonParser = bodyParser.json();
// create application/x-www-form-urlencoded parser
var urlencodedParser = bodyParser.urlencoded({ extended: true });
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", true);
  res.setHeader(
    "Access-Control-Allow-Methods",
    "OPTIONS, GET, POST, PUT, PATCH, DELETE"
  );
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

app.use(
  cookieParser(),
  jsonParser,
  urlencodedParser,
  morgan("tiny")
  // cors("*")
);

app.use("/api/projects", projectRouter);
app.use("/api/tasks", taskRouter);
app.use("/api/users", userRouter);
app.use("/api/auth", authRouter);
app.use("/api/cards", cardsRouter);

app.use(error);

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "client/build")));
  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "client/build", "index.html"));
  });
}
const connectDb = async () => {
  return await mongoose.connect(
    process.env.MONGO_URI,
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
      useFindAndModify: false,
    },
    () => {
      console.log("DB connected");
    }
  );
};
connectDb()
  .then(async () => {
    const server = app.listen(process.env.PORT || 4000);
    const io = require("socket.io")(server);
    io.on("connection", (socket) => {
      console.log("client connected");
    });
  })
  .catch((err) => {
    console.log(err);
  });
