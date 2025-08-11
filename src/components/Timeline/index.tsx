import React from "react";
import styles from "./styles.module.css";

interface TimelineItem {
  period: string;
  title: string;
  features: string[];
  highlight?: string;
}

interface TimelineProps {
  items: TimelineItem[];
}

// Helper function to parse markdown links and render them as HTML
function parseMarkdownLinks(text: string): JSX.Element {
  // Regex to match markdown links: [text](url)
  const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
  const parts: (string | JSX.Element)[] = [];
  let lastIndex = 0;
  let match;

  while ((match = linkRegex.exec(text)) !== null) {
    // Add text before the link
    if (match.index > lastIndex) {
      parts.push(text.slice(lastIndex, match.index));
    }
    
    // Add the link
    parts.push(
      <a key={match.index} href={match[2]} target="_blank" rel="noopener noreferrer">
        {match[1]}
      </a>
    );
    
    lastIndex = match.index + match[0].length;
  }
  
  // Add remaining text after the last link
  if (lastIndex < text.length) {
    parts.push(text.slice(lastIndex));
  }
  
  // If no links found, return the original text
  if (parts.length === 0) {
    return <>{text}</>;
  }
  
  return <>{parts}</>;
}

export default function Timeline({ items }: TimelineProps): JSX.Element {
  return (
    <div className={styles.timeline}>
      {items.map((item, index) => (
        <div key={index} className={styles.timelineItem}>
          <div className={styles.timelineMarker}>
            <div className={styles.markerDot} />
            {index < items.length - 1 && <div className={styles.markerLine} />}
          </div>
          <div className={styles.timelineContent}>
            <div className={styles.period}>{item.period}</div>
            <h3 className={styles.title}>{item.title}</h3>
            <ul className={styles.features}>
              {item.features.map((feature, featureIndex) => (
                <li key={featureIndex} className={styles.feature}>
                  {parseMarkdownLinks(feature)}
                  {item.highlight && feature.includes(item.highlight) && (
                    <span className={styles.highlight}> {item.highlight}</span>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </div>
      ))}
    </div>
  );
}
