import React, { useRef, useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence, useInView } from 'framer-motion';

interface MobileCarouselProps {
  /** Each element becomes one horizontally-scrollable snap slide. */
  children: React.ReactNode[];
  ariaLabel?: string;
}

/**
 * MobileCarousel
 *
 * Snap-scrolling horizontal carousel for mobile viewports.
 *
 * Features:
 * - CSS `scroll-snap-type: x mandatory` for native swipe feel
 * - Staggered slide entrance (fade + slide-in from right on scroll-into-view)
 * - Active slide at full scale/opacity; adjacent slides slightly dimmed (CSS depth effect)
 * - Animated expanding-pill pagination dots driven by IntersectionObserver
 * - Swipe-hint badge that bounces once then fades out after first interaction
 */
const MobileCarousel: React.FC<MobileCarouselProps> = ({ children, ariaLabel }) => {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [showHint, setShowHint] = useState(true);
  const count = children.length;

  const isInView = useInView(wrapperRef as React.RefObject<Element>, {
    once: true,
    margin: '-80px',
  });

  /* Track the active (most-visible) slide */
  useEffect(() => {
    const track = trackRef.current;
    if (!track || count === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const idx = Array.from(track.children).indexOf(entry.target as HTMLElement);
            if (idx !== -1) setActiveIndex(idx);
          }
        });
      },
      { root: track, threshold: 0.55 }
    );

    Array.from(track.children).forEach((child) => observer.observe(child));
    return () => observer.disconnect();
  }, [count]);

  /* Hide swipe hint after the first scroll interaction */
  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    const onScroll = () => setShowHint(false);
    track.addEventListener('scroll', onScroll, { once: true });
    return () => track.removeEventListener('scroll', onScroll);
  }, []);

  const scrollToSlide = useCallback((index: number) => {
    const track = trackRef.current;
    if (!track) return;
    (track.children[index] as HTMLElement)?.scrollIntoView({
      behavior: 'smooth',
      block: 'nearest',
      inline: 'start',
    });
  }, []);

  return (
    <div
      ref={wrapperRef}
      className="mobile-carousel"
      role="region"
      aria-label={ariaLabel}
      aria-roledescription="carousel"
    >
      {/* Swipe hint badge — bounces twice then exits on first scroll */}
      <AnimatePresence>
        {showHint && count > 1 && (
          <motion.div
            key="hint"
            className="mobile-carousel__hint"
            initial={{ opacity: 0, y: 6, scale: 0.85 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.88, transition: { duration: 0.2 } }}
            transition={{ delay: 0.5, duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            aria-hidden="true"
          >
            <motion.span
              animate={{ x: [0, 6, 0, 6, 0] }}
              transition={{ delay: 1.1, duration: 1.5, ease: 'easeInOut' }}
            >
              →
            </motion.span>
            <span>swipe</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Scroll track — each direct child is a snap target */}
      <div ref={trackRef} className="mobile-carousel__track">
        {children.map((child, i) => (
          <motion.div
            key={i}
            className="mobile-carousel__slide-wrapper"
            aria-label={`Item ${i + 1} of ${count}`}
            initial={{ opacity: 0, x: 44 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 44 }}
            transition={{
              delay: i * 0.07,
              duration: 0.55,
              ease: [0.22, 1, 0.36, 1],
            }}
          >
            {/* Inner div receives CSS scale/opacity for active-state depth effect */}
            <div
              className={`mobile-carousel__slide${
                i === activeIndex ? ' mobile-carousel__slide--active' : ''
              }`}
            >
              {child}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Pagination dots */}
      {count > 1 && (
        <div className="mobile-carousel__dots" aria-label="Slide navigation">
          {Array.from({ length: count }).map((_, i) => (
            <motion.button
              key={i}
              className={`mobile-carousel__dot${
                i === activeIndex ? ' mobile-carousel__dot--active' : ''
              }`}
              onClick={() => scrollToSlide(i)}
              role="tab"
              aria-selected={i === activeIndex}
              aria-label={`Go to slide ${i + 1}`}
              animate={i === activeIndex ? { width: 24, opacity: 1 } : { width: 7, opacity: 0.4 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default MobileCarousel;
