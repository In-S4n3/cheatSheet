// PADRÕES LEETCODE (nível MÉDIO) — JavaScript
// Correr: node 03-LeetCode-Medium.js → escreve "✅ Medium OK".
// Verificar cada "// result ==>": node check-results.js 03-LeetCode-Medium.js
// Antes deste: 02-LeetCode-Easy.js (Map, Set, sort com (a, b) => a - b).
// "// usa:" lista as peças básicas de JS de cada solução e onde estão explicadas: 01-JS-Fundamentals.js (01) ou 02-LeetCode-Easy.js (02).
// Formato de cada bloco: STYLE.md (para que serve → regra → o que guarda → código → passo a passo → confusão → para recordar → pergunta).

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
// Números em JS — decimais não são exatos
// Para que serve: não falhar um teste por comparar 0.1 + 0.2 com 0.3.
// Regra essencial: decimais são aproximações binárias; compara-os com uma tolerância, nunca com ===.
// O que guarda: nada; são expressões soltas, cada uma com o seu resultado.

0.1 + 0.2 === 0.3; // result ==> false  (os decimais enganam)
Math.abs(0.1 + 0.2 - 0.3) < Number.EPSILON; // result ==> true
Number.MAX_SAFE_INTEGER; // result ==> 9007199254740991
"Ab".toLowerCase() === "ab"; // result ==> true

// Antes → operação → depois
//   expressão                          valor real               resultado
//   0.1 + 0.2                          0.30000000000000004      ≠ 0.3 → false
//   Math.abs(0.1 + 0.2 - 0.3)          ~5.5e-17                 < EPSILON (~2.2e-16) → true
//   Number.MAX_SAFE_INTEGER            2^53 - 1                 maior inteiro exato
// usa: Math.abs / Number.EPSILON / MAX_SAFE_INTEGER → 01 §8 · toLowerCase → 01 §7
// Confusão possível: === vs tolerância. Com inteiros, === é exato; com decimais, compara a diferença com um valor pequeno.
// Para recordar: inteiros exatos até 2^53 - 1; decimais comparam-se com tolerância; divisão inteira → Math.floor / Math.trunc.
// Avançado: Number.EPSILON só serve para números perto de 1; para valores grandes usa uma tolerância relativa.
// Pergunta: quanto dá 0.1 * 3 === 0.3?
// Resposta: false. 0.1 * 3 dá 0.30000000000000004, o mesmo erro de arredondamento binário.

// =====================================================================================
// §2 ── HASH MAP AVANÇADO ──────────
// =====================================================================================
// Usar quando o enunciado diz: "subarray com soma k", "agrupar", "anagramas", "sequência consecutiva", "os k mais frequentes", "contar quantos"

//--------------------------------------------------------------------
// Subarray Sum Equals K (LC 560) — contar pedaços contíguos com soma k
// Para que serve: "quantos subarrays somam k?", mesmo com números negativos.
// Regra essencial: soma(i..j) = prefixo(j) - prefixo(i-1). Se já vi o prefixo (prefix - k), há um pedaço que termina aqui com soma k.
// O que guarda: prefix = soma de tudo até agora; total = respostas contadas;
//   seen é um Map; chave = um prefixo já visto; valor = quantas vezes esse prefixo apareceu.

function subarraySum(nums, k) {
  const seen = new Map([[0, 1]]); // prefixo 0 "existe" uma vez: permite pedaços que começam no índice 0
  let prefix = 0, total = 0;
  for (const n of nums) {
    prefix += n;
    const wanted = prefix - k; //                     1. que prefixo anterior deixaria um pedaço de soma k?
    total += seen.get(wanted) ?? 0; //                2. somar quantas vezes ele já apareceu
    seen.set(prefix, (seen.get(prefix) ?? 0) + 1); // 3. registar o prefixo atual (ler → somar → set)
  }
  return total; // só devolve no fim, depois de ver todos os números
}

// Antes → operação → depois (subarraySum([1, 2, 3], 3))
//   n   prefix   wanted   seen.get(wanted)   total   seen depois
//   1   1        -2       0                  0       0→1, 1→1
//   2   3        0        1                  1       0→1, 1→1, 3→1        ([1,2])
//   3   6        3        1                  2       0→1, 1→1, 3→1, 6→1   ([3])
subarraySum([1, 2, 3], 3); // result ==> 2  ([1,2] e [3])
subarraySum([1, 1, 1], 2); // result ==> 2  ([1,1] duas vezes)
subarraySum([1, -1, 0], 0); // result ==> 3  (negativos e zero)
subarraySum([], 0); // result ==> 0
subarraySum([5], 5); // result ==> 1
// Complexidade: O(n) tempo, O(n) espaço.
// usa: Map get/set → 01 §14 · ?? → 01 §3 · for...of → 01 §6 · padrão prefix sum → 02 §5
// Confusão possível: janela deslizante vs prefix sum. A janela só funciona com números positivos (crescer aumenta sempre a soma); com negativos, usa prefix sum + Map.
// Para recordar: procura prefix - k ANTES de guardar prefix.
// Pergunta: quanto dá subarraySum([2, 2], 2)?
// Resposta: 2. Prefixos 2 e 4: o 2 encontra o 0 inicial, o 4 encontra o 2. Cada [2] sozinho conta.

//--------------------------------------------------------------------
// Group Anagrams (LC 49) — juntar palavras com as mesmas letras
// Para que serve: agrupar ["eat", "tea", "tan"] em [["eat", "tea"], ["tan"]].
// Regra essencial: anagramas têm as mesmas letras ordenadas; essa string ordenada é a chave do Map.
// O que guarda: groups é um Map; chave = letras da palavra ordenadas ("aet"); valor = array das palavras com essas letras.

function groupAnagrams(strs) {
  const groups = new Map();
  for (const s of strs) {
    const letters = [...s]; //         1. "eat" → ["e", "a", "t"]
    letters.sort(); //                 2. → ["a", "e", "t"] (sort() sem função serve: são letras)
    const key = letters.join(""); //   3. → "aet"
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key).push(s); // push altera o array que já está dentro do Map
  }
  return [...groups.values()]; // devolve só os arrays, sem as chaves
}
// Versão compacta da chave: const key = [...s].sort().join("");

// Antes → operação → depois (["eat", "tea", "tan"])
//   s       key     o que acontece        Map depois
//   "eat"   "aet"   cria a entrada        aet → [eat]
//   "tea"   "aet"   push no grupo         aet → [eat, tea]
//   "tan"   "ant"   cria a entrada        aet → [eat, tea], ant → [tan]
groupAnagrams(["eat", "tea", "tan", "ate", "nat", "bat"]).map((g) => g.toSorted()).toSorted(); // result ==> [["ate", "eat", "tea"], ["bat"], ["nat", "tan"]]
groupAnagrams([""]); // result ==> [[""]]
groupAnagrams([]); // result ==> []
// Complexidade: O(n · L log L) tempo, L = tamanho da palavra.
// usa: [...s] → 01 §13 · sort() sem função → 01 §11 · join → 01 §7 · Map has/get/set/values → 01 §14 · padrão hash map → 02 §2
// Nota: o LeetCode aceita qualquer ordem; os exemplos ordenam com toSorted() (uma CÓPIA ordenada) para o resultado ser sempre igual.
// Confusão possível: get().push() vs set(). push() muda o array guardado no Map; não é preciso voltar a fazer set().
// Para recordar: chave = letras ordenadas; valor = lista de palavras.
// Pergunta: quanto dá groupAnagrams(["ab", "ba", "abc"]).length?
// Resposta: 2. "ab" e "ba" têm a chave "ab"; "abc" tem a chave "abc".

//--------------------------------------------------------------------
// Longest Consecutive Sequence (LC 128) — a maior sequência 1,2,3,4 sem ordenar
// Para que serve: em [100, 4, 200, 1, 3, 2], encontrar 1,2,3,4 em O(n).
// Regra essencial: só começa a contar num número n que NÃO tem n-1 no Set; assim cada sequência é contada uma vez.
// O que guarda: set = os números sem repetidos (has() em O(1)); len = tamanho da sequência atual; best = o maior visto.

function longestConsecutive(nums) {
  const set = new Set(nums);
  let best = 0;
  for (const n of set) {
    if (set.has(n - 1)) continue; // não é início: a sequência já é contada a partir de um número menor
    let len = 1;
    while (set.has(n + len)) len++;
    best = Math.max(best, len);
  }
  return best;
}

// Antes → operação → depois ([100, 4, 200, 1, 3, 2]; o Set percorre pela ordem de inserção)
//   n     tem n-1?   o que acontece             len   best
//   100   não        início; 101 não existe     1     1
//   4     sim (3)    continue (não é início)    -     1
//   1     não        início; 2, 3, 4 existem    4     4
longestConsecutive([100, 4, 200, 1, 3, 2]); // result ==> 4  (1,2,3,4)
longestConsecutive([0, 3, 7, 2, 5, 8, 4, 6, 0, 1]); // result ==> 9
longestConsecutive([]); // result ==> 0
longestConsecutive([1, 2, 0, 1]); // result ==> 3  (repetidos)
longestConsecutive([-1, -2, 5]); // result ==> 2  (negativos)
// Complexidade: O(n) tempo, O(n) espaço. Ordenar primeiro (O(n log n)) também é aceite.
// usa: Set has → 01 §14 · continue / while → 01 §6 · Math.max → 01 §8
// Confusão possível: while dentro de for não é O(n²) aqui. Cada número só é percorrido pelo while a partir do início da sua sequência.
// Para recordar: só conta onde n-1 falta.
// Pergunta: quanto dá longestConsecutive([5, 6, 8])?
// Resposta: 2. A sequência 5,6 tem 2; o 8 fica sozinho porque falta o 7.

//--------------------------------------------------------------------
// Top K Frequent Elements (LC 347) — os k números que aparecem mais
// Para que serve: em [1,1,1,2,2,3] com k = 2, devolver [1, 2].
// Regra essencial: o índice do balde é a FREQUÊNCIA; lê-se do balde maior para o menor até ter k números.
// O que guarda: freq é um Map; chave = número; valor = quantas vezes aparece.
//   buckets é um array; índice = frequência; valor = lista dos números com essa frequência.

function topKFrequent(nums, k) {
  const freq = new Map();
  for (const n of nums) freq.set(n, (freq.get(n) ?? 0) + 1);
  const buckets = Array.from({ length: nums.length + 1 }, () => []); // frequência máxima possível = nums.length
  for (const [num, f] of freq) buckets[f].push(num);
  const result = [];
  for (let f = buckets.length - 1; f >= 0 && result.length < k; f--) {
    for (const num of buckets[f]) {
      if (result.length < k) result.push(num);
    }
  }
  return result;
}

// Antes → operação → depois ([1,1,1,2,2,3], k = 2 → freq: 1→3, 2→2, 3→1)
//   f        buckets[f]   result
//   6..4     []           []
//   3        [1]          [1]
//   2        [2]          [1, 2]   → result.length === k, o for para
topKFrequent([1, 1, 1, 2, 2, 3], 2).toSorted((a, b) => a - b); // result ==> [1, 2]
topKFrequent([1], 1); // result ==> [1]
topKFrequent([-1, -1, 4, 4, 4, 7], 2).toSorted((a, b) => a - b); // result ==> [-1, 4]
// Complexidade: O(n) tempo. Também serve na entrevista: [...freq].sort((a, b) => b[1] - a[1]).slice(0, k) → O(n log n).
// usa: contar com um Map → 01 §14 · Array.from({ length }) → 01 §9 · for...of com [num, f] → 01 §6, §13 · toSorted → 01 §10
// Confusão possível: buckets[número] vs buckets[frequência]. Aqui o índice é a frequência, por isso o array tem nums.length + 1 posições.
// Para recordar: contar → baldes por frequência → ler do fim.
// Pergunta: quanto dá topKFrequent([4, 4, 5], 1)?
// Resposta: [4]. O 4 está no balde 2, o 5 no balde 1; lê-se primeiro o balde 2.

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
// 3Sum (LC 15) — todos os trios únicos que somam 0
// Para que serve: em [-1, 0, 1, 2, -1, -4], encontrar [-1,-1,2] e [-1,0,1] sem trios repetidos.
// Regra essencial: ordena, fixa o 1.º número (i) e procura os outros dois com dois ponteiros. Salta valores iguais ao anterior.
// O que guarda: sorted = cópia ordenada; i = 1.º número; left/right = 2.º e 3.º; res = trios encontrados.

function threeSum(nums) {
  const sorted = [...nums].sort((a, b) => a - b); // cópia: não altera o input
  const res = [];
  for (let i = 0; i < sorted.length - 2; i++) {
    if (i > 0 && sorted[i] === sorted[i - 1]) continue; // mesmo 1.º número → mesmos trios. Saltar.
    let left = i + 1, right = sorted.length - 1;
    while (left < right) {
      const sum = sorted[i] + sorted[left] + sorted[right];
      if (sum === 0) {
        res.push([sorted[i], sorted[left], sorted[right]]);
        left++;
        right--;
        while (left < right && sorted[left] === sorted[left - 1]) left++; // saltar repetidos do 2.º número
      } else if (sum < 0) left++;
      else right--;
    }
  }
  return res;
}

// Antes → operação → depois (sorted = [-4, -1, -1, 0, 1, 2], i = 1 → sorted[i] = -1)
//   left   right   trio          soma   ação
//   2      5       -1, -1, 2     0      guarda; left++, right--
//   3      4       -1, 0, 1      0      guarda; left++, right--
//   4      3       -             -      left >= right → o while termina
//   (i = 2 também vale -1 → continue)
threeSum([-1, 0, 1, 2, -1, -4]); // result ==> [[-1, -1, 2], [-1, 0, 1]]
threeSum([0, 0, 0, 0]); // result ==> [[0,0,0]]  (repetidos → um só trio)
threeSum([0, 1, 1]); // result ==> []
threeSum([]); // result ==> []
// Complexidade: O(n²) tempo, O(1) espaço extra (além da cópia).
// usa: [...nums].sort((a, b) => a - b) → 01 §11, §13 · continue / while → 01 §6 · padrão dois ponteiros → 02 §3
// Confusão possível: comparar com i - 1 vs i + 1. Com i + 1 saltavas o 1.º -1 e perdias [-1,-1,2]; com i - 1 usas o 1.º e só saltas os seguintes.
// Para recordar: ordenar → fixar i → dois ponteiros → saltar iguais.
// Pergunta: quanto dá threeSum([-2, 0, 1, 1, 2])?
// Resposta: [[-2, 0, 2], [-2, 1, 1]]. Com i = -2, os ponteiros encontram 0+2 e depois 1+1.

//--------------------------------------------------------------------
// Container With Most Water (LC 11) — as duas paredes que guardam mais água
// Para que serve: escolher duas alturas que maximizam largura × altura menor.
// Regra essencial: mexe sempre a parede MAIS BAIXA; mexer a mais alta só encolhe a largura e a baixa continua a limitar.
// O que guarda: left/right = índices das paredes; area = água entre elas; best = a maior área vista.

function maxArea(height) {
  let left = 0, right = height.length - 1, best = 0;
  while (left < right) {
    const width = right - left;
    const h = Math.min(height[left], height[right]); // a água fica pela parede mais baixa
    best = Math.max(best, width * h);
    if (height[left] < height[right]) left++;
    else right--;
  }
  return best;
}

// Antes → operação → depois ([1, 8, 6, 2, 5, 4, 8, 3, 7])
//   left (h)   right (h)   largura × altura   best   mexe
//   0 (1)      8 (7)       8 × 1 = 8          8      left (1 < 7)
//   1 (8)      8 (7)       7 × 7 = 49         49     right (7 é a mais baixa)
//   1 (8)      7 (3)       6 × 3 = 18         49     right
maxArea([1, 8, 6, 2, 5, 4, 8, 3, 7]); // result ==> 49
maxArea([1, 1]); // result ==> 1
maxArea([5]); // result ==> 0
// Complexidade: O(n) tempo, O(1) espaço.
// usa: Math.min / Math.max → 01 §8 · while → 01 §6 · padrão dois ponteiros → 02 §3
// Confusão possível: aqui o array NÃO está ordenado. Os ponteiros mexem-se pela altura, não pela soma como no 3Sum.
// Para recordar: mexe a parede mais baixa.
// Pergunta: quanto dá maxArea([2, 3, 4])?
// Resposta: 4. Pontas 2 e 4: largura 2 × altura 2 = 4; depois 3 e 4: 1 × 3 = 3.

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
// Longest Substring Without Repeating Characters (LC 3) — o maior pedaço sem letras repetidas
// Para que serve: em "pwwkew", encontrar "wke" (3).
// Regra essencial: quando a letra nova fica repetida, encolhe pela esquerda até ela voltar a 1.
// O que guarda: freq é um Map; chave = letra; valor = quantas vezes está na janela atual.
//   left/right = pontas da janela; best = maior tamanho visto.

function lengthOfLongestSubstring(s) {
  const freq = new Map();
  let left = 0, best = 0;
  for (let right = 0; right < s.length; right++) {
    freq.set(s[right], (freq.get(s[right]) ?? 0) + 1);
    while (freq.get(s[right]) > 1) {
      // repetida: encolher até a repetida sair
      freq.set(s[left], freq.get(s[left]) - 1);
      left++;
    }
    best = Math.max(best, right - left + 1);
  }
  return best;
}

// Antes → operação → depois ("pwwkew")
//   right   letra   o que acontece                          janela   best
//   1       w       entra                                   "pw"     2
//   2       w       w fica 2 → sai "p", sai "w", left = 2   "w"      2
//   4       e       entra (depois de "k")                   "wke"    3
lengthOfLongestSubstring("pwwkew"); // result ==> 3  ("wke")
lengthOfLongestSubstring("abcabcbb"); // result ==> 3  ("abc")
lengthOfLongestSubstring("bbbbb"); // result ==> 1
lengthOfLongestSubstring(""); // result ==> 0
lengthOfLongestSubstring(" "); // result ==> 1  (o espaço também é um carácter)
lengthOfLongestSubstring("aA"); // result ==> 2  (maiúscula ≠ minúscula)
// Complexidade: O(n) tempo, O(tamanho do alfabeto) espaço.
// usa: Map get/set → 01 §14 · ?? → 01 §3 · s[i] → 01 §7 · Math.max → 01 §8 · padrão janela → 02 §4
// Confusão possível: substring vs subsequência. "pwke" não conta: não é contíguo em "pwwkew".
// Para recordar: entra à direita, sai à esquerda até não haver repetidos.
// Pergunta: quanto dá lengthOfLongestSubstring("abba")?
// Resposta: 2. "ab"; no 2.º b a janela encolhe para "b"; depois "ba".

//--------------------------------------------------------------------
// Longest Repeating Character Replacement (LC 424) — o maior pedaço de uma só letra trocando até k letras
// Para que serve: em "AABABBA" com k = 1, trocar um B e obter "AAAA" (4).
// Regra essencial: a janela é válida enquanto tamanho - (contagem da letra mais comum) <= k. Essas são as letras a trocar.
// O que guarda: freq é um Map; chave = letra; valor = quantas vezes está na janela.
//   maxFreq = a maior contagem de uma letra vista até agora; best = maior janela válida.

function characterReplacement(s, k) {
  const freq = new Map();
  let left = 0, maxFreq = 0, best = 0;
  for (let right = 0; right < s.length; right++) {
    freq.set(s[right], (freq.get(s[right]) ?? 0) + 1);
    maxFreq = Math.max(maxFreq, freq.get(s[right]));
    while (right - left + 1 - maxFreq > k) {
      freq.set(s[left], freq.get(s[left]) - 1);
      left++;
    }
    best = Math.max(best, right - left + 1);
  }
  return best;
}

// Antes → operação → depois ("AABABBA", k = 1)
//   right   janela    maxFreq   tamanho - maxFreq   ação                      best
//   2       "AAB"     2         1                   válida                    3
//   3       "AABA"    3         1                   válida                    4
//   4       "AABAB"   3         2 > 1               sai "A" → "ABAB" (4-3=1)  4
characterReplacement("AABABBA", 1); // result ==> 4
characterReplacement("ABAB", 2); // result ==> 4
characterReplacement("A", 0); // result ==> 1
characterReplacement("", 2); // result ==> 0
// Complexidade: O(n) tempo, O(26) espaço.
// usa: Map get/set → 01 §14 · ?? → 01 §3 · Math.max → 01 §8 · padrão janela → 02 §4
// Confusão possível: LC 3 vs LC 424. No LC 3 a janela é inválida quando uma letra repete; aqui quando há mais de k letras diferentes da mais comum.
// Para recordar: tamanho - maxFreq <= k.
// Avançado: maxFreq nunca desce ao encolher. Não faz mal: só um maxFreq MAIOR pode dar uma resposta melhor.
// Pergunta: quanto dá characterReplacement("AAAB", 0)?
// Resposta: 3. Sem trocas, o maior pedaço de uma só letra é "AAA".

//--------------------------------------------------------------------
// Find All Anagrams in a String (LC 438) — todas as posições onde começa um anagrama de p
// Para que serve: em "cbaebabacd" com p = "abc", devolver [0, 6] ("cba" e "bac").
// Regra essencial: janela de tamanho FIXO p.length; a cada passo entra uma letra à direita e sai uma à esquerda; compara as contagens.
// O que guarda: targetCount[i] = quantas vezes a letra i aparece em p; windowCount[i] = quantas vezes aparece na janela;
//   índice 0 = 'a', 1 = 'b', …, 25 = 'z' (só letras minúsculas, como no enunciado).

function findAnagrams(s, p) {
  if (p.length > s.length) return []; // return termina já: não cabe nenhuma janela
  const idx = (ch) => ch.charCodeAt(0) - 97; // 'a' = 97 → 0
  const targetCount = new Array(26).fill(0), windowCount = new Array(26).fill(0);
  for (const ch of p) targetCount[idx(ch)]++;
  const res = [];
  for (let right = 0; right < s.length; right++) {
    windowCount[idx(s[right])]++; // entra a letra da direita
    if (right >= p.length) windowCount[idx(s[right - p.length])]--; // sai a letra que ficou fora pela esquerda
    const full = right >= p.length - 1; // a janela já tem p.length letras?
    if (full && windowCount.join() === targetCount.join()) res.push(right - p.length + 1); // guarda o início
  }
  return res;
}

// Antes → operação → depois ("cbaebabacd", p = "abc")
//   right   entra   sai   janela   iguais?   res
//   1       b       -     "cb"     (curta)   []
//   2       a       -     "cba"    sim       [0]
//   3       e       c     "bae"    não       [0]
findAnagrams("cbaebabacd", "abc"); // result ==> [0, 6]  ("cba" e "bac")
findAnagrams("abab", "ab"); // result ==> [0, 1, 2]
findAnagrams("a", "ab"); // result ==> []
findAnagrams("", "a"); // result ==> []
// Complexidade: O(26 · n) = O(n) tempo, O(1) espaço.
// usa: charCodeAt → 01 §7 · new Array(26).fill(0) → 01 §9 · join para comparar arrays → 01 §7 · padrão janela fixa → 02 §4
// Confusão possível: a === b com arrays compara a REFERÊNCIA (dá false para dois arrays iguais). join() transforma-os em texto, que se compara por valor.
// Para recordar: janela fixa — entra um, sai um, compara contagens.
// Pergunta: quanto dá findAnagrams("aaa", "aa")?
// Resposta: [0, 1]. As janelas "aa" começam nos índices 0 e 1.

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
// Daily Temperatures (LC 739) — quantos dias até um dia mais quente
// Para que serve: para cada dia, dizer quantos dias faltam até aquecer (0 se nunca aquece).
// Regra essencial: quando chega um dia mais quente que o topo da pilha, esse dia é a resposta do topo; tira e repete.
// O que guarda: stack = índices dos dias ainda à espera (temperaturas a descer do fundo para o topo); res[d] = dias de espera do dia d.

function dailyTemperatures(temps) {
  const res = new Array(temps.length).fill(0); // 0 = nunca aquece
  const stack = [];
  for (let i = 0; i < temps.length; i++) {
    while (stack.length && temps[i] > temps[stack.at(-1)]) {
      const day = stack.pop();
      res[day] = i - day;
    }
    stack.push(i);
  }
  return res;
}

// Antes → operação → depois ([73, 74, 75, 71, 69, 72, 76, 73]; pilha = índice(temperatura))
//   i (temp)   sai da pilha (resposta)          pilha depois
//   1 (74)     0(73) → res[0] = 1               1(74)
//   4 (69)     nada (69 não é mais quente)      2(75), 3(71), 4(69)
//   5 (72)     4(69) → res[4] = 1; 3(71) → 2    2(75), 5(72)
dailyTemperatures([73, 74, 75, 71, 69, 72, 76, 73]); // result ==> [1,1,4,2,1,1,0,0]
dailyTemperatures([30, 30, 30]); // result ==> [0,0,0]  (igual não é "mais quente")
dailyTemperatures([]); // result ==> []
// Complexidade: O(n) tempo, O(n) espaço.
// usa: new Array(n).fill(0) / push / pop → 01 §9 · at(-1) → 01 §10 · padrão pilha → 02 §7
// Confusão possível: guardar temperaturas vs índices. Guarda-se o índice porque a resposta é uma distância (i - day); a temperatura lê-se com temps[índice].
// Para recordar: a pilha guarda quem ainda espera; o dia mais quente resolve-os.
// Pergunta: quanto dá dailyTemperatures([50, 40, 60])?
// Resposta: [2, 1, 0]. O 60 resolve o 40 (1 dia) e depois o 50 (2 dias); ninguém aquece depois do 60.

//--------------------------------------------------------------------
// Evaluate Reverse Polish Notation (LC 150) — calcular ["2","1","+","3","*"] = (2+1)*3
// Para que serve: avaliar uma expressão escrita com o operador DEPOIS dos números.
// Regra essencial: número → push; operador → tira dois, calcula, faz push do resultado.
// O que guarda: stack = números à espera de operador; ops é um objeto; chave = símbolo; valor = função que calcula.

function evalRPN(tokens) {
  const stack = [];
  const ops = {
    "+": (a, b) => a + b,
    "-": (a, b) => a - b,
    "*": (a, b) => a * b,
    "/": (a, b) => Math.trunc(a / b), // enunciado: a divisão corta para zero
  };
  for (const t of tokens) {
    if (t in ops) {
      const b = stack.pop(); // sai primeiro o operando da DIREITA
      const a = stack.pop(); // depois o da esquerda
      stack.push(ops[t](a, b));
    } else stack.push(Number(t));
  }
  return stack[0];
}

// Antes → operação → depois (["2", "1", "+", "3", "*"])
//   token   ação                    pilha depois
//   "1"     push 1                  [2, 1]
//   "+"     b = 1, a = 2 → 2 + 1    [3]
//   "*"     b = 3, a = 3 → 3 * 3    [9]   (depois do push do "3")
evalRPN(["2", "1", "+", "3", "*"]); // result ==> 9
evalRPN(["4", "13", "5", "/", "+"]); // result ==> 6
evalRPN(["10", "6", "9", "3", "+", "-11", "*", "/", "*", "17", "+", "5", "+"]); // result ==> 22
evalRPN(["-7", "2", "/"]); // result ==> -3  (trunc; floor daria -4)
// Complexidade: O(n) tempo, O(n) espaço.
// usa: objeto como tabela → 01 §5 · arrow functions → 01 §16 · "chave" in obj → 01 §12 · Math.trunc / Number(texto) → 01 §8 · padrão pilha → 02 §7
// Confusão possível: Math.trunc vs Math.floor. Com negativos diferem: trunc(-3.5) = -3, floor(-3.5) = -4.
// Para recordar: o 1.º pop é o da direita.
// Pergunta: quanto dá evalRPN(["5", "2", "-"])?
// Resposta: 3. b = 2 sai primeiro, a = 5 depois; 5 - 2 = 3 (não -3).

//--------------------------------------------------------------------
// Min Stack (LC 155) — pilha que diz o seu mínimo em O(1)
// Para que serve: push, pop, top e getMin, todos instantâneos.
// Regra essencial: uma 2.ª pilha guarda, ao lado de cada valor, o mínimo de tudo até ele. pop tira dos dois.
// O que guarda: values = os valores; mins[i] = o menor valor entre values[0..i].

class MinStack {
  constructor() {
    this.values = [];
    this.mins = [];
  }
  push(x) {
    this.values.push(x);
    const prevMin = this.mins.at(-1) ?? Infinity; // 1. mínimo até agora (Infinity se vazia)
    this.mins.push(Math.min(x, prevMin)); //          2. novo mínimo
  }
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
// Versão compacta do push: this.mins.push(Math.min(x, this.mins.at(-1) ?? Infinity));

const ms = new MinStack();
ms.push(-2); ms.push(0); ms.push(-3);
// Antes → operação → depois
//   operação   values        mins
//   push(-2)   [-2]          [-2]
//   push(0)    [-2, 0]       [-2, -2]
//   push(-3)   [-2, 0, -3]   [-2, -2, -3]
//   pop()      [-2, 0]       [-2, -2]
ms.getMin(); // result ==> -3
ms.pop();
ms.top(); // result ==> 0
ms.getMin(); // result ==> -2
// Complexidade: todas as operações O(1).
// usa: class + constructor → 01 §19 · at(-1) → 01 §10 · ?? → 01 §3 · Infinity → 01 §8
// Confusão possível: uma variável min vs uma pilha de mínimos. Depois de um pop, uma variável não sabe qual era o mínimo anterior; a pilha sabe.
// Para recordar: cada valor leva o seu mínimo ao lado.
// Pergunta: numa MinStack nova, push(5), push(3), pop(). Quanto dá getMin()?
// Resposta: 5. O pop tira o 3 e o seu mínimo; fica mins = [5].

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
// Search in Rotated Sorted Array (LC 33) — encontrar um número em [4,5,6,7,0,1,2] em O(log n)
// Para que serve: pesquisa binária num array ordenado que foi rodado.
// Regra essencial: em cada mid, UMA das metades está ordenada; vê se o target cabe nessa metade; se não, vai para a outra.
// O que guarda: lo/hi = zona onde o target ainda pode estar; mid = meio dessa zona.

function searchRotated(nums, target) {
  let lo = 0, hi = nums.length - 1;
  while (lo <= hi) {
    const mid = Math.floor((lo + hi) / 2);
    if (nums[mid] === target) return mid; // encontrado: o return termina a função já
    if (nums[lo] <= nums[mid]) {
      // metade esquerda [lo..mid] ordenada
      if (nums[lo] <= target && target < nums[mid]) hi = mid - 1;
      else lo = mid + 1;
    } else {
      // metade direita [mid..hi] ordenada
      if (nums[mid] < target && target <= nums[hi]) lo = mid + 1;
      else hi = mid - 1;
    }
  }
  return -1; // só chega aqui se o while acabar sem encontrar
}

// Antes → operação → depois ([4, 5, 6, 7, 0, 1, 2], target = 0)
//   lo   hi   mid (valor)   metade ordenada   target lá?   próximo
//   0    6    3 (7)         esquerda 4..7     não          lo = 4
//   4    6    5 (1)         esquerda 0..1     sim          hi = 4
//   4    4    4 (0)         -                 -            return 4
searchRotated([4, 5, 6, 7, 0, 1, 2], 0); // result ==> 4
searchRotated([4, 5, 6, 7, 0, 1, 2], 3); // result ==> -1
searchRotated([1], 0); // result ==> -1
searchRotated([1], 1); // result ==> 0
searchRotated([3, 1], 1); // result ==> 1
searchRotated([1, 2, 3], 3); // result ==> 2  (não rodado)
searchRotated([], 5); // result ==> -1
// Complexidade: O(log n) tempo, O(1) espaço.
// usa: Math.floor → 01 §8 · while → 01 §6 · padrão pesquisa binária → 02 §6
// Confusão possível: lo <= hi vs lo < hi. Para encontrar um valor exato usa-se <= (a zona de 1 elemento ainda é testada); na pesquisa na resposta usa-se < e devolve-se lo.
// Para recordar: uma metade está sempre ordenada — pergunta-lhe primeiro.
// Pergunta: quanto dá searchRotated([5, 1, 3], 5)?
// Resposta: 0. mid = 1 (valor 1): a direita 1..3 está ordenada mas não tem o 5 → hi = 0; depois mid = 0 encontra o 5.

//--------------------------------------------------------------------
// Koko Eating Bananas (LC 875) — a menor velocidade que come tudo em h horas
// Para que serve: "o menor valor que ainda funciona" quando testar um valor é fácil.
// Regra essencial: pesquisa binária sobre a VELOCIDADE (1 até à maior pilha). Se mid chega, tenta mais devagar; se não, mais depressa.
// O que guarda: lo/hi = velocidades possíveis; hoursAt(k) = horas precisas à velocidade k.

function minEatingSpeed(piles, h) {
  const hoursAt = (k) => {
    let total = 0;
    for (const p of piles) total += Math.ceil(p / k); // uma pilha de 3 a 2/hora leva 2 horas
    return total;
  };
  let lo = 1, hi = Math.max(...piles);
  while (lo < hi) {
    const mid = Math.floor((lo + hi) / 2);
    if (hoursAt(mid) <= h) hi = mid;
    else lo = mid + 1;
  }
  return lo; // lo === hi: a menor velocidade que funciona
}
// Versão compacta de hoursAt: piles.reduce((total, p) => total + Math.ceil(p / k), 0)

// Antes → operação → depois ([3, 6, 7, 11], h = 8)
//   lo   hi   mid   horas a mid       chega?   próximo
//   1    11   6     1+1+2+2 = 6       sim      hi = 6
//   1    6    3     1+2+3+4 = 10      não      lo = 4
//   4    6    5     1+2+2+3 = 8       sim      hi = 5   (depois mid = 4 → 8 horas → hi = 4 → fim)
minEatingSpeed([3, 6, 7, 11], 8); // result ==> 4
minEatingSpeed([30, 11, 23, 4, 20], 5); // result ==> 30  (h = número de pilhas → maior pilha)
minEatingSpeed([30, 11, 23, 4, 20], 6); // result ==> 23
minEatingSpeed([1], 1); // result ==> 1
// Complexidade: O(n · log(maiorPilha)) tempo, O(1) espaço.
// usa: Math.ceil / Math.max → 01 §8 · ...piles → 01 §13 · reduce → 01 §10 · padrão pesquisa binária → 02 §6
// Confusão possível: Math.ceil vs Math.floor. A Koko não come duas pilhas na mesma hora: 3 bananas a 2/hora são 2 horas, não 1.
// Para recordar: pesquisa a resposta, não o array.
// Avançado: Math.max(...arr) pode rebentar com arrays enormes (centenas de milhares). Aí usa um for ou reduce.
// Pergunta: quanto dá minEatingSpeed([4], 2)?
// Resposta: 2. A 1/hora leva 4 horas (> 2); a 2/hora leva 2 horas.

// =====================================================================================
// §7 ── INTERVALOS ──────────
// =====================================================================================
// Usar quando o enunciado diz: pares [início, fim], "sobrepostos", "juntar", "reuniões", "inserir"
// Molde: ordena por início; sobrepõem-se se atual.início <= último.fim; juntar = último.fim = Math.max(último.fim, atual.fim).

//--------------------------------------------------------------------
// Merge Intervals (LC 56) — juntar todos os intervalos que se sobrepõem
// Para que serve: [[1,3],[2,6],[8,10]] → [[1,6],[8,10]].
// Regra essencial: depois de ordenar por início, cada intervalo ou estende o último guardado ou começa um novo.
// O que guarda: sorted = cópia ordenada; res = intervalos já juntos; last = referência para o último de res.

function merge(intervals) {
  const copy = intervals.map((x) => [...x]); //      1. copiar cada par: não altera o input
  const sorted = copy.sort((a, b) => a[0] - b[0]); // 2. ordenar por início
  const res = [];
  for (const current of sorted) {
    const last = res.at(-1);
    if (last && current[0] <= last[1]) last[1] = Math.max(last[1], current[1]); // estende o último
    else res.push(current);
  }
  return res;
}
// Versão compacta: const sorted = intervals.map((x) => [...x]).sort((a, b) => a[0] - b[0]);

// Antes → operação → depois ([[1,3],[2,6],[8,10],[15,18]])
//   current   last     sobrepõe?   res depois
//   [1,3]     -        -           [[1,3]]
//   [2,6]     [1,3]    2 <= 3      [[1,6]]
//   [8,10]    [1,6]    8 > 6       [[1,6], [8,10]]
merge([[1, 3], [2, 6], [8, 10], [15, 18]]); // result ==> [[1,6], [8,10], [15,18]]
merge([[1, 4], [4, 5]]); // result ==> [[1,5]]  (tocar conta)
merge([[1, 4], [2, 3]]); // result ==> [[1,4]]  (um dentro do outro → o Math.max importa)
merge([[4, 7], [1, 4]]); // result ==> [[1,7]]  (input desordenado)
merge([]); // result ==> []
// Complexidade: O(n log n) tempo por causa do sort, O(n) espaço.
// usa: map + cópia [...x] → 01 §10, §13 · sort((a, b) => a[0] - b[0]) → 01 §11 · at(-1) → 01 §10
// Confusão possível: last[1] = … altera o array que já está DENTRO de res (last é uma referência, não uma cópia). Por isso não é preciso push.
// Para recordar: ordenar por início → estender ou acrescentar.
// Pergunta: quanto dá merge([[1, 2], [3, 4]])?
// Resposta: [[1,2], [3,4]]. 3 > 2, não se tocam, por isso ficam separados.

//--------------------------------------------------------------------
// Insert Interval (LC 57) — inserir um intervalo numa lista ordenada e manter tudo junto
// Para que serve: [[1,3],[6,9]] + [2,5] → [[1,5],[6,9]] em O(n), sem ordenar.
// Regra essencial: 3 fases — copiar os que acabam antes, juntar os que se sobrepõem, copiar o resto.
// O que guarda: i = posição atual na lista; start/end = o intervalo novo, a crescer à medida que engole os sobrepostos.

function insert(intervals, newInterval) {
  const res = [];
  let i = 0;
  let [start, end] = newInterval;
  while (i < intervals.length && intervals[i][1] < start) res.push(intervals[i++]); // fase 1: acaba antes
  while (i < intervals.length && intervals[i][0] <= end) {
    // fase 2: sobrepõe → alargar
    start = Math.min(start, intervals[i][0]);
    end = Math.max(end, intervals[i][1]);
    i++;
  }
  res.push([start, end]);
  while (i < intervals.length) res.push(intervals[i++]); // fase 3: o resto
  return res;
}
// intervals[i++] = dois passos: lê intervals[i] e SÓ DEPOIS soma 1 a i.

// Antes → operação → depois ([[1,2],[3,5],[6,7],[8,10],[12,16]] + [4,8])
//   fase   intervalo   teste       efeito
//   1      [1,2]       2 < 4       copia [1,2]
//   2      [3,5]       3 <= 8      start = 3, end = 8   ([6,7] não muda nada)
//   2      [8,10]      8 <= 8      end = 10 → push [3,10]; fase 3 copia [12,16]
insert([[1, 2], [3, 5], [6, 7], [8, 10], [12, 16]], [4, 8]); // result ==> [[1,2], [3,10], [12,16]]
insert([[1, 3], [6, 9]], [2, 5]); // result ==> [[1,5], [6,9]]
insert([], [5, 7]); // result ==> [[5,7]]
insert([[1, 5]], [6, 8]); // result ==> [[1,5], [6,8]]  (fica no fim)
insert([[3, 5]], [1, 2]); // result ==> [[1,2], [3,5]]  (fica no início)
// Complexidade: O(n) tempo, O(n) espaço.
// usa: let [start, end] = … → 01 §13 · intervals[i++] → 01 §3 · while → 01 §6 · Math.min / Math.max → 01 §8
// Confusão possível: fase 1 compara o FIM do antigo com o início do novo (fim < start); fase 2 compara o INÍCIO do antigo com o fim do novo (início <= end).
// Para recordar: antes → juntar → depois.
// Pergunta: quanto dá insert([[1, 5]], [2, 3])?
// Resposta: [[1,5]]. [1,5] sobrepõe [2,3]; min dos inícios = 1, max dos fins = 5.

// =====================================================================================
// §8 ── MATRIZ / GRELHA (DFS e BFS) ──────────
// =====================================================================================
// Usar quando o enunciado diz: grid[][], "ilhas", "regiões ligadas", "vizinhos cima/baixo/esquerda/direita", "menos passos", "minutos até espalhar"
// Molde: uma lista DIRS e um teste de limites. DFS = tudo o que está ligado; BFS = menos passos.
//   for (const [dr, dc] of DIRS) {
//     const nr = r + dr, nc = c + dc;
//     if (nr < 0 || nc < 0 || nr >= rows || nc >= cols) continue;  // fora da grelha
//     ...
//   }
const DIRS = [[1, 0], [-1, 0], [0, 1], [0, -1]]; // baixo, cima, direita, esquerda (usado nos dois blocos abaixo)

//--------------------------------------------------------------------
// Number of Islands (LC 200) — contar grupos de "1" que se tocam
// Para que serve: contar regiões ligadas numa grelha.
// Regra essencial: cada "1" ainda não visitado é uma ilha nova; afunda-a toda com DFS (escreve "0") para não a contar outra vez.
// O que guarda: g = cópia da grelha (onde se marca o visitado); islands = ilhas contadas; sink(r, c) = afunda a ilha que toca em (r, c).

function numIslands(grid) {
  const g = grid.map((row) => [...row]); // cópia: marcamos visitados com "0"
  const rows = g.length, cols = g[0]?.length ?? 0;
  const sink = (r, c) => {
    if (r < 0 || c < 0 || r >= rows || c >= cols || g[r][c] !== "1") return; // fora ou não é terra: pára este ramo
    g[r][c] = "0"; // marcar ANTES de recursar, senão volta para trás para sempre
    for (const [dr, dc] of DIRS) sink(r + dr, c + dc);
  };
  let islands = 0;
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (g[r][c] === "1") {
        islands++;
        sink(r, c);
      }
    }
  }
  return islands;
}

const islandGrid = [
  ["1", "1", "0", "0", "0"],
  ["1", "1", "0", "0", "0"],
  ["0", "0", "1", "0", "0"],
  ["0", "0", "0", "1", "1"],
];
// Antes → operação → depois (percorrer islandGrid linha a linha)
//   célula   valor   ação                                    islands
//   (0,0)    "1"     ilha nova; afunda (0,0) (0,1) (1,0) (1,1)  1
//   (0,1)    "0"     já afundada → ignora                     1
//   (2,2)    "1"     ilha nova; afunda (2,2)                  2   (depois (3,3) e (3,4) → 3)
numIslands(islandGrid); // result ==> 3
islandGrid[0][0]; // result ==> "1"  (o input não foi alterado)
numIslands([["0"]]); // result ==> 0
numIslands([["1"]]); // result ==> 1
numIslands([]); // result ==> 0
// Complexidade: O(rows · cols) tempo e espaço (recursão no pior caso).
// usa: map + cópia [...row] → 01 §10, §13 · ?. e ?? → 01 §3 · recursão → 01 §16 · ciclo numa matriz → 01 §6
// Confusão possível: "1" vs 1. Esta grelha tem STRINGS; g[r][c] === 1 daria sempre false.
// Para recordar: encontra terra → conta → afunda tudo.
// Pergunta: quanto dá numIslands([["1", "0", "1"]])?
// Resposta: 2. Os dois "1" estão separados por um "0"; diagonais também não contam.

//--------------------------------------------------------------------
// Rotting Oranges (LC 994) — minutos até todas as laranjas apodrecerem (2 = podre, 1 = fresca, 0 = vazio)
// Para que serve: "quanto tempo até espalhar" a partir de várias origens ao mesmo tempo.
// Regra essencial: BFS com TODAS as podres na fila inicial; cada nível da fila = 1 minuto.
// O que guarda: queue = podres do minuto atual; next = as que apodrecem neste minuto; fresh = frescas que restam; minutes = minutos passados.

function orangesRotting(grid) {
  const g = grid.map((row) => [...row]);
  const rows = g.length, cols = g[0]?.length ?? 0;
  let queue = [], fresh = 0;
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (g[r][c] === 2) queue.push([r, c]);
      if (g[r][c] === 1) fresh++;
    }
  }
  let minutes = 0;
  while (queue.length && fresh > 0) {
    const next = []; // próximo nível (evita o shift(), que é O(n))
    for (const [r, c] of queue) {
      for (const [dr, dc] of DIRS) {
        const nr = r + dr, nc = c + dc;
        if (nr < 0 || nc < 0 || nr >= rows || nc >= cols || g[nr][nc] !== 1) continue;
        g[nr][nc] = 2;
        fresh--;
        next.push([nr, nc]);
      }
    }
    queue = next;
    minutes++;
  }
  return fresh === 0 ? minutes : -1; // sobrou uma fresca inalcançável → impossível
}

// Antes → operação → depois ([[2,1,1],[1,1,0],[0,1,1]] → fresh = 6)
//   minuto   queue (podres)    apodrecem          fresh
//   1        (0,0)             (1,0), (0,1)       4
//   2        (1,0), (0,1)      (1,1), (0,2)       2
//   3        (1,1), (0,2)      (2,1)              1   (minuto 4: (2,2) → fresh 0 → fim)
orangesRotting([[2, 1, 1], [1, 1, 0], [0, 1, 1]]); // result ==> 4
orangesRotting([[2, 1, 1], [0, 1, 1], [1, 0, 1]]); // result ==> -1
orangesRotting([[0, 2]]); // result ==> 0  (sem frescas)
orangesRotting([[1]]); // result ==> -1  (fresca mas nada podre)
// Complexidade: O(rows · cols) tempo e espaço.
// usa: ciclo numa matriz → 01 §6 · for...of com [r, c] → 01 §13 · continue → 01 §6 · ternário → 01 §3
// Confusão possível: DFS vs BFS. DFS (como nas ilhas) vê o que está ligado, mas não conta passos; para "menos passos/minutos" usa BFS por níveis.
// Para recordar: todas as origens na fila; um nível = um minuto.
// Pergunta: quanto dá orangesRotting([[2, 1, 1]])?
// Resposta: 2. Minuto 1 apodrece a do meio; minuto 2 a da ponta.

// =====================================================================================
// §9 ── GRAFOS ──────────
// =====================================================================================
// Usar quando o enunciado diz: "pré-requisitos", "dependências", "arestas" / pares [a, b], "é possível acabar?", "ordem válida", "ciclo"

//--------------------------------------------------------------------
// Lista de adjacência — transformar pares [a, b] em "quem são os meus vizinhos"
// Para que serve: preparar um grafo para percorrer (como a grelha, com um Set de visitados).
// Regra essencial: graph[nó] = lista de vizinhos. Dirigido: só a → b. Não dirigido: também b → a.
// O que guarda: graph é um array; índice = nó; valor = array dos nós para onde há aresta.

function buildGraph(n, edges) {
  const graph = Array.from({ length: n }, () => []); // um array NOVO por nó
  for (const [a, b] of edges) graph[a].push(b); // dirigido. Não dirigido: também graph[b].push(a)
  return graph;
}

// Antes → operação → depois (buildGraph(3, [[0,1],[0,2]]))
//   aresta   operação           graph depois
//   início   -                  [[], [], []]
//   [0,1]    graph[0].push(1)   [[1], [], []]
//   [0,2]    graph[0].push(2)   [[1,2], [], []]
buildGraph(3, [[0, 1], [0, 2]]); // result ==> [[1,2], [], []]
// usa: Array.from({ length }, () => []) → 01 §9 · for...of com [a, b] → 01 §6, §13
// Confusão possível: Array.from({ length: n }, () => []) vs new Array(n).fill([]). O fill põe o MESMO array em todas as posições; um push aparecia em todos os nós.
// Para recordar: graph[nó] = vizinhos.
// Pergunta: quanto dá buildGraph(2, [[1, 0]])?
// Resposta: [[], [0]]. A aresta sai do nó 1 para o 0, por isso só graph[1] recebe o 0.

//--------------------------------------------------------------------
// Course Schedule (LC 207) — dá para fazer todas as cadeiras com estes pré-requisitos?
// Para que serve: detetar um ciclo em dependências (ordenação topológica, algoritmo de Kahn).
// Regra essencial: começa pelas cadeiras sem pré-requisitos; ao fazer uma, baixa o contador das que dependem dela; se fizeres todas, não há ciclo.
// O que guarda: graph[pre] = cadeiras que dependem de pre; inDegree[x] = quantos pré-requisitos x ainda tem por fazer;
//   queue = cadeiras prontas a fazer; done = cadeiras feitas.

function canFinish(numCourses, prerequisites) {
  const graph = Array.from({ length: numCourses }, () => []);
  const inDegree = new Array(numCourses).fill(0);
  for (const [course, pre] of prerequisites) {
    graph[pre].push(course); // a seta vai de pre para course
    inDegree[course]++;
  }
  const queue = [];
  for (let i = 0; i < numCourses; i++) if (inDegree[i] === 0) queue.push(i);
  let done = 0;
  for (let i = 0; i < queue.length; i++) {
    // ler queue[i] em vez de shift(): O(1); a fila cresce enquanto o for corre
    done++;
    for (const nxt of graph[queue[i]]) {
      inDegree[nxt]--;
      if (inDegree[nxt] === 0) queue.push(nxt);
    }
  }
  return done === numCourses; // a `queue` final é uma ordem válida (LC 210 Course Schedule II)
}

// Antes → operação → depois (canFinish(3, [[1,0],[2,0]]) → graph[0] = [1,2], inDegree = [0,1,1])
//   i   faz   inDegree depois   queue depois   done
//   0   0     [0, 0, 0]         [0, 1, 2]      1
//   1   1     [0, 0, 0]         [0, 1, 2]      2
//   2   2     [0, 0, 0]         [0, 1, 2]      3   → 3 === 3 → true
canFinish(3, [[1, 0], [2, 0]]); // result ==> true
canFinish(2, [[1, 0]]); // result ==> true
canFinish(2, [[1, 0], [0, 1]]); // result ==> false  (ciclo: inDegree [1,1], a fila começa vazia)
canFinish(1, []); // result ==> true
canFinish(4, [[1, 0], [2, 1], [3, 2], [1, 3]]); // result ==> false  (ciclo 1→2→3→1)
// Complexidade: O(V + E) tempo e espaço (nós + arestas).
// usa: Array.from / fill(0) → 01 §9 · for → 01 §6 · ++ / -- → 01 §3 · fila lida por índice em vez de shift() → 01 §9
// Confusão possível: [course, pre] vs [pre, course]. O par diz "course precisa de pre", mas a seta do grafo vai de pre para course.
// Para recordar: sem pré-requisitos primeiro; fez todas → sem ciclo.
// Pergunta: quanto dá canFinish(3, [[1, 0], [2, 1]])?
// Resposta: true. Faz-se 0, depois 1, depois 2 — uma cadeia, sem ciclo.

// =====================================================================================
// §10 ── BACKTRACKING ──────────
// =====================================================================================
// Usar quando o enunciado diz: "todas as combinações / subconjuntos / permutações", "gerar todos", "todas as maneiras de…", n pequeno (≤ 20)
// Molde: escolher → explorar → desfazer. Desenha a árvore de decisões em papel.
//   const res = [], current = [];
//   function bt(start) {
//     if (cheguei ao fim) { res.push([...current]); return; }   // CÓPIA: [...current]
//     for (let i = start; i < n; i++) {
//       current.push(nums[i]);   // escolher
//       bt(i + 1);               // explorar
//       current.pop();           // desfazer (volta ao estado anterior)
//     }
//   }

//--------------------------------------------------------------------
// Subsets (LC 78) — todos os subconjuntos
// Para que serve: listar as 2^n escolhas possíveis de elementos.
// Regra essencial: cada nó da árvore já é um subconjunto válido, por isso guarda-se logo ao entrar em bt.
// O que guarda: current = subconjunto a ser construído; res = cópias de todos os subconjuntos; start = primeiro índice que ainda se pode escolher.

function subsets(nums) {
  const res = [], current = [];
  function bt(start) {
    res.push([...current]);
    for (let i = start; i < nums.length; i++) {
      current.push(nums[i]);
      bt(i + 1); // i + 1: sem reutilizar e sem voltar atrás (evita [2,1] depois de [1,2])
      current.pop();
    }
  }
  bt(0);
  return res;
}

// Antes → operação → depois (subsets([1, 2, 3]); ordem das chamadas)
//   chamada   current ao entrar   guardado
//   bt(0)     []                  []
//   bt(1)     [1]                 [1]
//   bt(2)     [1, 2]              [1, 2]   (depois [1,2,3]; pop 3, pop 2; push 3 → [1,3]; …)
subsets([1, 2, 3]).map((s) => s.join()).toSorted(); // result ==> ["", "1", "1,2", "1,2,3", "1,3", "2", "2,3", "3"]  (8 subconjuntos)
subsets([]); // result ==> [[]]
subsets([1, 2, 3, 4]).length; // result ==> 16  (2^4)
// Complexidade: O(n · 2^n) tempo, O(n) de recursão.
// usa: função dentro de função → 01 §17 · recursão → 01 §16 · push / pop → 01 §9 · cópia [...current] → 01 §13 · join / toSorted → 01 §7, §10
// Nota: qualquer ordem é aceite; os exemplos passam cada resposta a texto com join() e ordenam com toSorted().
// Confusão possível: res.push(current) vs res.push([...current]). Sem cópia, res guarda 8 vezes o MESMO array, que no fim está vazio.
// Para recordar: guardar ao entrar; push → bt(i + 1) → pop.
// Pergunta: quanto dá subsets([7])?
// Resposta: [[], [7]]. bt(0) guarda []; depois push 7 e bt(1) guarda [7].

//--------------------------------------------------------------------
// Permutations (LC 46) — todas as ordens dos números
// Para que serve: listar as n! ordenações de [1, 2, 3].
// Regra essencial: em cada nível, tenta TODOS os índices ainda não usados; só guarda quando current tem o tamanho de nums.
// O que guarda: current = ordem a ser construída; used[i] = true se nums[i] já está em current; res = cópias das permutações.

function permute(nums) {
  const res = [], current = [], used = new Array(nums.length).fill(false);
  function bt() {
    if (current.length === nums.length) {
      res.push([...current]);
      return; // termina este ramo; volta à chamada anterior
    }
    for (let i = 0; i < nums.length; i++) {
      if (used[i]) continue;
      used[i] = true;
      current.push(nums[i]);
      bt();
      current.pop();
      used[i] = false;
    }
  }
  bt();
  return res;
}

// Antes → operação → depois (permute([1, 2, 3]); primeiros passos)
//   escolhe   current     used                  guarda?
//   1         [1]         [true, false, false]  não
//   2         [1, 2]      [true, true, false]   não (depois 3 → [1,2,3] guarda)
//   3         [1, 3]      [true, false, true]   não (depois de desfazer o 2; a seguir 2 → [1,3,2])
permute([1, 2, 3]).map((p) => p.join()).toSorted(); // result ==> ["1,2,3", "1,3,2", "2,1,3", "2,3,1", "3,1,2", "3,2,1"]  (6 permutações)
permute([1]); // result ==> [[1]]
// Complexidade: O(n · n!) tempo, O(n) espaço.
// usa: recursão → 01 §16 · fill(false) / push / pop → 01 §9 · continue → 01 §6 · cópia [...current] → 01 §13
// Confusão possível: start (subsets) vs used (permutações). Em subconjuntos [1,2] = [2,1], por isso só se anda para a frente; em permutações a ordem conta, por isso volta-se ao índice 0 e salta-se o que já foi usado.
// Para recordar: permutação = todos os não usados em cada nível.
// Pergunta: quanto dá permute([1, 2]).length?
// Resposta: 2. [1,2] e [2,1]; 2! = 2.

//--------------------------------------------------------------------
// Combination Sum (LC 39) — todas as combinações que somam target, podendo repetir números
// Para que serve: [2,3,6,7] com target 7 → [[2,2,3], [7]].
// Regra essencial: chama bt(i), não bt(i + 1), para o mesmo número poder repetir; corta o ramo quando remaining < 0.
// O que guarda: current = combinação a ser construída; remaining = quanto falta para chegar a target; start = primeiro índice permitido.

function combinationSum(candidates, target) {
  const res = [], current = [];
  function bt(start, remaining) {
    if (remaining === 0) {
      res.push([...current]);
      return;
    }
    if (remaining < 0) return; // passou do alvo: cortar este ramo
    for (let i = start; i < candidates.length; i++) {
      current.push(candidates[i]);
      bt(i, remaining - candidates[i]); // i (não i + 1): o mesmo número pode repetir
      current.pop();
    }
  }
  bt(0, target);
  return res;
}

// Antes → operação → depois (combinationSum([2, 3, 6, 7], 7); um ramo)
//   current      remaining   efeito
//   [2, 2]       3           continua
//   [2, 2, 2]    1           todos os filhos dão < 0 → cortados
//   [2, 2, 3]    0           guarda [2,2,3]
combinationSum([2, 3, 6, 7], 7).map((c) => c.join()).toSorted(); // result ==> ["2,2,3", "7"]
combinationSum([2, 3, 5], 8).map((c) => c.join()).toSorted(); // result ==> ["2,2,2,2", "2,3,3", "3,5"]
combinationSum([2], 1); // result ==> []
// Complexidade: exponencial, ~O(2^target) tempo, O(target) de recursão.
// usa: recursão → 01 §16 · push / pop → 01 §9 · cópia [...current] → 01 §13
// Confusão possível: bt(i) vs bt(i + 1). bt(i) permite repetir o mesmo número; bt(i + 1) usa cada um no máximo uma vez (como em Subsets).
// Para recordar: repetir = bt(i); sem repetir = bt(i + 1).
// Pergunta: quanto dá combinationSum([3], 9)?
// Resposta: [[3, 3, 3]]. Só há o 3; bt(0) repete-o até remaining chegar a 0.

// =====================================================================================
// §11 ── HEAP (fila de prioridade) ──────────
// =====================================================================================
// Usar quando o enunciado diz: "k-ésimo maior/menor", "os k mais…", "sempre o mínimo atual", "juntar k listas ordenadas", dados em fluxo

//--------------------------------------------------------------------
// MinHeap — ter sempre o menor valor à mão
// Para que serve: tirar o menor em O(log n) enquanto vão entrando valores novos.
// Regra essencial: num array, o pai do índice i está em Math.floor((i - 1) / 2) e cada pai é <= aos filhos; por isso o menor está em [0].
// O que guarda: a = o array do heap; push sobe o novo valor até ao sítio; pop põe o último no topo e deixa-o afundar.

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
      const parent = Math.floor((i - 1) / 2);
      if (a[parent] <= a[i]) break; // o pai já é menor: está no sítio
      [a[parent], a[i]] = [a[i], a[parent]]; // sobe
      i = parent;
    }
  }
  pop() {
    const a = this.a;
    const top = a[0];
    const last = a.pop();
    if (a.length) {
      a[0] = last; // o último vai para o topo e "afunda"
      let i = 0;
      while (true) {
        const l = 2 * i + 1, r = 2 * i + 2;
        let smallest = i;
        if (l < a.length && a[l] < a[smallest]) smallest = l;
        if (r < a.length && a[r] < a[smallest]) smallest = r;
        if (smallest === i) break;
        [a[smallest], a[i]] = [a[i], a[smallest]];
        i = smallest;
      }
    }
    return top; // devolve o menor guardado no início; o resto foi arrumação
  }
}

const h = new MinHeap();
for (const x of [5, 3, 8, 1]) h.push(x);
// Antes → operação → depois
//   operação   array depois    porquê
//   push(3)    [3, 5]          3 < pai 5 → troca
//   push(8)    [3, 5, 8]       8 >= pai 3 → fica
//   push(1)    [1, 3, 8, 5]    1 < pai 5 → troca; 1 < pai 3 → troca
h.a; // result ==> [1, 3, 8, 5]  (não está ordenado; só o [0] é garantido)
const testHeap = new MinHeap();
for (const x of [5, 3, 8, 1, 9, 1, -2]) testHeap.push(x);
testHeap.peek(); // result ==> -2
const out = [];
while (testHeap.size) out.push(testHeap.pop());
out; // result ==> [-2,1,1,3,5,8,9]  (sai sempre por ordem)
new MinHeap().pop(); // result ==> undefined
// Complexidade: push/pop O(log n), peek O(1).
// usa: class + get → 01 §19 · troca com [a, b] = [b, a] → 01 §13 · Math.floor → 01 §8 · while (true) + break → 01 §6
// Nota: JS não tem heap nativo. Na entrevista pergunta "posso assumir um MinHeap?"; se não, isto leva ~5 min.
// Confusão possível: heap vs array ordenado. O heap só garante o menor em [0]; o resto fica "meio arrumado", e por isso push/pop custam O(log n) e não O(n).
// Para recordar: pai em (i - 1) / 2, filhos em 2i + 1 e 2i + 2; push sobe, pop afunda.
// Pergunta: depois dos push 5, 3, 8, 1 em h, quanto dão h.pop() e depois h.peek()?
// Resposta: 1 e 3. O pop tira o 1; o 5 vai para o topo e afunda até ficar [3, 5, 8].

//--------------------------------------------------------------------
// Kth Largest Element in an Array (LC 215) — o k-ésimo maior número
// Para que serve: o 2.º maior de [3,2,1,5,6,4] é 5.
// Regra essencial: um MinHeap com no máximo k valores guarda os k maiores; o menor deles (o topo) é o k-ésimo maior.
// O que guarda: heap = os k maiores vistos até agora; peek() = o menor desses k.

function findKthLargest(nums, k) {
  const heap = new MinHeap();
  for (const n of nums) {
    heap.push(n);
    if (heap.size > k) heap.pop(); // tira o menor: nunca será o k-ésimo maior
  }
  return heap.peek();
}
// Também serve na entrevista (diz a complexidade!): ordenar → O(n log n), em 3 passos:
//   const copy = [...nums]; copy.sort((a, b) => b - a); return copy[k - 1];
const kthLargestSort = (nums, k) => [...nums].sort((a, b) => b - a)[k - 1];

// Antes → operação → depois ([3, 2, 1, 5, 6, 4], k = 2; conteúdo do heap, não a ordem do array)
//   n   depois do push   size > 2?   heap fica
//   1   {1, 2, 3}        sim         {2, 3}
//   5   {2, 3, 5}        sim         {3, 5}
//   6   {3, 5, 6}        sim         {5, 6}   (o 4 entra e sai a seguir → peek = 5)
findKthLargest([3, 2, 1, 5, 6, 4], 2); // result ==> 5
findKthLargest([3, 2, 3, 1, 2, 4, 5, 5, 6], 4); // result ==> 4  (repetidos contam)
findKthLargest([1], 1); // result ==> 1
findKthLargest([-1, -5, -3], 1); // result ==> -1
kthLargestSort([3, 2, 1, 5, 6, 4], 2); // result ==> 5
// Complexidade: O(n log k) tempo, O(k) espaço.
// usa: a classe MinHeap acima · for...of → 01 §6 · [...nums].sort((a, b) => b - a) → 01 §11, §13 · arrow → 01 §16
// Confusão possível: MinHeap vs MaxHeap para "k-ésimo MAIOR". Usa-se MIN: ele deita fora o mais pequeno e ficam os k maiores.
// Para recordar: k maiores num MinHeap; o topo é a resposta.
// Pergunta: quanto dá findKthLargest([1, 2, 3], 3)?
// Resposta: 1. O 3.º maior de três números é o menor; com k = 3 nunca se tira nada.

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
// House Robber (LC 198) — roubar o máximo sem roubar duas casas vizinhas
// Para que serve: escolher valores de um array sem escolher dois seguidos, maximizando a soma.
// Regra essencial: em cada casa, ou a saltas (fica o melhor até à anterior) ou a roubas (melhor até duas atrás + esta).
// O que guarda: memo é um Map; chave = índice i; valor = o máximo roubável das casas 0..i.
//   Na versão tabela: prev = melhor até à casa anterior; prevPrev = melhor até duas casas atrás.

// Versão MEMO
function robMemo(nums) {
  const memo = new Map();
  function bestUpTo(i) {
    if (i < 0) return 0; // base: sem casas
    if (memo.has(i)) return memo.get(i); // já calculado: o return evita repetir o trabalho
    const skip = bestUpTo(i - 1); //          saltar a casa i
    const take = bestUpTo(i - 2) + nums[i]; // roubar a casa i
    const r = Math.max(skip, take);
    memo.set(i, r);
    return r;
  }
  return bestUpTo(nums.length - 1);
}
// Versão TABELA (só precisas das 2 últimas → O(1) espaço)
function rob(nums) {
  let prevPrev = 0, prev = 0;
  for (const house of nums) {
    const current = Math.max(prev, prevPrev + house);
    prevPrev = prev;
    prev = current;
  }
  return prev;
}

// Antes → operação → depois (rob([2, 7, 9, 3, 1]))
//   casa   max(prev, prevPrev + casa)   prevPrev   prev
//   2      max(0, 0 + 2) = 2            0          2
//   7      max(2, 0 + 7) = 7            2          7
//   9      max(7, 2 + 9) = 11           7          11   (depois 3 → 11, 1 → 12)
for (const f of [rob, robMemo]) {
  f([2, 7, 9, 3, 1]); // result ==> 12  (2 + 9 + 1)
  f([1, 2, 3, 1]); // result ==> 4  (1 + 3)
  f([]); // result ==> 0
  f([5]); // result ==> 5
  f([2, 1, 1, 2]); // result ==> 4  (salta 2 casas seguidas)
}
// Complexidade: O(n) tempo, O(1) espaço (memo: O(n)).
// usa: recursão → 01 §16 · Map como memo → 01 §14, §17 · Math.max → 01 §8 · for...of → 01 §6
// Confusão possível: memo vs tabela. O memo começa no fim e desce por recursão; a tabela começa no início e sobe com um for. Calculam o mesmo.
// Para recordar: saltar (prev) ou roubar (prevPrev + casa).
// Pergunta: quanto dá rob([5, 1, 1, 5])?
// Resposta: 10. Rouba a 1.ª e a 4.ª casa (5 + 5); não são vizinhas.

//--------------------------------------------------------------------
// Coin Change (LC 322) — o menor número de moedas para fazer amount
// Para que serve: [1, 2, 5] para 11 → 3 moedas (5 + 5 + 1).
// Regra essencial: dp[v] = 1 + o menor dp[v - moeda], para cada moeda que cabe; dp[0] = 0; Infinity = impossível.
// O que guarda: dp[v] = o menor número de moedas que faz o valor v (Infinity se ainda não dá).

function coinChange(coins, amount) {
  const dp = new Array(amount + 1).fill(Infinity);
  dp[0] = 0;
  for (let v = 1; v <= amount; v++) {
    for (const coin of coins) {
      if (coin <= v) dp[v] = Math.min(dp[v], dp[v - coin] + 1); // usar esta moeda como a última
    }
  }
  return dp[amount] === Infinity ? -1 : dp[amount];
}

// Antes → operação → depois (coinChange([1, 2, 5], 11); primeiros valores)
//   v   moeda 1          moeda 2          moeda 5   dp[v]
//   1   dp[0] + 1 = 1    -                -         1
//   2   dp[1] + 1 = 2    dp[0] + 1 = 1    -         1
//   3   dp[2] + 1 = 2    dp[1] + 1 = 2    -         2   (… dp[11] = 3)
coinChange([1, 2, 5], 11); // result ==> 3  (5+5+1)
coinChange([2], 3); // result ==> -1
coinChange([1], 0); // result ==> 0
coinChange([1, 3, 4], 6); // result ==> 2  (3+3; o guloso daria 4+1+1)
// Complexidade: O(amount · coins) tempo, O(amount) espaço.
// usa: new Array(n).fill(Infinity) → 01 §9, §8 · for dentro de for → 01 §6 · Math.min → 01 §8 · ternário → 01 §3
// Confusão possível: guloso vs DP. "A maior moeda primeiro" falha: para 6 com [1,3,4] daria 4+1+1 (3 moedas); a DP encontra 3+3 (2).
// Para recordar: dp[v] = 1 + min(dp[v - moeda]).
// Pergunta: quanto dá coinChange([2, 5], 7)?
// Resposta: 2. dp[7] = dp[5] + 1 = 2 (5 + 2).

//--------------------------------------------------------------------
// Longest Increasing Subsequence (LC 300) — a maior sequência a subir, podendo saltar elementos
// Para que serve: em [10,9,2,5,3,7,101,18], encontrar 2,3,7,101 (4).
// Regra essencial: dp[i] = a maior subsequência que TERMINA em nums[i]; olha para cada j < i com nums[j] < nums[i].
// O que guarda: dp[i] = tamanho da maior subsequência crescente que acaba no índice i (começa em 1: o próprio número).

function lengthOfLIS(nums) {
  if (nums.length === 0) return 0;
  const dp = new Array(nums.length).fill(1);
  for (let i = 1; i < nums.length; i++) {
    for (let j = 0; j < i; j++) {
      if (nums[j] < nums[i]) dp[i] = Math.max(dp[i], dp[j] + 1); // prolongar a que acaba em j
    }
  }
  return Math.max(...dp); // a resposta pode acabar em qualquer i
}

// Antes → operação → depois ([10, 9, 2, 5, 3, 7, 101, 18])
//   i (valor)   j úteis (nums[j] < nums[i])   dp[i]
//   3 (5)       2 (2)                         2
//   4 (3)       2 (2)                         2
//   5 (7)       2, 3 (5), 4 (3)               3   (101 → 4; 18 → 4; max = 4)
lengthOfLIS([10, 9, 2, 5, 3, 7, 101, 18]); // result ==> 4  (2,3,7,101)
lengthOfLIS([0, 1, 0, 3, 2, 3]); // result ==> 4
lengthOfLIS([7, 7, 7, 7]); // result ==> 1  (iguais não contam)
lengthOfLIS([]); // result ==> 0
// Complexidade: O(n²) tempo, O(n) espaço. Existe uma versão O(n log n); O(n²) é aceite.
// usa: fill(1) → 01 §9 · for dentro de for → 01 §6 · Math.max(...dp) → 01 §8, §13
// Confusão possível: devolver dp.at(-1) vs Math.max(...dp). dp.at(-1) é só a melhor que acaba no ÚLTIMO número; a melhor pode acabar antes.
// Para recordar: dp[i] = a melhor que acaba em i.
// Pergunta: quanto dá lengthOfLIS([3, 1, 2])?
// Resposta: 2. A sequência 1, 2; o 3 não pode vir antes de números menores e continuar a subir.

//--------------------------------------------------------------------
// Longest Common Subsequence (LC 1143) — a maior sequência que duas strings partilham
// Para que serve: "abcde" e "ace" partilham "ace" (3), com saltos permitidos.
// Regra essencial: tabela 2D; letras iguais → diagonal + 1; diferentes → o melhor entre cima e esquerda.
// O que guarda: dp[i][j] = LCS dos primeiros i caracteres de a com os primeiros j de b. Linha/coluna 0 = string vazia = 0.

function longestCommonSubsequence(a, b) {
  const dp = Array.from({ length: a.length + 1 }, () => new Array(b.length + 1).fill(0));
  for (let i = 1; i <= a.length; i++) {
    for (let j = 1; j <= b.length; j++) {
      if (a[i - 1] === b[j - 1]) dp[i][j] = dp[i - 1][j - 1] + 1; // i - 1 porque dp tem uma linha a mais
      else dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
    }
  }
  return dp[a.length][b.length];
}

// Antes → operação → depois (tabela de longestCommonSubsequence("abc", "ac"))
//          ""   a    c
//   ""     0    0    0
//   a      0    1    1      (a = a → diagonal 0 + 1)
//   b      0    1    1      (b ≠ a, b ≠ c → max(cima, esquerda))
//   c      0    1    2      (c = c → diagonal 1 + 1)
longestCommonSubsequence("abc", "ac"); // result ==> 2
longestCommonSubsequence("abcde", "ace"); // result ==> 3  ("ace")
longestCommonSubsequence("abc", "def"); // result ==> 0
longestCommonSubsequence("", "abc"); // result ==> 0
// Complexidade: O(n · m) tempo e espaço.
// usa: Array.from para construir uma matriz → 01 §9 · ciclo numa matriz → 01 §6 · s[i] → 01 §7 · Math.max → 01 §8
// Confusão possível: subsequência vs substring comum. Subsequência permite saltos ("ace" em "abcde"); substring tem de ser contígua.
// Para recordar: igual → diagonal + 1; diferente → max(cima, esquerda).
// Pergunta: quanto dá longestCommonSubsequence("ab", "ba")?
// Resposta: 1. Partilham "a" ou "b", mas não os dois pela mesma ordem.

//--------------------------------------------------------------------
// Unique Paths (LC 62) — caminhos de um robô que só anda para a direita ou para baixo
// Para que serve: contar caminhos do canto superior esquerdo ao inferior direito numa grelha m × n.
// Regra essencial: caminhos até uma célula = os que chegam de cima + os que chegam da esquerda; a 1.ª linha e a 1.ª coluna valem 1.
// O que guarda: dp[r][c] = quantos caminhos chegam à célula (r, c).

function uniquePaths(m, n) {
  const dp = Array.from({ length: m }, () => new Array(n).fill(1));
  for (let r = 1; r < m; r++) {
    for (let c = 1; c < n; c++) dp[r][c] = dp[r - 1][c] + dp[r][c - 1];
  }
  return dp[m - 1][n - 1];
}

// Antes → operação → depois (tabela de uniquePaths(3, 3))
//   1   1   1
//   1   2   3      (2 = 1 de cima + 1 da esquerda; 3 = 1 + 2)
//   1   3   6      (6 = 3 de cima + 3 da esquerda)
uniquePaths(3, 3); // result ==> 6
uniquePaths(3, 7); // result ==> 28
uniquePaths(3, 2); // result ==> 3
uniquePaths(1, 1); // result ==> 1
// Complexidade: O(m · n) tempo e espaço.
// usa: Array.from + fill(1) → 01 §9 · ciclo numa matriz → 01 §6
// Confusão possível: DP vs DFS a contar caminhos. Um DFS percorre cada caminho (exponencial); a DP soma contagens, cada célula uma vez.
// Para recordar: cima + esquerda.
// Pergunta: quanto dá uniquePaths(2, 3)?
// Resposta: 3. Linha de baixo: 1, 1 + 1 = 2, 1 + 2 = 3.

// =====================================================================================
// §13 ── LISTAS LIGADAS (médio) ──────────
// =====================================================================================
// Usar quando o enunciado diz: `head`, "remover o n-ésimo a contar do fim", "numa só passagem", "dígitos por ordem inversa", "devolve a nova head"
// Molde (nó dummy): um nó falso antes da head evita o caso especial de mudar a head. Trabalha a partir do dummy e devolve dummy.next.
//   const dummy = new ListNode(0, head); ...trabalhar a partir de dummy...; return dummy.next;
// Auxiliares: toList([1, 2]) constrói 1 → 2 → null a partir do fim (reduceRight); toArray(head) volta a dar [1, 2].
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

//--------------------------------------------------------------------
// Remove Nth Node From End of List (LC 19) — apagar o n-ésimo nó a contar do fim, numa passagem
// Para que serve: [1,2,3,4,5] com n = 2 → [1,2,3,5].
// Regra essencial: fast vai n + 1 passos à frente de slow; quando fast chega a null, slow está mesmo ANTES do nó a apagar.
// O que guarda: dummy = nó falso antes da head; fast = ponteiro da frente; slow = ponteiro de trás (pára antes do alvo).

function removeNthFromEnd(head, n) {
  const dummy = new ListNode(0, head); // se o alvo for a head, slow fica no dummy
  let fast = dummy, slow = dummy;
  for (let i = 0; i <= n; i++) fast = fast.next; // n + 1 passos à frente
  while (fast) {
    fast = fast.next;
    slow = slow.next;
  }
  const target = slow.next; // 1. o nó a apagar
  slow.next = target.next; //  2. saltar por cima dele
  return dummy.next;
}
// Versão compacta dos 2 passos: slow.next = slow.next.next;

// Antes → operação → depois ([1, 2, 3, 4, 5], n = 2; depois dos 3 passos iniciais, fast está no 3)
//   fast   slow    (cada linha = um passo do while; avançam os dois)
//   3      dummy   início
//   4      1
//   5      2
//   null   3       pára → 3.next passa a ser o 5 (o 4 sai)
toArray(removeNthFromEnd(toList([1, 2, 3, 4, 5]), 2)); // result ==> [1,2,3,5]
toArray(removeNthFromEnd(toList([1]), 1)); // result ==> []
toArray(removeNthFromEnd(toList([1, 2]), 2)); // result ==> [2]  (remove a head)
toArray(removeNthFromEnd(toList([1, 2]), 1)); // result ==> [1]
// Complexidade: O(n) tempo, O(1) espaço.
// usa: class ListNode acima → 01 §19 · for / while → 01 §6 · padrão dummy + dois ponteiros → 02 §8
// Confusão possível: n vs n + 1 passos. Com n passos, slow parava EM cima do alvo; para o apagar é preciso estar no nó anterior.
// Para recordar: distância n + 1; slow pára antes do alvo.
// Pergunta: quanto dá toArray(removeNthFromEnd(toList([1, 2, 3]), 3))?
// Resposta: [2, 3]. O 3.º a contar do fim é a head; slow fica no dummy e salta o 1.

//--------------------------------------------------------------------
// Add Two Numbers (LC 2) — somar dois números guardados ao contrário em listas (342 → 2→4→3)
// Para que serve: somar números grandes dígito a dígito.
// Regra essencial: soma como na escola — dígito = soma % 10, vai-um = Math.floor(soma / 10); continua enquanto houver dígitos OU vai-um.
// O que guarda: dummy = nó falso antes do resultado; tail = último nó do resultado; carry = o "vai-um" (0 ou 1).

function addTwoNumbers(l1, l2) {
  const dummy = new ListNode(0);
  let tail = dummy, carry = 0;
  while (l1 || l2 || carry) {
    // `|| carry`: 5 + 5 = 10 precisa de um nó extra no fim
    const a = l1?.val ?? 0; // l1 null → l1?.val dá undefined → ?? troca por 0
    const b = l2?.val ?? 0;
    const sum = a + b + carry;
    carry = Math.floor(sum / 10);
    tail.next = new ListNode(sum % 10);
    tail = tail.next;
    l1 = l1?.next;
    l2 = l2?.next;
  }
  return dummy.next;
}

// Antes → operação → depois (2→4→3 + 5→6→4, ou seja 342 + 465)
//   a + b + carry   dígito (% 10)   carry   resultado
//   2 + 5 + 0 = 7   7               0       7
//   4 + 6 + 0 = 10  0               1       7→0
//   3 + 4 + 1 = 8   8               0       7→0→8   (807)
toArray(addTwoNumbers(toList([2, 4, 3]), toList([5, 6, 4]))); // result ==> [7,0,8]  (342 + 465 = 807)
toArray(addTwoNumbers(toList([0]), toList([0]))); // result ==> [0]
toArray(addTwoNumbers(toList([9, 9, 9, 9]), toList([9, 9]))); // result ==> [8,9,0,0,1]  (tamanhos diferentes)
toArray(addTwoNumbers(toList([5]), toList([5]))); // result ==> [0,1]  (vai-um no fim)
// Complexidade: O(max(n, m)) tempo e espaço.
// usa: ?. e ?? → 01 §3 · Math.floor → 01 §8 · % → 01 §3 · while → 01 §6 · padrão dummy → 02 §8
// Confusão possível: % vs Math.floor(/). sum % 10 dá o dígito que fica; Math.floor(sum / 10) dá o que vai para a casa seguinte.
// Para recordar: dígito = % 10, vai-um = / 10; não pares enquanto houver carry.
// Pergunta: quanto dá toArray(addTwoNumbers(toList([1]), toList([9, 9])))?
// Resposta: [0, 0, 1]. 1 + 99 = 100: 1+9 = 10 (0, vai 1), 0+9+1 = 10 (0, vai 1), o carry cria o 1.

// =====================================================================================
// §14 ── ÁRVORES (médio) ──────────
// =====================================================================================
// Usar quando o enunciado diz: `root`, "BST válida", "antepassado comum", "nível a nível", "vista da direita", "profundidade mínima"
// Molde (DFS em árvore): a informação desce como parâmetro e sobe como valor de retorno.
//   function dfs(node, infoDeCima) {
//     if (!node) return valorBase;
//     const left = dfs(node.left, ...), right = dfs(node.right, ...);
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
function toTree(arr) {
  if (!arr.length || arr[0] === null) return null;
  const root = new TreeNode(arr[0]), queue = [root];
  let i = 1;
  for (let f = 0; f < queue.length && i < arr.length; f++) {
    const node = queue[f];
    if (i < arr.length && arr[i] !== null) queue.push((node.left = new TreeNode(arr[i])));
    i++;
    if (i < arr.length && arr[i] !== null) queue.push((node.right = new TreeNode(arr[i])));
    i++;
  }
  return root;
}

//--------------------------------------------------------------------
// Validate Binary Search Tree (LC 98) — todos os da esquerda menores, todos os da direita maiores
// Para que serve: verificar se uma árvore é uma BST válida.
// Regra essencial: passa para baixo o intervalo permitido (min, max); cada nó tem de estar estritamente dentro dele.
// O que guarda: min/max = limites que vêm de TODOS os antepassados, não só do pai.

function isValidBST(node, min = -Infinity, max = Infinity) {
  if (!node) return true; // árvore vazia é válida
  if (node.val <= min || node.val >= max) return false; // BST do LeetCode: sem valores iguais
  const leftOk = isValidBST(node.left, min, node.val); // à esquerda, o máximo passa a ser este nó
  const rightOk = isValidBST(node.right, node.val, max); // à direita, o mínimo passa a ser este nó
  return leftOk && rightOk;
}
// Versão compacta: return isValidBST(node.left, min, node.val) && isValidBST(node.right, node.val, max);
// (a compacta nem visita a direita se a esquerda já falhou: && pára no primeiro false)

// Antes → operação → depois (toTree([5, 4, 6, null, null, 3, 7]))
//   nó   intervalo permitido   dentro?
//   5    (-Infinity, Infinity) sim
//   6    (5, Infinity)         sim
//   3    (5, 6)                não → false   (o 3 está à direita do 5)
isValidBST(toTree([5, 4, 6, null, null, 3, 7])); // result ==> false  (o 3 está à direita do 5)
isValidBST(toTree([2, 1, 3])); // result ==> true
isValidBST(toTree([5, 1, 4, null, null, 3, 6])); // result ==> false
isValidBST(toTree([2, 2, 2])); // result ==> false  (valores iguais)
isValidBST(null); // result ==> true
isValidBST(toTree([-2147483648])); // result ==> true  (por isso -Infinity, e não um número)
// Complexidade: O(n) tempo, O(altura) espaço.
// usa: parâmetros por omissão / recursão → 01 §16 · -Infinity / Infinity → 01 §8 · && → 01 §3 · padrão recursão em árvore → 02 §9
// Confusão possível: comparar só com os filhos diretos. [5,4,6,null,null,3,7] passa esse teste (3 < 6), mas o 3 está na subárvore direita do 5.
// Para recordar: passa (min, max) para baixo.
// Pergunta: quanto dá isValidBST(toTree([10, 5, 15, null, null, 6, 20]))?
// Resposta: false. O 6 está à direita do 10, por isso o intervalo dele é (10, 15).

//--------------------------------------------------------------------
// Lowest Common Ancestor of a Binary Tree (LC 236) — o nó mais baixo que tem p e q por baixo
// Para que serve: o antepassado comum mais próximo de dois nós.
// Regra essencial: se a esquerda E a direita encontraram alguma coisa, este nó é a resposta; senão, sobe o que foi encontrado.
// O que guarda: left/right = o que cada lado devolveu (p, q, o LCA, ou null).

function lowestCommonAncestor(node, p, q) {
  if (!node || node === p || node === q) return node; // pára: vazio, ou encontrou p ou q
  const left = lowestCommonAncestor(node.left, p, q);
  const right = lowestCommonAncestor(node.right, p, q);
  if (left && right) return node; // p de um lado, q do outro
  return left ?? right; // só um lado encontrou: sobe esse
}

const lcaRoot = toTree([3, 5, 1, 6, 2, 0, 8, null, null, 7, 4]);
const findNode = (node, val) => {
  if (!node) return null;
  if (node.val === val) return node;
  return findNode(node.left, val) ?? findNode(node.right, val);
};
// Antes → operação → depois (p = 5, q = 4; o 4 está por baixo do 5)
//   nó   left                 right              devolve
//   5    -                    -                  5 (é p: pára logo, não desce)
//   1    null (0)             null (8)           null
//   3    5                    null               5
lowestCommonAncestor(lcaRoot, findNode(lcaRoot, 5), findNode(lcaRoot, 4)).val; // result ==> 5  (um está por cima do outro)
lowestCommonAncestor(lcaRoot, findNode(lcaRoot, 5), findNode(lcaRoot, 1)).val; // result ==> 3
lowestCommonAncestor(lcaRoot, findNode(lcaRoot, 7), findNode(lcaRoot, 8)).val; // result ==> 3
// Complexidade: O(n) tempo, O(altura) espaço.
// usa: recursão → 01 §16 · && e ?? → 01 §3 · === → 01 §3 · padrão recursão em árvore → 02 §9
// Confusão possível: LCA em BST vs em árvore qualquer. Numa BST basta comparar valores (os dois menores → esquerda); aqui não há ordem, por isso procura-se dos dois lados.
// Para recordar: encontrou dos dois lados → sou eu.
// Pergunta: no lcaRoot, qual é o LCA de 6 e 4?
// Resposta: 5. O 6 está à esquerda do 5 e o 4 à direita (por baixo do 2).

//--------------------------------------------------------------------
// Binary Tree Level Order Traversal (LC 102) — ler a árvore um nível de cada vez
// Para que serve: [[3], [9, 20], [15, 7]] — cada nível num array.
// Regra essencial: BFS em que cada volta do while trata a fila inteira = um nível.
// O que guarda: queue = nós do nível atual; next = filhos deles (o nível seguinte); levels = valores por nível.

function levelOrder(root) {
  if (!root) return [];
  const levels = [];
  let queue = [root];
  while (queue.length) {
    levels.push(queue.map((n) => n.val));
    const next = [];
    for (const n of queue) {
      if (n.left) next.push(n.left);
      if (n.right) next.push(n.right);
    }
    queue = next;
  }
  return levels;
}

// Antes → operação → depois (toTree([3, 9, 20, null, null, 15, 7]))
//   queue     levels depois             next
//   [3]       [[3]]                     [9, 20]
//   [9, 20]   [[3], [9,20]]             [15, 7]
//   [15, 7]   [[3], [9,20], [15,7]]     []   → o while termina
levelOrder(toTree([3, 9, 20, null, null, 15, 7])); // result ==> [[3], [9,20], [15,7]]
levelOrder(toTree([1])); // result ==> [[1]]
levelOrder(null); // result ==> []
levelOrder(toTree([1, 2, null, 3])); // result ==> [[1], [2], [3]]  (árvore torta)
// Complexidade: O(n) tempo, O(n) espaço.
// usa: map → 01 §10 · for...of / while → 01 §6 · padrão por níveis (BFS) → 02 §9
// Nota: o mesmo código resolve LC 199 Right Side View (o último de cada nível) e LC 103 Zigzag (inverter os níveis ímpares).
// Confusão possível: BFS vs DFS. DFS desce até ao fundo de um ramo primeiro; para "nível a nível" usa BFS com uma fila.
// Para recordar: uma volta do while = um nível.
// Pergunta: quanto dá levelOrder(toTree([1, 2, 3]))?
// Resposta: [[1], [2, 3]]. O 1 é a raiz; o 2 e o 3 são os seus filhos, no nível seguinte.

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
