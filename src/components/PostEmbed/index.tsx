import React from "react";
import styles from "./styles.module.css";

interface PostEmbedProps {
  /** URL to the post’s Bluesky page */
  link: string;
  /** user handle, e.g. "cr3ative.co.uk" */
  userId: string;
  /** display name, e.g. "Paul Curry" */
  username: string;
  /** RFC3339 timestamp, e.g. "2025-07-11T13:46:00Z" */
  timestamp: string;
  /** the actual post text */
  children: React.ReactNode;
}

const PostEmbed: React.FC<PostEmbedProps> = ({
  link,
  userId,
  username,
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
        <img
          src={`https://avatars.bsky.social/${userId}.png`}
          alt={username}
          className={styles.avatar}
        />
        <div className={styles.userInfo}>
          <span className={styles.username}>{username}</span>
          <span className={styles.userId}>@{userId}</span>
        </div>
      </div>

      {/* Content */}
      <div className={styles.content}>{children}</div>

      {/* Timestamp */}
      <div className={styles.timestamp}>{formatted}</div>

      <div className={styles.divider} />

      {/* Source link */}
      <a href={link} className={styles.sourceLink}>
        Link to the source
      </a>
    </div>
  );
};

export default PostEmbed;
