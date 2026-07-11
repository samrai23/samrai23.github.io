import type { ElementType } from 'react';

interface CardProps {
  /** Enable the hover lift + border-glow transition */
  hoverable?: boolean;
  /** Extra className forwarded to the root element */
  className?: string;
  /** Underlying HTML / component tag (default: 'div') */
  as?: ElementType;
  children: React.ReactNode;
  [key: string]: unknown; // allow arbitrary HTML attributes (e.g. aria-label)
}

/**
 * Card
 *
 * Reusable card surface with optional hover lift animation.
 * Use the `as` prop to render a semantic element (e.g. `as="article"`).
 */
const Card: React.FC<CardProps> = ({
  hoverable = true,
  className = '',
  as: Tag = 'div',
  children,
  ...rest
}) => {
  const classes = ['card', hoverable ? 'card--hoverable' : '', className]
    .filter(Boolean)
    .join(' ');

  return (
    <Tag className={classes} {...rest}>
      {children}
    </Tag>
  );
};

export default Card;
