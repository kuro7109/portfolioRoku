
/* ---------- Confetti: a short burst from an element, drawn on a throwaway full-screen canvas ---------- */
function confetti(from){
  if(reduce) return;
  const cv=document.createElement("canvas"), ctx=cv.getContext("2d"), dpr=Math.min(2,devicePixelRatio||1), W=innerWidth, H=innerHeight;
  cv.className="confetti"; cv.width=W*dpr; cv.height=H*dpr; ctx.scale(dpr,dpr); document.body.appendChild(cv);
  const r=from.getBoundingClientRect(), ox=r.left+r.width/2, oy=r.top+r.height/2;
  const COLS=["#adfa1d","#22d3ee","#a78bfa","#f472b6","#fbbf24","#fafafa","#34d399"];
  const bits=Array.from({length:160},()=>{ const a=-Math.PI/2+(Math.random()-.5)*Math.PI*1.1, v=7+Math.random()*9;
    return {x:ox,y:oy,vx:Math.cos(a)*v,vy:Math.sin(a)*v,w:5+Math.random()*6,h:3+Math.random()*5,r:Math.random()*6,vr:(Math.random()-.5)*.35,c:COLS[Math.random()*COLS.length|0],round:Math.random()<.3}; });
  const t0=performance.now();
  (function f(t){ const e=t-t0; ctx.clearRect(0,0,W,H);
    for(const b of bits){ b.vy+=.32; b.vx*=.985; b.vy*=.985; b.x+=b.vx; b.y+=b.vy; b.r+=b.vr;
      ctx.globalAlpha=Math.max(0,1-e/2600); ctx.fillStyle=b.c; ctx.save(); ctx.translate(b.x,b.y); ctx.rotate(b.r);
      if(b.round){ ctx.beginPath(); ctx.arc(0,0,b.h/1.6,0,7); ctx.fill(); } else ctx.fillRect(-b.w/2,-b.h/2,b.w,b.h*Math.abs(Math.cos(b.r*2)));
      ctx.restore(); }
    if(e<2600) requestAnimationFrame(f); else cv.remove(); })(t0);
}

/* ---------- Arts: a pinned stage in perspective. Scroll progress drives every piece
   along the z axis, so the title flies past first and the works rush toward you one by one. ---------- */
(function(){
  const track=$("#artTrack"), world=$("#artWorld"), stage=$("#artStage"), box=$("#artBox"); if(!track) return;
  const pad=i=>String(i).padStart(2,"0"), real=ARTS.filter(a=>a.src);
  const PH=[.72,1.33,.7,1.14,.7,1.42,.73,.7,.69]; /* width / height of the placeholder canvases */
  const items=real.length?real.map(a=>({...a,ar:a.w&&a.h?a.w/a.h:.75})):PH.map(ar=>({ar})), N=items.length;
  track.style.setProperty("--n",N);
  $("#artCount").textContent=real.length?`${N} works`:"Coming soon";
  $("#artEndT").textContent=real.length?"That's the archive, for now.":"Pieces are on their way.";
  /* where each piece sits across the frame, as a share of the viewport; alternates sides */
  const SPOT=[[-.27,-.05],[.26,.09],[-.13,.15],[.3,-.12],[-.31,.12],[.1,-.15],[-.21,-.14],[.27,.15],[.02,.05],[-.29,0],[.21,-.05],[-.08,-.17],[.32,.03],[-.18,.17],[.13,.16]];
  const title=$("#artTitle"), end=$("#artEnd");
  end.insertAdjacentHTML("beforebegin",items.map((a,i)=>a.src
    ? `<button type="button" class="art-c" data-i="${i}" style="--ar:${a.ar.toFixed(4)}" aria-label="View ${esc(a.t||"artwork "+pad(i+1))}"><span class="art-fig"><img src="${esc(a.src)}" alt="${esc(a.alt||a.t||"Artwork by Rohit Kumawat")}" loading="${i<4?"eager":"lazy"}" decoding="async"></span><span class="art-meta"><b>${esc(a.t||"Untitled")}</b><span>${esc([a.m,a.yr].filter(Boolean).join(" · "))}</span></span></button>`
    : `<div class="art-c is-empty" aria-hidden="true" style="--ar:${a.ar}"><span class="art-fig" data-n="${pad(i+1)}"></span></div>`).join(""));
  const cards=$$(".art-c",world), bar=$("#artBar"), now=$("#artNow");

  if(reduce){ track.classList.add("flat"); }
  else {
    const P=900, G=1000, LEAD=.55, SLOTS=N+LEAD+.9;
    let tgt=0, cur=0, raf=0, mx=0, my=0, tx=0, ty=0, W=innerWidth, H=innerHeight, lastIdx=0;
    const clamp=v=>v<0?0:v>1?1:v;
    const prog=()=>{ const span=track.offsetHeight-innerHeight; return span>0?clamp(-track.getBoundingClientRect().top/span):0; };
    function place(el,x,y,z,o,hit){
      if(o<=.004){ if(el.style.visibility!=="hidden") el.style.visibility="hidden"; return; }
      el.style.visibility=""; el.style.opacity=o.toFixed(3);
      el.style.transform=`translate(-50%,-50%) translate3d(${x.toFixed(1)}px,${y.toFixed(1)}px,${z.toFixed(1)}px)`;
      if(hit) el.style.pointerEvents=o>.55?"":"none";
    }
    function frame(){
      raf=0;
      cur+=(tgt-cur)*.14; if(Math.abs(tgt-cur)<.00004) cur=tgt;
      tx+=(mx-tx)*.07; ty+=(my-ty)*.07;
      const t=cur*SLOTS;
      world.style.transform=`rotateY(${(tx*3).toFixed(3)}deg) rotateX(${(-ty*2.2).toFixed(3)}deg)`;
      const zt=t*G*.85, to=1-clamp(zt/(.55*P)); place(title,0,0,zt,to);
      cards.forEach((c,i)=>{ const z=(t-(i+1+LEAD))*G, s=SPOT[i%SPOT.length];
        const o=clamp((z+4.6*G)/(2*G))*(1-clamp((z-.22*P)/(.5*P)))*(1-.8*to);
        place(c,s[0]*W,s[1]*H,z,o,true); });
      const ze=(t-SLOTS)*G; place(end,0,0,ze,clamp((ze+2.4*G)/(1.8*G)));
      bar.style.transform=`scaleX(${cur.toFixed(4)})`;
      const idx=Math.min(N,Math.max(1,Math.round(t-LEAD-.2)));
      now.textContent=`${pad(idx)} / ${pad(N)}`;
      if(idx!==lastIdx){ if(lastIdx&&real.length) haptic("soft"); lastIdx=idx; }
      if(cur!==tgt||Math.abs(mx-tx)>.0005||Math.abs(my-ty)>.0005) raf=requestAnimationFrame(frame);
    }
    const kick=()=>{ if(!raf) raf=requestAnimationFrame(frame); };
    const sync=jump=>{ if(!track.offsetParent) return; W=innerWidth; H=innerHeight; tgt=prog(); if(jump) cur=tgt; kick(); };
    addEventListener("scroll",()=>sync(false),{passive:true});
    addEventListener("resize",()=>sync(false));
    new ResizeObserver(()=>sync(true)).observe(track); /* fires when the page is shown */
    stage.addEventListener("pointermove",e=>{ if(e.pointerType!=="mouse") return; const r=stage.getBoundingClientRect(); mx=(e.clientX-r.left)/r.width-.5; my=(e.clientY-r.top)/r.height-.5; kick(); });
    stage.addEventListener("pointerleave",()=>{ mx=my=0; kick(); });
  }

  if(!real.length) return;
  const img=box.querySelector("img"), cap=box.querySelector(".ab-t"), num=box.querySelector(".ab-n"); let at=0;
  function show(i,anim){
    at=(i+real.length)%real.length; const a=real[at];
    const put=()=>{ img.src=a.src; img.alt=a.alt||a.t||"Artwork by Rohit Kumawat"; cap.textContent=[a.t,a.m,a.yr].filter(Boolean).join(" · ")||"Artwork"; num.textContent=`${pad(at+1)} / ${pad(real.length)}`; img.classList.remove("sw"); };
    if(anim&&!reduce){ img.classList.add("sw"); setTimeout(put,160); } else put();
    [real[(at+1)%real.length],real[(at-1+real.length)%real.length]].forEach(n=>{ const p=new Image(); p.src=n.src; });
  }
  const step=d=>{ show(at+d,true); haptic("soft"); };
  world.addEventListener("click",e=>{ const c=e.target.closest(".art-c[data-i]"); if(!c) return; show(+c.dataset.i); box.showModal(); box.append($("#cursor")); document.documentElement.style.overflow="hidden"; haptic("light"); });
  box.addEventListener("close",()=>{ document.body.append($("#cursor")); document.documentElement.style.overflow=""; cards[at]?.focus({preventScroll:true}); });
  box.querySelector(".ab-x").addEventListener("click",()=>box.close());
  box.querySelector(".ab-p").addEventListener("click",()=>step(-1));
  box.querySelector(".ab-n2").addEventListener("click",()=>step(1));
  box.addEventListener("click",e=>{ if(e.target===box||e.target.tagName==="FIGURE") box.close(); });
  box.addEventListener("keydown",e=>{ if(e.key==="ArrowLeft") step(-1); else if(e.key==="ArrowRight") step(1); });
  let sx=0,sy=0; box.addEventListener("pointerdown",e=>{ sx=e.clientX; sy=e.clientY; });
  box.addEventListener("pointerup",e=>{ const dx=e.clientX-sx; if(Math.abs(dx)>50&&Math.abs(dx)>Math.abs(e.clientY-sy)*1.5) step(dx<0?1:-1); });
})();

/* ---------- Experiments (built per card, so the same demo can live on two pages) ---------- */
const EXPS={
 snake:{t:"Snake",tag:"Game",big:true,d:"The classic, rebuilt for the browser, with speeds from Slow to Extreme.",
   stage:`<div class="stage snake"><canvas aria-hidden="true"></canvas><span class="chip live">Live preview</span></div>`,
   cta:`<a class="btn pri" href="https://dotsgame-owcu.vercel.app" target="_blank" rel="noopener">Play Snake ${svg("ne")}<span class="sr"> (opens in a new tab)</span></a>`},
 cricket:{t:"Nokia Cricket",tag:"Game",d:"The Nokia classic, reimagined with a minimal dark look. Chase a target or play free, with your pick of overs, wickets and bowler speed.",
   stage:`<div class="stage snake cricket"><canvas aria-hidden="true"></canvas><span class="chip live">Live preview</span></div>`,
   cta:`<a class="btn pri" href="https://cricketbyroku.vercel.app" target="_blank" rel="noopener">Play Cricket ${svg("ne")}<span class="sr"> (opens in a new tab)</span></a>`},
 otp:{t:"Security Vault",tag:"Puzzle",d:"A four-digit code guards the vault. Crack it to unlock.",
   cta:`<div class="hint"><p class="hint-n" hidden>Two tries down. Want a hint?</p><button type="button" class="btn hint-b" aria-expanded="false">Need a hint?</button><p class="hint-t" hidden>Four digits, counting up from one.</p></div>`,
   stage:`<div class="stage"><div>${'<svg class="lock" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><rect x="4" y="11" width="16" height="10" rx="2"/><path class="sh" d="M8 11V7a4 4 0 0 1 8 0v4"/></svg>'}<div class="otp">${[1,2,3,4].map(n=>`<input inputmode="numeric" maxlength="1" aria-label="Digit ${n}">`).join("")}</div></div></div>`},
 receipt:{t:"Receipt Printer",tag:"Motion",d:"Prints a small receipt line by line, with a buzz for every line on phones.",
   stage:`<div class="stage rcpt-wrap"><div class="slot-l"></div><div class="rcpt"><div class="row"><span>ORDER xyz</span><span>#0001</span></div></div></div>`,cta:`<button type="button" class="btn" data-print>Print</button>`},
 gauge:{t:"Liquid Gauge",tag:"Input",d:"Drag the slider and the liquid follows, with a tick every ten percent.",
   stage:`<div class="stage"><div style="display:grid;justify-items:center"><div class="gauge"><div class="lq"><svg viewBox="0 0 400 28" preserveAspectRatio="none" aria-hidden="true"><path class="w2" d="M0 14 Q50 0 100 14 T200 14 T300 14 T400 14 T500 14 T600 14 V28 H0Z" fill="var(--brand)"/><path class="w" d="M0 14 Q50 28 100 14 T200 14 T300 14 T400 14 T500 14 T600 14 V28 H0Z" fill="var(--brand)"/></svg><div class="body"></div></div><b>64%</b></div><input class="range" type="range" min="0" max="100" value="64" aria-label="Gauge level"></div></div>`},
 turntable:{t:"3D Turntable",tag:"3D",d:"Drag to spin the cube. It keeps its momentum when you let go.",
   stage:`<div class="stage st3"><div class="tt"><div class="f1">RO</div><div class="f2">KU</div><div class="f3">R'</div><div class="f4">08</div><div class="f5"></div><div class="f6"></div></div></div>`,cta:`<button type="button" class="btn" data-spin>Spin it</button>`},
 glow:{t:"Glowing Chat Input",tag:"AI UI",full:true,d:"An animated border glow for an AI chat field. Press the button to watch it type.",
   stage:`<div class="stage"><div class="glow"><input type="text" placeholder="Ask Rohit's portfolio anything…" aria-label="Glowing chat input demo"></div></div>`,cta:`<button type="button" class="btn" data-type>Type a question</button>`}
};
function expCard(id){ const e=EXPS[id]; return `<article class="exp rv" data-id="${id}" data-x="${id}" data-rail="${esc(e.t)}">${e.stage}<div class="bd"><div class="eh"><h3>${esc(e.t)}</h3><span class="chip">${esc(e.tag)}</span></div><p>${esc(e.d)}</p>${e.cta?`<div class="ea">${e.cta}</div>`:""}</div></article>`; }
$("#homeExp").innerHTML=["snake","cricket","otp"].map(expCard).join("");
$("#homeExp").querySelectorAll("[data-rail]").forEach(el=>el.removeAttribute("data-rail"));
$("#allExp").innerHTML=["snake","cricket","otp"].map(expCard).join("");
$$(".exp").forEach(card=>{
  const x=card.dataset.x;
  if(x==="snake"){ const cv=card.querySelector("canvas"), ctx=cv.getContext("2d"); let W=0,H=0,cs=14,cols=0,rows=0,snake=[],dir=[1,0],food=[0,0],timer=0;
    const size=()=>{ const r=cv.getBoundingClientRect(); if(!r.width) return; const dpr=Math.min(2,devicePixelRatio||1); W=r.width; H=r.height; cv.width=W*dpr; cv.height=H*dpr; ctx.setTransform(dpr,0,0,dpr,0,0); cols=Math.max(6,Math.floor(W/cs)); rows=Math.max(5,Math.floor(H/cs)); reset(); draw(); };
    const reset=()=>{ const y=Math.floor(rows/2); snake=[[5,y],[4,y],[3,y],[2,y]]; dir=[1,0]; place(); };
    const place=()=>{ do{ food=[Math.random()*cols|0,Math.random()*rows|0]; }while(snake.some(p=>p[0]===food[0]&&p[1]===food[1])); };
    const free=(a,b)=>a>=0&&b>=0&&a<cols&&b<rows&&!snake.slice(0,-1).some(p=>p[0]===a&&p[1]===b);
    const step=()=>{ const [hx,hy]=snake[0]; const opts=[[1,0],[-1,0],[0,1],[0,-1]].filter(d=>!(d[0]===-dir[0]&&d[1]===-dir[1])&&free(hx+d[0],hy+d[1]));
      if(!opts.length){ reset(); return; } const dist=d=>Math.abs(hx+d[0]-food[0])+Math.abs(hy+d[1]-food[1]); opts.sort((a,b)=>dist(a)-dist(b));
      dir=(Math.random()<.08&&opts.length>1)?opts[1]:opts[0]; const nh=[hx+dir[0],hy+dir[1]]; snake.unshift(nh);
      if(nh[0]===food[0]&&nh[1]===food[1]){ if(snake.length>36) reset(); else place(); } else snake.pop(); };
    const draw=()=>{ ctx.clearRect(0,0,W,H); const ox=(W-cols*cs)/2, oy=(H-rows*cs)/2, c=(v,o)=>o+v*cs+cs/2;
      ctx.fillStyle="#2a2a2a"; for(let i=0;i<cols;i++) for(let j=0;j<rows;j++){ ctx.beginPath(); ctx.arc(c(i,ox),c(j,oy),1,0,7); ctx.fill(); }
      ctx.fillStyle="#adfa1d"; ctx.beginPath(); ctx.arc(c(food[0],ox),c(food[1],oy),cs*.32,0,7); ctx.fill();
      for(let i=snake.length-1;i>=0;i--){ const p=snake[i]; ctx.fillStyle=i?`rgba(237,237,237,${Math.max(.3,1-i*.035).toFixed(2)})`:"#fff"; ctx.beginPath(); ctx.arc(c(p[0],ox),c(p[1],oy),i?cs*.36:cs*.44,0,7); ctx.fill(); } };
    addEventListener("resize",size); size();
    if(!reduce) new IntersectionObserver(es=>{ const v=es[0].isIntersecting; if(v&&!W) size(); if(v&&!timer) timer=setInterval(()=>{ step(); draw(); },110); if(!v&&timer){ clearInterval(timer); timer=0; } }).observe(cv);
  }
  if(x==="cricket"){ const cv=card.querySelector("canvas"), ctx=cv.getContext("2d"); let W=0,H=0,timer=0,t=0,runs=34,wk=2,balls=22,shot=null,flash="";
    const size=()=>{ const r=cv.getBoundingClientRect(); if(!r.width) return; const dpr=Math.min(2,devicePixelRatio||1); W=r.width; H=r.height; cv.width=W*dpr; cv.height=H*dpr; ctx.setTransform(dpr,0,0,dpr,0,0); draw(); };
    // one delivery every ~2.2s: run-up, bounce, swing, then the ball flies off (or hits the stumps)
    const OUT=["4","6","1","2","0","4","W","1","6","0"]; let k=0;
    const draw=()=>{ if(!W) return; ctx.clearRect(0,0,W,H);
      const cx=W/2, top=H*.14, bot=H*.82, pw=Math.min(84,W*.22);
      ctx.strokeStyle="#1f1f1f"; ctx.lineWidth=1; ctx.beginPath(); ctx.ellipse(cx,H*.5,W*.44,H*.44,0,0,7); ctx.stroke(); ctx.beginPath(); ctx.ellipse(cx,H*.5,W*.26,H*.3,0,0,7); ctx.stroke();
      ctx.fillStyle="#161616"; ctx.fillRect(cx-pw/2,top,pw,bot-top);
      ctx.strokeStyle="#2a2a2a"; ctx.lineWidth=1; [top+14,bot-14].forEach(y=>{ ctx.beginPath(); ctx.moveTo(cx-pw/2-8,y); ctx.lineTo(cx+pw/2+8,y); ctx.stroke(); });
      const stump=(y,down)=>{ ctx.fillStyle=down?"#adfa1d":"#e8e8e8"; for(let i=-1;i<=1;i++) ctx.fillRect(cx+i*6-1.2,y-(down&&i===0?6:12),2.4,down&&i!==0?10:12); };
      stump(top+14,false); stump(bot-10,shot==="W"&&t>.55);
      const p=Math.min(1,t/.55); // ball travel phase
      if(t<.55){ const y=top+20+(bot-34-top)*p, hop=Math.sin(Math.min(1,p*1.6)*Math.PI)*10*(p<.62?1:0);
        ctx.fillStyle="rgba(0,0,0,.4)"; ctx.beginPath(); ctx.ellipse(cx,y+4,4,2,0,0,7); ctx.fill();
        ctx.fillStyle="#fff"; ctx.beginPath(); ctx.arc(cx,y-hop,3.6,0,7); ctx.fill(); }
      else if(shot&&shot!=="W"&&shot!=="0"){ const q=(t-.55)/.45, dir=shot==="6"?-.5:shot==="4"?.9:-1.2, far=shot==="6"?1.3:shot==="4"?1.1:.4;
        const x=cx+Math.sin(dir)*q*W*.45*far, y=bot-34-Math.cos(dir)*q*H*.6*far-(shot==="6"?Math.sin(q*Math.PI)*30:0);
        ctx.fillStyle="#fff"; ctx.beginPath(); ctx.arc(x,y,3.6*(shot==="6"?1+Math.sin(q*Math.PI)*.5:1),0,7); ctx.fill(); }
      // batter: a bat that swings as the ball arrives
      const sw=t>.45&&t<.75?Math.sin((t-.45)/.3*Math.PI):0;
      ctx.save(); ctx.translate(cx+10,bot-26); ctx.rotate(-.9+sw*1.6); ctx.fillStyle="#d9c8a0"; ctx.fillRect(-2.5,0,5,28); ctx.restore();
      ctx.fillStyle="#cfcfcf"; ctx.font='500 11px "IBM Plex Mono",monospace'; ctx.textAlign="right"; ctx.textBaseline="top";
      ctx.fillText(`${runs}/${wk}  ${Math.floor(balls/6)}.${balls%6} ov`,W-12,12);
      if(flash&&t>.6){ ctx.textAlign="center"; ctx.fillStyle=flash==="OUT"?"#ff6b6b":"#adfa1d"; ctx.font='600 22px "TikTok Sans",system-ui,sans-serif'; ctx.fillText(flash,cx,H*.4); }
    };
    const tick=()=>{ t+=.05; if(t>=1){ t=0; shot=OUT[k++%OUT.length]; flash=""; }
      if(t>.55&&!flash&&shot){ balls++; if(shot==="W"){ wk=wk>=9?0:wk+1; flash="OUT"; } else { runs+=+shot; if(shot==="4"||shot==="6") flash=shot==="6"?"SIX":"FOUR"; else flash=" "; } if(runs>220){ runs=0; wk=0; balls=0; } }
      draw(); };
    shot=OUT[k++]; addEventListener("resize",size); size();
    if(!reduce) new IntersectionObserver(es=>{ const v=es[0].isIntersecting; if(v&&!W) size(); if(v&&!timer) timer=setInterval(tick,110); if(!v&&timer){ clearInterval(timer); timer=0; } }).observe(cv);
  }
  if(x==="otp"){ const box=card.querySelector(".otp"), ins=$$("input",box), hb=card.querySelector(".hint-b"), ht=card.querySelector(".hint-t"), hn=card.querySelector(".hint-n"); let misses=0;
    hb.addEventListener("click",()=>{ ht.hidden=false; hn.hidden=true; hb.hidden=true; hb.setAttribute("aria-expanded","true"); haptic("light"); });
    const check=()=>{ const v=ins.map(i=>i.value).join(""); if(v.length<4) return;
      if(v==="1234"){ box.classList.add("ok"); card.classList.add("unlocked"); haptic("success"); say("Vault unlocked"); confetti(card.querySelector(".otp")); setTimeout(()=>{ box.classList.remove("ok"); card.classList.remove("unlocked"); ins.forEach(i=>i.value=""); },2200); }
      else { box.classList.remove("bad"); void box.offsetWidth; box.classList.add("bad"); haptic("error"); setTimeout(()=>{ ins.forEach(i=>i.value=""); ins[0].focus(); },420);
        if(++misses>=2&&ht.hidden){ hn.hidden=false; hb.classList.add("nudge"); } } };
    ins.forEach((inp,i)=>{ inp.addEventListener("input",()=>{ inp.value=inp.value.replace(/\D/g,"").slice(-1); if(inp.value&&i<3) ins[i+1].focus(); haptic("light"); check(); });
      inp.addEventListener("keydown",e=>{ if(e.key==="Backspace"&&!inp.value&&i>0) ins[i-1].focus(); });
      inp.addEventListener("paste",e=>{ const d=(e.clipboardData.getData("text")||"").replace(/\D/g,"").slice(0,4); if(d){ e.preventDefault(); d.split("").forEach((c,k)=>ins[k].value=c); check(); } }); });
  }
  if(x==="receipt"){ const r=card.querySelector(".rcpt"), items=[["Flat white","₹180"],["Croissant","₹140"],["Extra shot","₹40"],["Tax","₹18"]]; let busy=false;
    card.querySelector("[data-print]").addEventListener("click",()=>{ if(busy) return; busy=true; r.innerHTML=`<div class="row"><span>ORDER xyz</span><span>#${Math.floor(Math.random()*9000+1000)}</span></div>`;
      items.forEach((it,k)=>setTimeout(()=>{ r.insertAdjacentHTML("beforeend",`<div class="row"><span>${it[0]}</span><span>${it[1]}</span></div>`); haptic("light"); },220*(k+1)));
      setTimeout(()=>{ r.insertAdjacentHTML("beforeend",'<div class="row tot"><span>TOTAL</span><span>₹378</span></div>'); haptic("medium"); busy=false; },220*(items.length+1)); }); }
  if(x==="gauge"){ const lq=card.querySelector(".lq"), b=card.querySelector(".gauge b"), rg=card.querySelector(".range"); let ls=-1;
    const set=v=>{ lq.style.top=(100-v)+"%"; b.textContent=v+"%"; const s=Math.floor(v/10); if(s!==ls){ ls=s; haptic("light"); } };
    rg.addEventListener("input",()=>set(+rg.value)); set(64); }
  if(x==="turntable"){ const tt=card.querySelector(".tt"); let ry=30,v=0,drag=false,lx=0,raf=0;
    const loop=()=>{ if(!drag){ v*=.95; ry+=v; } tt.style.setProperty("--ry",ry+"deg"); raf=(drag||Math.abs(v)>.05)?requestAnimationFrame(loop):0; };
    tt.addEventListener("pointerdown",e=>{ drag=true; lx=e.clientX; v=0; tt.setPointerCapture(e.pointerId); if(!raf) raf=requestAnimationFrame(loop); });
    tt.addEventListener("pointermove",e=>{ if(!drag) return; const d=e.clientX-lx; lx=e.clientX; ry+=d*.6; v=d*.6; if(Math.abs(d)>8) haptic("light"); });
    ["pointerup","pointercancel"].forEach(ev=>tt.addEventListener(ev,()=>drag=false));
    card.querySelector("[data-spin]").addEventListener("click",()=>{ v=24; if(!raf) raf=requestAnimationFrame(loop); }); }
  if(x==="glow"){ const i=card.querySelector("input");
    card.querySelector("[data-type]").addEventListener("click",()=>{ i.focus(); i.value=""; const t="What did Rohit design for TickAI?"; let k=0; const iv=setInterval(()=>{ i.value=t.slice(0,++k); if(k>=t.length) clearInterval(iv); },35); }); }
});

/* ---------- Rows, tools, skills, social ---------- */
const honourRow=h=>`<div class="rowi rv"><b>${esc(h.t)}<small>${esc(h.res)}</small></b><span class="co">${esc(h.org)}</span><span>Case competition</span><span class="y">${esc(h.y)}</span></div>`;
$("#journey").innerHTML=JOURNEY.map(j=>`<div class="rowi rv"><b>${esc(j.role)}${j.focus?`<small>${esc(j.focus)}</small>`:""}</b><span class="co">${esc(j.co)}</span><span>${esc(j.loc)}</span><span class="y">${esc(j.y)}</span></div>`).join("");
// each copy of the stack gets its own gradient ids, otherwise a logo can point at defs inside a hidden page
const logoFor=(n,k)=>LOGOS[n].replace(/(id="|url\(#|href="#)([^")]+)/g,(m,a,b)=>a+b+"-"+k);
$$("[data-tools]").forEach((el,k)=>el.innerHTML=TOOLS.map(n=>`<div class="tool rv" data-t="${esc(n)}"><span class="lg">${logoFor(n,k)}</span><span>${esc(n)}</span></div>`).join(""));
$$("[data-skills]").forEach(el=>el.innerHTML=SKILLS.map(([a,b])=>`<div class="rv"><b>${esc(a)}</b><span>${esc(b)}</span></div>`).join(""));
const SOCIAL=[["Email","mail",GMAIL],["LinkedIn","li",LINKEDIN],["GitHub","gh",GITHUB]];
$$("[data-social]").forEach(el=>el.innerHTML=SOCIAL.map(([n,i,u])=>`<a class="btn" href="${u}" target="_blank" rel="noopener">${svg(i)}${n}<span class="sr"> (opens in a new tab)</span></a>`).join(""));
$$("[data-gmail]").forEach(a=>a.href=GMAIL);

/* ---------- Answers for the chat and the About "Ask me anything" ---------- */
const QA=[
 [/\b(hi|hello|hey|yo)\b/i,()=>"Hey! I can tell you about Rohit's projects, experience, tools, competitions or games."],
 [/(intern|experience|aspora|evvolv|job|worked|career)/i,()=>"Rohit was a <b>Product Management Intern</b> at Evvolv.ai, New Delhi (May – Jul 2026), working on product and GTM planning, and a <b>Product Design Intern</b> at Aspora, Bengaluru (May – Jun 2025), on UI and UX."],
 [/(project|work|portfolio|case|best|gutly|tickai|genme|specter|alba|spotify)/i,()=>`${PROJECTS.length} projects so far, from Socius, Gutly and InLens to brands for Genme and TickAI. <a href="#work">See all the work</a>.`],
 [/(fifa|game|subway|mahjong|play|h2h)/i,()=>"He loves old retro games, plus FIFA, Subway Surfers and Mahjong. His FIFA ID is <b>484556561329106944</b>: send a friend request for a head-to-head match."],
 [/(tool|figma|framer|stack|software|illustrator|photoshop)/i,()=>`${TOOLS.slice(0,-1).join(", ")} and ${TOOLS[TOOLS.length-1]}.`],
 [/(honou?r|award|competition|iim|iit|ifqm|bml)/i,()=>"Case competitions: IFQM Quality Redesign and BML Munjal ProdPro (Sep '26), IIM Kashipur Udaan 9.0 and IIT Madras ConsultSchool 4.0 (Jan '26)."],
 [/(call|book|meet|schedule|chat with)/i,()=>`Pick a slot on the <a href="#book">Book a call</a> page and it opens a Gmail draft to him.`],
 [/(snake|experiment|playground)/i,()=>`Try <a href="https://dotsgame-owcu.vercel.app" target="_blank" rel="noopener">Snake</a>, or browse the <a href="#experiments">experiments</a>.`],
 [/(contact|email|mail|reach|hire|linkedin|github)/i,()=>`Email <a href="${GMAIL}" target="_blank" rel="noopener">${EMAIL}</a>, or find him on <a href="${LINKEDIN}" target="_blank" rel="noopener">LinkedIn</a> and <a href="${GITHUB}" target="_blank" rel="noopener">GitHub</a>.`],
 [/(where|based|live|location|delhi|from)/i,()=>"Delhi, India."],
 [/(who|about|what does|do you do|rohit)/i,()=>"Rohit is a product designer and product manager in Delhi. He designs apps, brands and interfaces, and plans how products launch."]
];
const answer=q=>{ for(const [re,f] of QA) if(re.test(q)) return f(); return `I don't know that one yet (xyz). Try his projects, experience, tools or games, or <a href="${GMAIL}" target="_blank" rel="noopener">email him</a>.`; };
const SUGS=["What does he do?","Where has he interned?","Best projects?","What's his FIFA ID?","How do I reach him?"];
function converse(box,q,scroll){
  box.insertAdjacentHTML("beforeend",`<div class="m me">${esc(q)}</div><div class="m bot dots"><span></span><span></span><span></span></div>`); scroll();
  setTimeout(()=>{ const d=box.querySelector(".dots"); if(d) d.outerHTML=`<div class="m bot">${answer(q)}</div>`; scroll(); haptic("light"); },reduce?0:650);
}
(function(){ // About inline
  const out=$("#askOut"), f=$("#askInline"), q=$("#askQ");
  $("#askSugs").innerHTML=SUGS.map(s=>`<button type="button">${esc(s)}</button>`).join("");
  $$("#askSugs button").forEach(b=>b.addEventListener("click",()=>converse(out,b.textContent,()=>{})));
  f.addEventListener("submit",e=>{ e.preventDefault(); const v=q.value.trim(); if(!v) return; q.value=""; converse(out,v,()=>{}); });
})();
(function(){ // floating chat
  const panel=$("#cpanel"), btn=$("#chatBtn"), msgs=$("#msgs"), f=$("#cform"), q=$("#cq");
  const open=o=>{ panel.dataset.open=o; btn.setAttribute("aria-expanded",o); haptic("medium"); if(o) setTimeout(()=>q.focus({preventScroll:true}),200); };
  btn.addEventListener("click",()=>open(panel.dataset.open!=="true"));
  $("#csugs").innerHTML=SUGS.map(s=>`<button type="button">${esc(s)}</button>`).join("");
  const sc=()=>msgs.scrollTop=1e6;
  $$("#csugs button").forEach(b=>b.addEventListener("click",()=>converse(msgs,b.textContent,sc)));
  f.addEventListener("submit",e=>{ e.preventDefault(); const v=q.value.trim(); if(!v) return; q.value=""; converse(msgs,v,sc); });
  msgs.addEventListener("click",e=>{ const a=e.target.closest('a[href^="#"]'); if(a) open(false); });
  document.addEventListener("keydown",e=>{ if(e.key==="Escape"&&panel.dataset.open==="true"){ open(false); btn.focus(); } });
})();

/* ---------- Blogs ---------- */
const POSTS=[
 {t:"Jakob's Law: why your product should feel familiar",tag:"UX laws",date:"Nov 2026",min:5,c:PROJECTS[2].c,ex:"People spend most of their time in other products, so they arrive at yours expecting it to work the same way. Here's how to use that instead of fighting it.",
  body:["Jakob Nielsen put a simple observation into words: people spend most of their time on other sites and apps, not yours. Every product they use teaches them how products are supposed to work, and they carry those lessons into whatever they open next.",
   "That's Jakob's Law. Users build mental models from everything they've used before, and they expect your product to match them. The logo takes you home. The cart lives in the top-right corner. Swiping right goes back. Pull down to refresh. None of these are rules of nature; they're habits learned across thousands of screens.",
   "When a product matches those habits, people stop thinking about the interface and start thinking about their task. When it breaks them, every unfamiliar pattern costs attention. A clever new navigation might win a design award and still lose users who can't find the settings.",
   "This doesn't mean every product should look the same. It means novelty should be spent deliberately. Keep the plumbing familiar (navigation, forms, checkout, error states) and put your originality where it changes the experience: the core interaction, the content, the moments of delight.",
   "Before designing a screen, I find it useful to list the conventions in that category. What do the five products your users open most every day do for this same task? Borrow those patterns unless you have a strong reason not to. If you do have a better idea, introduce it gently, keep the old way available for a while, and test whether people actually prefer it.",
   "Familiar isn't boring. It's the part of the design that lets everything else stand out."]},
 {t:"What product management actually is",tag:"Product management",date:"Nov 2026",min:4,c:PROJECTS[4].c,ex:"Product management isn't about owning a roadmap. It's about deciding which problems are worth solving, and saying no to everything else.",
  body:["Ask ten people what a product manager does and you'll get ten answers: writes specs, runs stand-ups, owns the roadmap, talks to customers. All of those happen, but none of them is the job.",
   "The job is making sure the team builds the right thing. That sounds obvious until you notice how many teams ship features nobody asked for, on time and well executed.",
   "Good product work starts with the problem, not the solution. Who has this problem, how often, and what do they do about it today? If you can't answer that in two sentences, the feature isn't ready to be designed.",
   "Most of the work is choosing. There are always more good ideas than time, so the real skill is ranking them by impact and effort, and being clear about what you're not doing and why.",
   "Then comes measuring. A launch isn't the finish line; it's the start of finding out whether you were right. Decide what success looks like before you ship, so the numbers can tell you something instead of confirming whatever you hoped.",
   "Design and product management aren't separate jobs so much as two angles on the same question: what should exist, and how should it feel to use it?"]},
 {t:"AI psychosis: how AI traps you in a sandbox",tag:"AI & society",date:"Nov 2026",min:4,c:PROJECTS[6].c,ex:"How interactions with advanced chatbots can trigger or worsen mental health vulnerabilities, and why constant validation from AI can distort a person's sense of reality.",
  body:["This blog investigates the phenomenon of “AI psychosis”: how interactions with advanced chatbots can trigger or exacerbate mental health vulnerabilities in users. It looks at the intersection of loneliness, confirmation bias and the tendency of AI to provide constant validation, which can distort a user's perception of reality.",
   {h:"Key takeaways"},
   {ul:[["The problem of sycophancy","Modern chatbots like ChatGPT are often designed to be agreeable and engaging. This people-pleasing behaviour can reinforce harmful thoughts, paranoia or delusions if a user is already in a vulnerable state, effectively creating a feedback loop."],
    ["Historical context","This traces back to the ELIZA effect (1966), where humans projected empathy onto simple software. While AI tools can be comforting, they lack the capacity for genuine, corrective clinical care."],
    ["Documented cases","There have been real-world tragedies where people with pre-existing mental health conditions, such as schizophrenia or severe depression, developed intense, sometimes fatal, parasocial relationships with AI companions."],
    ["The “Black Mirror” effect","Instead of a malicious AI conspiracy, experts suggest these cases reflect a black mirror of our own psychology. The AI mirrors the user's input: if a user prompts it with a delusion, it may validate it rather than challenge it."],
    ["Future risks","Looking ahead, there is the potential for extreme individualism and a deeper loneliness epidemic as we increasingly outsource cognitive tasks and social interaction to AI agents."]]},
   {h:"Conclusion"},
   "AI is not intentionally causing harm, but its lack of safeguards and its tendency to validate user bias make it a dangerous tool for people experiencing a mental health crisis. Prioritise your mental well-being, and stay sceptical of validation that comes from AI."]},
 {t:"CARS24 didn't just change a logo",tag:"Branding",date:"Nov 2026",min:2,c:["#4736fe","#0072bd","#0d0b2e"],ex:"They changed the philosophy behind their brand: from an urgent all-caps startup to an open circle built around movement.",
  body:["CARS24 didn't just change a logo. They changed the philosophy behind their brand.",
   "When the company launched in 2015, it was boldly and urgently presented as CARS24. It reflected the mindset of a young startup trying to break into a market that wasn't easy to enter.",
   "Today, it's Cars24. (What did they change? Same imo 🤔)",
   "A subtle shift from uppercase to sentence case, but the tone feels very different. Less aggressive. More human. More confident.",
   {sw:["#0072BD","#4736FE"],cap:"The colour changed too."},
   "A fresher, more vibrant blue takes the place of the previous shade, evoking warmth, trust and approachability. It feels more present and more connected to the people the platform serves.",
   {h:"The open circle"},
   "But the most interesting change is the symbol: a circle that is intentionally left open.",
   "Traditionally, circles represent continuity and cycles. But a closed circle suggests completion, the idea that a journey has come to an end.",
   "Cars24 leaves the circle open to represent something else: movement, transition and liquidity.",
   "🚘 Cars don't stop with one owner. They move on, change hands and continue their journey.",
   "The open circle reflects a system designed not to lock people in, but to move with them as their needs evolve.",
   "Sometimes the smallest design changes carry the biggest ideas. Great products evolve their identity when the company evolves."]}
];
const postCov=p=>`<div class="cov"><div class="g" style="background:${coverBg(p.c)}"></div><div class="gr"></div><span class="tg">${esc(p.tag)}</span></div>`;
let bfilter="All";
function renderBlogs(){
  const tags=["All",...new Set(POSTS.map(p=>p.tag))];
  $("#btabs").innerHTML=tags.map(t=>`<button type="button" class="tab" data-t="${esc(t)}" aria-pressed="${t===bfilter}">${esc(t)}<span class="n">${t==="All"?POSTS.length:POSTS.filter(p=>p.tag===t).length}</span></button>`).join("");
  $$("#btabs .tab").forEach(b=>b.addEventListener("click",()=>{ bfilter=b.dataset.t; renderBlogs(); if(current==="blogs") buildRail(); }));
  const list=bfilter==="All"?POSTS:POSTS.filter(p=>p.tag===bfilter);
  $("#bgrid").innerHTML=list.map((p,i)=>`<button type="button" class="post ${i===0&&bfilter==="All"?"feat":""}" data-i="${POSTS.indexOf(p)}" data-rail="${esc(p.t)}">${postCov(p)}<div class="bd"><span class="meta">${p.soon?"Coming soon":`${esc(p.date)} · ${p.min} min read`}</span><h3>${esc(p.t)}</h3><p>${esc(p.ex)}</p></div></button>`).join("");
  $$("#bgrid .post").forEach(b=>b.addEventListener("click",()=>openPost(+b.dataset.i,b)));
}
let readerEl=null, readerFrom=null;
function openReader({cov,meta,title,paras,back,from,label,wide}){
  readerFrom=from; readerEl=document.createElement("div"); readerEl.className="reader"; readerEl.setAttribute("role","dialog"); readerEl.setAttribute("aria-modal","true"); readerEl.setAttribute("aria-label",label||title);
  readerEl.innerHTML=`<article class="${wide?"wide slides":""}" style="position:relative">${cov}<button type="button" class="btn close" id="readerClose">${esc(back)}</button><div class="bd">${meta?`<span class="mono" style="color:var(--muted-fg)">${meta}</span>`:""}${title?`<h2>${esc(title)}</h2>`:""}${paras}</div></article>`;
  readerEl.addEventListener("click",e=>{ if(e.target===readerEl) closePost(); });
  document.body.appendChild(readerEl); root.style.overflow="hidden"; $("#readerClose").addEventListener("click",closePost); $("#readerClose").focus(); haptic("light");
}
const blk=x=>typeof x==="string"?`<p>${esc(x)}</p>`:x.h?`<h3 class="rh">${esc(x.h)}</h3>`:x.ul?`<ul class="rl">${x.ul.map(([b,t])=>`<li><b>${esc(b)}.</b> ${esc(t)}</li>`).join("")}</ul>`:x.sw?`<p>${esc(x.cap)}</p><div class="sw">${x.sw.map((c,i)=>`${i?'<span aria-hidden="true">→</span>':""}<span class="swc"><i style="background:${c}"></i>${esc(c)}</span>`).join("")}</div>`:"";
function openPost(i,from){
  const p=POSTS[i];
  const paras=p.soon?`<p>${esc(p.ex)}</p><p style="color:var(--muted-fg)">This case study is being written. Check back soon.</p>`:(p.body||[p.ex]).map(blk).join("");
  openReader({cov:postCov(p),meta:`${esc(p.tag)} · ${p.soon?"Coming soon":`${esc(p.date)} · ${p.min} min read`}`,title:p.t,paras,back:"Back to blogs",from});
}
function openProject(id,from){
  const p=PROJECTS.find(x=>x.id===id); if(!p) return;
  // Client | Year on top, timeline if there is one, role across the bottom
  const facts=`<dl class="pdl"><div><dt>Client</dt><dd>${esc(p.client)}</dd></div><div><dt>Year</dt><dd>${esc(p.yr)}</dd></div><div class="wide"><dt>Role</dt><dd>${esc(p.role||p.type.replace(/ \/ /g,", "))}</dd></div></dl>`;
  const live=p.live?`<a class="btn pri live" href="${p.live}" target="_blank" rel="noopener">Explore the Production ${svg("ne")}<span class="sr"> (opens in a new tab)</span></a>`:"";
  // a full case study (exported board, sliced into images so it loads progressively) sits under the facts
  const cs=p.cs?`<h3 class="rh">Case study</h3><div class="csimg${p.cs.deck?" deck":""}">${p.cs.h.map((h,k)=>`<img src="${p.cs.dir}/part-${k+1}.jpg" width="${p.cs.w}" height="${h}" alt="${k?"":esc(p.n)+" case study: logo, colours, typography, menu, website and brand applications"}" loading="${k?"lazy":"eager"}" decoding="async">`).join("")}</div>`:"";
  const paras=`<p>${esc(p.d)}</p>${facts}${live}`+(cs||(p.live?"":`<p style="color:var(--muted-fg)">The full case study (process, research and final screens) is coming soon.</p>`));
  openReader({cov:cover(p,false),meta:"",title:"",paras,back:"Back to work",from,label:p.n,wide:!!p.cs});
}
function closePost(){ if(!readerEl) return; readerEl.remove(); readerEl=null; root.style.overflow=""; readerFrom&&readerFrom.focus(); }
document.addEventListener("keydown",e=>{ if(e.key==="Escape") closePost(); });
renderBlogs();

/* ---------- Book a call: Gmail request form ---------- */
(function(){
  const SLOTS=["10:00 AM","11:30 AM","2:00 PM","4:30 PM","6:00 PM"];
  const today=new Date(); today.setHours(0,0,0,0);
  let view=new Date(today.getFullYear(),today.getMonth(),1), pick=null, slot=null, dur=30;
  const title=$("#calTitle"), days=$("#calDays"), slots=$("#slots"), slotLabel=$("#slotLabel"), prev=$("#calPrev"), next=$("#calNext");
  const name=$("#bkName"), mail=$("#bkEmail"), topic=$("#bkTopic"), sum=$("#bkSum"), send=$("#bkSend");
  const fmt=d=>d.toLocaleDateString("en-IN",{weekday:"short",day:"numeric",month:"short",year:"numeric"});
  const maxView=new Date(today.getFullYear(),today.getMonth()+2,1);
  function drawCal(){
    title.textContent=view.toLocaleDateString("en-IN",{month:"long",year:"numeric"});
    prev.disabled=view<=new Date(today.getFullYear(),today.getMonth(),1); next.disabled=view>=maxView;
    const lead=(view.getDay()+6)%7, n=new Date(view.getFullYear(),view.getMonth()+1,0).getDate(); let h="";
    for(let k=0;k<lead;k++) h+="<span></span>";
    for(let d=1;d<=n;d++){ const dt=new Date(view.getFullYear(),view.getMonth(),d), wk=dt.getDay(), off=dt<=today||wk===0||wk===6, on=pick&&+dt===+pick;
      h+=`<button type="button" class="day ${+dt===+today?"today":""}" data-d="${+dt}" ${off?"disabled":""} aria-pressed="${!!on}" aria-label="${fmt(dt)}${off?" (unavailable)":""}">${d}</button>`; }
    days.innerHTML=h;
    $$(".day:not(:disabled)",days).forEach(b=>b.addEventListener("click",()=>{ pick=new Date(+b.dataset.d); slot=null; drawCal(); drawSlots(); update(); haptic("light"); }));
  }
  function drawSlots(){
    if(!pick){ slots.innerHTML=""; slotLabel.textContent="Pick a day to see times"; return; }
    slotLabel.textContent=`Times on ${fmt(pick)} (IST)`;
    slots.innerHTML=SLOTS.map((t,k)=>`<button type="button" class="slot2" style="animation-delay:${k*40}ms" aria-pressed="${t===slot}">${t}</button>`).join("");
    $$(".slot2",slots).forEach(b=>b.addEventListener("click",()=>{ slot=b.textContent; drawSlots(); update(); haptic("light"); }));
  }
  const validMail=v=>/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
  function update(){
    const ok=pick&&slot&&name.value.trim()&&validMail(mail.value.trim());
    sum.innerHTML=pick&&slot?`<b>${dur} min</b> on <b>${esc(fmt(pick))}</b> at <b>${esc(slot)} IST</b>`:(pick?"Now pick a time.":"Choose a day and a time.");
    if(pick&&slot&&!ok) sum.innerHTML+=" · add your name and email to send.";
    send.setAttribute("aria-disabled",ok?"false":"true");
    if(ok){ const su=`Call request: ${fmt(pick)}, ${slot} IST (${dur} min)`, body=`Hi Rohit,\n\nI'd like to book a ${dur}-minute call on ${fmt(pick)} at ${slot} IST.\n\nName: ${name.value.trim()}\nEmail: ${mail.value.trim()}\nTopic: ${topic.value.trim()||"-"}\n\nThanks!`;
      send.href=`${GMAIL}&su=${encodeURIComponent(su)}&body=${encodeURIComponent(body)}`; send.target="_blank"; send.rel="noopener"; }
    else { send.href="#book"; send.removeAttribute("target"); }
  }
  $$(".segb").forEach(b=>b.addEventListener("click",()=>{ dur=+b.dataset.dur; $$(".segb").forEach(x=>x.setAttribute("aria-pressed",x===b)); update(); haptic("light"); }));
  prev.addEventListener("click",()=>{ view=new Date(view.getFullYear(),view.getMonth()-1,1); drawCal(); });
  next.addEventListener("click",()=>{ view=new Date(view.getFullYear(),view.getMonth()+1,1); drawCal(); });
  [name,mail,topic].forEach(el=>el.addEventListener("input",()=>{ el.classList.remove("bad"); update(); }));
  mail.addEventListener("blur",()=>mail.classList.toggle("bad",mail.value.trim()!==""&&!validMail(mail.value.trim())));
  send.addEventListener("click",e=>{ if(send.getAttribute("aria-disabled")==="true"){ e.preventDefault(); if(!name.value.trim()) name.classList.add("bad"); if(!validMail(mail.value.trim())) mail.classList.add("bad");
      haptic("error"); say(!pick?"Pick a day first":!slot?"Pick a time":"Add your name and a valid email"); return; } haptic("success"); say("Opening Gmail with your request"); });
  $("#bookForm").addEventListener("submit",e=>e.preventDefault());
  drawCal(); drawSlots(); update();
})();

/* ---------- Footer: scramble links, handwritten quote ---------- */
const slink=(t,h,ext)=>`<li><a class="slink" href="${h}"${ext?' target="_blank" rel="noopener"':""}><span class="txt">${esc(t)}</span>${svg(ext?"ne":"arrow")}${ext?'<span class="sr"> (opens in a new tab)</span>':""}</a></li>`;
$("#fMenu").innerHTML=[["Home","#home"],["Work","#work"],["Experiments","#experiments"],["Arts","#arts"],["Blogs","#blogs"],["About","#about"],["Book a call","#book"]].map(([t,h])=>slink(t,h,false)).join("");
$("#fContact").innerHTML=[["Email",GMAIL],["LinkedIn",LINKEDIN],["GitHub",GITHUB]].map(([t,h])=>slink(t,h,true)).join("");
$$(".slink").forEach(a=>{ const t=a.querySelector(".txt"), txt=t.textContent; const go=()=>scramble(t,txt); a.addEventListener("pointerenter",go); a.addEventListener("focus",go); });
new IntersectionObserver((es,o)=>{ if(es[0].isIntersecting){ $("#quote").classList.add("in"); o.disconnect(); } },{threshold:.6}).observe($("#quote"));

/* ---------- Reveals ---------- */
const rvIO=new IntersectionObserver(es=>es.forEach(e=>{ if(e.isIntersecting){ e.target.classList.add("in"); rvIO.unobserve(e.target); } }),{threshold:.12,rootMargin:"0px 0px -6% 0px"});
$$(".rv").forEach(el=>rvIO.observe(el));
$$(".shead").forEach(el=>{ el.classList.add("rv"); rvIO.observe(el); });

/* ---------- Copy + Agent view ---------- */
document.addEventListener("click",e=>{ const b=e.target.closest("[data-copy]"); if(!b) return; const v=b.dataset.copy;
  try{ navigator.clipboard.writeText(v).then(()=>say("Copied"),()=>say("Select the text to copy it")); }catch(err){ say("Select the text to copy it"); } });
function toMarkdown(){
  return ["# Rohit Kumawat","Product designer and product manager in Delhi.","","## Work",...PROJECTS.map(p=>`- **${p.n}** · ${p.type} · ${p.client} · ${p.yr}`),"",
   "## Experience",...JOURNEY.map(j=>`- ${j.role}, ${j.co}, ${j.loc} (${j.y})`),"",
   "## Experiments","- Snake: https://dotsgame-owcu.vercel.app","- Nokia Cricket: https://cricketbyroku.vercel.app","- Security Vault","","## Off the clock","Old retro games, plus FIFA, Subway Surfers and Mahjong. FIFA ID: 484556561329106944, send a friend request for a head-to-head match.","",
   "## Tools",TOOLS.join(", "),"","## Contact",`- Email: ${EMAIL}`,`- LinkedIn: ${LINKEDIN}`,`- GitHub: ${GITHUB}`].join("\n");
}
$("#agentBtn").addEventListener("click",()=>{ $("#md").textContent=toMarkdown(); $("#agent").hidden=false; $("#agentClose").focus(); });
$("#agentClose").addEventListener("click",()=>{ $("#agent").hidden=true; $("#agentBtn").focus(); });
$("#mdCopy").addEventListener("click",()=>{ try{ navigator.clipboard.writeText($("#md").textContent).then(()=>say("Markdown copied"),()=>say("Select the text to copy it")); }catch(e){ say("Select the text to copy it"); } });
document.addEventListener("keydown",e=>{ if(e.key==="Escape"&&!$("#agent").hidden) $("#agentClose").click(); });

$("#allN").textContent=`All ${PROJECTS.length} projects`;
route(); setCondensed();
/* ---------- Designer cursor ---------- */
(function(){
  const fine=matchMedia("(hover:hover) and (pointer:fine)");
  const wrap=$("#cursor"), dot=wrap.querySelector(".cursor-dot"), circle=wrap.querySelector(".cursor-circle"), label=wrap.querySelector(".cursor-label");
  label.innerHTML="<span></span>"; const lt=label.firstChild;
  let mx=-100, my=-100, cx=-100, cy=-100, raf=0, on=false;
  const VIEW=".art-c[data-i],[data-open],.post";
  const GO="a[href],button,[role=button],label[for],summary,.press";
  const TEXT="input:not([type=button]):not([type=submit]):not([type=checkbox]):not([type=radio]),textarea,select,[contenteditable]";
  function loop(){
    cx+=(mx-cx)*.12; cy+=(my-cy)*.12;
    if(Math.abs(mx-cx)<.1&&Math.abs(my-cy)<.1){ cx=mx; cy=my; raf=0; } else raf=requestAnimationFrame(loop);
    const t=`translate3d(${cx}px,${cy}px,0)`; circle.style.transform=t; label.style.transform=t;
  }
  function move(e){
    if(e.pointerType&&e.pointerType!=="mouse") return;
    mx=e.clientX; my=e.clientY; dot.style.transform=`translate3d(${mx}px,${my}px,0)`;
    if(!on){ on=true; cx=mx; cy=my; wrap.classList.add("on"); }
    if(!raf) raf=requestAnimationFrame(loop);
  }
  function over(e){
    const t=e.target instanceof Element?e.target:null; if(!t) return;
    if(t.closest(TEXT)){ wrap.classList.add("text"); wrap.classList.remove("active"); return; }
    wrap.classList.remove("text");
    const v=t.closest(VIEW), g=!v&&t.closest(GO);
    const tag=v?"View":g?"Go":"";
    wrap.classList.toggle("active",!!tag); if(tag) lt.textContent=tag;
  }
  function set(){
    const yes=fine.matches; document.documentElement.classList.toggle("cur-on",yes);
    if(!yes){ wrap.classList.remove("on","active"); on=false; }
  }
  set(); fine.addEventListener?.("change",set);
  addEventListener("pointermove",move,{passive:true});
  addEventListener("pointerover",over,{passive:true});
  addEventListener("pointerdown",()=>wrap.classList.add("down"),{passive:true});
  addEventListener("pointerup",()=>wrap.classList.remove("down"),{passive:true});
  document.addEventListener("pointerleave",()=>{ wrap.classList.remove("on"); on=false; });
  document.documentElement.addEventListener("mouseleave",()=>{ wrap.classList.remove("on"); on=false; });
  addEventListener("blur",()=>{ wrap.classList.remove("on"); on=false; });
})();
</script>
</body>
</html>
