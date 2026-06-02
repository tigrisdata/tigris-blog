import React, { useEffect, useRef } from "react";
import BrowserOnly from "@docusaurus/BrowserOnly";
import { useColorMode } from "@docusaurus/theme-common";

interface TweetEmbedProps {
  url: string;
}

interface TwitterWidgets {
  widgets: {
    load: (el?: HTMLElement) => void;
    createTweet: (
      id: string,
      el: HTMLElement,
      options?: {
        theme?: "light" | "dark";
        align?: string;
        conversation?: string;
      },
    ) => Promise<HTMLElement | undefined>;
  };
  ready: (cb: (twttr: TwitterWidgets) => void) => void;
  _e?: Array<(twttr: TwitterWidgets) => void>;
}

declare global {
  interface Window {
    twttr?: TwitterWidgets;
  }
}

function tweetIdFromUrl(url: string): string | null {
  const match = url.match(/status\/(\d+)/);
  return match ? match[1] : null;
}

// Install the twttr.ready queue stub synchronously so callbacks registered
// while widgets.js is still downloading fire once it loads. Mirrors Twitter's
// official embed snippet.
function ensureTwitterScript(): void {
  if (window.twttr?.ready) {
    return;
  }

  const twttr = (window.twttr ?? {}) as TwitterWidgets;
  twttr._e = twttr._e ?? [];
  twttr.ready = (cb) => {
    twttr._e?.push(cb);
  };
  window.twttr = twttr;

  if (document.getElementById("twitter-widgets-js")) {
    return;
  }

  const script = document.createElement("script");
  script.id = "twitter-widgets-js";
  script.src = "https://platform.twitter.com/widgets.js";
  script.async = true;
  document.body.appendChild(script);
}

function TweetEmbedInner({ url }: TweetEmbedProps) {
  const { colorMode } = useColorMode();
  const containerRef = useRef<HTMLDivElement>(null);
  const id = tweetIdFromUrl(url);

  useEffect(() => {
    if (!id) {
      return;
    }

    let cancelled = false;
    ensureTwitterScript();

    window.twttr?.ready((twttr) => {
      const container = containerRef.current;
      if (cancelled || !container) {
        return;
      }

      // createTweet renders a fresh iframe, so clear any prior render (or the
      // fallback link) first. This is what lets a colorMode toggle re-theme an
      // already-rendered tweet.
      container.replaceChildren();
      twttr.widgets.createTweet(id, container, {
        theme: colorMode === "dark" ? "dark" : "light",
        align: "center",
      });
    });

    return () => {
      cancelled = true;
    };
  }, [id, colorMode]);

  return (
    <div
      ref={containerRef}
      style={{
        display: "flex",
        justifyContent: "center",
        margin: "1.5rem 0",
      }}
    >
      <a href={url}>View tweet</a>
    </div>
  );
}

export default function TweetEmbed(props: TweetEmbedProps): JSX.Element {
  return (
    <BrowserOnly fallback={null}>
      {() => <TweetEmbedInner {...props} />}
    </BrowserOnly>
  );
}
