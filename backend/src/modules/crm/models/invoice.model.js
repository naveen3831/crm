const mongoose = require("mongoose");

if (mongoose.models.Invoice) {
  delete mongoose.models.Invoice;
}

const InvoiceSchema = new mongoose.Schema(
  {
    id: { type: String },
    number: { type: String, required: true },
    title: { type: String, required: true },
    projectId: { type: String },
    projectName: { type: String },
    clientName: { type: String },
    issueDate: { type: String },
    dueDate: { type: String },
    status: { type: String, default: "Sent" }, // "Draft", "Sent", "Paid", "Overdue", "Cancelled"
    currency: { type: String, default: "INR" },
    subtotal: { type: Number, default: 0 },
    taxRate: { type: Number, default: 18 },
    taxAmount: { type: Number, default: 0 },
    discount: { type: Number, default: 0 },
    totalAmount: { type: Number, default: 0 },
    lineItems: { type: Array, default: [] },
    notes: { type: String },
    paymentTerms: { type: String }
  },
  { strict: false, timestamps: true, collection: "invoices" }
);

module.exports = mongoose.model("Invoice", InvoiceSchema);
