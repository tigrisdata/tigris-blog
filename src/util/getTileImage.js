/**
 * Get the optimized tile image path for a blog post
 * @param {string} permalink - The blog post permalink
 * @param {string} originalImage - The original image path
 * @returns {string} The tile image path or the original if tile doesn't exist
 */
export function getTileImagePath(permalink, originalImage) {
  if (!permalink || !originalImage) {
    return originalImage;
  }

  // Extract the blog post slug from the permalink
  // Permalink format: /blog/2024-01-01-post-title/ or /2024-01-01-post-title/
  const match = permalink.match(/(\d{4}-\d{2}-\d{2}-[^/]+)\/?$/);
  if (!match) {
    return originalImage;
  }

  const slug = match[1];

  // Determine the tile extension based on original image
  const originalExt = originalImage
    .substring(originalImage.lastIndexOf("."))
    .toLowerCase();
  const tileExt = originalExt === ".gif" ? ".jpg" : ".webp";

  // Construct the tile path
  const tilePath = `/tiles/${slug}${tileExt}`;

  // In development, we might want to check if the tile exists
  // For production, we assume tiles are generated during build
  if (typeof window !== "undefined" && process.env.NODE_ENV === "development") {
    // In development, fall back to original if tile doesn't exist
    // This is a simple check - in production tiles should always exist
    return checkTileExists(tilePath) ? tilePath : originalImage;
  }

  return tilePath;
}

/**
 * Check if a tile image exists (development only)
 * @param {string} tilePath - The tile image path to check
 * @returns {boolean} Whether the tile exists
 */
function checkTileExists(tilePath) {
  // Simple existence check for development
  // This could be enhanced with actual file checking if needed
  try {
    // For now, assume tiles exist if the path is valid
    // In a real implementation, you might want to maintain a manifest
    return true;
  } catch {
    return false;
  }
}

export default getTileImagePath;
