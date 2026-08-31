# 🚗 Instant Mechanic - Live Operations SaaS Dashboard

A production-grade, full-stack **Live Vehicle Service Operations Dashboard** built for **Instant Mechanic**. Designed for operations teams to monitor live customer service bookings, manage fleet technician dispatches, track realtime revenue metrics, and simulate live operational lifecycle transitions.

---

## 🌟 Key Highlights & Features

1. **Operations Overview & Real-Time KPIs**
   - **8 Core KPI Counters**: Total Bookings, Today's Bookings, Completed Jobs, Pending Dispatch, Cancelled Bookings, Total Revenue, Active Mechanics, New Customers.
   - **Live Pulse Activity Ticker**: Instant real-time updates as mechanics move and job statuses transition.
   - **Interactive Analytics**: Revenue & Bookings over time (Area Charts), Service Category Donut Breakdown, and Pipeline Progress Bars.

2. **Live Operational Engine & Real-Time Telemetry**
   - Built on **Server-Sent Events (SSE)** via `/api/live-stream`.
   - Dynamic lifecycle transitions (`Pending` ➔ `Assigned` ➔ `Mechanic On The Way` ➔ `In Service` ➔ `Completed`) update the UI instantaneously **without requiring a page reload**.
   - Built-in **Live Simulation Engine** with toggleable auto-tick intervals (3s, 5s, 10s) and manual event triggers.

3. **Fleet Radar & Interactive Mechanics GPS Map**
   - Live visual radar map tracking 25 mobile workshop vans across metropolitan sectors.
   - Status indicators (Available, En Route, In Service, Offline) with animated pulse halos.
   - Technician profile modal with lifetime rating, completed jobs, direct dispatch controls, and active vehicle assignment.

4. **Professional Bookings Data Grid**
   - Comprehensive multi-filter engine (Status, Service Category, Sorting by date/amount/status).
   - Global full-text search across Booking ID, Customer name, and Vehicle License Plate.
   - Slide-over **Booking Detail Drawer** with complete customer profile, vehicle specifications, assigned technician, cost breakdown, and chronological status timeline history.
   - One-click **CSV Data Export** (`/api/export/csv`).

5. **API Documentation & OpenAPI 3.0 Gateway**
   - Integrated OpenAPI 3.0 specification available at `/api/docs`.
   - Interactive live testing explorer directly at `/api-docs`.

---

## 📐 System Architecture

```
                                  ┌───────────────────────────────┐
                                  │       Client Browser          │
                                  │ (Next.js 14 / React / Tailwind)│
                                  └───────▲───────────────┬───────┘
                                          │               │
                                 SSE Live │               │ REST API
                                   Events │               │ (CRUD / Search)
                                          │               │
                                  ┌───────┴───────────────▼───────┐
                                  │      Next.js Route Handlers   │
                                  │      & Realtime Event Hub     │
                                  └───────▲───────────────┬───────┘
                                          │               │
                              Live Status │               │ Prisma ORM
                              Transitions │               │ (Type-Safe SQL)
                                          │               │
                                  ┌───────┴───────────────▼───────┐
                                  │   SQLite / PostgreSQL DB      │
                                  │  (560+ Bookings, 25 Mechanics)│
                                  └───────────────────────────────┘
```

---

## 🛠️ Tech Stack

- **Frontend**: Next.js 14 (App Router), React 18, TypeScript, Tailwind CSS, Lucide Icons, Recharts, Framer Motion.
- **Backend & APIs**: Next.js Route Handlers, Server-Sent Events (SSE), RESTful JSON endpoints.
- **Database & ORM**: Prisma ORM, SQLite (local zero-config) / PostgreSQL (production-ready).
- **Deployment & DevOps**: Docker, Docker Compose, GitHub Actions CI, Vercel & AWS EC2 deployment ready.

---

## 🚀 Local Development Setup

### 1. Prerequisites
- Node.js (v18+ or v20+ recommended)
- npm or pnpm

### 2. Installation & Database Setup
```bash
# Clone repository
git clone https://github.com/your-username/instant-mechanic-dashboard.git
cd instant-mechanic-dashboard

# Install dependencies
npm install

# Initialize database and populate 560+ seed records
npx prisma generate
npx prisma db push
node prisma/seed.js

# Start development server
npm run dev
```

Visit **`http://localhost:3000`** in your browser.

---

## 🌐 Environment Variables

Create a `.env` file in the root directory:

```env
DATABASE_URL="file:./dev.db"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

For PostgreSQL deployments (e.g. Supabase, Neon, AWS RDS):
```env
DATABASE_URL="postgresql://username:password@host:5432/dbname?schema=public"
```

---

## 📚 API Endpoints Overview

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/dashboard` | Returns operational KPIs, revenue time series, and category breakdowns. |
| `GET` | `/api/bookings` | List bookings with pagination, multi-filters, sorting, and search. |
| `POST` | `/api/bookings` | Create a new vehicle service booking & emit live event. |
| `GET` | `/api/bookings/:id` | Fetch single booking with complete timeline history. |
| `PATCH` | `/api/bookings/:id` | Update status (Pending ➔ Assigned ➔ En Route ➔ In Progress ➔ Completed). |
| `GET` | `/api/mechanics` | List all 25 mechanics with live status, rating, and telemetry. |
| `PATCH` | `/api/mechanics/:id` | Update mechanic status and GPS coordinates. |
| `GET` | `/api/customers` | Directory of registered vehicle owners and lifetime spend. |
| `GET` | `/api/live-stream` | Server-Sent Events (SSE) stream for real-time dashboard push. |
| `POST` | `/api/simulator` | Advances operations simulation by 1 step. |
| `GET` | `/api/export/csv` | Stream CSV export of filtered bookings. |
| `GET` | `/api/docs` | OpenAPI 3.0 specification JSON. |

---

## ☁️ Deployment Instructions

### Option A: Frontend on Vercel
1. Push your repository to GitHub.
2. Import project into [Vercel](https://vercel.com).
3. Set Build Command: `npx prisma generate && npm run build`.
4. Deploy!

### Option B: Backend & Full Stack on AWS (EC2 / ECS / Lightsail)
1. Launch an Ubuntu EC2 instance (t2.micro / t3.micro on AWS Free Tier).
2. Install Docker & Docker Compose:
   ```bash
   sudo apt-get update
   sudo apt-get install -y docker.io docker-compose
   ```
3. Clone repo and start container:
   ```bash
   git clone <repo_url>
   cd instant-mechanic-dashboard
   docker-compose up -d --build
   ```
4. Open Security Group Port `3000` (or configure Nginx reverse proxy with SSL via Certbot).

---

## 🤖 AI Usage Transparency Statement

In accordance with Section 6 & 9 of the assignment instructions:
- **AI Tools Used**: Claude 3.7 / Gemini AI Agent.
- **Used For**:
  - Accelerated initial scaffolding of TypeScript models, Prisma schema, and Next.js App Router endpoints.
  - Generating realistic seed datasets for automotive service categories and technician profiles.
  - Designing responsive Tailwind CSS component layouts and Recharts data bindings.
- **Architectural & Implementation Ownership**:
  - Implemented the Server-Sent Events (SSE) broadcast hub and interactive simulation loop.
  - Designed the data model relationships between Customers, Vehicles, Mechanics, Bookings, and Status Timelines.
  - Built custom filter, search, and CSV streaming algorithms.

---

## 📩 Final Submission Details

- **GitHub Repository**: `[Your GitHub Repository Link]`
- **Live Frontend URL**: `[Your Vercel URL]`
- **Live Backend URL**: `[Your AWS / Vercel Backend URL]`
- **API Documentation**: `/api-docs` or `/api/docs`
- **What I am Most Proud Of**: The combination of real-time SSE streaming with the interactive operations simulator that lets evaluators witness live mechanic dispatches and status transitions without page refreshes.
