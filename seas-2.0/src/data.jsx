// Seeded RNG so plots are stable
function mulberry32(seed){return function(){var t=seed+=0x6D2B79F5;t=Math.imul(t^t>>>15,t|1);t^=t+Math.imul(t^t>>>7,t|61);return((t^t>>>14)>>>0)/4294967296}}

const sampleDataset = {
  name: "TCGA GBM (demo)",
  samples: 434,
  clinotypes: 21,
  featureCols: 21,
  embedDims: 2,
  updated: "Apr 18, 2026",
  cohortDefault: 16,
  source: "The Cancer Genome Atlas — GBM clinical case-study",
};

// Generate a UMAP-like embedding
function genEmbedding(n, seed=7){
  const rnd = mulberry32(seed);
  const pts = [];
  // a few gaussian blobs
  const centers = [[4,6],[10,8],[7,2],[13,4],[3,1]];
  for(let i=0;i<n;i++){
    const c = centers[i%centers.length];
    const t = rnd()*Math.PI*2;
    const r = Math.abs(rnd()-rnd())*2.6;
    pts.push({
      id: `TCGA-02-${String(1000+i).padStart(4,'0')}-01`,
      x: c[0]+Math.cos(t)*r+(rnd()-.5)*1.4,
      y: c[1]+Math.sin(t)*r+(rnd()-.5)*1.4,
      cluster: `Cluster ${1+(i%5)}`,
      chemo: rnd()>.45?"YES":"NO",
      age: ["<=50",">50<=65",">65"][Math.floor(rnd()*3)],
      subtype: ["Classical","Mesenchymal","Proneural","Neural"][Math.floor(rnd()*4)],
    });
  }
  return pts;
}

const embedding = genEmbedding(434, 11);

const clinotypes = [
  {name:"longest_dimension", type:"continuous", group:"Radiomic"},
  {name:"CDE_DxAge", type:"continuous", group:"Demographic"},
  {name:"CDE_chemo_alk_days", type:"continuous", group:"Treatment"},
  {name:"CDE_chemo_tmz_days", type:"continuous", group:"Treatment"},
  {name:"CDE_sourcesite", type:"discrete", group:"Metadata"},
  {name:"gender", type:"discrete", group:"Demographic"},
  {name:"GeneExp_Subtype", type:"discrete", group:"Molecular"},
  {name:"Cluster", type:"discrete", group:"Molecular"},
  {name:"In_Cancer_Cell_Paper", type:"discrete", group:"Metadata"},
  {name:"additional_chemo_therapy", type:"discrete", group:"Treatment"},
  {name:"additional_radiation_therapy", type:"discrete", group:"Treatment"},
  {name:"histological_type", type:"discrete", group:"Pathology"},
];

// Discrete enrichment table (mock)
const discreteEnrichment = [
  {clinotype:"Cluster", variable:"Cluster 1", p:"1.525e-22", padj:"4.636e-20", enriched:true, or:4.8},
  {clinotype:"CDE_sourcesite", variable:"Site 2", p:"1.107e-08", padj:"1.682e-06", enriched:true, or:3.1},
  {clinotype:"In_Cancer_Cell_Paper", variable:"TRUE", p:"7.614e-05", padj:"7.716e-03", enriched:true, or:2.4},
  {clinotype:"GeneExp_Subtype", variable:"Mesenchymal", p:"8.21e-05", padj:"8.33e-03", enriched:true, or:2.2},
  {clinotype:"additional_chemo_therapy", variable:"YES", p:"3.44e-03", padj:"1.70e-01", enriched:false, or:1.4},
  {clinotype:"Cluster", variable:"Cluster 2", p:"1.000e+00", padj:"1.000e+00", enriched:false, or:0.92},
  {clinotype:"Discrete_CDE_DxAge", variable:"<=50", p:"7.070e-02", padj:"7.381e-01", enriched:false, or:1.2},
  {clinotype:"gender", variable:"MALE", p:"2.12e-01", padj:"8.42e-01", enriched:false, or:1.1},
  {clinotype:"histological_type", variable:"Glioblastoma", p:"5.32e-01", padj:"9.10e-01", enriched:false, or:1.0},
  {clinotype:"additional_radiation_therapy", variable:"YES", p:"4.01e-01", padj:"8.62e-01", enriched:false, or:1.05},
];

const continuousEnrichment = [
  {clinotype:"longest_dimension", p:"1.566e-06", padj:"3.288e-05", enriched:true, dir:"higher"},
  {clinotype:"CDE_DxAge", p:"2.550e-01", padj:"7.652e-01", enriched:false, dir:"none"},
  {clinotype:"CDE_chemo_alk_days", p:"1.849e-01", padj:"7.652e-01", enriched:false, dir:"none"},
  {clinotype:"CDE_chemo_tmz_days", p:"1.000e+00", padj:"1.000e+00", enriched:false, dir:"none"},
  {clinotype:"CDE_sourcesite", p:"3.856e-01", padj:"7.652e-01", enriched:false, dir:"none"},
  {clinotype:"Karnofsky", p:"3.20e-02", padj:"1.74e-01", enriched:false, dir:"lower"},
];

// Kaplan-Meier mock series (step function)
function genKM(seed, hazard){
  const rnd = mulberry32(seed);
  let s=1; const pts=[{t:0,s:1}];
  for(let t=1;t<=120;t+=2){
    const drop = rnd()*hazard*(1- t/260);
    s = Math.max(0, s - drop);
    pts.push({t,s});
    if(s<=0) break;
  }
  return pts;
}
const kmPop = genKM(3,0.028);
const kmCohort = genKM(9,0.036);

// KDE mock
function genKDE(seed, mu, sigma){
  const rnd = mulberry32(seed);
  const pts=[];
  for(let x=15;x<=85;x+=1){
    const y = Math.exp(-Math.pow((x-mu)/sigma,2)/2)/(sigma*Math.sqrt(2*Math.PI));
    pts.push({x, y:y*(1+(rnd()-.5)*.15)});
  }
  return pts;
}
const kdeMale = genKDE(2,55,12);
const kdeFemale = genKDE(5,58,13);

// Feature set preview rows
const featureRows = Array.from({length: 12}).map((_,i)=>{
  const e = embedding[i];
  return {
    id: e.id,
    dataset: "TCGA",
    cluster: e.cluster,
    age: e.age,
    chemo_alk: i%3===0 ? ">100" : "<=100",
    gender: i%2?"MALE":"FEMALE",
    subtype: e.subtype,
  };
});

Object.assign(window, {
  sampleDataset, embedding, clinotypes, discreteEnrichment,
  continuousEnrichment, kmPop, kmCohort, kdeMale, kdeFemale, featureRows,
  mulberry32
});
