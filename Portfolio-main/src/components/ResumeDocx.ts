/**
 * ResumeDocx.ts — DOCX generator mirroring the three PDF templates.
 *
 * Exports:
 *   downloadDocx(data, template, filename) → Promise<void>
 *
 * Templates:
 *   modern  — two-column (sidebar) layout, indigo primary colour
 *   classic — single-column, centered header, flanked section rules
 *   minimal — single-column, black bold underlined section headers
 */

import {
  AlignmentType,
  BorderStyle,
  Document,
  ExternalHyperlink,
  LevelFormat,
  Packer,
  Paragraph,
  Table,
  TableCell,
  TableRow,
  TextRun,
  WidthType,
  convertInchesToTwip,
} from 'docx';

import type { ResumeData, TemplateId } from './ResumePDF';

// ── Tiny utilities ─────────────────────────────────────────────────────────────
/** Font size in half-points (9pt → 18). */
const hp = (pt: number) => Math.round(pt * 2);
/** Paragraph spacing in twips (1pt = 20 twips). */
const tw = (pt: number) => Math.round(pt * 20);
const inch = (i: number) => convertInchesToTwip(i);

const NO_BORDER = { style: BorderStyle.NONE, size: 0, color: 'auto' } as const;

const CELL_NO_BORDER = {
  top: NO_BORDER, bottom: NO_BORDER,
  left: NO_BORDER, right: NO_BORDER,
};

const TABLE_NO_BORDER = {
  ...CELL_NO_BORDER,
  insideHorizontal: NO_BORDER,
  insideVertical: NO_BORDER,
};

function link(text: string, href: string, size: number, color: string): ExternalHyperlink {
  return new ExternalHyperlink({
    link: href,
    children: [new TextRun({ text, size, color })],
  });
}

// ═══════════════════════════════════════════════════════════════════════════════
// ── MODERN TEMPLATE ────────────────────────────────────────────────────────────
// Two-column layout: main (62 %) + sidebar (38 %)
// Colours: primary #4F46E5, accent #059669, text #111827, muted #6B7280
// ═══════════════════════════════════════════════════════════════════════════════
const MOD = {
  primary: '4F46E5', accent: '059669',
  text: '111827', muted: '6B7280',
  border: 'E5E7EB', tagText: '4338CA',
  current: '065F46',
};

function buildModernDoc(data: ResumeData): Document {
  const { personal, skills, experiences, projects, education, accomplishments } = data;
  const hasLinkedin = personal.linkedin && personal.linkedin !== '#';
  const hasGithub   = personal.github   && personal.github   !== '#';
  const sidebarSkills = skills.filter(sk => sk.category !== 'Soft Skills');
  const BULLET = 'mod-bullet';

  const modSection = (title: string): Paragraph =>
    new Paragraph({
      children: [
        new TextRun({ text: title.toUpperCase(), bold: true, size: hp(8.5), color: MOD.primary }),
      ],
      border: { bottom: { style: BorderStyle.SINGLE, size: 2, color: MOD.border } },
      spacing: { before: tw(6), after: tw(4) },
    });

  // ── Contact row ──
  const contactChildren: (TextRun | ExternalHyperlink)[] = [];
  const sep = () => new TextRun({ text: '  |  ', size: hp(8), color: MOD.muted });
  const addSep = () => { if (contactChildren.length) contactChildren.push(sep()); };

  if (personal.location) contactChildren.push(new TextRun({ text: personal.location, size: hp(8), color: MOD.muted }));
  if (personal.email)    { addSep(); contactChildren.push(link(personal.email, `mailto:${personal.email}`, hp(8), MOD.primary)); }
  if (personal.phone)    { addSep(); contactChildren.push(new TextRun({ text: personal.phone, size: hp(8), color: MOD.muted })); }
  if (hasLinkedin)       { addSep(); contactChildren.push(link('LinkedIn', personal.linkedin, hp(8), MOD.primary)); }
  if (hasGithub)         { addSep(); contactChildren.push(link('GitHub', personal.github, hp(8), MOD.primary)); }

  // ── Header paragraphs ──
  const header: (Paragraph | Table)[] = [
    new Paragraph({
      children: [
        new TextRun({ text: personal.name, bold: true, size: hp(22), color: MOD.text }),
        new TextRun({ text: '    ', size: hp(22) }),
        new TextRun({ text: personal.title, bold: true, size: hp(10), color: MOD.primary }),
        ...(personal.tagline
          ? [new TextRun({ text: `  —  ${personal.tagline}`, size: hp(8), color: MOD.muted })]
          : []),
      ],
      border: { bottom: { style: BorderStyle.THICK, size: 8, color: MOD.primary } },
      spacing: { after: tw(4) },
    }),
    new Paragraph({ children: contactChildren, spacing: { after: tw(6) } }),
    ...(personal.summary
      ? [new Paragraph({
          children: [new TextRun({ text: personal.summary, size: hp(8.5), color: MOD.text })],
          border: { left: { style: BorderStyle.THICK, size: 14, color: MOD.primary, space: 4 } },
          indent: { left: inch(0.08) },
          spacing: { after: tw(8) },
        })]
      : []),
  ];

  // ── Main column ──
  const mainCol: Paragraph[] = [modSection('Work Experience')];

  for (const exp of experiences) {
    mainCol.push(
      new Paragraph({
        children: [
          new TextRun({ text: exp.title, bold: true, size: hp(9.5), color: MOD.text }),
          ...(exp.current ? [new TextRun({ text: ' [CURRENT]', bold: true, size: hp(6.5), color: MOD.current })] : []),
          new TextRun({ text: '   ' }),
          new TextRun({ text: exp.period, italics: true, size: hp(8), color: MOD.muted }),
        ],
        spacing: { after: tw(1) },
      }),
      new Paragraph({
        children: [new TextRun({ text: exp.company, italics: true, size: hp(8.5), color: MOD.accent })],
        spacing: { after: tw(2) },
      }),
    );
    exp.highlights.forEach(h =>
      mainCol.push(new Paragraph({
        children: [new TextRun({ text: h, size: hp(8.5), color: MOD.text })],
        numbering: { reference: BULLET, level: 0 },
        spacing: { after: tw(1) },
      })),
    );
    if (exp.tags.length > 0) {
      mainCol.push(new Paragraph({
        children: exp.tags.map((t, i) =>
          new TextRun({ text: (i ? '  ·  ' : '') + t, size: hp(7.5), color: MOD.tagText, bold: true }),
        ),
        spacing: { after: tw(6) },
      }));
    }
  }

  mainCol.push(modSection('Key Projects'));

  for (const proj of projects) {
    mainCol.push(new Paragraph({
      children: [
        new TextRun({ text: proj.title, bold: true, size: hp(9), color: MOD.text }),
        new TextRun({ text: '   ' }),
        new TextRun({ text: proj.category, italics: true, size: hp(8), color: MOD.accent }),
      ],
      spacing: { after: tw(2) },
    }));
    proj.highlights.forEach(h =>
      mainCol.push(new Paragraph({
        children: [new TextRun({ text: h, size: hp(8.5), color: MOD.text })],
        numbering: { reference: BULLET, level: 0 },
        spacing: { after: tw(1) },
      })),
    );
    if (proj.tags.length > 0) {
      mainCol.push(new Paragraph({
        children: proj.tags.map((t, i) =>
          new TextRun({ text: (i ? '  ·  ' : '') + t, size: hp(7.5), color: MOD.tagText, bold: true }),
        ),
        spacing: { after: tw(6) },
      }));
    }
  }

  // ── Sidebar column ──
  const sideCol: Paragraph[] = [modSection('Skills')];

  for (const sk of sidebarSkills) {
    sideCol.push(
      new Paragraph({ children: [new TextRun({ text: sk.category, bold: true, size: hp(8), color: MOD.text })], spacing: { after: tw(1) } }),
      new Paragraph({ children: [new TextRun({ text: sk.items.join(' · '), size: hp(8), color: MOD.muted })], spacing: { after: tw(4) } }),
    );
  }

  sideCol.push(
    modSection('Education'),
    new Paragraph({ children: [new TextRun({ text: education.degree, bold: true, size: hp(8.5), color: MOD.text })], spacing: { after: tw(1) } }),
    new Paragraph({ children: [new TextRun({ text: education.institution, italics: true, size: hp(8), color: MOD.accent })], spacing: { after: tw(1) } }),
    new Paragraph({ children: [new TextRun({ text: `${education.location} · ${education.year}`, size: hp(8), color: MOD.muted })], spacing: { after: tw(5) } }),
    modSection('Accomplishments'),
  );

  for (const acc of accomplishments) {
    sideCol.push(new Paragraph({ children: [new TextRun({ text: acc.title, bold: true, size: hp(8), color: MOD.text })], spacing: { after: tw(1) } }));
    if (acc.description) {
      sideCol.push(new Paragraph({ children: [new TextRun({ text: acc.description, size: hp(7.5), color: MOD.muted })], spacing: { after: tw(4) } }));
    }
  }

  // ── Two-column table ──
  const bodyTable = new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    borders: TABLE_NO_BORDER,
    rows: [
      new TableRow({
        children: [
          new TableCell({
            width: { size: 62, type: WidthType.PERCENTAGE },
            borders: CELL_NO_BORDER,
            children: mainCol,
          }),
          new TableCell({
            width: { size: 38, type: WidthType.PERCENTAGE },
            borders: {
              ...CELL_NO_BORDER,
              left: { style: BorderStyle.SINGLE, size: 4, color: MOD.border },
            },
            margins: { left: inch(0.1) },
            children: sideCol,
          }),
        ],
      }),
    ],
  });

  return new Document({
    numbering: {
      config: [{
        reference: BULLET,
        levels: [{
          level: 0,
          format: LevelFormat.BULLET,
          text: '-',
          alignment: AlignmentType.LEFT,
          style: {
            paragraph: { indent: { left: inch(0.2), hanging: inch(0.1) } },
          },
        }],
      }],
    },
    sections: [{
      properties: {
        page: { margin: { top: inch(0.5), bottom: inch(0.5), left: inch(0.6), right: inch(0.6) } },
      },
      children: [...header, bodyTable],
    }],
  });
}

// ═══════════════════════════════════════════════════════════════════════════════
// ── CLASSIC TEMPLATE ───────────────────────────────────────────────────────────
// Single-column, centered header with top/bottom accent rules.
// Section titles: centered bold with top + bottom border (flanked line effect).
// Colours: text #1C1C2E, accent #2C4A7C, muted #55556A
// ═══════════════════════════════════════════════════════════════════════════════
const CL = {
  text: '1C1C2E', muted: '55556A', accent: '2C4A7C', line: '9999AA',
};

function buildClassicDoc(data: ResumeData): Document {
  const { personal, skills, experiences, projects, education, accomplishments } = data;
  const hasLinkedin = personal.linkedin && personal.linkedin !== '#';
  const hasGithub   = personal.github   && personal.github   !== '#';
  const BULLET = 'cls-bullet';

  const clSection = (title: string): Paragraph =>
    new Paragraph({
      children: [new TextRun({ text: title.toUpperCase(), bold: true, size: hp(8.5), color: CL.accent })],
      alignment: AlignmentType.CENTER,
      border: {
        top:    { style: BorderStyle.SINGLE, size: 4, color: CL.line },
        bottom: { style: BorderStyle.SINGLE, size: 4, color: CL.line },
      },
      spacing: { before: tw(8), after: tw(5), line: 400 },
    });

  // ── Contact row ──
  const contactParts: (TextRun | ExternalHyperlink)[] = [];
  const diamond = () => new TextRun({ text: '  ◆  ', size: hp(8), color: CL.accent });
  const addDiamond = () => { if (contactParts.length) contactParts.push(diamond()); };

  if (personal.location) contactParts.push(new TextRun({ text: personal.location, size: hp(8), color: CL.muted }));
  if (personal.phone)    { addDiamond(); contactParts.push(new TextRun({ text: personal.phone, size: hp(8), color: CL.muted })); }
  if (personal.email)    { addDiamond(); contactParts.push(link(personal.email, `mailto:${personal.email}`, hp(8), CL.accent)); }
  if (hasLinkedin)       { addDiamond(); contactParts.push(link(personal.linkedin.replace(/^https?:\/\//, ''), personal.linkedin, hp(8), CL.accent)); }
  if (hasGithub)         { addDiamond(); contactParts.push(link(personal.github.replace(/^https?:\/\//, ''), personal.github, hp(8), CL.accent)); }

  const children: (Paragraph | Table)[] = [
    // Top rule
    new Paragraph({
      children: [],
      border: { bottom: { style: BorderStyle.THICK, size: 16, color: CL.accent } },
      spacing: { after: tw(5) },
    }),
    // Name
    new Paragraph({
      children: [new TextRun({ text: personal.name, bold: true, size: hp(22), color: CL.text })],
      alignment: AlignmentType.CENTER,
      spacing: { after: tw(4) },
    }),
    // Contact
    new Paragraph({
      children: contactParts,
      alignment: AlignmentType.CENTER,
      spacing: { after: tw(3) },
    }),
    // Bottom rule
    new Paragraph({
      children: [],
      border: { bottom: { style: BorderStyle.SINGLE, size: 6, color: CL.accent } },
      spacing: { after: tw(8) },
    }),
  ];

  // Summary
  if (personal.summary) {
    children.push(clSection('Professional Summary'));
    children.push(new Paragraph({
      children: [new TextRun({ text: personal.summary, size: hp(8.5), color: CL.text })],
      spacing: { after: tw(5) },
    }));
  }

  // Skills — 2-column grid
  if (skills.length > 0) {
    children.push(clSection('Skills'));
    for (let i = 0; i < skills.length; i += 2) {
      const left = skills[i];
      const right = skills[i + 1];
      children.push(new Table({
        width: { size: 100, type: WidthType.PERCENTAGE },
        borders: TABLE_NO_BORDER,
        rows: [new TableRow({
          children: [
            new TableCell({
              width: { size: 50, type: WidthType.PERCENTAGE },
              borders: CELL_NO_BORDER,
              children: [new Paragraph({
                children: [
                  new TextRun({ text: `${left.category}: `, bold: true, size: hp(8.5), color: CL.text }),
                  new TextRun({ text: left.items.join(', '), size: hp(8.5), color: CL.text }),
                ],
                spacing: { after: tw(3) },
              })],
            }),
            new TableCell({
              width: { size: 50, type: WidthType.PERCENTAGE },
              borders: CELL_NO_BORDER,
              children: right
                ? [new Paragraph({
                    children: [
                      new TextRun({ text: `${right.category}: `, bold: true, size: hp(8.5), color: CL.text }),
                      new TextRun({ text: right.items.join(', '), size: hp(8.5), color: CL.text }),
                    ],
                    spacing: { after: tw(3) },
                  })]
                : [new Paragraph({ children: [] })],
            }),
          ],
        })],
      }));
    }
  }

  // Experience
  if (experiences.length > 0) {
    children.push(clSection('Experience'));
    for (const exp of experiences) {
      children.push(
        new Paragraph({
          children: [
            new TextRun({ text: exp.title, bold: true, size: hp(9.5), color: CL.text }),
            new TextRun({ text: '   ' }),
            new TextRun({ text: exp.period, italics: true, size: hp(8), color: CL.muted }),
          ],
          spacing: { after: tw(1) },
        }),
        new Paragraph({
          children: [new TextRun({ text: exp.company, bold: true, size: hp(8.5), color: CL.accent })],
          spacing: { after: tw(2) },
        }),
      );
      exp.highlights.forEach(h =>
        children.push(new Paragraph({
          children: [new TextRun({ text: h, size: hp(8.5), color: CL.text })],
          numbering: { reference: BULLET, level: 0 },
          spacing: { after: tw(1) },
        })),
      );
      if (exp.tags.length > 0) {
        children.push(new Paragraph({
          children: exp.tags.map((t, i) =>
            new TextRun({ text: (i ? '  ·  ' : '') + t, size: hp(7), color: CL.accent, bold: true }),
          ),
          spacing: { after: tw(5) },
        }));
      }
    }
  }

  // Key Projects
  if (projects.length > 0) {
    children.push(clSection('Key Projects'));
    for (const proj of projects) {
      children.push(new Paragraph({
        children: [
          new TextRun({ text: proj.title, bold: true, size: hp(9), color: CL.text }),
          new TextRun({ text: '   ' }),
          new TextRun({ text: proj.category, italics: true, size: hp(8), color: CL.accent }),
        ],
        spacing: { after: tw(2) },
      }));
      proj.highlights.forEach(h =>
        children.push(new Paragraph({
          children: [new TextRun({ text: h, size: hp(8.5), color: CL.text })],
          numbering: { reference: BULLET, level: 0 },
          spacing: { after: tw(1) },
        })),
      );
      if (proj.tags.length > 0) {
        children.push(new Paragraph({
          children: proj.tags.map((t, i) =>
            new TextRun({ text: (i ? '  ·  ' : '') + t, size: hp(7), color: CL.accent, bold: true }),
          ),
          spacing: { after: tw(5) },
        }));
      }
    }
  }

  // Education
  children.push(
    clSection('Education'),
    new Paragraph({ children: [new TextRun({ text: education.degree, bold: true, size: hp(9), color: CL.text })], spacing: { after: tw(1) } }),
    new Paragraph({ children: [new TextRun({ text: education.institution, italics: true, size: hp(8.5), color: CL.accent })], spacing: { after: tw(1) } }),
    new Paragraph({ children: [new TextRun({ text: `${education.location} · ${education.year}`, size: hp(8), color: CL.muted })], spacing: { after: tw(5) } }),
  );

  // Accomplishments
  if (accomplishments.length > 0) {
    children.push(clSection('Achievements'));
    for (const acc of accomplishments) {
      children.push(new Paragraph({
        children: [new TextRun({ text: acc.title, bold: true, size: hp(8.5), color: CL.text })],
        spacing: { after: tw(1) },
      }));
      if (acc.description) {
        children.push(new Paragraph({
          children: [new TextRun({ text: acc.description, size: hp(8), color: CL.muted })],
          spacing: { after: tw(4) },
        }));
      }
    }
  }

  return new Document({
    numbering: {
      config: [{
        reference: BULLET,
        levels: [{
          level: 0,
          format: LevelFormat.BULLET,
          text: '•',
          alignment: AlignmentType.LEFT,
          style: {
            paragraph: { indent: { left: inch(0.2), hanging: inch(0.1) } },
          },
        }],
      }],
    },
    sections: [{
      properties: {
        page: { margin: { top: inch(0.5), bottom: inch(0.5), left: inch(0.7), right: inch(0.7) } },
      },
      children,
    }],
  });
}

// ═══════════════════════════════════════════════════════════════════════════════
// ── MINIMAL TEMPLATE ───────────────────────────────────────────────────────────
// Single-column, black bold underlined section headers.
// Colours: text #000000, muted #444444
// ═══════════════════════════════════════════════════════════════════════════════
const MIN = { text: '000000', muted: '444444' };

function buildMinimalDoc(data: ResumeData): Document {
  const { personal, skills, experiences, projects, education, accomplishments } = data;
  const hasLinkedin = personal.linkedin && personal.linkedin !== '#';
  const hasGithub   = personal.github   && personal.github   !== '#';
  const BULLET = 'min-bullet';

  const minSection = (title: string): Paragraph =>
    new Paragraph({
      children: [new TextRun({ text: title.toUpperCase(), bold: true, size: hp(9), color: MIN.text })],
      border: { bottom: { style: BorderStyle.SINGLE, size: 6, color: MIN.text } },
      spacing: { before: tw(8), after: tw(4) },
    });

  // ── Contact row ──
  const contactParts: (TextRun | ExternalHyperlink)[] = [];
  const minSep = () => new TextRun({ text: '  |  ', size: hp(8), color: MIN.muted });
  const addSep = () => { if (contactParts.length) contactParts.push(minSep()); };

  if (personal.location) contactParts.push(new TextRun({ text: personal.location, size: hp(8), color: MIN.muted }));
  if (personal.email)    { addSep(); contactParts.push(link(personal.email, `mailto:${personal.email}`, hp(8), MIN.text)); }
  if (personal.phone)    { addSep(); contactParts.push(new TextRun({ text: personal.phone, size: hp(8), color: MIN.muted })); }
  if (hasLinkedin)       { addSep(); contactParts.push(link('LinkedIn', personal.linkedin, hp(8), MIN.text)); }
  if (hasGithub)         { addSep(); contactParts.push(link('GitHub', personal.github, hp(8), MIN.text)); }

  const children: (Paragraph | Table)[] = [
    new Paragraph({
      children: [new TextRun({ text: personal.name, bold: true, size: hp(22), color: MIN.text })],
      alignment: AlignmentType.CENTER,
      spacing: { after: tw(4) },
    }),
    new Paragraph({
      children: contactParts,
      alignment: AlignmentType.CENTER,
      spacing: { after: tw(6) },
    }),
  ];

  if (personal.summary) {
    children.push(
      minSection('Professional Summary'),
      new Paragraph({ children: [new TextRun({ text: personal.summary, size: hp(8.5), color: MIN.text })], spacing: { after: tw(5) } }),
    );
  }

  // Experience
  children.push(minSection('Experience'));
  for (const exp of experiences) {
    children.push(
      new Paragraph({
        children: [
          new TextRun({ text: exp.company, bold: true, size: hp(9.5), color: MIN.text }),
          new TextRun({ text: '   ' }),
          new TextRun({ text: exp.period, bold: true, size: hp(8.5), color: MIN.text }),
        ],
        spacing: { after: tw(1) },
      }),
      new Paragraph({
        children: [
          new TextRun({ text: exp.title, italics: true, size: hp(9), color: MIN.muted }),
          ...(exp.current ? [new TextRun({ text: ' (current)', size: hp(8), color: MIN.muted })] : []),
        ],
        spacing: { after: tw(2) },
      }),
    );
    exp.highlights.forEach(h =>
      children.push(new Paragraph({
        children: [new TextRun({ text: h, size: hp(8.5), color: MIN.text })],
        numbering: { reference: BULLET, level: 0 },
        spacing: { after: tw(1) },
      })),
    );
    if (exp.tags.length > 0) {
      children.push(new Paragraph({
        children: exp.tags.map((t, i) =>
          new TextRun({ text: (i ? '  ·  ' : '') + t, size: hp(7.5), color: MIN.muted }),
        ),
        spacing: { after: tw(5) },
      }));
    }
  }

  // Key Projects
  children.push(minSection('Key Projects'));
  for (const proj of projects) {
    children.push(new Paragraph({
      children: [
        new TextRun({ text: proj.title, bold: true, size: hp(9), color: MIN.text }),
        new TextRun({ text: '   ' }),
        new TextRun({ text: proj.category, italics: true, size: hp(8), color: MIN.muted }),
      ],
      spacing: { after: tw(2) },
    }));
    proj.highlights.forEach(h =>
      children.push(new Paragraph({
        children: [new TextRun({ text: h, size: hp(8.5), color: MIN.text })],
        numbering: { reference: BULLET, level: 0 },
        spacing: { after: tw(1) },
      })),
    );
    if (proj.tags.length > 0) {
      children.push(new Paragraph({
        children: proj.tags.map((t, i) =>
          new TextRun({ text: (i ? '  ·  ' : '') + t, size: hp(7.5), color: MIN.muted }),
        ),
        spacing: { after: tw(5) },
      }));
    }
  }

  // Skills — 2-column grid
  children.push(minSection('Skills'));
  for (let i = 0; i < skills.length; i += 2) {
    const left = skills[i];
    const right = skills[i + 1];
    children.push(new Table({
      width: { size: 100, type: WidthType.PERCENTAGE },
      borders: TABLE_NO_BORDER,
      rows: [new TableRow({
        children: [
          new TableCell({
            width: { size: 50, type: WidthType.PERCENTAGE },
            borders: CELL_NO_BORDER,
            children: [new Paragraph({
              children: [
                new TextRun({ text: `${left.category}: `, bold: true, size: hp(8.5), color: MIN.text }),
                new TextRun({ text: left.items.join(', '), size: hp(8.5), color: MIN.muted }),
              ],
              spacing: { after: tw(3) },
            })],
          }),
          new TableCell({
            width: { size: 50, type: WidthType.PERCENTAGE },
            borders: CELL_NO_BORDER,
            children: right
              ? [new Paragraph({
                  children: [
                    new TextRun({ text: `${right.category}: `, bold: true, size: hp(8.5), color: MIN.text }),
                    new TextRun({ text: right.items.join(', '), size: hp(8.5), color: MIN.muted }),
                  ],
                  spacing: { after: tw(3) },
                })]
              : [new Paragraph({ children: [] })],
          }),
        ],
      })],
    }));
  }

  // Education
  children.push(
    minSection('Education'),
    new Paragraph({ children: [new TextRun({ text: education.degree, bold: true, size: hp(9), color: MIN.text })], spacing: { after: tw(1) } }),
    new Paragraph({ children: [new TextRun({ text: education.institution, italics: true, size: hp(8.5), color: MIN.muted })], spacing: { after: tw(1) } }),
    new Paragraph({ children: [new TextRun({ text: `${education.location} · ${education.year}`, size: hp(8), color: MIN.muted })], spacing: { after: tw(5) } }),
  );

  // Accomplishments
  if (accomplishments.length > 0) {
    children.push(minSection('Achievements'));
    for (const acc of accomplishments) {
      children.push(new Paragraph({
        children: [
          new TextRun({ text: acc.title, bold: true, size: hp(8.5), color: MIN.text }),
          ...(acc.description
            ? [new TextRun({ text: `  ${acc.description}`, size: hp(8), color: MIN.muted })]
            : []),
        ],
        spacing: { after: tw(4) },
      }));
    }
  }

  return new Document({
    numbering: {
      config: [{
        reference: BULLET,
        levels: [{
          level: 0,
          format: LevelFormat.BULLET,
          text: '•',
          alignment: AlignmentType.LEFT,
          style: {
            paragraph: { indent: { left: inch(0.2), hanging: inch(0.1) } },
          },
        }],
      }],
    },
    sections: [{
      properties: {
        page: { margin: { top: inch(0.5), bottom: inch(0.5), left: inch(0.6), right: inch(0.6) } },
      },
      children,
    }],
  });
}

// ═══════════════════════════════════════════════════════════════════════════════
// ── Public API ─────────────────────────────────────────────────────────────────
// ═══════════════════════════════════════════════════════════════════════════════

const BUILDERS: Record<TemplateId, (data: ResumeData) => Document> = {
  modern:  buildModernDoc,
  classic: buildClassicDoc,
  minimal: buildMinimalDoc,
};

/**
 * Generate and immediately trigger a browser download of the resume as DOCX.
 * Uses the same template and edited form data as the live PDF preview.
 */
export async function downloadDocx(
  data: ResumeData,
  template: TemplateId,
  filename: string,
): Promise<void> {
  const doc  = BUILDERS[template](data);
  const blob = await Packer.toBlob(doc);
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement('a');
  a.href     = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
