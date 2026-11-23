/* Opcje do wyboru na każdym etapie (reguły gry) */
"use strict";
/* ---------- Opcje etapów ---------- */
function O(o){ return Object.assign({tokens:0,money:0,disabled:false},o); }
function repairsLeft(p,pr){ if(p.repairBlocked) return 0; return Math.max(0, pr.repairMax + p.repairBonus - p.repairsUsed); }
function afford(p,list,income){ list.forEach(o=>{ if(!o.disabled && !canPay(p,o.money,income)){ o.disabled=true; o.why=o.why||tr("Za mało monet","Not enough coins"); } }); return list; }

function sourceOptions(p,pr){
  const src=pr.src||{good:tr("Certyfikowane źródło","Certified source"),goodD:tr("Kontrolowane wydobycie i mniejsze emisje.","Controlled extraction and lower emissions.")};
  return afford(p,[
    O({id:"conv",title:tr("Dostawca konwencjonalny","Conventional supplier"),desc:tr("Typowe wydobycie i przeróbka surowca.","Typical extraction and processing of the raw material."),tokens:pr.E}),
    O({id:"cert",title:src.good,desc:src.goodD,tokens:Math.max(0,pr.E-1),money:-1}),
    O({id:"cheap",title:tr("Najtańszy dostawca","Cheapest supplier"),desc:tr("Brak kontroli emisji i odpadów. Taniej, ale większy ślad.","No control of emissions or waste. Cheaper, but a bigger footprint."),tokens:pr.E+1,money:1})
  ]);
}
function prodOptions(p,pr){
  const rec=p.viaRecycling, base=rec?pr.R:pr.P;
  const eco=pr.eco||{title:tr("Ekoprojekt","Ecodesign"),desc:tr("Mniej materiału na produkt.","Less material per product."),dTok:-1,repair:0,cost:1};
  const gcost=Math.max(0,2-nm("greenDisc")), ecost=nm("ecoFree")?0:eco.cost;
  return afford(p,[
    O({id:"std",title:tr("Linia standardowa","Standard line"),desc:tr("Prąd z sieci, w Polsce wciąż w dużej części z węgla.","Grid electricity, which in Poland still comes largely from coal."),tokens:base}),
    O({id:"green",title:tr("Fabryka zasilana z OZE","Renewable-powered factory"),desc:tr("Własne panele i umowa na energię z wiatru: −2 żetony.","Its own solar panels and a wind power contract: −2 tokens."),tokens:Math.max(0,base-2),money:-gcost}),
    O({id:"eco",title:tr("Ekoprojekt: ","Ecodesign: ")+eco.title,desc:eco.desc,tokens:Math.max(0,base+eco.dTok),money:-ecost,eco}),
    O({id:"fast",title:tr("Tanio i szybko","Cheap and fast"),desc:tr("Stara, energożerna linia i brak kontroli jakości.","An old, energy-hungry line with no quality control.")+(nm("cheapNoMoney")?tr(" Wiadomość rundy: bez zarobku."," Round news: no earnings."):""),tokens:base+1,money:nm("cheapNoMoney")?0:1})
  ]);
}
function transOptions(p,pr){
  const lc=p.freeLocal?0:pr.localCost, far=pr.TI+nm("farPlus");
  const rc=p.freeLocal?Math.max(0,1-nm("railDisc")):lc+1-nm("railDisc");
  return afford(p,[
    O({id:"truck",title:tr("Lokalnie: ciężarówka","Local: truck"),desc:p.freeLocal?tr("Zakład w regionie: tym razem bez kosztu.","Plant in your region: free this time."):tr("Zakład w Polsce lub w sąsiednim kraju. Krótka droga, wyższa cena.","A plant in Poland or a neighbouring country. A short trip, a higher price."),tokens:pr.TL,money:-lc}),
    O({id:"rail",title:tr("Lokalnie: kolej","Local: rail"),desc:tr("Pociąg towarowy emituje na tonokilometr kilka razy mniej CO₂ niż ciężarówka.","A freight train emits several times less CO₂ per tonne-kilometre than a truck."),tokens:Math.max(0,pr.TL-1),money:-rc}),
    O({id:"ship",title:tr("Z innego kontynentu: statek","From another continent: ship"),desc:tr("Tania produkcja daleko stąd. Statek kontenerowy na tonę ładunku emituje stosunkowo mało, ale droga jest długa.","Cheap production far away. A container ship emits relatively little per tonne of cargo, but the journey is long.")+(nm("farPlus")?tr(" Wiadomość rundy: +1."," Round news: +1."):""),tokens:far}),
    O({id:"air",title:tr("Z innego kontynentu: samolot","From another continent: plane"),desc:tr("Ekspres: szybko w sklepie i wyższa marża, ale ogromny ślad na kilogram.","Express: in the shop quickly with a higher margin, but a huge footprint per kilogram."),tokens:far+3,money:1})
  ]);
}
function koOptions(p,pr){
  const min=S.settings.minUses, opts=[];
  const recFree = nm("recycleFree") || p.freeRecycle;
  const recMoney = pr.deposit ? 1 : (recFree?0:-1);
  const landMoney = -(1+nm("landfillFee"));
  const recDesc = tr(`+1 żeton za zbiórkę i sortowanie, 0 przy dobrze wybranym pojemniku${pr.deposit?" (zwrot kaucji)":""}.`,
                     `+1 token for collection and sorting, 0 if you pick the right bin${pr.deposit?" (deposit refunded)":""}.`);
  if(p.uses>=min){
    if(pr.second) opts.push(O({id:"finsecond",title:tr("Sprzedaj jako używany","Sell it second-hand"),desc:tr("Produkt żyje dalej u kogoś innego. To najwyższy szczebel hierarchii odpadów: ponowne użycie.","The product lives on with someone else. This is the top rung of the waste hierarchy: reuse."),tokens:0,money:1}));
    opts.push(O({id:"finrec",title:tr("Recykling: zamknij obieg","Recycling: close the loop"),desc:tr("Minimum spełnione. Materiał wraca do przetworzenia. ","Minimum reached. The material goes back for processing. ")+recDesc,tokens:1,money:recMoney}));
    if(pr.I!=null) opts.push(O({id:"fininc",title:tr("Spalarnia z odzyskiem energii","Incineration with energy recovery"),desc:tr("Odzyskujesz ciepło i prąd, ale materiał przepada, a węgiel trafia do atmosfery jako CO₂.","You recover heat and electricity, but the material is lost and its carbon goes into the air as CO₂."),tokens:pr.I,money:-2}));
    opts.push(O({id:"finland",title:tr("Składowisko: koniec","Landfill: the end"),desc:tr("Surowiec przepada, a materiały organiczne wydzielają metan.","The raw material is lost, and organic materials give off methane."),tokens:pr.L,money:landMoney,always:true}));
  } else {
    const rl=repairsLeft(p,pr), rd=nm("repairDisc");
    if(pr.repairMax>0 || p.repairBonus>0){
      const whyR = rl<=0?(p.repairBlocked?tr("Produkt nie nadaje się już do naprawy","The product can no longer be repaired"):tr("Wykorzystano wszystkie naprawy","All repairs used up")):"";
      opts.push(O({id:"repair",title:pr.repairLabel||tr("Naprawa","Repair"),desc:tr(`Naprawa zamiast wyrzucenia: wracasz do Użytkowania. W zapasie: ${rl}.`,`Repair instead of throwing away: you go back to Use. Spare repairs: ${rl}.`),tokens:pr.N,money:-Math.max(0,pr.repairCost-rd),disabled:rl<=0,why:whyR}));
      if(pr.selfRepair) opts.push(O({id:"self",title:tr("Napraw samodzielnie","Repair it yourself"),desc:tr("Taniej, z filmem instruktażowym. Rzut kostką: 3–6 sukces, 1–2 nieudana próba (zostajesz w tej strefie).","Cheaper, with a how-to video. Dice roll: 3–6 success, 1–2 failed attempt (you stay in this zone)."),tokens:pr.N,money:-Math.max(0,pr.repairCost-2-rd),disabled:rl<=0,why:whyR,dice:true}));
    }
    if(pr.second) opts.push(O({id:"second",title:tr("Sprzedaj jako używany","Sell it second-hand"),desc:tr("Drugie życie u nowego właściciela: produkt jedzie do niego (Transport), a ty zarabiasz.","A second life with a new owner: the product travels to them (Transport) and you earn money."),tokens:0,money:1,disabled:p.secondUsed,why:tr("Ten egzemplarz już raz zmienił właściciela","This unit has already changed owners once")}));
    const recLeft = pr.recycleMax - p.recycleLoops;
    opts.push(O({id:"recycle",title:tr("Recykling","Recycling"),desc:tr(`Skrót do Produkcji z pominięciem Wydobycia (${pr.E} żet.). Następny egzemplarz z surowców wtórnych: ${pr.R} zamiast ${pr.P}. `,`Shortcut to Production, skipping Extraction (${pr.E} tok.). The next unit is made from secondary materials: ${pr.R} instead of ${pr.P}. `)+recDesc+(pr.recycleMax<9?tr(` Pozostało: ${Math.max(0,recLeft)}.`,` Left: ${Math.max(0,recLeft)}.`):""),tokens:1,money:recMoney,disabled:recLeft<=0,why:tr("Materiał jest za słaby na kolejny recykling","The material is too degraded to recycle again")}));
    if(pr.I!=null) opts.push(O({id:"inc",title:tr("Spalarnia z odzyskiem energii","Incineration with energy recovery"),desc:tr("Materiał przepada: nowy egzemplarz od Wydobycia.","The material is lost: a new unit starts from Extraction."),tokens:pr.I,money:-2}));
    opts.push(O({id:"landfill",title:tr("Składowisko","Landfill"),desc:tr("Przed osiągnięciem minimum: nowy egzemplarz od Wydobycia.","Before reaching the minimum: a new unit starts from Extraction."),tokens:pr.L,money:landMoney,always:true}));
  }
  afford(p,opts.filter(o=>!o.always));
  return opts;
}
function eventOptions(p,pr,ev){
  return afford(p, ev.opts.map((o,i)=>{
    let t=pr.U+nm("usePlus")+(o.dU||0)+(o.intense?pr.U:0);
    if(o.promo) t+=pr.E+pr.P;
    const extra = (o.rep>0 && pr.repairMax+p.repairBonus<=0 && !pr.selfRepair) ? " "+tr("(ten produkt nie ma napraw)","(this product has no repairs)") : "";
    return O({id:String(i),title:o.l,desc:o.d+extra,tokens:Math.max(0,t),money:1+(o.m||0),raw:o});
  }), 0);
}
function optsFor(stage,p){
  const pr=prodById(p.productId);
  if(stage==="E") return sourceOptions(p,pr);
  if(stage==="P") return prodOptions(p,pr);
  if(stage==="T") return transOptions(p,pr);
  if(stage==="U") return eventOptions(p,pr,evL(S.tp.ev));
  return koOptions(p,pr);
}
const titleBoth = (stage,p,id) => both(()=>optsFor(stage,p).find(x=>x.id===id).title);

