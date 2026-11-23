# Życie Produktu — wersja deweloperska

Edukacyjna gra planszowa (przeglądarkowa) o śladzie węglowym w cyklu życia produktu i gospodarce o obiegu zamkniętym. Wiek 13–18 lat, 2–5 graczy, PL/EN, motyw jasny/ciemny.

Projekt to czysty HTML + CSS + JavaScript, **bez frameworków i bez zależności**. Kod został rozdzielony z jednoplikowej wersji artefaktu na osobne pliki — działa identycznie.

## Uruchomienie

Najprościej: otwórz `index.html` w przeglądarce (działa także z `file://`).

Z lokalnym serwerem (zalecane przy pracy nad kodem):

```bash
npm run dev          # http://localhost:5173  (npx serve)
# albo
python3 -m http.server 5173
```

## Budowanie wersji jednoplikowej

```bash
npm run build        # => dist/index.html (wszystkie CSS i JS wklejone inline)
```

Plik `dist/index.html` można opublikować jako artefakt, wysłać mailem albo wgrać na dowolny hosting statyczny. Wymaga Node 18+.

## Struktura

```
zycie-produktu/
├── index.html                  # szkielet strony + kolejność ładowania CSS/JS
├── css/
│   ├── tokens.css              # zmienne kolorów i fontów, motyw jasny/ciemny
│   ├── base.css                # reset, typografia, przyciski, focus
│   ├── layout.css              # pasek górny, stopka
│   ├── components/
│   │   ├── product-card.css    # karta produktu
│   │   ├── widgets.css         # wiadomość rundy, kostka, kroki
│   │   └── dialog.css          # okna dialogowe
│   └── views/
│       ├── setup.css           # ekran ustawień + edytor własnych kart
│       ├── board.css           # plansza SVG
│       ├── turn.css            # karta bieżącej tury
│       ├── scores.css          # tabela graczy, dziennik
│       └── end.css             # losowanie i ranking końcowy
├── js/
│   ├── core/
│   │   ├── i18n.js             # tr(), L(), both() — tłumaczenia PL/EN
│   │   ├── theme.js            # przełącznik motywu
│   │   └── state.js            # stan gry S, ustawienia, zapis w localStorage
│   ├── data/                   # ★ TREŚCI — tu najczęściej się edytuje
│   │   ├── stages.js           # 5 etapów (E,P,T,U,K), kolory graczy, pojemniki
│   │   ├── products.js         # karty produktów (PL): parametry, quiz, ciekawostki
│   │   ├── products.en.js      # tłumaczenia EN kart produktów
│   │   ├── events.js           # karty wydarzeń (etap Użytkowanie)
│   │   └── news.js             # wiadomości rundy, pytania do dyskusji
│   ├── game/
│   │   ├── options.js          # reguły: opcje i koszty na każdym etapie
│   │   ├── turn.js             # przebieg tury + widok gry
│   │   └── actions.js          # akcje gracza (odpowiedź, wybór, koniec tury)
│   ├── ui/
│   │   ├── render.js           # render() — przełącza widoki wg S.phase
│   │   ├── setup.js            # ekran ustawień
│   │   ├── draw.js             # losowanie produktów, productCard()
│   │   ├── board.js            # boardSVG()
│   │   ├── end.js              # ranking i podsumowanie
│   │   ├── dialogs.js          # „Zasady” i „Karty produktów”
│   │   └── custom-cards.js     # karty tworzone przez uczniów, setLang()
│   └── main.js                 # delegacja kliknięć (data-act) i start
├── tools/build.mjs             # skrypt budujący dist/index.html
└── package.json
```

## Ważne zasady architektury

- **Skrypty klasyczne, nie moduły ES.** Wszystkie pliki `js/` dzielą jeden zakres globalny (`const`/`let`/`function` na najwyższym poziomie są widoczne w innych plikach). Dzięki temu gra działa z `file://` bez serwera. **Kolejność `<script>` w `index.html` ma znaczenie** — nowy plik dodaj w odpowiednim miejscu (dane przed logiką, `main.js` na końcu).
- **Render = zbudowanie HTML jako string i podmiana `innerHTML`.** Po każdej zmianie stanu wywołuje się `render()`. Tekst od użytkownika zawsze przepuszczaj przez `esc()`.
- **Zdarzenia przez atrybut `data-act`.** Przyciski mają `data-act="..."`, a jeden handler w `main.js` (`switch`) rozdziela akcje. Nowy przycisk = nowy `case`.
- **Tłumaczenia:** w kodzie `tr("tekst PL", "text EN")`; dane produktów PL są w `products.js`, a nakładka EN w `products.en.js` (te same klucze, ta sama kolejność odpowiedzi w quizie).
- **Kolory tylko przez zmienne CSS** z `tokens.css` (np. `var(--accent)`, `var(--z-e)` dla etapów). Każdą nową zmienną dodaj w obu motywach i w blokach `.zp-light` / `.zp-dark`.
- **localStorage:** klucze `zp-game-v2` (zapis gry), `zp-cards-v1` (własne karty), `zp-lang`, `zp-theme`. Przy zmianie formatu zapisu gry podbij wersję klucza w `state.js`.

## Jak dodać nowy produkt

1. W `js/data/products.js` dopisz obiekt do `BASE_PRODUCTS`. Najważniejsze pola (wartości = żetony CO₂):
   | pole | znaczenie |
   |---|---|
   | `E` | Wydobycie surowca pierwotnego |
   | `P` / `R` | Produkcja z surowca pierwotnego / z recyklatu |
   | `TL` / `TI` | Transport lokalny / międzykontynentalny |
   | `U` | Użytkowanie (jedno użycie) |
   | `L` / `I` | Składowisko / spalarnia (`null` = brak opcji) |
   | `N`, `repairMax`, `repairCost`, `selfRepair` | Naprawa: żetony, limit, koszt w monetach, naprawa samodzielna |
   | `second` | czy można sprzedać jako używany |
   | `recycleMax` | ile razy można odzyskać materiał |
   | `deposit`, `bin` | kaucja; właściwy pojemnik (klucz z `BINS_PL`) |
   | `src`, `eco` | opcja certyfikowanego dostawcy i ekoprojektu |
   | `quiz` | pytania; **pierwsza odpowiedź w `a` jest poprawna** (gra tasuje) |
2. W `js/data/products.en.js` dodaj tłumaczenie pod tym samym `id`.

## Jak zmienić reguły

Koszty i dostępność opcji na etapach: `js/game/options.js` (`sourceOptions`, `prodOptions`, `transOptions`, `koOptions`, `eventOptions`). Skutki wyboru (ruch pionka, recykling, naprawa): `act_opt()` w `js/game/actions.js`.

---
© 2026 CappySoft.pl
