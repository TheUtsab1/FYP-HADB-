"use client";

import { useState, useEffect, useRef } from "react";
import "./Gallery.css";
import { images } from "../../constants";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function Gallery({ images = defaultImages }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const timeoutRef = useRef(null);

  // Reset the auto-slide timer whenever the current index changes
  useEffect(() => {
    resetTimeout();
    timeoutRef.current = setTimeout(() => {
      setIsTransitioning(true);
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 2500); // Change slide every 3 seconds

    return () => {
      resetTimeout();
    };
  }, [currentIndex, images.length]);

  const resetTimeout = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
  };

  // Handle transition end
  const handleTransitionEnd = () => {
    setIsTransitioning(false);
  };

  // Calculate indices for the visible slides (5 images)
  const getVisibleIndices = () => {
    const indices = [];
    const prevIndex2 = (currentIndex - 2 + images.length) % images.length;
    const prevIndex1 = (currentIndex - 1 + images.length) % images.length;
    const nextIndex1 = (currentIndex + 1) % images.length;
    const nextIndex2 = (currentIndex + 2) % images.length;

    indices.push(prevIndex2, prevIndex1, currentIndex, nextIndex1, nextIndex2);
    return indices;
  };

  // Handle navigation
  const goToPrevious = () => {
    resetTimeout();
    setIsTransitioning(true);
    setCurrentIndex(
      (prevIndex) => (prevIndex - 1 + images.length) % images.length
    );
  };

  const goToNext = () => {
    resetTimeout();
    setIsTransitioning(true);
    setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
  };

  const visibleIndices = getVisibleIndices();

  return (
    <div className="gallery-section">
      <h2 className="gallery-title">Our Gallery</h2>
      <div className="gold-divider"></div>
      <div className="carousel-container">
        <button
          className="carousel-arrow prev"
          onClick={goToPrevious}
          aria-label="Previous slide"
        >
          <ChevronLeft />
        </button>

        <div
          className={`carousel-track ${isTransitioning ? "transitioning" : ""}`}
          onTransitionEnd={handleTransitionEnd}
        >
          {visibleIndices.map((index, i) => (
            <div
              key={index}
              className={`carousel-slide ${i === 2 ? "active" : ""}`}
            >
              <img
                src={images[index].src || "/placeholder.svg"}
                alt={images[index].alt || `Slide ${index + 1}`}
                className="carousel-image"
              />
            </div>
          ))}
        </div>

        <button
          className="carousel-arrow next"
          onClick={goToNext}
          aria-label="Next slide"
        >
          <ChevronRight />
        </button>

        <div className="carousel-status" aria-live="polite">
          <span className="sr-only">
            Image {currentIndex + 1} of {images.length}
          </span>
        </div>
      </div>
    </div>
  );
}

// Default images for demonstration
const defaultImages = [
  {
    src: images.gallery01,
    alt: "Slide 1",
  },
  {
    src: images.gallery02,
    alt: "Slide 2",
  },
  {
    src: images.gallery03,
    alt: "Slide 3",
  },
  {
    src: images.gallery04,
    alt: "Slide 4",
  },
  {
    src: images.gallery05,
    alt: "Slide 5",
  },
  {
    src: images.gallery06,
    alt: "Slide 6",
  },
  {
    src: images.gallery07,
    alt: "Slide 7",
  },
  {
    src: images.gallery08,
    alt: "Slide 8",
  },
  {
    src: images.gallery09,
    alt: "Slide 9",
  },
  {
    src: images.gallery10,
    alt: "Slide 10",
  },
  {
    src: images.gallery11,
    alt: "Slide 11",
  },
  {
    src: images.gallery12,
    alt: "Slide 12",
  },
  {
    src: images.gallery13,
    alt: "Slide 13",
  },
  {
    src: images.gallery14,
    alt: "Slide 14",
  },
];
