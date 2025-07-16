# Google Analytics 4 Setup Guide for PomoNest Marketing

## Overview
Your GA4 tracking is already installed with ID: `G-TXL346B71K`
This guide helps you configure goals, conversions, and custom events for comprehensive marketing analytics.

## 🎯 Conversion Goals to Set Up

### 1. Sign-Up Conversion
**Event Name**: `sign_up`
**Goal Type**: Conversion
**Description**: Track user registrations

**To Set Up**:
1. Go to Admin → Events → Create event
2. Create custom event with condition: `event_name` equals `sign_up`
3. Mark as conversion in Admin → Conversions

### 2. Pro Upgrade Conversion  
**Event Name**: `purchase`
**Goal Type**: Conversion
**Description**: Track Pro subscription purchases
**Value**: Revenue from subscription

### 3. Landing Page Conversion
**Event Name**: `conversion`
**Goal Type**: Conversion
**Description**: Track conversions from landing page
**Custom Parameter**: `conversion_type` = `landing_signup`

### 4. Email Newsletter Signup
**Event Name**: `conversion`
**Goal Type**: Conversion  
**Description**: Track email list growth
**Custom Parameter**: `conversion_type` = `newsletter_signup`

### 5. Session Milestones
**Event Name**: `milestone_reached`
**Goal Type**: Engagement
**Description**: Track user engagement milestones

## 📊 Custom Events Being Tracked

The app already tracks these events through `analytics.ts`:

### Marketing Events
- `CTA Click` - Landing page button clicks
- `Blog Article View` - Blog content engagement
- `Blog Engagement Milestone` - Reading progress
- `Blog to App Conversion` - Blog conversion funnel

### User Journey Events  
- `sign_up` - User registration with method (email/google/github)
- `Upgrade Prompt Shown` - When upgrade prompts display
- `Upgrade Prompt Clicked` - When users click upgrade
- `Upgrade Initiated` - When users start upgrade process

### Product Events
- `timer_start`, `timer_pause`, `timer_complete` - Timer usage
- `Feature Usage` - Track which features users engage with
- `Session Complete` - Pomodoro session completions

## 🔧 Dashboard Configuration

### 1. Audience Creation
Create these audiences for targeted analysis:

**Power Users**:
- Users with `total_sessions` > 10
- Users with `streak` > 7 days

**High-Intent Users**:
- Users who viewed upgrade prompts
- Users who clicked Pro features
- Users with session_count > 5

**Content Engaged**:
- Users who read blog articles
- Users who engaged with landing page
- Users from organic search

### 2. Custom Reports
Set up these reports under **Library → Custom Reports**:

**Marketing Funnel Report**:
- Landing page views → App opens → Sign-ups → Pro upgrades
- Conversion rates at each step
- Traffic source breakdown

**Content Performance**:
- Blog article views and engagement
- Time on page and bounce rates
- Blog to conversion rates

**Upgrade Funnel**:
- Upgrade prompt impressions
- Click-through rates by trigger type
- Conversion rates by prompt context

### 3. Attribution Models
Configure attribution under **Admin → Attribution Settings**:
- **First Click**: For awareness campaigns
- **Last Click**: For conversion campaigns  
- **Position Based**: For full funnel analysis

## 📈 Key Metrics to Monitor

### Acquisition Metrics
- **Traffic Sources**: Organic, social, direct, referral
- **Landing Page Conversion Rate**: Visitors → sign-ups
- **Cost Per Acquisition (CPA)**: By marketing channel
- **Return on Ad Spend (ROAS)**: Revenue / ad spend

### Engagement Metrics
- **Session Duration**: Time spent in app
- **Pages Per Session**: Content engagement depth
- **Blog Engagement**: Reading time and social shares
- **Feature Adoption**: Which features drive retention

### Conversion Metrics
- **Sign-up Rate**: Visitors → registered users
- **Freemium to Pro Rate**: Free → paid conversions
- **Email Conversion Rate**: Newsletter → app users
- **Upgrade Prompt Effectiveness**: Prompt views → upgrades

### Retention Metrics
- **User Retention**: Day 1, 7, 30 retention rates
- **Session Frequency**: How often users return
- **Streak Completion**: Habit formation success
- **Churn Rate**: Users who stop using the app

## 🚀 Enhanced Tracking Implementation

### 1. UTM Parameter Tracking
Add these UTM parameters to all marketing campaigns:

```
utm_source: productHunt, twitter, linkedin, blog
utm_medium: social, email, organic, cpc
utm_campaign: launch, features, conversion
utm_content: version of creative/copy
utm_term: keywords (for paid search)
```

### 2. Custom Dimensions
Set up these custom dimensions in GA4:

1. **User Type**: free, pro, trial
2. **Sign-up Method**: email, google, github
3. **Referral Source**: landing, blog, social
4. **Feature Usage**: timer, tasks, analytics
5. **Subscription Status**: active, canceled, expired

### 3. Conversion Value Tracking
Configure these conversion values:

- **Email Signup**: $5 (lifetime value estimate)
- **App Registration**: $15 (user acquisition value)
- **Pro Upgrade**: $59.88 (annual subscription value)
- **Blog Engagement**: $2 (content engagement value)

## 🎯 Goal Values for Business KPIs

### Monthly Targets (90 days post-launch)
- **10,000** monthly landing page visitors
- **500** monthly sign-ups (5% conversion rate)
- **100** Pro upgrades (20% freemium conversion)
- **$5,000** monthly recurring revenue

### Weekly Marketing KPIs
- **2,500** weekly website visitors
- **125** weekly sign-ups
- **25** Pro upgrades
- **$1,250** weekly revenue

## 📋 Implementation Checklist

### Week 1: Foundation
- [ ] Configure all conversion goals in GA4
- [ ] Set up audience segments
- [ ] Create custom reports dashboard
- [ ] Test event tracking on staging

### Week 2: Advanced Setup  
- [ ] Configure attribution models
- [ ] Set up custom dimensions
- [ ] Create automated reports
- [ ] Implement UTM tracking across campaigns

### Week 3: Optimization
- [ ] A/B test tracking setup
- [ ] Cohort analysis configuration
- [ ] Revenue attribution setup
- [ ] Performance alert configuration

## 🔍 Testing Your Setup

### Event Testing
Use GA4 DebugView to verify these events fire correctly:
1. Landing page CTA clicks
2. Sign-up completions
3. Upgrade prompt interactions
4. Session completions
5. Blog article views

### Conversion Testing
Test the complete funnel:
1. Landing page visit → Sign-up
2. App usage → Pro upgrade
3. Blog read → App conversion
4. Email click → Sign-up

## 📊 Reporting Schedule

### Daily Monitoring
- Conversion rates
- Traffic sources
- Revenue tracking
- User acquisition

### Weekly Analysis
- Funnel performance
- Campaign effectiveness
- Content engagement
- User behavior patterns

### Monthly Reviews
- ROI analysis
- Attribution modeling
- Audience insights
- Growth metrics

---

This GA4 setup will provide comprehensive tracking for your marketing efforts. Focus on the conversion goals first, then gradually implement the advanced features as your traffic grows.