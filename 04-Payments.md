# 04 · Pagamentos e Core Banking — cheat sheet

> Para entrevistas na Thought Machine (o Vault Core é um **ledger**, não um gateway de cartões).
> Exemplos executáveis: `node 04-Payments.js` → `✅ Payments OK`.
> Legenda: **[inferido]** = conclusão minha, não encontrada numa fonte pública.

## ÍNDICE

| § | Tema | Exemplo no `.js` |
|---|------|------------------|
| 1 | Dinheiro no código | §1 |
| 2 | Ledger de dupla entrada | §2 |
| 3 | Ciclo de vida de um pagamento com cartão | §3 |
| 4 | Idempotência | §4 |
| 5 | Retries | §5 |
| 6 | Concorrência | §6 |
| 7 | Consistência entre sistemas | — |
| 8 | Reconciliação e liquidação | — |
| 9 | Redes de pagamento e glossário curto | — |
| 10 | Thought Machine / Vault em 10 linhas | — |
| 11 | Ponte para a tua experiência | — |
| 12 | Perguntas prováveis | — |
| — | Sources | — |

---

## §1 Dinheiro no código

### Unidade mínima + moeda — guardar dinheiro como inteiro

- Para que serve: guardar €12,34 como `1234` cêntimos, sem os erros do `float` (`0.1 + 0.2 !== 0.3`).
- Regra essencial: dinheiro = inteiro na unidade mínima **+ a moeda**. As casas decimais vêm da moeda (ISO 4217); nunca assumir 2.
- O que guarda: `EXPONENT` — key = código da moeda; value = casas decimais. O value é um `BigInt` / `int64` (ou uma biblioteca decimal: `decimal.js`, Go `shopspring/decimal`), lido de uma string, nunca de um float.

| Texto | Moeda | Casas | Depois (`toMinor`) |
|-------|-------|-------|--------------------|
| `"12.34"` | EUR / USD | 2 | `1234n` |
| `"500"` | JPY | 0 | `500n` |
| `"1.234"` | BHD / KWD | 3 | `1234n` |

- Confusão possível: `1234n` sozinho não diz nada — em EUR vale €12,34, em BHD vale 1,234 BHD. Guardar sempre `{ amount: 1234, currency: "EUR" }`.
- Para recordar: inteiro na unidade mínima, com a moeda ao lado.
- Pergunta: quanto dá `toMinor("7.5", "EUR")`?

<details><summary>Ver resposta</summary>

`750n`. A parte decimal `"5"` é completada para `"50"` (EUR tem 2 casas): `"7" + "50"` = 750.

</details>

### Arredondamento bancário (half-even) + pontos base

- Para que serve: cobrar 1,5% de comissão sobre €1234,56 e arredondar sem favorecer sempre o mesmo lado.
- Regra essencial: só o empate exato (x,5) vai para o número **par**. Taxas em pontos base: 1 bp = 0,01%, logo 150 bp = 1,5%. Multiplicar primeiro, dividir e arredondar **uma vez**, no fim.
- O que guarda: `divHalfEven(a, b)` — `q` = quociente inteiro, `r` = resto, `2·|r|` comparado com `b` para saber se passou de metade.

| Operação | Valor exato | Depois |
|----------|-------------|--------|
| `divHalfEven(25n, 10n)` | 2,5 (empate) | `2n` (já é par) |
| `divHalfEven(35n, 10n)` | 3,5 (empate) | `4n` (sobe para o par) |
| `123456n × 150n ÷ 10000n` | 1851,84 cêntimos | `1852n` = €18,52 |

- Confusão possível: half-up vs half-even — half-up sobe sempre os empates e, em milhões de arredondamentos, o erro acumula; half-even equilibra.
- Para recordar: empate vai para o par; arredondar uma vez, com regra explícita.
- Pergunta: quanto dá `divHalfEven(45n, 10n)`?

<details><summary>Ver resposta</summary>

`4n`. 4,5 é empate e 4 já é par.

</details>

### Allocate — dividir sem perder um cêntimo

- Para que serve: dividir uma conta de €10,00 por 3 pessoas.
- Regra essencial: a soma das partes **tem** de dar o total. O que sobra vai, cêntimo a cêntimo, para o maior resto.
- O que guarda: `parts` = parte inteira de cada pessoa; `rems` = resto de cada uma; `left` = cêntimos ainda por dar.

| Passo | `parts` | `left` |
|-------|---------|--------|
| Divisão inteira 1000 / 3 | `[333, 333, 333]` | 1 |
| +1 ao maior resto | `[334, 333, 333]` | 0 |

- Confusão possível: arredondar cada parte (333 × 3 = 999) perde 1 cêntimo; allocate não perde.
- Para recordar: a soma das partes é sempre o total.
- Pergunta: quanto dá `allocate(500n, [1n, 1n, 1n])`?

<details><summary>Ver resposta</summary>

`[167n, 167n, 166n]`. 166 × 3 = 498; os 2 cêntimos que sobram vão para os dois primeiros (restos iguais → ordem original).

</details>

- Na entrevista: "Dinheiro é um inteiro na unidade mínima, mais a moeda. Arredondo uma vez, half-even, e faço allocate do resto para o total bater sempre."

→ `04-Payments.js` §1

---

## §2 Ledger de dupla entrada

### Ledger — cada movimento soma zero

- Para que serve: um depósito de €100 fica registado para sempre, e o dinheiro nunca aparece nem desaparece.
- Regra essencial: o ledger só cresce (append-only; nunca `UPDATE`). Cada transação tem ≥ 2 lançamentos (postings) que **somam 0**. O saldo é **derivado**: a soma dos lançamentos da conta (`SELECT SUM(amount) … WHERE account = 'alice'`, talvez com um snapshot em cache), nunca uma coluna editada.
- O que guarda: cada lançamento `{ txId, account, amount, phase }`. `amount`: + entra na conta, − sai. Contas: clientes (`"alice"`), lojas (`"merchant"`) e contas internas do banco (`"bank:cash"`, juros, comissões), que podem ficar negativas.

| Conta | Antes | `transfer("dep-1", "bank:cash", "alice", 10000n)` | Depois |
|-------|-------|---------------------------------------------------|--------|
| `bank:cash` | 0 | −10000 | −10000 |
| `alice` | 0 | +10000 | 10000 |
| soma | 0 | | 0 |

- Confusão possível: débito/crédito vs o sinal do código. Em contabilidade bancária, um depósito **debita** a caixa do banco (ativo sobe) e **credita** a conta do cliente (o depósito é um **passivo** do banco, que sobe). Os sinais mudam conforme a convenção; "soma zero" não muda.
- Para recordar: cada transação soma 0; o saldo é derivado.
- Pergunta: que acontece a uma transação com lançamentos −3000 e +2000?

<details><summary>Ver resposta</summary>

É recusada ("does not sum to zero (−1000)") e nada é gravado. Um ledger desequilibrado é um bug provado.

</details>

### Pendente vs liquidado + saldo disponível

- Para que serve: a Alice paga €30 com cartão; o dinheiro fica retido mas ainda não saiu.
- Regra essencial: a autorização só mexe na fase **pending**. Saldo liquidado não muda. **Disponível = liquidado − retenções a sair**; uma retenção a entrar não conta.
- O que guarda: fase `committed` = dinheiro que se moveu; fase `pending` = retenções. Cada lançamento pendente leva `hold` = id da autorização, para somar por retenção.

| Alice | Antes | `authorise("auth-1", "alice", "merchant", 3000n)` | Depois |
|-------|-------|---------------------------------------------------|--------|
| liquidado | 10000 | — | 10000 |
| pending | 0 | −3000 | −3000 |
| disponível | 10000 | | 7000 |
| merchant disponível | 0 | +3000 a entrar (não conta) | 0 |

- Confusão possível: saldo vs saldo disponível — o cliente vê €100 no extrato, mas só pode gastar €70.
- Para recordar: retido ≠ liquidado.
- Pergunta: com €70 disponíveis, a Alice tenta reter mais €70. Passa?

<details><summary>Ver resposta</summary>

Sim. 7000 não é menor que 7000, por isso há fundos; fica com 0 disponível.

</details>

### Liquidação parcial + estorno

- Para que serve: a loja captura só €25 dos €30 (um artigo esgotou) e depois reembolsa os €25.
- Regra essencial: liquidar = libertar a retenção inteira + lançar o valor final (pode ser menos, nunca mais). Corrigir = **estorno** (reversal): uma transação nova, ao contrário, com referência à original.
- O que guarda: `settle` grava `set-1:release` (pending, anula a retenção) e `set-1` (committed, −2500/+2500). `reverse` grava o simétrico de cada lançamento de `set-1`, com `reverses: "set-1"`.

| Alice | Antes | `settle("set-1", "auth-1", 2500n)` | Depois | `reverse("ref-1", "set-1")` | Depois |
|-------|-------|-----------------------------------|--------|-----------------------------|--------|
| liquidado | 10000 | −2500 | 7500 | +2500 | 10000 |
| pending | −3000 | +3000 | 0 | — | 0 |
| disponível | 7000 | | 7500 | | 10000 |

- Confusão possível: captura parcial vs reembolso parcial — na captura parcial os €5 nunca saíram; o reembolso devolve dinheiro que já saiu.
- Para recordar: o ledger só cresce; corrigir = estornar. `assertInvariants()` confirma que cada fase soma 0.
- Pergunta: e se a loja tentasse liquidar €35?

<details><summary>Ver resposta</summary>

Erro "settlement above authorised amount": 3500 > 3000 retidos.

</details>

- Na entrevista: "Um ledger append-only de dupla entrada: cada transação soma zero, o saldo é derivado e as correções são estornos."

→ `04-Payments.js` §2

---

## §3 Ciclo de vida de um pagamento com cartão

### Ciclo de vida — estados, não uma chamada

- Para que serve: uma encomenda de €30 → autorizar €30 → capturar €25 (um artigo esgotou) → liquidar → reembolsar €25.
- Regra essencial: cada estado tem regras de dinheiro diferentes (retido, movido, devolvido). As armadilhas: capturar depois de a autorização expirar, ou fazer refund do que nunca foi capturado (isso é um void).
- O que guarda: o pagamento tem um `status` e um `authExpiresAt`.

```
authorise ──► capture ──► settle ──► refund / refund parcial
    │                        └─────► dispute ──► chargeback (ganho/perdido)
    └──► void / expire (retenção libertada)
```

| Passo | Antes → depois do dinheiro |
|-------|----------------------------|
| Authorise | O emissor diz sim e **retém** o valor. Nada se moveu ainda |
| Capture | A loja reclama o valor (total ou parcial; o resto é libertado) |
| Settle / clearing | O dinheiro move-se mesmo: emissor → rede → adquirente → loja (dias) |
| Refund | Operação nova no sentido contrário; pode ser parcial |
| Chargeback | O titular contesta junto do emissor; a loja perde o valor + uma taxa, salvo se provar o contrário |

| Ator | Papel |
|------|-------|
| Titular (cardholder) | Dono do cartão |
| Loja (merchant) | Vende; recebe o dinheiro |
| Adquirente (acquirer) | O banco da loja |
| Emissor (issuer) | O banco do titular; aprova ou recusa |
| Rede (scheme) | Visa / Mastercard: regras e rede |
| PSP | Stripe, Adyen, RocketGate: liga a loja ao adquirente |

- Avançado: **Stripe PaymentIntent** — `requires_payment_method → requires_confirmation → requires_action (3DS) → processing / requires_capture → succeeded | canceled`. **3DS / SCA (PSD2)**: 2 de 3 fatores (sabes, tens, és); ex.: impressão digital (és) na app do banco no telemóvel (tens). Com 3DS, a responsabilidade pela fraude passa para o emissor.
- Confusão possível: void vs refund — void cancela a retenção antes da captura; refund devolve dinheiro capturado.
- Para recordar: autorizar retém; capturar reclama; liquidar move.
- Pergunta: a loja autorizou €30 e o cliente desiste antes da captura. Refund ou void?

<details><summary>Ver resposta</summary>

Void. Nada foi capturado, por isso só há uma retenção para libertar.

</details>

### Validade da autorização + máquina de estados

- Para que serve: impedir a captura de uma autorização Visa feita na segunda-feira, se a loja só tentar na terça da semana seguinte.
- Regra essencial: um passo só é válido se estiver na tabela de transições; uma autorização expirada conta como `expired`, que não tem saídas. Validade online (Stripe): Visa 7 dias CIT, 5 dias MIT (exatamente 4 d 18 h); Mastercard 7. Presencial: Visa 5 dias, Mastercard 2.
- O que guarda: `TRANSITIONS` — key = estado atual; value = estados permitidos a seguir.

| Estado | Pedido | Quando (validade 7 dias) | Estado efetivo | Depois |
|--------|--------|--------------------------|----------------|--------|
| authorised | captured | dia 1 | authorised | captured |
| authorised | captured | dia 8 | expired | erro |
| authorised | refunded | dia 1 | authorised | erro (é void) |

- Confusão possível: CIT vs MIT — CIT = o cliente está presente a pagar; MIT = a loja cobra sozinha (ex.: rebill de uma subscrição). A Visa dá-lhes validades diferentes.
- Para recordar: uma captura tardia é uma transição ilegal na tabela, não um if solto.
- Pergunta: ao dia 8, um void funciona?

<details><summary>Ver resposta</summary>

Não. O estado efetivo é `expired`, que não tem saídas: a retenção já se libertou sozinha.

</details>

- Na entrevista: "Modelo o pagamento como uma máquina de estados com transições permitidas. Uma captura tardia é uma transição ilegal, não um if perdido."

→ `04-Payments.js` §3

---

## §4 Idempotência

### Idempotency key + reserva única

- Para que serve: um duplo clique em "Pagar €10" envia dois `POST /charges` com a mesma key → uma só cobrança.
- Regra essencial: o cliente gera uma key (UUID v4; na Stripe vai no header `Idempotency-Key`, até 255 caracteres). O servidor **reserva** a key **antes** de cobrar; quem chega em segundo recebe 409 "em curso".
- O que guarda: tabela `idempotency_keys` — `key` (UNIQUE), `request_hash`, `state` (`in_progress` / `done`), `response`.

```sql
INSERT INTO idempotency_keys (key, request_hash, state)
VALUES ($1, $2, 'in_progress')
ON CONFLICT (key) DO NOTHING;      -- 0 rows = já existe → repetição ou 409
```

| Pedido | Linha `k1` antes | O que faz | Resposta | Cobranças |
|--------|------------------|-----------|----------|-----------|
| A | não existe | reserva e cobra | 201 | 1 |
| B (ao mesmo tempo) | `in_progress` | não cobra | 409 | 1 |

- Confusão possível: verificar-e-depois-inserir vs reservar — dois requests podem passar o "existe?" ao mesmo tempo; só o `UNIQUE` escolhe um vencedor.
- Para recordar: reservar a key antes do efeito.
- Pergunta: se o request B usasse a key `k2`, quantas cobranças haveria?

<details><summary>Ver resposta</summary>

2. Keys diferentes são requests diferentes.

</details>

### Hash do request + response guardada + TTL

- Para que serve: o cliente perde a response e repete `k1`; recebe a mesma response sem nova cobrança.
- Regra essencial: mesma key + mesmo body → a response guardada (mesmo status + body). Mesma key + body diferente → erro (a Stripe compara os parâmetros). A Stripe v1 guarda também responses 500 e pode apagar keys com ≥ 24 h (TTL).
- O que guarda: `request_hash` = hash do body; `response` = status + body da primeira execução.

| Pedido | Linha `k1` antes | Resposta | Cobranças |
|--------|------------------|----------|-----------|
| `k1`, €10,00 (repetição) | `done` | 201 `{ chargeId: "ch_1" }` | 1 |
| `k1`, €99,99 | `done` | 422 | 1 |
| `k1` reutilizada 3 dias depois | apagada (TTL) | tratada como request novo | 2 |

- Confusão possível: 409 vs 422 — 409 = o mesmo request ainda está a correr (tenta depois); 422 = key reutilizada com outro body (erro do cliente).
- Para recordar: repetição devolve a mesma response; body diferente é recusado.
- Pergunta: o body repetido tem os mesmos campos noutra ordem. Com `JSON.stringify` simples, que acontece?

<details><summary>Ver resposta</summary>

422: a ordem muda a string e portanto o hash. Em produção normaliza-se o body antes do hash.

</details>

### Escrita atómica + idempotência natural

- Para que serve: garantir que o efeito (lançamentos no ledger) e a response guardada nunca ficam desencontrados.
- Regra essencial: os dois na **mesma** transação da DB — ou ficam os dois, ou nenhum. Se os dados já têm um id único, usar esse: `UNIQUE(provider_event_id)` nos webhooks, `UNIQUE(order_id)` nas cobranças.
- O que guarda: `entries` (o efeito) e `idempotency_keys.response` (a response).

```sql
BEGIN;
INSERT INTO entries ...;                                          -- o efeito
UPDATE idempotency_keys SET state = 'done', response = $r WHERE key = $1;
COMMIT;                                                           -- os dois ou nenhum
```

| Falha | Sem transação | Com transação |
|-------|---------------|---------------|
| Processo morre entre os dois passos | cobrado, key ainda `in_progress` | nada gravado; repetir é seguro |

- Confusão possível: a cobrança no PSP fica fora desta transação — por isso a mesma key também vai para o PSP (§5).
- Para recordar: efeito e response no mesmo `COMMIT`.
- Pergunta: porque é que `UNIQUE(order_id)` dispensa uma key à parte?

<details><summary>Ver resposta</summary>

Porque a encomenda já identifica o request: uma segunda cobrança da mesma encomenda falha no `INSERT`.

</details>

- Na entrevista: "Uma idempotency key com constraint única, reservada antes do efeito, com hash do request e response guardada para repetição."

→ `04-Payments.js` §4

---

## §5 Retries

### Que erros repetir

- Para que serve: o PSP responde 503 duas vezes e depois funciona; um cartão recusado nunca se repete.
- Regra essencial: só se repete o que pode passar sozinho. Retries maus derrubam um serviço que está a recuperar e duplicam cobranças.
- O que guarda: `err.status` (HTTP) e `err.code` (`ETIMEDOUT`, `card_declined`, …).

| Repetir | Não repetir |
|---------|-------------|
| Timeout, `ECONNRESET` | 4xx de validação |
| 5xx, 429 (respeitar `Retry-After`) | Recusa do emissor (`card_declined`) |
| — | Suspeita de fraude, cartão roubado |

- Confusão possível: 429 é 4xx mas é temporário ("estás a pedir demais").
- Para recordar: uma recusa é uma response, não uma falha.
- Pergunta: `isRetryable({ status: 402, code: "card_declined" })`?

<details><summary>Ver resposta</summary>

`false`. O emissor respondeu "não"; repetir não muda a response.

</details>

### Backoff + jitter, numa só camada, com orçamento

- Para que serve: 10 000 clientes falham ao mesmo tempo; sem jitter repetiam todos no mesmo instante.
- Regra essencial: espera = `aleatório(0, min(teto, base · 2^n))` (full jitter). Repetir numa **só** camada: tentativas aninhadas multiplicam (AWS: 3 tentativas × 5 camadas = **243×** carga na DB). Orçamento (retry budget): um token bucket por cliente; sem tokens, sem retry.
- O que guarda: `attempt` = n.º da tentativa; `base` = 100 ms; `cap` = 5000 ms.

| Tentativa | `base · 2^n` | Com teto | `rand` | Espera |
|-----------|--------------|----------|--------|--------|
| 0 | 100 | 100 | 0.999 | 99 ms |
| 3 | 800 | 800 | 0.5 | 400 ms |
| 20 | 104 857 600 | 5000 | 0.999 | 4995 ms |

- Confusão possível: backoff vs jitter — backoff faz a espera crescer; jitter espalha os clientes. Precisa-se dos dois.
- Para recordar: crescer + aleatório + teto, numa camada.
- Pergunta: um cliente com 10 tokens de retry, a meio de uma falha geral, tenta o 11.º retry. Que acontece?

<details><summary>Ver resposta</summary>

Falha logo, sem repetir: não há tokens. Assim não acrescenta carga a quem está a recuperar.

</details>

### Resultado desconhecido

- Para que serve: o PSP cobra a encomenda 42, mas a response perde-se num timeout.
- Regra essencial: timeout ≠ falha. Antes de repetir, consultar o PSP com a **mesma** key (`psp.find(key)`). Se não for possível, marcar `unknown` e deixar a reconciliação (§8) decidir.
- O que guarda: `psp.charges` — key = key do request (`"order-42"`); value = a cobrança.

| Tentativa | O que faz | `psp.charges` | Resultado |
|-----------|-----------|---------------|-----------|
| 0 | `charge` | `order-42 → ch_1` | timeout (mas cobrou!) |
| 1 | `find("order-42")` | igual | `ch_1`, sem nova cobrança |

- Confusão possível: "deu erro" vs "não sei" — o PSP pode ter cobrado e só a response se perdeu.
- Para recordar: timeout = "ainda não sei".
- Pergunta: sem o `find` e com um PSP que ignora a key, quantas cobranças?

<details><summary>Ver resposta</summary>

2. A primeira aconteceu apesar do timeout; a segunda seria nova.

</details>

- Na entrevista: "Só repito erros temporários, com backoff e jitter, numa camada, dentro de um orçamento. Um timeout é um resultado desconhecido: verifico antes de repetir."

→ `04-Payments.js` §5

---

## §6 Concorrência

### Corrida no saldo (lost update) + update condicional

- Para que serve: impedir que dois levantamentos de €30 de uma conta com €50 passem os dois (double-spend).
- Regra essencial: a armadilha é ler → verificar no código → escrever; entre a leitura e a escrita o mundo mudou. Caso simples: deixar a DB verificar numa só row — `UPDATE accounts SET balance = balance - 3000 WHERE id = $id AND balance >= 3000`; 0 rows alteradas = recusado.
- O que guarda: `acc.balance` = saldo partilhado; `read` = a cópia velha que cada request leu.

| Passo | Pedido A | Pedido B | Saldo |
|-------|----------|----------|-------|
| ler | 5000 | 5000 | 5000 |
| verificar | 5000 ≥ 3000 | 5000 ≥ 3000 | 5000 |
| escrever | 5000 − 3000 | 5000 − 3000 | 2000 (saíram €60, desceu €30) |

- Confusão possível: mutex em Go (`sync.Mutex`) vs lock na DB — o mutex protege a memória de um processo; com 2 réplicas, cada uma tem o seu e os dois levantamentos passam. O lock vive na DB.
- Para recordar: nunca verificar o saldo no código entre ler e escrever.
- Pergunta: com o `UPDATE` condicional, o segundo levantamento de €30 vê que saldo?

<details><summary>Ver resposta</summary>

2000. O primeiro já escreveu; `2000 >= 3000` é falso, 0 rows alteradas → recusado.

</details>

### Escolher a ferramenta: version, FOR UPDATE, SERIALIZABLE, UNIQUE, um escritor

- Para que serve: escolher a proteção certa para o tipo de conflito.
- Regra essencial: a DB é o árbitro. Lock otimista: `UPDATE … WHERE version = $lida`; 0 rows → reler e decidir de novo.
- O que guarda: `accounts.version` = contador que sobe a cada escrita.

```sql
UPDATE accounts SET balance = $new, version = version + 1
WHERE id = $id AND version = $read_version;   -- 0 rows → conflito, reler
```

| Situação | Ferramenta | Antes → depois |
|----------|------------|----------------|
| Conflitos raros | `version` (otimista) | A escreve v0→v1; B falha, relê 2000, recusa |
| Muitos requests na mesma conta | `SELECT … FOR UPDATE` (trancar por ordem de id, evita deadlock) | B espera que A faça `COMMIT` |
| Regra sobre várias rows ("máx. €1000/dia em todas as contas") | `SERIALIZABLE`; erro Postgres `40001` → repetir a transação toda | a segunda transação falha e repete |
| "Só um pode ganhar" (um refund por pagamento) | `UNIQUE(payment_id)` | o 2.º `INSERT` falha |
| Volume muito alto | um escritor por conta (queue/partição por `account_id`) **[inferido]** | a corrida deixa de existir |

- Confusão possível: lock otimista vs `FOR UPDATE` — o otimista não bloqueia e repete em conflito; `FOR UPDATE` bloqueia a row até ao fim da transação.
- Para recordar: a versão diz se alguém chegou primeiro.
- Pergunta: com `version`, dois levantamentos de €20 de €50 — quanto fica?

<details><summary>Ver resposta</summary>

€10. B falha a primeira escrita, relê 3000 (v1), 3000 ≥ 2000, escreve 1000 (v2). Passam os dois.

</details>

- Na entrevista: "A DB é o árbitro: update condicional, versão ou FOR UPDATE. Nunca verifico o saldo no código entre uma leitura e uma escrita."

→ `04-Payments.js` §6

---

## §7 Consistência entre sistemas

### Outbox — publicar um evento sem o perder

- Para que serve: o ledger lança um pagamento de €25 e o serviço de emails tem de receber `payment.succeeded`.
- Regra essencial: sem transação distribuída. `db.commit(); kafka.publish()` perde o evento se o processo morrer entre os dois. Em vez disso, escrever o evento numa tabela `outbox` na **mesma** transação; um relay publica-o depois.
- O que guarda: `outbox` — `event_id`, `type`, `payload`, e se já foi enviado.

```sql
BEGIN;
INSERT INTO entries ...;
INSERT INTO outbox (event_id, type, payload) VALUES ($e, 'payment.succeeded', $p);
COMMIT;   -- o relay lê a outbox e publica no Kafka
```

| Processo morre depois do COMMIT | `entries` | Evento |
|---------------------------------|-----------|--------|
| `commit` + `publish` direto | gravado | perdido |
| Outbox | gravado | na `outbox`; o relay publica quando voltar |

- Confusão possível: outbox vs "publicar e depois gravar" — ao contrário também falha: evento enviado de um pagamento que nunca foi gravado.
- Para recordar: evento e dados no mesmo `COMMIT`.
- Pergunta: o relay publica e morre antes de marcar a row como enviada. Que acontece?

<details><summary>Ver resposta</summary>

Publica o mesmo evento outra vez quando voltar. É entrega at-least-once — o consumidor tem de ser idempotente.

</details>

### At-least-once + consumidor idempotente

- Para que serve: o evento `e1` chega duas vezes e o email só sai uma vez.
- Regra essencial: um evento pode chegar 2×. O consumidor regista `event_id` numa tabela `processed_events` com `UNIQUE`, **dentro** da transação do efeito. "Exactly-once" na prática = at-least-once + deduplicação.
- O que guarda: `processed_events.event_id` = eventos já tratados.

| Chegada | `INSERT … ON CONFLICT DO NOTHING` | Efeito |
|---------|-----------------------------------|--------|
| `e1` (1.ª) | 1 row | aplica |
| `e1` (2.ª) | 0 rows = já visto | ignora |

- Avançado: **ordem no Kafka** — key = `account_id`; a ordem só vale dentro de uma partição. **Saga** — desfazer um fluxo de vários passos com **compensações** (refund, libertar a retenção), não com rollback: reter €300 → reservar o voo → emissão falha → cancelar a reserva e libertar a retenção. **Webhooks** — verificar a assinatura HMAC, deduplicar por id, responder 2xx depressa e processar de uma queue; podem chegar fora de ordem (`refunded` antes de `succeeded`): usar a máquina de estados (§3) e ignorar passos para trás, ou reler o object na API.
- Confusão possível: registar o `event_id` fora da transação do efeito — se o efeito falhar, o evento fica "visto" e nunca é aplicado.
- Para recordar: exactly-once = at-least-once + dedupe.
- Pergunta: um webhook `refunded` chega antes de `succeeded`. Que faz a máquina de estados?

<details><summary>Ver resposta</summary>

Aplica `refunded` se a transição for válida a partir do estado atual; quando `succeeded` chega depois, é um passo para trás e é ignorado.

</details>

- Na entrevista: "Outbox para publicar, consumidores idempotentes para receber, sagas com compensações entre serviços. Exactly-once é at-least-once com dedupe."

---

## §8 Reconciliação e liquidação

### Reconciliação — comparar linha a linha

- Para que serve: comparar o ledger com os relatórios do PSP e o extrato do banco; é a rede de segurança que apanha o que a idempotência e os retries falharam.
- Regra essencial: linha a linha, por referência externa — nunca pelo total do dia. Diferenças vão para uma queue de exceções para humanos; nunca "acertar" um saldo à mão sem um lançamento.
- O que guarda: de cada lado, id externo (charge id, end-to-end id), valor, moeda e data.

| PSP | Ledger | Resultado |
|-----|--------|-----------|
| `ch_1` €25,00 | `set-1` €25,00 | casado |
| `ch_2` €10,00 | nada | queue de exceções |
| depósito líquido €24,30 | `set-1` €25,00 | lançar a comissão de €0,70 |

| Passo | O que fazer |
|-------|-------------|
| Casar | Pelo id externo; depois valor + moeda + data |
| Diferenças | Falta no PSP, falta do nosso lado, valor diferente, duplicado |
| Comissões | A liquidação chega **líquida** de comissões: lançar a comissão no ledger |
| Tempo | T+1 / T+2: o dinheiro chega dias depois da captura |

- Confusão possível: totais iguais não provam nada — um duplicado e uma falta do mesmo valor anulam-se no total.
- Para recordar: linha a linha, por referência.
- Pergunta: o total do dia bate certo. Pode haver erro?

<details><summary>Ver resposta</summary>

Sim: uma cobrança duplicada e outra em falta, do mesmo valor, dão o mesmo total.

</details>

### Registo de câmbio (FX) — conversão reproduzível

- Para que serve: converter €100 em USD e conseguir provar o valor meses depois numa auditoria.
- Regra essencial: guardar a taxa, a fonte, o instante e os dois valores; nunca recalcular depois. Arredondar para a unidade mínima com half-even (§1). Se a fonte principal falhar, usar uma secundária com idade máxima; se as duas falharem, recusar em vez de inventar.
- O que guarda: `{ from: "EUR", to: "USD", rate: "1.08425", source: "primary", at: "2026-11-13T15:00:00Z", amountFrom: 10000n, amountTo: 10842n }`.

| Passo | Valor |
|-------|-------|
| €100,00 × 1.08425 | $108,425 (empate) |
| half-even | $108,42 (`10842n`, o 2 é par) |
| Principal em baixo, secundária com 2 h, máximo 1 h | recusar a conversão |

- Confusão possível: guardar só a taxa vs guardar a taxa + fonte + instante — sem a fonte e o instante, ninguém consegue verificar a taxa.
- Para recordar: o valor convertido tem de ser reproduzível.
- Pergunta: €100,00 a uma taxa de 1.08435, quanto dá em cêntimos de USD?

<details><summary>Ver resposta</summary>

`10844n`. 10843,5 é empate; 10843 é ímpar, por isso sobe para o par 10844.

</details>

- Na entrevista: "Reconciliação diária, linha a linha, por referência externa. Em FX guardo a taxa, a fonte e o instante — o valor tem de ser reproduzível."

---

## §9 Redes de pagamento e glossário curto

| Termo | Numa linha | Exemplo |
|-------|------------|---------|
| SEPA SCT | Transferência em euros; liquida no dia útil seguinte | Renda enviada na sexta chega na segunda |
| SEPA SCT Inst | Instantânea, 24/7, ≤ 10 s; o Regulamento (UE) 2024/886 obriga os PSP da zona euro a enviá-la desde 9 out 2025 | €20 a um amigo no domingo à noite chega em segundos |
| SEPA SDD | Débito direto; precisa de mandato; o devedor pode contestar | O ginásio puxa €30 por mês |
| SWIFT | Rede de mensagens entre bancos (internacional); sozinha não move dinheiro | Um pagamento EUR → USD para um banco nos EUA |
| ISO 20022 | Padrão de mensagens XML. `pain` cliente↔banco, `pacs` banco↔banco, `camt` extratos | Ver a linha seguinte |
| Exemplos | `pain.001` ordem, `pacs.008` transferência, `pacs.002` estado, `camt.053` extrato | Ficheiro de salários da empresa = `pain.001` |
| Redes de cartões | Visa, Mastercard, Amex: regras, rede, taxas de intercâmbio | O emissor ganha intercâmbio em cada compra |
| IBAN / BIC | Id da conta / id do banco | `DE89 3704 0044 0532 0130 00` / `DEUTDEFF` |
| KYC / AML | Conhecer o cliente / anti-branqueamento (screening, monitorização) | Verificar o documento no registo; nomes contra listas de sanções |
| PCI DSS | Regras para dados de cartão. **Nunca** guardar o PAN completo nem o CVV | Guardar `last4: "4242"`, nunca os 16 dígitos |
| Tokenização | O PSP guarda o cartão; tu guardas um token (`pm_...`) | Cobrar `pm_123` no mês seguinte, sem dados do cartão do teu lado |

- **[inferido]** Os exemplos ISO 20022 acima são de memória; a página oficial (iso20022.org) devolveu 403.
- Confusão possível: SWIFT vs SEPA — SWIFT só transporta mensagens; SEPA é um esquema de pagamento em euros com regras de liquidação.
- Para recordar: cartão = autorização + liquidação adiada; SEPA Inst = push, final em segundos.
- Pergunta: posso guardar o CVV para facilitar a próxima compra?

<details><summary>Ver resposta</summary>

Não. O PCI DSS proíbe guardar o CVV depois da autorização; tokeniza-se no PSP.

</details>

- Na entrevista: "Cartões são autorização mais liquidação adiada; SEPA Inst é push e final em segundos. Não guardo o PAN nem o CVV — tokenizo no PSP."

---

## §10 Thought Machine / Vault em 10 linhas

1. **Vault Core** é a plataforma de core banking: ledger + produtos. **Vault Payments** é um produto à parte (processamento de pagamentos).
2. **Ledger em tempo real**, "fonte única de verdade", com fundos em qualquer **ativo e denominação** (moedas, cripto, pontos).
3. **Sem batch**, diz a brochura de 2023; o whitepaper de 2025 já mede lançamentos "offline" de baixa prioridade.
4. **Produtos = smart contracts** em Python (um subconjunto em sandbox), no "Universal Product Engine". O banco muda-os sem tocar no código da plataforma.
5. **Contratos versionados e imutáveis**; cada conta fica na versão com que abriu. **Supervisor contracts** coordenam vários contratos.
6. Uma **Postings API** síncrona (alvo < 100 ms) move fundos; os contratos também criam lançamentos (ex.: juros diários).
7. **Stack:** microserviços, Kubernetes, Istio, **Kafka**; streaming de dados em tempo real; independente da cloud.
8. **Escala medida:** 4769 TPS online (p95 < 500 ms), 15 035 TPS de consultas de saldo, 30 M de contas.
9. **[inferido — docs atrás de login]** Os lançamentos agrupam-se num *Posting Instruction Batch*; tipos como authorisation, settlement, release, transfer, hard settlement, custom.
10. **[inferido — docs atrás de login]** Saldo indexado por conta + endereço + ativo + denominação + fase (`committed`, `pending_in`, `pending_out`). O meu mini-ledger (§2) imita isto, com uma só fase `pending`.

- Confusão possível: Vault Core vs Vault Payments — o Core é o ledger e os produtos; o Payments é o produto de pagamentos.
- Para recordar: Vault = ledger em tempo real + produtos como código versionado.
- Pergunta: um banco muda a taxa de juro de um produto. Mexe no código da plataforma?

<details><summary>Ver resposta</summary>

Não. Muda o smart contract do produto (uma versão nova); as contas existentes ficam na versão com que abriram.

</details>

- Na entrevista: "O Vault é um ledger em tempo real em que o produto é código versionado. O meu papel seria garantir que cada lançamento é atómico, idempotente e equilibrado."

---

## §11 Ponte para a tua experiência

> ⚠️ A coluna "Frase modelo" é um exemplo de como nomear o conceito. Confirma no código o que fizeste de facto antes de o dizeres.

| O que fizeste | Conceito | Frase modelo |
|---------------|----------|--------------|
| Notificações de falha de rebill (RocketGate, Paynova) | Recusa vs erro temporário; webhooks; MIT recorrente | "Só uma falha técnica é repetida, nunca uma recusa do emissor." |
| Preços e descontos do Top Up | Cêntimos; arredondamento; allocate | "Descontos em inteiros, arredondados uma vez, com regra explícita." |
| Fallback da taxa de câmbio | Fonte da taxa; idade máxima; reproduzível | "Guardo a taxa e a fonte, para o valor poder ser auditado." |
| Cancelamento + reembolso (Duffel) | Reembolso como compensação de uma saga | "O reembolso é um passo de compensação, não um rollback." |
| Guarda de autorização tardia | Ciclo de vida da autorização; máquina de estados | "Capturar depois de expirar é uma transição ilegal." |
| Retries aninhados | Tempestade de retries; orçamento; uma camada | "Retries aninhados multiplicam a carga; passei-os para uma camada." |
| Hotfix "cobrado N, entregue N" | Idempotência + cobrança e entrega atómicas | "Uma key liga cobrança e entrega; um retry não duplica nenhuma." |

- Regra: conta a história real por palavras tuas; usa a coluna "Conceito" para dar nome ao padrão.
- Go vs TypeScript: os mesmos conceitos. Diz "em Go fazia o mesmo com `database/sql` e uma transação".
- Para recordar: história real primeiro, nome do padrão depois.
- Pergunta: que conceito nomeias ao falar dos retries aninhados?

<details><summary>Ver resposta</summary>

Tempestade de retries: tentativas em várias camadas multiplicam-se (3^5 = 243); a correção é uma camada com orçamento.

</details>

---

## §12 Perguntas prováveis + resposta curta

| Pergunta | Resposta curta |
|----------|----------------|
| Como evitas cobrar duas vezes? | Idempotency key com `UNIQUE`, reservada antes da cobrança, passada ao PSP, response guardada para repetição. |
| O PSP deu timeout. Repetes? | Não às cegas. Consulto por id/key; se não for claro, marco `unknown` e a reconciliação decide. |
| Dois levantamentos ao mesmo tempo? | Update condicional ou `version`; com muita carga, `FOR UPDATE` ou um escritor por conta. |
| Como guardas dinheiro? | Inteiro na unidade mínima + moeda; expoente ISO 4217; half-even; allocate do resto. |
| Como corriges uma transação errada? | Um estorno: transação nova, oposta, com referência. O ledger é append-only. |
| Como garantes que um evento sai depois de uma escrita? | Outbox na mesma transação + relay; consumidores idempotentes. |
| Como manténs a ordem por conta no Kafka? | Chave de partição = `account_id`; o consumidor lê a partição por ordem. |
| Que erros repetes? | Timeouts, 5xx, 429 — com backoff, jitter e orçamento. Nunca recusas nem 4xx de validação. |
| Um webhook chegou duas vezes / fora de ordem? | Verificar a assinatura, deduplicar por id de evento; a máquina de estados ignora passos para trás. |
| Saldo disponível vs saldo? | Disponível = liquidado − retenções a sair. Retenções a entrar não contam. |

- Para recordar: cada resposta nomeia o mecanismo (UNIQUE, version, outbox), não só a intenção.
- Pergunta: "Como evitas cobrar duas vezes?" — qual é a palavra que não pode faltar?

<details><summary>Ver resposta</summary>

"Reservada antes": a key é gravada com `UNIQUE` antes de cobrar, senão dois requests simultâneos passam os dois.

</details>

---

## Sources

- Stripe — Idempotent requests: https://docs.stripe.com/api/idempotent_requests
- Stripe — PaymentIntent lifecycle: https://docs.stripe.com/payments/paymentintents/lifecycle
- Stripe — Place a hold (auth/capture, validade): https://docs.stripe.com/payments/place-a-hold-on-a-payment-method
- AWS Builders' Library — Timeouts, retries and backoff with jitter: https://builder.aws.com/content/3EumjoZascWd1oZiEgL8ORlv3qE/timeouts-retries-and-backoff-with-jitter
- Thought Machine — Vault Core (current accounts): https://www.thoughtmachine.net/vault-core/current-and-transaction-accounts
- Thought Machine — Vault Pre-NDA brochure 2023 (PDF): https://info.thoughtmachine.net/hubfs/Vault_Pre_NDA_RGB_2023.pdf
- Thought Machine — Performance whitepaper: https://www.thoughtmachine.net/whitepapers/performance-proven-the-right-way
- Thoughtworks Radar — Thought Machine Vault: https://www.thoughtworks.com/radar/platforms/thought-machine-vault
- FF News — "We built this bank on smart contracts": https://ffnews.com/thought-leadership/we-built-this-bank-on-smart-contracts
- SEPA Inst 2025 (secundária; a EPC devolveu 403): https://www.aciworldwide.com/blog/sepa-instant-payments-whats-new-in-rulebook-2025-and-why-it-matters
- **Sem acesso:** docs oficiais do Vault (`docs.thoughtmachine.net` → login). Os itens 9–10 do §10 são **[inferidos]**.
