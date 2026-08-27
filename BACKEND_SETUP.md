# Backend setup

TrackmyRent uses Supabase for authentication and PostgreSQL persistence. Without environment variables, the app remains in demo mode with local sample data.

## Quick setup

1. Create a Supabase project for TrackmyRent production or staging.
2. In Supabase Authentication, enable Email sign-in.
3. Open the SQL editor and run `supabase/schema.sql`.
4. Copy `.env.example` to `.env`.
5. Add the project URL and anon key from Supabase Project Settings > API.
6. Set `EXPO_PUBLIC_DEMO_MODE=0` in `.env` for real backend testing.
7. Restart Expo.

Only the public anon key belongs in the mobile app. Never add the service-role key.

The schema enables row-level security on every table. Records are scoped to the authenticated user's ID. The authentication service supports email/password sign-up, sign-in, persisted sessions, token refresh, and sign-out.

## Required Supabase checks

Run these checks before internal release:

1. Confirm email sign-up works for a new test user.
2. Confirm sign-in works after app restart.
3. Confirm row-level security prevents one user from seeing another user's data.
4. Confirm a deletion request creates a row in `account_deletion_requests`.
5. Confirm sign-out returns to the auth screen.

## Environment values

- `EXPO_PUBLIC_SUPABASE_URL`
  Use the project URL from Supabase API settings.
- `EXPO_PUBLIC_SUPABASE_ANON_KEY`
  Use only the public anon key, never the service-role key.
- `EXPO_PUBLIC_DEMO_MODE`
  Set to `0` for real backend testing and production builds.
  Set to `1` only for internal preview builds that intentionally bypass real auth.

## Suggested rollout order

1. Create a staging Supabase project first.
2. Apply `supabase/schema.sql`.
3. Verify auth, onboarding, CRUD flows, and deletion requests against staging.
4. Repeat the same schema on the production Supabase project.
5. Switch release builds to production credentials only after staging QA passes.
