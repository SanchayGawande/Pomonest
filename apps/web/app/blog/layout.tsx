import { Metadata } from 'next'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ArrowLeft, BookOpen, Timer, Target, Users, Zap } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Blog - Pomonest',
  description: 'Productivity tips, focus strategies, and Pomodoro technique guides.',
}

const quickLinks = [
  { 
    title: 'Complete Pomodoro Guide', 
    href: '/blog/complete-pomodoro-technique-guide-2025',
    icon: Timer,
    color: 'text-red-500'
  },
  { 
    title: 'Focus Better', 
    href: '/blog/how-to-focus-better-proven-techniques',
    icon: Target,
    color: 'text-blue-500'
  },
  { 
    title: 'Student Guide', 
    href: '/blog/productivity-tips-students',
    icon: BookOpen,
    color: 'text-green-500'
  },
  { 
    title: 'Team Productivity', 
    href: '/blog/team-productivity-remote-work',
    icon: Users,
    color: 'text-purple-500'
  }
]

export default function BlogLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/50">
      {/* Navigation */}
      <nav className="border-b bg-background/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2 text-xl font-bold">
              <div className="p-2 bg-gradient-to-br from-streak-fire to-streak-ember rounded-lg">
                <Timer className="h-5 w-5 text-white" />
              </div>
              Pomonest
            </Link>
            
            <div className="flex items-center gap-4">
              <Link href="/blog">
                <Button variant="ghost" size="sm" className="flex items-center gap-2">
                  <BookOpen className="h-4 w-4" />
                  All Articles
                </Button>
              </Link>
              <Link href="/">
                <Button variant="outline" size="sm" className="flex items-center gap-2">
                  <ArrowLeft className="h-4 w-4" />
                  Back to Timer
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-1">
        {children}
      </main>

      {/* Sidebar with quick links - shown on blog post pages */}
      <div className="fixed right-4 top-1/2 -translate-y-1/2 z-40 hidden xl:block">
        <div className="bg-background/80 backdrop-blur-sm rounded-lg border p-4 shadow-lg max-w-xs">
          <h3 className="font-semibold mb-3 flex items-center gap-2">
            <Zap className="h-4 w-4 text-yellow-500" />
            Quick Links
          </h3>
          <div className="space-y-2">
            {quickLinks.map((link) => {
              const IconComponent = link.icon
              return (
                <Link key={link.href} href={link.href}>
                  <Button variant="ghost" size="sm" className="w-full justify-start text-left">
                    <IconComponent className={`h-4 w-4 mr-2 ${link.color}`} />
                    <span className="truncate">{link.title}</span>
                  </Button>
                </Link>
              )
            })}
          </div>
          <div className="mt-4 pt-4 border-t">
            <Link href="/">
              <Button size="sm" className="w-full bg-gradient-to-r from-streak-fire to-streak-ember">
                Try Pomonest
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t bg-background/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-8">
          <div className="grid gap-8 md:grid-cols-3">
            <div>
              <h3 className="font-semibold mb-4">Pomonest</h3>
              <p className="text-sm text-muted-foreground">
                The free Pomodoro timer that helps you build focus habits and boost productivity.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Popular Articles</h3>
              <div className="space-y-2 text-sm">
                <Link href="/blog/complete-pomodoro-technique-guide-2025" className="block text-muted-foreground hover:text-primary transition-colors">
                  Complete Pomodoro Guide
                </Link>
                <Link href="/blog/how-to-focus-better-proven-techniques" className="block text-muted-foreground hover:text-primary transition-colors">
                  How to Focus Better
                </Link>
                <Link href="/blog/productivity-tips-students" className="block text-muted-foreground hover:text-primary transition-colors">
                  Student Productivity Guide
                </Link>
              </div>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Connect</h3>
              <div className="space-y-2 text-sm">
                <Link href="/contact" className="block text-muted-foreground hover:text-primary transition-colors">
                  Contact Us
                </Link>
                <Link href="/about" className="block text-muted-foreground hover:text-primary transition-colors">
                  About Pomonest
                </Link>
                <Link href="/privacy" className="block text-muted-foreground hover:text-primary transition-colors">
                  Privacy Policy
                </Link>
              </div>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t text-center text-sm text-muted-foreground">
            <p>&copy; 2025 Pomonest. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}