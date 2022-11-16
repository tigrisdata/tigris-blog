/* eslint-disable react/prop-types */
import React, { ReactNode } from "react";
import clsx from "clsx";
import styles from "./styles.module.css";

interface Props {
  children: ReactNode;
  minHeight: number;
  title: string;
}

export default function TerminalWindow({
  children,
  minHeight,
  title = "Terminal",
}: Props): JSX.Element {
  return (
    <div className={styles.terminalWindow} style={{ minHeight }}>
      <div className={styles.terminalWindowHeader}>
        <div className={styles.buttons}>
          <span className={styles.dot} style={{ background: "#f25f58" }} />
          <span className={styles.dot} style={{ background: "#fbbe3c" }} />
          <span className={styles.dot} style={{ background: "#58cb42" }} />
        </div>
        <div className={clsx(styles.windowTitleBar, "text--truncate")}>
          {title}
        </div>
        <div className={styles.browserWindowMenuIcon}>
          <div>
            <span className={styles.bar} />
            <span className={styles.bar} />
            <span className={styles.bar} />
          </div>
        </div>
      </div>

      <div className={styles.browserWindowBody}>{children}</div>
    </div>
  );
}
