/* Przebieg tury i widok gry */
"use strict";
/* ---------- Tura ---------- */
function beginTurn(){
  const p=S.players[S.cur], pr=prodById(p.productId);
  S.tp={stage:p.stage, done:false, sub:null, steps:[]};
  if(p.stage==="E"){
    const n=pr.quiz.length; let idxs=[...Array(n).keys()].filter(i=>!p.asked.includes(i));
    if(!idxs.length){p.asked=[]; idxs=[...Array(n).keys()];}
    const qi=idxs[Math.floor(Math.random()*idxs.length)];
    p.asked.push(qi);
    S.tp.qi=qi; S.tp.order=shuffle([...Array(pr.quiz[qi].a.length).keys()]); S.tp.sub="quiz";
  }
  if(p.stage==="U") S.tp.sub="draw";
}
function addTok(p,stage,n){ n=Math.max(0,n); p.tokens+=n; p.breakdown[stage]+=n; return n; }
function money(p,d){ if(!B()) return 0; const b=p.budget; p.budget=Math.max(0,p.budget+d); return p.budget-b; }
function logIt(text){ S.log.unshift({t:S.turnNo, pi:S.cur, text}); if(S.log.length>40) S.log.pop(); }
function moneyTxt(d){ if(!S.settings.budgetOn||!d) return ""; return ` <span class="coin">${d>0?"+":""}${coinTxt(d)}</span>`; }
function resetCopy(p){ p.repairsUsed=0; p.repairBonus=0; p.repairBlocked=false; p.secondUsed=false; p.copies++; }

function choiceBtn(o){
  const m = B() && o.money ? `<span class="coin">${o.money>0?"+":""}${coinTxt(o.money)}</span>` : "";
  return `<button class="choice" type="button" data-act="opt" data-opt="${o.id}" ${o.disabled?"disabled":""}>
    <span class="cardtag">${tr("Karta decyzji","Decision card")}</span>
    <span class="ct">${esc(o.title)}</span><span class="cd">${esc(o.desc)}</span>
    <span class="cm">${tok("+"+o.tokens)} ${m}</span>
    ${o.disabled&&o.why?`<span class="why">${esc(o.why)}</span>`:""}
  </button>`;
}
function binQuestion(pr){
  const tp=S.tp, bins=BINS();
  return `<div class="cardtag">${tr("Pytanie o segregację","Sorting question")}</div><div class="quiz-q">${tr(`Gdzie wyrzucić produkt ${esc(q2(pr.name))}, żeby trafił do recyklingu?`,`Where will you put the ${esc(pr.name.toLowerCase())} so that it gets recycled? (Polish bin colours)`)}</div>
    <div class="answers">${tp.binOrder.map(k=>{
      let cls=""; if(tp.binAnswered){ if(k===pr.bin) cls="right"; else if(k===tp.binAnswer) cls="wrong"; }
      return `<button class="answer ${cls}" type="button" data-act="bin" data-k="${k}" ${tp.binAnswered?"disabled":""}>${esc(bins[k])}</button>`;}).join("")}</div>`;
}

function turnBody(p,pr){
  const tp=S.tp;
  let h=`<p class="stage-desc">${stDesc(tp.stage)}</p>`;
  if(tp.stage==="E"){
    const q=pr.quiz[tp.qi]||pr.quiz[0];
    h+=`<div class="cardtag">${tr("Pytanie chemiczne","Chemistry question")}${p.copies>1?tr(` · egzemplarz nr ${p.copies}`,` · unit no. ${p.copies}`):""}</div><div class="quiz-q">${esc(q.q)}</div><div class="answers">${tp.order.map(i=>{
      let cls=""; if(tp.sub!=="quiz"){ if(i===0) cls="right"; else if(i===tp.answer) cls="wrong"; }
      return `<button class="answer ${cls}" type="button" data-act="answer" data-a="${i}" ${tp.sub!=="quiz"?"disabled":""}>${esc(q.a[i])}</button>`;}).join("")}</div>`;
    if(tp.sub!=="quiz") h+=`<div class="result ${tp.quizOk?"good":"bad"}"><div class="big">${tp.quizOk?tr("Dobrze! −1 żeton","Correct! −1 token"):tr("Niestety nie. +1 żeton","Not quite. +1 token")}</div><p>${tp.quizOk?"":`${tr("Poprawna odpowiedź","Correct answer")}: <b>${esc(q.a[0])}</b>. `}${esc(q.why)}</p></div>`;
    if(tp.sub==="source"){
      h+=`<div class="cardtag">${tr("Wybierz dostawcę surowca","Choose a raw-material supplier")}</div><div class="choices three">${sourceOptions(p,pr).map(choiceBtn).join("")}</div>`;
    }
  }
  if(tp.stage==="P" && !tp.done){
    h+=`<p>${p.viaRecycling?tr(`<b>Surowiec wtórny z recyklingu:</b> podstawa ${tok(pr.R)} zamiast ${pr.P}.`,`<b>Secondary material from recycling:</b> base ${tok(pr.R)} instead of ${pr.P}.`):tr(`<b>Surowiec pierwotny:</b> podstawa ${tok(pr.P)}.`,`<b>Virgin material:</b> base ${tok(pr.P)}.`)}</p>
      <div class="choices">${prodOptions(p,pr).map(choiceBtn).join("")}</div>
      <div class="fact">${esc(p.viaRecycling?pr.factRec:pr.factProd)}</div>`;
  }
  if(tp.stage==="T" && !tp.done){
    h+=`<div class="choices">${transOptions(p,pr).map(choiceBtn).join("")}</div>`;
  }
  if(tp.stage==="U" && !tp.done){
    if(tp.sub==="draw"){
      h+=`<div><button class="btn primary" type="button" data-act="drawevent">${tr("Pociągnij kartę wydarzenia","Draw an event card")}</button></div>
      <p class="muted" style="font-size:.88rem">${tr("Podstawa","Base")}: ${tok(pr.U+nm("usePlus"))} ${tr("za jedno użycie","per use")}${B()?` · <span class="coin">+${coinTxt(1)}</span> ${tr("(produkt jest wart swojej ceny)","(the product is worth its price)")}`:""}. ${tr("Każda reakcja na wydarzenie pokazuje łączny wynik tego użycia.","Each reaction to the event shows the total result of this use.")}</p>`;
    } else {
      const ev=evL(tp.ev);
      h+=`<div class="event flash"><span class="cardtag">${tr("Karta wydarzenia","Event card")}</span><h3>${esc(ev.title)}</h3><p>${esc(ev.text)}</p></div>
        <div class="choices three">${eventOptions(p,pr,ev).map(choiceBtn).join("")}</div>`;
    }
  }
  if(tp.stage==="K" && !tp.done){
    const min=S.settings.minUses;
    if(tp.sub==="bin"){ h+=binQuestion(pr); }
    else h+=`<p><b>${tr("Użycia","Uses")}: ${p.uses}/${min}.</b> ${p.uses>=min?tr("Minimum spełnione: wybierz, jak zakończyć cykl.","Minimum reached: choose how to end the cycle."):tr(`Brakuje ${min-p.uses}. Produkt musi dalej służyć.`,`${min-p.uses} more needed. The product has to keep serving.`)}</p>
      <div class="choices">${koOptions(p,pr).map(choiceBtn).join("")}</div>`;
  }
  if(tp.done){
    const r=tp.result;
    if(tp.stage==="K" && tp.binOrder) h+=binQuestion(pr)+`<p class="fact">${esc(pr.binWhy||"")}</p>`;
    if(r.die) h+=`<div style="display:flex;align-items:center;gap:10px"><span class="die" aria-label="${tr("Wynik rzutu","Dice roll")}: ${r.die}">${r.die}</span><b>${r.die>=3?tr("Naprawa się udała!","The repair worked!"):tr("Nie wyszło. Spróbujesz ponownie w następnej turze albo wybierzesz coś innego.","It didn't work. Try again next turn or choose something else.")}</b></div>`;
    h+=`<div class="result flash ${r.cls||""}" role="status"><div class="big">${esc(L(r.head)||"")} ${tok("+"+r.n)} ${moneyTxt(r.money)}</div>
      ${tp.steps.length>1?`<div class="steps">${tp.steps.map(s=>`<div class="stepline"><span>${esc(L(s[0]))}</span><span class="mono">${s[1]>=0?"+":""}${s[1]}</span></div>`).join("")}</div>`:""}
      ${L(r.text)?`<p>${esc(L(r.text))}</p>`:""}</div>`;
    h+=`<div class="endrow"><button class="btn primary" type="button" data-act="endturn">${nextLabel()}</button></div>`;
  }
  return h;
}
function nextLabel(){
  const others=S.players.filter((p,i)=>!p.finished && i!==S.cur);
  if(!others.length && S.tp.next==="finish") return tr("Zobacz wyniki","See results");
  return tr("Zakończ turę","End turn");
}

function renderGame(){
  const p=S.players[S.cur], pr=prodById(p.productId);
  if(!S.tp) beginTurn();
  const min=S.settings.minUses;
  const maxT=Math.max(1,...S.players.map(x=>x.tokens));
  const nw=newsTxt();
  view.innerHTML = `<div class="game">
    <section class="boardbox">
      ${boardSVG()}
      <div class="legend"><span><i></i>${tr("Recykling: skrót z Końca życia do Produkcji","Recycling: shortcut from End of life to Production")}</span><span><i class="r"></i>${tr("Naprawa: powrót do Użytkowania","Repair: back to Use")}</span></div>
    </section>
    <div class="side">
      ${S.settings.newsOn?`<div class="news"><div><div class="cardtag">${tr("Wiadomość rundy","Round news")} ${S.round}</div><div class="nt">${esc(nw[0])}</div><p>${esc(nw[1])}</p></div></div>`:""}
      <section class="turn" aria-live="polite">
        <div class="turn-head" style="background:${ST_COLOR[S.tp.stage]}">
          <div class="who"><span class="dot" style="background:${p.color}"></span>${esc(p.name)} · ${esc(pr.name)}</div>
          <h2>${STAGES.indexOf(S.tp.stage)+1}. ${stName(S.tp.stage)}</h2>
        </div>
        <div class="turn-body">${turnBody(p,pr)}</div>
      </section>
      <section class="scores">
        <div style="display:flex;justify-content:space-between;align-items:baseline;gap:8px;flex-wrap:wrap"><h3>${tr("Gracze","Players")}</h3><span class="muted" style="font-size:.85rem">${tr(`Minimum użyteczności: ${min} użycia`,`Minimum usefulness: ${min} uses`)}</span></div>
        <div class="scoretbl-wrap"><table class="scoretbl">
          <thead><tr><th>${tr("Gracz","Player")}</th><th>${tr("Strefa","Zone")}</th><th>${tr("Użycia","Uses")}</th><th class="num">CO₂</th><th>${tr("Etapy","Stages")}</th>${B()?`<th class="num">${tr("Monety","Coins")}</th>`:""}</tr></thead>
          <tbody>${S.players.map((x,i)=>{
            const xp=prodById(x.productId);
            return `<tr class="${i===S.cur?"cur":""}">
              <td><div class="owner"><span class="dot" style="background:${x.color}"></span><span>${esc(x.name)}<br><span class="muted" style="font-weight:400;font-size:.82rem">${esc(xp.name)}${x.copies>1?tr(` · egz. ${x.copies}`,` · unit ${x.copies}`):""}</span></span></div></td>
              <td>${x.finished?`<span class="status" style="background:var(--accent-soft);color:var(--accent)">${finalLabel(x.finalChoice)}</span>`:`<span class="status" style="background:${ST_COLOR[x.stage]};color:var(--z-ink)">${stName(x.stage)}</span>`}</td>
              <td><span class="uses" aria-label="${x.uses} / ${min}">${[...Array(Math.max(min,x.uses))].map((_,k)=>`<i class="${k<x.uses?"on":""}"></i>`).join("")}</span></td>
              <td class="num">${tok(x.tokens)}</td>
              <td>${stageBar(x,maxT)}</td>
              ${B()?`<td class="num coin">${x.budget}</td>`:""}
            </tr>`;}).join("")}</tbody>
        </table></div>
        <div class="stagekey">${STAGES.map(s=>`<span><i style="background:${ST_COLOR[s]}"></i>${stName(s)}</span>`).join("")}</div>
      </section>
      <section class="scores">
        <h3>${tr("Dziennik","Log")}</h3>
        <div class="log">${S.log.length?S.log.slice(0,10).map(l=>`<div><span class="t">#${l.t}</span><span><b>${esc(S.players[l.pi].name)}:</b> ${esc(L(l.text))}</span></div>`).join(""):`<span class="muted">${tr("Tu pojawią się decyzje graczy.","Players' decisions will appear here.")}</span>`}</div>
      </section>
    </div>
  </div>`;
}
function finalLabel(c){ return ({rec:tr("Obieg zamknięty","Loop closed"),second:tr("Drugie życie","Second life"),inc:tr("Spalarnia","Incinerated"),land:tr("Na składowisku","In landfill")})[c]||tr("Koniec","Finished"); }
function stageBar(x,max){
  return `<div class="bar" title="${STAGES.map(s=>stName(s)+": "+x.breakdown[s]).join(", ")}">${STAGES.map(s=>x.breakdown[s]?`<span style="width:${x.breakdown[s]/max*100}%;background:${ST_COLOR[s]}"></span>`:"").join("")}</div>`;
}

