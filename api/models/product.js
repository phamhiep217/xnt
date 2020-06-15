const mongoose = require('mongoose');

const productSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    proNo: {type: String, required: true},
    proName: {type: String, required: true},
    proUnit: {type: String, required: true},
    proStyle: {type:String, required: true},
    proSupply: {type:String, required: true},
    proSource: {type:String, required: true},
    proNumber: {type:String, required: true},
    proCompany: {type:String, required: true},
    proCode1: {type:String, required: true},
    proCode2: {type:String, required: true},
    proCode3: {type:String, required: true},
    proMin: {type:Number, required: true},
    proPacking: {type:Number, required: true},
    proUOM: {type:String},
    proLeadTime: {type: String},
    productImage: {type: String},
    status: {type: String, required: true}
});

module.exports = mongoose.model('product', productSchema);