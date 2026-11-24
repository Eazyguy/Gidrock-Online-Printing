# Gidrock Online Printing

Gidrock Online Printing is a full-stack printing storefront built for configuring print products, collecting artwork and delivery details, accepting Paystack payments, and managing orders through a role-based dashboard.

## Features

### Storefront

- Landing page with services, process, benefits, statistics, and testimonials
- Product catalog for cards, fliers and posters, banners, stickers and labels, brochures, shirt printing, and awards
- Product-specific configuration for size, quantity, thickness, finishing, and artwork
- Persistent browser cart with artwork stored in IndexedDB
- Station and interstate delivery options
- Collection-date selection with availability and capacity checks
- Supabase artwork uploads and order creation
- Paystack checkout, server-side transaction verification, signed webhooks, cancellation handling, and receipt pages
- Receipt email delivery through Resend

### Dashboard

- Supabase authentication with separate admin and cashier roles
- Admin overview with date filtering and order analytics
- Cashier order management view
- Customer summary derived from order records
- Admin user creation for admin and cashier accounts
- Product-pricing management
- Password-reset email support
- CSV, Excel, and PDF exports for order data

## Tech stack

- Next.js 16 App Router
- React 19
- TypeScript
- Tailwind CSS 4 and DaisyUI
- Supabase Auth, Postgres, and Storage
- Paystack
- Resend
- Zustand
- IndexedDB
- Recharts
- jsPDF and Excel export utilities

## Requirements

- Node.js 20 or newer
- npm
- A Supabase project
- A Paystack account and secret key
- A Resend account and API key

## Local setup

### 1. Install dependencies

```bash
npm ci
```

### 2. Configure environment variables

Create `.env.local` in the project root:

```dotenv
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
PAYSTACK_SECRET_KEY=sk_test_your-paystack-secret-key
RESEND_API_KEY=re_your-resend-api-key
```

Keep `PAYSTACK_SECRET_KEY` and `RESEND_API_KEY` server-side. Never use a Paystack or Resend secret key as a public `NEXT_PUBLIC_*` variable.

### 3. Apply Supabase migrations

Run the migrations with the Supabase CLI:

```bash
supabase db push
```

The migrations add:

- Dynamic product-pricing settings and public read policies
- Admin-only product-pricing updates
- Collection dates, substations, payment fields, and payment references on orders
- Collection capacity controls for dashboard staff
- Order and collection-capacity update policies

If you do not use the Supabase CLI locally, run both SQL files from `supabase/migrations/` in the SQL Editor in chronological filename order.

The application also expects existing `profiles` and `orders` tables with the fields used by the dashboard and checkout pages.

### 4. Configure Supabase Storage

Create a Storage bucket named:

```text
order-files
```

Grant it the upload and read policies required by your Supabase environment. Checkout uploads files through the Supabase Storage API using the public Supabase URL and anon key.

### 5. Configure authentication redirects

Add these URLs to Supabase Auth redirect allowlists:

```text
http://localhost:3000/dashboard/reset-password
https://<your-domain>/dashboard/reset-password
```

The reset-password page is used when an administrator sends a password-reset email from dashboard Settings.

### 6. Configure the Paystack webhook

Add this webhook endpoint to the Paystack dashboard:

```text
https://<your-domain>/api/webhooks/paystack
```

The webhook expects signed `charge.success` and `charge.failed` events. Successful payments are also verified server-side before the order is marked completed.

### 7. Start the app

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Supabase local development

The repository includes `supabase/config.toml` for the Supabase CLI. To start the local stack:

```bash
supabase start
```

Then use the local API URL and anon key printed by the CLI in `.env.local`.

To stop the local stack:

```bash
supabase stop
```

## Available scripts

| Command          | Description                                         |
| ---------------- | --------------------------------------------------- |
| `npm run dev`    | Start the Next.js development server with Turbopack |
| `npm run build`  | Create a production build                           |
| `npm run start`  | Serve the production build                          |
| `npm run format` | Format project files with Prettier                  |

## Routes

| Route                       | Description                              |
| --------------------------- | ---------------------------------------- |
| `/`                         | Storefront landing page                  |
| `/products`                 | Product selection and configuration      |
| `/checkout/[gid]`           | Checkout and order submission            |
| `/receipt/[gid]`            | Order receipt                            |
| `/dashboard/login`          | Dashboard login                          |
| `/dashboard`                | Redirects to the role-specific dashboard |
| `/dashboard/admin`          | Admin overview and analytics             |
| `/dashboard/cashier`        | Cashier order view                       |
| `/dashboard/customers`      | Aggregated customer records              |
| `/dashboard/users`          | Dashboard user creation                  |
| `/dashboard/settings`       | Product pricing and password resets      |
| `/dashboard/reset-password` | Password reset form                      |

`/checkout` redirects to the landing page. Active checkout sessions are created from the cart at `/checkout/[gid]`.

## Main API and server routes

| Route                         | Purpose                                                         |
| ----------------------------- | --------------------------------------------------------------- |
| `POST /api/orders/cancel`     | Cancel an unpaid order and validate a signed cancellation token |
| `POST /api/webhooks/paystack` | Process signed Paystack payment events                          |

Receipt emails are generated and sent by the `sendEmail` server action after successful payment verification.

## Project structure

```text
src/
  app/
    (main)/             Storefront, checkout, receipts, and APIs
    dashboard/          Authentication and role-based management UI
  components/           Shared navigation, cart, receipt, and preload components
  constants/            Navigation, service, and Nigeria location data
  lib/                  Supabase server client and Paystack utilities
  utills/               Browser storage helpers
  supabase-client.ts    Browser Supabase client
supabase/
  migrations/           Database migrations
  config.toml           Supabase local project configuration
public/                 Product images and static assets
offline-db/             Local order export or offline-data assets
```

## Dashboard roles

The dashboard expects a `profiles` row linked to the authenticated Supabase user.

```text
role = "admin"    # Full dashboard, settings, and user management
role = "cashier"  # Order review and cashier operations
```

Route protection is enforced in both the Next.js proxy and dashboard server pages. Database policies should continue to restrict writes to the appropriate role.
