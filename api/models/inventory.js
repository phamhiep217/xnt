import mongoose from "mongoose";

const invSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    invProductNo:{type: String, required: true},
    invProductName:{type: String, required: true},
    invUnit:{type: String, required: true},
    invOpenningStock:{type: Number, required: true},
    invIn: {type: Number, required: true},
    invOut: {type: Number, required: true},
    invClosingStock:{type: Number, required: true},
    invMonth: {type: Number, required: true},
    invYear: {type: Number, required: true},
    invCompany: {type: String, required: true},
    invWarehouse:{type: String, required: true},
    status: {type: String, required: true}
});

module.exports = mongoose.model("inventory", invSchema);