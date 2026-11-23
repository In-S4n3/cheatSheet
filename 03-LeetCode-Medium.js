// PADRÕES LEETCODE (nível MÉDIO) — JavaScript
// Correr: node 03-LeetCode-Medium.js → escreve "✅ Medium OK".
// Verificar cada "// result ==>": node check-results.js 03-LeetCode-Medium.js
// Antes deste: 02-LeetCode-Easy.js (Map, Set, sort com (a, b) => a - b).
// Peças básicas de JS (Map, Set, sort, ??, …): 01-JS-Fundamentals.js (01) e 02-LeetCode-Easy.js (02).
// Formato de cada bloco: STYLE.md (nome - serve para → código com dados reais → result ==> valor → no máximo duas notas; algoritmos por camadas, passo 1, passo 2, …).

/*
  ÍNDICE (Ctrl+F "§N ──")
    §1  Como atacar um médio numa entrevista
    §2  Hash map avançado (prefix sum, agrupar, sequências, top K)
    §3  Dois ponteiros (3Sum, Container With Most Water)
    §4  Janela deslizante variável com Map
    §5  Pilha monótona + pilha
    §6  Pesquisa binária avançada (array rodado, pesquisa binária na resposta)
    §7  Intervalos
    §8  Matriz / grelha (DFS, BFS com várias origens)
    §9  Grafos (lista de adjacência, ordenação topológica)
    §10 Backtracking
    §11 Heap (MinHeap escrito à mão)
    §12 Programação dinâmica
    §13 Listas ligadas (médio)
    §14 Árvores (médio)
    §15 Tabela final: sinal → padrão + que Big-O o n permite
    §16 Plano de 7 dias
*/

// =====================================================================================
// §1 ── COMO ATACAR UM MÉDIO NUMA ENTREVISTA ──────────
// =====================================================================================
// Avaliam como pensas, não só a resposta. Fala o tempo todo.
//   1. Pergunta: vazio? 1 elemento? repetidos? negativos? ordenado? índices ou valores? qual o tamanho de n?
//   2. Resolve o exemplo à mão, em voz alta.
//   3. Diz primeiro a solução lenta ("dois for, O(n²)"). Não precisas de a escrever.
//   4. Torna-a mais rápida: "o que estou a repetir?" → um Map/Set. Ou: "ordenar torna isto fácil?"
//   5. Escreve com nomes claros (left, right, freq).
//   6. Percorre o código com o exemplo, depois com um caso limite.
//   7. Diz tempo E espaço no fim, antes de perguntarem.
// Casos limite a testar: [] · [5] · [2,2,2] · [-3,0,3] · ordenado / invertido · sem resposta · "A" vs "a"

//--------------------------------------------------------------------
// 0.1 + 0.2 - // serve para não falhar um teste por comparar decimais com ===.

0.1 + 0.2 === 0.3; // result ==> false  (0.1 + 0.2 dá 0.30000000000000004)
Math.abs(0.1 + 0.2 - 0.3) < Number.EPSILON; // result ==> true  (a diferença é ~5.5e-17, menor que ~2.2e-16)
Number.MAX_SAFE_INTEGER; // result ==> 9007199254740991
"Ab".toLowerCase() === "ab"; // result ==> true
0.1 * 3 === 0.3; // result ==> false  (0.1 * 3 dá 0.30000000000000004, o mesmo erro de arredondamento)
// nota: os decimais são aproximações binárias; compara a diferença com um valor pequeno. Os inteiros são exatos até 2^53 - 1 (MAX_SAFE_INTEGER).
// nota2: Number.EPSILON só serve para números perto de 1; para valores grandes usa uma tolerância relativa. Divisão inteira: Math.floor ou Math.trunc.

// =====================================================================================
// §2 ── HASH MAP AVANÇADO ──────────
// =====================================================================================
// Usar quando o enunciado diz: "subarray com soma k", "agrupar", "anagramas", "sequência consecutiva", "os k mais frequentes", "contar quantos"

//--------------------------------------------------------------------
// Subarray Sum Equals K (LC 560) - // serve para contar quantos pedaços seguidos de [1, 2, 3] somam k = 3, mesmo com negativos.

function subarraySum(nums, k) {
  // passo 1 — esqueleto: o contador, o ciclo principal e o return
  let total = 0;

  // passo 2 — o prefixo é a soma de tudo até agora
  let prefix = 0;

  // passo 3 — seen: chave = prefixo já visto, valor = quantas vezes apareceu
  // o prefixo 0 existe uma vez: permite pedaços que começam no índice 0
  const seen = new Map();
  seen.set(0, 1);

  for (const num of nums) {
    // o prefixo ganha o número novo
    prefix = prefix + num;

    // passo 4 — que prefixo anterior deixaria um pedaço de soma k?
    const wanted = prefix - k;

    // já vi esse prefixo? cada vez que apareceu é um pedaço que termina aqui
    if (seen.has(wanted)) {
      total = total + seen.get(wanted);
    }

    // passo 5 — só agora guardo o prefixo atual (procurar ANTES de guardar)
    if (seen.has(prefix)) {
      seen.set(prefix, seen.get(prefix) + 1);
    } else {
      seen.set(prefix, 1);
    }
  }

  return total;
}

subarraySum([1, 2, 3], 3); // result ==> 2  ([1,2] e [3])
subarraySum([1, 1, 1], 2); // result ==> 2  ([1,1] duas vezes)
subarraySum([1, -1, 0], 0); // result ==> 3  (negativos e zero)
subarraySum([], 0); // result ==> 0
subarraySum([5], 5); // result ==> 1
subarraySum([2, 2], 2); // result ==> 2  (prefixos 2 e 4: o 2 encontra o 0 inicial, o 4 encontra o 2)
// nota: soma(i..j) = prefixo(j) - prefixo(i-1). O(n) tempo e espaço. A janela deslizante só serve com números positivos; com negativos usa prefix sum + Map.
// nota2: em [1, 2, 3] com k = 3: prefixos 1, 3, 6. No 3 procura 0 (existe, conta [1,2]); no 6 procura 3 (existe, conta [3]).

//--------------------------------------------------------------------
// Group Anagrams (LC 49) - // serve para juntar ["eat", "tea", "tan"] em [["eat", "tea"], ["tan"]].

function groupAnagrams(strs) {
  // passo 1 — esqueleto: o Map dos grupos, o ciclo e o return
  // groups: chave = letras da palavra ordenadas ("aet"), valor = lista das palavras com essas letras
  const groups = new Map();

  for (const word of strs) {
    // passo 2 — a chave: "eat" vira ["e","a","t"], ordena, junta em "aet"
    const letters = [...word];
    letters.sort();
    const key = letters.join("");

    // passo 3 — chave nova? cria a lista vazia
    if (groups.has(key) === false) {
      groups.set(key, []);
    }

    // a palavra entra no grupo da sua chave
    groups.get(key).push(word);
  }

  // só os arrays, sem as chaves
  return [...groups.values()];
}

groupAnagrams(["eat", "tea", "tan", "ate", "nat", "bat"]).map((group) => group.toSorted()).toSorted(); // result ==> [["ate", "eat", "tea"], ["bat"], ["nat", "tan"]]
groupAnagrams([""]); // result ==> [[""]]
groupAnagrams([]); // result ==> []
groupAnagrams(["ab", "ba", "abc"]).length; // result ==> 2  ("ab" e "ba" têm a chave "ab"; "abc" tem a sua)
// nota: o LeetCode aceita qualquer ordem; os exemplos usam toSorted() (uma cópia ordenada) para o resultado ser sempre igual. O(n · L log L), L = tamanho da palavra.
// nota2: get().push() muda o array que já está no Map, por isso não é preciso voltar a fazer set(). Versão compacta da chave: [...word].sort().join("").

//--------------------------------------------------------------------
// Longest Consecutive Sequence (LC 128) - // serve para achar 1,2,3,4 em [100, 4, 200, 1, 3, 2] sem ordenar.

function longestConsecutive(nums) {
  // passo 1 — esqueleto: o Set (has() em O(1), sem repetidos), o melhor e o return
  const set = new Set(nums);
  let best = 0;

  for (const num of set) {
    // passo 2 — só começa a contar num número que NÃO tem o anterior no Set
    // assim cada sequência é contada uma só vez, a partir do início
    const isStart = set.has(num - 1) === false;

    if (isStart) {
      // passo 3 — conta para cima enquanto o próximo existir
      let length = 1;
      while (set.has(num + length)) {
        length++;
      }

      // passo 4 — guarda se foi a maior
      best = Math.max(best, length);
    }
  }

  return best;
}

longestConsecutive([100, 4, 200, 1, 3, 2]); // result ==> 4  (1,2,3,4)
longestConsecutive([0, 3, 7, 2, 5, 8, 4, 6, 0, 1]); // result ==> 9
longestConsecutive([]); // result ==> 0
longestConsecutive([1, 2, 0, 1]); // result ==> 3  (repetidos)
longestConsecutive([-1, -2, 5]); // result ==> 2  (negativos)
longestConsecutive([5, 6, 8]); // result ==> 2  (5,6; o 8 fica sozinho porque falta o 7)
// nota: O(n). O while dentro do for não dá O(n²): cada número só é percorrido pelo while a partir do início da sua sequência. Ordenar primeiro (O(n log n)) também é aceite.
// nota2: em [100, 4, 200, 1, 3, 2], o 4 tem o 3 no Set, por isso não é início; o 1 não tem o 0, por isso conta 1,2,3,4.

//--------------------------------------------------------------------
// Top K Frequent Elements (LC 347) - // serve para achar os k números que aparecem mais: em [1,1,1,2,2,3] com k = 2, devolve [1, 2].

function topKFrequent(nums, k) {
  // passo 1 — esqueleto: contar, pôr em baldes, ler os baldes, return
  // freq: chave = número, valor = quantas vezes aparece
  const freq = new Map();
  for (const num of nums) {
    if (freq.has(num)) {
      freq.set(num, freq.get(num) + 1);
    } else {
      freq.set(num, 1);
    }
  }

  // passo 2 — baldes: o ÍNDICE é a frequência, o valor é a lista dos números com ela
  // a frequência máxima possível é nums.length, por isso o array tem nums.length + 1 posições
  const buckets = Array.from({ length: nums.length + 1 }, () => []);
  for (const [num, count] of freq) {
    buckets[count].push(num);
  }

  // passo 3 — lê do balde maior para o menor até ter k números
  const result = [];
  for (let count = buckets.length - 1; count >= 0 && result.length < k; count--) {
    for (const num of buckets[count]) {
      if (result.length < k) {
        result.push(num);
      }
    }
  }

  return result;
}

topKFrequent([1, 1, 1, 2, 2, 3], 2).toSorted((a, b) => a - b); // result ==> [1, 2]
topKFrequent([1], 1); // result ==> [1]
topKFrequent([-1, -1, 4, 4, 4, 7], 2).toSorted((a, b) => a - b); // result ==> [-1, 4]
topKFrequent([4, 4, 5], 1); // result ==> [4]  (o 4 está no balde 2, o 5 no balde 1; lê-se primeiro o balde 2)
// nota: O(n). Na entrevista também serve [...freq].sort((a, b) => b[1] - a[1]).slice(0, k), em O(n log n).
// nota2: buckets[count] usa a frequência como índice, não o número; por isso o array vai até nums.length.

// =====================================================================================
// §3 ── DOIS PONTEIROS ──────────
// =====================================================================================
// Usar quando o enunciado diz: "array ordenado", "par/trio que soma X", "sem repetidos no resultado", "maior área entre dois"
// Molde: começa nas duas pontas e anda para o meio.
//   let left = 0, right = arr.length - 1;
//   while (left < right) {
//     if (condição cumprida) { guardar; left++; right--; }
//     else if (preciso de mais) left++;   // num array ordenado, subir left aumenta o valor
//     else right--;
//   }

//--------------------------------------------------------------------
// 3Sum (LC 15) - // serve para achar todos os trios que somam 0 em [-1, 0, 1, 2, -1, -4], sem trios repetidos.

function threeSum(nums) {
  // passo 1 — esqueleto: ordenar uma cópia, fixar o 1.º número, return
  const sorted = [...nums].sort((a, b) => a - b); // cópia: não altera o input
  const triplets = [];

  for (let i = 0; i < sorted.length - 2; i++) {
    // passo 2 — 1.º número igual ao anterior? já deu esses trios, não repete
    const isRepeated = i > 0 && sorted[i] === sorted[i - 1];

    if (isRepeated === false) {
      // passo 3 — dois ponteiros à procura do 2.º e do 3.º número
      let left = i + 1;
      let right = sorted.length - 1;

      while (left < right) {
        const sum = sorted[i] + sorted[left] + sorted[right];

        // soma certa: guarda o trio e fecha os dois ponteiros
        if (sum === 0) {
          triplets.push([sorted[i], sorted[left], sorted[right]]);
          left++;
          right--;

          // passo 4 — salta os repetidos do 2.º número
          while (left < right && sorted[left] === sorted[left - 1]) {
            left++;
          }
        }
        // soma pequena: preciso de mais, sobe o left
        else if (sum < 0) {
          left++;
        }
        // soma grande: preciso de menos, desce o right
        else {
          right--;
        }
      }
    }
  }

  return triplets;
}

threeSum([-1, 0, 1, 2, -1, -4]); // result ==> [[-1, -1, 2], [-1, 0, 1]]
threeSum([0, 0, 0, 0]); // result ==> [[0, 0, 0]]  (repetidos, um só trio)
threeSum([0, 1, 1]); // result ==> []
threeSum([]); // result ==> []
threeSum([-2, 0, 1, 1, 2]); // result ==> [[-2, 0, 2], [-2, 1, 1]]  (com -2, os ponteiros acham 0+2 e depois 1+1)
// nota: O(n²) tempo. Compara com i - 1, não com i + 1: com i + 1 saltavas o 1.º -1 e perdias [-1,-1,2]; com i - 1 usas o 1.º e só saltas os seguintes.
// nota2: em [-4, -1, -1, 0, 1, 2] com i = 1: acha (-1,-1,2) e (-1,0,1); i = 2 também vale -1, por isso é saltado.

//--------------------------------------------------------------------
// Container With Most Water (LC 11) - // serve para escolher as duas paredes que guardam mais água: largura × altura da mais baixa.

function maxArea(height) {
  // passo 1 — esqueleto: duas pontas, o melhor e o return
  let left = 0;
  let right = height.length - 1;
  let best = 0;

  while (left < right) {
    // passo 2 — a água entre as duas paredes
    const width = right - left;
    const lowerWall = Math.min(height[left], height[right]); // a água fica pela parede mais baixa
    best = Math.max(best, width * lowerWall);

    // passo 3 — mexe sempre a parede mais baixa
    // mexer a mais alta só encolhe a largura e a baixa continua a limitar
    // parede esquerda mais baixa: sobe o left
    if (height[left] < height[right]) {
      left++;
    }
    // parede direita mais baixa (ou igual): desce o right
    else {
      right--;
    }
  }

  return best;
}

maxArea([1, 8, 6, 2, 5, 4, 8, 3, 7]); // result ==> 49  (paredes 8 e 7: largura 7 × altura 7)
maxArea([1, 1]); // result ==> 1
maxArea([5]); // result ==> 0
maxArea([2, 3, 4]); // result ==> 4  (pontas 2 e 4: 2 × 2 = 4; depois 3 e 4: 1 × 3 = 3)
// nota: O(n) tempo, O(1) espaço. O array NÃO está ordenado: os ponteiros mexem-se pela altura, não pela soma como no 3Sum.
// nota2: em [1, 8, 6, 2, 5, 4, 8, 3, 7]: 8 × 1 = 8 (mexe o left), 7 × 7 = 49 (mexe o right), 6 × 3 = 18 (mexe o right).

// =====================================================================================
// §4 ── JANELA DESLIZANTE VARIÁVEL COM MAP ──────────
// =====================================================================================
// Usar quando o enunciado diz: "substring/subarray contíguo", "o mais longo/curto", "sem repetir", "no máximo k", "todas as posições de um anagrama"
// Molde: cresce pela direita; encolhe pela esquerda enquanto a janela está inválida.
//   const freq = new Map(); let left = 0, best = 0;
//   for (let right = 0; right < s.length; right++) {
//     juntar s[right] a freq;
//     while (janela inválida) { tirar s[left] de freq; left++; }
//     best = Math.max(best, right - left + 1);   // tamanho da janela
//   }

//--------------------------------------------------------------------
// Longest Substring Without Repeating Characters (LC 3) - // serve para achar o maior pedaço sem letras repetidas: em "pwwkew" é "wke" (3).

function lengthOfLongestSubstring(s) {
  // passo 1 — esqueleto: a janela [left..right], o melhor e o return
  // freq: chave = letra, valor = quantas vezes está na janela atual
  const freq = new Map();
  let left = 0;
  let best = 0;

  for (let right = 0; right < s.length; right++) {
    // passo 2 — entra a letra da direita
    const entering = s[right];
    if (freq.has(entering)) {
      freq.set(entering, freq.get(entering) + 1);
    } else {
      freq.set(entering, 1);
    }

    // passo 3 — a janela ficou inválida (letra repetida)? encolhe pela esquerda até ela voltar a 1
    while (freq.get(entering) > 1) {
      const leaving = s[left];
      freq.set(leaving, freq.get(leaving) - 1);
      left++;
    }

    // passo 4 — guarda o tamanho da janela se for o maior
    best = Math.max(best, right - left + 1);
  }

  return best;
}

lengthOfLongestSubstring("pwwkew"); // result ==> 3  ("wke")
lengthOfLongestSubstring("abcabcbb"); // result ==> 3  ("abc")
lengthOfLongestSubstring("bbbbb"); // result ==> 1
lengthOfLongestSubstring(""); // result ==> 0
lengthOfLongestSubstring(" "); // result ==> 1  (o espaço também é um carácter)
lengthOfLongestSubstring("aA"); // result ==> 2  (maiúscula ≠ minúscula)
lengthOfLongestSubstring("abba"); // result ==> 2  ("ab"; no 2.º b encolhe para "b"; depois "ba")
// nota: O(n) tempo, O(tamanho do alfabeto) espaço. É substring, não subsequência: "pwke" não conta, porque não é seguido em "pwwkew".
// nota2: em "pwwkew", no 2.º w o w fica com 2: sai o "p", sai o "w", left = 2 e a janela é "w".

//--------------------------------------------------------------------
// Longest Repeating Character Replacement (LC 424) - // serve para achar o maior pedaço de uma só letra trocando até k letras: "AABABBA" com k = 1 dá 4 ("AAAA").

function characterReplacement(s, k) {
  // passo 1 — esqueleto: a janela [left..right], o melhor e o return
  // freq: chave = letra, valor = quantas vezes está na janela
  const freq = new Map();
  let left = 0;
  let maxFreq = 0; // a maior contagem de uma letra vista até agora
  let best = 0;

  for (let right = 0; right < s.length; right++) {
    // passo 2 — entra a letra da direita
    const entering = s[right];
    if (freq.has(entering)) {
      freq.set(entering, freq.get(entering) + 1);
    } else {
      freq.set(entering, 1);
    }

    // passo 3 — atualiza a letra mais comum
    maxFreq = Math.max(maxFreq, freq.get(entering));

    // passo 4 — mais de k letras a trocar (tamanho - maxFreq)? encolhe pela esquerda
    while (right - left + 1 - maxFreq > k) {
      const leaving = s[left];
      freq.set(leaving, freq.get(leaving) - 1);
      left++;
    }

    // passo 5 — guarda o tamanho da janela se for o maior
    best = Math.max(best, right - left + 1);
  }

  return best;
}

characterReplacement("AABABBA", 1); // result ==> 4
characterReplacement("ABAB", 2); // result ==> 4
characterReplacement("A", 0); // result ==> 1
characterReplacement("", 2); // result ==> 0
characterReplacement("AAAB", 0); // result ==> 3  (sem trocas, o maior pedaço de uma só letra é "AAA")
// nota: O(n) tempo, O(26) espaço. No LC 3 a janela é inválida quando uma letra repete; aqui, quando há mais de k letras diferentes da mais comum.
// nota2: maxFreq nunca desce ao encolher. Não faz mal: só um maxFreq MAIOR pode dar uma resposta melhor.

//--------------------------------------------------------------------
// Find All Anagrams in a String (LC 438) - // serve para achar as posições onde começa um anagrama de p: em "cbaebabacd" com p = "abc" dá [0, 6].

function findAnagrams(s, p) {
  // passo 1 — esqueleto: contagens, janela de tamanho FIXO p.length, return
  // p maior que s: não cabe nenhuma janela
  if (p.length > s.length) {
    return [];
  }

  // índice 0 = 'a', 1 = 'b', …, 25 = 'z' (só letras minúsculas); 'a' vale 97
  const letterIndex = (letter) => letter.charCodeAt(0) - 97;

  // passo 2 — contagem das letras de p, e contagem das letras da janela
  const targetCount = new Array(26).fill(0);
  const windowCount = new Array(26).fill(0);
  for (const letter of p) {
    targetCount[letterIndex(letter)]++;
  }

  const starts = [];
  for (let right = 0; right < s.length; right++) {
    // passo 3 — entra a letra da direita
    windowCount[letterIndex(s[right])]++;

    // passo 4 — a janela passou o tamanho de p? sai a letra da esquerda
    if (right >= p.length) {
      windowCount[letterIndex(s[right - p.length])]--;
    }

    // passo 5 — a janela já tem p.length letras e as contagens são iguais? guarda o início
    const windowIsFull = right >= p.length - 1;
    if (windowIsFull && windowCount.join() === targetCount.join()) {
      starts.push(right - p.length + 1);
    }
  }

  return starts;
}

findAnagrams("cbaebabacd", "abc"); // result ==> [0, 6]  ("cba" e "bac")
findAnagrams("abab", "ab"); // result ==> [0, 1, 2]
findAnagrams("a", "ab"); // result ==> []
findAnagrams("", "a"); // result ==> []
findAnagrams("aaa", "aa"); // result ==> [0, 1]  (as janelas "aa" começam nos índices 0 e 1)
// nota: O(26 · n) = O(n) tempo, O(1) espaço. Janela fixa: entra um, sai um, compara as contagens.
// nota2: a === b com arrays compara a REFERÊNCIA e dá false para dois arrays iguais; join() faz texto, que se compara por valor.

// =====================================================================================
// §5 ── PILHA MONÓTONA + PILHA ──────────
// =====================================================================================
// Usar quando o enunciado diz: "próximo maior/menor", "quantos dias até", "o primeiro à direita que…", "avaliar expressão", "mínimo em O(1)"
// Molde (pilha monótona): a pilha guarda ÍNDICES que ainda esperam pela resposta.
//   const stack = [];
//   for (let i = 0; i < arr.length; i++) {
//     while (stack.length && arr[i] > arr[stack.at(-1)]) {   // i é a resposta do topo
//       const j = stack.pop(); answer[j] = ...i...;
//     }
//     stack.push(i);
//   }
// Cada índice entra e sai uma vez → O(n), mesmo com o while dentro do for.

//--------------------------------------------------------------------
// Daily Temperatures (LC 739) - // serve para dizer, para cada dia, quantos dias faltam até um dia mais quente (0 se nunca aquece).

function dailyTemperatures(temps) {
  // passo 1 — esqueleto: a resposta (0 = nunca aquece), a pilha, o ciclo e o return
  const answer = new Array(temps.length).fill(0);

  // passo 2 — a pilha guarda os ÍNDICES dos dias ainda à espera de um dia mais quente
  // a resposta é uma distância (i - day); a temperatura lê-se com temps[índice]
  const stack = [];

  for (let i = 0; i < temps.length; i++) {
    // passo 3 — o dia de hoje é mais quente que o do topo? resolve-o, tira e repete
    while (stack.length > 0 && temps[i] > temps[stack.at(-1)]) {
      const day = stack.pop();
      answer[day] = i - day;
    }

    // passo 4 — hoje fica à espera do seu dia mais quente
    stack.push(i);
  }

  return answer;
}

dailyTemperatures([73, 74, 75, 71, 69, 72, 76, 73]); // result ==> [1, 1, 4, 2, 1, 1, 0, 0]
dailyTemperatures([30, 30, 30]); // result ==> [0, 0, 0]  (igual não é "mais quente")
dailyTemperatures([]); // result ==> []
dailyTemperatures([50, 40, 60]); // result ==> [2, 1, 0]  (o 60 resolve o 40 e depois o 50; ninguém aquece depois do 60)
// nota: O(n) tempo e espaço. Cada índice entra e sai uma vez, por isso o while dentro do for continua O(n).
// nota2: em [73, 74, 75, 71, 69, 72, 76, 73], no dia 5 (72) saem o 69 (res[4] = 1) e o 71 (res[3] = 2); o 75 fica à espera.

//--------------------------------------------------------------------
// Evaluate Reverse Polish Notation (LC 150) - // serve para calcular ["2","1","+","3","*"] = (2+1)*3, com o operador DEPOIS dos números.

function evalRPN(tokens) {
  // passo 1 — esqueleto: a pilha, o ciclo sobre os tokens e o return
  const stack = [];

  // passo 2 — a tabela de operadores: chave = símbolo, valor = função que calcula
  const ops = {
    "+": (a, b) => a + b,
    "-": (a, b) => a - b,
    "*": (a, b) => a * b,
    "/": (a, b) => Math.trunc(a / b), // enunciado: a divisão corta para zero
  };

  for (const token of tokens) {
    // passo 3 — o token é um operador: tira dois, calcula e devolve o resultado à pilha
    if (token in ops) {
      const right = stack.pop(); // sai primeiro o operando da DIREITA
      const left = stack.pop(); // depois o da esquerda
      stack.push(ops[token](left, right));
    }
    // passo 4 — o token é um número: entra na pilha
    else {
      stack.push(Number(token));
    }
  }

  return stack[0];
}

evalRPN(["2", "1", "+", "3", "*"]); // result ==> 9
evalRPN(["4", "13", "5", "/", "+"]); // result ==> 6
evalRPN(["10", "6", "9", "3", "+", "-11", "*", "/", "*", "17", "+", "5", "+"]); // result ==> 22
evalRPN(["-7", "2", "/"]); // result ==> -3  (trunc corta para zero; floor daria -4)
evalRPN(["5", "2", "-"]); // result ==> 3  (right = 2 sai primeiro, left = 5; 5 - 2, não 2 - 5)
// nota: O(n) tempo e espaço. Math.trunc(-3.5) = -3 e Math.floor(-3.5) = -4: com negativos diferem.
// nota2: em ["2","1","+","3","*"]: pilha [2,1], o "+" dá [3]; entra o 3, [3,3], o "*" dá [9].

//--------------------------------------------------------------------
// Min Stack (LC 155) - // serve para ter uma pilha com push, pop, top e getMin, todos instantâneos.

class MinStack {
  // passo 1 — esqueleto: duas pilhas lado a lado
  // values = os valores; mins[i] = o menor valor entre values[0..i]
  constructor() {
    this.values = [];
    this.mins = [];
  }

  push(value) {
    this.values.push(value);

    // passo 2 — a pilha de mínimos está vazia? o mínimo é o próprio valor
    if (this.mins.length === 0) {
      this.mins.push(value);
    }
    // senão, o novo mínimo é o menor entre o valor e o mínimo anterior
    else {
      const previousMin = this.mins.at(-1);
      this.mins.push(Math.min(value, previousMin));
    }
  }

  // passo 3 — pop tira dos dois lados
  pop() {
    this.values.pop();
    this.mins.pop();
  }

  top() {
    return this.values.at(-1);
  }

  getMin() {
    return this.mins.at(-1);
  }
}

{
  const ms = new MinStack();
  ms.push(-2);
  ms.push(0);
  ms.push(-3);
  ms.getMin(); // result ==> -3  (values [-2, 0, -3], mins [-2, -2, -3])
  ms.pop();
  ms.top(); // result ==> 0
  ms.getMin(); // result ==> -2  (values [-2, 0], mins [-2, -2])

  const other = new MinStack();
  other.push(5);
  other.push(3);
  other.pop();
  other.getMin(); // result ==> 5  (o pop tira o 3 e o seu mínimo; fica mins = [5])
}
// nota: todas as operações são O(1). Uma variável min não sabia qual era o mínimo anterior depois de um pop; a pilha de mínimos sabe.
// nota2: versão compacta do push: this.mins.push(Math.min(value, this.mins.at(-1) ?? Infinity)); o Infinity serve para a pilha vazia.

// =====================================================================================
// §6 ── PESQUISA BINÁRIA AVANÇADA ──────────
// =====================================================================================
// Usar quando o enunciado diz: "ordenado (mas rodado)", "em O(log n)", "a menor velocidade/capacidade que consegue…", n até 10^9
// Molde (pesquisa binária na resposta): o menor x que funciona.
//   let lo = minPossível, hi = maxPossível;
//   while (lo < hi) {
//     const mid = Math.floor((lo + hi) / 2);
//     if (works(mid)) hi = mid;   // mid funciona; talvez haja um menor
//     else lo = mid + 1;          // mid falha; a resposta está acima
//   }
//   return lo;
// Só funciona se "x funciona" implica "x + 1 também funciona".

//--------------------------------------------------------------------
// Search in Rotated Sorted Array (LC 33) - // serve para achar um número em [4,5,6,7,0,1,2] em O(log n), num array ordenado que foi rodado.

function searchRotated(nums, target) {
  // passo 1 — esqueleto: a zona [lo..hi] onde o target ainda pode estar, o meio, return
  let lo = 0;
  let hi = nums.length - 1;

  while (lo <= hi) {
    const mid = Math.floor((lo + hi) / 2);

    // passo 2 — encontrado: o return termina a função já
    if (nums[mid] === target) {
      return mid;
    }

    // passo 3 — em cada mid UMA das metades está ordenada; descobre qual
    const leftHalfIsSorted = nums[lo] <= nums[mid];

    // metade esquerda [lo..mid] ordenada
    if (leftHalfIsSorted) {
      // o target cabe nela? fica com a esquerda
      if (nums[lo] <= target && target < nums[mid]) {
        hi = mid - 1;
      }
      // senão, vai para a direita
      else {
        lo = mid + 1;
      }
    }
    // metade direita [mid..hi] ordenada
    else {
      // o target cabe nela? fica com a direita
      if (nums[mid] < target && target <= nums[hi]) {
        lo = mid + 1;
      }
      // senão, vai para a esquerda
      else {
        hi = mid - 1;
      }
    }
  }

  // passo 4 — só chega aqui se o while acabar sem encontrar
  return -1;
}

searchRotated([4, 5, 6, 7, 0, 1, 2], 0); // result ==> 4
searchRotated([4, 5, 6, 7, 0, 1, 2], 3); // result ==> -1
searchRotated([1], 0); // result ==> -1
searchRotated([1], 1); // result ==> 0
searchRotated([3, 1], 1); // result ==> 1
searchRotated([1, 2, 3], 3); // result ==> 2  (não rodado)
searchRotated([], 5); // result ==> -1
searchRotated([5, 1, 3], 5); // result ==> 0  (mid = 1: a direita 1..3 está ordenada e não tem o 5; hi = 0; depois mid = 0 acha o 5)
// nota: O(log n) tempo, O(1) espaço. Para achar um valor exato usa-se lo <= hi (a zona de 1 elemento ainda é testada); na pesquisa na resposta usa-se lo < hi e devolve-se lo.
// nota2: em [4,5,6,7,0,1,2] com target 0: mid 3 (7), a esquerda 4..7 está ordenada e não tem o 0, lo = 4; mid 5 (1), hi = 4; mid 4 (0), return 4.

//--------------------------------------------------------------------
// Koko Eating Bananas (LC 875) - // serve para achar a menor velocidade que come todas as pilhas em h horas: [3, 6, 7, 11] com h = 8 dá 4.

function minEatingSpeed(piles, h) {
  // passo 1 — esqueleto: a pesquisa binária sobre a VELOCIDADE (de 1 até à maior pilha), return lo
  // passo 2 — a função auxiliar: horas precisas a uma velocidade
  const hoursAt = (speed) => {
    let totalHours = 0;
    for (const pile of piles) {
      // uma pilha de 3 a 2/hora leva 2 horas: sobe sempre (ceil)
      totalHours = totalHours + Math.ceil(pile / speed);
    }
    return totalHours;
  };

  let lo = 1;
  let hi = Math.max(...piles);

  while (lo < hi) {
    const mid = Math.floor((lo + hi) / 2);

    // passo 3 — mid chega? talvez haja uma velocidade menor: tenta mais devagar
    if (hoursAt(mid) <= h) {
      hi = mid;
    }
    // mid não chega: a resposta está acima, tenta mais depressa
    else {
      lo = mid + 1;
    }
  }

  // lo === hi: a menor velocidade que funciona
  return lo;
}

minEatingSpeed([3, 6, 7, 11], 8); // result ==> 4
minEatingSpeed([30, 11, 23, 4, 20], 5); // result ==> 30  (h = número de pilhas: a maior pilha)
minEatingSpeed([30, 11, 23, 4, 20], 6); // result ==> 23
minEatingSpeed([1], 1); // result ==> 1
minEatingSpeed([4], 2); // result ==> 2  (a 1/hora leva 4 horas, mais que 2; a 2/hora leva 2)
// nota: O(n · log(maiorPilha)) tempo. Pesquisa-se a resposta, não o array. Versão compacta de hoursAt: piles.reduce((total, pile) => total + Math.ceil(pile / speed), 0).
// nota2: Math.max(...piles) pode rebentar com arrays enormes (centenas de milhares); aí usa um for ou reduce. Math.ceil, não floor: a Koko não come duas pilhas na mesma hora.

// =====================================================================================
// §7 ── INTERVALOS ──────────
// =====================================================================================
// Usar quando o enunciado diz: pares [início, fim], "sobrepostos", "juntar", "reuniões", "inserir"
// Molde: ordena por início; sobrepõem-se se atual.início <= último.fim; juntar = último.fim = Math.max(último.fim, atual.fim).

//--------------------------------------------------------------------
// Merge Intervals (LC 56) - // serve para juntar os intervalos que se sobrepõem: [[1,3],[2,6],[8,10]] vira [[1,6],[8,10]].

function merge(intervals) {
  // passo 1 — esqueleto: copiar e ordenar por início, o resultado, o ciclo e o return
  const copy = intervals.map((interval) => [...interval]); // copia cada par: não altera o input
  const sorted = copy.sort((a, b) => a[0] - b[0]);
  const merged = [];

  for (const current of sorted) {
    // passo 2 — o último intervalo já guardado (não existe no 1.º passo)
    const last = merged.at(-1);

    // primeiro intervalo: entra como está
    if (last === undefined) {
      merged.push(current);
    }
    // passo 3 — sobrepõe-se ao último (tocar conta): estende o fim do último
    // last é uma referência ao array que já está dentro de merged, por isso não é preciso push
    else if (current[0] <= last[1]) {
      last[1] = Math.max(last[1], current[1]);
    }
    // passo 4 — não se sobrepõe: começa um intervalo novo
    else {
      merged.push(current);
    }
  }

  return merged;
}

merge([[1, 3], [2, 6], [8, 10], [15, 18]]); // result ==> [[1, 6], [8, 10], [15, 18]]
merge([[1, 4], [4, 5]]); // result ==> [[1, 5]]  (tocar conta)
merge([[1, 4], [2, 3]]); // result ==> [[1, 4]]  (um dentro do outro: o Math.max importa)
merge([[4, 7], [1, 4]]); // result ==> [[1, 7]]  (input desordenado)
merge([]); // result ==> []
merge([[1, 2], [3, 4]]); // result ==> [[1, 2], [3, 4]]  (3 > 2, não se tocam)
// nota: O(n log n) tempo por causa do sort, O(n) espaço. Versão compacta: const sorted = intervals.map((x) => [...x]).sort((a, b) => a[0] - b[0]).
// nota2: em [[1,3],[2,6],[8,10]]: [2,6] sobrepõe [1,3] (2 <= 3) e dá [1,6]; [8,10] não (8 > 6) e fica à parte.

//--------------------------------------------------------------------
// Insert Interval (LC 57) - // serve para inserir [2,5] em [[1,3],[6,9]] e ficar [[1,5],[6,9]] em O(n), sem ordenar.

function insert(intervals, newInterval) {
  // passo 1 — esqueleto: o resultado, a posição i e o intervalo novo a crescer
  const merged = [];
  let i = 0;
  let start = newInterval[0];
  let end = newInterval[1];

  // passo 2 — fase 1: copia os que acabam ANTES do novo (fim < start)
  while (i < intervals.length && intervals[i][1] < start) {
    merged.push(intervals[i]);
    i++;
  }

  // passo 3 — fase 2: engole os que se sobrepõem (início <= end) e alarga o novo
  while (i < intervals.length && intervals[i][0] <= end) {
    start = Math.min(start, intervals[i][0]);
    end = Math.max(end, intervals[i][1]);
    i++;
  }
  merged.push([start, end]);

  // passo 4 — fase 3: copia o resto
  while (i < intervals.length) {
    merged.push(intervals[i]);
    i++;
  }

  return merged;
}

insert([[1, 2], [3, 5], [6, 7], [8, 10], [12, 16]], [4, 8]); // result ==> [[1, 2], [3, 10], [12, 16]]
insert([[1, 3], [6, 9]], [2, 5]); // result ==> [[1, 5], [6, 9]]
insert([], [5, 7]); // result ==> [[5, 7]]
insert([[1, 5]], [6, 8]); // result ==> [[1, 5], [6, 8]]  (fica no fim)
insert([[3, 5]], [1, 2]); // result ==> [[1, 2], [3, 5]]  (fica no início)
insert([[1, 5]], [2, 3]); // result ==> [[1, 5]]  (sobrepõe: min dos inícios 1, max dos fins 5)
// nota: O(n) tempo e espaço. A fase 1 compara o FIM do antigo com o início do novo (fim < start); a fase 2 compara o INÍCIO do antigo com o fim do novo (início <= end).
// nota2: em [[1,2],[3,5],[6,7],[8,10],[12,16]] + [4,8]: copia [1,2]; engole [3,5], [6,7], [8,10] (8 <= 8) e dá [3,10]; copia [12,16].

// =====================================================================================
// §8 ── MATRIZ / GRELHA (DFS e BFS) ──────────
// =====================================================================================
// Usar quando o enunciado diz: grid[][], "ilhas", "regiões ligadas", "vizinhos cima/baixo/esquerda/direita", "menos passos", "minutos até espalhar"
// Molde: dois for (r, c) para achar o começo; uma função auxiliar visita os 4 vizinhos, cada um com o seu if.
//   DFS (recursão) = tudo o que está ligado; BFS (fila) = menos passos.
//   if (row > 0 && grid[row - 1][col] === "1")                 // cima
//   if (row < grid.length - 1 && grid[row + 1][col] === "1")   // baixo
//   if (col > 0 && grid[row][col - 1] === "1")                 // esquerda
//   if (col < grid[0].length - 1 && grid[row][col + 1] === "1") // direita

//--------------------------------------------------------------------
// Number of Islands (LC 200) - // serve para contar grupos de "1" que se tocam numa grelha (as ilhas), com uma fila (BFS).
{
  const islandGrid = [
    ["1", "1", "0", "0", "0"],
    ["1", "1", "0", "0", "0"],
    ["0", "0", "1", "0", "0"],
    ["0", "0", "0", "1", "1"],
  ];

  // passo 1 — esqueleto: cada "1" ainda não visitado é uma ilha nova
  const numIslands = (original) => {
    const grid = original.map((line) => [...line]); // cópia: vamos escrever "0" nas células visitadas
    let island = 0;
    for (let r = 0; r < grid.length; r++) {
      for (let c = 0; c < grid[0].length; c++) {
        if (grid[r][c] === "1") {
          island++;
          bfsSearch(r, c, grid); // afunda a ilha toda para não a contar outra vez
        }
      }
    }
    return island;
  };

  // passo 2 — a fila: começa na célula (r, c) e tira uma célula de cada vez
  const bfsSearch = (r, c, grid) => {
    const queue = [[r, c]];
    grid[r][c] = "0";
    while (queue.length) {
      const [row, col] = queue.shift();

      // passo 3 — cada vizinho tem o seu if, com os limites escritos
      // cima
      if (row > 0 && grid[row - 1][col] === "1") {
        // passo 4 — pôr na fila e marcar já, senão a célula entrava duas vezes
        queue.push([row - 1, col]);
        grid[row - 1][col] = "0";
      }
      // baixo
      if (row < grid.length - 1 && grid[row + 1][col] === "1") {
        queue.push([row + 1, col]);
        grid[row + 1][col] = "0";
      }
      // esquerda
      if (col > 0 && grid[row][col - 1] === "1") {
        queue.push([row, col - 1]);
        grid[row][col - 1] = "0";
      }
      // direita
      if (col < grid[0].length - 1 && grid[row][col + 1] === "1") {
        queue.push([row, col + 1]);
        grid[row][col + 1] = "0";
      }
    }
  };

  numIslands(islandGrid); // result ==> 3
  islandGrid[0][0]; // result ==> "1"  (o input não foi alterado: a função trabalha numa cópia)
  numIslands([["0"]]); // result ==> 0
  numIslands([["1"]]); // result ==> 1
  numIslands([]); // result ==> 0
  numIslands([["1", "0", "1"]]); // result ==> 2  (separados por um "0"; as diagonais também não contam)
}
// nota: esta grelha tem STRINGS; grid[r][c] === 1 daria sempre false. Tempo e espaço O(rows · cols).
// nota2: shift() é O(n); com um índice que avança fica O(1).

//--------------------------------------------------------------------
// Number of Islands com DFS - // serve para contar as mesmas ilhas, indo até ao fundo de um lado antes de tentar os outros (recursão).
{
  const islandGrid = [
    ["1", "1", "0", "0", "0"],
    ["1", "1", "0", "0", "0"],
    ["0", "0", "1", "0", "0"],
    ["0", "0", "0", "1", "1"],
  ];

  // passo 1 — esqueleto: igual ao BFS; só muda a função auxiliar
  const numIslandsDfs = (original) => {
    const grid = original.map((line) => [...line]);
    let island = 0;
    for (let r = 0; r < grid.length; r++) {
      for (let c = 0; c < grid[0].length; c++) {
        if (grid[r][c] === "1") {
          island++;
          dfsSearch(r, c, grid);
        }
      }
    }
    return island;
  };

  // passo 2 — a recursão: a função chama-se a si própria em cada vizinho
  const dfsSearch = (row, col, grid) => {
    // passo 3 — parar o ramo: fora da grelha, ou não é terra
    if (row < 0 || row >= grid.length || col < 0 || col >= grid[0].length) {
      return;
    }
    if (grid[row][col] !== "1") {
      return;
    }
    // passo 4 — marcar ANTES de chamar os vizinhos, senão voltava para trás para sempre
    grid[row][col] = "0";
    // cima
    dfsSearch(row - 1, col, grid);
    // baixo
    dfsSearch(row + 1, col, grid);
    // esquerda
    dfsSearch(row, col - 1, grid);
    // direita
    dfsSearch(row, col + 1, grid);
  };

  numIslandsDfs(islandGrid); // result ==> 3
  islandGrid[0][0]; // result ==> "1"  (o input não foi alterado)
  numIslandsDfs([["1", "0", "1"]]); // result ==> 2
  numIslandsDfs([]); // result ==> 0
}
// nota: DFS vê o que está ligado mas não conta passos; para "menos passos / minutos" usa BFS por níveis (bloco seguinte).
// nota2: tempo O(rows · cols); a recursão pode ficar funda numa grelha enorme.

//--------------------------------------------------------------------
// Rotting Oranges (LC 994) - // serve para saber em quantos minutos todas as laranjas apodrecem, com várias podres a espalhar ao mesmo tempo (2 = podre, 1 = fresca, 0 = vazio).
{
  const orangesRotting = (original) => {
    const grid = original.map((line) => [...line]);
    const queue = [];
    let fresh = 0;
    let minutes = 0;

    // passo 1 — esqueleto: TODAS as podres entram na fila; contar as frescas
    for (let r = 0; r < grid.length; r++) {
      for (let c = 0; c < grid[0].length; c++) {
        if (grid[r][c] === 2) {
          queue.push([r, c]);
        }
        if (grid[r][c] === 1) {
          fresh++;
        }
      }
    }

    // passo 2 — uma volta do while = um minuto (só enquanto houver frescas)
    while (queue.length > 0 && fresh > 0) {
      minutes++;
      // passo 3 — tratar só as podres que já estavam na fila neste minuto
      const rottenNow = queue.length;
      for (let i = 0; i < rottenNow; i++) {
        const [row, col] = queue.shift();

        // passo 4 — cada vizinho fresco apodrece e entra na fila
        // cima
        if (row > 0 && grid[row - 1][col] === 1) {
          grid[row - 1][col] = 2;
          fresh--;
          queue.push([row - 1, col]);
        }
        // baixo
        if (row < grid.length - 1 && grid[row + 1][col] === 1) {
          grid[row + 1][col] = 2;
          fresh--;
          queue.push([row + 1, col]);
        }
        // esquerda
        if (col > 0 && grid[row][col - 1] === 1) {
          grid[row][col - 1] = 2;
          fresh--;
          queue.push([row, col - 1]);
        }
        // direita
        if (col < grid[0].length - 1 && grid[row][col + 1] === 1) {
          grid[row][col + 1] = 2;
          fresh--;
          queue.push([row, col + 1]);
        }
      }
    }

    if (fresh > 0) {
      return -1; // sobrou uma fresca que nunca é alcançada
    }
    return minutes;
  };

  orangesRotting([[2, 1, 1], [1, 1, 0], [0, 1, 1]]); // result ==> 4  (minuto 1: 2 frescas, 2: mais 2, 3: mais 1, 4: a última)
  orangesRotting([[2, 1, 1], [0, 1, 1], [1, 0, 1]]); // result ==> -1  (a fresca do canto está isolada)
  orangesRotting([[0, 2]]); // result ==> 0  (sem frescas)
  orangesRotting([[1]]); // result ==> -1  (fresca, mas nada podre)
  orangesRotting([[2, 1, 1]]); // result ==> 2  (minuto 1 apodrece a do meio; minuto 2 a da ponta)
}
// nota: BFS por níveis: o size da fila no início da volta separa os minutos. Tempo e espaço O(rows · cols); shift() é O(n).
// nota2: DFS (como nas ilhas) não conta passos; para "minutos" é sempre BFS com todas as origens na fila inicial.

// =====================================================================================
// §9 ── GRAFOS ──────────
// =====================================================================================
// Usar quando o enunciado diz: "pré-requisitos", "dependências", "arestas" / pares [a, b], "é possível acabar?", "ordem válida", "ciclo"

//--------------------------------------------------------------------
// Lista de adjacência - // serve para transformar pares [a, b] em "quem são os meus vizinhos", pronta a percorrer como a grelha.
{
  const buildGraph = (n, edges) => {
    // passo 1 — esqueleto: uma lista vazia, NOVA, para cada nó
    const graph = Array.from({ length: n }, () => []);
    // passo 2 — cada aresta [a, b] põe o b na lista do a
    for (const [a, b] of edges) {
      graph[a].push(b);
    }
    return graph;
  };

  buildGraph(3, []); // result ==> [[], [], []]
  buildGraph(3, [[0, 1]]); // result ==> [[1], [], []]
  buildGraph(3, [[0, 1], [0, 2]]); // result ==> [[1, 2], [], []]
  buildGraph(2, [[1, 0]]); // result ==> [[], [0]]  (a aresta sai do 1 para o 0; só graph[1] recebe)
}
// nota: new Array(n).fill([]) põe o MESMO array em todas as posições; um push aparecia em todos os nós.
// nota2: este grafo é dirigido (só a → b). Não dirigido: acrescenta também graph[b].push(a).

//--------------------------------------------------------------------
// Course Schedule (LC 207) - // serve para saber se dá para fazer todas as cadeiras com estes pré-requisitos, ou se há um ciclo.
{
  const canFinish = (numCourses, prerequisites) => {
    // passo 1 — esqueleto: graph[pre] = cadeiras que dependem de pre; inDegree[x] = pré-requisitos que x ainda tem por fazer
    const graph = Array.from({ length: numCourses }, () => []);
    const inDegree = new Array(numCourses).fill(0);

    // passo 2 — ler os pares: a seta vai de pre para course
    for (const [course, pre] of prerequisites) {
      graph[pre].push(course);
      inDegree[course]++;
    }

    // passo 3 — a fila: as cadeiras sem pré-requisitos, prontas a fazer
    const queue = [];
    for (let i = 0; i < numCourses; i++) {
      if (inDegree[i] === 0) {
        queue.push(i);
      }
    }

    // passo 4 — fazer uma cadeira e baixar o contador das que dependem dela
    let done = 0;
    while (queue.length > 0) {
      const course = queue.shift();
      done++;
      for (const next of graph[course]) {
        inDegree[next]--;
        if (inDegree[next] === 0) {
          queue.push(next);
        }
      }
    }
    return done === numCourses; // fez todas → não há ciclo
  };

  canFinish(3, [[1, 0], [2, 0]]); // result ==> true  (faz o 0; depois o 1 e o 2)
  canFinish(3, [[1, 0], [2, 1]]); // result ==> true  (uma cadeia: 0, 1, 2)
  canFinish(2, [[1, 0]]); // result ==> true
  canFinish(2, [[1, 0], [0, 1]]); // result ==> false  (ciclo: inDegree [1, 1], a fila começa vazia)
  canFinish(1, []); // result ==> true
  canFinish(4, [[1, 0], [2, 1], [3, 2], [1, 3]]); // result ==> false  (ciclo 1→2→3→1)
}
// nota: [course, pre] diz "course precisa de pre", mas a seta vai de pre para course. Tempo e espaço O(V + E); a ordem em que a fila fica feita é uma ordem válida (LC 210).
// nota2: shift() é O(n); ler queue[i] com um índice que avança fica O(1).

// =====================================================================================
// §10 ── BACKTRACKING ──────────
// =====================================================================================
// Usar quando o enunciado diz: "todas as combinações / subconjuntos / permutações", "gerar todos", "todas as maneiras de…", n pequeno (≤ 20)
// Molde: escolher → explorar → desfazer. Desenha a árvore de decisões em papel.
//   const res = [];
//   const current = [];
//   function bt(start) {
//     if (cheguei ao fim) {
//       res.push([...current]);   // CÓPIA: [...current]
//       return;
//     }
//     for (let i = start; i < n; i++) {
//       current.push(nums[i]);   // escolher
//       bt(i + 1);               // explorar
//       current.pop();           // desfazer (volta ao estado anterior)
//     }
//   }

//--------------------------------------------------------------------
// Subsets (LC 78) - // serve para listar todos os subconjuntos, as 2^n escolhas possíveis de elementos.
{
  const subsets = (nums) => {
    const res = [];
    const current = [];
    // passo 1 — esqueleto: começar na posição 0 e devolver res (a função bt vem a seguir; o JS sobe-a)
    bt(0);
    return res;

    function bt(start) {
      // passo 2 — cada nó da árvore já é um subconjunto: guardar uma CÓPIA logo ao entrar
      res.push([...current]);
      // passo 3 — escolher cada número a partir de start
      for (let i = start; i < nums.length; i++) {
        // passo 4 — escolher, explorar, desfazer
        current.push(nums[i]);
        bt(i + 1); // i + 1: sem reutilizar e sem voltar atrás (evita [2, 1] depois de [1, 2])
        current.pop();
      }
    }
  };

  // qualquer ordem é aceite: os exemplos passam cada resposta a texto com join() e ordenam com toSorted()
  subsets([1, 2, 3]).map((s) => s.join()).toSorted(); // result ==> ["", "1", "1,2", "1,2,3", "1,3", "2", "2,3", "3"]  (8 subconjuntos)
  subsets([]); // result ==> [[]]
  subsets([7]); // result ==> [[], [7]]  (bt(0) guarda []; depois push 7 e bt(1) guarda [7])
  subsets([1, 2, 3, 4]).length; // result ==> 16  (2^4)
}
// nota: res.push(current) sem cópia guardava 8 vezes o MESMO array, que no fim ficava vazio. Tempo O(n · 2^n).
// nota2: o JS sobe a função bt para o topo da função de fora; por isso bt(0) funciona antes da linha onde bt aparece.

//--------------------------------------------------------------------
// Permutations (LC 46) - // serve para listar todas as ordens possíveis dos números, as n! ordenações.
{
  const permute = (nums) => {
    const res = [];
    const current = [];
    const used = new Array(nums.length).fill(false);
    // passo 1 — esqueleto: começar sem nada escolhido e devolver res
    bt();
    return res;

    function bt() {
      // passo 2 — current cheio = uma permutação completa: guardar e voltar atrás
      if (current.length === nums.length) {
        res.push([...current]);
        return;
      }
      // passo 3 — em cada nível, tentar TODOS os índices (volta-se ao 0)
      for (let i = 0; i < nums.length; i++) {
        // passo 4 — só os que ainda não foram usados
        if (used[i] === false) {
          used[i] = true;
          current.push(nums[i]);
          bt();
          current.pop();
          used[i] = false;
        }
      }
    }
  };

  permute([1, 2, 3]).map((p) => p.join()).toSorted(); // result ==> ["1,2,3", "1,3,2", "2,1,3", "2,3,1", "3,1,2", "3,2,1"]  (6 permutações)
  permute([1]); // result ==> [[1]]
  permute([1, 2]).length; // result ==> 2  ([1,2] e [2,1]; 2! = 2)
}
// nota: em Subsets [1,2] = [2,1], por isso só se anda para a frente (start); aqui a ordem conta, por isso volta-se ao 0 e salta-se o usado. Tempo O(n · n!).
// nota2: used[i] = false no fim é o "desfazer": sem ele, o número ficava bloqueado para os outros ramos.

//--------------------------------------------------------------------
// Combination Sum (LC 39) - // serve para achar todas as combinações que somam target, podendo repetir números ([2,3,6,7] com 7 dá [[2,2,3], [7]]).
{
  const combinationSum = (candidates, target) => {
    const res = [];
    const current = [];
    // passo 1 — esqueleto: começar em 0 com remaining = target
    bt(0, target);
    return res;

    function bt(start, remaining) {
      // passo 2 — chegou ao alvo: guardar uma cópia
      if (remaining === 0) {
        res.push([...current]);
        return;
      }
      // passo 3 — passou do alvo: cortar este ramo
      if (remaining < 0) {
        return;
      }
      // passo 4 — escolher, explorar, desfazer
      for (let i = start; i < candidates.length; i++) {
        current.push(candidates[i]);
        bt(i, remaining - candidates[i]); // i (não i + 1): o mesmo número pode repetir
        current.pop();
      }
    }
  };

  combinationSum([2, 3, 6, 7], 7).map((c) => c.join()).toSorted(); // result ==> ["2,2,3", "7"]
  combinationSum([2, 3, 5], 8).map((c) => c.join()).toSorted(); // result ==> ["2,2,2,2", "2,3,3", "3,5"]
  combinationSum([2], 1); // result ==> []
  combinationSum([3], 9); // result ==> [[3, 3, 3]]  (só há o 3; repete até remaining chegar a 0)
}
// nota: bt(i) permite repetir o mesmo número; bt(i + 1) usa cada um no máximo uma vez (como em Subsets).
// nota2: tempo exponencial, ~O(2^target); a recursão tem no máximo O(target) níveis.

// =====================================================================================
// §11 ── HEAP (fila de prioridade) ──────────
// =====================================================================================
// Usar quando o enunciado diz: "k-ésimo maior/menor", "os k mais…", "sempre o mínimo atual", "juntar k listas ordenadas", dados em fluxo

//--------------------------------------------------------------------
// MinHeap - // serve para tirar sempre o menor valor em O(log n), enquanto vão entrando valores novos.
class MinHeap {
  // passo 1 — esqueleto: um array; cada pai (índice i) é <= aos filhos, por isso o menor está sempre em items[0]
  constructor() {
    this.items = [];
  }
  get size() {
    return this.items.length;
  }
  peek() {
    return this.items[0];
  }

  // passo 2 — push: põe no fim e sobe enquanto for menor que o pai (pai de i = Math.floor((i - 1) / 2))
  push(value) {
    const items = this.items;
    items.push(value);
    let index = items.length - 1;
    while (index > 0) {
      const parent = Math.floor((index - 1) / 2);
      if (items[parent] <= items[index]) {
        break; // o pai já é menor: está no sítio
      }
      const temp = items[parent];
      items[parent] = items[index];
      items[index] = temp;
      index = parent;
    }
  }

  // passo 3 — pop: guarda o topo, põe o último no topo e deixa-o afundar (filhos de i = 2i + 1 e 2i + 2)
  pop() {
    const items = this.items;
    const top = items[0];
    const last = items.pop();
    if (items.length > 0) {
      items[0] = last;
      let index = 0;
      while (true) {
        const left = 2 * index + 1;
        const right = 2 * index + 2;
        let smallest = index;
        // passo 4 — comparar com cada filho; troca com o MENOR dos dois
        // esquerda
        if (left < items.length && items[left] < items[smallest]) {
          smallest = left;
        }
        // direita
        if (right < items.length && items[right] < items[smallest]) {
          smallest = right;
        }
        if (smallest === index) {
          break; // já é menor que os dois filhos: está no sítio
        }
        const temp = items[smallest];
        items[smallest] = items[index];
        items[index] = temp;
        index = smallest;
      }
    }
    return top; // devolve o menor guardado no início; o resto foi arrumação
  }
}
{
  const heap = new MinHeap();
  heap.push(5);
  heap.items; // result ==> [5]
  heap.push(3);
  heap.items; // result ==> [3, 5]  (3 < pai 5: troca)
  heap.push(8);
  heap.items; // result ==> [3, 5, 8]  (8 >= pai 3: fica)
  heap.push(1);
  heap.items; // result ==> [1, 3, 8, 5]  (1 sobe duas vezes; só o [0] é garantido, não está ordenado)
  heap.pop(); // result ==> 1
  heap.items; // result ==> [3, 5, 8]  (o 5 foi para o topo e afundou)
  heap.peek(); // result ==> 3

  const mixed = new MinHeap();
  for (const x of [5, 3, 8, 1, 9, 1, -2]) {
    mixed.push(x);
  }
  mixed.peek(); // result ==> -2
  const drained = [];
  while (mixed.size) {
    drained.push(mixed.pop());
  }
  drained; // result ==> [-2, 1, 1, 3, 5, 8, 9]  (sai sempre por ordem)
  new MinHeap().pop(); // result ==> undefined
}
// nota: JS não tem heap nativo. Na entrevista pergunta "posso assumir um MinHeap?"; se não, isto leva ~5 min. push/pop O(log n), peek O(1).
// nota2: um heap só garante o menor em [0], o resto fica "meio arrumado"; por isso push/pop custam O(log n) e não O(n) como num array ordenado.

//--------------------------------------------------------------------
// Kth Largest Element in an Array (LC 215) - // serve para achar o k-ésimo maior número (o 2.º maior de [3,2,1,5,6,4] é 5).
{
  const findKthLargest = (nums, k) => {
    const heap = new MinHeap();
    // passo 1 — esqueleto: passar por todos os números; no fim, o topo é a resposta
    for (const n of nums) {
      // passo 2 — cada número entra no heap
      heap.push(n);
      // passo 3 — com mais de k valores, tira o menor: nunca será o k-ésimo maior
      if (heap.size > k) {
        heap.pop();
      }
    }
    return heap.peek();
  };

  // também serve na entrevista (diz a complexidade!): ordenar → O(n log n)
  const kthLargestSort = (nums, k) => {
    const copy = [...nums];
    copy.sort((a, b) => b - a);
    return copy[k - 1];
  };

  findKthLargest([3, 2, 1, 5, 6, 4], 2); // result ==> 5  (heap fica {2,3}, {3,5}, {5,6}; o 4 entra e sai)
  findKthLargest([3, 2, 3, 1, 2, 4, 5, 5, 6], 4); // result ==> 4  (repetidos contam)
  findKthLargest([1], 1); // result ==> 1
  findKthLargest([-1, -5, -3], 1); // result ==> -1
  findKthLargest([1, 2, 3], 3); // result ==> 1  (o 3.º maior de três é o menor; com k = 3 nunca se tira nada)
  kthLargestSort([3, 2, 1, 5, 6, 4], 2); // result ==> 5
}
// nota: para o k-ésimo MAIOR usa-se um MinHeap: ele deita fora o mais pequeno e ficam os k maiores. Tempo O(n log k), espaço O(k).
// nota2: ordenar uma cópia é mais simples mas custa O(n log n); copia antes de sort() para não mudar o original.

// =====================================================================================
// §12 ── PROGRAMAÇÃO DINÂMICA ──────────
// =====================================================================================
// Usar quando o enunciado diz: "número de maneiras", "mínimo/máximo de…", "é possível…?", "sem vizinhos", "maior subsequência"
// Molde: responde a 3 perguntas no quadro, por palavras.
//   1. ESTADO:     o que significa dp[i]? ex.: "o máximo que consigo roubar das casas 0..i"
//   2. TRANSIÇÃO:  como chego a dp[i] a partir dos menores? Pensa na ÚLTIMA decisão.
//   3. BASE:       os casos pequenos que não precisam de nada. ex.: dp[0] = house[0]
// MEMO = recursão + Map (mais fácil de pensar). TABELA = for a preencher dp (sem recursão). Mesmo resultado.

//--------------------------------------------------------------------
// House Robber (LC 198) - // serve para roubar o máximo sem roubar duas casas vizinhas; em cada casa, ou a salto ou a roubo.
{
  // Versão MEMO: memo é um Map; chave = índice i; valor = o máximo roubável das casas 0..i
  const robMemo = (nums) => {
    const memo = new Map();
    // passo 1 — esqueleto: a resposta é o melhor até à última casa
    return bestUpTo(nums.length - 1);

    function bestUpTo(i) {
      // passo 2 — base: sem casas, não há nada para roubar
      if (i < 0) {
        return 0;
      }
      // passo 3 — já calculado? O return evita repetir o trabalho
      if (memo.has(i)) {
        return memo.get(i);
      }
      // passo 4 — saltar a casa i, ou roubá-la (e saltar a anterior)
      const skip = bestUpTo(i - 1);
      const take = bestUpTo(i - 2) + nums[i];
      const best = Math.max(skip, take);
      memo.set(i, best);
      return best;
    }
  };

  // Versão TABELA: prev = melhor até à casa anterior; prevPrev = melhor até duas casas atrás (só 2 valores → O(1) espaço)
  const rob = (nums) => {
    // passo 1 — esqueleto: andar pelas casas, sempre com os dois melhores resultados anteriores
    let prevPrev = 0;
    let prev = 0;
    for (const house of nums) {
      // passo 2 — saltar (prev) ou roubar (prevPrev + casa)
      const current = Math.max(prev, prevPrev + house);
      // passo 3 — deslizar os dois valores uma casa para a frente
      prevPrev = prev;
      prev = current;
    }
    return prev;
  };

  rob([2, 7]); // result ==> 7  (max(2, 7))
  rob([2, 7, 9]); // result ==> 11  (max(7, 2 + 9))
  for (const f of [rob, robMemo]) {
    f([2, 7, 9, 3, 1]); // result ==> 12  (2 + 9 + 1)
    f([1, 2, 3, 1]); // result ==> 4  (1 + 3)
    f([]); // result ==> 0
    f([5]); // result ==> 5
    f([2, 1, 1, 2]); // result ==> 4  (salta 2 casas seguidas)
    f([5, 1, 1, 5]); // result ==> 10  (a 1.ª e a 4.ª: não são vizinhas)
  }
}
// nota: o memo começa no fim e desce por recursão; a tabela começa no início e sobe com um for. Calculam o mesmo.
// nota2: tempo O(n); espaço O(1) na tabela e O(n) no memo.

//--------------------------------------------------------------------
// Coin Change (LC 322) - // serve para achar o menor número de moedas que faz um valor ([1, 2, 5] para 11 → 3 moedas, 5 + 5 + 1).
{
  const coinChange = (coins, amount) => {
    // passo 1 — esqueleto: dp[v] = menos moedas para fazer v; Infinity = ainda impossível; dp[0] = 0
    const dp = new Array(amount + 1).fill(Infinity);
    dp[0] = 0;
    // passo 2 — cada valor v, de 1 até amount
    for (let v = 1; v <= amount; v++) {
      // passo 3 — experimentar cada moeda como a ÚLTIMA
      for (const coin of coins) {
        // passo 4 — só se a moeda cabe: 1 moeda + o melhor para o que sobra
        if (coin <= v) {
          dp[v] = Math.min(dp[v], dp[v - coin] + 1);
        }
      }
    }
    if (dp[amount] === Infinity) {
      return -1;
    }
    return dp[amount];
  };

  coinChange([1, 2, 5], 11); // result ==> 3  (5+5+1)
  coinChange([2], 3); // result ==> -1
  coinChange([1], 0); // result ==> 0
  coinChange([1, 3, 4], 6); // result ==> 2  (3+3; o guloso daria 4+1+1)
  coinChange([2, 5], 7); // result ==> 2  (dp[7] = dp[5] + 1: 5 + 2)
}
// nota: "a maior moeda primeiro" (guloso) falha: para 6 com [1,3,4] dá 4+1+1 (3 moedas); a DP encontra 3+3 (2).
// nota2: dp[v] = 1 + min(dp[v - moeda]). Tempo O(amount · coins), espaço O(amount).

//--------------------------------------------------------------------
// Longest Increasing Subsequence (LC 300) - // serve para achar a maior sequência a subir, podendo saltar elementos (em [10,9,2,5,3,7,101,18] é 2,3,7,101).
{
  const lengthOfLIS = (nums) => {
    if (nums.length === 0) {
      return 0;
    }
    // passo 1 — esqueleto: dp[i] = a maior sequência que TERMINA em nums[i]; começa em 1 (o próprio número)
    const dp = new Array(nums.length).fill(1);
    // passo 2 — cada i, olhando para trás
    for (let i = 1; i < nums.length; i++) {
      // passo 3 — cada j antes de i
      for (let j = 0; j < i; j++) {
        // passo 4 — se nums[j] é menor, dá para prolongar a sequência que acaba em j
        if (nums[j] < nums[i]) {
          dp[i] = Math.max(dp[i], dp[j] + 1);
        }
      }
    }
    return Math.max(...dp); // a resposta pode acabar em qualquer i
  };

  lengthOfLIS([10, 9, 2, 5, 3, 7, 101, 18]); // result ==> 4  (2,3,7,101)
  lengthOfLIS([0, 1, 0, 3, 2, 3]); // result ==> 4
  lengthOfLIS([7, 7, 7, 7]); // result ==> 1  (iguais não contam)
  lengthOfLIS([]); // result ==> 0
  lengthOfLIS([3, 1, 2]); // result ==> 2  (1, 2; o 3 não pode vir antes de números menores e continuar a subir)
}
// nota: dp.at(-1) é só a melhor que acaba no ÚLTIMO número; a melhor pode acabar antes, por isso Math.max(...dp).
// nota2: tempo O(n²), espaço O(n). Existe uma versão O(n log n); O(n²) é aceite.

//--------------------------------------------------------------------
// Longest Common Subsequence (LC 1143) - // serve para achar a maior sequência que duas strings partilham, com saltos ("abcde" e "ace" partilham "ace").
{
  const longestCommonSubsequence = (a, b) => {
    // passo 1 — esqueleto: dp[i][j] = LCS dos primeiros i caracteres de a e j de b; linha/coluna 0 = string vazia = 0
    const dp = Array.from({ length: a.length + 1 }, () => new Array(b.length + 1).fill(0));
    // passo 2 — preencher a tabela, linha a linha
    for (let i = 1; i <= a.length; i++) {
      for (let j = 1; j <= b.length; j++) {
        // i - 1 e j - 1 porque dp tem uma linha e uma coluna a mais
        if (a[i - 1] === b[j - 1]) {
          // passo 3 — letras iguais: diagonal + 1
          dp[i][j] = dp[i - 1][j - 1] + 1;
        } else {
          // passo 4 — letras diferentes: o melhor entre cima e esquerda
          dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
        }
      }
    }
    return dp[a.length][b.length];
  };

  longestCommonSubsequence("abc", "ac"); // result ==> 2  (a = a → diagonal 0 + 1; c = c → diagonal 1 + 1)
  longestCommonSubsequence("abcde", "ace"); // result ==> 3  ("ace")
  longestCommonSubsequence("abc", "def"); // result ==> 0
  longestCommonSubsequence("", "abc"); // result ==> 0
  longestCommonSubsequence("ab", "ba"); // result ==> 1  (partilham "a" ou "b", mas não os dois pela mesma ordem)
}
// nota: subsequência permite saltos ("ace" em "abcde"); substring comum tem de ser contígua.
// nota2: igual → diagonal + 1; diferente → max(cima, esquerda). Tempo e espaço O(n · m).

//--------------------------------------------------------------------
// Unique Paths (LC 62) - // serve para contar os caminhos de um robô que só anda para a direita ou para baixo, do canto de cima ao de baixo.
{
  const uniquePaths = (m, n) => {
    // passo 1 — esqueleto: dp[r][c] = caminhos até (r, c); a 1.ª linha e a 1.ª coluna valem 1
    const dp = Array.from({ length: m }, () => new Array(n).fill(1));
    // passo 2 — as outras células, linha a linha
    for (let r = 1; r < m; r++) {
      for (let c = 1; c < n; c++) {
        // passo 3 — os que chegam de cima + os que chegam da esquerda
        dp[r][c] = dp[r - 1][c] + dp[r][c - 1];
      }
    }
    return dp[m - 1][n - 1];
  };

  uniquePaths(3, 3); // result ==> 6  (tabela: 1 1 1 / 1 2 3 / 1 3 6)
  uniquePaths(3, 7); // result ==> 28
  uniquePaths(3, 2); // result ==> 3
  uniquePaths(1, 1); // result ==> 1
  uniquePaths(2, 3); // result ==> 3  (linha de baixo: 1, 1 + 1 = 2, 1 + 2 = 3)
}
// nota: um DFS a contar caminhos percorre cada um (exponencial); a DP soma contagens, cada célula uma vez.
// nota2: tempo e espaço O(m · n).

// =====================================================================================
// §13 ── LISTAS LIGADAS (médio) ──────────
// =====================================================================================
// Usar quando o enunciado diz: `head`, "remover o n-ésimo a contar do fim", "numa só passagem", "dígitos por ordem inversa", "devolve a nova head"
// Molde (nó dummy): um nó falso antes da head evita o caso especial de mudar a head. Trabalha a partir do dummy e devolve dummy.next.
//   const dummy = new ListNode(0, head);
//   ...trabalhar a partir de dummy...
//   return dummy.next;
// Auxiliares: toList([1, 2]) constrói 1 → 2 → null a partir do fim; toArray(head) volta a dar [1, 2].
class ListNode {
  constructor(val, next = null) {
    this.val = val;
    this.next = next;
  }
}
const toList = (values) => {
  let head = null;
  for (let i = values.length - 1; i >= 0; i--) {
    head = new ListNode(values[i], head);
  }
  return head;
};
const toArray = (head) => {
  const values = [];
  let node = head;
  while (node !== null) {
    values.push(node.val);
    node = node.next;
  }
  return values;
};

//--------------------------------------------------------------------
// Remove Nth Node From End of List (LC 19) - // serve para apagar o n-ésimo nó a contar do fim, numa só passagem ([1,2,3,4,5] com n = 2 → [1,2,3,5]).
{
  const removeNthFromEnd = (head, n) => {
    // passo 1 — esqueleto: um dummy antes da head (se o alvo for a head, slow fica no dummy) e dois ponteiros
    const dummy = new ListNode(0, head);
    let fast = dummy;
    let slow = dummy;
    // passo 2 — fast vai n + 1 passos à frente de slow
    for (let i = 0; i <= n; i++) {
      fast = fast.next;
    }
    // passo 3 — avançam os dois até fast chegar a null: slow fica mesmo ANTES do alvo
    while (fast !== null) {
      fast = fast.next;
      slow = slow.next;
    }
    // passo 4 — saltar por cima do alvo
    const target = slow.next;
    slow.next = target.next;
    return dummy.next;
  };

  toArray(removeNthFromEnd(toList([1, 2, 3, 4, 5]), 2)); // result ==> [1, 2, 3, 5]  (fast acaba em null, slow no 3; o 4 sai)
  toArray(removeNthFromEnd(toList([1]), 1)); // result ==> []
  toArray(removeNthFromEnd(toList([1, 2]), 2)); // result ==> [2]  (remove a head)
  toArray(removeNthFromEnd(toList([1, 2]), 1)); // result ==> [1]
  toArray(removeNthFromEnd(toList([1, 2, 3]), 3)); // result ==> [2, 3]  (o 3.º do fim é a head; slow fica no dummy)
}
// nota: com n passos (e não n + 1), slow parava EM cima do alvo; para o apagar é preciso estar no nó anterior.
// nota2: tempo O(n), espaço O(1). Versão compacta dos 2 últimos passos: slow.next = slow.next.next.

//--------------------------------------------------------------------
// Add Two Numbers (LC 2) - // serve para somar dois números guardados ao contrário em listas, dígito a dígito (342 → 2→4→3).
{
  const addTwoNumbers = (l1, l2) => {
    // passo 1 — esqueleto: um dummy antes do resultado; tail = último nó; carry = o "vai-um"
    const dummy = new ListNode(0);
    let tail = dummy;
    let carry = 0;
    let node1 = l1;
    let node2 = l2;
    // passo 2 — continua enquanto houver dígitos OU vai-um (5 + 5 = 10 precisa de um nó extra no fim)
    while (node1 !== null || node2 !== null || carry > 0) {
      // passo 3 — o dígito de cada lista só existe se ainda houver nó; senão vale 0
      let a = 0;
      let b = 0;
      if (node1 !== null) {
        a = node1.val;
        node1 = node1.next;
      }
      if (node2 !== null) {
        b = node2.val;
        node2 = node2.next;
      }
      // passo 4 — soma como na escola: fica o último dígito, vai o resto
      const sum = a + b + carry;
      carry = Math.floor(sum / 10);
      tail.next = new ListNode(sum % 10);
      tail = tail.next;
    }
    return dummy.next;
  };

  toArray(addTwoNumbers(toList([2, 4, 3]), toList([5, 6, 4]))); // result ==> [7, 0, 8]  (342 + 465 = 807; 4 + 6 = 10 → 0, vai 1)
  toArray(addTwoNumbers(toList([0]), toList([0]))); // result ==> [0]
  toArray(addTwoNumbers(toList([9, 9, 9, 9]), toList([9, 9]))); // result ==> [8, 9, 0, 0, 1]  (tamanhos diferentes)
  toArray(addTwoNumbers(toList([5]), toList([5]))); // result ==> [0, 1]  (vai-um no fim)
  toArray(addTwoNumbers(toList([1]), toList([9, 9]))); // result ==> [0, 0, 1]  (1 + 99 = 100; o carry cria o último 1)
}
// nota: sum % 10 dá o dígito que fica; Math.floor(sum / 10) dá o que vai para a casa seguinte. Não pares enquanto houver carry.
// nota2: tempo e espaço O(max(n, m)).

// =====================================================================================
// §14 ── ÁRVORES (médio) ──────────
// =====================================================================================
// Usar quando o enunciado diz: `root`, "BST válida", "antepassado comum", "nível a nível", "vista da direita", "profundidade mínima"
// Molde (DFS em árvore): a informação desce como parâmetro e sobe como valor de retorno.
//   function dfs(node, infoDeCima) {
//     if (!node) return valorBase;
//     const left = dfs(node.left, ...);
//     const right = dfs(node.right, ...);
//     return combinar(node, left, right);
//   }
// Auxiliar: toTree([3,9,20,null,null,15,7]) constrói a árvore a partir do array do LeetCode, nível a nível.
class TreeNode {
  constructor(val, left = null, right = null) {
    this.val = val;
    this.left = left;
    this.right = right;
  }
}
const toTree = (values) => {
  if (values.length === 0 || values[0] === null) {
    return null;
  }
  const root = new TreeNode(values[0]);
  const queue = [root];
  let i = 1;
  while (queue.length > 0 && i < values.length) {
    const node = queue.shift();
    if (i < values.length && values[i] !== null) {
      node.left = new TreeNode(values[i]);
      queue.push(node.left);
    }
    i++;
    if (i < values.length && values[i] !== null) {
      node.right = new TreeNode(values[i]);
      queue.push(node.right);
    }
    i++;
  }
  return root;
};

//--------------------------------------------------------------------
// Validate Binary Search Tree (LC 98) - // serve para verificar se todos os da esquerda são menores e todos os da direita maiores.
{
  const isValidBST = (node, min = -Infinity, max = Infinity) => {
    // passo 1 — esqueleto: árvore vazia é válida
    if (node === null) {
      return true;
    }
    // passo 2 — o valor tem de estar estritamente dentro do intervalo (min, max): sem iguais
    if (node.val <= min) {
      return false;
    }
    if (node.val >= max) {
      return false;
    }
    // passo 3 — esquerda: o máximo passa a ser este nó
    const leftOk = isValidBST(node.left, min, node.val);
    // direita: o mínimo passa a ser este nó
    const rightOk = isValidBST(node.right, node.val, max);
    return leftOk && rightOk;
  };

  isValidBST(toTree([5, 4, 6, null, null, 3, 7])); // result ==> false  (o 3 está à direita do 5: o intervalo dele é (5, 6))
  isValidBST(toTree([2, 1, 3])); // result ==> true
  isValidBST(toTree([5, 1, 4, null, null, 3, 6])); // result ==> false
  isValidBST(toTree([2, 2, 2])); // result ==> false  (valores iguais)
  isValidBST(null); // result ==> true
  isValidBST(toTree([-2147483648])); // result ==> true  (por isso -Infinity, e não um número)
  isValidBST(toTree([10, 5, 15, null, null, 6, 20])); // result ==> false  (o 6 está à direita do 10: o intervalo dele é (10, 15))
}
// nota: comparar só com os filhos diretos não chega: no primeiro exemplo o 3 < 6 passa, mas o 3 está na subárvore direita do 5. Passa (min, max) para baixo.
// nota2: tempo O(n), espaço O(altura). A versão compacta com && nem visita a direita se a esquerda já falhou.

//--------------------------------------------------------------------
// Lowest Common Ancestor of a Binary Tree (LC 236) - // serve para achar o antepassado comum mais próximo de dois nós, p e q.
{
  const lowestCommonAncestor = (node, p, q) => {
    // passo 1 — parar: vazio, ou encontrou p ou q
    if (node === null || node === p || node === q) {
      return node;
    }
    // passo 2 — procurar dos dois lados
    const left = lowestCommonAncestor(node.left, p, q);
    const right = lowestCommonAncestor(node.right, p, q);
    // passo 3 — p de um lado e q do outro: este nó é a resposta
    if (left !== null && right !== null) {
      return node;
    }
    // passo 4 — só um lado encontrou alguma coisa: sobe esse
    if (left !== null) {
      return left;
    }
    return right;
  };

  const findNode = (node, val) => {
    if (node === null) {
      return null;
    }
    if (node.val === val) {
      return node;
    }
    const inLeft = findNode(node.left, val);
    if (inLeft !== null) {
      return inLeft;
    }
    return findNode(node.right, val);
  };

  const lcaRoot = toTree([3, 5, 1, 6, 2, 0, 8, null, null, 7, 4]);
  lowestCommonAncestor(lcaRoot, findNode(lcaRoot, 5), findNode(lcaRoot, 4)).val; // result ==> 5  (o 5 pára logo e não desce; um está por cima do outro)
  lowestCommonAncestor(lcaRoot, findNode(lcaRoot, 5), findNode(lcaRoot, 1)).val; // result ==> 3
  lowestCommonAncestor(lcaRoot, findNode(lcaRoot, 7), findNode(lcaRoot, 8)).val; // result ==> 3
  lowestCommonAncestor(lcaRoot, findNode(lcaRoot, 6), findNode(lcaRoot, 4)).val; // result ==> 5  (o 6 está à esquerda do 5 e o 4 à direita, por baixo do 2)
}
// nota: numa BST basta comparar valores (os dois menores → esquerda); aqui não há ordem, por isso procura-se dos dois lados.
// nota2: tempo O(n), espaço O(altura).

//--------------------------------------------------------------------
// Binary Tree Level Order Traversal (LC 102) - // serve para ler a árvore um nível de cada vez ([[3], [9, 20], [15, 7]]).
{
  const levelOrder = (root) => {
    // passo 1 — esqueleto: árvore vazia dá []; a fila começa na raiz
    if (root === null) {
      return [];
    }
    const levels = [];
    const queue = [root];
    // passo 2 — uma volta do while = um nível
    while (queue.length > 0) {
      // passo 3 — só os nós que já estão na fila (este nível); os filhos ficam para a volta seguinte
      const size = queue.length;
      const level = [];
      for (let i = 0; i < size; i++) {
        const node = queue.shift();
        level.push(node.val);
        // passo 4 — pôr os filhos na fila
        // esquerda
        if (node.left !== null) {
          queue.push(node.left);
        }
        // direita
        if (node.right !== null) {
          queue.push(node.right);
        }
      }
      levels.push(level);
    }
    return levels;
  };

  levelOrder(toTree([3, 9, 20, null, null, 15, 7])); // result ==> [[3], [9, 20], [15, 7]]
  levelOrder(toTree([1])); // result ==> [[1]]
  levelOrder(null); // result ==> []
  levelOrder(toTree([1, 2, null, 3])); // result ==> [[1], [2], [3]]  (árvore torta)
  levelOrder(toTree([1, 2, 3])); // result ==> [[1], [2, 3]]  (a raiz, depois os dois filhos)
}
// nota: o mesmo código resolve LC 199 Right Side View (o último de cada nível) e LC 103 Zigzag (inverter os níveis ímpares).
// nota2: DFS desce até ao fundo de um ramo primeiro; para "nível a nível" usa BFS com uma fila. Tempo e espaço O(n).

// =====================================================================================
// §15 ── TABELA FINAL: SINAL NO ENUNCIADO → PADRÃO ──────────
// =====================================================================================
/*
  SINAL NO ENUNCIADO                                   → PADRÃO                           §
  ---------------------------------------------------------------------------------------------
  "subarray com soma K" (com negativos)                → prefix sum + Map                 §2
  "agrupar", "anagramas", "contar", "já vi isto?"      → Map / Set                        §2
  "os k mais frequentes"                               → Map + baldes (ou sort)           §2
  "ordenado", "par/trio com soma X"                    → dois ponteiros                   §3
  "substring/subarray contíguo mais longo/curto"       → janela deslizante                §4
  "todas as posições de um anagrama/permutação"        → janela FIXA + contagens          §4
  "próximo maior/menor", "quantos dias até"            → pilha monótona                   §5
  "parênteses", "expressão", "desfazer"                → pilha                            §5
  "O(log n)", "ordenado mas rodado"                    → pesquisa binária                 §6
  "menor velocidade/capacidade que consegue"           → pesquisa binária na resposta     §6
  "intervalos", "reuniões", "sobrepostos"              → ordenar por início + juntar      §7
  "grelha", "ilhas", "regiões"                         → DFS na grelha                    §8
  "menos passos", "minutos até espalhar"               → BFS (várias origens)             §8
  "pré-requisitos", "dependências", "ordem válida"     → grafo + Kahn (topológica)        §9
  "todas as combinações/subconjuntos/permutações"      → backtracking                     §10
  "k-ésimo maior", "top k", "sempre o mínimo"          → heap (ou sort)                   §11
  "número de maneiras", "mín/máx de…", "é possível?"   → programação dinâmica             §12
  "remover a contar do fim", "numa passagem" (lista)   → dummy + dois ponteiros           §13
  "BST válida", "antepassado comum", "por níveis"      → DFS com limites / BFS            §14

  O que o n permite (≈ 10^8 passos simples por segundo):
    n ≤ 12         → O(n!)       permutações
    n ≤ 20         → O(2^n)      subconjuntos / backtracking
    n ≤ 500        → O(n³)
    n ≤ 10^4       → O(n²)       dois for, DP 2D
    n ≤ 10^6       → O(n log n)  sort, heap, pesquisa binária num ciclo
    n ≤ 10^8       → O(n)        um ciclo, Map, dois ponteiros, janela
    maior          → O(log n) ou O(1)
  ex.: "nums.length <= 10^5" → querem O(n) ou O(n log n); dois for dão timeout.

  Custos O(n) escondidos em JS: shift, unshift, includes, indexOf, splice, slice, [...arr], join.
  sort → O(n log n). Map/Set get/has/set/add/delete → O(1).
*/

// =====================================================================================
// §16 ── PLANO DE 7 DIAS ──────────
// =====================================================================================
/*
  Como praticar:
    - 25 min sozinho por problema. Encravado? Lê só a linha "Usar quando" e o molde. Mais 10 min.
    - Continua encravado → lê a solução, fecha-a, reescreve-a de memória. Isso conta.
    - Fala em voz alta enquanto escreves.
    - Depois de cada problema: diz a complexidade e escreve 2 casos limite.
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
  DIA 4 — Pilha + pesquisa binária + intervalos
    739 Daily Temperatures · 155 Min Stack · 33 Search in Rotated Sorted Array · 56 Merge Intervals
    + revisão: 3
  DIA 5 — Grelha, grafos, listas e árvores
    200 Number of Islands · 207 Course Schedule · 19 Remove Nth From End · 102 Level Order
    + revisão: 438, 56
  DIA 6 — DP + backtracking + heap
    198 House Robber · 322 Coin Change · 78 Subsets · 215 Kth Largest (primeiro com sort, depois com heap)
    + revisão: 347, 739
  DIA 7 — Entrevista simulada (sem olhar para este ficheiro)
    Escolhe 2 que ainda não fizeste: 238 Product of Array Except Self, 5 Longest Palindromic Substring
    (ou 875 Koko, 57 Insert Interval, 994 Rotting Oranges, 98 Validate BST).
    45 min cada, em voz alta, com a lista do §1. Depois refaz os que falhaste nos dias 1–6.
    Na véspera: relê só o §1 e o §15. Dorme.

  Só há tempo para 10: 49, 347, 560, 15, 3, 438, 56, 739, 200, 322.
*/

console.log("✅ Medium OK");
