// =============================================================================
// 01 — FUNDAMENTOS DE JAVASCRIPT (cheat sheet que corre e se verifica sozinho)
// Correr:  node 01-JS-Fundamentals.js   → tem de acabar em "✅ Fundamentals OK"
// Testado em Node 26. Verificar cada "// result ==>": node check-results.js 01-JS-Fundamentals.js
// Procurar: Ctrl+F "§7" salta para a secção 7. Formato de cada bloco: STYLE.md
// Cada exemplo vive dentro de { } para os nomes não colidirem entre blocos.
// =============================================================================
//
// ÍNDICE (Ctrl+F "§N")
//   §1  Variables (const, let, var, hoisting, TDZ)
//   §2  Types e conversões
//   §3  Operators (aritmética, ===, &&, ||, ??, ?., ternary)
//   §4  Truthy / Falsy
//   §5  Conditions (if, switch, lookup)
//   §6  Loops (for, while, for...of, break/continue)
//   §7  Strings
//   §8  Numbers e Math
//   §9  Arrays — methods que MUDAM o original
//   §10 Arrays — methods que NÃO mudam (map, filter, reduce…)
//   §11 Sort (sort / toSorted)
//   §12 Objects (+ JSON)
//   §13 Destructuring, spread, rest
//   §14 Map, Set, WeakMap
//   §15 Cópias: shallow vs deep
//   §16 Functions (declaration, expression, arrow, callbacks)
//   §17 Closures
//   §18 this, call/apply/bind
//   §19 Classes e prototypes
//   §20 Errors (try/catch/finally, throw)
//   §21 Dates
//   §22 Regex
//   §23 Promises e async/await
//   §24 Event loop (microtask vs macrotask)
//   §25 Timers (setTimeout, setInterval)
//   §26 Modules (import/export vs require)
//   §27 Data structures → ver 02-LeetCode-Easy.js
// =============================================================================

"use strict"; // o mesmo comportamento das classes e dos modules ES (ver §18)
const assert = require("node:assert/strict"); // só para os exemplos que lançam erro

// §1 ── VARIABLES ─────────────────────────────────────────────────────────────

//--------------------------------------------------------------------
// const - // serve para guardar algo que não vai ser substituído. É a escolha por omissão.
{
  const friends = ["Tiago", "Adelia"];
  friends.push("Rui"); // mudar o conteúdo é permitido
  friends; // result ==> ["Tiago", "Adelia", "Rui"]
  assert.throws(() => {
    const year = 1987;
    year = 2000; // dar outro value é proibido
  }, TypeError);
}
// nota: const fixa a caixa, não o que está lá dentro. Para fixar o conteúdo, usa Object.freeze (§12).
// nota2: const a = [1]; a.push(2) funciona, mas a = [1, 2] dá TypeError.

//--------------------------------------------------------------------
// let e var - // serve para guardar um value que vai mudar (let); var é a forma antiga, a evitar.
{
  function scope() {
    if (true) {
      var outside = "var";
      let inside = "let";
    }
    return [outside, typeof inside]; // typeof não dá erro com um nome que não existe
  }
  let name; //      declarar: cria a caixa, vale undefined
  name = "Tiago"; // atribuir: põe um value na caixa
  scope(); // result ==> ["var", "undefined"]
  name; // result ==> "Tiago"
}
// nota: o let só existe dentro das { } onde nasceu; o var foge das { } e vive na function inteira (scope).
// nota2: se trocares "var outside" por "let outside", scope() dá ReferenceError.

//--------------------------------------------------------------------
// Hoisting e TDZ - // serve para perceber porque um nome dá undefined, dá erro ou funciona antes da sua linha.
{
  function withVar() {
    const before = v; // v já existe (sobe ao topo), mas ainda sem value
    var v = 10;
    return before;
  }
  const r = double(2); // funciona: a function sobe inteira
  function double(n) {
    return n * 2;
  }
  withVar(); // result ==> undefined
  r; // result ==> 4
  assert.throws(() => {
    y; // y já existe, mas está na TDZ
    let y = 1;
  }, ReferenceError);
}
// nota: var sobe com undefined; let e const sobem mas ficam bloqueados até à sua linha (TDZ); function sobe pronta.
// nota2: undefined = existe sem value; ReferenceError = não se pode tocar-lhe.

// §2 ── TYPES E CONVERSÕES ────────────────────────────────────────────────────

//--------------------------------------------------------------------
// typeof - // serve para ver o type de um value, em string, antes de o usar.
typeof "Tiago";        // result ==> "string"
typeof 1987;           // result ==> "number"
typeof 42n;            // result ==> "bigint"
typeof true;           // result ==> "boolean"
typeof undefined;      // result ==> "undefined"
typeof Symbol("id");   // result ==> "symbol"
typeof function () {}; // result ==> "function"
typeof null;           // result ==> "object"  (bug antigo: null NÃO é um object)
typeof [];             // result ==> "object"  (arrays também)
Array.isArray([]);     // result ==> true  (a forma certa de testar um array)
// nota: são 7 primitivos (string, number, bigint, boolean, undefined, null, symbol); o resto são objects.
// nota2: typeof typeof 1 dá "string", porque typeof 1 já é a string "number".

//--------------------------------------------------------------------
// Value vs reference - // serve para perceber porque mudar "a cópia" de um object muda também o original.
{
  let p1 = 1987;
  let p2 = p1; // copia o value
  p2++;
  const o1 = { year: 1987 };
  const o2 = o1; // o mesmo object, dois nomes
  o2.year++;
  const o3 = { ...o1 }; // cópia a sério (§15)
  o3.year++;
  p1; // result ==> 1987
  o1.year; // result ==> 1988
  o3.year; // result ==> 1989
}
// nota: primitivos copiam-se, objects partilham-se. Só { ...o1 } cria um object novo.
// nota2: const a = [1]; const b = a; b.push(2); a.length dá 2, porque a e b são o mesmo array.

//--------------------------------------------------------------------
// Number() / String() / Boolean() - // serve para transformar a string de um formulário em número antes de fazer contas.
Number("17031987");  // result ==> 17031987
String(17031987);    // result ==> "17031987"
(255).toString(16);  // result ==> "ff"  (número → string em base 16)
Boolean("Tiago");    // result ==> true  (ver §4)
Boolean("");         // result ==> false
Boolean("false");    // result ==> true  (string não vazia é sempre true)
// nota: Number("12px") dá NaN, porque quer a string toda; parseInt("12px") lê até ao lixo (§8).

//--------------------------------------------------------------------
// Conversão automática - // serve para reconhecer as armadilhas em que o JS muda o type sozinho.
"5" + 1;    // result ==> "51"  (+ com string cola)
"5" - 1;    // result ==> 4  (- transforma em número)
"5" * "2";  // result ==> 10
+"3";       // result ==> 3  (+ à frente transforma em número)
[] + [];    // result ==> ""  (dois arrays viram "" e "")
1 + 2 + "3"; // result ==> "33"  (da esquerda para a direita: 3, e depois cola)
// nota: + soma se os dois lados forem números; cola se um for string. Os outros operators fazem sempre contas.

// §3 ── OPERATORS ─────────────────────────────────────────────────────────────

//--------------------------------------------------------------------
// % e aritmética - // serve para saber se um número é par, ou dar a volta a um index (relógio, array circular).
12 % 5;          // result ==> 2  (12 = 5*2 + 2)
5 % 12;          // result ==> 5  (o 12 cabe 0 vezes no 5)
10 % 2 === 0;    // result ==> true  (teste de número par)
-7 % 3;          // result ==> -1  (sinal da esquerda)
7 / 2;           // result ==> 3.5  (não há divisão inteira)
Math.trunc(7 / 2); // result ==> 3  (divisão inteira)
2 ** 10;         // result ==> 1024  (potência)
// resto sempre positivo, para -7 e 3:  -7 % 3 = -1;  -1 + 3 = 2;  2 % 3 = 2
((-7 % 3) + 3) % 3; // result ==> 2
// nota: % é o que sobra depois de tirar o número o máximo de vezes. 17 % 5 dá 2 (cabe 3 vezes, sobram 2).
// nota2: em JS, -7 % 3 dá -1, não 2 como no módulo matemático.

//--------------------------------------------------------------------
// ++ e -- - // serve para somar ou tirar 1 em counters e indexes de loops.
{
  let c = 1;
  const a = c++; // devolve 1 (o antigo) e depois soma: c = 2
  const b = ++c; // soma primeiro (c = 3) e devolve 3 (o novo)
  a; // result ==> 1
  b; // result ==> 3
  c; // result ==> 3
}
// nota: c++ devolve o value antigo; ++c devolve o novo. Com let i = 5; const r = i--, r vale 5 e i vale 4.
// nota2: c + 1 calcula sem mudar c; c++ muda c.

//--------------------------------------------------------------------
// += ||= ??= &&= - // serve para somar a um total, ou dar um default value só se a variable estiver "vazia".
{
  let total = 10;
  total += 5; // é total = total + 5
  let visits = 0;
  visits ||= 10; // 0 é falsy → atribui
  let visits2 = 0;
  visits2 ??= 10; // 0 não é null/undefined → fica 0
  let name = "tiago";
  name &&= name.toUpperCase(); // "tiago" é truthy → atribui
  total; // result ==> 15
  visits; // result ==> 10
  visits2; // result ==> 0
  name; // result ==> "TIAGO"
}
// nota: ||= atribui se for falsy; ??= só se for null/undefined; &&= só se for truthy.
// nota2: se o 0 for válido (0 visits), usa ??=. Com let x = ""; x ??= "empty", x continua "".

//--------------------------------------------------------------------
// === vs == e Object.is - // serve para comparar values sem conversões escondidas.
0 === "0";            // result ==> false
0 == "0";             // result ==> true  (== converte primeiro)
"" == 0;              // result ==> true
"" === 0;             // result ==> false
null == undefined;    // result ==> true  (o único caso útil de ==)
null === undefined;   // result ==> false
[1] === [1];          // result ==> false  (objects comparam o endereço, ver §2)
NaN === NaN;          // result ==> false  (NaN nunca é igual a nada)
Object.is(NaN, NaN);  // result ==> true
Object.is(0, -0);     // result ==> false  (mas 0 === -0 dá true)
// nota: usa sempre === e !== (value e type). Dois arrays só dão true se forem o MESMO array.

//--------------------------------------------------------------------
// < > <= >= com strings - // serve para perceber resultados estranhos ao comparar strings.
"a" < "b";      // result ==> true
"apple" < "banana"; // result ==> true  (pára na primeira letra diferente)
"Z" < "a";      // result ==> true  (maiúsculas primeiro)
"10" < "9";     // result ==> true  (duas strings: "1" < "9")
"10" < 9;       // result ==> false  (um número: compara 10 < 9)
// nota: duas strings comparam-se letra a letra, pelo código de cada uma. Com um número, o outro lado vira número.

//--------------------------------------------------------------------
// && || ! - // serve para juntar testes num if, ou escolher o primeiro value útil.
"Tiago" || "b";    // result ==> "Tiago"  (o primeiro truthy)
"" || "default";   // result ==> "default"
"Tiago" && "Adelia"; // result ==> "Adelia"  (o primeiro é truthy, devolve o segundo)
0 && "x";          // result ==> 0  (0 é falsy, pára logo)
!!"x";             // result ==> true  (!! transforma qualquer value em boolean)
false || 4 > 2;    // result ==> true
// nota: || pára no primeiro truthy; && pára no primeiro falsy. Devolvem o value que decidiu, não true/false.

//--------------------------------------------------------------------
// ?? - // serve para usar um value de reserva sem perder um 0 ou um "" que são válidos.
null ?? 5;       // result ==> 5
undefined ?? 5;  // result ==> 5
0 ?? 5;          // result ==> 0
0 || 5;          // result ==> 5  (|| também troca o 0)
"" ?? "x";       // result ==> ""
false ?? true;   // result ==> false
// nota: a ?? b dá b SÓ se a for null ou undefined; || troca qualquer falsy (0, "", false, NaN).

//--------------------------------------------------------------------
// ?. - // serve para ler user.address.street sem rebentar quando não há address.
{
  const user = { profile: { name: "Tiago" }, speak: () => "hi" };
  user.profile?.name;                  // result ==> "Tiago"
  user.address?.street;                // result ==> undefined  (sem TypeError)
  user.fly?.();                        // result ==> undefined  (method que pode não existir)
  user.address?.street ?? "no street"; // result ==> "no street"  (o par clássico)
  user.profile?.age ?? 18;             // result ==> 18
  assert.throws(() => user.address.street, TypeError); // sem ?. rebenta
}
// nota: se o lado esquerdo de ?. for null/undefined, a expression pára e dá undefined.
// nota2: ?. lê com segurança; ?? dá o value de reserva. Usam-se muitas vezes juntos.

//--------------------------------------------------------------------
// condition ? a : b - // serve para escolher entre dois values numa só expression (um if/else que devolve value).
{
  const age = 20;
  age >= 18 ? "adult" : "minor"; // result ==> "adult"
  0 ? "yes" : "no"; // result ==> "no"  (0 é falsy)
}
// nota: serve para escolher values; para executar ações, usa if.

// §4 ── TRUTHY / FALSY ────────────────────────────────────────────────────────

//--------------------------------------------------------------------
// Truthy e falsy - // serve para escrever if (arr.length) ou if (name) sem surpresas.
{
  const falsy = [false, 0, -0, 0n, "", null, undefined, NaN];
  const truthy = ["0", "false", " ", [], {}, () => {}, -1, Infinity];
  falsy.every((v) => !v);    // result ==> true
  truthy.every((v) => !!v);  // result ==> true
}
// nota: só estes 8 são falsy; tudo o resto é truthy, até "0", [] e {}. Por isso if ([]) { … } corre.
// nota2: if (n) falha para n = 0. Se 0 for válido, usa n !== undefined ou n ?? x. Array vazio: arr.length === 0.

// §5 ── CONDITIONS ────────────────────────────────────────────────────────────

//--------------------------------------------------------------------
// if / else e return antecipado - // serve para tratar os casos especiais primeiro e evitar ifs dentro de ifs.
{
  function weather(sky) {
    if (sky === "blue") {
      return "Good weather";
    } else if (sky === "dark") {
      return "May rain";
    } else {
      return "Did not check the forecast";
    }
  }
  function divide(a, b) {
    if (b === 0) return null; // caso especial primeiro: return sai já
    return a / b; //             só chega aqui se b !== 0
  }
  weather("dark");  // result ==> "May rain"
  weather("green"); // result ==> "Did not check the forecast"  (nenhuma condition serve, corre o else)
  divide(1, 0);     // result ==> null
  divide(6, 3);     // result ==> 2
}
// nota: com else if só corre um ramo; com ifs separados podem correr vários.
// nota2: dentro de uma function, return termina tudo: as linhas abaixo já não correm.

//--------------------------------------------------------------------
// switch - // serve para substituir uma fila de else if que testam sempre a mesma variable.
{
  function cases(n) {
    const r = [];
    switch (n) {
      case 1:
        r.push("one"); // sem break: cai no case 2
      case 2:
        r.push("two");
        break;
      default:
        r.push("other");
    }
    return r;
  }
  cases(1);   // result ==> ["one", "two"]
  cases(2);   // result ==> ["two"]
  cases(9);   // result ==> ["other"]
  cases("1"); // result ==> ["other"]  (o switch usa ===, e "1" !== 1)
}
// nota: sem break (ou return), corre também o case seguinte. Às vezes é de propósito, quase sempre é bug.

//--------------------------------------------------------------------
// Lookup num object - // serve para transformar um value noutro (código → string) sem if nem switch.
{
  const forecasts = { blue: "Good weather", dark: "May rain" };
  forecasts["blue"] ?? "Did not check the forecast";  // result ==> "Good weather"
  forecasts["green"] ?? "Did not check the forecast"; // result ==> "Did not check the forecast"
}
// nota: a key procura o value; ?? dá a reserva quando a key não existe.
// nota2: lookup só mapeia values; se cada caso precisa de lógica, usa switch ou if.
// §6 ── LOOPS ─────────────────────────────────────────────────────────────────

//--------------------------------------------------------------------
// for - // serve para repetir um código para cada posição (index) de um array, ou contar de x até y.
{
  const names = ["Tiago", "Adelia", "Rui"];
  const output = [];
  //      PARTIDA     CHEGADA              INCREMENTO
  // for (let i = 0; i < names.length; i++) { … }
  for (let i = 0; i < names.length; i++) output.push(`${i} => ${names[i]}`);
  output; // result ==> ["0 => Tiago", "1 => Adelia", "2 => Rui"]
  /* 0 => Tiago
     1 => Adelia
     2 => Rui      <- quando i chega a 3, a chegada (i < 3) é falsa e o loop acaba */

  const evens = [];
  for (let i = 0; i < 6; i += 2) evens.push(i);
  evens; // result ==> [0, 2, 4]  (o incremento pode ser outro, aqui +2)
}
// nota: a chegada é testada ANTES de cada iteration e o incremento corre DEPOIS. Com i <= names.length lia names[3], que é undefined.
// nota2: para percorrer um array de tamanho n usa i < n, porque o último index é n - 1.

//--------------------------------------------------------------------
// while e do...while - // serve para repetir sem saber quantas vezes, até uma condition mudar.
{
  let count = 1;
  const output = [];
  while (count <= 3) {
    output.push(count);
    count += 1; // sem isto o loop nunca acaba
  }
  output; // result ==> [1, 2, 3]

  let k = 10;
  do {
    k++;
  } while (k < 5);
  k; // result ==> 11  (o do...while corre uma vez antes de testar)

  let m = 10;
  while (m < 5) m++;
  m; // result ==> 10  (o while testa primeiro, por isso nunca correu)
}
// nota: while testa ANTES (pode correr 0 vezes); do...while testa DEPOIS (corre pelo menos 1 vez).
// nota2: o for faz o mesmo que o while, mas junta partida, chegada e incremento numa linha.

//--------------------------------------------------------------------
// for...of - // serve para percorrer os values de um array ou de uma string, sem mexer em indexes.
{
  const letters = [];
  for (const letter of "Tiago") letters.push(letter);
  letters; // result ==> ["T", "i", "a", "g", "o"]

  const pairs = [];
  for (const [i, v] of ["x", "y"].entries()) pairs.push(`${i}:${v}`);
  pairs; // result ==> ["0:x", "1:y"]  (.entries() dá [index, value])

  const keys = [];
  for (const k in ["a", "b"]) keys.push(k);
  keys; // result ==> ["0", "1"]  (for...in dá as keys, como string)
}
// nota: for...of dá os VALUES; for...in dá as KEYS de um object (§12). Evitar for...in em arrays.

//--------------------------------------------------------------------
// break e continue - // serve para parar o loop quando já encontrei o que queria, ou saltar uma iteration.
{
  const odds = [];
  for (let i = 0; i < 10; i++) {
    if (i % 2 === 0) continue; // salta esta iteration
    if (i > 5) break; // sai do loop de vez
    odds.push(i);
  }
  odds; // result ==> [1, 3, 5]  (sem o break seria [1, 3, 5, 7, 9])
}
// nota: break dentro de forEach não funciona; usa for...of, some() ou find() (§10).

//--------------------------------------------------------------------
// nested loops - // serve para passar por uma grid (array de arrays): o loop de fora escolhe a row, o de dentro passa por todas as cols dessa row.
{
  const grid = [
    [1, 2, 3],
    [4, 5, 6],
  ];
  const visited = [];
  // loop de fora: uma iteration por row
  for (let row = 0; row < grid.length; row++) {
    // loop de dentro: todas as cols desta row, antes de o de fora avançar
    for (let col = 0; col < grid[row].length; col++) {
      visited.push(`row ${row}, col ${col} => ${grid[row][col]}`);
    }
  }
  visited.length; // result ==> 6  (2 rows x 3 cols)
  /* row 0, col 0 => 1
     row 0, col 1 => 2
     row 0, col 2 => 3     <- o loop de dentro acabou, o de fora passa à row 1
     row 1, col 0 => 4     <- o col recomeça do 0
     row 1, col 1 => 5
     row 1, col 2 => 6 */

  const names = ["Tiago", "Adelia", "Rui"];
  const pairs = [];
  for (let i = 0; i < names.length; i++) {
    // j começa em i + 1: nunca junta um nome a ele próprio nem repete um par
    for (let j = i + 1; j < names.length; j++) {
      pairs.push(`${names[i]}-${names[j]}`);
    }
  }
  pairs; // result ==> ["Tiago-Adelia", "Tiago-Rui", "Adelia-Rui"]
}
// nota: o loop de dentro corre TODO em cada iteration do de fora, por isso são rows x cols iterations, O(n·m). Com j = 0 em vez de i + 1 aparecia "Tiago-Tiago" e "Adelia-Tiago".
// nota2: grid[row][col] → primeiro a row, depois a col.

//--------------------------------------------------------------------
// break com label - // serve para sair dos dois loops de uma vez, quando já encontrei o que procurava.
{
  const grid = [
    [1, 2],
    [3, 4],
    [5, 6],
  ];
  const seen = [];
  search: for (let row = 0; row < grid.length; row++) {
    for (let col = 0; col < grid[row].length; col++) {
      seen.push(`row ${row}, col ${col} => ${grid[row][col]}`);
      if (grid[row][col] === 4) break search;
    }
  }
  seen.length; // result ==> 4
  /* row 0, col 0 => 1
     row 0, col 1 => 2
     row 1, col 0 => 3
     row 1, col 1 => 4     <- parou aqui, o 5 e o 6 nunca aparecem */
  grid[1][0]; // result ==> 3
}
// nota: com "break" sem label, só sai o loop de dentro e o de fora continua, por isso aparecem o 5 e o 6.
// nota2: grid[1][0] → primeiro a row, depois a col.

// §7 ── STRINGS ───────────────────────────────────────────────────────────────

//--------------------------------------------------------------------
// Strings não mudam - // serve para perceber porque "tiago".toUpperCase() sozinho não faz nada: devolve uma string NOVA.
{
  const name = "tiago";
  const upper = name.toUpperCase();
  name; // result ==> "tiago"
  upper; // result ==> "TIAGO"
  assert.throws(() => {
    name[0] = "X";
  }, TypeError);
}
// nota: num array, arr[0] = "X" muda o original; numa string falha. Por isso há que guardar o resultado.
// nota2: let t = " a "; t.trim(); deixa t igual, porque o resultado "a" não foi guardado.

//--------------------------------------------------------------------
// length, [i], at(), charAt() - // serve para contar as letras de uma palavra e ler a letra numa posição.
{
  const word = "Tiago"; // T=0, i=1, a=2, g=3, o=4
  word.length; // result ==> 5
  word[2]; // result ==> "a"
  word.at(-1); // result ==> "o"  (-1 = última letra)
  word.charAt(2); // result ==> "a"
  word[99]; // result ==> undefined
  word.charAt(99); // result ==> ""
}
// nota: fora dos limites, [ ] dá undefined e charAt dá "". length não leva ().
// nota2: a última letra é s.at(-1) ou s[s.length - 1]. "Lisboa".at(-2) é "o".

//--------------------------------------------------------------------
// indexOf(), includes(), startsWith(), endsWith() - // serve para saber se uma string contém outra e em que posição.
"Adelia".indexOf("lia"); // result ==> 3
"Adelia".indexOf("z"); // result ==> -1  (não encontrou)
"banana".indexOf("a"); // result ==> 1  (a primeira ocorrência)
"banana".lastIndexOf("a"); // result ==> 5  (procura a partir do fim)
"Otorrino".includes("rri", 3); // result ==> true  (2.º argument: posição onde começa)
"file.js".startsWith("file"); // result ==> true
"file.js".endsWith(".js"); // result ==> true
// nota: indexOf dá a POSIÇÃO (ou -1); os outros dão true/false. Onde? indexOf. Existe? includes.
// nota2: if (s.indexOf(x)) falha quando x está na posição 0 (0 é falsy). Usa includes().

//--------------------------------------------------------------------
// slice(start, end) - // serve para cortar um pedaço de uma string, por exemplo as 2 primeiras letras.
{
  const sentence = "We are cool"; // W=0, e=1, espaço=2, a=3…
  sentence.slice(0, 2); // result ==> "We"  (indexes 0 e 1; o 2 não entra)
  sentence.slice(3); // result ==> "are cool"  (sem end, vai até ao fim)
  sentence.slice(-4); // result ==> "cool"  (as últimas 4)
  sentence.slice(3, -5); // result ==> "are"
  "Tiago".slice(1, 3); // result ==> "ia"
  "Tiago".substring(-3); // result ==> "Tiago"  (substring troca negativos por 0)
}
// nota: o end fica sempre de fora: slice(start, end) = [start, end[.
// nota2: com positivos slice e substring são iguais; com negativos, slice conta do fim. Prefere slice.

//--------------------------------------------------------------------
// toUpperCase(), trim(), padStart(), repeat() - // serve para limpar strings (maiúsculas, espaços) e formatar (zeros à esquerda).
"Lisboa".toUpperCase(); // result ==> "LISBOA"
"Lisboa".toLowerCase(); // result ==> "lisboa"
"  hi  ".trim(); // result ==> "hi"  (trimStart/trimEnd: só um lado)
"7".padStart(3, "0"); // result ==> "007"  (enche à esquerda até ter 3 letras)
"42".padStart(5, "0"); // result ==> "00042"
"7".padEnd(3, "-"); // result ==> "7--"
"Boa!".repeat(2); // result ==> "Boa!Boa!"
// nota: todos devolvem uma string nova.
// nota2: padStart(3) é o tamanho FINAL, não quantos zeros acrescenta.

//--------------------------------------------------------------------
// capitalizar - // serve para pôr a primeira letra em maiúscula, por exemplo "tiago" para "Tiago".
{
  //  "tiago"  →  charAt(0) = "t"  →  toUpperCase() = "T"  +  slice(1) = "iago"  →  "Tiago"
  const cap = (s) => s.charAt(0).toUpperCase() + s.slice(1);
  cap("tiago"); // result ==> "Tiago"
  cap("lISBOA"); // result ==> "LISBOA"  (só a 1.ª letra muda)
  cap(""); // result ==> ""  (não rebenta)
}
// nota: s[0].toUpperCase() rebenta com "" (s[0] é undefined); charAt(0) não.

//--------------------------------------------------------------------
// replace() e replaceAll() - // serve para trocar uma string por outra, por exemplo limpar traços ou espaços.
"a-b-c".replace("-", "+"); // result ==> "a+b-c"  (só a primeira)
"a-b-c".replaceAll("-", "+"); // result ==> "a+b+c"  (todas)
"a-b-c".replace(/-/g, "+"); // result ==> "a+b+c"  (regex com /g também troca todas)
"dirty room".replaceAll(" ", ""); // result ==> "dirtyroom"
// nota: replace com string troca SÓ A PRIMEIRA. "aaa".replace("a", "b") dá "baa".

//--------------------------------------------------------------------
// split() e join() - // serve para partir uma frase em palavras, mexer no array e voltar a juntar.
"I love JS".split(" "); // result ==> ["I", "love", "JS"]
"abc".split(""); // result ==> ["a", "b", "c"]
"a,b,,c".split(","); // result ==> ["a", "b", "", "c"]  (entre as vírgulas fica uma string vazia)
["I", "will", "join"].join(" "); // result ==> "I will join"
["a", "b"].join(""); // result ==> "ab"
["a", "b"].join(); // result ==> "a,b"  (sem separador usa ",")
// nota: split parte, join cola.

//--------------------------------------------------------------------
// inverter uma string - // serve para ler uma string ao contrário e ver se é palíndromo ("racecar").
{
  // "abc"  →  [..."abc"] = ["a", "b", "c"]  →  .reverse() = ["c", "b", "a"]  →  .join("") = "cba"
  [..."abc"].reverse().join(""); // result ==> "cba"
  const isPal = (s) => s === [...s].reverse().join("");
  isPal("racecar"); // result ==> true
  isPal("tiago"); // result ==> false
  isPal("Ana"); // result ==> false  ("anA" não é igual a "Ana")
}
// nota: as strings não têm reverse(); espalha para array, inverte e junta com "" (join() daria "c,b,a").
// nota2: para ignorar maiúsculas, usa toLowerCase() antes de comparar.

//--------------------------------------------------------------------
// charCodeAt() e fromCharCode() - // serve para transformar uma letra na sua posição 0..25, por exemplo para contar letras num array de 26.
//  "c" = 99, "a" = 97, e 99 - 97 = 2
"c".charCodeAt(0) - "a".charCodeAt(0); // result ==> 2
"z".charCodeAt(0) - "a".charCodeAt(0); // result ==> 25  (o alfabeto vai de 0 a 25)
String.fromCharCode(97); // result ==> "a"
String.fromCharCode(97 + 2); // result ==> "c"
// nota: para ordenar strings com acentos não compares códigos; usa localeCompare (§11).

//--------------------------------------------------------------------
// template literals - // serve para meter values dentro de uma string, sem concatenar com +.
{
  const n = 3;
  `I have ${n * 2} apples`; // result ==> "I have 6 apples"  (dentro de ${ } vai qualquer conta)
  `${1 + 1}${1}`; // result ==> "21"
  "I have ${n} apples"; // result ==> "I have ${n} apples"  (aspas normais não substituem)
}
// nota: só as crases ` ` substituem o ${ }. Também aceitam várias linhas.

// §8 ── NUMBERS E MATH ────────────────────────────────────────────────────────

//--------------------------------------------------------------------
// Math.floor(), ceil(), trunc(), round() - // serve para tirar as casas decimais: páginas (ceil), divisão inteira (trunc), value mais próximo (round).
Math.floor(1.7); // result ==> 1  (desce)
Math.ceil(1.2); // result ==> 2  (sobe)
Math.ceil(10 / 3); // result ==> 4  (3.33… sobe para 4)
Math.floor(-1.2); // result ==> -2  (desce: -2 é menor que -1.2)
Math.trunc(-1.2); // result ==> -1  (só corta as casas decimais)
Math.round(14.5); // result ==> 15
Math.round(-14.5); // result ==> -14  (o .5 vai sempre para cima)
// nota: floor e trunc são iguais em positivos; em negativos floor desce e trunc corta.

//--------------------------------------------------------------------
// toFixed() e Number.isInteger() - // serve para mostrar um preço com 2 casas decimais e saber se um número tem casas decimais.
{
  const x = 1987.8534;
  x.toFixed(1); // result ==> "1987.9"  (devolve STRING)
  (45).toFixed(2); // result ==> "45.00"
  Number(x.toFixed(1)); // result ==> 1987.9  (de volta a número)
  typeof (2.5).toFixed(0); // result ==> "string"
  Number.isInteger(x); // result ==> false
  Number.isInteger(5.0); // result ==> true  (5.0 é o mesmo que 5)
}
// nota: x.toFixed(2) + 1 dá "1987.851" (string colada), não uma soma.
// nota2: toFixed é para MOSTRAR, não para calcular.

//--------------------------------------------------------------------
// Number(), parseInt(), parseFloat() - // serve para ler um número de uma string, por exemplo "12px" de um CSS ou de um formulário.
Number("12px"); // result ==> NaN  (tudo ou nada)
Number(""); // result ==> 0  (cuidado: vazio vira 0)
Number("42 "); // result ==> 42  (ignora espaços nas pontas)
parseInt("12px", 10); // result ==> 12  (pára no lixo)
parseInt("4 2", 10); // result ==> 4  (pára no espaço do meio)
parseFloat("3.14abc"); // result ==> 3.14
parseInt("101", 2); // result ==> 5  (binário para decimal)
parseInt("ff", 16); // result ==> 255
["1", "2", "3"].map(parseInt); // result ==> [1, NaN, NaN]
["1", "2", "3"].map(Number); // result ==> [1, 2, 3]
// nota: Number quer a string TODA; parseInt e parseFloat leem do início até ao lixo. parseInt leva sempre a base (10).
// nota2: map passa (value, INDEX) e o index vira a base: parseInt("2", 1) = NaN, parseInt("3", 2) = NaN.

//--------------------------------------------------------------------
// toString(base) - // serve para escrever um número noutra base: binário (2), hexadecimal (16), cores RGB como "#FFFF00".
{
  (5).toString(2); // result ==> "101"
  (8).toString(2); // result ==> "1000"
  (10).toString(16).padStart(2, "0"); // result ==> "0a"

  // cada canal v (ex.: 300): Math.max(0, 300) = 300 → Math.min(255, 300) = 255 → (255).toString(16) = "ff" → padStart(2, "0") = "ff"
  const rgb = (r, g, b) =>
    [r, g, b]
      .map((v) => Math.min(255, Math.max(0, v)).toString(16).padStart(2, "0"))
      .join("")
      .toUpperCase();
  rgb(300, 255, 0); // result ==> "FFFF00"
}
// nota: os parênteses em (5).toString são obrigatórios num número escrito à mão.
// nota2: toString(16) vai de número para string; parseInt(string, 16) faz o contrário.

//--------------------------------------------------------------------
// NaN e Infinity - // serve para detetar uma conta falhada, por exemplo Number("abc").
typeof NaN; // result ==> "number"  (sim, a sério)
Number.isNaN(0 / 0); // result ==> true
Number.isNaN(Number("abc")); // result ==> true
Number.isNaN("abc"); // result ==> false  (é uma string, não é NaN)
isNaN("abc"); // result ==> true  (o isNaN global converte primeiro)
1 / 0; // result ==> Infinity
// nota: NaN nunca é igual a nada, nem a ele próprio (NaN !== NaN). Testa com Number.isNaN.

//--------------------------------------------------------------------
// decimais não são exatos - // serve para perceber porque 0.1 + 0.2 não dá 0.3 e porque o dinheiro se guarda em cêntimos.
0.1 + 0.2; // result ==> 0.30000000000000004
0.1 + 0.2 === 0.3; // result ==> false
Math.abs(0.1 + 0.2 - 0.3) < Number.EPSILON; // result ==> true  (compara com margem)
(1.005).toFixed(2); // result ==> "1.00"  (1.005 é guardado como 1.00499…)
10 + 20 === 30; // result ==> true  (0,10 € + 0,20 € em cêntimos é exato)
// nota: não é bug do JS; acontece em qualquer linguagem com decimais em binário (IEEE 754).
// nota2: inteiros até 2^53 - 1 são exatos, por isso dinheiro = cêntimos inteiros.

//--------------------------------------------------------------------
// BigInt - // serve para inteiros maiores que 2^53 - 1, como ids enormes, sem perder precisão.
Number.MAX_SAFE_INTEGER; // result ==> 9007199254740991  (2 ** 53 - 1)
2 ** 53 + 1 === 2 ** 53; // result ==> true  (perdeu precisão)
2n ** 64n; // result ==> 18446744073709551616n
BigInt(10) + 1n; // result ==> 11n
7n / 2n; // result ==> 3n  (corta as casas decimais)
10n / 3n; // result ==> 3n
assert.throws(() => 1n + 1, TypeError); // não se mistura bigint com number
// nota: escreve-se com n no fim (10n).
// nota2: 1n === 1 dá false (types diferentes), mas 1n == 1 dá true.

//--------------------------------------------------------------------
// Math.max() e Math.min() - // serve para saber o maior e o menor value de um array.
{
  const nums = [3, 9, 1];
  Math.max(...nums); // result ==> 9
  Math.min(...nums); // result ==> 1
  Math.max(nums); // result ==> NaN  (recebeu um array, não números soltos)
  Math.max(); // result ==> -Infinity  (sem números)
  Math.min(...[]); // result ==> Infinity
  nums.reduce((a, b) => Math.min(a, b)); // result ==> 1  (serve para arrays enormes, o spread tem limite)
}
// nota: max e min querem números SOLTOS; com um array, espalha com ...
// nota2: sem números, min começa em Infinity e max em -Infinity.

//--------------------------------------------------------------------
// Math.random() - // serve para um número aleatório, por exemplo um dado ou escolher um elemento ao acaso.
{
  // random(1, 10):  Math.random() = 0 … 0.999  →  × 10 = 0 … 9.99  →  floor = 0 … 9  →  + 1 = 1 … 10
  const random = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
  const rolls = Array.from({ length: 100 }, () => random(1, 10));
  rolls.every((r) => Number.isInteger(r) && r >= 1 && r <= 10); // result ==> true
}
// nota: random() dá um decimal de 0 até 1, e o 1 nunca sai. Sem o + 1 em (max - min + 1), o max nunca aparece.
// nota2: para um decimal de min a max, usa Math.random() * (max - min) + min.

//--------------------------------------------------------------------
// Math.sqrt(), abs(), hypot()... - // serve para contas do dia a dia: raízes, values absolutos, distâncias.
Math.sqrt(16); // result ==> 4  (raiz quadrada)
Math.cbrt(27); // result ==> 3  (raiz cúbica)
Math.abs(-3); // result ==> 3  (tira o sinal)
Math.abs(2 - 7); // result ==> 5
Math.hypot(3, 4); // result ==> 5  (√(3² + 4²): distância)
Math.sign(-5); // result ==> -1  (sinal: -1, 0 ou 1)
// nota: são functions de Math, não methods do número (Math.abs(x), não x.abs()).
// nota2: Math.sqrt(-1) não dá erro, dá NaN.
// §9 ── ARRAYS: METHODS QUE MUDAM O ORIGINAL ──────────────────────────────────
// Tudo aqui altera o array ORIGINAL.

//--------------------------------------------------------------------
// push(), pop(), unshift(), shift() - // serve para pôr e tirar nomes no fim ou no início do array (stack ou queue).
{
  const names = ["david", "costa"];
  names.push("pereira"); // result ==> 3  (devolve o novo tamanho)
  //  names agora: ["david", "costa", "pereira"]   <- entrou no fim
  names.unshift("tiago"); // result ==> 4
  //  names agora: ["tiago", "david", "costa", "pereira"]   <- entrou no início
  names.pop(); // result ==> "pereira"  (devolve o elemento tirado)
  //  names agora: ["tiago", "david", "costa"]   <- saiu o do fim
  names.shift(); // result ==> "tiago"
  //  names agora: ["david", "costa"]   <- saiu o do início
  names; // result ==> ["david", "costa"]   (voltou ao que era: 2 entraram, 2 saíram)
}
// nota: const r = [1].push(5) dá r = 2, não o array. push devolve um número.
// nota2: o fim (push/pop) é rápido; o início (unshift/shift) é lento em arrays grandes, porque move tudo.

//--------------------------------------------------------------------
// splice(index, howMany, ...items) - // serve para apagar, trocar ou inserir um elemento no meio do array.
{
  const items = ["i1", "i2", "i3", "i4", "i5"];
  items.splice(2, 1); // result ==> ["i3"]  (devolve um array com o que saiu)
  items.splice(3, 1, "i10"); // result ==> ["i5"]  (troca o i5 pelo i10)
  items.splice(3, 0, "i20"); // result ==> []  (howMany = 0, só insere)
  items; // result ==> ["i1", "i2", "i4", "i20", "i10"]
}
// nota: splice muda o original; slice só copia um pedaço (§10).
// nota2: ["a", "b", "c"].splice(0, 2) deixa o array em ["c"].

//--------------------------------------------------------------------
// fill(), reverse(), copyWithin(), length = 0 - // serve para preencher, inverter ou esvaziar um array no próprio sítio.
{
  const colors = ["red", "blue", "green"];
  colors.fill("green", 1, 2); // fill(value, start, end): o end não entra
  colors; // result ==> ["red", "green", "green"]

  const inv = ["one", "two", "three"];
  const returned = inv.reverse();
  inv; // result ==> ["three", "two", "one"]
  returned === inv; // result ==> true  (o MESMO array, não uma cópia)

  const junk = [1, 2, 3];
  junk.length = 0;
  junk; // result ==> []

  [1, 2, 3, 4, 5].copyWithin(0, 3); // result ==> [4, 5, 3, 4, 5]  (copia do index 3 para o 0)
}
// nota: reverse() muda o original; toReversed() devolve uma cópia (§10). sort() também muda (§11).
// nota2: const b = [1, 2].reverse(); b.push(9); deixa o a em [2, 1, 9], porque a e b são o mesmo array.

//--------------------------------------------------------------------
// new Array(), Array.from(), Array.of() - // serve para criar um array de n zeros, de 0 a n-1, ou a partir de uma string ou Set.
new Array(3).fill(0); // result ==> [0, 0, 0]
Array.from({ length: 4 }, (_, i) => i * i); // result ==> [0, 1, 4, 9]  (como um for que devolve array)
Array.from("abc"); // result ==> ["a", "b", "c"]
Array.from(new Set([1, 1, 2])); // result ==> [1, 2]  (tira repetidos)
Array.of(7); // result ==> [7]
// nota: new Array(7) cria 7 posições vazias; Array.of(7) cria [7].
// nota2: Array.from({ length: 3 }, (_, i) => i + 1) dá [1, 2, 3]. O i começa em 0.

//--------------------------------------------------------------------
// fill([]) numa matriz - // serve para criar uma grid vazia sem que todas as rows sejam a mesma.
{
  const bad = new Array(2).fill([]); // o MESMO array nas 2 posições
  bad[0].push("x");
  bad; // result ==> [["x"], ["x"]]  (⚠ a mesma row duas vezes)
  bad[0] === bad[1]; // result ==> true

  const good = Array.from({ length: 2 }, () => []); // uma row nova de cada vez
  good[0].push("x");
  good; // result ==> [["x"], []]
  good[1].length; // result ==> 0
}
// nota: fill(0) não tem este problema: 0 é primitivo, copia-se (§2).

// §10 ── ARRAYS: METHODS QUE NÃO MUDAM ────────────────────────────────────────
// Devolvem um value ou um array NOVO. O callback recebe (elemento, index, array).

//--------------------------------------------------------------------
// at(), slice(), concat(), includes(), indexOf() - // serve para ler o último elemento, copiar um pedaço, juntar arrays ou ver se algo existe.
{
  const arr = [1, 2, 3, 4, 5, 6];
  arr.at(-1); // result ==> 6
  arr.slice(1, 3); // result ==> [2, 3]  (o end não entra)
  arr.slice(); // result ==> [1, 2, 3, 4, 5, 6]  (sem arguments = cópia)
  [1, 2, 3].slice(-2); // result ==> [2, 3]  (-2 começa no penúltimo)
  [1, 2].concat([3], [4]); // result ==> [1, 2, 3, 4]
  arr.includes(3); // result ==> true
  arr.indexOf(3); // result ==> 2
  [NaN].includes(NaN); // result ==> true
  [NaN].indexOf(NaN); // result ==> -1  (indexOf usa ===, e NaN !== NaN)
}
// nota: nenhum destes muda o original.
// nota2: para "existe?" usa includes (dá true/false e encontra NaN).

//--------------------------------------------------------------------
// map() - // serve para transformar cada elemento, por exemplo duplicar preços ou passar objects para nomes.
{
  const cities = ["miami", "lisboa", "paris"];
  const cap = (s) => s.charAt(0).toUpperCase() + s.slice(1);
  [1, 2, 3].map((x) => x * 2); // result ==> [2, 4, 6]
  cities.map(cap); // result ==> ["Miami", "Lisboa", "Paris"]
  [1, 2, 3].map((x) => x > 1); // result ==> [false, true, true]  (true/false para CADA um)
  ["a", "b"].map((x, i) => x + i); // result ==> ["a0", "b1"]  (o 2.º argument é o index)
  [1, 2].map((x) => { x * 2; }); // result ==> [undefined, undefined]  (⚠ { } sem return)
}
// nota: devolve um array NOVO com o MESMO tamanho. forEach devolve undefined.
// nota2: com { } é preciso return, senão cada posição fica undefined.

//--------------------------------------------------------------------
// filter() - // serve para ficar só com os que passam no teste, por exemplo os adultos ou os pagamentos falhados.
{
  const people = [
    { name: "Ana", age: 25 },
    { name: "Rui", age: 17 },
    { name: "Bia", age: 30 },
  ];
  [1, 2, 3, 4, 5, 6].filter((x) => x % 2 === 0); // result ==> [2, 4, 6]
  people.filter((p) => p.age >= 18).map((p) => p.name); // result ==> ["Ana", "Bia"]  (o Rui tem 17, sai)
  [1, 2, 3].filter((x) => x > 5); // result ==> []  (nenhum passa: array vazio, não undefined)
}
// nota: filter dá TODOS os que passam (array); find dá só o primeiro (elemento).

//--------------------------------------------------------------------
// reduce() - // serve para transformar um array num só value, por exemplo somar ou contar letras.
{
  //  iteration   acc   cur   devolve
  //  1           0     2     2
  //  2           2     4     6
  //  3           6     6     12
  //  4           12    8     20
  [2, 4, 6, 8].reduce((acc, cur) => acc + cur, 0); // result ==> 20  (o 0 é o initial value)
  [12, 9, 1, 8].reduce((acc, cur) => acc + cur, 23); // result ==> 53  (começa em 23)
  ["a", "b", "c"].reduce((acc, x) => x + acc, ""); // result ==> "cba"  (cada letra vai à frente)
  assert.throws(() => [].reduce((a, b) => a + b), TypeError); // vazio e sem início → TypeError

  const freq = [..."banana"].reduce((acc, letter) => {
    acc[letter] = (acc[letter] ?? 0) + 1; // ler → somar → guardar
    return acc; // ⚠ sem este return, a iteration seguinte recebe undefined
  }, {});
  freq; // result ==> { b: 1, a: 3, n: 2 }  (com Map, ver §14)
}
// nota: o callback recebe (accumulator, current) e DEVOLVE o novo accumulator. Dá sempre o initial value.
// nota2: sem initial value, acc começa no 1.º elemento e cur no 2.º, e um array vazio rebenta.

//--------------------------------------------------------------------
// find(), findIndex(), findLast(), findLastIndex() - // serve para achar o utilizador com um certo id, ou a posição do primeiro erro.
{
  const arr = [1, 2, 3, 4, 5, 6];
  arr.find((x) => x > 3); // result ==> 4  (o elemento)
  arr.findIndex((x) => x > 3); // result ==> 3  (a posição)
  arr.find((x) => x > 100); // result ==> undefined
  arr.findIndex((x) => x > 100); // result ==> -1
  arr.findLast((x) => x % 2 === 1); // result ==> 5  (começa pelo fim)
  arr.findLastIndex((x) => x < 3); // result ==> 1
  [5, 12, 8].find((x) => x > 6); // result ==> 12  (pára no primeiro, o 8 nem é testado)
}
// nota: find dá UM elemento; filter dá um array.

//--------------------------------------------------------------------
// some(), every() - // serve para saber se algum value passa ("há algum negativo?") ou se todos passam ("está tudo preenchido?").
[1, 2, -3, 5].some((x) => x < 0); // result ==> true  (pelo menos um)
[17, 28, 5].every((x) => x > 10); // result ==> false  (o 5 falha)
[17, 28, 5].every((x) => x > 3); // result ==> true
["a", ""].every(Boolean); // result ==> false  ("" é falsy)
[].every((x) => x > 100); // result ==> true  (⚠ array vazio: ninguém falha)
[].some((x) => x > 100); // result ==> false
// nota: every num array vazio dá true. Se vazio deve falhar, testa também o length.

//--------------------------------------------------------------------
// flat(), flatMap() - // serve para achatar arrays dentro de arrays: [[1, 2], [3]] passa a [1, 2, 3].
[1, [2, [3, [4]]]].flat(); // result ==> [1, 2, [3, [4]]]  (desce 1 nível)
[1, [2, [3, [4]]]].flat(Infinity); // result ==> [1, 2, 3, 4]
[[1], [2, 3]].flat(); // result ==> [1, 2, 3]
["a b", "c"].flatMap((s) => s.split(" ")); // result ==> ["a", "b", "c"]  (map + flat)
// nota: com map em vez de flatMap, o split dava [["a", "b"], ["c"]].

//--------------------------------------------------------------------
// toSorted(), toReversed(), toSpliced(), with() - // serve para ordenar ou trocar um elemento sem estragar o original (por exemplo o estado em React).
{
  const orig = [3, 1, 2];
  orig.toSorted(); // result ==> [1, 2, 3]
  orig.toReversed(); // result ==> [2, 1, 3]
  orig.toSpliced(0, 1); // result ==> [1, 2]
  orig.with(0, 9); // result ==> [9, 1, 2]  (index 0 trocado)
  [5, 6].with(-1, 0); // result ==> [5, 0]  (-1 é o último)
  orig; // result ==> [3, 1, 2]  (intacto)
}
// nota: fazem o mesmo que sort, reverse, splice e arr[i] = v, mas devolvem uma CÓPIA.
// nota2: o "to" à frente do nome quer dizer cópia.

//--------------------------------------------------------------------
// forEach() - // serve para fazer algo com cada elemento (imprimir, guardar noutro sítio) quando não preciso de um array novo.
{
  const seen = [];
  const ret = ["snake", "tiger"].forEach((a) => {
    if (a === "snake") return; // só sai desta iteration, como um continue
    seen.push(a);
  });
  ret; // result ==> undefined  (forEach não devolve nada)
  seen; // result ==> ["tiger"]
}
// nota: não tem break. Para parar a meio, usa for...of com break (§6) ou some/find.
// nota2: keys(), values() e entries() dão iterators para usar com for...of (§6).

//--------------------------------------------------------------------
// filter().map().reduce() - // serve para dar a soma das idades dos adultos numa só expression.
{
  const people = [
    { name: "Candice", age: 25 },
    { name: "Tammy", age: 30 },
    { name: "Allen", age: 49 },
    { name: "Nettie", age: 21 },
    { name: "Stuart", age: 17 },
  ];
  // 1. filter(age >= 21)  → Candice, Tammy, Allen, Nettie
  // 2. map(p => p.age)    → [25, 30, 49, 21]
  // 3. reduce(sum, 0)     → 125
  const total = people
    .filter((p) => p.age >= 21)
    .map((p) => p.age)
    .reduce((a, b) => a + b, 0);
  total; // result ==> 125  (sem o filter entrava o Stuart: 142)
}
// nota: a ordem importa. Cada method recebe o array do anterior. Com map antes do filter, já não há objects.

// §11 ── SORT ─────────────────────────────────────────────────────────────────

//--------------------------------------------------------------------
// sort((a, b) => a - b) - // serve para ordenar preços do mais barato ao mais caro.
{
  const scores = [1, 10, 2, 21];
  [...scores].sort(); // result ==> [1, 10, 2, 21]  (⚠ sem function ordena como string: "10" < "2")
  [...scores].sort((a, b) => a - b); // result ==> [1, 2, 10, 21]  (crescente)
  [4, 2, 5, 10, 3].sort((a, b) => b - a); // result ==> [10, 5, 4, 3, 2]  (decrescente)
  [3, 20, 100].sort(); // result ==> [100, 20, 3]  (como string, "1" < "2" < "3")
  scores; // result ==> [1, 10, 2, 21]  (intacto, graças ao [...scores])
}
// nota: sort muda o original; toSorted(fn) faz o mesmo e devolve uma cópia. O resultado da function decide: negativo, a primeiro; positivo, b primeiro; 0, mantém.
// nota2: a - b sobe, b - a desce.

//--------------------------------------------------------------------
// localeCompare() - // serve para ordenar nomes portugueses com acentos e maiúsculas como num dicionário.
{
  const words = ["b", "A", "á", "a", "B"];
  ["word", "Word", "1 Word"].sort(); // result ==> ["1 Word", "Word", "word"]  (números, MAIÚSCULAS, minúsculas)
  words.toSorted(); // result ==> ["A", "B", "a", "b", "á"]  (o código da letra manda, acentos no fim)
  words.toSorted((a, b) => a.localeCompare(b, "pt")); // result ==> ["a", "A", "á", "b", "B"]
  "a".localeCompare("b"); // result ==> -1  (negativo: "a" primeiro)
}
// nota: a - b com strings dá NaN. Para strings usa sempre localeCompare.

//--------------------------------------------------------------------
// sort por 2 properties com || - // serve para ordenar por idade e, se empatar, por nome.
{
  const ps = [
    { n: "Rui", age: 30 },
    { n: "Ana", age: 25 },
    { n: "Bia", age: 30 },
  ];
  // Rui vs Bia: 30 - 30 = 0 (empate), o || passa ao nome → "Bia" antes
  // Rui vs Ana: 25 - 30 = -5, já decide (não chega ao nome)
  ps.toSorted((a, b) => b.age - a.age || a.n.localeCompare(b.n)).map((p) => p.n); // result ==> ["Bia", "Rui", "Ana"]
}
// nota: se a 1.ª comparação der 0, o || tenta a 2.ª. Se a Ana tivesse 30, ficava ["Ana", "Bia", "Rui"].
// nota2: ordenar duas vezes seguidas também funciona, mas é menos claro.

// §12 ── OBJECTS ──────────────────────────────────────────────────────────────

//--------------------------------------------------------------------
// criar, alterar e apagar keys - // serve para guardar os dados de uma coisa (um carro, um utilizador) por nome de property.
{
  const car = { brand: "VW", year: 2010 };
  car.color = "blue"; // key nova: cria
  car.year = 2012; // key que já existe: substitui
  delete car.color; // apaga
  car; // result ==> { brand: "VW", year: 2012 }
  const field = "brand";
  car[field]; // result ==> "VW"  ([ ] quando a key está numa variable)
  car.field; // result ==> undefined  (procura a key "field", que não existe)
  car.missing; // result ==> undefined  (sem erro)
}
// nota: o ponto usa o nome escrito; [ ] usa o VALUE da variable.
// nota2: const o = {}; o.a = 1; o.a = 2; deixa uma só key, a = 2.

//--------------------------------------------------------------------
// atalhos no object: { age }, [key]: value, hi() - // serve para escrever objects mais curtos a partir de variables.
{
  const field = "job";
  const person = { name: "Tiago", [field]: "web dev" };
  const age = 35;
  const short = { age, hi() { return "hi"; } };
  person.job; // result ==> "web dev"  (a key chama-se "job", o value de field)
  short.age; // result ==> 35  ({ age } = { age: age })
  short.hi(); // result ==> "hi"
  Object.keys({ [field + 1]: 0 }); // result ==> ["job1"]  (dentro de [ ] vai uma expression)
}
// nota: { field: 1 } cria a key "field"; { [field]: 1 } cria a key "job".

//--------------------------------------------------------------------
// in vs Object.hasOwn() - // serve para distinguir "a key não existe" de "a key existe com undefined".
{
  const car = { brand: "VW", empty: undefined };
  "brand" in car; // result ==> true
  "toString" in car; // result ==> true  (⚠ vê também as keys herdadas)
  Object.hasOwn(car, "toString"); // result ==> false  (só vê as do próprio object)
  Object.hasOwn(car, "empty"); // result ==> true  (existe, mesmo valendo undefined)
  car.empty !== undefined; // result ==> false  (este teste não vê a diferença)
  Object.hasOwn({}, "toString"); // result ==> false  (vem do prototype)
}
// nota: para "existe mesmo?" usa Object.hasOwn.

//--------------------------------------------------------------------
// Object.keys(), values(), entries() e for...in - // serve para listar as properties de um object ou percorrê-lo como um array.
{
  const obj = { k1: "v1", k2: "v2" };
  Object.keys(obj); // result ==> ["k1", "k2"]
  Object.values(obj); // result ==> ["v1", "v2"]
  Object.entries(obj); // result ==> [["k1", "v1"], ["k2", "v2"]]  (pares [key, value])
  Object.values({ a: 1, b: 2 }).length; // result ==> 2

  const viaIn = [];
  for (const k in obj) viaIn.push(`${k}=${obj[k]}`);
  viaIn; // result ==> ["k1=v1", "k2=v2"]

  const viaEntries = [];
  for (const [k, v] of Object.entries(obj)) viaEntries.push(`${k}=${v}`);
  viaEntries; // result ==> ["k1=v1", "k2=v2"]  (o mesmo, com entries)
}
// nota: for...in também dá keys herdadas. Prefere for...of com Object.entries.

//--------------------------------------------------------------------
// Object.fromEntries() - // serve para fazer um "map" sobre um object, por exemplo duplicar todos os preços.
{
  const prices = { bread: 1, milk: 2 };
  // 1. Object.entries(prices)       → [["bread", 1], ["milk", 2]]
  // 2. .map(([k, v]) => [k, v * 2]) → [["bread", 2], ["milk", 4]]
  // 3. Object.fromEntries(…)        → { bread: 2, milk: 4 }
  const doubled = Object.fromEntries(Object.entries(prices).map(([k, v]) => [k, v * 2]));
  doubled; // result ==> { bread: 2, milk: 4 }
  prices; // result ==> { bread: 1, milk: 2 }  (intacto)
  Object.fromEntries([["a", 1], ["a", 2]]); // result ==> { a: 2 }  (a mesma key duas vezes: a segunda ganha)
}
// nota: é o inverso de Object.entries. Também aceita um Map: Object.fromEntries(myMap).

//--------------------------------------------------------------------
// ordem das keys - // serve para perceber porque é que Object.keys não devolve a ordem em que escrevi.
Object.keys({ b: 1, 2: 1, a: 1, 1: 1 }); // result ==> ["1", "2", "b", "a"]  (inteiros primeiro, crescentes)
Object.keys({ z: 0, 10: 0, 5: 0 }); // result ==> ["5", "10", "z"]
// nota: depois dos inteiros vêm as keys de string, pela ordem de criação.
// nota2: com ids numéricos não contes com a ordem de criação. Usa um Map (§14).

//--------------------------------------------------------------------
// Object.assign() e Object.freeze() - // serve para juntar objects (assign) e proteger uma configuração contra alterações (freeze).
{
  const target = { a: 1 };
  Object.assign(target, { b: 2 }); // muda o target
  target; // result ==> { a: 1, b: 2 }

  const frozen = Object.freeze({ a: 1, inner: { b: 1 } });
  frozen.inner.b = 2; // ⚠ funciona: o object de dentro não está congelado
  frozen.inner.b; // result ==> 2
  assert.throws(() => {
    frozen.a = 2;
  }, TypeError); // 1.º nível bloqueado (TypeError em strict mode)
}
// nota: { ...a, ...b } cria um object novo; assign(a, b) muda o a.
// nota2: freeze só bloqueia o 1.º nível. Object.freeze([1, 2]).push(3) dá TypeError.

//--------------------------------------------------------------------
// Object.groupBy() - // serve para separar um array em grupos, por exemplo "adult" e "minor".
{
  const people = [
    { name: "Ana", age: 25 },
    { name: "Rui", age: 17 },
    { name: "Bia", age: 30 },
  ];
  // o callback devolve o NOME do grupo: Ana "adult", Rui "minor", Bia "adult"
  const groups = Object.groupBy(people, (p) => (p.age >= 18 ? "adult" : "minor"));
  groups.adult.map((p) => p.name); // result ==> ["Ana", "Bia"]
  groups.minor.map((p) => p.name); // result ==> ["Rui"]
  groups.senior; // result ==> undefined  (grupo sem ninguém não existe)
  Object.keys(Object.groupBy([1, 2, 3], (n) => (n % 2 ? "odd" : "even"))); // result ==> ["odd", "even"]
}
// nota: o object devolvido não tem prototype (não herda toString). Map.groupBy faz o mesmo mas devolve um Map.

//--------------------------------------------------------------------
// JSON.stringify() e JSON.parse() - // serve para enviar dados numa API ou guardá-los num ficheiro, como string.
{
  const json = JSON.stringify({ a: 1, b: [true, null] });
  json; // result ==> '{"a":1,"b":[true,null]}'
  JSON.parse(json); // result ==> { a: 1, b: [true, null] }  (parse faz o inverso)
  JSON.stringify({ f() {}, u: undefined }); // result ==> "{}"  (functions e undefined desaparecem)
  typeof JSON.stringify(5); // result ==> "string"  (devolve sempre string)
  assert.throws(() => JSON.parse("{a:1}"), SyntaxError); // em JSON as keys levam aspas
}
// nota: uma Date vira string. JSON é uma STRING com regras mais rígidas (aspas duplas, sem vírgula final).

// §13 ── DESTRUCTURING, SPREAD, REST ──────────────────────────────────────────
// "..." à DIREITA do = ou numa call é spread (espalha); à ESQUERDA ou nos parameters é rest (junta).

//--------------------------------------------------------------------
// const [a, b] = array - // serve para tirar values de um array por posição, ou trocar duas variables.
{
  //            POSIÇÃO 0  POSIÇÃO 1  O QUE SOBRA
  const [tomato, mushroom, ...rest] = ["🍅", "🍄", "🥦", "🥒"];
  const [, second] = [1, 2, 3]; // a vírgula salta a posição 0
  const [d1 = "default"] = []; //  default value
  let sa = 1;
  let sb = 2;
  [sa, sb] = [sb, sa]; // troca sem variable temporária
  tomato;    // result ==> "🍅"
  mushroom;  // result ==> "🍄"
  rest;      // result ==> ["🥦", "🥒"]
  second;    // result ==> 2
  d1;        // result ==> "default"
  [sa, sb];  // result ==> [2, 1]
}
// nota: [ ] à esquerda = por posição; { } à esquerda = por nome (ver o bloco a seguir).
// nota2: const [x, y = 5] = [1, null] dá y = null. O default value só entra para undefined.

//--------------------------------------------------------------------
// const { a, b } = object - // serve para ler várias properties de um object numa só linha, pelo nome.
{
  const person = { name: "Tiago", job: "web dev", profile: { city: "Porto" }, year: 1987 };
  //      KEY: NOVO NOME      KEY   KEY = DEFAULT
  const { name: personName, job, city = "Lisboa" } = person;
  const { profile: { city: profileCity } } = person; // entra dentro de outro object
  const { year, ...withoutYear } = person; //          ...rest junta o que sobra
  personName;    // result ==> "Tiago"
  job;           // result ==> "web dev"
  city;          // result ==> "Lisboa"
  profileCity;   // result ==> "Porto"
  year;          // result ==> 1987
  withoutYear;   // result ==> { name: "Tiago", job: "web dev", profile: { city: "Porto" } }
}
// nota: { name: x } à esquerda renomeia (x recebe o value). Num object à direita, cria a key name com o value x.
// nota2: const { a: b } = { a: 1 } cria só a variable b (com 1). O a é apenas a key a ler.

//--------------------------------------------------------------------
// desestruturar parameters - // serve para uma function receber um object de opções e ler as keys logo no cabeçalho.
{
  const introduce = ({ name, age = 0 }) => `${name} (${age})`;
  introduce({ name: "Rui" });          // result ==> "Rui (0)"
  introduce({ name: "Ana", age: 30 }); // result ==> "Ana (30)"
  introduce({ age: 5 });               // result ==> "undefined (5)"  (o name não veio)
  assert.throws(() => introduce(), TypeError); // sem argument não há object para desestruturar
}
// nota: para não rebentar sem argument, escreve ({ name, age = 0 } = {}) => ….
// nota2: com um object de opções, a ordem dos arguments deixa de importar.

//--------------------------------------------------------------------
// spread [...a] e {...o} - // serve para criar um array ou object novo a partir de outros, sem mexer nos originais.
{
  const old = ["Tiago", "John"];
  const students = [...old, "Xico"];
  const base = { a: 1, b: 2 };
  old;                    // result ==> ["Tiago", "John"]  (intacto)
  students;               // result ==> ["Tiago", "John", "Xico"]
  Math.max(...[1, 5, 3]); // result ==> 5  (espalhar numa call de function)
  [..."hey", "!"];        // result ==> ["h", "e", "y", "!"]  (uma string espalha-se letra a letra)
  ({ ...base, b: 3 });    // result ==> { a: 1, b: 3 }  (o b de depois ganha)
  ({ b: 3, ...base });    // result ==> { b: 2, a: 1 }  (agora ganha o b de base)
}
// nota: o que vem depois ganha. É uma shallow copy: objects lá dentro continuam partilhados (§15).

//--------------------------------------------------------------------
// rest (...args) - // serve para uma function aceitar quantos arguments quiser, como sum(1, 2, 3).
{
  //                  ...ns = array com todos os arguments (tem de ser o último parameter)
  const sum = (...ns) => ns.reduce((a, b) => a + b, 0);
  const firstAndRest = (first, ...others) => [first, others];
  sum(1, 2, 3);            // result ==> 6
  sum();                   // result ==> 0  (ns = [], o reduce começa em 0)
  firstAndRest(1, 2, 3);   // result ==> [1, [2, 3]]
  firstAndRest(9);         // result ==> [9, []]  (não sobrou nada)
}
// nota: o mesmo "...": nos parameters junta (rest); numa call espalha (spread).

// §14 ── MAP, SET, WEAKMAP ───────────────────────────────────────────────────

//--------------------------------------------------------------------
// Map.set() - // serve para guardar o saldo de cada pessoa pelo nome.
{
  const balances = new Map();
  balances.set("ana", 10);
  balances.set("bruno", 30);
  balances.set("ana", 25); // a key já existe: substitui o value
  balances.size;       // result ==> 2
  balances.get("ana"); // result ==> 25  (não 35: o Map não soma sozinho)
  balances.set("bruno", 5);
  balances.get("bruno"); // result ==> 5  (o 30 foi substituído)
}
// nota: push(x) acrescenta sempre um elemento novo. set(key, value) substitui se a key já existe.

//--------------------------------------------------------------------
// acumular num Map - // serve para somar todos os movimentos de cada conta.
{
  const transactions = [["ana", 10], ["bruno", 30], ["ana", 15]];
  const totals = new Map();
  for (const [account, amount] of transactions) {
    const previous = totals.get(account) ?? 0; // 1. ler (0 se a conta ainda não existe)
    const next = previous + amount; //            2. somar
    totals.set(account, next); //                 3. guardar (substitui o anterior)
  }
  totals.get("ana"); // result ==> 25  (10 + 15)
  totals.get("bruno"); // result ==> 30
}
// nota: versão curta, os mesmos 3 passos: totals.set(account, (totals.get(account) ?? 0) + amount).
// nota2: ?? só troca undefined/null; || também trocaria um 0 guardado.

//--------------------------------------------------------------------
// Map: get, has, delete, keys - // serve para consultar contagens (letra → vezes) sem estragar nada.
{
  const counts = new Map([["a", 1]]);
  counts.set("b", 2).set("c", 3); // set() devolve o próprio Map, dá para encadear
  const objKey = { id: 1 };
  counts.set(objKey, "object as key");
  counts.get("a"); // result ==> 1
  counts.get("z"); // result ==> undefined  (key que não existe, sem erro)
  counts.get("z") ?? 0; // result ==> 0
  counts.has("b"); // result ==> true  (só pergunta, não lê o value)
  counts.delete("c"); // result ==> true  (false se não existia)
  counts.get(objKey); // result ==> "object as key"
  counts.size; // result ==> 3  (a, b e objKey)
  [...counts.keys()].slice(0, 2); // result ==> ["a", "b"]  (ordem de inserção)
}
// nota: num {} a key vira string ("[object Object]"). O Map guarda o object tal como é.
// nota2: também há clear(), values(), entries(); for (const [key, value] of map) percorre por ordem.

//--------------------------------------------------------------------
// Map ↔ object - // serve para receber um object JSON e trabalhar nele como Map, ou o contrário para enviar.
{
  Object.fromEntries(new Map([["x", 1]])); // result ==> { x: 1 }
  [...new Map(Object.entries({ y: 2 }))]; // result ==> [["y", 2]]
  Object.fromEntries([["a", 1], ["a", 2]]); // result ==> { a: 2 }  (a segunda substitui a primeira)
}
// nota: entries (array de pares [key, value]) é a ponte entre os dois.
// nota2: JSON.stringify(map) dá "{}". Converte primeiro com Object.fromEntries.

//--------------------------------------------------------------------
// Set - // serve para guardar values únicos: saber "já vi isto?" depressa, ou tirar repetidos de um array.
{
  const seen = new Set([1, 2, 2, 3]);
  seen.add(3); // já existe: ignorado
  seen.size; // result ==> 3  (o 2 repetido fica só uma vez)
  seen.has(2); // result ==> true
  [...new Set([3, 1, 3, 2, 1])]; // result ==> [3, 1, 2]  (tirar repetidos, mantém a ordem)
  new Set([[1], [1]]).size; // result ==> 2  (dois arrays diferentes, mesmo conteúdo)
  new Set("banana").size; // result ==> 3  (só ficam b, a, n)
}
// nota: Set guarda só values; Map guarda value por key. Objects comparam-se pela reference.

//--------------------------------------------------------------------
// union / intersection / difference - // serve para comparar dois arrays, por exemplo os clientes de ontem e de hoje.
{
  const A = new Set([1, 2, 3]);
  const B = new Set([2, 3, 4]);
  [...A.union(B)]; // result ==> [1, 2, 3, 4]  (está em A ou em B)
  [...A.intersection(B)]; // result ==> [2, 3]  (está em A e em B)
  [...A.difference(B)]; // result ==> [1]  (está em A e não em B)
  [...B.difference(A)]; // result ==> [4]  (a ordem conta)
  [...A.intersection(new Set([9]))]; // result ==> []  (nada em comum)
}
// nota: devolvem um Set novo; A e B ficam iguais.

//--------------------------------------------------------------------
// WeakMap - // serve para prender dados a um object (ex.: cliques de um elemento) sem impedir que ele seja apagado da memória.
{
  const cache = new WeakMap();
  const element = {};
  cache.set(element, { clicks: 1 });
  cache.get(element).clicks; // result ==> 1
  assert.throws(() => cache.set("text", 1), TypeError); // a key tem de ser um object
}
// nota: um Map mantém a key viva para sempre; o WeakMap deixa-a ir quando mais ninguém a usa.
// nota2: não dá para fazer for...of, nem tem keys() ou size, porque as entries podem desaparecer a qualquer momento.

// §15 ── CÓPIAS: SHALLOW VS DEEP ─────────────────────────────────────────────

//--------------------------------------------------------------------
// shallow copy {...o} / [...a] - // serve para mudar uma property de um object sem mexer no original.
{
  const book = { author: "Charlotte Bronte", tags: ["romance"] };
  const shallow = { ...book };
  shallow.author = "Emily";
  shallow.tags.push("classic");
  shallow === book; // result ==> false
  book.author; // result ==> "Charlotte Bronte"  (1.º nível: separado)
  book.tags; // result ==> ["romance", "classic"]  (o array de dentro é partilhado)
  const a = [[1]];
  const b = [...a];
  b[0].push(2);
  a[0]; // result ==> [1, 2]  (b é novo, mas b[0] e a[0] são o mesmo array)
}
// nota: b = a não copia nada, é o mesmo object com dois nomes. {...a} é outro object, mas só copia o 1.º nível.
// nota2: a.slice() e Object.assign({}, o) também são shallow.

//--------------------------------------------------------------------
// structuredClone - // serve para copiar um object inteiro, em todos os níveis, para o mudar sem medo.
{
  const original = { d: new Date(0), tags: ["a"], m: new Map([[1, 2]]) };
  const deep = structuredClone(original);
  deep.tags.push("b");
  original.tags; // result ==> ["a"]
  deep.d instanceof Date; // result ==> true
  deep.m.get(1); // result ==> 2
  typeof JSON.parse(JSON.stringify(original)).d; // result ==> "string"  (o truque JSON estraga a data)
  JSON.parse(JSON.stringify({ m: new Map([[1, 2]]) })).m; // result ==> {}  (e o Map)
  assert.throws(() => structuredClone({ f() {} })); // functions não se copiam
}
// nota: structuredClone mantém Date, Map e Set. O truque JSON.parse(JSON.stringify(x)) perde-os e as functions.

// §16 ── FUNCTIONS ───────────────────────────────────────────────────────────

//--------------------------------------------------------------------
// três formas de criar uma function - // serve para escolher a forma certa e saber ler as três em código alheio.
{
  declared(2); // funciona: a declaration sobe para o topo do bloco (hoisting)
  function declared(a) {
    return a * 2;
  }
  const expression = function (a) {
    return a * 2;
  };
  const arrow = (a) => a * 2; //                     1 linha sem { } → devolve sozinha
  const arrowBlock = (a) => { return a * 2; }; //    com { } → precisa de return
  const arrowObject = () => ({ ok: true }); //       para devolver um object, envolver em ( )
  const iife = (() => 42)(); //                      IIFE: criada e chamada logo
  declared(2); // result ==> 4
  expression(2) + arrow(2) + arrowBlock(2); // result ==> 12
  arrowObject(); // result ==> { ok: true }
  iife; // result ==> 42
  const f = (a) => { a + 1; };
  f(1); // result ==> undefined  (com { } é um bloco e falta o return)
}
// nota: só a declaration (function name) se pode chamar antes da linha onde está. As outras duas dão erro (TDZ).
// nota2: () => { ok: true } devolve undefined, as { } são lidas como bloco. Uma arrow function não tem this próprio (§18).

//--------------------------------------------------------------------
// return - // serve para entregar a quem chamou o value da function; só esse value sai.
{
  function total(price, qty, shipping) {
    const subtotal = price * qty; // calculado, invisível lá fora
    if (qty === 0) return 0; //      termina aqui se não há nada
    return subtotal + shipping; //   devolvido a quem chamou
  }
  const noReturn = (a) => { a * 2; }; // calcula, mas não devolve
  function two() { return 1; return 2; }
  total(10, 2, 5); // result ==> 25
  total(10, 0, 5); // result ==> 0  (o último return nem corre)
  noReturn(5); // result ==> undefined
  two(); // result ==> 1  (o primeiro return termina a function)
}
// nota: console.log mostra no ecrã; return entrega o value ao código.

//--------------------------------------------------------------------
// default parameters - // serve para cumprimentar "anonymous" quando não vem nome.
{
  const hi = (name = "anonymous") => `hi ${name}`;
  hi(); // result ==> "hi anonymous"
  hi(undefined); // result ==> "hi anonymous"
  hi(null); // result ==> "hi null"  (null não ativa o default value)
  hi(""); // result ==> "hi "  (a string vazia também não)
}
// nota: o default value só entra para undefined. name ?? "x" troca também o null.

//--------------------------------------------------------------------
// object passado a uma function - // serve para saber se uma function pode alterar os dados de quem a chama.
{
  const mutate = (o) => { o.x = 1; };
  const reassign = (o) => { o = { x: 99 }; };
  const target = {};
  mutate(target); //   altera o object partilhado
  reassign(target); // o passa a apontar para outro object; target não muda
  target; // result ==> { x: 1 }
  const g = (n) => { n = n + 1; };
  let a = 5;
  g(a);
  a; // result ==> 5  (n é outra variable)
}
// nota: a function recebe a mesma reference: mudar uma property vê-se fora, trocar o parameter não.

//--------------------------------------------------------------------
// callback e higher-order function - // serve para passar "o que fazer" a outra function, como em map, filter e setTimeout.
{
  const apply = (value, callback) => callback(value);
  const multiplier = (factor) => (n) => n * factor;
  const triple = multiplier(3);
  apply(5, (v) => v + 1); // result ==> 6  (callback(5) → 5 + 1)
  triple(4); // result ==> 12
  multiplier(2)(5); // result ==> 10  (multiplier(2) devolve uma function, já chamada com 5)
}
// nota: callback = function passada como argument. Higher-order = function que recebe ou devolve functions.
// nota2: apply(5, f) passa a function; apply(5, f()) chama-a já e passa o resultado.

//--------------------------------------------------------------------
// recursion - // serve para problemas que se repetem em tamanho menor, como o fatorial.
{
  const factorial = (n) => (n <= 1 ? 1 : n * factorial(n - 1));
  factorial(3); // result ==> 6  (3 * 2 * 1; as contas fazem-se na subida)
  factorial(5); // result ==> 120
  factorial(0); // result ==> 1  (0 <= 1 é o base case)
}
// nota: sem base case a stack esgota (RangeError).

// §17 ── CLOSURES ────────────────────────────────────────────────────────────

//--------------------------------------------------------------------
// closure - // serve para ter um counter privado que só as suas functions podem mexer.
{
  function createCounter() {
    let count = 0;
    return { inc: () => ++count, get: () => count };
  }
  const counterA = createCounter();
  const counterB = createCounter();
  counterA.inc();
  counterA.inc();
  counterB.inc();
  counterA.get(); // result ==> 2
  counterB.get(); // result ==> 1
  counterB.inc();
  counterA.get(); // result ==> 2  (o count de B é outra variable)
}
// nota: cada call a createCounter() cria um count novo, vivo enquanto as functions devolvidas existirem.
// nota2: a closure guarda a variable, não uma cópia; por isso get() vê sempre o value atual.

//--------------------------------------------------------------------
// memoization - // serve para tornar rápida uma function lenta e chamada muitas vezes com os mesmos values, como o fibonacci.
{
  function memo(fn) {
    const cache = new Map();
    return (n) => {
      if (!cache.has(n)) cache.set(n, fn(n)); // calcula só da 1.ª vez
      return cache.get(n); //                     devolve o guardado
    };
  }
  const fib = memo((n) => (n < 2 ? n : fib(n - 1) + fib(n - 2)));
  fib(2); // result ==> 1
  fib(50); // result ==> 12586269025  (instantâneo; sem memo seriam milhares de milhões de calls)
}
// nota: a cache vive na closure. Ordem: perguntar à cache, calcular se falta, guardar, devolver.
// nota2: só funciona se a function der sempre o mesmo resultado para o mesmo n.

//--------------------------------------------------------------------
// var vs let num loop - // serve para perceber porque functions criadas num loop com var veem todas o último value.
{
  const fnsVar = [];
  for (var iv = 0; iv < 3; iv++) fnsVar.push(() => iv); // var: UMA variable para o loop todo
  const fnsLet = [];
  for (let il = 0; il < 3; il++) fnsLet.push(() => il); // let: uma variable nova por iteration
  fnsVar.map((fn) => fn()); // result ==> [3, 3, 3]
  fnsLet.map((fn) => fn()); // result ==> [0, 1, 2]
}
// nota: as functions só leem iv quando são chamadas, e nessa altura o loop já acabou (iv = 3).
// nota2: em loops, usa let.

// §18 ── THIS, CALL/APPLY/BIND ───────────────────────────────────────────────

//--------------------------------------------------------------------
// this - // serve para um method ler os dados do próprio object.
{
  const account = {
    owner: "Tiago",
    normal() { return this?.owner; },
    withArrow() { return [1].map(() => this.owner)[0]; }, // a arrow function usa o this do method
  };
  const loose = account.normal; // tirada do object
  account.normal(); // result ==> "Tiago"  (this = o que está antes do ponto)
  loose(); // result ==> undefined  (sem nada antes do ponto, this é undefined)
  account.withArrow(); // result ==> "Tiago"
}
// nota: um method escrito como arrow function { f: () => this.owner } não vê o object: a arrow apanha o this de fora.
// nota2: setTimeout(account.normal, 0) também passa a function solta. Sem o ?. em this?.owner, loose() daria TypeError.

//--------------------------------------------------------------------
// call / apply / bind - // serve para usar um method com outro object, ou fixar o this antes de passar a function.
{
  function normal() { return this.owner; }
  const bound = normal.bind({ owner: "Bia" }); // bind não chama: devolve uma function nova com this fixo
  normal.call({ owner: "Ana" }); // result ==> "Ana"  (chama já, arguments um a um)
  normal.apply({ owner: "Rui" }, []); // result ==> "Rui"  (chama já, arguments num array)
  bound(); // result ==> "Bia"
  bound.call({ owner: "Zé" }); // result ==> "Bia"  (o this de um bind já não muda)
}
// nota: call e apply fazem o mesmo; só muda como se passam os arguments (A de apply = Array).

// §19 ── CLASSES E PROTOTYPES ────────────────────────────────────────────────

//--------------------------------------------------------------------
// class + constructor - // serve para criar muitas pessoas com as mesmas properties e methods, sem repetir código.

class Person {
  static species = "human"; // pertence à class, não a cada pessoa
  #secret; //                  private: só a class vê
  kind = "person"; //          public field

  constructor(name = "Adelia", age = 34) { // corre no new
    this.name = name;
    this.age = age;
    this.#secret = "1234";
  }
  birthYear(currentYear) { // method
    return currentYear - this.age;
  }
  get intro() { return `${this.name}, ${this.age}`; }
  set safeAge(v) {
    if (v < 0) throw new RangeError("negative age");
    this.age = v;
  }
  checkSecret(attempt) { return attempt === this.#secret; }
  static baby(name) { return new Person(name, 0); }
}
const personTiago = new Person("Tiago", 33);
// new faz: 1) cria object vazio  2) corre o constructor com this = esse object  3) devolve-o
personTiago.name; // result ==> "Tiago"
new Person().name; // result ==> "Adelia"  (default value)
new Person("Ana").age; // result ==> 34  (a age não foi passada, entra a default)
personTiago.birthYear(2020); // result ==> 1987
// nota: sem o new, Person("Tiago") dá TypeError numa class.

//--------------------------------------------------------------------
// get / set / #private / static - // serve para properties calculadas, validar ao atribuir, esconder dados e ter coisas que são da class.

personTiago.intro; // result ==> "Tiago, 33"  (get usa-se sem parênteses, como uma property)
assert.throws(() => { personTiago.safeAge = -1; }, RangeError);
personTiago.checkSecret("1234"); // result ==> true
personTiago.secret; // result ==> undefined  (o #secret está escondido)
Person.species; // result ==> "human"  (static usa-se pela class)
Person.baby("Bia").age; // result ==> 0
personTiago.species; // result ==> undefined  (pelo object não se vê)
// nota: personTiago.intro() dá TypeError, porque um get é lido como property, não chamado.

//--------------------------------------------------------------------
// extends + super - // serve para um Athlete ser uma Person com a height a mais, sem copiar a class.

class Athlete extends Person {
  constructor(name, age, height) {
    super(name, age); // corre o constructor de Person
    this.height = height;
  }
  get intro() { // substitui o da parent class, mas reutiliza-o
    return `${super.intro} — ${this.height}cm`;
  }
}
const athleteRui = new Athlete("Rui", 33, 175);
athleteRui.intro; // result ==> "Rui, 33 — 175cm"  (versão da child class + super)
athleteRui instanceof Athlete; // result ==> true
athleteRui instanceof Person; // result ==> true  (a chain passa pelas duas)
athleteRui.birthYear(2020); // result ==> 1987  (method herdado da parent class)
athleteRui.checkSecret("1234"); // result ==> true  (o #secret foi criado pelo constructor da parent class)
// nota: usar this antes de super() dá ReferenceError.

//--------------------------------------------------------------------
// prototypes - // serve para perceber porque os methods não são copiados para cada object.
{
  const base = { speak() { return "hi from " + this.n; } };
  const child = Object.create(base); // child herda de base
  child.n = "child";

  // personTiago.birthYear: não tem no object -> procura em Person.prototype -> tem -> usa esse
  Object.getPrototypeOf(personTiago) === Person.prototype; // result ==> true
  Object.getPrototypeOf(Athlete.prototype) === Person.prototype; // result ==> true  (chain Athlete -> Person)
  Object.hasOwn(personTiago, "birthYear"); // result ==> false  (partilhado, não copiado)
  typeof Person; // result ==> "function"
  child.speak(); // result ==> "hi from child"
  Object.hasOwn(child, "speak"); // result ==> false  (vive em base, child só o encontra pela chain)
}
// nota: class não é um type novo, por baixo é uma function com prototype.

// §20 ── ERRORS ──────────────────────────────────────────────────────────────

//--------------------------------------------------------------------
// try/catch/finally - // serve para uma string inválida não rebentar o programa todo.
{
  function readAge(txt) {
    const num = Number(txt);
    if (Number.isNaN(num)) throw new TypeError(`not a number: ${txt}`); // termina a function, como um return
    return num;
  }
  const steps = [];
  try {
    steps.push("try");
    readAge("abc");
    steps.push("never gets here");
  } catch (err) {
    steps.push(`catch ${err.name}`); // err.name, err.message, err.stack
  } finally {
    steps.push("finally");
  }
  // o throw salta logo para o catch, o resto do try não corre; o finally corre sempre
  steps; // result ==> ["try", "catch TypeError", "finally"]
}
// nota: lança sempre um Error (TypeError, RangeError...) e não uma string: traz name e stack. Se readAge("5") não falhasse, o catch não corria.

//--------------------------------------------------------------------
// custom error + cause - // serve para dizer "invalid config" e manter o SyntaxError que o causou.
{
  class ValidationError extends Error {
    constructor(msg, options) {
      super(msg, options);
      this.name = "ValidationError";
    }
  }
  let caught;
  try {
    try {
      JSON.parse("{bad");
    } catch (e) {
      throw new ValidationError("invalid config", { cause: e });
    }
  } catch (e) {
    caught = e;
  }
  caught instanceof ValidationError; // result ==> true
  caught instanceof Error; // result ==> true  (herda de Error)
  caught.cause instanceof SyntaxError; // result ==> true  (o erro original)
  caught.name; // result ==> "ValidationError"  (o constructor escreveu por cima do "Error")
}
// nota: sem { cause: e } o erro original perde-se e só fica a mensagem nova.

//--------------------------------------------------------------------
// catch sem variable e finally depois de return - // serve para ignorar o erro quando não preciso dele, e limpar mesmo quando a function já devolveu.
{
  let failed = false;
  try { null.x; } catch { failed = true; }  // catch { } dispensa o (err)
  const log = [];
  const withFinally = () => { try { return "try"; } finally { log.push("finally ran"); } };
  failed; // result ==> true
  withFinally(); // result ==> "try"  (o return fica pendente, o finally corre, e devolve-se o do try)
  log; // result ==> ["finally ran"]
  const f = () => { try { return 1; } finally { return 2; } };
  f(); // result ==> 2  (o return do finally substitui o 1 pendente)
}
// nota: um return dentro do finally substitui o do try. Evita-o.

// §21 ── DATES ───────────────────────────────────────────────────────────────

//--------------------------------------------------------------------
// new Date(a, m, d) - // serve para criar uma data em hora local e ler as suas partes (31 de janeiro de 2024).
{
  const date = new Date(2024, 0, 31);
  date.getFullYear(); // result ==> 2024
  date.getMonth(); // result ==> 0  (janeiro, os meses começam em 0)
  date.getDate(); // result ==> 31  (dia do mês)
  date.getDay(); // result ==> 3  (dia da semana: quarta, 0 = domingo)
  new Date(2024, 11, 25).getMonth(); // result ==> 11  (dezembro)
}
// nota: Date = dia do mês (começa em 1); Day = dia da semana (começa em 0).
// nota2: também há getHours(), getMinutes(), getSeconds() e getMilliseconds().

//--------------------------------------------------------------------
// setDate e Date.UTC - // serve para calcular "amanhã" ou quantos dias tem um mês.
{
  const date = new Date(2024, 0, 31);
  date.setDate(date.getDate() + 1); // 31 + 1 = 32, passa sozinho para 1 de fevereiro
  date.getMonth(); // result ==> 1  (fevereiro)
  date.getDate(); // result ==> 1
  const days = (Date.UTC(2024, 2, 1) - Date.UTC(2024, 1, 1)) / 86_400_000; // 86 400 000 = ms num dia
  days; // result ==> 29  (2024 é bissexto)
  const feb = new Date(2024, 1, 29);
  feb.setDate(30);
  feb.getMonth(); // result ==> 2  (março: fevereiro só tem 29 dias)
}
// nota: setDate muda a data original, não devolve uma cópia.
// nota2: para contas entre datas usa Date.UTC, sem surpresas de fuso horário nem de hora de verão.

//--------------------------------------------------------------------
// toISOString, new Date("..."), Intl, Date.now - // serve para guardar, ler e mostrar datas.
{
  new Date(Date.UTC(2024, 0, 15)).toISOString(); // result ==> "2024-01-15T00:00:00.000Z"  (o Z quer dizer UTC)
  new Date("2024-01-15").getTime(); // result ==> 1705276800000  (só a data é lida como UTC)
  new Intl.DateTimeFormat("pt-PT").format(new Date(2024, 0, 5)); // result ==> "05/01/2024"
  typeof Date.now(); // result ==> "number"  (ms desde 1970, serve para medir tempo: Date.now() - t0)
}
// nota: "2024-01-15T10:00" com hora é lido como hora local; sem hora é UTC.
// nota2: guardar em ISO (UTC) e mostrar com Intl.

//--------------------------------------------------------------------
// comparar datas - // serve para saber qual vem primeiro ou se são o mesmo instante.
{
  new Date(0) < new Date(1); // result ==> true  (< e > comparam ms)
  new Date(0) === new Date(0); // result ==> false  (dois objects diferentes)
  new Date(0).getTime() === new Date(0).getTime(); // result ==> true  (compara números)
  +new Date(5) === 5; // result ==> true  (o + transforma a data nos seus ms)
}
// nota: == também compara objects; só getTime() (ou +date) compara o instante.

// §22 ── REGEX ───────────────────────────────────────────────────────────────

//--------------------------------------------------------------------
// /regex/.test() - // serve para validar formatos (código postal, email) com uma linha.
{
  //   .  qualquer carácter     *  0 ou mais       \d  dígito          \w  letra/dígito/_      \s  espaço
  //   +  1 ou mais             ?  0 ou 1          {2,4}  de 2 a 4     [^abc]  nenhum destes   a|b  a ou b
  //   ^ $  início / fim        (...)  group; (?<n>...) named group
  //   flags: g todas, i ignora maiúsculas, m multilinha, s "." apanha \n, u unicode
  /^\d{4}-\d{3}$/.test("1000-123"); // result ==> true  (código postal português)
  /^\w+@\w+\.[a-z]{2,4}$/.test("tiago@mail.com"); // result ==> true
  /^[^0-9]+\s?!?$/.test("Lisboa !"); // result ==> true
  /hello/i.test("HELLO world"); // result ==> true  (flag i)
  /^\d{4}-\d{3}$/.test("1000-1234"); // result ==> false  ($ obriga a acabar ali)
  /^\d+$/.test(""); // result ==> false  (+ exige pelo menos 1 dígito)
  /\d{4}/.test("abc12345"); // result ==> true  (sem ^ e $ basta encontrar 4 dígitos em qualquer sítio)
}
// nota: ^...$ = a string toda.

//--------------------------------------------------------------------
// match / matchAll - // serve para tirar números ou partes de uma data de uma string.
{
  const iso = "2024-01-15".match(/(?<year>\d{4})-(?<month>\d{2})-(?<day>\d{2})/);
  "a1b22c333".match(/\d+/g); // result ==> ["1", "22", "333"]  (com g devolve todas as partes)
  "no numbers".match(/\d/); // result ==> null  (não encontrou: é null, não [])
  iso.groups.month; // result ==> "01"  (named group)
  [..."k1=v1;k2=v2".matchAll(/(\w+)=(\w+)/g)].map((m) => m[2]); // result ==> ["v1", "v2"]  (matchAll exige g)
  ("a1b2".match(/\d/g) ?? []).length; // result ==> 2
}
// nota: "x".match(/\d/g).length rebenta com TypeError porque match deu null. Usa (str.match(re) ?? []).length.

//--------------------------------------------------------------------
// replace / split com regex - // serve para reformatar datas, limpar strings para um palíndromo e partir por separadores irregulares.
{
  "2024-01-15".replace(/(\d+)-(\d+)-(\d+)/, "$3/$2/$1"); // result ==> "15/01/2024"  ($1 = o que o group 1 apanhou)
  "A man, a plan!".toLowerCase().replace(/[^a-z0-9]/g, ""); // result ==> "amanaplan"  (fica só com letras e dígitos)
  "a, b ,c".split(/\s*,\s*/); // result ==> ["a", "b", "c"]  (vírgula com espaços à volta)
  "a-b-c".replace(/-/, "+"); // result ==> "a+b-c"  (sem g: só a 1.ª)
  "a-b-c".replace(/-/g, ""); // result ==> "abc"  (com g: todas)
}
// nota: replace("-", "+") com string também troca só a 1.ª; para todas usa replaceAll ou /-/g.
// nota2: cada call devolve uma string ou array novo, o original fica igual.

//--------------------------------------------------------------------
// lastIndex - // serve para perceber um test() que dá true e depois false com a mesma string.
{
  const reG = /a/g; // com g, a regex guardada lembra-se de onde parou (lastIndex)
  reG.test("a"); // result ==> true  (começa em 0, encontra, lastIndex fica 1)
  reG.test("a"); // result ==> false  (começa em 1, não encontra, lastIndex volta a 0)
  reG.test("a"); // result ==> true  (voltou ao início)
}
// nota: só acontece com g (ou y) e a regex reutilizada; /a/.test("a") dá sempre true. Repetiu o test()? Tira o g.

//--------------------------------------------------------------------
// regex ou loop - // serve para limpar ou validar strings num desafio sem decorar regex: cada regex tem um loop equivalente.
{
  const isLetter = (c) => c.toLowerCase() !== c.toUpperCase(); // só letras mudam de maiúscula para minúscula
  "a1 b22".replace(/\d/g, ""); // result ==> "a b"  (tirar dígitos)
  [..."a1 b22"].filter((c) => c < "0" || c > "9").join(""); // result ==> "a b"  (o mesmo, em loop)
  "Hello, World!".replace(/[^a-z]/gi, ""); // result ==> "HelloWorld"  (só letras)
  [..."Hello, World!"].filter(isLetter).join(""); // result ==> "HelloWorld"
  "  a   b ".trim().split(/\s+/); // result ==> ["a", "b"]  (partir por espaços)
  "  a   b ".split(" ").filter((w) => w !== ""); // result ==> ["a", "b"]
  /^\d+$/.test("12a"); // result ==> false  (só dígitos?)
  [..."12a"].every((c) => c >= "0" && c <= "9"); // result ==> false
  "x9y9".replace(/\d/, ""); // result ==> "xy9"  (sem g: só o 1.º dígito)
}
// nota: "  a   b ".split(" ") sem filtro dá ["", "", "a", "", "", "b", ""]; \s+ junta os espaços seguidos.
// nota2: na entrevista, se não te lembrares da regex, escreve o loop: correto e claro vale mais.
// §23 ── PROMISES E ASYNC/AWAIT ──────────────────────────────────────────────
// §23–§25 são assíncronos: correm dentro de main() para o ficheiro esperar por eles.
// sleep(ms, value) devolve uma Promise que resolve com value ao fim de ms.
const sleep = (ms, value) => new Promise((resolve) => setTimeout(() => resolve(value), ms));

async function main() {
  //--------------------------------------------------------------------
  // new Promise + await - // serve para esperar por um pedido à rede sem bloquear o resto do programa.
  {
    const p = new Promise((resolve, reject) => {
      const ok = true;
      ok ? resolve("done") : reject(new Error("failed"));
    });
    // resolve("done") cumpre a promise; reject(erro) falha-a
    await p; // result ==> "done"
    const f = async () => 5;
    await f(); // result ==> 5
  }
  // nota: uma function async devolve SEMPRE uma Promise, mesmo com return 5. Para ter o 5, faz await f().
  // nota2: await só funciona dentro de uma function async.

  //--------------------------------------------------------------------
  // then() / catch() / finally() - // serve para encadear passos assíncronos, sem async/await.
  {
    const viaThen = await Promise.resolve(2)
      .then((v) => v * 10) //          devolve um value, o próximo then recebe-o
      .then((v) => sleep(1, v + 1)) // devolve uma Promise, a chain espera
      .catch(() => -1) //              só corre se houver erro acima
      .finally(() => {}); //           corre sempre, não muda o value
    viaThen; // result ==> 21
    await Promise.reject(new Error("x")).catch(() => 7).then((v) => v + 1); // result ==> 8  (o catch transforma o erro em 7)
  }
  // nota: .then((v) => { v * 10 }) com braces e sem return passa undefined ao seguinte.

  //--------------------------------------------------------------------
  // try / catch com await - // serve para apanhar o erro de uma call assíncrona como se fosse código normal.
  {
    async function explode() {
      throw new Error("exploded");
    }
    let message;
    try {
      await explode(); // Promise rejeitada, lança o erro aqui
      assert.fail("should not get here");
    } catch (e) {
      message = e.message;
    }
    message; // result ==> "exploded"
    await assert.rejects(explode(), /exploded/);
  }
  // nota: try { explode(); } sem await NÃO apanha nada. O erro chega depois de o try acabar.

  //--------------------------------------------------------------------
  // Promise.all() - // serve para fazer dois pedidos que não dependem um do outro em metade do tempo.
  {
    let t0 = Date.now();
    const seq1 = await sleep(30, "a"); // espera 30ms...
    const seq2 = await sleep(30, "b"); // ...e mais 30ms = 60ms
    const tSeq = Date.now() - t0;
    t0 = Date.now();
    const [par1, par2] = await Promise.all([sleep(30, "a"), sleep(30, "b")]); // os dois ao mesmo tempo = 30ms
    const tPar = Date.now() - t0;
    [seq1, seq2]; // result ==> ["a", "b"]
    [par1, par2]; // result ==> ["a", "b"]  (mesmos values, metade do tempo)
    tSeq >= 55; // result ==> true  (as esperas somam)
    void tPar; // ≈ 30ms; não é verificado: numa máquina ocupada podia falhar ao acaso
  }
  // nota: três sleep(100) com Promise.all demoram cerca de 100ms. O total é o do mais lento.

  //--------------------------------------------------------------------
  // all() / allSettled() / race() / any() - // serve para escolher como esperar por várias Promises ao mesmo tempo.
  {
    // all: espera por todas, falha à primeira que falhar
    await Promise.all([sleep(20, "slow"), sleep(1, "fast")]); // result ==> ["slow", "fast"]  (ordem do array, não de chegada)
    await assert.rejects(Promise.all([sleep(1, 1), Promise.reject(new Error("x"))]), /x/);
    // allSettled: espera por todas e nunca falha, dá um relatório
    const settled = await Promise.allSettled([Promise.resolve(1), Promise.reject(new Error("no"))]);
    settled.map((r) => r.status); // result ==> ["fulfilled", "rejected"]
    settled[0].value; // result ==> 1
    settled[1].reason.message; // result ==> "no"
    // race: fica com a primeira a acabar, mesmo que falhe
    await Promise.race([sleep(20, "slow"), sleep(1, "fast")]); // result ==> "fast"
    await assert.rejects(Promise.race([Promise.reject(new Error("x")), sleep(10, "ok")]), /x/);
    // any: ignora as que falham e fica com a primeira que corre bem
    await Promise.any([Promise.reject(new Error()), sleep(1, "ok")]); // result ==> "ok"
    await assert.rejects(Promise.any([Promise.reject(new Error())]), AggregateError);
  }
  // nota: race aceita a primeira a acabar, mesmo rejeitada. any só falha se TODAS falharem (AggregateError).

  //--------------------------------------------------------------------
  // Timeout com race() - // serve para não ficar à espera para sempre de um pedido lento.
  {
    const withTimeout = (promise, ms) =>
      Promise.race([promise, sleep(ms).then(() => { throw new Error("timeout"); })]);
    // corrida entre o trabalho e um timer que lança erro
    await assert.rejects(withTimeout(sleep(50), 5), /timeout/); // o timer ganha
    await withTimeout(sleep(1, "ok"), 50); // result ==> "ok"  (o trabalho ganha)
  }
  // nota: o trabalho lento NÃO é cancelado. Só deixamos de esperar por ele.

  //--------------------------------------------------------------------
  // await num loop - // serve para fazer passos que dependem do anterior, um de cada vez e por ordem.
  {
    const order = [];
    for (const ms of [10, 1]) order.push(await sleep(ms, ms));
    order; // result ==> [10, 1]  (o de 1ms esperou pelo de 10ms)
  }
  // nota: [10, 1].forEach(async (ms) => ...) NÃO espera. Lança os dois, e o de 1ms acabava primeiro.
  // nota2: com Promise.all em vez do loop, demorava cerca de 10ms e não 11ms.

  // §24 ── EVENT LOOP ──────────────────────────────────────────────────────

  //--------------------------------------------------------------------
  // Event loop - // serve para prever a ordem de um console.log numa pergunta de entrevista.
  {
    const log = [];
    log.push("sync 1");
    setTimeout(() => log.push("setTimeout"), 0); // macrotask
    Promise.resolve().then(() => log.push("then")); // microtask
    queueMicrotask(() => log.push("queueMicrotask")); // microtask
    log.push("sync 2");
    await sleep(5); // dá tempo ao setTimeout
    log; // result ==> ["sync 1", "sync 2", "then", "queueMicrotask", "setTimeout"]
    /* sync 1            <- 1.º: o código síncrono todo
       sync 2
       then              <- 2.º: TODAS as microtasks, pela ordem em que entraram
       queueMicrotask
       setTimeout        <- 3.º: UMA macrotask, mesmo com 0ms */
  }
  // nota: setTimeout(fn, 0) não corre já. Vai para o fim da queue, depois de todas as microtasks.
  // nota2: no Node, process.nextTick corre ainda antes das Promises.

  //--------------------------------------------------------------------
  // async até ao primeiro await - // serve para acertar no exercício clássico de entrevista de ordenar letras.
  {
    const q = [];
    const task = async () => {
      q.push("B"); // antes do await, corre logo
      await null;
      q.push("D"); // depois do await, vira microtask
    };
    q.push("A");
    setTimeout(() => q.push("F"), 0);
    task();
    Promise.resolve().then(() => q.push("E"));
    q.push("C");
    await sleep(5);
    q.join(""); // result ==> "ABCDEF"
    /* A    <- síncrono
       B    <- task() corre até ao await
       C    <- síncrono
       D    <- microtask, entrou primeiro
       E    <- microtask, entrou depois
       F    <- macrotask, por último */
  }
  // nota: task() não fica toda para depois. Só a parte a seguir ao await é adiada.
  // nota2: se task() fosse chamada DEPOIS do then(E), dava "ABCEDF". O E entrava primeiro na queue.

  // §25 ── TIMERS ──────────────────────────────────────────────────────────

  //--------------------------------------------------------------------
  // setTimeout() / setInterval() - // serve para correr código uma vez daqui a ms, ou de ms em ms até eu mandar parar.
  {
    const ran = [];
    const cancelledId = setTimeout(() => ran.push("never"), 5);
    clearTimeout(cancelledId); // o id serve para cancelar
    await sleep(10);

    let tick = 0;
    await new Promise((resolve) => {
      const intervalId = setInterval(() => {
        tick++;
        if (tick === 3) {
          clearInterval(intervalId); // sem isto corria para sempre
          resolve();
        }
      }, 5);
    });
    ran; // result ==> []  (cancelado, nunca correu)
    tick; // result ==> 3
  }
  // nota: setTimeout corre UMA vez; setInterval repete até clearInterval. ms é uma espera mínima, não exata.
  // nota2: sem o clearInterval o programa nunca acabava, porque o interval mantém o Node vivo.

  //--------------------------------------------------------------------
  // timers/promises - // serve para ter um sleep pronto, sem escrever a Promise à mão.
  {
    const { setTimeout: wait } = require("node:timers/promises");
    await wait(1, "value"); // result ==> "value"
    await wait(1); // result ==> undefined  (sem 2.º argument não há value)
  }
  // nota: este setTimeout não recebe callback. O global recebe (fn, ms).

  //--------------------------------------------------------------------
  // debounce - // serve para uma caixa de pesquisa só pedir à rede quando a pessoa para de escrever.
  {
    const debounce = (fn, ms) => {
      let id;
      return (...args) => {
        clearTimeout(id); // cada call cancela a anterior...
        id = setTimeout(() => fn(...args), ms); // ...e começa outra
      };
    };
    const calls = [];
    const search = debounce((txt) => calls.push(txt), 10);
    search("t");
    search("ti");
    search("tia");
    await sleep(30);
    calls; // result ==> ["tia"]  (só a última chegou ao fim)
  }
  // nota: com um sleep(20) entre "t" e "ti", ficava ["t", "tia"]. O "t" teve 10ms de pausa e correu.
  // nota2: throttle é diferente. Corre no máximo uma vez por intervalo, em vez de esperar pela pausa.
}

// §26 ── MODULES ─────────────────────────────────────────────────────────────

//--------------------------------------------------------------------
// require / import - // serve para usar num ficheiro a function escrita noutro.
//   CommonJS (Node clássico, .js e .cjs)     ES Modules (browsers; Node com .mjs ou "type": "module")
//   // math.js                               // math.js
//   module.exports = { sum };                export const PI = 3.14;
//                                            export default function sum(a, b) { return a + b; }
//   // app.js                                // app.js
//   const { sum } = require("./math");       import sum, { PI } from "./math.js";  // default sem { }, named com { }
//                                            import * as math from "./math.js";    // tudo num object
//   carregar só quando precisas (nos dois):  const mod = await import("./math.js");
{
  typeof module.exports; // result ==> "object"  (este ficheiro é CommonJS)
  typeof require; // result ==> "function"
}
// nota: o default importa-se sem { } e com o nome que quiseres; o named, com { } e o nome exato.
// nota2: em ESM não há require (usa import ou createRequire), a extensão ".js" é obrigatória e há await no topo.

// §27 ── DATA STRUCTURES ─────────────────────────────────────────────────────
// Linked lists, trees, BST e binary search estão em 02-LeetCode-Easy.js.

// =============================================================================
main().then(
  () => console.log("✅ Fundamentals OK"),
  (err) => {
    console.error(err);
    process.exitCode = 1;
  }
);
