/* Wiadomości rundy, pytania do dyskusji */
"use strict";
/* Wiadomości rundy */
const NEWS = [
 {id:"calm"},{id:"eco",ecoFree:true,budget:true},{id:"ship",farPlus:1},{id:"wind",greenDisc:1,budget:true},
 {id:"repair",repairDisc:1,budget:true},{id:"landfee",landfillFee:1,budget:true},{id:"epr",recycleFree:true,budget:true},
 {id:"coal",cheapNoMoney:true,budget:true},{id:"heat",usePlus:1},{id:"rail",railDisc:1,budget:true}
];
const NEWS_TXT = {
 calm:{pl:["Spokojny tydzień","Żadnych zmian w przepisach ani na rynku."],en:["A quiet week","No changes to regulations or the market."]},
 eco:{pl:["Unijne przepisy o ekoprojekcie","Karta ekoprojektu w Produkcji nie kosztuje monet."],en:["EU ecodesign rules","The ecodesign card in Production costs no coins."]},
 ship:{pl:["Zatory w kanałach żeglugowych","Statki płyną naokoło Afryki: transport z innego kontynentu +1 żeton."],en:["Congestion on shipping canals","Ships sail around Africa: transport from another continent +1 token."]},
 wind:{pl:["Wietrzna jesień","Zielona energia tanieje: fabryka z OZE kosztuje o 1 monetę mniej."],en:["A windy autumn","Green energy gets cheaper: the renewable-powered factory costs 1 coin less."]},
 repair:{pl:["Tydzień kawiarni naprawczych","Naprawy kosztują o 1 monetę mniej."],en:["Repair café week","Repairs cost 1 coin less."]},
 landfee:{pl:["Wyższa opłata za składowanie","Składowisko kosztuje 2 monety zamiast 1."],en:["Higher landfill fee","Landfill costs 2 coins instead of 1."]},
 epr:{pl:["Producenci płacą za zbiórkę","Rozszerzona odpowiedzialność producenta: recykling bez opłaty."],en:["Producers pay for collection","Extended producer responsibility: recycling is free."]},
 coal:{pl:["Drożeją uprawnienia do emisji","„Tanio i szybko” w Produkcji nie przynosi już monety."],en:["Emission allowances get pricier","“Cheap and fast” in Production no longer earns a coin."]},
 heat:{pl:["Fala upałów","Chłodzenie i klimatyzacja: każde użycie +1 żeton."],en:["Heatwave","Cooling and air conditioning: every use +1 token."]},
 rail:{pl:["Nowa bocznica kolejowa","Transport koleją kosztuje tyle samo co ciężarówką."],en:["New railway siding","Rail transport costs the same as by truck."]}
};

const DISCUSS = {
 pl:["Która decyzja najbardziej obniżyła ślad waszego produktu? Dlaczego właśnie ta?",
  "Co przeszkadzało: budżet, wydarzenia, ograniczenia materiału, a może brak wiedzy?",
  "Kiedy wybór najtańszej opcji był kuszący? Kto w prawdziwym życiu płaci za tani produkt z dużym śladem?",
  "Na którym etapie wasz produkt zebrał najwięcej żetonów? Czy dla wszystkich produktów to ten sam etap?",
  "Co z gry możecie zrobić naprawdę, już w tym tygodniu?"],
 en:["Which decision lowered your product's footprint the most? Why that one?",
  "What got in the way: the budget, events, material limits, or gaps in knowledge?",
  "When was the cheapest option tempting? In real life, who pays for a cheap product with a big footprint?",
  "At which stage did your product collect the most tokens? Is it the same stage for every product?",
  "What from the game can you actually do this week?"]
};
const HOPE = {
 pl:[["Protokół montrealski (1987)","Świat wycofał freony niszczące ozon. Dziura ozonowa się zmniejsza, a warstwa ozonowa nad Antarktydą ma się odbudować około 2066 r."],
  ["Czystsze rzeki w Europie","Oczyszczalnie ścieków i limity zrzutów poprawiły jakość wielu rzek. Do Renu wróciły łososie."],
  ["Mniej SO₂ w Polsce","Od 1990 r. emisja dwutlenku siarki spadła o ponad 80% dzięki odsiarczaniu spalin w elektrowniach. Kwaśnych deszczów jest dużo mniej."],
  ["Aluminium w obiegu","Większość aluminium wyprodukowanego w historii wciąż jest w użyciu, bo przetapianie złomu jest tańsze i zużywa ok. 95% mniej energii."]],
 en:[["The Montreal Protocol (1987)","The world phased out ozone-depleting CFCs. The ozone hole is shrinking, and the ozone layer over Antarctica is expected to recover around 2066."],
  ["Cleaner rivers in Europe","Wastewater treatment plants and discharge limits have improved many rivers. Salmon have returned to the Rhine."],
  ["Less SO₂ in Poland","Since 1990 sulfur dioxide emissions have fallen by more than 80% thanks to flue-gas desulfurisation at power plants. Acid rain is far less common."],
  ["Aluminium in circulation","Most of the aluminium ever produced is still in use, because remelting scrap is cheaper and takes about 95% less energy."]]
};

