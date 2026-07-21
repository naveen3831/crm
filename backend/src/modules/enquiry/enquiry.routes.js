const express = require("express");
const router = express.Router();
const {
  createEnquiry,
  getEnquiries,
  getEnquiryById,
  updateEnquiry,
} = require("./enquiry.controller");

// Public route to submit contact forms
router.post("/", createEnquiry);

// Secure routes (verification middlewares can be attached here in later phases)
router.get("/", getEnquiries);
router.get("/:id", getEnquiryById);
router.put("/:id", updateEnquiry);

module.exports = router;
