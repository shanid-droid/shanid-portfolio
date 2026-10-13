# Supabase CMS Setup Guide for Muhammed Shanid Portfolio

This portfolio is equipped with a complete, secure CMS powered by **Supabase (PostgreSQL, Auth, and Storage)** and **Next.js 16**.

---

## 1. Quick Setup Steps

### Step 1: Create a Supabase Project
1. Log in to [Supabase](https://supabase.com).
2. Click **New Project**, name it `shanid-portfolio`, select your nearest region, and set a secure database password.

### Step 2: Run Database Migrations
1. In the Supabase Dashboard, navigate to the **SQL Editor** tab on the left sidebar.
2. Click **New query**, open the migration file [`supabase/migrations/20261013000000_initial_schema.sql`](file:///c:/Users/Lenovo/shanid-portfolio/supabase/migrations/20261013000000_initial_schema.sql), and copy its entire contents.
3. Paste the SQL into the Supabase SQL editor and click **Run**.
   - This creates all structured tables (`site_settings`, `projects`, `skills`, `education`, `certificates`, `participations`, `experiments`, `interests`, `messages`).
   - Enables Row Level Security (RLS) on every table.
   - Creates the public storage bucket `portfolio-media`.
   - Seeds the initial portfolio content without duplicating records.

### Step 3: Configure Authentication & Owner Account
1. In the Supabase Dashboard, go to **Authentication -> Users**.
2. Click **Add user** -> **Create user**.
3. Enter your owner email (e.g. `your-email@domain.com`) and choose a strong password. Confirm email.
4. Go to **Authentication -> Providers -> Email** and ensure Email provider is enabled.
5. In **Authentication -> URL Configuration**, ensure:
   - **Site URL**: `https://your-portfolio-domain.vercel.app` (or `http://localhost:3000` for development).
   - **Redirect URLs**: Include `http://localhost:3000/**` and `https://your-portfolio-domain.vercel.app/**`.

### Step 4: Configure Environment Variables
Copy `.env.example` to `.env.local`:
```bash
cp .env.example .env.local
```
Fill in the values:
```env
NEXT_PUBLIC_SUPABASE_URL=https://<your-project-id>.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<your-anon-key>
SUPABASE_SERVICE_ROLE_KEY=<your-service-role-key>
ADMIN_OWNER_EMAIL=your-email@domain.com
```

### Step 5: Deploy to Vercel
In your Vercel project settings under **Environment Variables**, add the same four variables:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `ADMIN_OWNER_EMAIL`

---

## 2. Security Architecture

- **No Public Signup**: Public visitors cannot create admin accounts. The login screen enforces email authentication.
- **Strict Server-Side Authorization**: Every Server Action and mutation verifies that the active session user's email strictly matches `process.env.ADMIN_OWNER_EMAIL`.
- **Row Level Security (RLS)**: Public queries can only view records where `published = true`. Unpublished drafts and contact messages (`messages`) are never accessible to anonymous users.
- **Service Role Protection**: `SUPABASE_SERVICE_ROLE_KEY` is strictly confined to server-side operations and never bundled into the client browser build.
- **Storage Protection**: The `portfolio-media` bucket allows public image reads, but uploads and deletions require an authenticated owner session.
