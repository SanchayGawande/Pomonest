# Google AdSense Setup Guide for WorkStreak

This guide will help you set up Google AdSense for monetization in your WorkStreak app.

## 🚀 Quick Overview

WorkStreak now includes a comprehensive Google Ads system with:
- **Auto Ads** for automatic ad placement optimization
- **Manual Ad Placements** in header, sidebar, and footer
- **Pro User Ad-Free Experience** 
- **Ad Blocker Detection** with upgrade prompts
- **Revenue Tracking** and analytics
- **Responsive Ad Units** for all device sizes

## 📋 Prerequisites

1. **Google AdSense Account**: Apply at [adsense.google.com](https://adsense.google.com)
2. **Domain Verification**: Your domain must be verified and approved
3. **Content Guidelines**: Ensure your content meets AdSense policies

## 🔧 Setup Steps

### 1. Apply for Google AdSense

1. Go to [Google AdSense](https://adsense.google.com)
2. Create an account or sign in
3. Add your website URL (your WorkStreak domain)
4. Choose your payment location
5. Submit your application

### 2. Domain Verification

1. In AdSense dashboard, go to **Sites**
2. Add your domain
3. Add the AdSense code to your site (already done in layout.tsx)
4. Wait for verification (can take 24-48 hours)

### 3. Environment Variables

Once approved, add these to your `.env.local`:

```bash
# Google AdSense Configuration
NEXT_PUBLIC_ADSENSE_CLIENT_ID=ca-pub-xxxxxxxxxxxxxxxxx
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX
```

Replace `xxxxxxxxxxxxxxxxx` with your actual AdSense publisher ID.

### 4. Create Ad Units (Optional)

For manual ad placements, create ad units in AdSense:

1. Go to **Ads** → **By ad unit**
2. Create ad units for:
   - **Header Banner**: 728x90 or responsive
   - **Sidebar**: 300x250 or 300x600
   - **Footer**: Responsive

3. Copy the ad slot IDs and use them in AdManager components:

```tsx
<AdManager 
  placement="header" 
  adSlot="1234567890"  // Your actual slot ID
  onUpgradeClick={() => setShowProModal(true)}
/>
```

## 📍 Current Ad Placements

The app includes ads in these locations:

### 1. Header Ad
- **Location**: Below navigation bar
- **Format**: Responsive banner
- **Component**: `AdManager` with placement="header"

### 2. Sidebar Ad  
- **Location**: Right sidebar after stats cards
- **Format**: Square/vertical
- **Component**: `AdManager` with placement="sidebar"

### 3. Footer Ad
- **Location**: Bottom of main content
- **Format**: Responsive banner
- **Component**: `AdManager` with placement="footer"

### 4. Auto Ads
- **Location**: Automatic optimization by Google
- **Component**: `AppAutoAds` in root layout

## 🎯 Ad Features

### Ad-Free for Pro Users
```tsx
// Automatically hidden for Pro users
const isProUser = userData?.is_pro || false
if (isProUser) return null
```

### Ad Blocker Detection
```tsx
// Shows upgrade prompt when ad blocker detected
if (isAdBlockerDetected) {
  return <UpgradePrompt />
}
```

### Revenue Tracking
```tsx
// Automatic tracking in analytics.ts
analytics.trackAdImpression('banner')
analytics.trackAdClick('sidebar')
```

## 📊 Analytics Integration

The app tracks:
- **Ad Impressions**: Count and revenue
- **Click-through Rate**: Performance metrics  
- **Revenue per Mille**: RPM calculations
- **Ad Blocker Detection**: User behavior

Access metrics via:
```tsx
import { analytics } from '@/lib/analytics'

const metrics = analytics.getAdMetrics()
const totalRevenue = analytics.getTotalAdRevenue()
```

## 🔒 Policy Compliance

### Content Requirements
- ✅ Original, high-quality content
- ✅ User-friendly navigation
- ✅ Clear privacy policy
- ✅ Responsive design

### Technical Requirements  
- ✅ HTTPS enabled
- ✅ Fast loading times
- ✅ Mobile-friendly
- ✅ Proper AdSense code implementation

## 🚀 Production Deployment

### 1. Build and Deploy
```bash
pnpm build
# Deploy to your hosting platform
```

### 2. Verify Implementation
1. Check ads are showing (use incognito mode)
2. Verify ad-free experience for Pro users
3. Test ad blocker detection
4. Monitor revenue in AdSense dashboard

### 3. Optimization
- Monitor performance in AdSense
- Adjust ad placements based on revenue
- A/B test different ad sizes
- Use Auto Ads insights for optimization

## 🔧 Troubleshooting

### Ads Not Showing
1. **Check Environment Variables**: Ensure `NEXT_PUBLIC_ADSENSE_CLIENT_ID` is set
2. **Verify AdSense Approval**: Account must be approved and active
3. **Check Console Errors**: Look for AdSense-related errors
4. **Ad Blocker**: Test without ad blocker enabled

### Pro Users Seeing Ads  
1. **Check Pro Status**: Verify `userData?.is_pro` is working
2. **Database Sync**: Ensure Pro status is properly updated
3. **Clear Cache**: Clear browser cache and localStorage

### Low Revenue
1. **Placement Optimization**: Experiment with ad positions
2. **Auto Ads**: Enable Auto Ads for better optimization
3. **Content Quality**: Ensure high-quality, engaging content
4. **Traffic Growth**: Focus on increasing user engagement

## 📈 Revenue Optimization Tips

1. **Strategic Placement**: Place ads near engaging content
2. **Responsive Design**: Use responsive ad units
3. **Auto Ads**: Let Google optimize placements
4. **User Experience**: Balance ads with user experience
5. **A/B Testing**: Test different ad configurations
6. **Analytics**: Monitor performance and adjust accordingly

## 🎉 Success Metrics

Track these KPIs:
- **Monthly Revenue**: From AdSense dashboard
- **RPM (Revenue per Mille)**: Revenue per 1000 impressions
- **CTR (Click-through Rate)**: Click rate on ads
- **Pro Conversion Rate**: Users upgrading to remove ads
- **User Retention**: Impact on app usage

## 📞 Support

- **AdSense Help**: [support.google.com/adsense](https://support.google.com/adsense)
- **Policy Center**: [support.google.com/adsense/topic/1261918](https://support.google.com/adsense/topic/1261918)
- **Community Forum**: [adsense-en.googleblog.com](https://adsense-en.googleblog.com)

---

🎯 **Next Steps**: Apply for AdSense, get approved, add your publisher ID, and start earning from your productivity app!