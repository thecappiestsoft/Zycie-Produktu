/* Etapy cyklu życia, kolory graczy, pojemniki na odpady */
"use strict";
/* ===================== DANE ===================== */
const STAGES = ["E","P","T","U","K"];
const ST_PL = {
  E:{name:"Wydobycie", desc:"Pozyskanie surowca pierwotnego. Najpierw pytanie chemiczne (dobra odpowiedź −1 żeton, zła +1), potem wybór dostawcy surowca."},
  P:{name:"Produkcja", desc:"Przetworzenie surowca w gotowy produkt. To zwykle najbardziej energochłonny etap. Po recyklingu produkujesz z surowców wtórnych, co daje mniej żetonów."},
  T:{name:"Transport", desc:"Dostarczenie produktu do sklepu. Liczy się odległość i środek transportu."},
  U:{name:"Użytkowanie", desc:"Produkt służy właścicielowi: +1 użycie. Pociągnij kartę wydarzenia i zdecyduj, jak zareagujesz."},
  K:{name:"Koniec życia", desc:"Zdecyduj, co dalej z produktem. Im wyżej w hierarchii (ponowne użycie, naprawa, recykling), tym zwykle mniej żetonów."}
};
const ST_EN = {
  E:{name:"Extraction", desc:"Extracting the virgin raw material. First a chemistry question (right answer −1 token, wrong +1), then you choose a raw-material supplier."},
  P:{name:"Production", desc:"Turning the raw material into a finished product. This is usually the most energy-intensive stage. After recycling you produce from secondary raw materials, which costs fewer tokens."},
  T:{name:"Transport", desc:"Getting the product to the shop. Distance and mode of transport matter."},
  U:{name:"Use", desc:"The product serves its owner: +1 use. Draw an event card and decide how to react."},
  K:{name:"End of life", desc:"Decide what happens to the product next. The higher up the waste hierarchy (reuse, repair, recycling), the fewer tokens as a rule."}
};
const ST_COLOR = {E:"var(--z-e)",P:"var(--z-p)",T:"var(--z-t)",U:"var(--z-u)",K:"var(--z-k)"};
const stName = s => (lang==="en"?ST_EN:ST_PL)[s].name;
const stDesc = s => (lang==="en"?ST_EN:ST_PL)[s].desc;
const COLORS = ["#F2C14E","#5BC8EE","#F27BBD","#B9A2F5","#FF9A52"];
const BINS_PL = {
  yellow:"Żółty: metale i tworzywa sztuczne", green:"Zielony: szkło", blue:"Niebieski: papier",
  brown:"Brązowy: odpady biodegradowalne", black:"Czarny: odpady zmieszane",
  ewaste:"Punkt zbiórki elektroodpadów (sklep lub PSZOK)", textile:"Pojemnik na tekstylia lub PSZOK"
};
const BINS_EN = {
  yellow:"Yellow: metals and plastics", green:"Green: glass", blue:"Blue: paper",
  brown:"Brown: biowaste", black:"Black: mixed waste",
  ewaste:"E-waste collection point (shop or municipal collection point)", textile:"Textile bin or municipal collection point"
};
const BINS = () => lang==="en"?BINS_EN:BINS_PL;
const BIN_KEYS = Object.keys(BINS_PL);

