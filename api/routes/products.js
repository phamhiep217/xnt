const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const multer = require("multer");
import ProductController from "../controllers/product";
//tạo thư mục uploads sử dụng thư viện multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./upload/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + file.originalname);
  },
});
const fileFilter = (req, file, cb) => {
  //reject a file
  if (file.mimetype === "image/jpeg" || file.mimetype === "image/png") {
    cb(null, true);
  } else {
    cb(null, false);
  }
};
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 5,
  },
  fileFilter: fileFilter,
});

router.get("/", ProductController.product_get_all);
router.post("/", ProductController.insert_product);
router.get("/:productId", ProductController.get_product_by_id);
router.patch("/:productId", ProductController.update_product_by_id);
router.delete("/:productId", ProductController.delete_product_by_id);
// router.post("/", upload.single("productImge"), (req, res, next) => {
//   const product = new Product({
//     _id: new mongoose.Types.ObjectId(),
//     name: req.body.name,
//     price: req.body.price,
//     productImage: req.file.path
//   });
//   product
//     .save()
//     .then((result) => {
//       console.log(result);
//       res.status(201).json({
//         message: "Created product successfully",
//         createdProduct: {
//           name: result.name,
//           price: result.price,
//           _id: result._id,
//           productImage: result.productImage,
//           request: {
//             type: "GET",
//             url: "http://localhost:3000/products/" + result._id,
//           },
//         },
//       });
//     })
//     .catch((err) => {
//       console.log(err);
//       res.status(500).json({
//         error: err,
//       });
//     });
// });

module.exports = router;
