import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence, useScroll, useSpring } from 'framer-motion';
import { personal, navLinks } from '@/data/portfolio';
import useActiveSection from '@/hooks/useActiveSection';
import { useFeatureFlags } from '@/hooks/useFeatureFlags';
import ResumePreviewModal from '@/components/ResumePreviewModal';

// Derive section ids from nav links (strip leading '#')
const sectionIds: string[] = navLinks.map((l) => l.href.slice(1));

/**
 * Navbar
 *
 * Sticky top navigation bar that:
 * - Adds a frosted-glass background after scrolling past 20 px
 * - Highlights the nav link for the currently visible section
 * - Collapses to a hamburger + fullscreen overlay on mobile (<768 px)
 * - Smooth-scrolls to sections on link click
 */
const Navbar: React.FC = () => {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [resumePreviewOpen, setResumePreviewOpen] = useState(false);
  const activeSection = useActiveSection(sectionIds);
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 200, damping: 40, restDelta: 0.001 });
  const { showResumePDF, showResumeDocx, showContactForm, showProjects } = useFeatureFlags();
  const showResumeBtn = showResumePDF || showResumeDocx;
  // Hide flagged nav links dynamically
  const visibleLinks = navLinks.filter(({ href }) => {
    if (href === '#projects' && !showProjects) return false;
    return true;
  });

  // Reveal frosted-glass background on scroll
  useEffect(() => {
    const onScroll = (): void => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Close mobile menu when viewport widens to desktop breakpoint
  useEffect(() => {
    const onResize = (): void => {
      if (window.innerWidth >= 768) setMenuOpen(false);
    };
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  // Prevent body scroll while mobile menu is open
  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [menuOpen]);

  /** Smooth-scroll to a section by href and close mobile menu */
  const handleNavClick = useCallback(
    (e: React.MouseEvent<HTMLAnchorElement>, href: string): void => {
      e.preventDefault();
      document.querySelector(href)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      setMenuOpen(false);
    },
    []
  );

  /** Smooth-scroll to the top of the page */
  const handleBrandClick = useCallback((): void => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setMenuOpen(false);
  }, []);

  return (
    <>
      {/* Reading progress bar */}
      <motion.div className="progress-bar" style={{ scaleX }} aria-hidden="true" />

      <motion.nav
        className={`navbar${scrolled ? ' navbar--scrolled' : ''}`}
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        role="navigation"
        aria-label="Main navigation"
      >
        <div className="navbar__container">
          {/* Brand / Name */}
          <button
            className="navbar__brand"
            onClick={handleBrandClick}
            aria-label="Scroll to top"
          >
            {personal.name}
          </button>

          {/* Desktop links */}
          <ul className="navbar__links" role="list">
            {visibleLinks.map(({ label, href }) => {
              const isActive = activeSection === href.slice(1);
              return (
                <li key={href}>
                  <a
                    href={href}
                    className={`navbar__link${isActive ? ' navbar__link--active' : ''}`}
                    onClick={(e) => handleNavClick(e, href)}
                    aria-current={isActive ? 'location' : undefined}
                  >
                    {label}
                  </a>
                </li>
              );
            })}
          </ul>

          {/* Desktop CTA buttons */}
          <div className="navbar__actions">
            {showResumeBtn && (
              <button
                className="navbar__resume-btn"
                onClick={() => setResumePreviewOpen(true)}
                aria-label="Preview and download resume"
              >
                ↓ Resume
              </button>
            )}
            {showContactForm && (
              <a href={`mailto:${personal.email}`} className="navbar__cta" aria-label="Send an email">
                Contact
              </a>
            )}
          </div>

          {/* Hamburger toggle (mobile only) */}
          <button
            className={`navbar__toggle${menuOpen ? ' navbar__toggle--open' : ''}`}
            onClick={() => setMenuOpen((o) => !o)}
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={menuOpen}
          >
            <span className="navbar__toggle-bar" />
            <span className="navbar__toggle-bar" />
            <span className="navbar__toggle-bar" />
          </button>
        </div>
      </motion.nav>

      {/* Mobile fullscreen overlay */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            className="navbar__mobile-menu"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            role="dialog"
            aria-modal="true"
            aria-label="Navigation menu"
          >
            {visibleLinks.map(({ label, href }, index) => {
              const isActive = activeSection === href.slice(1);
              return (
                <motion.a
                  key={href}
                  href={href}
                  className={`navbar__mobile-link${isActive ? ' navbar__mobile-link--active' : ''}`}
                  onClick={(e) => handleNavClick(e, href)}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.06 }}
                >
                  {label}
                </motion.a>
              );
            })}
            {showResumeBtn && (
              <motion.button
                className="navbar__mobile-resume-btn"
                onClick={() => { setMenuOpen(false); setResumePreviewOpen(true); }}
                aria-label="Preview and download resume"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: visibleLinks.length * 0.06 }}
              >
                ↓ Download Resume
              </motion.button>
            )}
            {showContactForm && (
              <motion.a
                href={`mailto:${personal.email}`}
                className="navbar__mobile-cta"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: (visibleLinks.length + 1) * 0.06 }}
              >
                Contact Me
              </motion.a>
            )}
          </motion.div>
        )}
      </AnimatePresence>
      {/* Resume preview modal */}
      {showResumeBtn && (
        <ResumePreviewModal
          open={resumePreviewOpen}
          onClose={() => setResumePreviewOpen(false)}
        />
      )}
    </>
  );
};

export default Navbar;
