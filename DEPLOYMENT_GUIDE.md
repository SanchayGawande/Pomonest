# 🚀 WorkStreak Deployment Guide

Complete guide to deploy WorkStreak to Vercel for production.

## 📋 Pre-Deployment Checklist

### ✅ Current Status
- [x] Build working successfully
- [x] Google Ads integration ready
- [x] Pro subscription system functional
- [x] Authentication system working
- [x] Timer and analytics working
- [ ] Legal pages added
- [ ] SEO optimization
- [ ] Production environment variables

## 🔧 Step 1: Environment Variables Setup

### Required Environment Variables for Production:

```bash
# Supabase Configuration (Required)
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Stripe Configuration (Required for Pro features)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_... # Use live keys for production
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...

# App Configuration
NEXTAUTH_URL=https://your-domain.com
NEXTAUTH_SECRET=your-strong-random-secret
NODE_ENV=production
NEXT_PUBLIC_APP_URL=https://your-domain.com

# Google AdSense (Leave empty until approved)
NEXT_PUBLIC_ADSENSE_CLIENT_ID=
NEXT_PUBLIC_GA_MEASUREMENT_ID=
```

## 🌐 Step 2: Vercel Deployment

### Option A: Deploy via Vercel CLI
```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Deploy from root directory
cd /Users/sanchay/AI\ project/streak-habit-forge
vercel

# Follow prompts:
# - Link to existing project or create new
# - Set up custom domain
# - Configure environment variables
```

### Option B: Deploy via GitHub Integration
```bash
# 1. Push to GitHub
git add .
git commit -m "feat: Prepare for production deployment with Google Ads integration"
git push origin main

# 2. Connect to Vercel
# - Go to vercel.com
# - Import GitHub repository
# - Configure settings below
```

### Vercel Configuration:
```json
{
  "framework": "nextjs",
  "buildCommand": "cd apps/web && pnpm build",
  "outputDirectory": "apps/web/.next",
  "installCommand": "pnpm install",
  "devCommand": "cd apps/web && pnpm dev --port 3000"
}
```

## 📝 Step 3: Add Legal Pages (Required for AdSense)

The following pages are required for Google AdSense approval:

### 1. Privacy Policy
Create: `apps/web/app/privacy/page.tsx`

### 2. Terms of Service  
Create: `apps/web/app/terms/page.tsx`

### 3. About Page
Create: `apps/web/app/about/page.tsx`

### 4. Contact Page
Create: `apps/web/app/contact/page.tsx`

## 🔍 Step 4: SEO Optimization

### Update metadata in `app/layout.tsx`:
```tsx
export const metadata: Metadata = {
  title: 'WorkStreak - Pomodoro Timer & Productivity App',
  description: 'Free online Pomodoro timer with habit tracking, task management, and analytics. Build focus streaks and boost productivity with the 25/5 technique.',
  keywords: 'pomodoro timer, productivity app, focus timer, habit tracker, time management',
  openGraph: {
    title: 'WorkStreak - Pomodoro Timer & Productivity App',
    description: 'Free online Pomodoro timer with habit tracking, task management, and analytics.',
    url: 'https://your-domain.com',
    siteName: 'WorkStreak',
    images: [{
      url: 'https://your-domain.com/og-image.png',
      width: 1200,
      height: 630,
    }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'WorkStreak - Pomodoro Timer & Productivity App',
    description: 'Free online Pomodoro timer with habit tracking and analytics.',
    images: ['https://your-domain.com/og-image.png'],
  },
}
```

## ⚡ Step 5: Performance Optimization

### Current Bundle Analysis:
- Main page: 45.7 kB (Good)
- First Load JS: 283 kB (Acceptable)
- Total routes: 16 pages

### Optimization Checklist:
- [x] Code splitting implemented
- [x] Dynamic imports for heavy components
- [x] Image optimization with Next.js
- [x] CSS optimization with Tailwind
- [ ] Add `sitemap.xml`
- [ ] Add `robots.txt`

## 🔒 Step 6: Security Configuration

### Headers Configuration
Add to `next.config.js`:
```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin',
          },
        ],
      },
    ]
  },
}

module.exports = nextConfig
```

## 📊 Step 7: Analytics & Monitoring

### Add Google Analytics (Before AdSense)
```tsx
// Already implemented in layout.tsx
// Will activate when NEXT_PUBLIC_GA_MEASUREMENT_ID is set
```

### Vercel Analytics
Add to `package.json`:
```bash
pnpm add @vercel/analytics
```

## 🎯 Step 8: Domain Configuration

### Custom Domain Setup:
1. **Purchase domain** (recommended: workstreak.com)
2. **Add to Vercel**: Settings → Domains
3. **Configure DNS** as instructed by Vercel
4. **Enable HTTPS** (automatic with Vercel)

### Domain Examples:
- `workstreak.com`
- `focusstreak.app`
- `pomodorostreak.io`

## 🚀 Step 9: Deployment Process

### Production Deployment Commands:
```bash
# Final build test
pnpm build

# Deploy to production
vercel --prod

# Verify deployment
curl -I https://your-domain.com
```

### Post-Deployment Checklist:
- [ ] Site loads correctly
- [ ] All pages accessible
- [ ] Authentication working
- [ ] Stripe payments working
- [ ] Timer functionality working
- [ ] Mobile responsive
- [ ] HTTPS enabled
- [ ] No console errors

## 🎉 Step 10: Post-Deployment Setup

### 1. Configure Supabase for Production
- Update allowed origins in Supabase dashboard
- Add production domain to auth settings

### 2. Configure Stripe for Production
- Switch to live API keys
- Update webhook endpoints
- Test payment flow

### 3. Monitor Performance
- Check Vercel analytics
- Monitor Core Web Vitals
- Check for any errors

## 📈 Step 11: Prepare for AdSense (Week 2-3)

### Content Strategy:
1. **Add blog section** with productivity articles
2. **Create how-to guides** for Pomodoro technique
3. **Add user testimonials** and success stories
4. **Regular content updates** to show activity

### Traffic Building:
1. **Social media sharing**
2. **Product Hunt launch**
3. **Reddit communities** (r/productivity, r/getmotivated)
4. **Indie hacker communities**

## 🔧 Troubleshooting

### Common Issues:

**Build Failures:**
```bash
# Clear cache and rebuild
rm -rf .next node_modules
pnpm install
pnpm build
```

**Environment Variables:**
- Ensure all required variables are set in Vercel dashboard
- Check variable names match exactly
- Verify Supabase/Stripe keys are correct

**Domain Issues:**
- DNS propagation can take 24-48 hours
- Check domain configuration in Vercel
- Verify SSL certificate is active

## 📞 Support Resources

- **Vercel Documentation**: [vercel.com/docs](https://vercel.com/docs)
- **Next.js Deployment**: [nextjs.org/docs/deployment](https://nextjs.org/docs/deployment)
- **Supabase Deployment**: [supabase.com/docs/guides/getting-started/hosting](https://supabase.com/docs/guides/getting-started/hosting)

---

🎯 **Ready to deploy?** Follow these steps and your WorkStreak app will be live and ready for users within 1-2 hours!