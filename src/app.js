
hydrateIcons();
const root=document.documentElement;
const isDark=()=>{ const a=root.getAttribute("data-theme"); return a?a==="dark":matchMedia("(prefers-color-scheme: dark)").matches; };

/* ---------- Theme: circular reveal from the button ---------- */
const themeBtn=$("#theme");
const labelTheme=()=>themeBtn.setAttribute("aria-label",isDark()?"Switch to light mode":"Switch to dark mode");
themeBtn.addEventListener("click",()=>{
  const next=isDark()?"light":"dark", r=themeBtn.getBoundingClientRect(), x=r.left+r.width/2, y=r.top+r.height/2;
  const apply=()=>{ root.setAttribute("data-theme",next); try{localStorage.setItem("rk-theme",next);}catch(e){} labelTheme(); };
  haptic("medium");
  if(!document.startViewTransition||reduce){ apply(); return; }
  const rad=Math.hypot(Math.max(x,innerWidth-x),Math.max(y,innerHeight-y));
  const vt=document.startViewTransition(apply);
  vt.ready.then(()=>root.animate({clipPath:[`circle(0px at ${x}px ${y}px)`,`circle(${rad}px at ${x}px ${y}px)`]},{duration:800,easing:"cubic-bezier(.16,1,.3,1)",pseudoElement:"::view-transition-new(root)"})).catch(()=>{});
});
labelTheme();
matchMedia("(prefers-color-scheme: dark)").addEventListener?.("change",labelTheme);

/* ---------- Progressive blur layers ---------- */
(function(){
  // fewer, stronger layers: same look as the 6-step stack at a fraction of the GPU cost
  $$(".pblur").forEach(el=>{ const B=el.classList.contains("top")?[1,3,8]:[2]; el.innerHTML=B.map((b,i)=>{ const s=i/B.length*100, e=(i+1)/B.length*100;
    return `<i style="backdrop-filter:blur(${b}px);-webkit-backdrop-filter:blur(${b}px);--a:${Math.max(0,s-16.6)}%;--b:${s}%;--c:${e}%;--d:${Math.min(100,e+16.6)}%"></i>`; }).join(""); });
})();

/* ---------- Header: nav indicator, condense, dropdowns, call icons ---------- */
const site=$("#site"), nav=$("#nav"), navInd=$("#navInd"), navLinks=$$(".ni",nav), callBtn=$("#callBtn");
let current="";
function placeInd(){
  const a=navLinks.find(l=>l.dataset.p===(navTo||current));
  if(!a){ navInd.classList.add("off"); return; }
  const nr=nav.getBoundingClientRect(), r=a.getBoundingClientRect();
  navInd.classList.remove("off"); navInd.style.width=r.width+"px"; navInd.style.transform=`translateX(${r.left-nr.left-nav.clientLeft}px)`;
}
function trackInd(ms=650){ const t0=performance.now(); (function f(t){ placeInd(); if(t-t0<ms) requestAnimationFrame(f); })(t0); }
let condensed=false, navHover=false;
function setCondensed(){ const c=scrollY>64&&!navHover; if(c!==condensed){ condensed=c; site.classList.toggle("condensed",c); trackInd(); } }
addEventListener("scroll",setCondensed,{passive:true});
if(fine){ site.addEventListener("pointerenter",()=>{ navHover=true; setCondensed(); }); site.addEventListener("pointerleave",()=>{ navHover=false; setCondensed(); }); }
addEventListener("resize",()=>placeInd());

(function(){ const icons=$$("#callCur svg"); let i=0; if(reduce) return;
  setInterval(()=>{ const prev=icons[i]; i=(i+1)%icons.length; prev.classList.remove("on"); prev.classList.add("was"); setTimeout(()=>prev.classList.remove("was"),500); icons[i].classList.add("on"); },2200); })();

/* ---------- Router ---------- */
const PAGES=["home","work","experiments","blogs","about","book"];
/* Page change: the old page fades up and out, the scroll resets while nothing is visible,
   then the new page rises in. The nav highlight moves the moment you click. */
let navTo="", swapT=0;
const stage=[$("#app"),$("#contact").parentElement];
function route(){
  const [raw,sub]=location.hash.slice(1).split("/"); const r=PAGES.includes(raw)?raw:"home";
  const first=!current, changed=r!==current;
  const after=()=>requestAnimationFrame(()=>{ buildRail();
    if(sub){ const el=$(`.page[data-page="${r}"] [data-id="${CSS.escape(sub)}"]`); if(el){ el.scrollIntoView({behavior:reduce||changed?"auto":"smooth",block:"center"}); el.classList.add("flash"); setTimeout(()=>el.classList.remove("flash"),1600); } }
  });
  if(!changed){ clearTimeout(swapT); document.body.classList.remove("leaving"); after(); return; }
  navTo=r;
  navLinks.forEach(l=>l.dataset.p===r?l.setAttribute("aria-current","page"):l.removeAttribute("aria-current"));
  callBtn.toggleAttribute("aria-current",r==="book"); if(r==="book") callBtn.setAttribute("aria-current","page");
  trackInd(); if(!first) haptic("light");
  const swap=()=>{
    $$(".page").forEach(p=>{ p.hidden=p.dataset.page!==r; });
    current=r; if(!sub) scrollTo({top:0,behavior:"instant"});
    dispatchEvent(new Event("resize"));
    if(!first&&!reduce){ stage.forEach(el=>el.classList.add("arriving")); void document.body.offsetHeight; document.body.classList.remove("leaving"); stage.forEach(el=>el.classList.remove("arriving")); }
    after();
  };
  clearTimeout(swapT);
  if(first||reduce) swap();
  else { document.body.classList.add("leaving"); swapT=setTimeout(swap,240); }
}
addEventListener("hashchange",route);

/* ---------- Section rail: the tick for where you are is longest, neighbours taper ---------- */
const rail=$("#rail"); let railSecs=[], railBtns=[], rPos=0, rTarget=0, rRaf=0, rLast=-1;
const SC=[1,.68,.44,.25];
function railScale(d){ if(d>=3) return SC[3]; const i=Math.floor(d), f=d-i; return SC[i]+(SC[i+1]-SC[i])*f; }
function railCompute(){
  if(!railSecs.length) return 0;
  const anchor=innerHeight*.38; let k=0;
  railSecs.forEach((s,i)=>{ if(s.getBoundingClientRect().top<=anchor) k=i; });
  const r=railSecs[k].getBoundingClientRect(), f=clamp((anchor-r.top)/Math.max(1,r.height),0,1);
  let pos=k+clamp((f-.72)/.28,0,1);
  if(scrollY+innerHeight>=document.documentElement.scrollHeight-4) pos=railSecs.length-1;
  return Math.min(pos,railSecs.length-1);
}
function railPaint(){ railBtns.forEach((b,i)=>{ const d=Math.abs(i-rPos), s=railScale(d); b.firstChild.style.setProperty("--s",s.toFixed(3)); b.firstChild.style.setProperty("--o",(.25+s*.75).toFixed(3)); }); }
function railTick(){
  rRaf=0; rTarget=railCompute(); rPos+=(rTarget-rPos)*(reduce?1:.2); if(Math.abs(rTarget-rPos)<.002) rPos=rTarget;
  railPaint(); const k=Math.round(rPos); if(k!==rLast){ if(rLast!==-1) haptic("light"); rLast=k; railBtns.forEach((b,i)=>b.toggleAttribute("aria-current",i===k)); }
  if(rPos!==rTarget) rRaf=requestAnimationFrame(railTick);
}
function buildRail(){
  const page=$(`.page[data-page="${current}"]`); railSecs=[...$$("[data-rail]",page),$("#contact")];
  rail.innerHTML=railSecs.map(s=>`<button type="button"><i></i><span class="pl glass">${esc(s.dataset.rail)}</span><span class="sr">Go to ${esc(s.dataset.rail)}</span></button>`).join("");
  railBtns=$$("button",rail);
  railBtns.forEach((b,i)=>b.addEventListener("click",()=>railSecs[i].scrollIntoView({behavior:reduce?"auto":"smooth",block:"start"})));
  rPos=rTarget=railCompute(); rLast=Math.round(rPos); railPaint(); railBtns.forEach((b,i)=>b.toggleAttribute("aria-current",i===rLast));
}
const railKick=()=>{ if(!rRaf) rRaf=requestAnimationFrame(railTick); };
addEventListener("scroll",railKick,{passive:true}); addEventListener("resize",railKick);

/* ---------- Hero title: letters vapour in and out, scramble on hover ---------- */
(function(){
  const h=$("#htitle"), sr=$("#roleSr");
  const lines=(r,cls)=>r.map(l=>`<span class="ln">${[...l].map((c,n)=>`<span class="ch ${cls}" style="--dx:${((Math.random()-.5)*.3).toFixed(2)}em;animation-delay:${Math.round(26*n+140*Math.random())}ms">${c===" "?" ":esc(c)}</span>`).join("")}</span>`).join("");
  h.insertAdjacentHTML("beforeend",`<span class="sz" aria-hidden="true">${ROLES.map(r=>`<span>${lines(r,"")}</span>`).join("")}</span><span class="lv" aria-hidden="true">${lines(ROLES[0],"in")}</span>`);
  let i=0, busy=false;
  function next(){
    const old=h.querySelector(".lv:not(.gone)"); i=(i+1)%ROLES.length;
    old.classList.add("gone"); old.querySelectorAll(".ch").forEach((c,n)=>{ c.classList.remove("in"); c.style.animationDelay=Math.round(26*n+140*Math.random())+"ms"; void c.offsetWidth; c.classList.add("out"); });
    setTimeout(()=>old.remove(),1500);
    setTimeout(()=>{ h.insertAdjacentHTML("beforeend",`<span class="lv" aria-hidden="true">${lines(ROLES[i],"in")}</span>`); sr.textContent=ROLES[i].join(" "); },320);
  }
  if(!reduce) setInterval(()=>{ if(!document.hidden&&!busy) next(); },2600);
  h.addEventListener("pointerenter",()=>{ if(reduce||busy) return; const lv=h.querySelector(".lv:not(.gone)"); if(!lv) return; busy=true;
    const chs=$$(".ch",lv), txt=chs.map(c=>c.textContent), len=chs.length, dur=clamp(32*len,420,760), t0=performance.now();
    chs.forEach(c=>{ c.style.width=c.getBoundingClientRect().width+"px"; c.style.textAlign="center"; }); // lock widths so scrambling never shifts the line
    const iv=setInterval(()=>{ const p=(performance.now()-t0)/dur; const n=Math.floor(p*len);
      chs.forEach((c,k)=>{ c.textContent=(p>=1||k<n||txt[k]===" ")?txt[k]:GLY[Math.random()*GLY.length|0]; });
      if(p>=1){ clearInterval(iv); chs.forEach(c=>{ c.style.width=""; c.style.textAlign=""; }); busy=false; } },40); });
})();

/* ---------- Hero highlights accordion ---------- */
(function(){
  // No +/- icons: hovering a heading reveals its text; tap/click or keyboard focus does the same on touch
  const acc=$("#acc"); let open=-1;
  acc.innerHTML=HIGHLIGHTS.map((x,k)=>`<div class="it"><button type="button" aria-expanded="false" aria-controls="hl${k}" id="hb${k}">${esc(x.h)}</button><div class="bd" id="hl${k}" role="region" aria-labelledby="hb${k}"><div><p>${esc(x.p)}</p>${x.c.length?`<div class="chips">${x.c.map(c=>`<span class="chip">${esc(c)}</span>`).join("")}</div>`:""}</div></div></div>`).join("");
  const its=$$(".it",acc);
  let ht=0;
  const set=k=>{ clearTimeout(ht); if(k===open) return; open=k; its.forEach((x,j)=>{ x.classList.toggle("on",j===open); x.querySelector("button").setAttribute("aria-expanded",j===open); }); if(k>-1) haptic("soft"); };
  const later=(k,ms)=>{ clearTimeout(ht); ht=setTimeout(()=>set(k),ms); };
  its.forEach((it,k)=>{ const b=it.querySelector("button");
    if(fine) it.addEventListener("pointerenter",()=>later(k,open===-1?110:160));
    b.addEventListener("focus",()=>set(k));
    b.addEventListener("click",()=>{ if(!fine) set(open===k?-1:k); }); });
  if(fine) acc.addEventListener("pointerleave",()=>later(-1,260));
  acc.addEventListener("focusout",e=>{ if(!acc.contains(e.relatedTarget)) set(-1); });
})();

/* ---------- About me: hold for a handwritten note; portrait follows the cursor ---------- */
(function(){
  const btn=$("#aboutBtn"), liq=$("#liq"), wrap=$("#pwrap"), DUR=1200;
  let p=0, holding=false, raf=0, last=0, ticks=0, t0=0, note=null;
  const NOTE=[["Hi!","I'm","Rohit."],["I","design","products,","plan","their","launch","and","sometimes","manage","them","too."],["Say","hi","at","rohitkumawat7109@gmail.com"]];
  function showNote(){
    if(note) return hideNote();
    let k=0; const html=NOTE.map(l=>`<p>${l.map(w=>{ const d=(.25+.085*k++).toFixed(2); return w.includes("@")?`<a class="ink" href="${GMAIL}" target="_blank" rel="noopener" style="--d:${d}s">${esc(w)}</a>`:`<span class="ink" style="--d:${d}s">${esc(w)}</span>`; }).join(" ")}</p>`).join("");
    note=document.createElement("div"); note.className="note"; note.setAttribute("role","note"); note.tabIndex=0; note.title="Tap to put the note away";
    note.innerHTML=html+`<div class="sig"><span class="rl" style="--d:${(.3+.085*k).toFixed(2)}s"></span><span class="ink" style="--d:${(.4+.085*k).toFixed(2)}s">Rohit</span></div>`;
    note.addEventListener("click",e=>{ if(!e.target.closest("a")) hideNote(); });
    note.addEventListener("keydown",e=>{ if(e.key==="Enter"||e.key===" "){ e.preventDefault(); hideNote(); } });
    wrap.appendChild(note); note.focus({preventScroll:true});
    if(!reduce) note.querySelectorAll(".ink").forEach((w,j)=>setTimeout(()=>haptic("light"),250+j*85));
  }
  function hideNote(){ if(!note) return; const n=note; note=null; n.classList.add("out"); haptic("light"); setTimeout(()=>n.remove(),400); }
  function frame(t){
    const dt=last?t-last:16; last=t; p=clamp(p+(holding?1:-2.2)*dt/DUR,0,1);
    liq.style.transform=`translateY(${(1-p)*115}%)`;
    const q=Math.floor(p*5); if(holding&&q>ticks){ ticks=q; haptic("light"); }
    if(p>=1&&holding){ holding=false; btn.classList.remove("holding"); haptic("success"); showNote(); }
    if((holding&&p<1)||(!holding&&p>0)) raf=requestAnimationFrame(frame); else { raf=0; last=0; }
  }
  const start=e=>{ if(e.type==="pointerdown"&&e.button!==0) return; e.preventDefault(); holding=true; t0=performance.now(); ticks=Math.floor(p*5); btn.classList.add("holding"); if(!raf) raf=requestAnimationFrame(frame); };
  const stop=e=>{ if(!holding) return; holding=false; btn.classList.remove("holding"); if(performance.now()-t0<220&&e&&e.type!=="pointerleave") location.hash="about"; if(!raf&&p>0) raf=requestAnimationFrame(frame); };
  btn.addEventListener("pointerdown",start); ["pointerup","pointerleave","pointercancel"].forEach(ev=>btn.addEventListener(ev,stop));
  btn.addEventListener("keydown",e=>{ if((e.key===" "||e.key==="Enter")&&!e.repeat) start(e); });
  btn.addEventListener("keyup",e=>{ if(e.key===" "||e.key==="Enter") stop(e); });
  btn.addEventListener("contextmenu",e=>e.preventDefault());
  document.addEventListener("keydown",e=>{ if(e.key==="Escape") hideNote(); });
  // Portrait: a loose spring chases the cursor, overshoots and jiggles, with a slow idle sway
  if(!reduce){ const img=wrap.querySelector("img"); let tx=0,ty=0,x=0,y=0,vx=0,vy=0;
    if(fine) addEventListener("pointermove",e=>{ if(current!=="home") return; const r=wrap.getBoundingClientRect();
      tx=clamp((e.clientX-(r.left+r.width/2))/(innerWidth/2),-1,1); ty=clamp((e.clientY-(r.top+r.height/2))/(innerHeight/2),-1,1); },{passive:true});
    const loop=t=>{ requestAnimationFrame(loop); if(current!=="home"||document.hidden) return;
      const s=t/1000, ix=.16*Math.sin(s*1.3)+.07*Math.sin(s*2.9), iy=.1*Math.sin(s*1.7+1);
      vx+=(tx+ix-x)*.09; vy+=(ty+iy-y)*.09; vx*=.8; vy*=.8; x+=vx; y+=vy;
      img.style.transform=`rotateY(${(x*16).toFixed(2)}deg) rotateX(${(-y*9).toFixed(2)}deg) rotateZ(${(x*3+clamp(vx*40,-6,6)).toFixed(2)}deg) translate(${(x*14).toFixed(1)}px,${(y*6).toFixed(1)}px) skewX(${clamp(-vx*30,-5,5).toFixed(2)}deg)`; };
    requestAnimationFrame(loop); }
})();

/* ---------- Hero weather: aurora → rain → snow → clouds → sun ---------- */
(function(){
  const cv=$("#wx"), ctx=cv.getContext("2d"), hero=$("#hero");
  const S=["aurora","rain","snow","clouds","sun"], NM={aurora:"Aurora",rain:"Rain",snow:"Snow",clouds:"Clouds",sun:"Sun"};
    let W=0,H=0,dpr=1, idx=1, A=[0,1,0,0,0], vis=true, raf=0, last=0, acc=0;
  const ptr={x:-999,y:-999,vx:0,vy:0,in:false};
  // rain + water
  let drops=[], splash=[], level=0; const WC=6; let wh=[], wv=[];
  // snow
  let flakes=[], kicked=[], pile=[]; const PC=4;
  const clouds=[{top:.08,s:1,d:70,o:0},{top:.22,s:.7,d:95,o:.35},{top:.14,s:.85,d:82,o:.62},{top:.3,s:.6,d:110,o:.85},{top:.03,s:1.15,d:64,o:.15}];
  const strips={};
  function strip(key,cols){ const c=document.createElement("canvas"); c.width=4; c.height=256; const g=c.getContext("2d"), gr=g.createLinearGradient(0,0,0,256);
    gr.addColorStop(0,"rgba(0,0,0,0)"); gr.addColorStop(.55,cols[0]); gr.addColorStop(.9,cols[1]); gr.addColorStop(1,"rgba(0,0,0,0)"); g.fillStyle=gr; g.fillRect(0,0,4,256); strips[key]=c; }
  strip("d0",["rgba(52,211,153,.55)","rgba(167,243,208,.95)"]); strip("d1",["rgba(45,212,191,.45)","rgba(125,211,252,.85)"]); strip("d2",["rgba(167,139,250,.4)","rgba(244,114,182,.7)"]);
  strip("l0",["rgba(16,185,129,.35)","rgba(5,150,105,.6)"]); strip("l1",["rgba(14,165,233,.3)","rgba(2,132,199,.55)"]); strip("l2",["rgba(139,92,246,.28)","rgba(124,58,237,.5)"]);
  function size(){ const r=cv.getBoundingClientRect(); dpr=Math.min(1.25,devicePixelRatio||1); W=r.width; H=r.height; cv.width=Math.max(1,W*dpr); cv.height=Math.max(1,H*dpr); ctx.setTransform(dpr,0,0,dpr,0,0);
    wh=new Array(Math.ceil(W/WC)+2).fill(0); wv=wh.slice(); pile=new Array(Math.ceil(W/PC)+1).fill(0); }
  function setScene(k){ idx=k; acc=0; }
  function next(){ setScene(idx%(S.length-1)+1); } // aurora (0) is skipped: rain → snow → clouds → sun
  setScene(1);
  // pointer
  hero.addEventListener("pointermove",e=>{ const r=cv.getBoundingClientRect(), x=e.clientX-r.left, y=e.clientY-r.top; ptr.vx=x-ptr.x; ptr.vy=y-ptr.y; ptr.x=x; ptr.y=y; ptr.in=true; },{passive:true});
  hero.addEventListener("pointerleave",()=>{ ptr.in=false; ptr.x=ptr.y=-999; });
  hero.addEventListener("click",e=>{ if(e.target.closest("a,button,.acc,.note,input")) return; next(); haptic("light"); });
  // cycle: every 3s (2s on phones) while the hero is on screen
  const mob=matchMedia("(max-width: 767px)");
  setInterval(()=>{ if(!reduce&&vis&&current==="home"&&document.visibilityState==="visible"){ acc+=250; if(acc>=(mob.matches?2000:3000)) next(); } },250);
  new IntersectionObserver(es=>{ vis=es[0].isIntersecting; if(vis&&!raf&&!reduce) raf=requestAnimationFrame(frame); }).observe(hero);
  addEventListener("resize",size);

  function sky(dark,a){ if(a<.01) return; const g=ctx.createLinearGradient(0,0,0,H);
    if(dark){ g.addColorStop(0,`rgba(30,41,59,${.55*a})`); g.addColorStop(.45,`rgba(23,32,48,${.3*a})`); }
    else { g.addColorStop(0,`rgba(224,240,253,${a})`); g.addColorStop(.45,`rgba(239,247,254,${.7*a})`); }
    g.addColorStop(1,"rgba(0,0,0,0)"); ctx.fillStyle=g; ctx.fillRect(0,0,W,H); }
  const aur=document.createElement("canvas"), ag=aur.getContext("2d");
  function aurora(t,dark,a){ if(a<.01) return;
    const k=.25, aw=Math.max(1,Math.ceil(W*k)), ah=Math.max(1,Math.ceil(H*k));
    if(aur.width!==aw||aur.height!==ah){ aur.width=aw; aur.height=ah; }
    ag.setTransform(k,0,0,k,0,0); ag.clearRect(0,0,W,H); ag.globalCompositeOperation=dark?"lighter":"source-over";
    for(let c=0;c<3;c++){ const st=strips[(dark?"d":"l")+c], base=H*(.32+c*.07), ph=c*1.9;
      for(let x=0;x<W;x+=8){
        const y=base+Math.sin(x*.0036+t*.45+ph)*42+Math.sin(x*.011-t*.8+ph)*16;
        const h=150+90*Math.sin(x*.006+t*.3+ph*2);
        const sh=.55+.45*Math.sin(x*.021+t*1.4+ph)*Math.sin(x*.005-t*.6);
        ag.globalAlpha=clamp(sh,0,1)*(dark?.9:.6); ag.drawImage(st,1,0,2,256,x,y-h,8,h);
      } }
    ctx.save(); ctx.globalCompositeOperation=dark?"lighter":"source-over"; ctx.globalAlpha=a; ctx.imageSmoothingEnabled=true; ctx.drawImage(aur,0,0,W,H); ctx.restore();
    if(dark){ ctx.fillStyle="#fff"; for(let i=0;i<40;i++){ ctx.globalAlpha=a*.5*(.5+.5*Math.sin(t*2+i)); ctx.fillRect((i*211)%W,(i*389)%Math.max(1,H*.5),1.2,1.2); } ctx.globalAlpha=1; }
  }
  function cloudsDraw(t,dark,a){ if(a<.01) return;
    for(const c of clouds){ const span=W+360, x=((t/c.d+c.o)%1)*span-260, y=H*c.top+20, s=c.s*(W<700?.7:1);
      const blobs=[[0,18,46],[42,0,58],[92,20,44]];
      for(const [bx,by,br] of blobs){ const cx=x+bx*s, cy=y+by*s, r=br*s;
        const g=ctx.createRadialGradient(cx,cy,0,cx,cy,r*1.15);
        const col=dark?"148,163,184":"255,255,255", al=(dark?.16:.95)*a;
        g.addColorStop(0,`rgba(${col},${al})`); g.addColorStop(.65,`rgba(${col},${al*.8})`); g.addColorStop(1,`rgba(${col},0)`);
        ctx.fillStyle=g; ctx.beginPath(); ctx.arc(cx,cy,r*1.15,0,7); ctx.fill(); }
      if(!dark){ ctx.fillStyle=`rgba(148,163,184,${.12*a})`; ctx.beginPath(); ctx.ellipse(x+60*s,y+52*s,80*s,8*s,0,0,7); ctx.fill(); } }
  }
  function sun(t,dark,a){ if(a<.01) return;
    const br=themeBtn.getBoundingClientRect(), cr=cv.getBoundingClientRect(), ox=br.left+br.width/2-cr.left, oy=br.top+br.height/2-cr.top; // same source as the rays
    const g=ctx.createRadialGradient(ox,oy,0,ox,oy,Math.min(W,900)*.55);
    if(dark){ g.addColorStop(0,`rgba(234,235,255,${.35*a})`); g.addColorStop(.3,`rgba(237,240,245,${.16*a})`); g.addColorStop(.55,`rgba(237,240,245,${.06*a})`); }
    else { g.addColorStop(0,`rgba(255,244,204,${a})`); g.addColorStop(.3,`rgba(255,229,160,${.7*a})`); g.addColorStop(.55,`rgba(255,222,150,${.25*a})`); }
    g.addColorStop(1,"rgba(255,255,255,0)"); ctx.fillStyle=g; ctx.fillRect(0,0,W,H);
  }
  function rain(dt,dark,a){
    const want=a>.05?Math.round(W/7*a):0;
    while(drops.length<want) drops.push({x:Math.random()*W*1.1,y:Math.random()*H*.6-60,v:10+Math.random()*8,l:10+Math.random()*14});
    if(drops.length>want) drops.length=want;
    const surf=x=>H-level+(wh[Math.round(x/WC)]||0);
    const dc=dark?"203,213,225":"100,116,139";
    ctx.lineWidth=1; ctx.lineCap="round";
    for(const d of drops){ d.y+=d.v*dt*.06; d.x-=d.v*dt*.006;
      const sy=surf(d.x);
      if(d.y>=sy){ const i=Math.round(d.x/WC); if(wv[i]!=null) wv[i]+=1.6; if(Math.random()<.5) for(let k=0;k<2;k++) splash.push({x:d.x,y:sy,vx:(Math.random()-.5)*2,vy:-1.5-Math.random()*1.8,l:1});
        d.y=-Math.random()*60; d.x=Math.random()*W*1.1; continue; }
      ctx.strokeStyle=`rgba(${dc},${.45*a})`; ctx.beginPath(); ctx.moveTo(d.x,d.y); ctx.lineTo(d.x+d.l*.1,d.y-d.l); ctx.stroke(); }
    ctx.fillStyle=`rgba(${dc},.6)`;
    splash=splash.filter(s=>{ s.vy+=.12*dt*.06; s.x+=s.vx; s.y+=s.vy; s.l-=.03*dt*.06; if(s.l>0){ ctx.globalAlpha=s.l; ctx.fillRect(s.x,s.y,1.6,1.6); } return s.l>0; }); ctx.globalAlpha=1;
    // water level: fills while it rains, drains otherwise
    const maxL=W<700?44:68; level=clamp(level+(a>.5?22:-9)*dt/1000,0,maxL);
  }
  function water(dark){ if(level<.5) return;
    for(let i=0;i<wh.length;i++){ wv[i]+=-.015*wh[i]+.12*((wh[i-1]||0)+(wh[i+1]||0)-2*wh[i]); wv[i]*=.975; }
    for(let i=0;i<wh.length;i++) wh[i]+=wv[i];
    if(ptr.in&&Math.abs(ptr.y-(H-level))<26){ const i=Math.round(ptr.x/WC); for(let k=-2;k<=2;k++) if(wv[i+k]!=null) wv[i+k]+=clamp(ptr.vx,-8,8)*.08+clamp(ptr.vy,-8,8)*.12; }
    const top=H-level, g=ctx.createLinearGradient(0,top-6,0,H);
    if(dark){ g.addColorStop(0,"rgba(59,100,160,.28)"); g.addColorStop(1,"rgba(30,58,110,.5)"); } else { g.addColorStop(0,"rgba(186,214,245,.45)"); g.addColorStop(1,"rgba(120,170,225,.55)"); }
    ctx.beginPath(); ctx.moveTo(0,H); for(let i=0;i<wh.length;i++) ctx.lineTo(i*WC,top+wh[i]); ctx.lineTo(W,H); ctx.closePath(); ctx.fillStyle=g; ctx.fill();
    ctx.beginPath(); for(let i=0;i<wh.length;i++) i?ctx.lineTo(i*WC,top+wh[i]):ctx.moveTo(0,top+wh[0]); ctx.strokeStyle=dark?"rgba(147,190,245,.55)":"rgba(96,150,215,.7)"; ctx.lineWidth=1.2; ctx.stroke();
  }
  function snow(dt,dark,a){
    const want=a>.05?Math.round(W/9*a):0;
    while(flakes.length<want) flakes.push({x:Math.random()*W,y:Math.random()*H*.7-30,r:1+Math.random()*2.2,v:1.3+Math.random()*1.5,p:Math.random()*6});
    if(flakes.length>want) flakes.length=want;
    const fc=dark?"241,245,249":"148,163,184", k=dt*.06;
    ctx.fillStyle=`rgba(${fc},${.85*a})`;
    for(const f of flakes){ f.y+=f.v*k; f.p+=.02*k; f.x+=Math.sin(f.p)*.5*k;
      const i=clamp(Math.round(f.x/PC),0,pile.length-1);
      if(f.y>=H-pile[i]){ pile[i]+=f.r*1.4; if(pile[i-1]!=null) pile[i-1]+=f.r*.5; if(pile[i+1]!=null) pile[i+1]+=f.r*.5; f.y=-10; f.x=Math.random()*W; continue; }
      ctx.beginPath(); ctx.arc(f.x,f.y,f.r,0,7); ctx.fill(); }
    // sweep: moving the pointer through the snow pushes it along and kicks some up
    if(ptr.in&&Math.abs(ptr.vx)>.5){ const i=Math.round(ptr.x/PC);
      for(let c=i-6;c<=i+6;c++){ if(pile[c]==null) continue; if(ptr.y>H-pile[c]-18){ const take=pile[c]*.35, to=clamp(c+Math.sign(ptr.vx)*8,0,pile.length-1); pile[c]-=take; pile[to]+=take*.7;
        if(take>.4&&kicked.length<160) kicked.push({x:c*PC,y:H-pile[c],vx:ptr.vx*.15+(Math.random()-.5),vy:-1.5-Math.random()*2.5,r:1+Math.random()*1.6,l:1}); } } }
    for(let c=1;c<pile.length-1;c++){ const d=pile[c]-(pile[c-1]+pile[c+1])/2; if(d>1.5){ pile[c]-=d*.3; pile[c-1]+=d*.15; pile[c+1]+=d*.15; } }
    const maxP=W<700?40:60;
    if(a>.5) for(let c=0;c<pile.length;c++) pile[c]+=dt*.0045*(.7+.3*Math.sin(c*.37));
    else for(let c=0;c<pile.length;c++) pile[c]=Math.max(0,pile[c]-dt*.0025);
    for(let c=0;c<pile.length;c++) pile[c]=Math.min(pile[c],maxP);
  }
  function pileDraw(dark){
    if(!pile.some(v=>v>.4)) { kicked.length=0; return; }
    const fc=dark?"241,245,249":"226,232,240";
    ctx.beginPath(); ctx.moveTo(0,H); for(let c=0;c<pile.length;c++) ctx.lineTo(c*PC,H-pile[c]); ctx.lineTo(W,H); ctx.closePath();
    ctx.fillStyle=`rgba(${fc},${dark?.85:1})`; ctx.fill(); ctx.strokeStyle=dark?"rgba(203,213,225,.6)":"rgba(148,163,184,.55)"; ctx.lineWidth=1; ctx.stroke();
    ctx.fillStyle=`rgba(${dark?"241,245,249":"148,163,184"},.9)`;
    kicked=kicked.filter(s=>{ s.vy+=.09; s.x+=s.vx; s.y+=s.vy; s.l-=.012; if(s.l>0){ ctx.globalAlpha=s.l; ctx.beginPath(); ctx.arc(s.x,s.y,s.r,0,7); ctx.fill(); } return s.l>0&&s.y<H+5; }); ctx.globalAlpha=1;
  }
  function frame(now){
    raf=0; if(!vis||current!=="home"){ return; }
    raf=requestAnimationFrame(frame);
    const dt=Math.min(50,last?now-last:16); last=now; const t=now/1000, dark=isDark();
    if(!W) size();
    A=A.map((v,i)=>{ const tg=i===idx?1:0; return v+(tg-v)*Math.min(1,dt/450); });
    ctx.clearRect(0,0,W,H);
    sky(dark,Math.max(A[1],A[2]*.8,A[3]*.6));
    cloudsDraw(t,dark,Math.max(A[3],A[1]*.55,A[2]*.35)); sun(t,dark,A[4]);
    rain(dt,dark,A[1]); water(dark); snow(dt,dark,A[2]); pileDraw(dark);
    ptr.vx*=.8; ptr.vy*=.8;
  }
  size();
  if(reduce){ A=[0,0,0,0,1]; ctx.clearRect(0,0,W,H); sun(0,isDark(),1); }
  else raf=requestAnimationFrame(frame);
  addEventListener("hashchange",()=>{ if(current==="home"&&vis&&!raf&&!reduce){ last=0; requestAnimationFrame(()=>{ size(); raf=requestAnimationFrame(frame); }); } });
})();

/* ---------- Rays from the theme button: one sweep, then gone ----------
   Plays once after the loader (and again when the theme is switched): rays grow out of the
   button, hold for a moment, then fade away. The only ray source on the page. */
(function(){
  const cv=$("#beams"), ctx=cv.getContext("2d"), SCALE=.5;
  let W=0,H=0,ox=0,oy=0,raf=0,t0=0;
  const N=18, R=[], RISE=1100, HOLD=900, FADE=1600, TOTAL=RISE+HOLD+FADE;
  for(let k=0;k<N;k++) R.push({a:(80+k*(120/(N-1)))*Math.PI/180+(Math.random()-.5)*.05,w:.01+Math.random()*.02,len:.5+Math.random()*.45,d:Math.random()*260,base:.35+Math.random()*.65});
  function size(){ W=innerWidth; H=innerHeight; cv.width=Math.ceil(W*SCALE); cv.height=Math.ceil(H*SCALE); ctx.setTransform(SCALE,0,0,SCALE,0,0); const r=themeBtn.getBoundingClientRect(); ox=r.left+r.width/2; oy=r.top+r.height/2; }
  const easeOut=x=>1-Math.pow(1-x,3), easeInOut=x=>x<.5?2*x*x:1-Math.pow(-2*x+2,2)/2;
  function frame(now){
    const e=now-t0; ctx.clearRect(0,0,W,H);
    if(e>=TOTAL){ raf=0; return; }
    raf=requestAnimationFrame(frame);
    const dark=isDark(), c=dark?"234,235,255":"255,210,122", strength=dark?.42:.5, L=Math.hypot(W,H)*1.05;
    const fade=e<RISE+HOLD?1:1-easeInOut((e-RISE-HOLD)/FADE);
    ctx.globalCompositeOperation=dark?"lighter":"source-over";
    for(const b of R){
      const grow=easeOut(clamp((e-b.d)/RISE,0,1)); if(grow<=0) continue;
      const al=b.base*strength*grow*fade*(dark?.55:.8), Ln=L*b.len*(.15+.85*grow), a=b.a+(1-grow)*.06;
      const g=ctx.createRadialGradient(ox,oy,0,ox,oy,Ln); g.addColorStop(0,`rgba(${c},${al})`); g.addColorStop(.35,`rgba(${c},${al*.5})`); g.addColorStop(1,`rgba(${c},0)`);
      ctx.fillStyle=g; ctx.beginPath(); ctx.moveTo(ox,oy); ctx.arc(ox,oy,Ln,a-b.w,a+b.w); ctx.closePath(); ctx.fill(); }
    const gr=150*easeOut(clamp(e/RISE,0,1)), core=ctx.createRadialGradient(ox,oy,0,ox,oy,Math.max(1,gr));
    core.addColorStop(0,`rgba(${c},${.5*strength*fade})`); core.addColorStop(1,`rgba(${c},0)`);
    ctx.globalCompositeOperation="source-over"; ctx.fillStyle=core; ctx.beginPath(); ctx.arc(ox,oy,Math.max(1,gr),0,7); ctx.fill();
  }
  function play(delay=0){ if(reduce) return; setTimeout(()=>{ size(); t0=performance.now(); if(!raf) raf=requestAnimationFrame(frame); },delay); }
  addEventListener("resize",()=>{ if(raf) size(); });
  play($("#loader")?1900:300);
  themeBtn.addEventListener("click",()=>play(450));
})();

/* ---------- Home: marquee, featured work ---------- */
(function(){ const one=MARQ.map(([n,a])=>`<span><i>${esc(a)}</i>${esc(n)}</span>`).join(""); $("#mq").innerHTML=one+one; })();
$("#fgrid").innerHTML=["gutly","alba","tickai","specter"].map(id=>{ const p=PROJECTS.find(x=>x.id===id); return `<a class="fcard rv" href="#work/${p.id}">${cover(p)}<span class="mt"><b>${esc(p.n)}</b><span>${esc(p.type)}</span></span></a>`; }).join("");

/* ---------- Work: filter bar with peek, layouts ---------- */
(function(){
  const bar=$("#fbar"), ind=$("#fInd"), peek=$("#peek"), works=$("#works"), vt=$("#vt"); let f="all", view="showcase";
  const list=k=>k==="all"?PROJECTS:PROJECTS.filter(p=>p.f.includes(k));
  bar.insertAdjacentHTML("beforeend",FILTERS.map(([k,l,ic])=>`<button type="button" class="fb" data-f="${k}" aria-pressed="${k===f}">${svg(ic)}${esc(l)}<span class="n">${list(k).length}</span></button>`).join(""));
  const btns=$$(".fb",bar);
  const placeF=()=>{ const b=btns.find(x=>x.dataset.f===f); if(!b||!b.offsetWidth) return; ind.style.width=b.offsetWidth+"px"; ind.style.transform=`translateX(${b.offsetLeft-4}px)`; };
  function render(){
    const L=list(f); $("#showing").textContent=`Showing ${L.length} of ${PROJECTS.length} projects`;
    works.className="works v-"+view;
    works.innerHTML=L.map((p,i)=>`<article class="card" data-id="${p.id}" data-rail="${esc(p.n)}" style="animation:page-in .6s var(--ease-out) ${i*50}ms both">
      ${p.slug?`<a href="${ROKU+p.slug}" target="_blank" rel="noopener" aria-label="${esc(p.n)} case study (opens in a new tab)">${cover(p)}</a>`:cover(p)}
      <div class="info"><div class="top"><h3>${esc(p.n)}</h3><span class="yr">${esc(p.code)} · ${esc(p.yr)}</span></div><span class="mono" style="color:var(--muted-fg)">${esc(p.type)}</span><p>${esc(p.d)}</p>
      <dl><div><dt>Client</dt><dd>${esc(p.client)}</dd></div><div><dt>Timeline</dt><dd>${esc(p.tl)}</dd></div><div><dt>Year</dt><dd>${esc(p.yr)}</dd></div></dl>
      ${p.slug?`<a class="go" href="${ROKU+p.slug}" target="_blank" rel="noopener">View case study ${svg("ne")}</a>`:`<span class="go" style="color:var(--muted-fg)">Case study link xyz</span>`}</div></article>`).join("");
    deckFx(); if(current==="work") buildRail();
  }
  btns.forEach(b=>{
    b.addEventListener("click",()=>{ f=b.dataset.f; btns.forEach(x=>x.setAttribute("aria-pressed",x===b)); placeF(); render(); haptic("light"); });
    b.addEventListener("pointerenter",()=>{ if(!fine) return; const L=list(b.dataset.f).slice(0,4); peek.innerHTML=L.map(p=>cover(p,false)).join(""); peek.style.left=b.offsetLeft+"px"; peek.classList.add("on"); });
    b.addEventListener("pointerleave",()=>peek.classList.remove("on"));
  });
  $$("button",vt).forEach(b=>b.addEventListener("click",()=>{ view=b.dataset.v; $$("button",vt).forEach(x=>x.setAttribute("aria-pressed",x===b)); render(); haptic("light"); }));
  function deckFx(){ const cards=$$(".card",works);
    if(view!=="deck"||reduce){ cards.forEach(c=>{ c.style.transform=""; c.style.filter=""; }); return; }
    cards.forEach((c,i)=>{ const nx=cards[i+1]; if(!nx){ c.style.transform=""; c.style.filter=""; return; }
      const top=parseFloat(getComputedStyle(c).top)||110, r=nx.getBoundingClientRect(), p=clamp(1-(r.top-top)/c.offsetHeight,0,1);
      c.style.transform=`scale(${1-p*.06}) translateY(${-p*12}px)`; c.style.filter=`brightness(${1-p*.15})`; }); }
  let dq=0; addEventListener("scroll",()=>{ if(current==="work"&&view==="deck"&&!dq) dq=requestAnimationFrame(()=>{ dq=0; deckFx(); }); },{passive:true});
  addEventListener("resize",placeF); addEventListener("hashchange",()=>setTimeout(placeF,30));
  render(); setTimeout(placeF,50);
})();
