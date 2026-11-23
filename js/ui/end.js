/* Ranking i ekran końcowy */
"use strict";
/* ---------- Koniec ---------- */
function ranking(){
  const arr=S.players.map((p,i)=>({p,i})).sort((a,b)=>a.p.tokens-b.p.tokens || b.p.uses-a.p.uses);
  let place=0, prev=null;
  arr.forEach((r,k)=>{ const key=r.p.tokens+"|"+r.p.uses; if(key!==prev){place=k+1;prev=key;} r.place=place; });
  return arr;
}
function renderEnd(){
  const rk=ranking(), max=Math.max(1,...S.players.map(p=>p.tokens));
  const winners=rk.filter(r=>r.place===1).map(r=>esc(r.p.name)).join(tr(" i "," and "));
  view.innerHTML=`<div class="stack">
    <div><div class="eyebrow">${tr(`Koniec gry · ${S.turnNo-1} tur · ${S.round} rund`,`Game over · ${S.turnNo-1} turns · ${S.round} rounds`)}</div><h2>${tr("Najmniejszy ślad","Smallest footprint")}: ${winners}</h2>
    <p class="muted" style="margin-top:6px;max-width:68ch">${tr(`Wszystkie produkty spełniły minimum użyteczności (${S.settings.minUses} użycia). „Scenariusz liniowy” to ten sam produkt kupowany za każdym razem od nowa, z innego kontynentu i wyrzucany na składowisko.`,
      `Every product reached the minimum usefulness (${S.settings.minUses} uses). The “linear scenario” is the same product bought new every time, shipped from another continent and thrown into landfill.`)}</p></div>
    <div class="rank">${rk.map(r=>{
      const pr=prodById(r.p.productId), lin=linearPerUse(pr)*r.p.uses, pct=Math.round(r.p.tokens/lin*100), s=r.p.stats;
      return `<div class="rankrow ${r.place===1?"win":""}">
        <div class="place">${r.place}.</div>
        <div style="min-width:0"><div class="owner"><span class="dot" style="background:${r.p.color}"></span>${esc(r.p.name)} <span class="muted" style="font-weight:400">· ${esc(pr.name)}</span></div>
          <div class="muted" style="font-size:.88rem">${tr(`${r.p.uses} użyć · ${fmt1(r.p.tokens/r.p.uses)} żet. na użycie · ${pct}% scenariusza liniowego (${lin})`,`${r.p.uses} uses · ${fmt1(r.p.tokens/r.p.uses)} tokens per use · ${pct}% of the linear scenario (${lin})`)} · ${finalLabel(r.p.finalChoice).toLowerCase()}${r.p.copies>1?tr(` · egzemplarzy: ${r.p.copies}`,` · units: ${r.p.copies}`):""}</div>
          <div class="muted" style="font-size:.85rem">${tr(`Dobre odpowiedzi: ${s.good}/${s.good+s.bad} · zielone decyzje: ${s.green} · tanie i szybkie: ${s.cheap}`,`Right answers: ${s.good}/${s.good+s.bad} · green decisions: ${s.green} · cheap and fast: ${s.cheap}`)}</div>
          ${stageBar(r.p,max)}</div>
        <div class="num">${tok(r.p.tokens)}</div>
      </div>`;}).join("")}</div>
    <div class="stagekey">${STAGES.map(s=>`<span><i style="background:${ST_COLOR[s]}"></i>${stName(s)}</span>`).join("")}</div>
    <div class="cols2">
      <section class="panel"><h3>${tr("Rozmowa po grze (5 minut)","Talk after the game (5 minutes)")}</h3><ul>${DISCUSS[lang].map(d=>`<li>${d}</li>`).join("")}</ul></section>
      <section class="panel"><h3>${tr("Co realnie działa","What actually works")}</h3><ul>${HOPE[lang].map(h=>`<li><b>${h[0]}.</b> ${h[1]}</li>`).join("")}</ul>
      <p class="muted" style="font-size:.88rem">${tr("Wiedza chemiczna przekłada się na rozwiązania: od katalizatorów po recykling.","Chemistry knowledge turns into solutions: from catalytic converters to recycling.")}</p></section>
    </div>
    <div class="endrow"><button class="btn" type="button" data-act="replay">${tr("Zagraj jeszcze raz tymi samymi graczami","Play again with the same players")}</button><button class="btn primary" type="button" data-act="newgame">${tr("Nowa gra","New game")}</button></div>
  </div>`;
}

