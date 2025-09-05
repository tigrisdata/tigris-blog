#!/usr/bin/env node

/**
 * Git-aware Image Aspect Ratio Linter
 * 
 * Checks only the blog posts that have changed in the current git diff
 */

import { execSync } from 'child_process';
import ImageAspectLinter from './image-aspect-linter.mjs';
import path from 'path';

class GitAwareImageLinter {
  constructor() {
    this.linter = new ImageAspectLinter();
  }

  /**
   * Get changed blog post files from git diff
   * @param {string} baseRef - Base reference (e.g., 'origin/main', 'HEAD~1')
   * @param {string} headRef - Head reference (e.g., 'HEAD')
   * @returns {Array} Array of changed blog post file paths
   */
  getChangedBlogPosts(baseRef = 'origin/main', headRef = 'HEAD') {
    try {
      // Get changed files from git diff
      const diffCommand = `git diff --name-only ${baseRef}...${headRef}`;
      const changedFiles = execSync(diffCommand, { encoding: 'utf8' })
        .split('\n')
        .filter(file => file.trim() !== '');

      // Filter for blog post index.mdx files
      const changedPosts = changedFiles.filter(file =>
        file.match(/^blog\/.*\/index\.mdx$/)
      );

      // Also check for posts that have changed images
      const changedImages = changedFiles.filter(file =>
        file.match(/^blog\/.*\.(jpg|jpeg|png|webp|gif)$/i)
      );

      // Get blog directories with changed images
      const imagePostDirs = new Set();
      changedImages.forEach(imagePath => {
        const dir = path.dirname(imagePath);
        const indexPath = path.join(dir, 'index.mdx');
        imagePostDirs.add(indexPath);
      });

      // Combine and deduplicate
      const allChangedPosts = [...new Set([...changedPosts, ...imagePostDirs])];

      return allChangedPosts;
    } catch (error) {
      console.warn(`Warning: Could not get git diff (${error.message})`);
      return [];
    }
  }

  /**
   * Check if we're in a git repository
   * @returns {boolean}
   */
  isGitRepository() {
    try {
      execSync('git rev-parse --git-dir', { stdio: 'ignore' });
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Run the linter on changed blog posts only
   * @param {string} baseRef - Base reference for comparison
   * @param {string} headRef - Head reference for comparison  
   */
  async runOnChangedPosts(baseRef = 'origin/main', headRef = 'HEAD') {
    if (!this.isGitRepository()) {
      console.error('❌ Not in a git repository. Use the regular linter instead.');
      process.exit(1);
    }

    console.log(`🔍 Checking for changed blog posts between ${baseRef} and ${headRef}...\n`);

    const changedPosts = this.getChangedBlogPosts(baseRef, headRef);

    if (changedPosts.length === 0) {
      console.log('✅ No blog posts were modified in the diff');
      return;
    }

    console.log(`Found ${changedPosts.length} changed blog post(s):`);
    changedPosts.forEach(post => console.log(`  - ${post}`));
    console.log();

    let allIssues = [];
    let hasErrors = false;

    for (const postPath of changedPosts) {
      console.log(`🔍 Checking ${postPath}...`);

      const issues = await this.linter.analyzePost(postPath);
      allIssues.push(...issues);

      if (issues.some(issue => issue.type === 'error' || issue.type === 'warning')) {
        hasErrors = true;
      }

      // Show results for this specific post
      if (issues.length > 0) {
        this.linter.displayIssues(issues);
      } else {
        console.log('  ✅ No issues found');
      }
      console.log();
    }

    // Final summary
    console.log(`📊 Overall Results for ${changedPosts.length} changed post(s):`);
    console.log(`   Total issues: ${allIssues.length}`);
    console.log(`   Errors: ${allIssues.filter(i => i.type === 'error').length}`);
    console.log(`   Warnings: ${allIssues.filter(i => i.type === 'warning').length}`);
    console.log(`   Success: ${allIssues.filter(i => i.type === 'success').length}`);

    if (hasErrors) {
      process.exit(1);
    }
  }
}

// CLI handler
async function main() {
  const args = process.argv.slice(2);
  const linter = new GitAwareImageLinter();

  if (args.includes('--help') || args.includes('-h')) {
    console.log(`
Git-aware Image Aspect Ratio Linter for Tigris Blog

Usage:
  node image-aspect-linter-git.mjs [options] [base-ref] [head-ref]

Arguments:
  base-ref       Base git reference for comparison (default: origin/main)
  head-ref       Head git reference for comparison (default: HEAD)

Options:
  --help, -h     Show this help message

Examples:
  node image-aspect-linter-git.mjs
  node image-aspect-linter-git.mjs main HEAD
  node image-aspect-linter-git.mjs HEAD~1 HEAD
  node image-aspect-linter-git.mjs origin/main feature-branch
`);
    process.exit(0);
  }

  // Parse base and head refs
  const baseRef = args[0] || 'origin/main';
  const headRef = args[1] || 'HEAD';

  await linter.runOnChangedPosts(baseRef, headRef);
}

// Run if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch(error => {
    console.error('❌ Fatal error:', error);
    process.exit(1);
  });
}

export default GitAwareImageLinter;
