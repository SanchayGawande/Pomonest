// Analytics service for tracking ad performance and user behavior

interface AnalyticsEvent {
  event: string
  category: 'ad' | 'user' | 'revenue'
  action: string
  label?: string
  value?: number
  userId?: string
}

interface AdMetrics {
  impressions: number
  clicks: number
  revenue: number
  ctr: number // Click-through rate
  rpm: number // Revenue per mille (per 1000 impressions)
}

class AnalyticsService {
  private adMetrics: Record<string, AdMetrics> = {
    banner: { impressions: 0, clicks: 0, revenue: 0, ctr: 0, rpm: 0 },
    sidebar: { impressions: 0, clicks: 0, revenue: 0, ctr: 0, rpm: 0 },
    interstitial: { impressions: 0, clicks: 0, revenue: 0, ctr: 0, rpm: 0 }
  }

  // Track events to Google Analytics 4 (if available)
  trackEvent(event: AnalyticsEvent) {
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', event.action, {
        event_category: event.category,
        event_label: event.label,
        value: event.value,
        user_id: event.userId,
        custom_parameters: {
          app_name: 'PomoNest',
          app_version: '1.0.0'
        }
      })
    }

    // Also log to console for development
    console.log('📊 GA4 Analytics Event:', event)
  }

  // Track Pomodoro-specific events
  trackTimerEvent(action: 'start' | 'pause' | 'complete' | 'reset', sessionType: 'work' | 'shortBreak' | 'longBreak', userId?: string) {
    this.trackEvent({
      event: 'timer_interaction',
      category: 'user',
      action: `timer_${action}`,
      label: sessionType,
      userId
    })
  }

  // Track page views (for SPA navigation)
  trackPageView(pagePath: string, pageTitle?: string) {
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('config', 'G-TXL346B71K', {
        page_path: pagePath,
        page_title: pageTitle
      })
    }
  }

  // Track ad impression
  trackAdImpression(adType: 'banner' | 'sidebar' | 'interstitial', userId?: string) {
    this.adMetrics[adType].impressions++
    this.updateAdMetrics(adType)

    this.trackEvent({
      event: 'ad_impression',
      category: 'ad',
      action: 'impression',
      label: adType,
      value: 0.001, // Estimated value per impression
      userId
    })
  }

  // Track ad click
  trackAdClick(adType: 'banner' | 'sidebar' | 'interstitial', userId?: string) {
    this.adMetrics[adType].clicks++
    this.adMetrics[adType].revenue += 0.05 // Estimated revenue per click
    this.updateAdMetrics(adType)

    this.trackEvent({
      event: 'ad_click',
      category: 'ad',
      action: 'click',
      label: adType,
      value: 0.05,
      userId
    })
  }

  // Track Pro upgrade
  trackProUpgrade(plan: 'monthly' | 'yearly', revenue: number, userId?: string) {
    this.trackEvent({
      event: 'purchase',
      category: 'revenue',
      action: 'pro_upgrade',
      label: plan,
      value: revenue,
      userId
    })
  }

  // Track ad blocker detection
  trackAdBlockerDetected(userId?: string) {
    this.trackEvent({
      event: 'ad_blocker_detected',
      category: 'ad',
      action: 'blocked',
      label: 'ad_blocker',
      userId
    })
  }

  // Track Pro upgrade prompt from ad
  trackAdUpgradePrompt(adType: string, userId?: string) {
    this.trackEvent({
      event: 'upgrade_prompt_shown',
      category: 'ad',
      action: 'upgrade_prompt',
      label: adType,
      userId
    })
  }

  // Update calculated metrics
  private updateAdMetrics(adType: string) {
    const metrics = this.adMetrics[adType]
    metrics.ctr = metrics.impressions > 0 ? (metrics.clicks / metrics.impressions) * 100 : 0
    metrics.rpm = metrics.impressions > 0 ? (metrics.revenue / metrics.impressions) * 1000 : 0
  }

  // Get ad performance metrics
  getAdMetrics(): Record<string, AdMetrics> {
    return { ...this.adMetrics }
  }

  // Get total revenue from ads
  getTotalAdRevenue(): number {
    return Object.values(this.adMetrics).reduce((total, metrics) => total + metrics.revenue, 0)
  }

  // Get average CTR across all ad types
  getAverageCTR(): number {
    const totalImpressions = Object.values(this.adMetrics).reduce((total, metrics) => total + metrics.impressions, 0)
    const totalClicks = Object.values(this.adMetrics).reduce((total, metrics) => total + metrics.clicks, 0)
    return totalImpressions > 0 ? (totalClicks / totalImpressions) * 100 : 0
  }

  // Reset metrics (useful for testing)
  resetMetrics() {
    Object.keys(this.adMetrics).forEach(key => {
      this.adMetrics[key] = { impressions: 0, clicks: 0, revenue: 0, ctr: 0, rpm: 0 }
    })
  }

  // Export metrics for reporting
  exportMetrics() {
    return {
      timestamp: new Date().toISOString(),
      adMetrics: this.getAdMetrics(),
      totalRevenue: this.getTotalAdRevenue(),
      averageCTR: this.getAverageCTR(),
      summary: {
        totalImpressions: Object.values(this.adMetrics).reduce((total, metrics) => total + metrics.impressions, 0),
        totalClicks: Object.values(this.adMetrics).reduce((total, metrics) => total + metrics.clicks, 0),
        totalRevenue: this.getTotalAdRevenue()
      }
    }
  }
}

// Singleton instance
export const analytics = new AnalyticsService()

// Type declarations for Google Analytics 4
declare global {
  interface Window {
    gtag?: (command: string, targetId: string, config?: any) => void
    dataLayer?: any[]
  }
}

// Initialize Google Analytics 4 - this is now handled in layout.tsx
export function initializeAnalytics() {
  // GA4 is now initialized directly in layout.tsx for better performance
  // This function is kept for backward compatibility
  if (typeof window !== 'undefined') {
    console.log('📊 Google Analytics 4 (G-TXL346B71K) should be initialized via layout.tsx')
  }
}

// Helper function to check if GA4 is available
export function isGA4Available(): boolean {
  return typeof window !== 'undefined' && !!window.gtag
}