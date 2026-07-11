import { motion } from 'framer-motion';
import useScrollAnimation from '@/hooks/useScrollAnimation';

interface SectionProps {
  /** HTML `id` used as anchor target for smooth-scroll navigation */
  id: string;
  /** Small mono uppercase label rendered above the title */
  label?: string;
  /** Main section heading */
  title?: string;
  /** Optional subtitle paragraph */
  subtitle?: string;
  /** Use the alternate background stripe defined in globals.css */
  alt?: boolean;
  /** Extra className forwarded to the `<section>` element */
  className?: string;
  children: React.ReactNode;
}

/**
 * Section
 *
 * Reusable section wrapper providing:
 * - Consistent vertical padding and layout
 * - Optional alternate background stripe
 * - Scroll-triggered animated header (label → title → subtitle → divider)
 */
const Section: React.FC<SectionProps> = ({
  id,
  label,
  title,
  subtitle,
  alt = false,
  className = '',
  children,
}) => {
  const { ref, isInView, variants } = useScrollAnimation({ delay: 0, stagger: 0.1 });

  const sectionClass = ['section', alt ? 'section--alt' : '', className]
    .filter(Boolean)
    .join(' ');

  const hasHeader = Boolean(label || title || subtitle);

  return (
    <section id={id} className={sectionClass}>
      <div className="container">
        {hasHeader && (
          <motion.div
            ref={ref as React.RefObject<HTMLDivElement>}
            className="section__header"
            variants={variants.container}
            initial="hidden"
            animate={isInView ? 'visible' : 'hidden'}
          >
            {label && (
              <motion.span className="section__label" variants={variants.item}>
                {label}
              </motion.span>
            )}
            {title && (
              <motion.h2 className="section__title" variants={variants.item}>
                {title}
              </motion.h2>
            )}
            {subtitle && (
              <motion.p className="section__subtitle" variants={variants.item}>
                {subtitle}
              </motion.p>
            )}
            {title && (
              <motion.div className="section__divider" variants={variants.item} />
            )}
          </motion.div>
        )}

        {children}
      </div>
    </section>
  );
};

export default Section;
