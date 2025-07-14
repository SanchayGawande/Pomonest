'use client'

import { useEffect, useState } from 'react'
import { useAds } from './AdProvider'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { 
  TrendingUp, 
  Eye, 
  MousePointer, 
  DollarSign, 
  BarChart3,
  RefreshCw,
  Download
} from 'lucide-react'

export function AdMetricsDashboard() {
  const { getAdMetrics, adRevenue } = useAds()
  const [metrics, setMetrics] = useState<any>({})
  const [refreshCount, setRefreshCount] = useState(0)

  const refreshMetrics = () => {
    setMetrics(getAdMetrics())
    setRefreshCount(prev => prev + 1)
  }

  useEffect(() => {
    refreshMetrics()
    // Auto-refresh every 30 seconds
    const interval = setInterval(refreshMetrics, 30000)
    return () => clearInterval(interval)
  }, [getAdMetrics])

  const totalImpressions = Object.values(metrics).reduce((total: number, metric: any) => total + (metric?.impressions || 0), 0)
  const totalClicks = Object.values(metrics).reduce((total: number, metric: any) => total + (metric?.clicks || 0), 0)
  const averageCTR = totalImpressions > 0 ? (totalClicks / totalImpressions) * 100 : 0

  const exportMetrics = () => {
    const data = {
      timestamp: new Date().toISOString(),
      totalRevenue: adRevenue,
      totalImpressions,
      totalClicks,
      averageCTR: averageCTR.toFixed(2),
      adTypeBreakdown: metrics
    }
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `workstreak-ad-metrics-${new Date().toISOString().split('T')[0]}.json`
    link.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Ad Performance Dashboard</h2>
        <div className="flex gap-2">
          <Button onClick={refreshMetrics} variant="outline" size="sm">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Button onClick={exportMetrics} variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              ${adRevenue.toFixed(2)}
            </div>
            <p className="text-xs text-muted-foreground">
              From {totalClicks} clicks
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Impressions</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalImpressions}</div>
            <p className="text-xs text-muted-foreground">
              Ads displayed
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Clicks</CardTitle>
            <MousePointer className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalClicks}</div>
            <p className="text-xs text-muted-foreground">
              User interactions
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average CTR</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{averageCTR.toFixed(2)}%</div>
            <p className="text-xs text-muted-foreground">
              Click-through rate
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Ad Type Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Performance by Ad Type
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {Object.entries(metrics).map(([adType, metric]: [string, any]) => (
              <div key={adType} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="capitalize">
                      {adType}
                    </Badge>
                    <span className="text-sm font-medium">
                      {metric?.impressions || 0} impressions
                    </span>
                  </div>
                  <div className="flex items-center gap-4 text-sm">
                    <span className="text-blue-600">
                      {metric?.clicks || 0} clicks
                    </span>
                    <span className="text-green-600">
                      ${(metric?.revenue || 0).toFixed(2)}
                    </span>
                    <span className="text-purple-600">
                      {(metric?.ctr || 0).toFixed(2)}% CTR
                    </span>
                  </div>
                </div>
                <Progress 
                  value={metric?.ctr || 0} 
                  max={5} 
                  className="h-2"
                />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Status Info */}
      <Card>
        <CardHeader>
          <CardTitle>Dashboard Info</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Last Updated:</span>
            <span>{new Date().toLocaleTimeString()}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span>Refresh Count:</span>
            <span>{refreshCount}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span>Auto-refresh:</span>
            <span className="text-green-600">Every 30s</span>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}