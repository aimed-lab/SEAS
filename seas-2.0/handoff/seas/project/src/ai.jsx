// AI chat panel + MCP connectors + agentic runs.

const { useState, useEffect, useRef, useMemo } = React;

// ------- MCP sources catalog (mock) -------
const mcpCatalog = [
  {id:"tcga", name:"TCGA Clinical", type:"MCP", icon:"db", connected:true, tables:12, detail:"Pan-cancer clinical + molecular metadata"},
  {id:"cbioportal", name:"cBioPortal", type:"MCP", icon:"db", connected:true, tables:34, detail:"Mutation, CNA, expression"},
  {id:"fhir", name:"Hospital FHIR", type:"MCP", icon:"plug", connected:false, tables:0, detail:"Live EHR (pilot)"},
  {id:"redcap", name:"REDCap Study", type:"MCP", icon:"folder", connected:true, tables:4, detail:"Internal radiomics capture"},
  {id:"s3", name:"s3://aimed-cohorts", type:"MCP", icon:"folder", connected:true, tables:18, detail:"Parquet, CSV"},
  {id:"gdc", name:"GDC Files", type:"MCP", icon:"db", connected:false, tables:0, detail:"Genomic Data Commons"},
];

// ------- Suggested prompts per screen -------
const suggestedPrompts = {
  overview: [
    "Which cohorts in this dataset look most clinically distinct?",
    "Summarize the TCGA GBM case-study for a first-time user.",
  ],
  input: [
    "Validate my upload and flag missing columns.",
    "Map these columns to SEAS schema automatically.",
  ],
  relations: [
    "Find pairs of clinotypes with strong linear relationships.",
    "Does age correlate with tumor longest dimension?",
  ],
  cohort: [
    "Pick the 16-patient neighborhood around TCGA-02-0001-01.",
    "Draw a cohort of Mesenchymal subtype with high longest_dimension.",
  ],
  discrete: [
    "Explain why Cluster 1 is enriched in this cohort.",
    "Which enriched clinotypes are actionable for treatment?",
  ],
  continuous: [
    "Interpret the KDE for longest_dimension.",
    "Suggest continuous clinotypes to test next.",
  ],
  survival: [
    "Is survival meaningfully different between cohort and population?",
    "Fit a Cox model adjusting for age and subtype.",
  ],
  report: [
    "Draft a Methods paragraph for this analysis.",
    "Export a PDF summary and email it to me.",
  ],
};

// ------- Agent run definition (mock plan) -------
const agentPlan = [
  { id:"s1", label:"Load TCGA GBM demo dataset", tool:"seas.load_dataset", status:"done", detail:"434 samples, 21 clinotypes" },
  { id:"s2", label:"Compute 2D embedding (UMAP)", tool:"seas.embed", status:"done", detail:"n_neighbors=15, min_dist=0.1" },
  { id:"s3", label:"Select neighborhood around pivot", tool:"seas.cohort.neighborhood", status:"done", detail:"pivot=TCGA-02-0001-01, k=16" },
  { id:"s4", label:"Discrete enrichment (Fisher + BH)", tool:"seas.enrich.discrete", status:"running", detail:"304 tests, streaming" },
  { id:"s5", label:"Continuous enrichment (KS-test)", tool:"seas.enrich.continuous", status:"queued", detail:"21 tests" },
  { id:"s6", label:"Survival (log-rank + Cox)", tool:"seas.survival", status:"queued", detail:"OS.time ~ cohort" },
  { id:"s7", label:"Draft report + figures", tool:"seas.report.compose", status:"queued", detail:"markdown + PNG" },
];

// ------- Chat message log (canned) -------
const demoMessages = [
  { role:"user", text:"I loaded TCGA GBM. Draw a cohort around TCGA-02-0001-01 and run the full SEAS pipeline.", at:"10:24" },
  { role:"assistant", kind:"plan", at:"10:24",
    text:"Got it — I'll run SEAS end-to-end, pausing if anything looks off. Here's my plan:" },
  { role:"tool", toolName:"seas.cohort.neighborhood", status:"done", at:"10:24",
    text:"Selected 16-sample neighborhood (k=16) around TCGA-02-0001-01.",
    meta:["k=16","dist=euclidean"] },
  { role:"tool", toolName:"seas.enrich.discrete", status:"done", at:"10:25",
    text:"304 discrete tests · BH-adjusted · 8 enriched (q<0.05).",
    meta:["top: Cluster=Cluster 1 (q=4.6e-20)"] },
  { role:"assistant", kind:"insight", at:"10:25",
    text:"**Cluster 1** is strongly enriched (q=4.6e-20, OR=4.8). Mesenchymal subtype co-enriches (q=8e-3). Tumor **longest_dimension** is higher in-cohort (continuous KS q=3.3e-5). Survival trends worse but does not reach significance (log-rank p=0.031, borderline after correction). Want me to draft the Methods paragraph?" },
];

// ------- Inline AI chip with tiny pulse -------
const AIChip = ({label="AI"}) => (
  <span className="chip ai"><Icon name="sparkle" size={12}/> {label}</span>
);

// ------- The right-side chat panel -------
const ChatPanel = ({ open, onClose, screen="overview", onRunAgent, dataset, runningAgent, agentStep }) => {
  const [input, setInput] = useState("");
  const [msgs, setMsgs] = useState(demoMessages);
  const [mcpOpen, setMcpOpen] = useState(false);
  const [thinking, setThinking] = useState(false);
  const endRef = useRef(null);

  useEffect(()=>{ endRef.current?.scrollTo({top: endRef.current.scrollHeight, behavior:"smooth"}); }, [msgs.length, thinking]);

  const send = (text) => {
    if(!text.trim()) return;
    setMsgs(m=>[...m, {role:"user", text, at:"now"}]);
    setInput("");
    setThinking(true);
    setTimeout(()=>{
      setThinking(false);
      setMsgs(m=>[...m, {
        role:"assistant", kind:"insight", at:"now",
        text: "I can answer from the loaded dataset and your last run. Here's what I'd recommend: use the **Run agent** button to execute this as a tool call so every step is cited in the report."
      }]);
    }, 900);
  };

  if(!open) return null;

  return (
    <aside className="fade-up" style={{
      position:"fixed", right:12, top:12, bottom:12, width:400, zIndex:50,
      background:"#fff", border:"1px solid var(--line)", borderRadius:14,
      boxShadow:"var(--shadow-lg)", display:"flex", flexDirection:"column", overflow:"hidden"
    }}>
      {/* header */}
      <div className="ai-border" style={{padding:"12px 14px", borderRadius:14, borderBottomLeftRadius:0, borderBottomRightRadius:0, display:"flex", alignItems:"center", gap:10, background:"linear-gradient(180deg,#fff,#fbf6ee)"}}>
        <div style={{width:28, height:28, borderRadius:8, background:"#171715", color:"#f3c27a", display:"grid", placeItems:"center"}}>
          <Icon name="sparkle" size={16}/>
        </div>
        <div style={{flex:1, lineHeight:1.15}}>
          <div style={{fontSize:13, fontWeight:600}}>SEAS Copilot</div>
          <div style={{fontSize:11, color:"var(--ink-3)"}}>Agentic · MCP-connected · read/write tools</div>
        </div>
        <button className="btn sm ghost" onClick={()=>setMcpOpen(v=>!v)} title="MCP sources">
          <Icon name="plug" size={14}/> {mcpCatalog.filter(m=>m.connected).length}
        </button>
        <button className="btn sm ghost" onClick={onClose}><Icon name="x" size={14}/></button>
      </div>

      {/* MCP panel */}
      {mcpOpen && (
        <div className="fade-up" style={{padding:"10px 14px", borderBottom:"1px solid var(--line)", background:"var(--surface-2)"}}>
          <div style={{fontSize:11, color:"var(--ink-3)", textTransform:"uppercase", letterSpacing:".06em", marginBottom:8}}>Data sources (MCP)</div>
          <div style={{display:"flex", flexDirection:"column", gap:6}}>
            {mcpCatalog.map(s=>(
              <div key={s.id} style={{display:"flex", alignItems:"center", gap:10, padding:"8px 10px", background:"#fff", border:"1px solid var(--line)", borderRadius:8}}>
                <Icon name={s.icon} size={15}/>
                <div style={{flex:1}}>
                  <div style={{fontSize:12.5, fontWeight:500}}>{s.name}</div>
                  <div style={{fontSize:11, color:"var(--ink-3)"}}>{s.detail}</div>
                </div>
                {s.connected ? (
                  <span className="chip ok"><span className="dot"/> connected</span>
                ) : (
                  <button className="btn sm">Connect</button>
                )}
              </div>
            ))}
            <button className="btn sm" style={{justifyContent:"center"}}><Icon name="plus" size={13}/> Add MCP server</button>
          </div>
        </div>
      )}

      {/* messages */}
      <div ref={endRef} style={{flex:1, overflowY:"auto", padding:"14px 14px"}}>
        {msgs.map((m,i)=><ChatMessage key={i} m={m} agentPlan={agentPlan}/>)}
        {thinking && (
          <div style={{display:"flex", gap:6, marginTop:8, color:"var(--ink-3)", fontSize:12}}>
            <span>Copilot is thinking</span>
            <span className="thinking-dot">●</span><span className="thinking-dot">●</span><span className="thinking-dot">●</span>
          </div>
        )}
        {runningAgent && <AgentRun step={agentStep}/>}
      </div>

      {/* suggestions */}
      <div style={{padding:"8px 12px", borderTop:"1px solid var(--line)", display:"flex", gap:6, flexWrap:"wrap"}}>
        {(suggestedPrompts[screen]||suggestedPrompts.overview).map((p,i)=>(
          <button key={i} className="chip" style={{cursor:"pointer"}} onClick={()=>send(p)}>{p}</button>
        ))}
      </div>

      {/* composer */}
      <div style={{padding:"10px 12px", borderTop:"1px solid var(--line)", background:"var(--surface-2)"}}>
        <div style={{display:"flex", alignItems:"flex-end", gap:8, background:"#fff", border:"1px solid var(--line)", borderRadius:10, padding:"6px 8px"}}>
          <textarea
            value={input}
            onChange={e=>setInput(e.target.value)}
            onKeyDown={e=>{ if(e.key==="Enter" && !e.shiftKey){ e.preventDefault(); send(input);}}}
            rows={2}
            placeholder="Ask about the cohort, draft methods, or give the agent a task…"
            style={{flex:1, border:0, outline:"none", resize:"none", fontFamily:"inherit", fontSize:13, background:"transparent"}}
          />
          <div style={{display:"flex", flexDirection:"column", gap:4}}>
            <button className="btn sm ai" onClick={onRunAgent} title="Run as agent">
              <Icon name="bolt" size={13}/> Run agent
            </button>
            <button className="btn sm primary" onClick={()=>send(input)}>Send</button>
          </div>
        </div>
        <div style={{display:"flex", alignItems:"center", justifyContent:"space-between", marginTop:6, fontSize:11, color:"var(--ink-3)"}}>
          <div style={{display:"flex", gap:10}}>
            <span><Icon name="tool" size={12}/> 9 tools</span>
            <span><Icon name="plug" size={12}/> {mcpCatalog.filter(m=>m.connected).length} MCP</span>
            <span><Icon name="doc" size={12}/> Dataset: {dataset?.name||"—"}</span>
          </div>
          <span className="mono">claude-haiku-4-5</span>
        </div>
      </div>
    </aside>
  );
};

// ------- One chat message -------
const ChatMessage = ({ m, agentPlan }) => {
  if(m.role==="user"){
    return (
      <div style={{display:"flex", justifyContent:"flex-end", marginBottom:10}}>
        <div style={{maxWidth:"85%", background:"var(--ink)", color:"#fff", padding:"9px 12px", borderRadius:"12px 12px 2px 12px", fontSize:13, lineHeight:1.45}}>
          {m.text}
        </div>
      </div>
    );
  }
  if(m.role==="tool"){
    return (
      <div style={{marginBottom:10, background:"#fff", border:"1px solid var(--line)", borderRadius:10, padding:"8px 10px"}}>
        <div style={{display:"flex", alignItems:"center", gap:8, fontSize:11.5}}>
          <Icon name="tool" size={13} style={{color:"var(--teal)"}}/>
          <span className="mono" style={{color:"var(--teal-ink)"}}>{m.toolName}</span>
          {m.status==="done" && <span className="chip ok"><Icon name="check" size={11}/> done</span>}
          <span style={{marginLeft:"auto", color:"var(--ink-4)", fontSize:10.5}}>{m.at}</span>
        </div>
        <div style={{fontSize:12.5, color:"var(--ink-2)", marginTop:6}}>{m.text}</div>
        {m.meta && (
          <div style={{display:"flex", gap:6, flexWrap:"wrap", marginTop:6}}>
            {m.meta.map((x,i)=><span key={i} className="chip mono" style={{fontSize:10.5}}>{x}</span>)}
          </div>
        )}
      </div>
    );
  }
  // assistant
  if(m.kind==="plan"){
    return (
      <div style={{marginBottom:10}}>
        <div style={{fontSize:13, color:"var(--ink)", marginBottom:8, lineHeight:1.5}}>{m.text}</div>
        <div style={{border:"1px solid var(--line)", borderRadius:10, overflow:"hidden"}}>
          {agentPlan.map((s,i)=>(
            <div key={s.id} style={{display:"flex", alignItems:"center", gap:10, padding:"8px 10px", borderTop:i?"1px solid var(--line-2)":"none", background: s.status==="running" ? "var(--amber-wash)" : "#fff"}}>
              <div style={{width:18, height:18, borderRadius:999, background: s.status==="done"?"#2f6b3a":s.status==="running"?"#b8601a":"#e7e5df", color:"#fff", fontSize:10, display:"grid", placeItems:"center"}}>
                {s.status==="done"?<Icon name="check" size={12}/>:s.status==="running"?<span className="thinking-dot">●</span>:i+1}
              </div>
              <div style={{flex:1, lineHeight:1.25}}>
                <div style={{fontSize:12.5, color:"var(--ink)"}}>{s.label}</div>
                <div style={{fontSize:11, color:"var(--ink-3)"}}><span className="mono">{s.tool}</span> · {s.detail}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }
  return (
    <div style={{marginBottom:12, display:"flex", gap:8}}>
      <div style={{width:22, height:22, borderRadius:7, background:"#171715", color:"#f3c27a", display:"grid", placeItems:"center", flexShrink:0}}>
        <Icon name="sparkle" size={12}/>
      </div>
      <div style={{flex:1, fontSize:13, lineHeight:1.5, color:"var(--ink)"}}
           dangerouslySetInnerHTML={{__html: m.text.replace(/\*\*(.*?)\*\*/g,'<strong>$1</strong>')}}/>
    </div>
  );
};

// ------- Live agent run widget -------
const AgentRun = ({ step=3 })=>{
  return (
    <div className="ai-border" style={{borderRadius:12, padding:10, background:"#fff", marginTop:6}}>
      <div style={{display:"flex", alignItems:"center", gap:8, marginBottom:8}}>
        <Icon name="bolt" size={14} style={{color:"#b8601a"}}/>
        <div style={{fontSize:12.5, fontWeight:600}}>Agent running</div>
        <span className="chip warn" style={{marginLeft:"auto"}}><span className="dot thinking-dot"/> step {Math.min(step+1, agentPlan.length)} / {agentPlan.length}</span>
      </div>
      <div style={{display:"flex", flexDirection:"column", gap:4}}>
        {agentPlan.map((s,i)=>{
          const state = i<step?"done":i===step?"running":"queued";
          return (
            <div key={s.id} style={{display:"flex", gap:8, alignItems:"center", fontSize:12}}>
              <span style={{width:14, height:14, borderRadius:999, display:"grid", placeItems:"center",
                background: state==="done"?"#2f6b3a":state==="running"?"#b8601a":"#efede8",
                color:"#fff", fontSize:9}}>
                {state==="done"?"✓":state==="running"?"·":""}
              </span>
              <span className="mono" style={{color:"var(--teal-ink)"}}>{s.tool}</span>
              <span style={{color:"var(--ink-3)"}}>{s.label}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

Object.assign(window, { ChatPanel, AIChip, mcpCatalog, agentPlan });
