import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Target, Brain, Zap, Shield, Eye, Headphones, Mountain, Clock, CheckCircle, AlertTriangle } from 'lucide-react'
import Link from 'next/link'

export function HowToFocusBetter() {
  return (
    <div className="space-y-8">
      {/* Introduction */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-6 border border-blue-200">
        <div className="flex items-center gap-3 mb-4">
          <Target className="h-8 w-8 text-blue-500" />
          <div>
            <h2 className="text-2xl font-bold text-blue-800">Why Focus Matters More Than Ever</h2>
            <p className="text-blue-600">The modern attention crisis and how to overcome it</p>
          </div>
        </div>
        <p className="text-gray-700 leading-relaxed">
          In our hyper-connected world, the ability to focus deeply has become a rare superpower. 
          Research shows that the average knowledge worker checks email every 6 minutes and switches 
          between apps over 1,100 times per day. This constant task-switching can reduce productivity by up to 40%.
        </p>
        <div className="mt-4 p-4 bg-blue-100 rounded-lg">
          <p className="font-semibold text-blue-800">The good news:</p>
          <p className="text-blue-700">Focus is a skill that can be trained and improved with the right techniques. 
          This guide will teach you 10 proven methods to enhance your concentration and achieve deep work.</p>
        </div>
      </div>

      {/* The Science of Focus */}
      <div>
        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
          <Brain className="h-6 w-6 text-purple-500" />
          The Science of Focus and Attention
        </h2>
        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5 text-yellow-500" />
                Your Brain on Focus
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                When you focus, your brain activates the prefrontal cortex - the region responsible for 
                executive function, decision-making, and goal-directed behavior.
              </p>
              <div className="space-y-2">
                <div className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500 mt-1" />
                  <span className="text-sm">Increased gamma wave activity</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500 mt-1" />
                  <span className="text-sm">Enhanced working memory</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500 mt-1" />
                  <span className="text-sm">Improved cognitive control</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-orange-500" />
                The Cost of Distraction
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                Every time you switch tasks, your brain needs time to refocus. This "attention residue" 
                can persist for up to 25 minutes after an interruption.
              </p>
              <div className="space-y-2">
                <div className="flex items-start gap-2">
                  <AlertTriangle className="h-4 w-4 text-orange-500 mt-1" />
                  <span className="text-sm">Up to 40% productivity loss</span>
                </div>
                <div className="flex items-start gap-2">
                  <AlertTriangle className="h-4 w-4 text-orange-500 mt-1" />
                  <span className="text-sm">Increased stress and fatigue</span>
                </div>
                <div className="flex items-start gap-2">
                  <AlertTriangle className="h-4 w-4 text-orange-500 mt-1" />
                  <span className="text-sm">Reduced quality of work</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* 10 Proven Techniques */}
      <div>
        <h2 className="text-2xl font-bold mb-6">10 Proven Techniques to Focus Better</h2>
        
        {/* Technique 1 */}
        <Card className="mb-6 border-l-4 border-l-red-500">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-red-700">
              <span className="bg-red-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold">1</span>
              The Pomodoro Technique
            </CardTitle>
            <CardDescription>Work in focused 25-minute intervals</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              The most popular focus technique for good reason. By breaking work into manageable chunks, 
              you can maintain high concentration while preventing mental fatigue.
            </p>
            <div className="bg-red-50 p-4 rounded-lg">
              <p className="font-semibold text-red-800 mb-2">How to implement:</p>
              <ol className="text-red-700 space-y-1">
                <li>1. Choose a single task</li>
                <li>2. Set timer for 25 minutes</li>
                <li>3. Work without interruption</li>
                <li>4. Take a 5-minute break</li>
                <li>5. Repeat 4 times, then take a longer break</li>
              </ol>
            </div>
          </CardContent>
        </Card>

        {/* Technique 2 */}
        <Card className="mb-6 border-l-4 border-l-blue-500">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-blue-700">
              <span className="bg-blue-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold">2</span>
              Deep Work Blocks
            </CardTitle>
            <CardDescription>Schedule uninterrupted time for cognitively demanding tasks</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              Cal Newport's concept of "deep work" - the ability to focus without distraction on 
              cognitively demanding tasks. This is where your most valuable work happens.
            </p>
            <div className="bg-blue-50 p-4 rounded-lg">
              <p className="font-semibold text-blue-800 mb-2">Best practices:</p>
              <ul className="text-blue-700 space-y-1">
                <li>• Block 2-4 hours of uninterrupted time</li>
                <li>• Turn off all notifications</li>
                <li>• Choose your most challenging task</li>
                <li>• Create a ritual to enter deep work mode</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Technique 3 */}
        <Card className="mb-6 border-l-4 border-l-green-500">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-green-700">
              <span className="bg-green-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold">3</span>
              Environment Design
            </CardTitle>
            <CardDescription>Optimize your physical and digital workspace</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              Your environment significantly impacts your ability to focus. Small changes can yield 
              dramatic improvements in concentration.
            </p>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="bg-green-50 p-4 rounded-lg">
                <p className="font-semibold text-green-800 mb-2">Physical Space:</p>
                <ul className="text-green-700 text-sm space-y-1">
                  <li>• Remove visual distractions</li>
                  <li>• Use noise-canceling headphones</li>
                  <li>• Keep water and snacks nearby</li>
                  <li>• Ensure good lighting</li>
                </ul>
              </div>
              <div className="bg-green-50 p-4 rounded-lg">
                <p className="font-semibold text-green-800 mb-2">Digital Space:</p>
                <ul className="text-green-700 text-sm space-y-1">
                  <li>• Use website blockers</li>
                  <li>• Close unnecessary tabs</li>
                  <li>• Turn off notifications</li>
                  <li>• Use full-screen mode</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Technique 4 */}
        <Card className="mb-6 border-l-4 border-l-purple-500">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-purple-700">
              <span className="bg-purple-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold">4</span>
              Mindfulness Meditation
            </CardTitle>
            <CardDescription>Train your attention muscle</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              Regular meditation practice literally rewires your brain to improve focus. Studies show 
              that just 8 weeks of mindfulness training can increase attention span and reduce mind-wandering.
            </p>
            <div className="bg-purple-50 p-4 rounded-lg">
              <p className="font-semibold text-purple-800 mb-2">Simple 5-minute practice:</p>
              <ol className="text-purple-700 space-y-1">
                <li>1. Sit comfortably and close your eyes</li>
                <li>2. Focus on your breath</li>
                <li>3. When your mind wanders, gently return to breath</li>
                <li>4. Continue for 5 minutes</li>
              </ol>
            </div>
          </CardContent>
        </Card>

        {/* Technique 5 */}
        <Card className="mb-6 border-l-4 border-l-orange-500">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-orange-700">
              <span className="bg-orange-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold">5</span>
              The Two-Minute Rule
            </CardTitle>
            <CardDescription>Clear small tasks to reduce mental clutter</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              If a task takes less than two minutes, do it immediately. This prevents small tasks 
              from accumulating and cluttering your mental space.
            </p>
            <div className="bg-orange-50 p-4 rounded-lg">
              <p className="font-semibold text-orange-800 mb-2">Examples of 2-minute tasks:</p>
              <ul className="text-orange-700 space-y-1">
                <li>• Reply to quick emails</li>
                <li>• File documents</li>
                <li>• Make brief phone calls</li>
                <li>• Clear your desk</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Technique 6 */}
        <Card className="mb-6 border-l-4 border-l-pink-500">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-pink-700">
              <span className="bg-pink-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold">6</span>
              Energy Management
            </CardTitle>
            <CardDescription>Align tasks with your natural energy rhythms</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              Your ability to focus fluctuates throughout the day. Identify your peak energy hours 
              and schedule your most important work during these times.
            </p>
            <div className="bg-pink-50 p-4 rounded-lg">
              <p className="font-semibold text-pink-800 mb-2">Track your energy:</p>
              <ul className="text-pink-700 space-y-1">
                <li>• Note energy levels every 2 hours for a week</li>
                <li>• Schedule deep work during peak hours</li>
                <li>• Use low-energy times for administrative tasks</li>
                <li>• Take breaks before energy crashes</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Technique 7 */}
        <Card className="mb-6 border-l-4 border-l-teal-500">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-teal-700">
              <span className="bg-teal-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold">7</span>
              Single-Tasking
            </CardTitle>
            <CardDescription>Focus on one thing at a time</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              Multitasking is a myth. What we call multitasking is actually task-switching, 
              which reduces productivity and increases errors. Focus on one task at a time.
            </p>
            <div className="bg-teal-50 p-4 rounded-lg">
              <p className="font-semibold text-teal-800 mb-2">How to single-task:</p>
              <ul className="text-teal-700 space-y-1">
                <li>• Write down the one thing you're working on</li>
                <li>• Close all unrelated applications</li>
                <li>• If other tasks come to mind, write them down for later</li>
                <li>• Don't start new tasks until current one is complete</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Technique 8 */}
        <Card className="mb-6 border-l-4 border-l-indigo-500">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-indigo-700">
              <span className="bg-indigo-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold">8</span>
              Progressive Muscle Relaxation
            </CardTitle>
            <CardDescription>Reduce physical tension to improve mental focus</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              Physical tension creates mental tension. By systematically relaxing your muscles, 
              you can achieve a more focused state of mind.
            </p>
            <div className="bg-indigo-50 p-4 rounded-lg">
              <p className="font-semibold text-indigo-800 mb-2">Quick 3-minute technique:</p>
              <ol className="text-indigo-700 space-y-1">
                <li>1. Tense your fists for 5 seconds, then relax</li>
                <li>2. Tense your shoulders for 5 seconds, then relax</li>
                <li>3. Tense your face muscles for 5 seconds, then relax</li>
                <li>4. Continue with other muscle groups</li>
              </ol>
            </div>
          </CardContent>
        </Card>

        {/* Technique 9 */}
        <Card className="mb-6 border-l-4 border-l-yellow-500">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-yellow-700">
              <span className="bg-yellow-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold">9</span>
              The 20-20-20 Rule
            </CardTitle>
            <CardDescription>Prevent eye strain and maintain focus</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              Every 20 minutes, look at something 20 feet away for 20 seconds. This prevents 
              eye strain and gives your brain a micro-break to maintain focus.
            </p>
            <div className="bg-yellow-50 p-4 rounded-lg">
              <p className="font-semibold text-yellow-800 mb-2">Additional eye care tips:</p>
              <ul className="text-yellow-700 space-y-1">
                <li>• Blink frequently to keep eyes moist</li>
                <li>• Adjust screen brightness to match surroundings</li>
                <li>• Use blue light filters in the evening</li>
                <li>• Keep screen at arm's length</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Technique 10 */}
        <Card className="mb-6 border-l-4 border-l-gray-500">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-gray-700">
              <span className="bg-gray-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold">10</span>
              Implementation Intentions
            </CardTitle>
            <CardDescription>Create if-then plans for better focus</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              Plan in advance how you'll handle distractions. Research shows that people who 
              create "if-then" plans are 2-3x more likely to achieve their goals.
            </p>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="font-semibold text-gray-800 mb-2">Example if-then plans:</p>
              <ul className="text-gray-700 space-y-1">
                <li>• If I feel the urge to check social media, then I'll write down the impulse and continue working</li>
                <li>• If my phone buzzes, then I'll put it in another room</li>
                <li>• If I feel distracted, then I'll take 3 deep breaths and refocus</li>
                <li>• If I'm struggling with a task, then I'll break it into smaller steps</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Creating Your Focus System */}
      <div>
        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
          <Shield className="h-6 w-6 text-blue-500" />
          Creating Your Personal Focus System
        </h2>
        <div className="bg-blue-50 rounded-lg p-6 border border-blue-200">
          <p className="text-blue-700 mb-4">
            Don't try to implement all 10 techniques at once. Start with 2-3 that resonate with you 
            and gradually build your focus system over time.
          </p>
          <div className="grid gap-4 md:grid-cols-3">
            <Card className="border-blue-200">
              <CardHeader>
                <CardTitle className="text-blue-800">Week 1-2</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-blue-700 text-sm">
                  Start with the Pomodoro Technique and environment design. These provide 
                  immediate improvements with minimal effort.
                </p>
              </CardContent>
            </Card>
            <Card className="border-blue-200">
              <CardHeader>
                <CardTitle className="text-blue-800">Week 3-4</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-blue-700 text-sm">
                  Add mindfulness meditation and single-tasking. These build the foundation 
                  for long-term focus improvement.
                </p>
              </CardContent>
            </Card>
            <Card className="border-blue-200">
              <CardHeader>
                <CardTitle className="text-blue-800">Week 5+</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-blue-700 text-sm">
                  Incorporate energy management and implementation intentions. 
                  Fine-tune your system based on what works best for you.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Conclusion */}
      <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-lg p-6 border border-green-200">
        <h2 className="text-2xl font-bold mb-4 text-green-800">Start Your Focus Journey Today</h2>
        <p className="text-green-700 mb-6">
          Remember, focus is not about perfection - it's about progress. Every time you notice your 
          mind wandering and bring it back to the task at hand, you're strengthening your focus muscle. 
          Start with one technique today and build from there.
        </p>
        <div className="flex flex-col sm:flex-row gap-4">
          <Link href="/">
            <Button size="lg" className="bg-gradient-to-r from-streak-fire to-streak-ember">
              Try Pomodoro Technique Now
            </Button>
          </Link>
          <Link href="/blog/complete-pomodoro-technique-guide-2025">
            <Button variant="outline" size="lg">
              Read: Complete Pomodoro Guide
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}