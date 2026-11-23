/* Okna: zasady gry i podgląd kart */
"use strict";
/* ---------- Okna ---------- */
const dlg=typeof document!=="undefined"?document.getElementById("dlg"):null;
let dlgKind=null;
function openDlg(kind){
  dlgKind=kind;
  const title = kind==="rules"?tr("Zasady gry","Game rules"):tr("Karty produktów","Product cards");
  const body = kind==="rules"?rulesHTML():cardsHTML();
  dlg.innerHTML=`<div class="dlg-head"><h2>${title}</h2><button class="btn small" type="button" data-act="closedlg">${tr("Zamknij","Close")}</button></div><div class="dlg-body">${body}</div>`;
  if(!dlg.open){ try{dlg.showModal()}catch(e){dlg.setAttribute("open","")} }
}
function rulesHTML(){
  if(lang==="en") return `<p><b>Goal:</b> take your product through its life cycle, collecting as few CO₂ tokens as possible, and make sure it reaches the minimum usefulness.</p>
  <ol>
    <li>Each player draws a product card. The pawn starts in the <b>Extraction</b> zone.</li>
    <li>Players take turns. On your turn you resolve the zone your pawn is in: choose a decision card, take CO₂ tokens and move on.</li>
    <li><b>Extraction:</b> a chemistry question about the raw material (right answer −1 token, wrong +1), then a choice of supplier: conventional, certified (−1 token, costs money) or cheapest (+1 token, earns money).</li>
    <li><b>Production:</b> standard line, renewable-powered factory, ecodesign (depends on the product, e.g. a modular smartphone) or “cheap and fast”. After recycling the lower value for secondary materials is the base.</li>
    <li><b>Transport:</b> local by truck or rail, or from another continent by ship or plane.</li>
    <li><b>Use:</b> +1 use. Draw an event card and choose one of 2–3 reactions.</li>
    <li><b>End of life:</b> repair at a service point or DIY (dice roll: 3–6 succeeds), sell second-hand (a second life: the product travels to its new owner), recycling (shortcut to Production), incineration or landfill (a new unit from Extraction). When recycling you answer which bin the product goes in: the right answer means 0 tokens instead of 1.</li>
    <li><b>Minimum usefulness:</b> only once the product has been used the required number of times do you end the cycle: by selling it, recycling it, incinerating it or sending it to landfill.</li>
    <li><b>Round news</b> (optional) changes the rules for everyone for one round.</li>
    <li><b>The winner</b> is the player with the fewest tokens. In a tie, the product used more times wins.</li>
  </ol>
  <h3>Budget variant</h3>
  <p>Everyone starts with 4 coins and gets 1 coin for each use. Green decisions usually cost money and cheap ones earn it. Packaging with a deposit gives a coin back when recycled. Landfill can always be chosen, even with no coins. Coins don't count towards the score. They make you choose what to invest in.</p>
  <h3>About the tokens</h3>
  <p>A CO₂ token is a notional unit. Values were chosen to reflect the proportions between stages of each product and to make products comparable in one game. The product cards show approximate real footprints in kg CO₂e. Different sources give different numbers because they count different stages and assume different energy sources.</p>
  <h3>Classroom variant</h3>
  <p>Students create their own product cards (in Settings: “Variant: your own product cards”), look for data on the carbon footprint and judge how reliable the source is. The game is set in Poland, so the bin colours and the deposit system follow Polish rules.</p>`;
  return `<p><b>Cel:</b> przeprowadź swój produkt przez cykl życia, zbierając jak najmniej żetonów CO₂, i zapewnij mu minimum użyteczności.</p>
  <ol>
    <li>Każdy gracz losuje kartę produktu. Pionek startuje w strefie <b>Wydobycie</b>.</li>
    <li>Gracze grają po kolei. W swojej turze rozpatrujesz strefę, w której stoi pionek: wybierasz kartę decyzji, pobierasz żetony CO₂ i przechodzisz dalej.</li>
    <li><b>Wydobycie:</b> pytanie chemiczne o surowiec (dobra odpowiedź −1 żeton, zła +1), potem wybór dostawcy: konwencjonalny, certyfikowany (−1 żeton, kosztuje) albo najtańszy (+1 żeton, daje zarobek).</li>
    <li><b>Produkcja:</b> linia standardowa, fabryka z OZE, ekoprojekt (zależny od produktu, np. projekt modułowy smartfona) albo „tanio i szybko”. Po recyklingu podstawą jest niższa wartość dla surowców wtórnych.</li>
    <li><b>Transport:</b> lokalnie ciężarówką lub koleją albo z innego kontynentu statkiem lub samolotem.</li>
    <li><b>Użytkowanie:</b> +1 użycie. Ciągniesz kartę wydarzenia i wybierasz jedną z 2–3 reakcji.</li>
    <li><b>Koniec życia:</b> naprawa w serwisie lub samodzielna (rzut kostką: 3–6 sukces), sprzedaż jako używany (drugie życie, produkt jedzie do nowego właściciela), recykling (skrót do Produkcji), spalarnia albo składowisko (nowy egzemplarz od Wydobycia). Przy recyklingu odpowiadasz, do którego pojemnika trafia produkt: dobra odpowiedź oznacza 0 żetonów zamiast 1.</li>
    <li><b>Minimum użyteczności:</b> dopiero gdy produkt został użyty wymaganą liczbę razy, kończysz cykl: sprzedażą, recyklingiem, w spalarni albo na składowisku.</li>
    <li><b>Wiadomości rundy</b> (opcjonalnie) zmieniają zasady dla wszystkich na jedną rundę.</li>
    <li><b>Wygrywa</b> gracz z najmniejszą liczbą żetonów. Przy remisie wygrywa produkt użyty więcej razy.</li>
  </ol>
  <h3>Wariant z budżetem</h3>
  <p>Każdy zaczyna z 4 monetami i dostaje 1 monetę za każde użycie. Zielone decyzje zwykle kosztują, a tanie przynoszą zarobek. Opakowania z kaucją oddają monetę przy recyklingu. Składowisko można wybrać zawsze, nawet bez monet. Monety nie liczą się do wyniku. Służą do tego, żeby trzeba było wybierać, w co zainwestować.</p>
  <h3>O żetonach</h3>
  <p>Żeton CO₂ to umowna jednostka. Wartości dobrano tak, żeby oddawały proporcje między etapami danego produktu i żeby produkty były porównywalne w jednej grze. Na kartach produktów znajdziesz orientacyjne rzeczywiste ślady w kg CO₂e. Różne źródła podają różne liczby, bo liczą różne etapy i zakładają inną energię.</p>
  <h3>Wariant dla klasy</h3>
  <p>Uczniowie tworzą własne karty produktów (w Ustawieniach: „Wariant: własne karty produktów”), szukają danych o śladzie węglowym i oceniają wiarygodność źródła.</p>`;
}
function cardsHTML(){
  const list=BASE_PRODUCTS.map(p=>prodById(p.id)).concat(S?S.customSnap:custom);
  return `<p class="muted">${tr("Liczby to podstawowe żetony CO₂ za etap. Koszty w monetach dotyczą wariantu z budżetem.","The numbers are the base CO₂ tokens per stage. Coin costs apply to the budget variant.")}</p><div class="pcards">${list.map(p=>productCard(p)).join("")}</div>`;
}

