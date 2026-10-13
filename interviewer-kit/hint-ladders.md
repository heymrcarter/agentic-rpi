# Hint ladders

**Interviewer eyes only.** Keep this open beside `stage-cards.md` during the
session.

The RPI gave candidates multiple chances, and so do we. When a candidate is
stuck, climb one rung at a time. Each rung gives away a little more than the
last.

## How to use them

- **Wait before the first rung.** Give them about 2 minutes of real
  stuckness (silence, circling, or asking for help) before rung 1.
- **One rung at a time.** Wait about 2 minutes between rungs. Let them work
  with each hint before you give the next.
- **Say it as a teammate would.** The wording below is a guide. Keep the
  content, but say it in your own voice.
- **Record the highest rung used in each part** on the scoresheet.
- **Never skip to the answer.** If rung 4 doesn't land, note it and move on
  to the next part when time's up.
- **Tool mechanics aren't hints.** Help freely with things like approving an
  edit or opening a diff. That's never recorded.

## How rungs affect the score

| Highest rung used in a part | Effect on that part's main dimensions |
|---|---|
| None, 1 or 2 | No effect. This is normal pairing. |
| 3 | Those dimensions cap at 3. |
| 4 | Those dimensions cap at 2, unless they then go clearly beyond the hint. |

The main dimensions for each part are:

- **Part 1:** Code comprehension.
- **Part 2:** Tests as the spec, Steering the agent, Verification, and Design
  judgment.
- **Part 3:** Adaptability and Design judgment.

## Part 1: Review (agent closed)

**Target:** finding the planted flaws by reading the spec against the code.
See `flaw-key.md`.

1. "Take one line of the spec and check it against the code."
2. "What happens to recency when we call `get`?" *(points at F1)*
3. "Walk me through `order` if I call `set('a', 1)` twice." *(points at F2/F3)*
4. "What does `new LRUCache(0)` do?" *(points at F4)*

At 10 minutes, say "Great. Let's turn that into a fix." and move on, wherever
they are.

## Part 2: Fix (agent open)

**Target:** test-first fixes, a verified agent, and an O(1) structure.

1. "How will we know it's fixed, and that it stays fixed?" *(tests first)*
2. "What did the agent actually change? Let's look at the diff together."
   *(verification)*
3. "Is there anything in the spec about performance?" *(F6, the O(n) order)*
4. "JavaScript `Map`s keep insertion order. Does that help?" *(the O(1)
   design)*

**If they finish early:** ask what tests they'd still add, or how they'd test
that `has` doesn't change recency. These questions aren't hints and don't
count as rungs.

## Part 3: Change (TTL)

**Target:** deterministic time in the tests, and the "expired entries never
evict live ones" rule.

1. "How will you test this without waiting?"
2. "What happens to the test suite if it depends on the real clock?"
3. "What if the cache took a `now()` function in its constructor?" *(the
   injectable clock)*
4. "Read the last bullet on the card again. Is there a test for it?"
   *(expired-evicts-live)*

Note: rung 4 points at a different gap than rungs 1–3. If the candidate
already has deterministic time but missed the eviction rule, you can go
straight to rung 4. Record it as rung 4.

## Wrap-up

No ladder here. If they're vague, one neutral follow-up is fine: "Anything
specific you'd want someone else to double-check?"
