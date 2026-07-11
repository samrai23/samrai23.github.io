/**
 * portfolioVersions.ts — Registry of all versioned portfolio snapshots.
 *
 * HOW TO ADD A NEW VERSION:
 *   1. Duplicate `src/data/versions/v1.0.0.ts` → `src/data/versions/vX.Y.Z.ts`
 *   2. Edit the new file with your updated content.
 *   3. Import it below and add an entry to `portfolioVersions`.
 *   4. Bump `PORTFOLIO_VERSION` and `PORTFOLIO_LAST_UPDATED` in portfolio.ts.
 *
 * HOW TO READ A VERSION:
 *   import { getVersion, portfolioVersions } from '@/data/portfolioVersions';
 *
 *   const snapshot = getVersion('1.0.0');   // typed PortfolioSnapshot | undefined
 *   const all      = portfolioVersions;     // Record<string, PortfolioSnapshot>
 *   const log      = versionLog;            // sorted array of { version, date, changes }
 */

import type { PortfolioSnapshot } from '@/types';
import { v1_0_0 } from './versions/v1.0.0';
import { v1_1_0 } from './versions/v1.1.0';

// ─── Version registry ─────────────────────────────────────────────────────────

export const portfolioVersions: Record<string, PortfolioSnapshot> = {
  '1.0.0': v1_0_0,
  '1.1.0': v1_1_0,
};

// ─── Changelog ────────────────────────────────────────────────────────────────

export const versionLog: Array<{ version: string; date: string; changes: string }> = [
  { version: '1.0.0', date: '2026-06-14', changes: 'Initial release' },
  { version: '1.1.0', date: '2026-07-11', changes: 'Sudhanshu Raina — Data Engineer resume content' },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

/** Returns the snapshot for a given version string, or undefined if not found. */
export function getVersion(version: string): PortfolioSnapshot | undefined {
  return portfolioVersions[version];
}

/** Returns all version strings sorted newest-first. */
export function getVersionList(): string[] {
  return Object.keys(portfolioVersions).sort((a, b) => b.localeCompare(a, undefined, { numeric: true }));
}

/** Returns the latest snapshot. */
export function getLatestVersion(): PortfolioSnapshot {
  const latest = getVersionList()[0];
  return portfolioVersions[latest];
}
