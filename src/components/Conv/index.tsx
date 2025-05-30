/* eslint-disable react/prop-types */
import React from "react";

import styles from "./styles.module.css";

interface DiscordMessageProps {
  name: string;
  profilePic: string;
  children?: JSX.Element[] | JSX.Element;
  top?: boolean;
  bottom?: boolean;
  title?: string;
}

export default function DiscordMessage({
  name,
  profilePic,
  children,
  top,
  bottom,
  title,
}: DiscordMessageProps): JSX.Element {
  return (
    <div
      className={`${styles.container} ${top && styles.containerTop} ${
        bottom && styles.containerBottom
      }`}
    >
      <div className={styles.avatarContainer}>
        <img src={profilePic} alt={name} className={styles.avatar} />
      </div>

      <div className={styles.content}>
        <div className={styles.username}>
          {name}{" "}
          {title != undefined && (
            <span className={styles.title}>-- {title}</span>
          )}
        </div>
        <div className={styles.messageContent}>{children}</div>
      </div>
    </div>
  );
}
