import clsx from "clsx";
import React, { useState } from "react";
import styles from "./styles.module.css";

export default function Navigation() {
  const [activeFilter, setActiveFilter] = useState("all");

  const handleFilterClick = (filter: string) => {
    setActiveFilter(filter);

    // Trigger custom event for blog filtering
    const event = new CustomEvent("blogFilter", { detail: { filter } });
    window.dispatchEvent(event);
  };

  return (
    <div className="row col">
      <ul className={clsx("button-group col col--12", styles.navigation)}>
        <li>
          <button
            onClick={() => handleFilterClick("all")}
            className={clsx(styles.link, {
              [styles.active]: activeFilter === "all",
            })}
          >
            All Posts
          </button>
        </li>
        <li>
          <button
            onClick={() => handleFilterClick("engineering")}
            className={clsx(styles.link, {
              [styles.active]: activeFilter === "engineering",
            })}
          >
            Engineering
          </button>
        </li>
        <li>
          <button
            onClick={() => handleFilterClick("build-with-tigris")}
            className={clsx(styles.link, {
              [styles.active]: activeFilter === "build-with-tigris",
            })}
          >
            Build with Tigris
          </button>
        </li>
        <li>
          <button
            onClick={() => handleFilterClick("customers")}
            className={clsx(styles.link, {
              [styles.active]: activeFilter === "customers",
            })}
          >
            Customers
          </button>
        </li>
        <li>
          <button
            onClick={() => handleFilterClick("updates")}
            className={clsx(styles.link, {
              [styles.active]: activeFilter === "updates",
            })}
          >
            Updates
          </button>
        </li>
      </ul>
    </div>
  );
}
