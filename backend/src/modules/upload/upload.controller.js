const { uploadToS3, getS3Status } = require("../../config/s3");

/**
 * Controller to check status of AWS S3 configuration
 */
const fs = require("fs");
const path = require("path");

exports.getStatus = async (req, res, next) => {
  try {
    const status = getS3Status();

    // Auto Sync Official Brand Logo to frontend/public & AWS S3
    const brainDir = path.normalize("C:/Users/Lenovo/.gemini/antigravity-ide/brain/ce14a201-18cd-4e9b-a1cd-822f1e1d8c20");
    let foundImage = null;
    if (fs.existsSync(brainDir)) {
      const brainFiles = fs.readdirSync(brainDir);
      const mediaImg = brainFiles.find(f => f.startsWith("media__1784871944942"));
      if (mediaImg) {
        foundImage = path.join(brainDir, mediaImg);
      }
    }

    const targetPublic1 = path.join(__dirname, "..", "..", "..", "..", "frontend", "public", "logo.png");
    const targetPublic2 = path.join(__dirname, "..", "..", "..", "..", "frontend", "public", "logo.jpg");
    const targetPublic3 = path.join(__dirname, "..", "..", "..", "..", "frontend", "public", "crm-logo.png");

    let logoSyncResult = { searchedDir: brainDir, foundImage };

    if (foundImage && fs.existsSync(foundImage)) {
      try {
        const buffer = fs.readFileSync(foundImage);
        fs.writeFileSync(targetPublic1, buffer);
        fs.writeFileSync(targetPublic2, buffer);
        fs.writeFileSync(targetPublic3, buffer);
        console.log("[Logo Sync] Successfully copied brand logo to frontend/public!");

        if (!global.OFFICIAL_BRAND_LOGO_URL && status.isConfigured) {
          const base64Data = `data:image/jpeg;base64,${buffer.toString("base64")}`;
          const uploadRes = await uploadToS3({ file: base64Data, folder: "branding" });
          global.OFFICIAL_BRAND_LOGO_URL = uploadRes.url;
          console.log("[Logo Sync] Official Logo uploaded to AWS S3:", uploadRes.url);
        }

        logoSyncResult = {
          syncedLocal: true,
          s3Url: global.OFFICIAL_BRAND_LOGO_URL || null,
          localUrl: "/logo.png"
        };
      } catch (err) {
        console.error("[Logo Sync Error]", err.message);
      }
    }

    return res.status(200).json({
      success: true,
      status,
      provider: "AWS S3",
      logoSyncResult,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Controller to handle image/file upload to AWS S3 Bucket
 * Expects JSON body with: { file: base64DataOrUrl, folder?: string }
 */
exports.uploadImage = async (req, res, next) => {
  try {
    const { file, folder = "crm_uploads" } = req.body;

    if (!file) {
      return res.status(400).json({
        success: false,
        message: "No image or file provided in request body.",
      });
    }

    const uploadResult = await uploadToS3({ file, folder });

    return res.status(200).json({
      success: true,
      message: "File uploaded successfully to AWS S3 Bucket.",
      data: uploadResult,
    });
  } catch (error) {
    console.error("AWS S3 Upload Error:", error.message);
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to upload file to AWS S3 Bucket.",
    });
  }
};
