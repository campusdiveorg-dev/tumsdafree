/**
  Cloudinary URL delivery and transformation helper for TUMSDA Next.js app.
  Provides auto-optimization (f_auto, q_auto), responsive sizing, and
  seamless fallback to legacy local asset paths (/assets/img/...).
 */

interface ImageSourceItem {
  cloudinary_secure_url?: string | null;
  cloudinarySecureUrl?: string | null;
  cloudinary_public_id?: string | null;
  cloudinaryPublicId?: string | null;
  photo_path?: string | null;
  photoPath?: string | null;
  icon_path?: string | null;
  iconPath?: string | null;
  logo_path?: string | null;
  logoPath?: string | null;
  image_url?: string | null;
  imageUrl?: string | null;
  [key: string]: any;
}

interface ImageTransformOptions {
  width?: number;
  height?: number;
  crop?: 'fill' | 'fit' | 'limit' | 'thumb' | 'scale';
  quality?: 'auto' | number;
  format?: 'auto' | 'webp' | 'png' | 'jpg';
  fallbackPath?: string;
}

/**
  Resolves the best available image URL from a DB item or string path.
 */
export function getImageUrl(
  itemOrPath: ImageSourceItem | string | null | undefined,
  options: ImageTransformOptions = {}
): string {
  const { fallbackPath = '/assets/img/logo.jpg' } = options;

  if (!itemOrPath) {
    return formatLocalPath(fallbackPath);
  }

  // Handle plain string path passed directly
  if (typeof itemOrPath === 'string') {
    if (itemOrPath.startsWith('http://') || itemOrPath.startsWith('https://')) {
      return itemOrPath;
    }
    return formatLocalPath(itemOrPath);
  }

  // 1. Prefer direct Cloudinary secure URL
  const secureUrl = itemOrPath.cloudinary_secure_url || itemOrPath.cloudinarySecureUrl;
  const publicId = itemOrPath.cloudinary_public_id || itemOrPath.cloudinaryPublicId;
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || process.env.CLOUDINARY_CLOUD_NAME;

  if (publicId && cloudName) {
    return buildCloudinaryUrl(publicId, cloudName, options);
  }

  if (secureUrl) {
    return applyUrlTransformations(secureUrl, options);
  }

  // 2. Fall back to local DB asset fields
  const localField =
    itemOrPath.photo_path ||
    itemOrPath.photoPath ||
    itemOrPath.icon_path ||
    itemOrPath.iconPath ||
    itemOrPath.logo_path ||
    itemOrPath.logoPath ||
    itemOrPath.image_url ||
    itemOrPath.imageUrl;

  if (localField) {
    return formatLocalPath(localField);
  }

  return formatLocalPath(fallbackPath);
}

/**
  Formats a local asset path, ensuring leading slash.
 */
export function formatLocalPath(pathStr: string): string {
  if (!pathStr) return '/assets/img/logo.jpg';
  if (pathStr.startsWith('http://') || pathStr.startsWith('https://')) return pathStr;
  const clean = pathStr.replace(/^\/?(public\/)?/, '');
  return clean.startsWith('/') ? clean : `/${clean}`;
}

/**
  Builds a Cloudinary delivery URL with f_auto, q_auto and optional dimensions.
 */
function buildCloudinaryUrl(publicId: string, cloudName: string, options: ImageTransformOptions): string {
  const transforms: string[] = ['f_auto', 'q_auto'];

  if (options.width) transforms.push(`w_${options.width}`);
  if (options.height) transforms.push(`h_${options.height}`);
  if (options.crop) transforms.push(`c_${options.crop}`);

  const transformStr = transforms.join(',');
  const cleanPublicId = publicId.replace(/^\//, '');

  return `https://res.cloudinary.com/${cloudName}/image/upload/${transformStr}/${cleanPublicId}`;
}

/**
  Applies transformations to an existing Cloudinary secure_url string.
 */
function applyUrlTransformations(secureUrl: string, options: ImageTransformOptions): string {
  if (!secureUrl.includes('res.cloudinary.com')) return secureUrl;

  const transforms: string[] = ['f_auto', 'q_auto'];
  if (options.width) transforms.push(`w_${options.width}`);
  if (options.height) transforms.push(`h_${options.height}`);
  if (options.crop) transforms.push(`c_${options.crop}`);

  const transformStr = transforms.join(',');
  return secureUrl.replace('/upload/', `/upload/${transformStr}/`);
}

