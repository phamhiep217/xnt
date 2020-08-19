import mongoose from "mongoose";

const empSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  empCode: { type: String, required: true },
  empName: { type: String, required: true },
  empPhone: { type: String, required: true },
//   EmpEmail: {
//     type: String,
//     required: true,
//     unique: true,
//     match: /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/,
//   },
  empEmail: {type: String, required: true},
  empUserName: { type: String, required: true },
  empUserPass: { type: String, required: true },
  status: { type: String, required: true },
  empRole: { type: [Number], required: true },
});

module.exports = mongoose.model("emp", empSchema);
