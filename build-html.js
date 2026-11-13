// Generates cheatsheet.html from the repo files (to study on a phone).
// Run with: node build-html.js
const fs = require("node:fs");
const assert = require("node:assert/strict");

const read = (f) => fs.readFileSync(`${__dirname}/${f}`, "utf8");

// .js → sections split on "// §N ── NAME ──" or "// §N NAME" headers (may be indented, e.g. inside async main)
function jsSections(src) {
  const out = [];
  let cur = null;
  for (const line of src.split("\n")) {
    const m = line.match(/^\s*\/\/ §(\d+) (?:── )?(.+?)\s*(?:─+)?$/);
    if (m) {
      cur = { n: m[1], title: m[2].trim(), lines: [] };
      out.push(cur);
    } else if (cur && !/^\s*\/\/\s*[=─]{8,}\s*$/.test(line)) cur.lines.push(line); // "// ====" rulers wrap badly on phones; "//----" case separators stay (the page splits on them)
  }
  return out.map(({ n, title, lines }) => {
    while (lines.length && !lines.at(-1).trim()) lines.pop();
    while (lines.length && !lines[0].trim()) lines.shift();
    const indent = Math.min(...lines.filter((l) => l.trim()).map((l) => l.match(/^ */)[0].length));
    return { n, title, kind: "code", body: lines.map((l) => l.slice(indent)).join("\n") };
  });
}

// .md → sections split on "## §N Name"
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

const [payText, sources] = read("04-Payments.md").split(/^## Sources/m);
// each §N of the .md gets the matching §N code from the .js right below its text
const payCode = Object.fromEntries(jsSections(read("04-Payments.js")).map((s) => [s.n, s.body]));
assert.equal(Object.keys(payCode).length, 6, "04-Payments.js should have 6 code sections");
const paySections = mdSections(payText).map((s) =>
  payCode[s.n] ? { ...s, body: `${s.body}\n\n### Code (04-Payments.js)\n\n\`\`\`js\n${payCode[s.n]}\n\`\`\`` } : s
);

const tabs = [
  { id: "start", label: "Start", file: "README.md", sections: [{ n: "", title: "Which pattern?", kind: "md", body: read("README.md").split(/^## /m).slice(1).map((s) => "## " + s).join("\n") }] },
  { id: "js", label: "JS", file: "01-JS-Fundamentals.js", sections: jsSections(read("01-JS-Fundamentals.js")) },
  { id: "easy", label: "Easy", file: "02-LeetCode-Easy.js", sections: jsSections(read("02-LeetCode-Easy.js")) },
  { id: "medium", label: "Medium", file: "03-LeetCode-Medium.js", sections: jsSections(read("03-LeetCode-Medium.js")) },
  {
    id: "payments", label: "Payments", file: "04-Payments.md + .js",
    sections: [...paySections, ...(sources ? [{ n: "", title: "Sources", kind: "md", body: sources.trim() }] : [])],
  },
];

// self-check: no file may end up with zero sections
for (const t of tabs) assert.ok(t.sections.length > 0, `${t.file} has no sections`);
assert.ok(sources, "04-Payments.md is missing its '## Sources' heading");
const counts = Object.fromEntries(tabs.map((t) => [t.id, t.sections.length]));

const data = JSON.stringify(tabs).replace(/</g, "\\u003c"); // stops "</script>" from closing the tag
const html = read("page-template.html").replace("/*__DATA__*/null", data).replace("__BUILT__", new Date().toISOString().slice(0, 10));
fs.writeFileSync(`${__dirname}/cheatsheet.html`, html);
console.log("✅ cheatsheet.html generated", counts);
