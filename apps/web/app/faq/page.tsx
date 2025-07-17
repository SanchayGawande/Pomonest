import { Metadata } from 'next'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { HelpCircle, Timer, Star, CreditCard, Shield, Smartphone } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Breadcrumbs } from '@/components/Breadcrumbs'

export const metadata: Metadata = {
  title: 'Frequently Asked Questions - PomoNest | Pomodoro Timer FAQ',
  description: 'Find answers to common questions about PomoNest Pomodoro timer, Pro features, pricing, and productivity techniques. Get help with our focus app.',
  keywords: 'PomoNest FAQ, Pomodoro timer questions, productivity app help, focus technique guide, time management FAQ'
}

export default function FAQPage() {
  const faqs = [
    {
      category: "Getting Started",
      icon: Timer,
      questions: [
        {
          q: "What is the Pomodoro Technique?",
          a: "The Pomodoro Technique is a time management method developed by Francesco Cirillo. It involves working for 25-minute focused sessions (called 'Pomodoros') followed by 5-minute breaks. After 4 Pomodoros, you take a longer 15-30 minute break. This technique helps improve focus, reduce mental fatigue, and boost productivity."
        },
        {
          q: "Do I need to create an account to use PomoNest?",
          a: "No! You can use PomoNest immediately without creating an account. Your data will be saved locally in your browser. However, creating a free account allows you to sync your progress across devices and access additional features."
        },
        {
          q: "How do I start my first Pomodoro session?",
          a: "Simply visit our homepage, set your task name (optional), and click the 'Start' button. The timer will begin counting down from 25 minutes. Focus on your work until the timer rings, then take a 5-minute break. It's that simple!"
        },
        {
          q: "Can I customize the timer durations?",
          a: "Yes! PomoNest allows you to customize work session lengths, short break durations, and long break intervals to match your preferences and work style. You can adjust these in the settings."
        }
      ]
    },
    {
      category: "Features & Usage",
      icon: Star,
      questions: [
        {
          q: "What are streaks and how do they work?",
          a: "Streaks track consecutive days of completing at least one Pomodoro session. They help build consistent productivity habits. Your streak increases each day you complete a session and resets if you miss a day (unless you have Pro streak protection)."
        },
        {
          q: "How does task management work?",
          a: "You can create tasks, set priorities, and track which ones you complete during each Pomodoro session. This helps you stay organized and see exactly what you accomplished during your focused work time."
        },
        {
          q: "What analytics are available?",
          a: "PomoNest provides insights into your productivity patterns, including daily/weekly session counts, total focus time, most productive hours, and streak statistics. Pro users get advanced analytics with detailed charts and trends."
        },
        {
          q: "Can I use PomoNest offline?",
          a: "Yes! PomoNest works offline. Your progress will be saved locally and synced when you reconnect to the internet (if you have an account)."
        }
      ]
    },
    {
      category: "Pro Features",
      icon: CreditCard,
      questions: [
        {
          q: "What's included in PomoNest Pro?",
          a: "Pro includes: ad-free experience, advanced analytics, cloud sync across devices, streak protection with Save Passes, premium visual themes, detailed productivity reports, smart focus recommendations, and priority support."
        },
        {
          q: "How much does Pro cost?",
          a: "PomoNest Pro costs $2.49 per month. This gives you access to all premium features and helps support the continued development of new features."
        },
        {
          q: "What are Save Passes?",
          a: "Save Passes are a Pro feature that protects your streak when life gets in the way. If you miss a day, a Save Pass will automatically preserve your streak. Pro users get Save Passes to maintain their motivation even during busy periods."
        },
        {
          q: "Can I cancel my Pro subscription anytime?",
          a: "Yes, you can cancel your Pro subscription at any time. You'll continue to have access to Pro features until the end of your current billing period, then your account will revert to the free tier."
        },
        {
          q: "Is there a free trial for Pro?",
          a: "We occasionally offer free trials for Pro features. Check our app for current promotions. Even without a trial, our free tier is fully functional and many users find it meets all their needs."
        }
      ]
    },
    {
      category: "Technical Support",
      icon: Shield,
      questions: [
        {
          q: "Why isn't my timer working properly?",
          a: "If your timer isn't working, try refreshing the page, checking your internet connection, or clearing your browser cache. Make sure JavaScript is enabled. If problems persist, contact our support team."
        },
        {
          q: "How do I sync my data between devices?",
          a: "Create a free account and log in on all your devices. Your progress, streaks, and settings will automatically sync across all logged-in devices."
        },
        {
          q: "What if I lose my streak by accident?",
          a: "Free users cannot recover lost streaks, which encourages consistent daily practice. Pro users with Save Passes can protect their streaks. Contact support if you believe there was a technical error."
        },
        {
          q: "Is my data secure?",
          a: "Yes! We use enterprise-grade security with HTTPS encryption, secure authentication, and trusted database providers. We never share your personal data with third parties for marketing purposes."
        }
      ]
    },
    {
      category: "Mobile & Devices",
      icon: Smartphone,
      questions: [
        {
          q: "Is there a mobile app?",
          a: "PomoNest is a web app that works perfectly on mobile browsers. You can add it to your home screen for an app-like experience. We're considering dedicated mobile apps based on user demand."
        },
        {
          q: "Can I get notifications on my phone?",
          a: "Yes! Enable browser notifications to get alerts when your Pomodoro sessions and breaks end, even if you switch to other apps or tabs."
        },
        {
          q: "Does it work on tablets?",
          a: "Absolutely! PomoNest is responsive and works great on tablets, providing an optimal experience regardless of screen size."
        },
        {
          q: "What browsers are supported?",
          a: "PomoNest works on all modern browsers including Chrome, Firefox, Safari, and Edge. For the best experience, we recommend using the latest version of your preferred browser."
        }
      ]
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
              <HelpCircle className="h-8 w-8 text-blue-600" />
              <h1 className="text-4xl font-bold">Frequently Asked Questions</h1>
            </div>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Find answers to common questions about PomoNest, the Pomodoro Technique, 
              and how to maximize your productivity with focused work sessions.
            </p>
          </div>

          {/* FAQ Categories */}
          <div className="space-y-8">
            {faqs.map((category, categoryIndex) => (
              <div key={categoryIndex}>
                <Card className="mb-6">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-2xl">
                      <category.icon className="h-6 w-6 text-blue-600" />
                      {category.category}
                    </CardTitle>
                  </CardHeader>
                </Card>

                <div className="space-y-4">
                  {category.questions.map((faq, faqIndex) => (
                    <Card key={faqIndex} className="hover:shadow-md transition-shadow">
                      <CardHeader>
                        <CardTitle className="text-lg font-semibold text-left">
                          {faq.q}
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-muted-foreground leading-relaxed">
                          {faq.a}
                        </p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Additional Resources */}
          <Card className="mt-12 bg-gradient-to-br from-blue-50 to-cyan-50 border-blue-200">
            <CardHeader>
              <CardTitle className="text-2xl">Need More Help?</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">
                Can't find what you're looking for? We're here to help you get the most out of PomoNest 
                and the Pomodoro Technique.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link href="/contact">
                  <Button className="bg-blue-600 hover:bg-blue-700">
                    Contact Support
                  </Button>
                </Link>
                <Link href="/blog">
                  <Button variant="outline">
                    Read Our Blog
                  </Button>
                </Link>
                <Link href="/resources">
                  <Button variant="outline">
                    Browse Resources
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          {/* Quick Start CTA */}
          <Card className="mt-8 text-center bg-gradient-to-br from-streak-fire/10 to-streak-ember/10 border-streak-fire/20">
            <CardContent className="py-8">
              <h2 className="text-2xl font-bold mb-4">Ready to Start Focusing?</h2>
              <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
                Join thousands of people who have improved their productivity with PomoNest. 
                Start your first focus session in seconds - no signup required!
              </p>
              <div className="flex flex-wrap gap-4 justify-center">
                <Link href="/">
                  <Button size="lg" className="bg-gradient-to-r from-streak-fire to-streak-ember">
                    <Timer className="h-5 w-5 mr-2" />
                    Start Your First Pomodoro
                  </Button>
                </Link>
                <Link href="/auth/login">
                  <Button variant="outline" size="lg">
                    Create Free Account
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