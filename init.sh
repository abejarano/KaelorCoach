#!/usr/bin/env bash
set -euo pipefail

echo "== Kaelor Coach Harness Init =="

required_files=(
  "README.md"
  "AGENTS.md"
  "CODEX.md"
  "feature_list.json"
  "docs/PRODUCT.md"
  "docs/ARCHITECTURE.md"
  "docs/PERSISTENCE.md"
  "docs/FRONTEND_GUIDE.md"
  "docs/conventions.md"
  "docs/verification.md"
  ".codex/agents/leader.md"
  ".codex/agents/implementer.md"
  ".codex/agents/reviewer.md"
  ".agents/skills/repo-reader/SKILL.md"
  ".agents/skills/frontend-flutter/SKILL.md"
  ".agents/skills/health-safety-reviewer/SKILL.md"
  ".agents/skills/code-reviewer/SKILL.md"
  "progress/current.md"
  "progress/history.md"
)

for file in "${required_files[@]}"; do
  if [ ! -f "$file" ]; then
    echo "ERROR: missing required file: $file"
    exit 1
  fi
done

python3 - <<'PY'
import json
from pathlib import Path
p = Path('feature_list.json')
data = json.loads(p.read_text())
features = data.get('features', [])
inprogress = [f for f in features if f.get('status') == 'inprogress']
if len(inprogress) > 1:
    raise SystemExit('ERROR: more than one feature is inprogress')
ids = [f.get('id') for f in features]
if len(ids) != len(set(ids)):
    raise SystemExit('ERROR: duplicate feature ids')
print(f'feature list ok: {len(features)} features')
PY

echo "OK: harness green"
