````markdown
# Oya Chop

> Oya, let's chop.

A food delivery web app for Lagos. Browse restaurants by cuisine, order,
pay, and track your delivery. Each restaurant gets a dashboard to see
incoming orders and move them through statuses.

Built as a portfolio project by two developers learning full-stack
development in public.

---

## Status

🚧 In active development. Not yet deployed.

Track progress: this README grows with the project. See `src/README.md`
for the internal folder structure and who owns what.

---

## Stack

- **Framework:** Next.js 16 (App Router) + TypeScript
- **Styling:** Tailwind CSS v4
- **Database:** Neon (serverless Postgres)
- **ORM:** Drizzle
- **Auth:** Clerk
- **Payments:** Paystack (test mode)
- **Deploy:** Vercel

All tools on free tiers. No paid services.

---

## Running locally

**Prerequisites:** Node.js 20.9 or higher, npm.

```bash
# 1. Clone
git clone https://github.com/Zayk22/oya-chop.git
cd oya-chop

# 2. Install
npm install

# 3. Environment
copy .env.example .env.local
# Open .env.local and fill in the values. Ask a team member
# for the dev credentials — they are never committed.

# 4. Run
npm run dev
```

The app runs at `http://localhost:3000`.

---

## Project structure

```
src/
  app/         Pages and layouts (Next.js App Router)
  components/  Reusable UI pieces
  db/          Schema, client, queries, seed
  actions/     Server Actions (data mutations)
  lib/         Helpers (formatting, constants, cart state, Paystack)
  types/       Shared TypeScript types — the frontend/backend contract
```

See `src/README.md` for ownership and conventions.

---

## Contributing

This is a two-person project. Work happens on feature branches. `main`
is protected. See the Project Handbook for the full collaboration rules.

---

## License

Private project. Not for redistribution.
````