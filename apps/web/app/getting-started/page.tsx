import { Metadata } from 'next'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Timer, Play, Target, TrendingUp, CheckCircle, Clock, Coffee, Repeat } from 'lucide-react'
import Link from 'next/link'
import { Breadcrumbs } from '@/components/Breadcrumbs'

export const metadata: Metadata = {
  title: 'Getting Started with PomoNest - Pomodoro Timer Guide',
  description: 'Learn how to use PomoNest Pomodoro timer effectively. Complete beginner guide to the Pomodoro Technique and building productive focus habits.',
  keywords: 'Pomodoro technique guide, how to use PomoNest, productivity timer tutorial, focus techniques, time management beginner guide'
}

export default function GettingStartedPage() {
  const steps = [
    {
      icon: Play,
      title: "Start Your First Session",
      description: "Click the play button on our homepage. No signup required - you can begin focusing immediately.",
      tips: [
        "Choose a specific task to work on",
        "Eliminate distractions (phone, notifications)",
        "Have water and materials ready",
        "Set a clear intention for the session"
      ]
    },
    {
      icon: Timer,
      title: "Focus for 25 Minutes",
      description: "Work on your chosen task without interruption. If you think of something else, write it down and get back to work.",
      tips: [
        "Stay on your chosen task only",
        "Resist the urge to check social media",
        "If distracted, gently return focus",
        "Note down any urgent thoughts for later"
      ]
    },
    {
      icon: Coffee,
      title: "Take a 5-Minute Break",
      description: "When the timer rings, stop working immediately and take a proper break. This is crucial for maintaining focus.",
      tips: [
        "Step away from your workspace",
        "Stretch or do light movement",
        "Avoid screens if possible",
        "Hydrate and breathe deeply"
      ]
    },
    {
      icon: Repeat,
      title: "Repeat and Build Streaks",
      description: "Complete 4 Pomodoros, then take a longer 15-30 minute break. Track your daily streaks to build consistency.",
      tips: [
        "Aim for 2-8 Pomodoros per day",
        "Focus on consistency over quantity",
        "Celebrate completing sessions",
        "Use streaks for motivation"
      ]
    }
  ]

  const quickTips = [
    {
      title: "Choose the Right Tasks",
      content: "Pick tasks that can be completed in 25 minutes or broken into smaller chunks. Avoid switching between different types of work."
    },
    {
      title: "Prepare Your Environment",
      content: "Clear your workspace, silence notifications, and have everything you need within reach before starting."
    },
    {
      title: "Honor the Breaks",
      content: "Taking breaks isn't optional - they're essential for maintaining focus throughout the day. Don't skip them!"
    },
    {
      title: "Track Your Progress",
      content: "Use PomoNest's built-in tracking to see your improvement over time. Consistent small efforts lead to big results."
    },
    {
      title: "Start Small",
      content: "Begin with 2-4 Pomodoros per day. Building the habit is more important than doing long sessions initially."
    },
    {
      title: "Customize Settings",
      content: "Adjust timer lengths, notification sounds, and themes to match your preferences and work style."
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/50">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <Breadcrumbs />
          {/* Header */}
          <div className="text-center mb-12">
            <div className="flex items-center justify-center gap-3 mb-6">
              <div className="p-3 bg-gradient-to-br from-streak-fire to-streak-ember rounded-full">
                <Target className="h-8 w-8 text-white" />
              </div>
              <h1 className="text-4xl font-bold">Getting Started with PomoNest</h1>
            </div>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Learn how to master the Pomodoro Technique and build unstoppable focus habits 
              with PomoNest. Follow this step-by-step guide to transform your productivity.
            </p>
          </div>

          {/* Quick Start Button */}
          <Card className="mb-12 text-center bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
            <CardContent className="py-8">
              <h2 className="text-2xl font-bold mb-4">Ready to Start Right Now?</h2>
              <p className="text-muted-foreground mb-6">
                Jump straight into your first Pomodoro session. You can learn as you go!
              </p>
              <Link href="/">
                <Button size="lg" className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700">
                  <Play className="h-5 w-5 mr-2" />
                  Start Your First Session Now
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Step-by-Step Guide */}
          <div className="mb-12">
            <h2 className="text-3xl font-bold text-center mb-8">The 4-Step Pomodoro Process</h2>
            <div className="space-y-6">
              {steps.map((step, index) => (
                <Card key={index} className="overflow-hidden">
                  <CardHeader className="bg-gradient-to-r from-blue-50 to-cyan-50">
                    <CardTitle className="flex items-center gap-3">
                      <div className="p-2 bg-blue-600 rounded-full">
                        <step.icon className="h-5 w-5 text-white" />
                      </div>
                      <span className="text-2xl font-bold text-blue-600">Step {index + 1}</span>
                      <span className="text-xl">{step.title}</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-6">
                    <p className="text-muted-foreground mb-4 text-lg">
                      {step.description}
                    </p>
                    <div className="grid gap-2 md:grid-cols-2">
                      {step.tips.map((tip, tipIndex) => (
                        <div key={tipIndex} className="flex items-start gap-2">
                          <CheckCircle className="h-4 w-4 text-green-600 mt-1 flex-shrink-0" />
                          <span className="text-sm text-muted-foreground">{tip}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Pro Tips */}
          <div className="mb-12">
            <h2 className="text-3xl font-bold text-center mb-8">Pro Tips for Success</h2>
            <div className="grid gap-6 md:grid-cols-2">
              {quickTips.map((tip, index) => (
                <Card key={index} className="h-full">
                  <CardHeader>
                    <CardTitle className="text-lg">{tip.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">{tip.content}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Common Challenges */}
          <Card className="mb-12">
            <CardHeader>
              <CardTitle className="text-2xl">Overcoming Common Challenges</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="font-semibold mb-2 text-lg">🚫 "I keep getting distracted"</h3>
                <p className="text-muted-foreground">
                  This is normal! Start by writing down distractions instead of acting on them. 
                  Gradually, your focus muscle will strengthen. Use the "two-minute rule" - if something 
                  takes less than 2 minutes, note it for your break.
                </p>
              </div>
              <div>
                <h3 className="font-semibold mb-2 text-lg">⏰ "25 minutes feels too long/short"</h3>
                <p className="text-muted-foreground">
                  You can customize timer lengths in PomoNest settings. However, try the standard 25 minutes 
                  for at least a week - most people find it's the sweet spot for sustained focus without fatigue.
                </p>
              </div>
              <div>
                <h3 className="font-semibold mb-2 text-lg">😴 "I don't want to take breaks"</h3>
                <p className="text-muted-foreground">
                  Breaks prevent mental fatigue and actually improve your next session's quality. 
                  Think of them as sharpening your axe - you'll cut more trees with a sharp blade.
                </p>
              </div>
              <div>
                <h3 className="font-semibold mb-2 text-lg">📉 "I can't maintain consistency"</h3>
                <p className="text-muted-foreground">
                  Start with just one Pomodoro per day to build the habit. Use PomoNest's streak tracking 
                  for motivation. Remember: consistency beats intensity every time.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Features Overview */}
          <div className="mb-12">
            <h2 className="text-3xl font-bold text-center mb-8">Explore PomoNest Features</h2>
            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-blue-600" />
                    Track Your Progress
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">
                    Monitor your daily streaks, total focus time, and productivity patterns 
                    to stay motivated and identify your peak performance times.
                  </p>
                  <Link href="/auth/login">
                    <Button variant="outline" size="sm">
                      Create Free Account
                    </Button>
                  </Link>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="h-5 w-5 text-green-600" />
                    Manage Tasks
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">
                    Add tasks, set priorities, and track what you accomplish during each 
                    Pomodoro session to maximize your productivity.
                  </p>
                  <Link href="/">
                    <Button variant="outline" size="sm">
                      Try Task Manager
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Next Steps */}
          <Card className="text-center bg-gradient-to-br from-streak-fire/10 to-streak-ember/10 border-streak-fire/20">
            <CardContent className="py-8">
              <h2 className="text-2xl font-bold mb-4">Your Productivity Journey Starts Now</h2>
              <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
                You have everything you need to transform your focus and achieve more with less stress. 
                Start with one session and build from there.
              </p>
              <div className="flex flex-wrap gap-4 justify-center">
                <Link href="/">
                  <Button size="lg" className="bg-gradient-to-r from-streak-fire to-streak-ember">
                    <Timer className="h-5 w-5 mr-2" />
                    Begin Your First Pomodoro
                  </Button>
                </Link>
                <Link href="/blog">
                  <Button variant="outline" size="lg">
                    <Clock className="h-5 w-5 mr-2" />
                    Learn More Techniques
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