// Top-level app shell: sidebar + topbar + screen routing + chat panel state.

const { useState: uS2, useMemo: uM2, useEffect: uE2 } = React;

const workflowNav = [
  { group: "Input", items: [
    { id: "overview", label: "Overview", icon: "grid" },
    { id: "input", label: "Data Input", icon: "upload" },
  ]},
  { group: "Explore", items: [
    { id: "relations", label: "Clinotype Relations", icon: "link" },
  ]},
  { group: "Define", items: [
    { id: "cohort", label: "Cohort Selection", icon: "target" },
  ]},
  { group: "Enrichment", items: [
    { id: "discrete", label: "Discrete Clinotype", icon: "chart" },
    { id: "continuous", label: "Continuous Clinotype", icon: "trending" },
  ]},
  { group: "Survival", items: [
    { id: "survival", label: "Survival Analysis", icon: "skull" },
  ]},
  { group: "Report", items: [
    { id: "report", label: "Final Report", icon: "doc" },
  ]},
  { group: "Help", items: [
    { id: "faqs", label: "FAQs", icon: "help" },
    { id: "about", label: "About Us", icon: "users" },
  ]},
];

const screenOrder = ["overview","input","relations","cohort","discrete","continuous","survival","report"];

const Sidebar = ({ screen, onNav, collapsed, onToggle }) => (
  <aside style={{
    width: collapsed ? 58 : 236,
    background: "var(--surface)",
    borderRight: "1px solid var(--line)",
    display: "flex", flexDirection: "column",
    transition: "width .18s ease",
    flexShrink: 0, position:"sticky", top:0, height:"100vh"
  }}>
    <div style={{padding: collapsed ? "14px 10px" : "14px 16px", display:"flex", alignItems:"center", gap:10, borderBottom:"1px solid var(--line)"}}>
      <div style={{width:28, height:28, borderRadius:8, background:"var(--ink-solid)", display:"grid", placeItems:"center", color:"var(--ink-solid-fg)"}}>
        <svg width="16" height="16" viewBox="0 0 20 20"><path d="M4 14c2 2 5 2 7 0s5-2 7 0" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/><path d="M4 9c2 2 5 2 7 0s5-2 7 0" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/></svg>
      </div>
      {!collapsed && (<>
        <div style={{lineHeight:1.1, flex:1}}>
          <div style={{fontWeight:700, letterSpacing:"-.01em"}}>SEAS <span className="mono" style={{fontSize:11, color:"var(--ink-3)", fontWeight:500}}>2.0</span></div>
          <div style={{fontSize:11, color:"var(--ink-3)"}}>Jake Y. Chen, PhD</div>
        </div>
      </>)}
      <button className="btn sm ghost" onClick={onToggle} style={{padding:"4px 6px"}}>
        <Icon name={collapsed ? "chevR" : "chevL"} size={13}/>
      </button>
    </div>

    <nav style={{flex:1, overflowY:"auto", padding: collapsed ? "8px 6px" : "10px 10px"}}>
      {workflowNav.map((g, gi) => (
        <div key={g.group} style={{marginTop: gi ? 10 : 0}}>
          {!collapsed && <div style={{fontSize:10.5, textTransform:"uppercase", letterSpacing:".08em", color:"var(--ink-4)", padding:"6px 8px 4px"}}>{g.group}</div>}
          {g.items.map(it => {
            const active = screen === it.id;
            return (
              <button key={it.id} onClick={()=>onNav(it.id)} style={{
                width:"100%", textAlign:"left", display:"flex", alignItems:"center", gap:10,
                padding: collapsed ? "9px 10px" : "8px 10px",
                borderRadius: 8, border: 0, cursor: "pointer",
                background: active ? "var(--ink-solid)" : "transparent",
                color: active ? "#f2f1ec" : "var(--ink-2)",
                fontSize: 13, margin: "1px 0", justifyContent: collapsed ? "center" : "flex-start",
              }}>
                <Icon name={it.icon} size={collapsed ? 22 : 20} style={{color: active ? "var(--ink-solid-fg)" : "var(--ink-3)", flexShrink:0}}/>
                {!collapsed && <span>{it.label}</span>}
                {!collapsed && active && <Icon name="chevR" size={13} style={{marginLeft:"auto", opacity:.7}}/>}
              </button>
            );
          })}
        </div>
      ))}
    </nav>

    {!collapsed && (
      <div style={{padding:10, borderTop:"1px solid var(--line)"}}>
        <div className="ai-border" style={{borderRadius:10, padding:"8px 10px", background:"linear-gradient(180deg,var(--surface),var(--amber-grad))", display:"flex", alignItems:"center", gap:8}}>
          <Icon name="plug" size={14} style={{color:"var(--teal-ink)"}}/>
          <div style={{flex:1, lineHeight:1.1}}>
            <div style={{fontSize:12, fontWeight:600}}>MCP sources</div>
            <div style={{fontSize:10.5, color:"var(--ink-3)"}}>{mcpCatalog.filter(m=>m.connected).length} of {mcpCatalog.length} connected</div>
          </div>
          <Icon name="chevR" size={12} style={{color:"var(--ink-3)"}}/>
        </div>
      </div>
    )}
  </aside>
);

// Sun/moon icons inlined here (not in icons.jsx so we don't fork the shared file).
const ThemeIcon = ({ theme, size=14 }) => {
  const stroke = { fill:"none", stroke:"currentColor", strokeWidth:1.5, strokeLinecap:"round", strokeLinejoin:"round" };
  return (
    <svg width={size} height={size} viewBox="0 0 20 20" aria-hidden="true">
      {theme === "dark" ? (
        <path d="M15.5 12.5A6.5 6.5 0 0 1 7.5 4.5a6.5 6.5 0 1 0 8 8Z" {...stroke}/>
      ) : (
        <>
          <circle cx="10" cy="10" r="3.5" {...stroke}/>
          <path d="M10 2v1.5M10 16.5V18M2 10h1.5M16.5 10H18M4.4 4.4l1.1 1.1M14.5 14.5l1.1 1.1M4.4 15.6l1.1-1.1M14.5 5.5l1.1-1.1" {...stroke}/>
        </>
      )}
    </svg>
  );
};

const Topbar = ({ onToggleChat, chatOpen, screen, theme, onToggleTheme, onOpenMenu, user }) => {
  const [menuOpen, setMenuOpen] = uS2(false);
  const label = {
    overview:"Overview", input:"Data Input", relations:"Clinotype Relations",
    cohort:"Cohort Selection", discrete:"Discrete Enrichment",
    continuous:"Continuous Enrichment", survival:"Survival Analysis", report:"Final Report",
    faqs:"FAQs", about:"About",
  }[screen] || "SEAS";
  return (
    <header style={{
      position:"sticky", top:0, zIndex:30,
      background: theme==="dark" ? "rgba(20,19,17,.85)" : "rgba(247,246,243,.85)",
      backdropFilter:"blur(8px)",
      borderBottom:"1px solid var(--line)", display:"flex", alignItems:"center", gap:12, padding:"10px 20px"
    }}>
      <div style={{display:"flex", alignItems:"center", gap:8, fontSize:12.5, color:"var(--ink-3)"}}>
        <Icon name="folder" size={13}/> Jake Y. Chen, PhD
        <span>/</span>
        <span style={{color:"var(--ink)"}}>GBM case-study</span>
        <span>/</span>
        <span style={{color:"var(--ink)", fontWeight:500}}>{label}</span>
      </div>
      <div style={{flex:1}}/>
      <div style={{position:"relative"}}>
        <Icon name="search" size={14} style={{position:"absolute", left:10, top:9, color:"var(--ink-4)"}}/>
        <input placeholder="Search dataset, clinotypes, runs…" style={{
          width:320, padding:"7px 30px 7px 32px", border:"1px solid var(--line)", borderRadius:8, fontSize:12.5,
          background:"var(--surface)", outline:"none", color:"var(--ink)"
        }}/>
        <span className="kbd" style={{position:"absolute", right:8, top:7}}>⌘K</span>
      </div>
      <button className="btn sm"><Icon name="help" size={13}/> Docs</button>
      <button
        className="btn sm"
        onClick={onToggleTheme}
        title={theme==="dark" ? "Switch to light mode" : "Switch to dark mode"}
        aria-label="Toggle color theme"
        style={{padding:"7px 9px"}}
      >
        <ThemeIcon theme={theme} size={14}/>
      </button>
      <button className="btn sm" onClick={onToggleChat} style={{borderColor: chatOpen?"rgba(184,96,26,.4)":"var(--line)", background: chatOpen?"var(--amber-grad)":"var(--surface)"}}>
        <Icon name="sparkle" size={13} style={{color:"var(--amber)"}}/> Copilot {chatOpen?"·":""}
      </button>
      <div style={{position:"relative"}}>
        <button
          onClick={()=>setMenuOpen(v=>!v)}
          aria-label="Account menu"
          style={{
            display:"flex", alignItems:"center", gap:6, padding:3, border:"1px solid var(--line)",
            background:"var(--surface)", borderRadius:999, cursor:"pointer"
          }}
        >
          <div style={{width:26, height:26, borderRadius:"50%", background:"var(--indigo)", color:"#fff", display:"grid", placeItems:"center", fontSize:11.5, fontWeight:600}}>{user.initials}</div>
          <Icon name="chevD" size={12} style={{color:"var(--ink-3)", marginRight:4}}/>
        </button>
        {menuOpen && (
          <>
            <div onClick={()=>setMenuOpen(false)} style={{position:"fixed", inset:0, zIndex:40}}/>
            <div className="fade-up" style={{
              position:"absolute", right:0, top:"calc(100% + 6px)", zIndex:41,
              width:240, background:"var(--surface)", border:"1px solid var(--line)",
              borderRadius:10, boxShadow:"var(--shadow-md)", overflow:"hidden"
            }}>
              <div style={{padding:"10px 12px", borderBottom:"1px solid var(--line)", display:"flex", alignItems:"center", gap:10}}>
                <div style={{width:32, height:32, borderRadius:"50%", background:"var(--indigo)", color:"#fff", display:"grid", placeItems:"center", fontSize:12, fontWeight:600}}>{user.initials}</div>
                <div style={{flex:1, lineHeight:1.2, minWidth:0}}>
                  <div style={{fontSize:13, fontWeight:600, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap"}}>{user.name}</div>
                  <div style={{fontSize:11, color:"var(--ink-3)", overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap"}}>{user.email}</div>
                </div>
              </div>
              {[
                {icon:"users", label:"Account profile"},
                {icon:"settings", label:"Settings"},
                {icon:"plug", label:"MCP connectors"},
                {icon:"help", label:"Docs & shortcuts"},
              ].map((item,i)=>(
                <button key={i} onClick={()=>{ setMenuOpen(false); onOpenMenu && onOpenMenu(item.label); }} style={{
                  display:"flex", alignItems:"center", gap:10, width:"100%", padding:"9px 12px",
                  border:0, borderTop: i ? "1px solid var(--line-2)" : "none",
                  background:"transparent", cursor:"pointer", fontSize:13, color:"var(--ink-2)", textAlign:"left"
                }}>
                  <Icon name={item.icon} size={14} style={{color:"var(--ink-3)"}}/>
                  {item.label}
                </button>
              ))}
              <div style={{display:"flex", alignItems:"center", gap:10, padding:"9px 12px", borderTop:"1px solid var(--line-2)", fontSize:13, color:"var(--ink-2)"}}>
                <ThemeIcon theme={theme} size={14}/>
                <span style={{flex:1}}>Theme</span>
                <div style={{display:"flex", gap:0, border:"1px solid var(--line)", borderRadius:6, overflow:"hidden"}}>
                  {["light","dark"].map(t => (
                    <button key={t} onClick={()=>{ if(t!==theme) onToggleTheme(); }} style={{
                      padding:"3px 8px", fontSize:11, border:0, cursor:"pointer",
                      background: theme===t ? "var(--ink)" : "transparent",
                      color: theme===t ? (theme==="dark"?"#171715":"#fff") : "var(--ink-3)",
                      textTransform:"capitalize"
                    }}>{t}</button>
                  ))}
                </div>
              </div>
              <button onClick={()=>{ setMenuOpen(false); onOpenMenu && onOpenMenu("Sign out"); }} style={{
                display:"flex", alignItems:"center", gap:10, width:"100%", padding:"9px 12px",
                border:0, borderTop:"1px solid var(--line-2)",
                background:"transparent", cursor:"pointer", fontSize:13, color:"var(--bad)", textAlign:"left"
              }}>
                <Icon name="x" size={14}/> Sign out
              </button>
            </div>
          </>
        )}
      </div>
    </header>
  );
};

// Footer status bar
const StatusBar = ({ runningAgent, screen, dataset, onToggleChat }) => (
  <footer style={{
    position:"sticky", bottom:0, zIndex:20,
    borderTop:"1px solid var(--line)", background:"var(--surface)",
    padding:"6px 16px", display:"flex", alignItems:"center", gap:14, fontSize:11.5, color:"var(--ink-3)"
  }}>
    <span><Icon name="check" size={11} style={{color:"#2f6b3a"}}/> Ready</span>
    <span className="mono">{dataset.name} · {dataset.samples} samples</span>
    <span>·</span>
    <span>Screen: <span style={{color:"var(--ink)"}}>{screen}</span></span>
    <span>·</span>
    <span><Icon name="plug" size={11}/> {mcpCatalog.filter(m=>m.connected).length} MCP sources</span>
    {runningAgent && (
      <span className="chip warn" style={{padding:"1px 8px"}}>
        <span className="dot thinking-dot"/> agent running
      </span>
    )}
    <div style={{flex:1}}/>
    <span className="mono">build 2.0.0-beta.14</span>
    <button className="btn sm ghost" onClick={onToggleChat}><Icon name="sparkle" size={12}/> ⌘J</button>
  </footer>
);

// Help/FAQ screen
const faqSections = [
  {
    group: "Concepts",
    items: [
      {
        q: "What is SEAS?",
        a: (
          <>
            <p>SEAS (<strong>Statistical Enrichment Analysis of Samples</strong>) is a general-purpose tool for annotating the <em>metadata neighborhood</em> of any biological sample. Given a sample set with both an embedding (e.g., UMAP/t-SNE coordinates) and a table of per-sample clinical attributes, SEAS identifies which attributes are over-represented in a user-defined cohort compared to the background population.</p>
            <p>SEAS was introduced by Nguyen et al. (<span className="mono">Frontiers in Big Data</span>, 2021) to fill a gap between simple filter tools and heavyweight ML platforms: it focuses on <em>sample sets</em> — not individual patients — and answers the question "what makes this group of samples different?" using well-understood, reproducible statistics.</p>
          </>
        ),
      },
      {
        q: "What is a \"metadata neighborhood\"?",
        a: (
          <>
            <p>A metadata neighborhood is the set of clinical and phenotypic characteristics shared among biologically similar samples. SEAS finds these neighborhoods by combining two ingredients:</p>
            <ol style={{margin:"6px 0 0 18px", padding:0}}>
              <li><strong>Similarity in feature space</strong> — typically a 2D embedding (UMAP or t-SNE) computed from omics, imaging, or other high-dimensional features.</li>
              <li><strong>Enrichment in metadata space</strong> — statistical tests that ask whether clinotypes (age, subtype, treatment, survival days, etc.) are unevenly distributed between a neighborhood and the population.</li>
            </ol>
            <p style={{marginTop:8}}>Biologically similar samples with a shared metadata signature define a <em>neighborhood</em>; SEAS annotates it.</p>
          </>
        ),
      },
      {
        q: "What are clinotypes?",
        a: (
          <>
            <p><strong>Clinotype</strong> is the paper's term for any clinical or phenotypic measurement attached to a sample: demographic (age, gender), treatment (chemo type, days on drug), pathological (subtype, grade), radiomic (tumor longest dimension), or outcome (OS, PFS). SEAS treats clinotypes uniformly and supports two kinds:</p>
            <ul style={{margin:"6px 0 0 18px", padding:0}}>
              <li><strong>Discrete / categorical</strong> — e.g., <span className="mono">subtype ∈ {"{Classical, Mesenchymal, Proneural, Neural}"}</span>.</li>
              <li><strong>Continuous / numerical</strong> — e.g., <span className="mono">CDE_DxAge</span>, <span className="mono">longest_dimension</span>.</li>
            </ul>
            <p style={{marginTop:8}}>Continuous clinotypes may optionally be <em>discretized</em> (e.g., survival time &lt; 300 days vs. ≥ 300 days) so the same categorical enrichment test can be applied to them.</p>
          </>
        ),
      },
      {
        q: "What kinds of data work with SEAS?",
        a: (
          <p>Any dataset where each sample has (a) a set of features used to compute similarity and (b) a table of clinotypes. Typical inputs: TCGA/cBioPortal omics cohorts, radiomic feature tables, PDX panels, imaging biomarker tables, and REDCap clinical captures. If you don't have an embedding yet, upload raw features and SEAS will compute UMAP for you — or bring your own coordinates from an external tool.</p>
        ),
      },
    ],
  },
  {
    group: "Workflow",
    items: [
      {
        q: "How does SEAS select a cohort?",
        a: (
          <>
            <p>The paper describes three selection modes, all preserved in SEAS 2.0:</p>
            <ul style={{margin:"6px 0 0 18px", padding:0}}>
              <li><strong>Manual</strong> — enter sample IDs directly.</li>
              <li><strong>Semi-automatic</strong> — pick a pivot sample and a radius / neighborhood size <em>k</em>. SEAS returns every sample inside that Euclidean ball in embedding space.</li>
              <li><strong>Fully automatic</strong> — run density-based clustering (DBSCAN in v1; available as "auto-cluster" in v2) to partition the population into candidate subcohorts.</li>
            </ul>
            <p style={{marginTop:8}}>SEAS 2.0 adds two more: <strong>lasso / box selection</strong> on the scatter and <strong>natural-language description</strong> (the Copilot builds a filter from plain English).</p>
          </>
        ),
      },
      {
        q: "Why does SEAS need an embedding?",
        a: (
          <>
            <p>Neighborhoods are only meaningful if "similar" is well-defined. SEAS computes sample-to-sample distance on a 2D embedding — by default UMAP, with t-SNE as an alternative — so that Euclidean distance between points reflects biological similarity in the original feature space.</p>
            <p>If clinical data alone isn't rich enough, the paper recommends computing the embedding externally from the full omics feature set and passing those coordinates to SEAS. You can also mix-and-match: upload an embedding computed elsewhere and let SEAS do everything downstream.</p>
          </>
        ),
      },
      {
        q: "What similarity metric does SEAS use?",
        a: (
          <>
            <p>By default, <strong>Euclidean distance</strong> on the 2D embedding:</p>
            <div className="mono" style={{fontSize:12.5, background:"var(--surface-2)", padding:"8px 10px", borderRadius:6, border:"1px solid var(--line)", marginTop:6}}>d(i, j) = √( (xᵢ − xⱼ)² + (yᵢ − yⱼ)² )</div>
            <p style={{marginTop:8}}>The paper also supports cosine similarity and the Jaccard index, which can be useful for sparse or binary feature sets. For most clinical/omics use cases Euclidean on UMAP coordinates is a sensible default.</p>
          </>
        ),
      },
    ],
  },
  {
    group: "Statistics",
    items: [
      {
        q: "What statistical tests does SEAS run?",
        a: (
          <>
            <p>The paper's core enrichment framework — called <strong>Clinical Feature Enrichment Analysis (CFEA)</strong> — chooses a test per clinotype type:</p>
            <ul style={{margin:"6px 0 0 18px", padding:0}}>
              <li><strong>Categorical clinotypes</strong> → <span className="mono">hypergeometric test</span> (equivalent to one-sided Fisher's exact) comparing the proportion of samples carrying a given value inside vs. outside the cohort.</li>
              <li><strong>Continuous clinotypes</strong> → <span className="mono">Wilcoxon rank-sum</span> for direct comparison, or discretize (e.g., <span className="mono">&lt; 300d</span> vs. <span className="mono">≥ 300d</span>) and apply the hypergeometric test.</li>
            </ul>
            <p style={{marginTop:8}}>SEAS 2.0 keeps hypergeometric/Fisher's exact for discrete clinotypes, substitutes the <strong>Kolmogorov–Smirnov test</strong> for continuous ones (picks up distribution shape differences the rank-sum misses), and adds a survival module with <strong>log-rank</strong> + <strong>Cox proportional hazards</strong>. Results remain numerically comparable to v1 on case-study datasets.</p>
          </>
        ),
      },
      {
        q: "What's the null hypothesis for a discrete enrichment test?",
        a: (
          <>
            <p>Quoting the paper: "<em>the proportion of patients having attribute C in the subcohort and the whole population is the same.</em>" Rejecting the null means the cohort is enriched (or depleted) for that clinotype value.</p>
            <p>SEAS reports the p-value, a BH-adjusted q-value, and an odds ratio so you can judge both statistical and effect size.</p>
          </>
        ),
      },
      {
        q: "How does SEAS correct for multiple testing?",
        a: (
          <>
            <p>The 2021 paper uses the <strong>Bonferroni correction</strong> — conservative but easy to interpret. SEAS 2.0 switches to the <strong>Benjamini–Hochberg (BH) procedure</strong> for FDR control, which scales better when hundreds of clinotype values are tested at once (e.g., 304 categorical tests in the GBM demo).</p>
            <p>Both are available — you can toggle Bonferroni in the discrete-enrichment settings if you want paper-equivalent numbers.</p>
          </>
        ),
      },
      {
        q: "How is survival analyzed?",
        a: (
          <>
            <p>Survival is treated as a continuous clinotype in the original paper — you can discretize (e.g., <span className="mono">OS.time ≥ 300d</span>) and apply the hypergeometric test. SEAS 2.0 adds a dedicated <strong>Survival Analysis</strong> screen that fits Kaplan–Meier curves for cohort vs. population, runs a <strong>log-rank test</strong>, and optionally fits a <strong>Cox proportional-hazards model</strong> adjusted for user-selected covariates. Number-at-risk tables and median OS are reported alongside the HR and 95% CI.</p>
          </>
        ),
      },
    ],
  },
  {
    group: "AI features (SEAS 2.0)",
    items: [
      {
        q: "How does the AI Copilot work?",
        a: (
          <>
            <p>Copilot is an <strong>agent</strong> that plans multi-step analyses in plain English and calls SEAS tools (<span className="mono">seas.cohort.neighborhood</span>, <span className="mono">seas.enrich.discrete</span>, etc.) plus any configured MCP data sources. Every tool call is logged with its inputs and outputs, so the full analysis is reproducible from the conversation log alone.</p>
            <p>Copilot cannot fabricate statistics — it must call a SEAS tool to produce any number in the report, and those tool calls are cited inline.</p>
          </>
        ),
      },
      {
        q: "What are MCP sources?",
        a: (
          <p>Model Context Protocol servers your admin has connected — TCGA, cBioPortal, REDCap, hospital FHIR, S3 buckets, GDC, etc. The agent reads (and, where allowed, writes) through them. Connecting a new MCP source is a one-time admin action; the Copilot picker surfaces only the sources available to your workspace.</p>
        ),
      },
      {
        q: "Can I run SEAS without the AI features?",
        a: (
          <p>Yes. Every screen has manual controls equivalent to the paper's original Shiny app — pivot + k-NN pickers, filter boxes, test toggles, export buttons. The Copilot panel can be disabled per-workspace in admin settings, and the statistical engine does not depend on it.</p>
        ),
      },
      {
        q: "Is SEAS 2.0 reproducible with v1 results?",
        a: (
          <p>Yes — numerically, on the cases we've validated. The underlying tests are identical or very close (hypergeometric/Fisher's exact for discrete; choice of Wilcoxon vs. KS for continuous; BH vs. Bonferroni swappable). Embeddings use the same UMAP defaults. The 2021 GBM + PDX case-study reproduces to within rounding.</p>
        ),
      },
    ],
  },
  {
    group: "Limitations",
    items: [
      {
        q: "Does SEAS handle missing data?",
        a: (
          <>
            <p>The original paper is explicit: "<em>We have not implemented techniques handling missing values in patients' clinical data.</em>" The test behavior when a clinotype is missing is to drop those samples from the test's denominator — fine if missingness is low (the paper's GBM case-study tolerates ~10% missing per attribute), but misleading if missingness is correlated with outcome.</p>
            <p>SEAS 2.0 flags per-clinotype missing rates in the QC panel and lets you filter out high-missing clinotypes, but does not impute. If you need imputation, do it upstream.</p>
          </>
        ),
      },
      {
        q: "What size of dataset do I need?",
        a: (
          <p>The hypergeometric test has no minimum size, but statistical power grows with cohort size and effect size. The paper's reference case-study uses <strong>389 TCGA-GBM patients</strong> with <strong>29 clinotypes</strong> (22 categorical, 7 numerical) and a <strong>45-sample PDX panel</strong>; cohorts as small as 16–45 produced publishable signal. For very small cohorts (&lt;10) prefer exact tests and report effect sizes rather than p-values alone.</p>
        ),
      },
      {
        q: "What if my embedding is bad?",
        a: (
          <p>"Garbage in, garbage out." The paper notes that if clinical data alone doesn't define meaningful similarity, you should compute the embedding from the richer feature set (omics, imaging, etc.) externally and pass the coordinates to SEAS. SEAS will warn you if the UMAP it computed has effectively no structure (single dominant cluster, stress above a threshold).</p>
        ),
      },
      {
        q: "Is enrichment causal?",
        a: (
          <p>No. Enrichment is <em>associational</em> — it tells you which clinotypes co-occur with a cohort, not why. Two strongly enriched clinotypes are often one biological signal (e.g., Cluster 1 + Mesenchymal subtype + large tumor are highly correlated in GBM). SEAS surfaces co-enrichment but cannot disentangle it. For causal claims, combine SEAS findings with a targeted Cox model or an external causal inference tool.</p>
        ),
      },
      {
        q: "What's out of scope for SEAS?",
        a: (
          <>
            <p>SEAS intentionally does not do:</p>
            <ul style={{margin:"6px 0 0 18px", padding:0}}>
              <li>Supervised classification / prediction (use a dedicated ML stack).</li>
              <li>Single-cell or sub-sample resolution (SEAS operates on whole samples/patients).</li>
              <li>Longitudinal modeling (cohorts are treated as static snapshots).</li>
              <li>Raw genomic processing (input is already sample × clinotype tables).</li>
            </ul>
          </>
        ),
      },
    ],
  },
  {
    group: "Reference",
    items: [
      {
        q: "Where's the paper and source code?",
        a: (
          <>
            <p>Nguyen TM, Bharti S, Yue Z, Willey CD, Chen JY. <em>Statistical Enrichment Analysis of Samples: A General-Purpose Tool to Annotate Metadata Neighborhoods of Biological Samples.</em> Front. Big Data 4:725276 (2021). doi:10.3389/fdata.2021.725276</p>
            <ul style={{margin:"6px 0 0 18px", padding:0}}>
              <li>Paper: <a href="https://www.frontiersin.org/journals/big-data/articles/10.3389/fdata.2021.725276/full" target="_blank" rel="noreferrer" style={{color:"var(--teal-ink)"}}>frontiersin.org/…/fdata.2021.725276</a></li>
              <li>Original Shiny app: <a href="https://aimed-lab.shinyapps.io/SEAS/" target="_blank" rel="noreferrer" style={{color:"var(--teal-ink)"}}>aimed-lab.shinyapps.io/SEAS</a></li>
              <li>Source: <a href="https://github.com/aimed-uab/SEAS" target="_blank" rel="noreferrer" style={{color:"var(--teal-ink)"}}>github.com/aimed-uab/SEAS</a></li>
            </ul>
          </>
        ),
      },
      {
        q: "How should I cite SEAS 2.0?",
        a: (
          <p>Cite the 2021 paper for the method. The 2.0 rewrite preserves the method; if you want to reference the rewrite specifically, cite the 2021 paper and note "SEAS 2.0 (Chen JY, 2026)" in Methods.</p>
        ),
      },
    ],
  },
];

const FAQScreen = ({ onBack }) => (
  <div style={{padding:"28px 28px 48px", maxWidth:920, margin:"0 auto"}}>
    <PageHeader
      step={1} totalSteps={1}
      title="FAQs"
      subtitle="Concepts, workflow, statistics, AI features, and limitations — grounded in the 2021 SEAS paper (Nguyen et al., Front. Big Data)."
      onBack={onBack}
    />
    {faqSections.map((sec, si) => (
      <div key={sec.group} style={{marginTop: si ? 22 : 18}}>
        <div style={{fontSize:11, color:"var(--ink-3)", textTransform:"uppercase", letterSpacing:".08em", padding:"0 4px 8px"}}>{sec.group}</div>
        <div className="card">
          {sec.items.map((x,i)=>(
            <details key={i} style={{padding:"14px 18px", borderTop:i?"1px solid var(--line-2)":"none"}}>
              <summary style={{fontSize:14, fontWeight:500, cursor:"pointer", listStyle:"none", display:"flex", alignItems:"center", gap:10}}>
                <Icon name="chevR" size={13} style={{color:"var(--ink-3)", flexShrink:0}}/>
                <span>{x.q}</span>
              </summary>
              <div style={{fontSize:13, color:"var(--ink-2)", lineHeight:1.6, marginTop:10, paddingLeft:23}}>{x.a}</div>
            </details>
          ))}
        </div>
      </div>
    ))}
    <div style={{marginTop:22, padding:"14px 18px", border:"1px solid var(--line)", borderRadius:10, background:"var(--surface-2)", fontSize:12, color:"var(--ink-3)"}}>
      Didn't find your answer? Open the Copilot (<span className="kbd">⌘J</span>) and ask — it has the full paper indexed as a reference.
    </div>
  </div>
);

const AboutScreen = ({ onBack })=>{
  const citation = "Nguyen TM, Bharti S, Yue Z, Willey CD and Chen JY (2021) Statistical Enrichment Analysis of Samples: A General-Purpose Tool to Annotate Metadata Neighborhoods of Biological Samples. Front. Big Data 4:725276. doi: 10.3389/fdata.2021.725276";
  const bibtex = `@article{Nguyen2021SEAS,
  author  = {Nguyen, Thanh M. and Bharti, Samuel and Yue, Zongliang and Willey, Christopher D. and Chen, Jake Y.},
  title   = {Statistical Enrichment Analysis of Samples: A General-Purpose Tool to Annotate Metadata Neighborhoods of Biological Samples},
  journal = {Frontiers in Big Data},
  volume  = {4},
  pages   = {725276},
  year    = {2021},
  doi     = {10.3389/fdata.2021.725276},
  url     = {https://www.frontiersin.org/articles/10.3389/fdata.2021.725276/full}
}`;
  return (
    <div style={{padding:"28px 28px 48px", maxWidth:920, margin:"0 auto"}}>
      <PageHeader step={1} totalSteps={1} title="About SEAS" subtitle="A tool by Jake Y. Chen, PhD to annotate metadata neighborhoods of biological samples." onBack={onBack}/>
      <div className="card" style={{marginTop:18, padding:22}}>
        <p style={{fontSize:13.5, lineHeight:1.6, color:"var(--ink-2)"}}>SEAS 2.0 is a rewrite of the original SEAS Shiny app in a modern web stack with an AI Copilot, MCP-based data connectors, and agentic execution. The core statistics — Fisher's, KS, log-rank, Cox — remain identical, so results from v1.1 are reproducible.</p>
        <div style={{display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:12, marginTop:14}}>
          <Stat label="Version" value="2.0.0-beta.14"/>
          <Stat label="Release" value="Apr 2026"/>
          <Stat label="License" value="MIT"/>
        </div>
      </div>

      <div className="card" style={{marginTop:16}}>
        <div className="card-head">
          <div>
            <div className="card-title">How to cite SEAS</div>
            <div className="card-sub">Please cite the 2021 Frontiers in Big Data paper in any work that uses SEAS.</div>
          </div>
        </div>
        <div style={{padding:"14px 18px"}}>
          <div style={{fontSize:13.5, lineHeight:1.6, color:"var(--ink)", padding:"12px 14px", border:"1px solid var(--line)", borderRadius:8, background:"var(--surface-2)"}}>
            Nguyen TM, Bharti S, Yue Z, Willey CD and Chen JY (2021) <em>Statistical Enrichment Analysis of Samples: A General-Purpose Tool to Annotate Metadata Neighborhoods of Biological Samples.</em> Front. Big Data 4:725276. <span className="mono">doi: 10.3389/fdata.2021.725276</span>
          </div>

          <div style={{display:"flex", gap:8, marginTop:12, flexWrap:"wrap"}}>
            <a href="https://www.frontiersin.org/journals/big-data/articles/10.3389/fdata.2021.725276/full" target="_blank" rel="noreferrer" className="btn sm">
              <Icon name="link" size={13}/> Open in Frontiers
            </a>
            <a href="https://doi.org/10.3389/fdata.2021.725276" target="_blank" rel="noreferrer" className="btn sm">
              <Icon name="doc" size={13}/> DOI · 10.3389/fdata.2021.725276
            </a>
            <button className="btn sm" onClick={()=>navigator.clipboard?.writeText(citation)}>
              <Icon name="copy" size={13}/> Copy citation
            </button>
            <button className="btn sm" onClick={()=>navigator.clipboard?.writeText(bibtex)}>
              <Icon name="copy" size={13}/> Copy BibTeX
            </button>
          </div>

          <details style={{marginTop:12}}>
            <summary style={{fontSize:12.5, color:"var(--ink-3)", cursor:"pointer"}}>Show BibTeX</summary>
            <pre className="mono" style={{fontSize:11.5, lineHeight:1.55, background:"var(--surface-2)", border:"1px solid var(--line)", borderRadius:8, padding:12, marginTop:8, overflow:"auto", color:"var(--ink-2)"}}>{bibtex}</pre>
          </details>

          <div style={{marginTop:14, fontSize:12, color:"var(--ink-3)"}}>
            Original Shiny app: <a href="https://aimed-lab.shinyapps.io/SEAS/" target="_blank" rel="noreferrer" style={{color:"var(--teal-ink)"}}>aimed-lab.shinyapps.io/SEAS</a>
            {" · "}
            Source: <a href="https://github.com/aimed-uab/SEAS" target="_blank" rel="noreferrer" style={{color:"var(--teal-ink)"}}>github.com/aimed-uab/SEAS</a>
          </div>
        </div>
      </div>
    </div>
  );
};

// ---------- App ----------
const currentUser = { name: "Jake Y. Chen", email: "jakechen@uab.edu", initials: "JC" };

const App = () => {
  const [screen, setScreen] = uS2(() => localStorage.getItem("seas-screen") || "overview");
  const [chatOpen, setChatOpen] = uS2(() => localStorage.getItem("seas-chat") === "1");
  const [collapsed, setCollapsed] = uS2(false);
  const [pivotId, setPivotId] = uS2("TCGA-02-0001-01");
  const [runningAgent, setRunningAgent] = uS2(false);
  const [agentStep, setAgentStep] = uS2(0);
  const [theme, setTheme] = uS2(() =>
    document.documentElement.getAttribute("data-theme") ||
    localStorage.getItem("seas-theme") ||
    "light"
  );
  const toggleTheme = () => setTheme(t => (t === "dark" ? "light" : "dark"));

  uE2(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("seas-theme", theme);
  }, [theme]);

  // precomputed cohort around pivot
  const cohortIds = uM2(() => {
    const p = embedding.find(e => e.id === pivotId) || embedding[0];
    return embedding
      .map(d => ({ id: d.id, d: Math.hypot(d.x - p.x, d.y - p.y) }))
      .sort((a,b) => a.d - b.d)
      .slice(0, 16)
      .map(d => d.id);
  }, [pivotId]);

  uE2(() => { localStorage.setItem("seas-screen", screen); }, [screen]);
  uE2(() => { localStorage.setItem("seas-chat", chatOpen ? "1" : "0"); }, [chatOpen]);

  // keyboard
  uE2(() => {
    const onKey = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "j") {
        e.preventDefault();
        setChatOpen(v => !v);
      }
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
      }
      if (e.key === "ArrowRight" && (e.altKey)) {
        const i = screenOrder.indexOf(screen);
        if (i >= 0 && i < screenOrder.length-1) setScreen(screenOrder[i+1]);
      }
      if (e.key === "ArrowLeft" && (e.altKey)) {
        const i = screenOrder.indexOf(screen);
        if (i > 0) setScreen(screenOrder[i-1]);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [screen]);

  // fake agent run
  const runAgent = () => {
    setRunningAgent(true);
    setAgentStep(0);
    let s = 0;
    const iv = setInterval(() => {
      s += 1;
      setAgentStep(s);
      if (s >= agentPlan.length) {
        clearInterval(iv);
        setTimeout(()=>setRunningAgent(false), 900);
      }
    }, 1100);
  };

  const goNext = () => {
    const i = screenOrder.indexOf(screen);
    if (i >= 0 && i < screenOrder.length-1) setScreen(screenOrder[i+1]);
  };
  const goPrev = () => {
    const i = screenOrder.indexOf(screen);
    if (i > 0) setScreen(screenOrder[i-1]);
  };

  return (
    <div style={{display:"flex", minHeight:"100vh"}}>
      <Sidebar screen={screen} onNav={setScreen} collapsed={collapsed} onToggle={()=>setCollapsed(v=>!v)}/>
      <div style={{flex:1, minWidth:0, display:"flex", flexDirection:"column"}} data-screen-label={screen}>
        <Topbar
          onToggleChat={()=>setChatOpen(v=>!v)}
          chatOpen={chatOpen}
          screen={screen}
          theme={theme}
          onToggleTheme={toggleTheme}
          onOpenMenu={(action)=>{
            if (action === "Settings" || action === "Account profile" || action === "MCP connectors") {
              // hook to admin screens when available
              setScreen("about");
            }
          }}
          user={currentUser}
        />
        <main style={{flex:1, minWidth:0}}>
          {screen === "overview" && <OverviewScreen dataset={sampleDataset} onStart={(to)=>setScreen(typeof to==="string"?to:"cohort")} onResume={()=>setScreen("cohort")}/>}
          {screen === "input" && <DataInputScreen dataset={sampleDataset} onBack={goPrev} onProceed={goNext}/>}
          {screen === "relations" && <RelationsScreen onBack={goPrev} onProceed={goNext}/>}
          {screen === "cohort" && <CohortScreen onBack={goPrev} onProceed={goNext} pivotId={pivotId} cohortIds={cohortIds} onPivot={setPivotId}/>}
          {screen === "discrete" && <DiscreteScreen onBack={goPrev} onProceed={goNext} cohortSize={cohortIds.length}/>}
          {screen === "continuous" && <ContinuousScreen onBack={goPrev} onProceed={goNext} cohortSize={cohortIds.length}/>}
          {screen === "survival" && <SurvivalScreen onBack={goPrev} onProceed={()=>setScreen("report")} cohortSize={cohortIds.length}/>}
          {screen === "report" && <ReportScreen onBack={goPrev} cohortSize={cohortIds.length}/>}
          {screen === "faqs" && <FAQScreen onBack={()=>setScreen("overview")}/>}
          {screen === "about" && <AboutScreen onBack={()=>setScreen("overview")}/>}
        </main>
        <StatusBar runningAgent={runningAgent} screen={screen} dataset={sampleDataset} onToggleChat={()=>setChatOpen(v=>!v)}/>
      </div>

      {/* Floating Copilot button */}
      {!chatOpen && (
        <button onClick={()=>setChatOpen(true)} className="ai-border" style={{
          position:"fixed", right:18, bottom:42, zIndex:40,
          padding:"10px 14px", border:0, background:"var(--surface)", borderRadius:999,
          boxShadow:"var(--shadow-lg)", cursor:"pointer", display:"flex", alignItems:"center", gap:8
        }}>
          <div style={{width:24, height:24, borderRadius:7, background:"var(--ink-solid)", color:"var(--ink-solid-fg)", display:"grid", placeItems:"center"}}>
            <Icon name="sparkle" size={13}/>
          </div>
          <span style={{fontSize:13, fontWeight:500}}>Ask Copilot</span>
          <span className="kbd">⌘J</span>
        </button>
      )}

      <ChatPanel
        open={chatOpen}
        onClose={()=>setChatOpen(false)}
        screen={screen}
        onRunAgent={runAgent}
        dataset={sampleDataset}
        runningAgent={runningAgent}
        agentStep={agentStep}
      />
    </div>
  );
};

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
