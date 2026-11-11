<script>
"use strict";
const EMAIL="rohitkumawat7109@gmail.com";
const GMAIL="https://mail.google.com/mail/?view=cm&fs=1&to="+EMAIL, LINKEDIN="https://www.linkedin.com/in/rohitkumawat7109/", GITHUB="https://github.com/kuro7109";
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
 {id:"socius",live:"https://socius-ecru.vercel.app/#land",n:"Socius",type:"Product Design / xyz",f:["product","uiux"],yr:"xyz",client:"xyz",tl:"xyz",c:["#f43f5e","#c084fc","#1c0f1f"],d:"xyz: a one-line summary of Socius, the problem it solves and who it is for."},
 {id:"gutly",live:"https://gutlybyrohitkumawat.vercel.app",n:"Gutly",type:"Product Design / Interaction Design",f:["product","uiux"],yr:"2026",client:"Self-initiated",tl:"23–25 Jan 2026",c:["#34d399","#a7f3d0","#0f2e22"],d:"An AI app that lets people log meals and digestive symptoms to surface gut-health patterns and personal insights. The work focused on user journeys and taking the friction out of food logging."},
 {id:"inlens",live:"https://inlensbyrohitkumawat-tan.vercel.app/#welcome",n:"InLens",type:"AI Product / Product Design",f:["product","uiux"],yr:"2026",client:"Self-initiated",tl:"Jan – Feb 2026",c:["#3b82f6","#93c5fd","#0b1630"],d:"An agentic AI platform for user research that takes on the busywork, from reaching participants to transcribing and summarising interviews. Built with n8n, OpenAI GPT, Whisper and the Outlook API."},
 {id:"alba",n:"Alba & Notte",type:"Branding / UI & UX Design",f:["brand","uiux"],yr:"2025",client:"Design Club IITD",tl:"23–24 Dec 2025",c:["#fbbf24","#6d5bd0","#1a1530"],d:"A café by day and a bar by night on Spinola Bay, Malta, mixing Mediterranean culture with Indian influences. Custom type and time-based storytelling serve locals and travellers alike."},
 {id:"workbench",live:"https://roku7109.vercel.app/#login",n:"HiLabs Case Workbench",type:"Product Management / UX Design",f:["product","uiux"],yr:"2026",client:"HiLabs",tl:"xyz",c:["#f59e0b","#60a5fa","#0f172a"],d:"A case management workbench MVP for HiLabs: one place for care teams to triage, track and close patient cases, backed by a slide deck and a five-patient synthetic data annex."},
 {id:"spotify",n:"Spotify Redesign",type:"Brand Strategy / UI & UX Design",f:["uiux"],yr:"2024",client:"Self-initiated",tl:"3–7 Sep 2024",c:["#1ed760","#f59e0b","#0b1a10"],d:"A self-initiated Spotify concept with bold colour, motion and interactive pieces that make music discovery more playful, personal and immersive."},
 {id:"specter",n:"Specter",type:"Brand Strategy / UI & UX Design",f:["brand","uiux"],yr:"2025",client:"Design Club IITD",tl:"15–19 Mar 2025",c:["#a78bfa","#f472b6","#1b1030"],d:"A concept cognitive platform that uses AI and a neural interface to help people revisit memories and explore possible futures through personal, multisensory experiences."},
 {id:"genme",n:"Genme",type:"Corporate Branding / Web Design",f:["brand","web"],yr:"2025",client:"Genme",tl:"12 Aug – 22 Sep 2025",c:["#6366f1","#a5b4fc","#141a3d"],d:"A modern, scalable logo for Genme's digital presence, refining typography, symbol forms and a minimal structure into a mark that adapts everywhere it appears."},
 {id:"tickai",n:"TickAI",type:"Logo Design / Brand Strategy",f:["brand","web","uiux"],yr:"2025",client:"Krishna Goel",tl:"28 Oct – 10 Nov 2025",c:["#adfa1d","#22d3ee","#0d1f12"],d:"Branding and website for TickAI, an AI education platform: a scalable logo and clear layouts that keep the brand consistent and trustworthy across every touchpoint."},
 {id:"caricatures",n:"Caricatures",type:"Illustration / Caricature",f:["illus"],yr:"Series",client:"Multiple",tl:"Multiple",c:["#fb7185","#fde68a","#2a1216"],d:"A caricature series that turns real facial traits into bold, playful and still recognisable portraits, drawn by hand and refined digitally."},
 {id:"digital",n:"Digital Arts",type:"Digital Arts / Illustrations",f:["illus"],yr:"Series",client:"Self-initiated",tl:"Multiple",c:["#38bdf8","#f97316","#0c1a26"],d:"Stylised digital illustrations, from Shakespeare to animal studies, that reinterpret familiar subjects through exaggeration and graphic simplicity."}
];
const FILTERS=[["all","All","all"],["product","Product","mobile"],["uiux","UI & UX","cursor"],["brand","Branding","spark"],["web","Web","globe"],["illus","Illustration","brush"]];
const JOURNEY=[
 {role:"Product Management Intern",focus:"Product & GTM Planning",co:"Evvolv.ai",loc:"New Delhi",dt:"May – Jul 2026",y:"2026"},
 {role:"Product Design Intern",focus:"User Interface & User Experience",co:"Aspora",loc:"Bengaluru",dt:"May – Jun 2025",y:"2025"},
 {role:"Vice President, Advisory Panel Member",focus:"Design community and club projects",co:"Design Club IITD",loc:"New Delhi",dt:"xyz – present",y:"xyz"}
];
const HONOURS=[
 {t:"Quality Redesign",org:"IFQM",res:"Result xyz",y:"Sep '26"},
 {t:"ProdPro",org:"BML Munjal University",res:"Result xyz",y:"Sep '26"},
 {t:"Udaan 9.0",org:"IIM Kashipur",res:"Result xyz",y:"Jan '26"},
 {t:"ConsultSchool 4.0",org:"IIT Madras",res:"Result xyz",y:"Jan '26"}
];
const TOOLS=["Figma","Framer","Illustrator","Photoshop","Affinity","Canva","Claude","Notion"];
const LOGOS={"Figma":"<svg viewBox=\"0 0 256 384\" aria-hidden=\"true\"><path fill=\"#0acf83\" d=\"M64 384c35.328 0 64-28.672 64-64v-64H64c-35.328 0-64 28.672-64 64s28.672 64 64 64\"/><path fill=\"#a259ff\" d=\"M0 192c0-35.328 28.672-64 64-64h64v128H64c-35.328 0-64-28.672-64-64\"/><path fill=\"#f24e1e\" d=\"M0 64C0 28.672 28.672 0 64 0h64v128H64C28.672 128 0 99.328 0 64\"/><path fill=\"#ff7262\" d=\"M128 0h64c35.328 0 64 28.672 64 64s-28.672 64-64 64h-64z\"/><path fill=\"#1abcfe\" d=\"M256 192c0 35.328-28.672 64-64 64s-64-28.672-64-64s28.672-64 64-64s64 28.672 64 64\"/></svg>","Framer":"<svg viewBox=\"0 0 256 384\" aria-hidden=\"true\"><path d=\"M0 0h256v128H128zm0 128h128l128 128H128v128L0 256z\"/></svg>","Illustrator":"<svg viewBox=\"0 0 256 250\" aria-hidden=\"true\"><rect width=\"256\" height=\"249.6\" fill=\"#300\" rx=\"42.5\"/><path fill=\"#ff9a00\" d=\"M124.054 149.79h-39.67l-8.072 25.073a2.02 2.02 0 0 1-2.061 1.546H54.158q-1.718 0-1.202-1.89l34.347-98.918q.515-1.545 1.03-3.52c.45-2.292.68-4.62.687-6.955a1.063 1.063 0 0 1 1.202-1.203h27.306q1.2 0 1.374.86l38.983 109.908q.515 1.72-1.03 1.718h-22.326a1.59 1.59 0 0 1-1.717-1.202zm-33.488-21.638H117.7l-.387-1.277l-.621-2.022l-.443-1.42l-.707-2.236l-1.503-4.707l-1.322-4.173l-3.433-10.87a334 334 0 0 1-2.46-8.138l-.628-2.21l-.734-2.613l-1.12-4.05l-.21-.763h-.171a139 139 0 0 1-3.136 12.23l-2.548 8.196l-1.402 4.528l-1.415 4.584q-.383 1.242-.765 2.456l-.76 2.398l-.756 2.342l-.752 2.284l-.748 2.227q-.372 1.1-.743 2.17zm90.501-46.025a12.46 12.46 0 0 1-9.445-3.778a13.6 13.6 0 0 1-3.607-9.789a12.6 12.6 0 0 1 3.864-9.53a13.27 13.27 0 0 1 9.165-3.697l.366.004q6.183 0 9.704 3.692a13.26 13.26 0 0 1 3.52 9.531a13.4 13.4 0 0 1-3.692 9.79a13.18 13.18 0 0 1-9.508 3.79zm-11.85 92.564V92.603q-.001-1.546 1.374-1.546h21.124q1.373 0 1.374 1.546v82.088q0 1.72-1.374 1.718h-20.952q-1.464 0-1.541-1.542z\"/></svg>","Photoshop":"<svg viewBox=\"0 0 256 250\" aria-hidden=\"true\"><rect width=\"256\" height=\"249.6\" fill=\"#001e36\" rx=\"42.5\"/><path fill=\"#31a8ff\" d=\"M57.644 175.035V65.297q0-1.201 1.031-1.202l1.087-.003l1.858-.02l2.582-.051l8.65-.183l9.275-.172q4.893-.085 9.702-.086q13.05 0 21.982 3.263a38.1 38.1 0 0 1 14.34 8.758a33.6 33.6 0 0 1 7.814 12.108a40.2 40.2 0 0 1 2.405 13.824q0 13.741-6.355 22.669a35.9 35.9 0 0 1-16.6 12.756l-.573.21c-6.973 2.601-14.695 3.541-23.164 3.6l-1.316.004l-1.953-.01l-.985-.014l-1.098-.026l-.662-.026l-.402-.021l-.989-.036l-1.209-.025l-1.82-.013l-.405-.001v34.263a1.366 1.366 0 0 1-1.546 1.546H58.847q-1.204.001-1.203-1.374M80.84 84.703v35.792q2.23.173 4.12.172h5.668a40.3 40.3 0 0 0 11.533-1.727l.746-.233a18.5 18.5 0 0 0 8.759-5.668q3.228-3.807 3.344-10.492l.005-.499c.09-3.322-.774-6.6-2.491-9.445a16 16 0 0 0-7.47-6.097a31.8 31.8 0 0 0-12.537-2.146l-2.178.006l-1.374.012l-1.311.017l-1.85.036l-1.35.038l-.701.026l-.937.044l-.798.049l-.455.036l-.393.038l-.173.02zm123.93 29.284a40.2 40.2 0 0 0-9.458-3.442l-.76-.164a54.3 54.3 0 0 0-11.009-1.363l-.926-.011a22.2 22.2 0 0 0-6.44.773a5.8 5.8 0 0 0-3.35 2.146a5.4 5.4 0 0 0-.858 2.92a4.56 4.56 0 0 0 1.03 2.747a11.7 11.7 0 0 0 3.235 2.637l.372.197a72 72 0 0 0 7.556 3.52a75 75 0 0 1 16.4 7.814a24.94 24.94 0 0 1 8.416 8.845a23.6 23.6 0 0 1 2.49 10.99a24.7 24.7 0 0 1-4.122 14.169a27.1 27.1 0 0 1-11.936 9.53q-7.556 3.32-18.557 3.432l-.762.004a70 70 0 0 1-13.556-1.188l-.956-.186a46.3 46.3 0 0 1-10.905-3.435a2.22 2.22 0 0 1-1.202-1.89v-18.718a1.01 1.01 0 0 1 .43-.945a.83.83 0 0 1 .944.086a45.9 45.9 0 0 0 13.223 5.238a54.5 54.5 0 0 0 12.537 1.632q6.009 0 8.844-1.546a4.86 4.86 0 0 0 2.834-4.465q0-2.23-2.576-4.293q-1.08-.864-3.097-1.88l-.643-.316l-.686-.323l-.36-.164l-.754-.334l-.393-.17l-.82-.344l-.427-.175l-.886-.355l-.46-.18l-.953-.367l-.997-.373a63 63 0 0 1-15.199-7.728a26.2 26.2 0 0 1-8.071-9.016a23.7 23.7 0 0 1-2.49-10.905a24.6 24.6 0 0 1 3.606-12.88c2.7-4.27 6.576-7.67 11.163-9.788q7.555-3.776 18.89-3.779a83.6 83.6 0 0 1 13.224.945a34.7 34.7 0 0 1 9.206 2.49c.473.136.854.485 1.03.945c.117.419.174.852.172 1.288v17.345c.025.41-.172.803-.515 1.03a1.66 1.66 0 0 1-1.478 0\"/></svg>","Affinity":"<svg viewBox=\"0 0 24 24\" aria-hidden=\"true\"><path fill=\"#1B72BE\" d=\"M24 2.344v19.312A2.345 2.345 0 0 1 21.656 24H2.344A2.345 2.345 0 0 1 0 21.656V2.344A2.345 2.345 0 0 1 2.344 0h19.312A2.345 2.345 0 0 1 24 2.344M1.758 21.305c0 .517.42.937.938.937h8.226l-4.299-7.445l7.528-13.039h-3.482L1.758 17.192zm11.418-6.866l-2.712-4.698l-1.761 3.051a1.098 1.098 0 0 0 .952 1.647zm9.066 6.873v-6.075H7.799l4.044 7.005h9.462a.937.937 0 0 0 .937-.93m-.937-19.554h-6.232l-4.148 7.185l3.173 5.496h8.144V2.688a.937.937 0 0 0-.937-.93\"/></svg>","Canva":"<svg viewBox=\"0 0 24 24\" aria-hidden=\"true\"><path fill=\"#00C4CC\" d=\"M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12s12-5.373 12-12S18.627 0 12 0M6.962 7.68c.754 0 1.337.549 1.405 1.2c.069.583-.171 1.097-.822 1.406c-.343.171-.48.172-.549.069c-.034-.069 0-.137.069-.206c.617-.514.617-.926.548-1.508c-.034-.378-.308-.618-.583-.618c-1.2 0-2.914 2.674-2.674 4.629c.103.754.549 1.646 1.509 1.646c.308 0 .65-.103.96-.24c.5-.264.799-.47 1.097-.8c-.073-.885.704-2.046 1.851-2.046c.515 0 .926.205.96.583c.068.514-.377.582-.514.582s-.378-.034-.378-.17c-.034-.138.309-.07.275-.378c-.035-.206-.24-.274-.446-.274c-.72 0-1.131.994-1.029 1.611c.035.275.172.549.447.549c.205 0 .514-.31.617-.755c.068-.308.343-.514.583-.514c.102 0 .17.034.205.171v.138c-.034.137-.137.548-.102.651c0 .069.034.171.17.171c.092 0 .436-.18.777-.459c.117-.59.253-1.298.253-1.357c.034-.24.137-.48.617-.48c.103 0 .171.034.205.171v.138l-.136.617c.445-.583 1.097-.994 1.508-.994c.172 0 .309.102.309.274c0 .103 0 .274-.069.446c-.137.377-.309.96-.412 1.474c0 .137.035.274.207.274s.685-.206 1.096-.754l.007-.004c-.002-.068-.007-.134-.007-.202c0-.411.035-.754.104-.994c.068-.274.411-.514.617-.514c.103 0 .205.069.205.171c0 .035 0 .103-.034.137c-.137.446-.24.857-.24 1.269c0 .24.034.582.102.788c0 .034.035.069.07.069c.068 0 .548-.445.89-1.028c-.308-.206-.48-.549-.48-.96c0-.72.446-1.097.858-1.097c.343 0 .617.24.617.72c0 .308-.103.65-.274.96h.102a.77.77 0 0 0 .584-.24a.3.3 0 0 1 .134-.117c.335-.425.83-.74 1.41-.74c.48 0 .924.205.959.582c.068.515-.378.618-.515.618l-.002-.002c-.138 0-.377-.035-.377-.172s.309-.068.274-.376c-.034-.206-.24-.275-.446-.275c-.686 0-1.13.891-1.028 1.611c.034.275.171.583.445.583c.206 0 .515-.308.652-.754c.068-.274.343-.514.583-.514c.103 0 .17.034.205.171c0 .069 0 .206-.137.652c-.17.308-.171.48-.137.617c.034.274.171.48.309.583c.034.034.068.102.068.102c0 .069-.034.138-.137.138c-.034 0-.068 0-.103-.035c-.514-.205-.72-.548-.789-.891c-.205.24-.445.377-.72.377c-.445 0-.89-.411-.96-.926a1.6 1.6 0 0 1 .075-.649c-.203.13-.422.203-.623.203h-.17c-.447.652-.927 1.098-1.27 1.303a.9.9 0 0 1-.377.104c-.068 0-.171-.035-.205-.104c-.095-.152-.156-.392-.193-.667c-.481.527-1.145.805-1.453.805c-.343 0-.548-.206-.582-.55v-.376c.102-.754.377-1.2.377-1.337a.074.074 0 0 0-.069-.07c-.24 0-1.028.824-1.166 1.373l-.103.445c-.068.309-.377.515-.582.515c-.103 0-.172-.035-.206-.172v-.137l.046-.233c-.435.31-.87.508-1.075.508c-.308 0-.48-.172-.514-.412c-.206.274-.445.412-.754.412c-.352 0-.696-.24-.862-.593c-.244.275-.523.553-.852.764c-.48.309-1.028.549-1.68.549c-.582 0-1.097-.309-1.371-.583c-.412-.377-.651-.96-.686-1.509c-.205-1.68.823-3.84 2.4-4.8c.378-.205.755-.343 1.132-.343m9.77 3.291c-.104 0-.172.172-.172.343c0 .274.137.583.309.755a1.7 1.7 0 0 0 .102-.583c0-.343-.137-.515-.24-.515z\"/></svg>","Claude":"<svg viewBox=\"0 0 256 257\" aria-hidden=\"true\"><path fill=\"#d97757\" d=\"m50.228 170.321l50.357-28.257l.843-2.463l-.843-1.361h-2.462l-8.426-.518l-28.775-.778l-24.952-1.037l-24.175-1.296l-6.092-1.297L0 125.796l.583-3.759l5.12-3.434l7.324.648l16.202 1.101l24.304 1.685l17.629 1.037l26.118 2.722h4.148l.583-1.685l-1.426-1.037l-1.101-1.037l-25.147-17.045l-27.22-18.017l-14.258-10.37l-7.713-5.25l-3.888-4.925l-1.685-10.758l7-7.713l9.397.649l2.398.648l9.527 7.323l20.35 15.75L94.817 91.9l3.889 3.24l1.555-1.102l.195-.777l-1.75-2.917l-14.453-26.118l-15.425-26.572l-6.87-11.018l-1.814-6.61c-.648-2.723-1.102-4.991-1.102-7.778l7.972-10.823L71.42 0l10.63 1.426l4.472 3.888l6.61 15.101l10.694 23.786l16.591 32.34l4.861 9.592l2.592 8.879l.973 2.722h1.685v-1.556l1.36-18.211l2.528-22.36l2.463-28.776l.843-8.1l4.018-9.722l7.971-5.25l6.222 2.981l5.12 7.324l-.713 4.73l-3.046 19.768l-5.962 30.98l-3.889 20.739h2.268l2.593-2.593l10.499-13.934l17.628-22.036l7.778-8.749l9.073-9.657l5.833-4.601h11.018l8.1 12.055l-3.628 12.443l-11.342 14.388l-9.398 12.184l-13.48 18.147l-8.426 14.518l.778 1.166l2.01-.194l30.46-6.481l16.462-2.982l19.637-3.37l8.88 4.148l.971 4.213l-3.5 8.62l-20.998 5.184l-24.628 4.926l-36.682 8.685l-.454.324l.519.648l16.526 1.555l7.065.389h17.304l32.21 2.398l8.426 5.574l5.055 6.805l-.843 5.184l-12.962 6.611l-17.498-4.148l-40.83-9.721l-14-3.5h-1.944v1.167l11.666 11.406l21.387 19.314l26.767 24.887l1.36 6.157l-3.434 4.86l-3.63-.518l-23.526-17.693l-9.073-7.972l-20.545-17.304h-1.36v1.814l4.73 6.935l25.017 37.59l1.296 11.536l-1.814 3.76l-6.481 2.268l-7.13-1.297l-14.647-20.544l-15.1-23.138l-12.185-20.739l-1.49.843l-7.194 77.448l-3.37 3.953l-7.778 2.981l-6.48-4.925l-3.436-7.972l3.435-15.749l4.148-20.544l3.37-16.333l3.046-20.285l1.815-6.74l-.13-.454l-1.49.194l-15.295 20.999l-23.267 31.433l-18.406 19.702l-4.407 1.75l-7.648-3.954l.713-7.064l4.277-6.286l25.47-32.405l15.36-20.092l9.917-11.6l-.065-1.686h-.583L44.07 198.125l-12.055 1.555l-5.185-4.86l.648-7.972l2.463-2.593l20.35-13.999z\"/></svg>","Notion":"<svg viewBox=\"0 0 256 268\" aria-hidden=\"true\"><path fill=\"#fff\" d=\"M16.092 11.538L164.09.608c18.179-1.56 22.85-.508 34.28 7.801l47.243 33.282C253.406 47.414 256 48.975 256 55.207v182.527c0 11.439-4.155 18.205-18.696 19.24L65.44 267.378c-10.913.517-16.11-1.043-21.825-8.327L8.826 213.814C2.586 205.487 0 199.254 0 191.97V29.726c0-9.352 4.155-17.153 16.092-18.188\"/><path d=\"M164.09.608L16.092 11.538C4.155 12.573 0 20.374 0 29.726v162.245c0 7.284 2.585 13.516 8.826 21.843l34.789 45.237c5.715 7.284 10.912 8.844 21.825 8.327l171.864-10.404c14.532-1.035 18.696-7.801 18.696-19.24V55.207c0-5.911-2.336-7.614-9.21-12.66l-1.185-.856L198.37 8.409C186.94.1 182.27-.952 164.09.608M69.327 52.22c-14.033.945-17.216 1.159-25.186-5.323L23.876 30.778c-2.06-2.086-1.026-4.69 4.163-5.207l142.274-10.395c11.947-1.043 18.17 3.12 22.842 6.758l24.401 17.68c1.043.525 3.638 3.637.517 3.637L71.146 52.095zm-16.36 183.954V81.222c0-6.767 2.077-9.887 8.3-10.413L230.02 60.93c5.724-.517 8.31 3.12 8.31 9.879v153.917c0 6.767-1.044 12.49-10.387 13.008l-161.487 9.361c-9.343.517-13.489-2.594-13.489-10.921M212.377 89.53c1.034 4.681 0 9.362-4.681 9.897l-7.783 1.542v114.404c-6.758 3.637-12.981 5.715-18.18 5.715c-8.308 0-10.386-2.604-16.609-10.396l-50.898-80.079v77.476l16.1 3.646s0 9.362-12.989 9.362l-35.814 2.077c-1.043-2.086 0-7.284 3.63-8.318l9.351-2.595V109.823l-12.98-1.052c-1.044-4.68 1.55-11.439 8.826-11.965l38.426-2.585l52.958 81.113v-71.76l-13.498-1.552c-1.043-5.733 3.111-9.896 8.3-10.404z\"/></svg>"};
const SKILLS=[["Product design","Apps, flows, interaction"],["Product management","Roadmaps, GTM planning"],["Branding","Identity, logos, strategy"],["UI & UX","Interfaces, research, prototypes"],["Web design","Framer sites, landing pages"],["Illustration","Caricature, digital art"]];
const MARQ=[["Evvolv.ai","Ev"],["Aspora","As"],["IIT Delhi","IITD"],["Design Club","DC"],["GenMe","GM"],["TickAI","Ti"],["Rendezvous","Rv"]];
const ROLES=[["Product","Designer"],["Product","Manager"],["UI & UX","Designer"],["Brand","Designer"]];
const HIGHLIGHTS=[
 {h:"Hi, I'm Rohit",p:"A product designer and product manager based in Delhi.",c:[]},
 {h:"I design products and plan how they launch",p:"Interfaces and user experience at Aspora in Bengaluru, then product and go-to-market planning at Evvolv.ai in New Delhi.",c:["Aspora '25","Evvolv.ai '26"]},
 {h:"Product design and product management",p:"Apps like Gutly, identities for Genme and TickAI, and case competitions at IIM Kashipur, IIT Madras, IFQM and BML Munjal.",c:[`${PROJECTS.length} projects`,"4 competitions"]}
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
const cover=(p,label=true)=>`<div class="cov"><div class="g" style="background:${coverBg(p.c)}"></div><div class="gr"></div>${label?`<span class="tg">${esc(p.yr)}</span>`:""}<span class="nm">${esc(p.n)}</span></div>`;

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
