/* Widok ustawień i edytor własnych kart */
"use strict";
/* ---------- Ustawienia ---------- */
function renderSetup(){
  const canResume = saved && saved.phase && saved.phase!=="end";
  view.innerHTML = `
  <div class="setup">
    <section class="panel intro">
      <div class="eyebrow">${tr("Gra planszowa w przeglądarce · 30–40 minut","Board game in your browser · 30–40 minutes")}</div>
      <h2>${tr("Przeprowadź swój produkt przez całe życie i zbierz jak najmniej CO₂","Take your product through its whole life and collect as little CO₂ as you can")}</h2>
      <p>${tr("Każdy gracz losuje produkt: puszkę, butelkę, koszulkę, smartfon albo torbę. Produkt wędruje przez pięć stref planszy. Na każdym etapie wybierasz jedną z kilku kart decyzji i pobierasz żetony CO₂. Recykling pozwala wrócić skrótem do Produkcji i pominąć Wydobycie.",
        "Each player draws a product: a can, a bottle, a T-shirt, a smartphone or a bag. The product travels through five zones on the board. At every stage you choose one of several decision cards and take CO₂ tokens. Recycling lets you take a shortcut back to Production and skip Extraction.")}</p>
      <div class="stagestrip">${STAGES.map((s,i)=>`<span class="stagechip" style="background:${ST_COLOR[s]}">${i+1}. ${stName(s)}</span>`).join("")}</div>
      <p>${tr("Wygrywa produkt z najmniejszą liczbą żetonów, ale tylko jeśli został użyty co najmniej tyle razy, ile wymaga minimum użyteczności. Gra prowadzi wszystkich przy jednym ekranie, np. na tablicy interaktywnej.",
        "The product with the fewest tokens wins, but only if it has been used at least as many times as the minimum usefulness requires. Everyone plays on one screen, for example on an interactive whiteboard.")}</p>
      <div class="note">${tr("<b>W każdej turze masz wybór:</b> dostawca surowca, linia produkcyjna, środek transportu, reakcja na wydarzenie, sposób zakończenia życia produktu. Do tego pytania chemiczne, pytanie o właściwy pojemnik, rzut kostką przy samodzielnej naprawie i wiadomości, które co rundę zmieniają zasady.",
        "<b>You have a choice every turn:</b> raw-material supplier, production line, mode of transport, reaction to an event, and how the product's life ends. Plus chemistry questions, a question about the right bin, a dice roll for DIY repairs and news that changes the rules every round.")}</div>
      ${canResume?`<div class="note"><b>${tr("Masz niedokończoną grę.","You have an unfinished game.")}</b> <button class="btn small primary" data-act="resume" type="button">${tr("Wznów zapisaną grę","Resume saved game")}</button></div>`:""}
    </section>
    <section class="panel">
      <h2>${tr("Ustawienia","Settings")}</h2>
      <div class="field">
        <label>${tr("Gracze lub drużyny (2–5)","Players or teams (2–5)")}</label>
        <div class="players-edit">
          ${setup.players.map((p,i)=>`<div class="prow">
            <span class="swatch" style="background:${COLORS[i]}"></span>
            <input type="text" id="pname${i}" data-pi="${i}" value="${esc(p.name)}" maxlength="24" aria-label="${tr("Nazwa gracza","Player name")} ${i+1}">
            <button class="btn small" type="button" data-act="delp" data-i="${i}" ${setup.players.length<=2?"disabled":""} aria-label="${tr("Usuń gracza","Remove player")} ${i+1}">${tr("Usuń","Remove")}</button>
          </div>`).join("")}
        </div>
        <div><button class="btn small" type="button" data-act="addp" ${setup.players.length>=5?"disabled":""}>${tr("Dodaj gracza","Add player")}</button></div>
        <p class="note">${tr("Wpisz imiona, ksywki albo nazwy drużyn. Nazwiska nie są potrzebne.","Enter first names, nicknames or team names. Surnames aren't needed.")}</p>
      </div>
      <div class="field">
        <label>${tr("Minimum użyteczności (ile razy produkt musi zostać użyty)","Minimum usefulness (how many times the product must be used)")}</label>
        <div class="seg" role="group" aria-label="${tr("Minimum użyć","Minimum uses")}">
          ${[2,3,4].map(n=>`<button type="button" data-act="minu" data-n="${n}" aria-pressed="${setup.minUses===n}">${n} ${n===2?tr("(krótka gra)","(short game)"):n===3?tr("(zalecane)","(recommended)"):tr("(długa gra)","(long game)")}</button>`).join("")}
        </div>
      </div>
      <label class="check"><input type="checkbox" id="optBudget" ${setup.budgetOn?"checked":""}> <span>${tr("<b>Wariant z budżetem.</b> Zielone decyzje kosztują monety, a tanie dają zarobek, więc trzeba wybierać. Bez budżetu gra jest prostsza (dla młodszych).",
        "<b>Budget variant.</b> Green decisions cost coins and cheap ones earn money, so you have to choose. Without the budget the game is simpler (for younger players).")}</span></label>
      <label class="check"><input type="checkbox" id="optNews" ${setup.newsOn?"checked":""}> <span>${tr("<b>Wiadomości rundy.</b> Na początku każdej rundy losujecie wiadomość, która zmienia zasady dla wszystkich (np. zatory w żegludze, tydzień kawiarni naprawczych).",
        "<b>Round news.</b> At the start of each round you draw a news item that changes the rules for everyone (e.g. shipping congestion, repair café week).")}</span></label>
      <label class="check"><input type="checkbox" id="optCustom" ${setup.useCustom?"checked":""}> <span>${tr("Dodaj do losowania własne karty produktów","Include your own product cards in the draw")} (${custom.length})</span></label>
      <button class="btn primary" type="button" data-act="draw">${tr("Losuj produkty","Draw products")}</button>
      <div class="msg err" role="status">${esc(setup.msg)}</div>
      ${renderCustomEditor()}
    </section>
  </div>`;
}

function renderCustomEditor(){
  const checks = lang==="en"
    ? ["I know who wrote the data (institution, company, scientist).","The source is dated and reasonably recent.","The source explains which life-cycle stages were counted.","The author has no interest in making the product look better than it is (e.g. a manufacturer's advert).","Another source gives a similar order of magnitude."]
    : ["Wiem, kto jest autorem danych (instytucja, firma, naukowiec).","Źródło podaje datę i jest w miarę aktualne.","Źródło wyjaśnia, które etapy cyklu życia policzono.","Autor nie ma interesu w pokazaniu produktu lepiej, niż jest (np. reklama producenta).","Inne źródło podaje podobny rząd wielkości."];
  const fields = [["E",tr("Wydobycie","Extraction"),2],["P",tr("Produkcja","Production"),5],["R",tr("Prod. z recyklingu","Recycled production"),3],["TL",tr("Transport lokalny","Local transport"),1],["TI",tr("Transport z innego kontynentu","Transport from another continent"),3],["U",tr("Jedno użycie","One use"),1],["L",tr("Składowisko","Landfill"),2],["N",tr("Naprawa","Repair"),1]];
  return `<details class="custom">
    <summary>${tr("Wariant: własne karty produktów","Variant: your own product cards")}</summary>
    <div class="stack" style="gap:12px;margin-top:12px">
      <p class="muted" style="font-size:.92rem">${tr("Wybierzcie produkt z codziennego życia, znajdźcie dane o jego śladzie węglowym i rozpiszcie je na żetony (0–12 na etap). Wpiszcie źródło i oceńcie jego wiarygodność.",
        "Pick an everyday product, find data on its carbon footprint and convert it into tokens (0–12 per stage). Enter the source and judge how reliable it is.")}</p>
      <div class="grid2">
        <div class="field"><label for="cName">${tr("Nazwa produktu","Product name")}</label><input type="text" id="cName" maxlength="30" placeholder="${tr("np. Kubek ceramiczny","e.g. Ceramic mug")}"></div>
        <div class="field"><label for="cMat">${tr("Główny materiał","Main material")}</label><input type="text" id="cMat" maxlength="30" placeholder="${tr("np. glina (krzemiany)","e.g. clay (silicates)")}"></div>
      </div>
      <div class="grid4">
        ${fields.map(([k,l,v])=>`<div class="field"><label for="c${k}">${l}</label><input type="number" id="c${k}" min="0" max="12" value="${v}"></div>`).join("")}
        <div class="field"><label for="cI">${tr("Spalarnia (puste = brak)","Incinerator (empty = none)")}</label><input type="number" id="cI" min="0" max="12" value=""></div>
        <div class="field"><label for="cRepMax">${tr("Ile napraw","Repairs allowed")}</label><input type="number" id="cRepMax" min="0" max="4" value="1"></div>
        <div class="field"><label for="cRecMax">${tr("Ile recyklingów","Recycling loops")}</label><input type="number" id="cRecMax" min="0" max="9" value="2"></div>
      </div>
      <div class="field"><label for="cBin">${tr("Gdzie wyrzucić do recyklingu?","Where does it go for recycling?")}</label><select id="cBin">${Object.entries(BINS()).map(([k,v])=>`<option value="${k}">${esc(v)}</option>`).join("")}</select></div>
      <label class="check"><input type="checkbox" id="cDep"> <span>${tr("Produkt objęty kaucją","Product has a deposit")}</span></label>
      <label class="check"><input type="checkbox" id="cSecond"> <span>${tr("Można go sprzedać lub oddać jako używany","Can be sold or given away second-hand")}</span></label>
      <div class="field"><label for="cQ">${tr("Pytanie chemiczne o surowiec","Chemistry question about the raw material")}</label><input type="text" id="cQ" maxlength="140" placeholder="${tr("np. Jaki minerał jest głównym składnikiem gliny?","e.g. Which mineral is the main component of clay?")}"></div>
      <div class="grid2">
        <div class="field"><label for="cA0">${tr("Poprawna odpowiedź","Correct answer")}</label><input type="text" id="cA0" maxlength="70"></div>
        <div class="field"><label for="cA1">${tr("Błędna odpowiedź 1","Wrong answer 1")}</label><input type="text" id="cA1" maxlength="70"></div>
        <div class="field"><label for="cA2">${tr("Błędna odpowiedź 2","Wrong answer 2")}</label><input type="text" id="cA2" maxlength="70"></div>
        <div class="field"><label for="cA3">${tr("Błędna odpowiedź 3","Wrong answer 3")}</label><input type="text" id="cA3" maxlength="70"></div>
      </div>
      <div class="field"><label for="cFact">${tr("Ciekawostka lub wyjaśnienie","Fact or explanation")}</label><textarea id="cFact" maxlength="300"></textarea></div>
      <div class="field"><label for="cSrc">${tr("Źródło danych (adres strony, tytuł raportu, autor)","Data source (web address, report title, author)")}</label><input type="text" id="cSrc" maxlength="200"></div>
      <div class="field"><label>${tr("Krytyczne czytanie źródła","Reading the source critically")}</label>
        ${checks.map((c,i)=>`<label class="check"><input type="checkbox" id="cChk${i}"> <span>${c}</span></label>`).join("")}
      </div>
      <div><button class="btn primary small" type="button" data-act="addcard">${tr("Zapisz kartę","Save card")}</button></div>
      <div class="msg" id="cMsg" role="status"></div>
      ${custom.length?`<div class="customlist">${custom.map(c=>`<div class="customitem"><span><b>${esc(c.name)}</b> <span class="muted">· ${tr("wiarygodność źródła","source reliability")} ${c.srcScore}/5</span></span><button class="btn small" type="button" data-act="delcard" data-id="${c.id}">${tr("Usuń","Remove")}</button></div>`).join("")}</div>`:""}
      <div class="field"><label for="cIO">${tr("Przenoszenie kart między komputerami (JSON)","Moving cards between computers (JSON)")}</label>
        <textarea id="cIO" placeholder="${tr("Wklej tu karty od innej grupy albo skopiuj swoje.","Paste cards from another group here or copy your own.")}"></textarea>
        <div style="display:flex;gap:8px;flex-wrap:wrap"><button class="btn small" type="button" data-act="exportcards">${tr("Pokaż i skopiuj moje karty","Show and copy my cards")}</button><button class="btn small" type="button" data-act="importcards">${tr("Wczytaj karty z pola","Load cards from the box")}</button></div>
      </div>
      <p class="muted" style="font-size:.85rem">${tr("Karty zapisują się tylko w tej przeglądarce. Karty uczniów wyświetlają się w języku, w którym je napisano.","Cards are saved in this browser only. Student cards are shown in the language they were written in.")}</p>
    </div>
  </details>`;
}

