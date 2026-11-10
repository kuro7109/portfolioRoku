<script>
"use strict";
const EMAIL="rohitkumawat7109@gmail.com";
const GMAIL="https://mail.google.com/mail/?view=cm&fs=1&to="+EMAIL, LINKEDIN="https://www.linkedin.com/in/rohitkumawat7109/", GITHUB="https://github.com/kuro7109", XURL="https://x.com/ImROHITKUMAWAT";
const ROKU="https://rokudesignstudio.framer.website/project-single/";
const $=s=>document.querySelector(s), $$=(s,r=document)=>[...r.querySelectorAll(s)];
const reduce=matchMedia("(prefers-reduced-motion: reduce)").matches;
const fine=matchMedia("(pointer:fine)").matches;
const esc=s=>String(s).replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));
const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));

/* ---------- Icons (lucide-style strokes) ---------- */
const IC={
 home:'<path d="M3 10.5 12 3l9 7.5"/><path d="M5 9.5V21h14V9.5"/><path d="M10 21v-6h4v6"/>',
 work:'<rect x="3" y="7" width="18" height="13" rx="2"/><path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><path d="M3 13h18"/>',
 lab:'<path d="M9 3h6"/><path d="M10 3v6L4.5 18.5A1.7 1.7 0 0 0 6 21h12a1.7 1.7 0 0 0 1.5-2.5L14 9V3"/><path d="M7 15h10"/>',
 pen:'<path d="M12 20h9"/><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4z"/>',
 user:'<circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/>',
 chev:'<path d="m6 9 6 6 6-6"/>',
 cal:'<rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/>',
 video:'<path d="m22 8-6 4 6 4V8z"/><rect x="2" y="6" width="14" height="12" rx="2"/>',
 phone:'<path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1.9.4 1.8.7 2.7a2 2 0 0 1-.5 2.1L8 9.8a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.7.7a2 2 0 0 1 1.7 2z"/>',
 msg:'<path d="M21 11.5a8.4 8.4 0 0 1-9 8.4 8.6 8.6 0 0 1-3.8-.9L3 21l1.9-5.2A8.4 8.4 0 1 1 21 11.5z"/>',
 coffee:'<path d="M17 8h1a4 4 0 1 1 0 8h-1"/><path d="M3 8h14v9a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4Z"/><path d="M6 2v2M10 2v2M14 2v2"/>',
 sun:'<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M6.3 17.7l-1.4 1.4M19.1 4.9l-1.4 1.4"/>',
 moon:'<path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/>',
 ne:'<path d="M7 17 17 7M7 7h10v10"/>',
 arrow:'<path d="M5 12h14M13 6l6 6-6 6"/>',
 up:'<path d="M12 19V5M6 11l6-6 6 6"/>',
 bot:'<rect x="4" y="8" width="16" height="12" rx="3"/><path d="M12 8V4M9 13v1M15 13v1M2 14h2M20 14h2"/>',
 chat:'<path d="M20 11.5a7.5 7.5 0 0 1-11.2 6.5L4 19.5l1.5-4.3A7.5 7.5 0 1 1 20 11.5z"/>',
 x:'<path d="M18 6 6 18M6 6l12 12"/>',
 rows:'<rect x="3" y="4" width="18" height="7" rx="1.5"/><rect x="3" y="14" width="18" height="6" rx="1.5"/>',
 grid:'<rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/>',
 deck:'<rect x="5" y="9" width="14" height="12" rx="2"/><path d="M7 6h10M9 3h6"/>',
 all:'<circle cx="12" cy="12" r="9"/><path d="M12 7v10M7 12h10"/>',
 mobile:'<rect x="6" y="2" width="12" height="20" rx="3"/><path d="M11 18h2"/>',
 cursor:'<path d="m4 4 7 17 2.5-7.5L21 11z"/>',
 spark:'<path d="M12 3v4M12 17v4M3 12h4M17 12h4M6 6l2.5 2.5M15.5 15.5 18 18M6 18l2.5-2.5M15.5 8.5 18 6"/>',
 globe:'<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18"/>',
 brush:'<path d="M9.5 14.5 3 21"/><path d="M14 4 20 10l-7.5 7.5-6-6z"/>',
 mail:'<rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/>',
 li:'<path d="M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5zM3 9.5h4v11H3zm7 0h3.8v1.6h.05c.53-1 1.83-2.05 3.77-2.05 4.03 0 4.78 2.65 4.78 6.1v5.35h-4v-4.74c0-1.13-.02-2.59-1.58-2.59-1.58 0-1.82 1.23-1.82 2.5v4.83H10z"/>',
 gh:'<path d="M12 2a10 10 0 0 0-3.16 19.49c.5.09.68-.22.68-.48v-1.7c-2.78.6-3.37-1.34-3.37-1.34-.45-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.9 1.52 2.34 1.08 2.91.83.09-.65.35-1.08.63-1.33-2.22-.25-4.55-1.11-4.55-4.94 0-1.09.39-1.98 1.03-2.68-.1-.25-.45-1.27.1-2.64 0 0 .84-.27 2.75 1.02a9.56 9.56 0 0 1 5 0c1.91-1.29 2.75-1.02 2.75-1.02.55 1.37.2 2.39.1 2.64.64.7 1.03 1.59 1.03 2.68 0 3.84-2.34 4.68-4.57 4.93.36.31.68.92.68 1.85v2.74c0 .27.18.58.69.48A10 10 0 0 0 12 2z"/>',
 xl:'<path d="M17.8 3h3.1l-6.8 7.7L22 21h-6.2l-4.9-6.3L5.3 21H2.2l7.2-8.3L1.8 3h6.4l4.4 5.8zm-1.1 16.2h1.7L7.4 4.7H5.6z"/>'
};
const FILLED=new Set(["li","gh","xl"]);
const svg=n=>FILLED.has(n)?`<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">${IC[n]}</svg>`:`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${IC[n]}</svg>`;
function hydrateIcons(rootEl=document){ $$("i[data-ic]",rootEl).forEach(i=>{ const s=document.createElement("span"); s.innerHTML=svg(i.dataset.ic); const el=s.firstChild; i.className && el.setAttribute("class",i.className); i.getAttribute("style") && el.setAttribute("style",i.getAttribute("style")); i.replaceWith(el); }); }

/* ---------- Content ---------- */
const PROJECTS=[
 {id:"workbench",code:"R'010",n:"Case Workbench",type:"Product Management / UX Design",f:["product","uiux"],yr:"2026",client:"HiLabs",tl:"xyz",slug:"",c:["#f59e0b","#60a5fa","#0f172a"],d:"A case management workbench MVP for HiLabs: one place for care teams to triage, track and close patient cases, backed by a slide deck and a five-patient synthetic data annex."},
 {id:"socius",code:"R'009",n:"Socius",type:"Product Design / xyz",f:["product","uiux"],yr:"xyz",client:"xyz",tl:"xyz",slug:"",c:["#f43f5e","#c084fc","#1c0f1f"],d:"xyz: a one-line summary of Socius, the problem it solves and who it is for."},
 {id:"gutly",code:"R'001",n:"Gutly",type:"Product Design / Interaction Design",f:["product","uiux"],yr:"2026",client:"Self-initiated",tl:"23–25 Jan 2026",slug:"gutly-ai-health-gut",c:["#34d399","#a7f3d0","#0f2e22"],d:"An AI app that lets people log meals and digestive symptoms to surface gut-health patterns and personal insights. The work focused on user journeys and taking the friction out of food logging."},
 {id:"alba",code:"R'002",n:"Alba & Notte",type:"Branding / UI & UX Design",f:["brand","uiux"],yr:"2025",client:"Design Club IITD",tl:"23–24 Dec 2025",slug:"alba---notte-drinks---bar",c:["#fbbf24","#6d5bd0","#1a1530"],d:"A café by day and a bar by night on Spinola Bay, Malta, mixing Mediterranean culture with Indian influences. Custom type and time-based storytelling serve locals and travellers alike."},
 {id:"genme",code:"R'003",n:"Genme",type:"Corporate Branding / Web Design",f:["brand","web"],yr:"2025",client:"Genme",tl:"12 Aug – 22 Sep 2025",slug:"genme-by-rohitkumawat",c:["#6366f1","#a5b4fc","#141a3d"],d:"A modern, scalable logo for Genme's digital presence, refining typography, symbol forms and a minimal structure into a mark that adapts everywhere it appears."},
 {id:"tickai",code:"R'004",n:"TickAI",type:"Logo Design / Brand Strategy",f:["brand","web","uiux"],yr:"2025",client:"Krishna Goel",tl:"28 Oct – 10 Nov 2025",slug:"tickai-by-rohit-kumawat",c:["#adfa1d","#22d3ee","#0d1f12"],d:"Branding and website for TickAI, an AI education platform: a scalable logo and clear layouts that keep the brand consistent and trustworthy across every touchpoint."},
 {id:"specter",code:"R'005",n:"Specter",type:"Brand Strategy / UI & UX Design",f:["brand","uiux"],yr:"2025",client:"Design Club IITD",tl:"15–19 Mar 2025",slug:"specter--brand-strategy---ui---ux-design",c:["#a78bfa","#f472b6","#1b1030"],d:"A concept cognitive platform that uses AI and a neural interface to help people revisit memories and explore possible futures through personal, multisensory experiences."},
 {id:"spotify",code:"R'006",n:"Spotify Redesign",type:"Brand Strategy / UI & UX Design",f:["uiux"],yr:"2024",client:"Self-initiated",tl:"3–7 Sep 2024",slug:"spotify-redesign-roku",c:["#1ed760","#f59e0b","#0b1a10"],d:"A self-initiated Spotify concept with bold colour, motion and interactive pieces that make music discovery more playful, personal and immersive."},
 {id:"caricatures",code:"R'007",n:"Caricatures",type:"Illustration / Caricature",f:["illus"],yr:"Series",client:"Multiple",tl:"Multiple",slug:"caricatures-by-rohit-kumawat",c:["#fb7185","#fde68a","#2a1216"],d:"A caricature series that turns real facial traits into bold, playful and still recognisable portraits, drawn by hand and refined digitally."},
 {id:"digital",code:"R'008",n:"Digital Arts",type:"Digital Arts / Illustrations",f:["illus"],yr:"Series",client:"Self-initiated",tl:"Multiple",slug:"digital-arts-by-rohit-kumawat",c:["#38bdf8","#f97316","#0c1a26"],d:"Stylised digital illustrations, from Shakespeare to animal studies, that reinterpret familiar subjects through exaggeration and graphic simplicity."}
];
const FILTERS=[["all","All","all"],["product","Product","mobile"],["uiux","UI & UX","cursor"],["brand","Branding","spark"],["web","Web","globe"],["illus","Illustration","brush"]];
const JOURNEY=[
 {role:"Product Management Intern",focus:"Product & GTM Planning",co:"Evvolv.ai",loc:"New Delhi",dt:"May – Jul 2026",y:"2026"},
 {role:"Product Design Intern",focus:"User Interface & User Experience",co:"Aspora",loc:"Bengaluru",dt:"May – Jun 2025",y:"2025"},
 {role:"Role xyz",focus:"Leads brand and product projects",co:"Design Club IITD",loc:"New Delhi",dt:"xyz – present",y:"xyz"}
];
const HONOURS=[
 {t:"Quality Redesign",org:"IFQM",res:"Result xyz",y:"Sep '26"},
 {t:"ProdPro",org:"BML Munjal University",res:"Result xyz",y:"Sep '26"},
 {t:"Udaan 9.0",org:"IIM Kashipur",res:"Result xyz",y:"Jan '26"},
 {t:"ConsultSchool 4.0",org:"IIT Madras",res:"Result xyz",y:"Jan '26"}
];
const TOOLS=[["Figma","Fg","#a259ff"],["Framer","Fr","#0055ff"],["Illustrator","Ai","#ff7c00"],["Photoshop","Ps","#31a8ff"],["Affinity","Af","#7e4dd2"],["Canva","Ca","#00c4cc"],["Claude","Cl","#d97757"],["Notion","N","#191919"]];
const SKILLS=[["Product design","Apps, flows, interaction"],["Product management","Roadmaps, GTM planning"],["Branding","Identity, logos, strategy"],["UI & UX","Interfaces, research, prototypes"],["Web design","Framer sites, landing pages"],["Illustration","Caricature, digital art"]];
const MARQ=[["Evvolv.ai","Ev"],["Aspora","As"],["IIT Delhi","IITD"],["Design Club","DC"],["GenMe","GM"],["TickAI","Ti"],["Rendezvous","Rv"]];
const ROLES=[["Product","Designer"],["Product","Manager"],["UI & UX","Designer"],["Brand","Designer"]];
const HIGHLIGHTS=[
 {h:"Hi, I'm Rohit",p:"A product designer and product manager based in Delhi.",c:[]},
 {h:"I design products and plan how they launch",p:"Interfaces and user experience at Aspora in Bengaluru, then product and go-to-market planning at Evvolv.ai in New Delhi.",c:["Aspora '25","Evvolv.ai '26"]},
 {h:"Product design and product management",p:"Apps like Gutly, identities for Genme and TickAI, and case competitions at IIM Kashipur, IIT Madras, IFQM and BML Munjal.",c:["10 projects","4 competitions"]}
];

/* ---------- Haptics: Android vibrate, iOS switch tap ---------- */
const hapLabel=$("#hapLabel");
const isIOS=/iP(hone|ad|od)/.test(navigator.userAgent)||(navigator.platform==="MacIntel"&&navigator.maxTouchPoints>1);
let hapLast=0;
function haptic(kind="light"){
  // soft, short pulses; light taps closer than 90ms apart are merged so nothing buzzes twice
  const now=performance.now(); if((kind==="light"||kind==="soft")&&now-hapLast<90) return; hapLast=now;
  const pat={soft:4,light:6,medium:12,heavy:[16,40,18],success:[8,50,8,50,20],error:[20,40,20]}[kind]||6;
  if(navigator.userActivation&&!navigator.userActivation.hasBeenActive) return;
  try{ if(!isIOS&&navigator.vibrate){ navigator.vibrate(pat); return; } }catch(e){}
  try{ if(isIOS){ hapLabel.click(); if(kind==="heavy"||kind==="success"||kind==="error") setTimeout(()=>hapLabel.click(),90); } }catch(e){}
}
document.addEventListener("pointerdown",e=>{ if(e.target.closest("a,button,.press")) haptic("light"); },{passive:true});
const toast=$("#toast");
function say(t){ toast.textContent=t; toast.classList.add("show"); clearTimeout(say.t); say.t=setTimeout(()=>toast.classList.remove("show"),1800); }

/* ---------- Text scramble ---------- */
const GLY="ABCDEFGHJKLMNPQRSTUVWXYZ0123456789#%&@$?/";
function scramble(el,text){
  if(reduce){ el.textContent=text; return; }
  const len=text.length, dur=clamp(32*len,420,760), t0=performance.now();
  clearInterval(el._sc);
  el._sc=setInterval(()=>{ const p=(performance.now()-t0)/dur;
    if(p>=1){ clearInterval(el._sc); el.textContent=text; return; }
    const n=Math.floor(p*len); let s="";
    for(let i=0;i<len;i++){ const c=text[i]; s+=(i<n||c===" ")?c:GLY[Math.random()*GLY.length|0]; }
    el.textContent=s; },40);
}

/* ---------- Covers ---------- */
const coverBg=c=>`radial-gradient(45% 55% at 25% 30%,${c[0]},transparent),radial-gradient(50% 60% at 80% 72%,${c[1]},transparent),${c[2]}`;
const cover=(p,label=true)=>`<div class="cov"><div class="g" style="background:${coverBg(p.c)}"></div><div class="gr"></div>${label?`<span class="cd">${esc(p.code)}</span><span class="tg">${esc(p.yr)}</span>`:""}<span class="nm">${esc(p.n)}</span></div>`;

/* ---------- Loader: hairline isometric keyboard ---------- */
(function(){
  const L=$("#loader"); if(!L) return;
  if(reduce){ L.remove(); return; }
  const cv=$("#kb"), ctx=cv.getContext("2d"), bar=$("#ldBar"), num=$("#ldN");
  const ROWS=[[1,1,1,1,1,1,1,1,1,1,1,1,1,2],[1.5,1,1,1,1,1,1,1,1,1,1,1,1,1.5],[1.75,1,1,1,1,1,1,1,1,1,1,1,2.25],[2.25,1,1,1,1,1,1,1,1,1,1,2.75],[1.25,1.25,1.25,6.25,1.25,1.25,1.25,1.25]];
  const keys=[]; ROWS.forEach((r,ry)=>{ let x=0; r.forEach(w=>{ keys.push({x,y:ry,w,s:0,t:0,press:0}); x+=w; }); });
  let W=0,H=0,dpr=1,u=40,ox=0,oy=0,px=-1e4,py=-1e4,raf=0,t0=performance.now(),done=false;
  const C=Math.SQRT1_2, K=.5;
  const P=(x,y,z)=>[ox+(x-y)*C*u, oy+(x+y)*C*K*u-z*u];
  function size(){ dpr=Math.min(2,devicePixelRatio||1); W=innerWidth; H=innerHeight; cv.width=W*dpr; cv.height=H*dpr; ctx.setTransform(dpr,0,0,dpr,0,0);
    u=Math.min(56,(Math.min(W*.86,820))/((15+5)*C)); ox=W/2-(15-5)/2*C*u; oy=H*.46-(15+5)/2*C*K*u; }
  function col(){ const d=document.documentElement.getAttribute("data-theme")==="dark"||(!document.documentElement.getAttribute("data-theme")&&matchMedia("(prefers-color-scheme: dark)").matches);
    return d?{plate:"#08090a",hi:"#d0d6e0",edge:"#5b5d64",mid:"#3e3e44",lo:"#29292d"}:{plate:"#ffffff",hi:"#232327",edge:"#a4a4ac",mid:"#c3c3c9",lo:"#e0e0e4"}; }
  function poly(pts,fill,stroke){ ctx.beginPath(); pts.forEach((p,i)=>i?ctx.lineTo(p[0],p[1]):ctx.moveTo(p[0],p[1])); ctx.closePath(); ctx.fillStyle=fill; ctx.fill(); ctx.strokeStyle=stroke; ctx.stroke(); }
  function box(x0,y0,x1,y1,zb,zt,c,top){
    poly([P(x0,y1,zb),P(x1,y1,zb),P(x1,y1,zt),P(x0,y1,zt)],c.plate,c.mid);
    poly([P(x1,y0,zb),P(x1,y1,zb),P(x1,y1,zt),P(x1,y0,zt)],c.plate,c.lo);
    poly([P(x0,y0,zt),P(x1,y0,zt),P(x1,y1,zt),P(x0,y1,zt)],c.plate,top||c.edge);
  }
  function frame(now){
    raf=requestAnimationFrame(frame);
    const c=col(); ctx.clearRect(0,0,W,H); ctx.lineWidth=1; ctx.lineJoin="round";
    box(-.35,-.35,15.35,5.35,0,.32,c,c.edge);
    if(Math.random()<.18){ const k=keys[Math.random()*keys.length|0]; k.press=1; }
    for(const k of keys){
      const g=.07, x0=k.x+g, x1=k.x+k.w-g, y0=k.y+g, y1=k.y+1-g;
      const sc=P((x0+x1)/2,(y0+y1)/2,.62), d=Math.hypot(sc[0]-px,sc[1]-py);
      k.t=Math.max(clamp(1-d/(u*2.2),0,1), k.press); k.press*=.86;
      k.s+=(k.t-k.s)*.3;
      box(x0,y0,x1,y1,.32,.62-.22*k.s,c,c.hi);
    }
    const p=clamp((now-t0)/1700,0,1), e=1-Math.pow(1-p,3);
    bar.style.transform=`scaleX(${e})`; num.textContent=String(Math.round(e*100)).padStart(3,"0");
    if(p>=1&&!done){ done=true; setTimeout(()=>{ L.classList.add("done"); setTimeout(()=>{ cancelAnimationFrame(raf); L.remove(); },600); },180); }
  }
  size(); addEventListener("resize",size);
  addEventListener("pointermove",e=>{ px=e.clientX; py=e.clientY; },{passive:true});
  raf=requestAnimationFrame(frame);
})();
