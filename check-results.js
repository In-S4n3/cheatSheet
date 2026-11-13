// Checks every "// result ==> value" comment in the cheat sheets by running the files.
// Run with: node check-results.js            (all files)
//           node check-results.js 01-JS-Fundamentals.js
//
// How a line is checked:
//   "Tiago".length; // result ==> 5            → the expression must equal 5
//   const total = sum([1, 2]); // result ==> 3 → the variable must equal 3
//   // result ==> 5  (hint)                     → text after two spaces in (brackets) is ignored
// A result that is not a plain value (e.g. "A, n, a" printed by console.log) is skipped and listed.
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");
const { spawnSync } = require("node:child_process");

const FILES = ["01-JS-Fundamentals.js", "02-LeetCode-Easy.js", "03-LeetCode-Medium.js", "04-Payments.js"];
const RESULT = /^(\s*)(.*?)\s*\/\/ result ==> (.+)$/;
const DECL = /^(?:const|let|var)\s+([A-Za-z_$][\w$]*)\s*=/;
const NOT_EXPR = /^(?:\/\/|return\b|if\b|for\b|while\b|}|{|else\b|case\b|throw\b|function\b|class\b)/;

// the expected value must be a plain value: it may only use globals, never the file's own variables
function parseValue(raw) {
  for (const v of [raw.replace(/\s{2,}\(.*\)\s*$/, ""), raw.replace(/\s+\([^()]*\)\s*$/, ""), raw]) {
    try {
      new Function(`return (${v.trim()});`)(); // throws on syntax errors and on unknown names like A, n
      return v.trim();
    } catch {}
  }
  return null;
}

function transform(src, file) {
  const skipped = [];
  let checked = 0;
  const lines = src.split("\n").map((line, i) => {
    const m = line.match(RESULT);
    if (!m || !m[2] || NOT_EXPR.test(m[2])) return line;
    const value = parseValue(m[3]);
    const where = `${file}:${i + 1}`;
    if (value === null) { skipped.push(`${where}  ${m[3].trim()}`); return line; }
    const stmt = m[2].replace(/;\s*$/, "");
    checked++;
    const decl = stmt.match(DECL);
    if (decl) return `${m[1]}${stmt}; __check(${decl[1]}, (${value}), ${JSON.stringify(where)});`;
    return `${m[1]}__check((${stmt}), (${value}), ${JSON.stringify(where)});`;
  });
  // helper is a function declaration at the END: it is hoisted, keeps line numbers and keeps a "use strict" on line 1 working
  lines.push(`function __check(a, e, w) { try { require("node:assert/strict").deepEqual(a, e); } catch { console.error("❌ " + w + "\\n   got:      " + require("node:util").inspect(a) + "\\n   expected: " + require("node:util").inspect(e)); process.exitCode = 1; } }`);
  return { code: lines.join("\n"), checked, skipped };
}

let failed = false;
for (const file of process.argv.slice(2).length ? process.argv.slice(2) : FILES) {
  const { code, checked, skipped } = transform(fs.readFileSync(path.join(__dirname, file), "utf8"), file);
  const tmp = path.join(os.tmpdir(), `checked-${process.pid}-${path.basename(file)}`);
  fs.writeFileSync(tmp, code);
  const run = spawnSync(process.execPath, [tmp], { encoding: "utf8", cwd: __dirname });
  fs.rmSync(tmp);
  const ok = run.status === 0;
  failed ||= !ok;
  console.log(`${ok ? "✅" : "❌"} ${file}: ${checked} results checked, ${skipped.length} skipped`);
  if (!ok) console.log((run.stderr || run.stdout).split("\n").slice(0, 20).join("\n"));
  if (process.env.SHOW_SKIPPED) skipped.forEach((s) => console.log("   skipped " + s));
}
process.exitCode = failed ? 1 : 0;
