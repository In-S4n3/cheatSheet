// Gera cheatsheet.html a partir dos ficheiros do repo (para estudar no telemóvel).
// Corre com: node build-html.js
const fs = require("node:fs");
const assert = require("node:assert/strict");

const read = (f) => fs.readFileSync(`${__dirname}/${f}`, "utf8");

// .js → secções pelos cabeçalhos "// §N ── NOME ──" (podem estar indentados, ex.: dentro de async main)
function jsSections(src) {
  const lines = src.split("\n");
  const out = [];
  let cur = null;
  for (const line of lines) {
    const m = line.match(/^\s*\/\/ §(\d+) (?:── )?(.+?)\s*(?:─+)?$/); // "// §N ── NOME ──" ou "// §N NOME"
    if (m) {
      cur = { n: m[1], title: m[2].trim(), lines: [] };
      out.push(cur);
    } else if (cur && !/^\s*\/\/\s*[=─\-]{8,}\s*$/.test(line)) cur.lines.push(line); // separadores "// ====" partem-se no telemóvel
  }
  return out.map(({ n, title, lines }) => {
    while (lines.length && !lines.at(-1).trim()) lines.pop();
    while (lines.length && !lines[0].trim()) lines.shift();
    const indent = Math.min(...lines.filter((l) => l.trim()).map((l) => l.match(/^ */)[0].length));
    return { n, title, kind: "code", body: lines.map((l) => l.slice(indent)).join("\n") };
  });
}

// .md → secções pelos "## §N Nome"
function mdSections(src) {
  return src
    .split(/^(?=## §\d+ )/m)
    .slice(1)
    .map((chunk) => {
      const [head, ...rest] = chunk.split("\n");
      const m = head.match(/^## §(\d+) (.+)$/);
      return { n: m[1], title: m[2].trim(), kind: "md", body: rest.join("\n").replace(/\n---\s*$/, "").trim() };
    });
}

const pagMd = read("04-Pagamentos.md");
const fontes = pagMd.split(/^## Fontes/m)[1];
// cada §N do .md leva o código §N do .js logo a seguir ao texto
const pagCode = Object.fromEntries(jsSections(read("04-Pagamentos.js")).map((s) => [s.n, s.body]));
const pagSections = mdSections(pagMd.split(/^## Fontes/m)[0]).map((s) =>
  pagCode[s.n] ? { ...s, body: `${s.body}\n\n### Código (04-Pagamentos.js)\n\n\`\`\`js\n${pagCode[s.n]}\n\`\`\`` } : s
);
assert.equal(Object.keys(pagCode).length, 6, "04-Pagamentos.js devia ter 6 secções de código");
const tabs = [
  { id: "inicio", label: "Início", file: "README.md", sections: [{ n: "", title: "Que padrão uso?", kind: "md", body: read("README.md").split(/^## /m).slice(1).map((s) => "## " + s).join("\n") }] },
  { id: "fundamentos", label: "JS", file: "01-JS-Fundamentos.js", sections: jsSections(read("01-JS-Fundamentos.js")) },
  { id: "facil", label: "Fácil", file: "02-LeetCode-Facil.js", sections: jsSections(read("02-LeetCode-Facil.js")) },
  { id: "medio", label: "Médio", file: "03-LeetCode-Medio.js", sections: jsSections(read("03-LeetCode-Medio.js")) },
  {
    id: "pagamentos", label: "Pagamentos", file: "04-Pagamentos.md + .js",
    sections: [
      ...pagSections,
      ...(fontes ? [{ n: "", title: "Fontes", kind: "md", body: fontes.trim() }] : []),
    ],
  },
];

// auto-verificação: nenhum ficheiro pode ficar sem secções
for (const t of tabs) assert.ok(t.sections.length > 0, `${t.file} sem secções`);
const counts = Object.fromEntries(tabs.map((t) => [t.id, t.sections.length]));

const data = JSON.stringify(tabs).replace(/</g, "\\u003c"); // impede "</script>" de fechar a tag
const html = read("page-template.html").replace("/*__DATA__*/null", data).replace("__BUILT__", new Date().toISOString().slice(0, 10));
fs.writeFileSync(`${__dirname}/cheatsheet.html`, html);
console.log("✅ cheatsheet.html gerado", counts);
