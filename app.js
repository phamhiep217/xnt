import express from "express";
import contestRouter from "./api/routes/contest";
import autRouter from "./api/routes/aut";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import config from "./config";

const app = express();
mongoose.connect(config.mongodbUri,{
  useNewUrlParser: true
});
app.use(bodyParser.json());

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  if (req.method === 'OPTIONS'){
      Response.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET');
      return res.status(200).json({});
  }
  next();
});
app.use("/api", contestRouter);
app.use("/api", autRouter);
app.use((req, res, next) => {
  const error = new Error("Not found");
  error.status = 404;
  next(error);
});
app.use((error, req, res, next) => {
  res.status(error.status || 500);
  res.json({
    error: {
      message: error.message,
    },
  });
});

module.exports = app;
