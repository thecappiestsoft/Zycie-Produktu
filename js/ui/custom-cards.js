/* Dodawanie własnych kart, zmiana języka */
"use strict";
/* ---------- Własne karty ---------- */
function val(id){const el=document.getElementById(id);return el?el.value.trim():"";}
function num(id,max){let v=parseInt(val(id),10);if(isNaN(v))v=0;return Math.min(max,Math.max(0,v));}
function addCard(){
  const m=document.getElementById("cMsg");
  const name=val("cName"), q=val("cQ"), a=[0,1,2,3].map(i=>val("cA"+i)), src=val("cSrc");
  if(!name||!q||a.some(x=>!x)||!src){ m.className="msg err"; m.textContent=tr("Uzupełnij nazwę, pytanie, cztery odpowiedzi i źródło.","Fill in the name, the question, all four answers and the source."); return; }
  const score=[0,1,2,3,4].filter(i=>document.getElementById("cChk"+i).checked).length;
  const fact=val("cFact");
  const dflt=tr("Dane przygotowali uczniowie.","Data prepared by students.");
  const c={ id:"c"+Date.now().toString(36), custom:true, name, material:val("cMat")||tr("materiał","material"), sym:(val("cMat")||name).slice(0,2), symSub:tr("karta uczniów","student card"),
    E:num("cE",12),P:num("cP",12),R:num("cR",12),TL:num("cTL",12),TI:num("cTI",12),U:num("cU",12),L:num("cL",12),N:num("cN",12),
    I: val("cI")===""?null:num("cI",12),
    repairMax:num("cRepMax",4), repairLabel:tr("Naprawa","Repair"), repairCost:1, selfRepair:false, second:document.getElementById("cSecond").checked,
    recycleMax:num("cRecMax",9), deposit:document.getElementById("cDep").checked, localCost:2, bin:val("cBin")||"black",
    binWhy:fact||tr("Pojemnik wybrali autorzy karty.","The bin was chosen by the card's authors."),
    factProd:fact||dflt, factRec:fact||dflt, real:tr("Źródło: ","Source: ")+src, srcScore:score,
    quiz:[{q, a, why:fact||tr("Odpowiedź przygotowali uczniowie.","Answer prepared by students.")}] };
  custom.push(c); save(K_CARDS,custom); setup.msg=""; render();
  const d=document.querySelector("details.custom"); if(d) d.open=true;
  const m2=document.getElementById("cMsg"); if(m2){m2.className="msg ok"; m2.textContent=tr(`Zapisano kartę „${name}”.`,`Saved the card “${name}”.`)+(score<3?tr(" Źródło spełnia mniej niż 3 kryteria: poszukajcie drugiego, by sprawdzić dane."," The source meets fewer than 3 criteria: find a second one to check the data."):"");}
}
function normCustom(c){
  return Object.assign({I:null,selfRepair:false,second:false,bin:"black",binWhy:"",repairLabel:tr("Naprawa","Repair"),repairCost:1,localCost:2,N:1,repairMax:0,recycleMax:1,srcScore:0,material:tr("materiał","material"),sym:String(c.name||"").slice(0,2),symSub:tr("karta uczniów","student card")},c,{id:"c"+Math.random().toString(36).slice(2,9),custom:true});
}
function syncNames(){ setup.players.forEach((p,i)=>{const el=document.getElementById("pname"+i); if(el) p.name=el.value;}); }
function setLang(l){
  if(l===lang) return;
  const from=lang;
  if(!S){ syncNames(); setup.players.forEach(p=>{ p.name=swapDefaultName(p.name,from,l); }); setup.msg=""; }
  lang=l; try{localStorage.setItem("zp-lang",l)}catch(e){}
  const openDetails = !!document.querySelector("details.custom[open]");
  render();
  if(openDetails){ const d=document.querySelector("details.custom"); if(d) d.open=true; }
  if(dlg.open && dlgKind) openDlg(dlgKind);
}

