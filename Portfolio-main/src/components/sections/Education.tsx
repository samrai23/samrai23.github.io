import { motion } from 'framer-motion';
import Section from '@/components/common/Section';
import useScrollAnimation from '@/hooks/useScrollAnimation';
import { education } from '@/data/portfolio';

/**
 * Education
 *
 * Displays the degree on a single centred card.
 * Animates in from below when the section scrolls into view.
 */
const Education: React.FC = () => {
  const { ref, isInView, variants } = useScrollAnimation({ delay: 0.1 });

  return (
    <Section id="education" label="Background" title="Education">
      <motion.div
        ref={ref as React.RefObject<HTMLDivElement>}
        variants={variants.container}
        initial="hidden"
        animate={isInView ? 'visible' : 'hidden'}
      >
        <motion.div className="education__card" variants={variants.item}>
          <span className="education__icon" aria-hidden="true">
            🎓
          </span>
          <div className="education__details">
            <h3 className="education__degree">{education.degree}</h3>
            <p className="education__institution">{education.institution}</p>
            <p className="education__location">{education.location}</p>
            <p className="education__year">Graduated: {education.year}</p>
            {education.gpa && <p className="education__gpa">{education.gpa}</p>}
          </div>
        </motion.div>
      </motion.div>
    </Section>
  );
};

export default Education;
