#!/usr/bin/env node

/**
 * Image Aspect Ratio Linter for Tigris Blog
 * 
 * Scans blog posts for images referenced as `image: ./path` in frontmatter
 * and checks if they have a 16:9 aspect ratio.
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import yaml from "js-yaml";
import sizeOf from "image-size";

// ES module __dirname polyfill
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class ImageAspectLinter {
  // Constants
  static TARGET_ASPECT_RATIO = 16 / 9;
  static ASPECT_RATIO_TOLERANCE = 0.1; // 10% tolerance for floating point comparison

  constructor() {
    this.blogDir = path.join(__dirname, "blog");
    this.issues = [];
  }

  /**
   * Create an issue object
   * @param {string} type - "error" or "warning" or "success"
   * @param {string} message - The issue description
   * @param {string} filePath - Path to the blog post file
   * @param {string} imagePath - Path to the image file
   * @param {Object} dimensions - Image dimensions {width, height}
   * @param {number} aspectRatio - Calculated aspect ratio
   * @returns {Object} Issue object
   */
  createIssue(type, message, filePath, imagePath, dimensions = null, aspectRatio = null) {
    return {
      type,
      message,
      filePath,
      imagePath,
      dimensions,
      aspectRatio,
      targetAspectRatio: ImageAspectLinter.TARGET_ASPECT_RATIO
    };
  }

  /**
   * Check if an aspect ratio is close to 16:9
   * @param {number} aspectRatio - The aspect ratio to check
   * @returns {boolean} True if within tolerance of 16:9
   */
  isValidAspectRatio(aspectRatio) {
    const difference = Math.abs(aspectRatio - ImageAspectLinter.TARGET_ASPECT_RATIO);
    return difference <= ImageAspectLinter.ASPECT_RATIO_TOLERANCE;
  }

  /**
   * Parse frontmatter from MDX content
   * @param {string} content - Full file content
   * @returns {Object|null} Parsed frontmatter or null
   */
  parseFrontmatter(content) {
    const lines = content.split('\n');

    if (lines[0] !== '---') {
      return null;
    }

    let frontmatterEnd = -1;
    for (let i = 1; i < lines.length; i++) {
      if (lines[i] === '---') {
        frontmatterEnd = i;
        break;
      }
    }

    if (frontmatterEnd === -1) {
      return null;
    }

    const frontmatterContent = lines.slice(1, frontmatterEnd).join('\n');

    try {
      return yaml.load(frontmatterContent);
    } catch (error) {
      console.warn(`Failed to parse frontmatter: ${error.message}`);
      return null;
    }
  }

  /**
   * Get image dimensions using image-size library
   * @param {string} imagePath - Path to the image file
   * @returns {Object|null} Dimensions {width, height} or null if error
   */
  getImageDimensions(imagePath) {
    try {
      if (!fs.existsSync(imagePath)) {
        return null;
      }
      const buffer = fs.readFileSync(imagePath);
      return sizeOf(buffer);
    } catch (error) {
      console.warn(`Failed to get dimensions for ${imagePath}: ${error.message}`);
      return null;
    }
  }

  /**
   * Analyze a single blog post for image aspect ratio issues
   * @param {string} filePath - Path to the blog post file
   * @returns {Array} Array of issues found
   */
  async analyzePost(filePath) {
    const issues = [];

    try {
      const content = fs.readFileSync(filePath, 'utf-8');
      const frontmatter = this.parseFrontmatter(content);

      if (!frontmatter) {
        return issues;
      }

      // Check for image field in frontmatter
      if (frontmatter.image && typeof frontmatter.image === 'string') {
        const imageRef = frontmatter.image.trim();

        // Check if it's a relative path starting with ./
        if (imageRef.startsWith('./')) {
          const blogPostDir = path.dirname(filePath);
          const imagePath = path.join(blogPostDir, imageRef);

          // Check if image file exists
          if (!fs.existsSync(imagePath)) {
            issues.push(this.createIssue(
              'error',
              `Image file not found: ${imageRef}`,
              filePath,
              imagePath
            ));
            return issues;
          }

          // Get image dimensions
          const dimensions = this.getImageDimensions(imagePath);

          if (!dimensions) {
            issues.push(this.createIssue(
              'error',
              `Could not read image dimensions: ${imageRef}`,
              filePath,
              imagePath
            ));
            return issues;
          }

          if (!dimensions.width || !dimensions.height) {
            issues.push(this.createIssue(
              'error',
              `Invalid image dimensions: ${imageRef}`,
              filePath,
              imagePath,
              dimensions
            ));
            return issues;
          }

          // Calculate aspect ratio
          const aspectRatio = dimensions.width / dimensions.height;

          // Check if aspect ratio is close to 16:9
          if (!this.isValidAspectRatio(aspectRatio)) {
            issues.push(this.createIssue(
              'warning',
              `Image aspect ratio ${aspectRatio.toFixed(2)} is not 16:9 (${ImageAspectLinter.TARGET_ASPECT_RATIO.toFixed(2)}): ${imageRef} (${dimensions.width}x${dimensions.height})`,
              filePath,
              imagePath,
              dimensions,
              aspectRatio
            ));
          } else {
            issues.push(this.createIssue(
              'success',
              `Image has correct 16:9 aspect ratio: ${imageRef} (${dimensions.width}x${dimensions.height})`,
              filePath,
              imagePath,
              dimensions,
              aspectRatio
            ));
          }
        }
      }
    } catch (error) {
      issues.push(this.createIssue(
        'error',
        `Error analyzing file: ${error.message}`,
        filePath,
        null
      ));
    }

    return issues;
  }

  /**
   * Analyze all blog posts
   * @returns {Array} Array of all issues found
   */
  async analyzeAllPosts() {
    const allIssues = [];

    try {
      const entries = fs.readdirSync(this.blogDir, { withFileTypes: true });

      for (const entry of entries) {
        if (entry.isDirectory()) {
          const indexPath = path.join(this.blogDir, entry.name, 'index.mdx');

          if (fs.existsSync(indexPath)) {
            const issues = await this.analyzePost(indexPath);
            allIssues.push(...issues);
          }
        }
      }
    } catch (error) {
      console.error(`Error scanning blog directory: ${error.message}`);
    }

    return allIssues;
  }

  /**
   * Format and display issues
   * @param {Array} issues - Array of issues to display
   */
  displayIssues(issues) {
    if (issues.length === 0) {
      console.log('✅ No image aspect ratio issues found!');
      return;
    }

    // Group issues by type
    const errorIssues = issues.filter(issue => issue.type === 'error');
    const warningIssues = issues.filter(issue => issue.type === 'warning');
    const successIssues = issues.filter(issue => issue.type === 'success');

    console.log(`\n📊 Image Aspect Ratio Linter Results:`);
    console.log(`   Errors: ${errorIssues.length}`);
    console.log(`   Warnings: ${warningIssues.length}`);
    console.log(`   Success: ${successIssues.length}`);
    console.log(`   Total: ${issues.length}\n`);

    // Display errors first
    if (errorIssues.length > 0) {
      console.log('❌ ERRORS:');
      errorIssues.forEach(issue => {
        console.log(`   ${path.relative(this.blogDir, issue.filePath)}: ${issue.message}`);
      });
      console.log();
    }

    // Then warnings
    if (warningIssues.length > 0) {
      console.log('⚠️  WARNINGS:');
      warningIssues.forEach(issue => {
        console.log(`   ${path.relative(this.blogDir, issue.filePath)}: ${issue.message}`);
        if (issue.dimensions) {
          const targetWidth = Math.round(issue.dimensions.height * ImageAspectLinter.TARGET_ASPECT_RATIO);
          const targetHeight = Math.round(issue.dimensions.width / ImageAspectLinter.TARGET_ASPECT_RATIO);
          console.log(`     Suggestion: Resize to ${targetWidth}x${issue.dimensions.height} or ${issue.dimensions.width}x${targetHeight}`);
        }
      });
      console.log();
    }

    // Finally successes (only if verbose)
    if (process.argv.includes('--verbose') && successIssues.length > 0) {
      console.log('✅ SUCCESS:');
      successIssues.forEach(issue => {
        console.log(`   ${path.relative(this.blogDir, issue.filePath)}: ${issue.message}`);
      });
      console.log();
    }
  }

  /**
   * Run the linter
   * @param {string|null} specificPost - Path to specific post to analyze, or null for all
   */
  async run(specificPost = null) {
    console.log('🔍 Running Image Aspect Ratio Linter...\n');

    let issues;

    if (specificPost) {
      // Analyze specific post
      const fullPath = path.resolve(specificPost);
      if (!fs.existsSync(fullPath)) {
        console.error(`❌ File not found: ${specificPost}`);
        process.exit(1);
      }
      issues = await this.analyzePost(fullPath);
    } else {
      // Analyze all posts
      issues = await this.analyzeAllPosts();
    }

    this.displayIssues(issues);

    // Exit with error code if there are errors or warnings
    const hasProblems = issues.some(issue => issue.type === 'error' || issue.type === 'warning');
    if (hasProblems) {
      process.exit(1);
    }
  }
}

// CLI handler
async function main() {
  const args = process.argv.slice(2);
  const linter = new ImageAspectLinter();

  if (args.includes('--help') || args.includes('-h')) {
    console.log(`
Image Aspect Ratio Linter for Tigris Blog

Usage:
  node image-aspect-linter.mjs [options] [file]

Options:
  --help, -h     Show this help message
  --verbose      Show success messages as well
  
Arguments:
  file           Path to specific blog post to analyze (optional)
                 If not provided, analyzes all blog posts

Examples:
  node image-aspect-linter.mjs
  node image-aspect-linter.mjs --verbose
  node image-aspect-linter.mjs blog/2025-08-07-qwen-image/index.mdx
`);
    process.exit(0);
  }

  // Check if a specific file was provided
  const fileArg = args.find(arg => !arg.startsWith('--'));

  await linter.run(fileArg);
}

// Run if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch(error => {
    console.error('❌ Fatal error:', error);
    process.exit(1);
  });
}

export default ImageAspectLinter;
