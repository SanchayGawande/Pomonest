import { Metadata } from 'next'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Timer, Target, Zap, Users, Heart, Award, Clock, TrendingUp } from 'lucide-react'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'About WorkStreak - Pomodoro Timer & Productivity App',
  description: 'Learn about WorkStreak, the free Pomodoro timer app that helps you build focus habits, track productivity, and achieve your goals with the proven 25/5 technique.',
}

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/50">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Hero Section */}
          <div className="text-center mb-12">
            <div className="flex items-center justify-center gap-3 mb-6">
              <div className="p-3 bg-gradient-to-br from-streak-fire to-streak-ember rounded-full">
                <Timer className="h-8 w-8 text-white" />
              </div>
              <h1 className="text-5xl font-bold bg-gradient-to-r from-streak-fire to-streak-ember bg-clip-text text-transparent">
                WorkStreak
              </h1>
            </div>
            <p className="text-xl text-muted-foreground mb-6 max-w-2xl mx-auto">
              The free Pomodoro timer that helps you build unstoppable focus habits, 
              track your productivity streaks, and achieve more with less stress.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link href="/">
                <Button size="lg" className="bg-gradient-to-r from-streak-fire to-streak-ember">
                  <Timer className="h-5 w-5 mr-2" />
                  Start Focusing Now
                </Button>
              </Link>
              <Link href="/auth/login">
                <Button variant="outline" size="lg">
                  <Users className="h-5 w-5 mr-2" />
                  Sign Up Free
                </Button>
              </Link>
            </div>
          </div>

          {/* Mission */}
          <Card className="mb-8 bg-gradient-to-br from-blue-50 to-cyan-50 border-blue-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-2xl">
                <Heart className="h-6 w-6 text-red-500" />
                Our Mission
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-lg text-muted-foreground leading-relaxed">
                We believe that everyone deserves to experience the satisfaction of deep, focused work. 
                WorkStreak makes the proven Pomodoro Technique accessible to everyone, helping you build 
                sustainable productivity habits without burning out.
              </p>
            </CardContent>
          </Card>

          {/* What Makes Us Different */}
          <div className="mb-12">
            <h2 className="text-3xl font-bold text-center mb-8">What Makes WorkStreak Special</h2>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="h-5 w-5 text-green-600" />
                    Streak-Focused
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Turn productivity into a game. Build daily streaks that motivate you to maintain 
                    consistent focus habits, one Pomodoro at a time.
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-purple-50 to-pink-50 border-purple-200">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Zap className="h-5 w-5 text-purple-600" />
                    No Barriers
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Start using immediately - no signup required. Your progress is saved locally, 
                    and you can upgrade to cloud sync anytime.
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-orange-50 to-red-50 border-orange-200">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Award className="h-5 w-5 text-orange-600" />
                    Pro Features
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Unlock advanced analytics, beautiful themes, ad-free experience, 
                    and streak protection for just $2.49/month.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* The Science Behind Pomodoro */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-2xl">
                <Clock className="h-6 w-6 text-blue-600" />
                The Science Behind the Pomodoro Technique
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">
                Developed by Francesco Cirillo in the late 1980s, the Pomodoro Technique is backed by decades 
                of research on attention, focus, and productivity. Here's why it works:
              </p>
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <h4 className="font-semibold mb-2">🧠 Cognitive Benefits</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Improves sustained attention</li>
                    <li>• Reduces mental fatigue</li>
                    <li>• Enhances creative thinking during breaks</li>
                    <li>• Builds focus endurance over time</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">⚡ Productivity Benefits</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Creates urgency without overwhelm</li>
                    <li>• Makes large tasks feel manageable</li>
                    <li>• Provides clear progress milestones</li>
                    <li>• Prevents perfectionism paralysis</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Features Overview */}
          <div className="mb-12">
            <h2 className="text-3xl font-bold text-center mb-8">Everything You Need to Focus</h2>
            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>🆓 Free Features</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-muted-foreground">
                    <li>• 25/5 Pomodoro timer with customizable durations</li>
                    <li>• Daily streak tracking and progress visualization</li>
                    <li>• Task management with priority levels</li>
                    <li>• Basic productivity analytics</li>
                    <li>• Multiple notification sounds</li>
                    <li>• Guest mode - no signup required</li>
                    <li>• Mobile-responsive design</li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-yellow-50 to-orange-50 border-yellow-200">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Award className="h-5 w-5 text-yellow-600" />
                    Pro Features ($2.49/month)
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-muted-foreground">
                    <li>• 🚫 Completely ad-free experience</li>
                    <li>• 📊 Advanced analytics and insights</li>
                    <li>• ☁️ Cloud sync across all devices</li>
                    <li>• 🛡️ Streak protection with Save Passes</li>
                    <li>• 🎨 Premium visual themes and animations</li>
                    <li>• 📈 Detailed productivity reports</li>
                    <li>• 🎯 Smart focus recommendations</li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Statistics */}
          <Card className="mb-8 bg-gradient-to-br from-gray-50 to-slate-50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-2xl">
                <TrendingUp className="h-6 w-6 text-green-600" />
                Join Thousands of Focused Minds
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-8 md:grid-cols-3 text-center">
                <div>
                  <div className="text-3xl font-bold text-streak-fire mb-2">10,000+</div>
                  <div className="text-muted-foreground">Focus Sessions Completed</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-green-600 mb-2">250+</div>
                  <div className="text-muted-foreground">Hours of Deep Work</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-blue-600 mb-2">500+</div>
                  <div className="text-muted-foreground">Productivity Streaks Built</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Team */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Built with Love for Productivity
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                WorkStreak is crafted by a team passionate about productivity, focus, and helping people 
                achieve their goals without burnout. We use the Pomodoro Technique ourselves every day 
                and believe in building tools that genuinely improve people's work and life.
              </p>
            </CardContent>
          </Card>

          {/* Values */}
          <div className="mb-12">
            <h2 className="text-3xl font-bold text-center mb-8">Our Values</h2>
            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>🎯 Focus Over Features</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    We prioritize depth over breadth, building tools that excel at their core purpose 
                    rather than trying to do everything.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>🔓 Accessibility First</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Productivity tools should be available to everyone. That's why our core features 
                    are free and work without creating an account.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>🔒 Privacy Matters</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Your focus data belongs to you. We use minimal tracking, secure encryption, 
                    and transparent data practices.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>⚡ Performance Obsessed</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    A productivity app should never slow you down. We optimize for speed, 
                    reliability, and seamless user experience.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* CTA */}
          <Card className="text-center bg-gradient-to-br from-streak-fire/10 to-streak-ember/10 border-streak-fire/20">
            <CardContent className="py-8">
              <h2 className="text-2xl font-bold mb-4">Ready to Build Your Focus Streak?</h2>
              <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
                Join thousands of focused minds who use WorkStreak to build productive habits, 
                achieve their goals, and maintain sustainable focus without burnout.
              </p>
              <div className="flex flex-wrap gap-4 justify-center">
                <Link href="/">
                  <Button size="lg" className="bg-gradient-to-r from-streak-fire to-streak-ember">
                    <Timer className="h-5 w-5 mr-2" />
                    Start Your First Session
                  </Button>
                </Link>
                <Link href="/auth/login">
                  <Button variant="outline" size="lg">
                    <Users className="h-5 w-5 mr-2" />
                    Create Free Account
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}