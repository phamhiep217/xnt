import mongoose from "mongoose";

const partshipSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    ParPurchasingId: {type: mongoose.Schema.Types.ObjectId, ref: 'purchase', required: true},
    ParPayQty: {type: Number},
    ParNote: {type: String},
    status: { type: String, required: true },
});

module.exports = mongoose.model('PartShip', partshipSchema);