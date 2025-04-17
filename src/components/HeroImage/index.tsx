import React, { useEffect, useState } from "react";
import styles from "./styles.module.css";

export interface HeroImageProps {
  alt: string;
  file: string;
  hdrFile?: string;
}

export default function HeroImage({ alt, file, hdrFile }: HeroImageProps) {
  const [src, setSrc] = useState(file);

  useEffect(() => {
    if (hdrFile && window.matchMedia("(dynamic-range: high)").matches) {
      setSrc(hdrFile);
    }
  }, [hdrFile]);

  return (
    <figure className={styles.figure}>
      <img alt={alt} className={styles.heroImage} src={src} loading="lazy" />
      {alt && <figcaption className={styles.caption}>{alt}</figcaption>}
    </figure>
  );
}
