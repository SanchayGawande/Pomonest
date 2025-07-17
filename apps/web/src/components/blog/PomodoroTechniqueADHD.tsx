import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Brain, Timer, Target, CheckCircle, AlertCircle } from 'lucide-react'
import Link from 'next/link'

export function PomodoroTechniqueADHD() {
  return (
    <div className="space-y-8">
      <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg p-6 border border-purple-200">
        <h2 className="text-2xl font-bold text-purple-800 mb-4">Pomodoro for ADHD Minds</h2>
        <p className="text-purple-700">
          The Pomodoro Technique can be incredibly effective for people with ADHD when adapted 
          to work with, not against, ADHD brain patterns.
        </p>
      </div>

      <div>
        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
          <Brain className="h-6 w-6 text-purple-500" />
          Understanding ADHD and Focus
        </h2>
        <div className="grid gap-4 md:grid-cols-2">
          <Card className="border-blue-200 bg-blue-50">
            <CardHeader>
              <CardTitle className="text-blue-800">ADHD Challenges</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="text-blue-700 space-y-2">
                <li className="flex items-start gap-2">
                  <AlertCircle className="h-4 w-4 text-blue-500 mt-1" />
                  <span>Difficulty with sustained attention</span>
                </li>
                <li className="flex items-start gap-2">
                  <AlertCircle className="h-4 w-4 text-blue-500 mt-1" />
                  <span>Hyperfocus vs. inability to focus</span>
                </li>
                <li className="flex items-start gap-2">
                  <AlertCircle className="h-4 w-4 text-blue-500 mt-1" />
                  <span>Time blindness and poor time estimation</span>
                </li>
                <li className="flex items-start gap-2">
                  <AlertCircle className="h-4 w-4 text-blue-500 mt-1" />
                  <span>Rejection sensitivity and perfectionism</span>
                </li>
              </ul>
            </CardContent>
          </Card>
          
          <Card className="border-green-200 bg-green-50">
            <CardHeader>
              <CardTitle className="text-green-800">How Pomodoro Helps</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="text-green-700 space-y-2">
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500 mt-1" />
                  <span>External structure and time awareness</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500 mt-1" />
                  <span>Breaks prevent hyperfocus exhaustion</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500 mt-1" />
                  <span>Manageable chunks reduce overwhelm</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500 mt-1" />
                  <span>Built-in rewards and dopamine hits</span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>

      <Card className="border-l-4 border-l-purple-500">
        <CardHeader>
          <CardTitle className="text-purple-700">ADHD-Specific Modifications</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="bg-purple-50 p-4 rounded-lg">
              <h4 className="font-semibold text-purple-800 mb-2">Flexible Time Blocks</h4>
              <p className="text-purple-700 mb-2">
                Instead of rigid 25-minute sessions, try:
              </p>
              <ul className="text-purple-600 space-y-1 list-disc list-inside">
                <li>15-minute sessions when starting out</li>
                <li>30-45 minute sessions during hyperfocus</li>
                <li>Variable breaks based on energy levels</li>
              </ul>
            </div>
            
            <div className="bg-blue-50 p-4 rounded-lg">
              <h4 className="font-semibold text-blue-800 mb-2">Dopamine-Friendly Rewards</h4>
              <ul className="text-blue-700 space-y-1 list-disc list-inside">
                <li>Immediate rewards after each pomodoro</li>
                <li>Visual progress tracking (satisfying to complete)</li>
                <li>Celebration of small wins</li>
                <li>Gamification elements</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-lg p-6 border border-green-200">
        <h2 className="text-2xl font-bold mb-4 text-green-800">Start Your ADHD-Friendly Focus Journey</h2>
        <p className="text-green-700 mb-6">
          Remember, the best productivity system is one that works with your ADHD brain, not against it. 
          Start small and adjust based on what feels right for you.
        </p>
        <div className="flex flex-col sm:flex-row gap-4">
          <Link href="/">
            <Button size="lg" className="bg-gradient-to-r from-streak-fire to-streak-ember">
              Try ADHD-Friendly Timer
            </Button>
          </Link>
          <Link href="/blog/complete-pomodoro-technique-guide-2025">
            <Button variant="outline" size="lg">
              Learn Basic Pomodoro
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}