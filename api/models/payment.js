const mongoose = require('mongoose');

const paymentSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    payName: {type: String, required: true},
    payNum: {type: Number, required: true},
    payStyle: {type: String, required: true},
    status: {type: String, required: true}
});

module.exports = mongoose.model('payment',paymentSchema);