/* Obsługa zdarzeń (delegacja data-act) i start aplikacji */
"use strict";
/* ---------- Zdarzenia ---------- */
if(typeof document!=="undefined"){
document.addEventListener("click",e=>{
  const b=e.target.closest("[data-act]"); if(!b||b.disabled) return;
  const a=b.dataset.act;
  switch(a){
    case "lang": setLang(b.dataset.l); break;
    case "theme": setTheme(b.dataset.t); break;
    case "rules": openDlg("rules"); break;
    case "cards": openDlg("cards"); break;
    case "closedlg": dlg.close(); break;
    case "addp": syncNames(); if(setup.players.length<5) setup.players.push({name:tr("Drużyna ","Team ")+(setup.players.length+1)}); render(); break;
    case "delp": syncNames(); if(setup.players.length>2) setup.players.splice(+b.dataset.i,1); render(); break;
    case "minu": syncNames(); setup.minUses=+b.dataset.n; render(); break;
    case "draw": startDraw(); break;
    case "redraw": setup.players=S.players.map(p=>({name:p.name})); S=null; startDraw(); break;
    case "start": S.phase="play"; S.tp=null; drawNews(); persist(); render(); break;
    case "resume": S=saved; render(); break;
    case "answer": act_answer(+b.dataset.a); break;
    case "opt": act_opt(b.dataset.opt); break;
    case "drawevent": act_drawevent(); break;
    case "bin": act_bin(b.dataset.k); break;
    case "endturn": endTurn(); break;
    case "newgame":
      if(S && S.phase==="play" && b.dataset.confirm!=="1"){ b.dataset.confirm="1"; b.textContent=tr("Na pewno? Kliknij ponownie","Sure? Click again"); setTimeout(()=>{if(b.isConnected){b.dataset.confirm="";b.textContent=tr("Nowa gra","New game");}},3500); break; }
      if(S) setup.players=S.players.map(p=>({name:p.name}));
      drop(K_GAME); saved=null; S=null; render(); window.scrollTo({top:0}); break;
    case "replay": setup.players=S.players.map(p=>({name:p.name})); setup.minUses=S.settings.minUses; setup.budgetOn=S.settings.budgetOn; setup.newsOn=S.settings.newsOn; S=null; drop(K_GAME); startDraw(); break;
    case "addcard": addCard(); break;
    case "delcard": custom=custom.filter(c=>c.id!==b.dataset.id); save(K_CARDS,custom); render(); document.querySelector("details.custom").open=true; break;
    case "exportcards": {
      const t=document.getElementById("cIO"); t.value=JSON.stringify(custom,null,1); t.select();
      try{ navigator.clipboard.writeText(t.value).catch(()=>{}); }catch(err){}
      break; }
    case "importcards": {
      const m=document.getElementById("cMsg");
      try{ const arr=JSON.parse(document.getElementById("cIO").value);
        if(!Array.isArray(arr)) throw 0;
        const ok=arr.filter(c=>c&&c.name&&c.quiz&&c.quiz[0]&&Array.isArray(c.quiz[0].a)&&c.quiz[0].a.length===4&&["E","P","R","TL","TI","U","L"].every(k=>typeof c[k]==="number")).map(normCustom);
        custom=custom.concat(ok); save(K_CARDS,custom); render(); document.querySelector("details.custom").open=true;
        const m2=document.getElementById("cMsg"); m2.className="msg ok"; m2.textContent=tr(`Wczytano karty: ${ok.length}.`,`Cards loaded: ${ok.length}.`);
      }catch(err){ m.className="msg err"; m.textContent=tr("Nie udało się odczytać kart. Wklej cały tekst skopiowany przyciskiem „Pokaż i skopiuj moje karty”.","Couldn't read the cards. Paste the whole text copied with “Show and copy my cards”."); }
      break; }
  }
});
document.addEventListener("change",e=>{
  if(e.target.id==="optBudget"){ syncNames(); setup.budgetOn=e.target.checked; }
  if(e.target.id==="optNews"){ syncNames(); setup.newsOn=e.target.checked; }
  if(e.target.id==="optCustom"){ syncNames(); setup.useCustom=e.target.checked; }
});
document.addEventListener("input",e=>{ if(e.target.dataset && e.target.dataset.pi!==undefined) setup.players[+e.target.dataset.pi].name=e.target.value; });
dlg.addEventListener("click",e=>{ if(e.target===dlg) dlg.close(); });
applyTheme();
try{ window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change",()=>{ if(!theme) renderChrome(); }); }catch(e){}
render();
}
