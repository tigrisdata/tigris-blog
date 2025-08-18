#!/usr/bin/env node

/**
 * SEO Reviewer Agent for Tigris Blog
 *
 * Analyzes blog posts and suggests improvements for:
 * - SEO optimization
 * - LLM optimization (for AI-powered search engines)
 * - Content structure and readability
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import yaml from "js-yaml";

// ES module __dirname polyfill
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class SEOReviewer {
  // Constants for magic numbers
  static TITLE_MIN_LENGTH = 30;
  static TITLE_MAX_LENGTH = 60;
  static DESCRIPTION_MIN_LENGTH = 120;
  static DESCRIPTION_MAX_LENGTH = 160;
  static WORD_COUNT_MIN = 300;
  static WORD_COUNT_RECOMMENDED = 500;
  static SLUG_MAX_LENGTH = 50;
  static ALT_TEXT_MIN_LENGTH = 5;
  static DESCRIPTION_TARGET_LENGTH = 150;
  static DESCRIPTION_TARGET_LENGTH_SHORT = 155;

  // Suggestion types and their corresponding emojis
  static SUGGESTION_TYPES = {
    GOOD: "good",
    BAD: "bad",
  };

  static SUGGESTION_EMOJIS = {
    good: ":white_check_mark:",
    bad: ":x:",
  };

  constructor() {
    this.blogDir = path.join(__dirname, "blog");
    this.recommendations = [];

    // Pre-compile regex patterns for better performance
    this.compiledRegexes = {
      markdownImage: /!\[([^\]]*)\]\(([^)]+)\)/g,
      htmlImage:
        /<img[^>]*src=["']([^"']+)["'][^>]*(?:alt=["']([^"']+)["'][^>]*)?>/g,
      frontmatter: /^---\n((?:[^\n]|\n(?!---))*)\n---/,
      headings: /^(#{1,6})\s+(.+)$/gm,
      // Safe regex patterns for terminology replacement
      safeWordBoundary: (term) =>
        new RegExp(`\\b${this.escapeRegex(term)}\\b`, "gi"),
    };

    // Legacy patterns for backward compatibility
    this.markdownImagePattern = this.compiledRegexes.markdownImage;
    this.htmlImagePattern = this.compiledRegexes.htmlImage;

    // Content size limit (10MB)
    this.MAX_CONTENT_SIZE = 10 * 1024 * 1024;
  }

  /**
   * Create a suggestion object with type and line number
   * @param {string} kind - "good" or "bad"
   * @param {string} body - The suggestion text
   * @param {number} lineNumber - Line number where the issue was found (optional)
   * @returns {Object} Suggestion object
   */
  createSuggestion(kind, body, lineNumber = null) {
    return {
      kind,
      body,
      lineNumber,
    };
  }

  /**
   * Create a good suggestion
   * @param {string} body - The suggestion text
   * @param {number} lineNumber - Line number (optional)
   * @returns {Object} Good suggestion object
   */
  addGoodSuggestion(body, lineNumber = null) {
    return this.createSuggestion(
      SEOReviewer.SUGGESTION_TYPES.GOOD,
      body,
      lineNumber
    );
  }

  /**
   * Create a bad suggestion
   * @param {string} body - The suggestion text
   * @param {number} lineNumber - Line number (optional)
   * @returns {Object} Bad suggestion object
   */
  addBadSuggestion(body, lineNumber = null) {
    return this.createSuggestion(
      SEOReviewer.SUGGESTION_TYPES.BAD,
      body,
      lineNumber
    );
  }

  /**
   * Extract text from suggestion (handles both string and object formats)
   * @param {string|Object} suggestion - Suggestion item
   * @returns {string} The suggestion text
   */
  /**
   * Safely escape regex special characters
   * @param {string} text - Text to escape
   * @returns {string} Escaped text
   */
  escapeRegex(text) {
    return text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  }

  getSuggestionText(suggestion) {
    return typeof suggestion === "string" ? suggestion : suggestion.body;
  }

  /**
   * Find line number for a given frontmatter field
   * @param {string} content - Full file content
   * @param {string} fieldName - Field name to find (e.g., "title", "description")
   * @returns {number|null} Line number or null if not found
   */
  findFrontmatterLineNumber(content, fieldName) {
    const lines = content.split("\n");
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      if (line.startsWith(`${fieldName}:`)) {
        return i + 1; // Convert to 1-based line numbers
      }
    }
    return null;
  }

  /**
   * Find line number for content in the body (after frontmatter)
   * @param {string} content - Full file content
   * @param {string} searchText - Text to find in content body
   * @returns {number|null} Line number or null if not found
   */
  findContentLineNumber(content, searchText) {
    const lines = content.split("\n");
    let inFrontmatter = false;
    let frontmatterEnded = false;
    let dashCount = 0;

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];

      if (line.trim() === "---") {
        dashCount++;
        if (dashCount === 1) {
          inFrontmatter = true;
        } else if (dashCount === 2) {
          inFrontmatter = false;
          frontmatterEnded = true;
        }
        continue;
      }

      // Only search in content body (after frontmatter)
      if (
        frontmatterEnded &&
        line.toLowerCase().includes(searchText.toLowerCase())
      ) {
        return i + 1; // Convert to 1-based line numbers
      }
    }
    return null;
  }

  /**
   * Validate and sanitize file path to prevent directory traversal
   * @param {string} filePath - The file path to validate
   * @returns {string} Validated file path
   */
  validateFilePath(filePath) {
    const resolvedPath = path.resolve(filePath);
    const resolvedBase = path.resolve(this.blogDir);
    const resolvedCwd = path.resolve(process.cwd());

    // Use path.relative to check containment more securely
    const relativeToBase = path.relative(resolvedBase, resolvedPath);
    const relativeToCwd = path.relative(resolvedCwd, resolvedPath);

    // Check if path escapes allowed directories using .. or absolute paths
    const isOutsideBase =
      relativeToBase.startsWith("..") || path.isAbsolute(relativeToBase);
    const isOutsideCwd =
      relativeToCwd.startsWith("..") || path.isAbsolute(relativeToCwd);

    if (isOutsideBase && isOutsideCwd) {
      throw new Error("Invalid file path: outside allowed directory");
    }

    return resolvedPath;
  }

  /**
   * Sanitize image path for safe regex usage
   * @param {string} imagePath - The image path to sanitize
   * @returns {string} Sanitized path
   */
  sanitizeImagePath(imagePath) {
    // Stricter validation first - only allow safe characters
    if (!/^[a-zA-Z0-9\-./_ ]+$/.test(imagePath)) {
      throw new Error("Invalid image path: contains unsafe characters");
    }

    // Additional length check to prevent overly long paths
    if (imagePath.length > 500) {
      throw new Error("Invalid image path: path too long");
    }

    return imagePath.trim();
  }

  /**
   * Parse frontmatter from an MDX file using js-yaml
   * @param {string} content - The file content including frontmatter
   * @returns {{data: Object, raw: string, start: number, end: number}} Parsed frontmatter data and metadata
   */
  parseFrontmatter(content) {
    // Validate content size
    if (content.length > this.MAX_CONTENT_SIZE) {
      throw new Error("Content too large to process");
    }

    // Use more specific regex to prevent ReDoS
    const frontmatterMatch = content.match(
      /^---\n((?:[^\n]|\n(?!---))*?)\n---/
    );
    if (!frontmatterMatch) return { data: {}, raw: "", start: -1, end: -1 };

    const rawFrontmatter = frontmatterMatch[1];
    let data;

    try {
      // Use safe schema to prevent YAML bombs and restrict to safe types
      data =
        yaml.load(rawFrontmatter, {
          schema: yaml.FAILSAFE_SCHEMA, // Only allow basic YAML types
          json: true, // Only JSON-compatible types
          onWarning: (warning) => {
            console.warn(`YAML parsing warning: ${warning.message}`);
          },
        }) || {};
    } catch (error) {
      throw new Error(`Invalid YAML in frontmatter: ${error.message}`);
    }

    const start = content.indexOf("---\n") + 4; // Skip '---' and newline
    const end = start + rawFrontmatter.length;

    return { data, raw: rawFrontmatter, start, end };
  }

  /**
   * Extract content body (without frontmatter)
   * @param {string} fileContent - Complete file content
   * @returns {string} Content without frontmatter
   */
  extractContent(fileContent) {
    const frontmatterMatch = fileContent.match(
      /^---\n[\s\S]*?\n---\n([\s\S]*)$/
    );
    return frontmatterMatch ? frontmatterMatch[1] : fileContent;
  }

  /**
   * Count words in content
   * @param {string} text - Text to count words in
   * @returns {number} Word count
   */
  countWords(text) {
    return text
      .trim()
      .split(/\s+/)
      .filter((word) => word.length > 0).length;
  }

  /**
   * Extract headings from content
   * @param {string} content - Markdown content
   * @returns {Array<{level: number, text: string}>} Array of heading objects
   */
  extractHeadings(content) {
    const headings = [];
    const lines = content.split("\n");

    for (const line of lines) {
      const match = line.match(/^(#{1,6})\s+(.+)$/);
      if (match) {
        headings.push({
          level: match[1].length,
          text: match[2].trim(),
        });
      }
    }

    return headings;
  }

  /**
   * Check for images in content and detect nearby captions
   * @param {string} content - Markdown/HTML content
   * @returns {Array<{alt: string, src: string, type: string, caption?: string, hasNearbyCaption?: boolean}>} Array of image objects
   */
  extractImages(content) {
    const images = [];
    const lines = content.split("\n");

    // Combined regex patterns for better performance
    const markdownImagePattern = /!\[([^\]]*)\]\(([^)]+)\)/g;
    const htmlImagePattern =
      /<img[^>]*src=["']([^"']+)["'][^>]*(?:alt=["']([^"']+)["'][^>]*)?>/g;

    // Extract markdown images with line context
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      let match;

      // Reset regex lastIndex for each line
      markdownImagePattern.lastIndex = 0;
      while ((match = markdownImagePattern.exec(line)) !== null) {
        const imageObj = {
          alt: match[1],
          src: match[2],
          type: "markdown",
          lineNumber: i,
        };

        // Check next few lines for caption in <em> tags
        const caption = this.findNearbyCaption(lines, i);
        if (caption) {
          imageObj.caption = caption;
          imageObj.hasNearbyCaption = true;
        }

        images.push(imageObj);
      }
    }

    // Extract HTML images with line context
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      let match;

      // Reset regex lastIndex for each line
      htmlImagePattern.lastIndex = 0;
      while ((match = htmlImagePattern.exec(line)) !== null) {
        const imageObj = {
          alt: match[2] || "",
          src: match[1],
          type: "html",
          lineNumber: i,
        };

        // Check next few lines for caption in <em> tags
        const caption = this.findNearbyCaption(lines, i);
        if (caption) {
          imageObj.caption = caption;
          imageObj.hasNearbyCaption = true;
        }

        images.push(imageObj);
      }
    }

    return images;
  }

  /**
   * Find caption text in <em> tags near an image
   * @param {string[]} lines - Array of content lines
   * @param {number} imageLineIndex - Line index where image was found
   * @returns {string|null} Caption text if found, null otherwise
   */
  findNearbyCaption(lines, imageLineIndex) {
    // Check the next 3 lines after the image for captions
    for (
      let i = imageLineIndex + 1;
      i <= Math.min(imageLineIndex + 3, lines.length - 1);
      i++
    ) {
      const line = lines[i].trim();

      // Skip empty lines
      if (!line) continue;

      // Look for <em> tags with content
      const emMatch = line.match(/<em>(.*?)<\/em>/);
      if (emMatch) {
        return emMatch[1].trim();
      }

      // Look for *italic* markdown syntax
      const italicMatch = line.match(/^\*([^*]+)\*$/);
      if (italicMatch) {
        return italicMatch[1].trim();
      }

      // Look for _italic_ markdown syntax
      const underscoreMatch = line.match(/^_([^_]+)_$/);
      if (underscoreMatch) {
        return underscoreMatch[1].trim();
      }

      // If we hit non-empty, non-caption content, stop looking
      if (
        line &&
        !line.match(/^<\/?em>/) &&
        !line.match(/^[*_]/) &&
        !line.startsWith("![")
      ) {
        break;
      }
    }

    return null;
  }

  /**
   * Analyze a single blog post
   * @param {string} filePath - Path to the blog post file
   * @returns {Promise<Object>} Analysis results
   */
  async analyzePost(filePath) {
    // Validate file path for security
    const validatedPath = this.validateFilePath(filePath);

    // Check file size before reading
    const stats = await fs.promises.stat(validatedPath);
    if (stats.size > this.MAX_CONTENT_SIZE) {
      throw new Error("File too large to process");
    }

    const content = await fs.promises.readFile(validatedPath, "utf8");
    const frontmatter = this.parseFrontmatter(content);
    const bodyContent = this.extractContent(content);
    const wordCount = this.countWords(bodyContent);
    const headings = this.extractHeadings(bodyContent);
    const images = this.extractImages(bodyContent);

    const analysis = {
      filePath,
      frontmatter: frontmatter.data, // Pass only the data part to analysis
      fullFrontmatter: frontmatter, // Keep full frontmatter info for writing
      content: bodyContent,
      fullContent: content, // Add full content for line number tracking
      wordCount,
      headings,
      images,
      issues: [],
      suggestions: [],
    };

    try {
      this.performSEOAnalysis(analysis);
      this.performLLMOptimization(analysis);
      this.performTigrisTerminologyAnalysis(analysis);
      this.performTagAnalysis(analysis);
    } catch (error) {
      // Sanitize error message to avoid information disclosure
      const sanitizedError = error.message.substring(0, 100);
      console.error(`Error during analysis: ${sanitizedError}`);
      analysis.issues.push(`Analysis error: ${sanitizedError}`);
    }

    return analysis;
  }

  /**
   * Perform SEO analysis
   * @param {Object} analysis - Analysis object to modify
   */
  performSEOAnalysis(analysis) {
    const { frontmatter, content, fullContent, wordCount, headings, images } =
      analysis;

    // Title analysis
    if (!frontmatter.title) {
      analysis.issues.push("Missing title in frontmatter");
    } else {
      const titleLength = frontmatter.title.length;
      const titleLineNumber = this.findFrontmatterLineNumber(
        fullContent,
        "title"
      );

      if (titleLength < SEOReviewer.TITLE_MIN_LENGTH) {
        analysis.suggestions.push(
          this.addBadSuggestion(
            `Title is short (${titleLength} chars). Consider expanding to 50-60 characters for better SEO`,
            titleLineNumber
          )
        );
      } else if (titleLength > SEOReviewer.TITLE_MAX_LENGTH) {
        analysis.suggestions.push(
          this.addBadSuggestion(
            `Title is long (${titleLength} chars). Consider shortening to under 60 characters`,
            titleLineNumber
          )
        );
      }
    }

    // Description analysis
    if (!frontmatter.description) {
      analysis.issues.push("Missing meta description");
      // Generate suggested description
      const suggestedDesc = this.generateImprovedDescription(analysis);
      if (suggestedDesc) {
        analysis.suggestions.push(
          this.addGoodSuggestion(
            `Suggested meta description: "${suggestedDesc}"`
          )
        );
      }
    } else {
      const descLength = frontmatter.description.length;
      const descLineNumber = this.findFrontmatterLineNumber(
        fullContent,
        "description"
      );

      if (descLength < SEOReviewer.DESCRIPTION_MIN_LENGTH) {
        analysis.suggestions.push(
          this.addBadSuggestion(
            `Meta description is short (${descLength} chars). Expand to 150-160 characters`,
            descLineNumber
          )
        );
        // Generate suggested improved description
        const suggestedDesc = this.generateImprovedDescription(analysis);
        if (suggestedDesc) {
          analysis.suggestions.push(
            this.addGoodSuggestion(
              `Suggested improved description: "${suggestedDesc}"`
            )
          );
        }
      } else if (descLength > SEOReviewer.DESCRIPTION_MAX_LENGTH) {
        analysis.suggestions.push(
          this.addBadSuggestion(
            `Meta description is long (${descLength} chars). Shorten to under 160 characters`,
            descLineNumber
          )
        );
        // Generate suggested shortened description
        const suggestedDesc = this.generateImprovedDescription(analysis, true);
        if (suggestedDesc) {
          analysis.suggestions.push(
            this.addGoodSuggestion(
              `Suggested shortened description: "${suggestedDesc}"`
            )
          );
        }
      }
    }

    // Keywords analysis
    const keywordsArray = Array.isArray(frontmatter.keywords)
      ? frontmatter.keywords
      : [];
    const keywordsLineNumber = this.findFrontmatterLineNumber(
      fullContent,
      "keywords"
    );

    if (keywordsArray.length === 0) {
      analysis.suggestions.push(
        this.addBadSuggestion(
          "Consider adding relevant keywords for better discoverability",
          keywordsLineNumber
        )
      );
    } else if (keywordsArray.length > 10) {
      analysis.suggestions.push(
        this.addBadSuggestion(
          "Too many keywords. Focus on 5-8 most relevant ones",
          keywordsLineNumber
        )
      );
    }

    // Content length analysis
    if (wordCount < SEOReviewer.WORD_COUNT_MIN) {
      analysis.issues.push(
        `Content is very short (${wordCount} words). Aim for at least ${SEOReviewer.WORD_COUNT_RECOMMENDED} words`
      );
    } else if (wordCount < SEOReviewer.WORD_COUNT_RECOMMENDED) {
      analysis.suggestions.push(
        `Content is on the shorter side (${wordCount} words). Consider expanding`
      );
    }

    // Heading structure analysis
    if (headings.length === 0) {
      analysis.issues.push("No headings found. Use H2-H6 to structure content");
    } else {
      const h1Count = headings.filter((h) => h.level === 1).length;
      if (h1Count > 1) {
        analysis.issues.push(
          "Multiple H1 tags found. Use only one H1 per page"
        );
      }

      const h2Count = headings.filter((h) => h.level === 2).length;
      if (h2Count === 0) {
        analysis.suggestions.push(
          "No H2 headings found. Add section headings for better structure"
        );
      }
    }

    // Image analysis
    for (const img of images) {
      if (!img.alt || img.alt.trim() === "") {
        if (img.hasNearbyCaption && img.caption) {
          analysis.suggestions.push(
            `Image missing alt text: ${img.src}. Consider using the caption text: "${img.caption}"`
          );
        } else {
          analysis.issues.push(`Image missing alt text: ${img.src}`);
        }
      } else if (img.alt.length < SEOReviewer.ALT_TEXT_MIN_LENGTH) {
        if (
          img.hasNearbyCaption &&
          img.caption &&
          img.caption.length > SEOReviewer.ALT_TEXT_MIN_LENGTH
        ) {
          analysis.suggestions.push(
            `Alt text too short for image: ${img.src}. Consider using the caption text: "${img.caption}"`
          );
        } else {
          analysis.suggestions.push(`Alt text too short for image: ${img.src}`);
        }
      }
    }

    // Slug analysis
    if (frontmatter.slug) {
      if (frontmatter.slug.length > SEOReviewer.SLUG_MAX_LENGTH) {
        analysis.suggestions.push(
          "Slug is quite long. Consider shortening for better URLs"
        );
      }
      if (!/^[a-z0-9-]+$/.test(frontmatter.slug)) {
        analysis.suggestions.push(
          "Slug should only contain lowercase letters, numbers, and hyphens"
        );
      }
    }
  }

  /**
   * Perform LLM optimization analysis
   * @param {Object} analysis - Analysis object to modify
   */
  performLLMOptimization(analysis) {
    const { frontmatter, content, headings } = analysis;

    // Question-style headings for FAQ optimization
    const questionHeadings = headings.filter(
      (h) =>
        h.text.includes("?") ||
        h.text.toLowerCase().startsWith("how ") ||
        h.text.toLowerCase().startsWith("what ") ||
        h.text.toLowerCase().startsWith("why ") ||
        h.text.toLowerCase().startsWith("when ")
    );

    if (questionHeadings.length === 0) {
      analysis.suggestions.push(
        "Consider adding question-style headings (What is..., How to...) for better LLM discovery"
      );
    }

    // Check for clear problem/solution structure
    const hasProblemSection =
      content.toLowerCase().includes("problem") ||
      content.toLowerCase().includes("challenge") ||
      content.toLowerCase().includes("issue");
    const hasSolutionSection =
      content.toLowerCase().includes("solution") ||
      content.toLowerCase().includes("approach") ||
      content.toLowerCase().includes("answer");

    if (!hasProblemSection || !hasSolutionSection) {
      analysis.suggestions.push(
        "Consider adding clear problem/solution structure for better LLM understanding"
      );
    }

    // Check for code examples
    const hasCodeBlocks = content.includes("```") || content.includes("<code>");
    if (hasCodeBlocks) {
      analysis.suggestions.push(
        this.addGoodSuggestion(
          "Great! Code examples help LLMs understand technical content"
        )
      );
    }

    // Check for technical keywords
    const techKeywords = [
      "api",
      "sdk",
      "library",
      "framework",
      "database",
      "cloud",
      "storage",
      "performance",
    ];
    const keywordsArray = Array.isArray(frontmatter.keywords)
      ? frontmatter.keywords
      : [];
    const hasRelevantTechTerms = techKeywords.some(
      (keyword) =>
        content.toLowerCase().includes(keyword) ||
        keywordsArray.some((k) => k && k.toLowerCase().includes(keyword))
    );

    if (!hasRelevantTechTerms) {
      analysis.suggestions.push(
        "Consider including relevant technical keywords for better categorization"
      );
    }

    // Check for context and background
    if (
      !content.toLowerCase().includes("background") &&
      !content.toLowerCase().includes("context")
    ) {
      analysis.suggestions.push(
        "Consider adding background context for better LLM comprehension"
      );
    }

    // Check for conclusion or summary
    const hasConclusion =
      content.toLowerCase().includes("conclusion") ||
      content.toLowerCase().includes("summary") ||
      content.toLowerCase().includes("takeaway");

    if (!hasConclusion) {
      analysis.suggestions.push(
        "Consider adding a conclusion section to summarize key points"
      );
    }
  }

  /**
   * Extract content context for description generation
   */
  extractContentContext(analysis) {
    const { frontmatter, content, headings } = analysis;
    const title = frontmatter.title || "";
    const allText = `${title} ${headings
      .map((h) => h.text)
      .join(" ")} ${content}`.toLowerCase();

    const techKeywords = [
      "ai",
      "machine learning",
      "llm",
      "artificial intelligence",
      "object storage",
      "s3",
      "cloud",
      "multi-cloud",
      "database",
      "api",
      "sdk",
      "terraform",
      "kubernetes",
      "docker",
      "python",
      "javascript",
      "go",
      "rust",
      "java",
      "performance",
      "latency",
      "scalability",
      "distributed",
      "security",
      "encryption",
      "authentication",
      "replication",
    ];

    const conceptKeywords = [
      "development",
      "coding",
      "programming",
      "software",
      "infrastructure",
      "architecture",
      "deployment",
      "migration",
      "optimization",
      "automation",
      "integration",
      "workflow",
      "analytics",
      "monitoring",
      "backup",
      "disaster recovery",
    ];

    const techTerms = techKeywords.filter((term) => allText.includes(term));

    return {
      allText,
      title,
      isTigrisPost: allText.includes("tigris"),
      techTerms,
      concepts: conceptKeywords.filter((concept) => allText.includes(concept)),
      mainTopics: this.extractMainTopics(allText, techTerms),
    };
  }

  /**
   * Extract main topics from content
   */
  extractMainTopics(allText, techTerms) {
    const mainTopics = [];
    if (techTerms.includes("ai") || allText.includes("artificial intelligence"))
      mainTopics.push("AI");
    if (allText.includes("development") || allText.includes("coding"))
      mainTopics.push("development");
    if (allText.includes("software")) mainTopics.push("software");
    if (allText.includes("storage") || allText.includes("data"))
      mainTopics.push("storage");
    return mainTopics;
  }

  /**
   * Determine appropriate action word based on content
   */
  determineActionWord(allText) {
    if (allText.includes("tutorial") || allText.includes("guide"))
      return "Learn how";
    if (allText.includes("compare") || allText.includes("vs"))
      return "Discover";
    if (allText.includes("build") || allText.includes("create")) return "Build";
    if (allText.includes("optimize") || allText.includes("improve"))
      return "Optimize";
    return "Learn how"; // default
  }

  /**
   * Build description based on content context
   */
  buildDescription(context, actionWord) {
    const { isTigrisPost, techTerms, concepts, mainTopics } = context;

    if (isTigrisPost) {
      return this.buildTigrisDescription(context, actionWord);
    } else {
      const primaryTech =
        techTerms.slice(0, 2).join(" and ") ||
        mainTopics.join(" and ") ||
        "technology";
      const primaryConcept = concepts[0] || "development";
      return `${actionWord} ${primaryTech} for ${primaryConcept}. Best practices, examples, and implementation guide.`;
    }
  }

  /**
   * Build Tigris-specific description
   */
  buildTigrisDescription(context, actionWord) {
    const { allText, title, techTerms, concepts, mainTopics } = context;
    const tigrisValueProps = [
      "globally distributed",
      "multi-cloud",
      "low-latency",
      "S3-compatible",
      "no egress fees",
    ];

    const tigrisContext = allText.match(/tigris[^.]*[.!?]/gi) || [];
    const isTigrisFocused =
      tigrisContext.length > 2 || title.toLowerCase().includes("tigris");

    const isAboutDevTools =
      (title.toLowerCase().includes("development") &&
        !title.toLowerCase().includes("tigris")) ||
      title.toLowerCase().includes("coding") ||
      allText.includes("from coding to conversing") ||
      allText.includes("copilot") ||
      allText.includes("ide") ||
      allText.includes("claude code");

    if (isAboutDevTools) {
      const devConcept =
        concepts.find((c) =>
          ["development", "coding", "programming", "software"].includes(c)
        ) || "development";
      return `${actionWord} AI-powered ${devConcept} tools from autocomplete to autonomous agents. Evolution, best practices, and industry insights.`;
    }

    if (isTigrisFocused) {
      const relevantValueProp =
        tigrisValueProps.find(
          (prop) =>
            allText.includes(prop.replace("-", " ")) ||
            allText.includes(prop.replace("-", ""))
        ) || "globally distributed";

      if (techTerms.includes("ai") || allText.includes("model")) {
        return `${actionWord} AI applications with Tigris ${relevantValueProp} object storage. ${
          concepts[0] || "Development"
        } guide with practical examples.`;
      }
      if (concepts.includes("migration") || allText.includes("migrate")) {
        return `${actionWord} to migrate to ${relevantValueProp} object storage with Tigris S3-compatible platform. Complete migration guide.`;
      }
      const primaryConcept = concepts[0] || "development";
      return `${actionWord} ${primaryConcept} with Tigris ${relevantValueProp} object storage. Best practices and implementation guide.`;
    }

    // Post mentions Tigris but isn't primarily about it
    const primaryTech =
      techTerms.slice(0, 2).join(" and ") ||
      mainTopics.join(" and ") ||
      "technology";
    const primaryConcept = concepts[0] || "development";

    if (
      allText.includes("tool") ||
      allText.includes("ide") ||
      allText.includes("development tools")
    ) {
      return `${actionWord} ${primaryTech} ${primaryConcept} tools and methodologies. Real-world examples and industry insights.`;
    }
    return `${actionWord} ${primaryTech} for ${primaryConcept}. Includes Tigris integration examples and best practices.`;
  }

  /**
   * Adjust description length to target range
   */
  adjustDescriptionLength(description, shouldShorten, isTigrisPost) {
    const targetLength = shouldShorten
      ? SEOReviewer.DESCRIPTION_TARGET_LENGTH_SHORT
      : SEOReviewer.DESCRIPTION_TARGET_LENGTH;

    if (description.length > targetLength) {
      const truncated = description.substring(0, targetLength);
      const lastPeriod = truncated.lastIndexOf(".");
      const lastSpace = truncated.lastIndexOf(" ");

      if (lastPeriod > targetLength - 20) {
        description = truncated.substring(0, lastPeriod + 1);
      } else if (lastSpace > targetLength - 15) {
        description = truncated.substring(0, lastSpace) + ".";
      } else {
        description = truncated + "...";
      }
    }

    if (description.length < SEOReviewer.DESCRIPTION_MIN_LENGTH) {
      const additionalContext = isTigrisPost
        ? " Complete guide with examples and best practices."
        : " Step-by-step tutorial with practical examples.";

      if (
        description.length + additionalContext.length <=
        SEOReviewer.DESCRIPTION_MAX_LENGTH
      ) {
        description += additionalContext;
      }
    }

    return description;
  }

  /**
   * Generate improved meta description based on content analysis
   */
  generateImprovedDescription(analysis, shouldShorten = false) {
    const context = this.extractContentContext(analysis);
    const actionWord = this.determineActionWord(context.allText);
    let description = this.buildDescription(context, actionWord);

    // Capitalize first letter
    description = description.charAt(0).toUpperCase() + description.slice(1);

    return this.adjustDescriptionLength(
      description,
      shouldShorten,
      context.isTigrisPost
    );
  }

  /**
   * Perform Tigris terminology standardization analysis
   */
  performTigrisTerminologyAnalysis(analysis) {
    const { frontmatter, content } = analysis;

    // Preferred Tigris descriptions
    const preferredDescriptions = [
      "globally distributed, multi-cloud object storage service",
      "multi-cloud, S3-compatible object storage service",
      "built-in support for the S3 API",
      "Dynamic Data Placement",
      "Access-Based Rebalancing",
      "low-latency access worldwide",
    ];

    // Key Tigris features/concepts that should be consistently described
    const tigrisFeatures = {
      "object storage": {
        preferred: ["object storage service", "object storage"],
        alternatives: ["file storage", "cloud storage"],
        context:
          'Use "object storage" to maintain consistency with S3 terminology',
      },
      "multi-cloud": {
        preferred: ["multi-cloud", "globally distributed"],
        alternatives: ["cross-cloud", "multiple clouds"],
        context: "Emphasize multi-cloud capability as a key differentiator",
      },
      "s3-compatible": {
        preferred: [
          "S3-compatible",
          "S3 API",
          "built-in support for the S3 API",
        ],
        alternatives: ["S3-like", "Amazon S3 compatible", "S3 protocol"],
        context: "Highlight native S3 compatibility for easy migration",
      },
      "low latency": {
        preferred: ["low-latency", "low latency"],
        alternatives: ["fast", "quick", "high performance", "speedy"],
        context: "Low latency is a core value proposition",
      },
    };

    // Deprecated or less preferred terms
    const deprecatedTerms = [
      {
        term: "Amazon S3 compatible",
        preferred: "S3-compatible",
        reason: "Avoid competitor branding",
      },
      {
        term: "cross-cloud",
        preferred: "multi-cloud",
        reason: "Standard industry terminology",
      },
      {
        term: "fast access",
        preferred: "low-latency access",
        reason: "More technical and precise",
      },
    ];

    const contentLower = content.toLowerCase();
    const fullText = `${frontmatter.title || ""} ${
      frontmatter.description || ""
    } ${content}`.toLowerCase();

    // Check for preferred terminology usage
    let hasPreferredDescription = false;
    for (const desc of preferredDescriptions) {
      if (fullText.includes(desc.toLowerCase())) {
        hasPreferredDescription = true;
        analysis.suggestions.push(
          `Great! Using preferred Tigris description: "${desc}"`
        );
        break;
      }
    }

    // Check if this post mentions Tigris but lacks a proper description
    const mentionsTigris = fullText.includes("tigris");
    if (mentionsTigris && !hasPreferredDescription) {
      analysis.suggestions.push(
        'Consider adding a standard Tigris description. Suggested: "Tigris is a globally distributed, multi-cloud object storage service with built-in support for the S3 API"'
      );
    }

    // Check for deprecated terminology
    for (const deprecated of deprecatedTerms) {
      if (contentLower.includes(deprecated.term.toLowerCase())) {
        analysis.suggestions.push(
          `Consider replacing "${deprecated.term}" with "${deprecated.preferred}". Reason: ${deprecated.reason}`
        );
      }
    }

    // Check for key feature descriptions
    for (const [feature, info] of Object.entries(tigrisFeatures)) {
      const hasPreferred = info.preferred.some((term) =>
        contentLower.includes(term.toLowerCase())
      );
      const hasAlternative = info.alternatives.some((term) =>
        contentLower.includes(term.toLowerCase())
      );

      if (hasAlternative && !hasPreferred) {
        analysis.suggestions.push(
          `Consider using preferred terminology for ${feature}: ${info.preferred.join(
            " or "
          )}. ${info.context}`
        );
      }
    }

    // Key Tigris value propositions
    const valueProps = [
      "low latency",
      "multi-cloud",
      "globally distributed",
      "no egress fees",
      "dynamic placement",
      "access-based rebalancing",
      "performance",
      "developer experience",
      "DevEx",
    ];

    const titleDesc = `${frontmatter.title || ""} ${
      frontmatter.description || ""
    }`.toLowerCase();
    const hasValueProp = valueProps.some((prop) => titleDesc.includes(prop));

    if (mentionsTigris && !hasValueProp) {
      analysis.suggestions.push(
        'Consider highlighting a key Tigris value proposition in title/description (e.g., "low latency", "multi-cloud", "globally distributed")'
      );
    }

    // Check for technical accuracy
    const technicalTerms = {
      bucket: {
        context: "S3 terminology",
        goodWith: ["object", "key", "prefix"],
        avoid: ["folder", "directory"],
      },
      object: {
        context: 'Preferred over "file" in object storage',
        goodWith: ["bucket", "key", "metadata"],
        avoid: ["document", "record"],
      },
    };

    for (const [term, info] of Object.entries(technicalTerms)) {
      if (contentLower.includes(term)) {
        const hasAvoidTerms = info.avoid.some((avoid) =>
          contentLower.includes(avoid)
        );
        if (hasAvoidTerms) {
          analysis.suggestions.push(
            `When using "${term}" (${
              info.context
            }), avoid mixing with terms like ${info.avoid.join(
              ", "
            )}. Use ${info.goodWith.join(", ")} instead for consistency`
          );
        }
      }
    }

    // Brand consistency checks
    if (contentLower.includes("tigris")) {
      // Check for consistent capitalization in title/headings
      const tigrisVariations = content.match(/\btigris\b/gi) || [];
      const incorrectCaps = tigrisVariations.filter(
        (variation) => variation !== "Tigris" && variation !== "TIGRIS"
      );

      if (incorrectCaps.length > 0) {
        analysis.suggestions.push(
          'Ensure consistent "Tigris" capitalization (capitalize when used as product name)'
        );
      }
    }
  }

  /**
   * Perform tag analysis and suggestions
   */
  performTagAnalysis(analysis) {
    const { frontmatter, content, headings } = analysis;
    const allText = `${frontmatter.title || ""} ${
      frontmatter.description || ""
    } ${headings.map((h) => h.text).join(" ")} ${content}`.toLowerCase();
    const currentTags = Array.isArray(frontmatter.tags) ? frontmatter.tags : [];
    const currentTagsLower = currentTags
      .map((t) => t?.toLowerCase?.() || "")
      .filter(Boolean);

    // Category tags that must be at the top of the list and should never be moved/removed
    const categoryTags = [
      "engineering",
      "build with tigris",
      "customers",
      "updates",
    ];
    const currentCategoryTags = currentTags.filter((tag) =>
      categoryTags.includes(tag.toLowerCase())
    );
    const nonCategoryTags = currentTags.filter(
      (tag) => !categoryTags.includes(tag.toLowerCase())
    );

    // Standard tag categories used in the blog
    const tagCategories = {
      // Core technical areas - only suggest if clearly relevant
      Engineering: [
        "engineering",
        "technical implementation",
        "software engineering",
        "system design",
      ],
      AI: [
        "\\bai\\b",
        "artificial intelligence",
        "machine learning",
        "llm",
        "neural network",
        "deep learning",
      ],
      Security: [
        "security",
        "encryption",
        "authentication",
        "authorization",
        "vulnerability",
      ],
      Performance: [
        "performance",
        "benchmark",
        "latency",
        "throughput",
        "speed optimization",
      ],
      Scalability: [
        "scalability",
        "horizontal scaling",
        "load balancing",
        "distributed systems",
      ],

      // Technologies
      Python: ["python", "pytorch", "dask", "jupyter", "pip"],
      Kubernetes: [
        "kubernetes",
        "k8s",
        "container",
        "deployment",
        "helm",
        "kubectl",
      ],
      Docker: [
        "docker",
        "dockerfile",
        "registry",
        "image",
        "container registry",
      ],
      Database: ["database", "foundationdb", "sql", "nosql", "transactions"],
      Cloud: ["cloud", "aws", "azure", "gcp", "multi-cloud"],

      // Tigris-specific
      "Object Storage": [
        "object storage",
        "blob storage",
        "s3",
        "bucket",
        "data storage",
      ],
      Migration: ["migration", "migrate", "transfer", "move"],
      Tigris: ["tigris", "tigrisfs", "tigrisdata"],

      // Content types
      "Thought Leadership": [
        "future of",
        "evolution",
        "industry insight",
        "trends",
        "opinion",
        "perspective",
        "transformation",
      ],
      "Build with Tigris": [
        "tutorial",
        "step-by-step",
        "how to build",
        "getting started",
        "complete guide",
      ],
      Features: [
        "new feature",
        "announcement",
        "release",
        "introducing",
        "now available",
      ],
      Customers: [
        "customer story",
        "case study",
        "success story",
        "testimonial",
      ],
      Development: [
        "development tools",
        "coding",
        "programming",
        "ide",
        "developer experience",
      ],
    };

    // Technology-specific tags
    const techKeywords = {
      elixir: ["elixir", "phoenix", "erlang"],
      lancedb: ["lancedb", "vector database", "embeddings"],
      duckdb: ["duckdb", "analytics", "olap"],
      anubis: ["anubis", "change data capture", "cdc"],
      foundationdb: ["foundationdb", "fdb", "acid"],
      mcp: ["mcp", "model context protocol", "claude"],
      deepseek: ["deepseek", "reasoning", "thinking"],
      datasets: ["datasets", "hugging face", "training data"],
      copilot: ["copilot", "github copilot"],
      cursor: ["cursor", "ai-native ide"],
      claude: ["claude code", "anthropic"],
    };

    const suggestedTags = new Set();
    const missingTags = [];

    // Pre-compile regex patterns for better performance
    const regexPatterns = new Map();
    for (const [category, keywords] of Object.entries(tagCategories)) {
      if (categoryTags.includes(category.toLowerCase())) continue;

      const regexKeywords = keywords.filter(
        (k) => k.startsWith("\\b") && k.endsWith("\\b")
      );
      const plainKeywords = keywords.filter(
        (k) => !(k.startsWith("\\b") && k.endsWith("\\b"))
      );

      if (regexKeywords.length > 0) {
        regexPatterns.set(category, new RegExp(regexKeywords.join("|"), "i"));
      }

      // Check for matches
      const hasRegexMatch =
        regexPatterns.has(category) &&
        regexPatterns.get(category).test(allText);
      const hasPlainMatch = plainKeywords.some((keyword) =>
        allText.includes(keyword)
      );

      if (hasRegexMatch || hasPlainMatch) {
        const normalizedCategory = category.toLowerCase();
        if (!currentTagsLower.includes(normalizedCategory)) {
          suggestedTags.add(category);
        }
      }
    }

    // Check for technology-specific tags
    for (const [tech, keywords] of Object.entries(techKeywords)) {
      const matches = keywords.some((keyword) => allText.includes(keyword));
      if (matches && !currentTags.includes(tech)) {
        suggestedTags.add(tech);
      }
    }

    // Special logic for specific patterns
    if (allText.includes("tigris") && !currentTags.includes("tigris")) {
      suggestedTags.add("Tigris");
    }

    if (
      (allText.includes("guide") ||
        allText.includes("tutorial") ||
        allText.includes("how to")) &&
      allText.includes("tigris") &&
      !currentTags.includes("build with tigris")
    ) {
      suggestedTags.add("Build with Tigris");
    }

    // Check for missing fundamental tags
    if (currentTags.length === 0) {
      analysis.issues.push(
        "No tags found. Add relevant tags for better discoverability"
      );
    } else if (currentTags.length < 2) {
      analysis.suggestions.push(
        "Consider adding more tags (2-5 recommended) for better categorization"
      );
    } else if (currentTags.length > 6) {
      analysis.suggestions.push(
        "Too many tags. Focus on 3-5 most relevant ones"
      );
    }

    // Suggest missing tags
    if (suggestedTags.size > 0) {
      const suggestions = Array.from(suggestedTags).slice(0, 5); // Limit to 5 suggestions
      analysis.suggestions.push(
        `Consider adding tags: ${suggestions.join(", ")}`
      );
    }

    // Tag consistency checks (excluding category tags)
    const inconsistentTags = [];
    for (const tag of nonCategoryTags) {
      // Check for common inconsistencies in non-category tags
      if (tag === "ai" && !currentTags.includes("AI")) {
        inconsistentTags.push('Use "AI" instead of "ai" for consistency');
      }
      if (tag === "engineering" && !currentTags.includes("Engineering")) {
        inconsistentTags.push(
          'Use "Engineering" instead of "engineering" for consistency'
        );
      }
    }

    // Validate category tag positioning
    if (currentCategoryTags.length > 0) {
      const firstCategoryIndex = currentTags.findIndex((tag) =>
        categoryTags.includes(tag.toLowerCase())
      );
      const hasNonCategoryBeforeCategory = currentTags
        .slice(0, firstCategoryIndex)
        .some((tag) => !categoryTags.includes(tag.toLowerCase()));

      if (hasNonCategoryBeforeCategory) {
        analysis.suggestions.push(
          "Category tags (Engineering, Build with Tigris, Customers, Updates) should be at the top of the tag list"
        );
      }
    }

    if (inconsistentTags.length > 0) {
      inconsistentTags.forEach((suggestion) => {
        analysis.suggestions.push(`${suggestion}`);
      });
    }

    // Check for deprecated or outdated tags
    const deprecatedTags = {
      "vibe-coding": "vibe coding",
      "end-to-end-encryption": "security",
      "open beta": "features",
    };

    for (const tag of currentTags) {
      if (deprecatedTags[tag]) {
        analysis.suggestions.push(
          `Consider replacing "${tag}" with "${deprecatedTags[tag]}" for better consistency`
        );
      }
    }
  }

  /**
   * Generate a report for a single post
   */
  generatePostReport(analysis) {
    const {
      filePath,
      frontmatter,
      wordCount,
      headings,
      images,
      issues,
      suggestions,
    } = analysis;

    const report = [];
    report.push(
      `# SEO Review: ${frontmatter.title || path.basename(filePath)}`
    );
    report.push(`**File:** ${path.relative(this.blogDir, filePath)}`);
    report.push(`**Word Count:** ${wordCount}`);
    report.push(`**Headings:** ${headings.length}`);
    report.push(`**Images:** ${images.length}`);
    report.push("");

    if (issues.length > 0) {
      report.push("## Issues to Fix");
      issues.forEach((issue) => report.push(`- ${issue}`));
      report.push("");
    }

    if (suggestions.length > 0) {
      report.push("## Suggestions for Improvement");
      suggestions.forEach((suggestion) => {
        // Handle both old string format and new object format for backward compatibility
        if (typeof suggestion === "string") {
          report.push(`- ${suggestion}`);
        } else {
          const emoji = SEOReviewer.SUGGESTION_EMOJIS[suggestion.kind] || "";
          const lineInfo = suggestion.lineNumber
            ? `:${suggestion.lineNumber}`
            : "";
          const fileName = path.relative(this.blogDir, filePath);
          report.push(`- ${fileName}${lineInfo} ${emoji} ${suggestion.body}`);
        }
      });
      report.push("");
    }

    if (issues.length === 0 && suggestions.length === 0) {
      report.push("## Excellent!");
      report.push(
        "This post looks great from an SEO and LLM optimization perspective."
      );
      report.push("");
    }

    // Detailed analysis
    report.push("## 📊 Detailed Analysis");

    // Frontmatter analysis
    report.push("### Frontmatter");
    report.push(
      `- **Title:** ${
        frontmatter.title
          ? `"${frontmatter.title}" (${frontmatter.title.length} chars)`
          : "Missing"
      }`
    );
    report.push(
      `- **Description:** ${
        frontmatter.description
          ? `${frontmatter.description.length} chars`
          : "Missing"
      }`
    );
    report.push(
      `- **Keywords:** ${
        frontmatter.keywords
          ? frontmatter.keywords.length + " keywords"
          : "None"
      }`
    );
    report.push(
      `- **Tags:** ${frontmatter.tags ? frontmatter.tags.join(", ") : "None"}`
    );
    report.push("");

    // Content structure
    report.push("### Content Structure");
    if (headings.length > 0) {
      headings.forEach((heading) => {
        const indent = "  ".repeat(heading.level - 1);
        report.push(`${indent}- H${heading.level}: ${heading.text}`);
      });
    } else {
      report.push("- No headings found");
    }
    report.push("");

    // Images
    if (images.length > 0) {
      report.push("### Images");
      images.forEach((img, index) => {
        report.push(`${index + 1}. **${img.src}**`);
        report.push(`   - Alt text: ${img.alt || "Missing"}`);
        if (img.hasNearbyCaption && img.caption) {
          report.push(`   - Caption detected: "${img.caption}"`);
        }
        report.push(`   - Type: ${img.type}`);
      });
      report.push("");
    }

    // Terminology Analysis
    const terminologySuggestions = suggestions.filter((s) => {
      const text = this.getSuggestionText(s);
      return (
        (text.includes("Tigris") || text.includes("terminology")) &&
        !text.includes("Consider adding tags:") &&
        !text.includes('Use "') &&
        !text.includes("Consider replacing")
      );
    });
    if (terminologySuggestions.length > 0) {
      report.push("### Tigris Terminology");
      terminologySuggestions.forEach((suggestion) => {
        report.push(`- ${this.getSuggestionText(suggestion)}`);
      });
      report.push("");
    }

    // Tag Analysis
    const tagSuggestions = suggestions.filter((s) => {
      const text = this.getSuggestionText(s);
      return (
        text.includes("Consider adding tags:") ||
        (text.includes('Use "') && text.includes("for consistency")) ||
        text.includes("Consider replacing")
      );
    });
    if (tagSuggestions.length > 0) {
      report.push("### Tag Suggestions");
      tagSuggestions.forEach((suggestion) => {
        report.push(`- ${this.getSuggestionText(suggestion)}`);
      });
      report.push("");
    }

    return report.join("\n");
  }

  /**
   * Analyze all blog posts in the directory
   */
  async analyzeAllPosts() {
    const blogPosts = [];

    try {
      // Find all index.mdx and index.md files in blog subdirectories
      const blogDirs = await fs.promises.readdir(this.blogDir);
      const directories = [];

      for (const dir of blogDirs) {
        const fullPath = path.join(this.blogDir, dir);
        try {
          const stat = await fs.promises.stat(fullPath);
          if (stat.isDirectory()) {
            directories.push(dir);
          }
        } catch (error) {
          // Categorize and handle different error types appropriately
          if (error.code === "ENOENT") {
            // File doesn't exist - expected, continue
            continue;
          } else if (error.code === "EACCES") {
            console.warn(`Permission denied: ${fullPath}`);
            continue;
          } else {
            // Unexpected error - log and continue
            console.error(
              `Unexpected error accessing ${fullPath}:`,
              error.message
            );
            continue;
          }
        }
      }

      for (const dir of directories) {
        const dirPath = path.join(this.blogDir, dir);
        const indexMdx = path.join(dirPath, "index.mdx");
        const indexMd = path.join(dirPath, "index.md");

        try {
          if (await this.fileExists(indexMdx)) {
            const analysis = await this.analyzePost(indexMdx);
            blogPosts.push(analysis);
          } else if (await this.fileExists(indexMd)) {
            const analysis = await this.analyzePost(indexMd);
            blogPosts.push(analysis);
          }
        } catch (error) {
          console.error(`Error analyzing ${dir}:`, error.message);
          // Continue with other posts
        }
      }
    } catch (error) {
      throw new Error(`Error reading blog directory: ${error.message}`);
    }

    return blogPosts;
  }

  /**
   * Generate summary report
   */
  generateSummaryReport(analyses) {
    const report = [];
    report.push("# Blog SEO Summary Report");
    report.push(`Generated on: ${new Date().toISOString()}`);
    report.push(`Total posts analyzed: ${analyses.length}`);
    report.push("");

    // Overall statistics
    const totalIssues = analyses.reduce((sum, a) => sum + a.issues.length, 0);
    const totalSuggestions = analyses.reduce(
      (sum, a) => sum + a.suggestions.length,
      0
    );
    const postsWithIssues = analyses.filter((a) => a.issues.length > 0).length;
    const avgWordCount = Math.round(
      analyses.reduce((sum, a) => sum + a.wordCount, 0) / analyses.length
    );

    report.push("## 📈 Overall Statistics");
    report.push(
      `- **Posts with issues:** ${postsWithIssues}/${analyses.length}`
    );
    report.push(`- **Total issues:** ${totalIssues}`);
    report.push(`- **Total suggestions:** ${totalSuggestions}`);
    report.push(`- **Average word count:** ${avgWordCount}`);
    report.push("");

    // Most common issues
    const issueTypes = {};
    analyses.forEach((a) => {
      a.issues.forEach((issue) => {
        const type = issue.split(" ")[1]; // Get the main issue type
        issueTypes[type] = (issueTypes[type] || 0) + 1;
      });
    });

    if (Object.keys(issueTypes).length > 0) {
      report.push("## 🔥 Most Common Issues");
      Object.entries(issueTypes)
        .sort(([, a], [, b]) => b - a)
        .forEach(([type, count]) => {
          report.push(`- **${type}:** ${count} posts`);
        });
      report.push("");
    }

    // Posts that need attention
    const postsNeedingAttention = analyses
      .filter((a) => a.issues.length > 0)
      .sort((a, b) => b.issues.length - a.issues.length)
      .slice(0, 10);

    if (postsNeedingAttention.length > 0) {
      report.push("## 🚨 Posts Needing Attention");
      postsNeedingAttention.forEach((analysis) => {
        const filename = path.basename(path.dirname(analysis.filePath));
        report.push(
          `- **${filename}:** ${analysis.issues.length} issues, ${analysis.suggestions.length} suggestions`
        );
      });
      report.push("");
    }

    // Best performing posts
    const bestPosts = analyses
      .filter((a) => a.issues.length === 0)
      .sort((a, b) => a.suggestions.length - b.suggestions.length)
      .slice(0, 5);

    if (bestPosts.length > 0) {
      report.push("## ⭐ Best Performing Posts");
      bestPosts.forEach((analysis) => {
        const filename = path.basename(path.dirname(analysis.filePath));
        report.push(
          `- **${filename}:** No issues, ${analysis.suggestions.length} minor suggestions`
        );
      });
      report.push("");
    }

    return report.join("\n");
  }

  /**
   * Serialize frontmatter data back to a YAML string using js-yaml.
   * @param {Object} data - The frontmatter data object.
   * @returns {string} Serialized YAML string.
   */
  serializeFrontmatter(data) {
    try {
      return yaml
        .dump(data, {
          indent: 2,
          lineWidth: -1, // Don't wrap lines
          noRefs: true, // Don't use anchors/references
          sortKeys: false, // Preserve key order
        })
        .trim();
    } catch (error) {
      throw new Error(`Failed to serialize YAML: ${error.message}`);
    }
  }

  /**
   * Apply suggested changes directly to the blog post file.
   * @param {string} filePath - Path to the blog post file.
   * @param {Object} analysis - The analysis result containing issues and suggestions.
   */
  async applySuggestions(filePath, analysis) {
    // Validate file path for security
    const validatedPath = this.validateFilePath(filePath);

    let fileContent = await fs.promises.readFile(validatedPath, "utf8");
    const originalFrontmatter = this.parseFrontmatter(fileContent);
    let updatedFrontmatterData = { ...originalFrontmatter.data }; // Clone to modify
    let updatedContentBody = this.extractContent(fileContent);

    // Apply meta description changes
    const suggestedDescMatch = analysis.suggestions.find((s) => {
      const text = this.getSuggestionText(s);
      return (
        text.startsWith("Suggested improved description:") ||
        text.startsWith("Suggested meta description:") ||
        text.startsWith("Suggested shortened description:")
      );
    });
    if (suggestedDescMatch) {
      const suggestionText = this.getSuggestionText(suggestedDescMatch);
      const descriptionMatch = suggestionText.match(/"([^"]*)"/);
      if (descriptionMatch) {
        const newDescription = descriptionMatch[1];
        updatedFrontmatterData.description = newDescription;
        console.log(`- Applied new meta description: "${newDescription}"`);
      }
    }

    // Apply tag changes (additions, casing, positioning)
    if (
      analysis.suggestions.some((s) =>
        this.getSuggestionText(s).startsWith("Consider adding tags:")
      ) ||
      analysis.suggestions.some((s) => {
        const text = this.getSuggestionText(s);
        return text.includes('Use "') && text.includes("for consistency");
      }) ||
      analysis.suggestions.some((s) => {
        const text = this.getSuggestionText(s);
        return (
          text.includes("Category tags") &&
          text.includes("should be at the top")
        );
      })
    ) {
      const currentTags = Array.isArray(originalFrontmatter.data.tags)
        ? originalFrontmatter.data.tags
        : [];
      let newTagsArray = [...currentTags]; // Start with current tags

      // Add suggested tags
      const suggestedTagsMatch = analysis.suggestions.find((s) =>
        this.getSuggestionText(s).startsWith("Consider adding tags:")
      );
      if (suggestedTagsMatch) {
        const tagsToAdd = this.getSuggestionText(suggestedTagsMatch)
          .match(/tags: (.*)/)[1]
          .split(", ")
          .map((t) => t.trim());
        newTagsArray = Array.from(new Set([...newTagsArray, ...tagsToAdd])); // Add new, avoid duplicates
        console.log(`- Added suggested tags: ${tagsToAdd.join(", ")}`);
      }

      // Fix tag casing
      const aiConsistencyMatch = analysis.suggestions.find((s) =>
        this.getSuggestionText(s).includes(
          'Use "AI" instead of "ai" for consistency'
        )
      );
      if (aiConsistencyMatch) {
        newTagsArray = newTagsArray.map((tag) =>
          tag.toLowerCase() === "ai" ? "AI" : tag
        );
        console.log(`- Corrected "ai" to "AI"`);
      }
      const engineeringConsistencyMatch = analysis.suggestions.find((s) =>
        this.getSuggestionText(s).includes(
          'Use "Engineering" instead of "engineering" for consistency'
        )
      );
      if (engineeringConsistencyMatch) {
        newTagsArray = newTagsArray.map((tag) =>
          tag.toLowerCase() === "engineering" ? "Engineering" : tag
        );
        console.log(`- Corrected "engineering" to "Engineering"`);
      }

      // Reorder category tags
      const categoryPositioningMatch = analysis.suggestions.find((s) => {
        const text = this.getSuggestionText(s);
        return (
          text.includes("Category tags") &&
          text.includes("should be at the top")
        );
      });
      if (categoryPositioningMatch) {
        const categoryTagsLower = [
          "engineering",
          "build with tigris",
          "customers",
          "updates",
        ];
        let presentCategoryTags = newTagsArray.filter((tag) =>
          categoryTagsLower.includes(tag.toLowerCase())
        );
        let remainingTags = newTagsArray.filter(
          (tag) => !categoryTagsLower.includes(tag.toLowerCase())
        );

        // Preserve original casing for category tags found in original frontmatter
        const originalCategoryTagsMap = {};
        originalFrontmatter.data.tags?.forEach((tag) => {
          if (categoryTagsLower.includes(tag.toLowerCase())) {
            originalCategoryTagsMap[tag.toLowerCase()] = tag;
          }
        });
        presentCategoryTags = presentCategoryTags.map(
          (tag) => originalCategoryTagsMap[tag.toLowerCase()] || tag
        );

        updatedFrontmatterData.tags = [
          ...presentCategoryTags,
          ...remainingTags,
        ];
        console.log(`- Reordered category tags to the top`);
      } else {
        updatedFrontmatterData.tags = newTagsArray; // If no reordering, just update with new/cased tags
      }

      // Apply deprecated tag replacements
      const deprecatedTagsMap = {
        // Only those explicitly suggested for replacement
        "vibe-coding": "vibe coding",
        "end-to-end-encryption": "security",
        "open beta": "features",
      };
      for (const deprecatedTerm in deprecatedTagsMap) {
        if (newTagsArray.includes(deprecatedTerm)) {
          updatedFrontmatterData.tags = updatedFrontmatterData.tags.map((tag) =>
            tag === deprecatedTerm ? deprecatedTagsMap[deprecatedTerm] : tag
          );
          console.log(
            `- Replaced deprecated tag "${deprecatedTerm}" with "${deprecatedTagsMap[deprecatedTerm]}"`
          );
        }
      }
    }

    // Apply deprecated terminology replacements in content body
    const deprecatedTerms = [
      {
        term: "Amazon S3 compatible",
        preferred: "S3-compatible",
        reason: "Avoid competitor branding",
      },
      {
        term: "cross-cloud",
        preferred: "multi-cloud",
        reason: "Standard industry terminology",
      },
      {
        term: "fast access",
        preferred: "low-latency access",
        reason: "More technical and precise",
      },
    ];
    for (const deprecated of deprecatedTerms) {
      try {
        // Safely escape regex special characters to prevent ReDoS attacks
        const escapedTerm = this.escapeRegex(deprecated.term);
        const regex = new RegExp(`\\b${escapedTerm}\\b`, "gi"); // Word boundary for precise matching

        if (regex.test(updatedContentBody)) {
          // Reset regex for replacement
          const replaceRegex = new RegExp(`\\b${escapedTerm}\\b`, "gi");
          updatedContentBody = updatedContentBody.replace(
            replaceRegex,
            deprecated.preferred
          );
          console.log(
            `- Replaced "${deprecated.term}" with "${deprecated.preferred}" in content.`
          );
        }
      } catch (error) {
        console.warn(
          `- Skipped replacement of "${deprecated.term}": ${error.message}`
        );
      }
    }

    // Apply caption text as alt text for images
    const captionSuggestions = analysis.suggestions.filter((s) => {
      const text = this.getSuggestionText(s);
      return (
        text.includes("Consider using the caption text:") &&
        (text.includes("Image missing alt text:") ||
          text.includes("Alt text too short for image:"))
      );
    });

    for (const suggestion of captionSuggestions) {
      const suggestionText = this.getSuggestionText(suggestion);
      const imagePathMatch = suggestionText.match(
        /Image (?:missing alt text|Alt text too short for image): ([^\s]+\.[a-zA-Z0-9]+)/
      );
      const captionMatch = suggestionText.match(
        /Consider using the caption text: "([^"]+)"/
      );

      if (imagePathMatch && captionMatch) {
        const imagePath = this.sanitizeImagePath(imagePathMatch[1]);
        const captionText = captionMatch[1]
          .replace(/["'<>]/g, "")
          .substring(0, 200); // Sanitize caption

        // Use safer, more specific regex patterns
        try {
          const escapedPath = this.escapeRegex(imagePath);

          // Safety check: Skip if this path appears in import statements or JSX props
          const hasImportStatement =
            updatedContentBody.includes(`import `) &&
            updatedContentBody.includes(imagePath);
          const hasJSXProp = updatedContentBody.match(
            new RegExp(`\\w+={[^}]*${escapedPath}[^}]*}`)
          );

          if (hasImportStatement || hasJSXProp) {
            console.log(
              `- Skipped caption application for ${imagePath}: Found in import/JSX context`
            );
            continue;
          }

          // Handle markdown images: ![old_alt](image_path) -> ![caption_text](image_path)
          const markdownPattern = `!\\[([^\\]]*)\\]\\(([^)]*${escapedPath}[^)]*)\\)`;
          const markdownImageRegex = new RegExp(markdownPattern, "g");

          // Only apply if we find actual markdown image syntax, not just the path
          if (markdownImageRegex.test(updatedContentBody)) {
            // Reset regex for actual replacement
            const markdownImageRegexForReplace = new RegExp(
              markdownPattern,
              "g"
            );
            updatedContentBody = updatedContentBody.replace(
              markdownImageRegexForReplace,
              `![${captionText}]($2)`
            );
            console.log(
              `- Applied caption as alt text for image: ${imagePath.substring(
                0,
                50
              )}...`
            );
          }

          // Handle HTML images with more targeted approach
          // Only match actual <img> tags, not JSX props or imports
          const imgTagPattern = `<img([^>]*src=["'][^"']*${escapedPath}[^"']*["'][^>]*)>`;
          const htmlImageRegex = new RegExp(imgTagPattern, "g");

          // Only apply if we find actual <img> tags, and avoid JSX/imports
          if (htmlImageRegex.test(updatedContentBody)) {
            // Reset regex for actual replacement
            const htmlImageRegexForReplace = new RegExp(imgTagPattern, "g");
            updatedContentBody = updatedContentBody.replace(
              htmlImageRegexForReplace,
              (match, attributes) => {
                if (attributes.includes("alt=")) {
                  // Replace existing alt text
                  return match.replace(
                    /alt=["'][^"']*["']/,
                    `alt="${captionText}"`
                  );
                } else {
                  // Add alt text
                  return `<img${attributes} alt="${captionText}">`;
                }
              }
            );
          }
        } catch (error) {
          console.warn(
            `- Skipped caption application for ${imagePath}: ${error.message}`
          );
        }
      }
    }

    // Combine updated frontmatter and content body
    const newFrontmatterString = this.serializeFrontmatter(
      updatedFrontmatterData
    );
    const newFileContent = `---\n${newFrontmatterString}\n---\n${updatedContentBody}`;

    // Atomic file write using unique temporary file to prevent race conditions
    const tempFile = `${validatedPath}.tmp.${Date.now()}.${Math.random()
      .toString(36)
      .substring(2)}`;
    try {
      await fs.promises.writeFile(tempFile, newFileContent, "utf8");
      await fs.promises.rename(tempFile, validatedPath);
      console.log(
        `✓ File updated successfully: ${path.relative(
          process.cwd(),
          validatedPath
        )}`
      );
    } catch (error) {
      // Clean up temp file on error
      try {
        await fs.promises.unlink(tempFile);
      } catch (cleanupError) {
        // Log but ignore cleanup errors
        console.warn(`Warning: Could not clean up temporary file: ${tempFile}`);
      }
      throw new Error(`Failed to update file: ${error.message}`);
    }
  }

  /**
   * Helper method to check if file exists
   */
  async fileExists(filePath) {
    try {
      await fs.promises.access(filePath);
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Main execution function
   * @param {string|null} postPathArg - Optional path to a specific post.
   * @param {boolean} applyChanges - Whether to apply suggestions directly to files.
   * @param {boolean} analyzeAllExplicitly - Whether to explicitly analyze all posts regardless of postPathArg.
   */
  async run(
    postPathArg = null,
    applyChanges = false,
    analyzeAllExplicitly = false
  ) {
    try {
      console.log("🔍 Starting SEO Review...\n");
      let targetPaths = [];

      if (analyzeAllExplicitly) {
        console.log("Analyzing all posts...");
        targetPaths = (await this.analyzeAllPosts()).map((a) => a.filePath);
      } else if (postPathArg) {
        targetPaths.push(postPathArg);
      } else {
        const currentDir = process.cwd();
        const indexMdx = path.join(currentDir, "index.mdx");
        const indexMd = path.join(currentDir, "index.md");

        if (await this.fileExists(indexMdx)) {
          targetPaths.push(indexMdx);
          console.log(`Auto-detected blog post: ${path.basename(currentDir)}`);
        } else if (await this.fileExists(indexMd)) {
          targetPaths.push(indexMd);
          console.log(`Auto-detected blog post: ${path.basename(currentDir)}`);
        } else {
          console.log(
            "No specific post detected, analyzing all posts by default."
          );
          targetPaths = (await this.analyzeAllPosts()).map((a) => a.filePath);
        }
      }

      if (targetPaths.length === 0) {
        console.error("Error: No blog posts found to analyze.");
        console.error(
          "Usage: node seo-reviewer.js [blog-post-path] [--apply] [--all]"
        );
        process.exit(1);
      }

      const analyses = [];
      for (const p of targetPaths) {
        try {
          const analysis = await this.analyzePost(p);
          analyses.push(analysis);
        } catch (error) {
          console.error(`Error analyzing ${p}: ${error.message}`);
        }
      }

      if (targetPaths.length === 1 && !analyzeAllExplicitly) {
        console.log(this.generatePostReport(analyses[0]));
        if (applyChanges) {
          console.log("\n✨ Applying suggested changes...");
          await this.applySuggestions(targetPaths[0], analyses[0]);
          console.log("Changes applied successfully.");
          const updatedAnalysis = await this.analyzePost(targetPaths[0]);
          console.log("\n--- Review after applying changes ---\n");
          console.log(this.generatePostReport(updatedAnalysis));
        }
      } else {
        console.log(this.generateSummaryReport(analyses));
        console.log("\n" + "=".repeat(80) + "\n");

        const postsWithIssues = analyses.filter((a) => a.issues.length > 0);
        if (postsWithIssues.length > 0) {
          console.log("## Individual Post Reports (Posts with Issues)\n");
          for (const analysis of postsWithIssues) {
            console.log(this.generatePostReport(analysis));
            console.log("\n" + "-".repeat(80) + "\n");
            if (applyChanges) {
              console.log(`✨ Applying changes to ${analysis.filePath}...`);
              await this.applySuggestions(analysis.filePath, analysis);
              console.log("Changes applied.");
            }
          }
        }
      }
    } catch (error) {
      console.error(`Error during SEO review: ${error.message}`);
      throw error;
    }
  }
}

// CLI interface
async function main() {
  try {
    const reviewer = new SEOReviewer();
    const args = process.argv.slice(2);
    let postPathArg = null;
    let applyChanges = false;
    let analyzeAllExplicitly = false;

    for (const arg of args) {
      if (arg === "--apply") {
        applyChanges = true;
      } else if (arg === "--all") {
        analyzeAllExplicitly = true;
      } else {
        postPathArg = arg;
      }
    }

    if (postPathArg && !(await reviewer.fileExists(postPathArg))) {
      console.error(`Error: File not found: ${postPathArg}`);
      process.exit(1);
    }

    await reviewer.run(postPathArg, applyChanges, analyzeAllExplicitly);
  } catch (error) {
    console.error("Error:", error.message);
    process.exit(1);
  }
}

// Run main function if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}

export default SEOReviewer;
