import { Metadata } from 'next'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Clock, User, ArrowRight, Timer, Target, Brain, BookOpen, Zap, Users } from 'lucide-react'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Productivity Blog - Pomodoro Technique & Focus Tips | Pomonest',
  description: 'Learn productivity techniques, focus strategies, and time management tips. Master the Pomodoro Technique with expert guides and science-backed methods.',
  keywords: 'productivity blog, pomodoro technique, focus tips, time management, productivity techniques, study methods, work efficiency',
}

const blogPosts = [
  {
    slug: 'complete-pomodoro-technique-guide-2025',
    title: 'The Complete Pomodoro Technique Guide (2025 Edition)',
    excerpt: 'Master the world\'s most effective productivity method with this comprehensive guide. Includes scientific research, step-by-step instructions, and advanced variations.',
    readTime: '12 min read',
    category: 'Technique',
    tags: ['Pomodoro', 'Productivity', 'Focus', 'Time Management'],
    publishDate: 'January 15, 2025',
    featured: true,
    author: 'Pomonest Team',
    icon: Timer
  },
  {
    slug: 'how-to-focus-better-proven-techniques',
    title: 'How to Focus Better: 10 Proven Techniques That Actually Work',
    excerpt: 'Discover science-backed strategies to improve your focus and concentration. From deep work principles to attention training exercises.',
    readTime: '8 min read',
    category: 'Focus',
    tags: ['Focus', 'Concentration', 'Deep Work', 'Attention'],
    publishDate: 'January 12, 2025',
    featured: true,
    author: 'Pomonest Team',
    icon: Target
  },
  {
    slug: 'productivity-tips-students',
    title: 'The Ultimate Productivity Guide for Students',
    excerpt: 'Transform your study sessions with proven techniques. Learn how to manage time, reduce stress, and boost academic performance.',
    readTime: '10 min read',
    category: 'Students',
    tags: ['Students', 'Study Tips', 'Academic Success', 'Time Management'],
    publishDate: 'January 10, 2025',
    featured: false,
    author: 'Pomonest Team',
    icon: BookOpen
  },
  {
    slug: 'building-focus-habits',
    title: 'Building Unbreakable Focus Habits: A 30-Day Challenge',
    excerpt: 'Create lasting focus habits with this comprehensive 30-day program. Includes daily exercises, progress tracking, and habit stacking techniques.',
    readTime: '15 min read',
    category: 'Habits',
    tags: ['Habits', 'Focus', 'Productivity', 'Self-Improvement'],
    publishDate: 'January 8, 2025',
    featured: false,
    author: 'Pomonest Team',
    icon: Zap
  },
  {
    slug: 'pomodoro-technique-adhd',
    title: 'Pomodoro Technique for ADHD: A Complete Guide',
    excerpt: 'Learn how to adapt the Pomodoro Technique for ADHD brains. Includes modifications, tips, and strategies for better focus and productivity.',
    readTime: '9 min read',
    category: 'ADHD',
    tags: ['ADHD', 'Pomodoro', 'Focus', 'Productivity'],
    publishDate: 'January 5, 2025',
    featured: false,
    author: 'Pomonest Team',
    icon: Brain
  },
  {
    slug: 'team-productivity-remote-work',
    title: 'Team Productivity in the Remote Work Era',
    excerpt: 'Boost team productivity with proven remote work strategies. Learn about collaboration tools, communication techniques, and maintaining focus.',
    readTime: '11 min read',
    category: 'Remote Work',
    tags: ['Remote Work', 'Team Productivity', 'Collaboration', 'Management'],
    publishDate: 'January 3, 2025',
    featured: false,
    author: 'Pomonest Team',
    icon: Users
  }
]

const categories = [
  { name: 'All', count: blogPosts.length },
  { name: 'Technique', count: 1 },
  { name: 'Focus', count: 1 },
  { name: 'Students', count: 1 },
  { name: 'Habits', count: 1 },
  { name: 'ADHD', count: 1 },
  { name: 'Remote Work', count: 1 }
]

export default function BlogPage() {
  const featuredPosts = blogPosts.filter(post => post.featured)
  const recentPosts = blogPosts.filter(post => !post.featured)

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/50">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-streak-fire to-streak-ember bg-clip-text text-transparent">
              Productivity Blog
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-6">
              Master productivity techniques, build focus habits, and achieve more with science-backed strategies 
              and expert insights from the Pomonest team.
            </p>
            <div className="flex flex-wrap gap-2 justify-center">
              {categories.map((category) => (
                <Badge key={category.name} variant="secondary" className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors">
                  {category.name} ({category.count})
                </Badge>
              ))}
            </div>
          </div>

          {/* Featured Posts */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <Zap className="h-6 w-6 text-yellow-500" />
              Featured Articles
            </h2>
            <div className="grid gap-6 md:grid-cols-2">
              {featuredPosts.map((post) => {
                const IconComponent = post.icon
                return (
                  <Card key={post.slug} className="group hover:shadow-lg transition-all duration-300 border-2 border-dashed border-yellow-200 bg-gradient-to-br from-yellow-50 to-orange-50">
                    <CardHeader>
                      <div className="flex items-center justify-between mb-2">
                        <Badge variant="secondary" className="bg-yellow-500 text-yellow-900">
                          {post.category}
                        </Badge>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Clock className="h-4 w-4" />
                          {post.readTime}
                        </div>
                      </div>
                      <CardTitle className="group-hover:text-primary transition-colors flex items-center gap-2">
                        <IconComponent className="h-6 w-6 text-primary" />
                        {post.title}
                      </CardTitle>
                      <CardDescription className="text-base leading-relaxed">
                        {post.excerpt}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <User className="h-4 w-4" />
                          {post.author} • {post.publishDate}
                        </div>
                        <Link href={`/blog/${post.slug}`}>
                          <Button variant="outline" size="sm" className="group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                            Read More
                            <ArrowRight className="h-4 w-4 ml-1" />
                          </Button>
                        </Link>
                      </div>
                      <div className="flex flex-wrap gap-1 mt-4">
                        {post.tags.map((tag) => (
                          <Badge key={tag} variant="outline" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </div>

          {/* Recent Posts */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <BookOpen className="h-6 w-6 text-blue-500" />
              Recent Articles
            </h2>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {recentPosts.map((post) => {
                const IconComponent = post.icon
                return (
                  <Card key={post.slug} className="group hover:shadow-lg transition-all duration-300">
                    <CardHeader>
                      <div className="flex items-center justify-between mb-2">
                        <Badge variant="secondary">
                          {post.category}
                        </Badge>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Clock className="h-4 w-4" />
                          {post.readTime}
                        </div>
                      </div>
                      <CardTitle className="group-hover:text-primary transition-colors text-lg flex items-center gap-2">
                        <IconComponent className="h-5 w-5 text-primary" />
                        {post.title}
                      </CardTitle>
                      <CardDescription className="leading-relaxed">
                        {post.excerpt}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <User className="h-4 w-4" />
                          {post.author}
                        </div>
                        <span className="text-sm text-muted-foreground">{post.publishDate}</span>
                      </div>
                      <Link href={`/blog/${post.slug}`}>
                        <Button variant="outline" size="sm" className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                          Read Article
                          <ArrowRight className="h-4 w-4 ml-1" />
                        </Button>
                      </Link>
                      <div className="flex flex-wrap gap-1 mt-3">
                        {post.tags.map((tag) => (
                          <Badge key={tag} variant="outline" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </div>

          {/* Newsletter Signup */}
          <Card className="bg-gradient-to-r from-primary/10 to-primary/5 border-primary/20">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl">Stay Updated</CardTitle>
              <CardDescription className="text-lg">
                Get the latest productivity tips, Pomodoro techniques, and focus strategies delivered to your inbox.
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-1 px-4 py-2 rounded-lg border border-input bg-background"
                />
                <Button className="bg-primary hover:bg-primary/90">
                  Subscribe
                </Button>
              </div>
              <p className="text-sm text-muted-foreground mt-2">
                No spam, unsubscribe anytime. Join 1,000+ productivity enthusiasts.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}