import React from "react";
import clsx from "clsx";
import styles from "./styles.module.css";

export default function OptimizedImage({
  src,
  alt,
  className,
  width,
  height,
  loading = "lazy",
  sizes = "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw",
}) {
  // Simple optimized image component for better mobile performance
  return (
    <img
      src={src}
      alt={alt}
      className={clsx(styles.optimizedImage, className)}
      loading={loading}
      decoding="async"
      sizes={sizes}
      width={width}
      height={height}
    />
  );
}