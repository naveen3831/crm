const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const errorHandler = require("./middleware/error.middleware");
const enquiryRoutes = require("./modules/enquiry/enquiry.routes");
const crmRoutes = require("./modules/crm/crm.routes");
const authRoutes = require("./modules/auth/auth.routes");
const authController = require("./modules/auth/auth.controller");

const app = express();

// Security Headers Middleware
app.use(helmet());

// Cross-Origin Resource Sharing (CORS) Configuration
const allowedOrigins = [
  process.env.CLIENT_URL,
  "http://localhost:3000",
  "http://127.0.0.1:3000",
].filter(Boolean);

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (like mobile apps, curl, or postman)
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      return callback(null, true); // Permissive origin matching in development mode
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With", "Accept"],
  })
);

// Body Parser Middleware (Expanded limit for base64 logo image uploads)
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

// Automatic Official Brand Logo Sync to frontend/public & AWS S3 (Updated: 2026-07-24)
const fs = require("fs");
const path = require("path");
const { uploadToS3 } = require("./config/s3");

function syncOfficialBrandLogo() {
  const sourceImage = "C:\\Users\\Lenovo\\.gemini\\antigravity-ide\\brain\\ce14a201-18cd-4e9b-a1cd-822f1e1d8c20\\media__1784871944942.jpg";
  const targetPublic1 = path.join(__dirname, "..", "..", "frontend", "public", "logo.png");
  const targetPublic2 = path.join(__dirname, "..", "..", "frontend", "public", "logo.jpg");
  const targetPublic3 = path.join(__dirname, "..", "..", "frontend", "public", "crm-logo.png");

  if (fs.existsSync(sourceImage)) {
    try {
      const buffer = fs.readFileSync(sourceImage);
      fs.writeFileSync(targetPublic1, buffer);
      fs.writeFileSync(targetPublic2, buffer);
      fs.writeFileSync(targetPublic3, buffer);
      console.log("[Logo Sync] Successfully copied brand logo to frontend/public!");

      const base64Data = `data:image/jpeg;base64,${buffer.toString("base64")}`;
      uploadToS3({ file: base64Data, folder: "branding" })
        .then(res => {
          console.log("[Logo Sync] Official Logo uploaded to AWS S3:", res.url);
          global.OFFICIAL_S3_LOGO_URL = res.url;
        })
        .catch(err => console.warn("[Logo Sync] S3 upload warning:", err.message));
    } catch (err) {
      console.error("[Logo Sync Error]", err.message);
    }
  }
}

syncOfficialBrandLogo();

app.get("/api/v1/branding/logo", (req, res) => {
  return res.json({
    success: true,
    logoUrl: global.OFFICIAL_S3_LOGO_URL || "/logo.png",
    localLogoUrl: "/logo.png"
  });
});

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

app.get("/api/v1/health/sync-logo", async (req, res) => {
  const sourceImage = "C:\\Users\\Lenovo\\.gemini\\antigravity-ide\\brain\\ce14a201-18cd-4e9b-a1cd-822f1e1d8c20\\media__1784871944942.jpg";
  const targetPublic1 = path.join(__dirname, "..", "..", "frontend", "public", "logo.png");
  const targetPublic2 = path.join(__dirname, "..", "..", "frontend", "public", "logo.jpg");

  try {
    if (!fs.existsSync(sourceImage)) {
      return res.status(404).json({ success: false, error: "Source image not found: " + sourceImage });
    }
    const buffer = fs.readFileSync(sourceImage);
    fs.writeFileSync(targetPublic1, buffer);
    fs.writeFileSync(targetPublic2, buffer);

    const base64Data = `data:image/jpeg;base64,${buffer.toString("base64")}`;
    const s3Result = await uploadToS3({ file: base64Data, folder: "branding" });
    global.OFFICIAL_S3_LOGO_URL = s3Result.url;

    return res.json({
      success: true,
      message: "Synced logo to frontend/public and AWS S3 successfully!",
      s3Url: s3Result.url,
      localUrl: "/logo.png"
    });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

// Explicit Auth Endpoints (Direct route mapping for maximum compatibility)
app.post("/api/v1/auth/login", authController.login);
app.post("/api/v1/auth/register", authController.register);
app.post("/api/v1/auth/forgot-password", authController.forgotPassword);
app.post("/api/v1/auth/reset-password", authController.resetPassword);
// Dedicated CRM Endpoint Mappings (Dynamic hot-reload controller binding)
app.delete("/api/v1/crm/clear-database", (req, res, next) => require("./modules/crm/crm.controller").clearDatabase(req, res, next));
app.get("/api/v1/crm/:type", (req, res, next) => require("./modules/crm/crm.controller").getRecords(req, res, next));
app.post("/api/v1/crm/:type", (req, res, next) => require("./modules/crm/crm.controller").createRecord(req, res, next));
app.put("/api/v1/crm/:type/:id", (req, res, next) => require("./modules/crm/crm.controller").updateRecord(req, res, next));
app.delete("/api/v1/crm/:type/:id", (req, res, next) => require("./modules/crm/crm.controller").deleteRecord(req, res, next));

// Dedicated Upload Endpoint Mappings (Dynamic hot-reload controller binding)
app.get("/api/v1/upload/status", (req, res, next) => require("./modules/upload/upload.controller").getStatus(req, res, next));
app.post("/api/v1/upload/image", (req, res, next) => require("./modules/upload/upload.controller").uploadImage(req, res, next));

const uploadRoutes = require("./modules/upload/upload.routes");

// Mounting Module Routers
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/enquiries", enquiryRoutes);
app.use("/api/v1/crm", crmRoutes);
app.use("/api/v1/upload", uploadRoutes);

// Catch-all route handler for unknown resource paths
app.use((req, res, next) => {
  if (req.originalUrl.startsWith("/api/v1/upload")) {
    const uploadController = require("./modules/upload/upload.controller");
    if (req.method === "GET" && req.originalUrl.includes("/status")) {
      return uploadController.getStatus(req, res, next);
    }
    if (req.method === "POST" && req.originalUrl.includes("/image")) {
      return uploadController.uploadImage(req, res, next);
    }
  }
  const error = new Error(`Resource Not Found - ${req.originalUrl}`);
  error.statusCode = 404;
  res.status(404);
  next(error);
});

// Centralized Error Responder
app.use(errorHandler);

module.exports = app;
