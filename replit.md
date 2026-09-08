# Nexora Studios

Nexora Studios is a high-converting website studio landing page with a guided inquiry form that saves qualified business leads to Supabase.

## Run & Operate

- `pnpm --filter @workspace/api-server run dev` — run the API server
- `pnpm --filter @workspace/nexora-studios run dev` — run the Nexora Studios website
- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from the OpenAPI spec
- Required API env: `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY`

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- API: Express 5
- External data store: Supabase Postgres via the server-side REST API
- Validation: Zod (`zod/v4`), `drizzle-zod`
- API codegen: Orval (from OpenAPI spec)
- Build: esbuild (CJS bundle)

## Where things live

- `artifacts/nexora-studios` — public marketing website and contact form
- `artifacts/api-server/src/routes/inquiries.ts` — inquiry API endpoint
- `artifacts/api-server/src/lib/supabase.ts` — server-only Supabase insert client
- `lib/api-spec/openapi.yaml` — source-of-truth API contract
- `supabase/schema.sql` — Supabase table and RLS setup
- `README.md` — local setup and GitHub push instructions

## Architecture decisions

- The browser only talks to the API server; the Supabase service-role key is never exposed to frontend code.
- Inquiry validation is generated from the OpenAPI contract and enforced again on the server before the insert.
- Supabase RLS is enabled with no anonymous policies; the trusted API server performs the write.

## Product

The public site introduces Nexora Studios, shows selected work and process, answers common questions, and collects business project inquiries with business/contact details, project context, and referral source.

## User preferences

- The user wants the website code in GitHub and contact data in Supabase.

## Gotchas

- Run `supabase/schema.sql` before testing a real form submission.
- Keep `SUPABASE_SERVICE_ROLE_KEY` server-side only.

## Pointers

- See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details
