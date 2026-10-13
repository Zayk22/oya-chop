# src/

Where all the app's code lives. Here's what each folder is for.

## `app/`
Pages and layouts. In Next.js App Router, the folder structure **is** the URL structure.
- `src/app/page.tsx` → the home page
- `src/app/vendors/[slug]/page.tsx` → a vendor's menu
- `src/app/orders/` → customer order history and tracking
- `src/app/dashboard/` → vendor-only area

Owner: Dev A

## `components/`
Reusable UI pieces — buttons, cards, skeletons, cart widgets, headers.
Anything used in more than one page lives here.

Owner: Dev A

## `db/`
Database layer.
- `schema.ts` — table definitions
- `client.ts` — how we connect to Neon
- `queries.ts` — read functions
- `seed.ts` — fake data for testing

Nobody outside this folder writes SQL directly.

Owner: Dev B

## `actions/`
Server Actions — functions the user triggers.
Each one validates its input, checks permissions, then touches the database.
- `create-order.ts`
- `verify-payment.ts`
- `update-order-status.ts`
- `toggle-item-availability.ts`

Owner: Dev B

## `lib/`
Helpers that don't belong to one specific page.

- `format.ts` — naira formatter, date formatter (Dev A)
- `constants.ts` — Lagos areas, cuisines (Dev A)
- `cart-context.tsx` — cart state, survives refresh (Dev A)
- `paystack.ts` — Paystack API calls (Dev B)
- `mock-data.ts` — fake data for building UI before the backend is ready (Dev A)

## `types/`
The contract between frontend and backend.
Every shape (`Vendor`, `Order`, `MenuItem`, etc.) is defined here **once**.
Changing this folder requires both devs to agree.

Shared ownership.

---

**Rule:** one writer per file at a time. If you need to edit a file the other dev is working on, message them first. Merge conflicts are cheaper to avoid than to fix.