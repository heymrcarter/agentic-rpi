# Scoresheet: agentic pairing interview

Fill in the rubric scores from your notes **before** running `score.sh`.
Submit before the debrief.

| | |
|---|---|
| Candidate | |
| Interviewer | |
| Second scorer (if any) | |
| Date | |
| Agent + model + version | |
| Level being hired | |

## Where they got to

- [ ] Part 1 finished
- [ ] Part 2 finished
- [ ] Part 3 started
- [ ] Part 3 finished

## Flaws found in Part 1 (agent closed)

| Flaw | Found unaided | Found with a hint (rung) | Not found |
|---|---|---|---|
| F1 `get` doesn't refresh recency | | | |
| F2 update duplicates key in `order` | | | |
| F3 update in a full cache evicts another key | | | |
| F4 no capacity validation | | | |
| F5 `as K` hides `undefined` | | | |
| F6 O(n) order array | | | |
| F7 tests are happy-path only | | | |

## Highest hint rung used

| Part 1 | Part 2 | Part 3 |
|---|---|---|
| | | |

## Rubric (1–4, see the guide for anchors)

| Dimension | Score | One-line evidence (a moment, with a timestamp if you can) |
|---|---|---|
| Code comprehension | | |
| Tests as the spec | | |
| Steering the agent | | |
| Verification and calibrated trust | | |
| Design judgment | | |
| Adaptability | | |
| Collaboration and communication | | |
| **Total (out of 28)** | | |

## Red flags (any → debrief)

- [ ] Misrepresented what they or the agent did
- [ ] Knowingly kept a deleted or weakened test
- [ ] Dismissive or condescending toward the pair
- [ ] Moved interview material outside the provided environment

Notes:

## Hidden suite (run after scoring)

| core (/15) | ttl (/12) | perf (pass/fail, informational) |
|---|---|---|
| | | |

If the suite contradicts a rubric score, explain in one line (don't change the score silently):

## Recommendation

- [ ] Strong yes
- [ ] Yes (advance to pairing day)
- [ ] No
- [ ] Strong no

Why, in two sentences:
