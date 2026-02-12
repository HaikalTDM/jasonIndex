# Deployment Guide: Vercel + Supabase

## Prerequisites
- Vercel account (https://vercel.com)
- Supabase account (https://supabase.com)
- Git repository (GitHub, GitLab, or Bitbucket)

## Step 1: Set Up Supabase Database

### 1.1 Create a New Supabase Project
1. Go to https://supabase.com/dashboard
2. Click "New Project"
3. Fill in project details and wait for setup to complete

### 1.2 Create the Vendors Table
1. Go to the SQL Editor in your Supabase dashboard
2. Run the SQL script from `supabase/schema.sql` (created in this repo)
3. This will create the `vendors` table with all necessary columns

### 1.3 Get Your Supabase Credentials
1. Go to Project Settings → API
2. Copy these values (you'll need them later):
   - `Project URL` (SUPABASE_URL)
   - `anon/public` key (SUPABASE_ANON_KEY)
   - `service_role` key (SUPABASE_SERVICE_KEY) - for admin operations

## Step 2: Prepare Your Code for Deployment

### 2.1 Push to Git
```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin YOUR_REPO_URL
git push -u origin main
```

## Step 3: Deploy to Vercel

### 3.1 Import Project
1. Go to https://vercel.com/new
2. Import your Git repository
3. Vercel will auto-detect it's a Vite project

### 3.2 Configure Build Settings
- **Framework Preset**: Vite
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Install Command**: `npm install`

### 3.3 Add Environment Variables
In Vercel project settings → Environment Variables, add:

```
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_KEY=your_supabase_service_role_key
GEMINI_API_KEY=your_gemini_api_key (optional)
```

### 3.4 Deploy
Click "Deploy" and wait for the build to complete!

## Step 4: Migrate Existing Data (Optional)

If you have existing data in `src/data/vendors.json`:

1. Go to Supabase Dashboard → Table Editor → vendors
2. Click "Insert" → "Insert row" for each vendor, OR
3. Use the provided migration script:

```bash
node scripts/migrate-to-supabase.js
```

## Step 5: Configure Serverless Functions

The API routes are now handled by Vercel Serverless Functions in the `api/` directory.

## Troubleshooting

### Build Fails
- Check that all environment variables are set correctly
- Ensure `package.json` has correct build script
- Check Vercel build logs for specific errors

### Database Connection Issues
- Verify Supabase URL and keys are correct
- Check Supabase project is not paused
- Ensure RLS (Row Level Security) policies are set correctly

### API Routes Not Working
- Verify serverless functions are in the `api/` directory
- Check function logs in Vercel dashboard
- Ensure CORS is configured correctly

## Post-Deployment

### Enable Row Level Security (RLS)
For production, enable RLS on your Supabase tables:

```sql
ALTER TABLE vendors ENABLE ROW LEVEL SECURITY;

-- Allow public read access
CREATE POLICY "Allow public read access" ON vendors
  FOR SELECT USING (true);

-- Allow authenticated users to insert/update/delete
CREATE POLICY "Allow authenticated users full access" ON vendors
  FOR ALL USING (auth.role() = 'authenticated');
```

### Custom Domain
1. Go to Vercel project settings → Domains
2. Add your custom domain
3. Follow DNS configuration instructions

## Useful Commands

```bash
# Local development
npm run dev

# Build for production
npm run build

# Preview production build locally
npm run preview

# Deploy to Vercel (if using Vercel CLI)
vercel --prod
```

## Support

- Vercel Docs: https://vercel.com/docs
- Supabase Docs: https://supabase.com/docs
- Vite Docs: https://vitejs.dev/guide/
