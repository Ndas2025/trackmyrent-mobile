#!/bin/sh

set -eu

ROOT_DIR=$(
  CDPATH= cd -- "$(dirname -- "$0")/.." && pwd
)

cd "$ROOT_DIR"

if [ -z "${EXPO_TOKEN:-}" ]; then
  printf '%s\n' "EXPO_TOKEN is required. Export your Expo access token before running the preview build." >&2
  exit 1
fi

PLATFORM="${EAS_PLATFORM:-android}"
PROFILE="${EAS_PROFILE:-preview}"
LOCAL_HOME="${EAS_LOCAL_HOME:-$ROOT_DIR/.expo-preview-home}"
LOCAL_BIN="$LOCAL_HOME/.bin"
RUNTIME_BIN="/Users/naveendasn/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin"
LOCAL_NODE_BIN="/Users/naveendasn/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node"
LOCAL_NODE_DIR=$(dirname "$LOCAL_NODE_BIN")
LOCAL_EAS_BIN="${ROOT_DIR}/node_modules/.pnpm/eas-cli@16.32.0_@types+node@26.1.0_typescript@5.9.3/node_modules/eas-cli/bin/run"
LOCAL_EXPO_BIN="${ROOT_DIR}/node_modules/.bin/expo"
NON_INTERACTIVE_FLAG="${EAS_NON_INTERACTIVE:-1}"

export HOME="$LOCAL_HOME"
export XDG_CACHE_HOME="${XDG_CACHE_HOME:-$LOCAL_HOME/.cache}"
export XDG_CONFIG_HOME="${XDG_CONFIG_HOME:-$LOCAL_HOME/.config}"

mkdir -p "$HOME" "$XDG_CACHE_HOME" "$XDG_CONFIG_HOME" "$LOCAL_BIN"

if [ -x "$LOCAL_NODE_BIN" ]; then
  ln -sf "$LOCAL_NODE_BIN" "$LOCAL_BIN/node"
fi

if [ -x "$LOCAL_EXPO_BIN" ]; then
  {
    printf '%s\n' '#!/bin/sh'
    printf '%s\n' 'if [ "$1" = "expo" ]; then'
    printf '%s\n' '  shift'
    printf '  exec "%s" "$@"\n' "$LOCAL_EXPO_BIN"
    printf '%s\n' 'fi'
    printf '%s\n' 'exec pnpm dlx "$@"'
  } > "$LOCAL_BIN/npx"
  chmod +x "$LOCAL_BIN/npx"
fi

export PATH="$LOCAL_BIN:$LOCAL_NODE_DIR:$RUNTIME_BIN:$ROOT_DIR/node_modules/.bin:$PATH"

if [ "$NON_INTERACTIVE_FLAG" = "1" ]; then
  export CI=1
  BUILD_MODE_FLAG="--non-interactive"
else
  unset CI
  BUILD_MODE_FLAG=""
fi

if [ -f "$LOCAL_EAS_BIN" ] && [ -x "$LOCAL_NODE_BIN" ]; then
  "$LOCAL_NODE_BIN" "$LOCAL_EAS_BIN" build --platform "$PLATFORM" --profile "$PROFILE" $BUILD_MODE_FLAG "$@"
else
  pnpm --allow-build=dtrace-provider dlx eas-cli build --platform "$PLATFORM" --profile "$PROFILE" $BUILD_MODE_FLAG "$@"
fi
