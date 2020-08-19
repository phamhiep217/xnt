import config from "../../config";
import mongoose from "mongoose";

exports.warehouse_get_all = (req, res, next) => {
  res.status(200).json({
    message: "lay danh sach kho",
    data: config.wareHouse,
  });
};
