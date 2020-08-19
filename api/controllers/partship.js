import PartShipSchema from "../models/partship";
import mongoose from "mongoose";

exports.partship_get_all = (req, res, next) => {
    PartShipSchema.find({status: "active"}).sort({_id:-1})
    .exec()
    .then((lstPartShip) => {
        res.status(200).json({
            message: "lay danh sach partialshipment",
            data:lstPartShip
        });
    })
    .catch((err) => {
        res.status(500).json({
          error: err,
        });
      });
}

exports.insert_partship = (req, res, next) => {
    const partship = new PartShipSchema({
        _id: new mongoose.Types.ObjectId(),
        ParPurchasingId: req.body.PurchasingId,
        ParPayQty: req.body.PayQty,
        status: "active"
    });
    partship
    .save()
    .then((objPartShip) => {
        res.status(201).json({
            message: "insert partialship",
            data: objPartShip
        });
    })
    .catch((err) => {
        console.log(err);
        res.status(500).json({
          error: err,
        });
      });
}

exports.get_partship_by_id = (req, res, next) => {
    const id = req.params.ParPurchasingId;
    PartShipSchema.findById(id)
    .exec()
    .then((objPartShip) => {
        res.status(200).json({
            message: "tìm một partialship theo id",
            data: objPartShip
        });
    })
    .catch((err) => {
        res.status(500).json({ error: err });
      });
}

exports.update_payment_by_id = (req, res, next) => {
    const id = req.params.partshipId;
    const updateOps = {};
    for (const ops of req.body) {
        updateOps[ops.propName] = ops.value;
    }
    PartShipSchema.findOneAndUpdate({_id:id},{$set: updateOps},{returnOriginal : false})
    .exec()
    .then((objPartShip) => {
        res.status(200).json({
            message: " cập nhật partialship theo id",
            data: objPartShip
        });
    })
    .catch((err) => {
        res.status(500).json({
          error: err,
        });
      });
}

exports.delete_partship_by_id = (req, res, next) => {
    const id = req.params.partshipId;
    PartShipSchema.remove({_id: id})
    .exec()
    .then((objPartShip) => {
        res.status(200).json({
            message: "xoa mot partialship theo id",
            data: true
        });
    })
    .catch((err) => {
        res.status(500).json({
          error: err,
        });
      });
}