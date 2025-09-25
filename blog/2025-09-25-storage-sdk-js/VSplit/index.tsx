import React, { useState } from "react";
import styles from "./styles.module.css";

export interface VSplitProps {
  left: React.ReactNode;
  leftTitle: string;
  right: React.ReactNode;
  rightTitle: string;
}

const VSplit = ({
  left,
  leftTitle = "Tigris",
  right,
  rightTitle = "AWS",
}: VSplitProps) => {
  // State to manage which tab is currently active in the mobile view.
  // It defaults to 'left', showing the first panel initially.
  const [activeTab, setActiveTab] = useState("left");

  return (
    // Main container with a light gray background
    <div className="wumbo">
      <div className={styles.innerContainer}>
        {/* Tab Buttons: These are only visible on screens smaller than `md` (mobile) */}
        <div className={styles.tabContainer}>
          <button
            onClick={() => setActiveTab("left")}
            className={`${styles.tabButton} ${
              activeTab === "left"
                ? styles.tabButtonActive
                : styles.tabButtonInactive
            }`}
          >
            {leftTitle}
          </button>
          <button
            onClick={() => setActiveTab("right")}
            className={`${styles.tabButton} ${styles.tabButtonRight} ${
              activeTab === "right"
                ? styles.tabButtonRightActive
                : styles.tabButtonInactive
            }`}
          >
            {rightTitle}
          </button>
        </div>

        {/* Main Content Area: Flex container */}
        {/* On mobile (default): flex-col to stack items vertically */}
        {/* On desktop (`md:`): flex-row to place items side-by-side */}
        <div className={styles.contentContainer}>
          {/* Left Panel */}
          {/* On mobile: hidden unless activeTab is 'left'. `md:block` overrides this on desktop. */}
          <div
            className={`${styles.panel} ${
              activeTab !== "left" ? styles.hidden : ""
            }`}
          >
            {left}
          </div>

          {/* Right Panel */}
          {/* On mobile: hidden unless activeTab is 'right'. `md:block` overrides this on desktop. */}
          <div
            className={`${styles.panel} ${styles.panelRight} ${
              activeTab !== "right" ? styles.hidden : ""
            }`}
          >
            {right}
          </div>
        </div>
      </div>
    </div>
  );
};

export default VSplit;
