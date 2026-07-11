import { createContext, useContext, useEffect, useState } from 'react';
import type { ReactNode } from 'react';

// ── Types ─────────────────────────────────────────────────────────────────────

export interface FeatureFlags {
  /** Show the PDF download button in the resume modal and navbar. */
  showResumePDF: boolean;
  /** Show the DOCX download button in the resume modal. */
  showResumeDocx: boolean;
  /** Show the Projects section and its nav link. */
  showProjects: boolean;
  /** Show the Accomplishments section. */
  showAccomplishments: boolean;
  /** Show the Contact CTA link in the navbar. */
  showContactForm: boolean;
  [key: string]: boolean;
}

// ── Priority resolution ───────────────────────────────────────────────────────
/**
 * Flag resolution priority (highest → lowest):
 *   1. Remote JSON (GitHub Gist or any URL at VITE_FEATURE_FLAGS_URL)
 *   2. Build-time env vars  (VITE_FLAG_SHOW_*)
 *   3. Hardcoded defaults below
 *
 * "false" / "0" → false; any other non-empty string → true.
 */
function envBool(val: string | undefined, hardcoded: boolean): boolean {
  if (val === undefined || val === '') return hardcoded;
  return val !== 'false' && val !== '0';
}

/**
 * Env-layer flags — built once at module load from VITE_<flagName> variables.
 * Env var name = "VITE_" + the exact flag key (e.g. VITE_showResumePDF).
 * These become the baseline that remote Gist values override at runtime.
 */
const ENV_FLAGS: FeatureFlags = {
  showResumePDF:       envBool(import.meta.env.VITE_showResumePDF,       true),
  showResumeDocx:      envBool(import.meta.env.VITE_showResumeDocx,      true),
  showProjects:        envBool(import.meta.env.VITE_showProjects,        true),
  showAccomplishments: envBool(import.meta.env.VITE_showAccomplishments, true),
  showContactForm:     envBool(import.meta.env.VITE_showContactForm,     false),
};

// Remote Gist API endpoint — set VITE_FEATURE_FLAGS_URL to enable runtime feature flags.
// Format: https://api.github.com/gists/<gist-id>
// The API always returns the latest content; commit hash never changes.
const FLAGS_URL = import.meta.env.VITE_FEATURE_FLAGS_URL as string | undefined;

// ── Context ───────────────────────────────────────────────────────────────────

const FeatureFlagsContext = createContext<FeatureFlags>(ENV_FLAGS);

/**
 * Mount once near the root of the app (e.g. in main.tsx).
 * Performs a single fetch; all consumers share the result via context.
 */
export function FeatureFlagsProvider({ children }: { children: ReactNode }) {
  const [flags, setFlags] = useState<FeatureFlags>(ENV_FLAGS);

  useEffect(() => {
    if (!FLAGS_URL) return;
    const controller = new AbortController();
    fetch(FLAGS_URL, { signal: controller.signal, cache: 'no-store' })
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json() as Promise<{ files?: Record<string, { content: string }> }>;
      })
      .then((data) => {
        // Gist API response: { files: { "filename": { content: "..." } } }
        if (data.files) {
          for (const file of Object.values(data.files)) {
            try {
              const parsed = JSON.parse(file.content) as Partial<FeatureFlags>;
              setFlags({ ...ENV_FLAGS, ...(parsed as FeatureFlags) });
              return;
            } catch {}
          }
        }
        console.warn('[FeatureFlags] No valid JSON file in Gist response.');
      })
      .catch((err) => {
        if (err.name !== 'AbortError') {
          console.warn('[FeatureFlags] Remote fetch failed; using env/defaults.', err);
        }
      });
    return () => controller.abort();
  }, []);

  return (
    <FeatureFlagsContext.Provider value={flags}>
      {children}
    </FeatureFlagsContext.Provider>
  );
}

/**
 * Returns the current resolved feature flags.
 * Must be called inside a <FeatureFlagsProvider> subtree.
 */
export function useFeatureFlags(): FeatureFlags {
  return useContext(FeatureFlagsContext);
}
