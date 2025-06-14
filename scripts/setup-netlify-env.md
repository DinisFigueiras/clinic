# 🔧 Netlify Environment Variables Setup

## 📋 Required Environment Variables

Copy these environment variables to your Netlify deployment:

### 🗄️ Database Configuration
```
DATABASE_URL=postgresql://postgres.lawrznvawnannbnekjtk:Simba2000%40@aws-0-eu-west-1.pooler.supabase.com:5432/postgres
```

### 🔐 Clerk Authentication
```
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_bm90YWJsZS1yYXktMzMuY2xlcmsuYWNjb3VudHMuZGV2JA
CLERK_SECRET_KEY=sk_test_YwROdtaDTRze8w1jH2l1HbWqQRqEV8vgcZrR4AwzpG
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/
NEXT_PUBLIC_CLERK_AFTER_SIGN_OUT_URL=/
```

## 🚀 How to Add to Netlify

### Method 1: Netlify Dashboard
1. Go to: https://app.netlify.com/sites/clinica-sacavem/settings/deploys#environment-variables
2. Click "Add variable" for each one above
3. Copy the variable name and value exactly
4. Click "Save"
5. Redeploy your site

### Method 2: Netlify CLI (if you have it installed)
```bash
# Install Netlify CLI if needed
npm install -g netlify-cli

# Login to Netlify
netlify login

# Set environment variables
netlify env:set DATABASE_URL "postgresql://postgres.lawrznvawnannbnekjtk:Simba2000%40@aws-0-eu-west-1.pooler.supabase.com:5432/postgres"
netlify env:set NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY "pk_test_bm90YWJsZS1yYXktMzMuY2xlcmsuYWNjb3VudHMuZGV2JA"
netlify env:set CLERK_SECRET_KEY "sk_test_YwROdtaDTRze8w1jH2l1HbWqQRqEV8vgcZrR4AwzpG"
netlify env:set NEXT_PUBLIC_CLERK_SIGN_IN_URL "/"
netlify env:set NEXT_PUBLIC_CLERK_SIGN_UP_URL "/"
netlify env:set NEXT_PUBLIC_CLERK_AFTER_SIGN_OUT_URL "/"

# Trigger a new deployment
netlify deploy --prod
```

## ✅ Verification

After setting the environment variables:

1. **Trigger a new deployment** (push a small change or redeploy)
2. **Check the health endpoint**: https://clinica-sacavem.netlify.app/api/health
3. **Test database connection**: https://clinica-sacavem.netlify.app/api/test-db
4. **Visit your admin page**: https://clinica-sacavem.netlify.app/admin/

## 🔍 Troubleshooting

If you still get connection errors:

1. **Check Supabase status**: https://status.supabase.com/
2. **Verify database is not paused** in Supabase dashboard
3. **Check connection limits** in Supabase settings
4. **Try the direct connection URL** instead of pooler (if needed)

## 🚨 Security Note

These environment variables contain sensitive information. Make sure:
- ✅ They are set in Netlify dashboard (secure)
- ❌ Never commit them to your Git repository
- ❌ Never share them publicly

## 📝 Status
- Created: 2025-06-14
- Purpose: Fix database connection errors in production
- Status: Environment variables need to be added to Netlify
