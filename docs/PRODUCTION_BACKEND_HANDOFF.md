# Production Backend Handoff

Date: August 27, 2026

## Objective

Connect TrackmyRent to a real Supabase project safely and validate the live backend before internal release builds.

## What is already ready in the app

- Email/password auth screens exist.
- Session restore is wired on app launch.
- Member, plan, payment, and expense data already read and write through the backend repository.
- Account deletion requests are stored in `account_deletion_requests`.

## What you need from Supabase

- Project URL
- Public anon key
- Email authentication enabled
- SQL editor access

## Setup sequence

1. Create a staging Supabase project.
2. Run `trackmyrent-mobile/supabase/schema.sql` in the SQL editor.
3. Create `trackmyrent-mobile/.env` from `.env.example`.
4. Fill in:
   - `EXPO_PUBLIC_SUPABASE_URL`
   - `EXPO_PUBLIC_SUPABASE_ANON_KEY`
   - `EXPO_PUBLIC_DEMO_MODE=0`
5. Restart the app.
6. Run the backend verification flow below.

## Backend verification flow

1. Create a new user account from the app.
2. Sign out.
3. Sign back in.
4. Add at least:
   - one member
   - one plan
   - one payment
   - one expense
5. Verify the data persists after app restart.
6. Submit an account deletion request and verify the row appears in `account_deletion_requests`.
7. Confirm a second user does not see the first user's data.

## Expected tables after schema apply

- `members`
- `plans`
- `payments`
- `expenses`
- `account_deletion_requests`

## Release notes

- Use staging first, not production.
- Never place the Supabase service-role key in the mobile app.
- Production builds should only use credentials after staging QA passes.
- Preview builds may still use demo mode intentionally, but production should not.

## Current blocker

Live verification is still waiting on the actual Supabase project values and manual schema application.
