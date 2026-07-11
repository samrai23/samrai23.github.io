import { motion } from 'framer-motion';
import Section from '@/components/common/Section';
import Tag from '@/components/common/Tag';
import MobileCarousel from '@/components/common/MobileCarousel';
import useScrollAnimation from '@/hooks/useScrollAnimation';
import useMobileBreakpoint from '@/hooks/useMobileBreakpoint';
import { skills } from '@/data/portfolio';
import type { SkillCategory, AnimationVariants } from '@/types';

interface SkillCategoryCardProps {
  category: SkillCategory;
  variants?: AnimationVariants;
}

/**
 * SkillCategoryCard
 *
 * Renders a single skill category card with a coloured dot, category name,
 * and a wrapped list of Tag pills.
 */
const SkillCategoryCard: React.FC<SkillCategoryCardProps> = ({ category, variants }) => (
  <motion.div className="skills__category-card" variants={variants?.item}>
    <div className="skills__category-header">
      <span
        className={`skills__category-dot skills__category-dot--${category.color}`}
        aria-hidden="true"
      />
      <h3 className="skills__category-name">{category.category}</h3>
    </div>
    <ul className="skills__tag-list" role="list" aria-label={`${category.category} skills`}>
      {category.items.map((skill) => (
        <li key={skill}>
          <Tag label={skill} variant={category.color} />
        </li>
      ))}
    </ul>
  </motion.div>
);

/**
 * Skills
 *
 * Responsive auto-fill grid of skill category cards.
 * Cards stagger in when the grid scrolls into view.
 */
const Skills: React.FC = () => {
  const { variants } = useScrollAnimation({ stagger: 0.08, delay: 0.1 });
  const isMobile = useMobileBreakpoint();

  return (
    <Section
      id="skills"
      label="Capabilities"
      title="Skills & Technologies"
      subtitle="A categorised overview of technologies, tools, and practices I work with daily."
    >
      {isMobile ? (
        <MobileCarousel ariaLabel="Skill categories">
          {skills.map((category) => (
            <SkillCategoryCard key={category.category} category={category} />
          ))}
        </MobileCarousel>
      ) : (
        <motion.div
          className="skills__grid"
          variants={variants.container}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-60px' }}
          role="list"
          aria-label="Skill categories"
        >
          {skills.map((category) => (
            <SkillCategoryCard key={category.category} category={category} variants={variants} />
          ))}
        </motion.div>
      )}
    </Section>
  );
};

export default Skills;
