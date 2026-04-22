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
    background: "#fff",
    borderRight: "1px solid var(--line)",
    display: "flex", flexDirection: "column",
    transition: "width .18s ease",
    flexShrink: 0, position:"sticky", top:0, height:"100vh"
  }}>
    <div style={{padding: collapsed ? "14px 10px" : "14px 16px", display:"flex", alignItems:"center", gap:10, borderBottom:"1px solid var(--line)"}}>
      <div style={{width:28, height:28, borderRadius:8, background:"var(--ink)", display:"grid", placeItems:"center", color:"#f3c27a"}}>
        <svg width="16" height="16" viewBox="0 0 20 20"><path d="M4 14c2 2 5 2 7 0s5-2 7 0" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/><path d="M4 9c2 2 5 2 7 0s5-2 7 0" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/></svg>
      </div>
      {!collapsed && (<>
        <div style={{lineHeight:1.1, flex:1}}>
          <div style={{fontWeight:700, letterSpacing:"-.01em"}}>SEAS <span className="mono" style={{fontSize:11, color:"var(--ink-3)", fontWeight:500}}>2.0</span></div>
          <div style={{fontSize:11, color:"var(--ink-3)"}}>AI-Medicine Lab</div>
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
                background: active ? "var(--ink)" : "transparent",
                color: active ? "#fff" : "var(--ink-2)",
                fontSize: 13, margin: "1px 0", justifyContent: collapsed ? "center" : "flex-start",
              }}>
                <Icon name={it.icon} size={15} style={{color: active ? "#f3c27a" : "var(--ink-3)", flexShrink:0}}/>
                {!collapsed && <span>{it.label}</span>}
                {!collapsed && active && <Icon name="chevR" size={12} style={{marginLeft:"auto", opacity:.7}}/>}
              </button>
            );
          })}
        </div>
      ))}
    </nav>

    {!collapsed && (
      <div style={{padding:10, borderTop:"1px solid var(--line)"}}>
        <div className="ai-border" style={{borderRadius:10, padding:"8px 10px", background:"linear-gradient(180deg,#fff,#fbf6ee)", display:"flex", alignItems:"center", gap:8}}>
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

const Topbar = ({ onToggleChat, chatOpen, screen }) => {
  const label = {
    overview:"Overview", input:"Data Input", relations:"Clinotype Relations",
    cohort:"Cohort Selection", discrete:"Discrete Enrichment",
    continuous:"Continuous Enrichment", survival:"Survival Analysis", report:"Final Report",
    faqs:"FAQs", about:"About",
  }[screen] || "SEAS";
  return (
    <header style={{
      position:"sticky", top:0, zIndex:30, background:"rgba(247,246,243,.85)", backdropFilter:"blur(8px)",
      borderBottom:"1px solid var(--line)", display:"flex", alignItems:"center", gap:12, padding:"10px 20px"
    }}>
      <div style={{display:"flex", alignItems:"center", gap:8, fontSize:12.5, color:"var(--ink-3)"}}>
        <Icon name="folder" size={13}/> AI-Medicine Lab
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
          background:"#fff", outline:"none"
        }}/>
        <span className="kbd" style={{position:"absolute", right:8, top:7}}>⌘K</span>
      </div>
      <button className="btn sm"><Icon name="help" size={13}/> Docs</button>
      <button className="btn sm" onClick={onToggleChat} style={{borderColor: chatOpen?"#e9d5b4":"var(--line)", background: chatOpen?"#fbf6ee":"#fff"}}>
        <Icon name="sparkle" size={13} style={{color:"#b8601a"}}/> Copilot {chatOpen?"·":""}
      </button>
      <div style={{width:28, height:28, borderRadius:"50%", background:"#3a3f8f", color:"#fff", display:"grid", placeItems:"center", fontSize:12, fontWeight:600}}>SK</div>
    </header>
  );
};

// Footer status bar
const StatusBar = ({ runningAgent, screen, dataset, onToggleChat }) => (
  <footer style={{
    position:"sticky", bottom:0, zIndex:20,
    borderTop:"1px solid var(--line)", background:"#fff",
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

// Help/FAQ screen (small)
const FAQScreen = ({ onBack }) => (
  <div style={{padding:"28px 28px", maxWidth:920, margin:"0 auto"}}>
    <PageHeader step={1} totalSteps={1} title="FAQs" subtitle="Common questions about SEAS 2.0, its tests, and AI features." onBack={onBack}/>
    <div className="card" style={{marginTop:18}}>
      {[
        {q:"What statistical tests does SEAS run?", a:"Discrete clinotypes use Fisher's exact test; continuous clinotypes use the Kolmogorov–Smirnov test. Survival uses log-rank + Cox proportional hazards. All p-values are BH-corrected per family."},
        {q:"How does the AI Copilot work?", a:"Copilot is an agent that can call SEAS tools (cohort selection, enrichment, survival, report) and your configured MCP data sources. Every tool call is logged so the analysis is fully reproducible."},
        {q:"What are MCP sources?", a:"Model Context Protocol servers your admin has connected — TCGA, cBioPortal, REDCap, hospital FHIR, S3, etc. The agent can read (and, where allowed, write) through them."},
        {q:"Can I run SEAS without the AI features?", a:"Yes. Every AI feature has a manual equivalent and can be disabled per-workspace."},
      ].map((x,i)=>(
        <details key={i} style={{padding:"14px 18px", borderTop:i?"1px solid var(--line-2)":"none"}}>
          <summary style={{fontSize:14, fontWeight:500, cursor:"pointer"}}>{x.q}</summary>
          <div style={{fontSize:13, color:"var(--ink-2)", lineHeight:1.55, marginTop:8}}>{x.a}</div>
        </details>
      ))}
    </div>
  </div>
);

const AboutScreen = ({ onBack })=>(
  <div style={{padding:"28px 28px", maxWidth:920, margin:"0 auto"}}>
    <PageHeader step={1} totalSteps={1} title="About SEAS" subtitle="A tool from the AI-Medicine Lab to annotate metadata neighborhoods of biological samples." onBack={onBack}/>
    <div className="card" style={{marginTop:18, padding:22}}>
      <p style={{fontSize:13.5, lineHeight:1.6, color:"var(--ink-2)"}}>SEAS 2.0 is a rewrite of the original SEAS Shiny app in a modern web stack with an AI Copilot, MCP-based data connectors, and agentic execution. The core statistics — Fisher's, KS, log-rank, Cox — remain identical, so results from v1.1 are reproducible.</p>
      <div style={{display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:12, marginTop:14}}>
        <Stat label="Version" value="2.0.0-beta.14"/>
        <Stat label="Release" value="Apr 2026"/>
        <Stat label="License" value="MIT"/>
      </div>
    </div>
  </div>
);

// ---------- App ----------
const App = () => {
  const [screen, setScreen] = uS2(() => localStorage.getItem("seas-screen") || "overview");
  const [chatOpen, setChatOpen] = uS2(() => localStorage.getItem("seas-chat") === "1");
  const [collapsed, setCollapsed] = uS2(false);
  const [pivotId, setPivotId] = uS2("TCGA-02-0001-01");
  const [runningAgent, setRunningAgent] = uS2(false);
  const [agentStep, setAgentStep] = uS2(0);

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
        <Topbar onToggleChat={()=>setChatOpen(v=>!v)} chatOpen={chatOpen} screen={screen}/>
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
          padding:"10px 14px", border:0, background:"#fff", borderRadius:999,
          boxShadow:"var(--shadow-lg)", cursor:"pointer", display:"flex", alignItems:"center", gap:8
        }}>
          <div style={{width:24, height:24, borderRadius:7, background:"#171715", color:"#f3c27a", display:"grid", placeItems:"center"}}>
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
