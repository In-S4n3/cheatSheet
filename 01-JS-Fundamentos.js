// =============================================================================
// 01 — JAVASCRIPT FUNDAMENTOS (cheat sheet que corre e se verifica sozinho)
// Correr:  node 01-JS-Fundamentos.js   → tem de acabar em "✅ Fundamentos OK"
// Testado em Node 26. Cada assert é a "resposta": se falhar, o ficheiro rebenta.
// Procurar: Ctrl+F "§7" salta para a secção 7.
// =============================================================================
//
// ÍNDICE
//   §1  Variáveis (let/const/var, hoisting, TDZ)
//   §2  Tipos e conversões
//   §3  Operadores (== vs ===, ??, ?., lógicos, atribuição)
//   §4  Truthy / Falsy
//   §5  Condicionais (if, switch, ternário, lookup)
//   §6  Loops (for, while, for...of, for...in, break/continue)
//   §7  Strings
//   §8  Números e Math
//   §9  Arrays — básico e métodos que MUDAM o original
//   §10 Arrays — métodos que NÃO mudam (map, filter, reduce…)
//   §11 Ordenar (sort / toSorted)
//   §12 Objetos (+ JSON)
//   §13 Destructuring, spread, rest
//   §14 Map, Set, WeakMap
//   §15 Cópias: shallow vs deep
//   §16 Funções (declaração, expressão, arrow, callbacks)
//   §17 Closures
//   §18 this, call/apply/bind
//   §19 Classes e protótipos
//   §20 Erros (try/catch/finally, throw)
//   §21 Datas
//   §22 Regex
//   §23 Promises e async/await
//   §24 Event loop (microtask vs macrotask)
//   §25 Timers (setTimeout, setInterval)
//   §26 Módulos (import/export vs require)
//   §27 Estruturas de dados → ver 02-LeetCode-Facil.js
//
// LEGENDA nas tabelas:  método → o que faz → muda o original?
// =============================================================================

"use strict"; // comportamento igual ao de classes e módulos ES (ver §18)
const assert = require("node:assert/strict");

// §1 ── VARIÁVEIS ──────────────────────────────────────────────────────────────
// O QUE É: guardar valores. Regra: const por defeito, let se reatribuis, var nunca.
//
//   palavra → âmbito (scope)   → reatribuir? → hoisting
//   const   → bloco { }        → não        → sim, mas TDZ (erro se usar antes)
//   let     → bloco { }        → sim        → sim, mas TDZ
//   var     → função inteira   → sim        → sim, vale undefined antes
//
// const NÃO torna o valor imutável: impede só reatribuir a variável.
const lista = [1, 2];
lista.push(3); // ok: muda o conteúdo, não a variável
assert.deepEqual(lista, [1, 2, 3]);
assert.throws(() => {
  const x = 1;
  x = 2; // reatribuir const
}, TypeError);

// Âmbito de bloco: let/const ficam presos dentro das { }; var escapa.
{
  var escapa = "var";
  let preso = "let";
}
assert.equal(escapa, "var");
assert.equal(typeof preso, "undefined"); // não existe cá fora

// Hoisting: a declaração "sobe" para o topo do âmbito.
function hoistingVar() {
  const antes = v; // var já existe, mas sem valor
  var v = 10;
  return antes;
}
assert.equal(hoistingVar(), undefined);

// TDZ (Temporal Dead Zone): let/const existem mas não se podem tocar antes da linha.
assert.throws(() => {
  y; // ReferenceError
  let y = 1;
}, ReferenceError);

// Declarar vs atribuir:
let nome; // declarar → vale undefined
nome = "Tiago"; // atribuir
assert.equal(nome, "Tiago");

// §2 ── TIPOS ──────────────────────────────────────────────────────────────────
// O QUE É: 7 primitivos (copiados por VALOR) + object (copiado por REFERÊNCIA).
// Primitivos: string, number, bigint, boolean, undefined, null, symbol.
// Objetos: {}, [], funções, Date, Map, Set…
assert.equal(typeof "olá", "string");
assert.equal(typeof 42, "number");
assert.equal(typeof 42n, "bigint");
assert.equal(typeof true, "boolean");
assert.equal(typeof undefined, "undefined");
assert.equal(typeof Symbol("id"), "symbol");
assert.equal(typeof null, "object"); // ⚠ bug histórico: null NÃO é objeto
assert.equal(typeof [], "object"); // ⚠ arrays também dão "object"
assert.equal(Array.isArray([]), true); // ✔ forma certa de testar array
assert.equal(typeof function () {}, "function");

// undefined = "não tem valor ainda"; null = "vazio de propósito".

// Valor vs referência:
let p1 = 5;
let p2 = p1;
p2++;
assert.equal(p1, 5); // primitivo: cópia independente
const o1 = { n: 5 };
const o2 = o1; // mesma referência, mesmo objeto
o2.n++;
assert.equal(o1.n, 6);

// Conversões explícitas (preferir estas às implícitas):
assert.equal(Number("17031987"), 17031987); // string → número
assert.equal(String(17031987), "17031987"); // número → string
assert.equal((255).toString(16), "ff"); // número → string noutra base
assert.equal(Boolean("texto"), true); // qualquer → boolean (ver §4)
// Coerção implícita (armadilhas clássicas):
assert.equal("5" + 1, "51"); // + com string concatena
assert.equal("5" - 1, 4); // - * / convertem para número
assert.equal(+"3", 3); // + unário converte para número
assert.equal([] + [], ""); // arrays viram string ""

// §3 ── OPERADORES ─────────────────────────────────────────────────────────────
// O QUE É: aritmética, comparação, lógica, atribuição.
//
//   operador   → exemplo → resultado
//   + - * /    → 7 / 2   → 3.5 (não há divisão inteira; usar Math.trunc)
//   %          → 12 % 5  → 2   (RESTO da divisão: 12 = 5*2 + 2)
//   **         → 2 ** 10 → 1024
//   ++ / --    → x++ devolve o valor antigo; ++x devolve o novo
assert.equal(12 % 5, 2);
assert.equal(5 % 12, 5); // 12 cabe 0 vezes em 5 → resta 5
assert.equal(-7 % 3, -1); // ⚠ resto fica com o sinal do dividendo
assert.equal(((-7 % 3) + 3) % 3, 2); // módulo matemático (sempre ≥ 0)
assert.equal(10 % 2 === 0, true); // par?
let c = 1;
assert.equal(c++, 1); // devolve 1, depois c = 2
assert.equal(++c, 3);

// Atribuição composta:
//   x += y  → x = x + y      x ||= y → x = x || y  (atribui se x falsy)
//   x -= y  → x = x - y      x &&= y → x = x && y  (atribui se x truthy)
//   x *= y, x /= y, x %= y   x ??= y → x = x ?? y  (atribui se x null/undefined)
//   x **= y → x = x ** y
let conta = 0;
conta ||= 10; // 0 é falsy → atribui
let conta2 = 0;
conta2 ??= 10; // 0 não é null/undefined → mantém
assert.equal(conta, 10);
assert.equal(conta2, 0);

// == vs ===   → usar SEMPRE === (e !==).
//   ===  igual valor E tipo, sem conversão.
//   ==   converte tipos antes de comparar (regras confusas).
assert.equal(0 == "0", true);
assert.equal(0 === "0", false);
assert.equal(null == undefined, true); // única exceção útil de ==
assert.equal(null === undefined, false);
assert.equal(NaN === NaN, false); // NaN nunca é igual a nada → Number.isNaN
assert.equal(Object.is(NaN, NaN), true);
assert.equal([1] === [1], false); // objetos comparam REFERÊNCIA, não conteúdo

// Comparação: < > <= >= ; strings comparam por código Unicode.
assert.equal("a" < "b", true);
assert.equal("Z" < "a", true); // maiúsculas vêm antes das minúsculas
assert.equal("10" < "9", true); // ⚠ duas strings: compara caráter a caráter

// Lógicos && || ! — devolvem um dos OPERANDOS, não necessariamente true/false.
//   a && b → se a falsy devolve a, senão b
//   a || b → se a truthy devolve a, senão b
//   !a     → boolean oposto;  !!a → converte para boolean
assert.equal("a" || "b", "a");
assert.equal("" || "padrão", "padrão");
assert.equal("a" && "b", "b");
assert.equal(!!"x", true);
assert.equal(false || 4 > 2, true);
assert.equal(true && 4 > 2, true);

// ?? (nullish coalescing): valor por defeito SÓ para null/undefined.
// Diferença para ||: || também troca 0, "" e false.
assert.equal(0 || 5, 5);
assert.equal(0 ?? 5, 0);
assert.equal(null ?? 5, 5);

// ?. (optional chaining): pára se algo for null/undefined e devolve undefined.
const user = { perfil: { nome: "Ana" }, falar: () => "olá" };
assert.equal(user.perfil?.nome, "Ana");
assert.equal(user.morada?.rua, undefined); // sem ?. daria TypeError
assert.equal(user.voar?.(), undefined); // método que pode não existir
assert.equal(user.morada?.rua ?? "sem rua", "sem rua"); // combo clássico

// Ternário: condição ? seVerdade : seFalso
const idade = 20;
assert.equal(idade >= 18 ? "adulto" : "menor", "adulto");

// §4 ── TRUTHY / FALSY ────────────────────────────────────────────────────────
// O QUE É: num if, qualquer valor é convertido para boolean.
// FALSY (só estes 8): false, 0, -0, 0n, "", null, undefined, NaN.
// TRUTHY: TUDO o resto — incluindo "0", "false", [], {}, funções.
const falsy = [false, 0, -0, 0n, "", null, undefined, NaN];
assert.equal(falsy.every((v) => !v), true);
const truthy = ["0", "false", " ", [], {}, () => {}, -1, Infinity];
assert.equal(truthy.every((v) => !!v), true);
// ⚠ Array vazio é truthy: testar com arr.length === 0, não com !arr.
// ⚠ if (n) falha para n = 0. Se 0 é válido, usar n !== undefined ou n ?? x.

// §5 ── CONDICIONAIS ──────────────────────────────────────────────────────────
// O QUE É: escolher um caminho. if/else para condições; switch para um valor
// contra vários casos; objeto lookup quando é só mapear valor → resultado.
function tempoIf(ceu) {
  if (ceu === "azul") {
    return "Está bom tempo";
  } else if (ceu === "escuro") {
    return "Se calhar vai chover";
  } else {
    return "Não vi a meteorologia";
  }
}
assert.equal(tempoIf("escuro"), "Se calhar vai chover");

// switch compara com ===. Sem break (ou return) "cai" no caso seguinte.
function tempoSwitch(ceu) {
  switch (ceu) {
    case "azul":
      return "Está bom tempo";
    case "escuro":
    case "cinzento": // dois casos, mesmo resultado (fall-through intencional)
      return "Se calhar vai chover";
    default:
      return "Não vi a meteorologia";
  }
}
assert.equal(tempoSwitch("cinzento"), "Se calhar vai chover");

// Lookup em objeto: mais curto quando é só mapear.
const tempos = { azul: "Está bom tempo", escuro: "Se calhar vai chover" };
assert.equal(tempos["azul"] ?? "Não vi a meteorologia", "Está bom tempo");

// Early return (guard clause): tratar casos especiais primeiro, evita if aninhados.
function dividir(a, b) {
  if (b === 0) return null;
  return a / b;
}
assert.equal(dividir(1, 0), null);

// §6 ── LOOPS ─────────────────────────────────────────────────────────────────
// O QUE É: repetir. Escolher:
//   for (let i…)  → precisas do índice, ou de saltar/andar ao contrário
//   for...of      → valores de array, string, Map, Set (o mais usado)
//   for...in      → CHAVES de um objeto (nunca em arrays)
//   while         → não sabes quantas vezes (ex.: dois ponteiros)
//   do...while    → corre pelo menos 1 vez
//   arr.forEach   → não dá para break; devolve undefined
const out = [];
for (let i = 1; i <= 3; i++) out.push(i); // partida; chegada; incremento
assert.deepEqual(out, [1, 2, 3]);

let contador = 1;
const outWhile = [];
while (contador <= 3) {
  outWhile.push(contador);
  contador += 1; // esquecer isto = loop infinito
}
assert.deepEqual(outWhile, [1, 2, 3]);

let k = 10;
do {
  k++;
} while (k < 5); // condição falsa, mas correu 1 vez
assert.equal(k, 11);

const letras = [];
for (const ch of "abc") letras.push(ch);
assert.deepEqual(letras, ["a", "b", "c"]);

// Índice + valor num for...of:
const pares = [];
for (const [i, v] of ["x", "y"].entries()) pares.push(`${i}:${v}`);
assert.deepEqual(pares, ["0:x", "1:y"]);

// break sai do loop; continue salta para a próxima volta.
const impares = [];
for (let i = 0; i < 10; i++) {
  if (i % 2 === 0) continue;
  if (i > 5) break;
  impares.push(i);
}
assert.deepEqual(impares, [1, 3, 5]);

// Matriz (array 2D): i = linha, j = coluna → m[i][j]
const matriz = [
  [1, 2],
  [3, 4],
  [5, 6],
];
const posicoes = [];
for (let i = 0; i < matriz.length; i++) {
  for (let j = 0; j < matriz[i].length; j++) {
    posicoes.push(`[${i},${j}]=${matriz[i][j]}`);
  }
}
assert.equal(posicoes[3], "[1,1]=4");

// Label: break num loop exterior a partir do interior.
let encontrado = null;
procura: for (let i = 0; i < matriz.length; i++) {
  for (let j = 0; j < matriz[i].length; j++) {
    if (matriz[i][j] === 4) {
      encontrado = [i, j];
      break procura;
    }
  }
}
assert.deepEqual(encontrado, [1, 1]);

// §7 ── STRINGS ───────────────────────────────────────────────────────────────
// O QUE É: texto. IMUTÁVEL: nenhum método muda a string, todos devolvem uma NOVA.
//
//   método                     → o que faz
//   s.length                   → nº de caracteres (propriedade, sem ())
//   s[i] / s.at(-1)            → caráter no índice (at aceita negativo)
//   s.charAt(i)                → igual a s[i] ("" se fora do limite)
//   s.indexOf(x) / lastIndexOf → índice da 1ª/última ocorrência, ou -1
//   s.includes(x, inicio)      → true/false
//   s.startsWith / endsWith    → true/false
//   s.slice(a, b)              → de a até b (b exclusivo); aceita negativos
//   s.substring(a, b)          → igual mas negativos viram 0 (preferir slice)
//   s.toUpperCase/LowerCase    → maiúsculas / minúsculas
//   s.trim/trimStart/trimEnd   → tira espaços nas pontas
//   s.padStart(n, "0")         → preenche à esquerda até n caracteres
//   s.repeat(n)                → repete n vezes
//   s.replace(a, b)            → troca a 1ª ocorrência (ou todas com regex /g)
//   s.replaceAll(a, b)         → troca todas
//   s.split(sep)               → string → array
//   arr.join(sep)              → array → string
//   s.localeCompare(t)         → <0, 0, >0 (para ordenar texto, ver §11)
//   s.charCodeAt(i)            → código numérico do caráter
//   String.fromCharCode(n)     → código → caráter
const word = "Tiago";
assert.equal(word.length, 5);
assert.equal(word[2], "a");
assert.equal(word.charAt(2), "a");
assert.equal(word.at(-1), "o");
assert.equal(word[99], undefined); // fora do limite
assert.equal("Adelia".indexOf("lia"), 3);
assert.equal("Adelia".indexOf("z"), -1);
assert.equal("Otorrinolaringologista".includes("ari", 3), true);
assert.equal("ficheiro.js".endsWith(".js"), true);

// slice / substring: fim é EXCLUSIVO. slice(0, 2) dá os índices 0 e 1.
const frase = "Não sei que frase inventar já...";
assert.equal(frase.slice(8, 26), "que frase inventar");
assert.equal(frase.slice(-5, -1), "já.."); // negativos contam do fim
assert.equal("Eu sou fixe".slice(0, 2), "Eu");
assert.equal("Eu sou fixe".slice(1), "u sou fixe"); // sem fim → até ao final

// Capitalizar a 1ª letra:
const cap = (s) => s.charAt(0).toUpperCase() + s.slice(1);
assert.equal(cap("tiago"), "Tiago");

assert.equal("  olá  ".trim(), "olá");
assert.equal("7".padStart(3, "0"), "007");
assert.equal("Awesome!".repeat(2), "Awesome!Awesome!");
assert.equal("a-b-c".replace("-", "+"), "a+b-c"); // só a 1ª
assert.equal("a-b-c".replaceAll("-", "+"), "a+b+c");
assert.equal("a-b-c".replace(/-/g, "+"), "a+b+c"); // alternativa com regex

// split / join
assert.deepEqual("Curto imenso JS".split(" "), ["Curto", "imenso", "JS"]);
assert.deepEqual("abc".split(""), ["a", "b", "c"]);
assert.equal(["Eu", "vou", "juntar"].join(" "), "Eu vou juntar");
assert.equal(["a", "b"].join(), "a,b"); // separador por defeito é ","

// Inverter string (pergunta clássica):
assert.equal([..."abc"].reverse().join(""), "cba");
// Palíndromo:
const isPal = (s) => s === [...s].reverse().join("");
assert.equal(isPal("arara"), true);

// Códigos de caracteres (contar letras em LeetCode: índice 0..25):
assert.equal("c".charCodeAt(0) - "a".charCodeAt(0), 2);
assert.equal(String.fromCharCode(97), "a");

// Template literals: crases ` `, interpolação ${ } e várias linhas.
const n = 3;
assert.equal(`tenho ${n * 2} maçãs`, "tenho 6 maçãs");

// Imutabilidade: atribuir a um índice não muda a string (strict → TypeError).
assert.throws(() => {
  const s = "abc";
  s[0] = "X";
}, TypeError);

// §8 ── NÚMEROS E MATH ────────────────────────────────────────────────────────
// O QUE É: um só tipo number (vírgula flutuante 64 bits) + bigint para inteiros enormes.
//
//   método                     → o que faz                          → devolve
//   n.toFixed(d)               → arredonda a d casas decimais        → STRING
//   n.toString(base)           → 2 binário, 16 hexadecimal           → string
//   Number(s)                  → converte tudo ou dá NaN             → number
//   parseInt(s, 10)            → lê inteiro do início, pára no lixo  → number
//   parseFloat(s)              → lê decimal do início                → number
//   Number.isInteger(n)        → é inteiro?                          → boolean
//   Number.isNaN(n)            → é mesmo NaN? (sem coerção)          → boolean
//   Math.floor / ceil          → arredonda para baixo / para cima    → number
//   Math.round                 → para o mais próximo (.5 sobe)       → number
//   Math.trunc                 → corta as decimais (para o zero)     → number
//   Math.abs / sign            → valor absoluto / sinal              → number
//   Math.max(...a) / min(...a) → maior / menor                       → number
//   Math.sqrt / cbrt / hypot   → raiz quadrada / cúbica / hipotenusa → number
//   Math.random()              → [0, 1) — inclui 0, nunca 1          → number
const x1 = 1987.8534;
assert.equal(x1.toFixed(1), "1987.9"); // ⚠ é método de NÚMERO e devolve STRING
assert.equal((45).toFixed(2), "45.00");
assert.equal(Number(x1.toFixed(1)), 1987.9); // voltar a número
assert.equal(Number.isInteger(x1), false);
assert.equal(Number.isInteger(5.0), true);

// Arredondamentos (atenção aos negativos):
assert.equal(Math.floor(1.7), 1);
assert.equal(Math.floor(-1.2), -2); // floor NÃO é "tirar decimais"
assert.equal(Math.trunc(-1.2), -1); // trunc é que corta decimais
assert.equal(Math.ceil(1.2), 2);
assert.equal(Math.round(14.5), 15);
assert.equal(Math.round(-14.5), -14); // .5 arredonda para +∞
assert.equal(Math.trunc(7 / 2), 3); // divisão inteira

// Conversões de string:
assert.equal(parseInt("12px", 10), 12); // lê até ao lixo
assert.equal(Number("12px"), NaN); // Number é tudo-ou-nada
assert.equal(Number(""), 0); // ⚠ string vazia vira 0
assert.equal(parseInt("101", 2), 5); // binário → decimal (radix = base)
assert.equal(parseInt("ff", 16), 255);
assert.equal(parseFloat("3.14abc"), 3.14);
// Passar SEMPRE o radix. map(parseInt) passa o ÍNDICE como radix:
assert.deepEqual(["1", "2", "3"].map(parseInt), [1, NaN, NaN]);
assert.deepEqual(["1", "2", "3"].map(Number), [1, 2, 3]); // ✔

// Bases:
assert.equal((5).toString(2), "101");
assert.equal((10).toString(16).padStart(2, "0"), "0a");
// rgb → hex (exemplo antigo, simplificado com clamp + padStart):
const rgb = (r, g, b) =>
  [r, g, b]
    .map((v) => Math.min(255, Math.max(0, v)).toString(16).padStart(2, "0"))
    .join("")
    .toUpperCase();
assert.equal(rgb(300, 255, 0), "FFFF00");

// NaN: "Not a Number", mas typeof é "number".
assert.equal(typeof NaN, "number");
assert.equal(isNaN("abc"), true); // ⚠ global isNaN converte primeiro
assert.equal(Number.isNaN("abc"), false); // ✔ sem conversão
assert.equal(Number.isNaN(0 / 0), true);
assert.equal(1 / 0, Infinity);

// Vírgula flutuante: 0.1 + 0.2 não é 0.3.
assert.equal(0.1 + 0.2 === 0.3, false);
assert.equal(Math.abs(0.1 + 0.2 - 0.3) < Number.EPSILON, true); // comparar assim
assert.equal((1.005).toFixed(2), "1.00"); // ⚠ 1.005 é guardado como 1.00499…
// Dinheiro: trabalhar em cêntimos (inteiros).

// Inteiros seguros até 2^53 - 1. Acima disso, usar BigInt (sufixo n).
assert.equal(Number.MAX_SAFE_INTEGER, 2 ** 53 - 1);
assert.equal(2 ** 53 + 1 === 2 ** 53, true); // ⚠ perdeu precisão
assert.equal(2n ** 64n, 18446744073709551616n);
assert.throws(() => 1n + 1, TypeError); // não se mistura bigint com number
assert.equal(BigInt(10) + 1n, 11n);
assert.equal(7n / 2n, 3n); // divisão bigint corta decimais

// Max / min de um array: spread. Sem argumentos → -Infinity / Infinity.
const nums = [3, 9, 1];
assert.equal(Math.max(...nums), 9);
assert.equal(Math.min(...nums), 1);
assert.equal(Math.max(), -Infinity);
// Com reduce (arrays enormes: spread tem limite de argumentos):
assert.equal(nums.reduce((a, b) => Math.min(a, b)), 1);

// Inteiro aleatório entre min e max (AMBOS incluídos):
const randInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
for (let i = 0; i < 100; i++) {
  const r = randInt(1, 10);
  assert.ok(Number.isInteger(r) && r >= 1 && r <= 10);
}
// Decimal aleatório em [min, max): Math.random() * (max - min) + min

assert.equal(Math.sqrt(16), 4);
assert.equal(Math.abs(-3), 3);
assert.equal(Math.hypot(3, 4), 5);

// §9 ── ARRAYS: BÁSICO + MÉTODOS QUE MUDAM ────────────────────────────────────
// O QUE É: lista ordenada, índice começa em 0. Pode misturar tipos.
// ⚠ Estes métodos MUDAM o array original (mutam):
//
//   método                  → o que faz                  → devolve
//   push(x, …)              → junta no fim               → novo length
//   pop()                   → tira o último              → o item tirado
//   unshift(x, …)           → junta no início            → novo length
//   shift()                 → tira o primeiro            → o item tirado
//   splice(i, apagar, …add) → apaga/insere a partir de i → array com os apagados
//   sort(fn)                → ordena (ver §11)           → o mesmo array
//   reverse()               → inverte                    → o mesmo array
//   fill(v, ini, fim)       → preenche com v             → o mesmo array
//   copyWithin(…)           → copia partes por cima      → o mesmo array
//   arr.length = 0          → esvazia                    → —
// Complexidade: push/pop O(1); shift/unshift/splice O(n) (re-indexam tudo).
const nomes = ["david", "costa"];
assert.equal(nomes.push("pereira"), 3);
nomes.unshift("tiago");
assert.deepEqual(nomes, ["tiago", "david", "costa", "pereira"]);
assert.equal(nomes.pop(), "pereira");
assert.equal(nomes.shift(), "tiago");
assert.deepEqual(nomes, ["david", "costa"]);

// splice(índice, quantosApagar, ...itensAInserir)
const items = ["i1", "i2", "i3", "i4", "i5"];
assert.deepEqual(items.splice(2, 1), ["i3"]); // apaga 1 no índice 2
assert.deepEqual(items, ["i1", "i2", "i4", "i5"]);
items.splice(3, 1, "i10"); // substitui o índice 3
assert.deepEqual(items, ["i1", "i2", "i4", "i10"]);
items.splice(3, 0, "i20"); // insere sem apagar (quantos = 0)
assert.deepEqual(items, ["i1", "i2", "i4", "i20", "i10"]);

const cores = ["red", "blue", "green"];
cores.fill("green", 1, 2); // índice 1 até 2 (exclusivo)
assert.deepEqual(cores, ["red", "green", "green"]);

const rev = ["one", "two", "three"];
const revResult = rev.reverse();
assert.equal(revResult, rev); // ⚠ é o MESMO array: o original mudou
assert.deepEqual(rev, ["three", "two", "one"]);

// Criar arrays:
assert.deepEqual(new Array(3).fill(0), [0, 0, 0]);
assert.deepEqual(Array.from({ length: 4 }, (_, i) => i * i), [0, 1, 4, 9]);
assert.deepEqual(Array.from("abc"), ["a", "b", "c"]);
assert.deepEqual(Array.from(new Set([1, 1, 2])), [1, 2]);
assert.deepEqual(Array.of(7), [7]); // new Array(7) criaria 7 lugares vazios
// ⚠ Matriz com fill([]) partilha o MESMO array em todas as linhas:
const mau = new Array(2).fill([]);
mau[0].push("x");
assert.deepEqual(mau, [["x"], ["x"]]);
const bom = Array.from({ length: 2 }, () => []); // ✔ uma linha nova por cada
bom[0].push("x");
assert.deepEqual(bom, [["x"], []]);

// §10 ── ARRAYS: MÉTODOS QUE NÃO MUDAM ─────────────────────────────────────────
// O QUE É: devolvem um valor ou array NOVO. O original fica igual.
// Callback recebe (elemento, índice, array).
//
//   método              → o que faz                                 → devolve
//   at(i)               → item no índice (aceita negativo)           → item
//   slice(a, b)         → cópia de a até b (exclusivo)               → array novo
//   concat(b)           → junta arrays                               → array novo
//   includes(x)         → existe?                                    → boolean
//   indexOf(x)          → índice ou -1 (usa ===)                     → number
//   join(sep)           → array → string                             → string
//   map(fn)             → transforma cada item; MESMO tamanho         → array novo
//   filter(fn)          → fica só com os que dão true                 → array novo
//   reduce(fn, inicial) → acumula tudo num só valor                   → qualquer
//   find(fn)            → 1º item que dá true, ou undefined           → item
//   findIndex(fn)       → índice do 1º, ou -1                         → number
//   findLast/LastIndex  → igual mas a começar do fim                  → item / nº
//   some(fn)            → pelo menos UM dá true?                      → boolean
//   every(fn)           → TODOS dão true? (array vazio → true)        → boolean
//   flat(n)             → achata n níveis                             → array novo
//   flatMap(fn)         → map + flat(1)                               → array novo
//   forEach(fn)         → corre fn em cada; sem break                 → undefined
//   toSorted(fn)        → sort sem mudar o original                   → array novo
//   toReversed()        → reverse sem mudar o original                → array novo
//   toSpliced(…)        → splice sem mudar o original                 → array novo
//   with(i, v)          → cópia com o índice i trocado                → array novo
//   keys/values/entries → iteradores (usar em for...of)               → iterador
const arr = [1, 2, 3, 4, 5, 6];
assert.equal(arr.at(-1), 6);
assert.deepEqual(arr.slice(1, 3), [2, 3]);
assert.deepEqual(arr.slice(), arr); // slice() sem args = cópia shallow
assert.deepEqual([1, 2].concat([3], [4]), [1, 2, 3, 4]);
assert.equal(arr.includes(3), true);
assert.equal([NaN].includes(NaN), true); // includes encontra NaN…
assert.equal([NaN].indexOf(NaN), -1); // …indexOf não

// map: 1 para 1, mesmo tamanho. Com { } e sem return → undefined.
assert.deepEqual([1, 2, 3].map((x) => x * 2), [2, 4, 6]);
assert.deepEqual([1, 2].map((x) => { x * 2; }), [undefined, undefined]); // ⚠
const cidades = ["miami", "lisbon", "paris"];
assert.deepEqual(cidades.map(cap), ["Miami", "Lisbon", "Paris"]);
// map com condição devolve o resultado da condição para CADA item, por ordem:
assert.deepEqual([1, 2, 3].map((x) => x > 1), [false, true, true]);

// filter
assert.deepEqual(arr.filter((x) => x % 2 === 0), [2, 4, 6]);
const people = [
  { name: "Candice", age: 25 },
  { name: "Tammy", age: 30 },
  { name: "Allen", age: 49 },
  { name: "Nettie", age: 21 },
  { name: "Stuart", age: 17 },
];
assert.deepEqual(
  people.filter((p) => p.age >= 21).map((p) => p.name),
  ["Candice", "Tammy", "Allen", "Nettie"]
);

// reduce((acumulador, atual) => novoAcumulador, valorInicial)
// Sem valor inicial: acumulador começa no 1º item e o loop no 2º.
// ⚠ Dar SEMPRE valor inicial: array vazio sem inicial → TypeError;
//   array de objetos sem inicial → o acumulador começa num OBJETO.
assert.equal([2, 4, 6, 8].reduce((acc, cur) => acc + cur), 20);
assert.equal([12, 9, 1, 8].reduce((acc, cur) => acc + cur, 23), 53);
assert.equal(people.reduce((soma, p) => soma + p.age, 0), 142);
assert.throws(() => [].reduce((a, b) => a + b), TypeError);
assert.equal(["This", "is", "one"].reduce((s, w) => s + " " + w), "This is one");
// reduce para contar frequências (com Map: ver §14):
const freq = [..."banana"].reduce((acc, ch) => {
  acc[ch] = (acc[ch] ?? 0) + 1;
  return acc;
}, {});
assert.deepEqual(freq, { b: 1, a: 3, n: 2 });

// find / findIndex / findLast
assert.deepEqual(people.find((p) => p.age > 26), { name: "Tammy", age: 30 });
assert.equal(people.findIndex((p) => p.age > 100), -1);
assert.equal(arr.findLast((x) => x % 2 === 1), 5);
assert.equal(arr.findLastIndex((x) => x < 3), 1);

// some / every
assert.equal([1, 2, -3, 5].some((x) => x < 0), true);
assert.equal([17, 28, 45, 11, 5].every((x) => x > 10), false);
assert.equal([17, 28, 45, 11, 5].every((x) => x > 3), true);
assert.equal([].every((x) => x > 100), true); // ⚠ vazio → true

// flat / flatMap
assert.deepEqual([1, [2, [3, [4]]]].flat(), [1, 2, [3, [4]]]);
assert.deepEqual([1, [2, [3, [4]]]].flat(Infinity), [1, 2, 3, 4]);
assert.deepEqual(["a b", "c"].flatMap((s) => s.split(" ")), ["a", "b", "c"]);

// Versões "to…" e with: imutáveis (ES2023).
const orig = [3, 1, 2];
assert.deepEqual(orig.toSorted(), [1, 2, 3]);
assert.deepEqual(orig.toReversed(), [2, 1, 3]);
assert.deepEqual(orig.toSpliced(0, 1), [1, 2]);
assert.deepEqual(orig.with(0, 9), [9, 1, 2]);
assert.deepEqual(orig, [3, 1, 2]); // intacto

// forEach: devolve undefined; return lá dentro só sai DESTA volta (como continue).
const vistos = [];
const ret = ["cobra", "tigre"].forEach((a) => {
  if (a === "cobra") return;
  vistos.push(a);
});
assert.equal(ret, undefined);
assert.deepEqual(vistos, ["tigre"]);

// Encadear (chain):
const total = people
  .filter((p) => p.age >= 21)
  .map((p) => p.age)
  .reduce((a, b) => a + b, 0);
assert.equal(total, 125);

// §11 ── ORDENAR ──────────────────────────────────────────────────────────────
// O QUE É: sort(fn) MUDA o array; toSorted(fn) devolve cópia.
// Sem fn, converte tudo para STRING e ordena por Unicode → números ficam mal!
// Comparador (a, b): negativo → a antes; positivo → b antes; 0 → mantém.
//   a - b → crescente      b - a → decrescente
// Estável desde ES2019: empates mantêm a ordem original.
const scores = [1, 10, 2, 21];
assert.deepEqual([...scores].sort(), [1, 10, 2, 21]); // ⚠ "10" < "2" em texto
assert.deepEqual([...scores].sort((a, b) => a - b), [1, 2, 10, 21]);
assert.deepEqual([4, 2, 5, 10, 3].sort((a, b) => b - a), [10, 5, 4, 3, 2]);

// Strings: sort() simples põe números, depois maiúsculas, depois minúsculas.
assert.deepEqual(["word", "Word", "1 Word"].sort(), ["1 Word", "Word", "word"]);
// localeCompare: ordem "humana", trata acentos e maiúsculas.
const palavras = ["b", "A", "á", "a", "B"];
assert.deepEqual(
  palavras.toSorted((a, b) => a.localeCompare(b, "pt")),
  ["a", "A", "á", "b", "B"]
);

// Objetos por campo, e por 2 campos (desempate com ||):
const ps = [
  { n: "Rui", idade: 30 },
  { n: "Ana", idade: 25 },
  { n: "Bia", idade: 30 },
];
assert.deepEqual(
  ps.toSorted((a, b) => b.idade - a.idade || a.n.localeCompare(b.n)).map((p) => p.n),
  ["Bia", "Rui", "Ana"]
);

// §12 ── OBJETOS ──────────────────────────────────────────────────────────────
// O QUE É: pares chave → valor. Chaves são strings (ou Symbols); valores qualquer coisa.
//
//   operação                     → o que faz                     → muda?
//   o.chave / o["chave"]         → ler ([…] p/ chave dinâmica)    → não
//   o.chave = v                  → criar ou atualizar             → SIM
//   delete o.chave               → apagar                         → SIM
//   "chave" in o                 → existe? (inclui herdadas)      → não
//   Object.hasOwn(o, "chave")    → existe no próprio objeto?      → não
//   Object.keys(o)               → array de chaves                → não
//   Object.values(o)             → array de valores               → não
//   Object.entries(o)            → array de [chave, valor]        → não
//   Object.fromEntries(pares)    → [[k,v]] → objeto               → não
//   Object.assign(alvo, …fontes) → copia props para o alvo        → SIM (o alvo)
//   Object.freeze(o)             → impede mudanças (só 1 nível)   → —
//   Object.groupBy(arr, fn)      → agrupa por chave (ES2024)      → não
const carro = { marca: "VW", ano: 2010 };
carro.cor = "azul"; // criar
carro.ano = 2012; // atualizar
delete carro.cor; // apagar
assert.deepEqual(carro, { marca: "VW", ano: 2012 });
assert.equal(carro["marca"], "VW");
assert.equal(carro.inexistente, undefined); // não dá erro, dá undefined

// Chave dinâmica (computed property): [expressão] dentro do literal.
const campo = "profissao";
const pessoa = { nome: "Tiago", [campo]: "web dev" };
assert.equal(pessoa.profissao, "web dev");
assert.equal(pessoa[campo], "web dev");

// Atalhos: propriedade com o mesmo nome da variável + método curto.
const idadeX = 35;
const curto = { idadeX, ola() { return "olá"; } };
assert.equal(curto.idadeX, 35);
assert.equal(curto.ola(), "olá");

assert.equal("marca" in carro, true);
assert.equal("toString" in carro, true); // ⚠ herdada do protótipo
assert.equal(Object.hasOwn(carro, "toString"), false); // ✔ só as próprias

const someObj = { key1: "value1", key2: "value2" };
assert.deepEqual(Object.keys(someObj), ["key1", "key2"]);
assert.deepEqual(Object.values(someObj), ["value1", "value2"]);
assert.deepEqual(Object.entries({ foo: "bar", baz: 42 }), [["foo", "bar"], ["baz", 42]]);
// entries + map + fromEntries = "map" de um objeto:
const precos = { pao: 1, leite: 2 };
const dobro = Object.fromEntries(Object.entries(precos).map(([k, v]) => [k, v * 2]));
assert.deepEqual(dobro, { pao: 2, leite: 4 });

// Iterar: for...in dá CHAVES (incluindo herdadas enumeráveis); preferir entries.
const chaves = [];
for (const key in someObj) chaves.push(`${key}=${someObj[key]}`);
assert.deepEqual(chaves, ["key1=value1", "key2=value2"]);
for (const [key, value] of Object.entries(someObj)) assert.equal(someObj[key], value);

// Ordem das chaves: inteiros primeiro (crescente), depois strings pela ordem de criação.
assert.deepEqual(Object.keys({ b: 1, 2: 1, a: 1, 1: 1 }), ["1", "2", "b", "a"]);

// Object.freeze: shallow — objetos lá dentro continuam mutáveis.
const congelado = Object.freeze({ a: 1, dentro: { b: 1 } });
assert.throws(() => { congelado.a = 2; }, TypeError); // em strict lança erro
congelado.dentro.b = 2; // ⚠ isto funciona
assert.equal(congelado.dentro.b, 2);

// Object.groupBy (ES2024) — devolve objeto sem protótipo, daí o spread no assert.
const grupos = Object.groupBy(people, (p) => (p.age >= 21 ? "adulto" : "menor"));
assert.deepEqual({ ...grupos }, {
  adulto: people.slice(0, 4),
  menor: [people[4]],
});
// Map.groupBy faz o mesmo mas devolve um Map (chaves podem ser objetos).

// JSON: texto ↔ objeto. Perde funções e undefined; Date vira string.
const json = JSON.stringify({ a: 1, b: [true, null] });
assert.equal(json, '{"a":1,"b":[true,null]}');
assert.deepEqual(JSON.parse(json), { a: 1, b: [true, null] });
assert.equal(JSON.stringify({ f() {}, u: undefined }), "{}");
assert.throws(() => JSON.parse("{a:1}"), SyntaxError); // chaves têm de ter aspas

// §13 ── DESTRUCTURING, SPREAD, REST ──────────────────────────────────────────
// O QUE É: tirar valores de arrays/objetos para variáveis (destructuring);
// espalhar (spread ...) ou juntar o resto (rest ...).
// Mesmo símbolo "...": à DIREITA do = ou numa chamada → spread;
// à ESQUERDA do = ou nos parâmetros → rest.

// Array: por POSIÇÃO.
const [tomate, cogumelo, ...resto] = ["🍅", "🍄", "🥦", "🥒"];
assert.equal(tomate, "🍅");
assert.equal(cogumelo, "🍄");
assert.deepEqual(resto, ["🥦", "🥒"]);
const [, segundo] = [1, 2, 3]; // saltar posições com vírgula
assert.equal(segundo, 2);
const [d1 = "padrão"] = []; // valor por defeito
assert.equal(d1, "padrão");
// Trocar duas variáveis sem temporária:
let sa = 1, sb = 2;
[sa, sb] = [sb, sa];
assert.deepEqual([sa, sb], [2, 1]);

// Objeto: por NOME. Renomear com ":", defeito com "=".
const { nome: nomeP, profissao, cidade = "Lisboa" } = pessoa;
assert.equal(nomeP, "Tiago");
assert.equal(profissao, "web dev");
assert.equal(cidade, "Lisboa");
// Aninhado:
const { perfil: { nome: nomePerfil } } = user;
assert.equal(nomePerfil, "Ana");
// Rest em objeto: tirar uma chave e ficar com o resto.
const { ano, ...semAno } = carro;
assert.equal(ano, 2012);
assert.deepEqual(semAno, { marca: "VW" });

// Em parâmetros de função (muito usado):
const apresentar = ({ nome, idade = 0 }) => `${nome} (${idade})`;
assert.equal(apresentar({ nome: "Rui" }), "Rui (0)");

// Spread: copiar e juntar arrays/objetos (cópia SHALLOW, ver §15).
const alumni = ["Tiago", "João"];
const alunos = [...alumni, "Xico"];
assert.deepEqual(alumni, ["Tiago", "João"]); // original intacto
assert.deepEqual(alunos, ["Tiago", "João", "Xico"]);
const base = { a: 1, b: 2 };
assert.deepEqual({ ...base, b: 3 }, { a: 1, b: 3 }); // o último ganha
assert.equal(Math.max(...[1, 5, 3]), 5); // spread em argumentos

// Rest em parâmetros: junta os argumentos num array verdadeiro.
const somaTudo = (...ns) => ns.reduce((a, b) => a + b, 0);
assert.equal(somaTudo(1, 2, 3), 6);

// §14 ── MAP, SET, WEAKMAP ───────────────────────────────────────────────────
// O QUE É:
//   Map     → chave→valor; chaves de QUALQUER tipo; guarda ordem de inserção; .size
//   Set     → valores ÚNICOS; has() em O(1)
//   WeakMap → como Map, chaves só objetos; não impede o GC; não se itera
// QUANDO: Map para contar/indexar (LeetCode!), Set para "já vi?" e tirar duplicados.
//
//   Map: set(k,v) get(k) has(k) delete(k) clear() size keys() values() entries()
//   Set: add(v) has(v) delete(v) clear() size + union/intersection/difference (ES2025)
const m = new Map();
m.set("a", 1).set("b", 2); // set devolve o Map → encadeia
assert.equal(m.get("a"), 1);
assert.equal(m.get("z"), undefined);
assert.equal(m.has("b"), true);
assert.equal(m.size, 2);
const objKey = { id: 1 };
m.set(objKey, "objeto como chave"); // num {} normal a chave virava "[object Object]"
assert.equal(m.get(objKey), "objeto como chave");
m.delete(objKey);

// Contar frequências com Map:
const contagem = new Map();
for (const ch of "hello") contagem.set(ch, (contagem.get(ch) ?? 0) + 1);
assert.equal(contagem.get("l"), 2);
assert.deepEqual([...contagem.keys()], ["h", "e", "l", "o"]); // ordem de inserção
// Map ↔ objeto / array:
assert.deepEqual(Object.fromEntries(new Map([["x", 1]])), { x: 1 });
assert.deepEqual([...new Map(Object.entries({ y: 2 }))], [["y", 2]]);
for (const [chave, valor] of m) assert.equal(m.get(chave), valor);

const s = new Set([1, 2, 2, 3]);
assert.equal(s.size, 3);
s.add(3); // já existe → ignorado
assert.equal(s.has(2), true);
assert.deepEqual([...new Set([3, 1, 3, 2, 1])], [3, 1, 2]); // tirar duplicados
const A = new Set([1, 2, 3]);
const B = new Set([2, 3, 4]);
assert.deepEqual([...A.union(B)], [1, 2, 3, 4]);
assert.deepEqual([...A.intersection(B)], [2, 3]);
assert.deepEqual([...A.difference(B)], [1]);
// ⚠ Set compara objetos por referência:
assert.equal(new Set([[1], [1]]).size, 2);

// WeakMap: guardar dados ligados a um objeto sem fugas de memória.
const cache = new WeakMap();
const elemento = {};
cache.set(elemento, { cliques: 1 });
assert.equal(cache.get(elemento).cliques, 1);
assert.throws(() => cache.set("string", 1), TypeError); // chave tem de ser objeto

// §15 ── CÓPIAS: SHALLOW VS DEEP ──────────────────────────────────────────────
// O QUE É: shallow copia só o 1º nível (objetos lá dentro são PARTILHADOS);
// deep copia tudo. Atribuir (b = a) não copia nada: é a mesma referência.
//
//   forma                      → profundidade → notas
//   [...a], a.slice()          → shallow      → arrays
//   {...o}, Object.assign({},o)→ shallow      → objetos
//   structuredClone(x)         → DEEP         → Date, Map, Set ok; funções → erro
//   JSON.parse(JSON.stringify) → deep         → perde Date, undefined, funções, Map
const book1 = { author: "Charlotte Bronte", tags: ["romance"] };
const shallow = { ...book1 };
assert.equal(shallow === book1, false); // objetos diferentes…
shallow.tags.push("clássico");
assert.deepEqual(book1.tags, ["romance", "clássico"]); // …mas o array é partilhado ⚠

const original = { d: new Date(0), tags: ["a"], m: new Map([[1, 2]]) };
const deep = structuredClone(original);
deep.tags.push("b");
assert.deepEqual(original.tags, ["a"]); // ✔ independente
assert.equal(deep.d instanceof Date, true); // ✔ Date mantém-se Date
assert.equal(deep.m.get(1), 2);
assert.throws(() => structuredClone({ f() {} })); // funções não se clonam
assert.equal(typeof JSON.parse(JSON.stringify(original)).d, "string"); // ⚠ JSON estraga Date

// §16 ── FUNÇÕES ──────────────────────────────────────────────────────────────
// O QUE É: bloco reutilizável. Funções são valores ("first-class"): guardam-se
// em variáveis, passam-se como argumento e devolvem-se de outras funções.
//
//   forma      → sintaxe                     → hoisting? → this próprio?
//   declaração → function f(a) { }           → SIM       → sim
//   expressão  → const f = function (a) { }  → não (TDZ) → sim
//   arrow      → const f = (a) => a * 2      → não (TDZ) → NÃO (herda, §18)
assert.equal(declarada(2), 4); // chamada ANTES da declaração: funciona (hoisting)
function declarada(a) {
  return a * 2;
}
const expressao = function (a) {
  return a * 2;
};
const arrow = (a) => a * 2; // 1 expressão → return implícito
const arrowBloco = (a) => {
  return a * 2; // com { } é preciso return
};
const arrowObjeto = () => ({ ok: true }); // devolver objeto: envolver em ( )
assert.equal(expressao(2) + arrow(2) + arrowBloco(2), 12);
assert.deepEqual(arrowObjeto(), { ok: true });

// Parâmetros por defeito; sem return → undefined.
const saudar = (nome = "anónimo") => `olá ${nome}`;
assert.equal(saudar(), "olá anónimo");
assert.equal(saudar(undefined), "olá anónimo"); // undefined ativa o defeito…
assert.equal(saudar(null), "olá null"); // …null não
assert.equal((() => {})(), undefined);

// Primitivos passam por valor; objetos por referência (a função pode mudá-los).
const muda = (o) => { o.x = 1; };
const alvo = {};
muda(alvo);
assert.equal(alvo.x, 1);

// Callback = função passada como ARGUMENTO, para outra função a chamar depois.
// (não é "uma função dentro de outra" — isso é uma função aninhada)
const aplicar = (valor, callback) => callback(valor);
assert.equal(aplicar(5, (v) => v + 1), 6);
// Higher-order function = recebe ou devolve funções (map, filter, reduce…).
const multiplicador = (fator) => (n) => n * fator;
const triplo = multiplicador(3);
assert.equal(triplo(4), 12);

// Recursão: a função chama-se a si própria. Precisa SEMPRE de caso base.
const fatorial = (n) => (n <= 1 ? 1 : n * fatorial(n - 1));
assert.equal(fatorial(5), 120);

// IIFE: função chamada logo na definição (escopo isolado, comum em código antigo).
const iife = (() => 42)();
assert.equal(iife, 42);

// §17 ── CLOSURES ─────────────────────────────────────────────────────────────
// O QUE É: uma função "lembra-se" das variáveis do sítio onde foi CRIADA,
// mesmo depois dessa função exterior ter acabado.
// QUANDO: estado privado, fábricas de funções, memoização, debounce (§25).
function criarContador() {
  let count = 0; // privado: só as funções de baixo lhe tocam
  return {
    inc: () => ++count,
    get: () => count,
  };
}
const cont1 = criarContador();
const cont2 = criarContador();
cont1.inc();
cont1.inc();
cont2.inc();
assert.equal(cont1.get(), 2); // cada chamada cria a sua própria closure
assert.equal(cont2.get(), 1);

// Memoização com closure (cache de resultados — útil em DP):
function memo(fn) {
  const cache = new Map();
  return (n) => {
    if (!cache.has(n)) cache.set(n, fn(n));
    return cache.get(n);
  };
}
const fib = memo((n) => (n < 2 ? n : fib(n - 1) + fib(n - 2)));
assert.equal(fib(50), 12586269025);

// Pergunta clássica: var vs let num loop com closures.
const fnsVar = [];
for (var iv = 0; iv < 3; iv++) fnsVar.push(() => iv); // UMA variável partilhada
const fnsLet = [];
for (let il = 0; il < 3; il++) fnsLet.push(() => il); // uma variável NOVA por volta
assert.deepEqual(fnsVar.map((fn) => fn()), [3, 3, 3]);
assert.deepEqual(fnsLet.map((fn) => fn()), [0, 1, 2]);

// §18 ── THIS, CALL/APPLY/BIND ────────────────────────────────────────────────
// O QUE É: "this" depende de COMO a função é chamada, não de onde foi escrita.
//
//   chamada              → this
//   obj.metodo()         → obj
//   f() solta (strict)   → undefined (sem strict: o objeto global)
//   new F()              → o objeto novo
//   f.call(x, a, b)      → x  (argumentos separados)
//   f.apply(x, [a, b])   → x  (argumentos em array)
//   f.bind(x)            → devolve NOVA função com this fixo = x
//   arrow function       → herda o this de fora (não tem o seu)
const conta1 = {
  dono: "Tiago",
  normal() {
    return this?.dono;
  },
  comArrow() {
    return [1].map(() => this.dono)[0]; // arrow dentro de método: herda ✔
  },
};
assert.equal(conta1.normal(), "Tiago");
const solta = conta1.normal; // ⚠ perde o this ao separar do objeto
assert.equal(solta(), undefined);
assert.equal(conta1.comArrow(), "Tiago");
assert.equal(conta1.normal.call({ dono: "Ana" }), "Ana");
assert.equal(conta1.normal.apply({ dono: "Rui" }, []), "Rui");
const presa = conta1.normal.bind({ dono: "Bia" });
assert.equal(presa(), "Bia");
// ⚠ Método escrito como arrow NÃO vê o objeto: { f: () => this } → this de fora.

// §19 ── CLASSES E PROTÓTIPOS ─────────────────────────────────────────────────
// O QUE É: molde para criar objetos com os mesmos campos e métodos.
// Por baixo é açúcar sobre protótipos: os métodos vivem em Classe.prototype
// e cada objeto aponta para lá (cadeia de protótipos).
//
//   peça            → para quê
//   constructor()   → corre no "new"; inicializa campos
//   campo = valor   → campo público com valor inicial
//   #campo          → privado: só acessível dentro da classe
//   static          → pertence à classe, não às instâncias
//   get / set       → propriedade calculada / validada (usa-se sem ())
//   extends + super → herança; super(...) chama o constructor do pai (antes de usar this)
class Pessoa {
  static especie = "humano";
  #segredo; // privado
  tipo = "pessoa"; // campo público

  constructor(nome = "Adelia", idade = 34) { // valores por defeito
    this.nome = nome;
    this.idade = idade;
    this.#segredo = "1234";
  }
  anoNascimento(anoAtual) { // método (fica no protótipo)
    return anoAtual - this.idade;
  }
  get apresentacao() {
    return `${this.nome}, ${this.idade}`;
  }
  set idadeSegura(v) {
    if (v < 0) throw new RangeError("idade negativa");
    this.idade = v;
  }
  confirmaSegredo(tentativa) {
    return tentativa === this.#segredo;
  }
  static criarBebe(nome) {
    return new Pessoa(nome, 0);
  }
}
const tiago = new Pessoa("Tiago", 33);
const def = new Pessoa();
assert.equal(def.nome, "Adelia");
assert.equal(tiago.anoNascimento(2020), 1987);
assert.equal(tiago.apresentacao, "Tiago, 33");
assert.throws(() => { tiago.idadeSegura = -1; }, RangeError);
assert.equal(tiago.confirmaSegredo("1234"), true);
assert.equal(tiago.segredo, undefined); // #segredo não aparece de fora
assert.equal(Pessoa.especie, "humano");
assert.equal(Pessoa.criarBebe("Bia").idade, 0);
assert.equal(tiago.especie, undefined); // static não está nas instâncias

class Atleta extends Pessoa {
  constructor(nome, idade, altura) {
    super(nome, idade); // obrigatório antes de usar this
    this.altura = altura;
  }
  get apresentacao() { // sobrepõe (override) e reusa o do pai
    return `${super.apresentacao} — ${this.altura}cm`;
  }
}
const rui = new Atleta("Rui", 33, 175);
assert.equal(rui.apresentacao, "Rui, 33 — 175cm");
assert.equal(rui instanceof Atleta, true);
assert.equal(rui instanceof Pessoa, true); // herança
assert.equal(rui.anoNascimento(2020), 1987); // método herdado

// Protótipos (o que a classe faz por baixo):
assert.equal(Object.getPrototypeOf(tiago), Pessoa.prototype);
assert.equal(Object.getPrototypeOf(Atleta.prototype), Pessoa.prototype);
assert.equal(Object.hasOwn(tiago, "anoNascimento"), false); // não é cópia: é partilhado
assert.equal(typeof Pessoa, "function"); // classe = função construtora
const protoBase = { falar() { return "olá de " + this.n; } };
const filho = Object.create(protoBase); // objeto cujo protótipo é protoBase
filho.n = "filho";
assert.equal(filho.falar(), "olá de filho");

// §20 ── ERROS ────────────────────────────────────────────────────────────────
// O QUE É: throw interrompe; try/catch apanha; finally corre SEMPRE.
// Tipos nativos: Error, TypeError, RangeError, ReferenceError, SyntaxError.
// Lançar sempre um Error (tem stack), nunca uma string.
function parseIdade(txt) {
  const num = Number(txt);
  if (Number.isNaN(num)) throw new TypeError(`não é número: ${txt}`);
  return num;
}
const passos = [];
try {
  passos.push("try");
  parseIdade("abc");
  passos.push("nunca chega aqui");
} catch (err) {
  passos.push(`catch ${err.name}`); // err.name, err.message, err.stack
} finally {
  passos.push("finally");
}
assert.deepEqual(passos, ["try", "catch TypeError", "finally"]);

// Erro próprio + cause (encadear o erro original):
class ValidationError extends Error {
  constructor(msg, options) {
    super(msg, options);
    this.name = "ValidationError";
  }
}
try {
  try {
    JSON.parse("{mau");
  } catch (e) {
    throw new ValidationError("config inválida", { cause: e });
  }
} catch (e) {
  assert.equal(e instanceof ValidationError, true);
  assert.equal(e instanceof Error, true);
  assert.equal(e.cause instanceof SyntaxError, true);
}
// catch sem variável, quando não precisas do erro:
let falhou = false;
try { null.x; } catch { falhou = true; }
assert.equal(falhou, true);
// finally corre mesmo depois de um return no try:
const comFinally = () => { try { return "try"; } finally { passos.push("finally corre"); } };
assert.equal(comFinally(), "try");
assert.equal(passos.at(-1), "finally corre");

// §21 ── DATAS ────────────────────────────────────────────────────────────────
// O QUE É: Date guarda milissegundos desde 1970-01-01 UTC. É mutável.
// ⚠ Mês começa em 0 (janeiro = 0). Dia da semana: 0 = domingo.
//
//   método                 → devolve
//   new Date()             → agora
//   new Date(a, m, d, h)   → data LOCAL (m de 0 a 11)
//   Date.UTC(a, m, d)      → ms em UTC (para cálculos sem fuso)
//   Date.now()             → ms de agora (medir tempos)
//   getFullYear()          → ano (4 dígitos)
//   getMonth()             → mês 0-11
//   getDate()              → dia do mês 1-31
//   getDay()               → dia da semana 0-6 (0 = domingo)
//   getHours/Minutes/Seconds/Milliseconds → 0-23 / 0-59 / 0-59 / 0-999
//   getTime()              → ms desde 1970
//   toISOString()          → "AAAA-MM-DDTHH:mm:ss.sssZ" (sempre UTC)
//   set*(…)                → muda a data (transborda: dia 32 → mês seguinte)
const data = new Date(2024, 0, 31); // 31 jan 2024, hora local
assert.equal(data.getFullYear(), 2024);
assert.equal(data.getMonth(), 0); // janeiro
assert.equal(data.getDate(), 31);
assert.equal(data.getDay(), 3); // quarta-feira
data.setDate(data.getDate() + 1); // somar 1 dia
assert.equal(data.getMonth(), 1); // passou para fevereiro
assert.equal(data.getDate(), 1);

// Diferença em dias (UTC evita a mudança de hora):
const dias = (Date.UTC(2024, 2, 1) - Date.UTC(2024, 1, 1)) / 86_400_000;
assert.equal(dias, 29); // 2024 é bissexto
assert.equal(new Date(Date.UTC(2024, 0, 15)).toISOString(), "2024-01-15T00:00:00.000Z");
// ⚠ "2024-01-15" (só data) é lido em UTC; "2024-01-15T10:00" em hora local.
assert.equal(new Date("2024-01-15").getTime(), Date.UTC(2024, 0, 15));
// Mostrar ao utilizador: Intl (formato depende do locale).
assert.equal(new Intl.DateTimeFormat("pt-PT").format(new Date(2024, 0, 5)), "05/01/2024");
// Comparar datas: com getTime() ou < >; NUNCA com === (são objetos).
assert.equal(new Date(0) < new Date(1), true);
assert.equal(new Date(0) === new Date(0), false);
assert.equal(new Date(0).getTime() === new Date(0).getTime(), true);

// §22 ── REGEX ────────────────────────────────────────────────────────────────
// O QUE É: padrões para procurar/validar/trocar texto. Literal: /padrão/flags.
//
//   peça   → significa                 peça    → significa
//   .      → qualquer caráter          ^  $    → início / fim
//   \d \D  → dígito / não dígito       *       → 0 ou mais
//   \w \W  → letra, nº ou _ / não      +       → 1 ou mais
//   \s \S  → espaço / não espaço       ?       → 0 ou 1 (ou "lazy" depois de * +)
//   [abc]  → um destes                 {2,4}   → entre 2 e 4 vezes
//   [^abc] → nenhum destes             (…)     → grupo que captura
//   a|b    → a ou b                    (?<n>…) → grupo com nome
//   flags: g todas · i ignora maiúsculas · m multilinha · s "." apanha \n · u unicode
//
//   método           → devolve
//   re.test(s)       → boolean
//   s.match(re)      → sem g: 1º match + grupos; com g: array de matches; nada → null
//   s.matchAll(re/g) → iterador de matches com grupos
//   s.replace(re, x) → string nova ($1 ou $<nome> dentro de x)
//   s.split(re)      → array
assert.equal(/^\d{4}-\d{3}$/.test("1000-123"), true); // código postal PT
assert.equal(/ola/i.test("OLA mundo"), true);
assert.deepEqual("a1b22c333".match(/\d+/g), ["1", "22", "333"]);
assert.equal("sem números".match(/\d/), null); // sem match → null, não []
const iso = "2024-01-15".match(/(?<ano>\d{4})-(?<mes>\d{2})-(?<dia>\d{2})/);
assert.equal(iso.groups.mes, "01");
assert.equal("2024-01-15".replace(/(\d+)-(\d+)-(\d+)/, "$3/$2/$1"), "15/01/2024");
assert.deepEqual([..."k1=v1;k2=v2".matchAll(/(\w+)=(\w+)/g)].map((mm) => mm[2]), ["v1", "v2"]);
assert.deepEqual("a, b ,c".split(/\s*,\s*/), ["a", "b", "c"]);
// Limpar string para LeetCode (só letras/números, minúsculas):
assert.equal("A man, a plan!".toLowerCase().replace(/[^a-z0-9]/g, ""), "amanaplan");
// ⚠ regex com g guarda lastIndex: test() repetido no mesmo regex alterna.
const reG = /a/g;
assert.equal(reG.test("a"), true);
assert.equal(reG.test("a"), false); // continuou a partir do índice 1

// =============================================================================
// §23–§25 são assíncronos: correm dentro de main() para o ficheiro esperar por eles.
// =============================================================================
const sleep = (ms, valor) => new Promise((resolve) => setTimeout(() => resolve(valor), ms));

async function main() {
  // §23 ── PROMISES E ASYNC/AWAIT ─────────────────────────────────────────────
  // O QUE É: Promise = valor que chega DEPOIS. Estados: pending → fulfilled | rejected.
  // async function devolve sempre uma Promise; await espera por ela
  // (só dentro de async, ou no topo de um módulo ES).
  //
  //   combinador         → resolve quando…                    → rejeita quando…
  //   Promise.all        → TODAS resolvem (array, mesma ordem) → a 1ª rejeitar (fail-fast)
  //   Promise.allSettled → todas acabam (bem ou mal)          → nunca
  //   Promise.race       → a 1ª a ACABAR resolve              → a 1ª a acabar rejeita
  //   Promise.any        → a 1ª a RESOLVER                    → todas rejeitam (AggregateError)
  const p = new Promise((resolve, reject) => {
    const ok = true;
    ok ? resolve("feito") : reject(new Error("falhou"));
  });
  assert.equal(await p, "feito");

  // Estilo .then (encadeado) — equivalente ao await:
  const viaThen = await Promise.resolve(2)
    .then((v) => v * 10) // devolve valor → a próxima then recebe-o
    .then((v) => sleep(1, v + 1)) // devolve Promise → espera por ela
    .catch(() => -1) // apanha erros de qualquer passo acima
    .finally(() => {}); // corre sempre, não muda o valor
  assert.equal(viaThen, 21);

  // Erros com await: try/catch normal.
  async function falha() {
    throw new Error("rebentou"); // = Promise rejeitada
  }
  try {
    await falha();
    assert.fail("não devia chegar aqui");
  } catch (e) {
    assert.equal(e.message, "rebentou");
  }
  await assert.rejects(falha(), /rebentou/);

  // Sequencial vs paralelo:
  let t0 = Date.now();
  const seq1 = await sleep(30, "a"); // espera 30ms…
  const seq2 = await sleep(30, "b"); // …e depois mais 30ms ≈ 60ms
  const tSeq = Date.now() - t0;
  t0 = Date.now();
  const [par1, par2] = await Promise.all([sleep(30, "a"), sleep(30, "b")]); // ≈ 30ms
  const tPar = Date.now() - t0;
  assert.deepEqual([seq1, seq2], [par1, par2]);
  assert.ok(tSeq >= 55, "sequencial soma as esperas"); // timers nunca disparam antes do tempo
  // tPar ≈ 30ms, mas não se testa: numa máquina ocupada pode atrasar e o teste falhava ao acaso.
  void tPar;

  // Promise.all mantém a ORDEM do array, não a ordem de chegada:
  assert.deepEqual(await Promise.all([sleep(20, "lento"), sleep(1, "rápido")]), ["lento", "rápido"]);
  await assert.rejects(Promise.all([sleep(1, 1), Promise.reject(new Error("x"))]), /x/);

  const settled = await Promise.allSettled([Promise.resolve(1), Promise.reject(new Error("não"))]);
  assert.deepEqual(settled.map((r) => r.status), ["fulfilled", "rejected"]);
  assert.equal(settled[0].value, 1);
  assert.equal(settled[1].reason.message, "não");

  assert.equal(await Promise.race([sleep(20, "lento"), sleep(1, "rápido")]), "rápido");
  assert.equal(await Promise.any([Promise.reject(new Error()), sleep(1, "ok")]), "ok");

  // Timeout com race (padrão útil):
  const comTimeout = (promise, ms) =>
    Promise.race([promise, sleep(ms).then(() => { throw new Error("timeout"); })]);
  await assert.rejects(comTimeout(sleep(50), 5), /timeout/);

  // await num loop: for...of espera um a um. forEach NÃO espera (não usar com async).
  const ordem = [];
  for (const ms of [10, 1]) ordem.push(await sleep(ms, ms));
  assert.deepEqual(ordem, [10, 1]);

  // §24 ── EVENT LOOP ────────────────────────────────────────────────────────
  // O QUE É: JS corre numa só thread. Ordem:
  //   1. código síncrono até ao fim
  //   2. TODAS as microtasks (.then, await, queueMicrotask) — esvazia a fila
  //   3. UMA macrotask (setTimeout, setInterval, I/O) → volta ao passo 2
  // Por isso setTimeout(fn, 0) corre DEPOIS de qualquer Promise já resolvida.
  // (Só Node: process.nextTick tem fila própria, ainda antes das Promises.)
  const log = [];
  log.push("1 sync");
  setTimeout(() => log.push("5 macrotask: setTimeout 0"), 0);
  Promise.resolve().then(() => log.push("3 microtask: then"));
  queueMicrotask(() => log.push("4 microtask: queueMicrotask"));
  log.push("2 sync");
  await sleep(5); // dá tempo ao setTimeout
  assert.deepEqual(log, [
    "1 sync",
    "2 sync",
    "3 microtask: then",
    "4 microtask: queueMicrotask",
    "5 macrotask: setTimeout 0",
  ]);

  // Pergunta clássica de entrevista:
  const q = [];
  const tarefa = async () => {
    q.push("B"); // a parte antes do 1º await corre logo (síncrona)
    await null;
    q.push("D"); // depois do await → microtask
  };
  q.push("A");
  setTimeout(() => q.push("F"), 0);
  tarefa();
  Promise.resolve().then(() => q.push("E"));
  q.push("C");
  await sleep(5);
  assert.equal(q.join(""), "ABCDEF");

  // §25 ── TIMERS ────────────────────────────────────────────────────────────
  // O QUE É: agendar código para mais tarde (são macrotasks).
  //
  //   função               → o que faz
  //   setTimeout(fn, ms)   → corre fn UMA vez daqui a ≥ ms (mínimo, não exato); devolve id
  //   clearTimeout(id)     → cancela
  //   setInterval(fn, ms)  → corre fn a cada ms até clearInterval(id)
  //   clearInterval(id)    → pára
  //   sleep: new Promise(r => setTimeout(r, ms)) ou require("node:timers/promises").setTimeout
  const disparos = [];
  const idCancelado = setTimeout(() => disparos.push("nunca"), 5);
  clearTimeout(idCancelado);

  let tick = 0;
  await new Promise((resolve) => {
    const intervalId = setInterval(() => {
      tick++;
      if (tick === 3) {
        clearInterval(intervalId); // sem isto corre para sempre
        resolve();
      }
    }, 5);
  });
  assert.equal(tick, 3);
  assert.deepEqual(disparos, []); // o timeout cancelado não correu

  const { setTimeout: esperar } = require("node:timers/promises");
  assert.equal(await esperar(1, "valor"), "valor");

  // Debounce (closure + timer): só corre quando param as chamadas durante ms.
  const debounce = (fn, ms) => {
    let id;
    return (...args) => {
      clearTimeout(id);
      id = setTimeout(() => fn(...args), ms);
    };
  };
  const chamadas = [];
  const pesquisar = debounce((txt) => chamadas.push(txt), 10);
  pesquisar("t");
  pesquisar("ti");
  pesquisar("tia");
  await sleep(30);
  assert.deepEqual(chamadas, ["tia"]); // só a última
}

// §26 ── MÓDULOS ──────────────────────────────────────────────────────────────
// O QUE É: dividir código em ficheiros. Dois sistemas:
//
//   sistema    → exportar                       → importar
//   CommonJS   → module.exports = { soma }      → const { soma } = require("./mat")
//   ES Modules → export function soma() {}      → import { soma } from "./mat.js"
//              → export default X              → import X from "./mat.js"
//   CommonJS: Node clássico (.js por defeito, .cjs).
//   ESM: browser, e Node com .mjs ou "type": "module" no package.json.
//
// Diferenças-chave:
//   - ESM: import estático no topo, await no topo permitido, strict sempre.
//   - CJS: require é uma função normal e síncrona; corre quando é chamada.
//   - Import dinâmico (nos dois): const mod = await import("./mat.js");
//   - Em ESM o caminho leva extensão (".js"); em CJS é opcional.
//
// Exemplo ESM:
//   // mat.js
//   export const PI = 3.14;
//   export default function soma(a, b) { return a + b; }
//   // app.js
//   import soma, { PI } from "./mat.js";   // default sem { }, nomeados com { }
//   import * as mat from "./mat.js";        // tudo num objeto
assert.equal(typeof module.exports, "object"); // prova que este ficheiro é CommonJS
assert.equal(typeof require, "function");

// §27 ── ESTRUTURAS DE DADOS ─────────────────────────────────────────────────
// Linked list, árvores, BST e binary search estão em 02-LeetCode-Facil.js.

// =============================================================================
main().then(
  () => console.log("✅ Fundamentos OK"),
  (err) => {
    console.error(err);
    process.exitCode = 1;
  }
);
