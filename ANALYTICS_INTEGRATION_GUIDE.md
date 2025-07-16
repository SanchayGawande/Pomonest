# Marketing Dashboard Real Analytics Integration Guide

## 🎯 Overview

This guide shows how to connect real analytics data to your PomoNest marketing dashboard, replacing the mock data with live metrics from Google Analytics 4, ConvertKit, social media platforms, and your app database.

## 📊 Data Sources to Integrate

### 1. Google Analytics 4 (GA4)
- Website traffic and user behavior
- Conversion tracking and funnel analysis
- Traffic source attribution
- User engagement metrics

### 2. Supabase Database
- User registration and activation data
- Pro subscription metrics
- Session completion tracking
- Streak and engagement data

### 3. ConvertKit
- Email subscriber growth
- Email campaign performance
- Conversion rates from email to app

### 4. Social Media APIs
- Follower growth and engagement
- Social traffic to website
- Content performance metrics

### 5. Stripe (Payment Data)
- Revenue tracking
- Subscription metrics
- Churn and retention analysis

## 🔧 Technical Implementation

### 1. Google Analytics 4 Integration

**Install GA4 Reporting API**:
```bash
npm install @google-analytics/data
```

**Create GA4 Service**:
```typescript
// src/lib/ga4.ts
import { BetaAnalyticsDataClient } from '@google-analytics/data';

const analyticsDataClient = new BetaAnalyticsDataClient({
  keyFilename: 'path/to/service-account-key.json', // Download from Google Cloud Console
});

const propertyId = 'YOUR_GA4_PROPERTY_ID'; // e.g., '123456789'

export class GA4Analytics {
  async getWebsiteTraffic(startDate: string, endDate: string) {
    const [response] = await analyticsDataClient.runReport({
      property: `properties/${propertyId}`,
      dateRanges: [{ startDate, endDate }],
      metrics: [
        { name: 'activeUsers' },
        { name: 'sessions' },
        { name: 'pageviews' },
        { name: 'bounceRate' },
        { name: 'averageSessionDuration' }
      ],
      dimensions: [{ name: 'date' }]
    });

    return response.rows?.map(row => ({
      date: row.dimensionValues?.[0]?.value,
      activeUsers: parseInt(row.metricValues?.[0]?.value || '0'),
      sessions: parseInt(row.metricValues?.[1]?.value || '0'),
      pageviews: parseInt(row.metricValues?.[2]?.value || '0'),
      bounceRate: parseFloat(row.metricValues?.[3]?.value || '0'),
      avgSessionDuration: parseFloat(row.metricValues?.[4]?.value || '0')
    }));
  }

  async getTrafficSources(startDate: string, endDate: string) {
    const [response] = await analyticsDataClient.runReport({
      property: `properties/${propertyId}`,
      dateRanges: [{ startDate, endDate }],
      metrics: [
        { name: 'activeUsers' },
        { name: 'sessions' },
        { name: 'conversions' }
      ],
      dimensions: [
        { name: 'sessionSource' },
        { name: 'sessionMedium' }
      ]
    });

    return response.rows?.map(row => ({
      source: row.dimensionValues?.[0]?.value,
      medium: row.dimensionValues?.[1]?.value,
      users: parseInt(row.metricValues?.[0]?.value || '0'),
      sessions: parseInt(row.metricValues?.[1]?.value || '0'),
      conversions: parseInt(row.metricValues?.[2]?.value || '0')
    }));
  }

  async getConversionData(startDate: string, endDate: string) {
    const [response] = await analyticsDataClient.runReport({
      property: `properties/${propertyId}`,
      dateRanges: [{ startDate, endDate }],
      metrics: [
        { name: 'conversions' },
        { name: 'conversionRate' },
        { name: 'purchaseRevenue' }
      ],
      dimensions: [{ name: 'eventName' }],
      dimensionFilter: {
        filter: {
          fieldName: 'eventName',
          inListFilter: {
            values: ['sign_up', 'purchase', 'conversion']
          }
        }
      }
    });

    return response.rows?.map(row => ({
      eventName: row.dimensionValues?.[0]?.value,
      conversions: parseInt(row.metricValues?.[0]?.value || '0'),
      conversionRate: parseFloat(row.metricValues?.[1]?.value || '0'),
      revenue: parseFloat(row.metricValues?.[2]?.value || '0')
    }));
  }
}
```

### 2. Supabase Database Queries

**User Metrics Service**:
```typescript
// src/lib/userMetrics.ts
import { supabase } from '@/lib/supabase';

export class UserMetrics {
  async getUserGrowth(startDate: string, endDate: string) {
    const { data, error } = await supabase
      .from('users')
      .select('created_at, id')
      .gte('created_at', startDate)
      .lte('created_at', endDate)
      .order('created_at', { ascending: true });

    if (error) throw error;

    // Group by date
    const dailySignups = data.reduce((acc, user) => {
      const date = new Date(user.created_at).toISOString().split('T')[0];
      acc[date] = (acc[date] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(dailySignups).map(([date, count]) => ({
      date,
      newUsers: count
    }));
  }

  async getProUpgrades(startDate: string, endDate: string) {
    const { data, error } = await supabase
      .from('user_subscriptions')
      .select('created_at, plan_type, amount')
      .gte('created_at', startDate)
      .lte('created_at', endDate)
      .eq('status', 'active');

    if (error) throw error;

    return {
      totalUpgrades: data.length,
      totalRevenue: data.reduce((sum, sub) => sum + (sub.amount || 0), 0),
      dailyUpgrades: this.groupByDate(data, 'created_at')
    };
  }

  async getEngagementMetrics(startDate: string, endDate: string) {
    const { data: sessions, error } = await supabase
      .from('pomodoro_sessions')
      .select('user_id, completed_at, duration')
      .gte('completed_at', startDate)
      .lte('completed_at', endDate)
      .eq('completed', true);

    if (error) throw error;

    const uniqueUsers = new Set(sessions.map(s => s.user_id)).size;
    const totalSessions = sessions.length;
    const avgSessionDuration = sessions.reduce((sum, s) => sum + s.duration, 0) / sessions.length;

    return {
      activeUsers: uniqueUsers,
      totalSessions,
      avgSessionDuration,
      sessionsPerUser: totalSessions / uniqueUsers
    };
  }

  async getStreakData() {
    const { data, error } = await supabase
      .from('user_streaks')
      .select('user_id, current_streak, longest_streak')
      .gt('current_streak', 0);

    if (error) throw error;

    return {
      activeStreaks: data.length,
      avgCurrentStreak: data.reduce((sum, s) => sum + s.current_streak, 0) / data.length,
      avgLongestStreak: data.reduce((sum, s) => sum + s.longest_streak, 0) / data.length,
      streakDistribution: this.getStreakDistribution(data)
    };
  }

  private groupByDate(data: any[], dateField: string) {
    return data.reduce((acc, item) => {
      const date = new Date(item[dateField]).toISOString().split('T')[0];
      acc[date] = (acc[date] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
  }

  private getStreakDistribution(data: any[]) {
    const ranges = {
      '1-7 days': 0,
      '8-30 days': 0,
      '31-90 days': 0,
      '90+ days': 0
    };

    data.forEach(user => {
      const streak = user.current_streak;
      if (streak <= 7) ranges['1-7 days']++;
      else if (streak <= 30) ranges['8-30 days']++;
      else if (streak <= 90) ranges['31-90 days']++;
      else ranges['90+ days']++;
    });

    return ranges;
  }
}
```

### 3. ConvertKit Integration

```typescript
// src/lib/convertkit.ts
export class ConvertKitAnalytics {
  private apiKey = process.env.CONVERTKIT_API_KEY;
  private baseUrl = 'https://api.convertkit.com/v3';

  async getSubscriberGrowth(startDate: string, endDate: string) {
    const response = await fetch(
      `${this.baseUrl}/subscribers?api_key=${this.apiKey}&from=${startDate}&to=${endDate}`
    );
    const data = await response.json();

    return {
      totalSubscribers: data.total_subscribers,
      newSubscribers: data.subscribers?.length || 0,
      dailyGrowth: this.groupSubscribersByDate(data.subscribers)
    };
  }

  async getCampaignPerformance() {
    const response = await fetch(
      `${this.baseUrl}/broadcasts?api_key=${this.apiKey}`
    );
    const data = await response.json();

    return data.broadcasts?.map((broadcast: any) => ({
      id: broadcast.id,
      subject: broadcast.subject,
      sentAt: broadcast.sent_at,
      recipients: broadcast.recipients,
      openRate: broadcast.open_rate,
      clickRate: broadcast.click_rate,
      unsubscribeRate: broadcast.unsubscribe_rate
    }));
  }

  async getSequencePerformance() {
    const response = await fetch(
      `${this.baseUrl}/sequences?api_key=${this.apiKey}`
    );
    const data = await response.json();

    return data.sequences?.map((sequence: any) => ({
      id: sequence.id,
      name: sequence.name,
      subscribers: sequence.subscribers,
      completionRate: sequence.completion_rate
    }));
  }

  private groupSubscribersByDate(subscribers: any[]) {
    return subscribers.reduce((acc, sub) => {
      const date = new Date(sub.created_at).toISOString().split('T')[0];
      acc[date] = (acc[date] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
  }
}
```

### 4. Social Media Analytics

```typescript
// src/lib/socialAnalytics.ts
export class SocialMediaAnalytics {
  // Twitter API v2
  async getTwitterMetrics() {
    const bearerToken = process.env.TWITTER_BEARER_TOKEN;
    
    const response = await fetch(
      'https://api.twitter.com/2/users/by/username/pomonest?user.fields=public_metrics',
      {
        headers: {
          'Authorization': `Bearer ${bearerToken}`
        }
      }
    );
    
    const data = await response.json();
    
    return {
      followers: data.data.public_metrics.followers_count,
      following: data.data.public_metrics.following_count,
      tweets: data.data.public_metrics.tweet_count,
      likes: data.data.public_metrics.like_count
    };
  }

  // LinkedIn API
  async getLinkedInMetrics() {
    const accessToken = process.env.LINKEDIN_ACCESS_TOKEN;
    
    const response = await fetch(
      'https://api.linkedin.com/v2/networkSizes/urn:li:person:YOUR_PERSON_ID?edgeType=CompanyFollowedByMember',
      {
        headers: {
          'Authorization': `Bearer ${accessToken}`
        }
      }
    );
    
    const data = await response.json();
    
    return {
      followers: data.firstDegreeSize,
      connections: data.secondDegreeSize
    };
  }

  // TikTok for Developers API
  async getTikTokMetrics() {
    const accessToken = process.env.TIKTOK_ACCESS_TOKEN;
    
    const response = await fetch(
      'https://open-api.tiktok.com/research/user/info/?fields=follower_count,following_count,likes_count,video_count',
      {
        headers: {
          'Authorization': `Bearer ${accessToken}`
        }
      }
    );
    
    const data = await response.json();
    
    return {
      followers: data.data.follower_count,
      following: data.data.following_count,
      likes: data.data.likes_count,
      videos: data.data.video_count
    };
  }
}
```

### 5. Updated Marketing Dashboard Component

```typescript
// src/components/MarketingDashboard.tsx
'use client'

import { useState, useEffect } from 'react'
import { GA4Analytics } from '@/lib/ga4'
import { UserMetrics } from '@/lib/userMetrics'
import { ConvertKitAnalytics } from '@/lib/convertkit'
import { SocialMediaAnalytics } from '@/lib/socialAnalytics'

interface RealMarketingMetrics {
  overview: {
    totalUsers: number
    newUsers: number
    returningUsers: number
    conversionRate: number
    revenue: number
    averageSessionDuration: number
  }
  acquisition: {
    channels: {
      name: string
      users: number
      conversions: number
      cost: number
      roas: number
    }[]
  }
  engagement: {
    landingPageViews: number
    blogViews: number
    socialEngagement: number
    emailOpenRate: number
    emailClickRate: number
  }
  conversion: {
    signups: number
    proUpgrades: number
    funnel: {
      stage: string
      users: number
      conversionRate: number
    }[]
  }
  retention: {
    dailyActiveUsers: number
    weeklyActiveUsers: number
    monthlyActiveUsers: number
    churnRate: number
  }
}

export function MarketingDashboard() {
  const [metrics, setMetrics] = useState<RealMarketingMetrics | null>(null)
  const [dateRange, setDateRange] = useState('30d')
  const [isLoading, setIsLoading] = useState(true)

  const ga4 = new GA4Analytics()
  const userMetrics = new UserMetrics()
  const convertKit = new ConvertKitAnalytics()
  const socialMedia = new SocialMediaAnalytics()

  const fetchRealData = async () => {
    setIsLoading(true)
    
    try {
      const endDate = new Date().toISOString().split('T')[0]
      const startDate = new Date(Date.now() - getDaysFromRange(dateRange) * 24 * 60 * 60 * 1000)
        .toISOString().split('T')[0]

      // Parallel data fetching
      const [
        trafficData,
        conversionData,
        userGrowth,
        proUpgrades,
        engagementData,
        emailMetrics,
        socialMetrics
      ] = await Promise.all([
        ga4.getWebsiteTraffic(startDate, endDate),
        ga4.getConversionData(startDate, endDate),
        userMetrics.getUserGrowth(startDate, endDate),
        userMetrics.getProUpgrades(startDate, endDate),
        userMetrics.getEngagementMetrics(startDate, endDate),
        convertKit.getCampaignPerformance(),
        socialMedia.getTwitterMetrics()
      ])

      // Transform data into dashboard format
      const transformedMetrics: RealMarketingMetrics = {
        overview: {
          totalUsers: trafficData.reduce((sum, day) => sum + day.activeUsers, 0),
          newUsers: userGrowth.reduce((sum, day) => sum + day.newUsers, 0),
          returningUsers: trafficData.reduce((sum, day) => sum + day.activeUsers, 0) - 
                         userGrowth.reduce((sum, day) => sum + day.newUsers, 0),
          conversionRate: calculateConversionRate(conversionData),
          revenue: proUpgrades.totalRevenue,
          averageSessionDuration: trafficData.reduce((sum, day) => sum + day.avgSessionDuration, 0) / trafficData.length
        },
        acquisition: {
          channels: await transformAcquisitionData()
        },
        engagement: {
          landingPageViews: trafficData.reduce((sum, day) => sum + day.pageviews, 0),
          blogViews: await getBlogViews(startDate, endDate),
          socialEngagement: socialMetrics.likes + socialMetrics.followers,
          emailOpenRate: calculateAvgOpenRate(emailMetrics),
          emailClickRate: calculateAvgClickRate(emailMetrics)
        },
        conversion: {
          signups: userGrowth.reduce((sum, day) => sum + day.newUsers, 0),
          proUpgrades: proUpgrades.totalUpgrades,
          funnel: await buildConversionFunnel(startDate, endDate)
        },
        retention: {
          dailyActiveUsers: engagementData.activeUsers,
          weeklyActiveUsers: await getWeeklyActiveUsers(startDate, endDate),
          monthlyActiveUsers: await getMonthlyActiveUsers(startDate, endDate),
          churnRate: await calculateChurnRate(startDate, endDate)
        }
      }

      setMetrics(transformedMetrics)
    } catch (error) {
      console.error('Error fetching analytics data:', error)
      // Fallback to mock data if real data fails
      setMetrics(mockMetrics)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchRealData()
  }, [dateRange])

  // Helper functions
  const getDaysFromRange = (range: string): number => {
    switch (range) {
      case '7d': return 7
      case '30d': return 30
      case '90d': return 90
      case '1y': return 365
      default: return 30
    }
  }

  const calculateConversionRate = (conversionData: any[]): number => {
    const signupConversions = conversionData.find(c => c.eventName === 'sign_up')
    return signupConversions?.conversionRate || 0
  }

  // ... rest of helper functions

  if (isLoading) {
    return <div className="flex items-center justify-center p-8">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      <span className="ml-2">Loading analytics data...</span>
    </div>
  }

  // Rest of component remains the same, but uses real metrics data
  return (
    <div className="space-y-6">
      {/* Dashboard UI components using real data */}
    </div>
  )
}
```

## 🔑 Environment Variables Setup

Add these to your `.env.local`:

```bash
# Google Analytics 4
GA4_PROPERTY_ID=your_property_id
GOOGLE_APPLICATION_CREDENTIALS=path/to/service-account.json

# ConvertKit
CONVERTKIT_API_KEY=your_convertkit_api_key

# Social Media APIs
TWITTER_BEARER_TOKEN=your_twitter_bearer_token
LINKEDIN_ACCESS_TOKEN=your_linkedin_access_token
TIKTOK_ACCESS_TOKEN=your_tiktok_access_token

# Database (already configured)
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## 📊 API Route Setup

Create API routes for secure data fetching:

```typescript
// app/api/analytics/overview/route.ts
import { NextResponse } from 'next/server'
import { GA4Analytics } from '@/lib/ga4'
import { UserMetrics } from '@/lib/userMetrics'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const dateRange = searchParams.get('dateRange') || '30d'
  
  try {
    const ga4 = new GA4Analytics()
    const userMetrics = new UserMetrics()
    
    const data = await Promise.all([
      ga4.getWebsiteTraffic(getStartDate(dateRange), getTodayDate()),
      userMetrics.getUserGrowth(getStartDate(dateRange), getTodayDate())
    ])
    
    return NextResponse.json({
      success: true,
      data: {
        websiteTraffic: data[0],
        userGrowth: data[1]
      }
    })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to fetch analytics data' },
      { status: 500 }
    )
  }
}
```

## 🚀 Implementation Timeline

### Week 1: Foundation
- [ ] Set up Google Analytics 4 Reporting API
- [ ] Create Supabase analytics queries
- [ ] Build basic data transformation functions
- [ ] Replace mock data in overview metrics

### Week 2: Expand Data Sources
- [ ] Integrate ConvertKit API
- [ ] Add social media APIs
- [ ] Create comprehensive analytics service
- [ ] Add error handling and fallbacks

### Week 3: Advanced Features
- [ ] Real-time data updates
- [ ] Custom date range selection
- [ ] Export functionality
- [ ] Performance optimization

### Week 4: Polish & Testing
- [ ] A/B test dashboard layouts
- [ ] Add data visualization improvements
- [ ] Implement caching for performance
- [ ] Document analytics insights

## 📈 Benefits of Real Data Integration

1. **Accurate Decision Making**: Real metrics enable data-driven marketing decisions
2. **Performance Tracking**: Monitor actual ROI and campaign effectiveness
3. **User Insights**: Understand real user behavior patterns
4. **Growth Optimization**: Identify what actually drives conversions
5. **Investor-Ready Metrics**: Professional analytics for funding discussions

---

This integration transforms your marketing dashboard from a demo into a powerful business intelligence tool that drives real growth for PomoNest.