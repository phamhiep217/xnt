import SupplySchema from "../models/supply";
import mongoose from "mongoose";

exports.supply_get_all = (req, res, next) => {
    SupplySchema.find({status: "active"}).sort({_id:-1})
    .exec()
    .then((lstSupply) => {
        res.status(200).json({
            message: "lay danh sach supplies",
            data:lstSupply
        });
    })
    .catch((err) => {
        res.status(500).json({
          error: err,
        });
      });
}

exports.insert_Supply = (req, res, next) => {
    const Supply = new SupplySchema({
        _id: new mongoose.Types.ObjectId(),
        supNo: req.body.supNo,
        supName: req.body.supName,
        status: "active"
    });
    Supply
    .save()
    .then((objSupply) => {
        res.status(201).json({
            message: "insert supply",
            data: objSupply
        });
    })
    .catch((err) => {
        console.log(err);
        res.status(500).json({
          error: err,
        });
      });
}

exports.get_Supply_by_id = (req, res, next) => {
    const id = req.params.supplyId;
    SupplySchema.findById(id)
    .exec()
    .then((objSupply) => {
        res.status(200).json({
            message: "tìm một supply theo id",
            data: objSupply
        });
    })
    .catch((err) => {
        res.status(500).json({ error: err });
      });
}

exports.update_Supply_by_id = (req, res, next) => {
    const id = req.params.supplyId;
    const updateOps = {};
    for (const ops of req.body) {
        updateOps[ops.propName] = ops.value;
    }
    SupplySchema.findOneAndUpdate({_id:id},{$set: updateOps},{returnOriginal : false})
    .exec()
    .then((objSupply) => {
        res.status(200).json({
            message: " cập nhật supply theo id",
            data: objSupply
        });
    })
    .catch((err) => {
        res.status(500).json({
          error: err,
        });
      });
}

exports.delete_Supply_by_id = (req, res, next) => {
    const id = req.params.supplyId;
    SupplySchema.remove({_id: id})
    .exec()
    .then((objSupply) => {
        res.status(200).json({
            message: "xoa mot supply theo id",
            data: true
        });
    })
    .catch((err) => {
        res.status(500).json({
          error: err,
        });
      });
}