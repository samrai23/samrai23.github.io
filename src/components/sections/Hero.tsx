import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiGithub, FiLinkedin, FiMail, FiMapPin, FiArrowRight } from 'react-icons/fi';
import { personal } from '@/data/portfolio';

// ─── Cycling role phrases ─────────────────────────────────────────────────────

const ROLES = ['Data Engineer', 'Agentic AI Builder', 'Cloud Data Architect', 'PySpark Specialist'];

const STATS = [
  { value: '4+', label: 'Years Exp' },
  { value: '20+', label: 'Solutions Shipped' },
  { value: '50M+', label: 'Customers Reached' },
];

// ─── Typewriter component ─────────────────────────────────────────────────────

const AnimatedRole: React.FC = () => {
  const [index, setIndex] = useState(0);
  const [text, setText] = useState('');
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const word = ROLES[index];
    let timer: ReturnType<typeof setTimeout>;

    if (!deleting && text === word) {
      timer = setTimeout(() => setDeleting(true), 1800);
    } else if (deleting && text === '') {
      setDeleting(false);
      setIndex(i => (i + 1) % ROLES.length);
    } else {
      const delay = deleting ? 45 : 75;
      timer = setTimeout(() => {
        setText(deleting ? word.slice(0, text.length - 1) : word.slice(0, text.length + 1));
      }, delay);
    }

    return () => clearTimeout(timer);
  }, [text, deleting, index]);

  return (
    <span className="hero__typed" aria-label={`Currently: ${ROLES[index]}`}>
      {text}
      <span className="hero__typed-cursor" aria-hidden="true" />
    </span>
  );
};



const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.14, delayChildren: 0.35 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.65, ease: [0.22, 1, 0.36, 1] } },
};

const visualVariants = {
  hidden: { opacity: 0, scale: 0.94, y: 20 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { duration: 0.9, ease: [0.22, 1, 0.36, 1], delay: 0.5 },
  },
};

// ─── Terminal code card (decorative background) ─────────────────────────────

const TerminalCard: React.FC = () => (
  <div className="terminal-card" role="img" aria-label="Code snippet about the developer">
    <div className="terminal-card__topbar">
      <span className="terminal-card__dot terminal-card__dot--red"    aria-hidden="true" />
      <span className="terminal-card__dot terminal-card__dot--yellow" aria-hidden="true" />
      <span className="terminal-card__dot terminal-card__dot--green"  aria-hidden="true" />
      <span className="terminal-card__filename">developer.ts</span>
    </div>

    <div className="terminal-card__body">
      <code>
        <span className="code-line">
          <span className="code-keyword">const</span>{' '}
          <span className="code-var">developer</span>{' '}
          <span className="code-bracket">= {'{'}</span>
        </span>
        <span className="code-line">
          {'  '}<span className="code-key">name</span>
          <span className="code-colon">:</span>{' '}
          <span className="code-string">"{personal.name}"</span>
          <span className="code-bracket">,</span>
        </span>
        <span className="code-line">
          {'  '}<span className="code-key">role</span>
          <span className="code-colon">:</span>{' '}
          <span className="code-string">"{personal.title}"</span>
          <span className="code-bracket">,</span>
        </span>
        <span className="code-line">
          {'  '}<span className="code-key">focus</span>
          <span className="code-colon">:</span>{' '}
          <span className="code-bracket">[</span>
          <span className="code-string">"GCP"</span>
          <span className="code-bracket">, </span>
          <span className="code-string">"AWS"</span>
          <span className="code-bracket">, </span>
          <span className="code-string">"AI Agents"</span>
          <span className="code-bracket">],</span>
        </span>
        <span className="code-line">
          {'  '}<span className="code-key">experience</span>
          <span className="code-colon">:</span>{' '}
          <span className="code-string">"4+ years"</span>
          <span className="code-bracket">,</span>
        </span>
        <span className="code-line">
          {'  '}<span className="code-key">passion</span>
          <span className="code-colon">:</span>{' '}
          <span className="code-string">"Ship resilient, self-healing data systems"</span>
          <span className="code-bracket">,</span>
        </span>
        <span className="code-line">
          {'  '}<span className="code-key">status</span>
          <span className="code-colon">:</span>{' '}
          <span className="code-string code-string--green">"open to work"</span>
          <span className="code-bracket">,</span>
        </span>
        <span className="code-line">
          <span className="code-bracket">{'}'}</span>
          <span className="code-bracket">;</span>
        </span>
        <span className="code-line">
          <span className="code-cursor" aria-hidden="true" />
        </span>
      </code>
    </div>
  </div>
);

// ─── Hero ─────────────────────────────────────────────────────────────────────

/**
 * Hero
 *
 * Full-viewport landing section with staggered text animations,
 * social icon links, a floating terminal card, and a scroll indicator.
 */
const Hero: React.FC = () => {
  const scrollTo = (id: string) => (e: React.MouseEvent<HTMLButtonElement | HTMLAnchorElement>) => {
    e.preventDefault();
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="hero" aria-label="Introduction">
      <div className="container hero__container">
        <div className="hero__inner">
          {/* ── Left: Text content ── */}
          <motion.div
            className="hero__content"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <motion.div className="hero__eyebrow" variants={itemVariants}>
              <span className="hero__eyebrow-dot" aria-hidden="true" />
              Available for opportunities
            </motion.div>

            <motion.h1 className="hero__name" variants={itemVariants}>
              {personal.name}
            </motion.h1>

            <motion.p className="hero__title" variants={itemVariants}>
              {personal.title}
            </motion.p>

            <motion.div className="hero__role-line" variants={itemVariants}>
              <span className="hero__role-prompt" aria-hidden="true">{'>'}</span>
              <AnimatedRole />
            </motion.div>

            <motion.p className="hero__summary" variants={itemVariants}>
              {personal.summary}
            </motion.p>

            <motion.span className="hero__location" variants={itemVariants}>
              <FiMapPin aria-hidden="true" />
              {personal.location}
            </motion.span>

            <motion.div className="hero__actions" variants={itemVariants}>
              <button className="btn btn--primary" onClick={scrollTo('projects')}>
                View My Work
                <FiArrowRight aria-hidden="true" />
              </button>
              <a href={`mailto:${personal.email}`} className="btn btn--outline">
                <FiMail aria-hidden="true" />
                Get in Touch
              </a>
            </motion.div>

            <motion.nav
              className="hero__socials"
              variants={itemVariants}
              aria-label="Social profiles"
            >
              <a
                href={personal.github}
                target="_blank"
                rel="noopener noreferrer"
                className="hero__social-link"
                aria-label="GitHub"
              >
                <FiGithub />
              </a>
              <a
                href={personal.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="hero__social-link"
                aria-label="LinkedIn"
              >
                <FiLinkedin />
              </a>
              <a
                href={`mailto:${personal.email}`}
                className="hero__social-link"
                aria-label="Email"
              >
                <FiMail />
              </a>
            </motion.nav>

            {/* Stats bar */}
            <motion.div className="hero__stats" variants={itemVariants} aria-label="Quick stats">
              {STATS.map(s => (
                <div key={s.label} className="hero__stat">
                  <span className="hero__stat-value gradient-text">{s.value}</span>
                  <span className="hero__stat-label">{s.label}</span>
                </div>
              ))}
            </motion.div>
          </motion.div>

          {/* ── Right: Profile photo with terminal card behind ── */}
          <motion.div
            className="hero__visual"
            variants={visualVariants}
            initial="hidden"
            animate="visible"
          >
            <div className="hero__visual-stack">
              {/* Floating tech badges */}
              <span className="hero__badge hero__badge--swift" aria-hidden="true">🐍 Python</span>
              <span className="hero__badge hero__badge--react" aria-hidden="true">☁ GCP</span>
              <span className="hero__badge hero__badge--ai" aria-hidden="true">✦ Spark</span>
              <span className="hero__badge hero__badge--aws" aria-hidden="true">▲ AWS</span>
              <span className="hero__badge hero__badge--langgraph" aria-hidden="true">⛓ LangGraph</span>

              <div className="hero__avatar-wrap">
                <img
                  src={`${import.meta.env.BASE_URL}profile.jpg`}
                  alt={`${personal.name} profile photo`}
                  className="hero__avatar-img"
                />
              </div>
              <div className="hero__visual-card" aria-hidden="true">
                <TerminalCard />
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      <div className="hero__scroll-indicator" aria-hidden="true">
        <div className="hero__scroll-mouse">
          <div className="hero__scroll-wheel" />
        </div>
        <span>scroll</span>
      </div>
    </section>
  );
};

export default Hero;
