const mongoose = require("mongoose");

if (mongoose.models.OurProject) {
  delete mongoose.models.OurProject;
}

const OurProjectSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    category: { type: String },
    clientName: { type: String },
    budget: { type: Number, default: 0 },
    status: { type: String, default: "Live Production" },
    description: { type: String },
    liveUrl: { type: String },
    completionDate: { type: String }
  },
  { strict: false, timestamps: true, collection: "ourprojects" }
);

module.exports = mongoose.model("OurProject", OurProjectSchema);
