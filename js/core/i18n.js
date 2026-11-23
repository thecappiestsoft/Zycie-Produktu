/* Język PL/EN: tr(), L(), both(), formatowanie */
"use strict";
/* ===================== JĘZYK / LANGUAGE ===================== */
function loadL(){try{const v=localStorage.getItem("zp-lang");return v==="en"?"en":"pl"}catch(e){return "pl"}}
let lang = loadL();
const tr = (pl,en) => lang==="en" ? en : pl;
const L = x => (x && typeof x==="object") ? (x[lang] ?? x.pl) : x;
function both(fn){ const o=lang, r={}; for(const l of ["pl","en"]){ lang=l; r[l]=fn(); } lang=o; return r; }
const fmt1 = n => lang==="en" ? n.toFixed(1) : n.toFixed(1).replace(".",",");
const q2 = s => tr(`„${s}”`,`“${s}”`);

