import React, { useEffect, useRef, useState } from "react";
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
      }
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
  // mountRef is owned exclusively by twttr — React renders no children into it,
  // so we can mutate its contents freely without fighting React's DOM.
  const mountRef = useRef<HTMLDivElement>(null);
  const [rendered, setRendered] = useState(false);
  const id = tweetIdFromUrl(url);

  useEffect(() => {
    if (!id) {
      return;
    }

    let cancelled = false;
    ensureTwitterScript();

    window.twttr?.ready((twttr) => {
      const mount = mountRef.current;
      if (cancelled || !mount) {
        return;
      }

      twttr.widgets
        .createTweet(id, mount, {
          theme: colorMode === "dark" ? "dark" : "light",
          align: "center",
        })
        .then((el) => {
          // A newer run (theme toggle, tweet id change, or strict-mode
          // remount) may have superseded this one while createTweet was in
          // flight. Remove whatever this stale call injected and leave the DOM
          // to the current run instead of clobbering it.
          if (cancelled || mountRef.current !== mount) {
            el?.remove();
            return;
          }

          if (el) {
            // Success: keep only the freshly rendered embed, dropping any stale
            // embed left over from a previous theme.
            mount.replaceChildren(el);
            setRendered(true);
          } else if (mount.childElementCount === 0) {
            // Tweet is deleted, private, or blocked and nothing was rendered:
            // keep the fallback "View tweet" link visible.
            setRendered(false);
          }
        })
        .catch(() => {
          if (
            !cancelled &&
            mountRef.current === mount &&
            mount.childElementCount === 0
          ) {
            setRendered(false);
          }
        });
    });

    return () => {
      cancelled = true;
    };
  }, [id, colorMode]);

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        margin: "1.5rem 0",
      }}
    >
      <div ref={mountRef} />
      {!rendered && <a href={url}>View tweet</a>}
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
