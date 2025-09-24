import React from "react";
import styles from "./styles.module.css";

const BigButton = ({ href = "#", text = "Click Me", color = "teal" }) => {
  // Color-specific classes mapping
  const colorSchemes = {
    red: styles.red,
    teal: styles.teal,
    green: styles.green,
    gray: styles.gray,
  };

  const combinedClasses = `${styles.button} ${styles.button} ${
    colorSchemes[color] || colorSchemes.teal
  }`;

  return (
    <a href={href} className={combinedClasses}>
      {text}
    </a>
  );
};

export default BigButton;
