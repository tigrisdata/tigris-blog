import React, { useState, useEffect } from "react";
import styles from "./styles.module.css";

type CarouselProps = { children: React.ReactNode[] };

const Carousel: React.FC<CarouselProps> = ({ children }) => {
  // Shuffle slides once
  const [items] = useState<React.ReactNode[]>(() =>
    React.Children.toArray(children).sort(() => Math.random() - 0.5)
  );
  const [currentIndex, setCurrentIndex] = useState(0);
  const length = items.length;

  // Preload all slide images
  useEffect(() => {
    items.forEach((item) => {
      if (React.isValidElement(item) && typeof item.props.src === "string") {
        const img = new Image();
        img.src = item.props.src;
      }
    });
  }, [items]);

  // Auto-advance every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % length);
    }, 5000);
    return () => clearInterval(interval);
  }, [length]);

  const prevSlide = () =>
    setCurrentIndex((prev) => (prev - 1 + length) % length);
  const nextSlide = () => setCurrentIndex((prev) => (prev + 1) % length);

  if (length === 0) return null;

  return (
    <div className={styles.carouselContainer}>
      <button
        className={`${styles.navButton} ${styles.prevButton}`}
        onClick={prevSlide}
        aria-label="Previous Slide"
      >
        ‹
      </button>

      <div className={styles.slide}>{items[currentIndex]}</div>

      <button
        className={`${styles.navButton} ${styles.nextButton}`}
        onClick={nextSlide}
        aria-label="Next Slide"
      >
        ›
      </button>

      <div className={styles.dotsContainer}>
        {items.map((_, idx) => (
          <button
            key={idx}
            className={`${styles.dot} ${
              idx === currentIndex ? styles.activeDot : ""
            }`}
            onClick={() => setCurrentIndex(idx)}
            aria-label={`Go to slide ${idx + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default Carousel;
