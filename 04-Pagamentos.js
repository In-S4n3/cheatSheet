// PAGAMENTOS / CORE BANKING — exemplos executáveis do 04-Pagamentos.md
// Correr: node 04-Pagamentos.js   → termina com "✅ Pagamentos OK"
// Cada secção tem asserts: se uma invariante partir, o processo sai com erro.

const assert = require("node:assert/strict");
const crypto = require("node:crypto");

// =====================================================================================
// §1 DINHEIRO EM CÓDIGO
// =====================================================================================

// Floats não representam 0.1 exactamente.
assert.notEqual(0.1 + 0.2, 0.3);

// Expoente da moeda (ISO 4217): quantas casas decimais tem a unidade menor.
const EXPONENT = { JPY: 0, EUR: 2, USD: 2, BHD: 3 };

// "12.34" EUR → 1234n cêntimos. Parse por string: nunca passa por float.
function toMinor(str, currency) {
  const exp = EXPONENT[currency];
  if (exp === undefined) throw new Error(`moeda desconhecida ${currency}`);
  if (!/^-?\d+(\.\d+)?$/.test(str)) throw new Error(`valor inválido ${str}`);
  const [int, frac = ""] = str.replace("-", "").split(".");
  if (frac.length > exp) throw new Error(`${currency} só tem ${exp} casas decimais`);
  const minor = BigInt(int + frac.padEnd(exp, "0"));
  return str.startsWith("-") ? -minor : minor;
}

function fromMinor(minor, currency) {
  const exp = EXPONENT[currency];
  const neg = minor < 0n;
  const s = (neg ? -minor : minor).toString().padStart(exp + 1, "0");
  const out = exp === 0 ? s : `${s.slice(0, -exp)}.${s.slice(-exp)}`;
  return (neg ? "-" : "") + out;
}

assert.equal(toMinor("12.34", "EUR"), 1234n);
assert.equal(toMinor("500", "JPY"), 500n);
assert.equal(toMinor("1.234", "BHD"), 1234n);
assert.throws(() => toMinor("1.234", "EUR"));
assert.equal(fromMinor(5n, "EUR"), "0.05");
assert.equal(fromMinor(-1234n, "BHD"), "-1.234");

// Divisão inteira com arredondamento bancário (half-even): empates vão para o par.
// Evita o enviesamento para cima do "half-up" quando se arredonda milhões de vezes.
function divHalfEven(a, b) {
  // a, b BigInt, b > 0
  let q = a / b;
  const r = a % b;
  const twice = 2n * (r < 0n ? -r : r);
  if (twice > b || (twice === b && q % 2n !== 0n)) q += a < 0n ? -1n : 1n;
  return q;
}
assert.equal(divHalfEven(25n, 10n), 2n); // 2.5 → 2 (par)
assert.equal(divHalfEven(35n, 10n), 4n); // 3.5 → 4 (par)
assert.equal(divHalfEven(26n, 10n), 3n);
assert.equal(divHalfEven(-25n, 10n), -2n);

// Juro: 1234.56 € × 1.5% = 18.5184 € → 1852 cêntimos. Taxa em basis points (150 bp).
assert.equal(divHalfEven(123456n * 150n, 10000n), 1852n);

// Dividir sem perder um cêntimo: maior resto (largest remainder).
function allocate(total, ratios) {
  const sum = ratios.reduce((a, b) => a + b, 0n);
  const parts = ratios.map((r) => (total * r) / sum);
  const rems = ratios.map((r, i) => ({ i, rem: (total * r) % sum }));
  let left = total - parts.reduce((a, b) => a + b, 0n);
  rems.sort((x, y) => (y.rem > x.rem ? 1 : y.rem < x.rem ? -1 : x.i - y.i));
  for (let k = 0; left > 0n; k++, left--) parts[rems[k].i] += 1n;
  return parts;
}
const split = allocate(1000n, [1n, 1n, 1n]); // 10.00 € a dividir por 3
assert.deepEqual(split, [334n, 333n, 333n]);
assert.equal(split.reduce((a, b) => a + b, 0n), 1000n); // nem um cêntimo perdido
assert.deepEqual(allocate(100n, [70n, 30n]), [70n, 30n]);

// =====================================================================================
// §2 LEDGER DE PARTIDAS DOBRADAS (mini-ledger estilo Vault: fases pending/committed)
// =====================================================================================
// Convenção: cada entrada tem amount com sinal (+ entra na conta, − sai).
// Regra de ouro: as entradas de cada transacção somam 0. Saldos = soma das entradas.

class Ledger {
  #entries = []; // append-only: nunca se edita nem apaga
  #txIds = new Set();
  #internal = new Set(); // contas internas do banco podem ficar negativas

  openInternal(acc) { this.#internal.add(acc); }

  #post(txId, phase, legs) {
    if (this.#txIds.has(txId)) throw new Error(`tx duplicada ${txId}`);
    if (legs.length < 2) throw new Error("precisa de ≥ 2 pernas");
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

  // Disponível = liquidado − cativos de saída. Entradas pendentes NÃO contam.
  available(acc) {
    const pending = this.balance(acc, "pending");
    return this.balance(acc, "committed") + (pending < 0n ? pending : 0n);
  }

  #checkFunds(acc, amount) {
    if (!this.#internal.has(acc) && this.available(acc) < amount)
      throw new Error(`saldo insuficiente em ${acc}`);
  }

  transfer(txId, from, to, amount) {
    this.#checkFunds(from, amount);
    this.#post(txId, "committed", [
      { account: from, amount: -amount },
      { account: to, amount },
    ]);
  }

  // Autorização = cativo (hold). Mexe só na fase pending.
  authorise(txId, from, to, amount) {
    this.#checkFunds(from, amount);
    this.#post(txId, "pending", [
      { account: from, amount: -amount },
      { account: to, amount },
    ]);
  }

  // Liquidação: liberta o cativo e lança o valor final (pode ser < autorizado).
  settle(txId, authTxId, finalAmount) {
    const auth = this.#entries.filter((e) => e.txId === authTxId);
    const [from, to] = [auth.find((e) => e.amount < 0n), auth.find((e) => e.amount > 0n)];
    if (finalAmount > to.amount) throw new Error("settle acima do autorizado");
    this.#post(`${txId}:release`, "pending", auth.map((e) => ({ account: e.account, amount: -e.amount })));
    this.#post(txId, "committed", [
      { account: from.account, amount: -finalAmount },
      { account: to.account, amount: finalAmount },
    ]);
  }

  // Corrigir = nova transacção oposta, com referência. Nunca editar a original.
  reverse(txId, originalTxId) {
    const orig = this.#entries.filter((e) => e.txId === originalTxId && e.phase === "committed");
    if (orig.length === 0) throw new Error("nada para reverter");
    this.#post(txId, "committed", orig.map((e) => ({ account: e.account, amount: -e.amount, reverses: originalTxId })));
  }

  // Invariante global: a soma de TODAS as entradas, por fase, é zero.
  assertInvariants() {
    for (const phase of ["pending", "committed"]) {
      const total = this.#entries.filter((e) => e.phase === phase).reduce((s, e) => s + e.amount, 0n);
      assert.equal(total, 0n, `ledger desequilibrado na fase ${phase}`);
    }
  }
}

const L = new Ledger();
L.openInternal("bank:cash");
L.transfer("dep-1", "bank:cash", "alice", 10000n); // depósito 100.00 €
L.authorise("auth-1", "alice", "merchant", 3000n); // compra 30.00 €, só cativo
assert.equal(L.balance("alice"), 10000n); // liquidado ainda 100
assert.equal(L.available("alice"), 7000n); // disponível 70
assert.throws(() => L.authorise("auth-2", "alice", "merchant", 8000n), /insuficiente/);
L.settle("set-1", "auth-1", 2500n); // captura parcial 25.00 €
assert.equal(L.balance("alice"), 7500n);
assert.equal(L.balance("alice", "pending"), 0n); // cativo libertado
assert.equal(L.available("alice"), 7500n);
L.reverse("ref-1", "set-1"); // reembolso = reversão
assert.equal(L.balance("alice"), 10000n);
assert.throws(() => L.transfer("dep-1", "bank:cash", "alice", 1n), /duplicada/);
L.assertInvariants();

// =====================================================================================
// §3 CICLO DE VIDA DE UM PAGAMENTO COM CARTÃO (máquina de estados)
// =====================================================================================
const TRANSITIONS = {
  authorised: ["captured", "voided", "expired"],
  captured: ["settled"],
  settled: ["refunded", "partially_refunded", "disputed"],
  partially_refunded: ["refunded", "partially_refunded", "disputed"],
  disputed: ["chargeback_lost", "chargeback_won"],
};

function transition(payment, to, now = Date.now()) {
  // Guarda de autorização tardia: depois de expirar, a captura é recusada.
  const from = payment.status === "authorised" && now > payment.authExpiresAt ? "expired" : payment.status;
  if (!(TRANSITIONS[from] ?? []).includes(to)) throw new Error(`transição ilegal ${from} → ${to}`);
  return { ...payment, status: to };
}

const DAY = 86_400_000;
const p0 = { status: "authorised", authExpiresAt: 7 * DAY };
assert.equal(transition(p0, "captured", 1 * DAY).status, "captured");
assert.throws(() => transition(p0, "captured", 8 * DAY), /expired → captured/);
assert.throws(() => transition({ status: "captured" }, "refunded"), /ilegal/); // reembolso só depois de liquidar

// =====================================================================================
// §4 IDEMPOTÊNCIA (chave + hash do pedido + resposta guardada)
// =====================================================================================
class IdempotencyStore {
  #rows = new Map(); // em produção: tabela com UNIQUE(key)

  async run(key, body, handler) {
    const hash = crypto.createHash("sha256").update(JSON.stringify(body)).digest("hex");
    const row = this.#rows.get(key);
    if (row) {
      if (row.hash !== hash) return { status: 422, body: "mesma chave, pedido diferente" };
      if (row.state === "in_progress") return { status: 409, body: "pedido em curso, tenta mais tarde" };
      return row.response; // replay: a MESMA resposta, sem executar outra vez
    }
    // Reserva a chave ANTES do primeiro await: é o equivalente a INSERT ... UNIQUE.
    this.#rows.set(key, { hash, state: "in_progress" });
    try {
      const response = { status: 201, body: await handler() };
      this.#rows.set(key, { hash, state: "done", response });
      return response;
    } catch (err) {
      this.#rows.delete(key); // falhou antes de efeito: liberta a chave para retry
      throw err;
    }
  }
}

async function idempotencyDemo() {
  const store = new IdempotencyStore();
  let charges = 0;
  const charge = async () => { await new Promise((r) => setTimeout(r, 5)); return { chargeId: `ch_${++charges}` }; };
  const body = { amount: 1000, currency: "EUR" };

  // Dois pedidos concorrentes com a mesma chave (duplo clique / retry do cliente).
  const [a, b] = await Promise.all([store.run("k1", body, charge), store.run("k1", body, charge)]);
  assert.deepEqual([a.status, b.status].sort(), [201, 409]);
  assert.equal(charges, 1);

  const replay = await store.run("k1", body, charge); // retry depois de terminar
  assert.deepEqual(replay, a.status === 201 ? a : b);
  assert.equal(charges, 1);

  assert.equal((await store.run("k1", { amount: 9999, currency: "EUR" }, charge)).status, 422);
}

// =====================================================================================
// §5 RETRIES (classificar, backoff com jitter, orçamento, resultado desconhecido)
// =====================================================================================
function isRetryable(err) {
  if (err.code === "ETIMEDOUT" || err.code === "ECONNRESET") return true;
  if (err.status === 429 || (err.status >= 500 && err.status <= 599)) return true;
  return false; // 4xx, recusa do emissor (card_declined), fraude → nunca repetir
}
assert.equal(isRetryable({ status: 503 }), true);
assert.equal(isRetryable({ status: 402, code: "card_declined" }), false);
assert.equal(isRetryable({ status: 400 }), false);

// "Full jitter": espera aleatória entre 0 e min(cap, base·2^n).
const backoff = (attempt, rand, base = 100, cap = 5000) => Math.floor(rand() * Math.min(cap, base * 2 ** attempt));
assert.equal(backoff(0, () => 0.999), 99);
assert.equal(backoff(3, () => 0.5), 400);
assert.equal(backoff(20, () => 0.999), 4995); // nunca passa o cap

async function withRetry(fn, { maxAttempts = 4, sleep = async () => {}, rand = Math.random } = {}) {
  for (let attempt = 0; ; attempt++) {
    try {
      return await fn(attempt);
    } catch (err) {
      if (!isRetryable(err) || attempt + 1 >= maxAttempts) throw err;
      await sleep(backoff(attempt, rand));
    }
  }
}

// Retries aninhados multiplicam-se: 3 tentativas em 5 camadas = 3^5 pedidos à BD.
assert.equal(3 ** 5, 243);

async function retryDemo() {
  let calls = 0;
  const flaky = async () => { calls++; if (calls < 3) throw { status: 503 }; return "ok"; };
  assert.equal(await withRetry(flaky), "ok");
  assert.equal(calls, 3);

  let declines = 0;
  await assert.rejects(withRetry(async () => { declines++; throw { status: 402, code: "card_declined" }; }));
  assert.equal(declines, 1); // recusa não se repete

  // Resultado desconhecido: o PSP cobrou mas a resposta perdeu-se (timeout).
  const psp = { charges: new Map(), dropNext: true };
  psp.charge = async (key, amount) => {
    if (!psp.charges.has(key)) psp.charges.set(key, { id: `ch_${psp.charges.size + 1}`, amount });
    if (psp.dropNext) { psp.dropNext = false; throw { code: "ETIMEDOUT" }; }
    return psp.charges.get(key);
  };
  psp.find = async (key) => psp.charges.get(key) ?? null;

  // Correcto: antes de repetir, pergunta "isto já aconteceu?" e reusa a MESMA chave.
  const key = "order-42";
  const result = await withRetry(async (attempt) => (attempt > 0 && (await psp.find(key))) || psp.charge(key, 1000));
  assert.equal(result.id, "ch_1");
  assert.equal(psp.charges.size, 1); // cobrado uma vez
}

// =====================================================================================
// §6 CONCORRÊNCIA (lost update e optimistic locking)
// =====================================================================================
const tick = () => new Promise((r) => setImmediate(r));

async function lostUpdateDemo() {
  // Ingénuo: ler → (await) → escrever. Dois levantamentos de 30 € sobre 50 €.
  const acc = { balance: 5000n };
  const naiveWithdraw = async (amt) => {
    const read = acc.balance;
    await tick(); // a outra "request" corre aqui
    if (read < amt) throw new Error("sem saldo");
    acc.balance = read - amt;
  };
  await Promise.all([naiveWithdraw(3000n), naiveWithdraw(3000n)]);
  assert.equal(acc.balance, 2000n); // BUG: saíram 60 €, só se debitaram 30 €

  // Optimistic locking: UPDATE ... WHERE version = $lida. Se mudou, relê e tenta de novo.
  const row = { balance: 5000n, version: 0 };
  const compareAndSet = (expectedVersion, balance) => {
    if (row.version !== expectedVersion) return false; // 0 linhas actualizadas
    Object.assign(row, { balance, version: row.version + 1 });
    return true;
  };
  const safeWithdraw = async (amt) => {
    for (;;) {
      const { balance, version } = { ...row };
      await tick();
      if (balance < amt) return "recusado";
      if (compareAndSet(version, balance - amt)) return "ok";
    }
  };
  const results = await Promise.all([safeWithdraw(3000n), safeWithdraw(3000n)]);
  assert.deepEqual(results.sort(), ["ok", "recusado"]);
  assert.equal(row.balance, 2000n); // 50 − 30, e o segundo foi recusado
  assert.equal(row.version, 1);
}

// =====================================================================================
(async () => {
  await idempotencyDemo();
  await retryDemo();
  await lostUpdateDemo();
  console.log("✅ Pagamentos OK");
})().catch((err) => {
  console.error("❌", err);
  process.exit(1);
});
