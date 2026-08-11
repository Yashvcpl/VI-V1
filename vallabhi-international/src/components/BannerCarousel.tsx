"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

interface BannerImage {
  url: string;
  alt?: string;
}

interface BannerCarouselProps {
  images?: BannerImage[] | string; // Can be array or JSON string
  fallbackUrl?: string;
  autoPlayInterval?: number; // ms between slides
}

export function BannerCarousel({
  images,
  fallbackUrl = "/hero-banner.png",
  autoPlayInterval = 5000,
}: BannerCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlay, setIsAutoPlay] = useState(true);

  // Parse images from various formats
  const imageList = parseImages(images);
  const displayImages = imageList.length > 0 ? imageList : [{ url: fallbackUrl, alt: "Banner" }];

  // Auto-play carousel
  useEffect(() => {
    if (!isAutoPlay || displayImages.length <= 1) return;

    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % displayImages.length);
    }, autoPlayInterval);

    return () => clearInterval(timer);
  }, [isAutoPlay, displayImages.length, autoPlayInterval]);

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
    setIsAutoPlay(false);
    // Resume auto-play after 10 seconds of inactivity
    setTimeout(() => setIsAutoPlay(true), 10000);
  };

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + displayImages.length) % displayImages.length);
    setIsAutoPlay(false);
    setTimeout(() => setIsAutoPlay(true), 10000);
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % displayImages.length);
    setIsAutoPlay(false);
    setTimeout(() => setIsAutoPlay(true), 10000);
  };

  const currentImage = displayImages[currentIndex];

  return (
    <div className="hero-banner relative overflow-hidden group">
      {/* Images */}
      <div className="relative w-full h-full">
        {displayImages.map((image, idx) => (
          <div
            key={idx}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              idx === currentIndex ? "opacity-100" : "opacity-0"
            }`}
          >
            <Image
              src={image.url}
              alt={image.alt || `Banner slide ${idx + 1}`}
              fill
              sizes="100vw"
              className="object-cover"
            />
          </div>
        ))}
      </div>

      {/* Navigation Controls - only show if multiple images */}
      {displayImages.length > 1 && (
        <>
          {/* Previous Button */}
          <button
            onClick={goToPrevious}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-10 bg-black/50 hover:bg-black/75 text-white p-3 rounded-full transition-all opacity-0 group-hover:opacity-100"
            aria-label="Previous slide"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          {/* Next Button */}
          <button
            onClick={goToNext}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-10 bg-black/50 hover:bg-black/75 text-white p-3 rounded-full transition-all opacity-0 group-hover:opacity-100"
            aria-label="Next slide"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>

          {/* Dot Indicators */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 flex gap-2">
            {displayImages.map((_, idx) => (
              <button
                key={idx}
                onClick={() => goToSlide(idx)}
                className={`w-3 h-3 rounded-full transition-all ${
                  idx === currentIndex ? "bg-white w-8" : "bg-white/50 hover:bg-white/75"
                }`}
                aria-label={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}

/**
 * Parse images from various formats (array, JSON string, or single URL)
 */
function parseImages(images: BannerImage[] | string | undefined): BannerImage[] {
  if (!images) return [];

  if (typeof images === "string") {
    try {
      // Try to parse as JSON
      const parsed = JSON.parse(images);
      if (Array.isArray(parsed)) {
        return parsed.filter((img) => img && typeof img.url === "string");
      }
      // If it's a single URL string, wrap it
      return [{ url: images, alt: "" }];
    } catch {
      // If parsing fails, treat it as a single URL
      return [{ url: images, alt: "" }];
    }
  }

  if (Array.isArray(images)) {
    return images.filter((img) => img && typeof img.url === "string");
  }

  return [];
}
