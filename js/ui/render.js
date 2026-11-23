/* Główny render: pasek górny + przełączanie widoków */
"use strict";
/* ===================== RENDER GŁÓWNY ===================== */
function renderChrome(){
  document.documentElement.lang = lang;
  document.getElementById("brandText").innerHTML = `<h1>${tr("Życie Produktu","Product Life")}</h1><small>${tr("Ślad węglowy i obieg zamknięty · klasa 8 i liceum · 2–5 graczy","Carbon footprint and the circular economy · ages 13–18 · 2–5 players")}</small>`;
  document.getElementById("topActions").innerHTML = `
    <div class="seg lang" role="group" aria-label="${tr("Język","Language")}">
      <button type="button" data-act="lang" data-l="pl" aria-pressed="${lang==="pl"}" lang="pl">PL</button>
      <button type="button" data-act="lang" data-l="en" aria-pressed="${lang==="en"}" lang="en">EN</button>
    </div>
    <div class="seg lang" role="group" aria-label="${tr("Motyw","Theme")}">
      <button type="button" data-act="theme" data-t="light" aria-pressed="${effTheme()==="light"}" aria-label="${tr("Tryb jasny","Light mode")}" title="${tr("Tryb jasny","Light mode")}">${ICON_SUN}</button>
      <button type="button" data-act="theme" data-t="dark" aria-pressed="${effTheme()==="dark"}" aria-label="${tr("Tryb ciemny","Dark mode")}" title="${tr("Tryb ciemny","Dark mode")}">${ICON_MOON}</button>
    </div>
    <button class="btn small" data-act="rules" type="button">${tr("Zasady","Rules")}</button>
    <button class="btn small" data-act="cards" type="button">${tr("Karty produktów","Product cards")}</button>
    ${S?`<button class="btn small" data-act="newgame" type="button">${tr("Nowa gra","New game")}</button>`:""}`;
}
function render(){
  renderChrome();
  if(!S) return renderSetup();
  if(S.phase==="draw") return renderDraw();
  if(S.phase==="play") return renderGame();
  if(S.phase==="end") return renderEnd();
}

