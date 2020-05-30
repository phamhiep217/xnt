const mongoose = require("mongoose");

const reportSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    rptProductId: {type: mongoose.Schema.Types.ObjectId,ref:"product",required:true},
    rptOpenning: {type:Number, required: true},
    rptIn: {type: Number, required: true},
    rptInAll: {type: Number, required: true},
    rptOut: {type: Number, required: true},
    rptClosing: {type: Number, required: true},
    rptInTransit: {type: Number, required: true},
    rptInTransitMS: {type: Number, required: true},
    rptMonth: {type: Number, required: true},
    rptYear: {type: Number, required: true},
    status: {type: String, required: true}
});

module.exports = mongoose.model("report",reportSchema);
