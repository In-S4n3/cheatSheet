// PADRÕES LEETCODE (nível easy) — JavaScript
// Correr: node 02-LeetCode-Easy.js · verificar cada "// result ==>": node check-results.js 02-LeetCode-Easy.js

// ÍNDICE (Ctrl+F "§N")
//   §0 COMO ATACAR UM PROBLEMA
//   §1 ARMADILHAS DE JS QUE CHUMBAM TESTES
//   §2 HASH MAP / SET
//   §3 TWO POINTERS
//   §4 SLIDING WINDOW
//   §5 PREFIX SUM / KADANE
//   §6 BINARY SEARCH
//   §7 STACK
//   §8 LINKED LIST
//   §9 BINARY TREES
//   §10 MATEMÁTICA / BITS
//   §11 LISTA DE TREINO

// §0 ── COMO ATACAR UM PROBLEMA ──────────
// 1. Ler os exemplos e inventar 1 caso pequeno e 1 caso estranho (vazio, 1 elemento, negativos, repetidos).
// 2. Resolver à mão no papel. O que os olhos fizeram é o algoritmo.
// 3. Escrever primeiro a força bruta (dois for). Depois perguntar:
//      procuro a mesma coisa vezes sem conta?        → Map/Set (§2)
//      o array está ordenado?                        → two pointers (§3) ou binary search (§6)
//      um pedaço seguido do array/string?            → sliding window (§4) ou prefix sum (§5)
//      parênteses, desfazer, "o mais recente"?       → stack (§7)
//      head e .next?                                 → pointers prev/slow/fast (§8)
//      root, .left e .right?                         → recursion (§9)
// 4. Testar os meus casos antes de submeter.
// 5. Velocidade (Big O): O(1) arr[i], map.get · O(log n) binary search · O(n) um loop · O(n log n) sort · O(n²) loop dentro de loop.
// Nota: includes(), indexOf(), shift(), splice() são O(n) — dentro de um loop tornam tudo O(n²).

// §1 ── ARMADILHAS DE JS QUE CHUMBAM TESTES ──────────


//--------------------------------------------------------------------
// sort() - // serve para pôr [10, 1, 2] do menor para o maior antes de usar two pointers.
{
  // sem function, o sort compara como STRING: "10" vem antes de "2".
  [10, 1, 2].sort(); // result ==> [1, 10, 2]
  // a function devolve um número: negativo = a fica antes, positivo = b fica antes.
  [10, 1, 2].sort((a, b) => a - b); // result ==> [1, 2, 10]
  [10, 1, 2].sort((a, b) => b - a); // result ==> [10, 2, 1]
  [5, 25, 100].sort(); // result ==> [100, 25, 5]
  const original = [3, 1, 2];
  const sorted = original.toSorted((a, b) => a - b);
  original; // result ==> [3, 1, 2]
  sorted; // result ==> [1, 2, 3]
}
// nota: sort() altera o original e devolve o mesmo array; toSorted() deixa o original e devolve uma cópia.
// nota2: [5, 25, 100].sort() dá [100, 25, 5] porque "1" < "2" < "5" como string. Ver 01 §11 e §16.

//--------------------------------------------------------------------
// Math.floor() - // serve para calcular o index do meio, Math.floor((left + right) / 2), na binary search.
{
  7 / 2; // result ==> 3.5
  Math.floor(7 / 2); // result ==> 3
  Math.floor(9 / 4); // result ==> 2
  Math.trunc(-7 / 2); // result ==> -3
  Math.floor(-7 / 2); // result ==> -4
}
// nota: JS não tem divisão inteira. floor desce sempre; trunc corta para o zero. Só diferem nos negativos.
// nota2: divisão inteira = Math.floor(a / b). Ver 01 §8.

//--------------------------------------------------------------------
// split("") - // serve para trocar uma letra de "abc", porque as strings não se alteram.
{
  const word = "abc";
  const letters = word.split(""); // ou [...word]
  letters[0] = "x";
  letters.join(""); // result ==> "xbc"
  letters.join(); // result ==> "x,b,c"
  word; // result ==> "abc"
}
// nota: word[0] = "x" não faz nada e não dá erro (em strict mode dá TypeError). Caminho: string → array → mudar → join(""). Ver 01 §7 e §13.
// nota2: join() sem argumento põe vírgulas.

//--------------------------------------------------------------------
// === em arrays - // serve para perceber porque comparar dois resultados [1, 2] dá false.
{
  const first = [1];
  const second = first;
  [1, 2] === [1, 2]; // result ==> false
  [1, 2].join() === [1, 2].join(); // result ==> true
  first === second; // result ==> true
}
// nota: arrays comparam a referência ("é o mesmo?"), não o conteúdo ("é igual?"). second aponta para o mesmo array que first.
// nota2: para comparar o conteúdo, faz join() aos dois e compara a string. Ver 01 §3, §7 e §15.

//--------------------------------------------------------------------
// Infinity - // serve para encontrar o mínimo de [5, 3, 8] sem saber de antemão os values.
{
  // passo 1 — esqueleto: o value inicial, o loop e o resultado
  let smallest = Infinity;
  for (const number of [5, 3, 8]) {
    // passo 2 — guardar o menor visto até agora
    smallest = Math.min(smallest, number);
  }
  smallest; // result ==> 3

  let biggest = -Infinity;
  for (const number of [5, 3, 8]) {
    biggest = Math.max(biggest, number);
  }
  biggest; // result ==> 8
}
// nota: o mínimo começa em Infinity e o máximo em -Infinity. Com 0, o mínimo de [5, 3, 8] ficaria 0, que nem está no array.
// nota2: ver Infinity e Math.min em 01 §8, for...of em 01 §6.

//--------------------------------------------------------------------
// Array.from() - // serve para criar uma grid 2 × 3 de zeros para dynamic programming.
{
  const matrix = Array.from({ length: 2 }, () => new Array(3).fill(0));
  matrix[0][0] = 1;
  matrix; // result ==> [[1, 0, 0], [0, 0, 0]]
  matrix[1][2] = 5;
  matrix[0][2]; // result ==> 0

  const bad = new Array(2).fill([]);
  bad[0].push(1);
  bad; // result ==> [[1], [1]]
  bad[0] === bad[1]; // result ==> true
}
// nota: Array.from chama a function uma vez por row, por isso cada row é um array NOVO. fill([]) põe o MESMO [] nas duas posições.
// nota2: fill(0) não dá problema (um número é copiado); fill([]) partilha o array. Ver 01 §9.

//--------------------------------------------------------------------
// at(-1) - // serve para ler o último elemento, por exemplo o topo de uma stack, sem a alterar.
{
  [1, 2, 3].at(0); // result ==> 1
  [1, 2, 3].at(-1); // result ==> 3
  [1, 2, 3].at(-2); // result ==> 2
  [1, 2, 3][-1]; // result ==> undefined
  "abc".at(-1); // result ==> "c"
}
// nota: indexes negativos contam do fim. arr[-1] procura uma propriedade "-1" e dá undefined.
// nota2: at() funciona em arrays e em strings. Ver 01 §10 e §7.

//--------------------------------------------------------------------
// charCodeAt() - // serve para contar letras num array de 26 posições (a = 0 … z = 25).
{
  "a".charCodeAt(0); // result ==> 97
  String.fromCharCode(98); // result ==> "b"
  "c".charCodeAt(0) - "a".charCodeAt(0); // result ==> 2
  "z".charCodeAt(0) - "a".charCodeAt(0); // result ==> 25
}
// nota: posição = código da letra − código de "a". O 0 é o index da letra dentro da string; para uma letra é sempre 0.
// nota2: ver 01 §7.

//--------------------------------------------------------------------
// Dígitos de um número - // serve para somar os dígitos de 1234 sem passar a string.
{
  String(1234).split("").map(Number); // result ==> [1, 2, 3, 4]

  // passo 1 — esqueleto: o número, a soma e o loop
  let number = 1234;
  let digitSum = 0;
  while (number > 0) {
    // passo 2 — ler o último dígito
    const lastDigit = number % 10;
    digitSum += lastDigit;
    // passo 3 — apagar o último dígito
    number = Math.floor(number / 10);
  }
  digitSum; // result ==> 10
  907 % 10; // result ==> 7
  Math.floor(907 / 10); // result ==> 90
}
// nota: % 10 lê o último dígito; Math.floor(/ 10) apaga-o. Sem o floor, 907 / 10 daria 90.7.
// nota2: ver split em 01 §7, map(Number) em 01 §8, % e += em 01 §3, while em 01 §6.

// §2 ── HASH MAP / SET ──────────

//--------------------------------------------------------------------
// Contar com um Map - // serve para responder "já vi isto?" ou "quantas vezes aparece cada letra?".
// count fica fora do bloco porque o isAnagram e o firstUniqChar também a usam.
function count(items) {
  // passo 1 — esqueleto: o Map, o loop e o return
  const freq = new Map();
  for (const item of items) {
    // passo 2 — ler a contagem anterior (0 se ainda não existe)
    let previous = 0;
    if (freq.has(item)) {
      previous = freq.get(item);
    }
    // passo 3 — somar 1 e guardar
    freq.set(item, previous + 1);
  }
  return freq;
}
{
  count("banana").get("a"); // result ==> 3
  count("banana").get("n"); // result ==> 2
  count("banana").size; // result ==> 3
  count("banana").get("z"); // result ==> undefined
}
// nota: o Map não soma sozinho: lê o anterior, soma 1 e guarda com set(). Cada get/set é O(1). Versão curta: freq.set(item, (freq.get(item) ?? 0) + 1).
// nota2: o Map aceita qualquer tipo de key e tem .size; num object {} as keys viram string. Ver 01 §14.

//--------------------------------------------------------------------
// Two Sum (LC 1) - // serve para encontrar o par de [2, 7, 11, 15] que soma 9 sem testar todos os pares.
{
  function twoSum(nums, target) {
    // passo 1 — esqueleto: o Map, o loop e o return
    const seen = new Map();
    for (let index = 0; index < nums.length; index++) {
      // passo 2 — o complemento que falta para chegar ao target
      const needed = target - nums[index];
      // passo 3 — o complemento já passou? Devolve os dois indexes
      if (seen.has(needed)) {
        return [seen.get(needed), index];
      }
      // passo 4 — guardar o número (key) e o index (value), só DEPOIS de perguntar
      seen.set(nums[index], index);
    }
    // nenhum par existe
    return [];
  }
  twoSum([2, 7, 11, 15], 9); // result ==> [0, 1]
  twoSum([3, 3], 6); // result ==> [0, 1]
  twoSum([3, 2, 4], 6); // result ==> [1, 2]
}
// nota: a key é o VALUE (é por ele que procuramos) e o index é o que se guarda. Guardar só depois evita usar o mesmo número duas vezes.
// nota2: em [3, 2, 4] com target 6: em index 0 o Map está vazio; em index 2 precisa de 2, que está no index 1.

//--------------------------------------------------------------------
// Contains Duplicate (LC 217) - // serve para saber se [1, 2, 3, 1] tem repetidos.
{
  function containsDuplicate(nums) {
    // passo 1 — esqueleto: o Set tira os repetidos
    const unique = new Set(nums);
    // passo 2 — comparar os tamanhos
    return unique.size !== nums.length;
  }
  containsDuplicate([1, 2, 3, 1]); // result ==> true
  containsDuplicate([1, 2, 3]); // result ==> false
  containsDuplicate([]); // result ==> false
}
// nota: Set menor que o array = há repetidos. size é do Set; o array usa length. Versão curta: new Set(nums).size !== nums.length. Ver 01 §14.

//--------------------------------------------------------------------
// Valid Anagram (LC 242) - // serve para saber se "anagram" e "nagaram" usam exatamente as mesmas letras.
{
  function isAnagram(a, b) {
    // passo 1 — esqueleto: contar a palavra a, descontar a palavra b
    // passo 2 — tamanhos diferentes: não pode ser
    if (a.length !== b.length) {
      return false;
    }
    const freq = count(a);
    for (const letter of b) {
      // passo 3 — a letra nunca existiu em a
      if (!freq.has(letter)) {
        return false;
      }
      // passo 4 — a letra já foi toda gasta
      if (freq.get(letter) === 0) {
        return false;
      }
      // passo 5 — descontar uma
      freq.set(letter, freq.get(letter) - 1);
    }
    return true;
  }
  isAnagram("anagram", "nagaram"); // result ==> true
  isAnagram("rat", "car"); // result ==> false
  isAnagram("aab", "abb"); // result ==> false
}
// nota: em "aab" vs "abb", freq começa a → 2, b → 1; o segundo "b" encontra b → 0 e devolve false.
// nota2: sem o passo 2, "ab" e "abc" teriam de ser comparados letra a letra. Ver 01 §14.

//--------------------------------------------------------------------
// First Unique Character (LC 387) - // serve para devolver o index da primeira letra que aparece uma só vez.
{
  function firstUniqChar(s) {
    // passo 1 — esqueleto: contar tudo, depois andar pela ordem original
    const freq = count(s);
    for (let index = 0; index < s.length; index++) {
      // passo 2 — esta letra aparece uma só vez? Devolve o index
      if (freq.get(s[index]) === 1) {
        return index;
      }
    }
    // nenhuma letra única
    return -1;
  }
  firstUniqChar("aabc"); // result ==> 2
  firstUniqChar("leetcode"); // result ==> 0
  firstUniqChar("aabb"); // result ==> -1
  firstUniqChar("abab"); // result ==> -1
}
// nota: a 2.ª passagem é na string, não no Map, porque a resposta tem de seguir a ordem original.
// nota2: duas passagens: contar tudo, depois procurar pela ordem. Ver 01 §7.

//--------------------------------------------------------------------
// Group Anagrams (LC 49) - // serve para juntar ["eat", "tea", "tan", "nat"] em [["eat", "tea"], ["tan", "nat"]].
{
  function groupAnagrams(words) {
    // passo 1 — esqueleto: o Map de grupos, o loop e o return
    const groups = new Map();
    for (const word of words) {
      // passo 2 — a key: as letras da palavra, ordenadas
      const letters = word.split("");
      letters.sort();
      const key = letters.join("");
      // passo 3 — key nova: criar o grupo vazio
      if (!groups.has(key)) {
        groups.set(key, []);
      }
      // passo 4 — pôr a palavra no grupo
      groups.get(key).push(word);
    }
    // só os grupos, sem as keys
    return [...groups.values()];
  }
  groupAnagrams(["eat", "tea", "tan", "nat"]); // result ==> [["eat", "tea"], ["tan", "nat"]]
  ["n", "a", "t"].sort().join(""); // result ==> "ant"
}
// nota: groups.get(key).push(word) não precisa de set(): o push altera o array que já está guardado no Map. Versão curta da key: [...word].sort().join("").
// nota2: aqui o sort sem function está certo, porque ordenamos letras (string). Ver 01 §11, §13 e §14.

//--------------------------------------------------------------------
// Roman to Integer (LC 13) - // serve para converter "MCMXCIV" em 1994.
{
  const VALUE = new Map([["I", 1], ["V", 5], ["X", 10], ["L", 50], ["C", 100], ["D", 500], ["M", 1000]]);

  function romanToInt(s) {
    // passo 1 — esqueleto: o total, o loop e o return
    let total = 0;
    for (let index = 0; index < s.length; index++) {
      // passo 2 — o value desta letra
      const current = VALUE.get(s[index]);
      // passo 3 — o value da seguinte (0 se esta for a última)
      let next = 0;
      if (index + 1 < s.length) {
        next = VALUE.get(s[index + 1]);
      }
      // passo 4 — menor do que a seguinte: subtrai (IV = 5 − 1)
      if (current < next) {
        total -= current;
      }
      // passo 5 — senão: soma
      if (current >= next) {
        total += current;
      }
    }
    return total;
  }
  romanToInt("III"); // result ==> 3
  romanToInt("LVIII"); // result ==> 58
  romanToInt("MCMXCIV"); // result ==> 1994
  romanToInt("XIV"); // result ==> 14
}
// nota: menor antes de maior → subtrai. O passo 3 existe porque na última letra VALUE.get(s[index + 1]) seria undefined.
// nota2: em "XIV": X soma 10, I (1 < 5) subtrai 1, V soma 5 → 14. Ver 01 §14.

//--------------------------------------------------------------------
// Integer to Roman (LC 12, Medium) - // serve para o caminho inverso: 1994 → "MCMXCIV".
{
  // do maior para o menor, com os pares de subtração (CM, CD, XC, XL, IX, IV) na tabela
  const TABLE = [[1000, "M"], [900, "CM"], [500, "D"], [400, "CD"], [100, "C"], [90, "XC"],
    [50, "L"], [40, "XL"], [10, "X"], [9, "IX"], [5, "V"], [4, "IV"], [1, "I"]];

  function intToRoman(num) {
    // passo 1 — esqueleto: o romano a construir, o loop pela tabela e o return
    let result = "";
    for (const [value, symbol] of TABLE) {
      // passo 2 — enquanto o value cabe, usa-o outra vez
      while (num >= value) {
        result += symbol;
        num -= value;
      }
    }
    return result;
  }
  intToRoman(3); // result ==> "III"
  intToRoman(58); // result ==> "LVIII"
  intToRoman(1994); // result ==> "MCMXCIV"
  intToRoman(44); // result ==> "XLIV"
}
// nota: guloso: maior que cabe, repete, desce. Sem 900/400/90/40/9/4 na tabela, 4 sairia "IIII" em vez de "IV".
// nota2: 44 → 40 cabe ("XL"), falta 4; 4 cabe ("IV").

// §3 ── TWO POINTERS ──────────

//--------------------------------------------------------------------
// Two pointers - // serve para percorrer um array ordenado, um palíndromo, ou alterá-lo no sítio sem cópia.
{
  // forma 1 — pontas opostas: left no início, right no fim, aproximam-se até se cruzarem
  const array = [1, 2, 3, 4, 5];
  const pairs = [];
  let left = 0;
  let right = array.length - 1;
  while (left < right) {
    pairs.push([array[left], array[right]]);
    left++;
    right--;
  }
  pairs; // result ==> [[1, 5], [2, 4]]

  // forma 2 — mesmo sentido: read lê tudo, write só avança quando guarda algo
  const numbers = [1, 2, 3, 4];
  let write = 0;
  for (let read = 0; read < numbers.length; read++) {
    if (numbers[read] % 2 === 0) {
      numbers[write] = numbers[read];
      write++;
    }
  }
  numbers.slice(0, write); // result ==> [2, 4]
}
// nota: while (left < right) deixa o elemento do meio em paz (o 3 nunca aparece). <= é da binary search (§6). Num array de 4 elementos corre 2 vezes: (0, 3) e (1, 2).
// nota2: pontas opostas fecham (palíndromo, inverter); read/write andam juntos (remover repetidos, zeros).

//--------------------------------------------------------------------
// Valid Palindrome (LC 125) - // serve para saber se "A man, a plan, a canal: Panama" se lê igual nos dois sentidos.
{
  function isPalindrome(s) {
    // passo 1 — esqueleto: limpar, os dois pointers, o loop e o return
    const lower = s.toLowerCase();
    const clean = lower.replace(/[^a-z0-9]/g, "");
    let left = 0;
    let right = clean.length - 1;
    while (left < right) {
      // passo 2 — as pontas são diferentes: uma basta, termina já
      if (clean[left] !== clean[right]) {
        return false;
      }
      // passo 3 — fechar as pontas
      left++;
      right--;
    }
    return true;
  }
  isPalindrome("A man, a plan, a canal: Panama"); // result ==> true
  isPalindrome("race a car"); // result ==> false
  isPalindrome(".,"); // result ==> true
}
// nota: "race a car" → clean = "raceacar"; em left = 2, right = 5 compara "c" com "c"; em left = 3, right = 4 compara "e" com "a" e devolve false.
// nota2: ".,"  fica "" e o while nem corre. Versão curta da limpeza: s.toLowerCase().replace(/[^a-z0-9]/g, ""). Ver 01 §7 e §22.

//--------------------------------------------------------------------
// Reverse String (LC 344) - // serve para inverter ["h", "e", "l", "l", "o"] no sítio, quando o enunciado proíbe outro array.
{
  function reverseString(chars) {
    // passo 1 — esqueleto: os dois pointers, o loop e o return
    let left = 0;
    let right = chars.length - 1;
    while (left < right) {
      // passo 2 — trocar as pontas, com uma variable temporária
      const temporary = chars[left];
      chars[left] = chars[right];
      chars[right] = temporary;
      // passo 3 — fechar
      left++;
      right--;
    }
    return chars;
  }
  const letters = ["h", "e", "l", "l", "o"];
  reverseString(letters);
  letters; // result ==> ["o", "l", "l", "e", "h"]
  reverseString(["a", "b"]); // result ==> ["b", "a"]
}
// nota: reverse() altera o original (aqui serviria); toReversed() cria cópia. Com ["a", "b"] há 1 troca só: depois left = 1, right = 0 e pára.
// nota2: a troca curta é [chars[left], chars[right]] = [chars[right], chars[left]]. Ver 01 §13.

//--------------------------------------------------------------------
// Remove Duplicates from Sorted Array (LC 26) - // serve para compactar [0, 0, 1, 1, 1, 2, 2, 3] sem array extra.
{
  function removeDuplicates(nums) {
    // passo 1 — esqueleto: write, o loop de read e o return
    if (nums.length === 0) {
      return 0;
    }
    let write = 1; // nums[0] já é único
    for (let read = 1; read < nums.length; read++) {
      // passo 2 — é diferente do último escrito: guardar e avançar write
      if (nums[read] !== nums[write - 1]) {
        nums[write] = nums[read];
        write++;
      }
    }
    return write;
  }
  const dups = [0, 0, 1, 1, 1, 2, 2, 3];
  removeDuplicates(dups); // result ==> 4
  dups.slice(0, 4); // result ==> [0, 1, 2, 3]
  removeDuplicates([1, 1, 1]); // result ==> 1
}
// nota: devolve um número (quantos únicos); o array muda no sítio e o que fica depois do index 3 é lixo. Ver 01 §6 e §10.
// nota2: read lê tudo, write só escreve novidades. Em [1, 1, 1] o read nunca encontra um value diferente.

//--------------------------------------------------------------------
// Move Zeroes (LC 283) - // serve para levar os 0 de [0, 1, 0, 3, 12] para o fim, mantendo a ordem dos outros.
{
  function moveZeroes(nums) {
    // passo 1 — esqueleto: write, o loop e o return
    let write = 0;
    for (let read = 0; read < nums.length; read++) {
      // passo 2 — não é zero: copiar para a frente e avançar write
      if (nums[read] !== 0) {
        nums[write] = nums[read];
        write++;
      }
    }
    // passo 3 — encher o resto com zeros
    while (write < nums.length) {
      nums[write] = 0;
      write++;
    }
    return nums;
  }
  const nums = [0, 1, 0, 3, 12];
  moveZeroes(nums);
  nums; // result ==> [1, 3, 12, 0, 0]
  // antes do while, write vale quantos não-zeros existem
  [0, 1, 0, 3, 12].filter((n) => n !== 0).length; // result ==> 3
}
// nota: a versão curta, if (n !== 0) nums[write++] = n, usa write e só depois soma 1; nums[++write] avançaria primeiro. Ver 01 §3.
// nota2: copiar os não-zeros, depois encher com zeros.

//--------------------------------------------------------------------
// Merge Sorted Array (LC 88) - // serve para juntar dois arrays ordenados dentro do primeiro, que tem zeros livres no fim.
{
  function merge(nums1, m, nums2, n) {
    // passo 1 — esqueleto: três indexes, o loop e o return
    let i = m - 1; // último real de nums1
    let j = n - 1; // último de nums2
    let k = m + n - 1; // posição onde escrever
    while (j >= 0) {
      // passo 2 — qual é o maior? nums1 ainda tem elementos e o seu é maior
      const useNums1 = i >= 0 && nums1[i] > nums2[j];
      // passo 3 — o maior é de nums1
      if (useNums1) {
        nums1[k] = nums1[i];
        i--;
      }
      // passo 4 — o maior é de nums2
      if (!useNums1) {
        nums1[k] = nums2[j];
        j--;
      }
      // passo 5 — recuar a escrita
      k--;
    }
    return nums1;
  }
  const nums1 = [1, 2, 3, 0, 0, 0];
  merge(nums1, 3, [2, 5, 6], 3);
  nums1; // result ==> [1, 2, 2, 3, 5, 6]
  nums1[2]; // result ==> 2
}
// nota: enche-se de TRÁS para a frente com o maior, por isso nada por ler é apagado. Na 4.ª iteration (i = 1, j = 0, k = 2) vai o 2 de nums2, porque nums1[1] = 2 não é > 2.
// nota2: while (j >= 0) chega: quando nums2 acaba, o que resta de nums1 já está no sítio certo. Ver 01 §6.

// §4 ── SLIDING WINDOW ──────────

//--------------------------------------------------------------------
// Sliding window - // serve para achar o pedaço seguido mais longo ou mais curto de um array ou string.
//   passo 1 — esqueleto:        let left = 0;  for (let right = 0; right < s.length; right++) { ... }
//   passo 2 — juntar à direita: right avança sempre, uma vez por iteration
//   passo 3 — encolher:         while (window inválida) { left = left + 1; }
//   passo 4 — medir:            tamanho = right - left + 1
// left é o início da window, right é o fim. Com left = 2 e right = 5 a window tem os indexes 2, 3, 4 e 5.
const windowLeft = 2;
const windowRight = 5;
windowRight - windowLeft + 1; // result ==> 4
// nota: não é "two pointers de pontas opostas" - aqui left e right andam os dois para a direita.

//--------------------------------------------------------------------
// Best Time to Buy and Sell Stock (LC 121) - // serve para saber o melhor lucro a comprar num dia e vender num dia seguinte.
function maxProfit(prices) {
  // passo 1 — esqueleto: o preço mais baixo, o melhor lucro e um loop pelos dias
  let lowest = Infinity;
  let best = 0;
  for (const price of prices) {
    // passo 2 — hoje é o dia mais barato até agora?
    if (price < lowest) {
      lowest = price;
    }
    // passo 3 — se vendesse hoje, qual era o lucro?
    const profit = price - lowest;
    // passo 4 — é o melhor lucro até agora?
    if (profit > best) {
      best = profit;
    }
  }
  return best;
}
maxProfit([7, 1, 5, 3, 6, 4]); // result ==> 5  (compra a 1, vende a 6)
maxProfit([7, 6, 4, 3, 1]); // result ==> 0  (só desce)
maxProfit([2, 4, 1]); // result ==> 2  (o 1 vem depois e já não tem dia para vender)
// nota: não há left a encolher, só "o mais barato até agora"; fica aqui porque também varre o array uma vez.
// nota2: com Math.min e Math.max cada if fica numa linha: lowest = Math.min(lowest, price).

//--------------------------------------------------------------------
// Window fixa de tamanho k - // serve para achar a melhor soma de k números seguidos, como o maior total de 4 dias.
function maxSumK(nums, k) {
  // passo 1 — esqueleto: somar a primeira window, depois deslizar uma casa de cada vez
  let sum = 0;
  for (let i = 0; i < k; i++) {
    sum = sum + nums[i];
  }
  let best = sum;
  for (let i = k; i < nums.length; i++) {
    // passo 2 — entra o número novo
    const entering = nums[i];
    // passo 3 — sai o número que está k posições atrás
    const leaving = nums[i - k];
    sum = sum + entering - leaving;
    // passo 4 — é a melhor soma até agora?
    if (sum > best) {
      best = sum;
    }
  }
  return best;
}
maxSumK([1, 12, -5, -6, 50, 3], 4); // result ==> 51  (12 - 5 - 6 + 50)
maxSumK([1, 2, 3], 2); // result ==> 5  (1 + 2 = 3, depois 3 + 3 - 1 = 5)
// nota: não somar tudo outra vez; entra um, sai um. nums[i - k] sai; nums[i - k + 1] ainda está dentro.

//--------------------------------------------------------------------
// Longest Substring Without Repeating Characters (LC 3) - // serve para achar o maior pedaço sem letras repetidas, o molde da window de tamanho variável.
function lengthOfLongestSubstring(s) {
  // passo 1 — esqueleto: as letras da window, o início, o melhor tamanho e um loop pelo fim
  const inWindow = new Set();
  let left = 0;
  let best = 0;
  for (let right = 0; right < s.length; right++) {
    // passo 2 — encolher: tirar da esquerda até s[right] deixar de estar repetido
    while (inWindow.has(s[right])) {
      inWindow.delete(s[left]);
      left = left + 1;
    }
    // passo 3 — juntar a letra nova
    inWindow.add(s[right]);
    // passo 4 — é a maior window até agora?
    const size = right - left + 1;
    if (size > best) {
      best = size;
    }
  }
  return best;
}
lengthOfLongestSubstring("abcabcbb"); // result ==> 3  ("abc")
lengthOfLongestSubstring(""); // result ==> 0
lengthOfLongestSubstring("bbbb"); // result ==> 1  (cada "b" novo obriga a tirar o anterior)
lengthOfLongestSubstring("abba"); // result ==> 2  (com "if" em vez de "while" daria 3)
// nota: tem de ser while, não if - em "abba" é preciso tirar várias letras até sair a repetida.
// nota2: compacto: while (inWindow.has(s[right])) inWindow.delete(s[left++]);

// §5 ── PREFIX SUM / KADANE ──────────

//--------------------------------------------------------------------
// Prefix sum - // serve para responder muitas vezes "quanto soma de l a r?" no mesmo array, sem somar tudo de novo.
function prefixSums(nums) {
  // passo 1 — esqueleto: o array começa com um 0 à frente, depois um loop pelos números
  const p = [0];
  for (const n of nums) {
    // passo 2 — a soma até agora é o último value do array
    const last = p[p.length - 1];
    // passo 3 — acrescentar a soma nova
    p.push(last + n);
  }
  return p;
}
const P = prefixSums([1, 2, 3, 4]);
P; // result ==> [0, 1, 3, 6, 10]
P[3] - P[1]; // result ==> 5  (soma dos indexes 1 a 2: 2 + 3)
P[4] - P[0]; // result ==> 10  (soma dos indexes 0 a 3)
// nota: por causa do 0 à frente, a soma de l a r é P[r + 1] - P[l], não P[r] - P[l].
// nota2: compacto: p.push(p.at(-1) + n).

//--------------------------------------------------------------------
// Running Sum (LC 1480) - // serve para que cada posição some tudo o que veio antes: [1, 2, 3, 4] passa a [1, 3, 6, 10].
function runningSum(nums) {
  // passo 1 — esqueleto: reutilizar prefixSums
  const withZero = prefixSums(nums);
  // passo 2 — tirar o 0 da frente
  const withoutZero = withZero.slice(1);
  return withoutZero;
}
runningSum([1, 2, 3, 4]); // result ==> [1, 3, 6, 10]
runningSum([5]); // result ==> [5]  (prefixSums dá [0, 5] e slice(1) tira o 0)
// nota: slice(1) devolve uma cópia a partir do index 1; splice(1) cortaria o array original.

//--------------------------------------------------------------------
// Maximum Subarray, Kadane (LC 53) - // serve para achar a maior soma de números seguidos, como o melhor pedaço de [-2, 1, -3, 4, -1, 2, 1, -5, 4].
function maxSubArray(nums) {
  // passo 1 — esqueleto: o pedaço que acaba aqui, o melhor de todos, e um loop a partir do 2.º número
  let current = nums[0];
  let best = nums[0];
  for (let i = 1; i < nums.length; i++) {
    // passo 2 — o pedaço anterior ajuda (soma positiva): continuar
    if (current > 0) {
      current = current + nums[i];
    }
    // passo 3 — o pedaço anterior não ajuda: recomeçar aqui
    if (current <= 0) {
      current = nums[i];
    }
    // passo 4 — é a melhor soma até agora?
    if (current > best) {
      best = current;
    }
  }
  return best;
}
maxSubArray([-2, 1, -3, 4, -1, 2, 1, -5, 4]); // result ==> 6  (4 - 1 + 2 + 1)
maxSubArray([-3, -1]); // result ==> -1
maxSubArray([2, -1, 2]); // result ==> 3  (continuar compensa: 2, depois 1, depois 3)
// nota: começar com 0 em vez de nums[0] daria 0 num array só de negativos, que não é a soma de nenhum pedaço.
// nota2: compacto: current = Math.max(nums[i], current + nums[i]).

// §6 ── BINARY SEARCH ──────────

//--------------------------------------------------------------------
// Binary Search (LC 704) - // serve para encontrar um número num array ORDENADO em O(log n).
function binarySearch(nums, target) {
  // passo 1 — esqueleto: os limites do que ainda é possível e um loop enquanto sobrar intervalo
  let left = 0;
  let right = nums.length - 1;
  while (left <= right) {
    const mid = Math.floor((left + right) / 2);
    // passo 2 — o meio é o número procurado
    if (nums[mid] === target) {
      return mid;
    }
    // passo 3 — o meio é pequeno: deitar fora a metade esquerda
    if (nums[mid] < target) {
      left = mid + 1;
    }
    // passo 4 — o meio é grande: deitar fora a metade direita
    if (nums[mid] > target) {
      right = mid - 1;
    }
  }
  // intervalo vazio: não existe
  return -1;
}
binarySearch([-1, 0, 3, 5, 9, 12], 9); // result ==> 4
binarySearch([-1, 0, 3, 5, 9, 12], 2); // result ==> -1  (não existe)
// nota: usar sempre left <= right com mid ± 1; com < o intervalo de 1 elemento nunca era testado.
// nota2: com target 9 o while corre 2 vezes: mid = 2 (3 < 9, left = 3), depois mid = 4 (achou).

//--------------------------------------------------------------------
// Search Insert Position (LC 35) - // serve para saber onde entraria um número num array ordenado sem estragar a ordem.
function searchInsert(nums, target) {
  // passo 1 — esqueleto: a mesma binary search
  let left = 0;
  let right = nums.length - 1;
  while (left <= right) {
    const mid = Math.floor((left + right) / 2);
    // passo 2 — achou: é essa a posição
    if (nums[mid] === target) {
      return mid;
    }
    // passo 3 — o meio é pequeno
    if (nums[mid] < target) {
      left = mid + 1;
    }
    // passo 4 — o meio é grande
    if (nums[mid] > target) {
      right = mid - 1;
    }
  }
  // passo 5 — não achou: left é o primeiro index com value maior que target
  return left;
}
searchInsert([1, 3, 5, 6], 2); // result ==> 1  (entre o 1 e o 3)
searchInsert([1, 3, 5, 6], 7); // result ==> 4  (no fim)
searchInsert([1, 3, 5, 6], 0); // result ==> 0  (tudo é maior; right desce a -1 e left fica em 0)
// nota: no fim right = left - 1; right aponta para o último menor, left para onde o target entra.

// §7 ── STACK ──────────

//--------------------------------------------------------------------
// Stack - // serve para parênteses, desfazer e tudo onde "o último a entrar é o primeiro a sair".
const st = [];
st.push(1); // result ==> 1  (push devolve o novo length)
st.push(2); // result ==> 2
st.at(-1); // result ==> 2  (espreita o topo, não tira)
st.pop(); // result ==> 2
st; // result ==> [1]
[].pop(); // result ==> undefined  (stack vazia não tem topo e não dá erro)
// nota: a stack é um array simples, o fim é o topo: push e pop no fim são O(1).
// nota2: shift() tira do início (queue) e é O(n); pop() tira do fim (stack).

//--------------------------------------------------------------------
// Valid Parentheses (LC 20) - // serve para saber se todos os parênteses fecham pela ordem certa: "()[]{}" é válido, "([)]" não.
function isValid(s) {
  // passo 1 — esqueleto: a tabela fecho → abertura, a stack das aberturas por fechar e um loop pelas letras
  const pair = { ")": "(", "]": "[", "}": "{" };
  const stack = [];
  for (const ch of s) {
    // passo 2 — é um fecho: tirar a última abertura e ver se é o par certo
    if (ch in pair) {
      const top = stack.pop();
      if (top !== pair[ch]) {
        return false;
      }
    }
    // passo 3 — é uma abertura: fazer push
    if (!(ch in pair)) {
      stack.push(ch);
    }
  }
  // passo 4 — no fim a stack tem de estar vazia
  return stack.length === 0;
}
isValid("()[]{}"); // result ==> true
isValid("([)]"); // result ==> false  (ordem errada: ")" encontra "[" no topo)
isValid("(("); // result ==> false  (sobrou abertura sem fecho)
isValid(")"); // result ==> false  (pop() da stack vazia dá undefined, que não é "(")
// nota: "ch in pair" pergunta se a KEY existe; aqui só os fechos são keys.
// nota2: uma queue com push() + shift() funciona, mas shift() é O(n); se der Time Limit, andar com um index.

// §8 ── LINKED LIST ──────────

//--------------------------------------------------------------------
// Linked list - // serve para quando o LeetCode dá `head` e pede para mudar as setas .next; só se chega a um node pelo anterior.
class ListNode {
  constructor(val, next = null) {
    this.val = val;
    this.next = next;
  }
}
// helper para testar: array → linked list, a começar pelo fim (o último aponta para null)
function toList(arr) {
  let list = null;
  for (let i = arr.length - 1; i >= 0; i--) {
    list = new ListNode(arr[i], list);
  }
  return list;
}
// helper para testar: linked list → array
function toArray(head) {
  const out = [];
  let node = head;
  while (node !== null) {
    out.push(node.val);
    node = node.next;
  }
  return out;
}
toArray(toList([1, 2, 3])); // result ==> [1, 2, 3]
toList([7]).next; // result ==> null  (o único node é também o último)
// nota: cada node tem val e next (null no último). Perder a referência ao resto é perder o resto - desenhar as setas primeiro.
// nota2: compacto: arr.reduceRight((next, val) => new ListNode(val, next), null); reduceRight começa no fim, que é o que a linked list precisa.

//--------------------------------------------------------------------
// Reverse Linked List (LC 206) - // serve para virar a linked list ao contrário: 1 → 2 → 3 passa a 3 → 2 → 1.
function reverseList(head) {
  // passo 1 — esqueleto: prev é a parte já virada, current é o node a virar
  let prev = null;
  let current = head;
  while (current !== null) {
    // passo 2 — guardar o resto da linked list
    const next = current.next;
    // passo 3 — virar a seta para trás
    current.next = prev;
    // passo 4 — avançar os dois
    prev = current;
    current = next;
  }
  // chegou ao fim (null): a nova cabeça é prev
  return prev;
}
toArray(reverseList(toList([1, 2, 3]))); // result ==> [3, 2, 1]
reverseList(null); // result ==> null  (o while não corre e devolve prev)
// nota: no fim current é null; devolver prev, não current.

//--------------------------------------------------------------------
// Merge Two Sorted Lists (LC 21) - // serve para juntar duas linked lists ordenadas numa só: [1, 2, 4] + [1, 3, 4] dá [1, 1, 2, 3, 4, 4].
function mergeTwoLists(first, second) {
  // passo 1 — esqueleto: um node falso à frente, tail é o último node da resposta
  const dummy = new ListNode(0);
  let tail = dummy;
  while (first !== null && second !== null) {
    // passo 2 — o primeiro é menor ou igual: ligar o primeiro
    if (first.val <= second.val) {
      tail.next = first;
      first = first.next;
    }
    // passo 3 — o segundo é menor: ligar o segundo
    else {
      tail.next = second;
      second = second.next;
    }
    tail = tail.next;
  }
  // passo 4 — sobrou o primeiro: pendurar o resto
  if (first !== null) {
    tail.next = first;
  }
  // passo 5 — sobrou o segundo: pendurar o resto
  if (second !== null) {
    tail.next = second;
  }
  // salta o node falso
  return dummy.next;
}
toArray(mergeTwoLists(toList([1, 2, 4]), toList([1, 3, 4]))); // result ==> [1, 1, 2, 3, 4, 4]
toArray(mergeTwoLists(null, toList([5]))); // result ==> [5]  (o while não corre; sobra só o segundo)
// nota: o dummy evita o caso especial "a linked list nova ainda está vazia"; devolver dummy.next, não dummy.
// nota2: compacto: tail.next = first ?? second pendura o resto sem os dois if.

//--------------------------------------------------------------------
// Middle of the Linked List (LC 876) - // serve para achar o node do meio numa só passagem.
function middleNode(head) {
  // passo 1 — esqueleto: dois corredores, ambos a começar na head
  let slow = head;
  let fast = head;
  // passo 2 — enquanto o rápido tem dois passos para dar
  while (fast !== null && fast.next !== null) {
    // passo 3 — o lento anda 1, o rápido anda 2
    slow = slow.next;
    fast = fast.next.next;
  }
  // o rápido chegou ao fim: o lento está no meio
  return slow;
}
middleNode(toList([1, 2, 3, 4, 5])).val; // result ==> 3
middleNode(toList([1, 2, 3, 4])).val; // result ==> 3  (com número par fica o segundo do meio)
// nota: a condição precisa dos dois, fast e fast.next; fast.next.next rebenta se um deles for null.

//--------------------------------------------------------------------
// Linked List Cycle (LC 141) - // serve para saber se a linked list tem um cycle, sem guardar os nodes visitados.
function hasCycle(head) {
  // passo 1 — esqueleto: o mesmo slow e fast
  let slow = head;
  let fast = head;
  while (fast !== null && fast.next !== null) {
    slow = slow.next;
    fast = fast.next.next;
    // passo 2 — encontraram-se no mesmo node: há cycle
    if (slow === fast) {
      return true;
    }
  }
  // passo 3 — o rápido chegou ao fim (null): não há cycle
  return false;
}
const cycle = toList([1, 2, 3]);
cycle.next.next.next = cycle; // o 3 aponta de volta para o 1
hasCycle(cycle); // result ==> true
hasCycle(toList([1, 2])); // result ==> false
hasCycle(null); // result ==> false  (fast é null, o while não corre)
// nota: slow === fast compara o NODE (a referência), não o value; dois nodes com val 1 diferentes não contam.

// §9 ── BINARY TREES ──────────

//--------------------------------------------------------------------
// Binary tree - // serve para quando o LeetCode dá `root`, com .left e .right; quase tudo é recursion.
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
tree.right.left.val; // result ==> 15
tree.left.right; // result ==> null  (o 9 é leaf, não tem right child)
// nota: a receita é sempre a mesma: 1. se o node é null, devolve a resposta vazia; 2. confiar que left e right já funcionam; 3. combinar.
// nota2: leaf é um node sem children; null é a ausência de node (o base case).

//--------------------------------------------------------------------
// Maximum Depth (LC 104) - // serve para saber quantos levels tem a tree.
function maxDepth(node) {
  // passo 1 — esqueleto: chegou ao fim (null), vale 0
  if (node === null) {
    return 0;
  }
  // passo 2 — lado esquerdo
  const leftDepth = maxDepth(node.left);
  // passo 3 — lado direito
  const rightDepth = maxDepth(node.right);
  // passo 4 — este node (1) + o lado mais fundo
  return 1 + Math.max(leftDepth, rightDepth);
}
maxDepth(tree); // result ==> 3
maxDepth(new TreeNode(1, new TreeNode(2))); // result ==> 2  (o node 2 dá 1, o lado direito dá 0)
maxDepth(new TreeNode(1)); // result ==> 1  (conta nodes, não edges)
// nota: compacto: const maxDepth = (node) => (node ? 1 + Math.max(maxDepth(node.left), maxDepth(node.right)) : 0);

//--------------------------------------------------------------------
// Invert Binary Tree (LC 226) - // serve para espelhar a tree, trocando left e right em todos os nodes.
function invertTree(node) {
  // passo 1 — esqueleto: chegou ao fim (null)
  if (node === null) {
    return null;
  }
  // passo 2 — lado esquerdo: inverter o child
  const invertedLeft = invertTree(node.left);
  // passo 3 — lado direito: inverter o child
  const invertedRight = invertTree(node.right);
  // passo 4 — trocar os dois
  node.left = invertedRight;
  node.right = invertedLeft;
  return node;
}
const small = new TreeNode(1, new TreeNode(2), new TreeNode(3));
invertTree(small);
small.left.val; // result ==> 3
small.val; // result ==> 1  (a root não muda de value; só os children trocam)
// nota: node.left = invertTree(node.right) seguido de node.right = invertTree(node.left) está ERRADO - o segundo já lê o left novo. Guardar primeiro.
// nota2: compacto: [node.left, node.right] = [invertTree(node.right), invertTree(node.left)].

//--------------------------------------------------------------------
// Same Tree (LC 100) - // serve para saber se duas trees são iguais, na forma e nos values, node a node.
function isSameTree(p, q) {
  // passo 1 — esqueleto: os dois chegaram ao fim (null)
  if (p === null && q === null) {
    return true;
  }
  // passo 2 — só um chegou ao fim
  if (p === null || q === null) {
    return false;
  }
  // passo 3 — values diferentes
  if (p.val !== q.val) {
    return false;
  }
  // passo 4 — lado esquerdo
  const sameLeft = isSameTree(p.left, q.left);
  // passo 5 — lado direito
  const sameRight = isSameTree(p.right, q.right);
  return sameLeft && sameRight;
}
isSameTree(invertTree(invertTree(tree)), tree); // result ==> true  (inverter duas vezes devolve a original)
isSameTree(new TreeNode(1), new TreeNode(1)); // result ==> true  (values iguais e os quatro children são null)
isSameTree(null, new TreeNode(1)); // result ==> false
// nota: p === q em nodes compara referências; aqui só se usava quando pelo menos um era null, por isso os if explícitos.

//--------------------------------------------------------------------
// Path Sum (LC 112) - // serve para saber se algum caminho da root a uma leaf soma target: 3 + 20 + 7 = 30.
function hasPathSum(node, target) {
  // passo 1 — esqueleto: chegou ao fim (null), não é caminho
  if (node === null) {
    return false;
  }
  // passo 2 — o que falta somar abaixo deste node
  const rest = target - node.val;
  // passo 3 — é leaf: tem de faltar exatamente 0
  if (node.left === null && node.right === null) {
    return rest === 0;
  }
  // passo 4 — lado esquerdo
  if (hasPathSum(node.left, rest)) {
    return true;
  }
  // passo 5 — lado direito
  if (hasPathSum(node.right, rest)) {
    return true;
  }
  return false;
}
hasPathSum(tree, 30); // result ==> true  (3 + 20 + 7)
hasPathSum(tree, 5); // result ==> false
hasPathSum(tree, 12); // result ==> true  (3 + 9 = 12 e o 9 é leaf)
// nota: parar na leaf, não no null - o caminho tem de acabar numa leaf; um null sozinho devolve false.

//--------------------------------------------------------------------
// Inorder Traversal (LC 94) - // serve para visitar todos os nodes e listar os values pela ordem left, node, right (DFS).
function inorder(node, out = []) {
  // passo 1 — esqueleto: chegou ao fim (null)
  if (node === null) {
    return out;
  }
  // passo 2 — lado esquerdo: tudo o que está à esquerda
  inorder(node.left, out);
  // passo 3 — este node
  out.push(node.val);
  // passo 4 — lado direito: tudo o que está à direita
  inorder(node.right, out);
  return out;
}
// preorder: o mesmo código, com o push antes dos children
function preorder(node, out = []) {
  if (node === null) {
    return out;
  }
  out.push(node.val);
  preorder(node.left, out);
  preorder(node.right, out);
  return out;
}
inorder(tree); // result ==> [9, 3, 15, 20, 7]
preorder(tree); // result ==> [3, 9, 20, 15, 7]  (cada node entra antes dos children)
// nota: só muda ONDE está o push: pre = push, left, right · in = left, push, right · post = left, right, push. Inorder numa BST dá os values ordenados.
// nota2: out = [] por omissão cria um array novo em cada call SEM out; as recursive calls passam o mesmo out.

//--------------------------------------------------------------------
// Level Order (LC 102) - // serve para ler a tree level a level (BFS): [[3], [9, 20], [15, 7]].
function levelOrder(root) {
  // passo 1 — esqueleto: a queue começa na root, um loop enquanto houver nodes por visitar
  if (root === null) {
    return [];
  }
  const levels = [];
  const queue = [root];
  while (queue.length > 0) {
    // passo 2 — fixar o tamanho ANTES de juntar children: o que está na queue agora é um level
    const size = queue.length;
    const level = [];
    for (let i = 0; i < size; i++) {
      const node = queue.shift();
      level.push(node.val);
      // passo 3 — lado esquerdo
      if (node.left !== null) {
        queue.push(node.left);
      }
      // passo 4 — lado direito
      if (node.right !== null) {
        queue.push(node.right);
      }
    }
    levels.push(level);
  }
  return levels;
}
levelOrder(tree); // result ==> [[3], [9, 20], [15, 7]]
levelOrder(new TreeNode(1, null, new TreeNode(2))); // result ==> [[1], [2]]  (o node 1 só tem right child)
levelOrder(null); // result ==> []
// nota: size fica fixo no level atual; queue.length cresce enquanto se juntam children. É medium, mas muitos easy usam isto.
// nota2: shift() é O(n); com um index que avança fica O(1).

// §10 ── MATEMÁTICA / BITS ──────────

//--------------------------------------------------------------------
// Single Number (LC 136) - // serve para achar o único número sem par: em [4, 1, 2, 1, 2] todos aparecem 2 vezes exceto o 4.
function singleNumber(nums) {
  // passo 1 — esqueleto: acc guarda o XOR de tudo o que já passou
  let acc = 0;
  for (const n of nums) {
    // passo 2 — x ^ x = 0 e x ^ 0 = x: os pares anulam-se
    acc = acc ^ n;
  }
  return acc;
}
singleNumber([4, 1, 2, 1, 2]); // result ==> 4  (acc: 4, 5, 7, 6, 4)
singleNumber([7, 3, 7]); // result ==> 3  (7 ^ 7 = 0 e 0 ^ 3 = 3; a ordem não importa)
// nota: ^ não é potência em JS, é XOR bit a bit; potência é **.
// nota2: compacto: nums.reduce((acc, n) => acc ^ n, 0).

//--------------------------------------------------------------------
// Missing Number (LC 268) - // serve para achar o número que falta em 0..n: [3, 0, 1] tem 3 números de 0..3, falta o 2.
function missingNumber(nums) {
  // passo 1 — esqueleto: n é o length, não length - 1 (o intervalo 0..n tem n + 1 números)
  const n = nums.length;
  // passo 2 — a soma que devia ser: 0 + 1 + … + n
  const expected = (n * (n + 1)) / 2;
  // passo 3 — a soma que o array tem
  let actual = 0;
  for (const num of nums) {
    actual = actual + num;
  }
  // passo 4 — a diferença é o que falta
  return expected - actual;
}
missingNumber([3, 0, 1]); // result ==> 2  (6 - 4)
missingNumber([0, 1]); // result ==> 2  (n = 2, expected = 3, actual = 1)
// nota: devia menos é.

//--------------------------------------------------------------------
// Palindrome Number (LC 9) - // serve para saber se um número se lê igual nos dois sentidos, sem strings: 121 é palíndromo, 10 não.
function isPalindromeNumber(x) {
  // passo 1 — esqueleto: negativo nunca é ("-121" ao contrário é "121-")
  if (x < 0) {
    return false;
  }
  // guardar o original, porque x vai ser gasto no loop
  const original = x;
  let reversed = 0;
  while (x > 0) {
    // passo 2 — o último dígito
    const digit = x % 10;
    // passo 3 — empurrar o que já está para a esquerda e juntar o dígito
    reversed = reversed * 10 + digit;
    // passo 4 — apagar o último dígito de x
    x = Math.floor(x / 10);
  }
  return reversed === original;
}
isPalindromeNumber(121); // result ==> true
isPalindromeNumber(10); // result ==> false  (01 não é 10: reversed fica 1)
isPalindromeNumber(-121); // result ==> false
// nota: comparar com original, não com x - no fim x é 0.

//--------------------------------------------------------------------
// Power of Two (LC 231) - // serve para saber se n é 1, 2, 4, 8, … em O(1).
function isPowerOfTwo(n) {
  // zero e negativos nunca são
  if (n <= 0) {
    return false;
  }
  // uma potência de 2 tem um só bit 1; n - 1 vira esse bit e acende os de baixo, logo n & (n - 1) dá 0
  if ((n & (n - 1)) === 0) {
    return true;
  }
  return false;
}
isPowerOfTwo(16); // result ==> true  (10000 & 01111 = 0)
isPowerOfTwo(12); // result ==> false  (1100 & 1011 = 1000)
isPowerOfTwo(0); // result ==> false  (0 & -1 dá 0, mas n <= 0 falha primeiro)
7 % 2; // result ==> 1  (ímpar usa % 2, não bits)
// nota: n & (n - 1) diz "potência de 2"; % 2 diz "par ou ímpar".

//--------------------------------------------------------------------
// Climbing Stairs (LC 70) - // serve para contar de quantas maneiras se sobe n degraus, 1 ou 2 de cada vez (a primeira dynamic programming).
function climbStairs(n) {
  // passo 1 — esqueleto: as maneiras de chegar aos dois degraus de trás (degrau 0 e degrau 1)
  let twoBack = 1;
  let oneBack = 1;
  for (let step = 2; step <= n; step++) {
    // passo 2 — degrau novo = os dois anteriores somados (Fibonacci)
    const current = twoBack + oneBack;
    // passo 3 — avançar a window
    twoBack = oneBack;
    oneBack = current;
  }
  return oneBack;
}
climbStairs(2); // result ==> 2
climbStairs(5); // result ==> 8  (1, 2, 3, 5, 8)
climbStairs(3); // result ==> 3  (1+1+1, 1+2 e 2+1)
// nota: a = b; b = a + b em duas linhas está ERRADO - o segundo já usa o a novo. Guardar current primeiro.
// nota2: compacto: [a, b] = [b, a + b].

// §11 ── LISTA DE TREINO ──────────
// Por esta ordem. Tentar cada um sozinho 20 min antes de olhar para cima.
//   Hash map:        1 Two Sum · 217 · 242 · 387 · 383 Ransom Note · 349 Intersection of Two Arrays
//   Romanos:         13 Roman to Integer · 12 Integer to Roman (dizem que saiu na Thought Machine)
//   Two pointers:    125 · 344 · 26 · 283 · 88 · 977 Squares of a Sorted Array
//   Window/prefix:   121 · 1480 · 643 Maximum Average Subarray I · 53
//   Binary search:   704 · 35 · 278 First Bad Version
//   Stack:           20 · 232 Implement Queue using Stacks · 1047 Remove All Adjacent Duplicates
//   Linked list:     206 · 21 · 876 · 141 · 83 Remove Duplicates from Sorted List
//   Trees:           104 · 226 · 100 · 112 · 101 Symmetric Tree · 94 Inorder Traversal
//   Matemática/bits: 136 · 268 · 9 · 70 · 191 Number of 1 Bits

console.log("✅ Easy OK");
