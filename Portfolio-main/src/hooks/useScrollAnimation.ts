import { useRef } from 'react';
import { useInView, type Variants } from 'framer-motion';
import type { ScrollAnimationResult } from '@/types';

interface ScrollAnimationOptions {
  /** rootMargin for IntersectionObserver (e.g. '-60px') */
  margin?: string;
  /** Delay between each staggered child animation (seconds) */
  stagger?: number;
  /** Initial delay before the first child animates (seconds) */
  delay?: number;
  /** Vertical offset used by the slide-up entrance (pixels) */
  yOffset?: number;
  /** Duration of each child's animation (seconds) */
  duration?: number;
}

/**
 * useScrollAnimation
 *
 * Returns a `ref` to attach to a container element and Framer Motion
 * `variants` for staggered child animations that trigger once the container
 * enters the viewport.
 *
 * @example
 * const { ref, isInView, variants } = useScrollAnimation();
 * <motion.ul ref={ref} variants={variants.container} initial="hidden" animate={isInView ? 'visible' : 'hidden'}>
 *   {items.map(item => <motion.li key={item.id} variants={variants.item}>{item.name}</motion.li>)}
 * </motion.ul>
 */
const useScrollAnimation = (options: ScrollAnimationOptions = {}): ScrollAnimationResult => {
  // Cast to the broader HTMLElement to satisfy Framer Motion's RefObject<Element>
  const ref = useRef<HTMLElement>(null);

  const isInView = useInView(ref as React.RefObject<Element>, {
    once: true,
    margin: options.margin ?? '-60px',
  });

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: options.stagger ?? 0.12,
        delayChildren: options.delay ?? 0,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: options.yOffset ?? 28 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: options.duration ?? 0.55,
        ease: [0.22, 1, 0.36, 1],
      },
    },
  };

  return {
    ref,
    isInView,
    variants: {
      container: containerVariants,
      item: itemVariants,
    },
  };
};

export default useScrollAnimation;
