# Quick Deployment Guide

## 🚀 Deploy in 10 Minutes

### Step 1: Install Supabase Dependency
```bash
npm install @supabase/supabase-js
```

### Step 2: Set Up Supabase

1. **Create Supabase Project**
   - Go to https://supabase.com/dashboard
   - Click "New Project"
   - Name it (e.g., "jason-food-index")
   - Wait for setup (~2 minutes)

2. **Run Database Schema**
   - Go to SQL Editor in Supabase
   - Copy contents of `supabase/schema.sql`
   - Paste and click "Run"

3. **Get API Keys**
   - Go to Settings → API
   - Copy:
     - `Project URL`
     - `anon public` key
     - `service_role` key (click "Reveal" first)

### Step 3: Deploy to Vercel

1. **Push to GitHub**
   ```bash
   git init
   git add .
   git commit -m "Ready for deployment"
   git branch -M main
   git remote add origin YOUR_GITHUB_REPO_URL
   git push -u origin main
   ```

2. **Import to Vercel**
   - Go to https://vercel.com/new
   - Import your GitHub repository
   - Vercel auto-detects Vite

3. **Add Environment Variables**
   In Vercel project settings → Environment Variables:
   ```
   VITE_SUPABASE_URL=https://xxxxx.supabase.co
   VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   SUPABASE_SERVICE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   GEMINI_API_KEY=AIzaSy... (optional)
   ```

4. **Deploy**
   - Click "Deploy"
   - Wait ~2 minutes
   - Done! 🎉

### Step 4: Migrate Existing Data (Optional)

If you have data in `src/data/vendors.json`:

1. **Add Supabase keys to local `.env`**
   ```bash
   cp .env.example .env
   # Edit .env with your Supabase credentials
   ```

2. **Run migration**
   ```bash
   node scripts/migrate-to-supabase.js
   ```

## ✅ Verification

After deployment:
1. Visit your Vercel URL
2. Check if vendors load
3. Try admin login (password: `jasonReview`)
4. Test adding/editing a vendor

## 🔧 Troubleshooting

### Build fails on Vercel
- Check environment variables are set
- Ensure all are added to "Production" environment

### No vendors showing
- Verify Supabase URL and keys
- Check Supabase table has data
- Look at Vercel function logs

### API errors
- Check Vercel function logs
- Verify RLS policies in Supabase
- Ensure service_role key is correct

## 📝 Important Notes

- **Local dev**: Still uses Express server + JSON file
- **Production**: Uses Vercel serverless functions + Supabase
- **Admin password**: Change in `src/pages/Admin.tsx` line 27
- **RLS**: Public can read, only service_role can write

## 🎯 Next Steps

1. **Custom Domain**: Add in Vercel settings
2. **Analytics**: Add Vercel Analytics
3. **Monitoring**: Set up Sentry or similar
4. **Backup**: Export Supabase data regularly

Need help? Check `DEPLOYMENT.md` for detailed guide.
