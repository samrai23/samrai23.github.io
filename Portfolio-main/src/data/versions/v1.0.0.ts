/**
 * v1.0.0.ts — Snapshot of portfolio content at version 1.0.0
 *
 * This is a static, immutable record. Do NOT edit it.
 * To record a new version, duplicate this file as vX.Y.Z.ts and update the data there.
 *
 * Date: 2026-06-14
 * Changes: Initial release
 */

import type { PortfolioSnapshot } from '@/types';

export const v1_0_0: PortfolioSnapshot = {
  version: '1.0.0',
  date: '2026-06-14',

  // ─── Personal ──────────────────────────────────────────────────────────────
  // Static copy of personal details at the time of this snapshot.
  // (Runtime env-var overrides are not captured here by design.)
  personal: {
    name:     '[Your Name]',
    title:    'Software Engineer',
    tagline:  'Building for iOS · Web · AI',
    summary:  '',
    location: 'India',
    email:    'you@example.com',
    phone:    '',
    linkedin: '#',
    github:   '#',
  },

  // ─── Skills ────────────────────────────────────────────────────────────────
  skills: [
    {
      category: 'Languages',
      color: 'primary',
      items: ['Swift', 'JavaScript', 'TypeScript', 'HTML5', 'CSS3', 'SCSS'],
    },
    {
      category: 'Frameworks & Libraries',
      color: 'accent',
      items: ['ReactJS', 'Material UI (MUI)', 'UIKit', 'OpenSeadragon'],
    },
    {
      category: 'Mobile Development',
      color: 'orange',
      items: [
        'iOS App Development',
        'SwiftUI',
        'UIKit',
        'MVVM',
        'AVFoundation',
        'BLE Integration',
        'UIImagePickerController',
        'UIActivityViewController',
      ],
    },
    {
      category: 'Web Development',
      color: 'teal',
      items: ['React', 'Responsive UI', 'Admin Panels', 'Progressive Web Apps'],
    },
    {
      category: 'AI / Automation',
      color: 'pink',
      items: ['Generative AI', 'Multi-Agent Systems', 'Conversational AI Platforms'],
    },
    {
      category: 'Backend & Infra',
      color: 'yellow',
      items: ['Docker', 'REST APIs', 'OAuth2', 'CI/CD', 'Jenkins', 'Fastlane'],
    },
    {
      category: 'Tools & Platforms',
      color: 'violet',
      items: ['Xcode', 'Git / GitHub', 'Docker', 'Figma', 'Jira', 'Jenkins', 'Fastlane'],
    },
    {
      category: 'Soft Skills',
      color: 'neutral',
      items: [
        'Cross-functional Collaboration',
        'Problem Solving',
        'Product Thinking',
        'Ownership & Accountability',
        'Innovation Mindset',
      ],
    },
  ],

  // ─── Experience ────────────────────────────────────────────────────────────
  experiences: [
    {
      id: 1,
      title: 'iOS Developer',
      company: 'adidas - Harmony iOS',
      period: 'Mar 2026 - Present',
      current: true,
      highlights: [
        'Led development and launch of the adiClub Membership experience, enabling store associates worldwide to identify, enroll, and engage loyalty members without leaving the Harmony app.',
        'Built the end-to-end membership workflow using SwiftUI, Swift 5.9, and MVVM — covering member lookup, registration, invitation management, and QR-based identification for thousands of retail associates.',
        'Integrated native AVFoundation QR scanning to replace manual member-ID entry, improving lookup speed and reducing input errors during customer onboarding.',
        'Designed and developed the Raffles & Events platform from the ground up, allowing associates to discover, promote, and manage adidas campaign participation directly from mobile devices.',
        'Owned end-to-end integration with adidas membership services, implementing secure OAuth2-backed service layers with resilient authentication and edge-case handling.',
        'Improved engineering productivity by co-creating AI-assisted development workflows that transformed feature specs and designs into implementation-ready code.',
        'Delivered production-ready software through analytics instrumentation, accessibility compliance, responsive iPhone/iPad experiences, and automated CI/CD pipelines using Jenkins and Fastlane.',
      ],
      tags: ['SwiftUI', 'Swift', 'MVVM', 'AVFoundation', 'OAuth2', 'Jenkins', 'Fastlane', 'iOS'],
    },
    {
      id: 2,
      title: 'Software Engineer',
      company: 'Adidas - India Tech Hub',
      period: 'Jan 2025 - Feb 2026',
      current: false,
      highlights: [
        'Contributed to enterprise architecture and innovation within the R&D Hub, building internal digital platforms and scalable software solutions.',
        'Developed native iOS applications and frontend web solutions for internal and consumer-facing use cases.',
        'Built AI-driven multi-agent chat platform to automate research workflows and concept creation using Generative AI.',
        'Designed admin panels with event management, user roles, forms, insights dashboards, notifications, and support bots.',
        'Worked on BLE-enabled mobile applications involving hardware connectivity, device state handling, and disconnection management.',
        'Participated in in-person demos, workshops, and innovation programs with global teams.',
        'Received Quarterly Superstar Award and multiple nominations for Courage, Ownership, and Teamplay.',
      ],
      tags: ['iOS', 'Swift', 'React', 'Generative AI', 'BLE', 'TypeScript'],
    },
    {
      id: 3,
      title: 'Junior Software Engineer',
      company: 'Adidas',
      period: 'Jun 2022 - Dec 2024',
      current: false,
      highlights: [
        'Completed structured engineering onboarding focused on frontend engineering standards, enterprise practices, and product delivery.',
        'Built foundational skills in scalable web development, UI engineering, and agile collaboration.',
      ],
      tags: ['Frontend', 'React', 'Agile'],
    },
  ],

  // ─── Projects ──────────────────────────────────────────────────────────────
  projects: [
    {
      id: 1,
      title: 'AI-Powered Multi-Agent Research Platform',
      description:
        'Conversational multi-agent platform to automate research and concept generation workflows. Users interact with multiple AI agents for idea generation, task automation, and knowledge retrieval.',
      category: 'AI / Automation',
      tags: ['Generative AI', 'React', 'Multi-Agent', 'Chat UI'],
      highlights: [
        'Multi-agent conversational architecture',
        'Automated research & concept generation',
        'Significant reduction in manual research effort',
      ],
    },
    {
      id: 2,
      title: 'Native iOS Mobile Applications',
      description:
        'iOS apps with custom UI components, image sharing flows, camera/gallery integration, and Bluetooth device connectivity. Tackled advanced rendering, gesture navigation, and sharing workflow challenges.',
      category: 'iOS / Mobile',
      tags: ['Swift', 'UIKit', 'BLE', 'iOS'],
      highlights: [
        'Custom UI components & optimised sharing flows',
        'BLE hardware connectivity & state handling',
        'Advanced gesture navigation & camera integration',
      ],
    },
    {
      id: 3,
      title: 'Enterprise Admin Panel',
      description:
        'Feature-rich admin platform with event management, roles & permissions, forms, notifications, search, analytics, and chatbot support. Scalable reusable component architecture.',
      category: 'Web / Frontend',
      tags: ['ReactJS', 'JavaScript', 'Material UI', 'CSS'],
      highlights: [
        'Event management & roles/permissions modules',
        'Analytics dashboard & notification system',
        'Scalable reusable component architecture',
      ],
    },
    {
      id: 4,
      title: 'Image Carousel & Media Experience',
      description:
        'Dynamic image carousel with skeleton loaders, lazy loading, smooth scrolling, and image download capability. Significantly improved content browsing UX and performance.',
      category: 'Web / Frontend',
      tags: ['ReactJS', 'MUI', 'JavaScript'],
      highlights: [
        'Skeleton loaders & lazy loading for performance',
        'Smooth scrolling & image download support',
        'Enhanced content browsing UX',
      ],
    },
    {
      id: 5,
      title: 'Sports-Tech Innovation Initiatives',
      description:
        'Football-related digital experiences and Progressive Web Apps in collaboration with global Adidas teams, aimed at improving sports engagement and fan experiences.',
      category: 'Sports-Tech',
      tags: ['Web Apps', 'PWA', 'Frontend', 'React'],
      highlights: [
        'Football innovation digital experiences',
        'Progressive Web App architecture',
        'Cross-functional global team collaboration',
      ],
    },
  ],

  // ─── Accomplishments ───────────────────────────────────────────────────────
  accomplishments: [
    {
      id: 1,
      title: 'Quarterly Superstar Award',
      description: 'Recognised for outstanding contribution to engineering and product delivery.',
      icon: '🏆',
    },
    {
      id: 2,
      title: 'AI Innovation Builder',
      description: 'Built next-generation AI systems aligned with enterprise innovation goals.',
      icon: '🤖',
    },
    {
      id: 3,
      title: 'Multi-Domain Delivery',
      description: 'Delivered production-grade mobile and web solutions across multiple domains.',
      icon: '🚀',
    },
    {
      id: 4,
      title: 'Global Collaboration',
      description: 'Collaborated with global stakeholders across business and engineering teams.',
      icon: '🌍',
    },
  ],

  // ─── Education ─────────────────────────────────────────────────────────────
  education: {
    degree: "Bachelor's Degree in Engineering",
    institution: 'Delhi Technological University',
    location: 'Delhi, India',
    year: '2022',
  },

  // ─── Navigation ────────────────────────────────────────────────────────────
  navLinks: [
    { label: 'About',      href: '#about' },
    { label: 'Skills',     href: '#skills' },
    { label: 'Experience', href: '#experience' },
    { label: 'Projects',   href: '#projects' },
    { label: 'Education',  href: '#education' },
  ],
};
