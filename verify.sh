#!/usr/bin/env bash
set -euo pipefail

./init.sh
node scripts/sync-features.mjs --check

echo "No runtime applications exist yet. Runtime verification is intentionally skipped."
echo "OK: project governance and harness verified"
