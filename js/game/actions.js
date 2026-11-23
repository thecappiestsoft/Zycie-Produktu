/* Akcje gracza: odpowiedź, wybór opcji, wydarzenie, segregacja, koniec tury */
"use strict";
/* ---------- Akcje ---------- */
function cur(){ const p=S.players[S.cur]; return [p, prodById(p.productId), S.tp]; }
function act_answer(a){
  const [p,pr,tp]=cur(); if(tp.sub!=="quiz") return;
  tp.answer=a; tp.quizOk=a===0; tp.sub="source";
  p.stats[tp.quizOk?"good":"bad"]++;
  persist(); render();
}
function finish(tp,stage,o,head,text,cls,extra){
  const [p]=cur();
  const n=addTok(p,stage,o.tokens+(extra||0));
  const m=money(p,o.money||0);
  tp.done=true;
  tp.result={n,money:m,head,text,cls};
  return n;
}
const low = s => s.charAt(0).toLowerCase()+s.slice(1);
function act_opt(id){
  const [p,pr,tp]=cur(); if(tp.done) return;
  const st=tp.stage;
  if(st==="E" && tp.sub==="source"){
    const o=sourceOptions(p,pr).find(x=>x.id===id); if(!o||o.disabled) return;
    const tb=titleBoth("E",p,id), ok=tp.quizOk, q=ok?-1:1;
    tp.steps=[[tb,o.tokens],[both(()=>ok?tr("Dobra odpowiedź","Right answer"):tr("Zła odpowiedź","Wrong answer")),q]];
    if(id==="cert") p.stats.green++; if(id==="cheap") p.stats.cheap++;
    const n=finish(tp,"E",o,both(()=>stName("E")),"",ok?"good":"",q);
    tp.next="P"; p.viaRecycling=false;
    logIt(both(()=>tr(`wydobycie: ${low(tb.pl)}, ${ok?"dobra":"zła"} odpowiedź (+${n})`,`extraction: ${low(tb.en)}, ${ok?"right":"wrong"} answer (+${n})`)));
  }
  else if(st==="P"){
    const o=prodOptions(p,pr).find(x=>x.id===id); if(!o||o.disabled) return;
    const tb=titleBoth("P",p,id), rec=p.viaRecycling, saved_=pr.P-pr.R;
    if(id==="green"||id==="eco") p.stats.green++; if(id==="fast") p.stats.cheap++;
    const addRep = id==="eco"&&o.eco.repair;
    if(addRep) p.repairBonus+=o.eco.repair;
    const text=both(()=>[(rec?tr(`Surowiec wtórny oszczędził ${saved_} żeton(y).`,`Secondary material saved ${saved_} token(s).`):""),(addRep?tr("+1 naprawa w zapasie.","+1 spare repair."):"")].filter(Boolean).join(" "));
    const n=finish(tp,"P",o,tb,text,id==="fast"?"bad":"good");
    tp.next="T";
    logIt(both(()=>tr(`produkcja: ${low(tb.pl)}${rec?" (recyklat)":""} (+${n})`,`production: ${low(tb.en)}${rec?" (recycled)":""} (+${n})`)));
    p.viaRecycling=false;
  }
  else if(st==="T"){
    const o=transOptions(p,pr).find(x=>x.id===id); if(!o||o.disabled) return;
    const tb=titleBoth("T",p,id);
    const best=Math.min(...transOptions(p,pr).map(x=>x.tokens));
    if(id==="truck"||id==="rail") p.freeLocal=false;
    if(id==="rail") p.stats.green++; if(id==="air") p.stats.cheap++;
    const text=both(()=>o.tokens>best?tr(`Najlżejsza opcja dałaby ${best}.`,`The lightest option would have given ${best}.`):tr("Najmniejszy ślad z dostępnych opcji.","The smallest footprint of the options available."));
    const n=finish(tp,"T",o,tb,text,o.tokens>best+1?"bad":"good");
    tp.next="U";
    logIt(both(()=>tr(`transport: ${low(tb.pl)} (+${n})`,`transport: ${low(tb.en)} (+${n})`)));
  }
  else if(st==="U" && tp.sub==="event"){
    const ev=evL(tp.ev);
    const o=eventOptions(p,pr,ev).find(x=>x.id===id); if(!o||o.disabled) return;
    const r=o.raw, i=+id;
    const evText=both(()=>{const e=evL(tp.ev); return `${q2(e.title)}: ${low(e.opts[i].l)}`;});
    p.uses+=1+(r.extraUse||0);
    if(r.rep) p.repairBonus+=r.rep;
    if(r.block) p.repairBlocked=true;
    if(r.freeLocal) p.freeLocal=true;
    if(r.freeRecycle) p.freeRecycle=true;
    let text=both(()=>r.extraUse?tr("Dodatkowe użycie!","An extra use!"):"");
    if(r.promo){ resetCopy(p); text=both(()=>tr("Nowy egzemplarz: liczysz ślad jego wydobycia i produkcji.","A new unit: you count the footprint of its extraction and production.")); }
    const uses=p.uses, min=S.settings.minUses;
    const n=finish(tp,"U",o,both(()=>tr(`Użycie ${uses}/${min}`,`Use ${uses}/${min}`)),text,(o.tokens>pr.U)?"bad":"good");
    if(r.promo){ p.breakdown.U-=pr.E+pr.P; p.breakdown.E+=pr.E; p.breakdown.P+=pr.P; }
    tp.next="K";
    logIt(both(()=>`${evText[lang]} (+${n})`));
  }
  else if(st==="K" && !tp.sub){
    const o=koOptions(p,pr).find(x=>x.id===id); if(!o||o.disabled) return;
    if(id==="recycle"||id==="finrec"){
      tp.sub="bin"; tp.pending=id;
      const others=shuffle(BIN_KEYS.filter(k=>k!==pr.bin)).slice(0,3);
      tp.binOrder=shuffle([pr.bin,...others]);
      persist(); render(); return;
    }
    const tb=titleBoth("K",p,id);
    let text="", cls="good";
    if(id==="repair"){ p.repairsUsed++; tp.next="U"; text=both(()=>tr("Produkt wraca do Użytkowania bez nowej produkcji.","The product goes back to Use with no new production.")); }
    if(id==="self"){
      const d=1+Math.floor(Math.random()*6); p.repairsUsed++;
      if(d>=3){ tp.next="U"; text=both(()=>tr("Produkt wraca do Użytkowania.","The product goes back to Use.")); }
      else { tp.next="K"; cls="bad"; text=both(()=>tr("Próba zużyła materiały i jedną naprawę z zapasu.","The attempt used up materials and one spare repair.")); }
      finish(tp,"K",o,tb,text,cls); tp.result.die=d;
      logIt(both(()=>tr(`samodzielna naprawa, kostka ${d}: ${d>=3?"sukces":"porażka"}`,`DIY repair, dice ${d}: ${d>=3?"success":"failure"}`)));
      persist(); render(); return;
    }
    if(id==="second"){ p.secondUsed=true; tp.next="T"; text=both(()=>tr("Produkt jedzie do nowego właściciela.","The product travels to its new owner.")); }
    if(id==="inc"){ resetCopy(p); p.recycleLoops=0; tp.next="E"; cls="bad"; text=both(()=>tr("Materiał spalony. Nowy egzemplarz zaczyna od Wydobycia.","Material burned. A new unit starts from Extraction.")); }
    if(id==="landfill"){ resetCopy(p); p.recycleLoops=0; tp.next="E"; cls="bad"; text=both(()=>tr("Minimum nie zostało spełnione. Nowy egzemplarz zaczyna od Wydobycia.","The minimum wasn't reached. A new unit starts from Extraction.")); }
    if(id==="finsecond"){ p.finalChoice="second"; tp.next="finish"; text=both(()=>tr("Twój produkt żyje dalej u kogoś innego. Koniec gry dla ciebie.","Your product lives on with someone else. The game is over for you.")); }
    if(id==="fininc"){ p.finalChoice="inc"; tp.next="finish"; cls="bad"; text=both(()=>tr("Twój produkt kończy grę w spalarni.","Your product ends the game in the incinerator.")); }
    if(id==="finland"){ p.finalChoice="land"; tp.next="finish"; cls="bad"; text=both(()=>tr("Twój produkt kończy grę na składowisku.","Your product ends the game in landfill.")); }
    const n=finish(tp,"K",o,tb,text,cls);
    logIt(both(()=>`${low(tb[lang])} (+${n})`));
  }
  persist(); render();
}
function act_drawevent(){
  const [p,pr,tp]=cur(); if(tp.sub!=="draw") return;
  const pool=EVENTS.filter(e=>e.for(pr) && e.id!==p.lastEvent);
  const ev=pool[Math.floor(Math.random()*pool.length)];
  p.lastEvent=ev.id; tp.ev=ev.id; tp.sub="event";
  persist(); render();
}
function act_bin(k){
  const [p,pr,tp]=cur(); if(tp.sub!=="bin"||tp.binAnswered) return;
  tp.binAnswered=true; tp.binAnswer=k;
  const ok=k===pr.bin; p.stats[ok?"good":"bad"]++;
  const o=koOptions(p,pr).find(x=>x.id===tp.pending);
  tp.steps=[[both(()=>tr("Zbiórka i sortowanie","Collection and sorting")),1],[both(()=>ok?tr("Dobry pojemnik","Right bin"):tr("Zły pojemnik: frakcja zanieczyszczona","Wrong bin: contaminated stream")),ok?-1:0]];
  if(p.freeRecycle){ p.freeRecycle=false; }
  let text;
  if(tp.pending==="recycle"){ p.recycleLoops++; p.viaRecycling=true; resetCopy(p); tp.next="P"; text=both(()=>tr("Skrót do Produkcji. Pomijasz Wydobycie i produkujesz z surowców wtórnych.","Shortcut to Production. You skip Extraction and produce from secondary materials.")); }
  else { p.finalChoice="rec"; tp.next="finish"; text=both(()=>tr("Obieg zamknięty. Twój produkt kończy grę.","Loop closed. Your product finishes the game.")); }
  const head=both(()=>ok?tr("Recykling, dobra segregacja","Recycling, sorted correctly"):tr("Recykling, błąd w segregacji","Recycling, sorting mistake"));
  const n=finish(tp,"K",o,head,text,ok?"good":"bad",ok?-1:0);
  tp.sub=null;
  logIt(both(()=>tr(`recykling, ${ok?"dobry":"zły"} pojemnik (+${n})`,`recycling, ${ok?"right":"wrong"} bin (+${n})`)));
  persist(); render();
}
function endTurn(){
  const [p,,tp]=cur(); if(!tp||!tp.done) return;
  if(tp.next==="finish") p.finished=true; else p.stage=tp.next;
  S.tp=null; S.turnNo++;
  const n=S.players.length; let found=-1;
  for(let k=1;k<=n;k++){ const j=(S.cur+k)%n; if(!S.players[j].finished){found=j;break;} }
  if(found<0){ S.phase="end"; persist(); render(); window.scrollTo({top:0}); return; }
  if(found<=S.cur){ S.round++; drawNews(); }
  S.cur=found; persist(); render();
  const h=document.querySelector(".turn"); if(h && window.innerWidth<920) h.scrollIntoView({block:"start"});
}

