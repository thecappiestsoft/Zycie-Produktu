// Składa projekt w jeden samodzielny plik dist/index.html (np. do publikacji jako artefakt).
// Użycie: node tools/build.mjs   (Node 18+, bez zależności)
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
let html = readFileSync(join(root, "index.html"), "utf8");

html = html.replace(/<link rel="stylesheet" href="(css\/[^"]+)">\n?/g, (_, p) =>
  `<style>/* ${p} */\n${readFileSync(join(root, p), "utf8")}</style>\n`);
html = html.replace(/<script src="(js\/[^"]+)"><\/script>\n?/g, (_, p) =>
  `<script>/* ${p} */\n${readFileSync(join(root, p), "utf8").replace(/<\/script/gi, "<\\/script")}</script>\n`);

mkdirSync(join(root, "dist"), { recursive: true });
writeFileSync(join(root, "dist", "index.html"), html);
console.log(`dist/index.html: ${(Buffer.byteLength(html) / 1024).toFixed(1)} KB`);
