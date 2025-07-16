'use client'

import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Timer, Flame, Target, Crown, Play, CheckCircle, Star, BarChart3, Users, Zap, Clock, Award, TrendingUp } from 'lucide-react'
import Link from 'next/link'
import { analytics } from '@/lib/analytics'

export default function LandingPage() {
  const [currentFeature, setCurrentFeature] = useState(0)

  const features = [
    {
      icon: Timer,
      title: "Smart Pomodoro Timer",
      description: "Customizable work and break intervals with intelligent session management",
      demo: "25 min work → 5 min break → repeat"
    },
    {
      icon: Flame,
      title: "Streak Tracking",
      description: "Build unstoppable momentum with visual streak counters and achievements",
      demo: "🔥 Current streak: 7 days"
    },
    {
      icon: BarChart3,
      title: "Productivity Analytics",
      description: "Deep insights into your focus patterns, productivity trends, and time usage",
      demo: "📊 2.5x productivity boost this month"
    },
    {
      icon: Crown,
      title: "Pro Themes & Features",
      description: "Premium themes, advanced analytics, and exclusive productivity tools",
      demo: "🎨 Ocean, Forest, Sunset themes"
    }
  ]

  const stats = [
    { number: "25+", label: "Productivity Features" },
    { number: "10+", label: "Premium Themes" },
    { number: "99.9%", label: "Uptime Reliability" },
    { number: "4.8★", label: "User Rating" }
  ]

  const testimonials = [
    {
      name: "Sarah Chen",
      role: "Software Developer",
      content: "PomoNest transformed my coding sessions. The streak tracking keeps me motivated, and the analytics show I'm 40% more productive!",
      rating: 5
    },
    {
      name: "Marcus Rodriguez",
      role: "Graduate Student",
      content: "Best Pomodoro timer I've used. The color-coded settings and focus modes make studying so much more organized.",
      rating: 5
    },
    {
      name: "Emily Watson",
      role: "Freelance Designer",
      content: "The themes are gorgeous and the habit tracking actually works. I've maintained a 3-week focus streak!",
      rating: 5
    }
  ]

  useEffect(() => {
    // Track landing page view
    analytics.track('Landing Page View', {
      source: 'direct',
      page: 'landing'
    })

    const interval = setInterval(() => {
      setCurrentFeature((prev) => (prev + 1) % features.length)
    }, 4000)

    return () => clearInterval(interval)
  }, [])

  const handleCTAClick = (location: string) => {
    analytics.track('CTA Click', {
      location,
      page: 'landing'
    })
  }

  const handleEmailSignup = async (email: string) => {
    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      alert('Please enter a valid email address')
      return
    }

    try {
      // Track the signup attempt
      analytics.track('Newsletter Signup Attempt', {
        email,
        source: 'landing_page',
        timestamp: new Date().toISOString()
      })

      // Call our ConvertKit API endpoint
      const response = await fetch('/api/newsletter-signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email })
      })

      const result = await response.json()

      if (response.ok && result.success) {
        // Track successful signup
        analytics.track('Newsletter Signup Success', {
          email,
          source: 'landing_page',
          subscriber_id: result.subscriber_id,
          timestamp: new Date().toISOString()
        })

        // Clear the input
        const input = document.getElementById('newsletter-email') as HTMLInputElement
        if (input) {
          input.value = ''
        }

        // Show success message
        alert('🎉 Thanks for subscribing! Check your email for a special focus guide.')
      } else {
        throw new Error(result.error || 'Signup failed')
      }
      
    } catch (error) {
      console.error('Email signup error:', error)
      
      // Track failed signup
      analytics.track('Newsletter Signup Failed', {
        email,
        source: 'landing_page',
        error: error.message,
        timestamp: new Date().toISOString()
      })
      
      alert('Something went wrong. Please try again.')
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Hero Section */}
      <section className="relative overflow-hidden px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center lg:text-left"
            >
              <Badge className="mb-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white px-4 py-2">
                #1 Pomodoro Timer 2025
              </Badge>
              
              <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-gray-900 dark:text-white mb-6">
                The Best
                <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  {" "}Pomodoro Timer{" "}
                </span>
                for Focused Work
              </h1>
              
              <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl">
                PomoNest combines the proven Pomodoro Technique with streak tracking, beautiful themes, and powerful analytics to supercharge your productivity. Join thousands who've transformed their focus.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Link href="/">
                  <Button 
                    size="lg" 
                    className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 text-lg"
                    onClick={() => handleCTAClick('hero-primary')}
                  >
                    Start Focusing Now - Free
                    <Play className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
                
                <Button 
                  variant="outline" 
                  size="lg" 
                  className="px-8 py-4 text-lg border-2"
                  onClick={() => handleCTAClick('hero-demo')}
                >
                  <Star className="mr-2 h-5 w-5" />
                  See Demo
                </Button>
              </div>
              
              <div className="mt-8 flex items-center justify-center lg:justify-start gap-6">
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                  ))}
                  <span className="ml-2 text-gray-600 dark:text-gray-300">4.8/5 from 2,000+ users</span>
                </div>
              </div>
            </motion.div>

            {/* Animated Feature Preview */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative"
            >
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8 border">
                <div className="text-center mb-6">
                  <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    {features[currentFeature].icon && 
                      React.createElement(features[currentFeature].icon, { 
                        className: "h-8 w-8 text-white" 
                      })
                    }
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                    {features[currentFeature].title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 mb-4">
                    {features[currentFeature].description}
                  </p>
                  <Badge variant="secondary" className="text-lg px-4 py-2">
                    {features[currentFeature].demo}
                  </Badge>
                </div>
                
                {/* Progress indicators */}
                <div className="flex justify-center gap-2">
                  {features.map((_, index) => (
                    <div
                      key={index}
                      className={`h-2 w-8 rounded-full transition-all duration-300 ${
                        index === currentFeature 
                          ? 'bg-gradient-to-r from-blue-500 to-purple-600' 
                          : 'bg-gray-200 dark:bg-gray-600'
                      }`}
                    />
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white dark:bg-gray-800">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="text-center"
              >
                <div className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-2">
                  {stat.number}
                </div>
                <div className="text-gray-600 dark:text-gray-300">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Why PomoNest is the Best Pomodoro Timer
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              More than just a timer - it's a complete productivity ecosystem designed to help you build lasting focus habits.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: Timer,
                title: "Smart Timer System",
                description: "Customizable Pomodoro intervals with intelligent break suggestions and session management.",
                features: ["25/5/15 minute defaults", "Custom interval settings", "Auto-start options", "Session history"]
              },
              {
                icon: Flame,
                title: "Streak & Habit Tracking",
                description: "Build momentum with visual streak counters and habit formation insights.",
                features: ["Daily streak tracking", "Habit visualization", "Achievement badges", "Progress milestones"]
              },
              {
                icon: BarChart3,
                title: "Advanced Analytics",
                description: "Deep insights into your productivity patterns and focus trends over time.",
                features: ["Time tracking reports", "Productivity metrics", "Focus pattern analysis", "Goal tracking"]
              },
              {
                icon: Crown,
                title: "Premium Themes",
                description: "Beautiful, professionally designed themes to match your workflow and mood.",
                features: ["10+ premium themes", "Dark/light modes", "Custom color schemes", "Seasonal updates"]
              },
              {
                icon: Target,
                title: "Task Integration",
                description: "Seamlessly connect your Pomodoro sessions with task management and goals.",
                features: ["Task tracking", "Goal setting", "Priority management", "Progress visualization"]
              },
              {
                icon: Zap,
                title: "Focus Enhancement",
                description: "Advanced features to eliminate distractions and maximize deep work sessions.",
                features: ["Website blocking", "Notification control", "Ambient sounds", "Focus mode"]
              }
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="h-full hover:shadow-lg transition-shadow duration-300 border-2">
                  <CardHeader>
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center mb-4">
                      <feature.icon className="h-6 w-6 text-white" />
                    </div>
                    <CardTitle className="text-xl">{feature.title}</CardTitle>
                    <CardDescription className="text-base">{feature.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {feature.features.map((item, itemIndex) => (
                        <li key={itemIndex} className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                          <span className="text-sm text-gray-600 dark:text-gray-300">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-gray-50 dark:bg-gray-900">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Loved by Thousands of Productive People
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              See how PomoNest has transformed workflows for students, professionals, and creators.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.2 }}
                viewport={{ once: true }}
              >
                <Card className="h-full">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-1 mb-4">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      ))}
                    </div>
                    <p className="text-gray-600 dark:text-gray-300 mb-4 italic">
                      "{testimonial.content}"
                    </p>
                    <div>
                      <div className="font-semibold text-gray-900 dark:text-white">
                        {testimonial.name}
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        {testimonial.role}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
              Ready to Transform Your Productivity?
            </h2>
            <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
              Join thousands of focused individuals who've made PomoNest their go-to productivity tool. Start your journey to better focus today.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/">
                <Button 
                  size="lg" 
                  className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-4 text-lg font-semibold"
                  onClick={() => handleCTAClick('cta-primary')}
                >
                  Get Started Free
                  <Clock className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              
              <Button 
                variant="outline" 
                size="lg" 
                className="border-2 border-white text-white hover:bg-white hover:text-blue-600 px-8 py-4 text-lg"
                onClick={() => handleCTAClick('cta-secondary')}
              >
                <Crown className="mr-2 h-5 w-5" />
                Upgrade to Pro
              </Button>
            </div>
            
            <p className="text-blue-200 mt-4 text-sm">
              No credit card required • Free forever plan available • Upgrade anytime
            </p>
          </motion.div>
        </div>
      </section>

      {/* Email Newsletter Signup */}
      <section className="py-16 bg-gray-50 dark:bg-gray-900">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Get Weekly Focus Tips & Updates
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
              Join 10,000+ productive people getting weekly tips on focus, productivity, and building better habits. Plus get notified about new features first.
            </p>
            
            <div className="max-w-md mx-auto">
              <div className="flex flex-col sm:flex-row gap-3">
                <input
                  type="email"
                  placeholder="Enter your email address"
                  className="flex-1 px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  id="newsletter-email"
                />
                <Button 
                  className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 px-6 py-3 text-white font-semibold"
                  onClick={() => {
                    const email = (document.getElementById('newsletter-email') as HTMLInputElement)?.value;
                    if (email) {
                      handleEmailSignup(email);
                    }
                  }}
                >
                  Get Tips
                </Button>
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-3">
                No spam. Unsubscribe anytime. We respect your privacy.
              </p>
            </div>

            <div className="mt-8 flex justify-center items-center gap-8 text-sm text-gray-500 dark:text-gray-400">
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                <span>10,000+ subscribers</span>
              </div>
              <div className="flex items-center gap-2">
                <Star className="h-4 w-4 text-yellow-500" />
                <span>4.8/5 rating</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span>Weekly updates</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* SEO Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <h3 className="font-bold text-lg mb-4">PomoNest</h3>
              <p className="text-gray-400 text-sm">
                The best Pomodoro timer for focused work, habit tracking, and productivity analytics.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Features</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>Pomodoro Timer</li>
                <li>Streak Tracking</li>
                <li>Productivity Analytics</li>
                <li>Focus Enhancement</li>
                <li>Task Management</li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">For Everyone</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>Students</li>
                <li>Developers</li>
                <li>Designers</li>
                <li>Writers</li>
                <li>Remote Workers</li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Connect</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>Product Hunt</li>
                <li>Twitter</li>
                <li>LinkedIn</li>
                <li>Blog</li>
                <li>Support</li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400 text-sm">
            <p>&copy; 2025 PomoNest. The best Pomodoro timer for productivity and focus.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}