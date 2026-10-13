#!/usr/bin/env bash
# Runs the hidden acceptance suite against a candidate's repo, then removes it.
#
#   ./score.sh path/to/candidate-repo
#
# Run this AFTER the session and AFTER you've filled in the rubric
# dimensions from your notes, so the test results don't anchor your judgment.
set -euo pipefail

KIT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO="${1:?usage: ./score.sh path/to/candidate-repo}"
REPO="$(cd "$REPO" && pwd)"
DEST="$REPO/test/__acceptance__"

if [[ ! -f "$REPO/src/lruCache.ts" ]]; then
  echo "No src/lruCache.ts in $REPO" >&2
  exit 1
fi

mkdir -p "$DEST"
cp "$KIT_DIR/hidden/acceptance.test.ts" "$DEST/acceptance.test.ts"
trap 'rm -rf "$DEST"' EXIT

cd "$REPO"
[[ -d node_modules ]] || npm install --no-audit --no-fund >/dev/null

JSON_OUT="$(mktemp)"
npx vitest run test/__acceptance__ --reporter=json --outputFile="$JSON_OUT" >/dev/null 2>&1 || true

node - "$JSON_OUT" <<'EOF'
const fs = require("fs");
const report = JSON.parse(fs.readFileSync(process.argv[2], "utf8"));
const groups = {};
const failures = [];
for (const file of report.testResults) {
  for (const t of file.assertionResults) {
    const group = (t.ancestorTitles[0] || "other").split(":")[0].trim();
    groups[group] ??= { passed: 0, total: 0 };
    groups[group].total++;
    if (t.status === "passed") groups[group].passed++;
    else failures.push(`  [${group}] ${t.ancestorTitles.join(" > ")} > ${t.title}`);
  }
  if (file.status === "failed" && file.assertionResults.length === 0) {
    console.log("The suite could not load. Check that src/lruCache.ts compiles and exports LRUCache.");
    console.log(file.message);
  }
}
console.log("Hidden acceptance results");
console.log("-------------------------");
for (const [g, r] of Object.entries(groups)) {
  const note = g === "perf" ? "  (informational only)" : g === "ttl" ? "  (only if Part 3 was reached)" : "";
  console.log(`${g.padEnd(6)} ${String(r.passed).padStart(2)} / ${r.total}${note}`);
}
if (failures.length) {
  console.log("\nFailed:");
  console.log(failures.join("\n"));
}
EOF
rm -f "$JSON_OUT"
