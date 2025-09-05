# Image Aspect Ratio Linter

This linter checks that all blog post cover images referenced as `image: ./path`
in the frontmatter have a 16:9 aspect ratio.

## Usage

### Via npm scripts (recommended)

```bash
# Check all blog posts for image aspect ratio issues
npm run images:lint

# Check all blog posts with verbose output (shows successes too)
npm run images:lint:verbose

# Check only blog posts that changed compared to origin/main (git-aware)
npm run images:lint:changed

# Check changes for a pull request (compare origin/main to HEAD)
npm run images:lint:pr

# Check a specific blog post
npm run images:lint blog/2025-08-07-qwen-image/index.mdx
```

### Direct execution

```bash
# Check all blog posts
node image-aspect-linter.mjs

# Check with verbose output
node image-aspect-linter.mjs --verbose

# Check a specific blog post
node image-aspect-linter.mjs blog/2025-08-07-qwen-image/index.mdx

# Show help
node image-aspect-linter.mjs --help
```

## Integration

The image linter is automatically included in the main test suite:

```bash
npm test  # Runs format check, eslint, image linter, and build
```

## GitHub Actions Integration

The linter includes GitHub Actions workflows that automatically check image
aspect ratios for changed blog posts in pull requests and commits. See
[`README-github-actions.md`](./README-github-actions.md) for detailed setup and
configuration.

**Quick setup:** The workflows are ready to use and will automatically run when
you modify blog posts or images.

## Git-Aware Linting

For performance, you can check only the blog posts that have changed:

```bash
# Check posts changed compared to origin/main
npm run images:lint:changed

# Check specific commit range
node image-aspect-linter-git.mjs HEAD~3 HEAD

# Check against a specific branch
node image-aspect-linter-git.mjs main feature-branch

## Output

The linter will:

- ✅ **Success**: Show images that have the correct 16:9 aspect ratio
- ⚠️ **Warning**: Show images that don't have 16:9 aspect ratio with resize suggestions
- ❌ **Error**: Show images that couldn't be found or analyzed

For images with incorrect aspect ratios, the linter provides resize suggestions:
- Keep width, adjust height: `width x (width ÷ 16 × 9)`
- Keep height, adjust width: `(height ÷ 9 × 16) x height`

## Target Aspect Ratio

The linter checks for a 16:9 aspect ratio (1.777...) with a tolerance of ±0.1 to account for minor variations.

## Supported Image Formats

The linter supports all image formats that the `image-size` library can handle:
- JPEG (.jpg, .jpeg)
- PNG (.png)
- WebP (.webp)
- GIF (.gif)
- BMP (.bmp)
- TIFF (.tiff)
- SVG (.svg)

## How it Works

1. Scans all `blog/*/index.mdx` files
2. Parses the YAML frontmatter to find `image: ./path` entries
3. Resolves the relative path and checks if the file exists
4. Uses the `image-size` library to get dimensions
5. Calculates aspect ratio and compares to 16:9 target
6. Reports results with helpful suggestions for non-conforming images
```
