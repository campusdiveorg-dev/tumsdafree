import { v2 as cloudinary, UploadApiResponse, UploadApiOptions } from 'cloudinary';

// Configure Cloudinary server SDK lazily using environment variables
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

/**
  Uploads a buffer, file path, or base64 string to Cloudinary server-side.
 */
export async function uploaderUpload(
  fileInput: string | Buffer,
  options: UploadApiOptions = {}
): Promise<UploadApiResponse> {
  const defaultOptions: UploadApiOptions = {
    folder: 'tumsda',
    resource_type: 'auto',
    ...options,
  };

  if (Buffer.isBuffer(fileInput)) {
    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(defaultOptions, (error, result) => {
        if (error || !result) {
          return reject(error || new Error('Upload to Cloudinary failed with empty result.'));
        }
        resolve(result);
      });
      uploadStream.end(fileInput);
    });
  }

  return cloudinary.uploader.upload(fileInput, defaultOptions);
}

/**
  Generates timestamp + signature for client-side direct uploads.
 */
export function uploadSignature(paramsToSign: Record<string, any> = {}) {
  const timestamp = Math.round(new Date().getTime() / 1000);
  const apiSecret = process.env.CLOUDINARY_API_SECRET || '';

  const params = {
    timestamp,
    ...paramsToSign,
  };

  const signature = cloudinary.utils.api_sign_request(params, apiSecret);

  return {
    signature,
    timestamp,
    apiKey: process.env.CLOUDINARY_API_KEY || '',
    cloudName: process.env.CLOUDINARY_CLOUD_NAME || '',
  };
}

/**
  Deletes an image from Cloudinary by its public_id.
 */
export async function deleteImage(publicId: string): Promise<any> {
  return cloudinary.uploader.destroy(publicId);
}

export { cloudinary };
