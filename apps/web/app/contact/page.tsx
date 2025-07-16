'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Mail, MessageSquare, Bug, Lightbulb, Heart, Clock } from 'lucide-react'

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/50">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <div className="flex items-center justify-center gap-3 mb-6">
              <MessageSquare className="h-8 w-8 text-blue-600" />
              <h1 className="text-4xl font-bold">Contact Us</h1>
            </div>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              We would love to hear from you! Whether you have questions, feedback, or need support, 
              we are here to help you focus better.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-12">
            <Card className="bg-gradient-to-br from-blue-50 to-cyan-50 border-blue-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Mail className="h-5 w-5 text-blue-600" />
                  General Support
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  For general questions, account issues, or technical support.
                </p>
                <Button 
                  className="w-full bg-blue-600 hover:bg-blue-700"
                  onClick={() => window.location.href = 'mailto:support@pomonest.com'}
                >
                  support@pomonest.com
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-purple-50 to-pink-50 border-purple-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lightbulb className="h-5 w-5 text-purple-600" />
                  Feature Requests
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  Have an idea to make PomoNest even better? We would love to hear it!
                </p>
                <Button 
                  className="w-full bg-purple-600 hover:bg-purple-700"
                  onClick={() => window.location.href = 'mailto:features@pomonest.com'}
                >
                  features@pomonest.com
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-red-50 to-orange-50 border-red-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bug className="h-5 w-5 text-red-600" />
                  Bug Reports
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  Found a bug? Help us fix it by reporting the issue.
                </p>
                <Button 
                  className="w-full bg-red-600 hover:bg-red-700"
                  onClick={() => window.location.href = 'mailto:bugs@pomonest.com'}
                >
                  bugs@pomonest.com
                </Button>
              </CardContent>
            </Card>
          </div>

          <Card className="text-center bg-gradient-to-br from-streak-fire/10 to-streak-ember/10 border-streak-fire/20">
            <CardContent className="py-8">
              <Heart className="h-12 w-12 text-streak-fire mx-auto mb-4" />
              <h2 className="text-2xl font-bold mb-4">We Love Feedback!</h2>
              <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
                PomoNest is built for users like you. Your feedback helps us create the best possible 
                productivity experience.
              </p>
              <Button 
                size="lg" 
                className="bg-gradient-to-r from-streak-fire to-streak-ember"
                onClick={() => window.location.href = 'mailto:hello@pomonest.com'}
              >
                <Mail className="h-5 w-5 mr-2" />
                Say Hello - hello@pomonest.com
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}