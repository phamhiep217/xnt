const mongoose = require("mongoose");

const purchaseSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  purProductId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "product",
    required: true,
  },
  purSupply: { type: String, required: true },
  purDate: { type: Date, required: true },
  purContract: { type: String, required: true },
  purQuantity: { type: String, required: true }, // tt số lượng mua trong kỳ
  purAmt: { type: String, required: true },
  purTotalAmt: { type: String, required: true },
  purETADate: { type: Date, required: true },
  purShipmentDate: { type: Date, required: true },
  purShipmentCode: { type: String, required: true }, //tt in-transit neu N & purShipmentNote = null
  purExpDate: { type: Date, required: true },
  purPaymentTerm: { type: String, required: true },
  purPaymentNote: { type: String, required: true },
  purPaymentCode: { type: String, required: true }, //tt N là chưa thanh toán , P là đã thanh toán
  purDocDate: { type: Date, required: true },
  purNote: { type: String, required: true },
  purShipmentNote: { type: String, required: true }, //tt in-transit MS neu N & purShipmentNote !=null
  purExpNum: { type: String, required: true },
  purDocCode: { type: String, required: true },
  purImTax: { type: String, required: true },
  purForm: { type: String, required: true },
  purStyle: { type: String, required: true },
  purPartShip: { type: String, required: true},
  purRemaining: {type: Number, required: true},
  status: { type: String, required: true },
});

module.exports = mongoose.model("purchase", purchaseSchema);
