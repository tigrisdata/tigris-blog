import React from "react";
import styles from "./styles.module.css";

interface PostEmbedProps {
  /** URL to the post’s Bluesky page */
  link?: string;
  /** user handle, e.g. "cr3ative.co.uk" */
  userId: string;
  /** display name, e.g. "Paul Curry" */
  username: string;
  /** title, eg "Head of Engineering @ fal.ai" */
  title?: string;
  /** RFC3339 timestamp, e.g. "2025-07-11T13:46:00Z" */
  timestamp?: string;
  /** image link */
  imageUrl: string;
  /** the actual post text */
  children: React.ReactNode;
}

const PostEmbed: React.FC<PostEmbedProps> = ({
  link,
  userId,
  username,
  title,
  imageUrl,
  timestamp,
  children,
}) => {
  const date = new Date(timestamp);
  const datePart = date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
  let timePart = date.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "numeric",
    hour12: true,
  });
  timePart = timePart.replace("AM", "a.m.").replace("PM", "p.m.");
  const formatted = `${datePart} at ${timePart}`;

  return (
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.header}>
        <img src={imageUrl} alt={username} className={styles.avatar} />
        <div className={styles.userInfo}>
          <span className={styles.username}>
            {username}{" "}
            {title !== undefined && (
              <>
                {" "}
                &mdash; <span className={styles.title}>{title}</span>
              </>
            )}
          </span>
          <span className={styles.userId}>@{userId}</span>
        </div>
      </div>

      {/* Content */}
      <div className={styles.content}>{children}</div>

      {/* Timestamp */}
      {timestamp !== undefined && (
        <div className={styles.timestamp}>{formatted}</div>
      )}

      {/* Source link */}
      {link !== undefined && (
        <>
          <div className={styles.divider} />

          <a href={link} className={styles.sourceLink}>
            Link to the source
          </a>
        </>
      )}
    </div>
  );
};

export default PostEmbed;
