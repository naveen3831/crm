const mongoose = require("mongoose");

const EnquirySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Full name is required."],
      trim: true,
      maxlength: [100, "Full name cannot exceed 100 characters."],
    },
    email: {
      type: String,
      required: [true, "Email address is required."],
      trim: true,
      lowercase: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        "Please enter a valid email address.",
      ],
    },
    phone: {
      type: String,
      trim: true,
      maxlength: [20, "Phone number cannot exceed 20 characters."],
    },
    company: {
      type: String,
      trim: true,
      maxlength: [100, "Company name cannot exceed 100 characters."],
    },
    subject: {
      type: String,
      required: [true, "Subject is required."],
      trim: true,
      maxlength: [150, "Subject cannot exceed 150 characters."],
    },
    message: {
      type: String,
      required: [true, "Message content is required."],
      trim: true,
      maxlength: [1000, "Message cannot exceed 1000 characters."],
    },
    consent: {
      type: Boolean,
      required: [true, "Consent checkbox is required."],
      validate: {
        validator: function (v) {
          return v === true;
        },
        message: "You must agree to having your data processed.",
      },
    },
    status: {
      type: String,
      enum: ["New", "Contacted", "Converted", "Archived"],
      default: "New",
    },
    notes: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Enquiry", EnquirySchema);
