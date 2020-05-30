import ProductSchema from "../models/product";
import mongoose from "mongoose";
exports.product_get_all = (req, res, next) => {
  ProductSchema.find({status:"active"})
    .exec()
    .then((listProduct) => {
      res.status(200).json({
        message: "lay danh sach mặt hàng",
        data: listProduct
      });
    })
    .catch((err) => {
      res.status(500).json({
        error: err,
      });
    });
};

exports.insert_product = (req, res, next) => {
  const product = new ProductSchema({
    _id: new mongoose.Types.ObjectId(),
    proNo: req.No,
    proName: req.Name,
    proUnit: req.Unit,
    proStyle: req.Style,
    proSupply: req.Supply,
    proSource: req.Source,
    proNumber: req.Number,
    proCompany: req.Company,
    proCode1: req.Code1,
    proCode2: req.Code2,
    proCode3: req.Code3,
    proMin: req.Min,
    proPacking: req.Packing,
    proUOM: req.UOM,
    proLeadTime: req.LeadTime,
    productImage: "null",
    active: "active",
  });
  product
    .save()
    .then((objProduct) => {
      res.status(201).json({
        message: "insert mot mat hang",
        data: objProduct,
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        error: err,
      });
    });
};

exports.get_product_by_id = (req, res, next) => {
  const id = req.params.productId;
  ProductSchema.findById(id)
    .exec()
    .then((objProduct) => {
      if (objProduct) {
        res.status(200).json({
          message: "tìm một mặt hàng theo id",
          data: objProduct
        });
      }
    })
    .catch((err) => {
      res.status(500).json({ error: err });
    });
};

exports.update_product_by_id = (req, res, next) => {
  const id = req.params.productId;
  const updateOps = {};
  for (const ops of req.body) {
    updateOps[ops.propName] = ops.value;
  }
  ProductSchema.update({ _id: id }, { $set: updateOps })
    .exec()
    .then((objProduct) => {
      res.status(200).json({
        message: "cap nhat ma mot mat hang theo id",
        data: objProduct,
      });
    })
    .catch((err) => {
      res.status(500).json({
        error: err,
      });
    });
};

exports.delete_product_by_id = (req, res, next) => {
    const id = req.params.productId;
    ProductSchema.remove({_id: id})
    .exec()
    .then ((objProduct) => {
        res.status(200).json({
            message: "xoa mot mat hang theo id",
            data: true
        });
    })
    .catch((err) => {
        res.status(500).json({
          error: err,
        });
      });
}


