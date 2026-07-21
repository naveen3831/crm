const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const errorHandler = require("./middleware/error.middleware");
const enquiryRoutes = require("./modules/enquiry/enquiry.routes");
const crmRoutes = require("./modules/crm/crm.routes");

const app = express();

// Security Headers Middleware
app.use(helmet());

// Cross-Origin Requests Setup
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:3000",
    credentials: true,
  })
);

// Body Parser Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request Logging Middleware
if (process.env.NODE_ENV === "development" || !process.env.NODE_ENV) {
  app.use(morgan("dev"));
}

// Health Check API
app.get("/api/v1/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "CRM API server is active and healthy.",
    timestamp: new Date(),
  });
});

// Mounting Module Routes
app.use("/api/v1/enquiries", enquiryRoutes);
app.use("/api/v1/crm", crmRoutes);

// Catch-all route handler for unknown resource paths
app.use((req, res, next) => {
  const error = new Error(`Resource Not Found - ${req.originalUrl}`);
  res.status(404);
  next(error);
});

// Centralized Error Responder
app.use(errorHandler);

module.exports = app;
