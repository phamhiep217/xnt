import mongoose from "mongoose";

const supplySchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    supNo: { type: String, required: true },
    supName:{ type: String, required: true },
    status: { type: String, required: true }
});

module.exports = mongoose.model('supply', supplySchema);