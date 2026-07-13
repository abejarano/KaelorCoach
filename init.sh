#!/usr/bin/env bash
set -euo pipefail

echo "== Kaelor Coach Harness Init =="

required_files=(
  "AGENTS.md"
  "CODEX.md"
  "docs/PRODUCT.md"
  "docs/ARCHITECTURE.md"
  "docs/PERSISTENCE.md"
  "docs/FRONTEND_GUIDE.md"
  "docs/conventions.md"
  "docs/verification.md"
  "feature_list.json"
  ".codex/agents/leader.md"
  ".codex/agents/implementer.md"
  ".codex/agents/reviewer.md"
)

for file in "${required_files[@]}"; do
  if [ ! -f "$file" ]; then
    echo "ERROR: missing required file: $file"
    exit 1
  fi
done

if ! command -v node >/dev/null 2>&1; then
  echo "ERROR: node is required to validate feature/issue linkage"
  exit 1
fi

node scripts/check-feature-issues.mjs

echo "OK: harness structure is valid"
