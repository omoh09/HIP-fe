# Hip Homorrd Web

Production-oriented Next.js frontend for Hip Homorrd, an invoicing and payment-collection product for independent professionals.

## Architecture

```text
Browser
  │
  ▼
Next.js web app
  │  HTTP-only auth cookie
  │
  ├── Server Actions / Route Handlers
  │          │
  │          ▼
  │      Laravel API
  │          │
  │          ▼
  │      Provider-agnostic payment orchestration
  │        ├── Paystack subaccounts
  │        └── Stripe Connect (optional)
  │
  └── Public invoice/payment UI
```

The frontend does **not** calculate or own the authoritative payment state. The Laravel backend is responsible for payment verification, transaction state and settlement/revenue logic. The frontend displays the server-confirmed result.

## Requirements

- Node.js 20.9+
- npm or pnpm
- Running Hip Homorrd Laravel API

## Environment

Copy `.env.example` to `.env.local` and configure the values for your environment.

Required in production:

- `API_BASE_URL` — Laravel API base URL

The dedicated invoice payment page does not require provider secret keys or a Paystack browser key. Payment initialization and verification are handled by Laravel, and the frontend only receives the provider-hosted checkout URL.

Passwordless sign-in also expects the Laravel API to implement the paths configured by:

- `OTP_REQUEST_ENDPOINT` — request a short-lived email sign-in code
- `OTP_VERIFY_ENDPOINT` — verify that code and return a session token
- `ACCOUNT_VERIFY_ENDPOINT` — verify email after registration when required
- `ACCOUNT_RESEND_ENDPOINT` — resend the registration-verification code

The frontend proxy routes are already implemented. If the Laravel API uses different route names, change the environment values rather than editing the UI. The Laravel implementation must enforce OTP expiry, one-time use, attempt limits and rate limiting; the browser countdown is only a user-interface convenience and is not a security control.

Never expose `INTERNAL_API_TOKEN`, payment provider secret keys, or backend credentials through `NEXT_PUBLIC_*` variables.

## Public invoice conversion flow

`/create-invoice` is intentionally public. A visitor can complete the invoice form, add a logo and preview the invoice without registering. The draft is stored in the visitor's browser. Saving, downloading or sharing an unauthenticated draft opens an authentication gate; after sign-in the visitor returns to the builder with the local draft intact.

## Client payment flow

Saved invoices expose a stable `payment_link` such as `/pay/{token}`. Merchants can copy or share that link from the invoice screen and WhatsApp actions. The client-facing page is public, shows the current server-confirmed balance, supports full or partial payment, and lists only payment providers that the merchant has activated. When the client continues, Laravel creates a new payment attempt and returns a provider-hosted checkout URL.

Payment-provider settlement setup lives at **Dashboard → Settings → Payment collection**.

## Development

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Production build

```bash
npm run build
npm run start
```

Before deploying, run the build in CI and do not deploy if TypeScript or route validation fails.

## Deployment

The app can run on Vercel or another Node-compatible Next.js host. Configure the same environment variables in the deployment environment rather than committing `.env` files.

## Frontend production checklist

- [ ] Use a stable/LTS Next.js release rather than a canary build.
- [ ] Configure `API_BASE_URL` in the deployment environment.
- [ ] Confirm the Laravel `/api/v1/auth/me` endpoint is available.
- [ ] Implement and test the four configurable OTP/verification endpoints above.
- [ ] Confirm invoice list/create endpoints are available.
- [ ] Confirm `/api/v1/public/invoices/{token}` and the public payment initiate/verify endpoints return server-authoritative results.
- [ ] Activate at least one merchant payment account/subaccount before testing collection.
- [ ] Verify provider webhook/reconciliation behavior in Laravel before enabling live payments.
- [ ] Test the stable `/pay/{token}` link, partial payments and multiple sequential payments on the same invoice.
- [ ] Replace generic legal references with the verified Hip Homorrd legal-entity name, registered/contact address and privacy contact before launch.
- [ ] Have Nigerian counsel review the Privacy Policy and Terms against the actual business model, data flows, subscriptions, payment-provider contract and dispute process before launch.
- [ ] Add monitoring/error reporting for production.
- [ ] Test mobile invoice/payment/auth flows on real devices and slow networks.

## Marketing photography

Local compressed WebP photography is used so conversion pages can show real people without adding third-party image requests at runtime:

- `public/images/marketing/business-owner.webp` — source: Pexels.
- `public/images/marketing/client-phone.webp` — source: Unsplash / Christina @ wocintechchat.

Keep the source/license records with the project if these images remain in production, and replace them with owned brand photography when available.

## Important product decisions

The frontend deliberately avoids fabricated testimonials, payment volume, regulatory claims and security badges. Replace those sections only with claims that can be verified.

The payment UI supports full and partial payment selection, while the backend remains the source of truth for the resulting invoice balance.

## v13.2 multi-market

See `MULTI_MARKET_V13.2.md` for local market pricing, multi-currency invoicing, base-currency dashboard behavior and deployment notes.


## v13.5 platform-managed payments

See `PLATFORM_PAYMENTS_V13.5.md` and `DEPLOY_V13.5.md` for MoonPay Commerce managed crypto settlement, MTN MoMo collection/disbursement, safety gates and monetization.
