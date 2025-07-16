import React from "react";
import styles from "./styles.module.css";

interface Props {
  children: React.ReactNode;
}

/**
 * Wraps its children in a red, wavy underline to mimic an “error squiggle.”
 */
const ErrorSquiggles: React.FC<Props> = ({ children }) => (
  <span className={styles.error}>{children}</span>
);

export default ErrorSquiggles;
