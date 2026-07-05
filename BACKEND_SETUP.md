# Backend setup

TrackmyRent uses Supabase for authentication and PostgreSQL persistence. Without environment variables, the app remains in demo mode with local sample data.

1. Create a Supabase project.
2. Open the SQL editor and run `supabase/schema.sql`.
3. Copy `.env.example` to `.env`.
4. Add the project URL and anon key from Supabase Project Settings > API.
5. Restart Expo.

Only the public anon key belongs in the mobile app. Never add the service-role key.

The schema enables row-level security on every table. Records are scoped to the authenticated user's ID. The authentication service supports email/password sign-up, sign-in, persisted sessions, token refresh, and sign-out.
