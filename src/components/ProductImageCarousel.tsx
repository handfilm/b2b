import React, { useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronLeft, ChevronRight, Eye } from 'lucide-react';

export interface ProductImageCarouselProps {
  images: string[];
  title: string;
  className?: string;
  aspectRatioClass?: string; // e.g. "aspect-square" or "aspect-[4/3]"
  onCardClick?: () => void;
  showAngleBadge?: boolean;
  angleLabels?: string[];
  isParentHovered?: boolean;
  angleBadgePosition?: 'top-right' | 'top-center' | 'top-left' | 'bottom-center';
  paginationBottomClass?: string;
  fallbackImage?: string;
}

export const ProductImageCarousel: React.FC<ProductImageCarouselProps> = ({
  images = [],
  title,
  className = '',
  aspectRatioClass = 'aspect-square',
  onCardClick,
  showAngleBadge = true,
  angleLabels,
  isParentHovered = false,
  angleBadgePosition = 'top-right',
  paginationBottomClass = 'bottom-2.5',
  fallbackImage = '/catalog/club-football/club-01.jpg',
}) => {
  // Ensure we have at least one valid image
  const validImages = images.length > 0 && images.some((img) => Boolean(img?.trim()))
    ? images.filter((img) => Boolean(img?.trim()))
    : [fallbackImage];
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0); // -1 for left, 1 for right
  const [imageErrorMap, setImageErrorMap] = useState<Record<number, boolean>>({});

  // Touch tracking for mobile swipe
  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);
  const touchStartY = useRef<number | null>(null);

  const defaultAngleLabels = [
    'Front View',
    'Chest Print Detail',
    'Squad Back #',
    'Fabric & QC Spec',
  ];

  const labels = angleLabels && angleLabels.length > 0 ? angleLabels : defaultAngleLabels;
  const currentAngleLabel = labels[currentIndex % labels.length] || `Angle ${currentIndex + 1}`;

  const hasMultipleImages = validImages.length > 1;

  const goToNext = useCallback(
    (e?: React.MouseEvent | React.TouchEvent) => {
      if (e) {
        e.stopPropagation();
        e.preventDefault();
      }
      setDirection(1);
      setCurrentIndex((prev) => (prev + 1) % validImages.length);
    },
    [validImages.length]
  );

  const goToPrev = useCallback(
    (e?: React.MouseEvent | React.TouchEvent) => {
      if (e) {
        e.stopPropagation();
        e.preventDefault();
      }
      setDirection(-1);
      setCurrentIndex((prev) => (prev - 1 + validImages.length) % validImages.length);
    },
    [validImages.length]
  );

  const goToIndex = useCallback(
    (index: number, e?: React.MouseEvent | React.TouchEvent) => {
      if (e) {
        e.stopPropagation();
        e.preventDefault();
      }
      setDirection(index > currentIndex ? 1 : -1);
      setCurrentIndex(index);
    },
    [currentIndex]
  );

  // Touch gesture handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null || touchEndX.current === null) return;
    const diffX = touchStartX.current - touchEndX.current;
    const minSwipeDistance = 35; // Minimum horizontal distance to count as swipe

    if (Math.abs(diffX) > minSwipeDistance) {
      if (diffX > 0) {
        // Swiped Left -> Show next
        goToNext(e);
      } else {
        // Swiped Right -> Show prev
        goToPrev(e);
      }
    }

    touchStartX.current = null;
    touchEndX.current = null;
    touchStartY.current = null;
  };

  const currentSrc = validImages[currentIndex] || validImages[0];
  const isCurrentErrored = imageErrorMap[currentIndex];

  const slideVariants = {
    enter: (dir: number) => ({
      x: dir > 0 ? '100%' : '-100%',
      opacity: 0,
      scale: 1,
    }),
    center: {
      x: '0%',
      opacity: 1,
      scale: 1,
      transition: {
        x: { type: 'spring' as const, stiffness: 350, damping: 32 },
        opacity: { duration: 0.2 },
      },
    },
    exit: (dir: number) => ({
      x: dir > 0 ? '-100%' : '100%',
      opacity: 0,
      scale: 0.98,
      transition: {
        x: { type: 'spring' as const, stiffness: 350, damping: 32 },
        opacity: { duration: 0.2 },
      },
    }),
  };

  return (
    <div
      className={`relative w-full overflow-hidden select-none group/carousel ${aspectRatioClass} ${className}`}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onClick={onCardClick}
    >
      {/* Animated Image Slide */}
      <AnimatePresence initial={false} custom={direction} mode="popLayout">
        <motion.img
          key={currentIndex}
          src={isCurrentErrored ? fallbackImage : currentSrc}
          alt={`${title} - ${currentAngleLabel}`}
          custom={direction}
          variants={slideVariants}
          initial="enter"
          animate="center"
          exit="exit"
          onError={() => {
            setImageErrorMap((prev) => ({ ...prev, [currentIndex]: true }));
          }}
          referrerPolicy="no-referrer"
          loading="lazy"
          className="absolute inset-0 w-full h-full object-cover object-center pointer-events-none transform-gpu"
        />
      </AnimatePresence>

      {/* Persistent Soft Vignette at Top and Bottom */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/25 pointer-events-none" />

      {/* Angle/Variation Pill Indicator */}
      {hasMultipleImages && showAngleBadge && (
        <div
          className={`absolute z-20 pointer-events-none transition-all duration-300 ${
            angleBadgePosition === 'top-center'
              ? 'top-2.5 left-1/2 -translate-x-1/2'
              : angleBadgePosition === 'top-left'
              ? 'top-2.5 left-2.5'
              : angleBadgePosition === 'bottom-center'
              ? 'bottom-8 left-1/2 -translate-x-1/2'
              : 'top-3 right-3'
          } ${
            isParentHovered ? 'opacity-100 translate-y-0' : 'opacity-85 translate-y-0 sm:opacity-75'
          }`}
        >
          <span className="flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-slate-950/85 backdrop-blur-md border border-white/20 text-white font-mono text-[10px] font-semibold shadow-lg">
            <Eye className="w-2.5 h-2.5 text-rose-400 shrink-0" />
            <span className="truncate max-w-[130px]">{currentAngleLabel}</span>
            <span className="text-white/50 text-[9px] ml-0.5">
              {currentIndex + 1}/{validImages.length}
            </span>
          </span>
        </div>
      )}

      {/* Horizontal Carousel Controls (Visible on hover on desktop, always visible subtly on touch devices) */}
      {hasMultipleImages && (
        <>
          {/* Left / Previous Chevron Button */}
          <button
            type="button"
            aria-label="Previous angle variation"
            onClick={goToPrev}
            className={`absolute left-2 top-1/2 -translate-y-1/2 z-20 p-1.5 sm:p-2 rounded-full bg-slate-950/75 hover:bg-slate-900 border border-white/20 text-white shadow-xl backdrop-blur-md transition-all duration-200 cursor-pointer active:scale-90 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-rose-500/70 ${
              isParentHovered ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-2 sm:opacity-0 pointer-events-none sm:pointer-events-none group-hover/carousel:opacity-100 group-hover/carousel:translate-x-0 group-hover/carousel:pointer-events-auto'
            }`}
          >
            <ChevronLeft className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white" />
          </button>

          {/* Right / Next Chevron Button */}
          <button
            type="button"
            aria-label="Next angle variation"
            onClick={goToNext}
            className={`absolute right-2 top-1/2 -translate-y-1/2 z-20 p-1.5 sm:p-2 rounded-full bg-slate-950/75 hover:bg-slate-900 border border-white/20 text-white shadow-xl backdrop-blur-md transition-all duration-200 cursor-pointer active:scale-90 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-rose-500/70 ${
              isParentHovered ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-2 sm:opacity-0 pointer-events-none sm:pointer-events-none group-hover/carousel:opacity-100 group-hover/carousel:translate-x-0 group-hover/carousel:pointer-events-auto'
            }`}
          >
            <ChevronRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white" />
          </button>

          {/* Bottom Dot / Segment Pagination Indicators */}
          <div
            className={`absolute ${paginationBottomClass} inset-x-0 z-20 flex items-center justify-center gap-1.5 px-3 pointer-events-auto`}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/15 shadow-md">
              {validImages.map((_, idx) => {
                const isActive = idx === currentIndex;
                return (
                  <button
                    key={idx}
                    type="button"
                    aria-label={`Jump to angle ${idx + 1}`}
                    onClick={(e) => goToIndex(idx, e)}
                    className={`transition-all duration-300 rounded-full cursor-pointer ${
                      isActive
                        ? 'w-5 h-1.5 bg-rose-500 shadow-sm shadow-rose-500/50'
                        : 'w-1.5 h-1.5 bg-white/40 hover:bg-white/80'
                    }`}
                  />
                );
              })}
            </div>
          </div>
        </>
      )}
    </div>
  );
};
