const mongoose = require("mongoose");

const LeadSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    companyName: { type: String },
    phone: { type: String },
    interestedService: { type: String },
    expectedBudget: { type: Number, default: 0 },
    source: { type: String },
    status: { type: String, default: "New" }
  },
  { timestamps: true, collection: "leads" }
);

module.exports = mongoose.models.Lead || mongoose.model("Lead", LeadSchema);
