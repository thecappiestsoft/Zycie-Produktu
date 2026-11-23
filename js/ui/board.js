/* Plansza SVG */
"use strict";
/* ---------- Plansza ---------- */
function pos(i,r=140){const a=(-90+i*72)*Math.PI/180;return [200+r*Math.cos(a),200+r*Math.sin(a)];}
function pt(a,r=140){const t=a*Math.PI/180;return [200+r*Math.cos(t),200+r*Math.sin(t)];}
function towards([x1,y1],[x2,y2],d){const dx=x2-x1,dy=y2-y1,l=Math.hypot(dx,dy);return [x1+dx/l*d,y1+dy/l*d];}
function boardSVG(){
  const cp = S.players[S.cur];
  let arcs="";
  for(let i=0;i<5;i++){
    const [x1,y1]=pt(-90+i*72+20),[x2,y2]=pt(-90+(i+1)*72-21);
    arcs+=`<path class="flow" d="M${x1.toFixed(1)} ${y1.toFixed(1)} A140 140 0 0 1 ${x2.toFixed(1)} ${y2.toFixed(1)}" marker-end="url(#mM)"/>`;
  }
  const K=pos(4),P=pos(1),U=pos(3);
  const c1=[200,232], s1=towards(K,c1,46), e1=towards(P,c1,50);
  const c2=[150,238], s2=towards(K,c2,46), e2=towards(U,c2,50);
  const hot = cp && cp.stage==="K" && !cp.finished;
  const nodes = STAGES.map((s,i)=>{
    const [x,y]=pos(i); const act = cp && !cp.finished && cp.stage===s;
    const lines = s==="K"?tr(["Koniec","życia"],["End of","life"]):[stName(s)];
    return `<g class="node ${act?"active":""}"><circle class="base" cx="${x}" cy="${y}" r="42" fill="${ST_COLOR[s]}"/>
      <text class="num" x="${x}" y="${y-(lines.length>1?16:9)}">${i+1}</text>
      ${lines.map((l,j)=>`<text x="${x}" y="${y+(lines.length>1?2+j*14:7)}">${l}</text>`).join("")}</g>`;
  }).join("");
  const groups={}; S.players.forEach((p,i)=>{ if(p.finished) return; (groups[p.stage]=groups[p.stage]||[]).push(i); });
  let pawns="";
  Object.entries(groups).forEach(([s,list])=>{
    const base=-90+STAGES.indexOf(s)*72;
    list.forEach((pi,k)=>{
      const off=(k-(list.length-1)/2)*11;
      const [x,y]=pt(base+off,193);
      const p=S.players[pi], isCur=pi===S.cur;
      pawns+=`<g class="pawn ${isCur?"cur":""}">${isCur?`<circle class="halo" cx="${x}" cy="${y}" r="15"/>`:""}<circle cx="${x}" cy="${y}" r="10.5" fill="${p.color}"/><text x="${x}" y="${y+3.5}">${pi+1}</text><title>${esc(p.name)}</title></g>`;
    });
  });
  const done = S.players.filter(p=>p.finished).length;
  return `<svg class="board" viewBox="-40 -40 480 480" role="img" aria-label="${tr("Plansza: obieg pięciu stref z pionkami graczy","Board: a loop of five zones with the players' pawns")}">
    <defs>
      <marker id="mM" viewBox="0 0 10 10" refX="7" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path class="arrowM" d="M0 0 L10 5 L0 10z"/></marker>
      <marker id="mA" viewBox="0 0 10 10" refX="7" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path class="arrowA" d="M0 0 L10 5 L0 10z"/></marker>
      <marker id="mR" viewBox="0 0 10 10" refX="7" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path class="arrowR" d="M0 0 L10 5 L0 10z"/></marker>
    </defs>
    <circle class="ring" cx="200" cy="200" r="140"/>
    ${arcs}
    <path class="short ${hot?"hot":""}" d="M${s1[0].toFixed(1)} ${s1[1].toFixed(1)} Q${c1[0]} ${c1[1]} ${e1[0].toFixed(1)} ${e1[1].toFixed(1)}" marker-end="url(#mA)"/>
    <text class="slabel" x="236" y="203">${tr("Recykling: skrót","Recycling: shortcut")}</text>
    <path class="repairpath" d="M${s2[0].toFixed(1)} ${s2[1].toFixed(1)} Q${c2[0]} ${c2[1]} ${e2[0].toFixed(1)} ${e2[1].toFixed(1)}" marker-end="url(#mR)"/>
    <text class="rlabel" x="136" y="258">${tr("Naprawa","Repair")}</text>
    <text class="clabel" x="236" y="232">${tr("Runda","Round")} ${S.round}</text>
    <text class="clabel" x="236" y="247">${tr("Ukończyło","Finished")}: ${done}/${S.players.length}</text>
    ${nodes}${pawns}
  </svg>`;
}

