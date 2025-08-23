# Worksphere Web (Next.js)

A minimal Next.js + Tailwind frontend for the Worksphere API.

## Quickstart

```bash
pnpm i   # or npm i / yarn
cp .env.local.example .env.local
# Edit NEXT_PUBLIC_API_BASE
pnpm dev
```

Deploy to Vercel by importing the repo. Set `NEXT_PUBLIC_API_BASE` in Vercel Project Settings → Environment Variables.

At runtime, paste your Bearer token via **Settings → Auth**. It is stored in `localStorage` and used for all API calls.

## Features

- Advisors list
- Appointments (list, order, confirm, review, open URL)
- Wallet (balance, transactions, refill, withdraw)
- Profile/Advisor settings (about me, pricing, language, timezone, availability)
- Device save
- Client-side token manager

> Endpoints are best-effort mapped from your spec and may need small tweaks to match exact schemas/validation.
