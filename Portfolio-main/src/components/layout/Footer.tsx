import { FiGithub, FiLinkedin, FiMail, FiArrowRight } from 'react-icons/fi';
import { personal } from '@/data/portfolio';

const currentYear = new Date().getFullYear();

/**
 * Footer
 *
 * Site footer with a "Let's build something" CTA, social icon links, and copyright.
 */
const Footer: React.FC = () => (
  <footer className="footer" role="contentinfo">
    <div className="container">
      <div className="footer__inner">

        {/* ── CTA ── */}
        <div className="footer__cta">
          <h2 className="footer__cta-heading gradient-text">Let's build something great.</h2>
          <p className="footer__cta-sub">
            Open to full-time Data Engineering & AI roles, consulting projects, and interesting conversations.
          </p>
          <a href={`mailto:${personal.email}`} className="btn btn--primary" aria-label="Send an email">
            Say Hello
            <FiArrowRight aria-hidden="true" />
          </a>
        </div>

        <span className="footer__brand">{personal.name}</span>

        <nav className="footer__socials" aria-label="Social links">
          <a
            href={personal.github}
            target="_blank"
            rel="noopener noreferrer"
            className="footer__social-link"
            aria-label="GitHub profile"
          >
            <FiGithub />
          </a>
          <a
            href={personal.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="footer__social-link"
            aria-label="LinkedIn profile"
          >
            <FiLinkedin />
          </a>
          <a
            href={`mailto:${personal.email}`}
            className="footer__social-link"
            aria-label="Send email"
          >
            <FiMail />
          </a>
        </nav>

        <p className="footer__copy">
          &copy; {currentYear} {personal.name} &mdash; Built with React &amp; Framer Motion
        </p>
      </div>
    </div>
  </footer>
);

export default Footer;
