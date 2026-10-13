# Agentic pairing interview packet

A 45-minute pairing interview built on Pivotal's RPI, rebuilt for engineers
who work with coding agents. The full interviewer guide (script, hint ladders,
rubric, decision guidance, pilot plan) lives in the shared doc. This zip holds
the files.

- `candidate-repo/` is the only folder a candidate ever sees. Copy it into a
  clean hosted environment and run `npm install` before the session.
- `interviewer-kit/` is for interviewers only: stage cards, flaw key, hidden
  acceptance suite, scoring script, reference solution and scoresheet.

Quick check before the first session:

```bash
cd candidate-repo && npm install
npm test            # 4 pass
npm run warmup      # 1 fails (on purpose)
cd ../interviewer-kit
./score.sh ../candidate-repo   # untouched draft: core 6/15, ttl 5/12
```

To calibrate the perf check on your machine, copy `reference/lruCache.ts` over
a scratch copy of the candidate repo's `src/lruCache.ts` and run `score.sh`
against it. It should pass everything.

Requires Node 20 or newer and bash (macOS, Linux, or WSL/Git Bash on Windows).
