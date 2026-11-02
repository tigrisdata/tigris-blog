import React, { type ReactNode, useCallback, useState } from "react";
import clsx from "clsx";
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
import { useBlogPost } from "@docusaurus/plugin-content-blog/client";
import styles from "./styles.module.css";

const X_HANDLE = "tigrisdata";
const BLUESKY_HANDLE = "tigrisdata.com";

function BlueskyIcon() {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true">
      <path
        fill="currentColor"
        d="M12 10.8c-1.087-2.114-4.046-6.053-6.798-7.995C2.566.944 1.561 1.266.902 1.565.139 1.908 0 3.08 0 3.768c0 .69.378 5.65.624 6.479.815 2.736 3.713 3.66 6.383 3.364.136-.02.275-.039.415-.056-.138.022-.276.04-.415.056-3.912.58-7.387 2.005-2.83 7.078 5.013 5.19 6.87-1.113 7.823-4.308.953 3.195 2.05 9.271 7.733 4.308 4.267-4.308 1.172-6.498-2.74-7.078a8.741 8.741 0 0 1-.415-.056c.14.017.279.036.415.056 2.67.297 5.568-.628 6.383-3.364.246-.828.624-5.79.624-6.478 0-.69-.139-1.861-.902-2.206-.659-.298-1.664-.62-4.3 1.24C16.046 4.748 13.087 8.687 12 10.8Z"
      />
    </svg>
  );
}

function XIcon() {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true">
      <path
        fill="currentColor"
        d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"
      />
    </svg>
  );
}

function HackerNewsIcon() {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true">
      <path
        fill="currentColor"
        d="M2 2h20v20H2zm9.2 12.1V18h1.6v-3.9L16.7 6h-1.8l-2.9 5.6L9.1 6H7.3z"
      />
    </svg>
  );
}

function LinkedInIcon() {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true">
      <path
        fill="currentColor"
        d="M20.45 20.45h-3.55v-5.57c0-1.33-.03-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.36V9h3.41v1.56h.05c.47-.9 1.63-1.85 3.36-1.85 3.6 0 4.27 2.37 4.27 5.45zM5.34 7.43a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12zM7.12 20.45H3.56V9h3.56zM22.22 0H1.77C.79 0 0 .77 0 1.73v20.54C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.73V1.73C24 .77 23.2 0 22.22 0z"
      />
    </svg>
  );
}

function EmailIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="16"
      height="16"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="m3 7 9 6 9-6" />
    </svg>
  );
}

function LinkIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="16"
      height="16"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
      <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="16"
      height="16"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="m5 12 5 5L20 7" />
    </svg>
  );
}

function ShareLink({
  href,
  label,
  children,
}: {
  href: string;
  label: string;
  children: ReactNode;
}) {
  return (
    <a
      className={styles.button}
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`Share on ${label}`}
    >
      {children}
      <span>{label}</span>
    </a>
  );
}

function CopyLinkButton({ url }: { url: string }) {
  const [copied, setCopied] = useState(false);

  const onCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard API unavailable (insecure context, old browser). Fall back to
      // a prompt so the reader can still grab the URL.
      window.prompt("Copy this link", url);
    }
  }, [url]);

  return (
    <button
      type="button"
      className={clsx(styles.button, styles.copyLink, copied && styles.copied)}
      onClick={onCopy}
      aria-live="polite"
    >
      {copied ? <CheckIcon /> : <LinkIcon />}
      <span>{copied ? "Copied" : "Copy link"}</span>
    </button>
  );
}

export default function ShareArticle(): ReactNode {
  const { siteConfig } = useDocusaurusContext();
  const { metadata } = useBlogPost();
  const { title, permalink } = metadata;

  const url = new URL(permalink, siteConfig.url).toString();
  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);

  const xText = encodeURIComponent(
    `Check out this post on the @${X_HANDLE} blog: ${title}\n\n`
  );
  // Bluesky's compose intent has no separate url param, so the link goes in
  // the post text.
  const blueskyText = encodeURIComponent(
    `Check out this post on the @${BLUESKY_HANDLE} blog: ${title}\n\n${url}`
  );
  const emailBody = encodeURIComponent(
    `Hey!\n\nCheck out this article on the Tigris blog: ${url}`
  );

  const links = [
    {
      label: "Bluesky",
      href: `https://bsky.app/intent/compose?text=${blueskyText}`,
      icon: <BlueskyIcon />,
    },
    {
      label: "X",
      href: `https://twitter.com/intent/tweet?text=${xText}&url=${encodedUrl}`,
      icon: <XIcon />,
    },
    {
      label: "Hacker News",
      href: `https://news.ycombinator.com/submitlink?u=${encodedUrl}&t=${encodedTitle}`,
      icon: <HackerNewsIcon />,
    },
    {
      label: "LinkedIn",
      href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
      icon: <LinkedInIcon />,
    },
    {
      label: "Email",
      href: `mailto:?subject=${encodedTitle}&body=${emailBody}`,
      icon: <EmailIcon />,
    },
  ];

  return (
    <section className={styles.share} aria-label="Share this article">
      <div className={styles.row}>
        <h2 className={styles.label}>Share</h2>
        {links.map(({ label, href, icon }) => (
          <ShareLink key={label} href={href} label={label}>
            {icon}
          </ShareLink>
        ))}
        <CopyLinkButton url={url} />
      </div>
    </section>
  );
}
