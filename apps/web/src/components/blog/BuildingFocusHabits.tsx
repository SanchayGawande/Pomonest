import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Zap, Target, Calendar, CheckCircle, TrendingUp } from 'lucide-react'
import Link from 'next/link'

export function BuildingFocusHabits() {
  return (
    <div className="space-y-8">
      <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg p-6 border border-yellow-200">
        <h2 className="text-2xl font-bold text-yellow-800 mb-4">The 30-Day Focus Challenge</h2>
        <p className="text-yellow-700">
          Transform your ability to focus with this comprehensive 30-day program. Build unbreakable 
          focus habits through daily exercises, progress tracking, and gradual skill development.
        </p>
      </div>

      <div>
        <h2 className="text-2xl font-bold mb-4">Week 1: Foundation Building</h2>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-6 w-6 text-blue-500" />
              Days 1-7: Basic Focus Training
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              Start with simple 15-minute focus sessions using the Pomodoro Technique. 
              The goal is consistency, not perfection.
            </p>
            <div className="bg-blue-50 p-4 rounded-lg">
              <h4 className="font-semibold text-blue-800 mb-2">Daily Tasks:</h4>
              <ul className="text-blue-700 space-y-1">
                <li>• Complete 2 pomodoros of focused work</li>
                <li>• Practice 5 minutes of breathing meditation</li>
                <li>• Track your focus level (1-10) after each session</li>
                <li>• Identify your top 3 distractions</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>

      <div>
        <h2 className="text-2xl font-bold mb-4">Week 2-4: Advanced Techniques</h2>
        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Week 2: Environment Design</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Optimize your workspace and eliminate distractions for deeper focus.
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Week 3: Energy Management</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Learn to align your most challenging tasks with your peak energy hours.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-lg p-6 border border-green-200">
        <h2 className="text-2xl font-bold mb-4 text-green-800">Ready to Transform Your Focus?</h2>
        <p className="text-green-700 mb-6">
          Join thousands of people who have improved their focus with this proven 30-day program.
        </p>
        <div className="flex flex-col sm:flex-row gap-4">
          <Link href="/">
            <Button size="lg" className="bg-gradient-to-r from-streak-fire to-streak-ember">
              Start Your Challenge
            </Button>
          </Link>
          <Link href="/blog/how-to-focus-better-proven-techniques">
            <Button variant="outline" size="lg">
              Learn Focus Techniques
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}