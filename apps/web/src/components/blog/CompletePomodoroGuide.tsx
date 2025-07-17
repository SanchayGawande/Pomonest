import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Timer, Target, Brain, CheckCircle, AlertCircle, TrendingUp, Users, BookOpen } from 'lucide-react'
import Link from 'next/link'

export function CompletePomodoroGuide() {
  return (
    <div className="space-y-8">
      {/* Introduction */}
      <div className="bg-gradient-to-r from-red-50 to-orange-50 rounded-lg p-6 border border-red-200">
        <div className="flex items-center gap-3 mb-4">
          <Timer className="h-8 w-8 text-red-500" />
          <div>
            <h2 className="text-2xl font-bold text-red-800">What is the Pomodoro Technique?</h2>
            <p className="text-red-600">The world's most popular productivity method</p>
          </div>
        </div>
        <p className="text-gray-700 leading-relaxed">
          The Pomodoro Technique is a time management method developed by Francesco Cirillo in the late 1980s. 
          Named after the tomato-shaped kitchen timer (pomodoro means "tomato" in Italian) that Cirillo used 
          as a university student, this technique has become one of the most popular productivity methods worldwide.
        </p>
        <div className="mt-4 p-4 bg-red-100 rounded-lg">
          <p className="font-semibold text-red-800">The basic principle is elegantly simple:</p>
          <p className="text-red-700">Work for 25 minutes with complete focus, then take a 5-minute break. 
          After four of these cycles (called "pomodoros"), take a longer 15-30 minute break.</p>
        </div>
      </div>

      {/* Why It Works */}
      <div>
        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
          <Brain className="h-6 w-6 text-blue-500" />
          Why the Pomodoro Technique Works
        </h2>
        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5 text-green-500" />
                Fights Distraction
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                In our hyper-connected world, the average knowledge worker checks email every 6 minutes. 
                The Pomodoro Technique creates "attention barriers" that train your brain to resist distractions.
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Brain className="h-5 w-5 text-purple-500" />
                Matches Brain Rhythms
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Research shows that the average person can maintain peak focus for 15-25 minutes before 
                attention begins to wane. The 25-minute work period aligns perfectly with these natural cycles.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* The Science */}
      <div>
        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
          <TrendingUp className="h-6 w-6 text-green-500" />
          The Science Behind 25-Minute Focus Sessions
        </h2>
        <div className="bg-blue-50 rounded-lg p-6 border border-blue-200">
          <h3 className="font-semibold text-blue-800 mb-3">Understanding Ultradian Rhythms</h3>
          <p className="text-blue-700 mb-4">
            Your brain operates on natural 90-120 minute cycles called ultradian rhythms. During these cycles, 
            your alertness and focus capacity fluctuate. The 25-minute Pomodoro work period aligns with the 
            peak focus portion of these cycles.
          </p>
          <div className="grid gap-3">
            <div className="flex items-start gap-2">
              <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
              <span className="text-blue-700">Peak focus lasts 15-25 minutes before attention wanes</span>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
              <span className="text-blue-700">Short breaks prevent mental fatigue and maintain performance</span>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
              <span className="text-blue-700">Regular breaks help consolidate learning and memory</span>
            </div>
          </div>
        </div>
      </div>

      {/* How to Use */}
      <div>
        <h2 className="text-2xl font-bold mb-4">How to Use the Pomodoro Technique: Step-by-Step</h2>
        <div className="space-y-4">
          <Card className="border-l-4 border-l-red-500">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-red-700">
                <span className="bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm">1</span>
                Choose Your Task
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Select a specific task you want to work on. Be specific - instead of "work on project," 
                choose "write introduction section" or "respond to client emails."
              </p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-orange-500">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-orange-700">
                <span className="bg-orange-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm">2</span>
                Set Timer for 25 Minutes
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Use a physical timer, phone app, or a dedicated Pomodoro timer like Pomonest. 
                The key is having a clear countdown that signals when your focus session ends.
              </p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-yellow-500">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-yellow-700">
                <span className="bg-yellow-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm">3</span>
                Work Until Timer Rings
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Focus solely on your chosen task. If other thoughts come up, write them down quickly 
                and return to your work. Don't check email, social media, or take calls.
              </p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-green-500">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-green-700">
                <span className="bg-green-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm">4</span>
                Take a 5-Minute Break
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Step away from your work completely. Stretch, walk around, get water, or do breathing exercises. 
                Avoid activities that require focus like checking messages or reading.
              </p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-blue-500">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-blue-700">
                <span className="bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm">5</span>
                Repeat and Take Longer Breaks
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                After completing four pomodoros, take a longer break of 15-30 minutes. 
                This allows your brain to fully recharge before starting the next cycle.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Common Mistakes */}
      <div>
        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
          <AlertCircle className="h-6 w-6 text-red-500" />
          Common Mistakes and How to Avoid Them
        </h2>
        <div className="grid gap-4 md:grid-cols-2">
          <Card className="border-red-200 bg-red-50">
            <CardHeader>
              <CardTitle className="text-red-800">Mistake: Skipping Breaks</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-red-700 mb-3">
                Many people think they'll be more productive by working through breaks.
              </p>
              <div className="bg-red-100 p-3 rounded">
                <p className="font-semibold text-red-800">Solution:</p>
                <p className="text-red-700">Breaks are not optional - they're essential for maintaining focus and preventing burnout.</p>
              </div>
            </CardContent>
          </Card>

          <Card className="border-red-200 bg-red-50">
            <CardHeader>
              <CardTitle className="text-red-800">Mistake: Multitasking</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-red-700 mb-3">
                Trying to work on multiple tasks during one pomodoro.
              </p>
              <div className="bg-red-100 p-3 rounded">
                <p className="font-semibold text-red-800">Solution:</p>
                <p className="text-red-700">One pomodoro = one task. If you finish early, review or improve your work.</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Advanced Variations */}
      <div>
        <h2 className="text-2xl font-bold mb-4">Advanced Pomodoro Variations</h2>
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>The 50/10 Method</CardTitle>
              <CardDescription>For deep work sessions</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Work for 50 minutes, then take a 10-minute break. Better for tasks requiring deep concentration 
                and less context switching.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>The 90-Minute Method</CardTitle>
              <CardDescription>Based on ultradian rhythms</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Work for 90 minutes, then take a 20-minute break. Aligns with natural energy cycles 
                but requires strong focus discipline.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>The Timeboxing Hybrid</CardTitle>
              <CardDescription>Combine with calendar blocking</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Use pomodoros within scheduled calendar blocks. Allocate specific time blocks for 
                different types of work, then use pomodoros within those blocks.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Tools and Apps */}
      <div>
        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
          <BookOpen className="h-6 w-6 text-purple-500" />
          Best Tools and Apps for Pomodoro
        </h2>
        <div className="grid gap-4 md:grid-cols-3">
          <Card className="border-primary/20 bg-primary/5">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Timer className="h-5 w-5 text-primary" />
                Pomonest
              </CardTitle>
              <Badge className="w-fit">Recommended</Badge>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                Free Pomodoro timer with streak tracking, analytics, and beautiful themes. 
                Perfect for building consistent focus habits.
              </p>
              <Link href="/">
                <Button className="w-full">Try Now</Button>
              </Link>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Physical Timer</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                A simple kitchen timer eliminates digital distractions and provides tactile feedback. 
                Great for pure focus sessions.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Forest App</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Gamified Pomodoro with virtual tree planting. Helps with motivation and 
                provides satisfying visual progress tracking.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Success Stories */}
      <div>
        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
          <Users className="h-6 w-6 text-green-500" />
          Success Stories and Results
        </h2>
        <div className="grid gap-4 md:grid-cols-2">
          <Card className="bg-green-50 border-green-200">
            <CardHeader>
              <CardTitle className="text-green-800">Sarah, Software Developer</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-green-700 mb-3">
                "I used to struggle with constant interruptions and context switching. After implementing 
                the Pomodoro Technique, my deep work sessions increased by 300%."
              </p>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span className="text-green-700 font-medium">40% increase in code quality</span>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-blue-50 border-blue-200">
            <CardHeader>
              <CardTitle className="text-blue-800">Marcus, Graduate Student</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-blue-700 mb-3">
                "The Pomodoro Technique helped me write my thesis without burning out. 
                Breaking work into 25-minute chunks made overwhelming tasks feel manageable."
              </p>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-blue-500" />
                <span className="text-blue-700 font-medium">Completed thesis 2 weeks early</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Conclusion */}
      <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg p-6 border border-purple-200">
        <h2 className="text-2xl font-bold mb-4 text-purple-800">Ready to Transform Your Productivity?</h2>
        <p className="text-purple-700 mb-6">
          The Pomodoro Technique is more than just a time management method - it's a pathway to developing 
          unshakeable focus and sustainable productivity habits. Start with just one 25-minute session today.
        </p>
        <div className="flex flex-col sm:flex-row gap-4">
          <Link href="/">
            <Button size="lg" className="bg-gradient-to-r from-streak-fire to-streak-ember">
              Start Your First Pomodoro
            </Button>
          </Link>
          <Link href="/blog/how-to-focus-better-proven-techniques">
            <Button variant="outline" size="lg">
              Read: How to Focus Better
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}