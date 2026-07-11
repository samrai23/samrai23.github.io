/**
 * ResumePDF.tsx — Professional single-page A4 resume.
 *
 * SINGLE PAGE RULE: This document must always fit on one A4 page.
 * If content grows, trim limits at the bottom of this file before
 * adding more sections or increasing font sizes / spacing.
 *
 * NOTE: @react-pdf/renderer uses Helvetica (PDF built-in) which does NOT
 * support Unicode emoji. Every icon here is plain ASCII/text.
 */

import {
  Document,
  Page,
  Text,
  View,
  Link,
  StyleSheet,
} from '@react-pdf/renderer';
import {
  personal as _personal,
  skills as _skills,
  experiences as _experiences,
  projects as _projects,
  education as _education,
  accomplishments as _accomplishments,
} from '@/data/portfolio';
import type { PersonalInfo, SkillCategory, Experience, Project, EducationInfo, Accomplishment } from '@/types';

export interface ResumeData {
  personal: PersonalInfo;
  skills: SkillCategory[];
  experiences: Experience[];
  projects: Project[];
  education: EducationInfo;
  accomplishments: Accomplishment[];
}

export type TemplateId = 'modern' | 'classic' | 'minimal';

// ─── Palette ─────────────────────────────────────────────────────────────────
const C = {
  primary:  '#4F46E5',
  accent:   '#059669',
  text:     '#111827',
  muted:    '#6B7280',
  border:   '#E5E7EB',
  tagBg:    '#EEF2FF',
  tagText:  '#4338CA',
  badgeBg:  '#D1FAE5',
  badgeText:'#065F46',
};

// ─── Styles ───────────────────────────────────────────────────────────────────
const s = StyleSheet.create({
  // Page — comfortable margins, fills full A4
  page: {
    fontFamily: 'Helvetica',
    backgroundColor: '#FFFFFF',
    paddingTop: 20,
    paddingBottom: 28,
    paddingHorizontal: 36,
    fontSize: 9,
    color: C.text,
    lineHeight: 1.5,
  },

  // Header
  header: {
    marginBottom: 10,
    borderBottomWidth: 1.5,
    borderBottomColor: C.primary,
    paddingBottom: 9,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 5,
  },
  name: {
    fontSize: 22,
    fontFamily: 'Helvetica-Bold',
    color: C.text,
    letterSpacing: 0.3,
  },
  titleTagline: {
    textAlign: 'right',
  },
  title: {
    fontSize: 10,
    color: C.primary,
    fontFamily: 'Helvetica-Bold',
    letterSpacing: 0.2,
  },
  tagline: {
    fontSize: 8,
    color: C.muted,
    marginTop: 2,
  },
  contactRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
  },
  contactSep: {
    fontSize: 8,
    color: C.muted,
    marginHorizontal: 6,
  },
  contactItem: {
    fontSize: 8,
    color: C.muted,
  },
  contactLink: {
    fontSize: 8,
    color: C.primary,
    textDecoration: 'none',
  },

  // Two-column body — fills full remaining height
  body: {
    flexDirection: 'row',
    gap: 18,
    flexGrow: 1,
  },
  mainCol: { flex: 70 },
  sideCol: {
    flex: 28,
    borderLeftWidth: 0.75,
    borderLeftColor: C.border,
    paddingLeft: 14,
  },

  // Section
  section: { marginBottom: 11 },
  sectionTitle: {
    fontSize: 8.5,
    fontFamily: 'Helvetica-Bold',
    color: C.primary,
    textTransform: 'uppercase',
    letterSpacing: 1.2,
    marginBottom: 5,
    paddingBottom: 2,
    borderBottomWidth: 0.5,
    borderBottomColor: C.border,
  },

  // Summary
  summary: {
    fontSize: 8.5,
    color: C.text,
    lineHeight: 1.55,
    marginBottom: 11,
    paddingLeft: 7,
    paddingVertical: 3,
    borderLeftWidth: 2.5,
    borderLeftColor: C.primary,
  },

  // Experience
  expEntry: { marginBottom: 8 },
  expHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 2,
  },
  expTitleRow: { flexDirection: 'row', alignItems: 'center' },
  expTitle: {
    fontSize: 9.5,
    fontFamily: 'Helvetica-Bold',
    color: C.text,
  },
  currentBadge: {
    backgroundColor: C.badgeBg,
    color: C.badgeText,
    fontSize: 6.5,
    paddingHorizontal: 4,
    paddingVertical: 1.5,
    borderRadius: 2,
    fontFamily: 'Helvetica-Bold',
    marginLeft: 5,
  },
  expPeriod: {
    fontSize: 8,
    color: C.muted,
    fontFamily: 'Helvetica-Oblique',
  },
  expCompany: {
    fontSize: 8.5,
    color: C.accent,
    marginBottom: 4,
    fontFamily: 'Helvetica-Oblique',
  },

  // Bullets
  bulletRow: { flexDirection: 'row', marginBottom: 2.5 },
  bullet: { fontSize: 8.5, color: C.muted, marginRight: 4, marginTop: 1 },
  bulletText: { fontSize: 8.5, color: C.text, flex: 1, lineHeight: 1.45 },

  // Tags
  tagsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 4, marginTop: 4 },
  tag: {
    backgroundColor: C.tagBg,
    paddingHorizontal: 5,
    paddingVertical: 2,
    borderRadius: 3,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  tagLabel: {
    color: C.tagText,
    fontSize: 7.5,
    fontFamily: 'Helvetica-Bold',
    lineHeight: 1,
  },

  // Projects
  projEntry: { marginBottom: 7 },
  projHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 3,
  },
  projTitle: {
    fontSize: 9,
    fontFamily: 'Helvetica-Bold',
    color: C.text,
  },
  projCategory: {
    fontSize: 8,
    color: C.accent,
    fontFamily: 'Helvetica-Oblique',
  },

  // Sidebar — Skills
  skillGroup: { marginBottom: 6 },
  skillGroupTitle: {
    fontSize: 8,
    fontFamily: 'Helvetica-Bold',
    color: C.text,
    marginBottom: 2,
  },
  skillItems: { fontSize: 8, color: C.muted, lineHeight: 1.5 },

  // Sidebar — Education
  eduDegree: {
    fontSize: 8.5,
    fontFamily: 'Helvetica-Bold',
    color: C.text,
    marginBottom: 2,
  },
  eduInstitution: {
    fontSize: 8,
    color: C.accent,
    fontFamily: 'Helvetica-Oblique',
    marginBottom: 2,
  },
  eduMeta: { fontSize: 8, color: C.muted },

  // Sidebar — Accomplishments
  accomplishRow: { flexDirection: 'row', marginBottom: 5 },
  accomplishDot: {
    fontSize: 9,
    color: C.primary,
    marginRight: 5,
    marginTop: 1,
  },
  accomplishContent: { flex: 1 },
  accomplishTitle: {
    fontSize: 8,
    fontFamily: 'Helvetica-Bold',
    color: C.text,
    marginBottom: 2,
  },
  accomplishDesc: { fontSize: 7.5, color: C.muted, lineHeight: 1.45 },
});

// ─── Helpers ─────────────────────────────────────────────────────────────────
function BulletList({ items }: { items: string[] }) {
  return (
    <>
      {items.map((item, i) => (
        <View key={i} style={s.bulletRow}>
          <Text style={s.bullet}>-</Text>
          <Text style={s.bulletText}>{item}</Text>
        </View>
      ))}
    </>
  );
}

function ContactSeparator() {
  return <Text style={s.contactSep}>|</Text>;
}

// ─── Document ─────────────────────────────────────────────────────────────────
function ModernResumePDF({ data }: { data?: ResumeData }) {
  // Use override data if supplied, otherwise fall back to portfolio defaults.
  // Original portfolio data is never mutated.
  const personal        = data?.personal        ?? _personal;
  const skills          = data?.skills          ?? _skills;
  const experiences     = data?.experiences     ?? _experiences;
  const projects        = data?.projects        ?? _projects;
  const education       = data?.education       ?? _education;
  const accomplishments = data?.accomplishments ?? _accomplishments;

  const sidebarSkills = skills.filter((sk) => sk.category !== 'Soft Skills');

  const hasLinkedin = personal.linkedin && personal.linkedin !== '#';
  const hasGithub   = personal.github   && personal.github   !== '#';

  return (
    <Document
      title={`${personal.name} — Resume`}
      author={personal.name}
      subject="Software Engineer Resume"
      creator="Portfolio"
    >
      <Page size="A4" style={s.page}>

        {/* ── Header ── */}
        <View style={s.header}>
          <View style={s.headerTop}>
            <Text style={s.name}>{personal.name}</Text>
            <View style={s.titleTagline}>
              <Text style={s.title}>{personal.title}</Text>
              {personal.tagline ? <Text style={s.tagline}>{personal.tagline}</Text> : null}
            </View>
          </View>

          <View style={s.contactRow}>
            {personal.location && (
              <Text style={s.contactItem}>{personal.location}</Text>
            )}
            {personal.email && (
              <>
                <ContactSeparator />
                <Link src={`mailto:${personal.email}`} style={s.contactLink}>
                  {personal.email}
                </Link>
              </>
            )}
            {personal.phone && (
              <>
                <ContactSeparator />
                <Text style={s.contactItem}>{personal.phone}</Text>
              </>
            )}
            {hasLinkedin && (
              <>
                <ContactSeparator />
                <Link src={personal.linkedin} style={s.contactLink}>LinkedIn</Link>
              </>
            )}
            {hasGithub && (
              <>
                <ContactSeparator />
                <Link src={personal.github} style={s.contactLink}>GitHub</Link>
              </>
            )}
          </View>
        </View>

        {personal.summary && (
          <Text style={s.summary}>{personal.summary}</Text>
        )}

        {/* ── Two-column body — flows across pages as needed ── */}
        <View style={s.body}>

          {/* ════ Main column (62%) ════ */}
          <View style={s.mainCol}>

            {/* Work Experience */}
            <View style={s.section}>
              <Text style={s.sectionTitle}>Work Experience</Text>
              {experiences.map((exp) => (
                <View key={exp.id} style={s.expEntry}>
                  <View style={s.expHeader}>
                    <View style={s.expTitleRow}>
                      <Text style={s.expTitle}>{exp.title}</Text>
                      {exp.current && <Text style={s.currentBadge}>CURRENT</Text>}
                    </View>
                    <Text style={s.expPeriod}>{exp.period}</Text>
                  </View>
                  <Text style={s.expCompany}>{exp.company}</Text>
                  <BulletList items={exp.highlights} />
                  {exp.tags.length > 0 && (
                    <View style={s.tagsRow}>
                      {exp.tags.map((tag) => (
                        <View key={tag} style={s.tag}>
                          <Text style={s.tagLabel}>{tag}</Text>
                        </View>
                      ))}
                    </View>
                  )}
                </View>
              ))}
            </View>

            {/* Key Projects */}
            <View style={s.section}>
              <Text style={s.sectionTitle}>Key Projects</Text>
              {projects.map((proj) => (
                <View key={proj.id} style={s.projEntry}>
                  <View style={s.projHeader}>
                    <Text style={s.projTitle}>{proj.title}</Text>
                    <Text style={s.projCategory}>{proj.category}</Text>
                  </View>
                  <BulletList items={proj.highlights} />
                  {proj.tags.length > 0 && (
                    <View style={s.tagsRow}>
                      {proj.tags.map((tag) => (
                        <View key={tag} style={s.tag}>
                          <Text style={s.tagLabel}>{tag}</Text>
                        </View>
                      ))}
                    </View>
                  )}
                </View>
              ))}
            </View>

          </View>
          {/* ════ End main column ════ */}

          {/* ════ Sidebar (36%) ════ */}
          <View style={s.sideCol}>

            {/* Skills */}
            <View style={s.section}>
              <Text style={s.sectionTitle}>Skills</Text>
              {sidebarSkills.map((cat) => (
                <View key={cat.category} style={s.skillGroup}>
                  <Text style={s.skillGroupTitle}>{cat.category}</Text>
                  <Text style={s.skillItems}>{cat.items.join(' · ')}</Text>
                </View>
              ))}
            </View>

            {/* Education */}
            <View style={s.section}>
              <Text style={s.sectionTitle}>Education</Text>
              <Text style={s.eduDegree}>{education.degree}</Text>
              <Text style={s.eduInstitution}>{education.institution}</Text>
              <Text style={s.eduMeta}>{education.location} · {education.year}</Text>
            </View>

            {/* Accomplishments */}
            <View style={s.section}>
              <Text style={s.sectionTitle}>Accomplishments</Text>
              {accomplishments.map((acc) => (
                <View key={acc.id} style={s.accomplishRow}>
                  <Text style={s.accomplishDot}>*</Text>
                  <View style={s.accomplishContent}>
                    <Text style={s.accomplishTitle}>{acc.title}</Text>
                    <Text style={s.accomplishDesc}>{acc.description}</Text>
                  </View>
                </View>
              ))}
            </View>

          </View>
          {/* ════ End sidebar ════ */}

        </View>
      </Page>
    </Document>
  );
}

// ─── Classic Template ─────────────────────────────────────────────────────────
// Single-column, centered header with flanking lines — Darshika-style
const CC = {
  text:    '#1C1C2E',
  muted:   '#55556A',
  accent:  '#2C4A7C',
  line:    '#9999AA',
  bg:      '#FFFFFF',
  tagBg:   '#EEF0F8',
  tagText: '#2C4A7C',
};

const cs = StyleSheet.create({
  page: {
    fontFamily: 'Helvetica',
    backgroundColor: CC.bg,
    paddingTop: 22,
    paddingBottom: 22,
    paddingHorizontal: 40,
    fontSize: 9,
    color: CC.text,
    lineHeight: 1.45,
  },
  headerTopLine: { height: 2, backgroundColor: CC.accent, marginBottom: 7 },
  headerBottomLine: { height: 1, backgroundColor: CC.accent, marginTop: 6, marginBottom: 10 },
  name: {
    fontSize: 22,
    fontFamily: 'Helvetica-Bold',
    color: CC.text,
    textAlign: 'center',
    letterSpacing: 1,
    marginBottom: 5,
  },
  contactRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignItems: 'center',
  },
  contactItem: { fontSize: 8, color: CC.muted },
  contactSep: { fontSize: 8, color: CC.accent, marginHorizontal: 4 },
  contactLink: { fontSize: 8, color: CC.accent, textDecoration: 'none' },
  section: { marginBottom: 9 },
  sectionTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 7,
  },
  sectionLine: { flex: 1, height: 0.75, backgroundColor: CC.line },
  sectionTitle: {
    fontSize: 8.5,
    fontFamily: 'Helvetica-Bold',
    color: CC.text,
    letterSpacing: 1.2,
    marginHorizontal: 10,
  },
  summary: { fontSize: 8.5, color: CC.text, lineHeight: 1.55 },
  skillsGrid: { flexDirection: 'row', flexWrap: 'wrap' },
  skillCell: { width: '50%', paddingRight: 10, marginBottom: 4 },
  skillCellText: { fontSize: 8.5, color: CC.text, lineHeight: 1.4 },
  skillBold: { fontFamily: 'Helvetica-Bold' },
  expEntry: { marginBottom: 9 },
  expHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 1,
  },
  expTitle: { fontSize: 9.5, fontFamily: 'Helvetica-Bold', color: CC.text },
  expPeriod: { fontSize: 8, color: CC.muted, fontFamily: 'Helvetica-Oblique' },
  expCompany: {
    fontSize: 8.5,
    fontFamily: 'Helvetica-Bold',
    color: CC.accent,
    marginBottom: 3,
  },
  bulletRow: { flexDirection: 'row', marginBottom: 2.5 },
  bullet: { fontSize: 8.5, color: CC.accent, marginRight: 4 },
  bulletText: { fontSize: 8.5, color: CC.text, flex: 1, lineHeight: 1.45 },
  tagsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 4, marginTop: 4 },
  tag: {
    backgroundColor: CC.tagBg,
    paddingHorizontal: 5,
    paddingVertical: 1.5,
    borderRadius: 2,
  },
  tagLabel: { fontSize: 7, color: CC.tagText, fontFamily: 'Helvetica-Bold' },
  projEntry: { marginBottom: 8 },
  projHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 2,
  },
  projTitle: { fontSize: 9, fontFamily: 'Helvetica-Bold', color: CC.text },
  projCategory: { fontSize: 8, color: CC.accent, fontFamily: 'Helvetica-Oblique' },
  eduDegree: { fontSize: 9, fontFamily: 'Helvetica-Bold', color: CC.text, marginBottom: 1 },
  eduInstitution: { fontSize: 8.5, fontFamily: 'Helvetica-Oblique', color: CC.accent, marginBottom: 1 },
  eduMeta: { fontSize: 8, color: CC.muted },
  accompEntry: { flexDirection: 'row', marginBottom: 5 },
  accompBullet: { fontSize: 8.5, color: CC.accent, marginRight: 5 },
  accompContent: { flex: 1 },
  accompTitle: { fontSize: 8.5, fontFamily: 'Helvetica-Bold', color: CC.text, marginBottom: 1 },
  accompDesc: { fontSize: 8, color: CC.muted, lineHeight: 1.4 },
});

function ClassicSectionTitle({ title }: { title: string }) {
  return (
    <View style={cs.sectionTitleRow}>
      <View style={cs.sectionLine} />
      <Text style={cs.sectionTitle}>{title.toUpperCase()}</Text>
      <View style={cs.sectionLine} />
    </View>
  );
}

function ClassicResumePDF({ data }: { data?: ResumeData }) {
  const personal        = data?.personal        ?? _personal;
  const skills          = data?.skills          ?? _skills;
  const experiences     = data?.experiences     ?? _experiences;
  const projects        = data?.projects        ?? _projects;
  const education       = data?.education       ?? _education;
  const accomplishments = data?.accomplishments ?? _accomplishments;

  const hasLinkedin = personal.linkedin && personal.linkedin !== '#';
  const hasGithub   = personal.github   && personal.github   !== '#';

  return (
    <Document title={`${personal.name} — Resume`} author={personal.name}>
      <Page size="A4" style={cs.page}>

        {/* Header */}
        <View>
          <View style={cs.headerTopLine} />
          <Text style={cs.name}>{personal.name}</Text>
          <View style={cs.contactRow}>
            {personal.location && <Text style={cs.contactItem}>{personal.location}</Text>}
            {personal.phone && (
              <><Text style={cs.contactSep}> ◆ </Text><Text style={cs.contactItem}>{personal.phone}</Text></>
            )}
            {personal.email && (
              <><Text style={cs.contactSep}> ◆ </Text><Link src={`mailto:${personal.email}`} style={cs.contactLink}>{personal.email}</Link></>
            )}
            {hasLinkedin && (
              <><Text style={cs.contactSep}> ◆ </Text><Link src={personal.linkedin} style={cs.contactLink}>{personal.linkedin.replace(/^https?:\/\//, '')}</Link></>
            )}
            {hasGithub && (
              <><Text style={cs.contactSep}> ◆ </Text><Link src={personal.github} style={cs.contactLink}>{personal.github.replace(/^https?:\/\//, '')}</Link></>
            )}
          </View>
          <View style={cs.headerBottomLine} />
        </View>

        {/* Professional Summary */}
        {personal.summary && (
          <View style={cs.section}>
            <ClassicSectionTitle title="Professional Summary" />
            <Text style={cs.summary}>{personal.summary}</Text>
          </View>
        )}

        {/* Skills */}
        {skills.length > 0 && (
          <View style={cs.section}>
            <ClassicSectionTitle title="Skills" />
            <View style={cs.skillsGrid}>
              {skills.map((sk) => (
                <View key={sk.category} style={cs.skillCell}>
                  <Text style={cs.skillCellText}>
                    <Text style={cs.skillBold}>{sk.category}: </Text>
                    {sk.items.join(', ')}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Experience */}
        {experiences.length > 0 && (
          <View style={cs.section}>
            <ClassicSectionTitle title="Experience" />
            {experiences.map((exp) => (
              <View key={exp.id} style={cs.expEntry}>
                <View style={cs.expHeader}>
                  <Text style={cs.expTitle}>{exp.title}</Text>
                  <Text style={cs.expPeriod}>{exp.period}</Text>
                </View>
                <Text style={cs.expCompany}>{exp.company}</Text>
                {exp.highlights.map((h, i) => (
                  <View key={i} style={cs.bulletRow}>
                    <Text style={cs.bullet}>•</Text>
                    <Text style={cs.bulletText}>{h}</Text>
                  </View>
                ))}
                {exp.tags.length > 0 && (
                  <View style={cs.tagsRow}>
                    {exp.tags.map((tag) => (
                      <View key={tag} style={cs.tag}>
                        <Text style={cs.tagLabel}>{tag}</Text>
                      </View>
                    ))}
                  </View>
                )}
              </View>
            ))}
          </View>
        )}

        {/* Key Projects */}
        {projects.length > 0 && (
          <View style={cs.section}>
            <ClassicSectionTitle title="Key Projects" />
            {projects.map((proj) => (
              <View key={proj.id} style={cs.projEntry}>
                <View style={cs.projHeader}>
                  <Text style={cs.projTitle}>{proj.title}</Text>
                  <Text style={cs.projCategory}>{proj.category}</Text>
                </View>
                {proj.highlights.map((h, i) => (
                  <View key={i} style={cs.bulletRow}>
                    <Text style={cs.bullet}>•</Text>
                    <Text style={cs.bulletText}>{h}</Text>
                  </View>
                ))}
                {proj.tags.length > 0 && (
                  <View style={cs.tagsRow}>
                    {proj.tags.map((tag) => (
                      <View key={tag} style={cs.tag}>
                        <Text style={cs.tagLabel}>{tag}</Text>
                      </View>
                    ))}
                  </View>
                )}
              </View>
            ))}
          </View>
        )}

        {/* Education */}
        <View style={cs.section}>
          <ClassicSectionTitle title="Education" />
          <Text style={cs.eduDegree}>{education.degree}</Text>
          <Text style={cs.eduInstitution}>{education.institution}</Text>
          <Text style={cs.eduMeta}>{education.location} · {education.year}</Text>
        </View>

        {/* Achievements */}
        {accomplishments.length > 0 && (
          <View style={cs.section}>
            <ClassicSectionTitle title="Achievements" />
            {accomplishments.map((acc) => (
              <View key={acc.id} style={cs.accompEntry}>
                <Text style={cs.accompBullet}>•</Text>
                <View style={cs.accompContent}>
                  <Text style={cs.accompTitle}>{acc.title}</Text>
                  {acc.description ? <Text style={cs.accompDesc}>{acc.description}</Text> : null}
                </View>
              </View>
            ))}
          </View>
        )}

      </Page>
    </Document>
  );
}

// ─── Minimal Template ─────────────────────────────────────────────────────────
// Single-column, bold section headers with underline — Edwin-style
const MC = {
  text:  '#000000',
  muted: '#444444',
  bg:    '#FFFFFF',
};

const ms = StyleSheet.create({
  page: {
    fontFamily: 'Helvetica',
    backgroundColor: MC.bg,
    paddingTop: 22,
    paddingBottom: 22,
    paddingHorizontal: 36,
    fontSize: 9,
    color: MC.text,
    lineHeight: 1.45,
  },
  name: {
    fontSize: 22,
    fontFamily: 'Helvetica-Bold',
    color: MC.text,
    textAlign: 'center',
    marginBottom: 5,
  },
  contactRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  contactItem: { fontSize: 8, color: MC.muted },
  contactSep: { fontSize: 8, color: MC.muted, marginHorizontal: 4 },
  contactLink: { fontSize: 8, color: MC.text, textDecoration: 'underline' },
  section: { marginBottom: 9 },
  sectionHeader: {
    borderBottomWidth: 1,
    borderBottomColor: MC.text,
    paddingBottom: 2,
    marginBottom: 5,
  },
  sectionTitle: {
    fontSize: 9,
    fontFamily: 'Helvetica-Bold',
    color: MC.text,
    letterSpacing: 0.3,
  },
  expEntry: { marginBottom: 9 },
  expTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  expCompanyBold: { fontSize: 9.5, fontFamily: 'Helvetica-Bold', color: MC.text },
  expPeriodRight: { fontSize: 8.5, fontFamily: 'Helvetica-Bold', color: MC.text },
  expBottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 3,
  },
  expRole: { fontSize: 8.5, fontFamily: 'Helvetica-Oblique', color: MC.muted },
  expLocation: { fontSize: 8.5, fontFamily: 'Helvetica-Oblique', color: MC.muted },
  bulletRow: { flexDirection: 'row', marginBottom: 2.5 },
  bullet: { fontSize: 8.5, color: MC.muted, marginRight: 5 },
  bulletText: { fontSize: 8.5, color: MC.text, flex: 1, lineHeight: 1.45 },
  skillRow: { flexDirection: 'row', marginBottom: 3 },
  skillLabel: {
    fontSize: 8.5,
    fontFamily: 'Helvetica-Bold',
    color: MC.text,
    width: 100,
    flexShrink: 0,
  },
  skillItems: { fontSize: 8.5, color: MC.muted, flex: 1 },
  projEntry: { marginBottom: 7 },
  projHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 2,
    flexWrap: 'wrap',
  },
  projName: { fontSize: 9, fontFamily: 'Helvetica-Bold', color: MC.text },
  projTech: { fontSize: 8, fontFamily: 'Helvetica-Oblique', color: MC.muted },
  eduTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 1,
  },
  eduInstitution: { fontSize: 9, fontFamily: 'Helvetica-Bold', color: MC.text },
  eduDates: { fontSize: 8.5, color: MC.text },
  eduDegRow: { flexDirection: 'row', justifyContent: 'space-between' },
  eduDegree: { fontSize: 8.5, fontFamily: 'Helvetica-Oblique', color: MC.muted },
  eduLocation: { fontSize: 8.5, fontFamily: 'Helvetica-Oblique', color: MC.muted },
  accompEntry: { flexDirection: 'row', marginBottom: 5 },
  accompBullet: { fontSize: 8.5, color: MC.muted, marginRight: 5 },
  accompContent: { flex: 1 },
  accompTitle: { fontSize: 8.5, fontFamily: 'Helvetica-Bold', color: MC.text, marginBottom: 1 },
  accompDesc: { fontSize: 8, color: MC.muted, lineHeight: 1.4 },
});

function MinimalResumePDF({ data }: { data?: ResumeData }) {
  const personal        = data?.personal        ?? _personal;
  const skills          = data?.skills          ?? _skills;
  const experiences     = data?.experiences     ?? _experiences;
  const projects        = data?.projects        ?? _projects;
  const education       = data?.education       ?? _education;
  const accomplishments = data?.accomplishments ?? _accomplishments;

  const hasLinkedin = personal.linkedin && personal.linkedin !== '#';
  const hasGithub   = personal.github   && personal.github   !== '#';

  return (
    <Document title={`${personal.name} — Resume`} author={personal.name}>
      <Page size="A4" style={ms.page}>

        {/* Header */}
        <Text style={ms.name}>{personal.name}</Text>
        <View style={ms.contactRow}>
          {personal.phone && <Text style={ms.contactItem}>{personal.phone}</Text>}
          {personal.email && (
            <><Text style={ms.contactSep}>#</Text><Link src={`mailto:${personal.email}`} style={ms.contactLink}>{personal.email}</Link></>
          )}
          {hasLinkedin && (
            <><Text style={ms.contactSep}>|</Text><Link src={personal.linkedin} style={ms.contactLink}>{personal.linkedin.replace(/^https?:\/\//, '')}</Link></>
          )}
          {hasGithub && (
            <><Text style={ms.contactSep}>|</Text><Link src={personal.github} style={ms.contactLink}>{personal.github.replace(/^https?:\/\//, '')}</Link></>
          )}
        </View>

        {/* Work Experience */}
        {experiences.length > 0 && (
          <View style={ms.section}>
            <View style={ms.sectionHeader}>
              <Text style={ms.sectionTitle}>WORK EXPERIENCE</Text>
            </View>
            {experiences.map((exp) => (
              <View key={exp.id} style={ms.expEntry}>
                <View style={ms.expTopRow}>
                  <Text style={ms.expCompanyBold}>{exp.company}</Text>
                  <Text style={ms.expPeriodRight}>{exp.period}</Text>
                </View>
                <View style={ms.expBottomRow}>
                  <Text style={ms.expRole}>{exp.title}</Text>
                  {personal.location && <Text style={ms.expLocation}>{personal.location}</Text>}
                </View>
                {exp.highlights.map((h, i) => (
                  <View key={i} style={ms.bulletRow}>
                    <Text style={ms.bullet}>•</Text>
                    <Text style={ms.bulletText}>{h}</Text>
                  </View>
                ))}
              </View>
            ))}
          </View>
        )}

        {/* Skills */}
        {skills.length > 0 && (
          <View style={ms.section}>
            <View style={ms.sectionHeader}>
              <Text style={ms.sectionTitle}>SKILLS</Text>
            </View>
            {skills.map((sk) => (
              <View key={sk.category} style={ms.skillRow}>
                <Text style={ms.skillLabel}>{sk.category}:</Text>
                <Text style={ms.skillItems}>{sk.items.join(', ')}</Text>
              </View>
            ))}
          </View>
        )}

        {/* Projects */}
        {projects.length > 0 && (
          <View style={ms.section}>
            <View style={ms.sectionHeader}>
              <Text style={ms.sectionTitle}>PROJECTS</Text>
            </View>
            {projects.map((proj) => (
              <View key={proj.id} style={ms.projEntry}>
                <View style={ms.projHeader}>
                  <Text style={ms.projName}>{proj.title}</Text>
                  {proj.category ? <Text style={ms.projTech}> | {proj.category}</Text> : null}
                </View>
                {proj.highlights.map((h, i) => (
                  <View key={i} style={ms.bulletRow}>
                    <Text style={ms.bullet}>•</Text>
                    <Text style={ms.bulletText}>{h}</Text>
                  </View>
                ))}
              </View>
            ))}
          </View>
        )}

        {/* Education */}
        <View style={ms.section}>
          <View style={ms.sectionHeader}>
            <Text style={ms.sectionTitle}>EDUCATION</Text>
          </View>
          <View style={ms.eduTopRow}>
            <Text style={ms.eduInstitution}>{education.institution}</Text>
            <Text style={ms.eduDates}>{education.year}</Text>
          </View>
          <View style={ms.eduDegRow}>
            <Text style={ms.eduDegree}>{education.degree}</Text>
            <Text style={ms.eduLocation}>{education.location}</Text>
          </View>
        </View>

        {/* Achievements */}
        {accomplishments.length > 0 && (
          <View style={ms.section}>
            <View style={ms.sectionHeader}>
              <Text style={ms.sectionTitle}>ACHIEVEMENTS</Text>
            </View>
            {accomplishments.map((acc) => (
              <View key={acc.id} style={ms.accompEntry}>
                <Text style={ms.accompBullet}>•</Text>
                <View style={ms.accompContent}>
                  <Text style={ms.accompTitle}>{acc.title}</Text>
                  {acc.description ? <Text style={ms.accompDesc}>{acc.description}</Text> : null}
                </View>
              </View>
            ))}
          </View>
        )}

      </Page>
    </Document>
  );
}

// ─── Routing default export ───────────────────────────────────────────────────
export default function ResumePDF({
  data,
  template = 'modern',
}: {
  data?: ResumeData;
  template?: TemplateId;
}) {
  if (template === 'classic') return <ClassicResumePDF data={data} />;
  if (template === 'minimal') return <MinimalResumePDF data={data} />;
  return <ModernResumePDF data={data} />;
}

