import { useState, useEffect } from "react";
import { ProgressiveImage } from "./ProgressiveImage";
import heroOptimized from "@/assets/hero-optimized.webp";
import heroPlaceholderLow from "@/assets/hero-placeholder-low.webp";
import heroPlaceholderMicro from "@/assets/hero-placeholder-micro.jpg";
import heroSecondary from "@/assets/hero-secondary.webp";
import heroSecondaryMicro from "@/assets/hero-secondary-micro.jpg";

interface HeroImage {
  src: string;
  placeholderSrc: string;
  microPlaceholder: string;
  alt: string;
  duration: number; // in milliseconds
}

const heroImages: HeroImage[] = [
  {
    src: heroOptimized,
    placeholderSrc: heroPlaceholderLow,
    microPlaceholder: heroPlaceholderMicro,
    alt: "Empowering African woman in healthcare setting promoting breast cancer awareness",
    duration: 8000, // 8 seconds
  },
  {
    src: heroSecondary,
    placeholderSrc: heroSecondary, // Using same image as placeholder for now
    microPlaceholder: heroSecondaryMicro,
    alt: "Diverse group of African women standing together in solidarity for breast cancer awareness",
    duration: 2000, // 2 seconds
  },
];

interface HeroCarouselProps {
  className?: string;
}

export function HeroCarousel({ className }: HeroCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (isPaused) return;

    const timer = setTimeout(() => {
      setIsTransitioning(true);
      
      setTimeout(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % heroImages.length);
        setIsTransitioning(false);
      }, 500); // Half second for transition
      
    }, heroImages[currentIndex].duration);

    return () => clearTimeout(timer);
  }, [currentIndex, isPaused]);

  const currentImage = heroImages[currentIndex];

  return (
    <div 
      className={`relative overflow-hidden ${className}`}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div 
        className={`transition-opacity duration-500 ${
          isTransitioning ? 'opacity-0' : 'opacity-100'
        }`}
      >
        <ProgressiveImage
          src={currentImage.src}
          lowQualitySrc={currentImage.placeholderSrc}
          placeholderSrc={currentImage.microPlaceholder}
          alt={currentImage.alt}
          className="w-full h-full object-cover"
          priority={currentIndex === 0}
        />
      </div>
      
      {/* Carousel indicators */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
        {heroImages.map((_, index) => (
          <button
            key={index}
            className={`w-2 h-2 rounded-full transition-all duration-300 ${
              index === currentIndex 
                ? 'bg-white' 
                : 'bg-white/50 hover:bg-white/70'
            }`}
            onClick={() => setCurrentIndex(index)}
            aria-label={`Go to image ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}