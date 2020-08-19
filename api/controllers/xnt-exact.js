import config from "../../config";
import InventorySchama from "../models/inventory";
import mongoose from "mongoose";
const moment = require("moment");
const sql = require("mssql/msnodesqlv8");

exports.get_stockmovementsimple = (req, res, next) => {
  var firstDay = moment(new Date(2020, 11, 1), "YYYY-MM-DD");
  var lastDay = moment(new Date(2020, 11 + 1, 0), "YYYY-MM-DD");
  req = {
    month: 2,
    year: 2020,
    company: 100,
    toDate: firstDay.format("YYYY-MM-DD"),
    fromDate: lastDay.format("YYYY-MM-DD"),
  };
  const pool = new sql.ConnectionPool(config.sqlserver);
  pool
    .connect()
    .then(() => {
      //Kết nối tới data exact 100 để lấy tồn kho bên dykhang
      pool
        .request()
        .query(
          "select * from EXACT_StockMovementSimple_Function(N'" +
            req.toDate +
            "', N'" +
            req.fromDate +
            "', N'0', N'ZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZ', N'4100', N'9999') order by ItemCode, Warehouse",
          (err, result) => {
            pool.close();
            if (result && result.recordset) {
              getInsertData(result, req).then((data) => {
                res.status(200).json({
                  message: "Handling get stockmovementsimple from SQL Exact",
                  data: data,
                });
              });
            } else {
              res.status(401).json({
                message: "Dont have data when query",
              });
            }
          }
        );
    })
    .catch((err) => {
      res.status(500).json({
        error: err,
      });
    });
};

exports.get_stockmovementsimple200 = (req, res, next) => {
  var firstDay = moment(new Date(2020, 11, 1), "YYYY-MM-DD");
  var lastDay = moment(new Date(2020, 11 + 1, 0), "YYYY-MM-DD");
  req = {
    month: 2,
    year: 2020,
    company: 200,
    toDate: firstDay.format("YYYY-MM-DD"),
    fromDate: lastDay.format("YYYY-MM-DD"),
  };
  const pool = new sql.ConnectionPool(config.sqlserver200);
  pool
    .connect()
    .then(() => {
      //Kết nối tới data exact 200 để lấy tồn kho bên khang việt.
      pool
        .request()
        .query(
          "select * from EXACT_StockMovementSimple_Function(N'2020-02-01', N'2020-02-01', N'0', N'ZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZ', N'4100', N'9999') order by ItemCode, Warehouse",
          (err, result) => {
            pool.close();
            if (result && result.recordset) {
              getInsertData(result, req).then((data) => {
                res.status(200).json({
                  message: "Handling get stockmovementsimple from SQL Exact",
                  data: data,
                });
              });
            } else {
              res.status(401).json({
                message: "Dont have data when query",
              });
            }
          }
        );
    })
    .catch((err) => {
      res.status(500).json({
        error: err,
      });
    });
};

async function getInsertData(result, inData) {
  var arrayInventories = [];
  //Cập nhật ton kho tháng insert hiện tại về delete.
  await InventorySchama.updateMany(
    { invMonth: inData.month, invYear: inData.year },
    { $set: { Status: "delete" } }
  )
    .exec()
    .catch((err) => {
      console.log(err);
      console.log("Khong xoa duoc data");
    });
  //Duyệt tồn kho lấy từ Exact để insert vào data mongo thang hiện tại.
  for (const item of result.recordset) {
    const objInv = new InventorySchama({
      _id: new mongoose.Types.ObjectId(),
      invProductNo: item.ItemCode,
      invProductName: item.ItemName,
      invUnit: item.SalesUnit,
      invOpenningStock: item.OpeningQty,
      invIn: item.InQty,
      invOut: item.OutQty,
      invClosingStock: item.EndingQty,
      invMonth: inData.month,
      invYear: inData.year,
      invCompany: inData.company,
      invWarehouse: item.Warehouse,
      status: "active",
    });
    await objInv
      .save()
      .then((rs) => {
        arrayInventories.push(rs);
      })
      .catch((err) => {
        console.log(err);
      });
  }

  return arrayInventories;
}
