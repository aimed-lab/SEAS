// Plot components. Everything SVG, no external libs.

// ---------- Embedding scatter ----------
const EmbeddingPlot = ({
  width=640, height=420,
  colorBy="chemo", selectedIds=[], pivotId=null,
  onPick, onHoverNeighbors, hoverNeighbors=[],
  showLasso=false, interactive=true
}) => {
  const pad = {l:42,r:16,t:16,b:36};
  const xs = embedding.map(d=>d.x), ys = embedding.map(d=>d.y);
  const xmin=Math.min(...xs)-.5, xmax=Math.max(...xs)+.5;
  const ymin=Math.min(...ys)-.5, ymax=Math.max(...ys)+.5;
  const sx = v => pad.l + ((v-xmin)/(xmax-xmin))*(width-pad.l-pad.r);
  const sy = v => height-pad.b - ((v-ymin)/(ymax-ymin))*(height-pad.t-pad.b);

  const palette = {
    chemo: {YES:"#b8601a", NO:"#0f6b6b", NA:"#a8a8a0"},
    cluster: {"Cluster 1":"#0f6b6b","Cluster 2":"#3a3f8f","Cluster 3":"#b8601a","Cluster 4":"#9a3a4d","Cluster 5":"#2f6b3a"},
    subtype: {Classical:"#0f6b6b", Mesenchymal:"#b8601a", Proneural:"#3a3f8f", Neural:"#9a3a4d"},
  };
  const keyOf = d => colorBy==="cluster"?d.cluster:colorBy==="subtype"?d.subtype:d.chemo;
  const pal = palette[colorBy]||palette.chemo;

  const xTicks=[0,5,10,15], yTicks=[0,5,10,15];

  // selection = neighbors around pivot
  const selSet = new Set(selectedIds);
  const hoverSet = new Set(hoverNeighbors);

  return (
    <svg width={width} height={height} style={{display:"block"}}>
      {/* axes */}
      <g>
        {yTicks.map(t=>(
          <g key={'y'+t}>
            <line x1={pad.l} x2={width-pad.r} y1={sy(t)} y2={sy(t)} stroke="#efede8"/>
            <text x={pad.l-8} y={sy(t)+4} textAnchor="end" fontSize="10.5" fontFamily="JetBrains Mono" fill="#6d6d66">{t}</text>
          </g>
        ))}
        {xTicks.map(t=>(
          <g key={'x'+t}>
            <line y1={pad.t} y2={height-pad.b} x1={sx(t)} x2={sx(t)} stroke="#efede8"/>
            <text y={height-pad.b+16} x={sx(t)} textAnchor="middle" fontSize="10.5" fontFamily="JetBrains Mono" fill="#6d6d66">{t}</text>
          </g>
        ))}
        <line x1={pad.l} x2={width-pad.r} y1={height-pad.b} y2={height-pad.b} stroke="#d9d7d1"/>
        <line x1={pad.l} x2={pad.l} y1={pad.t} y2={height-pad.b} stroke="#d9d7d1"/>
        <text x={(pad.l+width-pad.r)/2} y={height-6} fontSize="11" fill="#6d6d66" textAnchor="middle">UMAP-1</text>
        <text transform={`rotate(-90 14 ${(pad.t+height-pad.b)/2})`} x="14" y={(pad.t+height-pad.b)/2} textAnchor="middle" fontSize="11" fill="#6d6d66">UMAP-2</text>
      </g>

      {/* points */}
      {embedding.map((d,i)=>{
        const isSel = selSet.has(d.id);
        const isHover = hoverSet.has(d.id);
        const isPivot = d.id===pivotId;
        return (
          <circle key={d.id} cx={sx(d.x)} cy={sy(d.y)}
            r={isPivot?5.5:isSel?4:isHover?3.6:2.6}
            fill={pal[keyOf(d)]||"#a8a8a0"}
            fillOpacity={isSel||isPivot?.95:.72}
            stroke={isPivot?"#171715":isSel?"#171715":"#fff"}
            strokeWidth={isPivot?1.5:isSel?1:.6}
            onClick={interactive?()=>onPick&&onPick(d):null}
            style={{cursor:interactive?"pointer":"default"}}
          />
        );
      })}

      {/* neighborhood halo */}
      {pivotId && (() => {
        const p = embedding.find(e=>e.id===pivotId);
        if(!p) return null;
        return (<>
          <circle cx={sx(p.x)} cy={sy(p.y)} r="36" fill="none" stroke="#171715" strokeDasharray="3 3" opacity=".55"/>
          <circle cx={sx(p.x)} cy={sy(p.y)} r="22" fill="#17171510" stroke="none"/>
        </>);
      })()}

      {/* lasso overlay example */}
      {showLasso && (
        <path d={`M ${sx(8)} ${sy(11)} C ${sx(11)} ${sy(13)}, ${sx(13)} ${sy(10)}, ${sx(12)} ${sy(7)} S ${sx(8)} ${sy(6)}, ${sx(7)} ${sy(9)} Z`}
          fill="#17171510" stroke="#171715" strokeDasharray="4 3"/>
      )}

      {/* legend */}
      <g transform={`translate(${width-pad.r-112},${pad.t+6})`}>
        <rect x="0" y="0" width="108" height={Object.keys(pal).length*16+14} rx="6" fill="#fff" stroke="#e7e5df"/>
        <text x="8" y="14" fontSize="10.5" fill="#6d6d66" fontWeight="500">
          {colorBy==="cluster"?"Cluster":colorBy==="subtype"?"Subtype":"Chemo"}
        </text>
        {Object.entries(pal).map(([k,v],i)=>(
          <g key={k} transform={`translate(8,${24+i*16})`}>
            <circle cx="5" cy="0" r="4" fill={v}/>
            <text x="14" y="3" fontSize="10.5" fill="#171715">{k}</text>
          </g>
        ))}
      </g>
    </svg>
  );
};

// ---------- Kaplan-Meier ----------
const KMPlot = ({width=560, height=320}) => {
  const pad={l:46,r:16,t:16,b:38};
  const sx = t => pad.l + (t/126)*(width-pad.l-pad.r);
  const sy = s => height-pad.b - s*(height-pad.t-pad.b);
  const toPath = (pts)=>{
    let d=`M ${sx(pts[0].t)} ${sy(pts[0].s)}`;
    for(let i=1;i<pts.length;i++){
      d+=` L ${sx(pts[i].t)} ${sy(pts[i-1].s)} L ${sx(pts[i].t)} ${sy(pts[i].s)}`;
    }
    return d;
  };
  const yTicks=[0,.25,.5,.75,1];
  const xTicks=[0,24,48,72,96,120];
  return (
    <svg width={width} height={height}>
      {yTicks.map(t=>(<g key={'y'+t}>
        <line x1={pad.l} x2={width-pad.r} y1={sy(t)} y2={sy(t)} stroke="#efede8"/>
        <text x={pad.l-8} y={sy(t)+4} textAnchor="end" fontSize="10.5" fontFamily="JetBrains Mono" fill="#6d6d66">{t.toFixed(2)}</text>
      </g>))}
      {xTicks.map(t=>(<g key={'x'+t}>
        <text x={sx(t)} y={height-pad.b+16} textAnchor="middle" fontSize="10.5" fontFamily="JetBrains Mono" fill="#6d6d66">{t}</text>
      </g>))}
      <line x1={pad.l} x2={width-pad.r} y1={height-pad.b} y2={height-pad.b} stroke="#d9d7d1"/>
      <line x1={pad.l} x2={pad.l} y1={pad.t} y2={height-pad.b} stroke="#d9d7d1"/>
      <path d={toPath(kmPop)} fill="none" stroke="#9a3a4d" strokeWidth="1.8"/>
      <path d={toPath(kmCohort)} fill="none" stroke="#0f6b6b" strokeWidth="1.8"/>
      <text x={(pad.l+width-pad.r)/2} y={height-6} textAnchor="middle" fontSize="11" fill="#6d6d66">Time (months)</text>
      <text transform={`rotate(-90 14 ${(pad.t+height-pad.b)/2})`} x="14" y={(pad.t+height-pad.b)/2} textAnchor="middle" fontSize="11" fill="#6d6d66">Survival probability</text>
      {/* p-value */}
      <g transform={`translate(${width-pad.r-90},${pad.t+10})`}>
        <rect width="84" height="58" rx="6" fill="#fff" stroke="#e7e5df"/>
        <text x="10" y="16" fontSize="10.5" fill="#6d6d66">log-rank</text>
        <text x="10" y="34" fontSize="13" fontFamily="JetBrains Mono" fill="#171715">p = 0.031</text>
        <text x="10" y="50" fontSize="10.5" fill="#6d6d66">HR 1.34 (95% CI 1.02–1.76)</text>
      </g>
      {/* legend */}
      <g transform={`translate(${pad.l+8},${pad.t+6})`}>
        <circle cx="4" cy="4" r="4" fill="#9a3a4d"/><text x="14" y="8" fontSize="10.5" fill="#171715">Background population (n=434)</text>
        <circle cx="4" cy="22" r="4" fill="#0f6b6b"/><text x="14" y="26" fontSize="10.5" fill="#171715">Selected cohort (n=16)</text>
      </g>
    </svg>
  );
};

// ---------- KDE ----------
const KDEPlot = ({width=560, height=260, title="Kernel Density Estimates for CDE_DxAge by gender"})=>{
  const pad={l:46,r:16,t:22,b:38};
  const allY = [...kdeMale.map(d=>d.y), ...kdeFemale.map(d=>d.y)];
  const ymax = Math.max(...allY)*1.1;
  const sx = x => pad.l + ((x-15)/70)*(width-pad.l-pad.r);
  const sy = y => height-pad.b - (y/ymax)*(height-pad.t-pad.b);
  const area = (pts,fill,stroke)=>{
    let d=`M ${sx(pts[0].x)} ${sy(0)}`;
    pts.forEach(p=>d+=` L ${sx(p.x)} ${sy(p.y)}`);
    d+=` L ${sx(pts[pts.length-1].x)} ${sy(0)} Z`;
    return <><path d={d} fill={fill} fillOpacity=".22"/><path d={d.replace(/M.*?L/,'M ').replace(/ Z$/,'')} fill="none" stroke={stroke} strokeWidth="1.6"/></>;
  };
  const xTicks=[25,50,75];
  return (
    <svg width={width} height={height}>
      <text x={pad.l} y={14} fontSize="11.5" fontWeight="500" fill="#171715">{title}</text>
      {xTicks.map(t=>(<g key={'x'+t}>
        <line x1={sx(t)} x2={sx(t)} y1={pad.t} y2={height-pad.b} stroke="#efede8"/>
        <text x={sx(t)} y={height-pad.b+16} textAnchor="middle" fontSize="10.5" fontFamily="JetBrains Mono" fill="#6d6d66">{t}</text>
      </g>))}
      {[0,0.01,0.02,0.03].map(t=>(<g key={'y'+t}>
        <line x1={pad.l} x2={width-pad.r} y1={sy(t)} y2={sy(t)} stroke="#efede8"/>
        <text x={pad.l-6} y={sy(t)+4} textAnchor="end" fontSize="10.5" fontFamily="JetBrains Mono" fill="#6d6d66">{t.toFixed(2)}</text>
      </g>))}
      <line x1={pad.l} x2={width-pad.r} y1={height-pad.b} y2={height-pad.b} stroke="#d9d7d1"/>
      <line x1={pad.l} x2={pad.l} y1={pad.t} y2={height-pad.b} stroke="#d9d7d1"/>
      {area(kdeFemale,"#9a3a4d","#9a3a4d")}
      {area(kdeMale,"#0f6b6b","#0f6b6b")}
      <text x={(pad.l+width-pad.r)/2} y={height-6} textAnchor="middle" fontSize="11" fill="#6d6d66">CDE_DxAge</text>
      <text transform={`rotate(-90 14 ${(pad.t+height-pad.b)/2})`} x="14" y={(pad.t+height-pad.b)/2} textAnchor="middle" fontSize="11" fill="#6d6d66">Density</text>
      <g transform={`translate(${width-pad.r-80},${pad.t+2})`}>
        <circle cx="4" cy="4" r="4" fill="#9a3a4d"/><text x="14" y="8" fontSize="10.5" fill="#171715">FEMALE</text>
        <circle cx="4" cy="20" r="4" fill="#0f6b6b"/><text x="14" y="24" fontSize="10.5" fill="#171715">MALE</text>
      </g>
    </svg>
  );
};

// ---------- Box plot (grouped) ----------
const BoxPlot = ({width=560, height=260})=>{
  const pad={l:46,r:16,t:22,b:44};
  const groups = [
    {label:"Cluster 1", q1:.35,med:.5,q3:.65,lo:.22,hi:.82, n:86},
    {label:"Cluster 2", q1:.48,med:.62,q3:.76,lo:.32,hi:.9, n:112},
    {label:"Cluster 3", q1:.3,med:.44,q3:.6,lo:.15,hi:.82, n:74},
    {label:"Cluster 4", q1:.52,med:.7,q3:.82,lo:.35,hi:.96, n:98},
    {label:"Cluster 5", q1:.2,med:.34,q3:.5,lo:.08,hi:.7, n:64},
  ];
  const bw = (width-pad.l-pad.r)/groups.length;
  const sy = v => height-pad.b - v*(height-pad.t-pad.b);
  const colors = ["#0f6b6b","#3a3f8f","#b8601a","#9a3a4d","#2f6b3a"];
  return (
    <svg width={width} height={height}>
      <text x={pad.l} y={14} fontSize="11.5" fontWeight="500" fill="#171715">longest_dimension (mm) by Cluster</text>
      {[0,.25,.5,.75,1].map(t=>(<g key={t}>
        <line x1={pad.l} x2={width-pad.r} y1={sy(t)} y2={sy(t)} stroke="#efede8"/>
        <text x={pad.l-6} y={sy(t)+4} textAnchor="end" fontSize="10.5" fontFamily="JetBrains Mono" fill="#6d6d66">{(t*80).toFixed(0)}</text>
      </g>))}
      {groups.map((g,i)=>{
        const cx = pad.l + bw*i + bw/2;
        const w = Math.min(42, bw*.55);
        return (
          <g key={g.label}>
            <line x1={cx} x2={cx} y1={sy(g.lo)} y2={sy(g.hi)} stroke="#6d6d66"/>
            <line x1={cx-w/3} x2={cx+w/3} y1={sy(g.lo)} y2={sy(g.lo)} stroke="#6d6d66"/>
            <line x1={cx-w/3} x2={cx+w/3} y1={sy(g.hi)} y2={sy(g.hi)} stroke="#6d6d66"/>
            <rect x={cx-w/2} y={sy(g.q3)} width={w} height={sy(g.q1)-sy(g.q3)} fill={colors[i]} fillOpacity=".22" stroke={colors[i]}/>
            <line x1={cx-w/2} x2={cx+w/2} y1={sy(g.med)} y2={sy(g.med)} stroke={colors[i]} strokeWidth="2"/>
            <text x={cx} y={height-pad.b+16} textAnchor="middle" fontSize="10.5" fill="#171715">{g.label}</text>
            <text x={cx} y={height-pad.b+30} textAnchor="middle" fontSize="10" fill="#6d6d66">n={g.n}</text>
          </g>
        );
      })}
      <line x1={pad.l} x2={width-pad.r} y1={height-pad.b} y2={height-pad.b} stroke="#d9d7d1"/>
    </svg>
  );
};

// ---------- Volcano ----------
const VolcanoPlot = ({width=560, height=340, onPick, picked})=>{
  const pad={l:46,r:16,t:16,b:38};
  const pts = [
    ...discreteEnrichment.map(d=>({label:`${d.clinotype}=${d.variable}`, or:d.or, p:parseFloat(d.p), adj:parseFloat(d.padj), enriched:d.enriched})),
    ...continuousEnrichment.map(d=>({label:d.clinotype, or:d.dir==="higher"?1.6:d.dir==="lower"?.7:1, p:parseFloat(d.p), adj:parseFloat(d.padj), enriched:d.enriched})),
  ];
  const xRange=[0.3,5.5];
  const sx = v => pad.l + ((Math.log2(v)-Math.log2(xRange[0]))/(Math.log2(xRange[1])-Math.log2(xRange[0])))*(width-pad.l-pad.r);
  const yMax = 22;
  const sy = p => pad.t + (p/yMax)*(height-pad.t-pad.b);
  const mlog = p => Math.min(yMax, -Math.log10(p));
  return (
    <svg width={width} height={height}>
      {[.5,1,2,4].map(t=>(<g key={t}>
        <line x1={sx(t)} x2={sx(t)} y1={pad.t} y2={height-pad.b} stroke="#efede8"/>
        <text x={sx(t)} y={height-pad.b+16} textAnchor="middle" fontSize="10.5" fontFamily="JetBrains Mono" fill="#6d6d66">{t}×</text>
      </g>))}
      {[0,5,10,15,20].map(t=>(<g key={t}>
        <line y1={sy(t)} y2={sy(t)} x1={pad.l} x2={width-pad.r} stroke="#efede8"/>
        <text y={sy(t)+4} x={pad.l-6} textAnchor="end" fontSize="10.5" fontFamily="JetBrains Mono" fill="#6d6d66">{t}</text>
      </g>))}
      <line x1={sx(1)} x2={sx(1)} y1={pad.t} y2={height-pad.b} stroke="#d9d7d1" strokeDasharray="3 3"/>
      <line y1={sy(-Math.log10(0.05))} y2={sy(-Math.log10(0.05))} x1={pad.l} x2={width-pad.r} stroke="#d9d7d1" strokeDasharray="3 3"/>
      <line x1={pad.l} x2={width-pad.r} y1={height-pad.b} y2={height-pad.b} stroke="#d9d7d1"/>
      <line x1={pad.l} x2={pad.l} y1={pad.t} y2={height-pad.b} stroke="#d9d7d1"/>
      {pts.map((d,i)=>(
        <circle key={i} cx={sx(d.or)} cy={height-pad.b - (mlog(d.adj)/yMax)*(height-pad.t-pad.b)}
          r={picked===d.label?6:4}
          fill={d.enriched?"#0f6b6b":"#a8a8a0"}
          fillOpacity={d.enriched?.85:.55}
          stroke={picked===d.label?"#171715":"#fff"} strokeWidth={picked===d.label?1.5:.6}
          onClick={()=>onPick&&onPick(d.label)} style={{cursor:"pointer"}}/>
      ))}
      {/* labels for top hits */}
      {pts.filter(d=>d.enriched && d.adj<1e-3).slice(0,4).map((d,i)=>(
        <text key={i} x={sx(d.or)+8} y={height-pad.b - (mlog(d.adj)/yMax)*(height-pad.t-pad.b)+3} fontSize="10.5" fill="#083f3f">{d.label}</text>
      ))}
      <text x={(pad.l+width-pad.r)/2} y={height-6} textAnchor="middle" fontSize="11" fill="#6d6d66">Odds ratio (log₂)</text>
      <text transform={`rotate(-90 14 ${(pad.t+height-pad.b)/2})`} x="14" y={(pad.t+height-pad.b)/2} textAnchor="middle" fontSize="11" fill="#6d6d66">−log₁₀ adjusted p</text>
    </svg>
  );
};

// ---------- Sparkline ----------
const Sparkline = ({values, width=120, height=28, color="#0f6b6b"})=>{
  const max=Math.max(...values), min=Math.min(...values);
  const sx = i => (i/(values.length-1))*width;
  const sy = v => height - ((v-min)/(max-min||1))*height;
  const d = values.map((v,i)=>(i?'L':'M')+sx(i).toFixed(1)+' '+sy(v).toFixed(1)).join(' ');
  return (
    <svg width={width} height={height}>
      <path d={d} fill="none" stroke={color} strokeWidth="1.4"/>
      <circle cx={sx(values.length-1)} cy={sy(values[values.length-1])} r="2.5" fill={color}/>
    </svg>
  );
};

Object.assign(window, { EmbeddingPlot, KMPlot, KDEPlot, BoxPlot, VolcanoPlot, Sparkline });
