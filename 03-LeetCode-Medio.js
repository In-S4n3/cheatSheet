// LEETCODE PATTERNS (nível MÉDIO) — JavaScript
// Corre com: node 03-LeetCode-Medio.js   → se nada rebentar, todos os exemplos estão certos.
// Cada padrão: SINAIS NO ENUNCIADO → TEMPLATE → problemas reais resolvidos → complexidade → testes.
// Pré-requisito: LeetCode-Patterns.js (fácil). Aqui assume-se que já sabes Map, Set, sort com (a, b) => a - b.

const assert = require("node:assert/strict");

// Helper: LeetCode aceita resultados "em qualquer ordem". Para testar, ordena tudo antes de comparar.
const ordenar = (lista) => lista.map((x) => (Array.isArray(x) ? [...x].sort((a, b) => a - b) : x)).sort((a, b) => String(a).localeCompare(String(b)));
const mesmoConjunto = (a, b) => assert.deepEqual(ordenar(a), ordenar(b));

/*
  ÍNDICE (Ctrl+F por "§N ──")
    §1  Como atacar um médio em entrevista
    §2  Hash map avançado (prefix sum, agrupar, sequências, top K)
    §3  Dois ponteiros (3Sum, Container With Most Water)
    §4  Janela deslizante variável com Map
    §5  Stack monotónica + stack
    §6  Pesquisa binária avançada (array rodado, binária na resposta)
    §7  Intervalos
    §8  Matriz / grelha (DFS, BFS multi-origem)
    §9  Grafos (lista de adjacência, ordenação topológica)
    §10 Backtracking
    §11 Heap (MinHeap feita à mão)
    §12 Programação dinâmica
    §13 Listas ligadas (médio)
    §14 Árvores (médio)
    §15 Tabela final: sinal → padrão + que Big-O o n permite
    §16 Plano de 7 dias
*/

// =====================================================================================
// §1 ── COMO ATACAR UM MÉDIO EM ENTREVISTA ──────────
// =====================================================================================
/*
  O entrevistador avalia o PROCESSO, não só a resposta. Silêncio = mau sinal. Fala sempre.

  1. CLARIFICAR (2 min). Repete o problema por palavras tuas e pergunta:
       - "O array pode estar vazio? Pode ter 1 elemento?"
       - "Há duplicados? Números negativos? Zero?"
       - "Está ordenado?"  (se sim → dois ponteiros ou binária)
       - "Devolvo índices ou valores? Qualquer ordem serve?"
       - "Strings: só minúsculas a-z? Há espaços? Maiúsculas contam?"
       - "Qual o tamanho máximo de n?"  (diz-te a complexidade esperada — ver §15)
  2. EXEMPLO À MÃO. Pega no exemplo do enunciado e resolve no papel/quadro. Diz o que estás a fazer.
  3. BRUTA PRIMEIRO, EM VOZ ALTA. "A solução óbvia são dois for, O(n²). Funciona, mas dá para melhor."
     Não precisas de a escrever. Dizê-la mostra que entendeste o problema.
  4. OTIMIZAR. Pergunta-te: "o que é que estou a repetir?" → normalmente um Map/Set elimina um loop.
     Ou: "se ordenar (n log n), fica mais fácil?"
  5. ESCREVER. Nomes claros (esquerda, direita, freq), não (i, j, m). Funções pequenas.
  6. TESTAR À MÃO. Percorre o código linha a linha com o exemplo. Depois com 1 caso limite.
  7. COMPLEXIDADE. Diz tempo E espaço no fim, sem te pedirem.

  CHECKLIST DE CASOS LIMITE (escreve-os como testes):
    [] vazio: [] ou ""
    [] 1 elemento: [5] ou "a"
    [] todos iguais / duplicados: [2, 2, 2]
    [] negativos e zero: [-3, 0, 3]  (estragam truques tipo "a soma só cresce")
    [] já ordenado / ordenado ao contrário
    [] resposta não existe → o que devolver? (-1, [], 0?)
    [] números: em JS não há overflow de inteiros até 2^53 (Number.MAX_SAFE_INTEGER),
       MAS floats sim: 0.1 + 0.2 !== 0.3. Divisões → Math.floor / Math.trunc.
    [] strings: espaços, maiúsculas ("A" !== "a"), pontuação. Normaliza com .toLowerCase().
*/
assert.equal(0.1 + 0.2 === 0.3, false); // floats enganam
assert.equal(Math.abs(0.1 + 0.2 - 0.3) < Number.EPSILON, true); // compara com tolerância
assert.equal(Number.MAX_SAFE_INTEGER, 2 ** 53 - 1);
assert.equal("Ab".toLowerCase() === "ab", true);

// =====================================================================================
// §2 ── HASH MAP AVANÇADO ──────────
// =====================================================================================
// SINAIS NO ENUNCIADO: "subarray com soma k" · "agrupa" · "anagramas" · "sequência consecutiva"
//   · "k mais frequentes" · "em O(n)" · "conta quantos"
//
// TEMPLATE prefix sum + map: "quantos subarrays somam K?"
//   soma(i..j) = prefixo[j] - prefixo[i-1]. Queremos prefixo[j] - prefixo[antes] = k
//   → para cada j, procura quantas vezes já vimos o prefixo (atual - k).

// LC 560 — Subarray Sum Equals K
// Bruta: dois for (todos os subarrays) O(n²). Janela deslizante NÃO funciona porque há negativos.
function subarraySum(nums, k) {
  const vistos = new Map([[0, 1]]); // prefixo 0 já "existe" uma vez: subarray que começa no índice 0
  let prefixo = 0, total = 0;
  for (const n of nums) {
    prefixo += n;
    total += vistos.get(prefixo - k) ?? 0;
    vistos.set(prefixo, (vistos.get(prefixo) ?? 0) + 1);
  }
  return total;
}
// Tempo O(n) · Espaço O(n)
assert.equal(subarraySum([1, 1, 1], 2), 2);
assert.equal(subarraySum([1, 2, 3], 3), 2); // [1,2] e [3]
assert.equal(subarraySum([1, -1, 0], 0), 3); // negativos e zero
assert.equal(subarraySum([], 0), 0);
assert.equal(subarraySum([5], 5), 1);

// LC 49 — Group Anagrams
// Chave = a palavra com as letras ordenadas. Anagramas dão a mesma chave.
function groupAnagrams(strs) {
  const grupos = new Map();
  for (const s of strs) {
    const chave = [...s].sort().join(""); // sort() sem função é OK aqui: são letras
    if (!grupos.has(chave)) grupos.set(chave, []);
    grupos.get(chave).push(s);
  }
  return [...grupos.values()];
}
// Tempo O(n · L log L), L = tamanho da palavra · Espaço O(n · L)
mesmoConjunto(
  groupAnagrams(["eat", "tea", "tan", "ate", "nat", "bat"]).map((g) => g.sort()),
  [["ate", "eat", "tea"], ["nat", "tan"], ["bat"]]
);
assert.deepEqual(groupAnagrams([""]), [[""]]);
assert.deepEqual(groupAnagrams([]), []);

// LC 128 — Longest Consecutive Sequence (em O(n), sem ordenar)
// Truque: só começas a contar no INÍCIO de uma sequência (quando n-1 não existe).
// Assim cada número é visitado no máximo 2 vezes → O(n).
function longestConsecutive(nums) {
  const set = new Set(nums);
  let melhor = 0;
  for (const n of set) {
    if (set.has(n - 1)) continue; // não é início, alguém antes já vai contar esta sequência
    let tamanho = 1;
    while (set.has(n + tamanho)) tamanho++;
    melhor = Math.max(melhor, tamanho);
  }
  return melhor;
}
// Tempo O(n) · Espaço O(n)   (alternativa aceitável: ordenar O(n log n))
assert.equal(longestConsecutive([100, 4, 200, 1, 3, 2]), 4); // 1,2,3,4
assert.equal(longestConsecutive([0, 3, 7, 2, 5, 8, 4, 6, 0, 1]), 9);
assert.equal(longestConsecutive([]), 0);
assert.equal(longestConsecutive([1, 2, 0, 1]), 3); // duplicados
assert.equal(longestConsecutive([-1, -2, 5]), 2); // negativos

// LC 347 — Top K Frequent Elements (bucket sort)
// Uma frequência nunca passa de n → cria n+1 "baldes": balde[f] = números que aparecem f vezes.
// Depois percorre os baldes do maior para o menor.
function topKFrequent(nums, k) {
  const freq = new Map();
  for (const n of nums) freq.set(n, (freq.get(n) ?? 0) + 1);
  const baldes = Array.from({ length: nums.length + 1 }, () => []);
  for (const [num, f] of freq) baldes[f].push(num);
  const resultado = [];
  for (let f = baldes.length - 1; f >= 0 && resultado.length < k; f--) {
    for (const num of baldes[f]) {
      if (resultado.length < k) resultado.push(num);
    }
  }
  return resultado;
}
// Tempo O(n) · Espaço O(n)
// Em entrevista também é aceitável: [...freq].sort((a, b) => b[1] - a[1]).slice(0, k) → O(n log n)
mesmoConjunto(topKFrequent([1, 1, 1, 2, 2, 3], 2), [1, 2]);
assert.deepEqual(topKFrequent([1], 1), [1]);
mesmoConjunto(topKFrequent([-1, -1, 4, 4, 4, 7], 2), [4, -1]);

// =====================================================================================
// §3 ── DOIS PONTEIROS ──────────
// =====================================================================================
// SINAIS NO ENUNCIADO: "array ordenado" (ou podes ordenar) · "par/trio que soma X"
//   · "sem duplicados no resultado" · "maximiza área/distância entre dois índices"
//
// TEMPLATE (ponteiros nas pontas, encontram-se no meio):
//   let esq = 0, dir = arr.length - 1;
//   while (esq < dir) {
//     if (condição cumprida) { guarda; esq++; dir--; }
//     else if (precisa de mais) esq++;   // num array crescente, avançar esq aumenta o valor
//     else dir--;
//   }

// LC 15 — 3Sum: todos os trios únicos com soma 0.
// Ideia: ordena. Fixa nums[i], e procura um par com soma -nums[i] com dois ponteiros (Two Sum II).
function threeSum(nums) {
  const ord = [...nums].sort((a, b) => a - b);
  const res = [];
  for (let i = 0; i < ord.length - 2; i++) {
    if (i > 0 && ord[i] === ord[i - 1]) continue; // mesmo 1º número → mesmos trios. Salta.
    let esq = i + 1, dir = ord.length - 1;
    while (esq < dir) {
      const soma = ord[i] + ord[esq] + ord[dir];
      if (soma === 0) {
        res.push([ord[i], ord[esq], ord[dir]]);
        esq++;
        dir--;
        while (esq < dir && ord[esq] === ord[esq - 1]) esq++; // salta duplicados do 2º número
      } else if (soma < 0) esq++;
      else dir--;
    }
  }
  return res;
}
// Tempo O(n²) · Espaço O(1) extra (fora a cópia ordenada / o output)
mesmoConjunto(threeSum([-1, 0, 1, 2, -1, -4]), [[-1, -1, 2], [-1, 0, 1]]);
assert.deepEqual(threeSum([0, 0, 0, 0]), [[0, 0, 0]]); // duplicados → um só trio
assert.deepEqual(threeSum([0, 1, 1]), []);
assert.deepEqual(threeSum([]), []);

// LC 11 — Container With Most Water
// Área = largura × altura da parede MAIS BAIXA. Move sempre a parede mais baixa:
// mover a alta nunca ajuda (a largura diminui e a altura continua limitada pela baixa).
function maxArea(height) {
  let esq = 0, dir = height.length - 1, melhor = 0;
  while (esq < dir) {
    const area = (dir - esq) * Math.min(height[esq], height[dir]);
    melhor = Math.max(melhor, area);
    if (height[esq] < height[dir]) esq++;
    else dir--;
  }
  return melhor;
}
// Tempo O(n) · Espaço O(1)
assert.equal(maxArea([1, 8, 6, 2, 5, 4, 8, 3, 7]), 49);
assert.equal(maxArea([1, 1]), 1);
assert.equal(maxArea([5]), 0);

// =====================================================================================
// §4 ── JANELA DESLIZANTE VARIÁVEL COM MAP ──────────
// =====================================================================================
// SINAIS NO ENUNCIADO: "substring/subarray CONTÍNUO" · "mais longo/mais curto"
//   · "sem repetir" · "no máximo k" · "todas as posições onde aparece um anagrama"
//
// TEMPLATE (janela [esq, dir] que cresce à direita e encolhe à esquerda):
//   const freq = new Map(); let esq = 0, melhor = 0;
//   for (let dir = 0; dir < s.length; dir++) {
//     adiciona s[dir] ao freq;
//     while (janela inválida) { remove s[esq] do freq; esq++; }
//     melhor = Math.max(melhor, dir - esq + 1);   // tamanho da janela
//   }

// LC 3 — Longest Substring Without Repeating Characters
function lengthOfLongestSubstring(s) {
  const freq = new Map();
  let esq = 0, melhor = 0;
  for (let dir = 0; dir < s.length; dir++) {
    freq.set(s[dir], (freq.get(s[dir]) ?? 0) + 1);
    while (freq.get(s[dir]) > 1) {
      // repetido: encolhe até sair o duplicado
      freq.set(s[esq], freq.get(s[esq]) - 1);
      esq++;
    }
    melhor = Math.max(melhor, dir - esq + 1);
  }
  return melhor;
}
// Tempo O(n) · Espaço O(k), k = alfabeto
assert.equal(lengthOfLongestSubstring("abcabcbb"), 3);
assert.equal(lengthOfLongestSubstring("bbbbb"), 1);
assert.equal(lengthOfLongestSubstring("pwwkew"), 3);
assert.equal(lengthOfLongestSubstring(""), 0);
assert.equal(lengthOfLongestSubstring(" "), 1); // espaço também é caractere
assert.equal(lengthOfLongestSubstring("aA"), 2); // maiúscula ≠ minúscula

// LC 424 — Longest Repeating Character Replacement
// Podes trocar até k letras. Janela válida se: tamanho - (letra mais frequente) <= k
// (as "outras" letras são as que terias de trocar).
function characterReplacement(s, k) {
  const freq = new Map();
  let esq = 0, maxFreq = 0, melhor = 0;
  for (let dir = 0; dir < s.length; dir++) {
    freq.set(s[dir], (freq.get(s[dir]) ?? 0) + 1);
    maxFreq = Math.max(maxFreq, freq.get(s[dir]));
    // maxFreq não precisa de baixar quando encolhes: só uma maxFreq MAIOR melhora a resposta
    while (dir - esq + 1 - maxFreq > k) {
      freq.set(s[esq], freq.get(s[esq]) - 1);
      esq++;
    }
    melhor = Math.max(melhor, dir - esq + 1);
  }
  return melhor;
}
// Tempo O(n) · Espaço O(26)
assert.equal(characterReplacement("ABAB", 2), 4);
assert.equal(characterReplacement("AABABBA", 1), 4);
assert.equal(characterReplacement("A", 0), 1);
assert.equal(characterReplacement("", 2), 0);

// LC 438 — Find All Anagrams in a String (janela de tamanho FIXO = p.length)
// Compara contagens com um array de 26 posições (letra → índice com charCodeAt).
function findAnagrams(s, p) {
  if (p.length > s.length) return [];
  const idx = (ch) => ch.charCodeAt(0) - 97; // 'a' = 97
  const alvo = new Array(26).fill(0), janela = new Array(26).fill(0);
  for (const ch of p) alvo[idx(ch)]++;
  const res = [];
  for (let dir = 0; dir < s.length; dir++) {
    janela[idx(s[dir])]++;
    if (dir >= p.length) janela[idx(s[dir - p.length])]--; // a letra que saiu pela esquerda
    if (dir >= p.length - 1 && janela.join() === alvo.join()) res.push(dir - p.length + 1);
  }
  return res;
}
// Tempo O(26 · n) = O(n) · Espaço O(26) = O(1)
assert.deepEqual(findAnagrams("cbaebabacd", "abc"), [0, 6]);
assert.deepEqual(findAnagrams("abab", "ab"), [0, 1, 2]);
assert.deepEqual(findAnagrams("a", "ab"), []);
assert.deepEqual(findAnagrams("", "a"), []);

// =====================================================================================
// §5 ── STACK MONOTÓNICA + STACK ──────────
// =====================================================================================
// SINAIS NO ENUNCIADO: "próximo maior/menor" · "quantos dias até" · "o primeiro à direita que..."
//   · "avalia expressão" · "operação em O(1) para o mínimo"
//
// TEMPLATE stack monotónica (guarda ÍNDICES à espera de resposta):
//   const stack = [];
//   for (let i = 0; i < arr.length; i++) {
//     while (stack.length && arr[i] > arr[stack.at(-1)]) {   // i é a resposta do topo
//       const j = stack.pop(); resposta[j] = ...i...;
//     }
//     stack.push(i);
//   }
// Cada índice entra e sai 1 vez → O(n), apesar do while dentro do for.

// LC 739 — Daily Temperatures: quantos dias até uma temperatura mais quente?
function dailyTemperatures(temps) {
  const res = new Array(temps.length).fill(0); // 0 = nunca aquece
  const stack = []; // índices de dias ainda à espera de um dia mais quente
  for (let i = 0; i < temps.length; i++) {
    while (stack.length && temps[i] > temps[stack.at(-1)]) {
      const dia = stack.pop();
      res[dia] = i - dia;
    }
    stack.push(i);
  }
  return res;
}
// Tempo O(n) · Espaço O(n)
assert.deepEqual(dailyTemperatures([73, 74, 75, 71, 69, 72, 76, 73]), [1, 1, 4, 2, 1, 1, 0, 0]);
assert.deepEqual(dailyTemperatures([30, 30, 30]), [0, 0, 0]); // iguais não contam como "mais quente"
assert.deepEqual(dailyTemperatures([]), []);

// LC 150 — Evaluate Reverse Polish Notation: ["2","1","+","3","*"] = (2+1)*3
// Número → push. Operador → pop dois, calcula, push o resultado.
function evalRPN(tokens) {
  const stack = [];
  const ops = {
    "+": (a, b) => a + b,
    "-": (a, b) => a - b,
    "*": (a, b) => a * b,
    "/": (a, b) => Math.trunc(a / b), // enunciado: divisão corta em direção a zero
  };
  for (const t of tokens) {
    if (t in ops) {
      const b = stack.pop(), a = stack.pop(); // ORDEM: o segundo a sair é o da esquerda
      stack.push(ops[t](a, b));
    } else stack.push(Number(t));
  }
  return stack[0];
}
// Tempo O(n) · Espaço O(n)
assert.equal(evalRPN(["2", "1", "+", "3", "*"]), 9);
assert.equal(evalRPN(["4", "13", "5", "/", "+"]), 6);
assert.equal(evalRPN(["10", "6", "9", "3", "+", "-11", "*", "/", "*", "17", "+", "5", "+"]), 22);
assert.equal(evalRPN(["-7", "2", "/"]), -3); // trunc, não floor (floor daria -4)

// LC 155 — Min Stack: getMin() em O(1).
// Truque: uma 2ª stack guarda "o mínimo até aqui" ao lado de cada valor.
class MinStack {
  constructor() {
    this.valores = [];
    this.minimos = [];
  }
  push(x) {
    this.valores.push(x);
    this.minimos.push(Math.min(x, this.minimos.at(-1) ?? Infinity));
  }
  pop() {
    this.valores.pop();
    this.minimos.pop();
  }
  top() {
    return this.valores.at(-1);
  }
  getMin() {
    return this.minimos.at(-1);
  }
}
// Todas as operações O(1)
const ms = new MinStack();
ms.push(-2); ms.push(0); ms.push(-3);
assert.equal(ms.getMin(), -3);
ms.pop();
assert.equal(ms.top(), 0);
assert.equal(ms.getMin(), -2);

// =====================================================================================
// §6 ── PESQUISA BINÁRIA AVANÇADA ──────────
// =====================================================================================
// SINAIS NO ENUNCIADO: "ordenado (mas rodado)" · "em O(log n)" · "o MÍNIMO valor tal que..."
//   · "a menor velocidade/capacidade que consegue..." · n até 10^9 (não dá para testar todos)
//
// TEMPLATE "binária na resposta" (encontra o menor x onde funciona(x) é true):
//   let lo = minPossivel, hi = maxPossivel;
//   while (lo < hi) {
//     const mid = Math.floor((lo + hi) / 2);
//     if (funciona(mid)) hi = mid;   // mid serve; talvez haja menor
//     else lo = mid + 1;             // mid não serve; a resposta está acima
//   }
//   return lo;
// Só funciona se a resposta é "monótona": se x funciona, x+1 também funciona.

// LC 33 — Search in Rotated Sorted Array: [4,5,6,7,0,1,2]
// Em cada mid, UMA das metades está ordenada. Vê se o target está nessa metade.
function searchRotated(nums, target) {
  let lo = 0, hi = nums.length - 1;
  while (lo <= hi) {
    const mid = Math.floor((lo + hi) / 2);
    if (nums[mid] === target) return mid;
    if (nums[lo] <= nums[mid]) {
      // metade esquerda [lo..mid] está ordenada
      if (nums[lo] <= target && target < nums[mid]) hi = mid - 1;
      else lo = mid + 1;
    } else {
      // metade direita [mid..hi] está ordenada
      if (nums[mid] < target && target <= nums[hi]) lo = mid + 1;
      else hi = mid - 1;
    }
  }
  return -1;
}
// Tempo O(log n) · Espaço O(1)
assert.equal(searchRotated([4, 5, 6, 7, 0, 1, 2], 0), 4);
assert.equal(searchRotated([4, 5, 6, 7, 0, 1, 2], 3), -1);
assert.equal(searchRotated([1], 0), -1);
assert.equal(searchRotated([1], 1), 0);
assert.equal(searchRotated([3, 1], 1), 1);
assert.equal(searchRotated([1, 2, 3], 3), 2); // não rodado
assert.equal(searchRotated([], 5), -1);

// LC 875 — Koko Eating Bananas: menor velocidade k para comer tudo em h horas.
// Velocidade possível: de 1 até à maior pilha. Se k funciona, k+1 também → binária na resposta.
function minEatingSpeed(piles, h) {
  const horasCom = (k) => piles.reduce((total, p) => total + Math.ceil(p / k), 0);
  let lo = 1, hi = Math.max(...piles);
  while (lo < hi) {
    const mid = Math.floor((lo + hi) / 2);
    if (horasCom(mid) <= h) hi = mid;
    else lo = mid + 1;
  }
  return lo;
}
// Tempo O(n · log(maxPilha)) · Espaço O(1)
// ⚠️ Math.max(...arr) rebenta com arrays enormes (>~100k). Aí usa um for ou reduce.
assert.equal(minEatingSpeed([3, 6, 7, 11], 8), 4);
assert.equal(minEatingSpeed([30, 11, 23, 4, 20], 5), 30); // h = nº pilhas → maior pilha
assert.equal(minEatingSpeed([30, 11, 23, 4, 20], 6), 23);
assert.equal(minEatingSpeed([1], 1), 1);

// =====================================================================================
// §7 ── INTERVALOS ──────────
// =====================================================================================
// SINAIS NO ENUNCIADO: pares [início, fim] · "sobrepostos" · "junta" · "reuniões" · "insere"
//
// TEMPLATE: ORDENA POR INÍCIO e compara cada intervalo com o último do resultado.
//   Sobrepõem-se se: atual.inicio <= ultimo.fim
//   Juntar: ultimo.fim = Math.max(ultimo.fim, atual.fim)

// LC 56 — Merge Intervals
function merge(intervals) {
  const ord = intervals.map((x) => [...x]).sort((a, b) => a[0] - b[0]); // cópia: não estraga o input
  const res = [];
  for (const atual of ord) {
    const ultimo = res.at(-1);
    if (ultimo && atual[0] <= ultimo[1]) ultimo[1] = Math.max(ultimo[1], atual[1]);
    else res.push(atual);
  }
  return res;
}
// Tempo O(n log n) por causa do sort · Espaço O(n)
assert.deepEqual(merge([[1, 3], [2, 6], [8, 10], [15, 18]]), [[1, 6], [8, 10], [15, 18]]);
assert.deepEqual(merge([[1, 4], [4, 5]]), [[1, 5]]); // tocar conta como sobrepor
assert.deepEqual(merge([[1, 4], [2, 3]]), [[1, 4]]); // um dentro do outro → Math.max importa
assert.deepEqual(merge([[4, 7], [1, 4]]), [[1, 7]]); // input desordenado
assert.deepEqual(merge([]), []);

// LC 57 — Insert Interval (input já ordenado e sem sobreposições)
// Três fases: 1) os que acabam ANTES do novo  2) os que se sobrepõem → junta  3) os que vêm DEPOIS
function insert(intervals, novo) {
  const res = [];
  let i = 0;
  let [ini, fim] = novo;
  while (i < intervals.length && intervals[i][1] < ini) res.push(intervals[i++]);
  while (i < intervals.length && intervals[i][0] <= fim) {
    ini = Math.min(ini, intervals[i][0]);
    fim = Math.max(fim, intervals[i][1]);
    i++;
  }
  res.push([ini, fim]);
  while (i < intervals.length) res.push(intervals[i++]);
  return res;
}
// Tempo O(n) · Espaço O(n)
assert.deepEqual(insert([[1, 3], [6, 9]], [2, 5]), [[1, 5], [6, 9]]);
assert.deepEqual(insert([[1, 2], [3, 5], [6, 7], [8, 10], [12, 16]], [4, 8]), [[1, 2], [3, 10], [12, 16]]);
assert.deepEqual(insert([], [5, 7]), [[5, 7]]);
assert.deepEqual(insert([[1, 5]], [6, 8]), [[1, 5], [6, 8]]); // vai para o fim
assert.deepEqual(insert([[3, 5]], [1, 2]), [[1, 2], [3, 5]]); // vai para o início

// =====================================================================================
// §8 ── MATRIZ / GRELHA (DFS e BFS) ──────────
// =====================================================================================
// SINAIS NO ENUNCIADO: grid[][] · "ilhas" · "regiões ligadas" · "vizinhos cima/baixo/esq/dir"
//   · "minutos até..." / "menor nº de passos" (→ BFS) · "espalha-se" (→ BFS multi-origem)
//
// TEMPLATE direções + limites:
const DIRS = [[1, 0], [-1, 0], [0, 1], [0, -1]]; // baixo, cima, direita, esquerda
//   for (const [dl, dc] of DIRS) {
//     const nl = l + dl, nc = c + dc;
//     if (nl < 0 || nc < 0 || nl >= linhas || nc >= colunas) continue;  // fora da grelha
//     ...
//   }
// DFS = "visita tudo o que está ligado" (recursão). BFS = "distância/tempo mínimo" (fila).

// LC 200 — Number of Islands. Cada "1" ainda não visitado = nova ilha → afunda-a toda (DFS).
function numIslands(grid) {
  const g = grid.map((linha) => [...linha]); // cópia: vamos marcar visitados escrevendo "0"
  const linhas = g.length, colunas = g[0]?.length ?? 0;
  const afundar = (l, c) => {
    if (l < 0 || c < 0 || l >= linhas || c >= colunas || g[l][c] !== "1") return;
    g[l][c] = "0"; // marca ANTES de recursar, senão volta para trás infinitamente
    for (const [dl, dc] of DIRS) afundar(l + dl, c + dc);
  };
  let ilhas = 0;
  for (let l = 0; l < linhas; l++) {
    for (let c = 0; c < colunas; c++) {
      if (g[l][c] === "1") {
        ilhas++;
        afundar(l, c);
      }
    }
  }
  return ilhas;
}
// Tempo O(linhas · colunas) · Espaço O(linhas · colunas) (recursão no pior caso)
const ilhasGrid = [
  ["1", "1", "0", "0", "0"],
  ["1", "1", "0", "0", "0"],
  ["0", "0", "1", "0", "0"],
  ["0", "0", "0", "1", "1"],
];
assert.equal(numIslands(ilhasGrid), 3);
assert.equal(ilhasGrid[0][0], "1"); // o input original não foi estragado
assert.equal(numIslands([["0"]]), 0);
assert.equal(numIslands([["1"]]), 1);
assert.equal(numIslands([]), 0);

// LC 994 — Rotting Oranges (BFS MULTI-ORIGEM)
// 2 = podre, 1 = fresca, 0 = vazio. A cada minuto, as podres apodrecem as vizinhas.
// Todas as podres entram na fila ao mesmo tempo (minuto 0). Cada "nível" da fila = 1 minuto.
function orangesRotting(grid) {
  const g = grid.map((linha) => [...linha]);
  const linhas = g.length, colunas = g[0]?.length ?? 0;
  let fila = [], frescas = 0;
  for (let l = 0; l < linhas; l++) {
    for (let c = 0; c < colunas; c++) {
      if (g[l][c] === 2) fila.push([l, c]);
      if (g[l][c] === 1) frescas++;
    }
  }
  let minutos = 0;
  while (fila.length && frescas > 0) {
    const proxima = []; // nível seguinte (evita shift() O(n))
    for (const [l, c] of fila) {
      for (const [dl, dc] of DIRS) {
        const nl = l + dl, nc = c + dc;
        if (nl < 0 || nc < 0 || nl >= linhas || nc >= colunas || g[nl][nc] !== 1) continue;
        g[nl][nc] = 2;
        frescas--;
        proxima.push([nl, nc]);
      }
    }
    fila = proxima;
    minutos++;
  }
  return frescas === 0 ? minutos : -1; // sobrou fresca inalcançável → impossível
}
// Tempo O(linhas · colunas) · Espaço O(linhas · colunas)
assert.equal(orangesRotting([[2, 1, 1], [1, 1, 0], [0, 1, 1]]), 4);
assert.equal(orangesRotting([[2, 1, 1], [0, 1, 1], [1, 0, 1]]), -1);
assert.equal(orangesRotting([[0, 2]]), 0); // não há frescas
assert.equal(orangesRotting([[1]]), -1); // fresca sem podre nenhuma

// =====================================================================================
// §9 ── GRAFOS ──────────
// =====================================================================================
// SINAIS NO ENUNCIADO: "pré-requisitos" · "dependências" · "edges" / pares [a, b]
//   · "é possível terminar?" · "ordem válida" · "ciclo" · "ligados/conectados"
//
// TEMPLATE construir lista de adjacência a partir de pares [a, b]:
function construirGrafo(n, arestas) {
  const grafo = Array.from({ length: n }, () => []); // grafo[no] = vizinhos
  for (const [a, b] of arestas) grafo[a].push(b); // dirigido. Não dirigido: também grafo[b].push(a)
  return grafo;
}
assert.deepEqual(construirGrafo(3, [[0, 1], [0, 2]]), [[1, 2], [], []]);
// Percorrer: DFS/BFS como na grelha, mas os "vizinhos" são grafo[no]. Usa um Set `visitados`.

// LC 207 — Course Schedule (ordenação topológica, algoritmo de Kahn)
// prerequisites[i] = [curso, preRequisito] → aresta preRequisito → curso.
// grauEntrada[x] = quantos pré-requisitos faltam a x. Começa pelos que têm 0.
// Se conseguires "tirar" todos os cursos → não há ciclo → true.
function canFinish(numCourses, prerequisites) {
  const grafo = Array.from({ length: numCourses }, () => []);
  const grauEntrada = new Array(numCourses).fill(0);
  for (const [curso, pre] of prerequisites) {
    grafo[pre].push(curso);
    grauEntrada[curso]++;
  }
  const fila = [];
  for (let i = 0; i < numCourses; i++) if (grauEntrada[i] === 0) fila.push(i);
  let feitos = 0;
  for (let i = 0; i < fila.length; i++) {
    // fila[i] em vez de shift(): O(1)
    feitos++;
    for (const prox of grafo[fila[i]]) {
      grauEntrada[prox]--;
      if (grauEntrada[prox] === 0) fila.push(prox);
    }
  }
  return feitos === numCourses; // a `fila` final é uma ordem válida (LC 210 Course Schedule II)
}
// Tempo O(V + E) (nós + arestas) · Espaço O(V + E)
assert.equal(canFinish(2, [[1, 0]]), true);
assert.equal(canFinish(2, [[1, 0], [0, 1]]), false); // ciclo
assert.equal(canFinish(1, []), true);
assert.equal(canFinish(4, [[1, 0], [2, 1], [3, 2], [1, 3]]), false); // ciclo 1→2→3→1
assert.equal(canFinish(3, [[1, 0], [2, 0]]), true);

// =====================================================================================
// §10 ── BACKTRACKING ──────────
// =====================================================================================
// SINAIS NO ENUNCIADO: "TODAS as combinações / subconjuntos / permutações" · "gera todos"
//   · n pequeno (≤ 20) · "todas as formas de..."
//
// TEMPLATE escolher → explorar → desfazer:
//   const res = [], atual = [];
//   function bt(inicio) {
//     if (cheguei ao fim) { res.push([...atual]); return; }   // ⚠️ CÓPIA: [...atual]
//     for (let i = inicio; i < n; i++) {
//       atual.push(nums[i]);   // escolher
//       bt(i + 1);             // explorar
//       atual.pop();           // desfazer (volta ao estado anterior)
//     }
//   }
// Desenha a árvore de decisões no papel. Cada nó = uma chamada bt.

// LC 78 — Subsets: cada nó da árvore é um subconjunto válido → guarda logo à entrada.
function subsets(nums) {
  const res = [], atual = [];
  function bt(inicio) {
    res.push([...atual]);
    for (let i = inicio; i < nums.length; i++) {
      atual.push(nums[i]);
      bt(i + 1); // i + 1: não reutiliza e não volta atrás (evita [2,1] depois de [1,2])
      atual.pop();
    }
  }
  bt(0);
  return res;
}
// Tempo O(n · 2^n) · Espaço O(n) de recursão (fora o output)
mesmoConjunto(subsets([1, 2, 3]), [[], [1], [2], [3], [1, 2], [1, 3], [2, 3], [1, 2, 3]]);
assert.deepEqual(subsets([]), [[]]);
assert.equal(subsets([1, 2, 3, 4]).length, 16); // 2^4

// LC 46 — Permutations: a ordem importa → todos os índices em cada nível, com `usado`.
function permute(nums) {
  const res = [], atual = [], usado = new Array(nums.length).fill(false);
  function bt() {
    if (atual.length === nums.length) {
      res.push([...atual]);
      return;
    }
    for (let i = 0; i < nums.length; i++) {
      if (usado[i]) continue;
      usado[i] = true;
      atual.push(nums[i]);
      bt();
      atual.pop();
      usado[i] = false;
    }
  }
  bt();
  return res;
}
// Tempo O(n · n!) · Espaço O(n)
assert.deepEqual(
  permute([1, 2, 3]).map(String).sort(), // ordena a lista, mas NÃO dentro de cada permutação
  ["1,2,3", "1,3,2", "2,1,3", "2,3,1", "3,1,2", "3,2,1"]
);
assert.deepEqual(permute([1]), [[1]]);

// LC 39 — Combination Sum: pode reutilizar o mesmo número → bt(i), não bt(i + 1).
function combinationSum(candidates, target) {
  const res = [], atual = [];
  function bt(inicio, resto) {
    if (resto === 0) {
      res.push([...atual]);
      return;
    }
    if (resto < 0) return; // passou do alvo: corta este ramo
    for (let i = inicio; i < candidates.length; i++) {
      atual.push(candidates[i]);
      bt(i, resto - candidates[i]); // i (não i+1): o mesmo número pode repetir
      atual.pop();
    }
  }
  bt(0, target);
  return res;
}
// Tempo exponencial ~O(2^target) · Espaço O(target) de recursão
mesmoConjunto(combinationSum([2, 3, 6, 7], 7), [[2, 2, 3], [7]]);
mesmoConjunto(combinationSum([2, 3, 5], 8), [[2, 2, 2, 2], [2, 3, 3], [3, 5]]);
assert.deepEqual(combinationSum([2], 1), []);

// =====================================================================================
// §11 ── HEAP (fila de prioridade) ──────────
// =====================================================================================
// SINAIS NO ENUNCIADO: "k-ésimo maior/menor" · "os k mais..." · "sempre o mínimo atual"
//   · "junta k listas ordenadas" · dados em stream
//
// JS NÃO TEM HEAP NATIVA. Em entrevista: pergunta "posso assumir uma MinHeap?" — muitos dizem que sim.
// Se não, esta escreve-se em ~5 min. Ideia: array onde o pai de i está em (i-1)/2 e o menor fica em [0].
class MinHeap {
  constructor() {
    this.a = [];
  }
  get size() {
    return this.a.length;
  }
  peek() {
    return this.a[0];
  }
  push(x) {
    const a = this.a;
    a.push(x);
    let i = a.length - 1;
    while (i > 0) {
      const pai = Math.floor((i - 1) / 2);
      if (a[pai] <= a[i]) break; // pai já é menor: está no sítio
      [a[pai], a[i]] = [a[i], a[pai]]; // sobe
      i = pai;
    }
  }
  pop() {
    const a = this.a;
    const topo = a[0];
    const ultimo = a.pop();
    if (a.length) {
      a[0] = ultimo; // põe o último no topo e deixa-o "afundar"
      let i = 0;
      while (true) {
        const e = 2 * i + 1, d = 2 * i + 2;
        let menor = i;
        if (e < a.length && a[e] < a[menor]) menor = e;
        if (d < a.length && a[d] < a[menor]) menor = d;
        if (menor === i) break;
        [a[menor], a[i]] = [a[i], a[menor]];
        i = menor;
      }
    }
    return topo;
  }
}
// push/pop O(log n) · peek O(1)
const heapTeste = new MinHeap();
for (const x of [5, 3, 8, 1, 9, 1, -2]) heapTeste.push(x);
assert.equal(heapTeste.peek(), -2);
const saida = [];
while (heapTeste.size) saida.push(heapTeste.pop());
assert.deepEqual(saida, [-2, 1, 1, 3, 5, 8, 9]); // sai sempre ordenado
assert.equal(new MinHeap().pop(), undefined);

// LC 215 — Kth Largest Element in an Array
// Truque: MinHeap com no máximo k elementos. O topo (o menor dos k maiores) = k-ésimo maior.
function findKthLargest(nums, k) {
  const heap = new MinHeap();
  for (const n of nums) {
    heap.push(n);
    if (heap.size > k) heap.pop(); // deita fora o mais pequeno: nunca será o k-ésimo maior
  }
  return heap.peek();
}
// Tempo O(n log k) · Espaço O(k)
// ALTERNATIVA aceitável em entrevista (diz a complexidade!): ordenar → O(n log n)
const kthLargestSort = (nums, k) => [...nums].sort((a, b) => b - a)[k - 1];
assert.equal(findKthLargest([3, 2, 1, 5, 6, 4], 2), 5);
assert.equal(findKthLargest([3, 2, 3, 1, 2, 4, 5, 5, 6], 4), 4); // duplicados contam
assert.equal(findKthLargest([1], 1), 1);
assert.equal(findKthLargest([-1, -5, -3], 1), -1);
assert.equal(kthLargestSort([3, 2, 1, 5, 6, 4], 2), 5);

// =====================================================================================
// §12 ── PROGRAMAÇÃO DINÂMICA ──────────
// =====================================================================================
// SINAIS NO ENUNCIADO: "número de formas" · "mínimo/máximo de..." · "é possível...?"
//   · "não podes escolher adjacentes" · "subsequência mais longa" · escolhas que dependem das anteriores
//
// COMO ENCONTRAR A RECORRÊNCIA (3 perguntas, escreve-as no quadro):
//   1. ESTADO:     o que significa dp[i]? Em PALAVRAS. Ex: "o máximo que consigo roubar nas casas 0..i"
//   2. TRANSIÇÃO:  como calculo dp[i] a partir de valores mais pequenos? Pensa na ÚLTIMA decisão.
//                  Ex: "ou roubo a casa i (dp[i-2] + casa[i]) ou não (dp[i-1])"
//   3. BASE:       os casos pequenos que não dependem de nada. Ex: dp[0] = casa[0]
//
// DUAS FORMAS (dão o mesmo resultado):
//   MEMO (top-down):  recursão normal + Map para não recalcular. Mais fácil de pensar.
//   TABELA (bottom-up): array dp preenchido do pequeno para o grande com um for. Sem recursão.
//   Em entrevista: começa por MEMO se a recorrência te sai mais natural; converte se pedirem.

// LC 198 — House Robber: não podes roubar casas vizinhas.
// Versão MEMO
function robMemo(nums) {
  const memo = new Map();
  function melhorAte(i) {
    if (i < 0) return 0; // base: sem casas
    if (memo.has(i)) return memo.get(i);
    const r = Math.max(melhorAte(i - 1), melhorAte(i - 2) + nums[i]); // salta a i, ou rouba a i
    memo.set(i, r);
    return r;
  }
  return melhorAte(nums.length - 1);
}
// Versão TABELA (só precisas dos 2 últimos → espaço O(1))
function rob(nums) {
  let antesDoAnterior = 0, anterior = 0;
  for (const casa of nums) {
    const atual = Math.max(anterior, antesDoAnterior + casa);
    antesDoAnterior = anterior;
    anterior = atual;
  }
  return anterior;
}
// Tempo O(n) · Espaço O(1) (memo: O(n))
for (const f of [rob, robMemo]) {
  assert.equal(f([1, 2, 3, 1]), 4);
  assert.equal(f([2, 7, 9, 3, 1]), 12);
  assert.equal(f([]), 0);
  assert.equal(f([5]), 5);
  assert.equal(f([2, 1, 1, 2]), 4); // salta 2 casas seguidas
}

// LC 322 — Coin Change: menor nº de moedas para fazer `amount`.
// Estado: dp[v] = menor nº de moedas para fazer o valor v.
// Transição: dp[v] = 1 + min(dp[v - moeda]) para cada moeda.  Base: dp[0] = 0.
// ⚠️ Guloso (maior moeda primeiro) FALHA: [1,3,4], 6 → guloso 4+1+1 = 3 moedas; certo 3+3 = 2.
function coinChange(coins, amount) {
  const dp = new Array(amount + 1).fill(Infinity);
  dp[0] = 0;
  for (let v = 1; v <= amount; v++) {
    for (const moeda of coins) {
      if (moeda <= v) dp[v] = Math.min(dp[v], dp[v - moeda] + 1);
    }
  }
  return dp[amount] === Infinity ? -1 : dp[amount];
}
// Tempo O(amount · nº moedas) · Espaço O(amount)
assert.equal(coinChange([1, 2, 5], 11), 3); // 5+5+1
assert.equal(coinChange([2], 3), -1);
assert.equal(coinChange([1], 0), 0);
assert.equal(coinChange([1, 3, 4], 6), 2); // guloso daria 3

// LC 300 — Longest Increasing Subsequence (subsequência: não precisa de ser contígua)
// Estado: dp[i] = tamanho da maior subsequência crescente QUE ACABA em nums[i].
// Transição: dp[i] = 1 + max(dp[j]) para j < i com nums[j] < nums[i].  Base: dp[i] = 1.
function lengthOfLIS(nums) {
  if (nums.length === 0) return 0;
  const dp = new Array(nums.length).fill(1);
  for (let i = 1; i < nums.length; i++) {
    for (let j = 0; j < i; j++) {
      if (nums[j] < nums[i]) dp[i] = Math.max(dp[i], dp[j] + 1);
    }
  }
  return Math.max(...dp); // a resposta pode acabar em qualquer i
}
// Tempo O(n²) · Espaço O(n)   (existe O(n log n) com binária; O(n²) é aceite em entrevista)
assert.equal(lengthOfLIS([10, 9, 2, 5, 3, 7, 101, 18]), 4); // 2,3,7,101
assert.equal(lengthOfLIS([0, 1, 0, 3, 2, 3]), 4);
assert.equal(lengthOfLIS([7, 7, 7, 7]), 1); // "estritamente" crescente: iguais não contam
assert.equal(lengthOfLIS([]), 0);

// LC 1143 — Longest Common Subsequence (DP 2D com duas strings)
// Estado: dp[i][j] = LCS de a[0..i-1] e b[0..j-1]  (+1 linha/coluna de zeros = base "string vazia")
// Transição: letras iguais → dp[i-1][j-1] + 1 ; diferentes → max(dp[i-1][j], dp[i][j-1])
function longestCommonSubsequence(a, b) {
  const dp = Array.from({ length: a.length + 1 }, () => new Array(b.length + 1).fill(0));
  for (let i = 1; i <= a.length; i++) {
    for (let j = 1; j <= b.length; j++) {
      if (a[i - 1] === b[j - 1]) dp[i][j] = dp[i - 1][j - 1] + 1; // i-1 porque dp tem +1 de tamanho
      else dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
    }
  }
  return dp[a.length][b.length];
}
// Tempo O(n · m) · Espaço O(n · m)
assert.equal(longestCommonSubsequence("abcde", "ace"), 3);
assert.equal(longestCommonSubsequence("abc", "abc"), 3);
assert.equal(longestCommonSubsequence("abc", "def"), 0);
assert.equal(longestCommonSubsequence("", "abc"), 0);

// LC 62 — Unique Paths: robô em m×n, só anda para a direita ou para baixo.
// Estado: dp[l][c] = nº de caminhos até (l, c). Transição: vem de cima + vem da esquerda.
// Base: 1ª linha e 1ª coluna = 1 (só há um caminho: sempre em frente).
function uniquePaths(m, n) {
  const dp = Array.from({ length: m }, () => new Array(n).fill(1));
  for (let l = 1; l < m; l++) {
    for (let c = 1; c < n; c++) dp[l][c] = dp[l - 1][c] + dp[l][c - 1];
  }
  return dp[m - 1][n - 1];
}
// Tempo O(m · n) · Espaço O(m · n)
assert.equal(uniquePaths(3, 7), 28);
assert.equal(uniquePaths(3, 2), 3);
assert.equal(uniquePaths(1, 1), 1);

// =====================================================================================
// §13 ── LISTAS LIGADAS (médio) ──────────
// =====================================================================================
// SINAIS NO ENUNCIADO: `head` · "remove o n-ésimo a contar do fim" · "numa só passagem"
//   · "dígitos em ordem inversa" · "devolve a nova cabeça"
//
// TEMPLATE nó dummy: evita o caso especial "e se tiver de mexer na cabeça?"
//   const dummy = new ListNode(0, head); ...mexe a partir de dummy...; return dummy.next;
class ListNode {
  constructor(val, next = null) {
    this.val = val;
    this.next = next;
  }
}
const toList = (arr) => arr.reduceRight((next, val) => new ListNode(val, next), null);
const toArray = (head) => {
  const out = [];
  for (let n = head; n; n = n.next) out.push(n.val);
  return out;
};

// LC 19 — Remove Nth Node From End of List (uma passagem)
// Dois ponteiros com um intervalo de n: quando o `rapido` chega ao fim, o `lento` está ANTES do alvo.
function removeNthFromEnd(head, n) {
  const dummy = new ListNode(0, head); // se o alvo for a cabeça, o lento fica no dummy
  let rapido = dummy, lento = dummy;
  for (let i = 0; i <= n; i++) rapido = rapido.next; // n + 1 passos de avanço
  while (rapido) {
    rapido = rapido.next;
    lento = lento.next;
  }
  lento.next = lento.next.next; // salta o alvo
  return dummy.next;
}
// Tempo O(n) · Espaço O(1)
assert.deepEqual(toArray(removeNthFromEnd(toList([1, 2, 3, 4, 5]), 2)), [1, 2, 3, 5]);
assert.deepEqual(toArray(removeNthFromEnd(toList([1]), 1)), []);
assert.deepEqual(toArray(removeNthFromEnd(toList([1, 2]), 2)), [2]); // remove a cabeça
assert.deepEqual(toArray(removeNthFromEnd(toList([1, 2]), 1)), [1]);

// LC 2 — Add Two Numbers: dígitos em ordem inversa (342 → 2→4→3). Soma como na escola, com "vai um".
function addTwoNumbers(l1, l2) {
  const dummy = new ListNode(0);
  let cauda = dummy, vaiUm = 0;
  while (l1 || l2 || vaiUm) {
    // `|| vaiUm`: 5+5 = 10 precisa de um nó extra no fim
    const soma = (l1?.val ?? 0) + (l2?.val ?? 0) + vaiUm;
    vaiUm = Math.floor(soma / 10);
    cauda.next = new ListNode(soma % 10);
    cauda = cauda.next;
    l1 = l1?.next;
    l2 = l2?.next;
  }
  return dummy.next;
}
// Tempo O(max(n, m)) · Espaço O(max(n, m)) para o resultado
assert.deepEqual(toArray(addTwoNumbers(toList([2, 4, 3]), toList([5, 6, 4]))), [7, 0, 8]); // 342 + 465 = 807
assert.deepEqual(toArray(addTwoNumbers(toList([0]), toList([0]))), [0]);
assert.deepEqual(toArray(addTwoNumbers(toList([9, 9, 9, 9]), toList([9, 9]))), [8, 9, 0, 0, 1]); // tamanhos diferentes
assert.deepEqual(toArray(addTwoNumbers(toList([5]), toList([5]))), [0, 1]); // vai-um no fim

// =====================================================================================
// §14 ── ÁRVORES (médio) ──────────
// =====================================================================================
// SINAIS NO ENUNCIADO: `root` · "BST válida" · "antepassado comum" · "nível a nível"
//   · "vista da direita" · "profundidade mínima"
//
// TEMPLATE DFS com informação a descer (parâmetros) e a subir (return):
//   function dfs(node, infoDeCima) {
//     if (!node) return valorBase;
//     const esq = dfs(node.left, ...), dir = dfs(node.right, ...);
//     return combina(node, esq, dir);
//   }
class TreeNode {
  constructor(val, left = null, right = null) {
    this.val = val;
    this.left = left;
    this.right = right;
  }
}
// helper: array estilo LeetCode [3,9,20,null,null,15,7] → árvore (preenche nível a nível)
function toTree(arr) {
  if (!arr.length || arr[0] === null) return null;
  const root = new TreeNode(arr[0]), fila = [root];
  let i = 1;
  for (let f = 0; f < fila.length && i < arr.length; f++) {
    const no = fila[f];
    if (i < arr.length && arr[i] !== null) fila.push((no.left = new TreeNode(arr[i])));
    i++;
    if (i < arr.length && arr[i] !== null) fila.push((no.right = new TreeNode(arr[i])));
    i++;
  }
  return root;
}

// LC 98 — Validate Binary Search Tree
// ⚠️ Armadilha: comparar só com os filhos diretos NÃO chega. Em [5,4,6,null,null,3,7]
// o 3 está à direita do 5 (tem de ser > 5) mas é menor. Passa LIMITES (min, max) para baixo.
function isValidBST(node, min = -Infinity, max = Infinity) {
  if (!node) return true;
  if (node.val <= min || node.val >= max) return false; // BST do LeetCode: sem iguais
  return isValidBST(node.left, min, node.val) && isValidBST(node.right, node.val, max);
}
// Tempo O(n) · Espaço O(altura)
assert.equal(isValidBST(toTree([2, 1, 3])), true);
assert.equal(isValidBST(toTree([5, 1, 4, null, null, 3, 6])), false);
assert.equal(isValidBST(toTree([5, 4, 6, null, null, 3, 7])), false); // a armadilha
assert.equal(isValidBST(toTree([2, 2, 2])), false); // iguais
assert.equal(isValidBST(null), true);
assert.equal(isValidBST(toTree([-2147483648])), true); // valor mínimo: por isso -Infinity e não um número

// LC 236 — Lowest Common Ancestor of a Binary Tree
// Cada chamada devolve "encontrei p ou q aqui em baixo" (o nó) ou null.
// Se a esquerda E a direita encontraram algo → este nó é o antepassado comum.
function lowestCommonAncestor(node, p, q) {
  if (!node || node === p || node === q) return node;
  const esq = lowestCommonAncestor(node.left, p, q);
  const dir = lowestCommonAncestor(node.right, p, q);
  if (esq && dir) return node;
  return esq ?? dir;
}
// Tempo O(n) · Espaço O(altura)
const lcaRaiz = toTree([3, 5, 1, 6, 2, 0, 8, null, null, 7, 4]);
const acharNo = (node, val) => (!node ? null : node.val === val ? node : acharNo(node.left, val) ?? acharNo(node.right, val));
assert.equal(lowestCommonAncestor(lcaRaiz, acharNo(lcaRaiz, 5), acharNo(lcaRaiz, 1)).val, 3);
assert.equal(lowestCommonAncestor(lcaRaiz, acharNo(lcaRaiz, 5), acharNo(lcaRaiz, 4)).val, 5); // um é antepassado do outro
assert.equal(lowestCommonAncestor(lcaRaiz, acharNo(lcaRaiz, 7), acharNo(lcaRaiz, 8)).val, 3);

// LC 102 — Binary Tree Level Order Traversal (BFS por níveis)
function levelOrder(root) {
  if (!root) return [];
  const niveis = [];
  let fila = [root];
  while (fila.length) {
    niveis.push(fila.map((n) => n.val));
    const proxima = [];
    for (const n of fila) {
      if (n.left) proxima.push(n.left);
      if (n.right) proxima.push(n.right);
    }
    fila = proxima;
  }
  return niveis;
}
// Tempo O(n) · Espaço O(n)
// Variações com o MESMO código: LC 199 Right Side View = último de cada nível; LC 103 Zigzag = inverte níveis ímpares.
assert.deepEqual(levelOrder(toTree([3, 9, 20, null, null, 15, 7])), [[3], [9, 20], [15, 7]]);
assert.deepEqual(levelOrder(toTree([1])), [[1]]);
assert.deepEqual(levelOrder(null), []);
assert.deepEqual(levelOrder(toTree([1, 2, null, 3])), [[1], [2], [3]]); // árvore torta

// =====================================================================================
// §15 ── TABELA FINAL: SINAL NO ENUNCIADO → PADRÃO ──────────
// =====================================================================================
/*
  SINAL NO ENUNCIADO                                   → PADRÃO                          §
  ---------------------------------------------------------------------------------------------
  "subarray com soma K" (com negativos)                → prefix sum + Map                 §2
  "agrupa", "anagramas", "conta", "já apareceu?"       → Map / Set                        §2
  "k mais frequentes"                                  → Map + bucket sort (ou sort)      §2
  "ordenado", "par/trio com soma X"                    → dois ponteiros                   §3
  "substring/subarray contínuo mais longo/curto"       → janela deslizante                §4
  "todas as posições de um anagrama/permutação"        → janela FIXA + contagem           §4
  "próximo maior/menor", "quantos dias até"            → stack monotónica                 §5
  "parênteses", "expressão", "desfazer"                → stack                            §5
  "O(log n)", "ordenado mas rodado"                    → pesquisa binária                 §6
  "menor velocidade/capacidade que consegue"           → binária na resposta              §6
  "intervalos", "reuniões", "sobrepostos"              → ordena por início + junta        §7
  "grid", "ilhas", "regiões"                           → DFS na grelha                    §8
  "menor nº de passos", "minutos até espalhar"         → BFS (multi-origem)               §8
  "pré-requisitos", "dependências", "ordem válida"     → grafo + Kahn (topológica)        §9
  "todas as combinações/subconjuntos/permutações"      → backtracking                     §10
  "k-ésimo maior", "top k", "o mínimo sempre"          → heap (ou sort)                   §11
  "nº de formas", "mín/máx de...", "é possível?"       → programação dinâmica             §12
  "remove do fim", "numa passagem" (lista)             → dummy + dois ponteiros           §13
  "BST válida", "antepassado comum", "por níveis"      → DFS com limites / BFS            §14

  QUE COMPLEXIDADE O n PERMITE (≈ 10^8 operações simples por segundo):
    n ≤ 10–12       → O(n!)        permutações
    n ≤ 20          → O(2^n)       subconjuntos / backtracking
    n ≤ 500         → O(n³)
    n ≤ 10^3–10^4   → O(n²)        dois for, DP 2D
    n ≤ 10^5–10^6   → O(n log n)   sort, heap, binária dentro de um for
    n ≤ 10^8        → O(n)         um loop, Map, dois ponteiros, janela
    n > 10^8 / 10^9 → O(log n) ou O(1)   binária, matemática
  Ex.: "1 <= nums.length <= 10^5" → esperam O(n) ou O(n log n). Dois for vai dar Time Limit.

  CUSTOS ESCONDIDOS EM JS:
    arr.shift(), arr.unshift(), arr.includes(), arr.indexOf(), arr.splice(), arr.slice() → O(n)
    [...arr], arr.join(), str + str dentro de loop → O(n) cada
    sort() → O(n log n)       Map/Set get/has/set/add/delete → O(1) em média
*/

// =====================================================================================
// §16 ── PLANO DE 7 DIAS ──────────
// =====================================================================================
/*
  Regras do treino:
    - 25 min sozinho por problema. Bloqueado? Lê só o SINAL e o TEMPLATE da secção. Mais 10 min.
    - Ainda bloqueado → lê a solução, fecha, e reescreve-a de memória. Isso conta.
    - Fala em voz alta enquanto escreves (treina a entrevista, não só o código).
    - No fim de cada problema: diz a complexidade e escreve 2 casos limite.
    - "Revisão" = reescrever do zero, sem olhar, um problema de um dia anterior.

  DIA 1 — Hash map (o mais importante para strings/arrays)
    49 Group Anagrams · 347 Top K Frequent · 128 Longest Consecutive Sequence
    + aquecimento fácil: 1 Two Sum, 242 Valid Anagram
  DIA 2 — Prefix sum + dois ponteiros
    560 Subarray Sum Equals K · 15 3Sum · 11 Container With Most Water
    + revisão: 49
  DIA 3 — Janela deslizante (strings!)
    3 Longest Substring Without Repeating · 424 Longest Repeating Char Replacement · 438 Find All Anagrams
    + revisão: 560, 15
  DIA 4 — Stack + binária + intervalos
    739 Daily Temperatures · 155 Min Stack · 33 Search in Rotated Sorted Array · 56 Merge Intervals
    + revisão: 3
  DIA 5 — Grelha, grafos, listas e árvores
    200 Number of Islands · 207 Course Schedule · 19 Remove Nth From End · 102 Level Order
    + revisão: 438, 56
  DIA 6 — DP + backtracking + heap
    198 House Robber · 322 Coin Change · 78 Subsets · 215 Kth Largest (com sort primeiro, depois heap)
    + revisão: 347, 739
  DIA 7 — Simulação de entrevista (sem olhar para este ficheiro)
    Escolhe 2 que ainda não fizeste: 238 Product of Array Except Self, 5 Longest Palindromic Substring
    (ou 875 Koko, 57 Insert Interval, 994 Rotting Oranges, 98 Validate BST).
    45 min cada, em voz alta, com o checklist do §1. Depois revê os que falharam nos dias 1–6.
    Na véspera: relê só §1 e §15. Dorme.

  Se só tiveres tempo para 10: 49, 347, 560, 15, 3, 438, 56, 739, 200, 322.
*/

console.log("✅ Médio OK");
