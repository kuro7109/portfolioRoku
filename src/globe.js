
/* ---------- Skills network: a revolving 3D graph ----------
   Five hubs on a sphere, each linked to the tools and methods behind it.
   It turns at a constant angular velocity; dragging spins it, and after
   letting go it eases back to the steady turn. Labels and lines fade
   with depth so the back of the globe reads as further away. */
(function(){
  const wrap=$("#net"), cv=$("#netCv"); if(!cv) return;
  const ctx=cv.getContext("2d");
  const HUBS=[
    ["Product Design",["Figma","User Flows","Wireframing","Prototyping","Design Systems","Micro-Interactions","Interaction Design"]],
    ["Product Management",["Roadmaps","GTM Planning","PRDs","Prioritisation","Notion","Product Thinking","Metrics & KPIs"]],
    ["Branding & Visual",["Illustrator","Photoshop","Affinity","Canva","Logo Design","Typography","Visual Identity"]],
    ["Research & Strategy",["User Interviews","Usability Testing","Competitive Analysis","Case Competitions","Personas"]],
    ["AI & Build",["Claude","Supabase","n8n","Framer","HTML/CSS","Agentic Workflows","Prompt Design"]]
  ];
  // a few links across hubs, so the graph reads as one system
  const CROSS=[["Figma","Branding & Visual"],["Framer","Product Design"],["Notion","Research & Strategy"],["Claude","Product Management"],["Usability Testing","Product Design"],["Prototyping","AI & Build"],["Typography","Product Design"],["Metrics & KPIs","Research & Strategy"],["Agentic Workflows","Product Management"]];
  // deterministic random so the layout is the same every visit
  let seed=7; const rnd=()=>(seed=(seed*16807)%2147483647)/2147483647;
  const norm=v=>{ const l=Math.hypot(...v)||1; return v.map(x=>x/l); };
  const nodes=[], edges=[];
  // hubs spaced evenly around the turning axis, alternating above and below the equator
  const hubDirs=HUBS.map((_,k)=>{ const lon=k*2*Math.PI/HUBS.length, lat=(k%2?-1:1)*.42; return [Math.cos(lat)*Math.sin(lon),Math.sin(lat),Math.cos(lat)*Math.cos(lon)]; });
  const cross=(a,b)=>[a[1]*b[2]-a[2]*b[1],a[2]*b[0]-a[0]*b[2],a[0]*b[1]-a[1]*b[0]];
  HUBS.forEach(([name,leaves],h)=>{
    const d=hubDirs[h], hi=nodes.push({n:name,hub:true,p:d.map(x=>x*.66)})-1;
    const u=norm(cross(d,[0,1,0])), v=norm(cross(d,u));
    // leaves fan out on a ring around their hub so labels don't pile up
    leaves.forEach((l,k)=>{
      const phi=k*2*Math.PI/leaves.length+(rnd()-.5)*.5, th=.5+rnd()*.32;
      const q=norm(d.map((x,i)=>x*Math.cos(th)+(u[i]*Math.cos(phi)+v[i]*Math.sin(phi))*Math.sin(th)));
      const li=nodes.push({n:l,hub:false,p:q.map(x=>x*(.96+rnd()*.08))})-1;
      edges.push([hi,li]);
    });
  });
  const idx=n=>nodes.findIndex(x=>x.n===n);
  for(let a=0;a<HUBS.length;a++) for(let b=a+1;b<HUBS.length;b++) edges.push([idx(HUBS[a][0]),idx(HUBS[b][0])]);
  CROSS.forEach(([l,h])=>edges.push([idx(h),idx(l)]));
  const stars=Array.from({length:110},()=>({x:rnd(),y:rnd(),r:rnd()*1.1+.3,z:rnd()}));

  let W=0,H=0,dpr=1,R=200,raf=0,last=0,vis=false,fs=1,small=false;
  const W0=.22;                 // steady angular velocity (rad/s)
  let ay=0, ax=-.32, vy=W0, vx=0, drag=null, hover=-1, mx=-1e4, my=-1e4;
  function size(){ const r=wrap.getBoundingClientRect(); if(!r.width) return; dpr=Math.min(2,devicePixelRatio||1); W=r.width; H=r.height;
    cv.width=W*dpr; cv.height=H*dpr; ctx.setTransform(dpr,0,0,dpr,0,0); small=W<600; fs=small?.78:1; R=Math.min(W*(small?.43:.36),H*.42); }
  const P=[]; // projected points
  function project(){
    const cy=Math.cos(ay), sy=Math.sin(ay), cx=Math.cos(ax), sx=Math.sin(ax), F=3.2;
    nodes.forEach((nd,i)=>{ let [x,y,z]=nd.p; let x1=x*cy+z*sy, z1=-x*sy+z*cy; let y1=y*cx-z1*sx, z2=y*sx+z1*cx;
      const s=F/(F-z2); P[i]={x:W/2+x1*R*s, y:H/2+y1*R*s, z:z2, s}; });
  }
  const depth=z=>(z+1)/2; // 0 back … 1 front
  function draw(t){
    const dark=isDark(), ink=dark?"250,250,250":"10,10,10";
    ctx.clearRect(0,0,W,H);
    for(const st of stars){ const x=((st.x*W-ay*12*st.z)%W+W)%W; ctx.fillStyle=`rgba(${ink},${.12+.25*st.z})`; ctx.beginPath(); ctx.arc(x,st.y*H,st.r,0,7); ctx.fill(); }
    project();
    const lit=new Set(); if(hover>-1){ lit.add(hover); edges.forEach(([a,b])=>{ if(a===hover) lit.add(b); if(b===hover) lit.add(a); }); }
    ctx.lineWidth=1;
    for(const [a,b] of edges){ const A=P[a], B=P[b], d=(depth(A.z)+depth(B.z))/2, on=hover>-1&&(a===hover||b===hover);
      const al=hover>-1?(on?.85:.05):(.06+.32*d);
      // bow each line outward a little so it follows the globe
      const mx2=(A.x+B.x)/2, my2=(A.y+B.y)/2, ox=mx2-W/2, oy=my2-H/2, k=.12;
      ctx.strokeStyle=`rgba(${ink},${al})`; ctx.beginPath(); ctx.moveTo(A.x,A.y); ctx.quadraticCurveTo(mx2+ox*k,my2+oy*k,B.x,B.y); ctx.stroke(); }
    const order=nodes.map((_,i)=>i).sort((i,j)=>P[i].z-P[j].z);
    for(const i of order){ const nd=nodes[i], p=P[i], d=depth(p.z), dim=hover>-1&&!lit.has(i);
      const al=dim?.12:(.25+.75*d), r=(nd.hub?5.5:3)*p.s;
      ctx.fillStyle=`rgba(${ink},${al})`; ctx.beginPath(); ctx.arc(p.x,p.y,r,0,7); ctx.fill();
      if(nd.hub){ ctx.strokeStyle=`rgba(${ink},${al*.35})`; ctx.beginPath(); ctx.arc(p.x,p.y,r+5,0,7); ctx.stroke(); }
      const la=dim?.1:(nd.hub?.35+.65*d:(small&&d<.55?0:.12+.7*d*d));
      if(la>.06){ ctx.fillStyle=`rgba(${ink},${la})`; ctx.font=nd.hub?`600 ${Math.round(15*p.s*fs)}px "TikTok Sans",system-ui,sans-serif`:`${Math.round(12*p.s*fs)}px "TikTok Sans",system-ui,sans-serif`;
        ctx.textAlign="center"; ctx.textBaseline="top"; ctx.fillText(nd.n,p.x,p.y+r+(nd.hub?8:5)); }
    }
  }
  function pick(){ let best=-1,bd=18; P.forEach((p,i)=>{ const d=Math.hypot(p.x-mx,p.y-my); if(d<bd&&p.z>-.2){ bd=d; best=i; } }); return best; }
  function frame(t){
    raf=0; if(!vis||current!=="home"||document.hidden) return;
    raf=requestAnimationFrame(frame);
    const dt=Math.min(.05,last?(t-last)/1000:.016); last=t;
    if(!drag){ vy+=(W0-vy)*Math.min(1,dt*1.6); vx*=Math.pow(.02,dt); ay+=vy*dt; ax=clamp(ax+vx*dt,-1.1,.9); ax+=(-.32-ax)*dt*.6; }
    const h=pick(); if(h!==hover){ hover=h; cv.style.cursor=h>-1?"pointer":""; }
    draw(t);
  }
  const start=()=>{ if(!raf&&!reduce){ last=0; raf=requestAnimationFrame(frame); } };
  wrap.addEventListener("pointerdown",e=>{ drag={x:e.clientX,y:e.clientY,t:performance.now()}; wrap.classList.add("drag"); wrap.setPointerCapture(e.pointerId); vy=0; vx=0; });
  wrap.addEventListener("pointermove",e=>{ const r=cv.getBoundingClientRect(); mx=e.clientX-r.left; my=e.clientY-r.top;
    if(!drag) return; const now=performance.now(), dt=Math.max(8,now-drag.t)/1000, dx=e.clientX-drag.x, dy=e.clientY-drag.y;
    ay+=dx*.006; ax=clamp(ax+dy*.004,-1.1,.9); vy=dx*.006/dt; vx=dy*.004/dt; drag={x:e.clientX,y:e.clientY,t:now};
    if(reduce){ draw(0); } });
  const end=()=>{ if(!drag) return; drag=null; wrap.classList.remove("drag"); vy=clamp(vy,-4,4); vx=clamp(vx,-2,2); };
  wrap.addEventListener("pointerup",end); wrap.addEventListener("pointercancel",end);
  wrap.addEventListener("pointerleave",()=>{ mx=my=-1e4; });
  new IntersectionObserver(es=>{ vis=es[0].isIntersecting; if(vis){ if(!W) size(); start(); } }).observe(wrap);
  addEventListener("resize",()=>{ size(); if(reduce) draw(0); });
  addEventListener("hashchange",()=>setTimeout(()=>{ if(current==="home"){ size(); start(); } },300));
  size(); if(reduce){ project(); draw(0); }
})();
