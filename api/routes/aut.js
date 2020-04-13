import express from "express";
import Emp from "../models/emps";
import mongoose from "mongoose";

const router = express.Router();

router.get("/emp", (req, res, next) => {
  Emp.find()
    .select('_id EmpCode EmpName EmpPhone EmpEmail EmpUserName Status EmpRole')
    .exec()
    .then((result) => {
      res.status(200).json({
        message: "Handling GET requests to /emp",
        data: result
      });
    })
    .catch((err) => {
      res.status(500).json({
        error: err,
      });
    });
});

router.get("/emp/:empId", (req, res, next) => {
  const _id = req.params.empId;
  Emp.findById(_id)
    .exec()
    .then((objEmp) => {
      console.log(objEmp);
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
});

router.post("/aut", (req, res, next) => {
  const account = {
    username: req.body.username,
    password: req.body.password,
  };
  res.status(201).json({
    message: "Handling Post requests to /aut",
    data: account,
  });
});

router.post("/emp", (req, res, next) => {
  const objEmp = new Emp({
    _id: new mongoose.Types.ObjectId(),
    EmpCode: req.body.EmpCode,
    EmpName: req.body.EmpName,
    EmpPhone: req.body.EmpPhone,
    EmpEmail: req.body.EmpEmail,
    EmpUserName: req.body.EmpUserName,
    EmpUserPass: req.body.EmpUserPass,
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
});
export default router;
