import { useState, useEffect, useCallback } from 'react';

interface UseActiveSectionOptions {
  /** IntersectionObserver visibility threshold (0–1) */
  threshold?: number;
}

/**
 * useActiveSection
 *
 * Tracks which section is currently most visible in the viewport using
 * IntersectionObserver. Returns the `id` of the active section, enabling
 * navbar active-link highlighting.
 *
 * @param sectionIds - Array of element `id` attribute values to observe
 * @param options    - Optional IntersectionObserver configuration
 * @returns The `id` string of the currently active section (empty string initially)
 *
 * @example
 * const activeSection = useActiveSection(['about', 'skills', 'experience']);
 */
const useActiveSection = (
  sectionIds: string[],
  options: UseActiveSectionOptions = {}
): string => {
  const [activeSection, setActiveSection] = useState('');

  const handleIntersect = useCallback((entries: IntersectionObserverEntry[]) => {
    const visible = entries.filter((e) => e.isIntersecting);
    if (visible.length === 0) return;

    // Pick the section with the highest intersection ratio
    const [mostVisible] = visible.sort((a, b) => b.intersectionRatio - a.intersectionRatio);
    setActiveSection(mostVisible.target.id);
  }, []);

  useEffect(() => {
    const threshold = options.threshold ?? 0.25;
    const observer = new IntersectionObserver(handleIntersect, {
      threshold,
      rootMargin: '-72px 0px -40% 0px', // accounts for navbar height
    });

    sectionIds.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [sectionIds, handleIntersect, options.threshold]);

  return activeSection;
};

export default useActiveSection;
