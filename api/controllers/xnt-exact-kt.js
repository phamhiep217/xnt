import config from "../../config";
import InventoryKTSchama from "../models/inventorykt";
import mongoose from "mongoose";
const moment = require("moment");
const sql = require("mssql/msnodesqlv8");
var Excel = require("exceljs");

exports.show_stockmovementsimple_kt = (req, res, next) => {
  var fromDate = moment(req.body.invFromDate, "YYYY-MM-DD")
    .startOf("day")
    .format("YYYY-MM-DD");
  var fromEndDate = moment(req.body.invFromDate, "YYYY-MM-DD")
    .add(1, "d")
    .startOf("day")
    .format("YYYY-MM-DD");
  var toDate = moment(req.body.invToDate, "YYYY-MM-DD")
    .startOf("day")
    .format("YYYY-MM-DD");
  var toEndDate = moment(req.body.invToDate, "YYYY-MM-DD")
    .add(1, "d")
    .startOf("day")
    .format("YYYY-MM-DD");
  InventoryKTSchama.find({
    status: "active",
    $and: [
      { invFromDate: { $gte: new Date(fromDate) } },
      { invFromDate: { $lt: new Date(fromEndDate) } },
      { invToDate: { $gte: new Date(toDate) } },
      { invToDate: { $lt: new Date(toEndDate) } },
      { invWarehouse: { $gte: req.body.fromWH } },
      { invWarehouse: { $lte: req.body.toWH } },
    ],
    $or: [
      { invOpenningStock: { $gt: 0 } },
      { invIn: { $gt: 0 } },
      { invOut: { $gt: 0 } },
      { invClosingStock: { $gt: 0 } },
    ],
  })
    .sort({ invProductNo: 1 })
    .exec()
    .then((listPayment) => {
      let groupCompany = listPayment.reduce(function (acc, obj) {
        var key = obj.invCompany;
        if (!acc[key]) {
          acc[key] = [];
        }
        acc[key].push(obj);
        return acc;
      }, {});
      res.status(200).json({
        message: "lay danh sach ton kho theo công ty",
        data: groupCompany,
      });
    })
    .catch((err) => {
      res.status(500).json({
        error: err,
      });
    });
};

exports.get_stockmovementsimple_kt = (req, res, next) => {
  var firstDay = moment(req.body.invFromDate, "YYYY-MM-DD").startOf("day");
  var fromEndDate = moment(req.body.invFromDate, "YYYY-MM-DD")
    .add(1, "d")
    .startOf("day")
    .format("YYYY-MM-DD");
  var lastDay = moment(req.body.invToDate, "YYYY-MM-DD").startOf("day");
  var toEndDate = moment(req.body.invToDate, "YYYY-MM-DD")
    .add(1, "d")
    .startOf("day")
    .format("YYYY-MM-DD");
  req.body = {
    company: 100,
    fromDate: firstDay.format("YYYY-MM-DD"),
    toDate: lastDay.format("YYYY-MM-DD"),
    fromEndDate: fromEndDate,
    toEndDate: toEndDate,
    fromWH: req.body.fromWH,
    toWH: req.body.toWH,
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
            req.body.fromDate +
            "', N'" +
            req.body.toDate +
            "', N'0', N'ZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZ', N'" +
            req.body.fromWH +
            "', N'" +
            req.body.toWH +
            "') order by ItemCode, Warehouse",
          (err, result) => {
            pool.close();
            if (result && result.recordset) {
              getInsertData(result, req.body).then((data) => {
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
      console.log(err);
      res.status(500).json({
        error: err,
      });
    });
};

exports.get_stockmovementsimple200_kt = (req, res, next) => {
  var firstDay = moment(req.body.invFromDate, "YYYY-MM-DD").startOf("day");
  var fromEndDate = moment(req.body.invFromDate, "YYYY-MM-DD")
    .add(1, "d")
    .startOf("day")
    .format("YYYY-MM-DD");
  var lastDay = moment(req.body.invToDate, "YYYY-MM-DD").startOf("day");
  var toEndDate = moment(req.body.invToDate, "YYYY-MM-DD")
    .add(1, "d")
    .startOf("day")
    .format("YYYY-MM-DD");
  req.body = {
    company: 200,
    fromDate: firstDay.format("YYYY-MM-DD"),
    toDate: lastDay.format("YYYY-MM-DD"),
    fromEndDate: fromEndDate,
    toEndDate: toEndDate,
    fromWH: req.body.fromWH,
    toWH: req.body.toWH,
  };
  const pool = new sql.ConnectionPool(config.sqlserver200);
  pool
    .connect()
    .then(() => {
      //Kết nối tới data exact 200 để lấy tồn kho bên khang việt.
      pool
        .request()
        .query(
          "select * from EXACT_StockMovementSimple_Function(N'" +
            req.body.fromDate +
            "', N'" +
            req.body.toDate +
            "', N'0', N'ZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZ', N'" +
            req.body.fromWH +
            "', N'" +
            req.body.toWH +
            "') order by ItemCode, Warehouse",
          (err, result) => {
            pool.close();
            if (result && result.recordset) {
              getInsertData(result, req.body).then((data) => {
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
  await InventoryKTSchama.deleteMany({
    $and: [
      { invFromDate: { $gte: new Date(inData.fromDate) } },
      { invFromDate: { $lt: new Date(inData.fromEndDate) } },
      { invToDate: { $gte: new Date(inData.toDate) } },
      { invToDate: { $lt: new Date(inData.toEndDate) } },
      { invWarehouse: { $gte: inData.fromWH } },
      { invWarehouse: { $lte: inData.toWH } },
      { invCompany: inData.company },
    ],
  })
    .exec()
    .catch((err) => {
      console.log(err);
      console.log("Khong xoa duoc data");
    });
  //Duyệt tồn kho lấy từ Exact để insert vào data mongo thang hiện tại.
  for (const item of result.recordset) {
    let obj = genCode(item.ItemCode);
    const objInv = new InventoryKTSchama({
      _id: new mongoose.Types.ObjectId(),
      invProductNo: item.ItemCode,
      invProductName: item.ItemName,
      invUnit: item.SalesUnit,
      invOpenningStock: item.OpeningQty,
      invIn: item.InQty,
      invOut: item.OutQty,
      invClosingStock: item.EndingQty,
      invOpeningAmt: item.OpeningAmount,
      inAmt: item.InAmount,
      invOutAmt: item.OutAmount,
      invClosingAmt: item.EndingAmount,
      invCompany: inData.company,
      invWarehouse: item.Warehouse,
      invFromDate: inData.fromDate,
      invToDate: inData.toDate,
      proStyle: obj.proStyle ? obj.proStyle : "A",
      proSource: obj.proSource ? obj.proSource : "A",
      proNumber: obj.proNumber ? obj.proNumber : "A",
      proCompany: obj.proCompany ? obj.proCompany : "A",
      proCode1: obj.proCode1 ? obj.proCode1 : "A",
      proCode2: obj.proCode2 ? obj.proCode2 : "A",
      proCode3: obj.proCode3 ? obj.proCode3 : "A",
      proSupply: obj.proSupply ? obj.proSupply : "A",
      status: "active",
    });
    await objInv
      .save()
      .then((rs) => {
        if (rs.invOpenningStock + rs.invIn + rs.invOut + rs.invClosingStock > 0)
          arrayInventories.push(rs);
      })
      .catch((err) => {
        console.log(err);
      });
  }

  return arrayInventories;
}
const genCode = (code) => {
  let objCode = {
    proStyle: "",
    proSource: "",
    proNumber: "",
    proCompany: "",
    proCode1: "",
    proCode2: "",
    proCode3: "",
    proSupply: "",
  };
  if (code) {
    objCode.proStyle = code.substr(0, 2);
    if (objCode.proStyle === "FG") objCode = genCodeFG(objCode, code);
    else if (objCode.proStyle === "SP") objCode = genCodeSP(objCode, code);
    else if (objCode.proStyle === "CC") objCode = genCodeCC(objCode, code);
    else objCode = genCodeMM(objCode, code);
  }
  return objCode;
};

const genCodeFG = (objCode, code) => {
  var strCode = code.replace(/-/g, "");
  objCode.proCompany = strCode.substr(2, 2);
  objCode.proSource = "1";
  if (isNaN(strCode.substr(4, 4))) {
    objCode.proSupply = "0000";
    objCode.proCode1 = strCode.substr(4, 6);
    objCode.proNumber = strCode.substr(10, strCode.length - 10);
  } else {
    objCode.proSupply = strCode.substr(4, 4);
    objCode.proCode1 = strCode.substr(8, 3);
    objCode.proNumber = strCode.substr(11, strCode.length - 11);
  }
  objCode.proCode2 =
    objCode.proStyle + objCode.proCompany + "-" + objCode.proCode1;
  objCode.proCode3 =
    objCode.proStyle +
    objCode.proCompany +
    objCode.proSource +
    "-" +
    objCode.proCode1;
  return objCode;
};
const genCodeSP = (objCode, code) => {
  objCode.proCompany = code.substr(2, 2);
  objCode.proSource = "1";
  objCode.proSupply = "0000";
  var posThree = code.indexOf(
    "-",
    code.indexOf("-", code.indexOf("-") + 1) + 1
  );
  objCode.proCode1 = code.substr(
    code.indexOf("-") + 1,
    posThree - code.indexOf("-") - 1
  );
  objCode.proNumber = code.substr(posThree + 1, code.length - posThree);
  objCode.proCode2 =
    objCode.proStyle + objCode.proCompany + "-" + objCode.proCode1;
  objCode.proCode3 =
    objCode.proStyle +
    objCode.proCompany +
    objCode.proSource +
    "-" +
    objCode.proCode1;
  return objCode;
};
const genCodeCC = (objCode, code) => {
  var strCode = code.replace(/-/g, "");
  objCode.proCompany = strCode.substr(2, 2);
  objCode.proSource = "1";
  objCode.proSupply = "0000";
  objCode.proCode1 = strCode.substr(4, 5);
  objCode.proNumber = strCode.substr(9, strCode.length - 9);
  objCode.proCode2 =
    objCode.proStyle + objCode.proCompany + "-" + objCode.proCode1;
  objCode.proCode3 =
    objCode.proStyle +
    objCode.proCompany +
    objCode.proSource +
    "-" +
    objCode.proCode1;
  return objCode;
};
const genCodeMM = (objCode, code) => {
  objCode.proCompany = code.substr(2, 2);
  objCode.proSource = code.substr(4, 1);
  objCode.proSupply = code.substr(4, 4);
  objCode.proCode1 = code.substr(
    code.indexOf("-") + 1,
    code.indexOf("-", code.indexOf("-") + 1) - code.indexOf("-") - 1
  );
  objCode.proNumber = code.substr(-3, code.indexOf("-", code.indexOf("-") + 1));
  objCode.proCode2 =
    objCode.proStyle + objCode.proCompany + "-" + objCode.proCode1;
  objCode.proCode3 =
    objCode.proStyle +
    objCode.proCompany +
    objCode.proSource +
    "-" +
    objCode.proCode1;
  return objCode;
};

//Báo cáo xuất nhập tồn từ ngày đến ngày
exports.exportBCTK = (req, res, next) => {
  var fromDate = moment(req.body.invFromDate, "YYYY-MM-DD")
    .startOf("day")
    .format("YYYY-MM-DD");
  var fromEndDate = moment(req.body.invFromDate, "YYYY-MM-DD")
    .add(1, "d")
    .startOf("day")
    .format("YYYY-MM-DD");
  var toDate = moment(req.body.invToDate, "YYYY-MM-DD")
    .startOf("day")
    .format("YYYY-MM-DD");
  var toEndDate = moment(req.body.invToDate, "YYYY-MM-DD")
    .add(1, "d")
    .startOf("day")
    .format("YYYY-MM-DD");
  readFileExcel(fromDate, fromEndDate, toDate, toEndDate).then((data) => {
    res.status(200).json({
      message: "export excel",
      data: data,
    });
  });
};

async function readFileExcel(fromDate, fromEndDate, toDate, toEndDate) {
  var workbook = new Excel.Workbook();
  const arrInv = await calc_invExact(
    fromDate,
    fromEndDate,
    toDate,
    toEndDate
  ).then();
  var file = await workbook.xlsx
    .readFile("./public/BCTK.xlsx")
    .then(async function () {
      if (arrInv.length > 0) {
        var worksheet = workbook.getWorksheet(1);
        var row = worksheet.getRow(5);
        worksheet.getCell("F1").value = new Date(fromDate); // A5's value set to 5
        worksheet.getCell("H1").value = new Date(toDate);
        worksheet.insertRows(6, arrInv, "i"); // i là copy style dùng trên o là dòng dưới
        row.commit();
        await workbook.xlsx.writeFile(
          "./public/TK" + fromDate + "_" + toDate + ".xlsx"
        );
        return (
          config.serverUrl + "/public/TK" + fromDate + "_" + toDate + ".xlsx"
        );
      } else {
        return null;
      }
    });
  return file;
}

async function calc_invExact(fromDate, fromEndDate, toDate, toEndDate) {
  let arrayInv = [];
  const docs = await InventoryKTSchama.aggregate([
    {
      $match: {
        status: "active",
        $and: [
          { invFromDate: { $gte: new Date(fromDate) } },
          { invFromDate: { $lt: new Date(fromEndDate) } },
          { invToDate: { $gte: new Date(toDate) } },
          { invToDate: { $lt: new Date(toEndDate) } },
        ],
        $or: [
          { invOpenningStock: { $gt: 0 } },
          { invIn: { $gt: 0 } },
          { invOut: { $gt: 0 } },
          { invClosingStock: { $gt: 0 } },
        ],
      },
    },
    {
      $project: {
        proCode1: 1,
        code: {
          $concat: [
            "$proStyle",
            "$proSupply",
            "-",
            "$proCode1",
            "-",
            "$proNumber",
          ],
        },
        invProductName: 1,
        proNumber: 1,
        proStyle: 1,
        proSupply: 1,
        invUnit: 1,
        invOpenningStock: 1,
        invOpeningAmt: 1,
        invIn: 1,
        inAmt: 1,
        invOut: 1,
        invOutAmt: 1,
        invClosingStock: 1,
        invClosingAmt: 1,
        DK: {
          $cond: [{ $eq: ["$proCompany", "DK"] }, "$invClosingStock", 0],
        },
        KV: { $cond: [{ $eq: ["$proCompany", "KV"] }, "$invClosingStock", 0] },
      },
    },
    {
      $group: {
        _id: {
          proCode1: "$proCode1",
          proNumber: "$proNumber",
          proStyle: "$proStyle",
          proSupply: "$proSupply",
        },
        code: { $first: "$code" },
        invProductName: { $first: "$invProductName" },
        invUnit: { $first: "$invUnit" },
        invOpenningStock: { $sum: "$invOpenningStock" },
        invOpeningAmt: { $sum: "$invOpeningAmt" },
        invIn: { $sum: "$invIn" },
        inAmt: { $sum: "$inAmt" },
        invOut: { $sum: "$invOut" },
        invOutAmt: { $sum: "$invOutAmt" },
        invClosingStock: { $sum: "$invClosingStock" },
        invClosingAmt: { $sum: "$invClosingAmt" },
        DK: { $sum: "$DK" },
        KV: { $sum: "$KV" },
      },
    },
    {
      $project: {
        _id: 0,
        code: 1,
        invProductName: 1,
        invUnit: 1,
        invOpenningStock: 1,
        invOpeningAmt: 1,
        invIn: 1,
        inAmt: 1,
        invOut: 1,
        invOutAmt: 1,
        invClosingStock: 1,
        invClosingAmt: 1,
        DK: 1,
        KV: 1,
      },
    },
    { $sort: { code: 1 } },
  ]).exec();
  for (const item of docs) {
    arrayInv.push(Object.values(item));
  }
  return arrayInv;
}

//Báo cáo xuất nhập tồn từ ngày đến ngày
exports.exportBCTonTheoKho = (req, res, next) => {
  var fromDate = moment(req.body.invFromDate, "YYYY-MM-DD")
    .startOf("day")
    .format("YYYY-MM-DD");
  var fromEndDate = moment(req.body.invFromDate, "YYYY-MM-DD")
    .add(1, "d")
    .startOf("day")
    .format("YYYY-MM-DD");
  var toDate = moment(req.body.invToDate, "YYYY-MM-DD")
    .startOf("day")
    .format("YYYY-MM-DD");
  var toEndDate = moment(req.body.invToDate, "YYYY-MM-DD")
    .add(1, "d")
    .startOf("day")
    .format("YYYY-MM-DD");
  readByWHFileExcel(fromDate, fromEndDate, toDate, toEndDate).then((data) => {
    res.status(200).json({
      message: "export excel",
      data: data,
    });
  });
};

async function readByWHFileExcel(fromDate, fromEndDate, toDate, toEndDate) {
  var workbook = new Excel.Workbook();
  const data = await calc_invByWH(
    fromDate,
    fromEndDate,
    toDate,
    toEndDate
  ).then();
  if (data.length === 0) return null;
  let keys = config.wareHouse;
  let groupBCTonTheoKho = data.reduce(function (acc, obj) {
    var key = obj.code;
    if (!acc[key]) {
      acc[key] = Object.assign(...keys.map((k) => ({ [k]: 0 })));
      acc[key]["code"] = obj.code;
      acc[key]["invProductName"] = obj.invProductName;
      acc[key]["invUnit"] = obj.invUnit;
      acc[key]["total"] = 0;
    }
    acc[key] = acc[key];
    if (keys.includes(obj.invWarehouse))
      acc[key][obj.invWarehouse] += obj.invClosingStock;
    return acc;
  }, {});
  let arrGroup = Object.values(groupBCTonTheoKho);
  let arrInv = [];
  for (const item of arrGroup) {
    let arrItem = [];
    let sumTotal = 0;
    arrItem = [item.code, item.invProductName, item.invUnit, ...arrItem];
    for (const k of keys) {
      arrItem.push(item[k]);
      sumTotal += item[k];
    }
    arrItem.push(sumTotal);
    if (sumTotal > 0) arrInv.push(arrItem);
  }
  var file = await workbook.xlsx
    .readFile("./public/BCTK_KHO.xlsx")
    .then(async function () {
      if (arrInv.length > 0) {
        var worksheet = workbook.getWorksheet(1);
        var row = worksheet.getRow(3);
        worksheet.getCell("H1").value = new Date(fromDate); // A5's value set to 5
        worksheet.getCell("J1").value = new Date(toDate);
        worksheet.insertRows(4, arrInv, "i"); // i là copy style dùng trên o là dòng dưới
        row.commit();
        await workbook.xlsx.writeFile(
          "./public/TKTHEOKHO" + fromDate + "_" + toDate + ".xlsx"
        );

        return (
          config.serverUrl +
          "/public/TKTHEOKHO" +
          fromDate +
          "_" +
          toDate +
          ".xlsx"
        );
      } else {
        return null;
      }
    });
  return file;
}

async function calc_invByWH(fromDate, fromEndDate, toDate, toEndDate) {
  let arrayInv = [];
  const docs = await InventoryKTSchama.aggregate([
    {
      $match: {
        status: "active",
        $and: [
          { invFromDate: { $gte: new Date(fromDate) } },
          { invFromDate: { $lt: new Date(fromEndDate) } },
          { invToDate: { $gte: new Date(toDate) } },
          { invToDate: { $lt: new Date(toEndDate) } },
        ],
        $or: [
          { invOpenningStock: { $gt: 0 } },
          { invIn: { $gt: 0 } },
          { invOut: { $gt: 0 } },
          { invClosingStock: { $gt: 0 } },
        ],
      },
    },
    {
      $project: {
        proStyle: 1,
        proCode1: 1,
        proNumber: 1,
        proSupply: 1,
        code: {
          $concat: [
            "$proStyle",
            "$proSupply",
            "-",
            "$proCode1",
            "-",
            "$proNumber",
          ],
        },
        invProductName: 1,
        invWarehouse: 1,
        invUnit: 1,
        invOpenningStock: 1,
        invOpeningAmt: 1,
        invIn: 1,
        inAmt: 1,
        invOut: 1,
        invOutAmt: 1,
        invClosingStock: 1,
        invClosingAmt: 1,
      },
    },
    {
      $group: {
        _id: {
          proCode1: "$proCode1",
          proNumber: "$proNumber",
          proStyle: "$proStyle",
          proSupply: "$proSupply",
          invWarehouse: "$invWarehouse",
        },
        invWarehouse: { $first: "$invWarehouse" },
        code: { $first: "$code" },
        invProductName: { $first: "$invProductName" },
        invUnit: { $first: "$invUnit" },
        invOpenningStock: { $sum: "$invOpenningStock" },
        invOpeningAmt: { $sum: "$invOpeningAmt" },
        invIn: { $sum: "$invIn" },
        inAmt: { $sum: "$inAmt" },
        invOut: { $sum: "$invOut" },
        invOutAmt: { $sum: "$invOutAmt" },
        invClosingStock: { $sum: "$invClosingStock" },
        invClosingAmt: { $sum: "$invClosingAmt" },
      },
    },
    {
      $project: {
        _id: 0,
        code: 1,
        invProductName: 1,
        invUnit: 1,
        invWarehouse: 1,
        invOpenningStock: 1,
        invOpeningAmt: 1,
        invIn: 1,
        inAmt: 1,
        invOut: 1,
        invOutAmt: 1,
        invClosingStock: 1,
        invClosingAmt: 1,
      },
    },
    { $sort: { code: 1 } },
  ]).exec();
  // for (const item of docs) {
  //   arrayInv.push(Object.values(item));
  // }
  return docs;
}

//Xuất báo cáo tồn kho cho NVL 100
exports.get_stockNVL100 = (req, res, next) => {
  var firstDay = moment(req.body.invFromDate, "YYYY-MM-DD").startOf("day");
  var lastDay = moment(req.body.invToDate, "YYYY-MM-DD").startOf("day");
  req.body = {
    fromDate: firstDay.format("YYYY-MM-DD"),
    toDate: lastDay.format("YYYY-MM-DD"),
  };
  const pool = new sql.ConnectionPool(config.sqlserver);
  pool
    .connect()
    .then(() => {
      //Kết nối tới data exact 100 để lấy tồn kho bên dykhang
      pool
        .request()
        .query(
          "select * from NODE_GetStock152_Function(N'" +
            req.body.fromDate +
            "', N'" +
            req.body.toDate +
            "') order by ItemName",
          (err, result) => {
            pool.close();
            if (result && result.recordset) {
              //AAAAAA
              readXNTNVLFileExcel(
                req.body.fromDate,
                req.body.toDate,
                result.recordset,
                "BCXNT_NVLDK",
                "BCXNT_NVL"
              ).then((data) => {
                res.status(200).json({
                  message: "export excel",
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
      console.log(err);
      res.status(500).json({
        error: err,
      });
    });
};

//Xuất báo cáo tồn kho cho NVL 200
exports.get_stockNVL200 = (req, res, next) => {
  var firstDay = moment(req.body.invFromDate, "YYYY-MM-DD").startOf("day");
  var lastDay = moment(req.body.invToDate, "YYYY-MM-DD").startOf("day");
  req.body = {
    fromDate: firstDay.format("YYYY-MM-DD"),
    toDate: lastDay.format("YYYY-MM-DD"),
  };
  const pool = new sql.ConnectionPool(config.sqlserver200);
  pool
    .connect()
    .then(() => {
      //Kết nối tới data exact 200 để lấy tồn kho bên khang việt
      pool
        .request()
        .query(
          "select * from NODE_GetStock152_Function(N'" +
            req.body.fromDate +
            "', N'" +
            req.body.toDate +
            "') order by ItemName",
          (err, result) => {
            pool.close();
            if (result && result.recordset) {
              //AAAAAA
              readXNTNVLFileExcel(
                req.body.fromDate,
                req.body.toDate,
                result.recordset,
                "BCXNT_NVLKV",
                "BCXNT_NVL"
              ).then((data) => {
                res.status(200).json({
                  message: "export excel",
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
      console.log(err);
      res.status(500).json({
        error: err,
      });
    });
};

//Xuất báo cáo tồn kho cho Thành phẩm 200
exports.get_stockTP200 = (req, res, next) => {
  var firstDay = moment(req.body.invFromDate, "YYYY-MM-DD").startOf("day");
  var lastDay = moment(req.body.invToDate, "YYYY-MM-DD").startOf("day");
  req.body = {
    fromDate: firstDay.format("YYYY-MM-DD"),
    toDate: lastDay.format("YYYY-MM-DD"),
  };
  const pool = new sql.ConnectionPool(config.sqlserver200);
  pool
    .connect()
    .then(() => {
      //Kết nối tới data exact 200 để lấy tồn kho bên khang việt
      pool
        .request()
        .query(
          "select * from NODE_GetStock155_Function(N'" +
            req.body.fromDate +
            "', N'" +
            req.body.toDate +
            "') order by ItemName",
          (err, result) => {
            pool.close();
            if (result && result.recordset) {
              //AAAAAA
              readXNTNVLFileExcel(
                req.body.fromDate,
                req.body.toDate,
                result.recordset,
                "BCXNT_TPKV",
                "BCXNT_TP"
              ).then((data) => {
                res.status(200).json({
                  message: "export excel",
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
      console.log(err);
      res.status(500).json({
        error: err,
      });
    });
};

//Xuất báo cáo tồn kho cho Thành phẩm 100
exports.get_stockTP100 = (req, res, next) => {
  var firstDay = moment(req.body.invFromDate, "YYYY-MM-DD").startOf("day");
  var lastDay = moment(req.body.invToDate, "YYYY-MM-DD").startOf("day");
  req.body = {
    fromDate: firstDay.format("YYYY-MM-DD"),
    toDate: lastDay.format("YYYY-MM-DD"),
  };
  const pool = new sql.ConnectionPool(config.sqlserver);
  pool
    .connect()
    .then(() => {
      //Kết nối tới data exact 100 để lấy tồn kho bên dykhang
      pool
        .request()
        .query(
          "select * from NODE_GetStock155_Function(N'" +
            req.body.fromDate +
            "', N'" +
            req.body.toDate +
            "') order by ItemName",
          (err, result) => {
            pool.close();
            if (result && result.recordset) {
              //AAAAAA
              readXNTNVLFileExcel(
                req.body.fromDate,
                req.body.toDate,
                result.recordset,
                "BCXNT_TPDK",
                "BCXNT_TP"
              ).then((data) => {
                res.status(200).json({
                  message: "export excel",
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
      console.log(err);
      res.status(500).json({
        error: err,
      });
    });
};

//Xuất Excel
async function readXNTNVLFileExcel(fromDate, toDate, data, nameFile, sourceF) {
  var workbook = new Excel.Workbook();
  let arr = [];
  for (const item of data) {
    arr.push(Object.values(item));
  }
  var file = await workbook.xlsx
    .readFile("./public/" +sourceF+ ".xlsx")
    .then(async function () {
      if (arr.length > 0) {
        var worksheet = workbook.getWorksheet(1);
        var row = worksheet.getRow(6);
        worksheet.getCell("E2").value = new Date(fromDate); // A5's value set to 5
        worksheet.getCell("G2").value = new Date(toDate);
        worksheet.insertRows(7, arr, "i"); // i là copy style dùng trên o là dòng dưới
        row.commit();
        await workbook.xlsx.writeFile(
          "./public/" + nameFile + "_" + fromDate + "_" + toDate + ".xlsx"
        );

        return (
          config.serverUrl +
          "/public/" +
          nameFile +
          "_" +
          fromDate +
          "_" +
          toDate +
          ".xlsx"
        );
      } else {
        return null;
      }
    });
  return file;
}
