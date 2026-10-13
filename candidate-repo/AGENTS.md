# Project guide for coding agents

This is a small TypeScript library with a Vitest test suite.

## Commands

- `npm test` runs the cache's tests (`test/`).
- `npm run warmup` runs the warm-up exercise (`warmup/`).
- `npm run typecheck` runs the TypeScript compiler without emitting.

## Conventions

- TypeScript strict mode. Keep the public API in `src/lruCache.ts` stable
  unless the developer asks to change it.
- Tests live in `test/` and use Vitest (`describe` / `it` / `expect`).
- Do not add runtime or dev dependencies.
- After changing code, run the relevant tests and report the actual result.
- Keep changes small and focused on what the developer asked for. If you
  notice an unrelated problem, mention it rather than fixing it unasked.
- The product spec is in `README.md`. When the spec and the code disagree,
  the spec wins; point out the disagreement.
