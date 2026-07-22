const mongoose = require("mongoose");

const ClientSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    company: { type: String },
    email: { type: String, required: true },
    phone: { type: String },
    whatsapp: { type: String },
    address: { type: String },
    industry: { type: String },
    type: { type: String, default: "Potential" },
    assignedEmployee: { type: String },
    status: { type: String, default: "Active" },
    notes: { type: String },
    createdDate: { type: String }
  },
  { timestamps: true, collection: "clients" }
);

module.exports = mongoose.models.Client || mongoose.model("Client", ClientSchema);
