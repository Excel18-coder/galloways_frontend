/**
 * Asset URL helper for consistent asset path resolution
 * Handles both development and production environments
 */

// Get base URL from environment or fallback to current origin
const getBaseUrl = (): string => {
  if (typeof window !== 'undefined') {
    // Client-side: use environment variable or current origin
    return import.meta.env.VITE_BASE_URL || window.location.origin;
  }
  // Server-side: use environment variable or fallback
  return import.meta.env.VITE_BASE_URL || '';
};

/**
 * Resolve asset URL with proper base path
 * @param path - Asset path (should start with /)
 * @returns Complete asset URL
 */
export const getAssetUrl = (path: string): string => {
  if (!path) return '';

  // If path is already a complete URL, return as-is
  if (path.startsWith('http://') || path.startsWith('https://')) {
    return path;
  }

  // Ensure path starts with /
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;

  const baseUrl = getBaseUrl();

  // Remove trailing slash from baseUrl and combine with path
  const cleanBaseUrl = baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl;

  return `${cleanBaseUrl}${normalizedPath}`;
};

/**
 * Get logo asset URL
 */
export const getLogoUrl = (filename: string): string => {
  return getAssetUrl(`/LOGOS/${filename}`);
};

/**
 * Get picture asset URL
 */
export const getPictureUrl = (filename: string): string => {
  return getAssetUrl(`/pictures/${filename}`);
};

/**
 * Get download asset URL
 */
export const getDownloadUrl = (filename: string): string => {
  return getAssetUrl(`/Downloads/${filename}`);
};

/**
 * Get main logo URL
 */
export const getMainLogoUrl = (): string => {
  return getAssetUrl('/favicon_io/android-chrome-512x512.png');
};
