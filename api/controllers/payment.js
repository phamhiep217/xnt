import PaymentSchema from "../models/payment";
import mongoose from "mongoose";

exports.payment_get_all = (req, res, next) => {
    PaymentSchema.find({status: "active"}).sort({_id:-1})
    .exec()
    .then((listPayment) => {
        res.status(200).json({
            message: "lay danh sach thanh toan",
            data:listPayment
        });
    })
    .catch((err) => {
        res.status(500).json({
          error: err,
        });
      });
}

exports.insert_payment = (req, res, next) => {
    const payment = new PaymentSchema({
        _id: new mongoose.Types.ObjectId(),
        payName: req.body.payName,
        payNum: req.body.payNum,
        payStyle: req.body.payStyle,
        status: "active"
    });
    payment
    .save()
    .then((objPayment) => {
        res.status(201).json({
            message: "insert một thanh toan",
            data: objPayment
        });
    })
    .catch((err) => {
        console.log(err);
        res.status(500).json({
          error: err,
        });
      });
}

exports.get_payment_by_id = (req, res, next) => {
    const id = req.params.paymentId;
    PaymentSchema.findById(id)
    .exec()
    .then((objPayment) => {
        res.status(200).json({
            message: "tìm một thanh toán theo id",
            data: objPayment
        });
    })
    .catch((err) => {
        res.status(500).json({ error: err });
      });
}

exports.update_payment_by_id = (req, res, next) => {
    const id = req.params.paymentId;
    const updateOps = {};
    for (const ops of req.body) {
        updateOps[ops.propName] = ops.value;
    }
    PaymentSchema.findOneAndUpdate({_id:id}, {$set: updateOps},{returnOriginal : false})
    .exec()
    .then((objPayment) => {
        res.status(200).json({
            message: " cập nhật thanh toan theo id",
            data: objPayment
        });
    })
    .catch((err) => {
        res.status(500).json({
          error: err,
        });
      });
}

exports.delete_payment_by_id = (req, res, next) => {
    const id = req.params.paymentId;
    PaymentSchema.remove({_id: id})
    .exec()
    .then((objPayment) => {
        res.status(200).json({
            message: "xoa mot thanh taon theo id",
            data: true
        });
    })
    .catch((err) => {
        res.status(500).json({
          error: err,
        });
      });
}