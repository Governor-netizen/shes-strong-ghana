import { useState, useRef, useEffect } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { Heart } from 'lucide-react';

interface ProgressiveImageProps {
  src: string;
  alt: string;
  className?: string;
  placeholderSrc?: string;
  lowQualitySrc?: string;
  sizes?: string;
  priority?: boolean;
  onLoad?: () => void;
  onError?: () => void;
}

export const ProgressiveImage = ({
  src,
  alt,
  className = '',
  placeholderSrc,
  lowQualitySrc,
  sizes,
  priority = false,
  onLoad,
  onError
}: ProgressiveImageProps) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isError, setIsError] = useState(false);
  const [showPlaceholder, setShowPlaceholder] = useState(true);
  const [lowQualityLoaded, setLowQualityLoaded] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);
  const lowQualityRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    if (!imgRef.current) return;

    const img = imgRef.current;
    
    // If image is already cached, it loads immediately
    if (img.complete && img.naturalHeight !== 0) {
      setIsLoaded(true);
      setShowPlaceholder(false);
      onLoad?.();
    }
  }, [onLoad]);

  const handleLoad = () => {
    setIsLoaded(true);
    setShowPlaceholder(false);
    onLoad?.();
  };

  const handleError = () => {
    setIsError(true);
    setShowPlaceholder(false);
    onError?.();
  };

  return (
    <div className="relative">
      {/* Instant base64 placeholder (if provided) */}
      {placeholderSrc && showPlaceholder && !isError && (
        <img
          src={placeholderSrc}
          alt=""
          className="w-full max-w-sm md:max-w-md h-96 rounded-2xl object-cover blur-md"
          aria-hidden="true"
        />
      )}
      
      {/* Loading skeleton fallback */}
      {!placeholderSrc && showPlaceholder && !isError && (
        <Skeleton className="w-full max-w-sm md:max-w-md h-96 rounded-2xl animate-pulse" />
      )}
      
      {/* Error fallback */}
      {isError && (
        <div className="w-full max-w-sm md:max-w-md h-96 rounded-2xl bg-muted/50 border-2 border-dashed border-muted-foreground/30 flex items-center justify-center">
          <div className="text-center text-muted-foreground">
            <Heart className="h-12 w-12 mx-auto mb-2 opacity-50" />
            <p className="text-sm">Image unavailable</p>
          </div>
        </div>
      )}
      
      {/* Low-quality preview image */}
      {lowQualitySrc && !isError && (
        <img
          ref={lowQualityRef}
          src={lowQualitySrc}
          alt=""
          className={`absolute inset-0 w-full h-full object-cover rounded-2xl transition-all duration-700 ease-out ${
            lowQualityLoaded ? (isLoaded ? 'opacity-0 blur-0' : 'opacity-100 blur-sm') : 'opacity-0'
          }`}
          onLoad={() => {
            setLowQualityLoaded(true);
            setShowPlaceholder(false);
          }}
          aria-hidden="true"
        />
      )}
      
      {/* Main high-quality image */}
      <img
        ref={imgRef}
        src={src}
        alt={alt}
        className={`transition-all duration-700 ease-out ${
          isLoaded ? 'opacity-100 blur-0' : 'opacity-0 absolute inset-0'
        } ${className}`}
        loading={priority ? "eager" : "lazy"}
        fetchPriority={priority ? "high" : "auto"}
        decoding="async"
        sizes={sizes}
        onLoad={handleLoad}
        onError={handleError}
      />
    </div>
  );
};