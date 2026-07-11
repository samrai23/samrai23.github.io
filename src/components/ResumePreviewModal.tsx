/**
 * ResumePreviewModal.tsx
 *
 * Two-column modal:
 *   Left  — editable form prefilled from portfolio data (changes are local only,
 *            original data is never mutated)
 *   Right — live PDF preview that reflects form edits in real-time
 */

import { useEffect, useRef, useState, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PDFViewer, PDFDownloadLink } from '@react-pdf/renderer';
import ResumePDF from '@/components/ResumePDF';
import { downloadDocx } from '@/components/ResumeDocx';
import { useFeatureFlags } from '@/hooks/useFeatureFlags';
import type { ResumeData, TemplateId } from '@/components/ResumePDF';
import {
  personal as _personal,
  skills as _skills,
  experiences as _experiences,
  projects as _projects,
  education as _education,
  accomplishments as _accomplishments,
} from '@/data/portfolio';
import type { PersonalInfo, SkillCategory, Experience, EducationInfo, Accomplishment } from '@/types';

interface Props {
  open: boolean;
  onClose: () => void;
}

// ── Form types — tags/items stored as comma-separated strings for easy editing
interface FormSkill    { category: string; color: SkillCategory['color']; items: string; }
interface FormExp      extends Omit<Experience, 'tags'>    { tags: string; }
interface FormProj     extends Omit<import('@/types').Project, 'tags'> { tags: string; }
interface FormAccomp   extends Omit<Accomplishment, never> {}

interface FormState {
  personal:       PersonalInfo;
  skills:         FormSkill[];
  experiences:    FormExp[];
  projects:       FormProj[];
  education:      EducationInfo;
  accomplishments: FormAccomp[];
}

// ── Initialise form from portfolio defaults ───────────────────────────────────
function buildInitialForm(): FormState {
  return {
    personal:    { ..._personal },
    skills:      _skills.map(sk  => ({ ...sk, items: sk.items.join(', ') })),
    experiences: _experiences.map(e => ({ ...e, tags: e.tags.join(', ') })),
    projects:    _projects.map(p  => ({ ...p, tags: p.tags.join(', ') })),
    education:   { ..._education },
    accomplishments: _accomplishments.map(a => ({ ...a })),
  };
}

// ── Convert form state → ResumeData (split comma strings back to arrays) ──────
function formToResumeData(form: FormState): ResumeData {
  const split = (s: string) => s.split(',').map(x => x.trim()).filter(Boolean);
  return {
    personal:    form.personal,
    skills:      form.skills.map(sk => ({ ...sk, items: split(sk.items) })),
    experiences: form.experiences.map(e  => ({ ...e, tags: split(e.tags) })),
    projects:    form.projects.map(p   => ({ ...p, tags: split(p.tags) })),
    education:   form.education,
    accomplishments: form.accomplishments,
  };
}

// ── Thin presentational helpers ───────────────────────────────────────────────
function Chevron({ open }: { open: boolean }) {
  return (
    <span className={`rform__chevron${open ? ' rform__chevron--open' : ''}`}>▼</span>
  );
}

function SectionHeader({
  label, isOpen, onToggle,
}: { label: string; isOpen: boolean; onToggle(): void }) {
  return (
    <button className="rform__section-header" onClick={onToggle} type="button">
      <span>{label}</span>
      <Chevron open={isOpen} />
    </button>
  );
}

function Field({
  label, value, onChange, multiline = false, rows = 3,
}: {
  label: string; value: string; onChange(v: string): void;
  multiline?: boolean; rows?: number;
}) {
  return (
    <div className="rform__field">
      <span className="rform__label">{label}</span>
      {multiline ? (
        <textarea
          className="rform__textarea"
          value={value}
          rows={rows}
          aria-label={label}
          onChange={e => onChange(e.target.value)}
        />
      ) : (
        <input
          className="rform__input"
          type="text"
          value={value}
          aria-label={label}
          onChange={e => onChange(e.target.value)}
        />
      )}
    </div>
  );
}

function BulletEditor({ items, onChange }: { items: string[]; onChange(items: string[]): void }) {
  return (
    <div className="rform__bullet-list">
      {items.map((item, i) => (
        <div key={i} className="rform__bullet-row">
          <textarea
            className="rform__textarea"
            value={item}
            rows={2}
            aria-label={`Bullet point ${i + 1}`}
            onChange={e => { const n = [...items]; n[i] = e.target.value; onChange(n); }}
          />
          <button
            className="rform__remove-btn"
            type="button"
            title="Remove"
            onClick={() => onChange(items.filter((_, j) => j !== i))}
          >✕</button>
        </div>
      ))}
      <button className="rform__add-btn" type="button" onClick={() => onChange([...items, ''])}>
        + Add bullet
      </button>
    </div>
  );
}
// ── Template picker ──────────────────────────────────────────────────────────────
const TEMPLATES: { id: TemplateId; name: string; desc: string }[] = [
  { id: 'modern',  name: 'Modern',  desc: 'Two-column with sidebar' },
  { id: 'classic', name: 'Classic', desc: 'Centered header, flanked sections' },
  { id: 'minimal', name: 'Minimal', desc: 'Clean bold section headers' },
];

function TemplatePicker({
  selected,
  onChange,
}: {
  selected: TemplateId;
  onChange: (t: TemplateId) => void;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const h = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  }, [open]);

  return (
    <div className="template-picker" ref={ref}>
      <button
        className="template-picker__btn"
        type="button"
        onClick={() => setOpen(o => !o)}
        title="Change resume template"
        aria-label="Change resume template"
        aria-expanded={open}
      >
        <span className="template-picker__icon">◫</span>
      </button>
      {open && (
        <div className="template-picker__popover" role="menu">
          <span className="template-picker__heading">Template</span>
          {TEMPLATES.map(t => (
            <button
              key={t.id}
              className={`template-picker__option${selected === t.id ? ' template-picker__option--active' : ''}`}
              type="button"
              role="menuitem"
              onClick={() => { onChange(t.id); setOpen(false); }}
            >
              <div className="template-picker__option-info">
                <span className="template-picker__option-name">{t.name}</span>
                <span className="template-picker__option-desc">{t.desc}</span>
              </div>
              {selected === t.id && <span className="template-picker__check">✓</span>}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
// ── Resume skeleton loader ────────────────────────────────────────────────────
function ResumeLoader() {
  return (
    <div className="resume-loader">
      <div className="resume-loader__doc">
        <div className="resume-loader__scan-line" />
        <div className="resume-loader__block resume-loader__block--header" />
        <div className="resume-loader__block resume-loader__block--subtitle" />
        <div className="resume-loader__divider" />
        <div className="resume-loader__columns">
          <div className="resume-loader__col resume-loader__col--main">
            <div className="resume-loader__line resume-loader__line--label" />
            <div className="resume-loader__line" />
            <div className="resume-loader__line resume-loader__line--short" />
            <div className="resume-loader__line" />
            <div className="resume-loader__line resume-loader__line--med" />
            <div className="resume-loader__gap" />
            <div className="resume-loader__line resume-loader__line--label" />
            <div className="resume-loader__line" />
            <div className="resume-loader__line resume-loader__line--med" />
            <div className="resume-loader__line resume-loader__line--short" />
          </div>
          <div className="resume-loader__col resume-loader__col--side">
            <div className="resume-loader__line resume-loader__line--label" />
            <div className="resume-loader__line resume-loader__line--short" />
            <div className="resume-loader__line resume-loader__line--med" />
            <div className="resume-loader__gap" />
            <div className="resume-loader__line resume-loader__line--label" />
            <div className="resume-loader__line resume-loader__line--short" />
            <div className="resume-loader__line" />
          </div>
        </div>
      </div>
      <div className="resume-loader__status">
        <span className="resume-loader__dots">
          <span /><span /><span />
        </span>
        <span className="resume-loader__text">Generating PDF</span>
      </div>
    </div>
  );
}

// ─── Modal ───────────────────────────────────────────────────────────────────
export default function ResumePreviewModal({ open, onClose }: Props) {
  const [formData, setFormData]     = useState<FormState>(buildInitialForm);
  const [pdfLoaded, setPdfLoaded]   = useState(false);
  const [docxLoading, setDocxLoading] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<TemplateId>('modern');
  const viewerRef = useRef<HTMLDivElement>(null);
  const { showResumePDF, showResumeDocx } = useFeatureFlags();

  // Per-section accordion open/close
  const [openSections, setOpenSections] = useState<Set<string>>(
    () => new Set(['personal'])
  );
  // Per-entry open/close for experience / projects arrays
  const [openExpIdx,  setOpenExpIdx]  = useState<Set<number>>(() => new Set([0]));
  const [openProjIdx, setOpenProjIdx] = useState<Set<number>>(() => new Set([0]));

  // Debounce PDF re-render so it doesn't fire on every keystroke
  const [debouncedForm, setDebouncedForm] = useState<FormState>(formData);
  useEffect(() => {
    const t = setTimeout(() => setDebouncedForm(formData), 500);
    return () => clearTimeout(t);
  }, [formData]);

  const resumeData  = useMemo(() => formToResumeData(debouncedForm), [debouncedForm]);
  const fileName    = `${formData.personal.name.replace(/\s+/g, '_')}_Resume.pdf`;
  const docxFileName = `${formData.personal.name.replace(/\s+/g, '_')}_Resume.docx`;

  const reset = useCallback(() => setFormData(buildInitialForm()), []);

  const handleDocxDownload = useCallback(async () => {
    setDocxLoading(true);
    try {
      await downloadDocx(formToResumeData(formData), selectedTemplate, docxFileName);
    } finally {
      setDocxLoading(false);
    }
  }, [formData, selectedTemplate, docxFileName]);

  // Reset loaded state each time modal opens or template changes
  useEffect(() => { if (open) setPdfLoaded(false); }, [open]);
  useEffect(() => { setPdfLoaded(false); }, [selectedTemplate]);

  // Attach load listener to the inner iframe
  useEffect(() => {
    if (!open) return;
    let cleanup: (() => void) | undefined;
    const interval = setInterval(() => {
      const iframe = viewerRef.current?.querySelector('iframe');
      if (!iframe) return;
      clearInterval(interval);
      const onLoad = () => setPdfLoaded(true);
      iframe.addEventListener('load', onLoad);
      cleanup = () => iframe.removeEventListener('load', onLoad);
    }, 50);
    return () => { clearInterval(interval); cleanup?.(); };
  }, [open]);

  // Lock body scroll while open
  useEffect(() => {
    if (open) document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  // Close on Escape
  useEffect(() => {
    const h = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    if (open) window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, [open, onClose]);

  // ── State helpers ──────────────────────────────────────────────────────────
  const toggleSection = (key: string) =>
    setOpenSections(prev => {
      const n = new Set(prev); n.has(key) ? n.delete(key) : n.add(key); return n;
    });

  const toggleEntry = (setter: React.Dispatch<React.SetStateAction<Set<number>>>, idx: number) =>
    setter(prev => { const n = new Set(prev); n.has(idx) ? n.delete(idx) : n.add(idx); return n; });

  const upPersonal = (k: keyof PersonalInfo, v: string) =>
    setFormData(f => ({ ...f, personal: { ...f.personal, [k]: v } }));

  const upEducation = (k: keyof EducationInfo, v: string) =>
    setFormData(f => ({ ...f, education: { ...f.education, [k]: v } }));

  const upSkillItems = (idx: number, v: string) =>
    setFormData(f => {
      const skills = [...f.skills]; skills[idx] = { ...skills[idx], items: v };
      return { ...f, skills };
    });

  const upExp = (idx: number, field: string, v: string) =>
    setFormData(f => {
      const experiences = [...f.experiences];
      experiences[idx] = { ...experiences[idx], [field]: v };
      return { ...f, experiences };
    });

  const upExpHighlights = (idx: number, highlights: string[]) =>
    setFormData(f => {
      const experiences = [...f.experiences];
      experiences[idx] = { ...experiences[idx], highlights };
      return { ...f, experiences };
    });

  const upProj = (idx: number, field: string, v: string) =>
    setFormData(f => {
      const projects = [...f.projects];
      projects[idx] = { ...projects[idx], [field]: v };
      return { ...f, projects };
    });

  const upProjHighlights = (idx: number, highlights: string[]) =>
    setFormData(f => {
      const projects = [...f.projects];
      projects[idx] = { ...projects[idx], highlights };
      return { ...f, projects };
    });

  const upAccomp = (idx: number, field: string, v: string) =>
    setFormData(f => {
      const accomplishments = [...f.accomplishments];
      accomplishments[idx] = { ...accomplishments[idx], [field]: v };
      return { ...f, accomplishments };
    });

  const addAccomp = () =>
    setFormData(f => ({
      ...f,
      accomplishments: [
        ...f.accomplishments,
        { id: Date.now(), title: '', description: '', icon: '' },
      ],
    }));

  const removeAccomp = (idx: number) =>
    setFormData(f => ({
      ...f,
      accomplishments: f.accomplishments.filter((_, i) => i !== idx),
    }));

  const addExp = () =>
    setFormData(f => {
      const newId = Date.now();
      const newIdx = f.experiences.length;
      setOpenExpIdx(prev => new Set(prev).add(newIdx));
      return {
        ...f,
        experiences: [
          ...f.experiences,
          { id: newId, title: '', company: '', period: '', current: false, highlights: [''], tags: '' },
        ],
      };
    });

  const removeExp = (idx: number) =>
    setFormData(f => ({
      ...f,
      experiences: f.experiences.filter((_, i) => i !== idx),
    }));

  const addProj = () =>
    setFormData(f => {
      const newId = Date.now();
      const newIdx = f.projects.length;
      setOpenProjIdx(prev => new Set(prev).add(newIdx));
      return {
        ...f,
        projects: [
          ...f.projects,
          { id: newId, title: '', description: '', category: '', highlights: [''], tags: '' },
        ],
      };
    });

  const removeProj = (idx: number) =>
    setFormData(f => ({
      ...f,
      projects: f.projects.filter((_, i) => i !== idx),
    }));

  // Generic reorder — swaps item at `idx` with its neighbour
  const moveItem = <T,>(
    key: 'experiences' | 'projects' | 'accomplishments',
    idx: number,
    dir: -1 | 1
  ) =>
    setFormData(f => {
      const arr = [...(f[key] as T[])];
      const to = idx + dir;
      if (to < 0 || to >= arr.length) return f;
      [arr[idx], arr[to]] = [arr[to], arr[idx]];
      return { ...f, [key]: arr };
    });

  const isOpen = (k: string) => openSections.has(k);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="resume-modal__backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={onClose}
          role="dialog"
          aria-modal="true"
          aria-label="Resume preview"
        >
          <motion.div
            className="resume-modal__panel resume-modal__panel--wide"
            initial={{ opacity: 0, scale: 0.96, y: 24 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 24 }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
            onClick={e => e.stopPropagation()}
          >
            {/* ── Top header ── */}
            <div className="resume-modal__header">
              <span className="resume-modal__title">Resume Preview</span>
              <div className="resume-modal__header-actions">
                <TemplatePicker selected={selectedTemplate} onChange={setSelectedTemplate} />
                {showResumeDocx && (
                  <button
                    className="resume-modal__download-btn resume-modal__download-btn--docx"
                    onClick={handleDocxDownload}
                    disabled={docxLoading}
                    aria-label="Download resume as DOCX"
                    title="Download as Word document (.docx)"
                  >
                    {docxLoading ? 'Generating…' : '↓ Download DOCX'}
                  </button>
                )}
                {showResumePDF && (
                  <PDFDownloadLink
                    document={<ResumePDF data={resumeData} template={selectedTemplate} />}
                    fileName={fileName}
                    className="resume-modal__download-btn"
                    aria-label="Download resume as PDF"
                  >
                    {({ loading }) => (loading ? 'Generating…' : '↓ Download PDF')}
                  </PDFDownloadLink>
                )}
                <button className="resume-modal__close-btn" onClick={onClose} aria-label="Close preview">
                  ✕
                </button>
              </div>
            </div>

            {/* ── Two-column body ── */}
            <div className="resume-modal__body">

              {/* ══ Left: edit form ══ */}
              <div className="resume-modal__form-col">
                <div className="resume-modal__form-header">
                  <span className="resume-modal__form-title">Edit details</span>
                  <button className="rform__reset-btn" type="button" onClick={reset}>
                    Reset to default
                  </button>
                </div>

                <div className="rform">

                  {/* Personal Info */}
                  <div className="rform__section">
                    <SectionHeader label="Personal Info" isOpen={isOpen('personal')} onToggle={() => toggleSection('personal')} />
                    {isOpen('personal') && (
                      <div className="rform__section-body">
                        {(
                          [
                            { key: 'name',     label: 'Name' },
                            { key: 'title',    label: 'Title' },
                            { key: 'tagline',  label: 'Tagline' },
                            { key: 'location', label: 'Location' },
                            { key: 'email',    label: 'Email' },
                            { key: 'phone',    label: 'Phone' },
                            { key: 'linkedin', label: 'LinkedIn URL' },
                            { key: 'github',   label: 'GitHub URL' },
                          ] as { key: keyof PersonalInfo; label: string }[]
                        ).map(({ key, label }) => (
                          <Field key={key} label={label} value={formData.personal[key]} onChange={v => upPersonal(key, v)} />
                        ))}
                        <Field label="Summary" value={formData.personal.summary} onChange={v => upPersonal('summary', v)} multiline rows={4} />
                      </div>
                    )}
                  </div>

                  {/* Work Experience */}
                  <div className="rform__section">
                    <SectionHeader label="Work Experience" isOpen={isOpen('experience')} onToggle={() => toggleSection('experience')} />
                    {isOpen('experience') && (
                      <div className="rform__section-body">
                        {formData.experiences.map((exp, idx) => (
                          <div key={exp.id} className="rform__entry">
                            <button
                              className="rform__entry-header"
                              type="button"
                              onClick={() => toggleEntry(setOpenExpIdx, idx)}
                            >
                              <span>{exp.title || 'Untitled'}{exp.company ? ` — ${exp.company}` : ''}</span>
                              <span className="rform__entry-header-actions">
                                <span className="rform__order-btns">
                                  <span className="rform__order-btn" role="button" aria-label="Move up"
                                    onClick={e => { e.stopPropagation(); moveItem('experiences', idx, -1); }}>&#9650;</span>
                                  <span className="rform__order-btn" role="button" aria-label="Move down"
                                    onClick={e => { e.stopPropagation(); moveItem('experiences', idx, 1); }}>&#9660;</span>
                                </span>
                                <span
                                  className="rform__entry-remove"
                                  role="button"
                                  aria-label="Remove experience"
                                  onClick={e => { e.stopPropagation(); removeExp(idx); }}
                                >✕</span>
                                <Chevron open={openExpIdx.has(idx)} />
                              </span>
                            </button>
                            {openExpIdx.has(idx) && (
                              <div className="rform__entry-body">
                                <Field label="Job Title" value={exp.title}  onChange={v => upExp(idx, 'title', v)} />
                                <Field label="Company"   value={exp.company} onChange={v => upExp(idx, 'company', v)} />
                                <Field label="Period"    value={exp.period}  onChange={v => upExp(idx, 'period', v)} />
                                <Field label="Tags (comma-separated)" value={exp.tags} onChange={v => upExp(idx, 'tags', v)} />
                                <div className="rform__field">
                                  <span className="rform__label">Highlights</span>
                                  <BulletEditor items={exp.highlights} onChange={items => upExpHighlights(idx, items)} />
                                </div>
                              </div>
                            )}
                          </div>
                        ))}
                        <button className="rform__add-entry-btn" type="button" onClick={addExp}>
                          + Add experience
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Key Projects */}
                  <div className="rform__section">
                    <SectionHeader label="Key Projects" isOpen={isOpen('projects')} onToggle={() => toggleSection('projects')} />
                    {isOpen('projects') && (
                      <div className="rform__section-body">
                        {formData.projects.map((proj, idx) => (
                          <div key={proj.id} className="rform__entry">
                            <button
                              className="rform__entry-header"
                              type="button"
                              onClick={() => toggleEntry(setOpenProjIdx, idx)}
                            >
                              <span>{proj.title || 'Untitled'}</span>
                              <span className="rform__entry-header-actions">
                                <span className="rform__order-btns">
                                  <span className="rform__order-btn" role="button" aria-label="Move up"
                                    onClick={e => { e.stopPropagation(); moveItem('projects', idx, -1); }}>&#9650;</span>
                                  <span className="rform__order-btn" role="button" aria-label="Move down"
                                    onClick={e => { e.stopPropagation(); moveItem('projects', idx, 1); }}>&#9660;</span>
                                </span>
                                <span
                                  className="rform__entry-remove"
                                  role="button"
                                  aria-label="Remove project"
                                  onClick={e => { e.stopPropagation(); removeProj(idx); }}
                                >✕</span>
                                <Chevron open={openProjIdx.has(idx)} />
                              </span>
                            </button>
                            {openProjIdx.has(idx) && (
                              <div className="rform__entry-body">
                                <Field label="Title"    value={proj.title}    onChange={v => upProj(idx, 'title', v)} />
                                <Field label="Category" value={proj.category} onChange={v => upProj(idx, 'category', v)} />
                                <Field label="Tags (comma-separated)" value={proj.tags} onChange={v => upProj(idx, 'tags', v)} />
                                <div className="rform__field">
                                  <span className="rform__label">Highlights</span>
                                  <BulletEditor items={proj.highlights} onChange={items => upProjHighlights(idx, items)} />
                                </div>
                              </div>
                            )}
                          </div>
                        ))}
                        <button className="rform__add-entry-btn" type="button" onClick={addProj}>
                          + Add project
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Skills */}
                  <div className="rform__section">
                    <SectionHeader label="Skills" isOpen={isOpen('skills')} onToggle={() => toggleSection('skills')} />
                    {isOpen('skills') && (
                      <div className="rform__section-body">
                        {formData.skills.map((sk, idx) => (
                          <Field
                            key={sk.category}
                            label={sk.category}
                            value={sk.items}
                            onChange={v => upSkillItems(idx, v)}
                          />
                        ))}
                        <span className="rform__hint">Separate items with commas</span>
                      </div>
                    )}
                  </div>

                  {/* Education */}
                  <div className="rform__section">
                    <SectionHeader label="Education" isOpen={isOpen('education')} onToggle={() => toggleSection('education')} />
                    {isOpen('education') && (
                      <div className="rform__section-body">
                        <Field label="Degree"      value={formData.education.degree}      onChange={v => upEducation('degree', v)} />
                        <Field label="Institution" value={formData.education.institution} onChange={v => upEducation('institution', v)} />
                        <Field label="Location"    value={formData.education.location}    onChange={v => upEducation('location', v)} />
                        <Field label="Year"        value={formData.education.year}        onChange={v => upEducation('year', v)} />
                      </div>
                    )}
                  </div>

                  {/* Accomplishments */}
                  <div className="rform__section">
                    <SectionHeader label="Accomplishments" isOpen={isOpen('accomplishments')} onToggle={() => toggleSection('accomplishments')} />
                    {isOpen('accomplishments') && (
                      <div className="rform__section-body">
                        {formData.accomplishments.map((acc, idx) => (
                          <div key={acc.id} className="rform__entry">
                            <div className="rform__entry-header rform__entry-header--static">
                              <span>{acc.title || 'Untitled'}</span>
                              <span className="rform__entry-header-actions">
                                <span className="rform__order-btns">
                                  <span className="rform__order-btn" role="button" aria-label="Move up"
                                    onClick={() => moveItem('accomplishments', idx, -1)}>&#9650;</span>
                                  <span className="rform__order-btn" role="button" aria-label="Move down"
                                    onClick={() => moveItem('accomplishments', idx, 1)}>&#9660;</span>
                                </span>
                                <span
                                  className="rform__entry-remove"
                                  role="button"
                                  aria-label="Remove accomplishment"
                                  onClick={() => removeAccomp(idx)}
                                >✕</span>
                              </span>
                            </div>
                            <div className="rform__entry-body">
                              <Field label="Title"       value={acc.title}       onChange={v => upAccomp(idx, 'title', v)} />
                              <Field label="Description" value={acc.description} onChange={v => upAccomp(idx, 'description', v)} multiline rows={2} />
                            </div>
                          </div>
                        ))}
                        <button className="rform__add-entry-btn" type="button" onClick={addAccomp}>
                          + Add accomplishment
                        </button>
                      </div>
                    )}
                  </div>

                </div>{/* /rform */}
              </div>{/* /form-col */}

              {/* ══ Right: PDF viewer (shown only when showResumePDF is enabled) ══ */}
              <div className="resume-modal__viewer-col" ref={viewerRef}>
                {showResumePDF ? (
                  <>
                    <AnimatePresence>
                      {!pdfLoaded && (
                        <motion.div
                          className="resume-modal__loader-wrap"
                          initial={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 0.4 }}
                        >
                          <ResumeLoader />
                        </motion.div>
                      )}
                    </AnimatePresence>
                    <PDFViewer width="100%" height="100%" showToolbar={false}>
                      <ResumePDF data={resumeData} template={selectedTemplate} />
                    </PDFViewer>
                  </>
                ) : (
                  <div className="resume-modal__pdf-disabled">
                    <span className="resume-modal__pdf-disabled-icon">⬇</span>
                    <p>PDF preview is disabled.</p>
                    {showResumeDocx && <p>Use <strong>Download DOCX</strong> to export your resume.</p>}
                  </div>
                )}
              </div>

            </div>{/* /body */}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
