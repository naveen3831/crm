const mongoose = require("mongoose");

if (mongoose.models.Quotation) {
  delete mongoose.models.Quotation;
}

const QuotationSchema = new mongoose.Schema(
  {
    id: { type: String },
    number: { type: String, required: true },
    title: { type: String, required: true },
    clientName: { type: String },
    date: { type: String },
    validUntil: { type: String },
    status: { type: String, default: "Approved" },
    tax: { type: Number, default: 0 },
    discount: { type: Number, default: 0 },
    serviceItems: { type: Array, default: [] }
  },
  { strict: false, timestamps: true, collection: "quotations" }
);

module.exports = mongoose.model("Quotation", QuotationSchema);
