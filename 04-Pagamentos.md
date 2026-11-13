# 04 · Pagamentos & Core Banking — cheat sheet

> Para entrevistas na Thought Machine (Vault Core = **ledger**, não gateway de cartões).
> Exemplos executáveis: `node 04-Pagamentos.js` → `✅ Pagamentos OK`.
> Legenda: **[inferido]** = conclusão minha, não está numa fonte pública.

## ÍNDICE

| § | Tema | Exemplo no `.js` |
|---|------|------------------|
| 1 | Dinheiro em código | §1 |
| 2 | Ledger de partidas dobradas | §2 |
| 3 | Ciclo de vida de um pagamento com cartão | §3 |
| 4 | Idempotência | §4 |
| 5 | Retries | §5 |
| 6 | Concorrência | §6 |
| 7 | Consistência entre sistemas | — |
| 8 | Reconciliação & settlement | — |
| 9 | Rails e glossário curto | — |
| 10 | Thought Machine / Vault em 10 linhas | — |
| 11 | Ponte para a tua experiência | — |
| 12 | Perguntas prováveis | — |
| — | Fontes | — |

---

## §1 Dinheiro em código

- **O que é:** guardar valores como inteiros na unidade menor (cêntimos), nunca `float`.
- **Porquê:** `0.1 + 0.2 !== 0.3`. Um cêntimo errado × milhões de contas = auditoria.
- **Armadilha:** assumir 2 casas decimais. O expoente vem da moeda (ISO 4217).

| Moeda | Expoente | 1 unidade = |
|-------|----------|-------------|
| JPY | 0 | 1 |
| EUR / USD | 2 | 100 |
| BHD / KWD | 3 | 1000 |

- **Representação:** `BigInt` / `int64` em cêntimos, ou uma lib decimal (`decimal.js`, Go `shopspring/decimal`).
- **Guarda sempre o par:** `{ amount: 1234, currency: "EUR" }`. Um número sem moeda não é dinheiro.
- **Arredondamento bancário (half-even):** empate vai para o par (2.5→2, 3.5→4). Remove o enviesamento acumulado do half-up.
- **Arredonda uma vez, no fim**, com regra explícita. Taxas em basis points (150 bp = 1.5%).
- **Dividir sem perder cêntimos:** 10.00 € / 3 = 3.34 + 3.33 + 3.33. O resto vai para quem tem maior resto (`allocate`).

```js
toMinor("12.34", "EUR")            // 1234n — parse por string, nunca por float
divHalfEven(25n, 10n)              // 2n
allocate(1000n, [1n, 1n, 1n])      // [334n, 333n, 333n] — soma 1000n
```
→ `04-Pagamentos.js` §1

- **Numa entrevista:** "Dinheiro é inteiro na unidade menor mais a moeda. Arredondo uma vez, com half-even, e reparto o resto para a soma bater sempre."

---

## §2 Ledger de partidas dobradas

- **O que é:** cada movimento debita uma conta e credita outra. A soma de cada transacção é zero.
- **Porquê:** o dinheiro nunca aparece nem desaparece. Um ledger desequilibrado é um bug provado.
- **Armadilha:** guardar `balance` como coluna editável. O saldo é **derivado** das entradas.

| Conceito | Regra |
|----------|-------|
| Conta | Cliente, merchant, ou interna do banco (caixa, juros, comissões) |
| Entrada (posting) | `{ txId, account, amount ±, phase }` |
| Transacção | ≥ 2 entradas, soma = 0 |
| Saldo | `SUM(amount)` das entradas da conta (pode ter snapshot em cache) |
| Imutável | Append-only. Erro corrige-se com **reversão**, nunca com `UPDATE` |
| Pending vs settled | Cativo (autorização) ≠ liquidado. Disponível = liquidado − cativos de saída |

- **Débito/crédito:** em contabilidade bancária, o depósito do cliente é um **passivo** do banco. Creditar a conta do cliente aumenta o saldo dele. Não decores sinais; decora "soma zero".
- **Saldo disponível:** entradas pendentes de saída reduzem; entradas pendentes de entrada **não** somam.

```js
L.authorise("auth-1", "alice", "merchant", 3000n); // cativo: só fase pending
L.available("alice");                              // 7000n (100 − 30)
L.settle("set-1", "auth-1", 2500n);                // liberta cativo, lança 25 €
L.reverse("ref-1", "set-1");                       // reembolso = tx oposta
L.assertInvariants();                              // soma global por fase = 0
```
→ `04-Pagamentos.js` §2

- **Numa entrevista:** "Ledger append-only de partidas dobradas: cada transacção soma zero, o saldo é derivado e as correcções são reversões."

---

## §3 Ciclo de vida de um pagamento com cartão

- **O que é:** um pagamento com cartão passa por estados, não é uma chamada única.
- **Porquê:** cada estado tem regras de dinheiro diferentes (cativo vs movido vs devolvido).
- **Armadilha:** capturar depois de a autorização expirar, ou reembolsar o que nunca foi liquidado.

```
authorise ──► capture ──► settle ──► refund / partial refund
    │                        └─────► dispute ──► chargeback (ganho/perdido)
    └──► void / expire (cativo libertado)
```

| Passo | O que acontece |
|-------|----------------|
| Authorise | Emissor confirma e **cativa** o valor. Ainda não se moveu dinheiro |
| Capture | Merchant pede o valor (total ou parcial; o resto é libertado) |
| Settle / clearing | Dinheiro move-se emissor → scheme → acquirer → merchant (dias) |
| Refund | Nova operação no sentido inverso; pode ser parcial |
| Chargeback | O titular contesta no emissor; o merchant perde o valor + taxa, salvo prova |

- **Expiração da autorização (Stripe, online):** Visa 5 dias em MIT (exactamente 4 d 18 h), 7 em CIT; Mastercard 7. Depois disso o cativo é libertado.
- **Stripe PaymentIntent:** `requires_payment_method → requires_confirmation → requires_action (3DS) → processing / requires_capture → succeeded | canceled`.
- **3DS / SCA (PSD2):** autenticação forte do cliente na Europa (2 de 3: algo que sabe, tem, é). Com 3DS, a responsabilidade por fraude passa para o emissor.

| Actor | Papel |
|-------|-------|
| Cardholder | Titular do cartão |
| Merchant | Vende; recebe o dinheiro |
| Acquirer | Banco do merchant |
| Issuer | Banco do titular; aprova ou recusa |
| Scheme | Visa / Mastercard: regras e rede |
| PSP | Stripe, Adyen, RocketGate: liga o merchant ao acquirer |

```js
transition(p0, "captured", 8 * DAY)   // throws: expired → captured
```
→ `04-Pagamentos.js` §3 (máquina de estados com guarda de expiração)

- **Numa entrevista:** "Modelo o pagamento como máquina de estados com transições permitidas. Uma captura tardia é uma transição ilegal, não um if solto."

---

## §4 Idempotência

- **O que é:** repetir o mesmo pedido produz o mesmo efeito uma vez só.
- **Porquê:** redes falham; o cliente repete. Sem isto, cobras duas vezes.
- **Armadilha:** verificar "já existe?" e depois inserir — duas requests passam a verificação ao mesmo tempo.

| Peça | Como |
|------|------|
| Chave | Gerada pelo cliente (UUID v4). Stripe: header `Idempotency-Key`, até 255 chars |
| Hash do pedido | Mesma chave + corpo diferente → erro (Stripe compara os parâmetros) |
| Resposta guardada | Retry devolve o **mesmo** status + body (Stripe v1 guarda até 500s) |
| Lock | `INSERT ... UNIQUE(key)` **antes** de executar. A BD resolve a corrida |
| Concorrente | O segundo pedido recebe 409 "em curso"; o cliente repete mais tarde |
| TTL | Stripe v1 pode apagar chaves com ≥ 24 h |

```sql
INSERT INTO idempotency_keys (key, request_hash, state)
VALUES ($1, $2, 'in_progress')
ON CONFLICT (key) DO NOTHING;      -- 0 linhas = já existe → replay ou 409
```

- **Atómico:** grava o efeito (ledger) e a resposta na mesma transacção da BD.
- **Idempotência natural:** `UNIQUE(provider_event_id)` em webhooks; `UNIQUE(order_id)` em cobranças.

→ `04-Pagamentos.js` §4 (dois pedidos concorrentes → 1 cobrança, 201 + 409; corpo diferente → 422)

- **Numa entrevista:** "Chave de idempotência com unique constraint, reservada antes do efeito, com hash do pedido e resposta guardada para replay."

---

## §5 Retries

- **O que é:** repetir só o que pode ter falhado de forma transitória.
- **Porquê:** retries mal feitos derrubam o serviço que está a recuperar e duplicam cobranças.
- **Armadilha:** timeout ≠ falha. O PSP pode ter cobrado e a resposta perdeu-se.

| Repetir | Não repetir |
|---------|-------------|
| Timeout, `ECONNRESET` | 4xx de validação |
| 5xx, 429 (respeita `Retry-After`) | Recusa do emissor (`card_declined`) |
| — | Suspeita de fraude, cartão roubado |

- **Backoff exponencial + jitter:** `espera = random(0, min(cap, base·2^n))`. Sem jitter, todos os clientes repetem juntos.
- **Orçamento de retries:** token bucket por cliente; sem tokens, não repete. AWS: 3 tentativas × 5 camadas = **243×** carga na BD.
- **Repete numa camada só.** Retries aninhados multiplicam-se.
- **Resultado desconhecido:** antes de repetir, consulta o estado no PSP com a **mesma** chave. Se não der, marca `unknown` e deixa a reconciliação decidir.

```js
backoff(3, () => 0.5)      // 400 ms
isRetryable({ status: 402, code: "card_declined" })   // false
// timeout depois de cobrar → psp.find(key) antes do retry → 1 cobrança
```
→ `04-Pagamentos.js` §5

- **Numa entrevista:** "Só repito erros transitórios, com backoff e jitter, numa camada, com orçamento. Um timeout é resultado desconhecido: consulto antes de repetir."

---

## §6 Concorrência

- **O que é:** dois pedidos mexem no mesmo saldo ao mesmo tempo.
- **Porquê:** é assim que nasce o double-spend: dois levantamentos de 30 € sobre 50 € passam os dois.
- **Armadilha:** ler → validar no código → escrever. Entre a leitura e a escrita, o mundo mudou.

| Técnica | Quando |
|---------|--------|
| `UPDATE ... SET balance = balance - $x WHERE balance >= $x` | Caso simples: atómico numa linha |
| Optimistic lock (`version`) | Pouca contenção; relê e repete se 0 linhas |
| `SELECT ... FOR UPDATE` | Muita contenção numa conta; ordena locks por id para evitar deadlock |
| `SERIALIZABLE` | Invariantes entre várias linhas; prepara retry em erro de serialização |
| Unique constraint | "Só um pode ganhar": idempotência, um reembolso por pagamento |

```sql
-- optimistic
UPDATE accounts SET balance = $new, version = version + 1
WHERE id = $id AND version = $read_version;   -- 0 linhas → conflito, relê

-- pessimistic
BEGIN;
SELECT balance FROM accounts WHERE id = $id FOR UPDATE;
-- valida e insere as entradas no ledger
COMMIT;
```

- **Particionar:** um escritor por conta (fila/partição por `account_id`) elimina a corrida em vez de a gerir. **[inferido]** É um padrão comum em ledgers de alto volume.
- **Go:** `sync.Mutex` protege memória de um processo, não a BD de várias réplicas.

→ `04-Pagamentos.js` §6 (lost update reproduzido e corrigido com `version`)

- **Numa entrevista:** "A BD é o árbitro: update condicional, version ou FOR UPDATE. Nunca valido saldo no código entre um read e um write."

---

## §7 Consistência entre sistemas

- **O que é:** manter ledger, PSP, fila e e-mails coerentes sem transacção distribuída.
- **Porquê:** "gravei na BD mas o evento não saiu" (ou o contrário) é o bug clássico.
- **Armadilha:** `db.commit(); kafka.publish()` — se o processo morre no meio, o evento perde-se.

| Padrão | Ideia |
|--------|-------|
| Outbox | Grava o evento numa tabela `outbox` na **mesma** transacção; um relay publica depois |
| At-least-once | O evento pode chegar 2×. Logo o consumidor tem de ser idempotente |
| Consumidor idempotente | `UNIQUE(event_id)` numa tabela `processed_events`, na transacção do efeito |
| Kafka | Ordem só dentro de uma partição. Chave = `account_id` → eventos da conta em ordem |
| Saga | Passos locais + **compensações** (reembolsar, libertar cativo), não rollback |
| Webhooks | Verifica a assinatura HMAC; dedupe por id; responde 2xx rápido e processa em fila |

- **Webhooks fora de ordem:** `refunded` pode chegar antes de `succeeded`. Usa máquina de estados (§3) e ignora transições para trás; ou relê o objeto na API.
- **Exactly-once** na prática = at-least-once + idempotência.

- **Numa entrevista:** "Outbox para publicar, consumidores idempotentes para receber, sagas com compensações entre serviços. Exactly-once é at-least-once mais dedupe."

---

## §8 Reconciliação & settlement

- **O que é:** comparar o teu ledger com os relatórios do PSP e o extracto do banco.
- **Porquê:** é a rede de segurança. Apanha o que idempotência e retries não apanharam.
- **Armadilha:** reconciliar por valor total do dia. Reconcilia linha a linha por referência.

| Passo | Detalhe |
|-------|---------|
| Match | Por id externo (charge id, end-to-end id), depois valor + moeda + data |
| Diferenças | Falta no PSP, falta em nós, valor diferente, duplicado |
| Taxas | Settlement chega **líquido** de comissões: lança a taxa no ledger |
| Timing | T+1 / T+2: o dinheiro chega dias depois da captura |
| Excepções | Fila para humanos; nunca "ajustar" o saldo à mão sem lançamento |

- **FX:** guarda a taxa usada, a fonte, o timestamp e o valor nas duas moedas. Nunca recalcules depois.
- **Fallback de taxa:** fonte secundária com idade máxima; se as duas falharem, recusa em vez de inventar.
- **Arredondamento FX:** converte em unidade menor com half-even (§1) e regista o resultado.

- **Numa entrevista:** "Reconciliação diária linha a linha por referência externa. No FX guardo taxa, fonte e hora — o valor tem de ser reproduzível."

---

## §9 Rails e glossário curto

| Termo | Uma linha |
|-------|-----------|
| SEPA SCT | Transferência a crédito em euros; liquidação no dia útil seguinte |
| SEPA SCT Inst | Instantânea, 24/7, ≤ 10 s; IPR (UE) 2024/886 obriga PSPs da zona euro desde 9 out 2025 |
| SEPA SDD | Débito directo; precisa de mandato; o devedor pode contestar |
| SWIFT | Rede de mensagens entre bancos (internacional); não move dinheiro sozinha |
| ISO 20022 | Norma de mensagens XML. `pain` cliente↔banco, `pacs` banco↔banco, `camt` extractos |
| Exemplos | `pain.001` ordem, `pacs.008` transferência, `pacs.002` estado, `camt.053` extracto |
| Card schemes | Visa, Mastercard, Amex: regras, rede, taxas de interchange |
| IBAN / BIC | Identificador da conta / do banco |
| KYC / AML | Conhecer o cliente / combater branqueamento (screening, monitorização) |
| PCI DSS | Norma para dados de cartão. **Nunca** guardes PAN completo nem CVV |
| Tokenização | O PSP guarda o cartão; tu guardas um token (`pm_...`) |

- **[inferido]** Os exemplos ISO 20022 acima são de memória; a página oficial (iso20022.org) devolveu 403.

- **Numa entrevista:** "Cartões são autorização + liquidação diferida; SEPA Inst é push e final em segundos. Não guardo PAN nem CVV — tokenizo no PSP."

---

## §10 Thought Machine / Vault em 10 linhas

1. **Vault Core** é a plataforma de core banking: ledger + produtos. **Vault Payments** é outro produto (processamento de pagamentos).
2. **Ledger em tempo real**, "single source of truth", com fundos em qualquer **asset e denominação** (moedas, cripto, pontos).
3. **Sem batch** segundo a brochura 2023; o whitepaper 2025 já mede postings "offline" de baixa prioridade.
4. **Produtos = smart contracts** em Python (subconjunto, sandbox), no "Universal Product Engine". O banco altera sem mexer no código da plataforma.
5. **Contratos versionados e imutáveis**; cada conta fica presa à versão com que foi aberta. **Supervisor contracts** orquestram vários contratos.
6. **Postings API** síncrona (alvo < 100 ms) move fundos; contratos também geram postings (ex.: juro diário).
7. **Stack:** microserviços, Kubernetes, Istio, **Kafka**; streaming de dados em tempo real; cloud-agnostic.
8. **Escala medida:** 4 769 TPS online (p95 < 500 ms), 15 035 TPS de consulta de saldo, 30 M contas.
9. **[inferido — docs atrás de login]** Postings agrupam-se num *Posting Instruction Batch*; tipos como authorisation, settlement, release, transfer, hard settlement, custom.
10. **[inferido — docs atrás de login]** Saldo indexado por conta + endereço + asset + denominação + fase (`committed`, `pending_in`, `pending_out`). O meu mini-ledger (§2) imita isto.

- **Numa entrevista:** "Vault é um ledger em tempo real onde o produto é código versionado. A minha parte seria garantir que cada posting é atómico, idempotente e equilibrado."

---

## §11 Ponte para a tua experiência

> ⚠️ A coluna "Frase-modelo" é um exemplo de como nomear o conceito. Confirma no código o que fizeste mesmo antes de a dizer.

| O que fizeste | Conceito que demonstra | Frase-modelo |
|---------------|------------------------|-------|
| Notificações de falha de rebill (RocketGate, Paynova) | Recusas vs erros transitórios; webhooks; MIT recorrente | "Distingo recusa do emissor de falha técnica — só a segunda se repete." |
| Preços e descontos de Top Up | Dinheiro em unidade menor; arredondamento; alocação | "Descontos em inteiros, arredondados uma vez, com regra explícita." |
| Fallback de taxa FX | Proveniência da taxa; idade máxima; reprodutibilidade | "Guardo a taxa usada e a fonte, para o valor ser auditável." |
| Cancelamento + reembolso (Duffel) | Refund como compensação de uma saga | "O reembolso é um passo de compensação, não um rollback." |
| Guarda de autorização tardia | Ciclo de vida da autorização; máquina de estados | "Captura depois de expirar é uma transição ilegal." |
| Retries aninhados | Retry storm; orçamento; repetir numa camada só | "Retries aninhados multiplicam carga; centralizei-os numa camada." |
| Hotfix "cobrado N, entregue N" | Idempotência + atomicidade entre cobrança e entrega | "Cobrança e entrega ligadas por uma chave; um retry não duplica nenhuma." |

- **Regra:** conta o caso real com as tuas palavras; usa a coluna "Conceito" para nomear o padrão.
- **Go vs TypeScript:** os conceitos são iguais. Diz "em Go faria o mesmo com `database/sql` e uma transacção".

---

## §12 Perguntas prováveis + resposta curta

| Pergunta | Resposta curta |
|----------|----------------|
| Como evitas cobrar duas vezes? | Chave de idempotência com `UNIQUE`, reservada antes da cobrança, reenviada ao PSP, resposta guardada para replay. |
| O PSP deu timeout. Repetes? | Não às cegas. Consulto pelo id/chave; se não souber, marco `unknown` e a reconciliação decide. |
| Dois levantamentos ao mesmo tempo? | Update condicional ou `version`; com contenção alta, `FOR UPDATE` ou um escritor por conta. |
| Como guardas dinheiro? | Inteiro na unidade menor + moeda; expoente ISO 4217; half-even; alocação do resto. |
| Como corriges uma transacção errada? | Reversão: nova transacção oposta com referência. O ledger é append-only. |
| Como garantes que um evento sai após gravar? | Outbox na mesma transacção + relay; consumidores idempotentes. |
| Como manténs ordem por conta no Kafka? | Chave de partição = `account_id`; consumidor processa a partição em série. |
| Que erros repetes? | Timeouts, 5xx, 429 — com backoff, jitter e orçamento. Nunca recusas nem 4xx. |
| Webhook chegou duplicado / fora de ordem? | Verifico assinatura, dedupe por event id, máquina de estados ignora regressões. |
| Saldo disponível vs saldo? | Disponível = liquidado − cativos de saída. Entradas pendentes não contam. |

---

## Fontes

- Stripe — Idempotent requests: https://docs.stripe.com/api/idempotent_requests
- Stripe — PaymentIntent lifecycle: https://docs.stripe.com/payments/paymentintents/lifecycle
- Stripe — Place a hold (auth/capture, validade): https://docs.stripe.com/payments/place-a-hold-on-a-payment-method
- AWS Builders' Library — Timeouts, retries and backoff with jitter: https://builder.aws.com/content/3EumjoZascWd1oZiEgL8ORlv3qE/timeouts-retries-and-backoff-with-jitter
- Thought Machine — Vault Core (current accounts): https://www.thoughtmachine.net/vault-core/current-and-transaction-accounts
- Thought Machine — Vault Pre-NDA brochure 2023 (PDF): https://info.thoughtmachine.net/hubfs/Vault_Pre_NDA_RGB_2023.pdf
- Thought Machine — Performance whitepaper: https://www.thoughtmachine.net/whitepapers/performance-proven-the-right-way
- Thoughtworks Radar — Thought Machine Vault: https://www.thoughtworks.com/radar/platforms/thought-machine-vault
- FF News — "We built this bank on smart contracts": https://ffnews.com/thought-leadership/we-built-this-bank-on-smart-contracts
- SEPA Inst 2025 (secundária; EPC deu 403): https://www.aciworldwide.com/blog/sepa-instant-payments-whats-new-in-rulebook-2025-and-why-it-matters
- **Não acessível:** docs oficiais Vault (`docs.thoughtmachine.net` → login). Itens 9–10 do §10 são **[inferido]**.
