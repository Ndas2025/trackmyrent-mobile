# Android and iOS builds

## Build profiles

- `development`: custom development client for device testing.
- `preview`: internally distributed Android APK and iOS ad hoc build.
- `production`: store-ready Android App Bundle and signed iOS archive.

## Recommended order

1. Finish app changes and run type-checking.
2. Run a local web preview while iterating on UI changes.
3. Run a preview build for internal testing.
4. Complete physical-device QA.
5. Fix release blockers.
6. Run production builds only after QA passes.

## Local web preview

Use this when you want a quick browser-based preview without depending on Metro's file watcher limits.

1. From the app folder, run `pnpm local:preview:web`.
2. Open `http://127.0.0.1:4173` in your browser.
3. After each UI change, stop the command and run it again to refresh the exported preview.

### Notes

- This preview is meant for UI review and responsive checks.
- It avoids the common macOS `EMFILE` watcher error that blocks `expo start --web` on machines without Watchman.
- For device testing or hot reload, use the normal Expo commands after installing Watchman.

## Fast preview build checklist

Use this when you want to send a fresh installable demo to colleagues.

### One-time setup

1. Run `eas login` with the Expo account that owns this app.
2. Run `eas init` and accept the existing EAS project.
3. If iPhone testers will install the build, register each device first with `eas device:create`.
4. Add any required production environment values with `eas env:create`.

### Before each demo build

1. Run `pnpm typecheck`.
2. Make sure the app version and preview changes are committed or saved locally.
3. Export your Expo token in the same terminal session:
   - `export EXPO_TOKEN=your_expo_access_token`
4. Build the preview app:
   - Android APK: `pnpm preview:build` or `pnpm preview:build:android`
   - iOS first-time credential/device setup: `pnpm preview:build:ios:setup`
   - iOS after setup is complete: `pnpm preview:build:ios`
   - Both after iOS setup is complete: `pnpm preview:build:all`
5. Share the resulting EAS build links with your colleagues.

### Notes

- Android preview builds are distributed as APK files.
- iOS preview builds are ad hoc builds and require registered test devices. The first iOS run must be interactive so EAS can create or select the right Apple credentials.
- The preview helper creates local Expo cache/config folders inside the project so the build does not depend on restricted macOS library paths.
- The preview helper adds local `node` and `npx expo` shims so EAS can read the Expo app config even if Node is not installed globally in your terminal.
- The build scripts already pre-allow pnpm's `dtrace-provider` native package so you should not have to answer an interactive approval prompt.
- Production builds are only for App Store / Play Store release.
- Never commit `.env`, signing certificates, provisioning profiles, keystores, or service-account files.

## Production build checklist

Use this only after internal QA is complete.

### Before production builds

1. Confirm the final app identifiers are correct in `app.json`.
2. Confirm the Supabase production environment values are configured.
3. Confirm support email, support URL, and privacy policy URL are final.
4. Confirm store screenshots and metadata match the current product behavior.
5. Confirm the current branch is the intended release candidate.

### Production build commands

- Android App Bundle: `pnpm build:android`
- iOS archive: `pnpm build:ios`
- Both: `pnpm build:all`

### After production builds

1. Download and validate the generated artifacts.
2. Upload Android to Google Play internal testing first.
3. Upload iOS to App Store Connect / TestFlight.
4. Perform release-candidate testing from the real installable builds.
