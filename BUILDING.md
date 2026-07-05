# Android and iOS builds

## Build profiles

- `development`: custom development client for device testing.
- `preview`: internally distributed Android APK and iOS ad hoc build.
- `production`: store-ready Android App Bundle and signed iOS archive.

## First-time setup

1. Run `eas login` with the Expo account that will own the app.
2. Run `eas init` and accept creation of the EAS project.
3. Add production Supabase variables with `eas env:create`.
4. Run `pnpm build:all`.

EAS will request Google Play and Apple signing credentials. Apple production builds require an active Apple Developer Program membership. Google Play publication requires a Play Console developer account.

Never commit `.env`, signing certificates, provisioning profiles, keystores, or service-account files.
