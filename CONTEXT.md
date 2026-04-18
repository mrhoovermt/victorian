# Victorian Casino — Project Context

**Site:** victoriancasinowhitefish.com  
**Repo:** github.com/mrhoovermt/victorian (branch: master)  
**Last updated:** 2026-04-18

---

## Project Overview

Full-stack web application for Victorian Casino in Whitefish, Montana. Public-facing marketing site with Players Club signup, catering inquiry, and VIP taxi interest forms. Admin dashboard at `/system-ops` for contact management, lead tracking, and email/SMS campaign management.

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 16 (App Router, TypeScript) |
| Styling | Tailwind CSS v4 |
| Database | PostgreSQL via Railway |
| ORM | Prisma |
| Email | Resend |
| SMS | Twilio |
| Auth | Username + bcrypt password + TOTP (speakeasy) |
| Sessions | JWT via jose |
| Hosting | Railway |
| DNS/CDN | Cloudflare |

---

## Environment Variables

Set all of these in Railway (Project → Variables):

| Variable | Description |
|----------|-------------|
| `DATABASE_URL` | Railway PostgreSQL connection string |
| `RESEND_API_KEY` | Resend API key (re_...) |
| `RESEND_FROM_EMAIL` | From address, e.g. `noreply@victoriancasinowhitefish.com` |
| `TWILIO_ACCOUNT_SID` | Twilio Account SID (AC...) |
| `TWILIO_AUTH_TOKEN` | Twilio Auth Token |
| `TWILIO_PHONE_NUMBER` | Twilio sending phone number (+1...) |
| `ADMIN_USERNAME` | Admin login username |
| `ADMIN_PASSWORD_HASH` | bcrypt hash of admin password (generate with `npx bcryptjs`) |
| `TOTP_SECRET` | Base32 TOTP secret — set after first-login QR scan |
| `ADMIN_NOTIFICATION_EMAIL` | Email address for admin notifications on new leads |
| `SESSION_SECRET` | 64-char random string for JWT signing |
| `NODE_ENV` | `production` |
| `NEXT_PUBLIC_SITE_URL` | `https://victoriancasinowhitefish.com` |

---

## Database Schema

Managed by Prisma. Run `npx prisma migrate deploy` on deploy.

### Contact
Stores all public signups (Players Club, signup bar).
- `id`, `firstName`, `lastName`, `email` (unique), `phone?`
- `birthdayMonth?`, `birthdayDay?` — for birthday promo campaigns
- `favoriteDrink?` — for personalized welcome
- `emailOptIn`, `smsOptIn` — consent flags
- `source` — enum: `players_club | signup_form | manual`
- `notes?`, `createdAt`, `updatedAt`

### CateringLead
Catering inquiry form submissions.
- `id`, `name`, `email`, `phone?`, `eventType?`, `eventDate?`, `headcount?`
- `notes?` (from user), `internalNotes?` (admin use), `contacted` (boolean)
- `createdAt`

### TaxiLead
VIP pickup interest form submissions.
- `id`, `name`, `email`, `phone?`, `preferredDate?`
- `notes?`, `internalNotes?`, `contacted`
- `createdAt`

### EmailCampaign
Log of admin-sent email campaigns.
- `id`, `subject`, `bodyHtml`, `recipientCount`, `sentAt`, `createdAt`

### SmsCampaign
Log of admin-sent SMS campaigns.
- `id`, `message`, `recipientCount`, `sentAt`, `createdAt`

### AdminUser
Reserved for future DB-backed admin users. Currently admin credentials are env vars.
- `id`, `username`, `passwordHash`, `totpSecret?`, `createdAt`

---

## Admin Auth Flow

1. Admin navigates to `/system-ops/login`
2. Enters username + password (validated against `ADMIN_USERNAME` + `ADMIN_PASSWORD_HASH`)
3. If `TOTP_SECRET` env var is not set → first-time setup flow:
   - Server generates a TOTP secret and returns QR code
   - Operator scans with Google Authenticator
   - Operator verifies with a 6-digit code
   - Operator sets `TOTP_SECRET=<base32secret>` in Railway and redeploys
4. If `TOTP_SECRET` is set → operator enters 6-digit TOTP code
5. On success → JWT session cookie set (`vc_session`), valid 8 hours
6. Middleware at `middleware.ts` protects all `/system-ops/*` routes (except login)

**To generate initial password hash:**
```bash
node -e "require('bcryptjs').hash('yourpassword', 12).then(console.log)"
```
Set the output as `ADMIN_PASSWORD_HASH` in Railway.

---

## Directory Structure

```
/app
  /api
    /auth/login        POST — credential + TOTP login
    /auth/logout       POST — clear session
    /auth/setup-totp   GET (gen QR), POST (verify token)
    /contacts          POST — public Players Club / signup form
    /catering          POST — public catering inquiry
    /taxi              POST — public VIP pickup interest
    /admin/contacts    GET (list), /[id] GET/PATCH/DELETE
    /admin/catering    GET (list), /[id] GET/PATCH
    /admin/taxi        GET (list), /[id] GET/PATCH
    /admin/email-campaign  GET (history), POST (send)
    /admin/sms-campaign    GET (history), POST (send)
    /health            GET — Railway health check
  /system-ops          Admin dashboard (protected by middleware)
    /login             Login page
    /contacts          Contact table + detail drawer
    /catering          Catering leads table
    /taxi              Taxi leads table
    /email             Email campaign composer
    /sms               SMS campaign composer
    /campaigns         Campaign history
    /settings          Password + TOTP management
/components
  /public              Public site React components
  /admin               Admin UI components (AdminNav)
/content
  site.ts              All public copy, hours, menu, address — edit here
/lib
  prisma.ts            Prisma singleton
  auth.ts              Session JWT, bcrypt, TOTP utilities
  email.ts             Resend email functions + base layout template
  sms.ts               Twilio SMS functions
  admin-guard.ts       API route auth middleware helper
/prisma
  schema.prisma        Full database schema
```

---

## Deployment (Railway)

1. Create Railway project
2. Add PostgreSQL plugin → copy `DATABASE_URL`
3. Connect GitHub repo `mrhoovermt/victorian` (branch: `master`)
4. Set all environment variables listed above
5. Railway uses `railway.toml` → runs `npx prisma migrate deploy && npm start`
6. Generate admin password hash locally, set as `ADMIN_PASSWORD_HASH`
7. On first login, complete TOTP setup flow → set `TOTP_SECRET` → redeploy

---

## DNS / Cloudflare Setup

1. Point `victoriancasinowhitefish.com` → Railway domain (CNAME or A record)
2. Enable Cloudflare proxy (orange cloud)
3. SSL: Full (strict) mode in Cloudflare
4. The app trusts Cloudflare proxy headers — no additional config needed
5. Optional: set Cloudflare Page Rule to always use HTTPS

---

## Content Updates

All public copy lives in `content/site.ts`. Update there for:
- Hours, address, phone
- Menu items
- Gaming description
- Catering event types
- Taxi section copy

## Media / Gallery

Drop photos and videos into `public/media/`. The gallery currently shows placeholder tiles. To wire up real media, update `components/public/Gallery.tsx` to read from a media manifest or use Next.js static imports.

---

## Email Templates

All transactional emails use the `baseLayout()` function in `lib/email.ts`. The template uses inline styles compatible with all email clients. Victorian Casino branding (gold `#c9a96e`, dark background) is applied consistently.

Transactional triggers:
- Players Club signup → welcome email + optional SMS
- Catering inquiry → confirmation to inquirer + admin notification
- Taxi request → confirmation to inquirer + admin notification
- All new leads → admin notification email

---

## Birthday Promo Framework

`Contact.birthdayMonth` and `Contact.birthdayDay` are stored. The trigger logic for birthday emails should be implemented as a Railway cron job or external scheduler that queries contacts where `birthdayMonth = current_month AND birthdayDay = current_day` and calls Resend. Template can be added to `lib/email.ts`.
