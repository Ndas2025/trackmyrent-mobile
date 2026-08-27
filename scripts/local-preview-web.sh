#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
APP_DIR="$ROOT_DIR/trackmyrent-mobile"
RUNTIME_DIR="$HOME/.cache/codex-runtimes/codex-primary-runtime/dependencies"

if [ ! -x "$RUNTIME_DIR/bin/pnpm" ] || [ ! -x "$RUNTIME_DIR/node/bin/node" ]; then
  echo "Bundled Codex runtime not found."
  echo "Run this app with your own local Node.js and pnpm, or open the repo in Codex and retry."
  exit 1
fi

export PATH="$RUNTIME_DIR/bin:$RUNTIME_DIR/node/bin:$APP_DIR/node_modules/.bin:$PATH"
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
"$RUNTIME_DIR/python/bin/python3" -m http.server 4173 --bind 127.0.0.1
