# SEAS — Statistical Enrichment Analysis of Samples

A general-purpose tool for annotating the **metadata neighborhood** of biological samples. Given a 2D embedding (UMAP / t-SNE) and a table of per-sample clinotypes, SEAS identifies which clinical, molecular, or radiomic features are statistically over-represented in a user-defined cohort versus the background population.

- **Documentation & tutorial:** https://aimed-uab.github.io/SEAS/
- **Hosted v1 app (R/Shiny):** https://aimed-lab.shinyapps.io/SEAS/
- **v2 web rewrite (in-repo):** [`seas-2.0/`](seas-2.0/) — modern React UI + AI Copilot

---

## Design

SEAS treats each sample as a point in an embedding space whose neighborhood encodes phenotypic similarity. By comparing a *selected cohort* (a region of that space) against the *full population*, SEAS asks: **which clinotypes are enriched here that aren't enriched everywhere else?**

The statistical engine, unchanged since the [2021 paper](https://www.frontiersin.org/journals/big-data/articles/10.3389/fdata.2021.725276/full), uses:

| Clinotype type | Test |
| --- | --- |
| Discrete (categorical) | Hypergeometric / Fisher's exact |
| Continuous (numeric) | Kolmogorov–Smirnov, Wilcoxon rank-sum |
| Survival | Log-rank (Kaplan–Meier) |

Multiple-testing correction via Benjamini–Hochberg (default) or Bonferroni. The user supplies the embedding — SEAS does not impute missing data, and the embedding's quality directly determines result quality.

---

## Functions

1. **Data input** — upload a clinical metadata table (TSV/CSV; first column = sample ID) and an optional embedding table (`sample_id, x, y`). If no embedding is provided, v1 can compute UMAP / t-SNE in-app.
2. **Clinotype relations** — automatically detect each column's data type and visualize pairwise relationships (grouped bar plots, scatter + linear fits) before any cohort is selected.
3. **Cohort selection** — three modes:
   - **Box selection** — draw a rectangle in the embedding view
   - **Neighbor-point selection** — pick a center sample + radius
   - **List entry** — paste sample IDs directly
4. **Discrete enrichment** — per-feature p-values with `# in population`, `# in cohort`, fold change, and adjusted p.
5. **Continuous enrichment** — KDE / box plots comparing cohort vs. background distributions.
6. **Survival analysis** — Kaplan–Meier curves and log-rank tests for cohort vs. rest.
7. **Final report** — exportable summary of the cohort, selected clinotypes, statistics, and plots.

The v2 web app adds:
- **AI Copilot** with agentic tool-calling (`seas.cohort.*`, `seas.enrich.*`, `seas.survival`, `seas.report.*`)
- **MCP connectors** (TCGA, cBioPortal, REDCap, FHIR, S3, GDC) for direct dataset import
- Light/dark theme, persistent layout, keyboard shortcuts (⌘J, ⌘K, Alt+←/→)

---

## Applications

SEAS is designed for two complementary questions:

1. **Hypothesis generation** — *"What characterizes this group of samples?"*
   Given a cohort of interest (e.g., long-survivors, treatment responders, an unusual cluster in the embedding), SEAS surfaces the clinotypes that distinguish it from the rest. Useful for cancer subtype discovery, treatment-arm comparison, and outlier characterization.

2. **Sample annotation** — *"What can we infer about this sample?"*
   For a sample with unknown attributes, define a cohort of its nearest neighbors in embedding space. Enriched clinotypes among those neighbors are statistical inferences about the unknown sample. Useful when clinical metadata is incomplete or expensive to obtain.

The original paper validates SEAS on TCGA glioblastoma (GBM) data; the v2 demo dataset preserves the same TCGA-GBM cohort (434 samples, 21 clinotypes) for parity.

---

## Repository layout

```
.
├── README.md                # this file
├── LICENSE                  # MIT
├── documentation.md         # extended v1 documentation (workflow figures, FAQ)
├── contact.md               # maintainer contact
│
├── global.R / server.R / ui.R   # SEAS v1 — R/Shiny app
├── userInterface/               # v1 UI assets
├── www/                         # v1 static assets
│
└── seas-2.0/                # SEAS v2 — React + Babel-standalone web app
    ├── SEAS 2.0.html
    ├── src/{ai,app,data,icons,plots,screens}.jsx
    ├── README.md            # v2-specific run/dev instructions
    └── CHANGELOG.md
```

Both implementations coexist — v1 remains the canonical hosted version, v2 is the in-progress rewrite.

---

## Running locally

### v1 (R/Shiny)

```r
# 1. Install packages listed at the top of global.R
# 2. Open the project in RStudio
# 3. Click "Run App"
```
R 3.6.3 is the reference version.

### v2 (web)

```bash
cd seas-2.0
python3 -m http.server 8000   # or: npx serve .
# open http://localhost:8000/
```
No build step — React + Babel are loaded from CDN. See [`seas-2.0/README.md`](seas-2.0/README.md) for full v2 details.

---

## Citation

> Nguyen TM, Bharti S, Yue Z, Willey CD and Chen JY (2021) *Statistical Enrichment Analysis of Samples: A General-Purpose Tool to Annotate Metadata Neighborhoods of Biological Samples.* **Front. Big Data** 4:725276. doi: [10.3389/fdata.2021.725276](https://doi.org/10.3389/fdata.2021.725276)

Copy-ready APA + BibTeX are available in the v2 app's **About** screen.

---

## Contact

Questions, feedback, or contributed datasets:

- [jakechen@uab.edu](mailto:jakechen@uab.edu) — Jake Chen (PI, AI.MED Lab)
- [thamnguy@uab.edu](mailto:thamnguy@uab.edu) — Thanh Nguyen (architect)
- [sbharti@uab.edu](mailto:sbharti@uab.edu) — Samuel Bharti (programmer)

## License

MIT — see [LICENSE](LICENSE).
