import React from "react";
import { Gallery, Item } from "react-photoswipe-gallery";
import "photoswipe/dist/photoswipe.css";
import styles from "./styles.module.css";

const ImageGallery = ({ images }) => {
  return (
    <Gallery>
      <div className={styles.galleryGrid}>
        {images.map((image, index) => (
          <Item
            key={index}
            original={image.src}
            thumbnail={image.thumbnail}
            width={image.width}
            height={image.height}
          >
            {({ ref, open }) => (
              <img
                ref={ref}
                onClick={open}
                src={image.thumbnail}
                alt={image.alt}
                className={styles.thumbnail}
              />
            )}
          </Item>
        ))}
      </div>
    </Gallery>
  );
};

export default ImageGallery;
