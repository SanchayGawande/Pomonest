import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Users, Monitor, MessageSquare, Calendar, CheckCircle, Clock } from 'lucide-react'
import Link from 'next/link'

export function TeamProductivityRemoteWork() {
  return (
    <div className="space-y-8">
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-6 border border-blue-200">
        <h2 className="text-2xl font-bold text-blue-800 mb-4">Remote Team Productivity</h2>
        <p className="text-blue-700">
          Leading a productive remote team requires new strategies for communication, collaboration, 
          and maintaining focus across different time zones and environments.
        </p>
      </div>

      <div>
        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
          <Users className="h-6 w-6 text-green-500" />
          Building Remote Team Culture
        </h2>
        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5 text-blue-500" />
                Communication Strategies
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="text-muted-foreground space-y-2">
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500 mt-1" />
                  <span>Daily stand-ups with clear objectives</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500 mt-1" />
                  <span>Asynchronous communication protocols</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500 mt-1" />
                  <span>Regular one-on-ones for personal connection</span>
                </li>
              </ul>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-purple-500" />
                Time Management
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="text-muted-foreground space-y-2">
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500 mt-1" />
                  <span>Shared calendars for transparency</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500 mt-1" />
                  <span>Pomodoro sessions for focused work</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500 mt-1" />
                  <span>Time zone awareness and respect</span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>

      <Card className="border-l-4 border-l-blue-500">
        <CardHeader>
          <CardTitle className="text-blue-700">Team Pomodoro Sessions</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground mb-4">
            Virtual co-working sessions using the Pomodoro Technique can help remote teams 
            maintain focus and connection.
          </p>
          <div className="bg-blue-50 p-4 rounded-lg">
            <h4 className="font-semibold text-blue-800 mb-2">How to run team pomodoros:</h4>
            <ol className="text-blue-700 space-y-1 list-decimal list-inside">
              <li>Schedule 2-hour virtual co-working sessions</li>
              <li>Start with 5-minute goal-setting round</li>
              <li>Work in synchronized 25-minute blocks</li>
              <li>Share progress during breaks</li>
              <li>End with accomplishment celebration</li>
            </ol>
          </div>
        </CardContent>
      </Card>

      <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-lg p-6 border border-green-200">
        <h2 className="text-2xl font-bold mb-4 text-green-800">Transform Your Remote Team</h2>
        <p className="text-green-700 mb-6">
          Effective remote team productivity starts with the right tools and techniques. 
          Try implementing team Pomodoro sessions to boost focus and collaboration.
        </p>
        <div className="flex flex-col sm:flex-row gap-4">
          <Link href="/">
            <Button size="lg" className="bg-gradient-to-r from-streak-fire to-streak-ember">
              Start Team Session
            </Button>
          </Link>
          <Link href="/blog/complete-pomodoro-technique-guide-2025">
            <Button variant="outline" size="lg">
              Learn Pomodoro Basics
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}