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

  // During SSR/build, we can't easily check if the file exists
  // So we'll return the tile path and add a fallback mechanism
  // The component using this should handle fallback to original image
  return tilePath;
}

export default getTileImagePath;
