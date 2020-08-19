import express from "express";
import purchaseRouter from "./api/routes/purchase";
import autRouter from "./api/routes/aut";
import paymentRouter from "./api/routes/payment";
import partialshipRouter from "./api/routes/partship";
import productRouter from "./api/routes/products";
import inventoryRouter from './api/routes/inventory';
import supplyRouter from './api/routes/supply';
import bodyParser from "body-parser";
import mongoose from "mongoose";
import config from "./config";
//console loi tren server
import morgan from "morgan";


const app = express();
mongoose.connect(config.mongodbUri, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
  useFindAndModify: false
});
mongoose.Promise = global.Promise;
app.use("/upload", express.static("upload"));
app.use("/public", express.static("public"));
app.use(bodyParser.json());
app.use(morgan("dev"));
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization, Content-Disposition"
  );
  if (req.method === "OPTIONS") {
    res.header(
      "Access-Control-Allow-Methods",
      "PUT, POST, PATCH, DELETE, GET"
    );
    return res.status(200).json({});
  }
  next();
});
app.use("/aut", autRouter);
app.use("/product", productRouter);
app.use("/partialship", partialshipRouter);
app.use("/supply", supplyRouter);
app.use("/payment", paymentRouter);
app.use("/inventory", inventoryRouter);
app.use("/purchase", purchaseRouter);
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
