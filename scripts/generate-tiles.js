#!/usr/bin/env node

/**
 * Script to generate optimized tile images for blog posts
 * Runs during build to create smaller, web-optimized versions of blog images
 */

const fs = require("fs").promises;
const path = require("path");
const sharp = require("sharp");

// Configuration
const BLOG_DIR = path.join(__dirname, "../blog");
const TILES_DIR = path.join(__dirname, "../static/tiles");
const TILE_WIDTH = 400; // Width for tile images
const TILE_HEIGHT = 225; // 16:9 aspect ratio
const QUALITY = 85; // Quality for WebP/JPEG (1-100)

// Supported image formats
const IMAGE_EXTENSIONS = [".jpg", ".jpeg", ".png", ".webp", ".gif"];

/**
 * Ensure the tiles directory exists
 */
async function ensureTilesDirectory() {
  try {
    await fs.mkdir(TILES_DIR, { recursive: true });
    console.log(`✓ Tiles directory ready: ${TILES_DIR}`);
  } catch (error) {
    console.error("Failed to create tiles directory:", error);
    throw error;
  }
}

/**
 * Get all blog post directories
 */
async function getBlogPostDirs() {
  try {
    const entries = await fs.readdir(BLOG_DIR, { withFileTypes: true });
    return entries
      .filter((entry) => entry.isDirectory())
      .map((entry) => path.join(BLOG_DIR, entry.name));
  } catch (error) {
    console.error("Failed to read blog directory:", error);
    throw error;
  }
}

/**
 * Find the first image in a blog post directory
 */
async function findFirstImage(dirPath) {
  try {
    const files = await fs.readdir(dirPath);

    // Look for explicitly named cover/header images first
    const priorityPatterns = [
      /^cover\./i,
      /^header\./i,
      /^hero\./i,
      /^featured\./i,
      /^thumbnail\./i,
    ];

    for (const pattern of priorityPatterns) {
      const priorityImage = files.find(
        (file) =>
          pattern.test(file) &&
          IMAGE_EXTENSIONS.includes(path.extname(file).toLowerCase())
      );
      if (priorityImage) {
        return path.join(dirPath, priorityImage);
      }
    }

    // Otherwise, find the first image file
    const firstImage = files.find((file) => {
      const ext = path.extname(file).toLowerCase();
      return IMAGE_EXTENSIONS.includes(ext);
    });

    return firstImage ? path.join(dirPath, firstImage) : null;
  } catch (error) {
    console.error(`Failed to read directory ${dirPath}:`, error);
    return null;
  }
}

/**
 * Generate a tile filename based on the blog post directory
 */
function getTileFilename(blogPostDir, originalExt) {
  const dirName = path.basename(blogPostDir);
  // Use WebP for better compression, fallback to JPEG for GIFs
  const ext = originalExt.toLowerCase() === ".gif" ? ".jpg" : ".webp";
  return `${dirName}${ext}`;
}

/**
 * Check if tile needs regeneration
 */
async function shouldRegenerateTile(sourcePath, tilePath) {
  try {
    const [sourceStats, tileStats] = await Promise.all([
      fs.stat(sourcePath),
      fs.stat(tilePath).catch(() => null),
    ]);

    // Generate if tile doesn't exist or source is newer
    return !tileStats || sourceStats.mtime > tileStats.mtime;
  } catch (error) {
    return true; // Generate on any error
  }
}

/**
 * Process a single image to create a tile
 */
async function processImage(sourcePath, tilePath) {
  try {
    const ext = path.extname(sourcePath).toLowerCase();

    // Check if regeneration is needed
    const shouldRegenerate = await shouldRegenerateTile(sourcePath, tilePath);
    if (!shouldRegenerate) {
      console.log(`  ↻ Skipping (up-to-date): ${path.basename(tilePath)}`);
      return { skipped: true };
    }

    const startTime = Date.now();
    const sourceStats = await fs.stat(sourcePath);
    const sourceSizeKB = Math.round(sourceStats.size / 1024);

    let pipeline = sharp(sourcePath).resize(TILE_WIDTH, TILE_HEIGHT, {
      fit: "cover",
      position: "center",
    });

    // Output format based on extension
    if (tilePath.endsWith(".webp")) {
      pipeline = pipeline.webp({
        quality: QUALITY,
        effort: 4, // Balance between compression and speed (0-6)
      });
    } else {
      pipeline = pipeline.jpeg({
        quality: QUALITY,
        progressive: true,
        mozjpeg: true, // Use mozjpeg encoder for better compression
      });
    }

    // Process and save
    await pipeline.toFile(tilePath);

    // Get output file size
    const tileStats = await fs.stat(tilePath);
    const tileSizeKB = Math.round(tileStats.size / 1024);
    const reduction = Math.round(
      ((sourceSizeKB - tileSizeKB) / sourceSizeKB) * 100
    );
    const processingTime = Date.now() - startTime;

    console.log(
      `  ✓ Generated: ${path.basename(tilePath)} ` +
        `(${sourceSizeKB}KB → ${tileSizeKB}KB, -${reduction}%, ${processingTime}ms)`
    );

    return {
      success: true,
      sourceSizeKB,
      tileSizeKB,
      reduction,
      processingTime,
    };
  } catch (error) {
    console.error(`  ✗ Failed to process ${sourcePath}:`, error.message);
    return { error: error.message };
  }
}

/**
 * Main function to generate all tiles
 */
async function generateTiles() {
  console.log("🖼️  Starting tile generation...\n");

  try {
    // Ensure tiles directory exists
    await ensureTilesDirectory();

    // Get all blog post directories
    const blogDirs = await getBlogPostDirs();
    console.log(`Found ${blogDirs.length} blog posts\n`);

    let processed = 0;
    let skipped = 0;
    let failed = 0;
    let totalSourceSize = 0;
    let totalTileSize = 0;

    // Process each blog post
    for (const blogDir of blogDirs) {
      const dirName = path.basename(blogDir);

      // Find the first image in the blog post
      const imagePath = await findFirstImage(blogDir);

      if (!imagePath) {
        console.log(`○ ${dirName}: No images found`);
        continue;
      }

      console.log(`● ${dirName}:`);

      // Generate tile filename
      const tileFilename = getTileFilename(blogDir, path.extname(imagePath));
      const tilePath = path.join(TILES_DIR, tileFilename);

      // Process the image
      const result = await processImage(imagePath, tilePath);

      if (result.success) {
        processed++;
        totalSourceSize += result.sourceSizeKB;
        totalTileSize += result.tileSizeKB;
      } else if (result.skipped) {
        skipped++;
      } else {
        failed++;
      }
    }

    // Summary
    console.log("\n" + "=".repeat(50));
    console.log("📊 Tile Generation Summary:");
    console.log("=".repeat(50));
    console.log(`✓ Processed: ${processed} images`);
    console.log(`↻ Skipped (up-to-date): ${skipped} images`);
    if (failed > 0) {
      console.log(`✗ Failed: ${failed} images`);
    }

    if (processed > 0) {
      const totalReduction = Math.round(
        ((totalSourceSize - totalTileSize) / totalSourceSize) * 100
      );
      console.log(`\n📉 Size Reduction:`);
      console.log(`   Original: ${totalSourceSize.toLocaleString()} KB`);
      console.log(`   Tiles: ${totalTileSize.toLocaleString()} KB`);
      console.log(
        `   Saved: ${(
          totalSourceSize - totalTileSize
        ).toLocaleString()} KB (-${totalReduction}%)`
      );
    }

    console.log("\n✅ Tile generation complete!");

    // Exit with error if any failed
    if (failed > 0) {
      process.exit(1);
    }
  } catch (error) {
    console.error("\n❌ Tile generation failed:", error);
    process.exit(1);
  }
}

// Run the script
generateTiles();
