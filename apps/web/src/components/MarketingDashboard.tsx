'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import {
  BarChart3,
  TrendingUp,
  Users,
  DollarSign,
  Eye,
  MousePointer,
  Target,
  Calendar,
  Globe,
  Share2,
  Mail,
  Crown,
  ArrowUp,
  ArrowDown,
  Activity,
  Zap,
  RefreshCw
} from 'lucide-react'
import { analytics } from '@/lib/analytics'

interface MarketingMetrics {
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
      roas: number // Return on Ad Spend
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

// Mock data - replace with real analytics data
const mockMetrics: MarketingMetrics = {
  overview: {
    totalUsers: 15420,
    newUsers: 2340,
    returningUsers: 13080,
    conversionRate: 4.2,
    revenue: 18750,
    averageSessionDuration: 8.5
  },
  acquisition: {
    channels: [
      { name: 'Organic Search', users: 6200, conversions: 310, cost: 0, roas: Infinity },
      { name: 'Social Media', users: 3800, conversions: 152, cost: 1200, roas: 4.2 },
      { name: 'Product Hunt', users: 2100, conversions: 168, cost: 0, roas: Infinity },
      { name: 'Email Marketing', users: 1900, conversions: 133, cost: 300, roas: 14.8 },
      { name: 'Direct Traffic', users: 1420, conversions: 71, cost: 0, roas: Infinity }
    ]
  },
  engagement: {
    landingPageViews: 25600,
    blogViews: 18900,
    socialEngagement: 12400,
    emailOpenRate: 28.5,
    emailClickRate: 6.2
  },
  conversion: {
    signups: 834,
    proUpgrades: 142,
    funnel: [
      { stage: 'Landing Page Visit', users: 25600, conversionRate: 100 },
      { stage: 'App Trial', users: 3200, conversionRate: 12.5 },
      { stage: 'First Session', users: 2400, conversionRate: 75 },
      { stage: 'Day 3 Return', users: 1600, conversionRate: 66.7 },
      { stage: 'Pro Upgrade', users: 142, conversionRate: 8.9 }
    ]
  },
  retention: {
    dailyActiveUsers: 4200,
    weeklyActiveUsers: 8900,
    monthlyActiveUsers: 15420,
    churnRate: 8.2
  }
}

export function MarketingDashboard() {
  const [metrics, setMetrics] = useState<MarketingMetrics>(mockMetrics)
  const [dateRange, setDateRange] = useState('30d')
  const [isLoading, setIsLoading] = useState(false)

  const refreshData = async () => {
    setIsLoading(true)
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // Track dashboard usage
    analytics.track('Marketing Dashboard View', {
      date_range: dateRange,
      timestamp: new Date().toISOString()
    })
    
    setIsLoading(false)
  }

  useEffect(() => {
    refreshData()
  }, [dateRange])

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0
    }).format(amount)
  }

  const formatPercentage = (value: number) => {
    return `${value.toFixed(1)}%`
  }

  const formatNumber = (value: number) => {
    return new Intl.NumberFormat('en-US').format(value)
  }

  const MetricCard = ({ 
    title, 
    value, 
    change, 
    icon: Icon, 
    format = 'number',
    color = 'blue' 
  }: {
    title: string
    value: number
    change?: number
    icon: any
    format?: 'number' | 'currency' | 'percentage' | 'duration'
    color?: 'blue' | 'green' | 'purple' | 'orange'
  }) => {
    const formatValue = (val: number) => {
      switch (format) {
        case 'currency': return formatCurrency(val)
        case 'percentage': return formatPercentage(val)
        case 'duration': return `${val}m`
        default: return formatNumber(val)
      }
    }

    const colorClasses = {
      blue: 'bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-800',
      green: 'bg-green-50 dark:bg-green-950/20 border-green-200 dark:border-green-800',
      purple: 'bg-purple-50 dark:bg-purple-950/20 border-purple-200 dark:border-purple-800',
      orange: 'bg-orange-50 dark:bg-orange-950/20 border-orange-200 dark:border-orange-800'
    }

    return (
      <Card className={`${colorClasses[color]} border-2`}>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-300 mb-1">
                {title}
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {formatValue(value)}
              </p>
              {change !== undefined && (
                <div className="flex items-center gap-1 mt-1">
                  {change >= 0 ? (
                    <ArrowUp className="h-3 w-3 text-green-500" />
                  ) : (
                    <ArrowDown className="h-3 w-3 text-red-500" />
                  )}
                  <span className={`text-xs font-medium ${
                    change >= 0 ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {Math.abs(change)}%
                  </span>
                </div>
              )}
            </div>
            <div className={`p-3 rounded-full bg-${color}-500 bg-opacity-10`}>
              <Icon className={`h-6 w-6 text-${color}-500`} />
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Marketing Dashboard
          </h1>
          <p className="text-gray-600 dark:text-gray-300 mt-1">
            Track your marketing performance and growth metrics
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <Select value={dateRange} onValueChange={setDateRange}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="90d">Last 90 days</SelectItem>
              <SelectItem value="1y">Last year</SelectItem>
            </SelectContent>
          </Select>
          
          <Button 
            variant="outline" 
            onClick={refreshData}
            disabled={isLoading}
            className="gap-2"
          >
            <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>
      </div>

      {/* Overview Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <MetricCard
          title="Total Users"
          value={metrics.overview.totalUsers}
          change={12.5}
          icon={Users}
          color="blue"
        />
        <MetricCard
          title="Conversion Rate"
          value={metrics.overview.conversionRate}
          change={0.8}
          icon={Target}
          format="percentage"
          color="green"
        />
        <MetricCard
          title="Revenue"
          value={metrics.overview.revenue}
          change={24.3}
          icon={DollarSign}
          format="currency"
          color="purple"
        />
        <MetricCard
          title="New Users"
          value={metrics.overview.newUsers}
          change={18.2}
          icon={TrendingUp}
          color="orange"
        />
        <MetricCard
          title="Session Duration"
          value={metrics.overview.averageSessionDuration}
          change={5.1}
          icon={Activity}
          format="duration"
          color="blue"
        />
        <MetricCard
          title="Pro Upgrades"
          value={metrics.conversion.proUpgrades}
          change={31.4}
          icon={Crown}
          color="purple"
        />
      </div>

      {/* Detailed Analytics */}
      <Tabs defaultValue="acquisition" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="acquisition">Acquisition</TabsTrigger>
          <TabsTrigger value="engagement">Engagement</TabsTrigger>
          <TabsTrigger value="conversion">Conversion</TabsTrigger>
          <TabsTrigger value="retention">Retention</TabsTrigger>
        </TabsList>

        {/* Acquisition Tab */}
        <TabsContent value="acquisition" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="h-5 w-5" />
                Acquisition Channels
              </CardTitle>
              <CardDescription>
                User acquisition performance by marketing channel
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {metrics.acquisition.channels.map((channel, index) => (
                  <motion.div
                    key={channel.name}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg"
                  >
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900 dark:text-white">
                        {channel.name}
                      </h4>
                      <div className="flex items-center gap-4 mt-1 text-sm text-gray-600 dark:text-gray-300">
                        <span>{formatNumber(channel.users)} users</span>
                        <span>{formatNumber(channel.conversions)} conversions</span>
                        {channel.cost > 0 && (
                          <span>{formatCurrency(channel.cost)} cost</span>
                        )}
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <div className="text-lg font-semibold text-gray-900 dark:text-white">
                        {channel.roas === Infinity ? '∞' : `${channel.roas.toFixed(1)}x`}
                      </div>
                      <div className="text-xs text-gray-500">ROAS</div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Engagement Tab */}
        <TabsContent value="engagement" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Eye className="h-5 w-5" />
                  Content Performance
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 dark:text-gray-300">Landing Page Views</span>
                  <span className="font-semibold">{formatNumber(metrics.engagement.landingPageViews)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 dark:text-gray-300">Blog Views</span>
                  <span className="font-semibold">{formatNumber(metrics.engagement.blogViews)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 dark:text-gray-300">Social Engagement</span>
                  <span className="font-semibold">{formatNumber(metrics.engagement.socialEngagement)}</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Mail className="h-5 w-5" />
                  Email Performance
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 dark:text-gray-300">Open Rate</span>
                  <Badge variant="secondary">
                    {formatPercentage(metrics.engagement.emailOpenRate)}
                  </Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 dark:text-gray-300">Click Rate</span>
                  <Badge variant="secondary">
                    {formatPercentage(metrics.engagement.emailClickRate)}
                  </Badge>
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400 mt-4">
                  Industry average: 21.3% open, 2.6% click
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Conversion Tab */}
        <TabsContent value="conversion" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5" />
                Conversion Funnel
              </CardTitle>
              <CardDescription>
                User journey from landing page to Pro upgrade
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {metrics.conversion.funnel.map((stage, index) => (
                  <motion.div
                    key={stage.stage}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="relative"
                  >
                    <div className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-medium">
                          {index + 1}
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-900 dark:text-white">
                            {stage.stage}
                          </h4>
                          <p className="text-sm text-gray-600 dark:text-gray-300">
                            {formatNumber(stage.users)} users
                          </p>
                        </div>
                      </div>
                      
                      <Badge 
                        variant={stage.conversionRate > 50 ? "default" : "secondary"}
                        className="text-sm"
                      >
                        {formatPercentage(stage.conversionRate)}
                      </Badge>
                    </div>
                    
                    {index < metrics.conversion.funnel.length - 1 && (
                      <div className="flex justify-center mt-2 mb-2">
                        <ArrowDown className="h-4 w-4 text-gray-400" />
                      </div>
                    )}
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Retention Tab */}
        <TabsContent value="retention" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Active Users
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 dark:text-gray-300">Daily Active Users</span>
                  <span className="font-semibold">{formatNumber(metrics.retention.dailyActiveUsers)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 dark:text-gray-300">Weekly Active Users</span>
                  <span className="font-semibold">{formatNumber(metrics.retention.weeklyActiveUsers)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 dark:text-gray-300">Monthly Active Users</span>
                  <span className="font-semibold">{formatNumber(metrics.retention.monthlyActiveUsers)}</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5" />
                  Retention Health
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 dark:text-gray-300">Churn Rate</span>
                  <Badge variant={metrics.retention.churnRate < 10 ? "default" : "destructive"}>
                    {formatPercentage(metrics.retention.churnRate)}
                  </Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 dark:text-gray-300">DAU/MAU Ratio</span>
                  <Badge variant="secondary">
                    {formatPercentage((metrics.retention.dailyActiveUsers / metrics.retention.monthlyActiveUsers) * 100)}
                  </Badge>
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400 mt-4">
                  Healthy SaaS churn: &lt;5% monthly
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5" />
            Quick Actions
          </CardTitle>
          <CardDescription>
            Common marketing tasks and optimizations
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Button variant="outline" className="justify-start gap-2">
              <Share2 className="h-4 w-4" />
              Launch Social Campaign
            </Button>
            <Button variant="outline" className="justify-start gap-2">
              <Mail className="h-4 w-4" />
              Send Email Blast
            </Button>
            <Button variant="outline" className="justify-start gap-2">
              <BarChart3 className="h-4 w-4" />
              Generate Report
            </Button>
            <Button variant="outline" className="justify-start gap-2">
              <Calendar className="h-4 w-4" />
              Schedule Content
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}