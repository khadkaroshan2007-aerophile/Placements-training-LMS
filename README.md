# PlacePrep AI

PlacePrep AI is a placement-training workspace built with Next.js App Router, TypeScript, Tailwind CSS, and Supabase. The repository includes a student dashboard, course catalogue, quiz workflows with scoring and answer explanations, readiness insights, authentication, and an AI interview coach.

## Run locally

Requirements: Node.js 20.9 or newer and npm.

```powershell
npm.cmd install
npm.cmd run dev
```

Open http://localhost:3000. Without Supabase configuration, sign-up and sign-in use a local demo account store in `.data/auth.json`; course and assessment progress is saved in this browser. This mode is for local demos and is not suitable for deployment or shared accounts.

## Optional Supabase setup

1. Create a Supabase project and copy its project URL and publishable key into `.env.local` using the names in `.env.example`.
2. In the Supabase SQL Editor, run [`supabase/schema.sql`](./supabase/schema.sql). Row-level security limits learning records to their owning account.
3. For a quick demo, disable email confirmation in Supabase Auth settings. If confirmation is enabled, users must confirm their email before signing in.
4. Restart the development server and create an account. Authentication and course/assessment progress will use Supabase.

The app uses Supabase Auth's server-side cookie flow and the publishable key. It does not need or accept a service-role key. Supabase setup is optional locally; the app falls back to the clearly labeled local demo mode when the URL/key are absent.

## Backend development map

- `app/api/` contains HTTP route handlers. Keep request/response and status-code concerns here.
- `lib/backend/` contains backend-facing domain contracts and validation shared by routes and clients.
- `lib/supabase/server.ts` is the server-only Supabase client/configuration boundary. Keep service-role keys out of this app.
- `lib/learning-data.ts` is the canonical course, lesson, and assessment catalogue. Reference its IDs when validating saved learning state.
- `components/learning-state.tsx` owns the browser cache and calls `/api/learning`; UI components should use this hook rather than calling persistence endpoints directly.
- `supabase/schema.sql` is the current database bootstrap. Put incremental database changes in versioned SQL files under `supabase/migrations/`, update the bootstrap for fresh projects, and keep row-level security policies aligned with each API operation.

For a new backend feature, define its data contract first, validate untrusted request data at the route boundary, add user-scoped database policies, and expose a typed client operation. Keep database credentials and provider calls in server code. Test unauthenticated access, malformed payloads, persistence, and failure responses before connecting the UI.

`/api/learning` accepts only known course and assessment IDs, lesson-aligned progress values, and quiz results whose score matches their submitted answers. Payloads are capped at 64 KiB. Supabase URL and key must either both be configured or both be absent; partial configuration is treated as an error instead of silently switching authentication modes.

Backend contract checks to keep covered: unauthenticated writes return `401`; malformed or unknown course/assessment IDs return `400`; oversized learning payloads return `413`; correct and incorrect quiz answers are both accepted only when the submitted score matches; and database errors return a visible non-success response.

## Gemini interview coach

Set `GEMINI_API_KEY` in `.env.local` to enable the interview coach. The key is read only by the server route and is never exposed to client code. Without it, the coach shows an unavailable state; it does not fabricate feedback. Student answers are sent to Gemini only after they submit the feedback form.

## Demo data

- The signed-out dashboard uses illustrative sample metrics and labels them as sample data.
- Register a fresh local account to see an empty dashboard, then enroll in courses and complete assessments to demonstrate progress.
- With Supabase configured, use a Supabase-authenticated account to demonstrate persistence across browsers/devices.
- Gemini feedback requires a valid key and network access; the no-key state is also handled.
- The `/progress` page reports a learning estimate from saved course and quiz activity; it is not a hiring prediction.

## Deployment

Deploy as a Node.js Next.js application (for example, to Vercel). Set `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`, and `GEMINI_API_KEY` in the deployment environment, and run the SQL schema against the target Supabase project. Do not deploy the local JSON authentication fallback as a production account system. Keep the Gemini key server-only and use HTTPS for deployed auth cookies.

## Checks

```powershell
npm.cmd run lint
npm.cmd run typecheck
npm.cmd run build
```
