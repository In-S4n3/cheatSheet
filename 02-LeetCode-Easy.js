// PADRÕES LEETCODE (nível easy) — JavaScript
// Correr: node 02-LeetCode-Easy.js · verificar cada "// result ==>": node check-results.js 02-LeetCode-Easy.js

// ÍNDICE (Ctrl+F "§N")
//   §0 COMO ATACAR UM PROBLEMA
//   §1 ARMADILHAS DE JS QUE CHUMBAM TESTES
//   §2 HASH MAP / SET
//   §3 DOIS PONTEIROS
//   §4 JANELA DESLIZANTE
//   §5 SOMA DE PREFIXOS / KADANE
//   §6 PESQUISA BINÁRIA
//   §7 PILHA
//   §8 LISTA LIGADA
//   §9 ÁRVORES BINÁRIAS
//   §10 MATEMÁTICA / BITS
//   §11 LISTA DE TREINO

// §0 ── COMO ATACAR UM PROBLEMA ──────────
// 1. Ler os exemplos e inventar 1 caso pequeno e 1 caso estranho (vazio, 1 elemento, negativos, repetidos).
// 2. Resolver à mão no papel. O que os olhos fizeram é o algoritmo.
// 3. Escrever primeiro a força bruta (dois for). Depois perguntar:
//      procuro a mesma coisa vezes sem conta?        → Map/Set (§2)
//      o array está ordenado?                        → dois ponteiros (§3) ou pesquisa binária (§6)
//      um pedaço seguido do array/string?            → janela deslizante (§4) ou soma de prefixos (§5)
//      parênteses, desfazer, "o mais recente"?       → pilha (§7)
//      head e .next?                                 → ponteiros prev/slow/fast (§8)
//      root, .left e .right?                         → recursão (§9)
// 4. Testar os meus casos antes de submeter.
// 5. Velocidade (Big O): O(1) arr[i], map.get · O(log n) pesquisa binária · O(n) um ciclo · O(n log n) sort · O(n²) ciclo dentro de ciclo.
// Nota: includes(), indexOf(), shift(), splice() são O(n) — dentro de um ciclo tornam tudo O(n²).

// §1 ── ARMADILHAS DE JS QUE CHUMBAM TESTES ──────────

//--------------------------------------------------------------------
// sort() — ordenar um array de números
// Para que serve: pôr [10, 1, 2] do menor para o maior antes de usar dois ponteiros.
// Regra essencial: sem função, sort() compara como TEXTO ("10" < "2"). Dar sempre (a, b) => a - b.
// O que guarda: a função devolve um número; negativo = a fica antes, positivo = b fica antes.

[10, 1, 2].sort(); // result ==> [1, 10, 2]  (errado: comparou como texto)
[10, 1, 2].sort((a, b) => a - b); // result ==> [1, 2, 10]  (menor → maior)
[10, 1, 2].sort((a, b) => b - a); // result ==> [10, 2, 1]  (maior → menor)
const orig = [3, 1, 2];
const copy = orig.toSorted((a, b) => a - b);

// Antes → operação → depois
//   operação             original depois   devolve
//   orig.sort(f)         ordenado          o mesmo array
//   orig.toSorted(f)     igual             um array novo
orig; // result ==> [3, 1, 2]  (toSorted não mexeu no original)
copy; // result ==> [1, 2, 3]

// Confusão possível: sort() vs toSorted() — sort() altera o original; toSorted() devolve uma cópia ordenada.
// Para recordar: números ordenam-se com (a, b) => a - b.
// Ver: 01 §11 · arrow function → 01 §16
// Pergunta: quanto dá [5, 25, 100].sort()?
// Resposta: [100, 25, 5]. Como texto, "1" < "2" < "5", por isso "100" vem primeiro.

//--------------------------------------------------------------------
// Math.floor() — cortar as casas decimais de uma divisão
// Para que serve: calcular o índice do meio, Math.floor((l + r) / 2), na pesquisa binária.
// Regra essencial: JS não tem divisão inteira; 7 / 2 dá 3.5. floor arredonda para baixo, trunc corta para o zero.
// O que guarda: nada; devolve um número inteiro.

7 / 2; // result ==> 3.5
Math.floor(7 / 2); // result ==> 3
Math.trunc(-7 / 2); // result ==> -3  (Math.floor daria -4)

// Antes → operação → depois
//   valor    Math.floor   Math.trunc
//   3.5      3            3
//   -3.5     -4           -3
// Confusão possível: floor vs trunc — só diferem nos negativos (floor desce, trunc vai para o zero).
// Para recordar: divisão inteira = Math.floor(a / b).
// Ver: 01 §8
// Pergunta: quanto dá Math.floor(9 / 4)?
// Resposta: 2. 9 / 4 = 2.25 e floor tira as casas decimais.

//--------------------------------------------------------------------
// split("") — transformar a string em array para trocar letras
// Para que serve: substituir a primeira letra de "abc".
// Regra essencial: strings não se alteram; s[0] = "x" não faz nada e não dá erro. Passar a array, mudar, juntar.
// O que guarda: s = string original; arr = uma letra por posição.

const s = "abc";
const arr = s.split(""); // ou [...s]
arr[0] = "x";

// Antes → operação → depois
//   passo          valor
//   s.split("")    ["a", "b", "c"]
//   arr[0] = "x"   ["x", "b", "c"]
//   arr.join("")   "xbc"
arr.join(""); // result ==> "xbc"
s; // result ==> "abc"  (o original não mudou)

// Confusão possível: join("") vs join() — join() sem argumento põe vírgulas: "x,b,c".
// Para recordar: string → array → mudar → join("").
// Ver: split / join → 01 §7 · spread [...s] → 01 §13
// Pergunta: depois de const t = "oi"; t[0] = "a"; quanto vale t?
// Resposta: "oi". Strings não se alteram; a atribuição é ignorada em silêncio.

//--------------------------------------------------------------------
// === em arrays — compara se é o MESMO array, não o mesmo conteúdo
// Para que serve: perceber porque é que comparar dois resultados [1, 2] dá false.
// Regra essencial: arrays comparam por referência. Para comparar conteúdo, join() os dois e comparar o texto.
// O que guarda: nada; devolve true/false.

[1, 2] === [1, 2]; // result ==> false  (dois arrays diferentes na memória)
[1, 2].join() === [1, 2].join(); // result ==> true  ("1,2" === "1,2")

// Antes → operação → depois
//   expressão            compara           resultado
//   [1,2] === [1,2]      referências       false
//   "1,2" === "1,2"      texto             true
// Confusão possível: === em números/strings compara o valor; em arrays/objetos compara a referência.
// Para recordar: arrays: === pergunta "é o mesmo?", não "é igual?".
// Ver: === → 01 §3 · join → 01 §7 · referências → 01 §15
// Pergunta: const a = [1]; const b = a; quanto dá a === b?
// Resposta: true. b aponta para o mesmo array que a.

//--------------------------------------------------------------------
// Infinity — valor inicial ao procurar o menor
// Para que serve: encontrar o mínimo de [5, 3, 8] sem saber de antemão os valores.
// Regra essencial: começar com Infinity para o mínimo (qualquer número é menor) e -Infinity para o máximo.
// O que guarda: min = o menor número visto até agora.

let min = Infinity;
for (const n of [5, 3, 8]) min = Math.min(min, n);

// Antes → operação → depois (uma linha por iteração)
//   iteração   n    min antes   min depois
//   1          5    Infinity    5
//   2          3    5           3
//   3          8    3           3
min; // result ==> 3

// Confusão possível: começar com 0 — com min = 0, o mínimo de [5, 3, 8] ficaria 0, que nem está no array.
// Para recordar: mínimo começa em Infinity, máximo em -Infinity.
// Ver: Infinity / Math.min → 01 §8 · for...of → 01 §6
// Pergunta: com let max = -Infinity e o mesmo ciclo usando Math.max, quanto vale max?
// Resposta: 8. Qualquer número é maior que -Infinity, e 8 é o maior.

//--------------------------------------------------------------------
// Array.from() — criar uma matriz de zeros
// Para que serve: criar uma grelha 2 × 3 para programação dinâmica.
// Regra essencial: Array.from chama a função uma vez por linha, logo cada linha é um array NOVO.
// O que guarda: matrix = array de 2 linhas; cada linha = array de 3 zeros.

const matrix = Array.from({ length: 2 }, () => new Array(3).fill(0));
matrix[0][0] = 1;
matrix; // result ==> [[1, 0, 0], [0, 0, 0]]  (só a primeira linha mudou)

const bad = new Array(2).fill([]); // as 2 posições apontam para o MESMO []
bad[0].push(1);

// Antes → operação → depois
//   criação               bad[0] === bad[1]   depois de mudar a linha 0
//   Array.from(..., fn)   false               só a linha 0 muda
//   fill([])              true                as duas linhas mudam
bad; // result ==> [[1], [1]]

// Confusão possível: fill(0) vs fill([]) — com 0 não há problema (número); com [] todas as posições partilham o mesmo array.
// Para recordar: matriz = Array.from({ length }, () => linha nova).
// Ver: Array.from / fill → 01 §9
// Pergunta: em matrix, depois de matrix[1][2] = 5, quanto vale matrix[0][2]?
// Resposta: 0. Cada linha é um array separado, por isso só a linha 1 mudou.

//--------------------------------------------------------------------
// at(-1) — ler o último elemento
// Para que serve: ver o topo de uma pilha sem a alterar.
// Regra essencial: índices negativos contam do fim; -1 é o último. arr[-1] dá undefined.
// O que guarda: nada; só lê.

[1, 2, 3].at(-1); // result ==> 3

// Antes → operação → depois
//   chamada    devolve
//   at(0)      1
//   at(-1)     3
//   at(-2)     2
// Confusão possível: at(-1) vs [-1] — arr[-1] procura uma propriedade "-1" e dá undefined.
// Para recordar: último = at(-1).
// Ver: 01 §10 (arrays) e 01 §7 (strings)
// Pergunta: quanto dá "abc".at(-1)?
// Resposta: "c". at() também funciona em strings.

//--------------------------------------------------------------------
// charCodeAt() — letra para número e de volta
// Para que serve: contar letras num array de 26 posições (a = 0 … z = 25).
// Regra essencial: código da letra menos o código de "a" dá a posição no alfabeto.
// O que guarda: nada; devolve um número (charCodeAt) ou uma letra (fromCharCode).

"a".charCodeAt(0); // result ==> 97
String.fromCharCode(98); // result ==> "b"
"c".charCodeAt(0) - "a".charCodeAt(0); // result ==> 2  (a = 0, b = 1, c = 2)

// Antes → operação → depois
//   letra   charCodeAt(0)   - 97   posição
//   "a"     97              0      0
//   "c"     99              2      2
// Confusão possível: charCodeAt(0) vs charCodeAt() — o argumento é o índice da letra na string; para uma letra é 0.
// Para recordar: posição = código − código de "a".
// Ver: 01 §7
// Pergunta: quanto dá "z".charCodeAt(0) - "a".charCodeAt(0)?
// Resposta: 25. "z" é a 26.ª letra e a contagem começa em 0.

//--------------------------------------------------------------------
// Dígitos de um número — tirar um dígito de cada vez
// Para que serve: somar os dígitos de 1234 sem passar a string.
// Regra essencial: num % 10 dá o último dígito; Math.floor(num / 10) apaga-o.
// O que guarda: num = o que falta processar; digitSum = soma dos dígitos já tirados.

String(1234).split("").map(Number); // result ==> [1, 2, 3, 4]  (versão com string)
let num = 1234, digitSum = 0;
while (num > 0) {
  digitSum += num % 10; // último dígito
  num = Math.floor(num / 10); // apagar o último dígito
}

// Antes → operação → depois (uma linha por iteração)
//   iteração   num antes   num % 10   digitSum   num depois
//   1          1234        4          4          123
//   2          123         3          7          12
//   3          12          2          9          1
digitSum; // result ==> 10  (1 + 2 + 3 + 4)

// Confusão possível: % 10 vs / 10 — % dá o resto (o dígito); / divide (precisa de floor para apagar o dígito).
// Para recordar: % 10 lê, floor(/ 10) apaga.
// Ver: split → 01 §7 · map(Number) → 01 §8 · % e += → 01 §3 · while → 01 §6
// Pergunta: com num = 907, qual é o primeiro valor de num % 10 e o primeiro num depois?
// Resposta: 7 e 90. 907 % 10 = 7 e Math.floor(90.7) = 90.

// §2 ── HASH MAP / SET ──────────

//--------------------------------------------------------------------
// Contar com um Map — quantas vezes aparece cada coisa
// Para que serve: o problema pergunta "já vi isto?" ou "quantas vezes?".
// Regra essencial: o Map não soma. O código lê a contagem anterior, soma 1 e guarda com set(). Cada get/set é O(1).
// O que guarda: freq é um Map; chave = elemento (uma letra); valor = quantas vezes já apareceu.

function count(items) {
  const freq = new Map();
  for (const x of items) {
    const anterior = freq.get(x) ?? 0; // 1. ler (0 se ainda não existe)
    freq.set(x, anterior + 1); //         2. somar e guardar
  }
  return freq; // devolve o Map inteiro, depois de ver todos os elementos
}

// Antes → operação → depois (count("banana"), primeiras iterações)
//   iteração   x     anterior   Map depois
//   1          "b"   0          b → 1
//   2          "a"   0          b → 1, a → 1
//   3          "n"   0          b → 1, a → 1, n → 1
//   ...        (no fim: b → 1, a → 3, n → 2)
count("banana").get("a"); // result ==> 3
count("banana").size; // result ==> 3  (3 letras diferentes)

// Versão compacta: freq.set(x, (freq.get(x) ?? 0) + 1);
// Confusão possível: Map vs objeto {} — o Map aceita qualquer tipo de chave e tem .size; num objeto as chaves viram texto.
// Para recordar: contar = ler → somar 1 → set().
// Ver: Map get/set → 01 §14 · for...of → 01 §6 · ?? → 01 §3
// Pergunta: quanto dá count("banana").get("z")?
// Resposta: undefined. "z" nunca foi guardado; o ?? 0 só existe dentro da função.

//--------------------------------------------------------------------
// Two Sum (LC 1) — os 2 números que somam target
// Para que serve: encontrar o par que soma 9 sem testar todos os pares.
// Regra essencial: para cada número, perguntar ao Map se o complemento (target − número) já passou.
// O que guarda: seen é um Map; chave = número já visto; valor = índice desse número.

function twoSum(nums, target) {
  const seen = new Map();
  for (let i = 0; i < nums.length; i++) {
    const needed = target - nums[i];
    if (seen.has(needed)) return [seen.get(needed), i]; // return termina já a função
    seen.set(nums[i], i); // só guarda DEPOIS de perguntar, para não usar o mesmo número duas vezes
  }
  return []; // só chega aqui se nenhum par existir
}

// Antes → operação → depois (twoSum([2, 7, 11, 15], 9))
//   i   nums[i]   needed   seen tem needed?   seen depois
//   0   2         7        não                2 → 0
//   1   7         2        sim (índice 0)     — devolve [0, 1]
twoSum([2, 7, 11, 15], 9); // result ==> [0, 1]  (2 + 7 = 9)
twoSum([3, 3], 6); // result ==> [0, 1]

// Confusão possível: chave = número vs chave = índice — procuramos pelo VALOR, por isso o valor é a chave e o índice é o valor guardado.
// Para recordar: perguntar primeiro, guardar depois.
// Ver: Map has/get/set → 01 §14
// Pergunta: quanto dá twoSum([3, 2, 4], 6)?
// Resposta: [1, 2]. Em i = 0 precisa de 3 mas o Map está vazio; em i = 2 precisa de 2, que está no índice 1.

//--------------------------------------------------------------------
// Contains Duplicate (LC 217) — algum número repete?
// Para que serve: saber se [1, 2, 3, 1] tem repetidos.
// Regra essencial: um Set guarda cada valor uma só vez; se ficar mais pequeno que o array, havia repetidos.
// O que guarda: unique = Set com os valores sem repetição.

function containsDuplicate(nums) {
  const unique = new Set(nums); // 1. tirar repetidos
  return unique.size !== nums.length; // 2. comparar tamanhos
}

// Antes → operação → depois
//   nums           Set          size   length   devolve
//   [1, 2, 3, 1]   {1, 2, 3}    3      4        true
//   [1, 2, 3]      {1, 2, 3}    3      3        false
containsDuplicate([1, 2, 3, 1]); // result ==> true
containsDuplicate([1, 2, 3]); // result ==> false

// Versão compacta: const containsDuplicate = (nums) => new Set(nums).size !== nums.length;
// Confusão possível: Set.size vs array.length — size é do Set, length é do array; um Set não tem length.
// Para recordar: Set menor que o array = há repetidos.
// Ver: Set e .size → 01 §14
// Pergunta: quanto dá containsDuplicate([])?
// Resposta: false. Set vazio tem size 0 e o array tem length 0.

//--------------------------------------------------------------------
// Valid Anagram (LC 242) — as duas palavras têm as mesmas letras?
// Para que serve: "anagram" e "nagaram" usam exatamente as mesmas letras.
// Regra essencial: contar as letras da primeira palavra e descontar as da segunda; se faltar uma letra, não é anagrama.
// O que guarda: freq é um Map; chave = letra; valor = quantas dessa letra ainda sobram da palavra a.

function isAnagram(a, b) {
  if (a.length !== b.length) return false; // tamanhos diferentes: termina já
  const freq = count(a);
  for (const ch of b) {
    if (!freq.get(ch)) return false; // undefined (nunca existiu) ou 0 (já gasta)
    freq.set(ch, freq.get(ch) - 1);
  }
  return true; // gastou todas as letras sem faltar nenhuma
}

// Antes → operação → depois (b = "nagaram"; freq começa a → 3, n → 1, g → 1, r → 1, m → 1)
//   iteração   ch    freq.get(ch)   freq depois
//   1          "n"   1              n → 0
//   2          "a"   3              a → 2
//   3          "g"   1              g → 0
isAnagram("anagram", "nagaram"); // result ==> true
isAnagram("rat", "car"); // result ==> false  ("c" não existe em freq)

// Confusão possível: !freq.get(ch) apanha os dois casos: undefined (letra nova) e 0 (letra já toda usada).
// Para recordar: contar a, descontar b.
// Ver: Map get/set → 01 §14 · ! em undefined/0 → 01 §4
// Pergunta: quanto dá isAnagram("aab", "abb")?
// Resposta: false. freq começa a → 2, b → 1; o segundo "b" encontra b → 0.

//--------------------------------------------------------------------
// First Unique Character (LC 387) — a primeira letra que aparece uma só vez
// Para que serve: devolver o índice da primeira letra sem repetição.
// Regra essencial: duas passagens. 1.ª conta tudo; 2.ª anda pela ordem original e pára na primeira contagem 1.
// O que guarda: freq é um Map; chave = letra; valor = total de vezes na string inteira.

function firstUniqChar(s) {
  const freq = count(s);
  for (let i = 0; i < s.length; i++) {
    if (freq.get(s[i]) === 1) return i; // return termina no primeiro que encontrar
  }
  return -1; // nenhuma letra única
}

// Antes → operação → depois (s = "aabc"; freq = a → 2, b → 1, c → 1)
//   i   s[i]   freq.get   ação
//   0   "a"    2          continua
//   1   "a"    2          continua
//   2   "b"    1          devolve 2
firstUniqChar("aabc"); // result ==> 2
firstUniqChar("leetcode"); // result ==> 0  (o "l")
firstUniqChar("aabb"); // result ==> -1  (nenhuma)

// Confusão possível: percorrer o Map vs percorrer a string — a 2.ª passagem é na string, porque a resposta é a ordem original.
// Para recordar: contar tudo, depois procurar pela ordem.
// Ver: Map get → 01 §14 · s[i] → 01 §7
// Pergunta: quanto dá firstUniqChar("abab")?
// Resposta: -1. a e b aparecem 2 vezes cada.

//--------------------------------------------------------------------
// Group Anagrams (LC 49) — juntar palavras com as mesmas letras
// Para que serve: ["eat", "tea", "tan", "nat"] → [["eat", "tea"], ["tan", "nat"]].
// Regra essencial: anagramas ordenados dão a mesma string; essa string é a chave do Map.
// O que guarda: groups é um Map; chave = letras ordenadas ("aet"); valor = array das palavras com essas letras.

function groupAnagrams(words) {
  const groups = new Map();
  for (const w of words) {
    const letters = [...w]; //       1. palavra → array de letras
    letters.sort(); //               2. ordenar (texto: aqui o sort sem função está certo)
    const key = letters.join(""); // 3. voltar a string
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key).push(w);
  }
  return [...groups.values()]; // devolve só os arrays, sem as chaves
}

// Antes → operação → depois (uma linha por iteração)
//   w       key     groups depois
//   "eat"   "aet"   aet → [eat]
//   "tea"   "aet"   aet → [eat, tea]
//   "tan"   "ant"   aet → [eat, tea], ant → [tan]
groupAnagrams(["eat", "tea", "tan", "nat"]); // result ==> [["eat", "tea"], ["tan", "nat"]]

// Versão compacta da chave: const key = [...w].sort().join("");
// Confusão possível: groups.get(key).push(w) não precisa de set() — push altera o array que já está guardado no Map.
// Para recordar: chave = letras ordenadas.
// Ver: Map has/get/set/values → 01 §14 · spread → 01 §13 · sort → 01 §11
// Pergunta: que chave tem a palavra "nat"?
// Resposta: "ant". As letras n, a, t ordenadas dão a, n, t.

//--------------------------------------------------------------------
// Roman to Integer (LC 13) — "MCMXCIV" → 1994
// Para que serve: converter um número romano em número normal.
// Regra essencial: normalmente soma-se cada letra. Mas se uma letra vale MENOS do que a seguinte, subtrai-se (IV = 5 − 1 = 4).
// O que guarda: VALUE é um Map; chave = letra romana; valor = quanto vale. total = soma até agora.

const VALUE = new Map([["I", 1], ["V", 5], ["X", 10], ["L", 50], ["C", 100], ["D", 500], ["M", 1000]]);

function romanToInt(s) {
  let total = 0;
  for (let i = 0; i < s.length; i++) {
    const cur = VALUE.get(s[i]); //       1. valor desta letra
    const next = VALUE.get(s[i + 1]); //  2. valor da seguinte (undefined na última letra)
    if (cur < next) total -= cur; //      3a. menor do que a seguinte → subtrai
    else total += cur; //                 3b. senão → soma
  }
  return total; // só devolve depois de ver todas as letras
}

// Antes → operação → depois (s = "MCM")
//   i   letra   cur    next   operação   total depois
//   0   M       1000   100    soma       1000
//   1   C       100    1000   subtrai    900
//   2   M       1000   —      soma       1900
romanToInt("III"); // result ==> 3
romanToInt("LVIII"); // result ==> 58
romanToInt("MCMXCIV"); // result ==> 1994

// Confusão possível: na última letra next é undefined, e 1000 < undefined dá false → soma. Funciona, mas por acidente; podes escrever (next ?? 0) para ficar explícito.
// Para recordar: menor antes de maior → subtrai.
// Ver: Map get → 01 §14
// Pergunta: quanto dá romanToInt("XIV")?
// Resposta: 14. X soma 10, I (1 < 5) subtrai 1 → 9, V soma 5 → 14.

//--------------------------------------------------------------------
// Integer to Roman (LC 12, Medium) — 1994 → "MCMXCIV"
// Para que serve: o caminho inverso, número → romano.
// Regra essencial: guloso. Usa sempre o MAIOR valor que ainda cabe, e inclui os pares de subtração (900 CM, 400 CD, 90 XC, 40 XL, 9 IX, 4 IV) na tabela.
// O que guarda: TABLE = pares [valor, símbolo] do maior para o menor; out = romano construído até agora; num = o que ainda falta converter.

const TABLE = [[1000, "M"], [900, "CM"], [500, "D"], [400, "CD"], [100, "C"], [90, "XC"],
  [50, "L"], [40, "XL"], [10, "X"], [9, "IX"], [5, "V"], [4, "IV"], [1, "I"]];

function intToRoman(num) {
  let out = "";
  for (const [value, symbol] of TABLE) {
    while (num >= value) { // enquanto cabe, usa-o outra vez
      out += symbol;
      num -= value;
    }
  }
  return out;
}

// Antes → operação → depois (num = 1994)
//   cabe   out depois   num depois
//   1000   "M"          994
//   900    "MCM"        94
//   90     "MCMXC"      4
//   4      "MCMXCIV"    0
intToRoman(3); // result ==> "III"
intToRoman(58); // result ==> "LVIII"
intToRoman(1994); // result ==> "MCMXCIV"

// Confusão possível: sem 900/400/90/40/9/4 na tabela, 4 sairia "IIII" em vez de "IV".
// Para recordar: maior que cabe, repete, desce.
// Pergunta: quanto dá intToRoman(44)?
// Resposta: "XLIV". 40 cabe → "XL", falta 4; 4 cabe → "IV".

// §3 ── DOIS PONTEIROS ──────────

//--------------------------------------------------------------------
// Dois ponteiros — dois índices que andam pelo mesmo array
// Para que serve: array ordenado, palíndromos, alterar o array no sítio sem cópia.
// Regra essencial: há duas formas.
//   Pontas opostas: l no início, r no fim, aproximam-se até se cruzarem (palíndromo, inverter).
//   Mesmo sentido: read lê tudo, write só avança quando guarda algo (remover repetidos, zeros).
// O que guarda: l / r = posições das duas pontas; read / write = posição a ler e posição onde escrever.

//   let l = 0, r = arr.length - 1;
//   while (l < r) { ...; l++; r--; }

// Antes → operação → depois (array de 5 elementos, pontas opostas)
//   iteração   l   r   l < r?
//   1          0   4   sim
//   2          1   3   sim
//   3          2   2   não, pára (o do meio fica)
// Confusão possível: while (l < r) vs while (l <= r) — com < o elemento do meio não é comparado consigo próprio; <= é da pesquisa binária (§6).
// Para recordar: pontas opostas fecham; read/write andam juntos.
// Pergunta: num array de 4 elementos, quantas vezes corre while (l < r) com l++ e r--?
// Resposta: 2. (0, 3) e (1, 2); depois l = 2, r = 1 e pára.

//--------------------------------------------------------------------
// Valid Palindrome (LC 125) — a frase lê-se igual nos dois sentidos?
// Para que serve: "A man, a plan, a canal: Panama" é palíndromo ignorando espaços e pontuação.
// Regra essencial: primeiro limpar (minúsculas, só letras e números), depois comparar as pontas e fechar.
// O que guarda: clean = frase limpa; l = índice da esquerda; r = índice da direita.

function isPalindrome(s) {
  const lower = s.toLowerCase(); //                1. minúsculas
  const clean = lower.replace(/[^a-z0-9]/g, ""); // 2. apagar o que não é letra/número
  let l = 0, r = clean.length - 1;
  while (l < r) {
    if (clean[l] !== clean[r]) return false; // uma diferença basta: termina já
    l++;
    r--;
  }
  return true; // as pontas cruzaram sem diferenças
}

// Antes → operação → depois ("race a car" → clean = "raceacar")
//   l   r   clean[l]   clean[r]   ação
//   0   7   "r"        "r"        avança
//   1   6   "a"        "a"        avança
//   3   4   "e"        "a"        devolve false   (l = 2, r = 5 era "c" e "c")
isPalindrome("A man, a plan, a canal: Panama"); // result ==> true
isPalindrome("race a car"); // result ==> false

// Versão compacta: const clean = s.toLowerCase().replace(/[^a-z0-9]/g, "");
// Confusão possível: reverse vs dois ponteiros — clean === [...clean].reverse().join("") também funciona, mas cria cópias (memória O(n)).
// Para recordar: limpar, comparar pontas, fechar.
// Ver: toLowerCase / replace → 01 §7 · regex → 01 §22
// Pergunta: quanto dá isPalindrome(".,")?
// Resposta: true. clean fica "" e o while nem corre (l = 0, r = -1).

//--------------------------------------------------------------------
// Reverse String (LC 344) — inverter um array de letras no sítio
// Para que serve: o enunciado proíbe criar outro array.
// Regra essencial: trocar as duas pontas com [a, b] = [b, a] e fechar até se cruzarem.
// O que guarda: chars = o próprio array (é alterado); l e r = pontas a trocar.

function reverseString(chars) {
  let l = 0, r = chars.length - 1;
  while (l < r) {
    [chars[l], chars[r]] = [chars[r], chars[l]];
    l++;
    r--;
  }
  return chars; // devolve o mesmo array, já alterado
}

const letters = ["h", "e", "l", "l", "o"];
reverseString(letters);

// Antes → operação → depois
//   l   r   troca          letters depois
//   0   4   "h" ↔ "o"      o e l l h
//   1   3   "e" ↔ "l"      o l l e h
//   2   2   (pára)         o l l e h
letters; // result ==> ["o", "l", "l", "e", "h"]

// Confusão possível: reverse() vs toReversed() — reverse() altera o original (aqui serviria); toReversed() cria cópia.
// Para recordar: trocar pontas, fechar.
// Ver: troca [a, b] = [b, a] → 01 §13
// Pergunta: quantas trocas faz reverseString(["a", "b"])?
// Resposta: 1. l = 0, r = 1 troca; depois l = 1, r = 0 e pára.

//--------------------------------------------------------------------
// Remove Duplicates from Sorted Array (LC 26) — cada número uma vez, à frente
// Para que serve: compactar [0, 0, 1, 1, 1, 2, 2, 3] sem array extra.
// Regra essencial: read lê todos; write só avança quando aparece um número diferente do último escrito.
// O que guarda: read = índice a ler; write = onde escrever o próximo único = quantos únicos já há.

function removeDuplicates(nums) {
  if (nums.length === 0) return 0;
  let write = 1; // nums[0] já é único
  for (let read = 1; read < nums.length; read++) {
    if (nums[read] !== nums[write - 1]) {
      nums[write] = nums[read];
      write++;
    }
  }
  return write; // devolve a contagem; os únicos estão em nums[0 .. write - 1]
}

const dups = [0, 0, 1, 1, 1, 2, 2, 3];

// Antes → operação → depois (primeiras iterações)
//   read   nums[read]   último escrito   ação                    write depois
//   1      0            0                igual, salta            1
//   2      1            0                nums[1] = 1             2
//   3      1            1                igual, salta            2
removeDuplicates(dups); // result ==> 4  (quantos únicos)
dups.slice(0, 4); // result ==> [0, 1, 2, 3]

// Confusão possível: o que devolve vs o que muda — devolve um número (4); o array muda no sítio e o resto (depois do índice 3) é lixo.
// Para recordar: read lê tudo, write só escreve novidades.
// Ver: for → 01 §6 · slice → 01 §10
// Pergunta: quanto devolve removeDuplicates([1, 1, 1])?
// Resposta: 1. Só nums[0] é único; read nunca encontra um valor diferente.

//--------------------------------------------------------------------
// Move Zeroes (LC 283) — todos os 0 para o fim
// Para que serve: [0, 1, 0, 3, 12] → [1, 3, 12, 0, 0], mantendo a ordem dos outros.
// Regra essencial: o mesmo read/write: copiar os não-zeros para a frente; depois encher o resto com 0.
// O que guarda: write = próxima posição livre à frente = quantos não-zeros já foram copiados.

function moveZeroes(nums) {
  let write = 0;
  for (const n of nums) {
    if (n !== 0) {
      nums[write] = n; // 1. escrever
      write++; //         2. avançar
    }
  }
  while (write < nums.length) nums[write++] = 0; // encher o fim com zeros
  return nums;
}

const nums = [0, 1, 0, 3, 12];
moveZeroes(nums);

// Antes → operação → depois (primeiras iterações do for)
//   n    ação           write depois   nums depois
//   0    salta          0              0 1 0 3 12
//   1    nums[0] = 1    1              1 1 0 3 12
//   0    salta          1              1 1 0 3 12
nums; // result ==> [1, 3, 12, 0, 0]

// Versão compacta: if (n !== 0) nums[write++] = n;  (write++ usa o valor antigo e só depois soma 1)
// Confusão possível: write++ vs ++write — nums[write++] escreve em write e depois avança; nums[++write] avançaria primeiro.
// Para recordar: copiar não-zeros, encher com zeros.
// Ver: write++ → 01 §3
// Pergunta: que valor tem write logo antes do while, para [0, 1, 0, 3, 12]?
// Resposta: 3. Foram copiados três não-zeros: 1, 3 e 12.

//--------------------------------------------------------------------
// Merge Sorted Array (LC 88) — juntar dois arrays ordenados dentro do primeiro
// Para que serve: nums1 tem espaço livre (zeros) no fim para caber nums2.
// Regra essencial: encher de TRÁS para a frente com o maior dos dois; assim nada por ler é apagado.
// O que guarda: i = último real de nums1; j = último de nums2; k = posição a escrever em nums1.

function merge(nums1, m, nums2, n) {
  let i = m - 1, j = n - 1, k = m + n - 1;
  while (j >= 0) {
    if (i >= 0 && nums1[i] > nums2[j]) {
      nums1[k] = nums1[i]; // 1. escrever o maior
      i--; //                 2. recuar o que foi usado
    } else {
      nums1[k] = nums2[j];
      j--;
    }
    k--; //                   3. recuar a escrita
  }
  return nums1;
}

const nums1 = [1, 2, 3, 0, 0, 0];
merge(nums1, 3, [2, 5, 6], 3);

// Antes → operação → depois
//   i   j   k   compara        escreve        nums1 depois
//   2   2   5   3 vs 6         nums1[5] = 6   1 2 3 0 0 6
//   2   1   4   3 vs 5         nums1[4] = 5   1 2 3 0 5 6
//   2   0   3   3 vs 2         nums1[3] = 3   1 2 3 3 5 6
nums1; // result ==> [1, 2, 2, 3, 5, 6]

// Versão compacta: if (...) nums1[k--] = nums1[i--]; else nums1[k--] = nums2[j--];
// Confusão possível: while (j >= 0) vs while (i >= 0) — quando nums2 acaba, o que resta de nums1 já está no sítio certo.
// Para recordar: encher por trás com o maior.
// Ver: while → 01 §6 · && e k-- → 01 §3
// Pergunta: na 4.ª iteração (i = 1, j = 0, k = 2), o que é escrito em nums1[2]?
// Resposta: 2 de nums2. nums1[1] = 2 não é > 2, por isso vai o else.

// §4 ── JANELA DESLIZANTE ──────────

//--------------------------------------------------------------------
// Janela deslizante — um pedaço seguido que cresce à direita e encolhe à esquerda
// Para que serve: "o pedaço seguido mais longo/curto que …" num array ou string.
// Regra essencial: r avança sempre (uma vez por iteração); l só avança enquanto a janela está inválida.
// O que guarda: l = início da janela; r = fim; tamanho = r − l + 1.

//   let l = 0;
//   for (let r = 0; r < s.length; r++) {
//     junta s[r];
//     while (janela inválida) tira s[l++];
//     best = Math.max(best, r - l + 1);
//   }

// Antes → operação → depois
//   l   r   tamanho (r − l + 1)
//   0   0   1
//   0   2   3
//   1   3   3
// Confusão possível: janela vs dois ponteiros de pontas opostas — na janela l e r andam os dois para a direita.
// Para recordar: r cresce sempre, l encolhe quando precisa.
// Pergunta: com l = 2 e r = 5, quantos elementos tem a janela?
// Resposta: 4. r − l + 1 = 5 − 2 + 1 (os índices 2, 3, 4 e 5).

//--------------------------------------------------------------------
// Best Time to Buy and Sell Stock (LC 121) — o melhor lucro comprar-depois-vender
// Para que serve: comprar num dia e vender num dia seguinte com o maior lucro.
// Regra essencial: lembrar o dia mais barato até agora; em cada dia, o lucro é preço − mais barato.
// O que guarda: lowest = preço mínimo visto até hoje; best = maior lucro encontrado.

function maxProfit(prices) {
  let lowest = Infinity, best = 0;
  for (const p of prices) {
    lowest = Math.min(lowest, p);
    best = Math.max(best, p - lowest);
  }
  return best;
}

// Antes → operação → depois (prices = [7, 1, 5, 3, 6, 4], primeiras iterações)
//   p   lowest depois   p − lowest   best depois
//   7   7               0            0
//   1   1               0            0
//   5   1               4            4
maxProfit([7, 1, 5, 3, 6, 4]); // result ==> 5  (compra a 1, vende a 6)
maxProfit([7, 6, 4, 3, 1]); // result ==> 0  (só desce)

// Confusão possível: não é bem uma janela — não há l a encolher, só o "mínimo até agora". Fica aqui porque é a mesma ideia de varrer uma vez.
// Para recordar: mais barato até agora, lucro de hoje.
// Ver: Infinity / Math.min / Math.max → 01 §8
// Pergunta: quanto dá maxProfit([2, 4, 1])?
// Resposta: 2. Comprar a 2 e vender a 4; o 1 vem depois e já não tem dia para vender.

//--------------------------------------------------------------------
// Janela fixa de tamanho k — a melhor soma de k números seguidos
// Para que serve: o maior total de 4 dias seguidos.
// Regra essencial: não somar tudo outra vez; somar o que entra e subtrair o que sai.
// O que guarda: sum = soma da janela atual (k números); best = maior soma vista.

function maxSumK(nums, k) {
  let sum = 0;
  for (let i = 0; i < k; i++) sum += nums[i]; // primeira janela
  let best = sum;
  for (let i = k; i < nums.length; i++) {
    const entra = nums[i];
    const sai = nums[i - k];
    sum = sum + entra - sai;
    best = Math.max(best, sum);
  }
  return best;
}

// Antes → operação → depois (nums = [1, 12, -5, -6, 50, 3], k = 4)
//   i       entra   sai   sum depois   best depois
//   (0-3)   —       —     2            2
//   4       50      1     51           51
//   5       3       12    42           51
maxSumK([1, 12, -5, -6, 50, 3], 4); // result ==> 51  (12 - 5 - 6 + 50)

// Versão compacta: sum += nums[i] - nums[i - k];
// Confusão possível: nums[i - k] vs nums[i - k + 1] — o que sai é o que está k posições atrás do que entra.
// Para recordar: entra um, sai um.
// Ver: += → 01 §3 · Math.max → 01 §8
// Pergunta: quanto dá maxSumK([1, 2, 3], 2)?
// Resposta: 5. Janelas: 1 + 2 = 3, depois 3 + 3 − 1 = 5.

//--------------------------------------------------------------------
// Longest Substring Without Repeating Characters (LC 3) — o maior pedaço sem letras repetidas
// Para que serve: o molde da janela de tamanho variável (é medium, mas é O molde).
// Regra essencial: antes de juntar s[r], tirar da esquerda até s[r] deixar de estar repetido.
// O que guarda: inWindow = Set com as letras da janela; l = início; best = maior tamanho visto.

function lengthOfLongestSubstring(s) {
  const inWindow = new Set();
  let l = 0, best = 0;
  for (let r = 0; r < s.length; r++) {
    while (inWindow.has(s[r])) {
      inWindow.delete(s[l]); // 1. tirar a letra da esquerda
      l++; //                   2. encolher
    }
    inWindow.add(s[r]);
    best = Math.max(best, r - l + 1);
  }
  return best;
}

// Antes → operação → depois (s = "abcabcbb")
//   r   s[r]   tira        l depois   Set depois   best
//   1   "b"    —           0          {a, b}       2
//   2   "c"    —           0          {a, b, c}    3
//   3   "a"    "a"         1          {b, c, a}    3
lengthOfLongestSubstring("abcabcbb"); // result ==> 3  ("abc")
lengthOfLongestSubstring(""); // result ==> 0

// Versão compacta: while (inWindow.has(s[r])) inWindow.delete(s[l++]);
// Confusão possível: if vs while — um if só tira uma letra; com "abba" é preciso tirar até sair a letra repetida.
// Para recordar: repete? encolhe até deixar de repetir.
// Ver: Set has/add/delete → 01 §14
// Pergunta: quanto dá lengthOfLongestSubstring("bbbb")?
// Resposta: 1. Cada novo "b" obriga a tirar o anterior; a janela nunca passa de 1.

// §5 ── SOMA DE PREFIXOS / KADANE ──────────

//--------------------------------------------------------------------
// Soma de prefixos — a soma de qualquer intervalo em O(1)
// Para que serve: muitas perguntas "quanto soma de l a r?" no mesmo array.
// Regra essencial: p[i] = soma dos primeiros i números; soma(l..r) = p[r + 1] − p[l].
// O que guarda: p = array com um 0 à frente; p[i] = nums[0] + … + nums[i − 1].

function prefixSums(nums) {
  const p = [0];
  for (const n of nums) {
    const last = p.at(-1); // 1. soma até agora
    p.push(last + n); //      2. acrescentar a nova soma
  }
  return p;
}

const P = prefixSums([1, 2, 3, 4]);

// Antes → operação → depois
//   n   last   p depois
//   1   0      [0, 1]
//   2   1      [0, 1, 3]
//   3   3      [0, 1, 3, 6]
P; // result ==> [0, 1, 3, 6, 10]
P[3] - P[1]; // result ==> 5  (soma dos índices 1 a 2: 2 + 3)

// Versão compacta: p.push(p.at(-1) + n);
// Confusão possível: p[r] vs p[r + 1] — por causa do 0 à frente, p está desviado uma posição; a soma até ao índice r é p[r + 1].
// Para recordar: soma(l..r) = p[r + 1] − p[l].
// Ver: push → 01 §9 · at(-1) → 01 §10
// Pergunta: quanto dá a soma dos índices 0 a 3 com P?
// Resposta: 10. P[4] − P[0] = 10 − 0.

//--------------------------------------------------------------------
// Running Sum (LC 1480) — cada posição soma tudo o que veio antes
// Para que serve: [1, 2, 3, 4] → [1, 3, 6, 10].
// Regra essencial: é a soma de prefixos sem o 0 da frente.
// O que guarda: nada novo; reutiliza prefixSums.

const runningSum = (nums) => prefixSums(nums).slice(1);

// Antes → operação → depois
//   passo            valor
//   prefixSums       [0, 1, 3, 6, 10]
//   .slice(1)        [1, 3, 6, 10]
runningSum([1, 2, 3, 4]); // result ==> [1, 3, 6, 10]

// Confusão possível: slice(1) vs splice(1) — slice devolve cópia a partir do índice 1; splice cortaria o array original.
// Para recordar: running sum = prefixos sem o 0.
// Ver: slice → 01 §10
// Pergunta: quanto dá runningSum([5])?
// Resposta: [5]. prefixSums dá [0, 5] e slice(1) tira o 0.

//--------------------------------------------------------------------
// Maximum Subarray (LC 53, Kadane) — a maior soma de números seguidos
// Para que serve: o melhor pedaço seguido de [-2, 1, -3, 4, -1, 2, 1, -5, 4].
// Regra essencial: em cada número decidir "continuo o pedaço ou recomeço aqui?"; recomeça se o pedaço anterior já é negativo.
// O que guarda: current = melhor soma de um pedaço que ACABA aqui; best = melhor soma vista em qualquer sítio.

function maxSubArray(nums) {
  let current = nums[0], best = nums[0];
  for (let i = 1; i < nums.length; i++) {
    current = Math.max(nums[i], current + nums[i]); // recomeçar vs continuar
    best = Math.max(best, current);
  }
  return best;
}

// Antes → operação → depois (início com current = best = -2)
//   i   nums[i]   recomeçar   continuar   current   best
//   1   1         1           -1          1         1
//   2   -3        -3          -2          -2        1
//   3   4         4           2           4         4
maxSubArray([-2, 1, -3, 4, -1, 2, 1, -5, 4]); // result ==> 6  (4 - 1 + 2 + 1)
maxSubArray([-3, -1]); // result ==> -1

// Confusão possível: começar com 0 vs nums[0] — com 0, um array só de negativos daria 0, que não é soma de nenhum pedaço.
// Para recordar: continuar ou recomeçar, guardar o melhor.
// Ver: Math.max → 01 §8
// Pergunta: quanto dá maxSubArray([2, -1, 2])?
// Resposta: 3. current: 2, depois 1, depois 3; continuar compensa porque 1 > 0.

// §6 ── PESQUISA BINÁRIA ──────────

//--------------------------------------------------------------------
// Binary Search (LC 704) — encontrar um número num array ORDENADO
// Para que serve: o array está ordenado e pedem para encontrar algo em O(log n).
// Regra essencial: ver o meio; se for pequeno, deitar fora a metade esquerda; se for grande, a direita.
// O que guarda: l e r = limites do intervalo ainda possível (inclusive); mid = índice do meio.

function binarySearch(nums, target) {
  let l = 0, r = nums.length - 1;
  while (l <= r) {
    const mid = Math.floor((l + r) / 2);
    if (nums[mid] === target) return mid; // encontrou: termina já
    if (nums[mid] < target) l = mid + 1;
    else r = mid - 1;
  }
  return -1; // intervalo vazio: não existe
}

// Antes → operação → depois (nums = [-1, 0, 3, 5, 9, 12], target = 2)
//   l   r   mid   nums[mid]   ação
//   0   5   2     3           3 > 2 → r = 1
//   0   1   0     -1          -1 < 2 → l = 1
//   1   1   1     0           0 < 2 → l = 2; agora l > r, devolve -1
binarySearch([-1, 0, 3, 5, 9, 12], 9); // result ==> 4
binarySearch([-1, 0, 3, 5, 9, 12], 2); // result ==> -1  (não existe)

// Confusão possível: l <= r vs l < r — com <= o intervalo de 1 elemento ainda é testado; usar sempre <= com mid ± 1.
// Para recordar: meio, deitar fora metade, mid ± 1.
// Ver: Math.floor → 01 §8 · while → 01 §6
// Pergunta: quantas vezes corre o while em binarySearch([-1, 0, 3, 5, 9, 12], 9)?
// Resposta: 2. mid = 2 (3 < 9, l = 3), depois mid = 4 (9, devolve 4).

//--------------------------------------------------------------------
// Search Insert Position (LC 35) — onde entraria target num array ordenado
// Para que serve: posição para inserir sem estragar a ordem.
// Regra essencial: a mesma pesquisa binária; se não encontrar, l acaba na posição certa.
// O que guarda: l = primeiro índice cujo valor é ≥ target, quando o ciclo termina.

function searchInsert(nums, target) {
  let l = 0, r = nums.length - 1;
  while (l <= r) {
    const mid = Math.floor((l + r) / 2);
    if (nums[mid] === target) return mid;
    if (nums[mid] < target) l = mid + 1;
    else r = mid - 1;
  }
  return l; // a única diferença para a §6 anterior
}

// Antes → operação → depois (nums = [1, 3, 5, 6], target = 2)
//   l   r   mid   nums[mid]   ação
//   0   3   1     3           3 > 2 → r = 0
//   0   0   0     1           1 < 2 → l = 1; l > r, devolve 1
searchInsert([1, 3, 5, 6], 2); // result ==> 1  (entre o 1 e o 3)
searchInsert([1, 3, 5, 6], 7); // result ==> 4  (no fim)

// Confusão possível: devolver l vs r — no fim r = l − 1; r aponta para o último menor, l para onde o target entra.
// Para recordar: não encontrou? devolve l.
// Ver: Math.floor → 01 §8
// Pergunta: quanto dá searchInsert([1, 3, 5, 6], 0)?
// Resposta: 0. Tudo é maior que 0; r desce até -1 e l fica em 0.

// §7 ── PILHA ──────────

//--------------------------------------------------------------------
// Pilha — o último a entrar é o primeiro a sair
// Para que serve: parênteses, desfazer, "o mais recente ganha".
// Regra essencial: um array simples; push() põe no topo, pop() tira do topo, at(-1) espreita o topo.
// O que guarda: st = array; o fim do array é o topo.

const st = [];
st.push(1);
st.push(2);
st.at(-1); // result ==> 2  (espreita, não tira)
st.pop(); // result ==> 2

// Antes → operação → depois
//   operação   pilha depois   devolve
//   push(1)    [1]            2 (o novo length)
//   push(2)    [1, 2]         2
//   pop()      [1]            2
st; // result ==> [1]

// Confusão possível: pop() vs shift() — pop tira do fim (pilha, O(1)); shift tira do início (fila, O(n)).
// Para recordar: pilha = push + pop no fim.
// Ver: push / pop → 01 §9
// Pergunta: quanto dá [].pop()?
// Resposta: undefined. Pilha vazia não tem topo, e não dá erro.

//--------------------------------------------------------------------
// Valid Parentheses (LC 20) — todos os parênteses fecham pela ordem certa?
// Para que serve: "([)]" é inválido, "()[]{}" é válido.
// Regra essencial: abrir = push; fechar = pop, e o que sai tem de ser o par certo. No fim a pilha tem de estar vazia.
// O que guarda: pair = objeto; chave = fecho; valor = abertura correspondente. stack = aberturas ainda por fechar.

function isValid(s) {
  const pair = { ")": "(", "]": "[", "}": "{" };
  const stack = [];
  for (const ch of s) {
    if (ch in pair) {
      const top = stack.pop(); //          1. tirar a última abertura
      if (top !== pair[ch]) return false; // 2. não é o par: termina já
    } else stack.push(ch);
  }
  return stack.length === 0; // sobrou abertura sem fecho → false
}

// Antes → operação → depois (s = "([)]")
//   ch    ação                       stack depois
//   "("   push                       ["("]
//   "["   push                       ["(", "["]
//   ")"   pop dá "[", queria "("     devolve false
isValid("()[]{}"); // result ==> true
isValid("([)]"); // result ==> false  (ordem errada)
isValid("(("); // result ==> false  (nunca fechou)

// Versão compacta: if (stack.pop() !== pair[ch]) return false;
// Confusão possível: ch in pair vs pair[ch] — "in" pergunta se a CHAVE existe; aqui só os fechos são chaves.
// Para recordar: abre empilha, fecha desempilha e confere.
// Ver: objeto como tabela + in → 01 §12 · push / pop → 01 §9
// Avançado: fila = push() + shift(), mas shift() é O(n); se der Time Limit, andar com um índice.
// Pergunta: quanto dá isValid(")")?
// Resposta: false. pop() da pilha vazia dá undefined, que não é "(".

// §8 ── LISTA LIGADA ──────────

//--------------------------------------------------------------------
// Lista ligada — nós ligados por setas .next
// Para que serve: o LeetCode dá `head` e pede para mudar as setas .next.
// Regra essencial: só se chega a um nó pelo anterior; perder a referência ao resto é perder o resto. Desenhar as setas primeiro.
// O que guarda: cada ListNode tem val = valor e next = próximo nó (null no último).

class ListNode {
  constructor(val, next = null) {
    this.val = val;
    this.next = next;
  }
}
// ajudantes para testar: array ↔ lista
const toList = (arr) => arr.reduceRight((next, val) => new ListNode(val, next), null);
const toArray = (head) => {
  const out = [];
  for (let n = head; n; n = n.next) out.push(n.val);
  return out;
};

// Antes → operação → depois (toList([1, 2]): reduceRight anda do fim para o início)
//   val   next recebido   nó criado
//   2     null            2 → null
//   1     nó 2            1 → 2 → null
toArray(toList([1, 2, 3])); // result ==> [1, 2, 3]

// Confusão possível: reduce vs reduceRight — reduceRight começa no fim, que é o que a lista precisa (o último aponta para null).
// Para recordar: nó = val + next.
// Ver: class + constructor → 01 §19 · reduce → 01 §10
// Pergunta: quanto dá toList([7]).next?
// Resposta: null. O único nó é também o último.

//--------------------------------------------------------------------
// Reverse Linked List (LC 206) — virar a lista ao contrário
// Para que serve: 1 → 2 → 3 passa a 3 → 2 → 1.
// Regra essencial: em cada nó: guardar o resto, virar a seta para trás, avançar os dois ponteiros.
// O que guarda: prev = início da parte já virada; current = nó a virar; next = resto ainda por virar.

function reverseList(head) {
  let prev = null, current = head;
  while (current) {
    const next = current.next; // 1. guardar o resto
    current.next = prev; //        2. virar a seta
    prev = current; //             3. avançar os dois
    current = next;
  }
  return prev; // current é null; prev é a nova cabeça
}

// Antes → operação → depois (lista 1 → 2 → 3)
//   current   next   seta virada   prev depois
//   1         2      1 → null      1
//   2         3      2 → 1         2
//   3         null   3 → 2         3
toArray(reverseList(toList([1, 2, 3]))); // result ==> [3, 2, 1]

// Confusão possível: devolver current vs prev — no fim current é null; a nova cabeça é prev.
// Para recordar: guardar, virar, avançar.
// Ver: while → 01 §6
// Pergunta: quanto dá reverseList(null)?
// Resposta: null. O while não corre e devolve prev, que é null.

//--------------------------------------------------------------------
// Merge Two Sorted Lists (LC 21) — juntar duas listas ordenadas numa
// Para que serve: [1, 2, 4] + [1, 3, 4] → [1, 1, 2, 3, 4, 4].
// Regra essencial: um nó falso (dummy) à frente evita o caso especial "a lista nova ainda está vazia".
// O que guarda: dummy = nó falso antes da resposta; tail = último nó da resposta; a e b = próximo nó de cada lista.

function mergeTwoLists(a, b) {
  const dummy = new ListNode(0);
  let tail = dummy;
  while (a && b) {
    if (a.val <= b.val) { tail.next = a; a = a.next; }
    else { tail.next = b; b = b.next; }
    tail = tail.next;
  }
  tail.next = a ?? b; // pendurar o resto da lista que sobrou
  return dummy.next; // salta o nó falso
}

// Antes → operação → depois (primeiras iterações)
//   a.val   b.val   liga   resposta depois
//   1       1       a      1
//   2       1       b      1 → 1
//   2       3       a      1 → 1 → 2
toArray(mergeTwoLists(toList([1, 2, 4]), toList([1, 3, 4]))); // result ==> [1, 1, 2, 3, 4, 4]

// Confusão possível: devolver dummy vs dummy.next — dummy é o nó falso com 0; a resposta começa no seguinte.
// Para recordar: dummy à frente, tail anda, devolver dummy.next.
// Ver: && e ?? → 01 §3
// Pergunta: quanto dá toArray(mergeTwoLists(null, toList([5])))?
// Resposta: [5]. O while não corre; tail.next = b e devolve-se a lista [5].

//--------------------------------------------------------------------
// Middle of the Linked List (LC 876) — o nó do meio
// Para que serve: encontrar o meio numa só passagem.
// Regra essencial: slow anda 1, fast anda 2; quando fast chega ao fim, slow está no meio.
// O que guarda: slow = nó a 1 passo por volta; fast = nó a 2 passos por volta.

function middleNode(head) {
  let slow = head, fast = head;
  while (fast && fast.next) {
    slow = slow.next;
    fast = fast.next.next;
  }
  return slow;
}

// Antes → operação → depois (lista 1 → 2 → 3 → 4 → 5)
//   volta   slow   fast
//   0       1      1
//   1       2      3
//   2       3      5   (fast.next é null: pára)
middleNode(toList([1, 2, 3, 4, 5])).val; // result ==> 3

// Confusão possível: fast && fast.next — os dois são precisos: fast.next.next rebenta se fast ou fast.next for null.
// Para recordar: lento 1, rápido 2.
// Ver: null é falsy → 01 §4
// Pergunta: quanto dá middleNode(toList([1, 2, 3, 4])).val?
// Resposta: 3. Com número par fica o segundo do meio (fast pára em null depois do 4).

//--------------------------------------------------------------------
// Linked List Cycle (LC 141) — a lista dá voltas para sempre?
// Para que serve: detetar um ciclo sem guardar os nós visitados.
// Regra essencial: o mesmo slow/fast; se houver ciclo, fast apanha slow por trás. Se fast chegar a null, não há ciclo.
// O que guarda: slow e fast = os dois corredores; slow === fast = o mesmo nó.

function hasCycle(head) {
  let slow = head, fast = head;
  while (fast && fast.next) {
    slow = slow.next;
    fast = fast.next.next;
    if (slow === fast) return true; // encontraram-se: termina já
  }
  return false; // fast chegou ao fim
}

const cycle = toList([1, 2, 3]);
cycle.next.next.next = cycle; // 3 → 1

// Antes → operação → depois (1 → 2 → 3 → 1 …)
//   volta   slow   fast   iguais?
//   1       2      3      não
//   2       3      2      não
//   3       1      1      sim → true
hasCycle(cycle); // result ==> true
hasCycle(toList([1, 2])); // result ==> false

// Confusão possível: slow === fast compara o NÓ (referência), não o valor; dois nós com val 1 diferentes não contam.
// Para recordar: se o rápido apanha o lento, há volta.
// Ver: === em objetos → 01 §3
// Pergunta: quanto dá hasCycle(null)?
// Resposta: false. fast é null, o while não corre.

// §9 ── ÁRVORES BINÁRIAS ──────────

//--------------------------------------------------------------------
// Árvore binária — quase tudo é recursão
// Para que serve: o LeetCode dá `root`, com .left e .right.
// Regra essencial: 1. if (!node) devolve a resposta vazia; 2. confiar que left e right já funcionam; 3. combinar.
// O que guarda: cada TreeNode tem val, left (filho esquerdo) e right (filho direito); null = não há filho.

class TreeNode {
  constructor(val, left = null, right = null) {
    this.val = val;
    this.left = left;
    this.right = right;
  }
}
//        3
//       / \
//      9   20
//         /  \
//        15   7
const tree = new TreeNode(3, new TreeNode(9), new TreeNode(20, new TreeNode(15), new TreeNode(7)));

// Antes → operação → depois
//   nó    left   right
//   3     9      20
//   20    15     7
//   9     null   null   (folha)
tree.right.left.val; // result ==> 15

// Confusão possível: folha vs null — uma folha é um nó sem filhos; null é a ausência de nó (o caso base).
// Para recordar: caso vazio, confiar nos filhos, combinar.
// Pergunta: quanto dá tree.left.right?
// Resposta: null. O 9 é folha, não tem filho direito.

//--------------------------------------------------------------------
// Maximum Depth (LC 104) — quantos níveis tem a árvore
// Para que serve: a altura da árvore.
// Regra essencial: profundidade = 1 (este nó) + a maior das profundidades dos filhos; null vale 0.
// O que guarda: left e right = profundidade de cada sub-árvore (calculada pela própria função).

function maxDepth(node) {
  if (!node) return 0; // caso base: termina aqui
  const left = maxDepth(node.left);
  const right = maxDepth(node.right);
  return 1 + Math.max(left, right);
}

// Antes → operação → depois (de baixo para cima)
//   nó    left   right   devolve
//   9     0      0       1
//   20    1      1       2
//   3     1      2       3
maxDepth(tree); // result ==> 3

// Versão compacta: const maxDepth = (node) => (node ? 1 + Math.max(maxDepth(node.left), maxDepth(node.right)) : 0);
// Confusão possível: profundidade conta nós, não arestas — uma árvore só com a raiz tem profundidade 1.
// Para recordar: 1 + o lado mais fundo.
// Ver: ternário ? : → 01 §3 · Math.max → 01 §8
// Pergunta: quanto dá maxDepth(new TreeNode(1, new TreeNode(2)))?
// Resposta: 2. O nó 2 dá 1, o lado direito dá 0; 1 + max(1, 0) = 2.

//--------------------------------------------------------------------
// Invert Binary Tree (LC 226) — espelhar a árvore
// Para que serve: trocar esquerda e direita em todos os nós.
// Regra essencial: inverter cada filho e depois trocá-los; a função altera os nós e devolve a mesma raiz.
// O que guarda: left e right = os filhos já invertidos.

function invertTree(node) {
  if (!node) return null;
  const left = invertTree(node.left); //   1. inverter o filho esquerdo
  const right = invertTree(node.right); // 2. inverter o filho direito
  node.left = right; //                    3. trocar
  node.right = left;
  return node;
}

const small = new TreeNode(1, new TreeNode(2), new TreeNode(3));
invertTree(small);

// Antes → operação → depois
//   nó   antes (left, right)   depois (left, right)
//   2    null, null            null, null
//   3    null, null            null, null
//   1    2, 3                  3, 2
small.left.val; // result ==> 3

// Versão compacta: [node.left, node.right] = [invertTree(node.right), invertTree(node.left)];
// Confusão possível: node.left = invertTree(node.right) seguido de node.right = invertTree(node.left) está ERRADO — o segundo já lê o left novo. Guardar primeiro.
// Para recordar: inverter filhos, trocar, devolver o nó.
// Ver: troca [a, b] = [b, a] → 01 §13
// Pergunta: depois de invertTree(small), quanto vale small.val?
// Resposta: 1. A raiz não muda de valor; só os filhos trocam.

//--------------------------------------------------------------------
// Same Tree (LC 100) — as duas árvores são iguais?
// Para que serve: comparar forma e valores, nó a nó.
// Regra essencial: igual = mesmo valor aqui E esquerda igual E direita igual. Se algum for null, só são iguais se os dois forem null.
// O que guarda: p e q = os nós a comparar nas duas árvores, na mesma posição.

function isSameTree(p, q) {
  if (!p || !q) return p === q; // os dois null → true; só um null → false
  return p.val === q.val && isSameTree(p.left, q.left) && isSameTree(p.right, q.right);
}

// Antes → operação → depois (o caso base)
//   p       q       devolve
//   null    null    true
//   null    nó      false
//   nó      nó      compara val e desce
isSameTree(invertTree(invertTree(tree)), tree); // result ==> true  (inverter duas vezes devolve a original)

// Confusão possível: p === q em nós compara referências — aqui só é usado quando pelo menos um é null.
// Para recordar: mesmo valor, mesma esquerda, mesma direita.
// Ver: ! / || / && → 01 §3
// Pergunta: quanto dá isSameTree(new TreeNode(1), new TreeNode(1))?
// Resposta: true. Valores iguais e os quatro filhos são null.

//--------------------------------------------------------------------
// Path Sum (LC 112) — algum caminho da raiz a uma folha soma target?
// Para que serve: 3 + 20 + 7 = 30 é um caminho válido.
// Regra essencial: a descer, subtrair o valor do nó ao target; numa folha, ver se o que falta é o valor da folha.
// O que guarda: rest = quanto falta somar abaixo deste nó.

function hasPathSum(node, target) {
  if (!node) return false;
  if (!node.left && !node.right) return node.val === target; // folha
  const rest = target - node.val;
  return hasPathSum(node.left, rest) || hasPathSum(node.right, rest);
}

// Antes → operação → depois (hasPathSum(tree, 30))
//   nó   target   folha?   resultado
//   3    30       não      desce com 27
//   9    27       sim      9 === 27 → false
//   20   27       não      desce com 7 → 15 dá false, 7 dá true
hasPathSum(tree, 30); // result ==> true  (3 + 20 + 7)
hasPathSum(tree, 5); // result ==> false

// Confusão possível: parar no null vs parar na folha — o caminho tem de acabar numa folha; null sozinho devolve false.
// Para recordar: subtrair a descer, conferir na folha.
// Ver: ! / && / || → 01 §3
// Pergunta: quanto dá hasPathSum(tree, 12)?
// Resposta: true. 3 + 9 = 12 e o 9 é folha.

//--------------------------------------------------------------------
// Inorder Traversal (LC 94) — visitar todos os nós (DFS)
// Para que serve: listar os valores pela ordem esquerda → nó → direita.
// Regra essencial: só muda ONDE está o push: pre = push, esq, dir · in = esq, push, dir · post = esq, dir, push.
// O que guarda: out = array partilhado por todas as chamadas, com os valores já visitados.

function inorder(node, out = []) {
  if (!node) return out;
  inorder(node.left, out); // 1. tudo à esquerda
  out.push(node.val); //      2. este nó
  inorder(node.right, out); // 3. tudo à direita
  return out;
}

// Antes → operação → depois (ordem dos push)
//   push   nó    out depois
//   1      9     [9]
//   2      3     [9, 3]
//   3      15    [9, 3, 15]
inorder(tree); // result ==> [9, 3, 15, 20, 7]

// Confusão possível: out = [] por omissão é criado de novo em cada chamada SEM out; as chamadas recursivas passam o mesmo out.
// Para recordar: in = esquerda, eu, direita.
// Avançado: inorder numa BST (árvore de pesquisa) dá os valores ordenados.
// Ver: parâmetro por omissão → 01 §16 · push → 01 §9
// Pergunta: qual é o preorder (push, esq, dir) de tree?
// Resposta: [3, 9, 20, 15, 7]. Cada nó entra antes dos seus filhos.

//--------------------------------------------------------------------
// Level Order (LC 102) — ler a árvore nível a nível (BFS)
// Para que serve: [[3], [9, 20], [15, 7]].
// Regra essencial: no início de cada volta, tudo o que está na fila é exatamente um nível.
// O que guarda: queue = nós por visitar; size = quantos nós tem o nível atual; level = valores desse nível.

function levelOrder(root) {
  if (!root) return [];
  const levels = [], queue = [root];
  while (queue.length) {
    const size = queue.length, level = []; // fixar o tamanho ANTES de juntar filhos
    for (let i = 0; i < size; i++) {
      const n = queue.shift();
      level.push(n.val);
      if (n.left) queue.push(n.left);
      if (n.right) queue.push(n.right);
    }
    levels.push(level);
  }
  return levels;
}

// Antes → operação → depois (uma linha por volta do while)
//   fila antes   size   level      fila depois
//   [3]          1      [3]        [9, 20]
//   [9, 20]      2      [9, 20]    [15, 7]
//   [15, 7]      2      [15, 7]    []
levelOrder(tree); // result ==> [[3], [9, 20], [15, 7]]

// Confusão possível: size vs queue.length no for — queue.length cresce enquanto se juntam filhos; size fica fixo no nível atual.
// Para recordar: o que está na fila agora é um nível.
// Avançado: é medium, mas muitos easy são feitos em cima disto.
// Ver: push / shift → 01 §9
// Pergunta: quanto dá levelOrder(new TreeNode(1, null, new TreeNode(2)))?
// Resposta: [[1], [2]]. O nó 1 só tem filho direito, que fica sozinho no 2.º nível.

// §10 ── MATEMÁTICA / BITS ──────────

//--------------------------------------------------------------------
// Single Number (LC 136) — o único número sem par
// Para que serve: em [4, 1, 2, 1, 2] todos aparecem 2 vezes exceto o 4.
// Regra essencial: x ^ x = 0 e x ^ 0 = x; fazer XOR de tudo anula os pares e sobra o sozinho.
// O que guarda: acc = XOR de todos os números vistos até agora.

function singleNumber(nums) {
  let acc = 0;
  for (const n of nums) acc = acc ^ n;
  return acc;
}

// Antes → operação → depois (nums = [4, 1, 2, 1, 2])
//   n   acc antes   acc depois
//   4   0           4
//   1   4           5
//   2   5           7
//   …   (1 e 2 outra vez anulam-se: 7 ^ 1 = 6, 6 ^ 2 = 4)
singleNumber([4, 1, 2, 1, 2]); // result ==> 4

// Versão compacta: const singleNumber = (nums) => nums.reduce((acc, n) => acc ^ n, 0);
// Confusão possível: ^ não é potência em JS — é XOR bit a bit. Potência é **.
// Para recordar: XOR de tudo, os pares anulam-se.
// Ver: reduce → 01 §10
// Pergunta: quanto dá singleNumber([7, 3, 7])?
// Resposta: 3. 7 ^ 7 = 0 e 0 ^ 3 = 3; a ordem não importa.

//--------------------------------------------------------------------
// Missing Number (LC 268) — o número que falta em 0..n
// Para que serve: [3, 0, 1] tem 3 números de 0..3; falta o 2.
// Regra essencial: soma que devia ser (0 + 1 + … + n = n(n + 1)/2) menos a soma real.
// O que guarda: n = nums.length; expected = soma de 0..n; actual = soma do array.

function missingNumber(nums) {
  const n = nums.length;
  const expected = (n * (n + 1)) / 2; //               1. soma que devia ser
  const actual = nums.reduce((a, b) => a + b, 0); //  2. soma real
  return expected - actual; //                        3. a diferença é o que falta
}

// Antes → operação → depois (nums = [3, 0, 1])
//   passo      valor
//   n          3
//   expected   3 × 4 / 2 = 6
//   actual     3 + 0 + 1 = 4
missingNumber([3, 0, 1]); // result ==> 2  (6 - 4)

// Versão compacta: const missingNumber = (nums) => (nums.length * (nums.length + 1)) / 2 - nums.reduce((a, b) => a + b, 0);
// Confusão possível: n = length, não length − 1 — o array tem n números de um intervalo de n + 1 (0..n).
// Para recordar: devia − é.
// Ver: reduce → 01 §10
// Pergunta: quanto dá missingNumber([0, 1])?
// Resposta: 2. n = 2, expected = 3, actual = 1.

//--------------------------------------------------------------------
// Palindrome Number (LC 9) — o número lê-se igual nos dois sentidos?
// Para que serve: 121 é palíndromo; 10 não é.
// Regra essencial: construir o número ao contrário com % 10, sem strings, e comparar com o original.
// O que guarda: original = cópia de x; reversed = dígitos já virados; x = o que falta virar.

function isPalindromeNumber(x) {
  if (x < 0) return false; // "-121" ao contrário é "121-"
  let original = x, reversed = 0;
  while (x > 0) {
    const digit = x % 10; //            1. último dígito
    reversed = reversed * 10 + digit; // 2. empurrar para a esquerda e juntar
    x = Math.floor(x / 10); //          3. apagar o último dígito
  }
  return reversed === original;
}

// Antes → operação → depois (x = 121)
//   x antes   digit   reversed depois   x depois
//   121       1       1                 12
//   12        2       12                1
//   1         1       121               0
isPalindromeNumber(121); // result ==> true
isPalindromeNumber(10); // result ==> false  (01 não é 10)

// Versão compacta: reversed = reversed * 10 + (x % 10);
// Confusão possível: comparar com x vs original — no fim x é 0; por isso guardar original antes do ciclo.
// Para recordar: × 10 + % 10 vira o número.
// Ver: % → 01 §3 · Math.floor → 01 §8
// Pergunta: quanto vale reversed no fim para x = 10?
// Resposta: 1. Dígitos 0 e depois 1: 0 × 10 + 1 = 1, e 1 !== 10.

//--------------------------------------------------------------------
// Power of Two (LC 231) — n é 1, 2, 4, 8, …?
// Para que serve: saber se n é potência de 2 em O(1).
// Regra essencial: uma potência de 2 tem um só bit 1; n − 1 vira esse bit e acende os de baixo, logo n & (n − 1) dá 0.
// O que guarda: nada; devolve true/false.

const isPowerOfTwo = (n) => n > 0 && (n & (n - 1)) === 0;

// Antes → operação → depois
//   n    binário   n − 1 em binário   n & (n − 1)
//   8    1000      0111               0     → potência
//   12   1100      1011               1000  → não
//   16   10000     01111              0     → potência
isPowerOfTwo(16); // result ==> true
isPowerOfTwo(12); // result ==> false

// Confusão possível: par/ímpar usa % 2, não bits — 7 % 2 === 1 diz "ímpar"; n & (n − 1) diz "potência de 2".
7 % 2 === 1; // result ==> true  (ímpar: % 2 dá 1)
// Para recordar: potência de 2 = n > 0 e n & (n − 1) igual a 0.
// Ver: % e && → 01 §3
// Pergunta: quanto dá isPowerOfTwo(0)?
// Resposta: false. 0 & -1 dá 0, mas n > 0 falha primeiro.

//--------------------------------------------------------------------
// Climbing Stairs (LC 70) — de quantas maneiras se sobe n degraus, 1 ou 2 de cada vez
// Para que serve: a primeira programação dinâmica — a resposta de agora usa as duas anteriores.
// Regra essencial: maneiras(i) = maneiras(i − 1) + maneiras(i − 2) (Fibonacci); só é preciso guardar as duas últimas.
// O que guarda: a = maneiras de chegar ao degrau i − 2; b = maneiras de chegar ao degrau i − 1 (no fim, ao degrau n).

function climbStairs(n) {
  let a = 1, b = 1; // degrau 0 e degrau 1
  for (let i = 2; i <= n; i++) {
    const next = a + b; // 1. calcular o degrau i
    a = b; //              2. avançar a janela
    b = next;
  }
  return b;
}

// Antes → operação → depois (n = 5)
//   i   a   b   next
//   2   1   2   2
//   3   2   3   3
//   4   3   5   5
//   (i = 5: a = 5, b = 8)
climbStairs(2); // result ==> 2
climbStairs(5); // result ==> 8

// Versão compacta: for (let i = 2; i <= n; i++) [a, b] = [b, a + b];
// Confusão possível: a = b; b = a + b em duas linhas está ERRADO — o segundo já usa o a novo. Guardar next primeiro ou usar a troca [a, b] = [b, a + b].
// Para recordar: cada degrau = os dois anteriores somados.
// Ver: troca [a, b] = [b, a + b] → 01 §13
// Pergunta: quanto dá climbStairs(3)?
// Resposta: 3. 1+1+1, 1+2 e 2+1; no código, b passa de 2 para 3.

// §11 ── LISTA DE TREINO ──────────
// Por esta ordem. Tentar cada um sozinho 20 min antes de olhar para cima.
//   Hash map:        1 Two Sum · 217 · 242 · 387 · 383 Ransom Note · 349 Intersection of Two Arrays
//   Romanos:         13 Roman to Integer · 12 Integer to Roman (dizem que saiu na Thought Machine)
//   Dois ponteiros:  125 · 344 · 26 · 283 · 88 · 977 Squares of a Sorted Array
//   Janela/prefixo:  121 · 1480 · 643 Maximum Average Subarray I · 53
//   Pesquisa binária: 704 · 35 · 278 First Bad Version
//   Pilha:           20 · 232 Implement Queue using Stacks · 1047 Remove All Adjacent Duplicates
//   Lista ligada:    206 · 21 · 876 · 141 · 83 Remove Duplicates from Sorted List
//   Árvores:         104 · 226 · 100 · 112 · 101 Symmetric Tree · 94 Inorder Traversal
//   Matemática/bits: 136 · 268 · 9 · 70 · 191 Number of 1 Bits

console.log("✅ Easy OK");
