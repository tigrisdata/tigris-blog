import React from "react";
import styles from "./styles.module.css";

interface BreakoutQuoteProps {
  /** display name, e.g. "Daniel Wiley" */
  username: string;
  /** job title and company, e.g. "Co-Founder & CEO, LogSeam" */
  title: string;
  /** optional image link or filepath */
  imageUrl?: string;
  /** the actual quote text */
  children: React.ReactNode;
}

const BreakoutQuote: React.FC<BreakoutQuoteProps> = ({
  username,
  title,
  imageUrl,
  children,
}) => {
  return (
    <div className={styles.container}>
      {/* Content */}
      <div className={styles.content}>{children}</div>

      {/* Attribution - Bottom Right */}
      <div className={styles.attribution}>
        <div className={styles.userInfo}>
          <span className={styles.username}>{username}</span>
          <span className={styles.title}>{title}</span>
        </div>
        {imageUrl && (
          <img src={imageUrl} alt={username} className={styles.avatar} />
        )}
      </div>
    </div>
  );
};

export default BreakoutQuote;
