import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { BookOpen, Clock, Target, Brain, Coffee, Calendar, CheckCircle, GraduationCap } from 'lucide-react'
import Link from 'next/link'

export function ProductivityTipsStudents() {
  return (
    <div className="space-y-8">
      {/* Introduction */}
      <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-lg p-6 border border-green-200">
        <div className="flex items-center gap-3 mb-4">
          <GraduationCap className="h-8 w-8 text-green-500" />
          <div>
            <h2 className="text-2xl font-bold text-green-800">Student Productivity Challenges</h2>
            <p className="text-green-600">Why traditional productivity advice doesn't work for students</p>
          </div>
        </div>
        <p className="text-gray-700 leading-relaxed">
          As a student, you face unique productivity challenges that don't exist in the corporate world. 
          Irregular schedules, multiple subjects, varying deadlines, and the pressure to balance academics 
          with social life require a different approach to time management and focus.
        </p>
      </div>

      {/* The Student's Dilemma */}
      <div>
        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
          <Brain className="h-6 w-6 text-purple-500" />
          The Unique Student Productivity Challenges
        </h2>
        <div className="grid gap-4 md:grid-cols-2">
          <Card className="border-red-200 bg-red-50">
            <CardHeader>
              <CardTitle className="text-red-800">Common Problems</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                <li className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-red-500 rounded-full mt-2"></div>
                  <span className="text-red-700">Procrastination on large assignments</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-red-500 rounded-full mt-2"></div>
                  <span className="text-red-700">Difficulty concentrating during study sessions</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-red-500 rounded-full mt-2"></div>
                  <span className="text-red-700">Overwhelming workload from multiple subjects</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-red-500 rounded-full mt-2"></div>
                  <span className="text-red-700">Irregular schedule without fixed routine</span>
                </li>
              </ul>
            </CardContent>
          </Card>
          
          <Card className="border-green-200 bg-green-50">
            <CardHeader>
              <CardTitle className="text-green-800">Solutions We'll Cover</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500 mt-1" />
                  <span className="text-green-700">Time-blocking for irregular schedules</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500 mt-1" />
                  <span className="text-green-700">Pomodoro Technique for study sessions</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500 mt-1" />
                  <span className="text-green-700">Project breakdown strategies</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500 mt-1" />
                  <span className="text-green-700">Energy management for peak performance</span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* The Pomodoro Technique for Students */}
      <Card className="border-l-4 border-l-red-500">
        <CardHeader>
          <CardTitle className="text-red-700 flex items-center gap-2">
            <Clock className="h-6 w-6" />
            The Pomodoro Technique: A Student's Best Friend
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground mb-4">
            The Pomodoro Technique is particularly effective for students because it breaks down 
            overwhelming study sessions into manageable chunks and provides regular breaks to maintain focus.
          </p>
          
          <div className="bg-red-50 p-4 rounded-lg mb-4">
            <h4 className="font-semibold text-red-800 mb-2">Student-Specific Pomodoro Tips:</h4>
            <ul className="text-red-700 space-y-1">
              <li>• Use 25-minute sessions for active study (reading, problem-solving)</li>
              <li>• Use 45-minute sessions for deep work (writing, research)</li>
              <li>• Take breaks away from your study space</li>
              <li>• Track completed pomodoros to stay motivated</li>
            </ul>
          </div>
          
          <div className="grid gap-4 md:grid-cols-2">
            <div className="bg-yellow-50 p-4 rounded-lg">
              <h4 className="font-semibold text-yellow-800 mb-2">Best for:</h4>
              <ul className="text-yellow-700 text-sm space-y-1">
                <li>• Reading textbooks</li>
                <li>• Reviewing notes</li>
                <li>• Problem sets</li>
                <li>• Flashcard review</li>
              </ul>
            </div>
            <div className="bg-blue-50 p-4 rounded-lg">
              <h4 className="font-semibold text-blue-800 mb-2">Avoid for:</h4>
              <ul className="text-blue-700 text-sm space-y-1">
                <li>• Creative writing</li>
                <li>• Complex calculations</li>
                <li>• Group study sessions</li>
                <li>• Exam taking</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Study Schedule Template */}
      <div>
        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
          <Calendar className="h-6 w-6 text-blue-500" />
          Creating Your Ideal Study Schedule
        </h2>
        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Morning Schedule (8 AM - 12 PM)</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <Badge className="bg-green-100 text-green-800">8:00-9:30</Badge>
                  <span className="text-sm">Most challenging subject (3 pomodoros)</span>
                </div>
                <div className="flex items-center gap-3">
                  <Badge className="bg-blue-100 text-blue-800">9:30-9:45</Badge>
                  <span className="text-sm">Long break + breakfast</span>
                </div>
                <div className="flex items-center gap-3">
                  <Badge className="bg-green-100 text-green-800">9:45-11:15</Badge>
                  <span className="text-sm">Second subject (3 pomodoros)</span>
                </div>
                <div className="flex items-center gap-3">
                  <Badge className="bg-blue-100 text-blue-800">11:15-12:00</Badge>
                  <span className="text-sm">Review and planning</span>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Afternoon Schedule (2 PM - 6 PM)</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <Badge className="bg-yellow-100 text-yellow-800">2:00-3:30</Badge>
                  <span className="text-sm">Easier tasks (admin, organizing)</span>
                </div>
                <div className="flex items-center gap-3">
                  <Badge className="bg-blue-100 text-blue-800">3:30-3:45</Badge>
                  <span className="text-sm">Break + snack</span>
                </div>
                <div className="flex items-center gap-3">
                  <Badge className="bg-green-100 text-green-800">3:45-5:15</Badge>
                  <span className="text-sm">Reading/research (3 pomodoros)</span>
                </div>
                <div className="flex items-center gap-3">
                  <Badge className="bg-purple-100 text-purple-800">5:15-6:00</Badge>
                  <span className="text-sm">Review day's work</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Assignment Breakdown Strategy */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-6 w-6 text-orange-500" />
            Breaking Down Large Assignments
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground mb-4">
            Large assignments can feel overwhelming, but they become manageable when broken into smaller, 
            specific tasks. Here's a systematic approach:
          </p>
          
          <div className="space-y-4">
            <div className="bg-orange-50 p-4 rounded-lg">
              <h4 className="font-semibold text-orange-800 mb-2">Example: 10-page Research Paper</h4>
              <ol className="text-orange-700 space-y-1 list-decimal list-inside">
                <li>Choose topic and create research question (1 pomodoro)</li>
                <li>Find 5 primary sources (2 pomodoros)</li>
                <li>Create detailed outline (2 pomodoros)</li>
                <li>Write introduction (2 pomodoros)</li>
                <li>Write body paragraphs (6 pomodoros)</li>
                <li>Write conclusion (1 pomodoro)</li>
                <li>Edit and revise (3 pomodoros)</li>
                <li>Format and proofread (1 pomodoro)</li>
              </ol>
            </div>
            
            <div className="bg-blue-50 p-4 rounded-lg">
              <h4 className="font-semibold text-blue-800 mb-2">Key Principles:</h4>
              <ul className="text-blue-700 space-y-1">
                <li>• Each task should take 1-3 pomodoros</li>
                <li>• Start with the hardest part when energy is highest</li>
                <li>• Build in buffer time for unexpected challenges</li>
                <li>• Schedule tasks across multiple days to avoid cramming</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Energy Management for Students */}
      <div>
        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
          <Coffee className="h-6 w-6 text-brown-500" />
          Energy Management: When to Study What
        </h2>
        <div className="grid gap-4 md:grid-cols-3">
          <Card className="border-yellow-200 bg-yellow-50">
            <CardHeader>
              <CardTitle className="text-yellow-800">High Energy (Morning)</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-yellow-700 mb-3">Best for:</p>
              <ul className="text-yellow-600 text-sm space-y-1">
                <li>• Complex problem-solving</li>
                <li>• New concept learning</li>
                <li>• Writing and analysis</li>
                <li>• Challenging assignments</li>
              </ul>
            </CardContent>
          </Card>
          
          <Card className="border-blue-200 bg-blue-50">
            <CardHeader>
              <CardTitle className="text-blue-800">Medium Energy (Afternoon)</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-blue-700 mb-3">Best for:</p>
              <ul className="text-blue-600 text-sm space-y-1">
                <li>• Reading and research</li>
                <li>• Group study sessions</li>
                <li>• Review and practice</li>
                <li>• Organizing notes</li>
              </ul>
            </CardContent>
          </Card>
          
          <Card className="border-purple-200 bg-purple-50">
            <CardHeader>
              <CardTitle className="text-purple-800">Low Energy (Evening)</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-purple-700 mb-3">Best for:</p>
              <ul className="text-purple-600 text-sm space-y-1">
                <li>• Flashcard review</li>
                <li>• Light reading</li>
                <li>• Planning tomorrow</li>
                <li>• Administrative tasks</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Conclusion */}
      <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-lg p-6 border border-green-200">
        <h2 className="text-2xl font-bold mb-4 text-green-800">Start Your Productive Student Journey</h2>
        <p className="text-green-700 mb-6">
          Remember, the key to student productivity isn't working harder - it's working smarter. 
          Start with the Pomodoro Technique for your study sessions, then gradually build your 
          personalized productivity system.
        </p>
        <div className="flex flex-col sm:flex-row gap-4">
          <Link href="/">
            <Button size="lg" className="bg-gradient-to-r from-streak-fire to-streak-ember">
              Start Your First Study Session
            </Button>
          </Link>
          <Link href="/blog/complete-pomodoro-technique-guide-2025">
            <Button variant="outline" size="lg">
              Learn More About Pomodoro
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}