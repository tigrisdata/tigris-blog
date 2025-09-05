# GitHub Actions for Image Aspect Ratio Checking

This repository includes GitHub Actions workflows to automatically check image
aspect ratios for blog posts that are modified in commits or pull requests.

## Available Workflows

### 1. Comprehensive Workflow (`image-aspect-check.yml`)

**Features:**

- ✅ Runs on PRs and pushes to main
- ✅ Checks both modified blog posts AND posts with changed images
- ✅ Provides detailed PR comments with results
- ✅ Creates artifacts with full check results
- ✅ Handles edge cases and provides rich feedback

**Triggers:**

- Pull requests that modify `blog/**/index.mdx` or
  `blog/**/*.{jpg,jpeg,png,webp,gif}`
- Pushes to main branch with the same file patterns

**Outputs:**

- Console logs with detailed results
- PR comments with formatted results (for pull requests)
- Artifacts containing full check summaries

### 2. Simple Workflow (`image-aspect-check-simple.yml`)

**Features:**

- ✅ Lightweight and fast
- ✅ Uses the git-aware linter script
- ✅ Minimal configuration required

**Triggers:**

- Pull requests that modify any files in `blog/**`
- Pushes to main branch with files in `blog/**`

**Outputs:**

- Console logs only

## How It Works

1. **Detection**: The workflow detects which blog posts have changed by:

   - Comparing the commit range using `git diff --name-only`
   - Finding modified `blog/*/index.mdx` files
   - Finding posts whose images were modified (even if the MDX wasn't changed)

2. **Analysis**: For each changed post:

   - Runs the image aspect ratio linter
   - Checks if cover images have 16:9 aspect ratio
   - Provides resize suggestions for non-conforming images

3. **Reporting**:
   - Fails the check if any errors or warnings are found
   - Provides detailed feedback about what needs to be fixed
   - (Comprehensive workflow) Comments on PRs with results

## Manual Testing

You can test the git-aware functionality locally:

```bash
# Check changes between current branch and main
npm run images:lint:changed

# Check changes in a specific commit range
node image-aspect-linter-git.mjs HEAD~1 HEAD

# Check changes between main and current branch
node image-aspect-linter-git.mjs origin/main HEAD
```

## Integration with Existing CI

To add image checking to your existing CI workflow, add this step:

```yaml
- name: Check image aspect ratios
  run: npm run images:lint:changed
```

## Customization

### Changing the Target Branch

Edit the workflows to use a different base branch:

```yaml
# In the git diff commands, change from:
BASE_SHA="${{ github.event.pull_request.base.sha }}"

# To your preferred branch:
BASE_SHA="origin/develop"  # or whatever branch you use
```

### Modifying File Patterns

Update the `paths` section in the workflow:

```yaml
on:
  pull_request:
    paths:
      - "blog/**/*.mdx" # All MDX files in blog
      - "content/**/*.md" # Add other content directories
      - "images/**/*" # Add other image directories
```

### Changing Image Formats

Update both the workflow file patterns and the git-aware linter regex:

```javascript
// In image-aspect-linter-git.mjs, modify this line:
file.match(/^blog\/.*\.(jpg|jpeg|png|webp|gif|svg|bmp)$/i);
```

## Troubleshooting

### "Not in a git repository" Error

This occurs when running the git-aware linter outside of a git repository. Use
the regular linter instead:

```bash
npm run images:lint
```

### No Changes Detected

If the workflow shows no changes but you expect some:

1. Check that your files match the path patterns in the workflow
2. Ensure the base branch comparison is correct
3. Verify that the files are actually committed (not just staged)

### False Positives

The linter allows a 10% tolerance for aspect ratios. If you need to adjust this:

1. Edit `ImageAspectLinter.ASPECT_RATIO_TOLERANCE` in `image-aspect-linter.mjs`
2. Or create specific exceptions for certain images in the linter code

## Performance

- **Full scan**: ~5-10 seconds for 50+ blog posts
- **Changed files only**: ~1-2 seconds for typical PR changes
- **Image analysis**: ~100ms per image file

The git-aware approach provides significant performance improvements for large
repositories with many blog posts.
