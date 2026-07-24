// Cloudinary storage replaced with AWS S3 Bucket storage
const { uploadToS3, getS3Status } = require("./s3");

module.exports = {
  getCloudinaryStatus: getS3Status,
  uploadToCloudinary: uploadToS3,
};
