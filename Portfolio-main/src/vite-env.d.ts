/// <reference types="vite/client" />

/**
 * Augments Vite's ImportMetaEnv to include portfolio-specific VITE_ variables.
 * TypeScript will error at compile time if any variable is accessed but not declared here.
 */
interface ImportMetaEnv {
  readonly VITE_NAME: string;
  readonly VITE_TITLE: string;
  readonly VITE_TAGLINE: string;
  readonly VITE_SUMMARY: string;
  readonly VITE_LOCATION: string;
  readonly VITE_EMAIL: string;
  readonly VITE_PHONE: string;
  readonly VITE_LINKEDIN: string;
  readonly VITE_GITHUB: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
