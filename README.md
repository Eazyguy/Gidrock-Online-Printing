# Gidrock Online Printing

Gidrock Online Printing is a work-in-progress storefront for browsing print
products, configuring an order, and submitting artwork and delivery details.
The project is under active development; not all parts of the intended
customer journey are available yet.

## Current status

The application currently includes:

- A landing page with service information and site navigation.
- A product catalog with configurable print options for cards, fliers and
  posters, banners, stickers and labels, brochures, shirt printing, and awards.
- A browser-persisted cart that can retain selected products and artwork.
- An order form with customer and delivery details for Nigerian states.
- Supabase integration for saving orders and uploading artwork.
- Paystack checkout for station-delivery orders, with webhook and server-side
  transaction verification updating payment status.
- An interstate delivery path that saves the order and opens WhatsApp to
  continue arranging delivery.

**Not implemented yet:** a complete order-management experience. Product
details, prices, delivery arrangements, and backend configuration should be
verified before using the application for real orders.

## Tech stack

- Next.js 16 with the App Router
- React 19 and TypeScript
- Tailwind CSS 4
- Supabase JavaScript client for order data and artwork storage
- Zustand for cart state and persistence

## Getting started

### Requirements

- Node.js compatible with Next.js 16
- npm
- A Supabase project for testing order submission

### Install dependencies

```bash
npm ci
```

### Configure Supabase

Create a `.env.local` file in the project root and add your Supabase project
URL, anon key, and Paystack secret key:

```dotenv
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
PAYSTACK_SECRET_KEY=your-paystack-secret-key
```

Order submission also expects an `orders` table compatible with the fields used
by the application and a Supabase Storage bucket named `order-files`. Configure
the required database and storage policies in Supabase for your environment.
Configure the Paystack webhook to send `charge.success` and `charge.failed`
events to `https://<your-domain>/api/webhooks/paystack`. Ensure your Supabase
RLS policies authorize the anon role for the payment order reads and status
updates. Keep the Paystack secret key server-side and do not commit
`.env.local`.

### Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Available scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start the local development server |
| `npm run build` | Create a production build |
| `npm run start` | Serve the production build |
| `npm run format` | Format project files with Prettier |

## Main routes

| Route | Description |
| --- | --- |
| `/` | Landing page |
| `/products` | Product catalog and configuration |
| `/checkout/[gid]` | Checkout flow for a cart-created order |
| `/checkout` | Currently redirects to the landing page |

## Project layout

```text
src/
  app/
    Sections/       Landing-page sections and footer
    products/       Product catalog and configuration
    checkout/       Order details, uploads, and submission flow
  components/       Navigation and cart components/state
  constants/        Product and site content
  supabase-client.ts
public/             Images and other static assets
```

## Development notes

- Order submission uses the public Supabase URL and anon key configured above.
- The checkout flow stores order details and uploaded artwork in Supabase.
- Successful card payments are verified with Paystack and update the order to
  `completed`; signed webhooks also process successful and failed payments.
- Closing the Paystack popup marks an unpaid order `cancelled` and returns the
  customer to the home page.
- The default checkout route (`/checkout`) is not the active order flow;
  checkout sessions are created from the cart at `/checkout/[gid]`.

This README describes the current implementation and will need updating as
features and backend requirements evolve.
