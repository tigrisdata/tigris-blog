# SEO Reviewer Agent

An intelligent agent that analyzes blog posts and suggests improvements for SEO
optimization and LLM optimization (for AI-powered search engines).

## Features

### SEO Optimization

- **Title Analysis**: Checks title length (optimal 50-60 characters)
- **Meta Description**: Validates description length (150-160 characters) and
  generates improved suggestions
- **Keywords**: Reviews keyword usage and density
- **Content Length**: Ensures adequate word count (500+ words recommended)
- **Heading Structure**: Validates proper H1-H6 hierarchy
- **Image Optimization**: Checks for alt text and image accessibility
- **URL Structure**: Validates slug format and length

### Automated Content Updates

- **Meta Description Application**: Automatically applies suggested meta
  descriptions
- **Tag Management**: Adds suggested tags, fixes casing, and reorders category
  tags
- **Image Alt Text**: Automatically applies caption text as alt text when
  captions are detected
- **Terminology Replacement**: Replaces deprecated terms with preferred
  alternatives
- **Safe Automation**: Only applies changes that are clearly beneficial and safe

### LLM Optimization

- **Question-Style Headings**: Suggests FAQ-friendly headings for better AI
  discovery
- **Problem/Solution Structure**: Ensures clear problem-solution narrative
- **Technical Context**: Validates presence of relevant technical keywords
- **Code Examples**: Recognizes and encourages code snippets
- **Background Context**: Suggests adding contextual information
- **Conclusion Sections**: Recommends summary sections for better comprehension

### Tigris Terminology Standardization

- **Brand Consistency**: Ensures consistent "Tigris" capitalization and usage
- **Preferred Descriptions**: Validates use of standardized Tigris descriptions
- **Technical Accuracy**: Promotes consistent S3-compatible terminology
- **Value Proposition Highlighting**: Suggests including key differentiators
- **Preferred Terms**: Suggests consistent alternatives for better messaging

### Tag Optimization

- **Smart Tag Suggestions**: Recommends relevant tags based on content analysis
- **Consistency Validation**: Checks for proper tag capitalization and format
- **Category Mapping**: Maps content to established blog taxonomy
- **Completeness Checks**: Ensures posts have adequate tags for discoverability

## Installation

No additional dependencies required beyond Node.js. The script uses only
built-in Node.js modules.

## Usage

### NPM Commands (Recommended)

**Full SEO Review (All Posts):**

```bash
npm run seo:review
# or
npm run seo:review:all
```

Analyzes all blog posts and generates comprehensive reports.

**Review Specific Post:**

```bash
# By file path
node seo-reviewer.js blog/2025-08-07-qwen-image/index.mdx
# or npm with specific path
npm run seo:review blog/2025-08-07-qwen-image/index.mdx
```

**Review Current Post (Auto-Detection):**

```bash
# From within a blog post directory (e.g., blog/2025-08-07-qwen-image/)
cd blog/2025-08-07-qwen-image
node ../../seo-reviewer.js
# Automatically detects and analyzes index.mdx or index.md in current directory
```

**Apply Suggested Changes Automatically:**

```bash
# Apply changes to current post (auto-detected)
npm run seo:apply

# Apply changes to all posts with issues
npm run seo:apply:all

# Apply changes to specific post
node seo-reviewer.js blog/2025-08-07-qwen-image/index.mdx --apply
```

**Quick SEO Check for CI (All Posts):**

```bash
npm run seo:check
# or
npm run seo:check:all
```

Returns exit code 1 if critical issues found, 0 if passed.

### Direct Script Usage

**Analyze All Blog Posts:**

```bash
node seo-reviewer.js --all
```

**Analyze Specific Post:**

```bash
node seo-reviewer.js blog/2025-08-07-qwen-image/index.mdx
```

**Auto-Detect Current Post:**

```bash
# Run from within any blog post directory
# Automatically finds and analyzes index.mdx or index.md
node seo-reviewer.js
```

**Apply Changes with Direct Script:**

```bash
# Apply to current auto-detected post
node seo-reviewer.js --apply

# Apply to specific post
node seo-reviewer.js blog/2025-08-07-qwen-image/index.mdx --apply

# Apply to all posts
node seo-reviewer.js --all --apply
```

## Report Structure

### Summary Report

- Overall statistics (total posts, issues, suggestions)
- Most common issues across all posts
- Posts needing immediate attention
- Best performing posts

### Individual Post Reports

For each post with issues, you'll get:

#### Issue Categories

- **Critical Issues**: Must be fixed (missing titles, descriptions, etc.)
- **SEO Suggestions**: Improvements for search engine optimization
- **LLM Suggestions**: Optimizations for AI-powered search engines
- **Terminology Suggestions**: Tigris brand and messaging consistency
- **Positive Feedback**: Recognition of good practices

#### Detailed Analysis

- **Frontmatter Review**: Title, description, keywords, tags analysis
- **Content Structure**: Heading hierarchy and organization
- **Image Analysis**: Alt text and accessibility review
- **Word Count**: Content length assessment
- **Tigris Terminology**: Brand consistency and messaging analysis

## Example Output

```
# SEO Review: I Tested Qwen Image's Text Rendering Claims

**File:** 2025-08-07-qwen-image/index.mdx
**Word Count:** 2,847
**Headings:** 8
**Images:** 15

## Suggestions for Improvement

- Title is long (62 chars). Consider shortening to under 60 characters
- Meta description is short (85 chars). Expand to 150-160 characters
- Suggested improved description: "Learn how AI-powered development tools evolved from autocomplete to autonomous agents. Complete guide with examples and industry insights."
- Consider adding question-style headings (What is..., How to...) for better LLM discovery
- Great! Code examples help LLMs understand technical content

## Detailed Analysis

### Frontmatter
- **Title:** "I Tested Qwen Image's Text Rendering Claims. Here's What I Found." (62 chars)
- **Description:** 159 chars
- **Keywords:** 14 keywords
- **Tags:** Engineering, AI

### Content Structure
- H2: Introduction
- H2: How diffusion models work
- H2: Qwen Image claims to have solved complex text rendering
  - H3: Multi-line layouts
  - H3: Paragraph-level semantics
  - H3: Fine-grained details
- H2: So how does Qwen Image Stack up?
- H2: Conclusion
```

## Customization

The SEO Reviewer can be customized by modifying the analysis functions:

### Adding New SEO Rules

Edit the `performSEOAnalysis()` method to add new checks:

```javascript
// Check for specific keywords
if (!content.includes("your-important-keyword")) {
  analysis.suggestions.push(
    'Consider including "your-important-keyword" for better targeting',
  );
}
```

### Adding New LLM Optimizations

Edit the `performLLMOptimization()` method:

```javascript
// Check for specific AI-friendly structures
const hasStepByStep =
  content.toLowerCase().includes("step 1") ||
  content.toLowerCase().includes("first,");
if (!hasStepByStep) {
  analysis.suggestions.push(
    "Consider adding step-by-step instructions for better AI comprehension",
  );
}
```

### Customizing Terminology Rules

Edit the `performTigrisTerminologyAnalysis()` method to add new terminology
checks:

```javascript
// Add new deprecated terms
const customDeprecatedTerms = [
  {
    term: "file system",
    preferred: "object storage",
    reason: "More accurate for cloud storage",
  },
  {
    term: "data lake",
    preferred: "object storage",
    reason: "Avoid confusion with analytics platforms",
  },
];

// Add new preferred descriptions
const customDescriptions = [
  "enterprise-grade object storage",
  "zero-egress object storage",
];
```

## Best Practices for Technical Blogs

Based on the analysis, here are key recommendations:

### SEO Best Practices

1. **Title**: 50-60 characters, include primary keyword
2. **Description**: 150-160 characters, compelling summary
3. **Keywords**: 5-8 relevant terms, avoid keyword stuffing
4. **Content**: 500+ words, well-structured with headings
5. **Images**: Always include descriptive alt text
6. **URLs**: Clean, readable slugs with hyphens

### LLM Optimization

1. **Clear Structure**: Use question-style headings when appropriate
2. **Context**: Provide background information and explain technical terms
3. **Examples**: Include code snippets and practical examples
4. **Problem/Solution**: Structure content around clear problem-solution
   narratives
5. **Summary**: End with conclusions or key takeaways
6. **Technical Keywords**: Include relevant industry terminology

### Tigris Terminology Standardization

1. **Preferred Descriptions**: Use standardized descriptions for LLM consistency
   - **Primary**: "Tigris is a globally distributed, multi-cloud object storage
     service with built-in support for the S3 API"
   - **Short**: "A multi-cloud, S3-compatible object storage service for low
     latency data access anywhere"
2. **Key Value Propositions**: Highlight in titles/descriptions
   - "globally distributed"
   - "multi-cloud"
   - "low-latency" or "low latency"
   - "S3-compatible"
   - "Dynamic Data Placement"
   - "Access-Based Rebalancing"
3. **Technical Accuracy**: Use consistent terminology
   - Prefer "object storage" over "file storage" for S3 compatibility
   - Use "S3-compatible" instead of "Amazon S3 compatible"
   - Say "multi-cloud" rather than "cross-cloud"
   - Use "low-latency" instead of just "fast"
4. **Brand Consistency**: Always capitalize "Tigris" when used as product name
5. **S3 Terminology**: Use bucket/object/key consistently, avoid
   folder/directory

## Automated Description Generation

The SEO reviewer now includes intelligent description suggestion when meta
descriptions are missing, too short, or too long:

### How It Works

- **Content Analysis**: Analyzes title, headings, and content to identify key
  topics
- **Context Detection**: Recognizes if the post is about Tigris, development
  tools, AI, etc.
- **Smart Suggestions**: Generates contextually appropriate descriptions
- **Length Optimization**: Ensures suggestions are 150-160 characters for
  optimal SEO

### Example Suggestions

**For Tigris-focused posts:**

```
Original: "Short description"
Suggested: "Learn how AI applications with Tigris globally distributed object storage. Complete guide with practical examples."
```

**For development tool posts:**

```
Original: "AI coding tools"
Suggested: "Build AI-powered development tools from autocomplete to autonomous agents. Evolution, best practices, and industry insights."
```

**For general technical posts:**

```
Original: "Migration guide"
Suggested: "Implement cloud migration for infrastructure. Best practices, examples, and implementation guide."
```

### Customization

The description generator considers:

- **Action Words**: "Learn how", "Build", "Optimize", "Discover" based on
  content type
- **Technical Terms**: AI, cloud, storage, API, etc. extracted from content
- **Tigris Value Props**: Automatically includes relevant differentiators for
  Tigris posts
- **Optimal Length**: Truncates intelligently at sentence boundaries

## Intelligent Tag Suggestions

The SEO reviewer now analyzes content and suggests relevant tags based on the
established tag taxonomy:

### How It Works

- **Content Analysis**: Analyzes title, description, headings, and body text
- **Category Matching**: Maps content to standard blog categories
- **Consistency Checks**: Identifies inconsistent tag capitalization
- **Smart Filtering**: Only suggests tags that aren't already present

### Tag Categories

**Category Tags (Always at Top):**

- Engineering, Build with Tigris, Customers, Updates
- _These tags determine post categorization and must be first in the tag list_
- _The reviewer will never suggest moving or removing these tags_

**Core Technical Areas:**

- AI, Security, Performance, Scalability

**Technologies:**

- Python, Kubernetes, Docker, Database, Cloud

**Tigris-Specific:**

- Object Storage, Migration, Tigris

**Content Types:**

- Thought Leadership, Features, Development

**Technology-Specific:**

- elixir, lancedb, duckdb, anubis, foundationdb, mcp, datasets

### Example Suggestions

**Missing fundamental tags:**

```
No tags found. Add relevant tags for better discoverability
```

**Relevant additions:**

```
Consider adding tags: Security, Performance, Kubernetes, Docker
```

**Consistency improvements:**

```
Use "AI" instead of "ai" for consistency
```

_Note: Category tags like "Engineering" are protected and won't trigger
consistency warnings_

**Category tag positioning:**

```
Category tags (Engineering, Build with Tigris, Customers, Updates) should be at the top of the tag list
```

**Deprecated tag replacement:**

```
Consider replacing "vibe-coding" with "vibe coding" for better consistency
```

### Best Practices

- **Category tags first**: Engineering, Build with Tigris, Customers, Updates
  must be at top
- **2-5 total tags recommended** for optimal categorization
- **Consistent capitalization** (AI not ai, but category tags are protected)
- **Specific over general** (Docker over Cloud when specifically about
  containers)
- **Content-type tags** help with blog organization and discovery

## Integration with Build Process

You can integrate the SEO reviewer into your CI/CD pipeline:

### GitHub Actions Example

```yaml
- name: SEO Review
  run: npm run seo:check
```

**Alternative with detailed reporting:**

```yaml
- name: SEO Review with Report
  run: |
    npm run seo:review > seo-report.txt
    # Always show report, fail if issues found
    cat seo-report.txt
    npm run seo:check
```

### Pre-commit Hook

```bash
#!/bin/sh
# Run SEO review on modified blog posts
modified_posts=$(git diff --cached --name-only | grep "blog/.*\.mdx\?$")
if [ -n "$modified_posts" ]; then
  for post in $modified_posts; do
    echo "Reviewing $post..."
    npm run seo:review "$post"
  done
fi
```

## Troubleshooting

### Common Issues

**Script not finding blog posts**

- Ensure you're running from the root directory of the blog
- Check that `blog/` directory exists with subdirectories containing `index.mdx`
  or `index.md` files

**Frontmatter parsing errors**

- Verify YAML frontmatter is properly formatted
- Check for missing `---` delimiters
- Ensure proper indentation in YAML arrays

**Permission errors**

- Make sure the script has read permissions on blog files
- On Unix systems, you may need to make the script executable:
  `chmod +x seo-reviewer.js`

## Contributing

To improve the SEO Reviewer:

1. Add new analysis rules in the appropriate methods
2. Update the documentation with new features
3. Test with various blog post formats
4. Consider performance optimizations for large blog collections

## Automated Content Updates

The SEO reviewer can now automatically apply certain types of suggestions
directly to your blog post files using the `--apply` flag.

### What Gets Automated

**Safe Automations (Applied with --apply):**

- **Meta Descriptions**:
  - "Suggested improved description: ..."
  - "Suggested meta description: ..."
  - "Suggested shortened description: ..."
- **Tag Management**:
  - "Consider adding tags: ..." (adds new tags)
  - "Use 'AI' instead of 'ai' for consistency" (fixes casing)
  - "Use 'Engineering' instead of 'engineering' for consistency" (fixes casing)
  - "Category tags ... should be at the top" (reorders tags)
- **Image Alt Text**:
  - "Image missing alt text: ... Consider using the caption text: ..." (applies
    caption)
  - "Alt text too short for image: ... Consider using the caption text: ..."
    (applies caption)
- **Deprecated Terms in Content**:
  - Replaces `Amazon S3 compatible` with `S3-compatible`
  - Replaces `cross-cloud` with `multi-cloud`
  - Replaces `fast access` with `low-latency access`

**Manual Review Required:**

- **SEO Structure Issues**:
  - "Missing title in frontmatter" (requires writing)
  - "No headings found" (requires content restructuring)
  - "Multiple H1 tags found" (requires content editing)
  - "Image missing alt text: ..." (when no caption detected)
- **Content Quality Suggestions**:
  - "Title is long/short" (requires rewriting)
  - "Content is very short" (requires writing more content)
  - "No H2 headings found" (requires adding section headers)
- **LLM Optimization**:
  - "Consider adding question-style headings" (requires creative input)
  - "Consider adding clear problem/solution structure" (requires restructuring)
  - "Consider adding background context" (requires domain knowledge)
- **Complex Terminology**:
  - Most suggestions about Tigris descriptions (require judgment)
  - Technical accuracy suggestions (require domain expertise)

### Quick Reference: What Gets Automated?

| Suggestion Pattern                                | Automated? | Action                       |
| ------------------------------------------------- | ---------- | ---------------------------- |
| `Suggested ... description: "..."`                | Yes        | Applies new meta description |
| `Consider adding tags: ...`                       | Yes        | Adds suggested tags          |
| `Use "AI" instead of "ai"`                        | Yes        | Fixes tag capitalization     |
| `Category tags ... should be at the top`          | Yes        | Reorders tags                |
| `Image missing alt text: ... caption text: "..."` | Yes        | Applies caption as alt text  |
| `Missing title`                                   | No         | Requires manual writing      |
| `Image missing alt text` (no caption)             | No         | Requires manual alt text     |
| `Consider adding question-style headings`         | No         | Requires creative input      |
| `Title is long/short`                             | No         | Requires rewriting           |

### How It Works

1. **Analysis First**: The tool analyzes the post and identifies automatable
   suggestions
2. **Safe Changes Only**: Only applies changes that are clearly beneficial and
   low-risk
3. **Preserve Formatting**: Maintains YAML frontmatter structure and content
   formatting
4. **Immediate Re-analysis**: Shows updated analysis after applying changes

### Example Workflow

```bash
# 1. Review current issues
npm run seo:review

# 2. Apply automated fixes
npm run seo:apply

# 3. See the results
# Tool automatically shows before/after analysis
```

### Automated Changes Example

**Before:**

```yaml
title: "My Blog Post"
description: "Short desc"
tags: ["ai", "development", "Engineering"]
```

**After:**

```yaml
title: "My Blog Post"
description:
  "Learn how AI-powered development tools evolved from autocomplete to
  autonomous agents. Complete guide with examples and best practices."
tags: ["Engineering", "AI", "development", "Python", "Machine Learning"]
```

**Content Changes:**

- Replaces `cross-cloud` with `multi-cloud`
- Replaces `Amazon S3 compatible` with `S3-compatible`
- Replaces `fast access` with `low-latency access`
- Applies caption text as alt text: `![](./image.png)` becomes
  `![Screenshot showing the dashboard interface](./image.png)`

### Safety Features

- **Backup Recommended**: Always commit your changes to version control before
  applying automated fixes
- **Selective Application**: Only applies changes that match specific, safe
  patterns
- **Preserved Structure**: Maintains all existing frontmatter fields and content
  structure
- **Review Required**: Still suggests manual improvements for complex changes

## Future Enhancements

Potential improvements:

- Integration with Google Search Console API
- Readability scoring (Flesch-Kincaid)
- Competitive analysis features
- Integration with content management systems
- Performance monitoring and trending analysis
- More sophisticated automated improvements
