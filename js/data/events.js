/* Karty wydarzeń etapu Użytkowanie */
"use strict";
/* Wydarzenia przy Użytkowaniu: każde ma 2–3 reakcje do wyboru. */
const EVENTS = [
 {id:"tariff", for:p=>p.U>0, title:"Oferta zielonej taryfy", text:"Dostawca prądu proponuje energię z farm wiatrowych i słonecznych.",
  opts:[{l:"Przejdź na zieloną taryfę",d:"Prąd do użytkowania z OZE.",dU:-1,m:-1},{l:"Zostań przy obecnej taryfie",d:"Taniej, ale prąd w dużej części z węgla."}]},
 {id:"plant", for:()=>true, title:"Nowy zakład w regionie", text:"Blisko ciebie ruszyła fabryka tego produktu.",
  opts:[{l:"Podpisz umowę z zakładem",d:"Następny transport lokalny bez opłaty.",m:-1,freeLocal:true},{l:"Zostań przy dotychczasowym dostawcy",d:"Nic się nie zmienia."}]},
 {id:"collect", for:()=>true, title:"Szkolna zbiórka surowców", text:"Samorząd uczniowski organizuje sobotnią zbiórkę i sortowanie.",
  opts:[{l:"Weź udział",d:"Następny recykling bez opłaty za zbiórkę.",freeRecycle:true},{l:"Dorób w weekend",d:"+1 moneta zamiast zbiórki.",m:1}]},
 {id:"weekend", for:p=>["glass","tshirt","phone","bag"].includes(p.id)||p.custom, title:"Wolny weekend", text:"Masz więcej czasu niż zwykle.",
  opts:[{l:"Używaj normalnie",d:"Bez zmian."},{l:"Używaj intensywnie",d:"Dodatkowe użycie, ale też ślad tego użycia i zużycie (−1 naprawa w zapasie).",extraUse:1,intense:true,rep:-1}]},
 {id:"promo", for:p=>["phone","tshirt"].includes(p.id), title:"Promocja: nowy model taniej", text:"Reklamy przekonują, że twój produkt jest już przestarzały.",
  opts:[{l:"Oprzyj się pokusie",d:"Używasz dalej tego, co masz."},{l:"Kup nowy, stary do szuflady",d:"+2 monety z bonu, ale nowy egzemplarz oznacza od razu żetony Wydobycia i Produkcji.",m:2,promo:true}]},
 {id:"deposit", for:p=>p.deposit, title:"Automat kaucyjny pod szkołą", text:"Od 1 października 2025 r. w Polsce działa system kaucyjny.",
  opts:[{l:"Odbierz kaucję",d:"+1 moneta.",m:1},{l:"Przekaż kaucję na szkolne nasadzenia",d:"−1 żeton (kompensacja). Sadzenie drzew nie zastępuje ograniczania emisji.",dU:-1}]},
 {id:"heat", for:p=>["can","pet","glass"].includes(p.id), title:"Upał", text:"Napój trzeba schłodzić.",
  opts:[{l:"Chłodź w domowej lodówce",d:"+1 żeton za prąd.",dU:1},{l:"Kup schłodzony w sklepie",d:"Bez dodatkowego prądu w domu, ale kosztuje.",m:-1}]},
 {id:"tap", for:p=>["pet","glass"].includes(p.id), title:"Woda z kranu", text:"W Polsce woda z kranu jest zwykle zdatna do picia.",
  opts:[{l:"Napełnij butelkę kranówką",d:"Dodatkowe użycie bez nowej produkcji.",extraUse:1},{l:"Kup wodę butelkowaną",d:"Dodatkowe użycie, ale +1 żeton za produkcję i transport wody.",extraUse:1,dU:1,m:-1},{l:"Pij z kubka",d:"Bez zmian."}]},
 {id:"wash", for:p=>p.id==="tshirt", title:"Dzień prania", text:"Pranie i suszenie to największa część śladu użytkowania ubrań.",
  opts:[{l:"30°C i suszenie na sznurku",d:"−2 żetony.",dU:-2},{l:"40°C i suszarka bębnowa",d:"+1 żeton, ale oszczędzasz czas i dorabiasz: +1 moneta.",dU:1,m:1},{l:"Rzadziej prać, częściej wietrzyć",d:"−1 żeton.",dU:-1}]},
 {id:"hole", for:p=>p.id==="tshirt", title:"Dziura w rękawie", text:"Mała dziura szybko robi się duża.",
  opts:[{l:"Zaceruj od razu",d:"−1 moneta, +1 naprawa w zapasie.",m:-1,rep:1},{l:"Zignoruj",d:"Dziura rośnie: −1 naprawa w zapasie.",rep:-1}]},
 {id:"fashion", for:p=>p.id==="tshirt", title:"Nowy trend w modzie", text:"Wszyscy noszą krótsze koszulki.",
  opts:[{l:"Noś dalej",d:"Bez zmian."},{l:"Przerób koszulkę (upcykling)",d:"+1 użycie i +1 żeton, −1 moneta.",extraUse:1,dU:1,m:-1}]},
 {id:"battery", for:p=>p.id==="phone", title:"Bateria słabnie", text:"Telefon rozładowuje się przed końcem dnia.",
  opts:[{l:"Wymień baterię od razu",d:"−2 monety, −1 żeton i +1 naprawa w zapasie.",m:-2,dU:-1,rep:1},{l:"Ładuj częściej",d:"+1 żeton.",dU:1},{l:"Kup powerbank",d:"+1 żeton i −1 moneta, ale dodatkowe użycie w podróży.",dU:1,m:-1,extraUse:1}]},
 {id:"stream", for:p=>p.id==="phone", title:"Wieczór z serialem", text:"Przesyłanie wideo zużywa energię w centrach danych i sieci.",
  opts:[{l:"Streaming w 4K przez sieć komórkową",d:"+2 żetony.",dU:2},{l:"Niższa jakość przez Wi-Fi",d:"−1 żeton.",dU:-1},{l:"Zamiast serialu planszówka",d:"−1 żeton, bez dochodu z użycia (−1 moneta).",dU:-1,m:-1}]},
 {id:"drop", for:p=>p.id==="phone", title:"Telefon upadł na chodnik", text:"Ekran przetrwał, ale było blisko.",
  opts:[{l:"Kup etui i szkło ochronne",d:"−1 moneta, +1 naprawa w zapasie.",m:-1,rep:1},{l:"Zostaw jak jest",d:"Mikropęknięcie: −1 naprawa w zapasie.",rep:-1}]},
 {id:"rain", for:p=>p.id==="bag", title:"Ulewa", text:"Wracasz ze sklepu, a z nieba leje.",
  opts:[{l:"Biegnij z torbą",d:"Torba przemaka i się rozdziera: koniec ponownego użycia.",block:true},{l:"Kup foliówkę jako osłonę",d:"+1 żeton i −1 moneta, torba ocalała.",dU:1,m:-1},{l:"Przeczekaj w sklepie",d:"Bez śladu, ale tracisz czas: −1 moneta.",m:-1}]},
 {id:"gift", for:p=>p.id==="bag", title:"Urodziny przyjaciółki", text:"Potrzebujesz opakowania na prezent.",
  opts:[{l:"Zapakuj prezent w torbę",d:"+1 użycie, ale torba zostaje u przyjaciółki: koniec ponownego użycia.",extraUse:1,block:true},{l:"Kup papier do pakowania",d:"+1 żeton, −1 moneta.",dU:1,m:-1},{l:"Złóż i schowaj torbę",d:"+1 ponowne użycie w zapasie.",rep:1}]},
 {id:"crack", for:p=>p.id==="glass", title:"Wyszczerbiona szyjka", text:"Butelka nie nadaje się do napełnienia.",
  opts:[{l:"Oddaj do stłuczki",d:"Koniec napełnień, ale następny recykling bez opłaty.",block:true,freeRecycle:true},{l:"Zrób z niej wazon (upcykling)",d:"+1 użycie, koniec napełnień.",extraUse:1,block:true}]},
 {id:"share", for:p=>["tshirt","phone","bag"].includes(p.id), title:"Rodzeństwo prosi o pożyczenie", text:"Twój produkt może posłużyć komuś jeszcze.",
  opts:[{l:"Pożycz",d:"+1 użycie, ale −1 naprawa w zapasie (zużycie).",extraUse:1,rep:-1},{l:"Nie pożyczaj",d:"Bez zmian."}]},
 {id:"calm", for:()=>true, title:"Zwykły dzień", text:"Produkt robi to, do czego powstał.",
  opts:[{l:"Używaj normalnie",d:"Bez zmian."},{l:"Dorób po szkole",d:"+1 moneta, ale używasz produktu intensywniej: +1 żeton.",m:1,dU:1}]}
];
const EVENTS_EN = {
 tariff:{title:"Green tariff offer",text:"Your electricity supplier offers energy from wind and solar farms.",opts:[["Switch to the green tariff","Electricity for using the product comes from renewables."],["Stay on your current tariff","Cheaper, but the electricity comes largely from coal."]]},
 plant:{title:"New plant in your region",text:"A factory making this product has opened near you.",opts:[["Sign a deal with the plant","Your next local transport is free."],["Stay with your current supplier","Nothing changes."]]},
 collect:{title:"School recycling drive",text:"The student council is organising a Saturday collection and sorting day.",opts:[["Take part","Your next recycling has no collection fee."],["Earn some money at the weekend","+1 coin instead of the collection drive."]]},
 weekend:{title:"Free weekend",text:"You have more time than usual.",opts:[["Use it normally","No change."],["Use it intensively","An extra use, but also the footprint of that use and some wear (−1 spare repair)."]]},
 promo:{title:"Sale: new model for less",text:"Adverts try to convince you that your product is out of date.",opts:[["Resist the temptation","You keep using what you have."],["Buy a new one, old one in the drawer","+2 coins from a voucher, but a new unit means Extraction and Production tokens straight away."]]},
 deposit:{title:"Deposit machine by the school",text:"Since 1 October 2025 Poland has had a deposit return system.",opts:[["Take the deposit back","+1 coin."],["Donate the deposit to school tree planting","−1 token (offsetting). Planting trees does not replace cutting emissions."]]},
 heat:{title:"Heatwave",text:"The drink needs chilling.",opts:[["Chill it in the fridge at home","+1 token for electricity."],["Buy it chilled at the shop","No extra electricity at home, but it costs money."]]},
 tap:{title:"Tap water",text:"In Poland tap water is usually safe to drink.",opts:[["Fill the bottle with tap water","An extra use with no new production."],["Buy bottled water","An extra use, but +1 token for producing and transporting the water."],["Drink from a mug","No change."]]},
 wash:{title:"Laundry day",text:"Washing and drying make up the largest part of the use footprint of clothes.",opts:[["30°C and line drying","−2 tokens."],["40°C and tumble dryer","+1 token, but you save time and earn money: +1 coin."],["Wash less often, air it more","−1 token."]]},
 hole:{title:"Hole in the sleeve",text:"A small hole quickly becomes a big one.",opts:[["Darn it right away","−1 coin, +1 spare repair."],["Ignore it","The hole grows: −1 spare repair."]]},
 fashion:{title:"New fashion trend",text:"Everyone is wearing cropped T-shirts.",opts:[["Keep wearing it","No change."],["Remake the T-shirt (upcycling)","+1 use and +1 token, −1 coin."]]},
 battery:{title:"Battery getting weak",text:"The phone dies before the end of the day.",opts:[["Replace the battery now","−2 coins, −1 token and +1 spare repair."],["Charge it more often","+1 token."],["Buy a power bank","+1 token and −1 coin, but an extra use while travelling."]]},
 stream:{title:"Series night",text:"Streaming video uses energy in data centres and networks.",opts:[["4K streaming over mobile data","+2 tokens."],["Lower quality over Wi-Fi","−1 token."],["A board game instead of the series","−1 token, no income from the use (−1 coin)."]]},
 drop:{title:"Phone dropped on the pavement",text:"The screen survived, but it was close.",opts:[["Buy a case and a screen protector","−1 coin, +1 spare repair."],["Leave it as it is","Micro-crack: −1 spare repair."]]},
 rain:{title:"Downpour",text:"You're walking back from the shop and it's pouring.",opts:[["Run with the bag","The bag gets soaked and tears: no more reuse."],["Buy a plastic bag to cover it","+1 token and −1 coin, the bag survives."],["Wait it out in the shop","No footprint, but you lose time: −1 coin."]]},
 gift:{title:"A friend's birthday",text:"You need something to wrap a present in.",opts:[["Wrap the present in the bag","+1 use, but the bag stays with your friend: no more reuse."],["Buy wrapping paper","+1 token, −1 coin."],["Fold the bag and keep it","+1 spare reuse."]]},
 crack:{title:"Chipped neck",text:"The bottle can't be refilled any more.",opts:[["Put it in with the cullet","No more refills, but your next recycling is free."],["Turn it into a vase (upcycling)","+1 use, no more refills."]]},
 share:{title:"Your sibling wants to borrow it",text:"Your product can serve someone else too.",opts:[["Lend it","+1 use, but −1 spare repair (wear)."],["Don't lend it","No change."]]},
 calm:{title:"An ordinary day",text:"The product does what it was made for.",opts:[["Use it normally","No change."],["Earn some money after school","+1 coin, but you use the product harder: +1 token."]]}
};
function evL(id){
  const ev=EVENTS.find(e=>e.id===id);
  if(lang!=="en") return ev;
  const en=EVENTS_EN[id];
  return Object.assign({},ev,{title:en.title,text:en.text,opts:ev.opts.map((o,i)=>Object.assign({},o,{l:en.opts[i][0],d:en.opts[i][1]}))});
}

