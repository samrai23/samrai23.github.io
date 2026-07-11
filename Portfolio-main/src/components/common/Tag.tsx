import type { TagColor } from '@/types';

interface TagProps {
  /** Text displayed inside the pill */
  label: string;
  /** Colour variant — maps to `.tag--{variant}` in globals.css */
  variant?: TagColor;
  /** Extra className forwarded to the `<span>` */
  className?: string;
}

/**
 * Tag
 *
 * Reusable pill-shaped label for technologies, skills, or categories.
 */
const Tag: React.FC<TagProps> = ({ label, variant = 'default', className = '' }) => (
  <span className={`tag tag--${variant} ${className}`.trim()}>{label}</span>
);

export default Tag;
