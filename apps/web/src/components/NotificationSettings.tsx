'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Switch } from '@/components/ui/switch'
import { Badge } from '@/components/ui/badge'
import { Bell, BellOff, Check, X, AlertCircle } from 'lucide-react'
import {
  isNotificationSupported,
  getNotificationPermission,
  requestNotificationPermission,
  subscribeToPushNotifications,
  unsubscribeFromPushNotifications,
  showLocalNotification,
  NOTIFICATION_TEMPLATES
} from '@/lib/notifications'

export function NotificationSettings() {
  const { user } = useAuth()
  const [permission, setPermission] = useState<NotificationPermission | 'unsupported'>('default')
  const [isSubscribed, setIsSubscribed] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [dailyReminders, setDailyReminders] = useState(false)

  useEffect(() => {
    // Only run on client side
    if (typeof window === 'undefined') return
    
    // Check current notification status
    const currentPermission = getNotificationPermission()
    setPermission(currentPermission)

    // Check if user is subscribed (simplified - in production this would check server)
    const checkSubscription = async () => {
      if (currentPermission === 'granted' && isNotificationSupported()) {
        try {
          const registration = await navigator.serviceWorker.getRegistration()
          if (registration) {
            const subscription = await registration.pushManager.getSubscription()
            setIsSubscribed(!!subscription)
          }
        } catch (error) {
          console.error('Error checking subscription:', error)
        }
      }
    }

    checkSubscription()
  }, [])

  const handleEnableNotifications = async () => {
    if (!user?.id) return

    setIsLoading(true)
    try {
      // Request permission
      const newPermission = await requestNotificationPermission()
      setPermission(newPermission)

      if (newPermission === 'granted') {
        // Subscribe to push notifications
        await subscribeToPushNotifications(user.id)
        setIsSubscribed(true)
        setDailyReminders(true)

        // Show test notification
        showLocalNotification(
          'Notifications Enabled! 🔔',
          {
            body: 'You\'ll now receive daily reminders to maintain your streak.',
            icon: '/favicon.ico',
          }
        )
      }
    } catch (error) {
      console.error('Failed to enable notifications:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleDisableNotifications = async () => {
    if (!user?.id) return

    setIsLoading(true)
    try {
      await unsubscribeFromPushNotifications(user.id)
      setIsSubscribed(false)
      setDailyReminders(false)
    } catch (error) {
      console.error('Failed to disable notifications:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleTestNotification = () => {
    const template = NOTIFICATION_TEMPLATES.DAILY_REMINDER
    showLocalNotification(template.title, {
      body: template.body,
      icon: template.icon,
      badge: template.badge,
    })
  }

  const getPermissionBadge = () => {
    switch (permission) {
      case 'granted':
        return <Badge className="bg-green-100 text-green-800"><Check className="h-3 w-3 mr-1" />Enabled</Badge>
      case 'denied':
        return <Badge variant="destructive"><X className="h-3 w-3 mr-1" />Blocked</Badge>
      case 'unsupported':
        return <Badge variant="secondary"><X className="h-3 w-3 mr-1" />Not Supported</Badge>
      default:
        return <Badge variant="outline"><AlertCircle className="h-3 w-3 mr-1" />Not Set</Badge>
    }
  }

  if (permission === 'unsupported') {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BellOff className="h-5 w-5" />
            Push Notifications
          </CardTitle>
          <CardDescription>
            Your browser doesn't support push notifications
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            To receive daily reminders, please use a modern browser like Chrome, Firefox, or Safari.
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="border-4 border-green-200 dark:border-green-800 hover:border-green-300 dark:hover:border-green-700 transition-all duration-300 shadow-xl hover:shadow-2xl bg-gradient-to-br from-green-50/80 to-emerald-50/80 dark:from-green-950/50 dark:to-emerald-950/50">
      <CardHeader className="bg-gradient-to-r from-green-100/50 to-emerald-100/50 dark:from-green-900/30 dark:to-emerald-900/30 rounded-t-lg">
        <CardTitle className="flex items-center justify-between text-lg">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-gradient-to-br from-green-500 to-emerald-500 text-white rounded-xl shadow-lg">
              <Bell className="h-6 w-6" />
            </div>
            <span className="text-green-900 dark:text-green-100 font-bold">Push Notifications</span>
          </div>
          {getPermissionBadge()}
        </CardTitle>
        <CardDescription className="text-green-700 dark:text-green-300 font-medium">
          Get reminders to maintain your streak
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {permission === 'default' && (
          <div className="space-y-4">
            <div className="p-4 border-2 border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-950/50 rounded-xl">
              <p className="text-sm text-blue-800 dark:text-blue-200 font-medium">
                Enable notifications to receive daily reminders about your streak.
              </p>
            </div>
            <Button 
              onClick={handleEnableNotifications}
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 text-white font-semibold border-2"
              size="lg"
            >
              <Bell className="h-5 w-5 mr-2" />
              {isLoading ? 'Enabling...' : 'Enable Notifications'}
            </Button>
          </div>
        )}

        {permission === 'denied' && (
          <div className="space-y-4">
            <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-sm text-yellow-800">
                <strong>Notifications are blocked.</strong> To enable them:
              </p>
              <ol className="mt-2 text-sm text-yellow-700 list-decimal list-inside space-y-1">
                <li>Click the lock icon in your browser's address bar</li>
                <li>Change notifications from "Block" to "Allow"</li>
                <li>Refresh this page</li>
              </ol>
            </div>
          </div>
        )}

        {permission === 'granted' && (
          <div className="space-y-4">
            {/* Daily Reminders Toggle */}
            <div className="flex items-center justify-between p-4 border-2 border-border/30 rounded-xl bg-gradient-to-r from-background via-background to-muted/20 hover:border-border/60 transition-all duration-200">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 dark:bg-blue-900/50 rounded-lg">
                  <Bell className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                </div>
                <div className="space-y-1">
                  <div className="font-semibold text-foreground">Daily Reminders</div>
                  <div className="text-sm text-muted-foreground">
                    Get reminded if you haven't completed your daily session
                  </div>
                </div>
              </div>
              <Switch
                checked={dailyReminders}
                onCheckedChange={setDailyReminders}
                disabled={!isSubscribed}
              />
            </div>

            {/* Test Notification */}
            <div className="flex items-center justify-between p-4 border-2 border-border/30 rounded-xl bg-gradient-to-r from-background via-background to-muted/20 hover:border-border/60 transition-all duration-200">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-100 dark:bg-purple-900/50 rounded-lg">
                  <AlertCircle className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                </div>
                <div className="space-y-1">
                  <div className="font-semibold text-foreground">Test Notification</div>
                  <div className="text-sm text-muted-foreground">
                    Send a test notification to verify everything works
                  </div>
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={handleTestNotification}
                disabled={permission !== 'granted'}
                className="border-2 font-medium"
              >
                Test
              </Button>
            </div>

            {/* Subscription Management */}
            <div className="flex items-center justify-between p-4 border-2 border-border/30 rounded-xl bg-gradient-to-r from-background via-background to-muted/20 hover:border-border/60 transition-all duration-200">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-100 dark:bg-green-900/50 rounded-lg">
                  <Check className="h-4 w-4 text-green-600 dark:text-green-400" />
                </div>
                <div className="space-y-1">
                  <div className="font-semibold text-foreground">Push Notifications</div>
                  <div className="text-sm text-muted-foreground">
                    {isSubscribed ? 'You\'re subscribed to push notifications' : 'Subscribe to receive notifications'}
                  </div>
                </div>
              </div>
              {isSubscribed ? (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleDisableNotifications}
                  disabled={isLoading}
                  className="border-2 font-medium"
                >
                  {isLoading ? 'Unsubscribing...' : 'Unsubscribe'}
                </Button>
              ) : (
                <Button
                  size="sm"
                  onClick={handleEnableNotifications}
                  disabled={isLoading}
                  className="border-2 font-medium"
                >
                  {isLoading ? 'Subscribing...' : 'Subscribe'}
                </Button>
              )}
            </div>
          </div>
        )}

        {/* Notification Examples */}
        <div className="space-y-4 p-4 border-2 border-border/30 rounded-xl bg-gradient-to-r from-background via-background to-muted/20">
          <h4 className="font-semibold text-sm text-foreground">Notification Types:</h4>
          <div className="space-y-3 text-sm">
            <div className="flex items-center gap-3 p-2 rounded-lg bg-blue-50 dark:bg-blue-950/30">
              <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse" />
              <span className="font-medium text-blue-800 dark:text-blue-200">Daily streak reminders (8 PM)</span>
            </div>
            <div className="flex items-center gap-3 p-2 rounded-lg bg-orange-50 dark:bg-orange-950/30">
              <div className="w-3 h-3 bg-orange-500 rounded-full" />
              <span className="font-medium text-orange-800 dark:text-orange-200">Streak at risk warnings</span>
            </div>
            <div className="flex items-center gap-3 p-2 rounded-lg bg-green-50 dark:bg-green-950/30">
              <div className="w-3 h-3 bg-green-500 rounded-full" />
              <span className="font-medium text-green-800 dark:text-green-200">Milestone celebrations</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}