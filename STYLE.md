# Como cada conceito é explicado

O padrão é o do meu cheat sheet original (`git show c12a85a:JS-CheatSheet.js`).
Português de Portugal, palavras do dia a dia. Uma ideia por bloco.

## Forma de cada bloco

```js
//--------------------------------------------------------------------
// nome() - // serve para <uma situação concreta, em palavras simples>.

<código mínimo com dados reais: "Tiago", "Adelia", 1987>
expressao; // result ==> valor
// nota: <o que acontece se fizer diferente, ou a armadilha>
// nota2: <só se fizer mesmo falta>
```

## Regras

- A primeira linha é sempre `// nome - // serve para …`. Não há mais títulos.
- Não há secções com etiqueta, como "Para que serve", "Regra essencial", "Confusão possível", "Pergunta" ou "Resposta".
- O exemplo usa dados reais e pequenos. Primeiro o código, depois o resultado.
- Cada `// result ==> valor` é verdadeiro e verificado por `node check-results.js`.
- Ciclos e `console.log`: mostra o que aparece no ecrã, linha a linha, num `/* */` a seguir a `// result ==>`.
- Sintaxe nova: escreve os nomes das partes por cima do código, como fiz no for:
  ```js
  //      PARTIDA     CHEGADA          INCREMENTO
  // for (let i = 0; i < lista.length; i++) { … }
  ```
- No máximo duas notas (`// nota:` e `// nota2:`). Uma nota diz o que acontece se fizer de outra maneira.
- Usa primeiro a palavra simples e depois o termo técnico: "o nome sobe, o valor não — chama-se hoisting".
- Para comparar casos parecidos, usa dois exemplos lado a lado com o resultado de cada um. Não uses tabelas.
- Sem frases de manual. Se uma linha não ajuda a prever o resultado, sai.

## Exemplo de referência

```js
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
```

## Algoritmos: construir por camadas

Para um algoritmo, faço como no vídeo da LC 200: o código vai crescendo, uma camada de cada vez.

- O passo 1 é o esqueleto: a função, o contador, o ciclo principal, a chamada a uma função auxiliar com nome e o `return`.
- Cada passo seguinte preenche uma parte. Marco no código onde cada parte entra, com `// passo 2 — …`, `// passo 3 — …`.
- Cada caso tem o seu `if` explícito, com um comentário simples por cima: `// cima`, `// baixo`, `// esquerda`, `// direita`. Repetir código é aceitável.
- Uso nomes completos (`row`, `col`, `count`, `seen`) e escrevo sempre os limites (`row > 0`).
- Não uso truques no código de estudo: arrays de direções com `dr/dc`, `?.` para fugir aos limites, `head++` em vez de `shift()`, `continue`, várias instruções numa linha.
- A otimização fica numa nota no fim: `// nota: shift() é O(n); com um índice fica O(1).`
