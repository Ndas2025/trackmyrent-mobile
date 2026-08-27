# TrackmyRent V1 Implementation Backlog

Date: August 27, 2026

## Priority order

This backlog is ordered by dependency, not by visual polish.

## Phase 1: Core product foundation

### P0

- Finalize the v1 feature scope and keep non-launch ideas out of the main delivery path.
- Confirm final app identity:
  - app name
  - bundle identifier
  - Android package name
  - support email
  - support URL
  - privacy policy URL
- Decide whether subscription selection is only informational in v1.

## Phase 2: Backend completion

### P0

- Create and configure the Supabase production project.
- Reconcile the app data model with the database schema.
- Add missing schema support for the fields currently used by the app.
- Validate row-level security for each table.
- Add a repeatable environment setup checklist for local development and release builds.

### Current gaps

- The app uses plan cycles beyond what the schema currently allows.
- The repository reads and writes fields not currently defined in the schema.
- Demo-mode behavior currently hides backend incompleteness instead of separating preview from production.

## Phase 3: Authentication and account lifecycle

### P0

- Build sign-up screen.
- Build sign-in screen.
- Add session bootstrap logic on app launch.
- Add sign-out action in Profile or Settings.
- Add account deletion flow required for App Store review.
- Add reviewer demo account guidance.

## Phase 4: App flow completion

### P0

- Fix splash and onboarding routing so returning users go to the correct screen.
- Ensure all launch-critical screens are reachable through navigation.
- Replace placeholder Profile content with real account/business details.
- Make payment summaries dynamic for selected periods.
- Remove hardcoded report chart data.

### P1

- Decide whether `Payments` becomes a tab, a nested screen, or a section from Dashboard.
- Decide whether `More` is needed in v1 or deferred.

## Phase 5: CRUD stability and data correctness

### P0

- Verify add/view/update/delete behavior for members, plans, payments, and expenses.
- Ensure mark-paid and mark-unpaid actions remain consistent between local state and backend state.
- Add empty-state, loading-state, validation-state, and backend-error handling.
- Ensure date storage and filtering are consistent and not based on fragile text matching.

## Phase 6: QA and release hardening

### P0

- Run type-checking in a working Node environment.
- Test on physical Android and iPhone devices.
- Test first-run, signed-in, signed-out, and resumed-session flows.
- Test network failure and Supabase failure behavior.
- Confirm no sensitive real data appears in demo accounts or screenshots.

### P1

- Add a lightweight manual QA checklist per release candidate.

## Phase 7: Store submission readiness

### P0

- Finalize Play Store and App Store metadata.
- Publish final privacy policy page.
- Complete Apple App Privacy answers.
- Complete Google Play Data safety answers.
- Prepare reviewer account and review notes.
- Generate production `.aab` and `.ipa`.
- Run Android internal testing and TestFlight validation.

## Phase 8: Post-launch backlog

### P2

- Real subscription billing
- Notifications and reminders
- Advanced reports
- Multi-user roles
- Messaging integrations
- Web dashboard
- UI refinement and premium polish

## Suggested execution sequence

1. Backend schema alignment
2. Auth and account lifecycle
3. Navigation and onboarding correction
4. Data correctness for dashboard, payments, and reports
5. QA and physical-device testing
6. Store submission prep
7. Internal release
8. Public submission
