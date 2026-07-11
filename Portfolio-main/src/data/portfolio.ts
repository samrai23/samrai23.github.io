/**
 * portfolio.ts — Single source of truth for all portfolio content.
 *
 * Update this file to customise what is displayed on the site.
 * No component changes are needed for content edits.
 *
 * Version history:
 *   1.0.0 — Initial release
 *   1.1.0 — Sudhanshu Raina — Data Engineer content
 */

/** Semantic version of this portfolio data file. Bump when content changes. */
export const PORTFOLIO_VERSION = '1.1.0';

/** ISO 8601 date of the last content update. */
export const PORTFOLIO_LAST_UPDATED = '2026-07-11';

import type {
  PersonalInfo,
  SkillCategory,
  Experience,
  Project,
  Accomplishment,
  EducationInfo,
  NavLink,
} from '@/types';

// ─── Personal Info ────────────────────────────────────────────────────────────
// Values are read from VITE_* environment variables (see .env.local / .env.example).
// Fallback strings are shown in development if the variable is not set.

export const personal: PersonalInfo = {
  name:     import.meta.env.VITE_NAME     || 'Sudhanshu Raina',
  title:    import.meta.env.VITE_TITLE    || 'Data Engineer',
  tagline:  import.meta.env.VITE_TAGLINE  || 'Building Scalable Data Pipelines & Agentic AI Systems on GCP & AWS',
  summary:  import.meta.env.VITE_SUMMARY  ||
    'Results-driven Data Engineer with 4 years of experience building scalable ETL/ELT pipelines and agentic AI systems on GCP and AWS. Expertise in LangGraph multi-agent orchestration, PySpark, Google Kubernetes Engine (GKE), and Argo Workflows. Proven track record of deploying 20+ data science solutions for 50M+ customers, auto-healing production pipelines using LLM agents, and reducing operational costs through infrastructure optimization. Skilled in Medallion Architecture, data contracts, CI/CD automation, and ensuring high system availability through rigorous production gating.',
  location: import.meta.env.VITE_LOCATION || 'Delhi, India',
  email:    import.meta.env.VITE_EMAIL    || 'sudhanshuraina23@gmail.com',
  phone:    import.meta.env.VITE_PHONE    || '+91-9773526183',
  linkedin: import.meta.env.VITE_LINKEDIN || 'https://www.linkedin.com/in/sudhanshu-raina-39a939189',
  github:   import.meta.env.VITE_GITHUB   || 'https://github.com/samrai23',
};

// ─── Skills ───────────────────────────────────────────────────────────────────
// Each category maps to a color variant defined in globals.css (.tag--{color})

export const skills: SkillCategory[] = [
  {
    category: 'Cloud & Infrastructure',
    color: 'primary',
    items: [
      'Google Cloud Platform (GCP)',
      'AWS (S3, Lambda, Kinesis, Glue, Redshift)',
      'Kubernetes (GKE)',
      'Docker',
      'Terraform (IaC)',
    ],
  },
  {
    category: 'Big Data & Processing',
    color: 'accent',
    items: [
      'Apache Spark (PySpark, Spark SQL)',
      'Structured Streaming',
      'BigQuery',
      'dbt',
      'Hive',
      'Data Warehousing',
      'ETL/ELT Pipelines',
    ],
  },
  {
    category: 'AI & Agentic Systems',
    color: 'pink',
    items: [
      'LangGraph',
      'Gemini 2.0 Flash (LLM)',
      'Model Context Protocol (MCP)',
      'NeMo Guardrails',
      'Multi-Agent Orchestration',
    ],
  },
  {
    category: 'Workflow Orchestration',
    color: 'orange',
    items: ['Argo Workflows', 'Apache Airflow', 'Pub/Sub', 'Cloud Functions'],
  },
  {
    category: 'CI/CD & DevOps',
    color: 'yellow',
    items: ['GitHub Actions', 'GitLab CI', 'Octopus CD', 'Bash Scripting', 'Linux'],
  },
  {
    category: 'Programming & Databases',
    color: 'teal',
    items: ['Python (Pandas, NumPy)', 'FastAPI', 'Pydantic', 'SQL (MySQL, PostgreSQL)', 'Firestore'],
  },
  {
    category: 'Methodologies',
    color: 'violet',
    items: [
      'Agile',
      'Scrum',
      'Medallion Architecture',
      'Event-Driven Architecture',
      'Microservices',
      'Star Schema',
      'SCD Type 2',
    ],
  },
  {
    category: 'Soft Skills',
    color: 'neutral',
    items: [
      'Cross-functional Collaboration',
      'Stakeholder Communication',
      'Production Ownership',
      'Incident Response',
      'Mentoring & Code Reviews',
    ],
  },
];

// ─── Work Experience ──────────────────────────────────────────────────────────

export const experiences: Experience[] = [
  {
    id: 1,
    title: 'Data Engineer',
    company: 'Dunnhumby — Gurugram, Haryana, India · Hybrid',
    period: 'Jul 2022 - Present',
    current: true,
    highlights: [
      'Orchestrated the end-to-end deployment of 20+ data science solutions for a client base of 50 million customers, migrating workflows from legacy systems to scalable GCP architecture.',
      'Enabled real-time ML model updates across 20+ global clients via a single-click CI/CD workflow, significantly reducing time-to-market and deployment friction.',
      'Implemented periodic production gate checks and automated incident resolution protocols, resulting in a 40% reduction in critical incidents (INC) and ensuring adherence to 99.95% SLAs.',
      'Designed and deployed customer lifecycle segmentation models using PySpark on GCP, classifying 1M+ customers into five stages (Onboard, Grow, Reward, Retain, Winback) with 85% accuracy while ensuring 100% data quality.',
      'Optimized Spark jobs through configuration tuning and efficient resource allocation, cutting processing costs by 25% and improving runtime by 40% across 15+ global markets.',
      'Established comprehensive unit testing frameworks, increasing code coverage to 95%+, ensuring production-grade deployments.',
    ],
    tags: ['GCP', 'PySpark', 'Spark SQL', 'BigQuery', 'CI/CD', 'Kubernetes', 'Data Quality'],
  },
];

// ─── Projects ─────────────────────────────────────────────────────────────────

export const projects: Project[] = [
  {
    id: 1,
    title: 'Agentic Data Contract & Schema Drift Platform',
    description:
      'A LangGraph-powered 3-agent pipeline (Analyst → Writer → Healer) on GCP that detects vendor schema drift in real time and auto-heals data contract violations with zero human intervention.',
    category: 'AI / Agentic Systems',
    tags: ['LangGraph', 'PySpark Streaming', 'GCP Pub/Sub', 'MCP', 'NeMo Guardrails', 'FastAPI', 'BigQuery', 'dbt'],
    highlights: [
      'Detected vendor schema drift in real time via PySpark Structured Streaming + GCP Pub/Sub, auto-healing 84% of events in under 90 seconds',
      'Built a Model Context Protocol (MCP) tool server for secure, schema-validated BigQuery access by LLM agents, enforcing NeMo Guardrails to block risky DDL mutations',
      'Deployed a versioned data contract registry (FastAPI + Pydantic v2 + BigQuery) with a dbt transformation layer; CI/CD via GitHub Actions to Cloud Run',
    ],
  },
  {
    id: 2,
    title: 'Bid Recommendation System',
    description:
      'A weekly-cadence recommendation engine for retail media, generating data-driven bid ranges at brand and category level to guide targeting teams.',
    category: 'Data Engineering',
    tags: ['PySpark', 'Medallion Architecture', 'Kubernetes', 'Argo Workflows', 'Firestore'],
    highlights: [
      'Generated data-driven bid ranges (lower/upper bounds) at brand and category level, reducing manual optimization effort by 30-40%',
      'Implemented a Medallion Architecture (Bronze/Silver/Gold) to ensure data integrity and view-restricted access to sensitive KPIs',
      'Optimized Kubernetes pod bin-packing to cut pipeline runtime by 30%, automating delivery via Argo Workflows to Firestore for campaign booking',
    ],
  },
  {
    id: 3,
    title: 'Real-Time E-Commerce Analytics Hub',
    description:
      'A real-time analytics and predictive inventory platform on AWS that forecasts demand and automates stockout prevention.',
    category: 'Cloud / AWS',
    tags: ['AWS Kinesis', 'AWS Glue', 'Redshift ML', 'Lambda', 'Terraform'],
    highlights: [
      'Built a real-time analytics pipeline using AWS Kinesis, Glue PySpark ETL, and Redshift ML with 92% accuracy in inventory forecasting',
      'Automated inventory alerts via Lambda/SNS when predicted demand exceeded supply by 150%, reducing stockouts by 35%',
      'Designed a cost-efficient serverless architecture with Terraform, achieving 40% cost savings through auto-scaling',
    ],
  },
  {
    id: 4,
    title: 'Science Workflow Orchestrator',
    description:
      'A multi-tenant orchestration platform on GCP automating data science workflows across 10+ clients and 5+ scientific domains.',
    category: 'Data Engineering',
    tags: ['Argo Workflows', 'GKE', 'Pub/Sub', 'Cloud Functions', 'Terraform'],
    highlights: [
      'Automated multi-tenant science workflows for 10+ clients, processing 100+ daily payloads with a 90% reduction in manual effort',
      'Scaled Argo Workflows on GKE to run 50+ concurrent jobs, cutting runtime by 35% via dynamic resource allocation and 50TB+ of GCS artifact caching',
      'Deployed Terraform-managed infrastructure across DEV/UAT/PROD with Pub/Sub alerting, reducing support tickets by 40% while maintaining 99.95% SLA',
    ],
  },
];

// ─── Accomplishments ──────────────────────────────────────────────────────────

export const accomplishments: Accomplishment[] = [
  {
    id: 1,
    title: 'GCP Associate Cloud Engineer',
    description: 'Google Cloud certification validating hands-on expertise deploying and managing GCP infrastructure. (2024)',
    icon: '🎓',
  },
  {
    id: 2,
    title: 'Spark & Python for Big Data',
    description: 'Certified in PySpark, Spark SQL, and distributed big-data processing. (2024)',
    icon: '⚡',
  },
  {
    id: 3,
    title: '99.95% SLA Adherence',
    description: 'Cut critical incidents by 40% through rigorous production gate checks and automated incident resolution.',
    icon: '🎯',
  },
  {
    id: 4,
    title: '50M+ Customers Impacted',
    description: 'Deployed 20+ data science solutions to production, powering ML-driven decisions at global retail scale.',
    icon: '🚀',
  },
];

// ─── Education ────────────────────────────────────────────────────────────────

export const education: EducationInfo = {
  degree: 'Bachelor of Technology (B.Tech) in Computer Science and Engineering',
  institution: 'Delhi Technological University (DTU, formerly DCE)',
  location: 'Bawana, Delhi, India',
  year: 'May 2022',
  gpa: '8.7 / 10 CGPA',
};

// ─── Navigation ───────────────────────────────────────────────────────────────
// href values must match section element ids prefixed with '#'

export const navLinks: NavLink[] = [
  { label: 'About', href: '#about' },
  { label: 'Skills', href: '#skills' },
  { label: 'Experience', href: '#experience' },
  { label: 'Projects', href: '#projects' },
  { label: 'Education', href: '#education' },
];

// ─── Feature Flags ────────────────────────────────────────────────────────────
// Toggle individual UI features without touching components.

/** Set VITE_SHOW_RESUME_DOWNLOAD=true in .env.local to show the "↓ Resume" download button in the navbar. */
export const showResumeDownload: boolean =
  import.meta.env.VITE_SHOW_RESUME_DOWNLOAD === 'true';
