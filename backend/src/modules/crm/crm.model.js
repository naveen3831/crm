const mongoose = require("mongoose");

const CRMRecordSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      required: true,
      enum: [
        "client",
        "call",
        "lead",
        "project",
        "quotation",
        "feature",
        "innovation",
        "invoice",
        "payment",
        "expense",
        "user",
        "employee",
        "team"
      ]
    },
    // We store the unique business ID (like CLI-1002, PRJ-901, etc.) at the top level for fast indexing
    customId: {
      type: String,
      required: true,
      unique: true
    },
    data: {
      type: mongoose.Schema.Types.Mixed,
      required: true
    }
  },
  {
    timestamps: true
  }
);

// Add text search index on customId and data content for global dashboard search
CRMRecordSchema.index({ customId: "text", "data.name": "text", "data.company": "text", "data.clientName": "text" });

module.exports = mongoose.model("CRMRecord", CRMRecordSchema);
