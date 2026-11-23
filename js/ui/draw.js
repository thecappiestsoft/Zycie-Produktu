/* Losowanie produktów i karta produktu */
"use strict";
/* ---------- Losowanie ---------- */
function newPlayer(n,i,pid){
  return { name:n, color:COLORS[i], productId:pid, stage:"E",
    tokens:0, uses:0, budget:4, copies:1, repairsUsed:0, repairBonus:0, repairBlocked:false, secondUsed:false,
    recycleLoops:0, viaRecycling:false, freeLocal:false, freeRecycle:false, finished:false, finalChoice:null,
    asked:[], breakdown:{E:0,P:0,T:0,U:0,K:0}, stats:{good:0,bad:0,green:0,cheap:0} };
}
function startDraw(){
  syncNames();
  const names = setup.players.map((p,i)=>p.name.trim()||`${tr("Gracz","Player")} ${i+1}`);
  const pool = shuffle(allProducts());
  S = {
    phase:"draw", settings:{minUses:setup.minUses, budgetOn:setup.budgetOn, newsOn:setup.newsOn},
    customSnap: setup.useCustom ? JSON.parse(JSON.stringify(custom)) : [],
    players: names.map((n,i)=>newPlayer(n,i,pool[i % pool.length].id)),
    cur:0, round:1, turnNo:1, tp:null, log:[], news:"calm"
  };
  persist(); render();
}

function productCard(pr, owner){
  const budgetOn = S ? S.settings.budgetOn : setup.budgetOn;
  const coin = c => budgetOn?` · <span class="coin">${coinTxt(c)}</span>`:"";
  const rows = [
    [tr("Wydobycie","Extraction"), pr.E],[tr("Produkcja z surowców pierwotnych","Production from virgin materials"), pr.P],[tr("Produkcja z recyklingu","Production from recycled materials"), pr.R],
    [tr("Transport lokalny","Local transport"), pr.TL + coin(pr.localCost)],[tr("Transport z innego kontynentu","Transport from another continent"), pr.TI],
    [tr("Jedno użycie","One use"), pr.U]
  ];
  if(pr.repairMax>0) rows.push([esc(pr.repairLabel||tr("Naprawa","Repair")), pr.N + coin(pr.repairCost)]);
  if(pr.I!=null) rows.push([tr("Spalarnia z odzyskiem energii","Incineration with energy recovery"), pr.I]);
  rows.push([tr("Składowisko","Landfill"), pr.L]);
  return `<article class="pcard">
    ${owner?`<div class="owner"><span class="dot" style="background:${owner.color}"></span>${esc(owner.name)}</div>`:""}
    <div class="pcard-head"><div class="elem"><b>${esc(pr.sym||pr.name.slice(0,2))}</b><span>${esc(pr.symSub||"")}</span></div>
      <div><h3>${esc(pr.name)}</h3><div class="muted" style="font-size:.85rem">${esc(pr.material)}</div></div></div>
    <table class="ptable"><tbody>${rows.map(r=>`<tr><td>${r[0]}</td><td>${r[1]}</td></tr>`).join("")}</tbody></table>
    <div class="badges">
      ${pr.repairMax>0?`<span class="badge green">${tr("Naprawy","Repairs")}: ${pr.repairMax}</span>`:`<span class="badge">${tr("Bez naprawy","No repair")}</span>`}
      <span class="badge green">${tr("Recykling","Recycling")}: ${pr.recycleMax>=9?tr("bez limitu","unlimited"):pr.recycleMax+"×"}</span>
      ${pr.second?`<span class="badge green">${tr("Drugie życie: second-hand","Second life: second-hand")}</span>`:""}
      ${pr.selfRepair?`<span class="badge">${tr("Samodzielna naprawa (kostka)","DIY repair (dice)")}</span>`:""}
      ${pr.deposit?`<span class="badge">${tr("Kaucja","Deposit")}</span>`:""}
      ${pr.custom?`<span class="badge">${tr("Karta uczniów · źródło","Student card · source")} ${pr.srcScore}/5</span>`:""}
    </div>
    <p style="font-size:.85rem" class="muted">${esc(pr.real||"")}</p>
  </article>`;
}

function renderDraw(){
  view.innerHTML = `<div class="stack">
    <div><div class="eyebrow">${tr("Losowanie","Draw")}</div><h2>${tr("Wasze produkty","Your products")}</h2>
    <p class="muted" style="max-width:66ch;margin-top:6px">${tr("Liczby to podstawowe żetony CO₂ za etapy. Decyzje w grze je zmniejszają albo zwiększają. Żeton to umowna jednostka: wartości przeskalowano tak, żeby różne produkty dało się porównać. Pokazują proporcje między etapami, a nie dokładne kilogramy.",
      "The numbers are the base CO₂ tokens for each stage. Decisions in the game lower or raise them. A token is a notional unit: values are scaled so that different products can be compared. They show proportions between stages, not exact kilograms.")}</p></div>
    <div class="pcards">${S.players.map(p=>productCard(prodById(p.productId),p)).join("")}</div>
    <div class="endrow"><button class="btn" type="button" data-act="redraw">${tr("Losuj jeszcze raz","Draw again")}</button><button class="btn primary" type="button" data-act="start">${tr("Zaczynamy grę","Start the game")}</button></div>
  </div>`;
}

