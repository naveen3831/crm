const mongoose = require("mongoose");

const ProjectSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true },
    name: { type: String },
    title: { type: String },
    clientName: { type: String },
    category: { type: String },
    manager: { type: String },
    budget: { type: Number, default: 0 },
    deadline: { type: String },
    status: { type: String, default: "Planning" },
    progress: { type: Number, default: 0 },
    description: { type: String }
  },
  { strict: false, timestamps: true, collection: "projects" }
);

module.exports = mongoose.models.Project || mongoose.model("Project", ProjectSchema);
