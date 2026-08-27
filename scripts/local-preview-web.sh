#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
APP_DIR="$ROOT_DIR/trackmyrent-mobile"
CODEX_RUNTIME_DIR="${HOME}/.cache/codex-runtimes/codex-primary-runtime/dependencies"

if command -v node >/dev/null 2>&1; then
  NODE_BIN_DIR=""
elif [ -x "$CODEX_RUNTIME_DIR/node/bin/node" ]; then
  NODE_BIN_DIR="$CODEX_RUNTIME_DIR/node/bin"
else
  echo "Node.js was not found."
  echo "Install Node.js 24+ and pnpm, then retry."
  exit 1
fi

if command -v pnpm >/dev/null 2>&1; then
  PNPM_BIN_DIR=""
elif [ -x "$CODEX_RUNTIME_DIR/bin/pnpm" ]; then
  PNPM_BIN_DIR="$CODEX_RUNTIME_DIR/bin"
else
  echo "pnpm was not found."
  echo "Install pnpm 11+ and retry."
  exit 1
fi

if command -v python3 >/dev/null 2>&1; then
  PYTHON_BIN="python3"
elif [ -x "$CODEX_RUNTIME_DIR/python/bin/python3" ]; then
  PYTHON_BIN="$CODEX_RUNTIME_DIR/python/bin/python3"
else
  echo "python3 was not found."
  echo "Install Python 3, then retry."
  exit 1
fi

export PATH="$PNPM_BIN_DIR:$NODE_BIN_DIR:$APP_DIR/node_modules/.bin:$PATH"
export HOME="$ROOT_DIR/.expo-home"
export EXPO_HOME="$ROOT_DIR/.expo-home/.expo"
export XDG_CONFIG_HOME="$ROOT_DIR/.expo-home"
export PNPM_HOME="$ROOT_DIR/.pnpm-cache"
export XDG_CACHE_HOME="$ROOT_DIR/.pnpm-cache"
export npm_config_store_dir="$ROOT_DIR/.pnpm-store"
export EXPO_NO_TELEMETRY=1
export CI=true
export npm_config_confirm_modules_purge=false
export npm_config_node_linker=hoisted

mkdir -p "$HOME" "$EXPO_HOME" "$PNPM_HOME" "$npm_config_store_dir"

cd "$APP_DIR"

pnpm install --node-linker=hoisted >/dev/null
pnpm exec expo export --platform web --output-dir "$ROOT_DIR/output/web-preview"

cd "$ROOT_DIR/output/web-preview"
echo "Preview: http://127.0.0.1:4173"
"$PYTHON_BIN" -m http.server 4173 --bind 127.0.0.1
