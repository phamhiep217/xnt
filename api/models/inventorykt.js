import mongoose from "mongoose";

const invktSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    invProductNo:{type: String, required: true},
    invProductName:{type: String, required: true},
    invUnit:{type: String, required: true},
    invOpenningStock:{type: Number, required: true},
    invIn: {type: Number, required: true},
    invOut: {type: Number, required: true},
    invClosingStock:{type: Number, required: true},
    invOpeningAmt:{type: Number, required: true},
    inAmt: {type: Number, required: true},
    invOutAmt: {type: Number, required: true},
    invClosingAmt: {type: Number, required: true},
    invCompany: {type: String, required: true},
    invWarehouse:{type: String, required: true},
    invFromDate: {type: Date, required: true},
    invToDate: {type: Date, retquired: true},
    proStyle: {type: String, required: true},
    proSource: {type: String, required: true},
    proNumber: {type: String, required: true},
    proCompany: {type: String, required: true},
    proCode1: {type: String, required: true},
    proCode2: {type: String, required: true},
    proCode3: {type: String, required: true},
    proSupply: {type: String, required: true},
    status: {type: String, required: true}
});

module.exports = mongoose.model("inventorykt", invktSchema);