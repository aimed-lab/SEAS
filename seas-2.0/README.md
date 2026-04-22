# SEAS 2.0

**Statistical Enrichment Analysis of Samples — a modern web rewrite with an AI Copilot.**

SEAS annotates the *metadata neighborhood* of any biological sample: given an embedding (UMAP/t-SNE) and a table of per-sample clinotypes, it identifies which clinical, molecular, or radiomic features are over-represented in a user-defined cohort versus the background population.

SEAS 2.0 preserves the statistical engine of the [original 2021 paper](https://www.frontiersin.org/journals/big-data/articles/10.3389/fdata.2021.725276/full) and adds:

- AI **Copilot** with agentic tool-calling (`seas.cohort.*`, `seas.enrich.*`, `seas.survival`, `seas.report.*`)
- **MCP** connectors (TCGA, cBioPortal, REDCap, FHIR, S3, GDC)
- Full workflow UI: Overview → Data Input → Relations → Cohort Selection → Discrete/Continuous Enrichment → Survival → Final Report
- Light/dark theme, persistent layout, keyboard shortcuts (⌘J, ⌘K, Alt+←/→)

## How to cite

> Nguyen TM, Bharti S, Yue Z, Willey CD and Chen JY (2021) *Statistical Enrichment Analysis of Samples: A General-Purpose Tool to Annotate Metadata Neighborhoods of Biological Samples.* Front. Big Data 4:725276. doi: [10.3389/fdata.2021.725276](https://doi.org/10.3389/fdata.2021.725276)

Copy-ready citation + BibTeX is also available in-app on the **About** screen.

## Running locally

The app is a self-contained React + Babel-standalone prototype — no build step required, but it must be served over HTTP (browsers block the JSX imports over `file://`).

```bash
# from the repo root
cd seas-2.0
python -m http.server 8000
# then open http://localhost:8000/
```

Or with Node:

```bash
cd seas-2.0 && npx serve .
```

`index.html` redirects to `SEAS 2.0.html`, which loads React + Babel from CDN and the six modules in `src/`.

> **Note:** The original SEAS v1 R/Shiny app still lives at the repo root (`global.R`, `server.R`, `ui.R`, `userInterface/`, `www/`). SEAS 2.0 is a parallel rewrite and does not replace it; both can coexist in the same repository.

## Project layout

```
.
├── index.html              # redirect → SEAS 2.0.html
├── SEAS 2.0.html           # app shell, CSS variables, theme init
├── src/
│   ├── icons.jsx           # line-icon set (shared)
│   ├── data.jsx            # seeded demo data (TCGA GBM, embedding, enrichment)
│   ├── plots.jsx           # SVG scatter / KM / KDE / box / volcano / sparkline
│   ├── ai.jsx              # Copilot panel, MCP picker, agent run UI
│   ├── screens.jsx         # every workflow screen (Overview … Report)
│   └── app.jsx             # sidebar, topbar, theme state, routing
├── handoff/                # original Claude Design handoff bundle (reference only)
└── CHANGELOG.md
```

## Keyboard shortcuts

| Shortcut | Action |
| --- | --- |
| `⌘J` / `Ctrl+J` | Toggle Copilot panel |
| `⌘K` / `Ctrl+K` | Focus global search |
| `Alt+←` / `Alt+→` | Step backward / forward through the workflow |

## Theme

Light/dark toggle lives in the top-right bar (sun/moon icon). The selection persists via `localStorage` (`seas-theme`) and respects `prefers-color-scheme` on first visit. CSS variables drive the whole palette, so custom brand overrides are a one-file change in `SEAS 2.0.html`.

## License

MIT — see the About screen for versioning details.
