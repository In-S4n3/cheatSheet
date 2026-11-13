# 04 · Payments & Core Banking — cheat sheet

> For interviews at Thought Machine (Vault Core = a **ledger**, not a card gateway).
> Runnable examples: `node 04-Payments.js` → `✅ Payments OK`.
> Legend: **[inferred]** = my own conclusion, not found in a public source.

## INDEX

| § | Topic | Example in the `.js` |
|---|------|------------------|
| 1 | Money in code | §1 |
| 2 | Double-entry ledger | §2 |
| 3 | Card payment lifecycle | §3 |
| 4 | Idempotency | §4 |
| 5 | Retries | §5 |
| 6 | Concurrency | §6 |
| 7 | Consistency across systems | — |
| 8 | Reconciliation & settlement | — |
| 9 | Rails and a short glossary | — |
| 10 | Thought Machine / Vault in 10 lines | — |
| 11 | Bridge to your experience | — |
| 12 | Likely questions | — |
| — | Sources | — |

---

## §1 Money in code

**Minor unit** — Used to store money as a whole number of cents, never as a `float`.
- Example: €12.34 is stored as `1234`. `toMinor("12.34", "EUR")` → `1234n`.
- note: `0.1 + 0.2 !== 0.3`. One wrong cent × millions of accounts = an audit.
- note: parse from a string, never from a float. Use `BigInt` / `int64`, or a decimal library (`decimal.js`, Go `shopspring/decimal`).

**Currency exponent** — Used to know how many decimal places a currency has. It comes from ISO 4217.

| Currency | Exponent | 1 unit = |
|-------|----------|-------------|
| JPY | 0 | 1 |
| EUR / USD | 2 | 100 |
| BHD / KWD | 3 | 1000 |

- note: never assume 2 decimal places.

**Amount + currency** — Used to keep the number and its currency together.
- Example: `{ amount: 1234, currency: "EUR" }`.
- note: a number without a currency is not money.

**Banker's rounding (half-even)** — Used to round a tie to the even number.
- Example: 2.5 → 2, 3.5 → 4. `divHalfEven(25n, 10n)` → `2n`.
- note: half-up always pushes ties up, so the error builds up. Half-even removes that bias.
- note: round once, at the end, with an explicit rule.

**Basis points** — Used to write rates as whole numbers: 150 bp = 1.5%.
- Example: €1234.56 × 150 bp = €18.5184 → `1852` cents.

**Allocate** — Used to split an amount without losing a cent. The leftover goes to the largest remainder.
- Example: €10.00 / 3 = 3.34 + 3.33 + 3.33. `allocate(1000n, [1n, 1n, 1n])` → `[334n, 333n, 333n]`.
- In an interview: "Money is an integer in the minor unit, plus the currency. I round once, half-even, and allocate the remainder so the total always adds up."

→ `04-Payments.js` §1

---

## §2 Double-entry ledger

**Ledger** — Used to record every money movement as a list of entries that never changes.
- Example: entry (posting) = `{ txId, account, amount ±, phase }`.
- note: append-only. A mistake is never fixed with an `UPDATE`.

**Double entry** — Used to make sure money never appears or disappears: every movement takes from one account and gives to another.
- Example: a transaction has ≥ 2 entries, and they sum to 0.
- note: an unbalanced ledger is a proven bug.

**Account** — Used to hold entries for one owner: a customer, a merchant, or a bank internal account (cash, interest, fees).

**Balance** — Used to know how much an account has. It is the sum of the account's entries.
- Example: `SUM(amount)` of the account's entries (may have a cached snapshot).
- note: never store `balance` as a column you edit. It is **derived** from the entries.

**Debit / credit** — Used to name the two sides of an entry.
- note: in bank accounting, a customer deposit is a **liability** of the bank. Crediting the customer's account raises their balance.
- note: don't memorise signs; memorise "sums to zero".

**Pending vs settled** — Used to tell held money apart from money that really moved.
- Example: `L.authorise("auth-1", "alice", "merchant", 3000n)` holds €30 in the pending phase only.
- note: held (authorisation) ≠ settled.

**Available balance** — Used to know what the customer can still spend: settled − outgoing holds.
- Example: €100 settled, €30 held → `L.available("alice")` = `7000n`.
- note: incoming pending entries do **not** add to it.

**Reversal** — Used to fix a wrong transaction by adding the opposite one.
- Example: `L.settle("set-1", "auth-1", 2500n)` posts €25; `L.reverse("ref-1", "set-1")` refunds it.
- note: `L.assertInvariants()` checks the global sum per phase = 0.
- In an interview: "An append-only, double-entry ledger: every transaction sums to zero, the balance is derived, and corrections are reversals."

→ `04-Payments.js` §2

---

## §3 Card payment lifecycle

**Payment lifecycle** — Used to move a card payment through states; it is not a single call.
- note: each state has different money rules (held vs moved vs returned).
- note: the trap is capturing after the authorisation expired, or refunding what was never settled.

```
authorise ──► capture ──► settle ──► refund / partial refund
    │                        └─────► dispute ──► chargeback (won/lost)
    └──► void / expire (hold released)
```

| Step | What it means |
|-------|----------------|
| Authorise | The issuer says yes and **holds** the amount. No money has moved yet |
| Capture | The merchant claims the amount (full or partial; the rest is released) |
| Settle / clearing | The money really moves: issuer → scheme → acquirer → merchant (days) |
| Refund | A new operation in the opposite direction; can be partial |
| Chargeback | The cardholder disputes with the issuer; the merchant loses the amount + a fee, unless they prove otherwise |

**Authorisation expiry** — Used to know how long a hold lasts before it is released (Stripe, online).
- Example: Visa 5 days for MIT (exactly 4 d 18 h), 7 for CIT; Mastercard 7.

**Stripe PaymentIntent** — Used by Stripe to track one payment's state.
- Example: `requires_payment_method → requires_confirmation → requires_action (3DS) → processing / requires_capture → succeeded | canceled`.

**3DS / SCA (PSD2)** — Used in Europe to prove it is really the cardholder: 2 of 3 (something you know, have, are).
- note: with 3DS, fraud liability shifts to the issuer.

| Actor | Role |
|-------|-------|
| Cardholder | Owner of the card |
| Merchant | Sells; receives the money |
| Acquirer | The merchant's bank |
| Issuer | The cardholder's bank; approves or declines |
| Scheme | Visa / Mastercard: rules and network |
| PSP | Stripe, Adyen, RocketGate: connects the merchant to the acquirer |

**State machine** — Used to allow only the moves in a table and refuse the rest.
- Example: `transition(p0, "captured", 8 * DAY)` throws: expired → captured.
- In an interview: "I model the payment as a state machine with allowed transitions. A late capture is an illegal transition, not a stray if."

→ `04-Payments.js` §3 (state machine with an expiry guard)

---

## §4 Idempotency

**Idempotency** — Used to make sure the same request only has its effect once, even if it is sent twice.
- note: networks fail and the client retries. Without it, you charge twice.

**Idempotency key** — Used to tag a request so a retry can be recognised.
- Example: the client generates a UUID v4. Stripe: `Idempotency-Key` header, up to 255 chars.

**Request hash** — Used to catch the same key sent with a different body.
- Example: same key + different body → error (Stripe compares the parameters). In the `.js`: 422.

**Stored response** — Used to give a retry the **same** status + body, without running again.
- note: Stripe v1 stores 500s too.

**Unique lock** — Used to let the DB decide who wins when two requests arrive together.
- Example:
```sql
INSERT INTO idempotency_keys (key, request_hash, state)
VALUES ($1, $2, 'in_progress')
ON CONFLICT (key) DO NOTHING;      -- 0 rows = already exists → replay or 409
```
- note: check-then-insert is not enough; two requests can pass the check at the same time. Reserve **before** running.
- note: the second request gets 409 "in progress"; the client retries later.

**TTL** — Used to clean old keys. Stripe v1 may delete keys once they are ≥ 24 h old.

**Atomic write** — Used to save the effect (ledger) and the response in the same DB transaction.

**Natural idempotency** — Used when the data already has a unique id.
- Example: `UNIQUE(provider_event_id)` on webhooks; `UNIQUE(order_id)` on charges.
- In an interview: "An idempotency key with a unique constraint, reserved before the effect, with a request hash and a stored response for replay."

→ `04-Payments.js` §4 (two concurrent requests → 1 charge, 201 + 409; different body → 422)

---

## §5 Retries

**Retry** — Used to try again only when the error may go away on its own.
- note: bad retries knock over the service that is recovering, and duplicate charges.

| Retry | Don't retry |
|---------|-------------|
| Timeout, `ECONNRESET` | Validation 4xx |
| 5xx, 429 (respect `Retry-After`) | Issuer decline (`card_declined`) |
| — | Suspected fraud, stolen card |

- Example: `isRetryable({ status: 402, code: "card_declined" })` → `false`.

**Backoff + jitter** — Used to wait longer on each try, at a random time, so clients don't all retry at once.
- Example: `wait = random(0, min(cap, base·2^n))`. `backoff(3, () => 0.5)` → 400 ms.

**Retry budget** — Used to cap retries: a token bucket per client; no tokens, no retry.
- note: AWS: 3 attempts × 5 layers = **243×** load on the DB.

**One layer** — Used to keep retries in a single place. Nested retries multiply.

**Unknown outcome** — Used for a timeout where you don't know if the charge happened.
- Example: timeout after charging → `psp.find(key)` before the retry → 1 charge.
- note: timeout ≠ failure. The PSP may have charged and the response got lost.
- note: check the status at the PSP with the **same** key. If you can't, mark it `unknown` and let reconciliation decide.
- In an interview: "I only retry transient errors, with backoff and jitter, in one layer, within a budget. A timeout is an unknown outcome: I check before retrying."

→ `04-Payments.js` §5

---

## §6 Concurrency

**Race on a balance** — Used to name the bug where two requests change the same balance at the same time.
- Example: two €30 withdrawals from €50 both go through (double-spend).
- note: the trap is read → check in code → write. Between the read and the write, the world changed.

**Conditional update** — Used for the simple case: atomic on one row.
- Example: `UPDATE ... SET balance = balance - $x WHERE balance >= $x`.

**Optimistic lock (`version`)** — Used when conflicts are rare: write only if the version is still the one you read.
- Example:
```sql
UPDATE accounts SET balance = $new, version = version + 1
WHERE id = $id AND version = $read_version;   -- 0 rows → conflict, re-read
```

**`SELECT ... FOR UPDATE`** — Used when many requests hit one account: lock the row first.
- Example:
```sql
BEGIN;
SELECT balance FROM accounts WHERE id = $id FOR UPDATE;
-- validate and insert the ledger entries
COMMIT;
```
- note: lock in id order to avoid deadlock.

**`SERIALIZABLE`** — Used when the rule spans several rows. Be ready to retry on serialization errors.

**Unique constraint** — Used when "only one can win": idempotency, one refund per payment.

**One writer per account** — Used to remove the race instead of managing it (queue/partition by `account_id`).
- note: **[inferred]** It is a common pattern in high-volume ledgers.

**Go mutex** — `sync.Mutex` protects one process's memory, not a DB shared by several replicas.
- In an interview: "The DB is the referee: a conditional update, a version, or FOR UPDATE. I never check the balance in code between a read and a write."

→ `04-Payments.js` §6 (lost update reproduced and fixed with `version`)

---

## §7 Consistency across systems

**Consistency** — Used to keep the ledger, PSP, queue and emails in agreement without a distributed transaction.
- note: "I wrote to the DB but the event never went out" (or the reverse) is the classic bug.
- note: the trap is `db.commit(); kafka.publish()` — if the process dies in between, the event is lost.

**Outbox** — Used to send an event safely: write it to an `outbox` table in the **same** transaction; a relay publishes it later.

**At-least-once** — Used to describe delivery where an event may arrive 2×. So the consumer must be idempotent.

**Idempotent consumer** — Used to process each event once: `UNIQUE(event_id)` in a `processed_events` table, inside the effect's transaction.

**Kafka ordering** — Used to keep one account's events in order.
- Example: key = `account_id`. Ordering only holds within a partition.

**Saga** — Used to undo a multi-step flow with **compensations** (refund, release the hold), not a rollback.

**Webhooks** — Used by a PSP to tell you something happened.
- Example: verify the HMAC signature; dedupe by id; reply 2xx fast and process from a queue.
- note: they can arrive out of order — `refunded` before `succeeded`. Use the state machine (§3) and ignore backward moves, or re-read the object from the API.

**Exactly-once** — In practice = at-least-once + idempotency.
- In an interview: "Outbox to publish, idempotent consumers to receive, sagas with compensations across services. Exactly-once is at-least-once plus dedupe."

---

## §8 Reconciliation & settlement

**Reconciliation** — Used to compare your ledger with the PSP's reports and the bank statement.
- note: it is the safety net. It catches what idempotency and retries missed.
- note: never reconcile on the day's total. Go line by line, by reference.

| Step | What to do |
|-------|---------|
| Match | By external id (charge id, end-to-end id), then amount + currency + date |
| Differences | Missing at the PSP, missing on our side, different amount, duplicate |
| Fees | Settlement arrives **net** of fees: post the fee to the ledger |
| Timing | T+1 / T+2: the money arrives days after capture |
| Exceptions | A queue for humans; never "adjust" a balance by hand without a posting |

**FX record** — Used to make a converted amount reproducible: store the rate, its source, the timestamp and the amount in both currencies.
- note: never recalculate later.

**Rate fallback** — Used when the rate source fails: a secondary source with a maximum age; if both fail, refuse rather than make one up.

**FX rounding** — Convert into the minor unit with half-even (§1) and record the result.
- In an interview: "Daily reconciliation, line by line, by external reference. For FX I store the rate, the source and the time — the amount must be reproducible."

---

## §9 Rails and a short glossary

| Term | One line |
|-------|-----------|
| SEPA SCT | Euro bank transfer; settles the next business day |
| SEPA SCT Inst | Instant, 24/7, ≤ 10 s; IPR (EU) 2024/886 has required it of euro-area PSPs since 9 Oct 2025 |
| SEPA SDD | Direct debit; needs a mandate; the debtor can dispute it |
| SWIFT | Messaging network between banks (international); does not move money by itself |
| ISO 20022 | XML message standard. `pain` customer↔bank, `pacs` bank↔bank, `camt` statements |
| Examples | `pain.001` order, `pacs.008` transfer, `pacs.002` status, `camt.053` statement |
| Card schemes | Visa, Mastercard, Amex: rules, network, interchange fees |
| IBAN / BIC | Account id / bank id |
| KYC / AML | Know your customer / anti-money laundering (screening, monitoring) |
| PCI DSS | Rules for card data. **Never** store the full PAN or the CVV |
| Tokenisation | The PSP stores the card; you store a token (`pm_...`) |

- **[inferred]** The ISO 20022 examples above are from memory; the official page (iso20022.org) returned 403.
- In an interview: "Cards are authorisation plus deferred settlement; SEPA Inst is push and final within seconds. I don't store the PAN or CVV — I tokenise at the PSP."

---

## §10 Thought Machine / Vault in 10 lines

1. **Vault Core** is the core banking platform: ledger + products. **Vault Payments** is a separate product (payment processing).
2. **Real-time ledger**, a "single source of truth", holding funds in any **asset and denomination** (currencies, crypto, points).
3. **No batch** says the 2023 brochure; the 2025 whitepaper already measures low-priority "offline" postings.
4. **Products = smart contracts** in Python (a sandboxed subset), in the "Universal Product Engine". The bank changes them without touching the platform code.
5. **Contracts are versioned and immutable**; each account stays on the version it was opened with. **Supervisor contracts** run several contracts together.
6. A synchronous **Postings API** (target < 100 ms) moves funds; contracts also create postings (e.g. daily interest).
7. **Stack:** microservices, Kubernetes, Istio, **Kafka**; real-time data streaming; cloud-agnostic.
8. **Measured scale:** 4,769 TPS online (p95 < 500 ms), 15,035 TPS balance enquiries, 30 M accounts.
9. **[inferred — docs behind a login]** Postings are grouped into a *Posting Instruction Batch*; types such as authorisation, settlement, release, transfer, hard settlement, custom.
10. **[inferred — docs behind a login]** Balance indexed by account + address + asset + denomination + phase (`committed`, `pending_in`, `pending_out`). My mini-ledger (§2) mimics this.

- In an interview: "Vault is a real-time ledger where the product is versioned code. My part would be making sure every posting is atomic, idempotent and balanced."

---

## §11 Bridge to your experience

> ⚠️ The "Model line" column is an example of how to name the concept. Check in the code what you actually did before you say it.

| What you did | Concept | Model line |
|---------------|------------------------|-------|
| Rebill failure notifications (RocketGate, Paynova) | Decline vs temporary error; webhooks; recurring MIT | "Only a technical failure is retried, never an issuer decline." |
| Top Up pricing and discounts | Cents; rounding; allocation | "Discounts as integers, rounded once, with an explicit rule." |
| FX rate fallback | Rate source; max age; reproducible | "I store the rate and its source, so the amount can be audited." |
| Cancellation + refund (Duffel) | Refund as a saga compensation | "The refund is a compensation step, not a rollback." |
| Late authorisation guard | Auth lifecycle; state machine | "Capturing after expiry is an illegal transition." |
| Nested retries | Retry storm; budget; one layer | "Nested retries multiply load; I moved them into one layer." |
| "Charged N, delivered N" hotfix | Idempotency + atomic charge and delivery | "One key ties charge and delivery; a retry duplicates neither." |

- Rule: tell the real story in your own words; use the "Concept" column to name the pattern.
- Go vs TypeScript: same concepts. Say "in Go I'd do the same with `database/sql` and a transaction".

---

## §12 Likely questions + short answer

| Question | Short answer |
|----------|----------------|
| How do you avoid charging twice? | Idempotency key with `UNIQUE`, reserved before the charge, passed to the PSP, response saved for replay. |
| The PSP timed out. Do you retry? | Not blindly. I look it up by id/key; if unclear, mark it `unknown` and let reconciliation decide. |
| Two withdrawals at the same time? | Conditional update or `version`; under heavy load, `FOR UPDATE` or one writer per account. |
| How do you store money? | Integer in the minor unit + currency; ISO 4217 exponent; half-even; allocate the remainder. |
| How do you fix a wrong transaction? | A reversal: a new, opposite transaction with a reference. The ledger is append-only. |
| How do you make sure an event goes out after a write? | Outbox in the same transaction + a relay; idempotent consumers. |
| How do you keep per-account order in Kafka? | Partition key = `account_id`; the consumer reads the partition in order. |
| Which errors do you retry? | Timeouts, 5xx, 429 — with backoff, jitter and a budget. Never declines or 4xx. |
| A webhook arrived twice / out of order? | Verify the signature, dedupe by event id; the state machine ignores backward moves. |
| Available balance vs balance? | Available = settled − outgoing holds. Incoming pending doesn't count. |

---

## Sources

- Stripe — Idempotent requests: https://docs.stripe.com/api/idempotent_requests
- Stripe — PaymentIntent lifecycle: https://docs.stripe.com/payments/paymentintents/lifecycle
- Stripe — Place a hold (auth/capture, validity): https://docs.stripe.com/payments/place-a-hold-on-a-payment-method
- AWS Builders' Library — Timeouts, retries and backoff with jitter: https://builder.aws.com/content/3EumjoZascWd1oZiEgL8ORlv3qE/timeouts-retries-and-backoff-with-jitter
- Thought Machine — Vault Core (current accounts): https://www.thoughtmachine.net/vault-core/current-and-transaction-accounts
- Thought Machine — Vault Pre-NDA brochure 2023 (PDF): https://info.thoughtmachine.net/hubfs/Vault_Pre_NDA_RGB_2023.pdf
- Thought Machine — Performance whitepaper: https://www.thoughtmachine.net/whitepapers/performance-proven-the-right-way
- Thoughtworks Radar — Thought Machine Vault: https://www.thoughtworks.com/radar/platforms/thought-machine-vault
- FF News — "We built this bank on smart contracts": https://ffnews.com/thought-leadership/we-built-this-bank-on-smart-contracts
- SEPA Inst 2025 (secondary; EPC returned 403): https://www.aciworldwide.com/blog/sepa-instant-payments-whats-new-in-rulebook-2025-and-why-it-matters
- **Not accessible:** official Vault docs (`docs.thoughtmachine.net` → login). Items 9–10 of §10 are **[inferred]**.
