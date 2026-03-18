# VagasJP - Full-Stack Job Board

A modern full-stack job board built with React, Vite, Tailwind CSS, and Supabase.

## Tech Stack
- Frontend: React 18, Vite, Tailwind CSS
- Backend: Supabase (PostgreSQL, Auth, Storage)
- State Management: Zustand
- Routing: React Router v6
- Form Validation: React Hook Form + Zod
- i18n: react-i18next
- Host: Vercel

## Setup Instructions

1. Clone the repo from GitHub:
   ```bash
   git clone <repository-url>
   cd Kibojobs
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Environment Variables:
   Copy `.env.example` to `.env` and fill in your Supabase credentials:
   ```bash
   cp .env.example .env
   # Edit .env file with your VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY
   ```

4. Supabase Setup:
   - Create a new project in Supabase.
   - Run the initial migration. You can either:
     - Run `supabase db push` if you have the Supabase CLI configured locally.
     - Or copy the contents of `supabase/migrations/001_initial_schema.sql` and run it in the SQL Editor in your Supabase Dashboard.

5. Run Development Server:
   ```bash
   npm run dev
   ```
   Access the app locally at `http://localhost:5173`.

## Deployment

### Vercel
1. Connect your GitHub repository to Vercel.
2. In the Vercel project settings, add the following Environment Variables:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
3. Trigger a deployment. Vercel will automatically use the `build` command and handle the routing fallback using `vercel.json`.

## Branching Strategy
- `main` - Production
- `develop` - Staging / Active development
- `feature/*` - Feature branches

## License
MIT
