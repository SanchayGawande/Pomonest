import { Metadata } from 'next'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Shield, Eye, Cookie, Database, Mail } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Privacy Policy - PomoNest',
  description: 'Learn how PomoNest protects your privacy and handles your data while helping you build productive habits.',
}

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/50">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-3 mb-4">
              <Shield className="h-8 w-8 text-blue-600" />
              <h1 className="text-4xl font-bold">Privacy Policy</h1>
            </div>
            <p className="text-lg text-muted-foreground">
              Your privacy is important to us. Learn how we protect your data.
            </p>
            <p className="text-sm text-muted-foreground mt-2">
              Last updated: {new Date().toLocaleDateString()}
            </p>
          </div>

          <div className="space-y-6">
            {/* Information We Collect */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Database className="h-5 w-5" />
                  Information We Collect
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="font-semibold mb-2">Account Information</h3>
                  <p className="text-muted-foreground">
                    When you create an account, we collect your email address and authentication information through Google or Apple OAuth.
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Usage Data</h3>
                  <p className="text-muted-foreground">
                    We collect data about your Pomodoro sessions, including session duration, completion status, and streak information to provide personalized insights.
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Device Information</h3>
                  <p className="text-muted-foreground">
                    We may collect information about your device, browser type, and IP address for security and optimization purposes.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* How We Use Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Eye className="h-5 w-5" />
                  How We Use Your Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <ul className="space-y-2 text-muted-foreground">
                  <li>• Provide and maintain the PomoNest service</li>
                  <li>• Track your productivity progress and streaks</li>
                  <li>• Send you notifications about your goals (if enabled)</li>
                  <li>• Process payments for Pro subscriptions</li>
                  <li>• Improve our services and develop new features</li>
                  <li>• Prevent fraud and ensure security</li>
                </ul>
              </CardContent>
            </Card>

            {/* Data Storage and Security */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Data Storage and Security
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="font-semibold mb-2">Data Storage</h3>
                  <p className="text-muted-foreground">
                    Your data is securely stored using Supabase, a trusted database provider with enterprise-level security measures.
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Guest Users</h3>
                  <p className="text-muted-foreground">
                    If you use PomoNest without an account, your data is stored locally in your browser and is not transmitted to our servers.
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Security Measures</h3>
                  <p className="text-muted-foreground">
                    We implement industry-standard security measures including HTTPS encryption, secure authentication, and regular security updates.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Third-Party Services */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Cookie className="h-5 w-5" />
                  Third-Party Services
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="font-semibold mb-2">Authentication</h3>
                  <p className="text-muted-foreground">
                    We use Google and Apple OAuth for secure authentication. These services may collect data according to their own privacy policies.
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Payments</h3>
                  <p className="text-muted-foreground">
                    Payment processing is handled by Stripe. We do not store your payment information on our servers.
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Analytics</h3>
                  <p className="text-muted-foreground">
                    We may use Google Analytics to understand how users interact with our service. This helps us improve the user experience.
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Advertising</h3>
                  <p className="text-muted-foreground">
                    We may display ads through Google AdSense. Google may use cookies to serve relevant ads based on your browsing history.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Your Rights */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Mail className="h-5 w-5" />
                  Your Rights and Choices
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="font-semibold mb-2">Data Access and Deletion</h3>
                  <p className="text-muted-foreground">
                    You can access, update, or delete your account data at any time through your account settings or by contacting us.
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Marketing Communications</h3>
                  <p className="text-muted-foreground">
                    You can opt out of marketing emails at any time using the unsubscribe link in our emails.
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Cookies</h3>
                  <p className="text-muted-foreground">
                    You can control cookie preferences through your browser settings, though this may affect functionality.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Contact Information */}
            <Card>
              <CardHeader>
                <CardTitle>Contact Us</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  If you have any questions about this Privacy Policy or our data practices, please contact us:
                </p>
                <div className="space-y-2 text-muted-foreground">
                  <p>Email: privacy@pomonest.com</p>
                  <p>Response time: We aim to respond within 48 hours</p>
                </div>
              </CardContent>
            </Card>

            {/* Updates */}
            <Card>
              <CardHeader>
                <CardTitle>Policy Updates</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  We may update this Privacy Policy from time to time. We will notify you of any significant changes by posting the new policy on this page and updating the "Last updated" date.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}