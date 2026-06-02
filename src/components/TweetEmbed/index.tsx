import React, { useEffect, useRef } from "react";
import BrowserOnly from "@docusaurus/BrowserOnly";
import { useColorMode } from "@docusaurus/theme-common";

interface TweetEmbedProps {
  url: string;
}

declare global {
  interface Window {
    twttr?: {
      widgets: {
        load: (el?: HTMLElement) => void;
      };
    };
  }
}

function TweetEmbedInner({ url }: TweetEmbedProps) {
  const { colorMode } = useColorMode();
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const loadWidget = () => {
      if (window.twttr?.widgets && containerRef.current) {
        window.twttr.widgets.load(containerRef.current);
      }
    };

    if (window.twttr?.widgets) {
      loadWidget();
      return;
    }

    if (document.getElementById("twitter-widgets-js")) {
      return;
    }

    const script = document.createElement("script");
    script.id = "twitter-widgets-js";
    script.src = "https://platform.twitter.com/widgets.js";
    script.async = true;
    script.onload = loadWidget;
    document.body.appendChild(script);
  }, [url, colorMode]);

  return (
    <div
      ref={containerRef}
      style={{
        display: "flex",
        justifyContent: "center",
        margin: "1.5rem 0",
      }}
    >
      <blockquote
        className="twitter-tweet"
        data-theme={colorMode === "dark" ? "dark" : "light"}
      >
        <a href={url}>View tweet</a>
      </blockquote>
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
