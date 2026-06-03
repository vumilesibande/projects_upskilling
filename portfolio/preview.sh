#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")"
if [ -f package.json ]; then
  if [ ! -d node_modules ]; then
    npm install --no-fund --no-audit
  fi
  npm run build:css --silent
fi
PORT="${PORT:-8765}"
echo "Portfolio: http://localhost:${PORT}"
echo "Press Ctrl+C to stop."
exec python3 -m http.server "$PORT"
