import { Metadata } from 'next'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Timer, Target, Brain, BookOpen, Users, CheckCircle, ArrowRight, Clock, Zap, TrendingUp, Star, Download, ExternalLink, PlayCircle } from 'lucide-react'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Productivity Resources - Pomodoro Technique Tools & Guides | Pomonest',
  description: 'Free productivity resources including Pomodoro Technique guides, focus strategies, time management templates, and productivity tools to boost your efficiency.',
  keywords: 'productivity resources, pomodoro technique, focus tools, time management, productivity templates, study guides, work efficiency',
}

const resources = [
  {
    category: "Guides & Tutorials",
    items: [
      {
        title: "Complete Pomodoro Technique Guide",
        description: "Master the world's most effective productivity method with step-by-step instructions and scientific backing.",
        type: "Guide",
        readTime: "12 min read",
        link: "/blog/complete-pomodoro-technique-guide-2025",
        featured: true
      },
      {
        title: "How to Focus Better: 10 Proven Techniques",
        description: "Science-backed strategies to improve concentration and maintain deep focus throughout your workday.",
        type: "Guide",
        readTime: "8 min read",
        link: "/blog/how-to-focus-better-proven-techniques",
        featured: true
      },
      {
        title: "Student Productivity Guide",
        description: "Specialized productivity techniques for students, including study schedules and assignment management.",
        type: "Guide",
        readTime: "10 min read",
        link: "/blog/productivity-tips-students",
        featured: false
      },
      {
        title: "Pomodoro for ADHD",
        description: "Adapting the Pomodoro Technique for ADHD brains with modifications and specialized strategies.",
        type: "Guide",
        readTime: "9 min read",
        link: "/blog/pomodoro-technique-adhd",
        featured: false
      }
    ]
  },
  {
    category: "Tools & Templates",
    items: [
      {
        title: "Pomodoro Timer",
        description: "Free online timer with customizable work and break intervals, streak tracking, and analytics.",
        type: "Tool",
        readTime: "Free",
        link: "/",
        featured: true
      },
      {
        title: "30-Day Focus Challenge",
        description: "Build unbreakable focus habits with our comprehensive 30-day program and daily exercises.",
        type: "Challenge",
        readTime: "30 days",
        link: "/blog/building-focus-habits",
        featured: false
      },
      {
        title: "Weekly Planning Template",
        description: "Structured template for planning your week with Pomodoro sessions and priority management.",
        type: "Template",
        readTime: "Download",
        link: "#",
        featured: false
      },
      {
        title: "Time Blocking Guide",
        description: "Learn to combine time blocking with Pomodoro Technique for maximum productivity.",
        type: "Guide",
        readTime: "6 min read",
        link: "#",
        featured: false
      }
    ]
  },
  {
    category: "For Teams",
    items: [
      {
        title: "Remote Team Productivity",
        description: "Strategies for maintaining team productivity and collaboration in remote work environments.",
        type: "Guide",
        readTime: "11 min read",
        link: "/blog/team-productivity-remote-work",
        featured: false
      },
      {
        title: "Team Pomodoro Sessions",
        description: "How to run synchronized Pomodoro sessions with your team for better collaboration.",
        type: "Guide",
        readTime: "7 min read",
        link: "#",
        featured: false
      },
      {
        title: "Productivity Meeting Framework",
        description: "Structure your team meetings using Pomodoro principles for more effective discussions.",
        type: "Template",
        readTime: "Download",
        link: "#",
        featured: false
      }
    ]
  },
  {
    category: "Science & Research",
    items: [
      {
        title: "The Science of Focus",
        description: "Research-backed insights into attention, concentration, and cognitive performance.",
        type: "Research",
        readTime: "15 min read",
        link: "#",
        featured: false
      },
      {
        title: "Productivity Psychology",
        description: "Understanding the psychological principles behind effective productivity techniques.",
        type: "Research",
        readTime: "12 min read",
        link: "#",
        featured: false
      },
      {
        title: "Time Perception Studies",
        description: "How different timing techniques affect our perception of time and productivity.",
        type: "Research",
        readTime: "10 min read",
        link: "#",
        featured: false
      }
    ]
  }
]

const quickStart = [
  {
    step: 1,
    title: "Start with the Basics",
    description: "Read our Complete Pomodoro Guide to understand the fundamentals",
    link: "/blog/complete-pomodoro-technique-guide-2025",
    icon: BookOpen
  },
  {
    step: 2,
    title: "Try the Timer",
    description: "Start your first 25-minute focused work session",
    link: "/",
    icon: Timer
  },
  {
    step: 3,
    title: "Learn Focus Techniques",
    description: "Enhance your concentration with proven strategies",
    link: "/blog/how-to-focus-better-proven-techniques",
    icon: Target
  },
  {
    step: 4,
    title: "Track Your Progress",
    description: "Monitor your productivity and build consistent habits",
    link: "/",
    icon: TrendingUp
  }
]

export default function ResourcesPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/50">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-streak-fire to-streak-ember bg-clip-text text-transparent">
              Productivity Resources
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-6">
              Everything you need to master the Pomodoro Technique, improve your focus, and boost your productivity. 
              Free guides, tools, templates, and research-backed strategies.
            </p>
            <div className="flex flex-wrap gap-2 justify-center">
              <Badge variant="secondary">Free Resources</Badge>
              <Badge variant="secondary">Expert Guides</Badge>
              <Badge variant="secondary">Science-Based</Badge>
              <Badge variant="secondary">Regularly Updated</Badge>
            </div>
          </div>

          {/* Quick Start Guide */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold mb-6 text-center">Quick Start Guide</h2>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              {quickStart.map((step) => {
                const IconComponent = step.icon
                return (
                  <Card key={step.step} className="text-center hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="mx-auto w-16 h-16 bg-gradient-to-br from-streak-fire to-streak-ember rounded-full flex items-center justify-center mb-4">
                        <IconComponent className="h-8 w-8 text-white" />
                      </div>
                      <CardTitle className="text-lg">Step {step.step}</CardTitle>
                      <CardDescription className="font-medium">{step.title}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground mb-4 text-sm">{step.description}</p>
                      <Link href={step.link}>
                        <Button size="sm" variant="outline" className="gap-2">
                          <ArrowRight className="h-4 w-4" />
                          Get Started
                        </Button>
                      </Link>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </div>

          {/* Resource Categories */}
          <div className="space-y-12">
            {resources.map((category, categoryIndex) => (
              <div key={categoryIndex}>
                <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                  {category.category === "Guides & Tutorials" && <BookOpen className="h-6 w-6 text-blue-500" />}
                  {category.category === "Tools & Templates" && <Zap className="h-6 w-6 text-yellow-500" />}
                  {category.category === "For Teams" && <Users className="h-6 w-6 text-green-500" />}
                  {category.category === "Science & Research" && <Brain className="h-6 w-6 text-purple-500" />}
                  {category.category}
                </h2>
                
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {category.items.map((item, itemIndex) => (
                    <Card 
                      key={itemIndex} 
                      className={`hover:shadow-lg transition-all duration-300 ${
                        item.featured ? 'border-2 border-dashed border-yellow-200 bg-gradient-to-br from-yellow-50 to-orange-50' : ''
                      }`}
                    >
                      <CardHeader>
                        <div className="flex items-center justify-between mb-2">
                          <Badge variant={item.featured ? "default" : "secondary"}>
                            {item.type}
                          </Badge>
                          {item.featured && (
                            <Badge className="bg-yellow-500 text-yellow-900">
                              Featured
                            </Badge>
                          )}
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Clock className="h-4 w-4" />
                            {item.readTime}
                          </div>
                        </div>
                        <CardTitle className="text-lg">{item.title}</CardTitle>
                        <CardDescription>{item.description}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <Link href={item.link}>
                          <Button 
                            variant={item.featured ? "default" : "outline"} 
                            size="sm" 
                            className="w-full gap-2"
                          >
                            {item.type === "Tool" && <PlayCircle className="h-4 w-4" />}
                            {item.type === "Template" && <Download className="h-4 w-4" />}
                            {item.type === "Guide" && <BookOpen className="h-4 w-4" />}
                            {item.type === "Challenge" && <Target className="h-4 w-4" />}
                            {item.type === "Research" && <Brain className="h-4 w-4" />}
                            {item.type === "Tool" ? "Use Tool" : 
                             item.type === "Template" ? "Download" : 
                             item.type === "Challenge" ? "Start Challenge" : "Read More"}
                          </Button>
                        </Link>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Popular Resources */}
          <div className="mt-12 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-8 border border-blue-200">
            <h2 className="text-2xl font-bold mb-6 text-center">Most Popular Resources</h2>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              <Card className="bg-white/80 backdrop-blur-sm">
                <CardHeader>
                  <div className="flex items-center gap-2 mb-2">
                    <Timer className="h-5 w-5 text-red-500" />
                    <Badge variant="secondary">Guide</Badge>
                  </div>
                  <CardTitle className="text-lg">Complete Pomodoro Guide</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4 text-sm">
                    Our most comprehensive guide to mastering the Pomodoro Technique
                  </p>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span>4.9/5 rating • 2,340 readers</span>
                  </div>
                  <Link href="/blog/complete-pomodoro-technique-guide-2025">
                    <Button size="sm" className="w-full">Read Guide</Button>
                  </Link>
                </CardContent>
              </Card>

              <Card className="bg-white/80 backdrop-blur-sm">
                <CardHeader>
                  <div className="flex items-center gap-2 mb-2">
                    <Target className="h-5 w-5 text-blue-500" />
                    <Badge variant="secondary">Guide</Badge>
                  </div>
                  <CardTitle className="text-lg">How to Focus Better</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4 text-sm">
                    10 proven techniques to improve your concentration and focus
                  </p>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span>4.8/5 rating • 1,890 readers</span>
                  </div>
                  <Link href="/blog/how-to-focus-better-proven-techniques">
                    <Button size="sm" className="w-full">Read Guide</Button>
                  </Link>
                </CardContent>
              </Card>

              <Card className="bg-white/80 backdrop-blur-sm">
                <CardHeader>
                  <div className="flex items-center gap-2 mb-2">
                    <PlayCircle className="h-5 w-5 text-green-500" />
                    <Badge variant="secondary">Tool</Badge>
                  </div>
                  <CardTitle className="text-lg">Pomodoro Timer</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4 text-sm">
                    Free online timer with streak tracking and analytics
                  </p>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span>4.9/5 rating • 15,000+ users</span>
                  </div>
                  <Link href="/">
                    <Button size="sm" className="w-full">Use Timer</Button>
                  </Link>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Call to Action */}
          <div className="mt-12 text-center">
            <h2 className="text-2xl font-bold mb-4">Ready to Boost Your Productivity?</h2>
            <p className="text-lg text-muted-foreground mb-6 max-w-2xl mx-auto">
              Start with our free Pomodoro timer and explore our comprehensive guides to build 
              better focus habits and achieve more in less time.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/">
                <Button size="lg" className="bg-gradient-to-r from-streak-fire to-streak-ember gap-2">
                  <Timer className="h-5 w-5" />
                  Start Timer Now
                </Button>
              </Link>
              <Link href="/blog">
                <Button variant="outline" size="lg" className="gap-2">
                  <BookOpen className="h-5 w-5" />
                  Browse All Articles
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}