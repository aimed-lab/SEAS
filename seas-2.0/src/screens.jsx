// Screen components for the SEAS 2.0 workflow.

const { useState: uS, useMemo: uM, useEffect: uE } = React;

// ---------- Shared layout: PageHeader ----------
const PageHeader = ({ title, subtitle, step, totalSteps, onBack, onProceed, rightSlot }) => (
  <div style={{display:"flex", alignItems:"flex-end", justifyContent:"space-between", gap:16, padding:"18px 28px 14px", borderBottom:"1px solid var(--line)", background:"var(--surface)"}}>
    <div>
      <div style={{display:"flex", alignItems:"center", gap:10, fontSize:11.5, color:"var(--ink-3)", textTransform:"uppercase", letterSpacing:".08em"}}>
        <span>Step {step} / {totalSteps}</span>
        <span>·</span>
        <span>SEAS Workflow</span>
      </div>
      <h1 style={{fontSize:22, margin:"4px 0 2px", letterSpacing:"-.01em", fontWeight:600}}>{title}</h1>
      {subtitle && <div style={{fontSize:13, color:"var(--ink-3)", maxWidth:720}}>{subtitle}</div>}
    </div>
    <div style={{display:"flex", alignItems:"center", gap:8}}>
      {rightSlot}
      {onBack && <button className="btn" onClick={onBack}><Icon name="chevL" size={14}/> Back</button>}
      {onProceed && <button className="btn primary" onClick={onProceed}>Proceed <Icon name="arrowR" size={14}/></button>}
    </div>
  </div>
);

// ---------- Stat tile ----------
const Stat = ({label, value, hint, accent, trend}) => (
  <div style={{padding:"12px 14px", border:"1px solid var(--line)", borderRadius:10, background:"var(--surface)", minWidth:140, flex:1}}>
    <div style={{fontSize:11, color:"var(--ink-3)", textTransform:"uppercase", letterSpacing:".06em"}}>{label}</div>
    <div style={{display:"flex", alignItems:"baseline", gap:8, marginTop:4}}>
      <div style={{fontSize:22, fontWeight:600, color: accent||"var(--ink)", letterSpacing:"-.01em"}}>{value}</div>
      {trend && <div style={{fontSize:11, color:"var(--ink-3)"}}>{trend}</div>}
    </div>
    {hint && <div style={{fontSize:11.5, color:"var(--ink-3)", marginTop:2}}>{hint}</div>}
  </div>
);

// ---------- Interpretation drawer content ----------
const Interpretation = ({ bullets, title="AI interpretation", action }) => (
  <div className="ai-border" style={{borderRadius:12, background:"linear-gradient(180deg,var(--surface),var(--amber-grad))", padding:14}}>
    <div style={{display:"flex", alignItems:"center", gap:8, marginBottom:8}}>
      <div style={{width:22, height:22, borderRadius:7, background:"var(--ink-solid)", color:"var(--ink-solid-fg)", display:"grid", placeItems:"center"}}>
        <Icon name="sparkle" size={12}/>
      </div>
      <div style={{fontSize:12.5, fontWeight:600}}>{title}</div>
      <span className="chip ai" style={{marginLeft:"auto"}}>Live</span>
    </div>
    <ul style={{margin:0, padding:0, listStyle:"none", display:"flex", flexDirection:"column", gap:8}}>
      {bullets.map((b,i)=>(
        <li key={i} style={{fontSize:12.5, lineHeight:1.5, color:"var(--ink-2)", display:"flex", gap:8}}>
          <span style={{color:"#b8601a", flexShrink:0, marginTop:6, width:4, height:4, borderRadius:999, background:"#b8601a"}}/>
          <span dangerouslySetInnerHTML={{__html: b.replace(/\*\*(.*?)\*\*/g,'<strong>$1</strong>').replace(/`([^`]+)`/g,'<span class="mono" style="background:#fff;padding:1px 4px;border-radius:4px;border:1px solid var(--line)">$1</span>')}}/>
        </li>
      ))}
    </ul>
    {action && <div style={{marginTop:10, display:"flex", gap:6}}>{action}</div>}
  </div>
);

// ==============================================================
//  OVERVIEW / HOME
// ==============================================================
const OverviewScreen = ({ dataset, onStart, onResume }) => {
  return (
    <div style={{padding:"28px 28px 40px", maxWidth:1200, margin:"0 auto"}}>
      <div style={{display:"flex", alignItems:"flex-end", justifyContent:"space-between", marginBottom:18}}>
        <div>
          <div style={{fontSize:11.5, color:"var(--ink-3)", textTransform:"uppercase", letterSpacing:".08em"}}>Statistical Enrichment Analysis of Samples</div>
          <h1 className="serif" style={{fontSize:46, margin:"6px 0 4px", letterSpacing:"-.02em", fontWeight:400}}>
            Annotate the <em>metadata neighborhood</em> of any sample.
          </h1>
          <div style={{fontSize:14, color:"var(--ink-3)", maxWidth:720}}>
            SEAS 2.0 finds which clinical, molecular, and radiomic features are over-represented in a cohort you define — with AI that plans the analysis, narrates the results, and writes the methods.
          </div>
        </div>
        <div style={{display:"flex", gap:8}}>
          <button className="btn" onClick={onResume}><Icon name="refresh" size={14}/> Resume</button>
          <button className="btn ai" onClick={onStart}><Icon name="sparkle" size={14}/> Start with Copilot</button>
        </div>
      </div>

      {/* workspace banner */}
      <div style={{display:"grid", gridTemplateColumns:"1.6fr 1fr", gap:16, marginBottom:20}}>
        <div className="card" style={{padding:0, overflow:"hidden"}}>
          <div style={{padding:16, borderBottom:"1px solid var(--line)", display:"flex", justifyContent:"space-between", alignItems:"center"}}>
            <div>
              <div style={{fontSize:11.5, color:"var(--ink-3)", textTransform:"uppercase", letterSpacing:".06em"}}>Current workspace</div>
              <div style={{fontSize:18, fontWeight:600, marginTop:2}}>{dataset.name}</div>
              <div style={{fontSize:12.5, color:"var(--ink-3)"}}>{dataset.source}</div>
            </div>
            <div style={{display:"flex", gap:8}}>
              <button className="btn sm" onClick={()=>onStart("input")}>Switch dataset</button>
              <button className="btn sm primary" onClick={()=>onStart("cohort")}>Open workspace</button>
            </div>
          </div>
          <div style={{display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:0}}>
            {[
              {l:"Samples", v: dataset.samples.toString()},
              {l:"Clinotypes", v: dataset.clinotypes.toString()},
              {l:"Embedding", v:"UMAP · 2D"},
              {l:"Updated", v: dataset.updated},
            ].map((s,i)=>(
              <div key={i} style={{padding:"14px 16px", borderRight: i<3?"1px solid var(--line)":"none"}}>
                <div style={{fontSize:11, color:"var(--ink-3)", textTransform:"uppercase", letterSpacing:".06em"}}>{s.l}</div>
                <div style={{fontSize:17, fontWeight:600, marginTop:3, fontFamily: i===3?"inherit":"JetBrains Mono"}}>{s.v}</div>
              </div>
            ))}
          </div>
          <div style={{padding:"12px 16px", background:"var(--surface-2)", borderTop:"1px solid var(--line)", display:"flex", alignItems:"center", gap:10, fontSize:12.5, color:"var(--ink-2)"}}>
            <Icon name="plug" size={13}/> Connected MCP sources:
            {mcpCatalog.filter(m=>m.connected).map(m=>(
              <span key={m.id} className="chip" style={{fontSize:11}}>{m.name}</span>
            ))}
            <button className="btn sm ghost" style={{marginLeft:"auto"}}><Icon name="plus" size={12}/> Add</button>
          </div>
        </div>

        <div className="ai-border" style={{borderRadius:12, background:"linear-gradient(180deg,var(--surface),var(--amber-grad))", padding:16}}>
          <div style={{display:"flex", alignItems:"center", gap:8, marginBottom:6}}>
            <div style={{width:24, height:24, borderRadius:7, background:"var(--ink-solid)", color:"var(--ink-solid-fg)", display:"grid", placeItems:"center"}}>
              <Icon name="sparkle" size={13}/>
            </div>
            <div style={{fontSize:13, fontWeight:600}}>Ask Copilot to run it</div>
          </div>
          <div style={{fontSize:12.5, color:"var(--ink-2)", lineHeight:1.5, marginBottom:10}}>
            Give a goal in plain English. The agent plans the steps, calls SEAS tools, pauses for your review, and drafts the methods when it's done.
          </div>
          {[
            "Find a 16-patient neighborhood around TCGA-02-0001-01 and run the full pipeline",
            "Compare Mesenchymal vs. Classical subtypes for survival",
            "Pull the latest radiomics from REDCap and re-embed",
          ].map((p,i)=>(
            <button key={i} onClick={onStart} style={{display:"block", width:"100%", textAlign:"left", background:"var(--surface)", border:"1px solid var(--line)", borderRadius:8, padding:"8px 10px", fontSize:12.5, color:"var(--ink)", marginBottom:6, cursor:"pointer"}}>
              <Icon name="arrowR" size={12} style={{marginRight:6, color:"#b8601a"}}/> {p}
            </button>
          ))}
        </div>
      </div>

      {/* recent analyses */}
      <div className="card" style={{marginBottom:20}}>
        <div className="card-head">
          <div>
            <div className="card-title">Recent analyses</div>
            <div className="card-sub">Cohorts you've run in the last 30 days</div>
          </div>
          <button className="btn sm"><Icon name="plus" size={13}/> New analysis</button>
        </div>
        <table className="data">
          <thead><tr><th>Name</th><th>Pivot / size</th><th>Top enrichment</th><th>Survival</th><th>Run</th><th>Status</th><th></th></tr></thead>
          <tbody>
            {[
              {n:"GBM · high longest_dimension", p:"TCGA-02-0001-01 · 16", e:"Cluster 1 · q=4.6e-20", s:"HR 1.34", r:"Apr 19 · 10:25", st:"draft"},
              {n:"Mesenchymal vs Classical", p:"lasso · 64 / 92", e:"CD68 high · q=3.1e-11", s:"p=0.004", r:"Apr 18", st:"published"},
              {n:"Radiomic outliers", p:"threshold · 42", e:"necrosis_vol · q=2.2e-07", s:"—", r:"Apr 15", st:"draft"},
              {n:"Elderly TMZ responders", p:"filter · 28", e:"MGMT methylated · q=8e-06", s:"HR 0.71", r:"Apr 11", st:"shared"},
            ].map((row,i)=>(
              <tr key={i}>
                <td><strong>{row.n}</strong></td>
                <td className="num">{row.p}</td>
                <td className="num">{row.e}</td>
                <td className="num">{row.s}</td>
                <td>{row.r}</td>
                <td>
                  <span className={"chip "+(row.st==="published"?"ok":row.st==="shared"?"info":"warn")}>
                    <span className="dot"/> {row.st}
                  </span>
                </td>
                <td style={{textAlign:"right"}}><button className="btn sm ghost"><Icon name="arrowR" size={13}/></button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* citation */}
      <div className="card" style={{marginBottom:14, padding:"14px 18px"}}>
        <div style={{fontSize:11, color:"var(--ink-3)", textTransform:"uppercase", letterSpacing:".08em", marginBottom:6}}>Cite SEAS</div>
        <div style={{fontSize:13, lineHeight:1.55, color:"var(--ink-2)"}}>
          Nguyen TM, Bharti S, Yue Z, Willey CD and Chen JY (2021) <em>Statistical Enrichment Analysis of Samples: A General-Purpose Tool to Annotate Metadata Neighborhoods of Biological Samples.</em> Front. Big Data 4:725276. <span className="mono">doi: 10.3389/fdata.2021.725276</span>
        </div>
        <div style={{marginTop:8, display:"flex", gap:8, alignItems:"center", flexWrap:"wrap"}}>
          <a href="https://www.frontiersin.org/journals/big-data/articles/10.3389/fdata.2021.725276/full" target="_blank" rel="noreferrer" className="btn sm"><Icon name="link" size={12}/> Journal article</a>
          <a href="https://doi.org/10.3389/fdata.2021.725276" target="_blank" rel="noreferrer" className="btn sm"><Icon name="doc" size={12}/> DOI</a>
          <button
            className="btn sm"
            onClick={()=>{
              navigator.clipboard?.writeText("Nguyen TM, Bharti S, Yue Z, Willey CD and Chen JY (2021) Statistical Enrichment Analysis of Samples: A General-Purpose Tool to Annotate Metadata Neighborhoods of Biological Samples. Front. Big Data 4:725276. doi: 10.3389/fdata.2021.725276");
            }}
          ><Icon name="copy" size={12}/> Copy citation</button>
        </div>
      </div>

      {/* footer */}
      <div style={{fontSize:11.5, color:"var(--ink-4)", textAlign:"center"}}>SEAS 2.0 · AI.MED lab · © 2026</div>
    </div>
  );
};

// ==============================================================
//  DATA INPUT
// ==============================================================
const DataInputScreen = ({ onBack, onProceed, dataset }) => {
  const [mode, setMode] = uS("demo");
  const [loaded, setLoaded] = uS(true);
  const [aiMapOpen, setAiMapOpen] = uS(false);
  return (
    <>
      <PageHeader
        step={1} totalSteps={6}
        title="Data Input"
        subtitle="Upload your clinical + embedding files, let SEAS compute the embedding, or start with the TCGA GBM demo."
        onBack={onBack} onProceed={onProceed}
      />
      <div style={{padding:"18px 28px"}}>
        {/* Source tiles */}
        <div style={{display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:12, marginBottom:18}}>
          {[
            {id:"demo", icon:"play", title:"Load demo", sub:"TCGA GBM · 434 samples"},
            {id:"upload", icon:"upload", title:"Upload files", sub:"Clinical CSV + embedding CSV"},
            {id:"compute", icon:"sigma", title:"Upload + compute embedding", sub:"We'll run UMAP for you"},
            {id:"mcp", icon:"plug", title:"From MCP source", sub:"TCGA · cBioPortal · REDCap · S3"},
            {id:"agent", icon:"sparkle", title:"Ask Copilot to fetch", sub:"\"Load last week's radiomics\""},
            {id:"history", icon:"refresh", title:"Re-open recent", sub:"4 workspaces in last 30d"},
          ].map(t=>(
            <button key={t.id} onClick={()=>setMode(t.id)} style={{
              textAlign:"left", background: mode===t.id?"#fff":"var(--surface-2)",
              border:"1px solid "+(mode===t.id?"var(--ink)":"var(--line)"),
              borderRadius:10, padding:"12px 14px", cursor:"pointer", position:"relative",
              boxShadow: mode===t.id?"var(--shadow-md)":"none"
            }}>
              <div style={{display:"flex", alignItems:"center", gap:8}}>
                <div style={{width:26, height:26, borderRadius:8, background:"var(--surface)", border:"1px solid var(--line)", display:"grid", placeItems:"center"}}>
                  <Icon name={t.icon} size={14}/>
                </div>
                <div style={{fontSize:13, fontWeight:600}}>{t.title}</div>
                {t.id==="agent" && <AIChip/>}
              </div>
              <div style={{fontSize:12, color:"var(--ink-3)", marginTop:6}}>{t.sub}</div>
            </button>
          ))}
        </div>

        {/* Loader panel */}
        <div style={{display:"grid", gridTemplateColumns:"1.3fr 1fr", gap:14}}>
          <div className="card">
            <div className="card-head">
              <div>
                <div className="card-title">Selected: {mode==="demo"?"Demo dataset":mode==="upload"?"Upload files":mode==="compute"?"Upload + compute":mode==="mcp"?"MCP source":mode==="agent"?"Agent fetch":"Recent workspace"}</div>
                <div className="card-sub">{dataset.source}</div>
              </div>
              <button className="btn primary sm" onClick={()=>setLoaded(true)}><Icon name="download" size={13}/> Load Data</button>
            </div>
            <div style={{padding:"14px 16px", display:"flex", gap:12, alignItems:"center", borderBottom:"1px solid var(--line)"}}>
              <div style={{flex:1}}>
                <div style={{fontSize:12, color:"var(--ink-3)"}}>Clinical file</div>
                <div className="mono" style={{fontSize:12.5}}>tcga_gbm_clinical.csv · 434 rows · 21 columns</div>
              </div>
              <div style={{flex:1}}>
                <div style={{fontSize:12, color:"var(--ink-3)"}}>Embedding file</div>
                <div className="mono" style={{fontSize:12.5}}>tcga_gbm_embedding.csv · 434 rows · 2 columns</div>
              </div>
              <span className="chip ok"><Icon name="check" size={11}/> schema valid</span>
            </div>

            <div style={{padding:"10px 16px", display:"flex", alignItems:"center", gap:10, borderBottom:"1px solid var(--line)", background:"var(--surface-2)"}}>
              <div style={{display:"flex", gap:0, border:"1px solid var(--line)", borderRadius:8, overflow:"hidden", background:"var(--surface)"}}>
                <button className="btn sm ghost" style={{borderRadius:0, borderRight:"1px solid var(--line)", background: "var(--surface)"}}>Feature set</button>
                <button className="btn sm ghost" style={{borderRadius:0}}>Embedding</button>
              </div>
              <div style={{flex:1}}/>
              <button className="btn sm ai" onClick={()=>setAiMapOpen(v=>!v)}><Icon name="sparkle" size={12}/> Auto-map columns</button>
              <button className="btn sm"><Icon name="filter" size={12}/> Filter</button>
              <button className="btn sm"><Icon name="download" size={12}/> Export</button>
            </div>

            {aiMapOpen && (
              <div className="fade-up" style={{padding:"10px 16px", background:"var(--amber-wash)", borderBottom:"1px solid rgba(184,96,26,.3)", fontSize:12.5, color:"var(--amber)"}}>
                <strong>Copilot mapped 18 of 21 columns.</strong> Three need confirmation: <span className="mono">dx_age</span> → CDE_DxAge, <span className="mono">alk_days</span> → CDE_chemo_alk_days, <span className="mono">tmz_days</span> → CDE_chemo_tmz_days. <a href="#" style={{color:"#7a4210"}}>Review →</a>
              </div>
            )}

            <div style={{maxHeight:300, overflow:"auto"}}>
              <table className="data">
                <thead>
                  <tr>
                    <th></th><th>Sample ID</th><th>Dataset</th><th>Cluster</th><th>Discrete_CDE_DxAge</th><th>Chemo_alk</th><th>Gender</th><th>Subtype</th>
                  </tr>
                </thead>
                <tbody>
                  {featureRows.map((r,i)=>(
                    <tr key={i}>
                      <td><span className="chip info" style={{padding:"1px 6px", fontSize:10}}>+</span></td>
                      <td className="num">{r.id}</td>
                      <td>{r.dataset}</td>
                      <td>{r.cluster}</td>
                      <td className="num">{r.age}</td>
                      <td className="num">{r.chemo_alk}</td>
                      <td>{r.gender}</td>
                      <td>{r.subtype}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div style={{padding:"10px 16px", fontSize:12, color:"var(--ink-3)", display:"flex", justifyContent:"space-between"}}>
              <div>Showing 1 – 12 of 434 entries</div>
              <div style={{display:"flex", gap:6}}>
                <button className="btn sm">Prev</button>
                <button className="btn sm primary">1</button>
                <button className="btn sm">2</button>
                <button className="btn sm">3</button>
                <button className="btn sm">…</button>
                <button className="btn sm">87</button>
                <button className="btn sm">Next</button>
              </div>
            </div>
          </div>

          {/* right: QC + schema */}
          <div style={{display:"flex", flexDirection:"column", gap:14}}>
            <div className="card">
              <div className="card-head">
                <div className="card-title">QC summary</div>
                <span className="chip ok"><Icon name="check" size={11}/> passed</span>
              </div>
              <div style={{padding:"6px 0"}}>
                {[
                  {l:"Sample IDs unique", v:"434 / 434", ok:true},
                  {l:"Embedding dimensions", v:"2 (x, y)", ok:true},
                  {l:"Missing values", v:"0.42% (acceptable)", ok:true},
                  {l:"Clinotypes parsed", v:"21 (12 discrete · 9 continuous)", ok:true},
                  {l:"Outliers flagged", v:"3", ok:false},
                ].map((q,i)=>(
                  <div key={i} style={{display:"flex", justifyContent:"space-between", padding:"8px 16px", borderTop:i?"1px solid var(--line-2)":"none", fontSize:12.5}}>
                    <div style={{display:"flex", alignItems:"center", gap:8}}>
                      <Icon name={q.ok?"check":"warn"} size={13} style={{color: q.ok?"#2f6b3a":"#b8601a"}}/>
                      {q.l}
                    </div>
                    <div className="mono" style={{color:"var(--ink-3)"}}>{q.v}</div>
                  </div>
                ))}
              </div>
            </div>

            <Interpretation
              title="Copilot notes"
              bullets={[
                "Your dataset shape matches **SEAS v1.1** exactly — no migration needed.",
                "3 samples flagged as radiomic outliers (`TCGA-02-0004-01`, `-0019-01`, `-0091-01`). Drop them?",
                "Columns `dx_age` / `alk_days` / `tmz_days` likely correspond to CDE_* clinotypes. I can rename automatically.",
              ]}
              action={<><button className="btn sm">Drop outliers</button><button className="btn sm ai">Apply AI renames</button></>}
            />
          </div>
        </div>
      </div>
    </>
  );
};

// ==============================================================
//  CLINOTYPE RELATIONS
// ==============================================================
const RelationsScreen = ({ onBack, onProceed })=>{
  const [c1, setC1] = uS("CDE_DxAge");
  const [c2, setC2] = uS("gender");
  return (
    <>
      <PageHeader step={2} totalSteps={6}
        title="Explore Clinotype Relations"
        subtitle="Grouped KDE + linear modeling across any pair of clinotypes."
        onBack={onBack} onProceed={onProceed}
        rightSlot={<span className="chip"><Icon name="doc" size={11}/> 21 clinotypes loaded</span>}
      />
      <div style={{padding:"18px 28px", display:"grid", gridTemplateColumns:"260px 1fr 320px", gap:16}}>
        {/* Left: clinotype picker */}
        <div className="card" style={{alignSelf:"flex-start"}}>
          <div className="card-head"><div className="card-title">Pair</div></div>
          <div style={{padding:"12px 14px", display:"flex", flexDirection:"column", gap:12}}>
            <div>
              <div style={{fontSize:11.5, color:"var(--ink-3)", marginBottom:4}}>Clinotype A</div>
              <select value={c1} onChange={e=>setC1(e.target.value)} style={{width:"100%", padding:"8px 10px", border:"1px solid var(--line)", borderRadius:8, background:"var(--surface)", fontSize:13}}>
                {clinotypes.map(c=><option key={c.name}>{c.name}</option>)}
              </select>
            </div>
            <div>
              <div style={{fontSize:11.5, color:"var(--ink-3)", marginBottom:4}}>Clinotype B (group by)</div>
              <select value={c2} onChange={e=>setC2(e.target.value)} style={{width:"100%", padding:"8px 10px", border:"1px solid var(--line)", borderRadius:8, background:"var(--surface)", fontSize:13}}>
                {clinotypes.map(c=><option key={c.name}>{c.name}</option>)}
              </select>
            </div>
            <button className="btn ai sm"><Icon name="sparkle" size={12}/> Suggest interesting pairs</button>
          </div>
          <div style={{padding:"10px 14px", borderTop:"1px solid var(--line)"}}>
            <div style={{fontSize:11.5, color:"var(--ink-3)", marginBottom:6, textTransform:"uppercase", letterSpacing:".06em"}}>Top AI-ranked pairs</div>
            {[
              {a:"longest_dimension", b:"Cluster", score:.91},
              {a:"CDE_DxAge", b:"GeneExp_Subtype", score:.74},
              {a:"Karnofsky", b:"additional_chemo_therapy", score:.63},
              {a:"CDE_DxAge", b:"gender", score:.55},
            ].map((p,i)=>(
              <button key={i} onClick={()=>{setC1(p.a);setC2(p.b)}} style={{display:"flex", width:"100%", justifyContent:"space-between", alignItems:"center", padding:"6px 0", fontSize:12, background:"none", border:0, cursor:"pointer", color:"var(--ink-2)"}}>
                <span><span className="mono">{p.a}</span> × <span className="mono">{p.b}</span></span>
                <span className="mono" style={{color:"var(--amber)"}}>{p.score.toFixed(2)}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Center: plots */}
        <div style={{display:"flex", flexDirection:"column", gap:14}}>
          <div className="card">
            <div className="card-head">
              <div>
                <div className="card-title">Clinotype density plot</div>
                <div className="card-sub">{c1} by {c2}</div>
              </div>
              <div style={{display:"flex", gap:6}}>
                <button className="btn sm"><Icon name="copy" size={12}/></button>
                <button className="btn sm"><Icon name="download" size={12}/></button>
                <button className="btn sm ghost"><Icon name="expand" size={12}/></button>
              </div>
            </div>
            <div style={{padding:14}}><KDEPlot title={`Kernel Density Estimates for ${c1} by ${c2}`}/></div>
          </div>

          <div className="card">
            <div className="card-head">
              <div>
                <div className="card-title">Grouped box plot · linear modeling</div>
                <div className="card-sub">longest_dimension ~ Cluster  ·  ANOVA F=18.4  ·  p = 3.1e-11</div>
              </div>
              <button className="btn sm"><Icon name="settings" size={12}/> Model</button>
            </div>
            <div style={{padding:14}}><BoxPlot/></div>
          </div>
        </div>

        {/* Right: interpretation */}
        <div style={{display:"flex", flexDirection:"column", gap:14}}>
          <Interpretation
            title="Interpretation"
            bullets={[
              "Distributions for `{c1}` differ mildly between groups — FEMALE is shifted ~3 years older than MALE.",
              "No strong interaction; a linear model gives **R²=0.02**, safe to treat as independent.",
              "Recommend adding `GeneExp_Subtype` as a covariate — it carries the main signal."
            ].map(s=>s.replace("{c1}", c1))}
            action={<button className="btn sm ai"><Icon name="sparkle" size={12}/> Add to report</button>}
          />
          <div className="card">
            <div className="card-head"><div className="card-title">Model summary</div></div>
            <div style={{padding:"12px 14px", fontSize:12.5}}>
              <table className="data" style={{border:0}}>
                <tbody>
                  <tr><td>Test</td><td className="num">Kruskal–Wallis</td></tr>
                  <tr><td>Statistic</td><td className="num">42.1</td></tr>
                  <tr><td>p-value</td><td className="num">3.1e-11</td></tr>
                  <tr><td>Effect size (η²)</td><td className="num">0.18</td></tr>
                  <tr><td>n groups</td><td className="num">5</td></tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

// ==============================================================
//  COHORT SELECTION
// ==============================================================
const CohortScreen = ({ onBack, onProceed, onPivot, pivotId, cohortIds })=>{
  const [method, setMethod] = uS("neighborhood");
  const [colorBy, setColorBy] = uS("chemo");
  const [k, setK] = uS(3);
  const [hover, setHover] = uS([]);

  const selectedIds = uM(()=>cohortIds, [cohortIds]);

  return (
    <>
      <PageHeader step={3} totalSteps={6}
        title="Cohort Selection"
        subtitle="Draw, filter, or describe a cohort. The selection becomes the basis for all downstream enrichment."
        onBack={onBack} onProceed={onProceed}
        rightSlot={
          <div style={{display:"flex", gap:6}}>
            <span className="chip info"><Icon name="cohort" size={12}/> cohort · {selectedIds.length}</span>
            <span className="chip"><Icon name="users" size={12}/> population · 434</span>
          </div>
        }
      />
      <div style={{padding:"18px 28px", display:"grid", gridTemplateColumns:"280px 1fr 320px", gap:16}}>
        {/* left controls */}
        <div className="card" style={{alignSelf:"flex-start"}}>
          <div className="card-head"><div className="card-title">Selection method</div></div>
          <div style={{padding:12, display:"flex", flexDirection:"column", gap:6}}>
            {[
              {id:"neighborhood", label:"Patient neighborhood", sub:"k-NN around a pivot sample", icon:"target"},
              {id:"lasso", label:"Lasso / box select", sub:"Free-form on the embedding", icon:"grid"},
              {id:"filter", label:"Clinotype filter", sub:"Rules like age > 50 AND chemo = YES", icon:"filter"},
              {id:"nl", label:"Describe in English", sub:"Copilot builds the cohort", icon:"sparkle", ai:true},
            ].map(m=>(
              <button key={m.id} onClick={()=>setMethod(m.id)} style={{
                display:"flex", alignItems:"center", gap:10, padding:"9px 10px",
                background: method===m.id?"var(--teal-wash)":"#fff",
                border:"1px solid "+(method===m.id?"#c4dcd9":"var(--line)"),
                borderRadius:8, textAlign:"left", cursor:"pointer"
              }}>
                <Icon name={m.icon} size={15} style={{color: method===m.id?"var(--teal-ink)":"var(--ink-2)"}}/>
                <div style={{flex:1, lineHeight:1.2}}>
                  <div style={{fontSize:12.5, fontWeight:500}}>{m.label}{m.ai && <span className="chip ai" style={{marginLeft:6, padding:"1px 6px", fontSize:10}}>AI</span>}</div>
                  <div style={{fontSize:11, color:"var(--ink-3)"}}>{m.sub}</div>
                </div>
              </button>
            ))}
          </div>
          <hr className="rule"/>
          <div style={{padding:12, display:"flex", flexDirection:"column", gap:12}}>
            {method==="neighborhood" && <>
              <div>
                <div style={{fontSize:11.5, color:"var(--ink-3)"}}>Sample of interest (pivot)</div>
                <select value={pivotId} onChange={e=>onPivot(e.target.value)} style={{width:"100%", marginTop:4, padding:"8px 10px", border:"1px solid var(--line)", borderRadius:8, background:"var(--surface)", fontSize:12.5, fontFamily:"JetBrains Mono"}}>
                  {embedding.slice(0,20).map(d=><option key={d.id}>{d.id}</option>)}
                </select>
              </div>
              <div>
                <div style={{display:"flex", justifyContent:"space-between", fontSize:11.5, color:"var(--ink-3)"}}>
                  <span>Neighborhood size</span><span className="mono">{k}</span>
                </div>
                <input type="range" min="1" max="10" value={k} onChange={e=>setK(+e.target.value)} style={{width:"100%", accentColor:"var(--teal)"}}/>
              </div>
              <label style={{display:"flex", alignItems:"center", gap:6, fontSize:12.5}}>
                <input type="checkbox"/> Discretize continuous clinotypes
              </label>
            </>}
            {method==="nl" && <>
              <textarea rows={3} placeholder={"e.g. “16 patients with high longest_dimension and Mesenchymal subtype”"} style={{width:"100%", padding:8, border:"1px solid var(--line)", borderRadius:8, fontFamily:"inherit", fontSize:12.5, resize:"vertical"}}/>
              <button className="btn ai sm"><Icon name="sparkle" size={12}/> Build cohort</button>
            </>}
            {method==="filter" && <>
              <div className="mono" style={{fontSize:12, background:"var(--surface-2)", border:"1px solid var(--line)", borderRadius:8, padding:10}}>
                CDE_DxAge &gt; 50<br/>AND additional_chemo_therapy = "YES"<br/>AND GeneExp_Subtype IN ("Mesenchymal")
              </div>
              <button className="btn sm">Apply filter</button>
            </>}
            {method==="lasso" && <div style={{fontSize:12, color:"var(--ink-3)"}}>Click and drag on the scatter to draw a region. Hold <span className="kbd">⇧</span> to add.</div>}
          </div>
          <hr className="rule"/>
          <div style={{padding:12}}>
            <div style={{fontSize:11.5, color:"var(--ink-3)", marginBottom:6, textTransform:"uppercase", letterSpacing:".06em"}}>Color by</div>
            <div style={{display:"flex", gap:4, flexWrap:"wrap"}}>
              {["chemo","cluster","subtype"].map(k=>(
                <button key={k} onClick={()=>setColorBy(k)} className={"btn sm "+(colorBy===k?"primary":"")}>{k}</button>
              ))}
            </div>
          </div>
        </div>

        {/* center plot */}
        <div className="card">
          <div className="card-head">
            <div>
              <div className="card-title">Sample embedding · {method==="lasso"?"lasso":method==="neighborhood"?`k-NN around ${pivotId}`:method==="filter"?"filtered":"described"}</div>
              <div className="card-sub">434 samples · showing cohort of {selectedIds.length}</div>
            </div>
            <div style={{display:"flex", gap:6}}>
              <button className="btn sm"><Icon name="refresh" size={12}/> Reset</button>
              <button className="btn sm"><Icon name="copy" size={12}/></button>
              <button className="btn sm"><Icon name="download" size={12}/></button>
              <button className="btn sm ghost"><Icon name="expand" size={12}/></button>
            </div>
          </div>
          <div style={{padding:14}}>
            <EmbeddingPlot
              width={640} height={460}
              colorBy={colorBy}
              selectedIds={selectedIds}
              pivotId={pivotId}
              onPick={(d)=>onPivot(d.id)}
              showLasso={method==="lasso"}
            />
          </div>
          <hr className="rule"/>
          <div style={{padding:"12px 16px", display:"flex", gap:12, alignItems:"center", background:"var(--surface-2)"}}>
            <Stat label="Cohort" value={selectedIds.length} hint="samples"/>
            <Stat label="Population" value="434" hint="samples"/>
            <Stat label="Coverage" value={`${((selectedIds.length/434)*100).toFixed(1)}%`} hint="of population"/>
            <Stat label="Pivot neighbor max dist" value="1.82" hint="euclidean" accent="var(--teal-ink)"/>
          </div>
        </div>

        {/* right */}
        <div style={{display:"flex", flexDirection:"column", gap:14}}>
          <Interpretation
            title="Cohort profile"
            bullets={[
              `**16 samples** centered on \`${pivotId}\` — tight cluster in UMAP space.`,
              "Chemo = YES in 12/16 · Mesenchymal subtype over-represented (9/16).",
              "Median `longest_dimension` is **62 mm** — above the population median of 48 mm.",
              "Two outliers sit near the lasso boundary. Drop them to tighten the cohort?",
            ]}
            action={<><button className="btn sm">Drop outliers</button><button className="btn sm primary">Proceed to enrichment</button></>}
          />
          <div className="card">
            <div className="card-head">
              <div className="card-title">Cohort preview</div>
              <button className="btn sm ghost"><Icon name="expand" size={12}/></button>
            </div>
            <div style={{maxHeight:180, overflow:"auto"}}>
              <table className="data">
                <thead><tr><th>Sample</th><th>Subtype</th><th>Chemo</th></tr></thead>
                <tbody>
                  {selectedIds.slice(0,12).map(id=>{
                    const d = embedding.find(e=>e.id===id) || {};
                    return (<tr key={id}><td className="num">{id}</td><td>{d.subtype}</td><td>{d.chemo}</td></tr>);
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

// ==============================================================
//  DISCRETE ENRICHMENT
// ==============================================================
const DiscreteScreen = ({ onBack, onProceed, cohortSize })=>{
  const [pThresh, setPThresh] = uS(0.05);
  const [qThresh, setQThresh] = uS(0.05);
  const [onlyEnriched, setOnlyEnriched] = uS(false);
  const [picked, setPicked] = uS("Cluster=Cluster 1");
  const rows = discreteEnrichment.filter(r => !onlyEnriched || r.enriched);
  return (
    <>
      <PageHeader step={4} totalSteps={6}
        title="Discrete Clinotype Enrichment"
        subtitle="Fisher's exact test on each discrete value, BH-adjusted across 304 tests."
        onBack={onBack} onProceed={onProceed}
        rightSlot={<div style={{display:"flex", gap:6}}><span className="chip info">cohort · {cohortSize}</span><span className="chip">population · 434</span></div>}
      />
      <div style={{padding:"18px 28px", display:"grid", gridTemplateColumns:"240px 1.4fr 1fr", gap:16}}>
        <div className="card" style={{alignSelf:"flex-start"}}>
          <div className="card-head"><div className="card-title">Filters</div></div>
          <div style={{padding:12, display:"flex", flexDirection:"column", gap:14}}>
            <div>
              <div style={{fontSize:11.5, color:"var(--ink-3)"}}>Select clinotype</div>
              <select style={{width:"100%", marginTop:4, padding:"8px 10px", border:"1px solid var(--line)", borderRadius:8, background:"var(--surface)", fontSize:12.5}}>
                <option>All</option>
                {clinotypes.filter(c=>c.type==="discrete").map(c=><option key={c.name}>{c.name}</option>)}
              </select>
            </div>
            <div>
              <div style={{display:"flex", justifyContent:"space-between", fontSize:11.5, color:"var(--ink-3)"}}><span>P-value threshold</span><span className="mono">{pThresh}</span></div>
              <input type="range" min="0" max="1" step="0.01" value={pThresh} onChange={e=>setPThresh(+e.target.value)} style={{width:"100%", accentColor:"var(--teal)"}}/>
            </div>
            <div>
              <div style={{display:"flex", justifyContent:"space-between", fontSize:11.5, color:"var(--ink-3)"}}><span>Adjusted p (q) threshold</span><span className="mono">{qThresh}</span></div>
              <input type="range" min="0" max="1" step="0.01" value={qThresh} onChange={e=>setQThresh(+e.target.value)} style={{width:"100%", accentColor:"var(--teal)"}}/>
            </div>
            <label style={{display:"flex", alignItems:"center", gap:6, fontSize:12.5}}>
              <input type="checkbox" checked={onlyEnriched} onChange={e=>setOnlyEnriched(e.target.checked)}/> Show only enriched
            </label>
            <hr className="rule"/>
            <div>
              <div style={{fontSize:11.5, color:"var(--ink-3)", marginBottom:4, textTransform:"uppercase", letterSpacing:".06em"}}>Test</div>
              <div className="mono" style={{fontSize:12}}>Fisher's exact (two-sided)</div>
              <div className="mono" style={{fontSize:12, color:"var(--ink-3)"}}>BH · FDR ≤ 0.05</div>
            </div>
          </div>
        </div>

        <div style={{display:"flex", flexDirection:"column", gap:14}}>
          <div className="card">
            <div className="card-head">
              <div>
                <div className="card-title">Volcano plot · 304 tests</div>
                <div className="card-sub">8 enriched at q &lt; 0.05 · click a point to select</div>
              </div>
              <div style={{display:"flex", gap:6}}>
                <button className="btn sm"><Icon name="copy" size={12}/></button>
                <button className="btn sm"><Icon name="download" size={12}/></button>
              </div>
            </div>
            <div style={{padding:14}}><VolcanoPlot picked={picked} onPick={setPicked}/></div>
          </div>

          <div className="card">
            <div className="card-head">
              <div>
                <div className="card-title">Enrichment table</div>
                <div className="card-sub">Showing {rows.length} of 304</div>
              </div>
              <div style={{display:"flex", gap:6}}>
                <div style={{display:"flex", gap:0, border:"1px solid var(--line)", borderRadius:8, overflow:"hidden", background:"var(--surface)"}}>
                  <button className="btn sm ghost" style={{borderRadius:0}}>Copy</button>
                  <button className="btn sm ghost" style={{borderRadius:0, borderLeft:"1px solid var(--line)"}}>Excel</button>
                </div>
                <div style={{position:"relative"}}>
                  <Icon name="search" size={13} style={{position:"absolute", left:8, top:9, color:"var(--ink-4)"}}/>
                  <input placeholder="Search…" style={{padding:"6px 10px 6px 28px", border:"1px solid var(--line)", borderRadius:8, fontSize:12.5, outline:"none"}}/>
                </div>
              </div>
            </div>
            <table className="data">
              <thead><tr><th></th><th>Clinotype</th><th>Variable</th><th>P-value</th><th>Adj. p (q)</th><th>Odds ratio</th><th>Enriched</th></tr></thead>
              <tbody>
                {rows.map((r,i)=>{
                  const tag = `${r.clinotype}=${r.variable}`;
                  const sel = picked===tag;
                  return (
                    <tr key={i} onClick={()=>setPicked(tag)} style={{background: sel?"var(--teal-wash)":"transparent", cursor:"pointer"}}>
                      <td>{r.enriched?<span className="chip ok" style={{padding:"1px 6px", fontSize:10}}>●</span>:<span className="chip" style={{padding:"1px 6px", fontSize:10}}>○</span>}</td>
                      <td><strong>{r.clinotype}</strong></td>
                      <td>{r.variable}</td>
                      <td className="num">{r.p}</td>
                      <td className="num" style={{color: r.enriched?"var(--teal-ink)":"var(--ink-2)"}}>{r.padj}</td>
                      <td className="num">{r.or.toFixed(2)}×</td>
                      <td>{r.enriched?<span className="chip ok">Yes</span>:<span className="chip">No</span>}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        <div style={{display:"flex", flexDirection:"column", gap:14}}>
          <Interpretation
            title="Interpretation"
            bullets={[
              "Cohort is **dominated by Cluster 1** (q=4.6e-20, OR=4.8) — a well-known Mesenchymal-leaning GBM subgroup.",
              "Co-enrichment of `CDE_sourcesite=2` suggests a potential batch effect worth checking.",
              "`In_Cancer_Cell_Paper=TRUE` enrichment tells you these patients overlap with the 2013 TCGA paper cohort.",
              "Click a row in the table to see the contingency and a highlighted slice on the embedding.",
            ]}
            action={<><button className="btn sm">View contingency</button><button className="btn sm ai"><Icon name="sparkle" size={12}/> Explain this hit</button></>}
          />
          <div className="card">
            <div className="card-head">
              <div className="card-title">Selected: <span className="mono">{picked}</span></div>
            </div>
            <div style={{padding:12, display:"grid", gridTemplateColumns:"1fr 1fr", gap:8}}>
              <div style={{padding:"10px 12px", border:"1px solid var(--line)", borderRadius:8}}>
                <div style={{fontSize:11, color:"var(--ink-3)"}}>In cohort</div>
                <div style={{fontSize:18, fontWeight:600, fontFamily:"JetBrains Mono"}}>12 / 16</div>
                <div style={{fontSize:11, color:"var(--ink-3)"}}>75%</div>
              </div>
              <div style={{padding:"10px 12px", border:"1px solid var(--line)", borderRadius:8}}>
                <div style={{fontSize:11, color:"var(--ink-3)"}}>In population</div>
                <div style={{fontSize:18, fontWeight:600, fontFamily:"JetBrains Mono"}}>71 / 434</div>
                <div style={{fontSize:11, color:"var(--ink-3)"}}>16%</div>
              </div>
            </div>
            <div style={{padding:"0 12px 12px"}}>
              <div style={{fontSize:11, color:"var(--ink-3)", marginBottom:4}}>2×2 contingency</div>
              <table className="data" style={{border:"1px solid var(--line-2)", borderRadius:6}}>
                <thead><tr><th></th><th>In cohort</th><th>Out</th></tr></thead>
                <tbody>
                  <tr><td><strong>= Cluster 1</strong></td><td className="num">12</td><td className="num">59</td></tr>
                  <tr><td>≠ Cluster 1</td><td className="num">4</td><td className="num">359</td></tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

// ==============================================================
//  CONTINUOUS ENRICHMENT
// ==============================================================
const ContinuousScreen = ({onBack, onProceed, cohortSize})=>{
  const [picked, setPicked] = uS("longest_dimension");
  return (
    <>
      <PageHeader step={5} totalSteps={6}
        title="Continuous Clinotype Enrichment"
        subtitle="Kolmogorov–Smirnov test comparing the cohort's distribution against the background population."
        onBack={onBack} onProceed={onProceed}
        rightSlot={<div style={{display:"flex", gap:6}}><span className="chip info">cohort · {cohortSize}</span><span className="chip">population · 434</span></div>}
      />
      <div style={{padding:"18px 28px", display:"grid", gridTemplateColumns:"260px 1fr 320px", gap:16}}>
        <div className="card" style={{alignSelf:"flex-start"}}>
          <div className="card-head"><div className="card-title">Continuous clinotypes</div></div>
          <div style={{maxHeight:420, overflow:"auto"}}>
            {continuousEnrichment.map(r=>(
              <button key={r.clinotype} onClick={()=>setPicked(r.clinotype)} style={{display:"flex", alignItems:"center", gap:8, width:"100%", textAlign:"left", padding:"10px 12px", border:0, borderBottom:"1px solid var(--line-2)", background: picked===r.clinotype?"var(--teal-wash)":"#fff", cursor:"pointer"}}>
                <Icon name={r.enriched?"trending":"chart"} size={14} style={{color: r.enriched?"#2f6b3a":"var(--ink-3)"}}/>
                <div style={{flex:1, lineHeight:1.2}}>
                  <div style={{fontSize:12.5, fontFamily:"JetBrains Mono"}}>{r.clinotype}</div>
                  <div style={{fontSize:11, color:"var(--ink-3)"}}>q = {r.padj} {r.enriched && <span style={{color:"#2f6b3a"}}>· {r.dir}</span>}</div>
                </div>
                {r.enriched && <span className="chip ok" style={{padding:"1px 6px", fontSize:10}}>●</span>}
              </button>
            ))}
          </div>
        </div>

        <div className="card">
          <div className="card-head">
            <div>
              <div className="card-title">KDE · <span className="mono">{picked}</span></div>
              <div className="card-sub">KS D=0.72 · p=1.566e-06 · q=3.288e-05 · cohort &gt; population</div>
            </div>
            <div style={{display:"flex", gap:6}}>
              <button className="btn sm"><Icon name="copy" size={12}/></button>
              <button className="btn sm"><Icon name="download" size={12}/></button>
            </div>
          </div>
          <div style={{padding:14}}><KDEPlot width={600} height={320} title={`KDE of ${picked} · cohort vs population`}/></div>
          <hr className="rule"/>
          <div style={{padding:"10px 16px", display:"flex", gap:12}}>
            <Stat label="Cohort median" value="62 mm" accent="var(--teal-ink)"/>
            <Stat label="Population median" value="48 mm"/>
            <Stat label="KS D" value="0.72" accent="var(--teal-ink)"/>
            <Stat label="q-value" value="3.3e-05" accent="var(--ok)"/>
          </div>
        </div>

        <div style={{display:"flex", flexDirection:"column", gap:14}}>
          <Interpretation
            title="Interpretation"
            bullets={[
              "`longest_dimension` is **highly enriched higher** in the cohort (q=3.3e-5) — tumors are ~30% larger on average.",
              "This co-occurs with Cluster 1 + Mesenchymal enrichment; the three signals are likely one biological story.",
              "Consider splitting by `GeneExp_Subtype` to confirm the effect isn't driven by Mesenchymal alone.",
            ]}
            action={<><button className="btn sm">Split by subtype</button><button className="btn sm primary">Proceed</button></>}
          />
          <div className="card">
            <div className="card-head"><div className="card-title">Multiple testing summary</div></div>
            <div style={{padding:14}}>
              <div style={{display:"grid", gridTemplateColumns:"1fr 1fr", gap:10}}>
                <Stat label="Tests run" value="21"/>
                <Stat label="Enriched (q<.05)" value="1" accent="var(--ok)"/>
              </div>
              <div style={{marginTop:10, fontSize:12, color:"var(--ink-3)"}}>BH FDR control applied across continuous clinotypes.</div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

// ==============================================================
//  SURVIVAL
// ==============================================================
const SurvivalScreen = ({onBack, onProceed, cohortSize})=>{
  return (
    <>
      <PageHeader step={6} totalSteps={6}
        title="Survival Analysis"
        subtitle="Kaplan–Meier + log-rank + Cox regression comparing cohort vs population."
        onBack={onBack} onProceed={onProceed}
        rightSlot={<div style={{display:"flex", gap:6}}><span className="chip info">cohort · {cohortSize}</span><span className="chip">population · 434</span></div>}
      />
      <div style={{padding:"18px 28px", display:"grid", gridTemplateColumns:"240px 1fr 320px", gap:16}}>
        <div className="card" style={{alignSelf:"flex-start"}}>
          <div className="card-head"><div className="card-title">Settings</div></div>
          <div style={{padding:12, display:"flex", flexDirection:"column", gap:12}}>
            {[
              {l:"Survival time", v:"OS.time"},
              {l:"Survival event", v:"OS"},
              {l:"Grouping", v:"cohort vs population"},
              {l:"Time unit", v:"Months"},
            ].map(s=>(
              <div key={s.l}>
                <div style={{fontSize:11.5, color:"var(--ink-3)"}}>{s.l}</div>
                <select style={{width:"100%", marginTop:4, padding:"8px 10px", border:"1px solid var(--line)", borderRadius:8, background:"var(--surface)", fontSize:12.5}}>
                  <option>{s.v}</option>
                </select>
              </div>
            ))}
            <hr className="rule"/>
            <label style={{display:"flex", alignItems:"center", gap:6, fontSize:12.5}}><input type="checkbox" defaultChecked/> Show number at risk</label>
            <label style={{display:"flex", alignItems:"center", gap:6, fontSize:12.5}}><input type="checkbox"/> Adjust for age + subtype (Cox)</label>
            <button className="btn ai sm"><Icon name="sparkle" size={12}/> Suggest covariates</button>
          </div>
        </div>

        <div className="card">
          <div className="card-head">
            <div>
              <div className="card-title">Kaplan–Meier · cohort vs background population</div>
              <div className="card-sub">log-rank p = 0.031 · HR 1.34 (1.02–1.76)</div>
            </div>
            <div style={{display:"flex", gap:6}}>
              <button className="btn sm"><Icon name="copy" size={12}/></button>
              <button className="btn sm"><Icon name="download" size={12}/></button>
            </div>
          </div>
          <div style={{padding:14}}><KMPlot width={620} height={340}/></div>
          <hr className="rule"/>
          <div style={{padding:"12px 16px"}}>
            <div style={{fontSize:11.5, color:"var(--ink-3)", marginBottom:6, textTransform:"uppercase", letterSpacing:".06em"}}>Number at risk</div>
            <table className="data" style={{fontSize:11.5}}>
              <thead><tr><th></th><th>0</th><th>12</th><th>24</th><th>36</th><th>48</th><th>60</th><th>72</th><th>84</th><th>96</th><th>108</th><th>120</th></tr></thead>
              <tbody>
                <tr><td>Population</td><td className="num">434</td><td className="num">208</td><td className="num">119</td><td className="num">74</td><td className="num">48</td><td className="num">31</td><td className="num">21</td><td className="num">14</td><td className="num">8</td><td className="num">3</td><td className="num">1</td></tr>
                <tr><td>Cohort</td><td className="num">16</td><td className="num">6</td><td className="num">3</td><td className="num">2</td><td className="num">1</td><td className="num">0</td><td className="num">0</td><td className="num">0</td><td className="num">0</td><td className="num">0</td><td className="num">0</td></tr>
              </tbody>
            </table>
          </div>
        </div>

        <div style={{display:"flex", flexDirection:"column", gap:14}}>
          <Interpretation
            title="Interpretation"
            bullets={[
              "Cohort OS trends **worse** than background (HR 1.34, 95% CI 1.02–1.76; log-rank p=0.031).",
              "The separation is small and partially driven by tumor size — consider Cox adjustment.",
              "Median OS: **11.2 mo** (cohort) vs **14.8 mo** (population).",
            ]}
            action={<><button className="btn sm">Fit Cox model</button><button className="btn sm ai"><Icon name="sparkle" size={12}/> Draft conclusion</button></>}
          />
        </div>
      </div>
    </>
  );
};

// ==============================================================
//  FINAL REPORT
// ==============================================================
const ReportScreen = ({onBack, onProceed, cohortSize})=>{
  return (
    <>
      <PageHeader step={6} totalSteps={6}
        title="Final Report"
        subtitle="Collect enriched clinotypes, plots, and an AI-drafted methods + discussion. Export or share."
        onBack={onBack}
        rightSlot={<div style={{display:"flex", gap:6}}><button className="btn sm"><Icon name="download" size={12}/> PDF</button><button className="btn sm"><Icon name="download" size={12}/> ZIP</button><button className="btn primary sm">Share</button></div>}
      />
      <div style={{padding:"18px 28px", display:"grid", gridTemplateColumns:"1.6fr 1fr", gap:16}}>
        <div className="card">
          <div className="card-head">
            <div className="card-title">AI-drafted report</div>
            <span className="chip ai"><Icon name="sparkle" size={11}/> draft · editable</span>
          </div>
          <div style={{padding:"18px 22px", maxWidth:720}}>
            <div className="serif" style={{fontSize:28, lineHeight:1.15, marginBottom:10}}>Radiomic-defined GBM neighborhood around TCGA-02-0001-01</div>
            <div style={{fontSize:12.5, color:"var(--ink-3)", marginBottom:18}}>Authors: Siddharth K. · Samuel Bharti · AI.MED lab · Apr 21, 2026</div>

            <h3 style={{fontSize:13.5, margin:"18px 0 6px", textTransform:"uppercase", letterSpacing:".08em", color:"var(--ink-3)"}}>Abstract</h3>
            <p style={{fontSize:13.5, lineHeight:1.6, margin:0}}>
              We applied SEAS 2.0 to the TCGA GBM clinical case-study (n=434) to characterize the metadata neighborhood of sample <span className="mono">TCGA-02-0001-01</span>. A 16-sample k-NN cohort was selected from the 2D embedding and compared against the background population across 21 clinotypes.
            </p>

            <h3 style={{fontSize:13.5, margin:"18px 0 6px", textTransform:"uppercase", letterSpacing:".08em", color:"var(--ink-3)"}}>Key findings</h3>
            <ul style={{fontSize:13.5, lineHeight:1.6, paddingLeft:18, margin:0}}>
              <li>Cluster 1 is strongly enriched (Fisher q=4.6e-20, OR=4.8) and co-occurs with Mesenchymal subtype.</li>
              <li>Tumor <span className="mono">longest_dimension</span> is higher in-cohort (KS q=3.3e-5, median 62 vs 48 mm).</li>
              <li>Overall survival trends worse (HR 1.34, 95% CI 1.02–1.76; log-rank p=0.031); the effect is attenuated after adjustment for age and subtype.</li>
            </ul>

            <h3 style={{fontSize:13.5, margin:"18px 0 6px", textTransform:"uppercase", letterSpacing:".08em", color:"var(--ink-3)"}}>Methods</h3>
            <p style={{fontSize:13.5, lineHeight:1.6, margin:0}}>
              Cohort selection used k-nearest-neighbors (k=16, Euclidean) around the pivot sample in the provided 2D embedding. Discrete enrichment was tested with Fisher's exact test; continuous clinotypes with the Kolmogorov–Smirnov test. Multiple-testing correction used the Benjamini–Hochberg procedure (FDR ≤ 0.05). Survival was modeled with Kaplan–Meier curves, log-rank tests, and Cox proportional-hazards regression.
            </p>

            <div style={{display:"flex", gap:8, marginTop:18}}>
              <button className="btn sm"><Icon name="copy" size={12}/> Copy</button>
              <button className="btn sm ai"><Icon name="sparkle" size={12}/> Rewrite section</button>
              <button className="btn sm">Insert figure</button>
            </div>
          </div>
        </div>

        <div style={{display:"flex", flexDirection:"column", gap:14}}>
          <div className="card">
            <div className="card-head"><div className="card-title">Contents</div></div>
            <div style={{padding:"8px 12px"}}>
              {[
                {l:"Cohort definition", ok:true},
                {l:"Discrete enrichment · 8 hits", ok:true},
                {l:"Continuous enrichment · 1 hit", ok:true},
                {l:"Survival analysis (KM + Cox)", ok:true},
                {l:"Methods + References", ok:true},
                {l:"Supplementary figures", ok:false},
              ].map((s,i)=>(
                <div key={i} style={{display:"flex", alignItems:"center", gap:8, padding:"7px 0", borderTop:i?"1px solid var(--line-2)":"none", fontSize:12.5}}>
                  <Icon name={s.ok?"check":"warn"} size={13} style={{color: s.ok?"#2f6b3a":"#b8601a"}}/>
                  <span style={{flex:1}}>{s.l}</span>
                  {s.ok ? <span className="chip ok" style={{padding:"1px 6px", fontSize:10}}>included</span> : <button className="btn sm ghost">Add</button>}
                </div>
              ))}
            </div>
          </div>

          <div className="card">
            <div className="card-head"><div className="card-title">Export</div></div>
            <div style={{padding:12, display:"grid", gridTemplateColumns:"1fr 1fr", gap:8}}>
              {[
                {l:"PDF report", icon:"doc"},
                {l:"Methods (DOCX)", icon:"doc"},
                {l:"Figures (PNG)", icon:"chart"},
                {l:"Tables (CSV)", icon:"grid"},
                {l:"Full ZIP", icon:"folder"},
                {l:"Share link", icon:"link"},
              ].map((e,i)=>(
                <button key={i} className="btn sm" style={{justifyContent:"flex-start"}}><Icon name={e.icon} size={13}/> {e.l}</button>
              ))}
            </div>
          </div>

          <Interpretation
            title="Copilot review"
            bullets={[
              "Your report is **publication-ready**. I've inserted 3 citations (TCGA 2013, Verhaak 2010, SEAS 2022) and exported figures at 300 DPI.",
              "Suggested next analysis: re-run with Mesenchymal-only population as background to isolate the size effect.",
            ]}
            action={<><button className="btn sm ai"><Icon name="sparkle" size={12}/> Queue follow-up</button><button className="btn sm primary">Publish</button></>}
          />
        </div>
      </div>
    </>
  );
};

Object.assign(window, {
  OverviewScreen, DataInputScreen, RelationsScreen, CohortScreen,
  DiscreteScreen, ContinuousScreen, SurvivalScreen, ReportScreen,
  PageHeader, Stat, Interpretation
});
