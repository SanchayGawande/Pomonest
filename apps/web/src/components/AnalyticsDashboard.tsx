'use client'

import { useState, useEffect, useMemo } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useAuth } from '@/hooks/useAuth'
import { supabase } from '@/lib/supabase'
import { 
  BarChart3, 
  TrendingUp, 
  Clock, 
  Flame, 
  Target, 
  Calendar,
  Award,
  Download,
  Filter,
  RefreshCw,
  Play
} from 'lucide-react'

interface SessionData {
  date: string
  sessionCount: number
  totalMinutes: number
  type: 'work' | 'break'
}

interface TaskData {
  id: string
  title: string
  category: string
  completedPomodoros: number
  estimatedPomodoros: number
  completed: boolean
  completedAt?: string
}

interface AnalyticsData {
  totalSessions: number
  totalMinutes: number
  currentStreak: number
  longestStreak: number
  averageSessionsPerDay: number
  mostProductiveDay: string
  mostProductiveHour: number
  completedTasks: number
  totalTasks: number
  sessionsThisWeek: SessionData[]
  sessionsThisMonth: SessionData[]
  categoryBreakdown: Record<string, number>
  dailyAverage: number
  weeklyAverage: number
  monthlyTotal: number
}

interface AnalyticsDashboardProps {
  className?: string
}

// Generate empty analytics for new users
const generateEmptyAnalytics = (): AnalyticsData => {
  const today = new Date()
  const weekData: SessionData[] = []
  const monthData: SessionData[] = []

  // Generate empty data for last 7 days
  for (let i = 6; i >= 0; i--) {
    const date = new Date(today)
    date.setDate(date.getDate() - i)
    weekData.push({
      date: date.toISOString().split('T')[0],
      sessionCount: 0,
      totalMinutes: 0,
      type: 'work'
    })
  }

  // Generate empty data for last 30 days
  for (let i = 29; i >= 0; i--) {
    const date = new Date(today)
    date.setDate(date.getDate() - i)
    monthData.push({
      date: date.toISOString().split('T')[0],
      sessionCount: 0,
      totalMinutes: 0,
      type: 'work'
    })
  }

  return {
    totalSessions: 0,
    totalMinutes: 0,
    currentStreak: 0,
    longestStreak: 0,
    averageSessionsPerDay: 0,
    mostProductiveDay: 'No data yet',
    mostProductiveHour: 0,
    completedTasks: 0,
    totalTasks: 0,
    sessionsThisWeek: weekData,
    sessionsThisMonth: monthData,
    categoryBreakdown: {
      'Work': 0,
      'Study': 0,
      'Personal': 0,
      'Health': 0,
      'Creative': 0
    },
    dailyAverage: 0,
    weeklyAverage: 0,
    monthlyTotal: 0
  }
}

// Fetch real analytics data from database
const fetchUserAnalytics = async (userId: string): Promise<AnalyticsData> => {
  try {
    // Fetch user sessions from the database
    const { data: sessions, error: sessionsError } = await supabase
      .from('sessions')
      .select('*')
      .eq('user_id', userId)
      .order('session_date', { ascending: false })

    if (sessionsError) {
      console.error('Error fetching sessions:', sessionsError)
      return generateEmptyAnalytics()
    }

    // Fetch user streak data
    const { data: streakData, error: streakError } = await supabase
      .from('streaks')
      .select('*')
      .eq('user_id', userId)
      .single()

    if (streakError && streakError.code !== 'PGRST116') {
      console.error('Error fetching streak data:', streakError)
    }

    // If no sessions exist, return empty analytics
    if (!sessions || sessions.length === 0) {
      return generateEmptyAnalytics()
    }

    // Process the real session data
    const today = new Date()
    const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000)
    const monthAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000)

    // Group sessions by date
    const sessionsByDate = sessions.reduce((acc, session) => {
      const date = session.session_date
      if (!acc[date]) {
        acc[date] = []
      }
      acc[date].push(session)
      return acc
    }, {} as Record<string, any[]>)

    // Generate week and month data from real sessions
    const weekData: SessionData[] = []
    const monthData: SessionData[] = []

    for (let i = 6; i >= 0; i--) {
      const date = new Date(today)
      date.setDate(date.getDate() - i)
      const dateStr = date.toISOString().split('T')[0]
      const daySessions = sessionsByDate[dateStr] || []
      const sessionCount = daySessions.length
      const totalMinutes = daySessions.reduce((sum: number, session: any) => sum + (session.duration_minutes || 25), 0)
      
      weekData.push({
        date: dateStr,
        sessionCount,
        totalMinutes,
        type: 'work'
      })
    }

    for (let i = 29; i >= 0; i--) {
      const date = new Date(today)
      date.setDate(date.getDate() - i)
      const dateStr = date.toISOString().split('T')[0]
      const daySessions = sessionsByDate[dateStr] || []
      const sessionCount = daySessions.length
      const totalMinutes = daySessions.reduce((sum: number, session: any) => sum + (session.duration_minutes || 25), 0)
      
      monthData.push({
        date: dateStr,
        sessionCount,
        totalMinutes,
        type: 'work'
      })
    }

    const totalSessions = sessions.length
    const totalMinutes = sessions.reduce((sum: number, session: any) => sum + (session.duration_minutes || 25), 0)
    const currentStreak = streakData?.current_streak || 0
    const longestStreak = streakData?.longest_streak || 0

    return {
      totalSessions,
      totalMinutes,
      currentStreak,
      longestStreak,
      averageSessionsPerDay: totalSessions / 30,
      mostProductiveDay: 'Monday', // Could calculate this from real data
      mostProductiveHour: 14,
      completedTasks: 0, // Would need task system integration
      totalTasks: 0,
      sessionsThisWeek: weekData,
      sessionsThisMonth: monthData,
      categoryBreakdown: {
        'Work': totalSessions > 0 ? 100 : 0, // Default to 100% work for now
        'Study': 0,
        'Personal': 0,
        'Health': 0,
        'Creative': 0
      },
      dailyAverage: totalMinutes / 30 / 60,
      weeklyAverage: totalMinutes / 4 / 60,
      monthlyTotal: totalMinutes / 60
    }
  } catch (error) {
    console.error('Error fetching analytics data:', error)
    return generateEmptyAnalytics()
  }
}

// Get guest analytics from localStorage
const getGuestAnalytics = (): AnalyticsData => {
  try {
    const guestStats = localStorage.getItem('workstreak_guest_stats')
    if (!guestStats) {
      return generateEmptyAnalytics()
    }

    const stats = JSON.parse(guestStats)
    const today = new Date()
    const weekData: SessionData[] = []
    const monthData: SessionData[] = []

    // For guest users, we only have basic stats, so generate minimal data
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today)
      date.setDate(date.getDate() - i)
      const isToday = i === 0
      weekData.push({
        date: date.toISOString().split('T')[0],
        sessionCount: isToday ? (stats.todaySessionCount || 0) : 0,
        totalMinutes: isToday ? (stats.todaySessionCount || 0) * 25 : 0,
        type: 'work'
      })
    }

    // Similar for month data
    for (let i = 29; i >= 0; i--) {
      const date = new Date(today)
      date.setDate(date.getDate() - i)
      const isToday = i === 0
      monthData.push({
        date: date.toISOString().split('T')[0],
        sessionCount: isToday ? (stats.todaySessionCount || 0) : 0,
        totalMinutes: isToday ? (stats.todaySessionCount || 0) * 25 : 0,
        type: 'work'
      })
    }

    return {
      totalSessions: stats.totalSessionCount || 0,
      totalMinutes: (stats.totalSessionCount || 0) * 25,
      currentStreak: stats.streak || 0,
      longestStreak: stats.streak || 0,
      averageSessionsPerDay: (stats.totalSessionCount || 0) / 30,
      mostProductiveDay: 'No data yet',
      mostProductiveHour: 0,
      completedTasks: 0,
      totalTasks: 0,
      sessionsThisWeek: weekData,
      sessionsThisMonth: monthData,
      categoryBreakdown: {
        'Work': stats.totalSessionCount > 0 ? 100 : 0,
        'Study': 0,
        'Personal': 0,
        'Health': 0,
        'Creative': 0
      },
      dailyAverage: (stats.totalSessionCount || 0) * 25 / 30 / 60,
      weeklyAverage: (stats.totalSessionCount || 0) * 25 / 4 / 60,
      monthlyTotal: (stats.totalSessionCount || 0) * 25 / 60
    }
  } catch (error) {
    console.error('Error getting guest analytics:', error)
    return generateEmptyAnalytics()
  }
}

export function AnalyticsDashboard({ className }: AnalyticsDashboardProps) {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null)
  const [timeRange, setTimeRange] = useState<'week' | 'month' | 'year'>('week')
  const [loading, setLoading] = useState(true)
  const { user } = useAuth()

  useEffect(() => {
    const loadAnalytics = async () => {
      setLoading(true)
      try {
        if (user?.id) {
          // Authenticated user - fetch real data from database
          console.log('Loading analytics for authenticated user:', user.id)
          const data = await fetchUserAnalytics(user.id)
          console.log('Analytics data loaded:', data)
          setAnalytics(data)
        } else {
          // Guest user - get data from localStorage
          console.log('Loading analytics for guest user from localStorage')
          const data = getGuestAnalytics()
          console.log('Guest analytics data:', data)
          setAnalytics(data)
        }
      } catch (error) {
        console.error('Error loading analytics:', error)
        setAnalytics(generateEmptyAnalytics())
      } finally {
        setLoading(false)
      }
    }

    loadAnalytics()
  }, [user?.id])

  const chartData = useMemo(() => {
    if (!analytics) return []
    
    const data = timeRange === 'week' ? analytics.sessionsThisWeek : analytics.sessionsThisMonth
    return data.map(day => ({
      date: new Date(day.date).toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric' 
      }),
      sessions: day.sessionCount,
      minutes: day.totalMinutes
    }))
  }, [analytics, timeRange])

  if (loading || !analytics) {
    return (
      <div className="flex items-center justify-center p-8">
        <RefreshCw className="h-6 w-6 animate-spin" />
        <span className="ml-2 text-muted-foreground">Loading analytics...</span>
      </div>
    )
  }

  const taskCompletionRate = analytics.totalTasks > 0 ? (analytics.completedTasks / analytics.totalTasks) * 100 : 0
  const maxSessions = Math.max(...chartData.map(d => d.sessions), 1) // Ensure at least 1 for percentage calculation
  const isNewUser = analytics.totalSessions === 0

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Analytics Dashboard</h2>
          <p className="text-muted-foreground">Track your productivity and focus patterns</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button variant="outline" size="sm">
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </Button>
        </div>
      </div>

      {/* New User Welcome Message */}
      {isNewUser && (
        <Card className="border-2 border-dashed border-muted-foreground/25">
          <CardContent className="flex flex-col items-center justify-center p-8 text-center">
            <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
              <BarChart3 className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Welcome to Your Analytics Dashboard!</h3>
            <p className="text-muted-foreground mb-4 max-w-md">
              Start your first Pomodoro session to begin tracking your productivity journey. 
              Your stats, streaks, and insights will appear here as you build your focus habits.
            </p>
            <Button variant="default" className="gap-2">
              <Play className="h-4 w-4" />
              Start Your First Session
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-blue-500" />
              <div className="text-sm font-medium text-muted-foreground">Total Time</div>
            </div>
            <div className="text-2xl font-bold">{Math.round(analytics.monthlyTotal)}h</div>
            <p className="text-xs text-muted-foreground">This month</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2">
              <Target className="h-5 w-5 text-green-500" />
              <div className="text-sm font-medium text-muted-foreground">Sessions</div>
            </div>
            <div className="text-2xl font-bold">{analytics.totalSessions}</div>
            <p className="text-xs text-muted-foreground">Completed</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2">
              <Flame className="h-5 w-5 text-orange-500" />
              <div className="text-sm font-medium text-muted-foreground">Current Streak</div>
            </div>
            <div className="text-2xl font-bold">{analytics.currentStreak}</div>
            <p className="text-xs text-muted-foreground">Days</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2">
              <Award className="h-5 w-5 text-purple-500" />
              <div className="text-sm font-medium text-muted-foreground">Best Streak</div>
            </div>
            <div className="text-2xl font-bold">{analytics.longestStreak}</div>
            <p className="text-xs text-muted-foreground">Days</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Analytics Tabs */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid grid-cols-4 w-full">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="sessions">Sessions</TabsTrigger>
          <TabsTrigger value="tasks">Tasks</TabsTrigger>
          <TabsTrigger value="insights">Insights</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-2">
            {/* Sessions Chart */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5" />
                    Daily Sessions
                  </CardTitle>
                  <div className="flex gap-1">
                    <Button
                      variant={timeRange === 'week' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setTimeRange('week')}
                    >
                      Week
                    </Button>
                    <Button
                      variant={timeRange === 'month' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setTimeRange('month')}
                    >
                      Month
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {/* Simple bar chart */}
                <div className="space-y-3">
                  {chartData.slice(-7).map((day, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <div className="w-16 text-sm text-muted-foreground">{day.date}</div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <Progress 
                            value={(day.sessions / maxSessions) * 100} 
                            className="flex-1"
                          />
                          <span className="text-sm font-medium w-8">{day.sessions}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Focus Time Breakdown */}
            <Card>
              <CardHeader>
                <CardTitle>Focus Time Distribution</CardTitle>
                <CardDescription>How you spend your focused time</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {Object.entries(analytics.categoryBreakdown).map(([category, percentage]) => (
                    <div key={category} className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>{category}</span>
                        <span className="font-medium">{percentage}%</span>
                      </div>
                      <Progress value={percentage} className="h-2" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Performance Metrics */}
          <Card>
            <CardHeader>
              <CardTitle>Performance Metrics</CardTitle>
              <CardDescription>Your productivity trends and patterns</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-500">
                    {analytics.dailyAverage.toFixed(1)}h
                  </div>
                  <div className="text-sm text-muted-foreground">Daily Average</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-500">
                    {analytics.averageSessionsPerDay.toFixed(1)}
                  </div>
                  <div className="text-sm text-muted-foreground">Sessions/Day</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-orange-500">
                    {analytics.mostProductiveDay}
                  </div>
                  <div className="text-sm text-muted-foreground">Best Day</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-500">
                    {analytics.mostProductiveHour}:00
                  </div>
                  <div className="text-sm text-muted-foreground">Peak Hour</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Sessions Tab */}
        <TabsContent value="sessions" className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-3">
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Session History</CardTitle>
                <CardDescription>Your recent focus sessions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {analytics.sessionsThisWeek.map((session, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <div className="font-medium">{new Date(session.date).toLocaleDateString()}</div>
                          <div className="text-sm text-muted-foreground">
                            {session.sessionCount} sessions • {session.totalMinutes} minutes
                          </div>
                        </div>
                      </div>
                      <Badge variant="secondary">
                        {(session.totalMinutes / 60).toFixed(1)}h
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Session Stats</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary">{analytics.totalSessions}</div>
                  <div className="text-sm text-muted-foreground">Total Sessions</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-500">{analytics.totalMinutes}</div>
                  <div className="text-sm text-muted-foreground">Total Minutes</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-orange-500">{analytics.averageSessionsPerDay.toFixed(1)}</div>
                  <div className="text-sm text-muted-foreground">Daily Average</div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Tasks Tab */}
        <TabsContent value="tasks" className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Task Completion</CardTitle>
                <CardDescription>Your task completion progress</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="text-center">
                    <div className="text-4xl font-bold mb-2">{taskCompletionRate.toFixed(0)}%</div>
                    <div className="text-sm text-muted-foreground">Completion Rate</div>
                  </div>
                  <Progress value={taskCompletionRate} className="h-3" />
                  <div className="flex justify-between text-sm">
                    <span>{analytics.completedTasks} completed</span>
                    <span>{analytics.totalTasks - analytics.completedTasks} remaining</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Category Performance</CardTitle>
                <CardDescription>Focus time by task category</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {Object.entries(analytics.categoryBreakdown).map(([category, percentage]) => (
                    <div key={category} className="flex justify-between items-center">
                      <span className="text-sm">{category}</span>
                      <div className="flex items-center gap-2">
                        <Progress value={percentage} className="w-20 h-2" />
                        <span className="text-sm font-medium w-10 text-right">{percentage}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Insights Tab */}
        <TabsContent value="insights" className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Productivity Insights
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                  <div className="font-medium text-green-800">🎯 Great Focus Habits!</div>
                  <div className="text-sm text-green-700 mt-1">
                    You're averaging {analytics.averageSessionsPerDay.toFixed(1)} sessions per day. Keep it up!
                  </div>
                </div>
                <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="font-medium text-blue-800">📊 Peak Performance</div>
                  <div className="text-sm text-blue-700 mt-1">
                    Your most productive day is {analytics.mostProductiveDay}. Consider scheduling important tasks then.
                  </div>
                </div>
                <div className="p-4 bg-orange-50 border border-orange-200 rounded-lg">
                  <div className="font-medium text-orange-800">🔥 Streak Power</div>
                  <div className="text-sm text-orange-700 mt-1">
                    You're on a {analytics.currentStreak}-day streak! Your longest was {analytics.longestStreak} days.
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Recommendations</CardTitle>
                <CardDescription>Personalized tips to improve your focus</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-start gap-3 p-3 border rounded-lg">
                  <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center mt-0.5">
                    <Clock className="h-3 w-3 text-blue-600" />
                  </div>
                  <div>
                    <div className="font-medium text-sm">Optimize Your Schedule</div>
                    <div className="text-xs text-muted-foreground">
                      You're most productive around {analytics.mostProductiveHour}:00. Block this time for important work.
                    </div>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-3 border rounded-lg">
                  <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center mt-0.5">
                    <Target className="h-3 w-3 text-green-600" />
                  </div>
                  <div>
                    <div className="font-medium text-sm">Task Variety</div>
                    <div className="text-xs text-muted-foreground">
                      Try mixing different task categories to maintain engagement throughout the day.
                    </div>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-3 border rounded-lg">
                  <div className="w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center mt-0.5">
                    <Flame className="h-3 w-3 text-purple-600" />
                  </div>
                  <div>
                    <div className="font-medium text-sm">Streak Protection</div>
                    <div className="text-xs text-muted-foreground">
                      Consider upgrading to Pro for Save Passes to protect your {analytics.currentStreak}-day streak.
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}