# PomoNest Referral Program: "Focus Friends"

## 🎯 Program Overview

**Program Name**: Focus Friends
**Goal**: Achieve viral coefficient of 1.2+ (each user brings 1.2+ new users)
**Target**: 30% of Pro upgrades come through referrals within 6 months
**Core Value**: Helping friends build better focus habits while earning rewards

## 🚀 Referral Program Structure

### Reward Tiers

**For Referrer (Person Sharing)**:
- **1-3 successful referrals**: 1 month Pro free per referral
- **4-9 successful referrals**: 2 months Pro free per referral + "Focus Ambassador" badge
- **10+ successful referrals**: 6 months Pro free + "Focus Leader" badge + exclusive features early access

**For Referee (New User)**:
- **Immediate**: 2 weeks Pro trial (instead of standard 1 week)
- **After first week**: Additional week Pro free if they complete 5+ sessions
- **Bonus**: Access to exclusive "Referred Friends" community space

### Success Criteria
- **"Successful referral"** = New user completes 3+ focus sessions within first 7 days
- **"Pro referral bonus"** = Additional rewards if referred user upgrades to Pro within 30 days

## 🔗 Technical Implementation

### 1. Referral Link Generation

```typescript
// src/lib/referrals.ts
export class ReferralSystem {
  private supabase = createClient()

  async generateReferralCode(userId: string): Promise<string> {
    // Create unique, human-readable referral codes
    const code = this.generateFriendlyCode(userId)
    
    const { error } = await this.supabase
      .from('referral_codes')
      .insert({
        user_id: userId,
        code: code,
        created_at: new Date().toISOString(),
        is_active: true
      })

    if (error) throw error
    return code
  }

  private generateFriendlyCode(userId: string): string {
    // Generate memorable codes like "FOCUS-SARAH-2025"
    const adjectives = ['FOCUS', 'SHARP', 'CLEAR', 'CALM', 'FLOW']
    const random = Math.floor(Math.random() * adjectives.length)
    const userHash = this.hashUserId(userId).slice(0, 4).toUpperCase()
    
    return `${adjectives[random]}-${userHash}`
  }

  async trackReferral(referralCode: string, newUserId: string): Promise<void> {
    // Get referrer from code
    const { data: referralData } = await this.supabase
      .from('referral_codes')
      .select('user_id')
      .eq('code', referralCode)
      .eq('is_active', true)
      .single()

    if (!referralData) return

    // Track the referral
    await this.supabase
      .from('referrals')
      .insert({
        referrer_id: referralData.user_id,
        referee_id: newUserId,
        referral_code: referralCode,
        status: 'pending',
        created_at: new Date().toISOString()
      })

    // Track analytics
    analytics.track('Referral Started', {
      referrer_id: referralData.user_id,
      referee_id: newUserId,
      referral_code: referralCode
    })
  }

  async checkReferralSuccess(userId: string): Promise<void> {
    // Check if referred user has completed 3+ sessions
    const { data: sessions } = await this.supabase
      .from('pomodoro_sessions')
      .select('id')
      .eq('user_id', userId)
      .eq('completed', true)

    if (sessions && sessions.length >= 3) {
      await this.markReferralSuccessful(userId)
    }
  }

  private async markReferralSuccessful(refereeId: string): Promise<void> {
    // Update referral status
    const { data: referral } = await this.supabase
      .from('referrals')
      .update({ 
        status: 'successful',
        completed_at: new Date().toISOString()
      })
      .eq('referee_id', refereeId)
      .select('referrer_id, referral_code')
      .single()

    if (referral) {
      // Reward the referrer
      await this.rewardReferrer(referral.referrer_id)
      
      // Track success
      analytics.track('Referral Successful', {
        referrer_id: referral.referrer_id,
        referee_id: refereeId,
        referral_code: referral.referral_code
      })
    }
  }

  private async rewardReferrer(referrerId: string): Promise<void> {
    // Get referrer's current successful referral count
    const { data: successfulReferrals } = await this.supabase
      .from('referrals')
      .select('id')
      .eq('referrer_id', referrerId)
      .eq('status', 'successful')

    const count = successfulReferrals?.length || 0
    const reward = this.calculateReward(count)

    // Apply reward
    await this.applyProReward(referrerId, reward.months)
    
    // Add badge if earned
    if (reward.badge) {
      await this.awardBadge(referrerId, reward.badge)
    }

    // Send reward notification
    await this.sendRewardNotification(referrerId, reward)
  }

  private calculateReward(referralCount: number) {
    if (referralCount <= 3) {
      return { months: 1, badge: null }
    } else if (referralCount <= 9) {
      return { months: 2, badge: 'focus_ambassador' }
    } else {
      return { months: 6, badge: 'focus_leader' }
    }
  }
}
```

### 2. Referral Dashboard UI

```typescript
// src/components/ReferralDashboard.tsx
'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Users, Gift, Crown, Share2, Copy, Check } from 'lucide-react'

interface ReferralStats {
  totalReferrals: number
  successfulReferrals: number
  pendingReferrals: number
  totalRewardsEarned: number
  currentTier: 'starter' | 'ambassador' | 'leader'
  referralCode: string
}

export function ReferralDashboard() {
  const [stats, setStats] = useState<ReferralStats | null>(null)
  const [copied, setCopied] = useState(false)

  const copyReferralLink = async () => {
    if (!stats) return
    
    const referralUrl = `https://pomonest.com?ref=${stats.referralCode}`
    await navigator.clipboard.writeText(referralUrl)
    setCopied(true)
    
    analytics.track('Referral Link Copied', {
      referral_code: stats.referralCode
    })
    
    setTimeout(() => setCopied(false), 2000)
  }

  const shareOnSocial = (platform: 'twitter' | 'linkedin' | 'facebook') => {
    const referralUrl = `https://pomonest.com?ref=${stats?.referralCode}`
    const message = "I've been using PomoNest to build amazing focus habits! Try it free and get an extended Pro trial:"
    
    const urls = {
      twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(message)}&url=${encodeURIComponent(referralUrl)}`,
      linkedin: `https://linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(referralUrl)}`,
      facebook: `https://facebook.com/sharer/sharer.php?u=${encodeURIComponent(referralUrl)}`
    }
    
    window.open(urls[platform], '_blank', 'width=550,height=400')
    
    analytics.track('Referral Social Share', {
      platform,
      referral_code: stats?.referralCode
    })
  }

  if (!stats) return <div>Loading...</div>

  const nextTierProgress = calculateNextTierProgress(stats)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Focus Friends Referral Program</h1>
        <p className="text-gray-600 dark:text-gray-300 mt-2">
          Help friends build focus habits and earn Pro rewards
        </p>
      </div>

      {/* Current Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-300">
                  Successful Referrals
                </p>
                <p className="text-3xl font-bold">{stats.successfulReferrals}</p>
              </div>
              <Users className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-300">
                  Pro Months Earned
                </p>
                <p className="text-3xl font-bold">{stats.totalRewardsEarned}</p>
              </div>
              <Gift className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-300">
                  Current Tier
                </p>
                <Badge variant={stats.currentTier === 'leader' ? 'default' : 'secondary'}>
                  {stats.currentTier === 'leader' && <Crown className="h-3 w-3 mr-1" />}
                  {stats.currentTier.charAt(0).toUpperCase() + stats.currentTier.slice(1)}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Progress to Next Tier */}
      <Card>
        <CardHeader>
          <CardTitle>Progress to {nextTierProgress.nextTier}</CardTitle>
          <CardDescription>
            {nextTierProgress.referralsNeeded} more successful referrals needed
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Progress value={nextTierProgress.progress} className="mb-4" />
          <div className="flex justify-between text-sm text-gray-600 dark:text-gray-300">
            <span>{stats.successfulReferrals} referrals</span>
            <span>{nextTierProgress.nextTierRequirement} required</span>
          </div>
        </CardContent>
      </Card>

      {/* Referral Link Sharing */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Share2 className="h-5 w-5" />
            Share Your Referral Link
          </CardTitle>
          <CardDescription>
            Your friends get an extended Pro trial, you earn rewards when they stay active
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <div className="flex-1 p-3 bg-gray-100 dark:bg-gray-800 rounded-lg font-mono text-sm">
              https://pomonest.com?ref={stats.referralCode}
            </div>
            <Button onClick={copyReferralLink} variant="outline">
              {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
            </Button>
          </div>

          <div className="flex gap-2">
            <Button onClick={() => shareOnSocial('twitter')} variant="outline" className="flex-1">
              Share on Twitter
            </Button>
            <Button onClick={() => shareOnSocial('linkedin')} variant="outline" className="flex-1">
              Share on LinkedIn
            </Button>
            <Button onClick={() => shareOnSocial('facebook')} variant="outline" className="flex-1">
              Share on Facebook
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Reward Tiers Explanation */}
      <Card>
        <CardHeader>
          <CardTitle>Reward Tiers</CardTitle>
          <CardDescription>
            Earn bigger rewards as you help more friends discover focused productivity
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <h4 className="font-medium">Starter (1-3 referrals)</h4>
                <p className="text-sm text-gray-600 dark:text-gray-300">1 month Pro free per successful referral</p>
              </div>
              <Badge variant="secondary">Current</Badge>
            </div>
            
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <h4 className="font-medium">Focus Ambassador (4-9 referrals)</h4>
                <p className="text-sm text-gray-600 dark:text-gray-300">2 months Pro free per referral + exclusive badge</p>
              </div>
              <Badge variant="secondary">Locked</Badge>
            </div>
            
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <h4 className="font-medium flex items-center gap-2">
                  <Crown className="h-4 w-4" />
                  Focus Leader (10+ referrals)
                </h4>
                <p className="text-sm text-gray-600 dark:text-gray-300">6 months Pro free + early access to new features</p>
              </div>
              <Badge variant="secondary">Locked</Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
```

### 3. Referral Tracking in App

```typescript
// src/hooks/useReferralTracking.ts
export function useReferralTracking() {
  const { user } = useAuth()

  useEffect(() => {
    // Check for referral code in URL on app load
    const urlParams = new URLSearchParams(window.location.search)
    const referralCode = urlParams.get('ref')
    
    if (referralCode && user) {
      trackReferralSignup(user.id, referralCode)
    }
  }, [user])

  const trackReferralSignup = async (userId: string, referralCode: string) => {
    try {
      const referralSystem = new ReferralSystem()
      await referralSystem.trackReferral(referralCode, userId)
      
      // Store referral code for later session tracking
      localStorage.setItem('referral_code', referralCode)
      
      // Show welcome message for referred users
      toast({
        title: "Welcome to PomoNest! 🎉",
        description: "You've been referred by a friend! Enjoy your extended Pro trial."
      })
    } catch (error) {
      console.error('Error tracking referral:', error)
    }
  }

  // Track session completion for referral success
  const trackSessionForReferral = async (userId: string) => {
    const referralCode = localStorage.getItem('referral_code')
    if (referralCode) {
      const referralSystem = new ReferralSystem()
      await referralSystem.checkReferralSuccess(userId)
    }
  }

  return { trackSessionForReferral }
}
```

## 📧 Referral Email Campaigns

### 1. Referrer Invitation Email

```html
Subject: Help a friend build better focus habits (and earn Pro rewards!)

Hi [FirstName],

You've been crushing it with PomoNest! Your [StreakDays]-day streak is inspiring.

Want to help a friend build amazing focus habits while earning Pro rewards? 

Introducing "Focus Friends" - our new referral program:

🎁 You get: 1 month Pro free for each successful referral
🎯 They get: Extended Pro trial (2 weeks instead of 1)
🏆 Bonus: Exclusive badges and early feature access

Your unique referral link:
https://pomonest.com?ref=[ReferralCode]

Perfect friends to invite:
• Students preparing for exams
• Colleagues struggling with distractions  
• Entrepreneurs building their business
• Anyone who mentions being "too busy"

Share your link and help them discover the power of focused work!

[Share Now] [Learn More About Rewards]

Building focus habits together,
The PomoNest Team

P.S. Your referral rewards stack up - imagine 6 months of Pro free just for helping 6 friends! 🚀
```

### 2. Referee Welcome Email

```html
Subject: Your friend thought you'd love PomoNest (+ extended Pro trial inside!)

Hi [FirstName],

Great news! [ReferrerName] invited you to try PomoNest because they thought you'd benefit from better focus habits.

Since you're referred by a friend, you get special perks:

✨ Extended 2-week Pro trial (instead of standard 1 week)
🎯 Access to all premium themes and analytics
🤝 Invitation to our referred friends community
📊 Bonus rewards if you stay active

[ReferrerName] said: "[Personal message from referrer if provided]"

Ready to start your first focus session?

[Start Focusing Now - No Signup Required]

Why PomoNest works:
• 25-minute focused work sessions
• 5-minute restorative breaks  
• Beautiful themes for every mood
• Streak tracking for motivation
• Analytics to understand your patterns

Questions? Just reply to this email.

Welcome to focused productivity!
The PomoNest Team

P.S. Complete 5 sessions in your first week and get an extra week of Pro free! 🔥
```

### 3. Successful Referral Notification

```html
Subject: 🎉 Your friend [RefereeName] is building focus habits! (Reward unlocked)

Hi [ReferrerName],

Amazing news! [RefereeName] has completed their first 3 focus sessions using PomoNest.

Your reward has been unlocked:
🎁 1 month Pro access added to your account
📊 Updated referral stats in your dashboard
🏆 Progress toward Focus Ambassador badge

[RefereeName]'s early progress:
• 3 sessions completed ✅
• 2.5 hour streak started 🔥  
• Currently exploring premium themes 🎨

This is the power of building habits together! Your recommendation is helping them develop stronger focus.

[View Your Referral Dashboard] [Share With More Friends]

Current referral stats:
• Successful referrals: [Count]
• Pro rewards earned: [Months] months
• Progress to next tier: [Progress]%

Keep sharing the focus! Who else could benefit from PomoNest?

Celebrating together,
The PomoNest Team

P.S. At 4 successful referrals, you unlock Focus Ambassador status with 2 months Pro per referral! 👑
```

## 🎨 Referral Marketing Materials

### Social Media Templates

**Twitter/X Template**:
```
I've been using @PomoNest for [X] days and my focus has completely transformed! 🧠⚡

✅ 25-minute focus sessions that actually work
✅ Beautiful themes for every mood  
✅ Streak tracking that keeps me motivated
✅ No signup required to start

Try it free with my link: pomonest.com?ref=[CODE]
You get an extended Pro trial! 🎁

#Focus #Productivity #PomodoroTechnique
```

**LinkedIn Template**:
```
Productivity breakthrough: I discovered PomoNest [X] weeks ago and it's completely changed how I approach deep work.

The Pomodoro Technique isn't new, but PomoNest makes it:
• Beautifully simple to use
• Motivating with streak tracking  
• Insightful with productivity analytics
• Accessible (no signup required)

My focus sessions have increased by [X]% and I'm finishing projects faster than ever.

If you struggle with distraction or procrastination, try it with my referral link: pomonest.com?ref=[CODE]

You'll get an extended Pro trial and I promise it's worth 25 minutes of your time.

#Productivity #DeepWork #RemoteWork #TimeManagement
```

**Instagram Story Template**:
```
[Background: Aesthetic workspace photo]

Text overlay: "How I went from scattered to focused in 30 days 🎯"

Slide 2: "The secret: PomoNest's 25-minute focus sessions"

Slide 3: "Try it free with my link ➡️ pomonest.com?ref=[CODE]"

Slide 4: "Swipe up if you want better focus habits! ⬆️"

#PomoNest #FocusHabits #ProductivityJourney
```

### Email Signature

```
[Name]
[Title] | [Company]

📧 [email] | 📱 [phone]

P.S. Building better focus habits? Try PomoNest free: pomonest.com?ref=[CODE]
```

## 📊 Viral Growth Strategy

### Viral Coefficient Calculation

```
Viral Coefficient = (Number of invitations sent per user) × (Conversion rate of invitations)

Target: 1.2+ viral coefficient
- Average invitations per active user: 3
- Conversion rate needed: 40%
- Result: 3 × 0.40 = 1.2 viral coefficient
```

### Growth Incentives

**Time-Limited Bonuses**:
- **Launch Month**: Double rewards (2 months Pro per successful referral)
- **Milestone Celebrations**: Bonus rewards when community hits 10K, 25K, 50K users
- **Seasonal Campaigns**: Back-to-school, New Year resolution periods

**Gamification Elements**:
- **Leaderboards**: Top referrers by month/quarter
- **Badges**: Visual recognition for different achievement levels
- **Exclusive Access**: Early feature previews for top referrers
- **Community Status**: Special roles in Discord/community spaces

### Referral Triggers

**In-App Prompts**:
- After completing 7-day streak
- When accessing Pro features (suggest sharing to help friends)
- After positive session feedback ratings
- Weekly achievement celebrations

**Email Campaigns**:
- Day 3: "Love PomoNest? Share with friends!"
- Day 14: "Referral program introduction"  
- Monthly: "See how friends are building focus habits"
- Milestone: "Help us reach [X] focused users!"

## 🔍 Performance Tracking

### Key Metrics

**Referral Funnel**:
1. **Referral Link Generation**: How many users create referral codes
2. **Link Sharing**: How many times links are shared
3. **Click-Through Rate**: Visitors from referral links
4. **Sign-Up Conversion**: Referral visitors who try the app
5. **Activation Rate**: Referred users who complete 3+ sessions
6. **Pro Conversion**: Referred users who upgrade to Pro

**Viral Growth Metrics**:
- **Viral Coefficient**: New users generated per existing user
- **Referral Participation Rate**: % of users who make referrals
- **Successful Referral Rate**: % of referrals that convert
- **Time to Viral Loop**: Days from signup to first referral
- **Lifetime Referral Value**: Revenue generated per referring user

### A/B Testing Opportunities

**Reward Structures**:
- Test different reward amounts
- Compare immediate vs. delayed rewards
- Trial different tier structures

**Messaging**:
- Benefits-focused vs. features-focused invitations
- Personal vs. promotional tone
- Length of referral messages

**UI/UX**:
- Referral dashboard placement
- Share button prominence  
- Referral link formats

### ROI Analysis

```typescript
// Calculate referral program ROI
const calculateReferralROI = (metrics: ReferralMetrics) => {
  const rewardCosts = metrics.totalRewardsGiven * averageMonthlyPlanPrice
  const newUserRevenue = metrics.successfulReferrals * averageLTV
  const roi = (newUserRevenue - rewardCosts) / rewardCosts * 100
  
  return {
    rewardCosts,
    newUserRevenue,
    roi,
    paybackPeriod: rewardCosts / (newUserRevenue / 12) // months
  }
}
```

This comprehensive referral program system creates a win-win scenario where existing users are rewarded for sharing genuine value, while new users get enhanced onboarding experiences. The viral mechanics are designed to drive sustainable, high-quality growth while building a strong community around focused productivity.