/**
 * types/index.ts — Shared TypeScript interfaces for portfolio data.
 *
 * All data shapes come from `src/data/portfolio.ts`. Centralising them here
 * means that components import only what they need, and updating a data shape
 * produces type errors everywhere it is used (fail-fast at compile time).
 */

// ─── Tag colour union ─────────────────────────────────────────────────────────

/** Maps to CSS class `.tag--{TagColor}` in globals.css */
export type TagColor =
  | 'primary'
  | 'accent'
  | 'orange'
  | 'teal'
  | 'pink'
  | 'yellow'
  | 'violet'
  | 'neutral'
  | 'default';

// ─── Data model interfaces ────────────────────────────────────────────────────

export interface PersonalInfo {
  name: string;
  title: string;
  tagline: string;
  summary: string;
  location: string;
  email: string;
  phone: string;
  linkedin: string;
  github: string;
}

export interface SkillCategory {
  category: string;
  /** Drives the Tag colour variant for every item in this category */
  color: TagColor;
  items: string[];
}

export interface Experience {
  id: number;
  title: string;
  company: string;
  period: string;
  /** true → filled timeline dot + "Current" badge */
  current: boolean;
  highlights: string[];
  tags: string[];
}

export interface Project {
  id: number;
  title: string;
  description: string;
  category: string;
  tags: string[];
  highlights: string[];
}

export interface Accomplishment {
  id: number;
  title: string;
  description: string;
  /** Emoji string rendered as the card icon */
  icon: string;
}

export interface EducationInfo {
  degree: string;
  institution: string;
  location: string;
  year: string;
  /** Optional GPA/CGPA string, e.g. "8.7 / 10 CGPA" */
  gpa?: string;
}

export interface NavLink {
  label: string;
  /** Anchor href, e.g. '#skills' */
  href: string;
}

// ─── Versioning ───────────────────────────────────────────────────────────────

/**
 * A complete, static snapshot of portfolio content at a given version.
 * `personal` is included as a static record (env-var overrides are runtime-only).
 */
export interface PortfolioSnapshot {
  version: string;
  /** ISO 8601 date this snapshot was taken */
  date: string;
  personal: PersonalInfo;
  skills: SkillCategory[];
  experiences: Experience[];
  projects: Project[];
  accomplishments: Accomplishment[];
  education: EducationInfo;
  navLinks: NavLink[];
}

// ─── Animation return types ───────────────────────────────────────────────────

import type { Variants } from 'framer-motion';
import type { RefObject } from 'react';

export interface AnimationVariants {
  container: Variants;
  item: Variants;
}

export interface ScrollAnimationResult {
  ref: RefObject<HTMLElement>;
  isInView: boolean;
  variants: AnimationVariants;
}
