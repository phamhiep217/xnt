import ReportSchema from "../models/report";
import ProductSchema from "../models/product";
import PurchaseSchema from "../models/purchase";
import mongoose from "mongoose";

exports.report_get_by_month = (req, res, next) => {
  const filter = {
    status: "active",
    rptMonth: req.Month,
    rptYear: req.Year,
  };
  ReportSchema.find(filter)
    .exec()
    .then((listReport) => {
      res.status(200).json({
        message: "lay danh sach bao cao ton kho theo tháng",
        data: listReport,
      });
    })
    .catch((err) => {
      res.status(500).json({
        error: err,
      });
    });
};

exports.calculator_stock_movement = (req, res, next) => {
  const filter = {
    status: "active",
    rptMonth: req.params.month,
    rptYear: req.params.year,
  };
  calculator_stock(filter.rptMonth, filter.rptYear, filter.status)
    .then((listReport) => {
      res.status(200).json({
        message: "lay danh sach bao cao ton kho theo tháng",
        data: listReport,
      });
    })
    .catch((err) => {
      res.status(500).json({
        error: err,
      });
    });
  //Hàm cập nhật tồn kho tháng về delete
  //Tổng hợp danh sách ton kho thang trong exact
  //Lấy danh sách trong danh muc product
  //Tổng hợp danh sach trong purchase query theo tháng => group theo  product:
  //Insert vào report theo tháng.
};

async function calculator_stock(month, year, status) {
  await ReportSchema.updateMany(
    { rptMonth: month, rptYear: year },
    { $set: { status: "delete" } }
  )
    .exec()
    .catch((err) => {
      console.log(err);
      console.log("Khong xoa duoc data");
    });
  const docs = await ProductSchema.aggregate([
    {
      $lookup: {
        from: "inventories",
        let: {
          productNo: "$proNo",
        },
        pipeline: [
          {
            $match: {
              $expr: {
                $and: [
                  {
                    $eq: ["$invProductNo", "$$productNo"],
                  },
                  {
                    Status: status,
                    invMonth: month,
                    invYear: year,
                  },
                ],
              },
            },
          },
          {
            $project: {
              invProductNo: 1,
              invOpenningStock: 1,
              invIn: 1,
              invOut: 1,
              invClosingStock: 1,
            },
          },
          {
            $group: {
              _id: "$invProductNo",
              OpenningTotal: {
                $sum: "$invOpenningStock",
              },
              InTotal: {
                $sum: "$invIn",
              },
              OutTotal: {
                $sum: "$invOut",
              },
              ClosingTotal: {
                $sum: "$invClosingStock",
              },
            },
          },
        ],
        as: "invlist",
      },
    },
    {
      $lookup: {
        from: "purchases",
        let: {
          productId: "$_id",
        },
        pipeline: [
          {
            $match: {
              $expr: {
                $and: [
                  {
                    $eq: ["$purProductId", "$$productId"],
                  },
                  {
                    $eq: [
                      {
                        $month: "$purExpDate",
                      },
                      2,
                    ],
                  },
                  {
                    $eq: [
                      {
                        $year: "$purExpDate",
                      },
                      2020,
                    ],
                  },
                ],
              },
            },
          },
          {
            $project: {
              _id: 0,
              purProductId: 1,
              purQuantity: 1,
              inTranset: {
                $cond: [
                  {
                    $and: [
                      {
                        $eq: ["$purShipmentCode", ""],
                      },
                      {
                        $eq: ["$purShipmentNote", ""],
                      },
                    ],
                  },
                  "$purQuantity",
                  0,
                ],
              },
              ms: {
                $cond: [
                  {
                    $and: [
                      {
                        $eq: ["$purShipmentCode", ""],
                      },
                      {
                        $ne: ["$purShipmentNote", ""],
                      },
                    ],
                  },
                  "$purQuantity",
                  0,
                ],
              },
            },
          },
          {
            $group: {
              _id: "$purProductId",
              totalQty: {
                $sum: "$purQuantity",
              },
              inTransetQty: {
                $sum: "$inTranset",
              },
              msQty: {
                $sum: "$ms",
              },
            },
          },
        ],
        as: "purlist",
      },
    },
    {
      $match: {
        status: "active",
        $or: [
          {
            "invlist.0": {
              $exists: true,
            },
          },
          {
            "purlist.0": {
              $exists: true,
            },
          },
        ],
      },
    },
    {
      $project: {
        proNo: 1,
        proName: 1,
        proUnit: 1,
        proStyle: 1,
        proSupply: 1,
        proSource: 1,
        proNumber: 1,
        proCompany: 1,
        proCode1: 1,
        proCode2: 1,
        proCode3: 1,
        proMin: 1,
        totalQty: {
          $cond: [
            {
              $not: [
                {
                  $arrayElemAt: ["$purlist.totalQty", 0],
                },
              ],
            },
            0,
            {
              $arrayElemAt: ["$purlist.totalQty", 0],
            },
          ],
        },
        inTransetQty: {
          $cond: [
            {
              $not: [
                {
                  $arrayElemAt: ["$purlist.inTransetQty", 0],
                },
              ],
            },
            0,
            {
              $arrayElemAt: ["$purlist.inTransetQty", 0],
            },
          ],
        },
        msQty: {
          $cond: [
            {
              $not: [
                {
                  $arrayElemAt: ["$purlist.msQty", 0],
                },
              ],
            },
            0,
            {
              $arrayElemAt: ["$purlist.msQty", 0],
            },
          ],
        },
        OpenningTotal: {
          $cond: [
            {
              $not: [
                {
                  $arrayElemAt: ["$invlist.OpenningTotal", 0],
                },
              ],
            },
            0,
            {
              $arrayElemAt: ["$invlist.OpenningTotal", 0],
            },
          ],
        },
        ClosingTotal: {
          $cond: [
            {
              $not: [
                {
                  $arrayElemAt: ["$invlist.ClosingTotal", 0],
                },
              ],
            },
            0,
            {
              $arrayElemAt: ["$invlist.ClosingTotal", 0],
            },
          ],
        },
        InTotal: {
          $cond: [
            {
              $not: [
                {
                  $arrayElemAt: ["$invlist.InTotal", 0],
                },
              ],
            },
            0,
            {
              $arrayElemAt: ["$invlist.InTotal", 0],
            },
          ],
        },
      },
    },
  ]).exec();
  for(const item of docs){
    var iInAll = item.InTotal - item.totalQty;
    var iOut = item.OpenningTotal + item.InTotal  - item.ClosingTotal;
      const objReport = new ReportSchema({
        _id:  new mongoose.Types.ObjectId(),
        rptProductId: item._id,
        rptOpenning: item.OpenningTotal,
        rptIn: item.totalQty,
        rptInAll: iInAll,
        rptOut: iOut,
        rptClosing: item.ClosingTotal,
        rptInTransit: item.inTransetQty,
        rptInTransitMS: item.msQty,
        rptMonth: month,
        rptYear: year,
        status: status
      });
      await objReport
        .save()
        .then()
        .catch((err) => {
            console.log(err);
        });
  }
  return docs;
}
