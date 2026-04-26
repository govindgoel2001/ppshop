#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")/.."
node --test --test-reporter=spec tests/unit/*.test.js
