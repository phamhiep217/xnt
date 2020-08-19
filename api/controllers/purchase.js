import PurchaseSchema from "../models/purchase";
import mongoose from "mongoose";

exports.purchase_get_all = (req, res, next) => {
  PurchaseSchema.aggregate([
    {
      $lookup: {
        from: "supplies",
        localField: "purSupply",
        foreignField: "supNo",
        as: "sup",
      },
    },
    {
      $lookup: {
        from: "products",
        localField: "purProductId",
        foreignField: "_id",
        as: "pro",
      },
    },
  ])
    .sort({ _id: -1 })
    .exec()
    .then((listPurchse) => {
      listPurchse = listPurchse.map((obj) => {
        if (obj.pro.length > 0) {
          var item = Object.assign(obj, obj.pro[0], obj.sup[0]);
          return item;
        }
      });
      res.status(200).json({
        message: "lay danh sach don dat hang",
        data: listPurchse,
      });
    })
    .catch((err) => {
      res.status(500).json({
        error: err,
      });
    });
};

exports.insert_purchase = (req, res, next) => {
  const purchase = new PurchaseSchema({
    _id: new mongoose.Types.ObjectId(),
    purProductId: req.body.ProductId,
    purSupply: req.body.Supply,
    purDate: req.body.Date,
    purContract: req.body.Contract,
    purQuantity: req.body.Quantity,
    purAmt: req.body.Amt,
    purTotalAmt: req.body.TotalAmt,
    purETADate: req.body.ETADate,
    purShipmentDate: req.body.ShipmentDate,
    purShipmentCode: req.body.ShipmentCode,
    purExpDate: req.body.ExpDate,
    purPaymentTerm: req.body.PaymentTerm,
    purPaymentNote: req.body.PaymentNote,
    purPaymentCode: req.body.PaymentCode,
    purDocDate: req.body.DocDate,
    purNote: req.body.Note,
    purShipmentNote: req.body.ShipmentNote,
    purExpNum: req.body.ExpNum,
    purDocCode: req.body.DocCode,
    purImTax: req.body.ImTax,
    purForm: req.body.Form,
    purStyle: req.body.Style,
    purPartShip: "",
    purRemaining: 0,
    status: "active",
  });
  purchase
    .save()
    .then((objpurchase) => {
      res.status(201).json({
        message: "them mot don dat hang",
        data: objpurchase,
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        error: err,
      });
    });
};

exports.get_purchase_by_id = (req, res, next) => {
  const id = req.params.purchaseId;
  PurchaseSchema.findById(id)
    .exec()
    .then((objpurchase) => {
      res.status(200).json({
        message: "lay don hang theo id",
        data: objpurchase,
      });
    })
    .catch((err) => {
      res.status(500).json({ error: err });
    });
};

exports.update_purchase_by_id = (req, res, next) => {
  const id = req.params.purchaseId;
  const updateOps = {};
  for (const ops of req.body) {
    updateOps[ops.propName] = ops.value;
  }
  PurchaseSchema.findOneAndUpdate(
    { _id: id },
    { $set: updateOps },
    { returnOriginal: false }
  )
    .exec()
    .then((objpurchase) => {
      res.status(200).json({
        message: "cap nhat don hang theo id",
      });
    })
    .catch((err) => {
      res.status(500).json({
        error: err,
      });
    });
};

exports.delete_purchase_by_id = (req, res, next) => {
  const id = req.params.purchaseId;
  PurchaseSchema.remove({ _id: id })
    .exec()
    .then((objpurchase) => {
      res.status(200).json({
        message: " xoa don hang theo id",
        data: true,
      });
    })
    .catch((err) => {
      res.status(500).json({
        error: err,
      });
    });
};
