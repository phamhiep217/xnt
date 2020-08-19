import EmpSchema from "../models/emps";
import config from "../../config";
import mongoose from "mongoose";
// mã hóa pass
import bcrypt from "bcrypt";
//import Json Web Token
import jwt from "jsonwebtoken";

exports.aut_get_all = (req, res, next) => {
  EmpSchema.find({status: "active"}).sort({_id:-1})
    .select("_id empCode empName empPhone empEmail empUserName status empRole")
    .exec()
    .then((result) => {
      res.status(200).json({
        message: "Handling GET requests to /emp",
        data: result,
      });
    })
    .catch((err) => {
      res.status(500).json({
        error: err,
      });
    });
};

exports.aut_get_by_id = (req, res, next) => {
  const _id = req.params.empId;
  EmpSchema.findById(_id)
    .select("_id empCode empName empPhone empEmail empUserName status empRole")
    .exec()
    .then((objEmp) => {
      if (objEmp) {
        res.status(200).json({
          message: "Handing GET request to /emp/:empId",
          data: objEmp
        });
      } else {
        res.status(404).json({
          message: "no valid entry found for this ID",
        });
      }
    })
    .catch((err) => {
      res.status(500).json({
        error: err,
      });
    });
};

exports.aut_login = (req, res, next) => {
  EmpSchema.find({ empUserName: req.body.username })
    .exec()
    .then((user) => {
      if (user.length < 1) {
        return res.status(401).json({
          message: "Đăng nhập không thành công",
        });
      }
      bcrypt.compare(req.body.password, user[0].empUserPass, (err, result) => {
        if (err) {
          return res.status(401).json({
            message: "Đăng nhập không thành công",
          });
        }
        if (result) {
          //tạo token có data là name và id + thời hạn 1h
          const token = jwt.sign(
            {
              empUserName: user[0].empUserName,
              empUserId: user[0]._id,
            },
            config.jwt_key
            // {
            //   expiresIn: "1h",
            // }
          );
          return res.status(200).json({
            message: "Đăng nhập thành công",
            token: token,
            empUserId: user[0]._id,
            warehouse: config.wareHouse
          });
        }
        res.status(401).json({
          message: "Đăng nhập không thành công",
        });
      });
    })
    .catch((err) => {
      res.status(500).json({
        error: err,
      });
    });
};

exports.aut_signup = (req, res, next) => {
  EmpSchema.find({
    empUserName: req.body.empUserName,
  })
    .exec()
    .then((user) => {
      if (user.length >= 1) {
        return res.status(409).json({
          message: "User đã tồn tại",
        });
      }
    })
    .catch();
  bcrypt.hash(req.body.empUserPass, 10, (err, hash) => {
    if (err) {
      return res.status(500).json({
        error: err,
      });
    } else {
      const objEmp = new EmpSchema({
        _id: new mongoose.Types.ObjectId(),
        empCode: req.body.empCode,
        empName: req.body.empName,
        empPhone: req.body.empPhone,
        empEmail: req.body.empEmail,
        empUserName: req.body.empUserName,
        empUserPass: hash,
        status: 'active',
        empRole: req.body.empRole,
      });
      objEmp
        .save()
        .then((result) => {
          res.status(201).json({
            message: "Handling Post requests to /emp",
            data: result,
          });
        })
        .catch((err) => {
          res.status(500).json({
            error: err,
          });
        });
    }
  });
};

exports.aut_del_emp_by_id = (req, res, next) => {
  EmpSchema.remove({ _id: req.params.userId })
    .exec()
    .then((result) => {
      res.status(201).json({
        message: "Handling Delete requests to /aut/:userId",
        data: result,
      });
    })
    .catch((err) => {
      res.status(500).json({
        error: err,
      });
    });
};

exports.update_emp_by_id = (req, res, next) => {
  const id = req.params.empId;
  const updateOps = {};
  for (const ops of req.body) {
    updateOps[ops.propName] = ops.value;
  }
  if (updateOps["empUserPass"]) {
    bcrypt.hash(updateOps["empUserPass"], 10, (err, hash) => {
      if (err) {
        return res.status(500).json({
          error: err,
        });
      } else {
        updateOps["empUserPass"] = hash;
        EmpSchema.findOneAndUpdate({ _id: id }, { $set: updateOps },{returnOriginal : false})
          .exec()
          .then((objEmp) => {
            res.status(200).json({
              message: " cập nhật nhân viên theo id",
              data: objEmp,
            });
          })
          .catch((err) => {
            res.status(500).json({
              error: err,
            });
          });
      }
    });
  } else {
    EmpSchema.findOneAndUpdate({ _id: id }, { $set: updateOps },{returnOriginal : false})
      .exec()
      .then((objEmp) => {
        res.status(200).json({
          message: " cập nhật nhân viên theo id",
          data: objEmp,
        });
      })
      .catch((err) => {
        res.status(500).json({
          error: err,
        });
      });
  }
};
