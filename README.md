# Lillelogg - "The little log for your big emotional journey."

Welcome to the Lillelogg, a Progressive Web App (PWA) repository! This project aims to provide new and experienced parents, with a simple, intuitive, and calm way to track their baby's activities, growth, and milestones.

My focus is on a soothing, supportive, clean, modern, intuitive, trustworthy, gentle, and inclusive user experience.

## ✨ Design Principles: Lillelogg's Calm Aesthetic

**STATUS: Established and integrated into the design system.**

The UI design is central to Lillelogg's brand, moving towards a calm, light aesthetic.

*   **Overall Aesthetic:** Modern, clean, minimalist, user-friendly, intuitive, soothing, calm, gentle.
*   **Layout:** Mobile-first responsive design with generous negative space and clear information hierarchy.
*   **Corners:** Ubiquitous rounded corners (`rounded-xl`, `rounded-2xl`, `rounded-3xl`).
*   **Icons:** Simple, bold, and clear line icons (e.g., from React Icons/Font Awesome).
*   **Color Palette:** All colors are defined and centralized within `src/app/globals.css` using Tailwind CSS v4's `@theme` directive, ensuring consistency across the application. Key colors include:
    *   `light-background` (#FFFFFF)
    *   `card-background` (#F2F6FA)
    *   `primary-blue` (#4D85FF)
    *   `secondary-pink` (#FFDDE2), `secondary-yellow` (#FFECB3), `secondary-green` (#C8E6C9)
    *   `dark-text` (#333333), `muted-text` (#6B7280)
*   **Typography:** Inter (sans-serif) font family for all text, with bold/semi-bold for headlines and regular for body text.

## 🚀 Core Features (MVP - Future Phases)

*   **Authentication & User/Baby Profile Setup:** Secure user accounts and initial baby growth input.
*   **Activity Logging:** Easy tracking for feedings, sleep, and diaper changes.
*   **Growth Tracking:** Logging and basic charting of baby's growth.
*   **Routines & Milestones:** Setup daily routines and track key developmental milestones.
*   **Photo Journal & Resources:** A visual timeline of photos and in-app parent resources.
*   **Internationalization:** Full support for English and Norwegian content.

##  High-Level Roadmap (Project Scope)

The project is structured into 3 phases over 8 weeks.

*   **Phase 1: Foundation & Core Backend (Weeks 1-2) - CURRENT PHASE**
    *   **STATUS: Weeks 1 & 2 COMPLETE.**
    *   **Accomplishments (Week 1):** Project Setup, Design System (Tailwind v4 @theme), Internationalization (EN/NO) core, Landing Page UI & custom login/signup forms.
    *   **Accomplishments (Week 2):**
        *   **Database (Supabase) & ORM (Prisma) Setup:** Successfully connected to a Supabase PostgreSQL database via Prisma, including `.env.local` configuration and `dotenv-cli` integration for reliable CLI commands. Configured `tsconfig.json` for custom Prisma Client output.
        *   **Core Database Models Defined:** Designed and applied a comprehensive Prisma schema with all essential models and their relationships, implementing strong typing with enums, improved indexing, soft deletes, and timezone considerations.
        *   **NextAuth.js Backend Configured:** Set up NextAuth.js for authentication using the Prisma adapter, with support for Credentials (email/password) and Google OAuth providers. Configured JWT sessions, custom callbacks for user roles, and custom sign-in page routing.
        *   **Initial API Routes Implemented:** Created secure `POST /api/register` (for user sign-up with password hashing via `bcryptjs`) and `POST /api/baby` (for authenticated users to create baby profiles and link them as owners). Integrated `zod` for API input validation.
*   **Phase 2: Frontend UI & Core Functionality (Weeks 3-6)**
    *   Authentication UI & Baby Profile Setup (with initial growth input)
    *   Main Dashboard (Activity Summary, Daily Tip, Upcoming Routines)
    *   Activity Logging (Feeding, Sleep, Diaper)
    *   Growth Logging & Basic Growth Chart
    *   Routines Setup & Management
    *   Milestones Tracking (list, add, age-based suggestions)
    *   Photo Journal (timeline view of all photos)
    *   Parent Resources (in-app articles/links)
*   **Phase 3: Polish PWA  (Weeks 7-8)**
    *   UI/UX Refinements & Responsiveness
    *   PWA Implementation (offline caching, in-app routine reminders)
    *   Basic Settings Screen
    *   Comprehensive Testing (Unit, API, E2E)

## 📦 Technical Stack

*   **Framework:** Next.js (App Router, v15.x)
*   **Language:** TypeScript (v5.x)
*   **Styling:** Tailwind CSS (configured via `src/app/globals.css @theme`, v4.x)
*   **Database:** Supabase (PostgreSQL)
*   **ORM:** Prisma (v6.x)
*   **Authentication:** NextAuth.js (v4.x) with `@next-auth/prisma-adapter`
*   **Internationalization:** `react-i18next`, `i18next`, `i18next-http-backend`, `i18next-browser-languagedetector`
*   **UI Primitives:** `tailwind-variants`
*   **Environment Variable Loading (CLI):** `dotenv-cli`
*   **Icons:** `react-icons` (Font Awesome)
*   **Password Hashing:** `bcryptjs`
*   **Schema Validation:** `zod`

## 🛠️ Getting Started

Follow these instructions to get a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

Ensure you have [Node.js](https://nodejs.org/en/) (v18.x or later recommended) and [npm](https://www.npmjs.com/) installed.

### Installation

1.  **Clone the repository:**
    ```bash
    git clone [YOUR_GITHUB_REPO_URL_HERE]
    cd lillelogg
    ```
    (Replace `[YOUR_GITHUB_REPO_URL_HERE]` with your actual GitHub repository URL).

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Set up environment variables:**
    Create a `.env.local` file in the root of the project based on `.env.example`.
    ```bash
    cp .env.example .env.local
    ```
    Edit `.env.local` and fill in the necessary values:
    ```
    NEXTAUTH_URL=http://localhost:3000
    NEXTAUTH_SECRET=YOUR_SECURE_RANDOM_SECRET_HERE
    # Add your Supabase and Google OAuth credentials here
    DATABASE_URL="postgresql://postgres:[YOUR-DB-PASSWORD]@db.[YOUR-PROJECT-REF].supabase.co:5432/postgres?pgbouncer=true"
    NEXT_PUBLIC_SUPABASE_URL="https://[YOUR-PROJECT-REF].supabase.co"
    NEXT_PUBLIC_SUPABASE_ANON_KEY="[YOUR-ANON-KEY]"
    GOOGLE_CLIENT_ID="[YOUR-GOOGLE-CLIENT-ID]"
    GOOGLE_CLIENT_SECRET="[YOUR-GOOGLE-CLIENT-SECRET]"
    ```
    For `NEXTAUTH_SECRET`, you can generate a random string, e.g., using `openssl rand -base64 32` or an online secret generator.

### Running the Development Server

To run the application in development mode:

```bash
npm run dev

```
### Database and Prisma Commands

To manage your database schema and run migrations, use the following commands:
```bash
# Generate Prisma Client
npm prisma generate
# Create a new migration
npm prisma migrate dev --name [migration_name]
# Reset the database (use with caution)
npm prisma migrate reset
# Open Prisma Studio to view and manage your database
npm prisma studio
```