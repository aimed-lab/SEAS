# Changelog

All notable changes to SEAS 2.0 are recorded here. Dates are in `YYYY-MM-DD`.

## [2.0.0-beta.15] — 2026-04-22

### Added
- **Light/dark theme** with a sun/moon toggle in the top-right bar. Persists to `localStorage` (`seas-theme`) and respects `prefers-color-scheme` on first load. Pre-paint theme init script in the HTML shell prevents a light-flash on reload.
- **Account menu** (top-right) with avatar, email, profile / settings / MCP connectors / docs shortcuts, inline theme switch, and sign-out action.
- **Full paper citation** front-and-center: Overview footer, About screen, and FAQ *Reference* section. One-click copy for the APA-style citation and BibTeX.
- **FAQ overhaul**: ~20 questions across six sections — *Concepts*, *Workflow*, *Statistics*, *AI features*, *Limitations*, *Reference* — grounded in Nguyen et al. (Front. Big Data, 2021). Covers metadata neighborhoods, clinotypes, hypergeometric vs. Fisher's exact, KS vs. Wilcoxon, BH vs. Bonferroni, embedding requirements, missing-data handling, and out-of-scope claims.

### Changed
- Renamed the organisation from **"AI-Medicine Lab"** → **"AI.MED lab"** everywhere it appears (sidebar, breadcrumbs, overview footer, report byline, About copy, FAQ reference).
- **Sidebar nav icons** enlarged from 15 px to 20 px (22 px collapsed) for better scannability.
- All hardcoded white/near-white backgrounds (`#fff`, `#efede8`, `#d9d7d1`, `#fbf6ee`, `#fffaf0`, etc.) migrated to CSS variables (`var(--surface)`, `var(--line-2)`, `var(--amber-grad)`, …) so the palette flips cleanly in dark mode.
- Topbar Copilot chip, sidebar MCP banner, and AI interpretation panels now use the themeable `--amber-grad` gradient token.

### Fixed
- SVG plot axes, grid lines, and legends are now readable against both light and dark backgrounds.

## [2.0.0-beta.14] — 2026-04-21

### Added
- Initial deployment of the Claude Design handoff bundle into the project root (`SEAS 2.0.html` + `src/*.jsx` + `index.html` redirect).
- Eight workflow screens (Overview, Data Input, Clinotype Relations, Cohort Selection, Discrete Enrichment, Continuous Enrichment, Survival, Final Report) plus FAQ + About.
- AI Copilot panel with agent plan, MCP connector picker, and canned demo conversation.
- Seeded demo dataset (TCGA GBM, 434 samples, 21 clinotypes) and SVG-native plots (UMAP scatter, Kaplan–Meier, KDE, box, volcano, sparkline).

### Known issues / deferred
- In-browser Babel transpilation adds ~200 ms of startup latency. Consider moving to a Vite build when the feature set stabilises.
- No missing-data imputation — consistent with the 2021 paper's scope.
