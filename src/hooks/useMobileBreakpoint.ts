import { useState, useEffect } from 'react';

/**
 * useMobileBreakpoint
 *
 * Returns `true` when the viewport is at or below `maxWidth` (default 768 px).
 * Initialises synchronously from `window.innerWidth` to prevent a layout
 * flash on first paint.
 */
const useMobileBreakpoint = (maxWidth = 768): boolean => {
  const [isMobile, setIsMobile] = useState(
    () => typeof window !== 'undefined' && window.innerWidth <= maxWidth
  );

  useEffect(() => {
    const mql = window.matchMedia(`(max-width: ${maxWidth}px)`);
    setIsMobile(mql.matches);
    const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    mql.addEventListener('change', handler);
    return () => mql.removeEventListener('change', handler);
  }, [maxWidth]);

  return isMobile;
};

export default useMobileBreakpoint;
