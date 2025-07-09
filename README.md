# Lillelogg - "The little log for your big emotional journey."

Welcome to the Lillelogg, a Progressive Web App (PWA) repository! This project aims to provide new and experienced parents, with a simple, intuitive, and calm way to track their baby's activities, growth, and milestones.

My focus is on a soothing, supportive, clean, modern, intuitive, trustworthy, gentle, and inclusive user experience.

## ✨ Design Principles: Lillelogg's Calm Aesthetic

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

While this initial phase focuses on foundation, the MVP will include:

*   **Authentication & User/Baby Profile Setup:** Secure user accounts and initial baby growth input.
*   **Activity Logging:** Easy tracking for feedings, sleep, and diaper changes.
*   **Growth Tracking:** Logging and basic charting of baby's growth.
*   **Routines & Milestones:** Setup daily routines and track key developmental milestones.
*   **Photo Journal & Resources:** A visual timeline of photos and in-app parent resources.
*   **Internationalization:** Full support for English and Norwegian content.

## 📦 Technical Stack

*   **Framework:** Next.js (App Router)
*   **Language:** TypeScript
*   **Styling:** Tailwind CSS (configured via `src/app/globals.css @theme`)
*   **Database:** Supabase (PostgreSQL)
*   **ORM:** Prisma
*   **Authentication:** NextAuth.js
*   **Internationalization:** `react-i18next`, `i18next`, `i18next-http-backend`
*   **UI Components:** `tailwind-variants` for reusable UI primitives.

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
    # ... (Other Supabase/Prisma variables will be added in Week 2)
    ```
    For `NEXTAUTH_SECRET`, you can generate a random string, e.g., using `openssl rand -base64 32` or an online secret generator.

### Running the Development Server

To run the application in development mode:

```bash
npm run dev