// =============================================================================
// 01 — FUNDAMENTOS DE JAVASCRIPT (cheat sheet que corre e se verifica sozinho)
// Correr:  node 01-JS-Fundamentals.js   → tem de acabar em "✅ Fundamentals OK"
// Testado em Node 26. Verificar cada "// result ==>": node check-results.js 01-JS-Fundamentals.js
// Procurar: Ctrl+F "§7" salta para a secção 7. Formato de cada bloco: STYLE.md
// Cada exemplo vive dentro de { } para os nomes não colidirem entre blocos.
// =============================================================================
//
// ÍNDICE (Ctrl+F "§N")
//   §1  Variáveis (const, let, var, hoisting, TDZ)
//   §2  Tipos e conversões
//   §3  Operadores (aritmética, ===, &&, ||, ??, ?., ternário)
//   §4  Truthy / Falsy
//   §5  Condições (if, switch, lookup)
//   §6  Ciclos (for, while, for...of, break/continue)
//   §7  Strings
//   §8  Números e Math
//   §9  Arrays — métodos que MUDAM o original
//   §10 Arrays — métodos que NÃO mudam (map, filter, reduce…)
//   §11 Ordenar (sort / toSorted)
//   §12 Objetos (+ JSON)
//   §13 Desestruturação, spread, rest
//   §14 Map, Set, WeakMap
//   §15 Cópias: rasa vs profunda
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
//   §27 Estruturas de dados → ver 02-LeetCode-Easy.js
// =============================================================================

"use strict"; // o mesmo comportamento das classes e dos módulos ES (ver §18)
const assert = require("node:assert/strict"); // só para os exemplos que lançam erro

// §1 ── VARIÁVEIS ─────────────────────────────────────────────────────────────

//--------------------------------------------------------------------
// const - // serve para guardar algo que não vai ser substituído. É a escolha por omissão.
{
  const amigos = ["Tiago", "Adelia"];
  amigos.push("Rui"); // mudar o conteúdo é permitido
  amigos; // result ==> ["Tiago", "Adelia", "Rui"]
  assert.throws(() => {
    const ano = 1987;
    ano = 2000; // dar outro valor é proibido
  }, TypeError);
}
// nota: const fixa a caixa, não o que está lá dentro. Para fixar o conteúdo, usa Object.freeze (§12).
// nota2: const a = [1]; a.push(2) funciona, mas a = [1, 2] dá TypeError.

//--------------------------------------------------------------------
// let e var - // serve para guardar um valor que vai mudar (let); var é a forma antiga, a evitar.
{
  function ambito() {
    if (true) {
      var fora = "var";
      let dentro = "let";
    }
    return [fora, typeof dentro]; // typeof não dá erro com um nome que não existe
  }
  let nome; //      declarar: cria a caixa, vale undefined
  nome = "Tiago"; // atribuir: põe um valor na caixa
  ambito(); // result ==> ["var", "undefined"]
  nome; // result ==> "Tiago"
}
// nota: o let só existe dentro das { } onde nasceu; o var foge das { } e vive na função inteira (âmbito).
// nota2: se trocares "var fora" por "let fora", ambito() dá ReferenceError.

//--------------------------------------------------------------------
// Hoisting e TDZ - // serve para perceber porque um nome dá undefined, dá erro ou funciona antes da sua linha.
{
  function comVar() {
    const antes = v; // v já existe (sobe ao topo), mas ainda sem valor
    var v = 10;
    return antes;
  }
  const r = dobro(2); // funciona: a function sobe inteira
  function dobro(n) {
    return n * 2;
  }
  comVar(); // result ==> undefined
  r; // result ==> 4
  assert.throws(() => {
    y; // y já existe, mas está na TDZ
    let y = 1;
  }, ReferenceError);
}
// nota: var sobe com undefined; let e const sobem mas ficam bloqueados até à sua linha (TDZ); function sobe pronta.
// nota2: undefined = existe sem valor; ReferenceError = não se pode tocar-lhe.

// §2 ── TIPOS E CONVERSÕES ────────────────────────────────────────────────────

//--------------------------------------------------------------------
// typeof - // serve para ver o tipo de um valor, em texto, antes de o usar.
typeof "Tiago";        // result ==> "string"
typeof 1987;           // result ==> "number"
typeof 42n;            // result ==> "bigint"
typeof true;           // result ==> "boolean"
typeof undefined;      // result ==> "undefined"
typeof Symbol("id");   // result ==> "symbol"
typeof function () {}; // result ==> "function"
typeof null;           // result ==> "object"  (bug antigo: null NÃO é um objeto)
typeof [];             // result ==> "object"  (arrays também)
Array.isArray([]);     // result ==> true  (a forma certa de testar um array)
// nota: são 7 primitivos (string, number, bigint, boolean, undefined, null, symbol); o resto são objetos.
// nota2: typeof typeof 1 dá "string", porque typeof 1 já é o texto "number".

//--------------------------------------------------------------------
// Valor vs referência - // serve para perceber porque mudar "a cópia" de um objeto muda também o original.
{
  let p1 = 1987;
  let p2 = p1; // copia o valor
  p2++;
  const o1 = { ano: 1987 };
  const o2 = o1; // o mesmo objeto, dois nomes
  o2.ano++;
  const o3 = { ...o1 }; // cópia a sério (§15)
  o3.ano++;
  p1; // result ==> 1987
  o1.ano; // result ==> 1988
  o3.ano; // result ==> 1989
}
// nota: primitivos copiam-se, objetos partilham-se. Só { ...o1 } cria um objeto novo.
// nota2: const a = [1]; const b = a; b.push(2); a.length dá 2, porque a e b são o mesmo array.

//--------------------------------------------------------------------
// Number() / String() / Boolean() - // serve para transformar o texto de um formulário em número antes de fazer contas.
Number("17031987");  // result ==> 17031987
String(17031987);    // result ==> "17031987"
(255).toString(16);  // result ==> "ff"  (número → texto em base 16)
Boolean("Tiago");    // result ==> true  (ver §4)
Boolean("");         // result ==> false
Boolean("false");    // result ==> true  (texto não vazio é sempre true)
// nota: Number("12px") dá NaN, porque quer o texto todo; parseInt("12px") lê até ao lixo (§8).

//--------------------------------------------------------------------
// Conversão automática - // serve para reconhecer as armadilhas em que o JS muda o tipo sozinho.
"5" + 1;    // result ==> "51"  (+ com texto cola)
"5" - 1;    // result ==> 4  (- transforma em número)
"5" * "2";  // result ==> 10
+"3";       // result ==> 3  (+ à frente transforma em número)
[] + [];    // result ==> ""  (dois arrays viram "" e "")
1 + 2 + "3"; // result ==> "33"  (da esquerda para a direita: 3, e depois cola)
// nota: + soma se os dois lados forem números; cola se um for texto. Os outros operadores fazem sempre contas.

// §3 ── OPERADORES ────────────────────────────────────────────────────────────

//--------------------------------------------------------------------
// % e aritmética - // serve para saber se um número é par, ou dar a volta a um índice (relógio, array circular).
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
// ++ e -- - // serve para somar ou tirar 1 em contadores e índices de ciclos.
{
  let c = 1;
  const a = c++; // devolve 1 (o antigo) e depois soma: c = 2
  const b = ++c; // soma primeiro (c = 3) e devolve 3 (o novo)
  a; // result ==> 1
  b; // result ==> 3
  c; // result ==> 3
}
// nota: c++ devolve o valor antigo; ++c devolve o novo. Com let i = 5; const r = i--, r vale 5 e i vale 4.
// nota2: c + 1 calcula sem mudar c; c++ muda c.

//--------------------------------------------------------------------
// += ||= ??= &&= - // serve para somar a um total, ou dar um valor por omissão só se a variável estiver "vazia".
{
  let total = 10;
  total += 5; // é total = total + 5
  let visitas = 0;
  visitas ||= 10; // 0 é falsy → atribui
  let visitas2 = 0;
  visitas2 ??= 10; // 0 não é null/undefined → fica 0
  let nome = "tiago";
  nome &&= nome.toUpperCase(); // "tiago" é truthy → atribui
  total; // result ==> 15
  visitas; // result ==> 10
  visitas2; // result ==> 0
  nome; // result ==> "TIAGO"
}
// nota: ||= atribui se for falsy; ??= só se for null/undefined; &&= só se for truthy.
// nota2: se o 0 for válido (0 visitas), usa ??=. Com let x = ""; x ??= "vazio", x continua "".

//--------------------------------------------------------------------
// === vs == e Object.is - // serve para comparar valores sem conversões escondidas.
0 === "0";            // result ==> false
0 == "0";             // result ==> true  (== converte primeiro)
"" == 0;              // result ==> true
"" === 0;             // result ==> false
null == undefined;    // result ==> true  (o único caso útil de ==)
null === undefined;   // result ==> false
[1] === [1];          // result ==> false  (objetos comparam o endereço, ver §2)
NaN === NaN;          // result ==> false  (NaN nunca é igual a nada)
Object.is(NaN, NaN);  // result ==> true
Object.is(0, -0);     // result ==> false  (mas 0 === -0 dá true)
// nota: usa sempre === e !== (valor e tipo). Dois arrays só dão true se forem o MESMO array.

//--------------------------------------------------------------------
// < > <= >= com texto - // serve para perceber resultados estranhos ao comparar strings.
"a" < "b";      // result ==> true
"apple" < "banana"; // result ==> true  (pára na primeira letra diferente)
"Z" < "a";      // result ==> true  (maiúsculas primeiro)
"10" < "9";     // result ==> true  (dois textos: "1" < "9")
"10" < 9;       // result ==> false  (um número: compara 10 < 9)
// nota: dois textos comparam-se letra a letra, pelo código de cada uma. Com um número, o outro lado vira número.

//--------------------------------------------------------------------
// && || ! - // serve para juntar testes num if, ou escolher o primeiro valor útil.
"Tiago" || "b";    // result ==> "Tiago"  (o primeiro truthy)
"" || "omissão";   // result ==> "omissão"
"Tiago" && "Adelia"; // result ==> "Adelia"  (o primeiro é truthy, devolve o segundo)
0 && "x";          // result ==> 0  (0 é falsy, pára logo)
!!"x";             // result ==> true  (!! transforma qualquer valor em boolean)
false || 4 > 2;    // result ==> true
// nota: || pára no primeiro truthy; && pára no primeiro falsy. Devolvem o valor que decidiu, não true/false.

//--------------------------------------------------------------------
// ?? - // serve para usar um valor de reserva sem perder um 0 ou um "" que são válidos.
null ?? 5;       // result ==> 5
undefined ?? 5;  // result ==> 5
0 ?? 5;          // result ==> 0
0 || 5;          // result ==> 5  (|| também troca o 0)
"" ?? "x";       // result ==> ""
false ?? true;   // result ==> false
// nota: a ?? b dá b SÓ se a for null ou undefined; || troca qualquer falsy (0, "", false, NaN).

//--------------------------------------------------------------------
// ?. - // serve para ler user.morada.rua sem rebentar quando não há morada.
{
  const user = { perfil: { nome: "Tiago" }, falar: () => "olá" };
  user.perfil?.nome;               // result ==> "Tiago"
  user.morada?.rua;                // result ==> undefined  (sem TypeError)
  user.voar?.();                   // result ==> undefined  (método que pode não existir)
  user.morada?.rua ?? "sem rua";   // result ==> "sem rua"  (o par clássico)
  user.perfil?.idade ?? 18;        // result ==> 18
  assert.throws(() => user.morada.rua, TypeError); // sem ?. rebenta
}
// nota: se o lado esquerdo de ?. for null/undefined, a expressão pára e dá undefined.
// nota2: ?. lê com segurança; ?? dá o valor de reserva. Usam-se muitas vezes juntos.

//--------------------------------------------------------------------
// condição ? a : b - // serve para escolher entre dois valores numa só expressão (um if/else que devolve valor).
{
  const idade = 20;
  idade >= 18 ? "adulto" : "menor"; // result ==> "adulto"
  0 ? "sim" : "não"; // result ==> "não"  (0 é falsy)
}
// nota: serve para escolher valores; para executar ações, usa if.

// §4 ── TRUTHY / FALSY ────────────────────────────────────────────────────────

//--------------------------------------------------------------------
// Truthy e falsy - // serve para escrever if (lista.length) ou if (nome) sem surpresas.
{
  const falsy = [false, 0, -0, 0n, "", null, undefined, NaN];
  const truthy = ["0", "false", " ", [], {}, () => {}, -1, Infinity];
  falsy.every((v) => !v);    // result ==> true
  truthy.every((v) => !!v);  // result ==> true
}
// nota: só estes 8 são falsy; tudo o resto é truthy, até "0", [] e {}. Por isso if ([]) { … } corre.
// nota2: if (n) falha para n = 0. Se 0 for válido, usa n !== undefined ou n ?? x. Lista vazia: lista.length === 0.

// §5 ── CONDIÇÕES ─────────────────────────────────────────────────────────────

//--------------------------------------------------------------------
// if / else e return antecipado - // serve para tratar os casos especiais primeiro e evitar ifs dentro de ifs.
{
  function tempo(ceu) {
    if (ceu === "azul") {
      return "Bom tempo";
    } else if (ceu === "escuro") {
      return "Pode chover";
    } else {
      return "Não vi a previsão";
    }
  }
  function dividir(a, b) {
    if (b === 0) return null; // caso especial primeiro: return sai já
    return a / b; //             só chega aqui se b !== 0
  }
  tempo("escuro"); // result ==> "Pode chover"
  tempo("verde");  // result ==> "Não vi a previsão"  (nenhuma condição serve, corre o else)
  dividir(1, 0);   // result ==> null
  dividir(6, 3);   // result ==> 2
}
// nota: com else if só corre um ramo; com ifs separados podem correr vários.
// nota2: dentro de uma função, return termina tudo: as linhas abaixo já não correm.

//--------------------------------------------------------------------
// switch - // serve para substituir uma fila de else if que testam sempre a mesma variável.
{
  function casos(n) {
    const r = [];
    switch (n) {
      case 1:
        r.push("um"); // sem break: cai no case 2
      case 2:
        r.push("dois");
        break;
      default:
        r.push("outro");
    }
    return r;
  }
  casos(1);   // result ==> ["um", "dois"]
  casos(2);   // result ==> ["dois"]
  casos(9);   // result ==> ["outro"]
  casos("1"); // result ==> ["outro"]  (o switch usa ===, e "1" !== 1)
}
// nota: sem break (ou return), corre também o case seguinte. Às vezes é de propósito, quase sempre é bug.

//--------------------------------------------------------------------
// Lookup num objeto - // serve para transformar um valor noutro (código → texto) sem if nem switch.
{
  const tempos = { azul: "Bom tempo", escuro: "Pode chover" };
  tempos["azul"] ?? "Não vi a previsão";   // result ==> "Bom tempo"
  tempos["verde"] ?? "Não vi a previsão";  // result ==> "Não vi a previsão"
}
// nota: a chave procura o valor; ?? dá a reserva quando a chave não existe.
// nota2: lookup só mapeia valores; se cada caso precisa de lógica, usa switch ou if.
// §6 ── CICLOS ────────────────────────────────────────────────────────────────

//--------------------------------------------------------------------
// for - // serve para repetir um código para cada posição (índice) de uma lista, ou contar de x até y.
{
  const nomes = ["Tiago", "Adelia", "Rui"];
  const saida = [];
  //      PARTIDA     CHEGADA              INCREMENTO
  // for (let i = 0; i < nomes.length; i++) { … }
  for (let i = 0; i < nomes.length; i++) saida.push(`${i} => ${nomes[i]}`);
  saida; // result ==> ["0 => Tiago", "1 => Adelia", "2 => Rui"]
  /* 0 => Tiago
     1 => Adelia
     2 => Rui      <- quando i chega a 3, a chegada (i < 3) é falsa e o ciclo acaba */

  const pares = [];
  for (let i = 0; i < 6; i += 2) pares.push(i);
  pares; // result ==> [0, 2, 4]  (o incremento pode ser outro, aqui +2)
}
// nota: a chegada é testada ANTES de cada volta e o incremento corre DEPOIS. Com i <= nomes.length lia nomes[3], que é undefined.
// nota2: para percorrer uma lista de tamanho n usa i < n, porque o último índice é n - 1.

//--------------------------------------------------------------------
// while e do...while - // serve para repetir sem saber quantas vezes, até uma condição mudar.
{
  let cont = 1;
  const saida = [];
  while (cont <= 3) {
    saida.push(cont);
    cont += 1; // sem isto o ciclo nunca acaba
  }
  saida; // result ==> [1, 2, 3]

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
// for...of - // serve para percorrer os valores de uma lista ou de um texto, sem mexer em índices.
{
  const letras = [];
  for (const letra of "Tiago") letras.push(letra);
  letras; // result ==> ["T", "i", "a", "g", "o"]

  const pares = [];
  for (const [i, v] of ["x", "y"].entries()) pares.push(`${i}:${v}`);
  pares; // result ==> ["0:x", "1:y"]  (.entries() dá [índice, valor])

  const chaves = [];
  for (const k in ["a", "b"]) chaves.push(k);
  chaves; // result ==> ["0", "1"]  (for...in dá as chaves, como texto)
}
// nota: for...of dá os VALORES; for...in dá as CHAVES de um objeto (§12). Evitar for...in em arrays.

//--------------------------------------------------------------------
// break e continue - // serve para parar o ciclo quando já encontrei o que queria, ou saltar uma volta.
{
  const impares = [];
  for (let i = 0; i < 10; i++) {
    if (i % 2 === 0) continue; // salta esta volta
    if (i > 5) break; // sai do ciclo de vez
    impares.push(i);
  }
  impares; // result ==> [1, 3, 5]  (sem o break seria [1, 3, 5, 7, 9])
}
// nota: break dentro de forEach não funciona; usa for...of, some() ou find() (§10).

//--------------------------------------------------------------------
// break com label - // serve para sair dos dois loops de uma vez, quando já encontrei o que procurava.
{
  const grelha = [
    [1, 2],
    [3, 4],
    [5, 6],
  ];
  //i = linhas
  //j = colunas
  const vistos = [];
  procura: for (let i = 0; i < grelha.length; i++) {
    for (let j = 0; j < grelha[i].length; j++) {
      vistos.push(`linha ${i}, coluna ${j} => ${grelha[i][j]}`);
      if (grelha[i][j] === 4) break procura;
    }
  }
  vistos.length; // result ==> 4
  /* linha 0, coluna 0 => 1
     linha 0, coluna 1 => 2
     linha 1, coluna 0 => 3
     linha 1, coluna 1 => 4     <- parou aqui, o 5 e o 6 nunca aparecem */
  grelha[1][0]; // result ==> 3
}
// nota: com "break" sem nome, só sai o loop de dentro e o de fora continua, por isso aparecem o 5 e o 6.
// nota2: grelha[1][0] → primeiro a linha, depois a coluna.

// §7 ── STRINGS ───────────────────────────────────────────────────────────────

//--------------------------------------------------------------------
// Strings não mudam - // serve para perceber porque "tiago".toUpperCase() sozinho não faz nada: devolve uma string NOVA.
{
  const nome = "tiago";
  const grande = nome.toUpperCase();
  nome; // result ==> "tiago"
  grande; // result ==> "TIAGO"
  assert.throws(() => {
    nome[0] = "X";
  }, TypeError);
}
// nota: num array, arr[0] = "X" muda o original; numa string falha. Por isso há que guardar o resultado.
// nota2: let t = " a "; t.trim(); deixa t igual, porque o resultado "a" não foi guardado.

//--------------------------------------------------------------------
// length, [i], at(), charAt() - // serve para contar as letras de uma palavra e ler a letra numa posição.
{
  const palavra = "Tiago"; // T=0, i=1, a=2, g=3, o=4
  palavra.length; // result ==> 5
  palavra[2]; // result ==> "a"
  palavra.at(-1); // result ==> "o"  (-1 = última letra)
  palavra.charAt(2); // result ==> "a"
  palavra[99]; // result ==> undefined
  palavra.charAt(99); // result ==> ""
}
// nota: fora dos limites, [ ] dá undefined e charAt dá "". length não leva ().
// nota2: a última letra é s.at(-1) ou s[s.length - 1]. "Lisboa".at(-2) é "o".

//--------------------------------------------------------------------
// indexOf(), includes(), startsWith(), endsWith() - // serve para saber se um texto contém outro e em que posição.
"Adelia".indexOf("lia"); // result ==> 3
"Adelia".indexOf("z"); // result ==> -1  (não encontrou)
"banana".indexOf("a"); // result ==> 1  (a primeira ocorrência)
"banana".lastIndexOf("a"); // result ==> 5  (procura a partir do fim)
"Otorrino".includes("rri", 3); // result ==> true  (2.º argumento: posição onde começa)
"file.js".startsWith("file"); // result ==> true
"file.js".endsWith(".js"); // result ==> true
// nota: indexOf dá a POSIÇÃO (ou -1); os outros dão true/false. Onde? indexOf. Existe? includes.
// nota2: if (s.indexOf(x)) falha quando x está na posição 0 (0 é falsy). Usa includes().

//--------------------------------------------------------------------
// slice(início, fim) - // serve para cortar um pedaço de um texto, por exemplo as 2 primeiras letras.
{
  const frase = "We are cool"; // W=0, e=1, espaço=2, a=3…
  frase.slice(0, 2); // result ==> "We"  (índices 0 e 1; o 2 não entra)
  frase.slice(3); // result ==> "are cool"  (sem fim, vai até ao fim)
  frase.slice(-4); // result ==> "cool"  (as últimas 4)
  frase.slice(3, -5); // result ==> "are"
  "Tiago".slice(1, 3); // result ==> "ia"
  "Tiago".substring(-3); // result ==> "Tiago"  (substring troca negativos por 0)
}
// nota: o fim fica sempre de fora: slice(início, fim) = [início, fim[.
// nota2: com positivos slice e substring são iguais; com negativos, slice conta do fim. Prefere slice.

//--------------------------------------------------------------------
// toUpperCase(), trim(), padStart(), repeat() - // serve para limpar texto (maiúsculas, espaços) e formatar (zeros à esquerda).
"Lisboa".toUpperCase(); // result ==> "LISBOA"
"Lisboa".toLowerCase(); // result ==> "lisboa"
"  olá  ".trim(); // result ==> "olá"  (trimStart/trimEnd: só um lado)
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
// replace() e replaceAll() - // serve para trocar um texto por outro, por exemplo limpar traços ou espaços.
"a-b-c".replace("-", "+"); // result ==> "a+b-c"  (só a primeira)
"a-b-c".replaceAll("-", "+"); // result ==> "a+b+c"  (todas)
"a-b-c".replace(/-/g, "+"); // result ==> "a+b+c"  (regex com /g também troca todas)
"dirty room".replaceAll(" ", ""); // result ==> "dirtyroom"
// nota: replace com texto troca SÓ A PRIMEIRA. "aaa".replace("a", "b") dá "baa".

//--------------------------------------------------------------------
// split() e join() - // serve para partir uma frase em palavras, mexer na lista e voltar a juntar.
"I love JS".split(" "); // result ==> ["I", "love", "JS"]
"abc".split(""); // result ==> ["a", "b", "c"]
"a,b,,c".split(","); // result ==> ["a", "b", "", "c"]  (entre as vírgulas fica um texto vazio)
["I", "will", "join"].join(" "); // result ==> "I will join"
["a", "b"].join(""); // result ==> "ab"
["a", "b"].join(); // result ==> "a,b"  (sem separador usa ",")
// nota: split parte, join cola.

//--------------------------------------------------------------------
// inverter uma string - // serve para ler um texto ao contrário e ver se é palíndromo ("racecar").
{
  // "abc"  →  [..."abc"] = ["a", "b", "c"]  →  .reverse() = ["c", "b", "a"]  →  .join("") = "cba"
  [..."abc"].reverse().join(""); // result ==> "cba"
  const ePal = (s) => s === [...s].reverse().join("");
  ePal("racecar"); // result ==> true
  ePal("tiago"); // result ==> false
  ePal("Ana"); // result ==> false  ("anA" não é igual a "Ana")
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
// nota: para ordenar texto com acentos não compares códigos; usa localeCompare (§11).

//--------------------------------------------------------------------
// template literals - // serve para meter valores dentro de um texto, sem concatenar com +.
{
  const n = 3;
  `Tenho ${n * 2} maçãs`; // result ==> "Tenho 6 maçãs"  (dentro de ${ } vai qualquer conta)
  `${1 + 1}${1}`; // result ==> "21"
  "Tenho ${n} maçãs"; // result ==> "Tenho ${n} maçãs"  (aspas normais não substituem)
}
// nota: só as crases ` ` substituem o ${ }. Também aceitam várias linhas.

// §8 ── NÚMEROS E MATH ────────────────────────────────────────────────────────

//--------------------------------------------------------------------
// Math.floor(), ceil(), trunc(), round() - // serve para tirar as casas decimais: páginas (ceil), divisão inteira (trunc), valor mais próximo (round).
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
  x.toFixed(1); // result ==> "1987.9"  (devolve TEXTO)
  (45).toFixed(2); // result ==> "45.00"
  Number(x.toFixed(1)); // result ==> 1987.9  (de volta a número)
  typeof (2.5).toFixed(0); // result ==> "string"
  Number.isInteger(x); // result ==> false
  Number.isInteger(5.0); // result ==> true  (5.0 é o mesmo que 5)
}
// nota: x.toFixed(2) + 1 dá "1987.851" (texto colado), não uma soma.
// nota2: toFixed é para MOSTRAR, não para calcular.

//--------------------------------------------------------------------
// Number(), parseInt(), parseFloat() - // serve para ler um número de um texto, por exemplo "12px" de um CSS ou de um formulário.
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
// nota: Number quer o texto TODO; parseInt e parseFloat leem do início até ao lixo. parseInt leva sempre a base (10).
// nota2: map passa (valor, ÍNDICE) e o índice vira a base: parseInt("2", 1) = NaN, parseInt("3", 2) = NaN.

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
// nota2: toString(16) vai de número para texto; parseInt(texto, 16) faz o contrário.

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
// nota2: 1n === 1 dá false (tipos diferentes), mas 1n == 1 dá true.

//--------------------------------------------------------------------
// Math.max() e Math.min() - // serve para saber o maior e o menor valor de uma lista.
{
  const nums = [3, 9, 1];
  Math.max(...nums); // result ==> 9
  Math.min(...nums); // result ==> 1
  Math.max(nums); // result ==> NaN  (recebeu uma lista, não números soltos)
  Math.max(); // result ==> -Infinity  (sem números)
  Math.min(...[]); // result ==> Infinity
  nums.reduce((a, b) => Math.min(a, b)); // result ==> 1  (serve para listas enormes, o spread tem limite)
}
// nota: max e min querem números SOLTOS; com uma lista, espalha com ...
// nota2: sem números, min começa em Infinity e max em -Infinity.

//--------------------------------------------------------------------
// Math.random() - // serve para um número aleatório, por exemplo um dado ou escolher um elemento ao acaso.
{
  // aleatorio(1, 10):  random() = 0 … 0.999  →  × 10 = 0 … 9.99  →  floor = 0 … 9  →  + 1 = 1 … 10
  const aleatorio = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
  const jogadas = Array.from({ length: 100 }, () => aleatorio(1, 10));
  jogadas.every((r) => Number.isInteger(r) && r >= 1 && r <= 10); // result ==> true
}
// nota: random() dá um decimal de 0 até 1, e o 1 nunca sai. Sem o + 1 em (max - min + 1), o max nunca aparece.
// nota2: para um decimal de min a max, usa Math.random() * (max - min) + min.

//--------------------------------------------------------------------
// Math.sqrt(), abs(), hypot()... - // serve para contas do dia a dia: raízes, valores absolutos, distâncias.
Math.sqrt(16); // result ==> 4  (raiz quadrada)
Math.cbrt(27); // result ==> 3  (raiz cúbica)
Math.abs(-3); // result ==> 3  (tira o sinal)
Math.abs(2 - 7); // result ==> 5
Math.hypot(3, 4); // result ==> 5  (√(3² + 4²): distância)
Math.sign(-5); // result ==> -1  (sinal: -1, 0 ou 1)
// nota: são funções de Math, não métodos do número (Math.abs(x), não x.abs()).
// nota2: Math.sqrt(-1) não dá erro, dá NaN.
// §9 ── ARRAYS: MÉTODOS QUE MUDAM O ORIGINAL ──────────────────────────────────
// Tudo aqui altera o array ORIGINAL.

//--------------------------------------------------------------------
// push(), pop(), unshift(), shift() - // serve para pôr e tirar nomes no fim ou no início da lista (pilha ou fila).
{
  const nomes = ["david", "costa"];
  nomes.push("pereira"); // result ==> 3  (devolve o novo tamanho)
  nomes.unshift("tiago"); // result ==> 4
  nomes.pop(); // result ==> "pereira"  (devolve o elemento tirado)
  nomes.shift(); // result ==> "tiago"
  nomes; // result ==> ["david", "costa"]
}
// nota: const r = [1].push(5) dá r = 2, não o array. push devolve um número.
// nota2: o fim (push/pop) é rápido; o início (unshift/shift) é lento em arrays grandes, porque move tudo.

//--------------------------------------------------------------------
// splice(índice, quantos, ...novos) - // serve para apagar, trocar ou inserir um elemento no meio da lista.
{
  const itens = ["i1", "i2", "i3", "i4", "i5"];
  itens.splice(2, 1); // result ==> ["i3"]  (devolve um array com o que saiu)
  itens.splice(3, 1, "i10"); // result ==> ["i5"]  (troca o i5 pelo i10)
  itens.splice(3, 0, "i20"); // result ==> []  (quantos = 0, só insere)
  itens; // result ==> ["i1", "i2", "i4", "i20", "i10"]
}
// nota: splice muda o original; slice só copia um pedaço (§10).
// nota2: ["a", "b", "c"].splice(0, 2) deixa o array em ["c"].

//--------------------------------------------------------------------
// fill(), reverse(), copyWithin(), length = 0 - // serve para preencher, inverter ou esvaziar um array no próprio sítio.
{
  const cores = ["vermelho", "azul", "verde"];
  cores.fill("verde", 1, 2); // fill(valor, início, fim): o fim não entra
  cores; // result ==> ["vermelho", "verde", "verde"]

  const inv = ["um", "dois", "três"];
  const devolvido = inv.reverse();
  inv; // result ==> ["três", "dois", "um"]
  devolvido === inv; // result ==> true  (o MESMO array, não uma cópia)

  const lixo = [1, 2, 3];
  lixo.length = 0;
  lixo; // result ==> []

  [1, 2, 3, 4, 5].copyWithin(0, 3); // result ==> [4, 5, 3, 4, 5]  (copia do índice 3 para o 0)
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
// fill([]) numa matriz - // serve para criar uma grelha vazia sem que todas as linhas sejam a mesma.
{
  const mau = new Array(2).fill([]); // o MESMO array nas 2 posições
  mau[0].push("x");
  mau; // result ==> [["x"], ["x"]]  (⚠ a mesma linha duas vezes)
  mau[0] === mau[1]; // result ==> true

  const bom = Array.from({ length: 2 }, () => []); // uma linha nova de cada vez
  bom[0].push("x");
  bom; // result ==> [["x"], []]
  bom[1].length; // result ==> 0
}
// nota: fill(0) não tem este problema: 0 é primitivo, copia-se (§2).

// §10 ── ARRAYS: MÉTODOS QUE NÃO MUDAM ────────────────────────────────────────
// Devolvem um valor ou um array NOVO. O callback recebe (elemento, índice, array).

//--------------------------------------------------------------------
// at(), slice(), concat(), includes(), indexOf() - // serve para ler o último elemento, copiar um pedaço, juntar arrays ou ver se algo existe.
{
  const arr = [1, 2, 3, 4, 5, 6];
  arr.at(-1); // result ==> 6
  arr.slice(1, 3); // result ==> [2, 3]  (o fim não entra)
  arr.slice(); // result ==> [1, 2, 3, 4, 5, 6]  (sem argumentos = cópia)
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
// map() - // serve para transformar cada elemento, por exemplo duplicar preços ou passar objetos para nomes.
{
  const cidades = ["miami", "lisboa", "paris"];
  const cap = (s) => s.charAt(0).toUpperCase() + s.slice(1);
  [1, 2, 3].map((x) => x * 2); // result ==> [2, 4, 6]
  cidades.map(cap); // result ==> ["Miami", "Lisboa", "Paris"]
  [1, 2, 3].map((x) => x > 1); // result ==> [false, true, true]  (true/false para CADA um)
  ["a", "b"].map((x, i) => x + i); // result ==> ["a0", "b1"]  (o 2.º argumento é o índice)
  [1, 2].map((x) => { x * 2; }); // result ==> [undefined, undefined]  (⚠ { } sem return)
}
// nota: devolve um array NOVO com o MESMO tamanho. forEach devolve undefined.
// nota2: com { } é preciso return, senão cada posição fica undefined.

//--------------------------------------------------------------------
// filter() - // serve para ficar só com os que passam no teste, por exemplo os adultos ou os pagamentos falhados.
{
  const pessoas = [
    { nome: "Ana", idade: 25 },
    { nome: "Rui", idade: 17 },
    { nome: "Bia", idade: 30 },
  ];
  [1, 2, 3, 4, 5, 6].filter((x) => x % 2 === 0); // result ==> [2, 4, 6]
  pessoas.filter((p) => p.idade >= 18).map((p) => p.nome); // result ==> ["Ana", "Bia"]  (o Rui tem 17, sai)
  [1, 2, 3].filter((x) => x > 5); // result ==> []  (nenhum passa: array vazio, não undefined)
}
// nota: filter dá TODOS os que passam (array); find dá só o primeiro (elemento).

//--------------------------------------------------------------------
// reduce() - // serve para transformar uma lista num só valor, por exemplo somar ou contar letras.
{
  //  volta   acc   cur   devolve
  //  1       0     2     2
  //  2       2     4     6
  //  3       6     6     12
  //  4       12    8     20
  [2, 4, 6, 8].reduce((acc, cur) => acc + cur, 0); // result ==> 20  (o 0 é o valor inicial)
  [12, 9, 1, 8].reduce((acc, cur) => acc + cur, 23); // result ==> 53  (começa em 23)
  ["a", "b", "c"].reduce((acc, x) => x + acc, ""); // result ==> "cba"  (cada letra vai à frente)
  assert.throws(() => [].reduce((a, b) => a + b), TypeError); // vazio e sem início → TypeError

  const freq = [..."banana"].reduce((acc, letra) => {
    acc[letra] = (acc[letra] ?? 0) + 1; // ler → somar → guardar
    return acc; // ⚠ sem este return, a volta seguinte recebe undefined
  }, {});
  freq; // result ==> { b: 1, a: 3, n: 2 }  (com Map, ver §14)
}
// nota: o callback recebe (acumulado, atual) e DEVOLVE o novo acumulado. Dá sempre o valor inicial.
// nota2: sem valor inicial, acc começa no 1.º elemento e cur no 2.º, e um array vazio rebenta.

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
// some(), every() - // serve para saber se algum valor passa ("há algum negativo?") ou se todos passam ("está tudo preenchido?").
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
  orig.with(0, 9); // result ==> [9, 1, 2]  (índice 0 trocado)
  [5, 6].with(-1, 0); // result ==> [5, 0]  (-1 é o último)
  orig; // result ==> [3, 1, 2]  (intacto)
}
// nota: fazem o mesmo que sort, reverse, splice e arr[i] = v, mas devolvem uma CÓPIA.
// nota2: o "to" à frente do nome quer dizer cópia.

//--------------------------------------------------------------------
// forEach() - // serve para fazer algo com cada elemento (imprimir, guardar noutro sítio) quando não preciso de um array novo.
{
  const vistos = [];
  const ret = ["cobra", "tigre"].forEach((a) => {
    if (a === "cobra") return; // só sai desta volta, como um continue
    vistos.push(a);
  });
  ret; // result ==> undefined  (forEach não devolve nada)
  vistos; // result ==> ["tigre"]
}
// nota: não tem break. Para parar a meio, usa for...of com break (§6) ou some/find.
// nota2: keys(), values() e entries() dão iteradores para usar com for...of (§6).

//--------------------------------------------------------------------
// filter().map().reduce() - // serve para dar a soma das idades dos adultos numa só expressão.
{
  const pessoas = [
    { nome: "Candice", idade: 25 },
    { nome: "Tammy", idade: 30 },
    { nome: "Allen", idade: 49 },
    { nome: "Nettie", idade: 21 },
    { nome: "Stuart", idade: 17 },
  ];
  // 1. filter(idade >= 21) → Candice, Tammy, Allen, Nettie
  // 2. map(p => p.idade)   → [25, 30, 49, 21]
  // 3. reduce(soma, 0)     → 125
  const total = pessoas
    .filter((p) => p.idade >= 21)
    .map((p) => p.idade)
    .reduce((a, b) => a + b, 0);
  total; // result ==> 125  (sem o filter entrava o Stuart: 142)
}
// nota: a ordem importa. Cada método recebe o array do anterior. Com map antes do filter, já não há objetos.

// §11 ── ORDENAR ──────────────────────────────────────────────────────────────

//--------------------------------------------------------------------
// sort((a, b) => a - b) - // serve para ordenar preços do mais barato ao mais caro.
{
  const pontos = [1, 10, 2, 21];
  [...pontos].sort(); // result ==> [1, 10, 2, 21]  (⚠ sem função ordena como texto: "10" < "2")
  [...pontos].sort((a, b) => a - b); // result ==> [1, 2, 10, 21]  (crescente)
  [4, 2, 5, 10, 3].sort((a, b) => b - a); // result ==> [10, 5, 4, 3, 2]  (decrescente)
  [3, 20, 100].sort(); // result ==> [100, 20, 3]  (como texto, "1" < "2" < "3")
  pontos; // result ==> [1, 10, 2, 21]  (intacto, graças ao [...pontos])
}
// nota: sort muda o original; toSorted(fn) faz o mesmo e devolve uma cópia. O resultado da função decide: negativo, a primeiro; positivo, b primeiro; 0, mantém.
// nota2: a - b sobe, b - a desce.

//--------------------------------------------------------------------
// localeCompare() - // serve para ordenar nomes portugueses com acentos e maiúsculas como num dicionário.
{
  const palavras = ["b", "A", "á", "a", "B"];
  ["word", "Word", "1 Word"].sort(); // result ==> ["1 Word", "Word", "word"]  (números, MAIÚSCULAS, minúsculas)
  palavras.toSorted(); // result ==> ["A", "B", "a", "b", "á"]  (o código da letra manda, acentos no fim)
  palavras.toSorted((a, b) => a.localeCompare(b, "pt")); // result ==> ["a", "A", "á", "b", "B"]
  "a".localeCompare("b"); // result ==> -1  (negativo: "a" primeiro)
}
// nota: a - b com texto dá NaN. Para texto usa sempre localeCompare.

//--------------------------------------------------------------------
// sort por 2 campos com || - // serve para ordenar por idade e, se empatar, por nome.
{
  const ps = [
    { n: "Rui", idade: 30 },
    { n: "Ana", idade: 25 },
    { n: "Bia", idade: 30 },
  ];
  // Rui vs Bia: 30 - 30 = 0 (empate), o || passa ao nome → "Bia" antes
  // Rui vs Ana: 25 - 30 = -5, já decide (não chega ao nome)
  ps.toSorted((a, b) => b.idade - a.idade || a.n.localeCompare(b.n)).map((p) => p.n); // result ==> ["Bia", "Rui", "Ana"]
}
// nota: se a 1.ª comparação der 0, o || tenta a 2.ª. Se a Ana tivesse 30, ficava ["Ana", "Bia", "Rui"].
// nota2: ordenar duas vezes seguidas também funciona, mas é menos claro.

// §12 ── OBJETOS ──────────────────────────────────────────────────────────────

//--------------------------------------------------------------------
// criar, alterar e apagar chaves - // serve para guardar os dados de uma coisa (um carro, um utilizador) por nome de campo.
{
  const carro = { marca: "VW", ano: 2010 };
  carro.cor = "azul"; // chave nova: cria
  carro.ano = 2012; // chave que já existe: substitui
  delete carro.cor; // apaga
  carro; // result ==> { marca: "VW", ano: 2012 }
  const campo = "marca";
  carro[campo]; // result ==> "VW"  ([ ] quando a chave está numa variável)
  carro.campo; // result ==> undefined  (procura a chave "campo", que não existe)
  carro.inexistente; // result ==> undefined  (sem erro)
}
// nota: o ponto usa o nome escrito; [ ] usa o VALOR da variável.
// nota2: const o = {}; o.a = 1; o.a = 2; deixa uma só chave, a = 2.

//--------------------------------------------------------------------
// atalhos no objeto: { idade }, [chave]: valor, ola() - // serve para escrever objetos mais curtos a partir de variáveis.
{
  const campo = "job";
  const pessoa = { nome: "Tiago", [campo]: "web dev" };
  const idade = 35;
  const curto = { idade, ola() { return "olá"; } };
  pessoa.job; // result ==> "web dev"  (a chave chama-se "job", o valor de campo)
  curto.idade; // result ==> 35  ({ idade } = { idade: idade })
  curto.ola(); // result ==> "olá"
  Object.keys({ [campo + 1]: 0 }); // result ==> ["job1"]  (dentro de [ ] vai uma expressão)
}
// nota: { campo: 1 } cria a chave "campo"; { [campo]: 1 } cria a chave "job".

//--------------------------------------------------------------------
// in vs Object.hasOwn() - // serve para distinguir "a chave não existe" de "a chave existe com undefined".
{
  const carro = { marca: "VW", vazio: undefined };
  "marca" in carro; // result ==> true
  "toString" in carro; // result ==> true  (⚠ vê também as chaves herdadas)
  Object.hasOwn(carro, "toString"); // result ==> false  (só vê as do próprio objeto)
  Object.hasOwn(carro, "vazio"); // result ==> true  (existe, mesmo valendo undefined)
  carro.vazio !== undefined; // result ==> false  (este teste não vê a diferença)
  Object.hasOwn({}, "toString"); // result ==> false  (vem do protótipo)
}
// nota: para "existe mesmo?" usa Object.hasOwn.

//--------------------------------------------------------------------
// Object.keys(), values(), entries() e for...in - // serve para listar os campos de um objeto ou percorrê-lo como uma lista.
{
  const obj = { k1: "v1", k2: "v2" };
  Object.keys(obj); // result ==> ["k1", "k2"]
  Object.values(obj); // result ==> ["v1", "v2"]
  Object.entries(obj); // result ==> [["k1", "v1"], ["k2", "v2"]]  (pares [chave, valor])
  Object.values({ a: 1, b: 2 }).length; // result ==> 2

  const viaIn = [];
  for (const k in obj) viaIn.push(`${k}=${obj[k]}`);
  viaIn; // result ==> ["k1=v1", "k2=v2"]

  const viaEntries = [];
  for (const [k, v] of Object.entries(obj)) viaEntries.push(`${k}=${v}`);
  viaEntries; // result ==> ["k1=v1", "k2=v2"]  (o mesmo, com entries)
}
// nota: for...in também dá chaves herdadas. Prefere for...of com Object.entries.

//--------------------------------------------------------------------
// Object.fromEntries() - // serve para fazer um "map" sobre um objeto, por exemplo duplicar todos os preços.
{
  const precos = { pao: 1, leite: 2 };
  // 1. Object.entries(precos)       → [["pao", 1], ["leite", 2]]
  // 2. .map(([k, v]) => [k, v * 2]) → [["pao", 2], ["leite", 4]]
  // 3. Object.fromEntries(…)        → { pao: 2, leite: 4 }
  const dobro = Object.fromEntries(Object.entries(precos).map(([k, v]) => [k, v * 2]));
  dobro; // result ==> { pao: 2, leite: 4 }
  precos; // result ==> { pao: 1, leite: 2 }  (intacto)
  Object.fromEntries([["a", 1], ["a", 2]]); // result ==> { a: 2 }  (a mesma chave duas vezes: a segunda ganha)
}
// nota: é o inverso de Object.entries. Também aceita um Map: Object.fromEntries(meuMap).

//--------------------------------------------------------------------
// ordem das chaves - // serve para perceber porque é que Object.keys não devolve a ordem em que escrevi.
Object.keys({ b: 1, 2: 1, a: 1, 1: 1 }); // result ==> ["1", "2", "b", "a"]  (inteiros primeiro, crescentes)
Object.keys({ z: 0, 10: 0, 5: 0 }); // result ==> ["5", "10", "z"]
// nota: depois dos inteiros vêm as chaves de texto, pela ordem de criação.
// nota2: com ids numéricos não contes com a ordem de criação. Usa um Map (§14).

//--------------------------------------------------------------------
// Object.assign() e Object.freeze() - // serve para juntar objetos (assign) e proteger uma configuração contra alterações (freeze).
{
  const alvo = { a: 1 };
  Object.assign(alvo, { b: 2 }); // muda o alvo
  alvo; // result ==> { a: 1, b: 2 }

  const congelado = Object.freeze({ a: 1, dentro: { b: 1 } });
  congelado.dentro.b = 2; // ⚠ funciona: o objeto de dentro não está congelado
  congelado.dentro.b; // result ==> 2
  assert.throws(() => {
    congelado.a = 2;
  }, TypeError); // 1.º nível bloqueado (TypeError em strict mode)
}
// nota: { ...a, ...b } cria um objeto novo; assign(a, b) muda o a.
// nota2: freeze só bloqueia o 1.º nível. Object.freeze([1, 2]).push(3) dá TypeError.

//--------------------------------------------------------------------
// Object.groupBy() - // serve para separar uma lista em grupos, por exemplo "adulto" e "menor".
{
  const pessoas = [
    { nome: "Ana", idade: 25 },
    { nome: "Rui", idade: 17 },
    { nome: "Bia", idade: 30 },
  ];
  // o callback devolve o NOME do grupo: Ana "adulto", Rui "menor", Bia "adulto"
  const grupos = Object.groupBy(pessoas, (p) => (p.idade >= 18 ? "adulto" : "menor"));
  grupos.adulto.map((p) => p.nome); // result ==> ["Ana", "Bia"]
  grupos.menor.map((p) => p.nome); // result ==> ["Rui"]
  grupos.idoso; // result ==> undefined  (grupo sem ninguém não existe)
  Object.keys(Object.groupBy([1, 2, 3], (n) => (n % 2 ? "impar" : "par"))); // result ==> ["impar", "par"]
}
// nota: o objeto devolvido não tem protótipo (não herda toString). Map.groupBy faz o mesmo mas devolve um Map.

//--------------------------------------------------------------------
// JSON.stringify() e JSON.parse() - // serve para enviar dados numa API ou guardá-los num ficheiro, como texto.
{
  const json = JSON.stringify({ a: 1, b: [true, null] });
  json; // result ==> '{"a":1,"b":[true,null]}'
  JSON.parse(json); // result ==> { a: 1, b: [true, null] }  (parse faz o inverso)
  JSON.stringify({ f() {}, u: undefined }); // result ==> "{}"  (funções e undefined desaparecem)
  typeof JSON.stringify(5); // result ==> "string"  (devolve sempre texto)
  assert.throws(() => JSON.parse("{a:1}"), SyntaxError); // em JSON as chaves levam aspas
}
// nota: uma Date vira string. JSON é TEXTO com regras mais rígidas (aspas duplas, sem vírgula final).

// §13 ── DESESTRUTURAÇÃO, SPREAD, REST ────────────────────────────────────────
// "..." à DIREITA do = ou numa chamada é spread (espalha); à ESQUERDA ou nos parâmetros é rest (junta).

//--------------------------------------------------------------------
// const [a, b] = array - // serve para tirar valores de um array por posição, ou trocar duas variáveis.
{
  //            POSIÇÃO 0  POSIÇÃO 1  O QUE SOBRA
  const [tomate, cogumelo, ...resto] = ["🍅", "🍄", "🥦", "🥒"];
  const [, segundo] = [1, 2, 3]; // a vírgula salta a posição 0
  const [d1 = "omissão"] = []; //   valor por omissão
  let sa = 1;
  let sb = 2;
  [sa, sb] = [sb, sa]; // troca sem variável temporária
  tomate;    // result ==> "🍅"
  cogumelo;  // result ==> "🍄"
  resto;     // result ==> ["🥦", "🥒"]
  segundo;   // result ==> 2
  d1;        // result ==> "omissão"
  [sa, sb];  // result ==> [2, 1]
}
// nota: [ ] à esquerda = por posição; { } à esquerda = por nome (ver o bloco a seguir).
// nota2: const [x, y = 5] = [1, null] dá y = null. O valor por omissão só entra para undefined.

//--------------------------------------------------------------------
// const { a, b } = objeto - // serve para ler vários campos de um objeto numa só linha, pelo nome.
{
  const pessoa = { nome: "Tiago", job: "web dev", perfil: { cidade: "Porto" }, ano: 1987 };
  //      CHAVE: NOVO NOME   CHAVE   CHAVE = OMISSÃO
  const { nome: nomePessoa, job, cidade = "Lisboa" } = pessoa;
  const { perfil: { cidade: cidadePerfil } } = pessoa; // entra dentro de outro objeto
  const { ano, ...semAno } = pessoa; //                   ...resto junta o que sobra
  nomePessoa;    // result ==> "Tiago"
  job;           // result ==> "web dev"
  cidade;        // result ==> "Lisboa"
  cidadePerfil;  // result ==> "Porto"
  ano;           // result ==> 1987
  semAno;        // result ==> { nome: "Tiago", job: "web dev", perfil: { cidade: "Porto" } }
}
// nota: { nome: x } à esquerda renomeia (x recebe o valor). Num objeto à direita, cria a chave nome com o valor x.
// nota2: const { a: b } = { a: 1 } cria só a variável b (com 1). O a é apenas a chave a ler.

//--------------------------------------------------------------------
// desestruturar parâmetros - // serve para uma função receber um objeto de opções e ler as chaves logo no cabeçalho.
{
  const apresentar = ({ nome, idade = 0 }) => `${nome} (${idade})`;
  apresentar({ nome: "Rui" });            // result ==> "Rui (0)"
  apresentar({ nome: "Ana", idade: 30 }); // result ==> "Ana (30)"
  apresentar({ idade: 5 });               // result ==> "undefined (5)"  (o nome não veio)
  assert.throws(() => apresentar(), TypeError); // sem argumento não há objeto para desestruturar
}
// nota: para não rebentar sem argumento, escreve ({ nome, idade = 0 } = {}) => ….
// nota2: com um objeto de opções, a ordem dos argumentos deixa de importar.

//--------------------------------------------------------------------
// spread [...a] e {...o} - // serve para criar um array ou objeto novo a partir de outros, sem mexer nos originais.
{
  const antigos = ["Tiago", "John"];
  const alunos = [...antigos, "Xico"];
  const base = { a: 1, b: 2 };
  antigos;                // result ==> ["Tiago", "John"]  (intacto)
  alunos;                 // result ==> ["Tiago", "John", "Xico"]
  Math.max(...[1, 5, 3]); // result ==> 5  (espalhar numa chamada de função)
  [..."ola", "!"];       // result ==> ["o", "l", "a", "!"]  (uma string espalha-se letra a letra)
  ({ ...base, b: 3 });    // result ==> { a: 1, b: 3 }  (o b de depois ganha)
  ({ b: 3, ...base });    // result ==> { b: 2, a: 1 }  (agora ganha o b de base)
}
// nota: o que vem depois ganha. É uma cópia rasa: objetos lá dentro continuam partilhados (§15).

//--------------------------------------------------------------------
// rest (...args) - // serve para uma função aceitar quantos argumentos quiser, como somar(1, 2, 3).
{
  //                    ...ns = array com todos os argumentos (tem de ser o último parâmetro)
  const somar = (...ns) => ns.reduce((a, b) => a + b, 0);
  const primeiroEResto = (primeiro, ...outros) => [primeiro, outros];
  somar(1, 2, 3);            // result ==> 6
  somar();                   // result ==> 0  (ns = [], o reduce começa em 0)
  primeiroEResto(1, 2, 3);   // result ==> [1, [2, 3]]
  primeiroEResto(9);         // result ==> [9, []]  (não sobrou nada)
}
// nota: o mesmo "...": nos parâmetros junta (rest); numa chamada espalha (spread).

// §14 ── MAP, SET, WEAKMAP ───────────────────────────────────────────────────

//--------------------------------------------------------------------
// Map.set() - // serve para guardar o saldo de cada pessoa pelo nome.
{
  const saldos = new Map();
  saldos.set("ana", 10);
  saldos.set("bruno", 30);
  saldos.set("ana", 25); // a chave já existe: substitui o valor
  saldos.size;       // result ==> 2
  saldos.get("ana"); // result ==> 25  (não 35: o Map não soma sozinho)
  saldos.set("bruno", 5);
  saldos.get("bruno"); // result ==> 5  (o 30 foi substituído)
}
// nota: push(x) acrescenta sempre um elemento novo. set(chave, valor) substitui se a chave já existe.

//--------------------------------------------------------------------
// acumular num Map - // serve para somar todos os movimentos de cada conta.
{
  const movimentos = [["ana", 10], ["bruno", 30], ["ana", 15]];
  const totais = new Map();
  for (const [conta, valor] of movimentos) {
    const anterior = totais.get(conta) ?? 0; // 1. ler (0 se a conta ainda não existe)
    const novo = anterior + valor; //           2. somar
    totais.set(conta, novo); //                 3. guardar (substitui o anterior)
  }
  totais.get("ana"); // result ==> 25  (10 + 15)
  totais.get("bruno"); // result ==> 30
}
// nota: versão curta, os mesmos 3 passos: totais.set(conta, (totais.get(conta) ?? 0) + valor).
// nota2: ?? só troca undefined/null; || também trocaria um 0 guardado.

//--------------------------------------------------------------------
// Map: get, has, delete, keys - // serve para consultar contagens (letra → vezes) sem estragar nada.
{
  const conta = new Map([["a", 1]]);
  conta.set("b", 2).set("c", 3); // set() devolve o próprio Map, dá para encadear
  const chaveObj = { id: 1 };
  conta.set(chaveObj, "objeto como chave");
  conta.get("a"); // result ==> 1
  conta.get("z"); // result ==> undefined  (chave que não existe, sem erro)
  conta.get("z") ?? 0; // result ==> 0
  conta.has("b"); // result ==> true  (só pergunta, não lê o valor)
  conta.delete("c"); // result ==> true  (false se não existia)
  conta.get(chaveObj); // result ==> "objeto como chave"
  conta.size; // result ==> 3  (a, b e chaveObj)
  [...conta.keys()].slice(0, 2); // result ==> ["a", "b"]  (ordem de inserção)
}
// nota: num {} a chave vira texto ("[object Object]"). O Map guarda o objeto tal como é.
// nota2: também há clear(), values(), entries(); for (const [chave, valor] of mapa) percorre por ordem.

//--------------------------------------------------------------------
// Map ↔ objeto - // serve para receber um objeto JSON e trabalhar nele como Map, ou o contrário para enviar.
{
  Object.fromEntries(new Map([["x", 1]])); // result ==> { x: 1 }
  [...new Map(Object.entries({ y: 2 }))]; // result ==> [["y", 2]]
  Object.fromEntries([["a", 1], ["a", 2]]); // result ==> { a: 2 }  (a segunda substitui a primeira)
}
// nota: entries (lista de pares [chave, valor]) é a ponte entre os dois.
// nota2: JSON.stringify(mapa) dá "{}". Converte primeiro com Object.fromEntries.

//--------------------------------------------------------------------
// Set - // serve para guardar valores únicos: saber "já vi isto?" depressa, ou tirar repetidos de um array.
{
  const vistos = new Set([1, 2, 2, 3]);
  vistos.add(3); // já existe: ignorado
  vistos.size; // result ==> 3  (o 2 repetido fica só uma vez)
  vistos.has(2); // result ==> true
  [...new Set([3, 1, 3, 2, 1])]; // result ==> [3, 1, 2]  (tirar repetidos, mantém a ordem)
  new Set([[1], [1]]).size; // result ==> 2  (dois arrays diferentes, mesmo conteúdo)
  new Set("banana").size; // result ==> 3  (só ficam b, a, n)
}
// nota: Set guarda só valores; Map guarda valor por chave. Objetos comparam-se pela referência.

//--------------------------------------------------------------------
// union / intersection / difference - // serve para comparar duas listas, por exemplo os clientes de ontem e de hoje.
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
// WeakMap - // serve para prender dados a um objeto (ex.: cliques de um elemento) sem impedir que ele seja apagado da memória.
{
  const cache = new WeakMap();
  const elemento = {};
  cache.set(elemento, { cliques: 1 });
  cache.get(elemento).cliques; // result ==> 1
  assert.throws(() => cache.set("texto", 1), TypeError); // a chave tem de ser um objeto
}
// nota: um Map mantém a chave viva para sempre; o WeakMap deixa-a ir quando mais ninguém a usa.
// nota2: não dá para fazer for...of, nem tem keys() ou size, porque as entradas podem desaparecer a qualquer momento.

// §15 ── CÓPIAS: RASA VS PROFUNDA ────────────────────────────────────────────

//--------------------------------------------------------------------
// cópia rasa {...o} / [...a] - // serve para mudar um campo de um objeto sem mexer no original.
{
  const livro = { autor: "Charlotte Bronte", tags: ["romance"] };
  const rasa = { ...livro };
  rasa.autor = "Emily";
  rasa.tags.push("clássico");
  rasa === livro; // result ==> false
  livro.autor; // result ==> "Charlotte Bronte"  (1.º nível: separado)
  livro.tags; // result ==> ["romance", "clássico"]  (o array de dentro é partilhado)
  const a = [[1]];
  const b = [...a];
  b[0].push(2);
  a[0]; // result ==> [1, 2]  (b é novo, mas b[0] e a[0] são o mesmo array)
}
// nota: b = a não copia nada, é o mesmo objeto com dois nomes. {...a} é outro objeto, mas só copia o 1.º nível.
// nota2: a.slice() e Object.assign({}, o) também são rasos.

//--------------------------------------------------------------------
// structuredClone - // serve para copiar um objeto inteiro, em todos os níveis, para o mudar sem medo.
{
  const original = { d: new Date(0), tags: ["a"], m: new Map([[1, 2]]) };
  const profunda = structuredClone(original);
  profunda.tags.push("b");
  original.tags; // result ==> ["a"]
  profunda.d instanceof Date; // result ==> true
  profunda.m.get(1); // result ==> 2
  typeof JSON.parse(JSON.stringify(original)).d; // result ==> "string"  (o truque JSON estraga a data)
  JSON.parse(JSON.stringify({ m: new Map([[1, 2]]) })).m; // result ==> {}  (e o Map)
  assert.throws(() => structuredClone({ f() {} })); // funções não se copiam
}
// nota: structuredClone mantém Date, Map e Set. O truque JSON.parse(JSON.stringify(x)) perde-os e as funções.

// §16 ── FUNÇÕES ─────────────────────────────────────────────────────────────

//--------------------------------------------------------------------
// três formas de criar uma função - // serve para escolher a forma certa e saber ler as três em código alheio.
{
  declarada(2); // funciona: a declaração sobe para o topo do bloco (hoisting)
  function declarada(a) {
    return a * 2;
  }
  const expressao = function (a) {
    return a * 2;
  };
  const seta = (a) => a * 2; //                     1 linha sem { } → devolve sozinha
  const setaBloco = (a) => { return a * 2; }; //    com { } → precisa de return
  const setaObjeto = () => ({ ok: true }); //       para devolver um objeto, envolver em ( )
  const iife = (() => 42)(); //                     IIFE: criada e chamada logo
  declarada(2); // result ==> 4
  expressao(2) + seta(2) + setaBloco(2); // result ==> 12
  setaObjeto(); // result ==> { ok: true }
  iife; // result ==> 42
  const f = (a) => { a + 1; };
  f(1); // result ==> undefined  (com { } é um bloco e falta o return)
}
// nota: só a declaração (function nome) se pode chamar antes da linha onde está. As outras duas dão erro (TDZ).
// nota2: () => { ok: true } devolve undefined, as { } são lidas como bloco. Uma seta não tem this próprio (§18).

//--------------------------------------------------------------------
// return - // serve para entregar a quem chamou o valor da função; só esse valor sai.
{
  function total(preco, qtd, portes) {
    const subtotal = preco * qtd; // calculado, invisível lá fora
    if (qtd === 0) return 0; //      termina aqui se não há nada
    return subtotal + portes; //     devolvido a quem chamou
  }
  const semReturn = (a) => { a * 2; }; // calcula, mas não devolve
  function dois() { return 1; return 2; }
  total(10, 2, 5); // result ==> 25
  total(10, 0, 5); // result ==> 0  (o último return nem corre)
  semReturn(5); // result ==> undefined
  dois(); // result ==> 1  (o primeiro return termina a função)
}
// nota: console.log mostra no ecrã; return entrega o valor ao código.

//--------------------------------------------------------------------
// parâmetros por omissão - // serve para cumprimentar "anónimo" quando não vem nome.
{
  const ola = (nome = "anónimo") => `olá ${nome}`;
  ola(); // result ==> "olá anónimo"
  ola(undefined); // result ==> "olá anónimo"
  ola(null); // result ==> "olá null"  (null não ativa o valor por omissão)
  ola(""); // result ==> "olá "  (a string vazia também não)
}
// nota: o valor por omissão só entra para undefined. nome ?? "x" troca também o null.

//--------------------------------------------------------------------
// objeto passado a uma função - // serve para saber se uma função pode alterar os dados de quem a chama.
{
  const muda = (o) => { o.x = 1; };
  const troca = (o) => { o = { x: 99 }; };
  const alvo = {};
  muda(alvo); //  altera o objeto partilhado
  troca(alvo); // o passa a apontar para outro objeto; alvo não muda
  alvo; // result ==> { x: 1 }
  const g = (n) => { n = n + 1; };
  let a = 5;
  g(a);
  a; // result ==> 5  (n é outra variável)
}
// nota: a função recebe a mesma referência: mudar um campo vê-se fora, trocar o parâmetro não.

//--------------------------------------------------------------------
// callback e função de ordem superior - // serve para passar "o que fazer" a outra função, como em map, filter e setTimeout.
{
  const aplicar = (valor, callback) => callback(valor);
  const multiplicador = (fator) => (n) => n * fator;
  const triplo = multiplicador(3);
  aplicar(5, (v) => v + 1); // result ==> 6  (callback(5) → 5 + 1)
  triplo(4); // result ==> 12
  multiplicador(2)(5); // result ==> 10  (multiplicador(2) devolve uma função, já chamada com 5)
}
// nota: callback = função passada como argumento. Ordem superior = função que recebe ou devolve funções.
// nota2: aplicar(5, f) passa a função; aplicar(5, f()) chama-a já e passa o resultado.

//--------------------------------------------------------------------
// recursão - // serve para problemas que se repetem em tamanho menor, como o fatorial.
{
  const fatorial = (n) => (n <= 1 ? 1 : n * fatorial(n - 1));
  fatorial(3); // result ==> 6  (3 * 2 * 1; as contas fazem-se na subida)
  fatorial(5); // result ==> 120
  fatorial(0); // result ==> 1  (0 <= 1 é o caso de paragem)
}
// nota: sem caso de paragem a pilha esgota (RangeError).

// §17 ── CLOSURES ────────────────────────────────────────────────────────────

//--------------------------------------------------------------------
// closure - // serve para ter um contador privado que só as suas funções podem mexer.
{
  function criarContador() {
    let conta = 0;
    return { inc: () => ++conta, ver: () => conta };
  }
  const contadorA = criarContador();
  const contadorB = criarContador();
  contadorA.inc();
  contadorA.inc();
  contadorB.inc();
  contadorA.ver(); // result ==> 2
  contadorB.ver(); // result ==> 1
  contadorB.inc();
  contadorA.ver(); // result ==> 2  (a conta de B é outra variável)
}
// nota: cada chamada a criarContador() cria uma conta nova, viva enquanto as funções devolvidas existirem.
// nota2: a closure guarda a variável, não uma cópia; por isso ver() vê sempre o valor atual.

//--------------------------------------------------------------------
// memoização - // serve para tornar rápida uma função lenta e chamada muitas vezes com os mesmos valores, como o fibonacci.
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
  fib(50); // result ==> 12586269025  (instantâneo; sem memo seriam milhares de milhões de chamadas)
}
// nota: a cache vive na closure. Ordem: perguntar à cache, calcular se falta, guardar, devolver.
// nota2: só funciona se a função der sempre o mesmo resultado para o mesmo n.

//--------------------------------------------------------------------
// var vs let num ciclo - // serve para perceber porque funções criadas num ciclo com var veem todas o último valor.
{
  const fnsVar = [];
  for (var iv = 0; iv < 3; iv++) fnsVar.push(() => iv); // var: UMA variável para o ciclo todo
  const fnsLet = [];
  for (let il = 0; il < 3; il++) fnsLet.push(() => il); // let: uma variável nova por volta
  fnsVar.map((fn) => fn()); // result ==> [3, 3, 3]
  fnsLet.map((fn) => fn()); // result ==> [0, 1, 2]
}
// nota: as funções só leem iv quando são chamadas, e nessa altura o ciclo já acabou (iv = 3).
// nota2: em ciclos, usa let.

// §18 ── THIS, CALL/APPLY/BIND ───────────────────────────────────────────────

//--------------------------------------------------------------------
// this - // serve para um método ler os dados do próprio objeto.
{
  const conta = {
    dono: "Tiago",
    normal() { return this?.dono; },
    comSeta() { return [1].map(() => this.dono)[0]; }, // a seta usa o this do método
  };
  const solta = conta.normal; // tirada do objeto
  conta.normal(); // result ==> "Tiago"  (this = o que está antes do ponto)
  solta(); // result ==> undefined  (sem nada antes do ponto, this é undefined)
  conta.comSeta(); // result ==> "Tiago"
}
// nota: um método escrito como seta { f: () => this.dono } não vê o objeto: a seta apanha o this de fora.
// nota2: setTimeout(conta.normal, 0) também passa a função solta. Sem o ?. em this?.dono, solta() daria TypeError.

//--------------------------------------------------------------------
// call / apply / bind - // serve para usar um método com outro objeto, ou fixar o this antes de passar a função.
{
  function normal() { return this.dono; }
  const fixa = normal.bind({ dono: "Bia" }); // bind não chama: devolve uma função nova com this fixo
  normal.call({ dono: "Ana" }); // result ==> "Ana"  (chama já, argumentos um a um)
  normal.apply({ dono: "Rui" }, []); // result ==> "Rui"  (chama já, argumentos num array)
  fixa(); // result ==> "Bia"
  fixa.call({ dono: "Zé" }); // result ==> "Bia"  (o this de um bind já não muda)
}
// nota: call e apply fazem o mesmo; só muda como se passam os argumentos (A de apply = Array).

// §19 ── CLASSES E PROTÓTIPOS ────────────────────────────────────────────────

//--------------------------------------------------------------------
// class + constructor - // serve para criar muitas pessoas com os mesmos campos e métodos, sem repetir código.

class Pessoa {
  static especie = "humano"; // pertence à classe, não a cada pessoa
  #segredo; //                  privado: só a classe vê
  tipo = "pessoa"; //           campo público

  constructor(nome = "Adelia", idade = 34) { // corre no new
    this.nome = nome;
    this.idade = idade;
    this.#segredo = "1234";
  }
  anoNascimento(anoAtual) { // método
    return anoAtual - this.idade;
  }
  get apresentacao() { return `${this.nome}, ${this.idade}`; }
  set idadeSegura(v) {
    if (v < 0) throw new RangeError("idade negativa");
    this.idade = v;
  }
  confirmaSegredo(tentativa) { return tentativa === this.#segredo; }
  static bebe(nome) { return new Pessoa(nome, 0); }
}
const pessoaTiago = new Pessoa("Tiago", 33);
// new faz: 1) cria objeto vazio  2) corre o constructor com this = esse objeto  3) devolve-o
pessoaTiago.nome; // result ==> "Tiago"
new Pessoa().nome; // result ==> "Adelia"  (valor por omissão)
new Pessoa("Ana").idade; // result ==> 34  (a idade não foi passada, entra a de omissão)
pessoaTiago.anoNascimento(2020); // result ==> 1987
// nota: sem o new, Pessoa("Tiago") dá TypeError numa classe.

//--------------------------------------------------------------------
// get / set / #privado / static - // serve para campos calculados, validar ao atribuir, esconder dados e ter coisas que são da classe.

pessoaTiago.apresentacao; // result ==> "Tiago, 33"  (get usa-se sem parênteses, como um campo)
assert.throws(() => { pessoaTiago.idadeSegura = -1; }, RangeError);
pessoaTiago.confirmaSegredo("1234"); // result ==> true
pessoaTiago.segredo; // result ==> undefined  (o #segredo está escondido)
Pessoa.especie; // result ==> "humano"  (static usa-se pela classe)
Pessoa.bebe("Bia").idade; // result ==> 0
pessoaTiago.especie; // result ==> undefined  (pelo objeto não se vê)
// nota: pessoaTiago.apresentacao() dá TypeError, porque um get é lido como campo, não chamado.

//--------------------------------------------------------------------
// extends + super - // serve para um Atleta ser uma Pessoa com a altura a mais, sem copiar a classe.

class Atleta extends Pessoa {
  constructor(nome, idade, altura) {
    super(nome, idade); // corre o constructor de Pessoa
    this.altura = altura;
  }
  get apresentacao() { // substitui o da mãe, mas reutiliza-o
    return `${super.apresentacao} — ${this.altura}cm`;
  }
}
const atletaRui = new Atleta("Rui", 33, 175);
atletaRui.apresentacao; // result ==> "Rui, 33 — 175cm"  (versão da filha + super)
atletaRui instanceof Atleta; // result ==> true
atletaRui instanceof Pessoa; // result ==> true  (a cadeia passa pelas duas)
atletaRui.anoNascimento(2020); // result ==> 1987  (método herdado da mãe)
atletaRui.confirmaSegredo("1234"); // result ==> true  (o #segredo foi criado pelo constructor da mãe)
// nota: usar this antes de super() dá ReferenceError.

//--------------------------------------------------------------------
// protótipos - // serve para perceber porque os métodos não são copiados para cada objeto.
{
  const base = { falar() { return "olá de " + this.n; } };
  const filho = Object.create(base); // filho herda de base
  filho.n = "filho";

  // pessoaTiago.anoNascimento: não tem no objeto -> procura em Pessoa.prototype -> tem -> usa esse
  Object.getPrototypeOf(pessoaTiago) === Pessoa.prototype; // result ==> true
  Object.getPrototypeOf(Atleta.prototype) === Pessoa.prototype; // result ==> true  (cadeia Atleta -> Pessoa)
  Object.hasOwn(pessoaTiago, "anoNascimento"); // result ==> false  (partilhado, não copiado)
  typeof Pessoa; // result ==> "function"
  filho.falar(); // result ==> "olá de filho"
  Object.hasOwn(filho, "falar"); // result ==> false  (vive em base, filho só o encontra pela cadeia)
}
// nota: class não é um tipo novo, por baixo é uma função com protótipo.

// §20 ── ERROS ───────────────────────────────────────────────────────────────

//--------------------------------------------------------------------
// try/catch/finally - // serve para um texto inválido não rebentar o programa todo.
{
  function lerIdade(txt) {
    const num = Number(txt);
    if (Number.isNaN(num)) throw new TypeError(`não é número: ${txt}`); // termina a função, como um return
    return num;
  }
  const passos = [];
  try {
    passos.push("try");
    lerIdade("abc");
    passos.push("nunca chega aqui");
  } catch (err) {
    passos.push(`catch ${err.name}`); // err.name, err.message, err.stack
  } finally {
    passos.push("finally");
  }
  // o throw salta logo para o catch, o resto do try não corre; o finally corre sempre
  passos; // result ==> ["try", "catch TypeError", "finally"]
}
// nota: lança sempre um Error (TypeError, RangeError...) e não um texto: traz name e stack. Se lerIdade("5") não falhasse, o catch não corria.

//--------------------------------------------------------------------
// erro próprio + cause - // serve para dizer "configuração inválida" e manter o SyntaxError que a causou.
{
  class ErroValidacao extends Error {
    constructor(msg, opcoes) {
      super(msg, opcoes);
      this.name = "ErroValidacao";
    }
  }
  let apanhado;
  try {
    try {
      JSON.parse("{mau");
    } catch (e) {
      throw new ErroValidacao("configuração inválida", { cause: e });
    }
  } catch (e) {
    apanhado = e;
  }
  apanhado instanceof ErroValidacao; // result ==> true
  apanhado instanceof Error; // result ==> true  (herda de Error)
  apanhado.cause instanceof SyntaxError; // result ==> true  (o erro original)
  apanhado.name; // result ==> "ErroValidacao"  (o constructor escreveu por cima do "Error")
}
// nota: sem { cause: e } o erro original perde-se e só fica a mensagem nova.

//--------------------------------------------------------------------
// catch sem variável e finally depois de return - // serve para ignorar o erro quando não preciso dele, e limpar mesmo quando a função já devolveu.
{
  let falhou = false;
  try { null.x; } catch { falhou = true; }  // catch { } dispensa o (err)
  const registo = [];
  const comFinally = () => { try { return "try"; } finally { registo.push("finally correu"); } };
  falhou; // result ==> true
  comFinally(); // result ==> "try"  (o return fica pendente, o finally corre, e devolve-se o do try)
  registo; // result ==> ["finally correu"]
  const f = () => { try { return 1; } finally { return 2; } };
  f(); // result ==> 2  (o return do finally substitui o 1 pendente)
}
// nota: um return dentro do finally substitui o do try. Evita-o.

// §21 ── DATAS ───────────────────────────────────────────────────────────────

//--------------------------------------------------------------------
// new Date(a, m, d) - // serve para criar uma data em hora local e ler as suas partes (31 de janeiro de 2024).
{
  const data = new Date(2024, 0, 31);
  data.getFullYear(); // result ==> 2024
  data.getMonth(); // result ==> 0  (janeiro, os meses começam em 0)
  data.getDate(); // result ==> 31  (dia do mês)
  data.getDay(); // result ==> 3  (dia da semana: quarta, 0 = domingo)
  new Date(2024, 11, 25).getMonth(); // result ==> 11  (dezembro)
}
// nota: Date = dia do mês (começa em 1); Day = dia da semana (começa em 0).
// nota2: também há getHours(), getMinutes(), getSeconds() e getMilliseconds().

//--------------------------------------------------------------------
// setDate e Date.UTC - // serve para calcular "amanhã" ou quantos dias tem um mês.
{
  const data = new Date(2024, 0, 31);
  data.setDate(data.getDate() + 1); // 31 + 1 = 32, passa sozinho para 1 de fevereiro
  data.getMonth(); // result ==> 1  (fevereiro)
  data.getDate(); // result ==> 1
  const dias = (Date.UTC(2024, 2, 1) - Date.UTC(2024, 1, 1)) / 86_400_000; // 86 400 000 = ms num dia
  dias; // result ==> 29  (2024 é bissexto)
  const fev = new Date(2024, 1, 29);
  fev.setDate(30);
  fev.getMonth(); // result ==> 2  (março: fevereiro só tem 29 dias)
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
  new Date(0) === new Date(0); // result ==> false  (dois objetos diferentes)
  new Date(0).getTime() === new Date(0).getTime(); // result ==> true  (compara números)
  +new Date(5) === 5; // result ==> true  (o + transforma a data nos seus ms)
}
// nota: == também compara objetos; só getTime() (ou +data) compara o instante.

// §22 ── REGEX ───────────────────────────────────────────────────────────────

//--------------------------------------------------------------------
// /regex/.test() - // serve para validar formatos (código postal, email) com uma linha.
{
  //   .  qualquer carácter     *  0 ou mais       \d  dígito          \w  letra/dígito/_      \s  espaço
  //   +  1 ou mais             ?  0 ou 1          {2,4}  de 2 a 4     [^abc]  nenhum destes   a|b  a ou b
  //   ^ $  início / fim        (...)  grupo; (?<n>...) grupo com nome
  //   flags: g todas, i ignora maiúsculas, m multilinha, s "." apanha \n, u unicode
  /^\d{4}-\d{3}$/.test("1000-123"); // result ==> true  (código postal português)
  /^\w+@\w+\.[a-z]{2,4}$/.test("tiago@mail.com"); // result ==> true
  /^[^0-9]+\s?!?$/.test("Lisboa !"); // result ==> true
  /olá/i.test("OLÁ mundo"); // result ==> true  (flag i)
  /^\d{4}-\d{3}$/.test("1000-1234"); // result ==> false  ($ obriga a acabar ali)
  /^\d+$/.test(""); // result ==> false  (+ exige pelo menos 1 dígito)
  /\d{4}/.test("abc12345"); // result ==> true  (sem ^ e $ basta encontrar 4 dígitos em qualquer sítio)
}
// nota: ^...$ = o texto todo.

//--------------------------------------------------------------------
// match / matchAll - // serve para tirar números ou partes de uma data de um texto.
{
  const iso = "2024-01-15".match(/(?<ano>\d{4})-(?<mes>\d{2})-(?<dia>\d{2})/);
  "a1b22c333".match(/\d+/g); // result ==> ["1", "22", "333"]  (com g devolve todas as partes)
  "sem números".match(/\d/); // result ==> null  (não encontrou: é null, não [])
  iso.groups.mes; // result ==> "01"  (grupo com nome)
  [..."k1=v1;k2=v2".matchAll(/(\w+)=(\w+)/g)].map((m) => m[2]); // result ==> ["v1", "v2"]  (matchAll exige g)
  ("a1b2".match(/\d/g) ?? []).length; // result ==> 2
}
// nota: "x".match(/\d/g).length rebenta com TypeError porque match deu null. Usa (texto.match(re) ?? []).length.

//--------------------------------------------------------------------
// replace / split com regex - // serve para reformatar datas, limpar texto para um palíndromo e partir por separadores irregulares.
{
  "2024-01-15".replace(/(\d+)-(\d+)-(\d+)/, "$3/$2/$1"); // result ==> "15/01/2024"  ($1 = o que o grupo 1 apanhou)
  "A man, a plan!".toLowerCase().replace(/[^a-z0-9]/g, ""); // result ==> "amanaplan"  (fica só com letras e dígitos)
  "a, b ,c".split(/\s*,\s*/); // result ==> ["a", "b", "c"]  (vírgula com espaços à volta)
  "a-b-c".replace(/-/, "+"); // result ==> "a+b-c"  (sem g: só a 1.ª)
  "a-b-c".replace(/-/g, ""); // result ==> "abc"  (com g: todas)
}
// nota: replace("-", "+") com texto também troca só a 1.ª; para todas usa replaceAll ou /-/g.
// nota2: cada chamada devolve uma string ou array novo, o original fica igual.

//--------------------------------------------------------------------
// lastIndex - // serve para perceber um test() que dá true e depois false com o mesmo texto.
{
  const reG = /a/g; // com g, a regex guardada lembra-se de onde parou (lastIndex)
  reG.test("a"); // result ==> true  (começa em 0, encontra, lastIndex fica 1)
  reG.test("a"); // result ==> false  (começa em 1, não encontra, lastIndex volta a 0)
  reG.test("a"); // result ==> true  (voltou ao início)
}
// nota: só acontece com g (ou y) e a regex reutilizada; /a/.test("a") dá sempre true. Repetiu o test()? Tira o g.

//--------------------------------------------------------------------
// regex ou loop - // serve para limpar ou validar texto num desafio sem decorar regex: cada regex tem um loop equivalente.
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
// sleep(ms, valor) devolve uma Promise que resolve com valor ao fim de ms.
const sleep = (ms, value) => new Promise((resolve) => setTimeout(() => resolve(value), ms));

async function main() {
  //--------------------------------------------------------------------
  // new Promise + await - // serve para esperar por um pedido à rede sem bloquear o resto do programa.
  {
    const p = new Promise((resolve, reject) => {
      const ok = true;
      ok ? resolve("feito") : reject(new Error("falhou"));
    });
    // resolve("feito") cumpre a promessa; reject(erro) falha-a
    await p; // result ==> "feito"
    const f = async () => 5;
    await f(); // result ==> 5
  }
  // nota: uma função async devolve SEMPRE uma Promise, mesmo com return 5. Para ter o 5, faz await f().
  // nota2: await só funciona dentro de uma função async.

  //--------------------------------------------------------------------
  // then() / catch() / finally() - // serve para encadear passos assíncronos, sem async/await.
  {
    const viaThen = await Promise.resolve(2)
      .then((v) => v * 10) //          devolve um valor, o próximo then recebe-o
      .then((v) => sleep(1, v + 1)) // devolve uma Promise, a cadeia espera
      .catch(() => -1) //              só corre se houver erro acima
      .finally(() => {}); //           corre sempre, não muda o valor
    viaThen; // result ==> 21
    await Promise.reject(new Error("x")).catch(() => 7).then((v) => v + 1); // result ==> 8  (o catch transforma o erro em 7)
  }
  // nota: .then((v) => { v * 10 }) com chavetas e sem return passa undefined ao seguinte.

  //--------------------------------------------------------------------
  // try / catch com await - // serve para apanhar o erro de uma chamada assíncrona como se fosse código normal.
  {
    async function rebenta() {
      throw new Error("rebentou");
    }
    let mensagem;
    try {
      await rebenta(); // Promise rejeitada, lança o erro aqui
      assert.fail("não devia chegar aqui");
    } catch (e) {
      mensagem = e.message;
    }
    mensagem; // result ==> "rebentou"
    await assert.rejects(rebenta(), /rebentou/);
  }
  // nota: try { rebenta(); } sem await NÃO apanha nada. O erro chega depois de o try acabar.

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
    [par1, par2]; // result ==> ["a", "b"]  (mesmos valores, metade do tempo)
    tSeq >= 55; // result ==> true  (as esperas somam)
    void tPar; // ≈ 30ms; não é verificado: numa máquina ocupada podia falhar ao acaso
  }
  // nota: três sleep(100) com Promise.all demoram cerca de 100ms. O total é o do mais lento.

  //--------------------------------------------------------------------
  // all() / allSettled() / race() / any() - // serve para escolher como esperar por várias Promises ao mesmo tempo.
  {
    // all: espera por todas, falha à primeira que falhar
    await Promise.all([sleep(20, "lento"), sleep(1, "rápido")]); // result ==> ["lento", "rápido"]  (ordem do array, não de chegada)
    await assert.rejects(Promise.all([sleep(1, 1), Promise.reject(new Error("x"))]), /x/);
    // allSettled: espera por todas e nunca falha, dá um relatório
    const settled = await Promise.allSettled([Promise.resolve(1), Promise.reject(new Error("não"))]);
    settled.map((r) => r.status); // result ==> ["fulfilled", "rejected"]
    settled[0].value; // result ==> 1
    settled[1].reason.message; // result ==> "não"
    // race: fica com a primeira a acabar, mesmo que falhe
    await Promise.race([sleep(20, "lento"), sleep(1, "rápido")]); // result ==> "rápido"
    await assert.rejects(Promise.race([Promise.reject(new Error("x")), sleep(10, "ok")]), /x/);
    // any: ignora as que falham e fica com a primeira que corre bem
    await Promise.any([Promise.reject(new Error()), sleep(1, "ok")]); // result ==> "ok"
    await assert.rejects(Promise.any([Promise.reject(new Error())]), AggregateError);
  }
  // nota: race aceita a primeira a acabar, mesmo rejeitada. any só falha se TODAS falharem (AggregateError).

  //--------------------------------------------------------------------
  // Timeout com race() - // serve para não ficar à espera para sempre de um pedido lento.
  {
    const comTimeout = (promise, ms) =>
      Promise.race([promise, sleep(ms).then(() => { throw new Error("timeout"); })]);
    // corrida entre o trabalho e um temporizador que lança erro
    await assert.rejects(comTimeout(sleep(50), 5), /timeout/); // o temporizador ganha
    await comTimeout(sleep(1, "ok"), 50); // result ==> "ok"  (o trabalho ganha)
  }
  // nota: o trabalho lento NÃO é cancelado. Só deixamos de esperar por ele.

  //--------------------------------------------------------------------
  // await num ciclo - // serve para fazer passos que dependem do anterior, um de cada vez e por ordem.
  {
    const ordem = [];
    for (const ms of [10, 1]) ordem.push(await sleep(ms, ms));
    ordem; // result ==> [10, 1]  (o de 1ms esperou pelo de 10ms)
  }
  // nota: [10, 1].forEach(async (ms) => ...) NÃO espera. Lança os dois, e o de 1ms acabava primeiro.
  // nota2: com Promise.all em vez do ciclo, demorava cerca de 10ms e não 11ms.

  // §24 ── EVENT LOOP ──────────────────────────────────────────────────────

  //--------------------------------------------------------------------
  // Event loop - // serve para prever a ordem de um console.log numa pergunta de entrevista.
  {
    const log = [];
    log.push("sync 1");
    setTimeout(() => log.push("setTimeout"), 0); // macrotarefa
    Promise.resolve().then(() => log.push("then")); // microtarefa
    queueMicrotask(() => log.push("queueMicrotask")); // microtarefa
    log.push("sync 2");
    await sleep(5); // dá tempo ao setTimeout
    log; // result ==> ["sync 1", "sync 2", "then", "queueMicrotask", "setTimeout"]
    /* sync 1            <- 1.º: o código síncrono todo
       sync 2
       then              <- 2.º: TODAS as microtarefas, pela ordem em que entraram
       queueMicrotask
       setTimeout        <- 3.º: UMA macrotarefa, mesmo com 0ms */
  }
  // nota: setTimeout(fn, 0) não corre já. Vai para o fim da fila, depois de todas as microtarefas.
  // nota2: no Node, process.nextTick corre ainda antes das Promises.

  //--------------------------------------------------------------------
  // async até ao primeiro await - // serve para acertar no exercício clássico de entrevista de ordenar letras.
  {
    const q = [];
    const tarefa = async () => {
      q.push("B"); // antes do await, corre logo
      await null;
      q.push("D"); // depois do await, vira microtarefa
    };
    q.push("A");
    setTimeout(() => q.push("F"), 0);
    tarefa();
    Promise.resolve().then(() => q.push("E"));
    q.push("C");
    await sleep(5);
    q.join(""); // result ==> "ABCDEF"
    /* A    <- síncrono
       B    <- tarefa() corre até ao await
       C    <- síncrono
       D    <- microtarefa, entrou primeiro
       E    <- microtarefa, entrou depois
       F    <- macrotarefa, por último */
  }
  // nota: tarefa() não fica toda para depois. Só a parte a seguir ao await é adiada.
  // nota2: se tarefa() fosse chamada DEPOIS do then(E), dava "ABCEDF". O E entrava primeiro na fila.

  // §25 ── TEMPORIZADORES ──────────────────────────────────────────────────

  //--------------------------------------------------------------------
  // setTimeout() / setInterval() - // serve para correr código uma vez daqui a ms, ou de ms em ms até eu mandar parar.
  {
    const corridos = [];
    const idCancelado = setTimeout(() => corridos.push("nunca"), 5);
    clearTimeout(idCancelado); // o id serve para cancelar
    await sleep(10);

    let tick = 0;
    await new Promise((resolve) => {
      const idIntervalo = setInterval(() => {
        tick++;
        if (tick === 3) {
          clearInterval(idIntervalo); // sem isto corria para sempre
          resolve();
        }
      }, 5);
    });
    corridos; // result ==> []  (cancelado, nunca correu)
    tick; // result ==> 3
  }
  // nota: setTimeout corre UMA vez; setInterval repete até clearInterval. ms é uma espera mínima, não exata.
  // nota2: sem o clearInterval o programa nunca acabava, porque o interval mantém o Node vivo.

  //--------------------------------------------------------------------
  // timers/promises - // serve para ter um sleep pronto, sem escrever a Promise à mão.
  {
    const { setTimeout: espera } = require("node:timers/promises");
    await espera(1, "valor"); // result ==> "valor"
    await espera(1); // result ==> undefined  (sem 2.º argumento não há valor)
  }
  // nota: este setTimeout não recebe callback. O global recebe (fn, ms).

  //--------------------------------------------------------------------
  // debounce - // serve para uma caixa de pesquisa só pedir à rede quando a pessoa para de escrever.
  {
    const debounce = (fn, ms) => {
      let id;
      return (...args) => {
        clearTimeout(id); // cada chamada cancela a anterior...
        id = setTimeout(() => fn(...args), ms); // ...e começa outra
      };
    };
    const chamadas = [];
    const pesquisar = debounce((txt) => chamadas.push(txt), 10);
    pesquisar("t");
    pesquisar("ti");
    pesquisar("tia");
    await sleep(30);
    chamadas; // result ==> ["tia"]  (só a última chegou ao fim)
  }
  // nota: com um sleep(20) entre "t" e "ti", ficava ["t", "tia"]. O "t" teve 10ms de pausa e correu.
  // nota2: throttle é diferente. Corre no máximo uma vez por intervalo, em vez de esperar pela pausa.
}

// §26 ── MÓDULOS ─────────────────────────────────────────────────────────────

//--------------------------------------------------------------------
// require / import - // serve para usar num ficheiro a função escrita noutro.
//   CommonJS (Node clássico, .js e .cjs)     ES Modules (browsers; Node com .mjs ou "type": "module")
//   // math.js                               // math.js
//   module.exports = { sum };                export const PI = 3.14;
//                                            export default function sum(a, b) { return a + b; }
//   // app.js                                // app.js
//   const { sum } = require("./math");       import sum, { PI } from "./math.js";  // default sem { }, nomeado com { }
//                                            import * as math from "./math.js";    // tudo num objeto
//   carregar só quando precisas (nos dois):  const mod = await import("./math.js");
{
  typeof module.exports; // result ==> "object"  (este ficheiro é CommonJS)
  typeof require; // result ==> "function"
}
// nota: o default importa-se sem { } e com o nome que quiseres; o nomeado, com { } e o nome exato.
// nota2: em ESM não há require (usa import ou createRequire), a extensão ".js" é obrigatória e há await no topo.

// §27 ── ESTRUTURAS DE DADOS ─────────────────────────────────────────────────
// Listas ligadas, árvores, BST e pesquisa binária estão em 02-LeetCode-Easy.js.

// =============================================================================
main().then(
  () => console.log("✅ Fundamentos OK"),
  (err) => {
    console.error(err);
    process.exitCode = 1;
  }
);
