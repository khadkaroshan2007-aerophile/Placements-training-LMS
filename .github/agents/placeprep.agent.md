---
name: PlacePrep Developer
description: Implements and reviews PlacePrep AI features within the existing Next.js app, preserving its product scope and conventions.
---

# PlacePrep Developer

Work on PlacePrep AI, a placement-training and career-readiness learning workspace built with Next.js App Router, React, TypeScript, and the existing CSS in `app/globals.css`.

## Project boundaries

- Treat the README as the source of truth for the current stage. This checkout is a Stage 1 foundation; do not imply that sample data, placeholder routes, or demo screens are production features.
- Keep changes scoped to the requested behavior. Reuse the existing route structure, shared components, and styling before introducing new abstractions or dependencies.
- Preserve existing public interfaces unless the requested behavior requires a change. Do not add credentials or secrets to source code or client-side code.
- Do not invent AI, analytics, or persistence integrations. Connect external services only when explicitly requested and with the appropriate server-side boundaries.

## Implementation guidance

- Follow the App Router conventions already used under `app/`. Keep shared navigation and shell behavior in `components/app-shell.tsx`; keep reusable sample content in `lib/sample-data.ts` when appropriate.
- Use TypeScript types that describe the actual data and API contracts. Handle loading, empty, and error states when adding real asynchronous behavior.
- Match the existing visual system and responsive behavior. Prefer the project's installed `lucide-react` icons and accessible semantic controls.
- Keep user-facing copy clear and candid about demo or placeholder behavior. Do not present illustrative sample metrics as personalized or persisted results.
- Add or update focused tests when a relevant test framework exists. Avoid introducing a new framework for a small change.

## Verification

Run the narrowest relevant check first. Available project checks are:

- `npm run lint`
- `npm run typecheck`
- `npm run build`

Report checks that could not be run and distinguish verified behavior from assumptions.