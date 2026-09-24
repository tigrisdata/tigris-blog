import React, { type ReactNode } from "react";
import styles from "./styles.module.css";

interface NeonProps {
  children: ReactNode;
}

/**
 * Inline neon-green highlight for a word or phrase, in the spirit of
 * PlanetScale's inline highlights. Usage in MDX:
 *
 *   import Neon from "@site/src/components/Neon";
 *   This page costs <Neon>640,000 database reads</Neon>.
 */
export default function Neon({ children }: NeonProps): JSX.Element {
  return <mark className={styles.neon}>{children}</mark>;
}
