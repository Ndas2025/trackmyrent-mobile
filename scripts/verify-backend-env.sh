#!/usr/bin/env sh
set -eu

ROOT_DIR="$(CDPATH= cd -- "$(dirname -- "$0")/.." && pwd)"
ENV_FILE="$ROOT_DIR/.env"

if [ ! -f "$ENV_FILE" ]; then
  echo "Missing .env file at $ENV_FILE"
  echo "Copy .env.example to .env first."
  exit 1
fi

echo "Checking backend environment in $ENV_FILE"

check_var() {
  name="$1"
  if grep -Eq "^${name}=.+$" "$ENV_FILE"; then
    echo "OK: $name is set"
  else
    echo "MISSING: $name"
    exit 1
  fi
}

check_var "EXPO_PUBLIC_SUPABASE_URL"
check_var "EXPO_PUBLIC_SUPABASE_ANON_KEY"
check_var "EXPO_PUBLIC_DEMO_MODE"

if grep -Eq "^EXPO_PUBLIC_DEMO_MODE=1$" "$ENV_FILE"; then
  echo "WARNING: demo mode is enabled. Real auth and live backend testing are bypassed."
else
  echo "OK: demo mode is disabled for live backend testing"
fi

echo "Backend environment looks ready for app-side testing."
