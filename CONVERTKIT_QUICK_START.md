# ConvertKit Quick Start for PomoNest

## 🚀 **STEP 1: Create ConvertKit Account** (10 minutes)

1. **Go to ConvertKit.com**
   - Click "Start free trial" 
   - Use your business email (e.g., hello@pomonest.com)
   - Choose "Creator" plan (free for up to 1,000 subscribers)

2. **Complete Account Setup**
   - Business name: "PomoNest"
   - Website: "https://pomonest.com"
   - Industry: "Business/Productivity Software"

## 🎯 **STEP 2: Create Your First Form** (5 minutes)

1. **Navigate to "Grow" → "Landing Pages & Forms"**
2. **Click "Create New" → "Form"**
3. **Choose "Inline" form type**
4. **Form Settings:**
   - Name: "Landing Page Newsletter"
   - Description: "Weekly focus tips and PomoNest updates"

5. **Form Content:**
   ```
   Headline: "Get Weekly Focus Tips"
   Description: "Join 10,000+ people building better focus habits"
   Button Text: "Get Tips"
   Success Message: "🎉 Welcome! Check your email for a special focus guide."
   ```

## 📧 **STEP 3: Set Up Welcome Email** (10 minutes)

1. **Go to "Automate" → "Sequences"**
2. **Click "Create Sequence"**
3. **Name:** "Welcome Series"
4. **Add Email #1:**

```
Subject: Welcome to PomoNest! Your focus journey starts now 🚀

Hi there!

Welcome to the PomoNest community! You just joined 10,000+ people building stronger focus habits.

Here's your quick-start guide:

🎯 **Try PomoNest now:** https://pomonest.com
📚 **Read our guide:** [Link to Pomodoro article]
💡 **Pro tip:** Start with just one 25-minute session today

Questions? Just reply to this email - I read every single one!

Stay focused,
[Your name]
PomoNest Team

P.S. Keep an eye out for our weekly focus tips every Tuesday!
```

## 🔗 **STEP 4: Connect to Your Landing Page** (15 minutes)

1. **Get Your Form Code:**
   - In ConvertKit, go to your form
   - Click "Embed" → "HTML"
   - Copy the form code

2. **Replace the Landing Page Form:**

```typescript
// Replace the existing email signup section in landing/page.tsx
const handleEmailSignup = async (email: string) => {
  try {
    // ConvertKit API integration
    const response = await fetch('/api/newsletter-signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email })
    })

    if (response.ok) {
      analytics.track('Newsletter Signup', {
        email,
        source: 'landing_page'
      })
      
      // Show success message
      setShowSuccessMessage(true)
    }
  } catch (error) {
    console.error('Signup error:', error)
  }
}
```

3. **Create API Endpoint:**

```typescript
// Create: apps/web/app/api/newsletter-signup/route.ts
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  const { email } = await request.json()
  
  try {
    const response = await fetch(`https://api.convertkit.com/v3/forms/${CONVERTKIT_FORM_ID}/subscribe`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        api_key: process.env.CONVERTKIT_API_KEY,
        email: email
      })
    })

    if (response.ok) {
      return NextResponse.json({ success: true })
    } else {
      return NextResponse.json({ error: 'Signup failed' }, { status: 400 })
    }
  } catch (error) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
```

4. **Add Environment Variables:**

```bash
# Add to .env.local
CONVERTKIT_API_KEY=your_api_key_here
CONVERTKIT_FORM_ID=your_form_id_here
```

## ✅ **STEP 5: Test Everything** (5 minutes)

1. **Test Form Submission:**
   - Go to http://localhost:3005/landing
   - Enter your email in the signup form
   - Verify you receive the welcome email

2. **Check ConvertKit Dashboard:**
   - Verify the subscriber appears in your audience
   - Confirm the welcome email was triggered

## 📊 **STEP 6: Set Up Tracking** (10 minutes)

1. **Add Email Analytics:**

```typescript
// Enhanced tracking in your signup handler
analytics.track('Newsletter Signup Success', {
  email: email,
  source: 'landing_page',
  form_id: 'landing-newsletter',
  timestamp: new Date().toISOString()
})
```

2. **Track Email Opens/Clicks in ConvertKit:**
   - ConvertKit automatically tracks opens and clicks
   - View reports in "Grow" → "Reports"

## 🎯 **Success Metrics to Watch:**

- **Landing page conversion rate**: Target 5-8%
- **Email open rate**: Target 25-35%
- **Click-through rate**: Target 3-6%
- **List growth**: Target 50+ new subscribers/week

## 🚀 **Next Steps (This Week):**

1. **Create 3 more welcome emails** (see CONVERTKIT_SETUP_GUIDE.md)
2. **Set up behavioral segments** based on user actions
3. **Add email signup to main app** after users complete first session
4. **Create weekly newsletter template**

---

## 🆘 **Need Help?**

- **ConvertKit Support**: help.convertkit.com
- **Our detailed guide**: CONVERTKIT_SETUP_GUIDE.md
- **Video tutorials**: ConvertKit's YouTube channel

**Total setup time: ~45 minutes**
**Expected results**: 5-10% landing page email conversion rate

Your email marketing system will be capturing leads and nurturing them automatically! 🎉