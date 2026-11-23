// PAGAMENTOS / CORE BANKING — exemplos executáveis para 04-Payments.md
// Correr: node 04-Payments.js   → termina com "✅ Payments OK"
// Cada "// result ==>" é verificado por: node check-results.js 04-Payments.js

const assert = require("node:assert/strict");
const crypto = require("node:crypto");

// =====================================================================================
// §1 ── DINHEIRO NO CÓDIGO ──
// =====================================================================================

//--------------------------------------------------------------------
// float vs cêntimos — porque o dinheiro nunca é float
// Para que serve: somar €0,10 + €0,20 e obter exatamente €0,30.
// Regra essencial: 0.1 não cabe exatamente num float; em cêntimos inteiros a conta é exata.
// O que guarda: nada; compara as duas formas de somar o mesmo dinheiro.

0.1 + 0.2; // result ==> 0.30000000000000004
0.1 + 0.2 === 0.3; // result ==> false
10n + 20n === 30n; // result ==> true

// Antes → operação → depois
//   forma       operação     depois
//   float       0.1 + 0.2    0.30000000000000004  (errado por um bocadinho)
//   cêntimos    10n + 20n    30n = €0,30 exatos

// Confusão possível: toFixed(2) vs guardar inteiros — toFixed só arruma o ecrã; o valor guardado continua errado e o erro acumula.
// Para recordar: dinheiro = inteiro na unidade mínima (cêntimos).
// Pergunta: quanto dá 0.1 * 3 === 0.3?
// Resposta: false. 0.1 * 3 dá 0.30000000000000004; em cêntimos, 10n * 3n === 30n dá true.

//--------------------------------------------------------------------
// toMinor() — texto "12.34" → inteiro na unidade mínima
// Para que serve: o cliente escreve "12.34" € e o sistema guarda 1234 cêntimos.
// Regra essencial: as casas decimais vêm da moeda (ISO 4217). Ler do texto, nunca de um float.
// O que guarda: EXPONENT — chave = código da moeda; valor = número de casas decimais.
//               minor = o valor em unidades mínimas, como BigInt.

const EXPONENT = { JPY: 0, EUR: 2, USD: 2, BHD: 3 };

function toMinor(str, currency) {
  const exp = EXPONENT[currency];
  if (exp === undefined) throw new Error(`moeda desconhecida ${currency}`);
  if (!/^-?\d+(\.\d+)?$/.test(str)) throw new Error(`valor inválido ${str}`);
  const [int, frac = ""] = str.replace("-", "").split(".");
  if (frac.length > exp) throw new Error(`${currency} só tem ${exp} casas decimais`);
  const minor = BigInt(int + frac.padEnd(exp, "0")); // "12" + "34" → 1234n
  return str.startsWith("-") ? -minor : minor;
}

// Antes → operação → depois
//   texto     moeda   casas   depois
//   "12.34"   EUR     2       1234n
//   "500"     JPY     0       500n
//   "1.234"   BHD     3       1234n
toMinor("12.34", "EUR"); // result ==> 1234n
toMinor("500", "JPY"); // result ==> 500n
toMinor("1.234", "BHD"); // result ==> 1234n
assert.throws(() => toMinor("1.234", "EUR")); // note: lança erro — EUR só tem 2 casas

// Confusão possível: 1234n em EUR vs 1234n em BHD — o mesmo inteiro vale €12,34 ou 1,234 BHD. Sem moeda, não é dinheiro.
// Para recordar: nunca assumir 2 casas; perguntar à moeda.
// Pergunta: quanto dá toMinor("7.5", "EUR")?
// Resposta: 750n. A parte "5" é completada para "50" (2 casas), e "7" + "50" = 750.

//--------------------------------------------------------------------
// fromMinor() — inteiro → texto para mostrar ao cliente
// Para que serve: mostrar 5 cêntimos como "0.05" num recibo.
// Regra essencial: só se converte para texto na saída; as contas fazem-se sempre em inteiros.
// O que guarda: s = os dígitos com zeros à esquerda; out = os dígitos com o ponto no sítio certo.

function fromMinor(minor, currency) {
  const exp = EXPONENT[currency];
  const neg = minor < 0n;
  const s = (neg ? -minor : minor).toString().padStart(exp + 1, "0"); // 5n → "005"
  const out = exp === 0 ? s : `${s.slice(0, -exp)}.${s.slice(-exp)}`; // "0" + "." + "05"
  return (neg ? "-" : "") + out;
}

// Antes → operação → depois
//   minor     moeda   s        depois
//   5n        EUR     "005"    "0.05"
//   -1234n    BHD     "1234"   "-1.234"
fromMinor(5n, "EUR"); // result ==> "0.05"
fromMinor(-1234n, "BHD"); // result ==> "-1.234"

// Confusão possível: guardar "0.05" vs guardar 5n — o texto é só para ler; guardar texto obriga a converter em cada conta.
// Para recordar: inteiro dentro, texto só à saída.
// Pergunta: quanto dá fromMinor(500n, "JPY")?
// Resposta: "500". JPY tem 0 casas, por isso não há ponto.

//--------------------------------------------------------------------
// divHalfEven() — dividir e arredondar o empate para o par (arredondamento bancário)
// Para que serve: arredondar juros de 2,5 cêntimos sem favorecer sempre o banco ou sempre o cliente.
// Regra essencial: só o empate exato (x,5) vai para o número par; o resto arredonda normalmente.
// O que guarda: q = quociente inteiro; r = resto; twice = 2 × |resto|, para comparar com b sem frações.

function divHalfEven(a, b) {
  // a, b BigInt, b > 0
  let q = a / b; // BigInt corta as decimais (em direção a zero)
  const r = a % b;
  const twice = 2n * (r < 0n ? -r : r);
  if (twice > b || (twice === b && q % 2n !== 0n)) q += a < 0n ? -1n : 1n;
  return q;
}

// Antes → operação → depois
//   a / b       valor   q    empate?   depois
//   25n / 10n   2,5     2    sim       2n  (2 já é par)
//   35n / 10n   3,5     3    sim       4n  (sobe para o par)
//   26n / 10n   2,6     2    não       3n  (passa de metade)
divHalfEven(25n, 10n); // result ==> 2n
divHalfEven(35n, 10n); // result ==> 4n
divHalfEven(26n, 10n); // result ==> 3n
divHalfEven(-25n, 10n); // result ==> -2n

// Confusão possível: half-up vs half-even — half-up sobe sempre os empates, e em milhões de arredondamentos o erro acumula para cima; half-even equilibra.
// Para recordar: empate vai para o par; arredondar uma vez, no fim.
// Pergunta: quanto dá divHalfEven(45n, 10n)?
// Resposta: 4n. 4,5 é empate e 4 já é par.

//--------------------------------------------------------------------
// pontos base (basis points) — taxas como inteiros
// Para que serve: cobrar uma comissão de 1,5% sobre €1234,56 sem usar floats.
// Regra essencial: 1 bp = 0,01%, logo 150 bp = 1,5%. Multiplicar primeiro, dividir por 10 000 no fim.
// O que guarda: bruto = cêntimos × bp (ainda sem dividir); fee = comissão em cêntimos, já arredondada.

const bruto = 123456n * 150n; // result ==> 18518400n
const fee = divHalfEven(bruto, 10000n); // result ==> 1852n

// Antes → operação → depois
//   passo                 valor
//   123456n × 150n        18518400n
//   ÷ 10000               1851,84 cêntimos
//   half-even             1852n = €18,52

// Confusão possível: 150 bp vs 150% — bp é centésimo de ponto percentual; 150 bp é só 1,5%.
// Para recordar: multiplicar primeiro, dividir uma vez, arredondar uma vez.
// Pergunta: quanto é a comissão de 100 bp sobre €10,00 (1000n)?
// Resposta: 10n (€0,10). 1000 × 100 / 10000 = 10, sem resto.

//--------------------------------------------------------------------
// allocate() — dividir sem perder um cêntimo
// Para que serve: dividir uma conta de €10,00 por 3 pessoas.
// Regra essencial: a soma das partes TEM de dar o total. O que sobra vai, cêntimo a cêntimo, para o maior resto.
// O que guarda: parts = a parte inteira de cada pessoa; rems = o resto de cada uma; left = cêntimos ainda por dar.

function allocate(total, ratios) {
  const sum = ratios.reduce((a, b) => a + b, 0n);
  const parts = ratios.map((r) => (total * r) / sum);
  const rems = ratios.map((r, i) => ({ i, rem: (total * r) % sum }));
  let left = total - parts.reduce((a, b) => a + b, 0n);
  rems.sort((x, y) => (y.rem > x.rem ? 1 : y.rem < x.rem ? -1 : x.i - y.i)); // maior resto primeiro; empate → ordem original
  for (let k = 0; left > 0n; k++, left--) parts[rems[k].i] += 1n;
  return parts;
}

// Antes → operação → depois (1000n por [1, 1, 1])
//   passo              parts               left
//   divisão inteira    [333, 333, 333]     1
//   +1 ao maior resto  [334, 333, 333]     0
const split = allocate(1000n, [1n, 1n, 1n]); // result ==> [334n, 333n, 333n]
split.reduce((a, b) => a + b, 0n); // result ==> 1000n  (nenhum cêntimo perdido)
allocate(100n, [70n, 30n]); // result ==> [70n, 30n]

// Confusão possível: arredondar cada parte vs allocate — 1000/3 arredondado dá 333 × 3 = 999; perde-se 1 cêntimo.
// Para recordar: a soma das partes é sempre o total.
// Pergunta: quanto dá allocate(500n, [1n, 1n, 1n])?
// Resposta: [167n, 167n, 166n]. 166 × 3 = 498; sobram 2 cêntimos para os dois primeiros (restos iguais → ordem original).

// =====================================================================================
// §2 ── LEDGER DE DUPLA ENTRADA ── (mini-ledger ao estilo Vault: fases pending/committed)
// =====================================================================================

//--------------------------------------------------------------------
// Ledger — o livro onde cada movimento soma zero
// Para que serve: registar cada euro que entra ou sai, sem nunca apagar nada.
// Regra essencial: cada transação tem ≥ 2 lançamentos que somam 0; o saldo é a SOMA dos lançamentos, não uma coluna editada.
// O que guarda: #entries = lista só de acrescentar (append-only) de { txId, phase, account, amount };
//               #txIds = ids já usados (impede a mesma transação duas vezes);
//               #internal = contas internas do banco, que podem ficar negativas.
//               amount: + entra na conta, − sai da conta. phase: "committed" (liquidado) ou "pending" (retido).

class Ledger {
  #entries = []; // append-only: nunca se edita nem apaga
  #txIds = new Set();
  #internal = new Set();

  openInternal(acc) { this.#internal.add(acc); }

  #post(txId, phase, legs) {
    if (this.#txIds.has(txId)) throw new Error(`tx duplicada ${txId}`);
    if (legs.length < 2) throw new Error("precisa de ≥ 2 lançamentos");
    const sum = legs.reduce((s, l) => s + l.amount, 0n);
    if (sum !== 0n) throw new Error(`tx ${txId} não soma zero (${sum})`);
    this.#txIds.add(txId);
    for (const l of legs) this.#entries.push(Object.freeze({ txId, phase, ...l }));
  }

  balance(acc, phase = "committed") {
    return this.#entries
      .filter((e) => e.account === acc && e.phase === phase)
      .reduce((s, e) => s + e.amount, 0n);
  }

  // Disponível = liquidado − retenções a SAIR. Uma retenção a entrar não conta.
  // Soma por retenção (hold): uma retenção libertada soma 0 e deixa de contar.
  available(acc) {
    const porHold = new Map(); // chave = id da autorização; valor = soma pendente dessa autorização nesta conta
    for (const e of this.#entries)
      if (e.account === acc && e.phase === "pending") porHold.set(e.hold, (porHold.get(e.hold) ?? 0n) + e.amount);
    let retido = 0n;
    for (const v of porHold.values()) if (v < 0n) retido += v;
    return this.balance(acc) + retido;
  }

  #checkFunds(acc, amount) {
    if (!this.#internal.has(acc) && this.available(acc) < amount) throw new Error(`saldo insuficiente em ${acc}`);
  }

  transfer(txId, from, to, amount) {
    this.#checkFunds(from, amount);
    this.#post(txId, "committed", [{ account: from, amount: -amount }, { account: to, amount }]);
  }

  // Autorização = retenção. Só mexe na fase pending.
  authorise(txId, from, to, amount) {
    this.#checkFunds(from, amount);
    this.#post(txId, "pending", [{ account: from, amount: -amount, hold: txId }, { account: to, amount, hold: txId }]);
  }

  // Liquidação: liberta a retenção e lança o valor final (pode ser < autorizado).
  settle(txId, authTxId, finalAmount) {
    const auth = this.#entries.filter((e) => e.txId === authTxId);
    const [from, to] = [auth.find((e) => e.amount < 0n), auth.find((e) => e.amount > 0n)];
    if (finalAmount > to.amount) throw new Error("liquidação acima do autorizado");
    this.#post(`${txId}:release`, "pending", auth.map((e) => ({ account: e.account, amount: -e.amount, hold: authTxId })));
    this.#post(txId, "committed", [{ account: from.account, amount: -finalAmount }, { account: to.account, amount: finalAmount }]);
  }

  // Corrigir = nova transação, ao contrário, com referência à original. Nunca editar a original.
  reverse(txId, originalTxId) {
    const orig = this.#entries.filter((e) => e.txId === originalTxId && e.phase === "committed");
    if (orig.length === 0) throw new Error("nada para estornar");
    this.#post(txId, "committed", orig.map((e) => ({ account: e.account, amount: -e.amount, reverses: originalTxId })));
  }

  // Invariante global: a soma de TODOS os lançamentos, por fase, é zero.
  assertInvariants() {
    for (const phase of ["pending", "committed"]) {
      const total = this.#entries.filter((e) => e.phase === phase).reduce((s, e) => s + e.amount, 0n);
      assert.equal(total, 0n, `ledger desequilibrado na fase ${phase}`);
    }
  }
}

// Antes → operação → depois (o que cada método escreve)
//   método        fase                   lançamentos
//   transfer      committed              from −X, to +X
//   authorise     pending                from −X, to +X (só retém)
//   settle        pending + committed    liberta a retenção (+X, −X) e lança o valor final
//   reverse       committed              o oposto de cada lançamento da original

// Confusão possível: débito/crédito vs o sinal deste código — aqui + é "entra nesta conta". Em contabilidade, um depósito
//   DEBITA a caixa do banco (ativo sobe) e CREDITA a conta do cliente (passivo do banco sobe). Os sinais mudam; a soma zero não.
// Para recordar: cada transação soma 0; o saldo é derivado; corrigir = estornar.
// Pergunta: que acontece se uma transação tiver os lançamentos −3000n e +2000n?
// Resposta: #post lança erro "não soma zero (-1000)". Nada é gravado: a verificação vem antes do push.

//--------------------------------------------------------------------
// transfer() — mover dinheiro já
// Para que serve: depositar €100 na conta da Alice.
// Regra essencial: uma conta desce e outra sobe o mesmo valor; o mesmo txId não entra duas vezes.
// O que guarda: L = um ledger; "bank:cash" = conta interna do banco (pode ficar negativa); "alice" = cliente.

const L = new Ledger();
L.openInternal("bank:cash");
L.transfer("dep-1", "bank:cash", "alice", 10000n); // depósito de €100,00

// Antes → operação → depois
//   conta        antes   transfer("dep-1", 10000n)   depois
//   bank:cash    0       −10000                      −10000n
//   alice        0       +10000                      10000n
//   soma         0                                   0
L.balance("alice"); // result ==> 10000n
L.balance("bank:cash"); // result ==> -10000n
assert.throws(() => L.transfer("dep-1", "bank:cash", "alice", 1n), /duplicada/); // note: lança erro — mesmo txId duas vezes

// Confusão possível: txId vs idempotency key — o txId impede a mesma transação no ledger; a chave (§4) impede o mesmo pedido HTTP de correr duas vezes.
// Para recordar: transferir = −X de um lado, +X do outro.
// Pergunta: depois de L.transfer("dep-2", "bank:cash", "alice", 500n), quanto dá L.balance("alice")?
// Resposta: 10500n. 10000 + 500; é um txId novo, por isso é aceite.

//--------------------------------------------------------------------
// authorise() — reter sem mover
// Para que serve: a Alice paga €30 com cartão; o dinheiro fica preso, mas ainda não saiu.
// Regra essencial: a retenção só mexe na fase pending. O saldo liquidado não muda; o disponível desce.
// O que guarda: os lançamentos pending levam hold = "auth-1", para saber a que retenção pertencem.

L.authorise("auth-1", "alice", "merchant", 3000n);

// Antes → operação → depois
//   conta / saldo             antes    authorise €30   depois
//   alice  liquidado          10000    —               10000n
//   alice  pending            0        −3000           −3000n
//   alice  disponível         10000    −3000           7000n
//   merchant disponível       0        (+3000 a entrar não conta)   0n
L.balance("alice"); // result ==> 10000n  (o liquidado continua €100)
L.balance("alice", "pending"); // result ==> -3000n
L.available("alice"); // result ==> 7000n  (pode gastar €70)
L.available("merchant"); // result ==> 0n  (uma retenção a entrar não é dinheiro disponível)
assert.throws(() => L.authorise("auth-2", "alice", "merchant", 8000n), /insuficiente/); // note: lança erro — 8000 > 7000 disponíveis

// Confusão possível: saldo vs saldo disponível — saldo = liquidado; disponível = liquidado − retenções a sair.
// Para recordar: retido ≠ liquidado.
// Pergunta: a Alice tenta reter mais €70 (7000n). Passa?
// Resposta: sim. available = 7000n e 7000 < 7000 é falso, por isso não há erro. Ficaria com 0n disponível.

//--------------------------------------------------------------------
// settle() — libertar a retenção e mover o valor final
// Para que serve: a loja só tinha 1 de 2 artigos e captura €25 dos €30 retidos.
// Regra essencial: a liquidação liberta a retenção inteira e lança o valor final; pode ser menos, nunca mais.
// O que guarda: auth = os lançamentos da autorização; from/to = quem paga e quem recebe; finalAmount = o valor capturado.

L.settle("set-1", "auth-1", 2500n);

// Antes → operação → depois
//   alice              antes    settle €25                 depois
//   liquidado          10000    −2500                      7500n
//   pending            −3000    +3000 (liberta)            0n
//   disponível         7000     (os €5 voltam)             7500n
L.balance("alice"); // result ==> 7500n
L.balance("alice", "pending"); // result ==> 0n
L.available("alice"); // result ==> 7500n

// Confusão possível: captura parcial vs reembolso parcial — na captura parcial os €5 nunca saíram (a retenção é libertada); um reembolso devolve dinheiro que já saiu.
// Para recordar: liquidar = libertar a retenção + mover o valor final.
// Pergunta: e se a loja tentasse liquidar €35 (3500n)?
// Resposta: erro "liquidação acima do autorizado". 3500 > 3000 retidos.

//--------------------------------------------------------------------
// reverse() — corrigir com o lançamento oposto
// Para que serve: reembolsar os €25 à Alice.
// Regra essencial: nunca se edita a transação original; acrescenta-se outra, ao contrário, com referência (reverses).
// O que guarda: orig = os lançamentos committed da transação original; o estorno grava o simétrico de cada um.

L.reverse("ref-1", "set-1");

// Antes → operação → depois
//   conta       antes    reverse("set-1")   depois
//   alice       7500     +2500              10000n
//   merchant    2500     −2500              0n
L.balance("alice"); // result ==> 10000n
L.balance("merchant"); // result ==> 0n
L.assertInvariants(); // note: lança erro se alguma fase não somar 0

// Confusão possível: estorno vs UPDATE — um UPDATE apaga a história; o estorno mantém o erro e a correção, e a auditoria vê os dois.
// Para recordar: o ledger só cresce; corrigir = estornar.
// Pergunta: quantos lançamentos tem o ledger agora, contando dep-1, auth-1, set-1:release, set-1 e ref-1?
// Resposta: 10. Cada uma das 5 transações tem 2 lançamentos; nada foi apagado.

// =====================================================================================
// §3 ── CICLO DE VIDA DE UM PAGAMENTO COM CARTÃO ── (máquina de estados)
// =====================================================================================

//--------------------------------------------------------------------
// transition() — só deixar fazer os passos permitidos
// Para que serve: impedir a loja de capturar uma autorização que já expirou.
// Regra essencial: um passo só é válido se estiver na tabela. Uma autorização expirada conta como "expired".
// O que guarda: TRANSITIONS — chave = estado atual; valor = estados para onde pode ir.
//               payment = { status, authExpiresAt }; now = instante do pedido (ms).

const TRANSITIONS = {
  authorised: ["captured", "voided", "expired"],
  captured: ["settled", "refunded", "partially_refunded"],
  settled: ["refunded", "partially_refunded", "disputed"],
  partially_refunded: ["refunded", "partially_refunded", "disputed"],
  disputed: ["chargeback_lost", "chargeback_won"],
};

function transition(payment, to, now = Date.now()) {
  // Guarda de autorização tardia: depois de expirar, o estado efetivo é "expired".
  const from = payment.status === "authorised" && now > payment.authExpiresAt ? "expired" : payment.status;
  if (!(TRANSITIONS[from] ?? []).includes(to)) throw new Error(`transição ilegal ${from} → ${to}`);
  return { ...payment, status: to };
}

const DAY = 86_400_000;
const p0 = { status: "authorised", authExpiresAt: 7 * DAY }; // validade de 7 dias

// Antes → operação → depois
//   estado        pedido       quando    estado efetivo   depois
//   authorised    captured     dia 1     authorised       captured
//   authorised    captured     dia 8     expired          erro
//   authorised    refunded     dia 1     authorised       erro (sem captura → void, não refund)
transition(p0, "captured", 1 * DAY).status; // result ==> "captured"
assert.throws(() => transition(p0, "captured", 8 * DAY), /expired → captured/); // note: lança erro — a retenção expirou
assert.throws(() => transition(p0, "refunded", 1 * DAY), /authorised → refunded/); // note: lança erro — nada foi capturado

// Confusão possível: void vs refund — void cancela uma retenção antes da captura (o dinheiro nunca saiu); refund devolve dinheiro capturado.
// Para recordar: uma captura tardia é uma transição ilegal na tabela, não um if solto.
// Pergunta: ao dia 8, transition(p0, "voided", 8 * DAY) funciona?
// Resposta: não. O estado efetivo é "expired", que não tem saídas: a retenção já foi libertada sozinha.

// =====================================================================================
// §4 ── IDEMPOTÊNCIA ── (chave + hash do pedido + resposta guardada)
// =====================================================================================

//--------------------------------------------------------------------
// IdempotencyStore — mesma chave, um só efeito
// Para que serve: um duplo clique em "Pagar €10" envia dois pedidos com a mesma chave; só se cobra uma vez.
// Regra essencial: a chave é RESERVADA antes de cobrar. O segundo pedido vê "em curso" e recebe 409.
// O que guarda: #rows é um Map; chave = idempotency key; valor = { hash do corpo, state, response }.
//               charges = quantas cobranças aconteceram de facto.

class IdempotencyStore {
  #rows = new Map(); // em produção: uma tabela com UNIQUE(key)

  async run(key, body, handler) {
    const hash = crypto.createHash("sha256").update(JSON.stringify(body)).digest("hex");
    const row = this.#rows.get(key);
    if (row) {
      if (row.hash !== hash) return { status: 422, body: "mesma chave, pedido diferente" };
      if (row.state === "in_progress") return { status: 409, body: "pedido em curso, tenta mais tarde" };
      return row.response; // repetição: a MESMA resposta, sem correr outra vez
    }
    this.#rows.set(key, { hash, state: "in_progress" }); // reservar ANTES do primeiro await = INSERT ... UNIQUE
    try {
      const response = { status: 201, body: await handler() };
      this.#rows.set(key, { hash, state: "done", response });
      return response;
    } catch (err) {
      this.#rows.delete(key); // shortcut: só é seguro se a falha veio antes de qualquer efeito
      throw err;
    }
  }
}

const store = new IdempotencyStore();
let charges = 0;
const charge = async () => { await new Promise((r) => setTimeout(r, 5)); return { chargeId: `ch_${++charges}` }; };
const body = { amount: 1000, currency: "EUR" };

async function idempotenciaConcorrente() {
  const [a, b] = await Promise.all([store.run("k1", body, charge), store.run("k1", body, charge)]);

  // Antes → operação → depois
  //   pedido   linha "k1" antes   o que faz              resposta
  //   A        não existe         reserva e cobra        201
  //   B        in_progress        não cobra              409
  [a.status, b.status].sort(); // result ==> [201, 409]
  charges; // result ==> 1  (cobrado uma vez)
}

// Confusão possível: verificar-e-depois-inserir vs reservar — dois pedidos podem passar o "existe?" ao mesmo tempo; só a reserva atómica (UNIQUE) decide um vencedor.
// Para recordar: reservar a chave antes do efeito.
// Pergunta: se o segundo pedido usasse a chave "k2", quanto daria charges?
// Resposta: 2. Chaves diferentes são pedidos diferentes; cada um cobra.

//--------------------------------------------------------------------
// resposta guardada + hash do pedido — repetir em segurança
// Para que serve: o cliente perdeu a resposta e repete o pedido "k1"; recebe a mesma resposta, sem nova cobrança.
// Regra essencial: mesma chave + mesmo corpo → resposta guardada. Mesma chave + corpo diferente → 422.
// O que guarda: replay = a resposta guardada na primeira vez; o hash do corpo distingue "mesmo pedido" de "pedido diferente".

async function idempotenciaRepeticao() {
  const replay = await store.run("k1", body, charge);

  // Antes → operação → depois
  //   pedido               linha "k1" antes   resposta    charges
  //   k1, €10,00           done               201 ch_1    1
  //   k1, €99,99           done               422         1
  replay; // result ==> { status: 201, body: { chargeId: "ch_1" } }
  charges; // result ==> 1
  (await store.run("k1", { amount: 9999, currency: "EUR" }, charge)).status; // result ==> 422
}

// Confusão possível: 409 vs 422 — 409 = mesmo pedido ainda em curso (tenta mais tarde); 422 = chave reutilizada com outro corpo (erro do cliente).
// Para recordar: repetição devolve a mesma resposta; corpo diferente é recusado.
// Avançado: a Stripe guarda também respostas 500; aqui um erro apaga a chave, o que só é seguro se nada foi cobrado.
// Pergunta: o cliente repete "k1" com { currency: "EUR", amount: 1000 } (mesmos valores, outra ordem). Que recebe aqui?
// Resposta: 422. JSON.stringify depende da ordem das chaves, por isso o hash muda; em produção normaliza-se o corpo antes do hash.

// =====================================================================================
// §5 ── RETRIES ── (classificar, backoff com jitter, uma camada, resultado desconhecido)
// =====================================================================================

//--------------------------------------------------------------------
// isRetryable() — o erro pode passar sozinho?
// Para que serve: o PSP responde 503 → tentar outra vez; o banco recusa o cartão → nunca repetir.
// Regra essencial: só se repete o que é temporário (timeout, ligação cortada, 5xx, 429).
// O que guarda: err.status = código HTTP; err.code = código do erro (ETIMEDOUT, card_declined, …).

function isRetryable(err) {
  if (err.code === "ETIMEDOUT" || err.code === "ECONNRESET") return true;
  if (err.status === 429 || (err.status >= 500 && err.status <= 599)) return true;
  return false; // 4xx, recusa do emissor (card_declined), fraude → nunca repetir
}

// Antes → operação → depois
//   erro                       temporário?   depois
//   503                        sim           true
//   402 card_declined          não           false
//   400 (validação)            não           false
isRetryable({ status: 503 }); // result ==> true
isRetryable({ status: 402, code: "card_declined" }); // result ==> false
isRetryable({ status: 400 }); // result ==> false

// Confusão possível: 429 vs 4xx — 429 é 4xx mas é temporário ("estás a pedir demais"); repete-se respeitando Retry-After.
// Para recordar: repetir só o temporário; uma recusa é uma resposta, não uma falha.
// Pergunta: quanto dá isRetryable({ code: "ECONNRESET" })?
// Resposta: true. A ligação caiu; o pedido pode resultar numa nova tentativa.

//--------------------------------------------------------------------
// backoff() — esperar cada vez mais, a um tempo aleatório ("full jitter")
// Para que serve: 10 000 clientes falham ao mesmo tempo; sem jitter repetiam todos no mesmo milissegundo.
// Regra essencial: espera = aleatório(0, min(teto, base · 2^tentativa)).
// O que guarda: attempt = número da tentativa (0, 1, 2…); rand = função que dá um número em [0, 1); base = 100 ms; cap = 5000 ms.

const backoff = (attempt, rand, base = 100, cap = 5000) => Math.floor(rand() * Math.min(cap, base * 2 ** attempt));

// Antes → operação → depois
//   attempt   base · 2^n   teto aplicado   rand    depois
//   0         100          100             0.999   99
//   3         800          800             0.5     400
//   20        104857600    5000            0.999   4995
backoff(0, () => 0.999); // result ==> 99
backoff(3, () => 0.5); // result ==> 400
backoff(20, () => 0.999); // result ==> 4995  (nunca acima do teto)

// Confusão possível: backoff vs jitter — backoff faz a espera crescer; jitter espalha os clientes no tempo. Precisa-se dos dois.
// Para recordar: crescer + aleatório + teto.
// Pergunta: quanto dá backoff(2, () => 0.5)?
// Resposta: 200. 100 · 2² = 400, abaixo do teto; 0.5 × 400 = 200.

//--------------------------------------------------------------------
// withRetry() — repetir só o que é temporário, até um limite
// Para que serve: o PSP dá 503 duas vezes e à terceira responde "ok".
// Regra essencial: para logo se o erro não for temporário ou se chegou ao máximo de tentativas.
// O que guarda: attempt = tentativa atual; maxAttempts = limite (4); calls/declines = quantas vezes a função correu.

async function withRetry(fn, { maxAttempts = 4, sleep = async () => {}, rand = Math.random } = {}) {
  for (let attempt = 0; ; attempt++) {
    try {
      return await fn(attempt); // sucesso: o return termina o ciclo
    } catch (err) {
      if (!isRetryable(err) || attempt + 1 >= maxAttempts) throw err;
      await sleep(backoff(attempt, rand));
    }
  }
}

async function retryDemo() {
  let calls = 0;
  const flaky = async () => { calls++; if (calls < 3) throw { status: 503 }; return "ok"; };
  // Antes → operação → depois (uma linha por tentativa)
  //   attempt   calls   resultado   decisão
  //   0         1       503         repetir
  //   1         2       503         repetir
  //   2         3       "ok"        devolver
  await withRetry(flaky); // result ==> "ok"
  calls; // result ==> 3

  let declines = 0;
  await assert.rejects(withRetry(async () => { declines++; throw { status: 402, code: "card_declined" }; })); // note: rejeita — a recusa volta logo
  declines; // result ==> 1  (uma recusa não se repete)
}

// Confusão possível: maxAttempts vs retries — maxAttempts = 4 são 4 chamadas no total (1 + 3 repetições), não 4 repetições.
// Para recordar: temporário → espera e repete; definitivo → falha já.
// Pergunta: se flaky falhasse sempre com 503, quantas vezes corria?
// Resposta: 4. À 4.ª falha, attempt + 1 >= 4 e o erro é lançado.

//--------------------------------------------------------------------
// retries em camadas — porque só se repete numa camada
// Para que serve: perceber porque um pequeno problema na BD vira uma avalanche.
// Regra essencial: 3 tentativas em cada uma de 5 camadas multiplicam: 3^5 pedidos chegam à BD.
// O que guarda: nada; é a conta da multiplicação.

3 ** 5; // result ==> 243

// Antes → operação → depois
//   camadas   pedidos à BD por cada pedido do cliente
//   1         3
//   2         9
//   5         243

// Confusão possível: limite por camada vs limite global — 3 por camada parece pouco, mas os limites multiplicam-se. Usar uma camada e um orçamento (retry budget: sem tokens, sem retry).
// Para recordar: retries aninhados multiplicam a carga.
// Pergunta: e 2 tentativas em 4 camadas?
// Resposta: 16. 2^4 = 16 pedidos à BD.

//--------------------------------------------------------------------
// resultado desconhecido — timeout depois de cobrar
// Para que serve: o PSP cobra a encomenda 42, mas a resposta perde-se num timeout. Não cobrar outra vez.
// Regra essencial: timeout ≠ falha. Antes de repetir, perguntar "já aconteceu?" e usar a MESMA chave.
// O que guarda: psp.charges é um Map; chave = chave do pedido ("order-42"); valor = { id, amount } da cobrança.
//               dropNext = true faz a primeira resposta perder-se.

async function unknownOutcomeDemo() {
  const psp = { charges: new Map(), dropNext: true };
  psp.charge = async (key, amount) => {
    if (!psp.charges.has(key)) psp.charges.set(key, { id: `ch_${psp.charges.size + 1}`, amount });
    if (psp.dropNext) { psp.dropNext = false; throw { code: "ETIMEDOUT" }; } // cobrou, mas a resposta perdeu-se
    return psp.charges.get(key);
  };
  psp.find = async (key) => psp.charges.get(key) ?? null;

  const key = "order-42";
  const result = await withRetry(async (attempt) => (attempt > 0 && (await psp.find(key))) || psp.charge(key, 1000));

  // Antes → operação → depois
  //   attempt   o que faz            psp.charges     resultado
  //   0         charge               order-42 → ch_1 ETIMEDOUT (cobrou!)
  //   1         find("order-42")     igual           ch_1 (não cobra outra vez)
  result.id; // result ==> "ch_1"
  psp.charges.size; // result ==> 1  (cobrado uma vez)
}

// Confusão possível: "deu erro" vs "não sei" — um timeout pode esconder uma cobrança feita. Se não for possível consultar, marcar "unknown" e deixar a reconciliação (§8) decidir.
// Para recordar: timeout = "ainda não sei", não "falhou".
// Pergunta: se o retry não chamasse find e o PSP ignorasse a chave, quantas cobranças haveria?
// Resposta: 2. A primeira aconteceu mesmo, apesar do timeout, e a segunda seria nova.

// =====================================================================================
// §6 ── CONCORRÊNCIA ── (lost update e lock otimista)
// =====================================================================================
const tick = () => new Promise((r) => setImmediate(r));

//--------------------------------------------------------------------
// lost update — ler, esperar, escrever
// Para que serve: mostrar o bug em que dois levantamentos de €30 de uma conta com €50 passam os dois.
// Regra essencial: entre ler o saldo e escrevê-lo, outro pedido pode ter mudado o saldo.
// O que guarda: acc.balance = saldo partilhado; read = a cópia que cada pedido leu.

async function lostUpdateDemo() {
  const acc = { balance: 5000n };
  const naiveWithdraw = async (amt) => {
    const read = acc.balance;
    await tick(); // o outro "pedido" corre aqui
    if (read < amt) throw new Error("sem saldo");
    acc.balance = read - amt;
  };
  await Promise.all([naiveWithdraw(3000n), naiveWithdraw(3000n)]);

  // Antes → operação → depois
  //   passo         pedido A        pedido B        acc.balance
  //   ler           read = 5000     read = 5000     5000
  //   verificar     5000 ≥ 3000     5000 ≥ 3000     5000
  //   escrever      5000 − 3000     5000 − 3000     2000 (saíram €60, desceu €30)
  acc.balance; // result ==> 2000n  (BUG)
}

// Confusão possível: verificar no código vs verificar na BD — o if no código vê um valor velho; a BD vê o valor atual (UPDATE ... WHERE balance >= 3000).
// Para recordar: nunca ler → verificar → escrever sem proteção.
// Pergunta: com 3 levantamentos de €30 em simultâneo, quanto daria acc.balance?
// Resposta: 2000n. Os três leem 5000 e todos escrevem 5000 − 3000; saem €90 e o saldo só desce €30.

//--------------------------------------------------------------------
// lock otimista (version) — escrever só se ninguém mudou a linha
// Para que serve: corrigir o bug anterior: dos dois levantamentos de €30, só um passa.
// Regra essencial: UPDATE ... WHERE version = $lida. 0 linhas alteradas = conflito → ler outra vez e decidir de novo.
// O que guarda: row = { balance, version }; compareAndSet devolve false se a versão mudou (= 0 linhas alteradas).

async function optimisticLockDemo() {
  const row = { balance: 5000n, version: 0 };
  const compareAndSet = (expectedVersion, balance) => {
    if (row.version !== expectedVersion) return false;
    Object.assign(row, { balance, version: row.version + 1 });
    return true;
  };
  const safeWithdraw = async (amt) => {
    for (;;) {
      const { balance, version } = { ...row };
      await tick();
      if (balance < amt) return "declined";
      if (compareAndSet(version, balance - amt)) return "ok";
    }
  };
  const results = await Promise.all([safeWithdraw(3000n), safeWithdraw(3000n)]);

  // Antes → operação → depois
  //   passo                       A                   B                        row
  //   ler                         5000, v0            5000, v0                 5000, v0
  //   escrever (WHERE v = 0)      ok                  0 linhas → reler         2000, v1
  //   reler e verificar           —                   2000 < 3000 → declined   2000, v1
  results.sort(); // result ==> ["declined", "ok"]
  row.balance; // result ==> 2000n
  row.version; // result ==> 1
}

// Confusão possível: lock otimista vs FOR UPDATE — o otimista não bloqueia e repete em conflito (bom se os conflitos são raros); FOR UPDATE bloqueia a linha (bom se muitos pedidos batem na mesma conta).
// Para recordar: a BD é o árbitro; a versão diz se alguém chegou primeiro.
// Pergunta: se os dois levantamentos fossem de €20, quanto daria row.balance?
// Resposta: 1000n. B falha a primeira escrita, relê 3000 (v1), 3000 ≥ 2000, escreve 1000 (v2). Os dois passam.

//--------------------------------------------------------------------
// Correr os exemplos assíncronos por ordem (fora da resposta escondida do último bloco).
(async () => {
  await idempotenciaConcorrente();
  await idempotenciaRepeticao();
  await retryDemo();
  await unknownOutcomeDemo();
  await lostUpdateDemo();
  await optimisticLockDemo();
  console.log("✅ Payments OK");
})().catch((err) => {
  console.error("❌", err);
  process.exit(1);
});
