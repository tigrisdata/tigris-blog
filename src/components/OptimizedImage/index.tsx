import React, { useState } from "react";
import PropTypes from "prop-types";
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
  fallbackSrc,
}) {
  const [imgSrc, setImgSrc] = useState(src);
  const [hasError, setHasError] = useState(false);

  const handleError = () => {
    if (!hasError && fallbackSrc && imgSrc !== fallbackSrc) {
      setHasError(true);
      setImgSrc(fallbackSrc);
    }
  };

  // Simple optimized image component for better mobile performance
  return (
    <img
      src={imgSrc}
      alt={alt}
      className={clsx(styles.optimizedImage, className)}
      loading={loading}
      decoding="async"
      sizes={sizes}
      width={width}
      height={height}
      onError={handleError}
    />
  );
}

OptimizedImage.propTypes = {
  src: PropTypes.string.isRequired,
  alt: PropTypes.string.isRequired,
  className: PropTypes.string,
  width: PropTypes.number,
  height: PropTypes.number,
  loading: PropTypes.oneOf(["lazy", "eager"]),
  sizes: PropTypes.string,
  fallbackSrc: PropTypes.string,
};
