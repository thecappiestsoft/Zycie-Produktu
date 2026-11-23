/* Stan gry, zapis w localStorage, helpery */
"use strict";
/* ===================== STAN ===================== */
const K_GAME="zp-game-v2", K_CARDS="zp-cards-v1";
function load(k){try{const v=localStorage.getItem(k);return v?JSON.parse(v):null}catch(e){return null}}
function save(k,v){try{localStorage.setItem(k,JSON.stringify(v))}catch(e){}}
function drop(k){try{localStorage.removeItem(k)}catch(e){}}

const DEF_NAMES = {pl:["Drużyna Boksyt","Drużyna Krzem","Drużyna Celuloza"], en:["Team Bauxite","Team Silicon","Team Cellulose"]};
let custom = load(K_CARDS) || [];
let setup = {players:DEF_NAMES[lang].map(n=>({name:n})), minUses:3, budgetOn:true, useCustom:true, newsOn:true, msg:""};
let S = null;
let saved = load(K_GAME);
const view = typeof document!=="undefined" ? document.getElementById("view") : null;

function swapDefaultName(n, from, to){
  const i=DEF_NAMES[from].indexOf(n); if(i>=0) return DEF_NAMES[to][i];
  const m=from==="pl"?n.match(/^Drużyna (\d)$/):n.match(/^Team (\d)$/);
  if(m) return (to==="pl"?"Drużyna ":"Team ")+m[1];
  return n;
}
function allProducts(){ return BASE_PRODUCTS.concat(setup.useCustom ? custom : []); }
function prodById(id){
  const base = BASE_PRODUCTS.find(p=>p.id===id);
  if(base){
    if(lang!=="en") return base;
    const en=PRODUCTS_EN[id];
    return Object.assign({},base,en,{src:Object.assign({},base.src,en.src),eco:Object.assign({},base.eco,en.eco)});
  }
  return (S && S.customSnap||[]).find(p=>p.id===id) || custom.find(p=>p.id===id);
}
const esc = s => String(s??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const shuffle = a => { a=a.slice(); for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]];} return a; };
const tok = n => `<span class="tokcount">${n}<span class="tok" aria-hidden="true">CO₂</span></span>`;
const coinTxt = n => tr(`${n} mon.`,`${n} ${Math.abs(n)===1?"coin":"coins"}`);
const linearPerUse = pr => pr.E+pr.P+pr.TI+pr.U+pr.L;
function persist(){ if(S) save(K_GAME,S); }
function news(){ return S && S.settings.newsOn ? (NEWS.find(n=>n.id===S.news)||NEWS[0]) : {}; }
function newsTxt(){ const t=NEWS_TXT[S.news]||NEWS_TXT.calm; return t[lang]; }
function nm(k){ return news()[k]||0; }
function B(){ return S.settings.budgetOn; }
function canPay(p,m,income){ return !B() || m>=0 || p.budget+(income||0) >= -m; }
function drawNews(){
  if(!S.settings.newsOn){ S.news="calm"; return; }
  const pool=NEWS.filter(n=>n.id!==S.news && (!n.budget||S.settings.budgetOn));
  S.news=pool[Math.floor(Math.random()*pool.length)].id;
}

