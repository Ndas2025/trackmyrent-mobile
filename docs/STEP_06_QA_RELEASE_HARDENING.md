# Step 6: QA and Release Hardening

Date: August 27, 2026

## Objective

Turn the current app into a testable release candidate with a repeatable QA flow, explicit release blockers, and a clear path to Android internal testing and iOS TestFlight preparation.

## Current status

- Repository foundation is in place.
- Release scope is defined.
- Backend and auth scaffolding are wired into the app.
- Core navigation and data flow are mostly connected.
- Shared loading and sync-error states now exist for the main CRUD flows.

## What this step covers

- Manual QA checklist creation
- Release readiness tracking
- Production build instructions
- Store-submission blocker visibility

## What still blocks release today

### Product and backend blockers

- Supabase production project still needs to be configured with real environment values.
- Account deletion is not yet implemented as a true end-to-end production flow.
- Reviewer demo account still needs to be created with safe sample data.

### QA blockers

- Physical Android and iPhone device testing is still pending.
- First-run and returning-user flows need manual validation with real auth enabled.
- Offline and backend-failure behavior still needs manual verification on device.

### Store blockers

- Support email, support URL, privacy policy URL, legal business name, and postal address are still placeholders.
- Google Play and App Store metadata need final review against the production build.
- Production `.aab` and `.ipa` are not yet generated and validated.

## Expected outcome of this step

Step 6 is complete when we can answer these questions clearly:

1. What exactly must be tested before internal release?
2. What exactly still blocks Play Store and App Store submission?
3. What exact build path should be used for preview and production?

The documents in this step answer those three questions directly.
