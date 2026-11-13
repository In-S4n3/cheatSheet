// LEETCODE PATTERNS (nível fácil) — JavaScript
// Corre com: node LeetCode-Patterns.js   → se nada rebentar, todos os exemplos estão certos.
// Cada secção: QUANDO usar → TEMPLATE → problema real resolvido → teste.

const assert = require("node:assert/strict");

// =====================================================================================
// 0. COMO ATACAR UM PROBLEMA (antes de escrever código)
// =====================================================================================
/*
  1. Lê os exemplos e escreve tu próprio 1 caso pequeno + 1 caso limite (array vazio, 1 elemento, negativos, repetidos).
  2. Resolve À MÃO no papel. O que é que os teus olhos fizeram? Isso é o algoritmo.
  3. Primeiro a solução bruta (dois for). Funciona? Ótimo. Depois pergunta:
       "estou a procurar algo repetidamente?"  → Map/Set (secção 2)
       "o array está ordenado?"               → dois ponteiros (3) ou pesquisa binária (6)
       "subarray/substring contínuo?"         → janela deslizante (4) ou soma de prefixos (5)
       "parênteses / desfazer / mais recente?" → stack (7)
       "árvore ou lista ligada?"              → recursão (8, 9)
  4. Testa com os teus casos ANTES de submeter.

  Complexidade (Big O) — quantas operações em função de n:
    O(1)        acesso arr[i], map.get, set.has, push/pop
    O(log n)    pesquisa binária (cortas metade de cada vez)
    O(n)        um loop
    O(n log n)  sort()
    O(n²)       loop dentro de loop  ← normalmente é o que o LeetCode quer que evites
    ⚠️ arr.includes(), arr.indexOf(), arr.shift(), arr.splice() são O(n) — dentro de um loop dá O(n²).
*/

// =====================================================================================
// 1. ARMADILHAS DE JS QUE FALHAM TESTES
// =====================================================================================

// sort() SEM função compara como TEXTO (MDN: converte para string).
assert.deepEqual([10, 1, 2].sort(), [1, 10, 2]); // 😱
assert.deepEqual([10, 1, 2].sort((a, b) => a - b), [1, 2, 10]); // crescente
assert.deepEqual([10, 1, 2].sort((a, b) => b - a), [10, 2, 1]); // decrescente
// sort() ALTERA o array original. toSorted() devolve um novo.
const orig = [3, 1, 2];
const copia = orig.toSorted((a, b) => a - b);
assert.deepEqual(orig, [3, 1, 2]);
assert.deepEqual(copia, [1, 2, 3]);

// Divisão inteira: JS não tem. Usa Math.floor (ou Math.trunc para negativos a cortar em direção a 0).
assert.equal(7 / 2, 3.5);
assert.equal(Math.floor(7 / 2), 3);
assert.equal(Math.trunc(-7 / 2), -3); // Math.floor(-3.5) seria -4

// Strings são imutáveis: s[0] = "x" não faz nada. Converte para array.
const s = "abc";
const arr = s.split(""); // ou [...s]
arr[0] = "x";
assert.equal(arr.join(""), "xbc");

// Comparar arrays/objetos com === compara a REFERÊNCIA, não o conteúdo.
assert.equal([1, 2] === [1, 2], false);
assert.equal([1, 2].join() === [1, 2].join(), true); // truque simples para arrays de primitivos

// Infinity é o melhor valor inicial para "mínimo" / -Infinity para "máximo".
let min = Infinity;
for (const n of [5, 3, 8]) min = Math.min(min, n);
assert.equal(min, 3);

// Array preenchido: new Array(n).fill(0). Matriz: NÃO uses fill([]) (partilha o mesmo array!).
const matriz = Array.from({ length: 2 }, () => new Array(3).fill(0));
matriz[0][0] = 1;
assert.deepEqual(matriz, [[1, 0, 0], [0, 0, 0]]);

// Último elemento: arr.at(-1) (MDN: índice negativo conta do fim).
assert.equal([1, 2, 3].at(-1), 3);

// Caracteres ↔ números (útil em "letras", "cifras", "a-z")
assert.equal("a".charCodeAt(0), 97);
assert.equal(String.fromCharCode(98), "b");
assert.equal("c".charCodeAt(0) - "a".charCodeAt(0), 2); // posição no alfabeto

// Dígitos de um número
assert.deepEqual(String(1234).split("").map(Number), [1, 2, 3, 4]);
let num = 1234, somaDigitos = 0;
while (num > 0) {
  somaDigitos += num % 10; // último dígito
  num = Math.floor(num / 10); // tira o último dígito
}
assert.equal(somaDigitos, 10);

// =====================================================================================
// 2. HASH MAP / SET — "já vi isto antes?" / "quantas vezes aparece?"
// =====================================================================================
// QUANDO: procurar um valor repetidamente, contar frequências, detetar duplicados.
// Map > Object para contar: aceita qualquer tipo de chave e tem .size (MDN).

// TEMPLATE contar frequências
function contar(itens) {
  const freq = new Map();
  for (const x of itens) freq.set(x, (freq.get(x) ?? 0) + 1);
  return freq;
}
assert.equal(contar("banana").get("a"), 3);

// LC 1 — Two Sum: índices de dois números que somam target.
// Bruta: dois for O(n²). Truque: guarda o que já viste; procura o "complemento".
function twoSum(nums, target) {
  const visto = new Map(); // valor → índice
  for (let i = 0; i < nums.length; i++) {
    const falta = target - nums[i];
    if (visto.has(falta)) return [visto.get(falta), i];
    visto.set(nums[i], i);
  }
  return [];
}
assert.deepEqual(twoSum([2, 7, 11, 15], 9), [0, 1]);
assert.deepEqual(twoSum([3, 3], 6), [0, 1]);

// LC 217 — Contains Duplicate
const containsDuplicate = (nums) => new Set(nums).size !== nums.length;
assert.equal(containsDuplicate([1, 2, 3, 1]), true);
assert.equal(containsDuplicate([1, 2, 3]), false);

// LC 242 — Valid Anagram: mesmas letras, mesma quantidade.
function isAnagram(a, b) {
  if (a.length !== b.length) return false;
  const freq = contar(a);
  for (const ch of b) {
    if (!freq.get(ch)) return false; // undefined ou 0
    freq.set(ch, freq.get(ch) - 1);
  }
  return true;
}
assert.equal(isAnagram("anagram", "nagaram"), true);
assert.equal(isAnagram("rat", "car"), false);

// LC 387 — First Unique Character
function firstUniqChar(s) {
  const freq = contar(s);
  for (let i = 0; i < s.length; i++) if (freq.get(s[i]) === 1) return i;
  return -1;
}
assert.equal(firstUniqChar("leetcode"), 0);
assert.equal(firstUniqChar("aabb"), -1);

// Agrupar (ex.: anagramas juntos): chave = forma "normalizada"
function groupAnagrams(words) {
  const grupos = new Map();
  for (const w of words) {
    const chave = [...w].sort().join("");
    if (!grupos.has(chave)) grupos.set(chave, []);
    grupos.get(chave).push(w);
  }
  return [...grupos.values()];
}
assert.deepEqual(groupAnagrams(["eat", "tea", "tan", "nat"]), [["eat", "tea"], ["tan", "nat"]]);

// =====================================================================================
// 3. DOIS PONTEIROS — um em cada ponta, ou um lento + um rápido
// =====================================================================================
// QUANDO: array/string ordenado, palíndromos, inverter, remover in-place.

// TEMPLATE pontas opostas
//   let l = 0, r = arr.length - 1;
//   while (l < r) { ...; l++ ou r-- }

// LC 125 — Valid Palindrome (ignora não-alfanuméricos e maiúsculas)
function isPalindrome(s) {
  const limpo = s.toLowerCase().replace(/[^a-z0-9]/g, "");
  let l = 0, r = limpo.length - 1;
  while (l < r) {
    if (limpo[l] !== limpo[r]) return false;
    l++;
    r--;
  }
  return true;
}
assert.equal(isPalindrome("A man, a plan, a canal: Panama"), true);
assert.equal(isPalindrome("race a car"), false);

// LC 344 — Reverse String in-place (troca com destructuring)
function reverseString(chars) {
  let l = 0, r = chars.length - 1;
  while (l < r) {
    [chars[l], chars[r]] = [chars[r], chars[l]];
    l++;
    r--;
  }
  return chars;
}
assert.deepEqual(reverseString(["h", "e", "y"]), ["y", "e", "h"]);

// TEMPLATE lento/rápido no mesmo sentido: "escritor" e "leitor"
// LC 26 — Remove Duplicates from Sorted Array (devolve quantos únicos ficam à frente)
function removeDuplicates(nums) {
  if (nums.length === 0) return 0;
  let escrita = 1;
  for (let leitura = 1; leitura < nums.length; leitura++) {
    if (nums[leitura] !== nums[escrita - 1]) {
      nums[escrita] = nums[leitura];
      escrita++;
    }
  }
  return escrita;
}
const dups = [0, 0, 1, 1, 1, 2, 2, 3];
assert.equal(removeDuplicates(dups), 4);
assert.deepEqual(dups.slice(0, 4), [0, 1, 2, 3]);

// LC 283 — Move Zeroes (mesma ideia)
function moveZeroes(nums) {
  let escrita = 0;
  for (const n of nums) if (n !== 0) nums[escrita++] = n;
  while (escrita < nums.length) nums[escrita++] = 0;
  return nums;
}
assert.deepEqual(moveZeroes([0, 1, 0, 3, 12]), [1, 3, 12, 0, 0]);

// LC 88 — Merge Sorted Array: enche de TRÁS para a frente para não pisar valores
function merge(nums1, m, nums2, n) {
  let i = m - 1, j = n - 1, k = m + n - 1;
  while (j >= 0) {
    if (i >= 0 && nums1[i] > nums2[j]) nums1[k--] = nums1[i--];
    else nums1[k--] = nums2[j--];
  }
  return nums1;
}
assert.deepEqual(merge([1, 2, 3, 0, 0, 0], 3, [2, 5, 6], 3), [1, 2, 2, 3, 5, 6]);

// =====================================================================================
// 4. JANELA DESLIZANTE — subarray/substring contínuo
// =====================================================================================
// QUANDO: "o maior/menor subarray/substring que ...", "k elementos seguidos".

// LC 121 — Best Time to Buy and Sell Stock: guarda o mínimo até agora.
function maxProfit(prices) {
  let menor = Infinity, melhor = 0;
  for (const p of prices) {
    menor = Math.min(menor, p);
    melhor = Math.max(melhor, p - menor);
  }
  return melhor;
}
assert.equal(maxProfit([7, 1, 5, 3, 6, 4]), 5);
assert.equal(maxProfit([7, 6, 4, 3, 1]), 0);

// Janela de tamanho FIXO k: soma = soma + entra - sai
function maxSomaK(nums, k) {
  let soma = 0;
  for (let i = 0; i < k; i++) soma += nums[i];
  let melhor = soma;
  for (let i = k; i < nums.length; i++) {
    soma += nums[i] - nums[i - k];
    melhor = Math.max(melhor, soma);
  }
  return melhor;
}
assert.equal(maxSomaK([1, 12, -5, -6, 50, 3], 4), 51);

// Janela de tamanho VARIÁVEL: cresce à direita, encolhe à esquerda quando fica inválida.
// LC 3 — Longest Substring Without Repeating Characters (medium, mas é O template)
function lengthOfLongestSubstring(s) {
  const naJanela = new Set();
  let l = 0, melhor = 0;
  for (let r = 0; r < s.length; r++) {
    while (naJanela.has(s[r])) naJanela.delete(s[l++]); // encolhe até ficar válida
    naJanela.add(s[r]);
    melhor = Math.max(melhor, r - l + 1);
  }
  return melhor;
}
assert.equal(lengthOfLongestSubstring("abcabcbb"), 3);
assert.equal(lengthOfLongestSubstring(""), 0);

// =====================================================================================
// 5. SOMA DE PREFIXOS / KADANE
// =====================================================================================
// prefix[i] = soma de nums[0..i-1]  →  soma(l..r) = prefix[r + 1] - prefix[l] em O(1)
function prefixos(nums) {
  const p = [0];
  for (const n of nums) p.push(p.at(-1) + n);
  return p;
}
const P = prefixos([1, 2, 3, 4]);
assert.equal(P[3] - P[1], 2 + 3); // soma dos índices 1..2

// LC 1480 — Running Sum
const runningSum = (nums) => prefixos(nums).slice(1);
assert.deepEqual(runningSum([1, 2, 3, 4]), [1, 3, 6, 10]);

// LC 53 — Maximum Subarray (Kadane): "compensa continuar ou recomeço aqui?"
function maxSubArray(nums) {
  let atual = nums[0], melhor = nums[0];
  for (let i = 1; i < nums.length; i++) {
    atual = Math.max(nums[i], atual + nums[i]);
    melhor = Math.max(melhor, atual);
  }
  return melhor;
}
assert.equal(maxSubArray([-2, 1, -3, 4, -1, 2, 1, -5, 4]), 6);
assert.equal(maxSubArray([-3, -1]), -1);

// =====================================================================================
// 6. PESQUISA BINÁRIA — array ORDENADO, corta metade de cada vez O(log n)
// =====================================================================================
// TEMPLATE (o mais seguro de memorizar)
function binarySearch(nums, target) {
  let l = 0, r = nums.length - 1;
  while (l <= r) {
    const mid = Math.floor((l + r) / 2);
    if (nums[mid] === target) return mid;
    if (nums[mid] < target) l = mid + 1;
    else r = mid - 1;
  }
  return -1; // quando sai do while, l é onde o target SERIA inserido (LC 35)
}
assert.equal(binarySearch([-1, 0, 3, 5, 9, 12], 9), 4);
assert.equal(binarySearch([-1, 0, 3, 5, 9, 12], 2), -1);

// LC 35 — Search Insert Position: igual, mas devolve l no fim
function searchInsert(nums, target) {
  let l = 0, r = nums.length - 1;
  while (l <= r) {
    const mid = Math.floor((l + r) / 2);
    if (nums[mid] === target) return mid;
    if (nums[mid] < target) l = mid + 1;
    else r = mid - 1;
  }
  return l;
}
assert.equal(searchInsert([1, 3, 5, 6], 2), 1);
assert.equal(searchInsert([1, 3, 5, 6], 7), 4);

// =====================================================================================
// 7. STACK (pilha) — "o último a entrar é o primeiro a sair"
// =====================================================================================
// Em JS: array com push() e pop() (ambos O(1)). Topo = stack.at(-1).
// QUANDO: parênteses, desfazer, "elemento anterior/seguinte maior".

// LC 20 — Valid Parentheses
function isValid(s) {
  const par = { ")": "(", "]": "[", "}": "{" };
  const stack = [];
  for (const ch of s) {
    if (ch in par) {
      if (stack.pop() !== par[ch]) return false;
    } else stack.push(ch);
  }
  return stack.length === 0;
}
assert.equal(isValid("()[]{}"), true);
assert.equal(isValid("([)]"), false);
assert.equal(isValid("(("), false);

// FILA (queue): array com push() + shift() funciona, mas shift() é O(n).
// Para BFS no nível fácil chega; se der Time Limit, usa um índice: while (i < fila.length) fila[i++]

// =====================================================================================
// 8. LISTA LIGADA — LeetCode dá-te `head` (um ListNode) e tu manipulas os .next
// =====================================================================================
class ListNode {
  constructor(val, next = null) {
    this.val = val;
    this.next = next;
  }
}
// helpers para testar: array ↔ lista
const toList = (arr) => arr.reduceRight((next, val) => new ListNode(val, next), null);
const toArray = (head) => {
  const out = [];
  for (let n = head; n; n = n.next) out.push(n.val);
  return out;
};

// LC 206 — Reverse Linked List (O clássico — desenha as setas no papel!)
function reverseList(head) {
  let prev = null, atual = head;
  while (atual) {
    const seguinte = atual.next; // 1. guarda o resto
    atual.next = prev; //           2. vira a seta
    prev = atual; //                3. avança os dois
    atual = seguinte;
  }
  return prev;
}
assert.deepEqual(toArray(reverseList(toList([1, 2, 3]))), [3, 2, 1]);

// LC 21 — Merge Two Sorted Lists: nó "dummy" evita casos especiais no início
function mergeTwoLists(a, b) {
  const dummy = new ListNode(0);
  let cauda = dummy;
  while (a && b) {
    if (a.val <= b.val) { cauda.next = a; a = a.next; }
    else { cauda.next = b; b = b.next; }
    cauda = cauda.next;
  }
  cauda.next = a ?? b;
  return dummy.next;
}
assert.deepEqual(toArray(mergeTwoLists(toList([1, 2, 4]), toList([1, 3, 4]))), [1, 1, 2, 3, 4, 4]);

// LC 876 — Middle of the Linked List (lento anda 1, rápido anda 2)
function middleNode(head) {
  let lento = head, rapido = head;
  while (rapido && rapido.next) {
    lento = lento.next;
    rapido = rapido.next.next;
  }
  return lento;
}
assert.equal(middleNode(toList([1, 2, 3, 4, 5])).val, 3);

// LC 141 — Linked List Cycle (mesma ideia: se se encontrarem, há ciclo)
function hasCycle(head) {
  let lento = head, rapido = head;
  while (rapido && rapido.next) {
    lento = lento.next;
    rapido = rapido.next.next;
    if (lento === rapido) return true;
  }
  return false;
}
const ciclo = toList([1, 2, 3]);
ciclo.next.next.next = ciclo; // 3 → 1
assert.equal(hasCycle(ciclo), true);
assert.equal(hasCycle(toList([1, 2])), false);

// =====================================================================================
// 9. ÁRVORES BINÁRIAS — quase tudo é recursão
// =====================================================================================
// RECEITA DA RECURSÃO:
//   1. Caso base: if (!node) return <valor para árvore vazia>;
//   2. Confia que a função já funciona para node.left e node.right.
//   3. Combina os dois resultados com o node atual.
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
const arvore = new TreeNode(3, new TreeNode(9), new TreeNode(20, new TreeNode(15), new TreeNode(7)));

// LC 104 — Maximum Depth
const maxDepth = (node) => (node ? 1 + Math.max(maxDepth(node.left), maxDepth(node.right)) : 0);
assert.equal(maxDepth(arvore), 3);

// LC 226 — Invert Binary Tree
function invertTree(node) {
  if (!node) return null;
  [node.left, node.right] = [invertTree(node.right), invertTree(node.left)];
  return node;
}

// LC 100 — Same Tree
function isSameTree(p, q) {
  if (!p || !q) return p === q; // ambos null → true; só um null → false
  return p.val === q.val && isSameTree(p.left, q.left) && isSameTree(p.right, q.right);
}
assert.equal(isSameTree(invertTree(invertTree(arvore)), arvore), true);

// LC 112 — Path Sum: existe caminho raiz→folha com soma target?
function hasPathSum(node, target) {
  if (!node) return false;
  if (!node.left && !node.right) return node.val === target; // folha
  const resto = target - node.val;
  return hasPathSum(node.left, resto) || hasPathSum(node.right, resto);
}
assert.equal(hasPathSum(arvore, 30), true); // 3 + 20 + 7
assert.equal(hasPathSum(arvore, 5), false);

// Percursos (DFS). Só muda ONDE fazes o push:
//   pré-ordem:  push → esquerda → direita
//   em-ordem:   esquerda → push → direita   (numa BST dá os valores ORDENADOS)
//   pós-ordem:  esquerda → direita → push
function inorder(node, out = []) {
  if (!node) return out;
  inorder(node.left, out);
  out.push(node.val);
  inorder(node.right, out);
  return out;
}
assert.deepEqual(inorder(arvore), [9, 3, 15, 20, 7]);

// BFS — por níveis, com fila (LC 102 é medium, mas é a base de muitos fáceis)
function levelOrder(root) {
  if (!root) return [];
  const niveis = [], fila = [root];
  while (fila.length) {
    const tamanho = fila.length, nivel = []; // tudo o que está na fila agora = 1 nível
    for (let i = 0; i < tamanho; i++) {
      const n = fila.shift();
      nivel.push(n.val);
      if (n.left) fila.push(n.left);
      if (n.right) fila.push(n.right);
    }
    niveis.push(nivel);
  }
  return niveis;
}
assert.deepEqual(levelOrder(arvore), [[3], [9, 20], [15, 7]]);

// =====================================================================================
// 10. MATEMÁTICA / BITS que aparecem nos fáceis
// =====================================================================================
// LC 136 — Single Number: x ^ x = 0 e x ^ 0 = x → o XOR de todos sobra o único
const singleNumber = (nums) => nums.reduce((acc, n) => acc ^ n, 0);
assert.equal(singleNumber([4, 1, 2, 1, 2]), 4);

// LC 268 — Missing Number: soma esperada 0..n menos a soma real
const missingNumber = (nums) => (nums.length * (nums.length + 1)) / 2 - nums.reduce((a, b) => a + b, 0);
assert.equal(missingNumber([3, 0, 1]), 2);

// LC 9 — Palindrome Number sem converter para string
function isPalindromeNumber(x) {
  if (x < 0) return false;
  let original = x, invertido = 0;
  while (x > 0) {
    invertido = invertido * 10 + (x % 10);
    x = Math.floor(x / 10);
  }
  return invertido === original;
}
assert.equal(isPalindromeNumber(121), true);
assert.equal(isPalindromeNumber(10), false);

// Par/ímpar e potências de 2
assert.equal(7 % 2 === 1, true);
const isPowerOfTwo = (n) => n > 0 && (n & (n - 1)) === 0; // 8 = 1000, 7 = 0111 → & dá 0
assert.equal(isPowerOfTwo(16), true);
assert.equal(isPowerOfTwo(12), false);

// LC 70 — Climbing Stairs: cada degrau = soma dos dois anteriores (Fibonacci).
// Primeira programação dinâmica: guarda só os dois últimos resultados.
function climbStairs(n) {
  let a = 1, b = 1; // formas de chegar ao degrau 0 e 1
  for (let i = 2; i <= n; i++) [a, b] = [b, a + b];
  return b;
}
assert.equal(climbStairs(2), 2);
assert.equal(climbStairs(5), 8);

console.log("✅ Todos os exemplos passaram.");

// =====================================================================================
// LISTA DE TREINO (por esta ordem) — tenta sozinho 20 min antes de olhar para cima
// =====================================================================================
/*
  Hash map:      1 Two Sum · 217 · 242 · 387 · 383 Ransom Note · 349 Intersection of Two Arrays
  Dois ponteiros: 125 · 344 · 26 · 283 · 88 · 977 Squares of a Sorted Array
  Janela/prefixo: 121 · 1480 · 643 Maximum Average Subarray I · 53
  Binária:       704 · 35 · 278 First Bad Version
  Stack:         20 · 232 Implement Queue using Stacks · 1047 Remove All Adjacent Duplicates
  Lista ligada:  206 · 21 · 876 · 141 · 83 Remove Duplicates from Sorted List
  Árvores:       104 · 226 · 100 · 112 · 101 Symmetric Tree · 94 Inorder Traversal
  Mat/bits:      136 · 268 · 9 · 70 · 191 Number of 1 Bits
*/
