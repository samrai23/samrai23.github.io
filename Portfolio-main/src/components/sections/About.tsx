import { motion } from 'framer-motion';
import { FiMapPin, FiMail, FiPhone, FiGithub, FiLinkedin } from 'react-icons/fi';
import Section from '@/components/common/Section';
import useScrollAnimation from '@/hooks/useScrollAnimation';
import { personal } from '@/data/portfolio';

interface ContactDetailItem {
  icon: React.ReactElement;
  label: string;
  value: string;
  /** null → render as plain text; string → render as anchor */
  href: string | null;
}

/** Build contact detail rows from the personal data object */
const buildContactDetails = (p: typeof personal): ContactDetailItem[] => [
  { icon: <FiMapPin />, label: 'Location', value: p.location, href: null },
  { icon: <FiMail />,   label: 'Email',    value: p.email,    href: `mailto:${p.email}` },
  { icon: <FiPhone />,  label: 'Phone',    value: p.phone,    href: `tel:${p.phone}` },
  { icon: <FiGithub />, label: 'GitHub',   value: 'View Profile', href: p.github },
  { icon: <FiLinkedin />, label: 'LinkedIn', value: 'View Profile', href: p.linkedin },
].filter(({ value }) => Boolean(value));

/**
 * About
 *
 * Two-column layout:
 * - Left:  professional summary paragraph
 * - Right: contact / detail card list
 *
 * Both columns animate from below when scrolled into view.
 */
const About: React.FC = () => {
  const { ref: leftRef, isInView: leftInView, variants } = useScrollAnimation({ stagger: 0.08 });
  const {
    ref: rightRef,
    isInView: rightInView,
    variants: rightVariants,
  } = useScrollAnimation({ stagger: 0.07, delay: 0.1 });

  const details = buildContactDetails(personal);

  return (
    <Section
      id="about"
      label="About me"
      title="Who I Am"
      subtitle="A quick look at my background, focus areas, and how to reach me."
      alt
    >
      <div className="about__grid">
        {/* Summary column */}
        <motion.div
          ref={leftRef as React.RefObject<HTMLDivElement>}
          variants={variants.container}
          initial="hidden"
          animate={leftInView ? 'visible' : 'hidden'}
        >
          <motion.p className="about__summary" variants={variants.item}>
            {personal.summary}
          </motion.p>
        </motion.div>

        {/* Contact details column */}
        <motion.div
          ref={rightRef as React.RefObject<HTMLDivElement>}
          className="about__details-card"
          variants={rightVariants.container}
          initial="hidden"
          animate={rightInView ? 'visible' : 'hidden'}
        >
          {details.map(({ icon, label, value, href }) => (
            <motion.div key={label} className="about__detail-item" variants={rightVariants.item}>
              <span className="about__detail-icon" aria-hidden="true">
                {icon}
              </span>
              <div className="about__detail-content">
                <span className="about__detail-label">{label}</span>
                {href ? (
                  <a
                    href={href}
                    target={href.startsWith('http') ? '_blank' : undefined}
                    rel={href.startsWith('http') ? 'noopener noreferrer' : undefined}
                    className="about__detail-value about__detail-link"
                  >
                    {value}
                  </a>
                ) : (
                  <span className="about__detail-value">{value}</span>
                )}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </Section>
  );
};

export default About;
