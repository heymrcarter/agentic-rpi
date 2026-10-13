# Pairing exercise: the agent-drafted LRU cache

Welcome. For the next 45 minutes you'll pair with your interviewer on a small
piece of real-feeling work. There are no trick questions and no brain teasers.
We're not measuring how fast you type. We want to see how you think, how you
work with a teammate, and how you work with a coding agent.

## How the session works

- **You drive.** You'll use the coding agent the way you would at work, and
  you can type code yourself whenever you prefer.
- **Your interviewer is your pair.** They'll also play product owner and hand
  you requirements as you go. Ask them anything.
- **Think out loud.** Narrate what you're looking at, what you expect and what
  surprises you. Silence is the only way to make this hard for us to score.
- **Getting stuck is normal.** Say so. Your pair will help, and recovering
  well counts in your favour.

| Part | Time | What happens |
|---|---|---|
| Warm-up | 5 min | Get comfortable with the agent on a throwaway task (not scored). |
| 1. Review | 10 min | Read the agent's first draft of the cache. **Agent closed for this part.** |
| 2. Fix | 15 min | Make the cache meet the spec, using tests and the agent. |
| 3. Change | 12 min | A new requirement arrives. |
| Wrap-up | 3 min | What would you check before shipping? |

## Commands

```bash
npm install
npm run warmup   # warm-up task only
npm test         # the cache's tests
npm run typecheck
```

## The background

Your team asked a coding agent for "a fixed-capacity LRU cache in TypeScript
with get, set, has and size." Its first draft is in `src/lruCache.ts`, along
with the tests it wrote in `test/lruCache.test.ts`. The tests pass. The team
wants your read on whether the draft is ready to merge.

## The spec (from the product owner)

`new LRUCache<K, V>(capacity)`

- `capacity` must be a positive integer. Anything else throws a `RangeError`.

`get(key): V | undefined`

- Returns the value, or `undefined` if the key isn't cached.
- Reading a key makes it the most recently used.

`set(key, value): void`

- Adds the key, or replaces its value if it's already cached.
- Writing a key makes it the most recently used.
- Adding a **new** key to a full cache evicts the least recently used entry.
- Replacing an **existing** key never evicts anything.

`has(key): boolean`

- Returns whether the key is cached. Does **not** change recency.

`size: number`

- The number of entries currently cached.

Non-functional: `get` and `set` should run in constant time on average. This
cache will hold tens of thousands of entries.
