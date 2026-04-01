import { next } from "@vercel/edge";

// Skip middleware for static assets
const STATIC_EXTENSIONS =
  /\.(js|css|png|jpg|jpeg|gif|svg|ico|woff|woff2|ttf|eot|json|xml|txt|md|map|webp|avif)$/i;

// Known AI agent and bot User-Agent patterns
const AGENT_UA_PATTERNS = [
  /\bClaudeBot\b/i,
  /\bChatGPT-User\b/i,
  /\bGPTBot\b/i,
  /\bGoogle-Extended\b/i,
  /\bPerplexityBot\b/i,
  /\bCohere-AI\b/i,
  /\bAnthropic\b/i,
  /\bClaude\b/i,
  /\bOAI-SearchBot\b/i,
  /\bYouBot\b/i,
  /\bAI2Bot\b/i,
  /\bApplebot-Extended\b/i,
  /\bMeta-ExternalAgent\b/i,
  /\bMeta-ExternalFetcher\b/i,
  /\bFirecrawl\b/i,
  /\bJinaBot\b/i,
];

export const config = {
  matcher: "/blog/:path*",
};

function isAgent(request) {
  const accept = request.headers.get("accept") || "";
  if (accept.includes("text/markdown")) {
    return true;
  }

  const ua = request.headers.get("user-agent") || "";
  return AGENT_UA_PATTERNS.some((pattern) => pattern.test(ua));
}

function rewriteToMarkdown(pathname, requestUrl) {
  // Rewrite HTML URL to its .md equivalent:
  // /blog/some-post/   -> /blog/some-post.md
  // /blog/tags/foo/    -> /blog/tags/foo.md
  // /blog/             -> /blog/index.md
  const subpath = pathname.replace(/^\/blog\/?/, "").replace(/\/+$/, "");
  let mdPath;
  if (!subpath) {
    mdPath = "/blog/index.md";
  } else {
    mdPath = `/blog/${subpath}.md`;
  }

  return new Response(null, {
    status: 307,
    headers: {
      Location: new URL(mdPath, requestUrl).toString(),
      Vary: "Accept, User-Agent",
    },
  });
}

export default function middleware(request) {
  const url = new URL(request.url);
  const pathname = url.pathname;

  // Skip static assets
  if (STATIC_EXTENSIONS.test(pathname)) {
    return next();
  }

  if (isAgent(request)) {
    return rewriteToMarkdown(pathname, request.url);
  }

  // For normal HTML requests, add Link header pointing to llms.txt for discovery
  return next({
    headers: {
      Link: '</blog/llms.txt>; rel="alternate"; type="text/plain"',
      Vary: "Accept, User-Agent",
    },
  });
}
