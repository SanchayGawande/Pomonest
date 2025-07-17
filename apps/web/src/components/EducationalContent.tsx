import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Timer, Target, Brain, BookOpen, Users, CheckCircle, ArrowRight, Clock, Zap, TrendingUp, Star } from 'lucide-react'
import Link from 'next/link'

export function EducationalContent() {
  return (
    <div className="space-y-12 max-w-6xl mx-auto px-4 py-8">
      {/* What is Pomodoro Technique */}
      <section className="text-center">
        <div className="mb-8">
          <h2 className="text-3xl font-bold mb-4">What is the Pomodoro Technique?</h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            The Pomodoro Technique is a time management method that uses a timer to break work into intervals, 
            traditionally 25 minutes in length, separated by short breaks. This simple yet powerful technique 
            helps you maintain focus, reduce mental fatigue, and boost productivity.
          </p>
        </div>
        
        <div className="grid gap-6 md:grid-cols-3">
          <Card className="border-2 border-red-200 bg-red-50">
            <CardHeader className="text-center">
              <div className="mx-auto w-16 h-16 bg-red-500 rounded-full flex items-center justify-center mb-4">
                <Clock className="h-8 w-8 text-white" />
              </div>
              <CardTitle className="text-red-800">25 Minutes</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-red-700 text-center">
                Work with complete focus on a single task for 25 minutes without any distractions or interruptions.
              </p>
            </CardContent>
          </Card>
          
          <Card className="border-2 border-green-200 bg-green-50">
            <CardHeader className="text-center">
              <div className="mx-auto w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mb-4">
                <Target className="h-8 w-8 text-white" />
              </div>
              <CardTitle className="text-green-800">5 Minutes</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-green-700 text-center">
                Take a short break to rest your mind, stretch, or do something completely different from work.
              </p>
            </CardContent>
          </Card>
          
          <Card className="border-2 border-blue-200 bg-blue-50">
            <CardHeader className="text-center">
              <div className="mx-auto w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mb-4">
                <Zap className="h-8 w-8 text-white" />
              </div>
              <CardTitle className="text-blue-800">Repeat</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-blue-700 text-center">
                After 4 cycles, take a longer 15-30 minute break to fully recharge before starting again.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Why It Works */}
      <section>
        <h2 className="text-3xl font-bold text-center mb-8">Why the Pomodoro Technique Works</h2>
        <div className="grid gap-8 md:grid-cols-2">
          <div className="space-y-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center flex-shrink-0">
                <Brain className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Matches Your Brain's Natural Rhythm</h3>
                <p className="text-muted-foreground">
                  Research shows that the human brain can maintain peak concentration for about 15-25 minutes 
                  before attention begins to wane. The Pomodoro Technique aligns perfectly with these natural cycles.
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center flex-shrink-0">
                <Target className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Prevents Burnout</h3>
                <p className="text-muted-foreground">
                  Regular breaks prevent mental fatigue and maintain high performance throughout the day. 
                  You'll feel more energized and less stressed.
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                <CheckCircle className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Reduces Procrastination</h3>
                <p className="text-muted-foreground">
                  Breaking work into manageable 25-minute chunks makes overwhelming tasks feel achievable. 
                  It's easier to commit to 25 minutes than to "work all day."
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-gradient-to-br from-blue-50 to-purple-50 p-8 rounded-lg border border-blue-200">
            <h3 className="text-2xl font-bold mb-4 text-blue-800">Scientific Evidence</h3>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <CheckCircle className="h-5 w-5 text-green-500" />
                <span className="text-blue-700">40% increase in productivity reported by users</span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle className="h-5 w-5 text-green-500" />
                <span className="text-blue-700">Reduced stress and improved work-life balance</span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle className="h-5 w-5 text-green-500" />
                <span className="text-blue-700">Better time estimation and planning skills</span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle className="h-5 w-5 text-green-500" />
                <span className="text-blue-700">Improved focus and concentration abilities</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How to Get Started */}
      <section>
        <h2 className="text-3xl font-bold text-center mb-8">How to Get Started with Pomodoro</h2>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <Card className="text-center">
            <CardHeader>
              <div className="mx-auto w-12 h-12 bg-red-500 rounded-full flex items-center justify-center mb-4">
                <span className="text-white font-bold">1</span>
              </div>
              <CardTitle>Choose Your Task</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Pick a specific task you want to work on. Be clear about what you want to accomplish.
              </p>
            </CardContent>
          </Card>
          
          <Card className="text-center">
            <CardHeader>
              <div className="mx-auto w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center mb-4">
                <span className="text-white font-bold">2</span>
              </div>
              <CardTitle>Set Timer</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Set the Pomonest timer for 25 minutes and eliminate all distractions around you.
              </p>
            </CardContent>
          </Card>
          
          <Card className="text-center">
            <CardHeader>
              <div className="mx-auto w-12 h-12 bg-green-500 rounded-full flex items-center justify-center mb-4">
                <span className="text-white font-bold">3</span>
              </div>
              <CardTitle>Work Focused</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Work on your task with complete focus until the timer rings. Don't check emails or social media.
              </p>
            </CardContent>
          </Card>
          
          <Card className="text-center">
            <CardHeader>
              <div className="mx-auto w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center mb-4">
                <span className="text-white font-bold">4</span>
              </div>
              <CardTitle>Take Break</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Take a 5-minute break. Stretch, walk, or do something relaxing before the next session.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Success Stories */}
      <section>
        <h2 className="text-3xl font-bold text-center mb-8">Success Stories</h2>
        <div className="grid gap-6 md:grid-cols-3">
          <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
            <CardHeader>
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                  <Users className="h-5 w-5 text-white" />
                </div>
                <div>
                  <CardTitle className="text-green-800">Sarah, Developer</CardTitle>
                  <CardDescription className="text-green-600">Software Engineer</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-green-700 italic mb-3">
                "Pomonest helped me overcome constant distractions. I increased my coding productivity by 60% 
                and feel less stressed at the end of each day."
              </p>
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-blue-50 to-cyan-50 border-blue-200">
            <CardHeader>
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                  <BookOpen className="h-5 w-5 text-white" />
                </div>
                <div>
                  <CardTitle className="text-blue-800">Marcus, Student</CardTitle>
                  <CardDescription className="text-blue-600">Graduate Student</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-blue-700 italic mb-3">
                "Writing my thesis felt impossible until I discovered the Pomodoro Technique. 
                I finished 2 weeks ahead of schedule with less stress."
              </p>
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-purple-50 to-pink-50 border-purple-200">
            <CardHeader>
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 bg-purple-500 rounded-full flex items-center justify-center">
                  <Target className="h-5 w-5 text-white" />
                </div>
                <div>
                  <CardTitle className="text-purple-800">Elena, Designer</CardTitle>
                  <CardDescription className="text-purple-600">Freelance Designer</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-purple-700 italic mb-3">
                "The streak tracking feature keeps me motivated. I've maintained a 45-day focus streak 
                and my client work quality has improved dramatically."
              </p>
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Key Benefits */}
      <section className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg p-8">
        <h2 className="text-3xl font-bold text-center mb-8">Key Benefits of Using Pomonest</h2>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <div className="text-center">
            <div className="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <TrendingUp className="h-8 w-8 text-white" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Increased Productivity</h3>
            <p className="text-muted-foreground">
              Users report 40-60% increase in productive output when using the Pomodoro Technique consistently.
            </p>
          </div>
          
          <div className="text-center">
            <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <Brain className="h-8 w-8 text-white" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Better Focus</h3>
            <p className="text-muted-foreground">
              Train your brain to maintain concentration for longer periods while reducing mental fatigue.
            </p>
          </div>
          
          <div className="text-center">
            <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <Timer className="h-8 w-8 text-white" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Time Awareness</h3>
            <p className="text-muted-foreground">
              Develop better time estimation skills and become more conscious of how you spend your time.
            </p>
          </div>
          
          <div className="text-center">
            <div className="w-16 h-16 bg-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <Target className="h-8 w-8 text-white" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Reduced Stress</h3>
            <p className="text-muted-foreground">
              Regular breaks and structured work sessions help prevent burnout and reduce work-related stress.
            </p>
          </div>
          
          <div className="text-center">
            <div className="w-16 h-16 bg-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="h-8 w-8 text-white" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Better Work-Life Balance</h3>
            <p className="text-muted-foreground">
              Clear boundaries between work and rest help you enjoy your free time without guilt.
            </p>
          </div>
          
          <div className="text-center">
            <div className="w-16 h-16 bg-yellow-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <Zap className="h-8 w-8 text-white" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Sustained Energy</h3>
            <p className="text-muted-foreground">
              Maintain consistent energy levels throughout the day with strategic breaks and focused work periods.
            </p>
          </div>
        </div>
      </section>

      {/* Learn More */}
      <section className="text-center bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-8">
        <h2 className="text-3xl font-bold mb-4">Ready to Learn More?</h2>
        <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
          Dive deeper into productivity techniques, focus strategies, and time management tips 
          with our comprehensive guides and articles.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/blog/complete-pomodoro-technique-guide-2025">
            <Button size="lg" variant="outline" className="gap-2">
              <BookOpen className="h-5 w-5" />
              Complete Pomodoro Guide
            </Button>
          </Link>
          <Link href="/blog/how-to-focus-better-proven-techniques">
            <Button size="lg" variant="outline" className="gap-2">
              <Target className="h-5 w-5" />
              How to Focus Better
            </Button>
          </Link>
          <Link href="/blog">
            <Button size="lg" className="gap-2">
              <ArrowRight className="h-5 w-5" />
              View All Articles
            </Button>
          </Link>
        </div>
      </section>
    </div>
  )
}