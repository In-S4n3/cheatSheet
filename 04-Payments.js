// PAYMENTS / CORE BANKING — runnable examples for 04-Payments.md
// Run: node 04-Payments.js   → ends with "✅ Payments OK"
// Every "// result ==>" is checked by: node check-results.js 04-Payments.js

const assert = require("node:assert/strict");
const crypto = require("node:crypto");

// =====================================================================================
// §1 MONEY IN CODE
// =====================================================================================

//--------------------------------------------------------------------
// float - // Used to show why money is never a float: 0.1 can't be stored exactly.

0.1 + 0.2 === 0.3; // result ==> false

//--------------------------------------------------------------------
// EXPONENT - // Used to know how many decimal places a currency has (ISO 4217).

const EXPONENT = { JPY: 0, EUR: 2, USD: 2, BHD: 3 };

EXPONENT.EUR; // result ==> 2  (1 euro = 100 cents)
// note: never assume 2. JPY has 0, BHD has 3.

//--------------------------------------------------------------------
// toMinor() - // Used to turn "12.34" EUR into 1234n cents, reading from a string so it never touches a float.

function toMinor(str, currency) {
  const exp = EXPONENT[currency];
  if (exp === undefined) throw new Error(`unknown currency ${currency}`);
  if (!/^-?\d+(\.\d+)?$/.test(str)) throw new Error(`invalid amount ${str}`);
  const [int, frac = ""] = str.replace("-", "").split(".");
  if (frac.length > exp) throw new Error(`${currency} only has ${exp} decimal places`);
  const minor = BigInt(int + frac.padEnd(exp, "0"));
  return str.startsWith("-") ? -minor : minor;
}

toMinor("12.34", "EUR"); // result ==> 1234n
toMinor("500", "JPY"); // result ==> 500n
toMinor("1.234", "BHD"); // result ==> 1234n
assert.throws(() => toMinor("1.234", "EUR")); // note: throws — EUR only has 2 decimal places

//--------------------------------------------------------------------
// fromMinor() - // Used to turn cents back into text for showing it.

function fromMinor(minor, currency) {
  const exp = EXPONENT[currency];
  const neg = minor < 0n;
  const s = (neg ? -minor : minor).toString().padStart(exp + 1, "0");
  const out = exp === 0 ? s : `${s.slice(0, -exp)}.${s.slice(-exp)}`;
  return (neg ? "-" : "") + out;
}

fromMinor(5n, "EUR"); // result ==> "0.05"
fromMinor(-1234n, "BHD"); // result ==> "-1.234"

//--------------------------------------------------------------------
// divHalfEven() - // Used to divide and round a tie to the even number (banker's rounding).

function divHalfEven(a, b) {
  // a, b BigInt, b > 0
  let q = a / b;
  const r = a % b;
  const twice = 2n * (r < 0n ? -r : r);
  if (twice > b || (twice === b && q % 2n !== 0n)) q += a < 0n ? -1n : 1n;
  return q;
}

divHalfEven(25n, 10n); // result ==> 2n  (2.5 → 2, even)
divHalfEven(35n, 10n); // result ==> 4n  (3.5 → 4, even)
divHalfEven(26n, 10n); // result ==> 3n
divHalfEven(-25n, 10n); // result ==> -2n
// note: half-up always rounds ties up; over millions of roundings that adds up. Half-even does not.

//--------------------------------------------------------------------
// basis points - // Used to write rates as whole numbers: 150 bp = 1.5%.

divHalfEven(123456n * 150n, 10000n); // result ==> 1852n  (€1234.56 × 1.5% = €18.5184 → €18.52)

//--------------------------------------------------------------------
// allocate() - // Used to split an amount without losing a cent; the leftover goes to the largest remainder.

function allocate(total, ratios) {
  const sum = ratios.reduce((a, b) => a + b, 0n);
  const parts = ratios.map((r) => (total * r) / sum);
  const rems = ratios.map((r, i) => ({ i, rem: (total * r) % sum }));
  let left = total - parts.reduce((a, b) => a + b, 0n);
  rems.sort((x, y) => (y.rem > x.rem ? 1 : y.rem < x.rem ? -1 : x.i - y.i));
  for (let k = 0; left > 0n; k++, left--) parts[rems[k].i] += 1n;
  return parts;
}

const split = allocate(1000n, [1n, 1n, 1n]); // result ==> [334n, 333n, 333n]  (€10.00 split three ways)
split.reduce((a, b) => a + b, 0n); // result ==> 1000n  (not a cent lost)
allocate(100n, [70n, 30n]); // result ==> [70n, 30n]

// =====================================================================================
// §2 DOUBLE-ENTRY LEDGER (Vault-style mini-ledger: pending/committed phases)
// =====================================================================================

//--------------------------------------------------------------------
// Ledger - // Used to record money as entries that always sum to zero; the balance is the sum of an account's entries.
// note: each entry is signed (+ into the account, − out of it). Entries are never edited or deleted.

class Ledger {
  #entries = []; // append-only: never edited or deleted
  #txIds = new Set();
  #internal = new Set(); // the bank's internal accounts may go negative

  openInternal(acc) { this.#internal.add(acc); }

  #post(txId, phase, legs) {
    if (this.#txIds.has(txId)) throw new Error(`duplicate tx ${txId}`);
    if (legs.length < 2) throw new Error("needs ≥ 2 legs");
    const sum = legs.reduce((s, l) => s + l.amount, 0n);
    if (sum !== 0n) throw new Error(`tx ${txId} does not sum to zero (${sum})`);
    this.#txIds.add(txId);
    for (const l of legs) this.#entries.push(Object.freeze({ txId, phase, ...l }));
  }

  balance(acc, phase = "committed") {
    return this.#entries
      .filter((e) => e.account === acc && e.phase === phase)
      .reduce((s, e) => s + e.amount, 0n);
  }

  // Available = settled − outgoing holds. Incoming pending entries do NOT count.
  available(acc) {
    const pending = this.balance(acc, "pending");
    return this.balance(acc, "committed") + (pending < 0n ? pending : 0n);
  }

  #checkFunds(acc, amount) {
    if (!this.#internal.has(acc) && this.available(acc) < amount)
      throw new Error(`insufficient funds in ${acc}`);
  }

  transfer(txId, from, to, amount) {
    this.#checkFunds(from, amount);
    this.#post(txId, "committed", [
      { account: from, amount: -amount },
      { account: to, amount },
    ]);
  }

  // Authorisation = hold. Touches only the pending phase.
  authorise(txId, from, to, amount) {
    this.#checkFunds(from, amount);
    this.#post(txId, "pending", [
      { account: from, amount: -amount },
      { account: to, amount },
    ]);
  }

  // Settlement: releases the hold and posts the final amount (may be < authorised).
  settle(txId, authTxId, finalAmount) {
    const auth = this.#entries.filter((e) => e.txId === authTxId);
    const [from, to] = [auth.find((e) => e.amount < 0n), auth.find((e) => e.amount > 0n)];
    if (finalAmount > to.amount) throw new Error("settle above the authorised amount");
    this.#post(`${txId}:release`, "pending", auth.map((e) => ({ account: e.account, amount: -e.amount })));
    this.#post(txId, "committed", [
      { account: from.account, amount: -finalAmount },
      { account: to.account, amount: finalAmount },
    ]);
  }

  // Correct = a new, opposite transaction with a reference. Never edit the original.
  reverse(txId, originalTxId) {
    const orig = this.#entries.filter((e) => e.txId === originalTxId && e.phase === "committed");
    if (orig.length === 0) throw new Error("nothing to reverse");
    this.#post(txId, "committed", orig.map((e) => ({ account: e.account, amount: -e.amount, reverses: originalTxId })));
  }

  // Global invariant: the sum of ALL entries, per phase, is zero.
  assertInvariants() {
    for (const phase of ["pending", "committed"]) {
      const total = this.#entries.filter((e) => e.phase === phase).reduce((s, e) => s + e.amount, 0n);
      assert.equal(total, 0n, `ledger unbalanced in phase ${phase}`);
    }
  }
}

//--------------------------------------------------------------------
// transfer() - // Used to move money now: one account goes down, the other goes up by the same amount.

const L = new Ledger();
L.openInternal("bank:cash");
L.transfer("dep-1", "bank:cash", "alice", 10000n); // deposit €100.00

L.balance("alice"); // result ==> 10000n
assert.throws(() => L.transfer("dep-1", "bank:cash", "alice", 1n), /duplicate/); // note: throws — same tx id twice

//--------------------------------------------------------------------
// authorise() - // Used to hold money for a card payment without moving it yet.

L.authorise("auth-1", "alice", "merchant", 3000n); // €30.00 purchase, hold only

L.balance("alice"); // result ==> 10000n  (settled is still €100)
L.available("alice"); // result ==> 7000n  (€70 can still be spent)
assert.throws(() => L.authorise("auth-2", "alice", "merchant", 8000n), /insufficient/); // note: throws — insufficient funds

//--------------------------------------------------------------------
// settle() - // Used to release the hold and really move the money; it can be less than the hold.

L.settle("set-1", "auth-1", 2500n); // partial capture €25.00

L.balance("alice"); // result ==> 7500n
L.balance("alice", "pending"); // result ==> 0n  (hold released)
L.available("alice"); // result ==> 7500n

//--------------------------------------------------------------------
// reverse() - // Used to undo a transaction by adding the opposite one, never by editing it.

L.reverse("ref-1", "set-1"); // refund = reversal

L.balance("alice"); // result ==> 10000n
L.assertInvariants(); // note: throws if any phase does not sum to 0

// =====================================================================================
// §3 CARD PAYMENT LIFECYCLE (state machine)
// =====================================================================================

//--------------------------------------------------------------------
// transition() - // Used to move a payment to its next state, and refuse any move that is not allowed.

const TRANSITIONS = {
  authorised: ["captured", "voided", "expired"],
  captured: ["settled"],
  settled: ["refunded", "partially_refunded", "disputed"],
  partially_refunded: ["refunded", "partially_refunded", "disputed"],
  disputed: ["chargeback_lost", "chargeback_won"],
};

function transition(payment, to, now = Date.now()) {
  // Late-authorisation guard: once expired, capture is refused.
  const from = payment.status === "authorised" && now > payment.authExpiresAt ? "expired" : payment.status;
  if (!(TRANSITIONS[from] ?? []).includes(to)) throw new Error(`illegal transition ${from} → ${to}`);
  return { ...payment, status: to };
}

const DAY = 86_400_000;
const p0 = { status: "authorised", authExpiresAt: 7 * DAY };

transition(p0, "captured", 1 * DAY).status; // result ==> "captured"
assert.throws(() => transition(p0, "captured", 8 * DAY), /expired → captured/); // note: throws — the hold expired
assert.throws(() => transition({ status: "captured" }, "refunded"), /illegal/); // note: throws — refund only after settle
// note: a late capture is an illegal move in the table, not a stray if.

// =====================================================================================
// §4 IDEMPOTENCY (key + request hash + stored response)
// =====================================================================================

//--------------------------------------------------------------------
// IdempotencyStore - // Used to make sure the same request only charges once, even if it is sent twice.
// note: the key is reserved BEFORE the charge runs. In a DB that is INSERT ... UNIQUE(key).

class IdempotencyStore {
  #rows = new Map(); // in production: a table with UNIQUE(key)

  async run(key, body, handler) {
    const hash = crypto.createHash("sha256").update(JSON.stringify(body)).digest("hex");
    const row = this.#rows.get(key);
    if (row) {
      if (row.hash !== hash) return { status: 422, body: "same key, different request" };
      if (row.state === "in_progress") return { status: 409, body: "request in progress, try again later" };
      return row.response; // replay: the SAME response, without running again
    }
    // Reserve the key BEFORE the first await: the equivalent of INSERT ... UNIQUE.
    this.#rows.set(key, { hash, state: "in_progress" });
    try {
      const response = { status: 201, body: await handler() };
      this.#rows.set(key, { hash, state: "done", response });
      return response;
    } catch (err) {
      this.#rows.delete(key); // failed before any effect: free the key for a retry
      throw err;
    }
  }
}

async function idempotencyDemo() {
  const store = new IdempotencyStore();
  let charges = 0;
  const charge = async () => { await new Promise((r) => setTimeout(r, 5)); return { chargeId: `ch_${++charges}` }; };
  const body = { amount: 1000, currency: "EUR" };

  // Two requests at the same time with the same key (double click / client retry).
  const [a, b] = await Promise.all([store.run("k1", body, charge), store.run("k1", body, charge)]);
  [a.status, b.status].sort(); // result ==> [201, 409]
  charges; // result ==> 1  (charged once)

  // A retry after it finished gets the saved answer back.
  const replay = await store.run("k1", body, charge);
  replay; // result ==> { status: 201, body: { chargeId: "ch_1" } }  (the same saved response)
  charges; // result ==> 1

  // Same key with a different body is refused.
  (await store.run("k1", { amount: 9999, currency: "EUR" }, charge)).status; // result ==> 422
}

// =====================================================================================
// §5 RETRIES (classify, backoff with jitter, budget, unknown outcome)
// =====================================================================================

//--------------------------------------------------------------------
// isRetryable() - // Used to decide if an error may go away on its own, so trying again makes sense.

function isRetryable(err) {
  if (err.code === "ETIMEDOUT" || err.code === "ECONNRESET") return true;
  if (err.status === 429 || (err.status >= 500 && err.status <= 599)) return true;
  return false; // 4xx, issuer decline (card_declined), fraud → never retry
}

isRetryable({ status: 503 }); // result ==> true
isRetryable({ status: 402, code: "card_declined" }); // result ==> false
isRetryable({ status: 400 }); // result ==> false

//--------------------------------------------------------------------
// backoff() - // Used to wait a random time that grows on each try, so clients don't all retry at once ("full jitter").

const backoff = (attempt, rand, base = 100, cap = 5000) => Math.floor(rand() * Math.min(cap, base * 2 ** attempt));

backoff(0, () => 0.999); // result ==> 99
backoff(3, () => 0.5); // result ==> 400
backoff(20, () => 0.999); // result ==> 4995  (never above the cap)
// note: the wait is random(0, min(cap, base·2^n)).

//--------------------------------------------------------------------
// withRetry() - // Used to try again only on retryable errors, waiting with backoff, up to a limit.

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

//--------------------------------------------------------------------
// nested retries - // Used to show why you retry in one layer only: 3 tries in 5 layers hit the DB 3^5 times.

3 ** 5; // result ==> 243

async function retryDemo() {
  let calls = 0;
  const flaky = async () => { calls++; if (calls < 3) throw { status: 503 }; return "ok"; };
  await withRetry(flaky); // result ==> "ok"
  calls; // result ==> 3  (failed twice, then worked)

  let declines = 0;
  await assert.rejects(withRetry(async () => { declines++; throw { status: 402, code: "card_declined" }; })); // note: rejects — the decline is thrown straight back
  declines; // result ==> 1  (a decline is not retried)

  //--------------------------------------------------------------------
  // unknown outcome - // Used to handle a timeout where the PSP did charge but the answer got lost.

  const psp = { charges: new Map(), dropNext: true };
  psp.charge = async (key, amount) => {
    if (!psp.charges.has(key)) psp.charges.set(key, { id: `ch_${psp.charges.size + 1}`, amount });
    if (psp.dropNext) { psp.dropNext = false; throw { code: "ETIMEDOUT" }; }
    return psp.charges.get(key);
  };
  psp.find = async (key) => psp.charges.get(key) ?? null;

  // Before retrying, ask "did this already happen?" and reuse the SAME key.
  const key = "order-42";
  const result = await withRetry(async (attempt) => (attempt > 0 && (await psp.find(key))) || psp.charge(key, 1000));
  result.id; // result ==> "ch_1"
  psp.charges.size; // result ==> 1  (charged once)
  // note: a timeout is not a failure. It means "don't know yet".
}

// =====================================================================================
// §6 CONCURRENCY (lost update and optimistic locking)
// =====================================================================================
const tick = () => new Promise((r) => setImmediate(r));

async function lostUpdateDemo() {
  //--------------------------------------------------------------------
  // lost update - // Used to show the bug: read, wait, write. Two €30 withdrawals from €50 both pass.

  const acc = { balance: 5000n };
  const naiveWithdraw = async (amt) => {
    const read = acc.balance;
    await tick(); // the other "request" runs here
    if (read < amt) throw new Error("no funds");
    acc.balance = read - amt;
  };
  await Promise.all([naiveWithdraw(3000n), naiveWithdraw(3000n)]);
  acc.balance; // result ==> 2000n  (BUG: €60 went out, only €30 was debited)

  //--------------------------------------------------------------------
  // optimistic lock - // Used to write only if nobody changed the row since I read it (UPDATE ... WHERE version = $read).

  const row = { balance: 5000n, version: 0 };
  const compareAndSet = (expectedVersion, balance) => {
    if (row.version !== expectedVersion) return false; // 0 rows updated
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
  results.sort(); // result ==> ["declined", "ok"]
  row.balance; // result ==> 2000n  (50 − 30; the second was declined)
  row.version; // result ==> 1
  // note: if the version changed, re-read and try again.
}

// =====================================================================================
(async () => {
  await idempotencyDemo();
  await retryDemo();
  await lostUpdateDemo();
  console.log("✅ Payments OK");
})().catch((err) => {
  console.error("❌", err);
  process.exit(1);
});
