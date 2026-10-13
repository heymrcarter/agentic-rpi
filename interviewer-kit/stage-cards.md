# Stage cards

Paste each card into the meeting chat at the start of its part, word for
word. Don't paste a card early.

---

## Warm-up (5 min, not scored)

> Before we start, let's make sure the tools feel normal. Run
> `npm run warmup`. One test fails. Use the agent to make it pass, however
> you'd normally work. This part isn't scored.

---

## Part 1: Review (10 min, agent closed)

> Our team asked a coding agent for a fixed-capacity LRU cache. Its draft
> is in `src/lruCache.ts` and its tests pass. Before it merges, we want your
> read.
>
> For this part, please **keep the agent closed**. Read the code and tests
> against the spec in the README and talk me through it. You're welcome to
> run the tests or add a quick experiment yourself. What would you say in
> code review?

---

## Part 2: Fix (15 min, agent open)

> Thanks. Let's get the cache to meet the spec. Use the agent however you
> would at work, and type code yourself whenever you prefer.
>
> By the end of this part, I'd like the test suite to be something you'd
> trust if you were on call for this code.

---

## Part 3: Change (12 min)

> The product owner here. Good news: the cache is popular. New requirement,
> entries need to be able to expire.
>
> - `set(key, value, ttlMs?)` takes an optional time-to-live in
>   milliseconds. If given, it must be a positive, finite number; otherwise
>   throw a `RangeError`.
> - With no `ttlMs`, an entry never expires.
> - An expired entry behaves exactly as if it was never there: `get` returns
>   `undefined`, `has` returns `false`, and it isn't counted in `size`.
> - Setting an existing key replaces its value **and** its TTL. Setting it
>   with no `ttlMs` clears any expiry.
> - An expired entry must never cause a live entry to be evicted.
>
> You can add constructor options if you need them, but keep the `set`
> signature above.

---

## Wrap-up (3 min)

> We're merging this today. What would you check, or want someone else to
> check, before it ships? And looking back: where did the agent help you
> most, and where did you have to correct it?

---

## Product-owner answers to likely questions

Give these answers if asked. Don't volunteer them.

| Question | Answer |
|---|---|
| Should `has` refresh recency? | No. It's in the spec. |
| Thread safety / concurrency? | Out of scope. Single-threaded JavaScript. |
| Can a value be `undefined`? | Out of scope. Don't worry about it. |
| Should I add `delete` / `clear`? | Not needed today. |
| Can I change the constructor? | Yes, adding an options argument is fine. Keep `new LRUCache(capacity)` working. |
| Should expired entries be cleaned up with timers? | Your call, as long as behaviour matches the card. (Follow up: what does a background timer cost a library user?) |
| How should we test expiry? | Ask them what they'd prefer. If they're stuck, see the Part 3 hint ladder in the guide. |
| Is exactly `ttlMs` milliseconds later expired? | Your call. Just be consistent and test it. |
