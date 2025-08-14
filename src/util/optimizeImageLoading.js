// Client-side module to optimize image loading on mobile devices

if (typeof window !== "undefined") {
  // Check if the user is on a mobile device (better detection)
  const isMobile =
    "ontouchstart" in window ||
    navigator.maxTouchPoints > 0 ||
    /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

  // Safely check connection with feature detection
  const connection =
    navigator.connection ||
    navigator.mozConnection ||
    navigator.webkitConnection;
  const isSlowConnection =
    connection && ["slow-2g", "2g", "3g"].includes(connection.effectiveType);

  if (isMobile || isSlowConnection) {
    // Implement adaptive loading based on connection speed
    document.addEventListener("DOMContentLoaded", () => {
      const images = document.querySelectorAll("img[loading='lazy']");

      if (isSlowConnection) {
        // On slow connections, only load images that are immediately visible
        const observer = new IntersectionObserver(
          (entries) => {
            entries.forEach((entry) => {
              if (entry.isIntersecting) {
                const img = entry.target;
                // Only load the image when it's actually visible
                if (img.dataset.src && !img.src) {
                  img.src = img.dataset.src;
                }
                observer.unobserve(img);
              }
            });
          },
          {
            rootMargin: "0px", // No pre-loading on slow connections
            threshold: 0.1,
          }
        );

        images.forEach((img) => observer.observe(img));
      } else if (isMobile) {
        // On mobile with decent connection, pre-load next 2 images
        const observer = new IntersectionObserver(
          (entries) => {
            entries.forEach((entry) => {
              if (entry.isIntersecting) {
                const img = entry.target;
                const allImages = Array.from(images);
                const currentIndex = allImages.indexOf(img);

                // Load current image
                if (img.dataset.src && !img.src) {
                  img.src = img.dataset.src;
                }

                // Pre-load next 2 images
                for (let i = 1; i <= 2; i++) {
                  const nextImg = allImages[currentIndex + i];
                  if (nextImg && nextImg.dataset.src && !nextImg.src) {
                    // Use lower priority for pre-loading
                    setTimeout(() => {
                      nextImg.src = nextImg.dataset.src;
                    }, i * 100);
                  }
                }

                observer.unobserve(img);
              }
            });
          },
          {
            rootMargin: "50px",
            threshold: 0.01,
          }
        );

        images.forEach((img) => observer.observe(img));
      }
    });

    // Optimize animations on mobile with targeted selectors
    if (isMobile) {
      // Reduce animation complexity on mobile for specific elements
      const style = document.createElement("style");
      style.textContent = `
        @media (max-width: 768px) {
          img, .titleImage, .zoomImage {
            animation-duration: 0.3s;
            transition-duration: 0.2s;
          }
        }
      `;
      document.head.appendChild(style);
    }

    // Handle memory management on mobile
    if (isMobile) {
      let scrollTimeout;
      const handleScroll = () => {
        // Pause animations during scroll for better performance
        document.body.style.pointerEvents = "none";
        clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(() => {
          document.body.style.pointerEvents = "auto";
        }, 100);
      };

      window.addEventListener("scroll", handleScroll, { passive: true });

      // Cleanup on page unload
      window.addEventListener("beforeunload", () => {
        window.removeEventListener("scroll", handleScroll);
      });
    }
  }

  // Implement progressive enhancement for WebP support
  function supportsWebP() {
    const canvas = document.createElement("canvas");
    canvas.width = 1;
    canvas.height = 1;
    return canvas.toDataURL("image/webp").indexOf("image/webp") === 0;
  }

  if (!supportsWebP()) {
    // Fallback for browsers that don't support WebP
    document.addEventListener("DOMContentLoaded", () => {
      const images = document.querySelectorAll("img");
      images.forEach((img) => {
        if (img.src && img.src.includes(".webp")) {
          // Replace .webp with .jpg fallback
          img.onerror = function () {
            this.src = this.src.replace(".webp", ".jpg");
          };
        }
      });
    });
  }
}
