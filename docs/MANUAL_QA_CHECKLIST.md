# TrackmyRent Manual QA Checklist

Date: August 27, 2026

Use this checklist before every internal release candidate and again before store submission.

## 1. Environment check

- Confirm `.env` contains the intended Supabase project URL and anon key.
- Confirm the build is using the correct mode:
  - preview build for internal demo/testing
  - production build for store validation
- Confirm the test account is non-sensitive and uses sample data only.

## 2. First-run flow

- Launch the app from a fresh install.
- Verify splash loads without hanging.
- Verify unauthenticated users are sent to sign-in or account creation when backend is configured.
- Verify preview-only builds can still continue safely when backend values are intentionally absent.

## 3. Auth flow

- Create a new account.
- Sign in with an existing account.
- Confirm invalid credentials show a clear error.
- Confirm signed-in session survives app restart.
- Confirm sign-out returns the user to the auth screen.

## 4. Onboarding flow

- Complete intro, phone number, category, and subscription selection.
- Restart the app after onboarding and confirm the user does not get forced through intro again.
- Verify invalid phone numbers are blocked with a helpful message.

## 5. Member management

- Add a member for each supported category:
  - Building rent
  - Gym
  - Tution centre
  - Hostal/PG
  - Others
- Verify required fields are validated correctly.
- Open member details and confirm the saved data appears correctly.
- Mark a member paid.
- Mark the same member unpaid.
- Confirm state changes appear in dashboard, member list, and member detail.

## 6. Plan management

- Add a new plan.
- Assign one or more members to a plan.
- Edit plan name, amount, and billing cycle.
- Delete a plan.
- Confirm failed saves or deletes show a visible error and do not leave bad UI state behind.

## 7. Payment management

- Record payments using:
  - UPI
  - Bank
  - Cash
- Confirm the payment is attached to the right member.
- Confirm the member status updates to paid.
- Confirm monthly totals update correctly for the selected period.
- Confirm the empty state is shown when no payments exist for the selected period.

## 8. Expense management

- Add a one-time expense.
- Add a monthly expense.
- Open expense details.
- Delete an expense.
- Confirm monthly totals and category breakdowns update correctly.
- Confirm the empty state is shown when no expenses exist for the selected period.

## 9. Reports and dashboard

- Verify dashboard totals for the selected month and year.
- Verify member filtering on dashboard works for All, Paid, and Unpaid.
- Verify report income, net balance, and collection rate.
- Verify the five-month trend updates from actual payment data.
- Verify expense category totals match recorded expenses.

## 10. Error and resilience testing

- Disconnect the network and verify the app shows clear sync problems.
- Reconnect and verify data loads again.
- Trigger a backend error if possible and confirm the UI surfaces it.
- Confirm failed create/update/delete actions do not silently succeed in the UI.

## 11. Device QA

- Test on at least one physical Android device.
- Test on at least one physical iPhone.
- Confirm layout, scrolling, keyboard behavior, and button hit areas.
- Confirm there are no clipped screens, broken modals, or blocked bottom actions.

## 12. Submission safety

- Confirm screenshots match the production build.
- Confirm no real customer names, phone numbers, or payment data appear in screenshots.
- Confirm reviewer credentials work.
- Confirm support and privacy URLs are live.
