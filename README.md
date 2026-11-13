# Cheat Sheet — JavaScript, LeetCode e Pagamentos

Notas pessoais para voltar a ter os básicos na ponta dos dedos.
Todos os `.js` correm sozinhos e testam-se a si próprios.

```bash
node 01-JS-Fundamentos.js   # ✅ Fundamentos OK
node 02-LeetCode-Facil.js   # ✅ Todos os exemplos passaram.
node 03-LeetCode-Medio.js   # ✅ Médio OK
node 04-Pagamentos.js       # ✅ Pagamentos OK
```

## Ficheiros

| Ficheiro | Para quê | Como procurar |
|---|---|---|
| `01-JS-Fundamentos.js` | A linguagem: tipos, strings, arrays, objetos, async | Ctrl+F `§N` (índice no topo) |
| `02-LeetCode-Facil.js` | 10 padrões, nível fácil, com lista de treino | Ctrl+F `§N` |
| `03-LeetCode-Medio.js` | Padrões de nível médio e plano de 7 dias | Ctrl+F `§N` |
| `04-Pagamentos.md` + `.js` | Dinheiro, ledger, idempotência, retries | Ctrl+F `§N` |

## Que padrão uso? (lê o enunciado e procura o sinal)

| Sinal no enunciado | Padrão | Onde |
|---|---|---|
| "já apareceu?", "quantas vezes", "par que soma X" | Map / Set | Fácil §2 · Médio §2 |
| Array **ordenado**, palíndromo, pares/trios | Dois ponteiros | Fácil §3 · Médio §3 |
| Subarray / substring **contínuo**, "o maior/menor" | Janela deslizante | Fácil §4 · Médio §4 |
| "soma de um intervalo", "subarray com soma K" | Soma de prefixos (+ Map) | Fácil §5 · Médio §2 |
| Ordenado + "encontra", ou "o mínimo que ainda funciona" | Pesquisa binária | Fácil §6 · Médio §6 |
| Parênteses, "próximo maior", desfazer | Stack | Fácil §7 · Médio §5 |
| `head`, `.next` | Lista ligada (dummy, lento/rápido) | Fácil §8 · Médio §13 |
| `root`, `.left/.right` | Recursão em árvore, BFS por níveis | Fácil §9 · Médio §14 |
| Intervalos `[início, fim]` | Ordenar por início e juntar | Médio §7 |
| Grelha de `"1"`/`"0"`, ilhas, vizinhos | DFS/BFS em matriz | Médio §8 |
| Dependências, "pré-requisitos" | Grafo + ordenação topológica | Médio §9 |
| "todas as combinações / subconjuntos / permutações" | Backtracking | Médio §10 |
| "os K maiores / mais frequentes" | Heap ou ordenar | Médio §11 |
| "de quantas formas", "mínimo de moedas", "máximo sem adjacentes" | Programação dinâmica | Médio §12 |

## O tamanho de n diz-te a complexidade que querem

| n até | Complexidade que passa |
|---|---|
| 20 | O(2ⁿ): backtracking |
| 1 000 | O(n²): dois `for` |
| 100 000 | O(n log n): ordenar, heap, pesquisa binária |
| 10⁸ | O(n): um `for`, Map, janela |
