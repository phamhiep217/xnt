import Emp from "../models/emps";
import config from "../../config";
import mongoose from "mongoose";
// mã hóa pass
import bcrypt from "bcrypt";
//import Json Web Token
import jwt from "jsonwebtoken";

exports.aut_get_all = (req, res, next) => {
    Emp.find()
      .select("_id EmpCode EmpName EmpPhone EmpEmail EmpUserName Status EmpRole")
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
  }

exports.aut_get_by_id = (req, res, next) => {
    const _id = req.params.empId;
    Emp.findById(_id)
      .select("_id EmpCode EmpName EmpPhone EmpEmail EmpUserName Status EmpRole")
      .exec()
      .then((objEmp) => {
        if (objEmp) {
          res.status(200).json({
            message: "Handing GET request to /emp/:empId",
            data: objEmp,
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
  }

  exports.aut_login = (req, res, next) => {
    Emp.find({ EmpUserName: req.body.username })
      .exec()
      .then((user) => {
        if (user.length < 1) {
          return res.status(401).json({
            message: "Đăng nhập không thành công",
          });
        }
        bcrypt.compare(
          req.body.password,
          user[0].EmpUserPass,
          (err, result) => {
            if (err) {
              return res.status(401).json({
                message: "Đăng nhập không thành công",
              });
            }
            if (result) {
              //tạo token có data là name và id + thời hạn 1h
              const token = jwt.sign(
                {
                  EmpUserName: user[0].EmpUserName,
                  EmpUserId: user[0]._id,
                },
                config.jwt_key,
                // {
                //   expiresIn: "1h",
                // }
              );
              return res.status(200).json({
                message: "Đăng nhập thành công",
                token: token,
                EmpUserId: user[0]._id
              });
            }
            res.status(401).json({
              message: "Đăng nhập không thành công",
            });
          }
        );
      })
      .catch((err) => {
        res.status(500).json({
          error: err,
        });
      });
  }

  exports.aut_signup = (req, res, next) => {

    Emp.find({
      EmpUserName: req.body.EmpUserName,
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
    bcrypt.hash(req.body.EmpUserPass, 10, (err, hash) => {
      if (err) {
        return res.status(500).json({
          error: err,
        });
      } else {
        const objEmp = new Emp({
          _id: new mongoose.Types.ObjectId(),
          EmpCode: req.body.EmpCode,
          EmpName: req.body.EmpName,
          EmpPhone: req.body.EmpPhone,
          EmpEmail: req.body.EmpEmail,
          EmpUserName: req.body.EmpUserName,
          EmpUserPass: hash,
          Status: req.body.Status,
          EmpRole: req.body.EmpRole,
        });
        objEmp
          .save()
          .then((result) => {
            console.log(result);
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
  }

  exports.aut_del_emp_by_id = (req, res, next) => {
    Emp.remove({ _id: req.params.userId })
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
  }

