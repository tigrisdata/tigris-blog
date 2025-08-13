import React from "react";
import styles from "./styles.module.css";

/**
 * A component that displays a sequence of steps in a pill-shaped container.
 * This version uses CSS Modules for styling.
 *
 * @param {object} props - The properties for the component.
 * @param {string[]} [props.steps=['System', 'Developer', 'User', 'Assistant', 'Tool']] - An array of strings representing the steps to display.
 */
const FlowDiagram = ({
  steps = ["System", "Developer", "User", "Assistant", "Tool"],
}) => {
  return (
    <div className={styles.wrapper}>
      <div className={styles.diagramContainer}>
        {steps.map((step, index) => (
          <React.Fragment key={step}>
            <span className={styles.step}>{step}</span>

            {index < steps.length - 1 && <div className={styles.separator} />}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

export default FlowDiagram;
