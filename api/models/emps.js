import mongoose from "mongoose";

const empSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  EmpCode: { type: String, required: true },
  EmpName: { type: String, required: true },
  EmpPhone: { type: String, required: true },
//   EmpEmail: {
//     type: String,
//     required: true,
//     unique: true,
//     match: /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/,
//   },
  EmpEmail: {type: String, required: true},
  EmpUserName: { type: String, required: true },
  EmpUserPass: { type: String, required: true },
  Status: { type: String, required: true },
  EmpRole: { type: [Number], required: true },
});

module.exports = mongoose.model("emp", empSchema);
