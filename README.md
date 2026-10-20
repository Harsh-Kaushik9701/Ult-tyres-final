# Ultimate Tyres Australia — Commercial Fleet & Tyre Distribution Platform

Next.js 16 App Router enterprise web application for **Ultimate Tyres Australia**, featuring high-performance commercial tyre distribution, branch finder with Google Maps, comprehensive fleet service pages, and an authorized B2B wholesale dealer portal backed by **MongoDB**.

---

## Key Features

- **Commercial Tyre Distribution**: Comprehensive tyre ranges across **Ralson**, **Blacklion**, and **Triangle**.
- **Branches & Map**: Rocklea (head office), Yatala and Bald Hills with an embedded Google map, directions and services. Branch details live in `lib/branches.ts`.
- **Wholesale Dealer Portal**: Protected B2B portal with SKU rapid order booking, live wholesale pricing tiers, order status tracking, and account management.
- **Resilient MongoDB Database Integration**: Cached connection pooling optimized for serverless edge and Vercel deployments. Graceful local dataset fallbacks if MongoDB URI is pending.
- **Operations & Admin Management**: Review and approve dealer onboarding applications, update inventory stock, and manage dispatch locations.
- **Clean Modern Branding**: Integrated official Ultimate Tyres logo, high-contrast industrial automotive design system, dark mode accents, and responsive layout.

---

## Tech Stack

- **Framework**: Next.js 16 (App Router, React 19, TypeScript)
- **Database**: MongoDB (Official `mongodb` driver with serverless connection pooling)
- **Styling**: Modern Vanilla CSS Design System with dark mode tokens and micro-interactions
- **Hosting Target**: Vercel

---

## Getting Started

### 1. Prerequisites
- Node.js 20+
- A MongoDB cluster or database (e.g. free tier on [MongoDB Atlas](https://www.mongodb.com/cloud/atlas))

### 2. Environment Configuration
Copy `.env.example` to `.env.local` and fill it in:
```bash
cp .env.example .env.local
```
Key variables:
- `NEXT_PUBLIC_SITE_URL` – the live domain (used for canonical URLs, `og:url`, `og:image`, sitemap). Use `http://localhost:3000` locally.
- `SESSION_SECRET` – **required in production** (48+ random characters):
  `node -e "console.log(require('crypto').randomBytes(48).toString('base64url'))"`
- `MONGODB_URI` – optional for local testing; without it (or with no internet) the site uses its built-in catalogue and locations.
- `ENABLE_DEMO_LOGIN=true` – local-only demo logins (ignored in production builds).

### 3. Run on localhost (works offline)
```bash
npm install          # once, needs internet
npm run dev          # http://localhost:3000
```
No fonts, images or scripts are loaded from the internet, so every page renders on localhost with the network off (the embedded Google map is the only online part; offline it shows the branch address instead). With `ENABLE_DEMO_LOGIN=true` in `.env.local` you can sign in with `dealer@ultimatetyres.com.au / dealer123` or `admin@ultimatetyres.com.au / admin123` (dev server only).

To test the production build locally:
```bash
npm run build
SESSION_SECRET=<random-48-chars> npm start
```

### 4. Seed Database (Optional)
```bash
npm run db:setup
```
Creates collections, indexes, locations and the product catalogue. An admin account is created only when `BOOTSTRAP_ADMIN_EMAIL` and a `BOOTSTRAP_ADMIN_PASSWORD` of 12+ characters are set. A demo dealer is created only with `SEED_DEMO_DEALER=true` (remove it before going live).

---

## Server-side rendering

All public pages (Home, About, Services, Wheel Alignment, Insights and articles, products, network) are React **Server Components rendered on the server for every request**. The browser receives complete HTML, including titles, content and meta tags. Only small interactive parts run in the browser:
- `components/site-client.tsx` – header menu, home hero carousel, enquiry form
- `components/alignment-calculator.tsx` – savings calculator
- `components/branch-map.tsx` – switching the Google map between branches
- existing catalogue filter and dealer portal widgets

## Home page background video

The hero plays one looping 33-second reel. It opens with the branded service truck (`ut2.mp4`, seconds 9–18), followed by the best moments of UT01–UT04: watermarks cropped out, no audio, cross-faded. Everything is exported in Full HD. The sources are 480–1024 px wide, so they're upscaled with denoise and light sharpening. Files live in `public/videos/`:

| File | Used for | Resolution | Size |
| --- | --- | --- | --- |
| `hero-reel.av1.mp4` | Desktop, modern browsers | 1920×1080 | ~3.6 MB |
| `hero-reel.h264.mp4` | Desktop fallback (all browsers) | 1920×1080 | ~5.4 MB |
| `hero-reel-mobile.av1.mp4` / `.h264.mp4` | Phones (≤768px) | 1080×1440 | ~2.5 / 4.1 MB |
| `hero-reel-poster*.jpg` | Shown instantly before the video starts | — | 90–140 KB |

The browser downloads only one video. It starts after the page has loaded, pauses when scrolled out of view, and is skipped entirely with reduced motion or Data Saver turned on (the poster shows instead).

To rebuild with new clips (needs ffmpeg with libx264 and libsvtav1): `python3 scripts/build-hero-reel.py <folder with UT01–UT04.mp4 and ut2.mp4> public/videos`. Clip timings and crops are at the top of the script.

## SEO

- Per-page meta title, description, keywords, canonical URL, Open Graph (`og:title`, `og:description`, `og:url`, `og:image`) and Twitter card tags via `buildMetadata()` in `lib/seo.ts`.
- Copy for each page lives in `lib/page-seo.ts` – edit there.
- Default `og:image`: `public/images/og-ultimate-tyres.jpg` (1200×630). Each service and Insights article gets its own branded image generated on the server (`opengraph-image.tsx`); products use the product photo.
- JSON-LD structured data (Organization, BreadcrumbList, Service, BlogPosting), `robots.txt` and `sitemap.xml` use `NEXT_PUBLIC_SITE_URL`.

## Security

- `proxy.ts`: strict Content-Security-Policy with a per-request nonce; cross-site POST/PATCH to `/api/*` is blocked (CSRF).
- `next.config.ts`: HSTS, X-Frame-Options, nosniff, Referrer-Policy, Permissions-Policy, COOP/CORP.
- Login: no hard-coded/back-door accounts, bcrypt with timing-safe handling, rate limiting (per IP and per account), `HttpOnly` + `SameSite=Strict` cookie (`Secure` over HTTPS).
- Sessions are re-checked against MongoDB on every protected request, so deactivated accounts lose access immediately.
- API input is size-limited, type-checked and sanitised (no NoSQL operator injection); order prices come from the server.
- Wholesale prices and stock are never sent to public pages.
- Rate limiting is in-memory per server instance; for multi-instance/serverless hosting add a shared store (e.g. Redis).

---

## Deploying to Vercel

1. Push your repository to GitHub.
2. In [Vercel](https://vercel.com), click **Add New Project** and select `ultimate-tyre`.
3. In the **Environment Variables** section, add:
   - `MONGODB_URI`: Your MongoDB Atlas connection URI.
   - `MONGODB_DB`: `ultimate_tyres`
   - `SESSION_SECRET`: A secure random string (at least 32 characters) – required.
   - `NEXT_PUBLIC_SITE_URL`: `https://ultimatetyres.com.au`
   - `NEXT_PUBLIC_PHONE`: `1300 110 002`
   - `NEXT_PUBLIC_WHATSAPP`: `61482094850`
4. Click **Deploy**. Vercel will automatically build and launch your application globally on its high-speed edge CDN.
