# Flaw key: the agent-drafted LRU cache

**Interviewer eyes only.** These are the problems planted in
`candidate-repo/src/lruCache.ts`. The draft looks tidy, has confident doc
comments, and its four tests pass. Every flaw below breaks a line of the
README spec (or the non-functional requirement), so a candidate can find all
of them by reading the spec against the code. They don't need insider
knowledge.

| ID | Flaw | Spec line it breaks | Weight |
|---|---|---|---|
| F1 | `get` never updates recency, so eviction is FIFO, not LRU. The class comment says LRU anyway. | "Reading a key makes it the most recently used." | High |
| F2 | Updating an existing key pushes a duplicate into `order`. `size` over-counts, and a stale duplicate later evicts the live key too early. | "Replacing an existing key never evicts anything." / `size` | High |
| F3 | The capacity check runs before checking whether the key already exists, so updating a key in a full cache evicts an unrelated key. | "Replacing an existing key never evicts anything." | High |
| F4 | No capacity validation. Capacity 0 still stores one item. `NaN` never evicts at all, so the cache is unbounded. | "Anything else throws a `RangeError`." | Medium |
| F5 | `this.order.shift() as K` silences the compiler about `undefined`. This is how F4 slips through quietly. | (code health) | Signal |
| F6 | The array-based order is O(n) for `shift`, and the obvious fix for F1 (`indexOf` + `splice`) is O(n) per read. A `Map` alone gives O(1), because it keeps insertion order. | "constant time on average… tens of thousands of entries" | Medium |
| F7 | The agent's tests cover only the happy path. "The tests pass" is not evidence that the code meets the spec. | (process) | Signal |

## What good looks like in Part 1 (agent closed)

- **Strong:** finds F1 and at least one of F2/F3 by reading. Raises capacity
  validation or the `as K` cast. Says the tests don't cover recency or
  updates. Spots or asks about the O(n) order array.
- **Solid:** finds F1, or finds F2/F3 after one hint. Notices the tests are thin.
- **Weak:** reads the passing tests and the doc comment and concludes it's
  ready. Can't trace what `set` does to `order` on an update, even with hints.

## What good looks like in Part 2 (agent open)

- Writes, or has the agent write, a **failing test for each flaw first**, then
  asks for the fix. The tests are the steering wheel.
- Reads the diff, not just the agent's summary. Checks that the agent didn't
  weaken or delete tests to get green.
- Notices when the agent's first fix for F1 is `indexOf`/`splice`, and pushes
  back using the constant-time requirement. Bonus if they know the `Map` trick.

## What good looks like in Part 3 (TTL)

- Asks how expiry will be tested, or volunteers an injectable clock or fake
  timers. **Big signal:** they reject tests that `sleep` or `setTimeout` for
  real.
- Covers the "expired entry must not evict a live one" rule with a test. This
  is the line most people (and agents) miss.
- Re-scopes deliberately. They don't pile prompts onto a degrading design.

## Hidden suite map

`./score.sh` groups results as **core** (spec, Parts 1–2), **ttl** (Part 3)
and **perf** (informational). Against the untouched draft: core 6/15,
ttl 5/12, perf passes. A correct but `indexOf`-based fix scores core 15/15
and fails perf. The reference solution passes everything. Perf timings depend
on the machine, so run `score.sh` against `reference/` once on your own
laptop to calibrate.
