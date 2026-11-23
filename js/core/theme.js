/* Motyw jasny/ciemny + ikony przełącznika */
"use strict";
/* ===================== MOTYW / THEME ===================== */
function loadTheme(){try{const v=localStorage.getItem("zp-theme");return v==="dark"||v==="light"?v:null}catch(e){return null}}
let theme = loadTheme();
function sysDark(){try{return window.matchMedia("(prefers-color-scheme: dark)").matches}catch(e){return false}}
function effTheme(){ const a=document.documentElement.getAttribute("data-theme"); return theme || (a==="dark"||a==="light"?a:(sysDark()?"dark":"light")); }
function applyTheme(){ const r=document.documentElement; r.classList.toggle("zp-dark",theme==="dark"); r.classList.toggle("zp-light",theme==="light"); }
function setTheme(t){ theme=t; try{localStorage.setItem("zp-theme",t)}catch(e){} applyTheme(); renderChrome(); }
const ICON_SUN = `<svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="4.5" fill="currentColor"/><path d="M12 2v2.5M12 19.5V22M2 12h2.5M19.5 12H22M4.9 4.9l1.8 1.8M17.3 17.3l1.8 1.8M4.9 19.1l1.8-1.8M17.3 6.7l1.8-1.8"/></svg>`;
const ICON_MOON = `<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M20.5 14.6A8.5 8.5 0 0 1 9.4 3.5a8.5 8.5 0 1 0 11.1 11.1z"/></svg>`;

