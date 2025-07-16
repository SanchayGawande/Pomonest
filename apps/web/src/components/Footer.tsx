import Link from 'next/link'
import { Timer, Heart } from 'lucide-react'

export function Footer() {
  return (
    <footer className="bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Main Footer Content */}
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {/* Brand Section */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-gradient-to-br from-streak-fire to-streak-ember rounded-lg">
                  <Timer className="h-5 w-5 text-white" />
                </div>
                <h3 className="text-lg font-bold">PomoNest</h3>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">
                The free Pomodoro timer that helps you build focus habits, track streaks, 
                and achieve more without burnout.
              </p>
            </div>

            {/* Quick Links */}
            <div className="space-y-4">
              <h4 className="text-sm font-semibold">Quick Links</h4>
              <nav className="space-y-2">
                <Link 
                  href="/" 
                  className="block text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  Home
                </Link>
                <Link 
                  href="/about" 
                  className="block text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  About
                </Link>
                <Link 
                  href="/contact" 
                  className="block text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  Contact
                </Link>
                <Link 
                  href="/auth/login" 
                  className="block text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  Sign Up Free
                </Link>
              </nav>
            </div>

            {/* Legal */}
            <div className="space-y-4">
              <h4 className="text-sm font-semibold">Legal</h4>
              <nav className="space-y-2">
                <Link 
                  href="/privacy" 
                  className="block text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  Privacy Policy
                </Link>
                <Link 
                  href="/terms" 
                  className="block text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  Terms of Service
                </Link>
              </nav>
            </div>

            {/* Support */}
            <div className="space-y-4">
              <h4 className="text-sm font-semibold">Support</h4>
              <nav className="space-y-2">
                <a 
                  href="mailto:support@pomonest.com" 
                  className="block text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  Help & Support
                </a>
                <a 
                  href="mailto:features@pomonest.com" 
                  className="block text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  Feature Requests
                </a>
                <a 
                  href="mailto:bugs@pomonest.com" 
                  className="block text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  Report a Bug
                </a>
              </nav>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-800">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <span>© 2024 PomoNest. All rights reserved.</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <span>Made with</span>
                <Heart className="h-4 w-4 text-red-500" />
                <span>for focused minds</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}