const crypto = require("crypto");

/**
 * Checks if AWS S3 environment variables are configured.
 */
function getS3Status() {
  const accessKeyId = process.env.AWS_ACCESS_KEY_ID;
  const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;
  const region = process.env.AWS_REGION || "us-east-1";
  const bucket = process.env.AWS_S3_BUCKET;

  const isConfigured = Boolean(
    accessKeyId &&
    secretAccessKey &&
    bucket &&
    accessKeyId !== "your_aws_access_key_id" &&
    secretAccessKey !== "your_aws_secret_access_key" &&
    bucket !== "your_s3_bucket_name"
  );

  return {
    isConfigured,
    bucket: bucket || null,
    region,
  };
}

/**
 * Calculates AWS SigV4 signing key derivation
 */
function getSignatureKey(key, dateStamp, regionName, serviceName) {
  const kDate = crypto.createHmac("sha256", "AWS4" + key).update(dateStamp).digest();
  const kRegion = crypto.createHmac("sha256", kDate).update(regionName).digest();
  const kService = crypto.createHmac("sha256", kRegion).update(serviceName).digest();
  const kSigning = crypto.createHmac("sha256", kService).update("aws4_request").digest();
  return kSigning;
}

/**
 * Uploads a file (Base64 string) to an AWS S3 Bucket using AWS SigV4 REST API.
 * @param {Object} options
 * @param {string} options.file - Base64 Data URL or string
 * @param {string} [options.folder='crm_uploads'] - Target S3 folder prefix
 * @returns {Promise<{url: string, key: string, bucket: string}>}
 */
async function uploadToS3({ file, folder = "crm_uploads" }) {
  const accessKeyId = process.env.AWS_ACCESS_KEY_ID;
  const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;
  const region = process.env.AWS_REGION || "us-east-1";
  const bucket = process.env.AWS_S3_BUCKET;

  const status = getS3Status();
  if (!status.isConfigured) {
    throw new Error(
      "AWS S3 credentials (AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY, AWS_S3_BUCKET) are missing or set to defaults in backend/.env"
    );
  }

  // 1. Extract Mime-Type and Buffer from Base64 Data URL
  let buffer;
  let contentType = "application/octet-stream";
  let extension = "png";

  if (file.startsWith("data:")) {
    const matches = file.match(/^data:([^;]+);base64,(.+)$/);
    if (matches) {
      contentType = matches[1];
      buffer = Buffer.from(matches[2], "base64");
      const extMatch = contentType.split("/")[1];
      if (extMatch) extension = extMatch.split("+")[0];
    } else {
      buffer = Buffer.from(file, "base64");
    }
  } else {
    buffer = Buffer.from(file, "base64");
  }

  // 2. Generate unique object key
  const uniqueName = `${Date.now()}_${crypto.randomBytes(6).toString("hex")}.${extension}`;
  const objectKey = folder ? `${folder}/${uniqueName}` : uniqueName;

  // 3. Prepare AWS SigV4 signing parameters
  const now = new Date();
  const amzDate = now.toISOString().replace(/[:\-]|\.\d{3}/g, ""); // YYYYMMDDTHHMMSSZ
  const dateStamp = amzDate.substring(0, 8); // YYYYMMDD

  const host = `${bucket}.s3.${region}.amazonaws.com`;
  const endpointUrl = `https://${host}/${objectKey}`;

  const payloadHash = crypto.createHash("sha256").update(buffer).digest("hex");

  // Canonical headers (sorted alphabetically in lowercase)
  const canonicalHeaders =
    `content-type:${contentType}\n` +
    `host:${host}\n` +
    `x-amz-content-sha256:${payloadHash}\n` +
    `x-amz-date:${amzDate}\n`;

  const signedHeaders = "content-type;host;x-amz-content-sha256;x-amz-date";

  // Canonical Request
  const canonicalRequest =
    `PUT\n` +
    `/${objectKey}\n` +
    `\n` +
    `${canonicalHeaders}\n` +
    `${signedHeaders}\n` +
    `${payloadHash}`;

  const requestHash = crypto.createHash("sha256").update(canonicalRequest).digest("hex");
  const credentialScope = `${dateStamp}/${region}/s3/aws4_request`;

  // String to Sign
  const stringToSign =
    `AWS4-HMAC-SHA256\n` +
    `${amzDate}\n` +
    `${credentialScope}\n` +
    `${requestHash}`;

  // Signature calculation
  const signingKey = getSignatureKey(secretAccessKey, dateStamp, region, "s3");
  const signature = crypto.createHmac("sha256", signingKey).update(stringToSign).digest("hex");

  const authorizationHeader =
    `AWS4-HMAC-SHA256 ` +
    `Credential=${accessKeyId}/${credentialScope}, ` +
    `SignedHeaders=${signedHeaders}, ` +
    `Signature=${signature}`;

  // 4. Send HTTP PUT request to AWS S3
  const response = await fetch(endpointUrl, {
    method: "PUT",
    headers: {
      "Content-Type": contentType,
      Host: host,
      "x-amz-date": amzDate,
      "x-amz-content-sha256": payloadHash,
      Authorization: authorizationHeader,
    },
    body: buffer,
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`AWS S3 Upload Failed (${response.status}): ${errorText || response.statusText}`);
  }

  return {
    url: endpointUrl,
    key: objectKey,
    bucket,
  };
}

module.exports = {
  getS3Status,
  uploadToS3,
};
