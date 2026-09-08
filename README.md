# Nexora Studios

Nexora Studios is a website studio landing page with a guided inquiry form for businesses looking to purchase a new website.

## Local development

Install dependencies and start the app through the managed workflows:

```bash
pnpm install
```

The frontend runs through the Nexora Studios web workflow. The API server runs through the API Server workflow.

## Supabase setup

1. Create or open your Supabase project.
2. Run [`supabase/schema.sql`](./supabase/schema.sql) in the Supabase SQL Editor.
3. Add `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` to the API server environment. Use the service-role key only on the server; never put it in frontend code.
4. Restart the API Server workflow.

The form sends:

- business name and contact name
- email, phone, and current website
- project type
- why the business is looking for a website
- how they heard about Nexora Studios
- project message

## API

The public form uses `POST /api/inquiries`. The request and response contract lives in `lib/api-spec/openapi.yaml`, and generated hooks are in `lib/api-client-react`.

## GitHub

This folder is ready to push to a GitHub repository:

```bash
git init
git add .
git commit -m "Build Nexora Studios website"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/nexora-studios.git
git push -u origin main
```