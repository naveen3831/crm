const rawBaseUrl = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000").replace(/\/+$/, "");
const UPLOAD_ENDPOINT = rawBaseUrl.endsWith("/api/v1")
  ? `${rawBaseUrl}/upload/image`
  : `${rawBaseUrl}/api/v1/upload/image`;

export interface S3UploadResponse {
  url: string;
  key?: string;
  bucket?: string;
  isS3: boolean;
}

export type CloudinaryUploadResponse = S3UploadResponse & { isCloudinary?: boolean };

/**
 * Utility to convert a browser File to a Base64 string.
 */
export function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => resolve(e.target?.result as string);
    reader.onerror = (error) => reject(error);
    reader.readAsDataURL(file);
  });
}

/**
 * Uploads an image or file (File or Base64 string) to AWS S3 Bucket via the Backend API.
 * If AWS credentials are not yet added in backend/.env, falls back gracefully to the local Base64 string representation.
 */
export async function uploadImageToS3(
  fileOrBase64: File | string,
  folder: string = "crm_uploads"
): Promise<S3UploadResponse> {
  try {
    let base64Data: string;
    if (typeof fileOrBase64 === "string") {
      base64Data = fileOrBase64;
    } else {
      base64Data = await fileToBase64(fileOrBase64);
    }

    const response = await fetch(UPLOAD_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        file: base64Data,
        folder,
      }),
    });

    const result = await response.json();

    if (response.ok && result.success && result.data?.url) {
      return {
        url: result.data.url,
        key: result.data.key,
        bucket: result.data.bucket,
        isS3: true,
      };
    } else {
      console.warn("AWS S3 upload fallback:", result.message || "Using local file representation");
      return {
        url: base64Data,
        isS3: false,
      };
    }
  } catch (error) {
    console.error("AWS S3 Upload Service Error:", error);
    const base64Data = typeof fileOrBase64 === "string" ? fileOrBase64 : await fileToBase64(fileOrBase64);
    return {
      url: base64Data,
      isS3: false,
    };
  }
}

// Alias for backwards compatibility
export const uploadImageToCloudinary = uploadImageToS3;
