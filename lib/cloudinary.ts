import { v2 as cloudinary } from 'cloudinary';

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

export default cloudinary;

// Upload options type
export interface UploadToCloudinaryOptions {
  folder: string;
  transformation?: any[];
  resourceType?: 'image' | 'video' | 'raw' | 'auto';
  publicId?: string;
}

// Upload result type
export interface CloudinaryUploadResponse {
  public_id: string;
  version: number;
  signature: string;
  width: number;
  height: number;
  format: string;
  resource_type: string;
  created_at: string;
  tags: string[];
  bytes: number;
  type: string;
  etag: string;
  placeholder: boolean;
  url: string;
  secure_url: string;
  folder?: string;
  original_filename?: string;
}

/**
 * Upload a file buffer to Cloudinary
 * @param buffer - File buffer to upload
 * @param options - Upload options
 * @returns Promise with Cloudinary upload result
 */
export async function uploadToCloudinary(
  buffer: Buffer,
  options: UploadToCloudinaryOptions
): Promise<CloudinaryUploadResponse> {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: `advermo/${options.folder}`,
        resource_type: options.resourceType || 'image',
        transformation: options.transformation || [
          { width: 1200, height: 800, crop: 'limit' },
          { quality: 'auto' },
          { fetch_format: 'auto' },
        ],
        ...(options.publicId && { public_id: options.publicId }),
      },
      (error, result) => {
        if (error) {
          console.error('Cloudinary upload error:', error);
          reject(error);
        } else if (result) {
          resolve(result);
        } else {
          reject(new Error('Upload failed with no result'));
        }
      }
    );

    uploadStream.end(buffer);
  });
}

/**
 * Delete an image from Cloudinary
 * @param publicId - The public ID of the image to delete
 * @returns Promise with deletion result
 */
export async function deleteFromCloudinary(publicId: string): Promise<any> {
  try {
    const result = await cloudinary.uploader.destroy(publicId);
    return result;
  } catch (error) {
    console.error('Cloudinary delete error:', error);
    throw error;
  }
}

/**
 * Get optimized image URL from Cloudinary
 * @param publicId - The public ID of the image
 * @param options - Transformation options
 * @returns Optimized image URL
 */
export function getOptimizedImageUrl(
  publicId: string,
  options: {
    width?: number;
    height?: number;
    crop?: string;
    quality?: string | number;
    format?: string;
  } = {}
): string {
  const {
    width,
    height,
    crop = 'limit',
    quality = 'auto',
    format = 'auto',
  } = options;

  const transformations = [];
  
  if (width || height) {
    transformations.push(`c_${crop}`);
    if (width) transformations.push(`w_${width}`);
    if (height) transformations.push(`h_${height}`);
  }
  
  transformations.push(`q_${quality}`);
  transformations.push(`f_${format}`);

  const baseUrl = `https://res.cloudinary.com/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`;
  const transformation = transformations.join(',');
  
  return `${baseUrl}/${transformation}/${publicId}`;
}

/**
 * Generate responsive image srcset
 * @param publicId - The public ID of the image
 * @returns Object with srcset and sizes
 */
export function getResponsiveImageSrcSet(publicId: string): {
  srcSet: string;
  sizes: string;
} {
  const widths = [320, 640, 768, 1024, 1280, 1536];
  const srcSet = widths
    .map((width) => {
      const url = getOptimizedImageUrl(publicId, { width });
      return `${url} ${width}w`;
    })
    .join(', ');

  const sizes = '(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw';

  return { srcSet, sizes };
}
