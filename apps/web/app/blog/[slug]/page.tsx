import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Clock, User, ArrowLeft, ArrowRight, Share2, BookOpen, Calendar, Tag } from 'lucide-react'
import Link from 'next/link'
import { CompletePomodoroGuide } from '@/components/blog/CompletePomodoroGuide'
import { HowToFocusBetter } from '@/components/blog/HowToFocusBetter'
import { ProductivityTipsStudents } from '@/components/blog/ProductivityTipsStudents'
import { BuildingFocusHabits } from '@/components/blog/BuildingFocusHabits'
import { PomodoroTechniqueADHD } from '@/components/blog/PomodoroTechniqueADHD'
import { TeamProductivityRemoteWork } from '@/components/blog/TeamProductivityRemoteWork'

const blogPosts = {
  'complete-pomodoro-technique-guide-2025': {
    title: 'The Complete Pomodoro Technique Guide (2025 Edition)',
    description: 'Master the world\'s most effective productivity method with this comprehensive guide to the Pomodoro Technique. Includes scientific research, step-by-step instructions, and advanced variations.',
    author: 'Pomonest Team',
    publishDate: 'January 15, 2025',
    readTime: '12 min read',
    category: 'Technique',
    tags: ['Pomodoro', 'Productivity', 'Focus', 'Time Management'],
    keywords: 'pomodoro technique, productivity, focus, time management, concentration, work technique',
    component: CompletePomodoroGuide,
    featured: true
  },
  'how-to-focus-better-proven-techniques': {
    title: 'How to Focus Better: 10 Proven Techniques That Actually Work',
    description: 'Discover science-backed strategies to improve your focus and concentration. From deep work principles to attention training exercises that boost productivity.',
    author: 'Pomonest Team',
    publishDate: 'January 12, 2025',
    readTime: '8 min read',
    category: 'Focus',
    tags: ['Focus', 'Concentration', 'Deep Work', 'Attention'],
    keywords: 'how to focus, focus techniques, concentration, attention training, deep work, productivity',
    component: HowToFocusBetter,
    featured: true
  },
  'productivity-tips-students': {
    title: 'The Ultimate Productivity Guide for Students',
    description: 'Transform your study sessions with proven techniques. Learn how to manage time, reduce stress, and boost academic performance with the Pomodoro Technique.',
    author: 'Pomonest Team',
    publishDate: 'January 10, 2025',
    readTime: '10 min read',
    category: 'Students',
    tags: ['Students', 'Study Tips', 'Academic Success', 'Time Management'],
    keywords: 'student productivity, study tips, time management for students, academic success, study techniques',
    component: ProductivityTipsStudents,
    featured: false
  },
  'building-focus-habits': {
    title: 'Building Unbreakable Focus Habits: A 30-Day Challenge',
    description: 'Create lasting focus habits with this comprehensive 30-day program. Includes daily exercises, progress tracking, and habit stacking techniques.',
    author: 'Pomonest Team',
    publishDate: 'January 8, 2025',
    readTime: '15 min read',
    category: 'Habits',
    tags: ['Habits', 'Focus', 'Productivity', 'Self-Improvement'],
    keywords: 'focus habits, habit formation, productivity habits, focus training, concentration habits',
    component: BuildingFocusHabits,
    featured: false
  },
  'pomodoro-technique-adhd': {
    title: 'Pomodoro Technique for ADHD: A Complete Guide',
    description: 'Learn how to adapt the Pomodoro Technique for ADHD brains. Includes modifications, tips, and strategies for better focus and productivity.',
    author: 'Pomonest Team',
    publishDate: 'January 5, 2025',
    readTime: '9 min read',
    category: 'ADHD',
    tags: ['ADHD', 'Pomodoro', 'Focus', 'Productivity'],
    keywords: 'pomodoro technique ADHD, ADHD productivity, focus with ADHD, ADHD time management',
    component: PomodoroTechniqueADHD,
    featured: false
  },
  'team-productivity-remote-work': {
    title: 'Team Productivity in the Remote Work Era',
    description: 'Boost team productivity with proven remote work strategies. Learn about collaboration tools, communication techniques, and maintaining focus.',
    author: 'Pomonest Team',
    publishDate: 'January 3, 2025',
    readTime: '11 min read',
    category: 'Remote Work',
    tags: ['Remote Work', 'Team Productivity', 'Collaboration', 'Management'],
    keywords: 'remote work productivity, team collaboration, remote team management, distributed teams',
    component: TeamProductivityRemoteWork,
    featured: false
  }
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const post = blogPosts[params.slug as keyof typeof blogPosts]
  
  if (!post) {
    return {
      title: 'Article Not Found - Pomonest Blog',
      description: 'The requested article could not be found.',
    }
  }

  return {
    title: `${post.title} - Pomonest Blog`,
    description: post.description,
    keywords: post.keywords,
    authors: [{ name: post.author }],
    openGraph: {
      title: post.title,
      description: post.description,
      type: 'article',
      authors: [post.author],
      publishedTime: post.publishDate,
      tags: post.tags,
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.description,
    },
  }
}

export async function generateStaticParams() {
  return Object.keys(blogPosts).map((slug) => ({
    slug,
  }))
}

export default function BlogPost({ params }: { params: { slug: string } }) {
  const post = blogPosts[params.slug as keyof typeof blogPosts]
  
  if (!post) {
    notFound()
  }

  const ContentComponent = post.component
  const allPosts = Object.keys(blogPosts)
  const currentIndex = allPosts.indexOf(params.slug)
  const nextPost = currentIndex > 0 ? allPosts[currentIndex - 1] : null
  const prevPost = currentIndex < allPosts.length - 1 ? allPosts[currentIndex + 1] : null

  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Article Header */}
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-4">
              <Link href="/blog">
                <Button variant="outline" size="sm" className="flex items-center gap-2">
                  <ArrowLeft className="h-4 w-4" />
                  Back to Blog
                </Button>
              </Link>
              <Badge variant="secondary" className="ml-auto">
                {post.category}
              </Badge>
            </div>
            
            <h1 className="text-4xl font-bold mb-4 leading-tight">
              {post.title}
            </h1>
            
            <div className="flex flex-wrap items-center gap-4 text-muted-foreground mb-6">
              <div className="flex items-center gap-2">
                <User className="h-4 w-4" />
                {post.author}
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                {post.publishDate}
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                {post.readTime}
              </div>
              <Button variant="outline" size="sm" className="flex items-center gap-2 ml-auto">
                <Share2 className="h-4 w-4" />
                Share
              </Button>
            </div>
            
            <div className="flex flex-wrap gap-2 mb-6">
              {post.tags.map((tag) => (
                <Badge key={tag} variant="outline" className="flex items-center gap-1">
                  <Tag className="h-3 w-3" />
                  {tag}
                </Badge>
              ))}
            </div>
          </div>

          {/* Article Content */}
          <article className="prose prose-lg max-w-none">
            <ContentComponent />
          </article>

          {/* Navigation */}
          <div className="grid gap-4 md:grid-cols-2 mt-12 pt-8 border-t">
            {prevPost && (
              <Link href={`/blog/${prevPost}`} className="block">
                <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                  <CardHeader>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                      <ArrowLeft className="h-4 w-4" />
                      Previous Article
                    </div>
                    <CardTitle className="text-lg">
                      {blogPosts[prevPost as keyof typeof blogPosts].title}
                    </CardTitle>
                  </CardHeader>
                </Card>
              </Link>
            )}
            
            {nextPost && (
              <Link href={`/blog/${nextPost}`} className="block">
                <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                  <CardHeader>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2 justify-end">
                      Next Article
                      <ArrowRight className="h-4 w-4" />
                    </div>
                    <CardTitle className="text-lg text-right">
                      {blogPosts[nextPost as keyof typeof blogPosts].title}
                    </CardTitle>
                  </CardHeader>
                </Card>
              </Link>
            )}
          </div>

          {/* Call to Action */}
          <Card className="mt-12 bg-gradient-to-r from-primary/10 to-primary/5 border-primary/20">
            <CardContent className="p-8 text-center">
              <h3 className="text-2xl font-bold mb-4">Ready to boost your productivity?</h3>
              <p className="text-lg text-muted-foreground mb-6">
                Try Pomonest's free Pomodoro timer and start building better focus habits today.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/">
                  <Button size="lg" className="bg-gradient-to-r from-streak-fire to-streak-ember">
                    Start Timer Now
                  </Button>
                </Link>
                <Link href="/about">
                  <Button variant="outline" size="lg">
                    Learn More
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