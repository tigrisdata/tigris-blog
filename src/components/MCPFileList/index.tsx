import React from "react";
import styles from "./styles.module.css";

interface FileItem {
  name: string;
  size: string;
  date: string;
}

interface FileListExpandableProps {
  title: string;
  files: FileItem[];
}

export default function FileListExpandable({
  title,
  files,
}: FileListExpandableProps) {
  return (
    <details className={styles.details}>
      <summary className={styles.summary}>
        📁 {title}
        <span className={styles.arrow} aria-hidden="true"></span>
      </summary>
      <div className={styles.content}>
        <div className={styles.fileList}>
          {files.map((file, index) => (
            <div key={index} className={styles.fileRow}>
              <div className={styles.fileName}>{file.name}</div>
              <div className={styles.fileDate}>{file.date}</div>
              <div className={styles.fileSize}>{file.size}</div>
            </div>
          ))}
        </div>
      </div>
    </details>
  );
}
