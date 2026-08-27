# Step 2: Release Scope Lock

Date: August 27, 2026

## Objective

Define the smallest complete TrackmyRent v1 that is strong enough to finish development, run internal testing, and submit to Google Play and the Apple App Store.

## Product direction

TrackmyRent v1 is a mobile app for business owners and commercial-property operators to manage rental members, payment collection, expenses, and simple reports from one account-based workspace.

## In scope for v1

### 1. Account and access

- Email/password sign up
- Email/password sign in
- Persistent login session
- Sign out
- Basic profile/account view
- In-app account deletion request or deletion flow

### 2. Onboarding

- Intro flow
- Business phone number capture
- Category selection
- Subscription selection as a display-only onboarding step for now
- Proper resume behavior when onboarding was already completed

### 3. Member management

- Add member
- View member details
- Mark member paid
- Mark member unpaid
- Show current balance and rental details

### 4. Plan management

- Add plan
- View plan details
- Edit plan assignments
- Delete plan

### 5. Payment management

- Record payment
- Show recent payments
- Associate payment with member
- Support Cash, UPI, and Bank payment methods

### 6. Expense management

- Add expense
- View expense details
- Delete expense
- Categorize expenses

### 7. Dashboard and reports

- Dashboard totals for members, collected rent, and outstanding rent
- Filter by selected month and year
- Payment status breakdown
- Expense category breakdown
- Report figures based on real app data, not hardcoded values

### 8. Backend and data

- Supabase project configured
- Production-ready database schema
- Authenticated user data isolation
- App reads and writes real cloud data
- Safe demo account for review/testing

### 9. Release readiness

- App icon, splash, name, package IDs, and build settings finalized
- Privacy policy published
- Support email and support URL finalized
- Store listing text finalized
- Android and iOS production builds generated

## Explicitly out of scope for v1

- Real subscription billing and payment gateway integration
- Push notifications
- Reminder automation
- Multi-user team collaboration inside the app
- Advanced analytics dashboards
- Web admin panel
- SMS/WhatsApp integrations
- Localization and multi-language support
- Tablet-specific optimization beyond basic compatibility

## Scope decisions based on current codebase

- `Premium` remains informational only in v1 and should not block launch.
- `More` should not be treated as a launch-critical feature unless it becomes the home for essential account actions.
- Placeholder content is not acceptable in launch-critical screens like Profile, auth, and onboarding completion logic.
- Demo mode can remain for preview builds, but production must default to authenticated cloud-backed usage.

## Definition of done for Step 2

Step 2 is complete when every pending task can be judged against one question:

Does this work block the scoped v1 launch?

If yes, it belongs in the main delivery backlog.
If not, it moves to post-launch.

## Release blockers already known

- Auth service exists in code but is not connected to user-facing screens.
- Current onboarding flow does not reliably resume a completed user session.
- Some navigation paths and screens exist but are not fully reachable in the live app structure.
- Reports and payment summaries still contain hardcoded assumptions.
- Supabase schema and app models are not fully aligned.
- Store compliance items like account deletion and final support/privacy details are still open.
