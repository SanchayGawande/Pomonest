# Google Analytics 4 Email Conversion Setup

## 🎯 Email Signup Conversion Tracking Configuration

This guide shows you how to track email newsletter signups as conversions in Google Analytics 4 for PomoNest.

## 📊 GA4 Conversion Events Setup

### Step 1: Create Custom Conversion Events

1. **Go to Google Analytics 4**
   - Navigate to your PomoNest property
   - Go to **Configure** → **Events**

2. **Create Newsletter Signup Conversion**
   - Click **Create Event**
   - Event name: `newsletter_signup_success`
   - Mark as **Conversion**: ✅ Yes

3. **Create Landing Page View Conversion** (Optional)
   - Event name: `landing_page_view`
   - Mark as **Conversion**: ✅ Yes (for funnel analysis)

### Step 2: Enhanced Analytics Implementation

Add this to your analytics configuration:

```typescript
// Enhanced analytics tracking for PomoNest
// Add to: src/lib/analytics.ts

export const trackEmailSignup = (email: string, success: boolean, error?: string) => {
  if (success) {
    // Track successful signup
    gtag('event', 'newsletter_signup_success', {
      event_category: 'Email Marketing',
      event_label: 'Landing Page Signup',
      value: 1,
      currency: 'USD',
      custom_parameters: {
        signup_source: 'landing_page',
        user_email_domain: email.split('@')[1],
        timestamp: new Date().toISOString()
      }
    })

    // Track as conversion
    gtag('event', 'conversion', {
      send_to: 'GA_MEASUREMENT_ID/newsletter_signup_success',
      value: 1.0,
      currency: 'USD'
    })
  } else {
    // Track failed signup
    gtag('event', 'newsletter_signup_failed', {
      event_category: 'Email Marketing',
      event_label: 'Landing Page Signup Failed',
      custom_parameters: {
        error_message: error || 'Unknown error',
        signup_source: 'landing_page',
        timestamp: new Date().toISOString()
      }
    })
  }
}

export const trackLandingPageEngagement = (action: string, element: string) => {
  gtag('event', 'landing_page_engagement', {
    event_category: 'User Engagement',
    event_label: `${action} - ${element}`,
    custom_parameters: {
      page_section: element,
      engagement_type: action,
      timestamp: new Date().toISOString()
    }
  })
}
```

### Step 3: Update Landing Page Analytics

Update the landing page to use enhanced tracking:

```typescript
// In landing/page.tsx - Update handleEmailSignup function

const handleEmailSignup = async (email: string) => {
  // ... existing validation code ...

  try {
    // Track signup attempt
    gtag('event', 'newsletter_signup_attempt', {
      event_category: 'Email Marketing',
      event_label: 'Landing Page',
      custom_parameters: {
        email_domain: email.split('@')[1]
      }
    })

    const response = await fetch('/api/newsletter-signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email })
    })

    const result = await response.json()

    if (response.ok && result.success) {
      // Track successful conversion
      trackEmailSignup(email, true)
      
      // Show success message
      alert('🎉 Thanks for subscribing! Check your email for a special focus guide.')
    } else {
      throw new Error(result.error || 'Signup failed')
    }
  } catch (error) {
    // Track failed conversion
    trackEmailSignup(email, false, error.message)
    alert('Something went wrong. Please try again.')
  }
}
```

## 📈 GA4 Custom Dimensions Setup

### Step 1: Create Custom Dimensions

1. **Go to Configure → Custom Definitions → Custom Dimensions**
2. **Create these dimensions:**

```
Dimension 1: Email Domain
- Parameter name: email_domain
- Scope: Event
- Description: Domain of signup email addresses

Dimension 2: Signup Source
- Parameter name: signup_source  
- Scope: Event
- Description: Source of email signups

Dimension 3: User Journey Stage
- Parameter name: journey_stage
- Scope: User
- Description: Current stage in conversion funnel
```

### Step 2: Create Custom Metrics

```
Metric 1: Email Conversion Rate
- Calculation: newsletter_signup_success / landing_page_view
- Format: Percentage

Metric 2: Email Signup Value
- Calculation: newsletter_signup_success * 5
- Format: Currency (estimated value per email)
```

## 🎯 Conversion Funnel Setup

### Step 1: Create Funnel in GA4

1. **Go to Explore → Funnel Exploration**
2. **Create this funnel:**

```
Step 1: Landing Page View
- Event: landing_page_view
- Step name: "Visited Landing Page"

Step 2: Email Form Interaction
- Event: landing_page_engagement
- Filter: event_label contains "email"
- Step name: "Engaged with Email Form"

Step 3: Newsletter Signup
- Event: newsletter_signup_success
- Step name: "Completed Email Signup"

Step 4: App Trial (Optional)
- Event: app_trial_start
- Step name: "Started App Trial"
```

## 📊 Goals & Audience Setup

### Primary Conversion Goals

1. **Newsletter Signup Goal**
   - Type: Custom Event
   - Event: newsletter_signup_success
   - Value: $5.00 (estimated value per email subscriber)

2. **Landing Page Engagement Goal**
   - Type: Engagement
   - Condition: Engaged sessions on landing page > 30 seconds

### Custom Audiences

```
Audience 1: Landing Page Visitors
- Condition: page_title contains "PomoNest"
- Duration: 30 days

Audience 2: Email Subscribers  
- Condition: Completed newsletter_signup_success
- Duration: 365 days

Audience 3: High-Intent Visitors
- Conditions: 
  - Spent 60+ seconds on landing page
  - Clicked CTA button
  - Viewed features section
- Duration: 90 days
```

## 🔔 Automated Alerts Setup

### Set Up Conversion Alerts

1. **Go to Configure → Custom Alerts**
2. **Create these alerts:**

```
Alert 1: Email Signup Drop
- Condition: newsletter_signup_success decreases by 25%
- Period: Day over day
- Notification: Email

Alert 2: High Email Signup Volume
- Condition: newsletter_signup_success increases by 200%
- Period: Day over day  
- Notification: Email (potential viral moment)

Alert 3: Landing Page Traffic Spike
- Condition: landing_page_view increases by 500%
- Period: Hour over hour
- Notification: Email + Slack
```

## 📈 Custom Reports Setup

### Email Marketing Performance Report

```sql
-- Custom exploration query for email performance
SELECT
  date,
  source_medium,
  COUNT(CASE WHEN event_name = 'landing_page_view' THEN 1 END) as landing_views,
  COUNT(CASE WHEN event_name = 'newsletter_signup_success' THEN 1 END) as email_signups,
  ROUND(
    COUNT(CASE WHEN event_name = 'newsletter_signup_success' THEN 1 END) * 100.0 / 
    COUNT(CASE WHEN event_name = 'landing_page_view' THEN 1 END), 2
  ) as conversion_rate
FROM your_ga4_table
WHERE date >= DATE_SUB(CURRENT_DATE(), INTERVAL 30 DAY)
GROUP BY date, source_medium
ORDER BY date DESC
```

### Dashboard Widgets

1. **Email Conversion Rate Card**
2. **Daily Signup Volume Chart**  
3. **Signup Source Breakdown Pie Chart**
4. **Email Domain Analysis Table**
5. **Funnel Visualization**

## 🎯 Testing Your Setup

### Test Email Signup Flow

1. **Clear browser cache and cookies**
2. **Visit landing page**: `http://localhost:3005/landing`
3. **Submit email signup form**
4. **Check GA4 Real-Time reports for:**
   - `newsletter_signup_attempt` event
   - `newsletter_signup_success` event (if successful)
   - `newsletter_signup_failed` event (if failed)

### Verify Conversion Tracking

1. **Go to GA4 Real-Time → Events**
2. **Look for your custom events**
3. **Check that conversion flag appears**
4. **Verify custom parameters are populated**

## 📊 Expected Results

With this setup, you'll be able to track:

- **Email signup conversion rate**: Target 5-8%
- **Email domain breakdown**: .com, .gmail, .edu distributions  
- **Traffic source performance**: Which channels drive best email signups
- **Funnel drop-off points**: Where users abandon the signup process
- **Real-time conversion alerts**: Immediate notification of signup spikes/drops

## 🔧 Troubleshooting

### Common Issues

1. **Events not appearing**: Check gtag implementation
2. **Conversions not tracking**: Verify conversion event setup
3. **Custom parameters missing**: Check parameter naming consistency
4. **Funnel steps not connecting**: Verify event names match exactly

### Debug Mode

Enable GA4 debug mode to see events in real-time:

```javascript
// Add to your analytics config for testing
gtag('config', 'GA_MEASUREMENT_ID', {
  debug_mode: true
})
```

This comprehensive GA4 setup will give you deep insights into your email marketing performance and help optimize your conversion funnel! 🚀