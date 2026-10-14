# Ultimate Tyres Australia — Commercial Fleet & Tyre Distribution Platform

Next.js 16 App Router enterprise web application for **Ultimate Tyres Australia**, featuring high-performance commercial tyre distribution, interactive Australian dealer & fitment network locator, comprehensive fleet service pages, and an authorized B2B wholesale dealer portal backed by **MongoDB**.

---

## Key Features

- **Commercial Tyre Distribution**: Comprehensive tyre ranges across **Ralson**, **Blacklion**, and **Triangle**.
- **Interactive Australian Service Network**: Real-time state-filtered interactive map and workshop locator with emergency roadside callouts and capability badges.
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
Copy `.env.example` to `.env.local`:
```bash
cp .env.example .env.local
```

Configure your environment variables:
```env
MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/?retryWrites=true&w=majority
MONGODB_DB=ultimate_tyres
SESSION_SECRET=your-random-32-character-session-secret-key
NEXT_PUBLIC_PHONE=1300 110 002
NEXT_PUBLIC_WHATSAPP=61482094850
BOOTSTRAP_ADMIN_EMAIL=admin@ultimatetyres.com.au
BOOTSTRAP_ADMIN_PASSWORD=your-secure-admin-password
```

### 3. Install Dependencies & Build
```bash
npm install
npm run build
```

### 4. Seed Database (Optional)
To initialize collections, indexes, initial workshop locations, product catalogue, and the default admin account in your MongoDB:
```bash
npm run db:setup
```

### 5. Run Locally
```bash
npm run dev
```
Visit [http://localhost:3000](http://localhost:3000) to view the application.

---

## Deploying to Vercel

1. Push your repository to GitHub.
2. In [Vercel](https://vercel.com), click **Add New Project** and select `ultimate-tyre`.
3. In the **Environment Variables** section, add:
   - `MONGODB_URI`: Your MongoDB Atlas connection URI.
   - `MONGODB_DB`: `ultimate_tyres`
   - `SESSION_SECRET`: A secure random string (at least 32 characters).
   - `NEXT_PUBLIC_PHONE`: `1300 110 002`
   - `NEXT_PUBLIC_WHATSAPP`: `61482094850`
4. Click **Deploy**. Vercel will automatically build and launch your application globally on its high-speed edge CDN.
