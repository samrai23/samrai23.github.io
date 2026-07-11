import { motion } from 'framer-motion';
import Section from '@/components/common/Section';
import Tag from '@/components/common/Tag';
import MobileCarousel from '@/components/common/MobileCarousel';
import useScrollAnimation from '@/hooks/useScrollAnimation';
import useMobileBreakpoint from '@/hooks/useMobileBreakpoint';
import { experiences } from '@/data/portfolio';
import type { Experience, AnimationVariants } from '@/types';

interface ExperienceItemProps {
  experience: Experience;
  variants: AnimationVariants;
}

/**
 * ExperienceCard
 *
 * Standalone card content — company/role header, bullet highlights, and
 * tech tags. Used both inside the desktop timeline and the mobile carousel.
 */
const ExperienceCard: React.FC<{ experience: Experience }> = ({ experience }) => (
  <div className="experience__card">
    <div className="experience__header">
      <div className="experience__role-info">
        <h3 className="experience__title">{experience.title}</h3>
        <span className="experience__company">{experience.company}</span>
      </div>

      <div className="experience__meta">
        <span className="experience__period">{experience.period}</span>
        {experience.current && (
          <span className="experience__current-badge" aria-label="Current role">
            Current
          </span>
        )}
      </div>
    </div>

    <ul className="experience__highlights" aria-label="Key responsibilities">
      {experience.highlights.map((point, index) => (
        <li key={index} className="experience__highlight">
          <span className="experience__highlight-bullet" aria-hidden="true" />
          {point}
        </li>
      ))}
    </ul>

    <div className="experience__tags" aria-label="Technologies used">
      {experience.tags.map((tag) => (
        <Tag key={tag} label={tag} variant="primary" />
      ))}
    </div>
  </div>
);

/**
 * ExperienceItem
 *
 * Wraps ExperienceCard with a timeline dot for the desktop vertical layout.
 */
const ExperienceItem: React.FC<ExperienceItemProps> = ({ experience, variants }) => (
  <motion.div className="experience__item" variants={variants.item}>
    {/* Timeline dot — filled for the current role */}
    <span
      className={`experience__dot${experience.current ? ' experience__dot--current' : ''}`}
      aria-hidden="true"
    />
    <ExperienceCard experience={experience} />
  </motion.div>
);

/**
 * Experience
 *
 * Desktop: vertical timeline of work history (newest first), with staggered
 * entrance animations.
 * Mobile:  horizontally-snapping carousel — each card stands alone without
 * the timeline chrome.
 */
const Experience: React.FC = () => {
  const { variants } = useScrollAnimation({ stagger: 0.15, yOffset: 32 });
  const isMobile = useMobileBreakpoint();

  return (
    <Section
      id="experience"
      label="Career"
      title="Work Experience"
      subtitle="My professional journey building data platforms, pipelines, and agentic AI systems."
      alt
    >
      {isMobile ? (
        <MobileCarousel ariaLabel="Work experience">
          {experiences.map((exp) => (
            <ExperienceCard key={exp.id} experience={exp} />
          ))}
        </MobileCarousel>
      ) : (
        <motion.div
          className="experience__timeline"
          variants={variants.container}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-60px' }}
          role="list"
          aria-label="Work experience timeline"
        >
          {experiences.map((exp) => (
            <ExperienceItem key={exp.id} experience={exp} variants={variants} />
          ))}
        </motion.div>
      )}
    </Section>
  );
};

export default Experience;
