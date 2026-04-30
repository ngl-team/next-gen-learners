# CT Builds (Danbury Hackerspace value drop)

Path-based prototype for Mike Kaltschnee's CT Next 2.0 vision. Lives at `/danburyhackerspace` on the existing NGL Next.js app. No subdomain, no new infra.

## What is here

- `page.tsx` — public landing page with hero, "what it is" section, routing form, six hubs grid, partner orgs row, and the value-drop footer.
- `HubFinder.tsx` — client component for the two-question routing form. Submits to `/api/danburyhackerspace/submissions`.
- `admin/page.tsx` — password-gated submissions table with totals and breakdowns by help type, region, and matched hub.
- `admin/AdminLogin.tsx` — login form.
- `../api/danburyhackerspace/submissions/route.ts` — POST stores a submission and emails `brayan@nextgenerationlearners.com` (best-effort). GET returns rows when the admin cookie is valid.
- `../api/danburyhackerspace/auth/route.ts` — sets the `dh_admin` cookie when the password matches.
- DB table `dh_submissions` is created in `src/lib/db.ts` via the existing `initDb()` migration block.

## Env vars

Add these to `.env.local` (and the Vercel project) before deploying:

```
DH_ADMIN_PASSWORD=ctbuilds2026
```

`SESSION_SECRET` and `TURSO_DATABASE_URL` / `TURSO_AUTH_TOKEN` are already set for the rest of the NGL app and are reused.

## Default password

`ctbuilds2026`. Change `DH_ADMIN_PASSWORD` in Vercel to rotate. The cookie name is `dh_admin` (separate from the main NGL `ngl_session`).

## Local iteration

```
cd next-gen-learners
npm run dev
# open http://localhost:3000/danburyhackerspace
# admin at http://localhost:3000/danburyhackerspace/admin
```

## Deploy

The page deploys automatically when you push to the NGL repo on `ngl-team` GitHub org. Vercel picks up the new route. No DNS or middleware changes required.

After deploy, the live URLs are:

- Public: `https://nextgenerationlearners.com/danburyhackerspace`
- Admin: `https://nextgenerationlearners.com/danburyhackerspace/admin`

## Renaming the project

Three working names live in the hero subhead: "CT Builds" (default), "CT Forward", "Open Hub CT". To change the default, edit the navbar text in `page.tsx` and the `<title>` in the `metadata` export. The body copy uses "CT Builds" once in the "What it is" section; rename there too.

## Editing hubs and partners

Both lists are static arrays at the top of `page.tsx`:

- `HUBS` — six makerspaces. Routing matches by `region` field. Update URLs or add a hub here; also add the matching `REGIONS` entry inside `HubFinder.tsx`.
- `PARTNERS` — four advisor orgs. Routing matches by name. Update advisor mappings in the `HELP_TYPES` array inside `HubFinder.tsx`.
