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
                    We use Google Analytics 4 (GA4) to understand how users interact with our service. Analytics tracking requires your consent and can be disabled through our cookie preferences. We use anonymized IP addresses and have disabled advertising features for privacy protection.
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Advertising</h3>
                  <p className="text-muted-foreground">
                    We display advertisements through Google AdSense to support our free service. Ad personalization requires your explicit consent through our cookie banner. You can opt out of personalized ads while still supporting the service. All ads are clearly labeled as "Advertisement" and fully comply with the Coalition for Better Ads Standards, ensuring no intrusive ad experiences including pop-ups, auto-playing video ads with sound, or ads that interfere with content consumption.
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
                  <h3 className="font-semibold mb-2">Cookie Management</h3>
                  <p className="text-muted-foreground">
                    We use a comprehensive cookie consent system that allows you to choose which types of cookies to accept:
                  </p>
                  <ul className="mt-2 space-y-1 text-sm text-muted-foreground ml-4">
                    <li>• <strong>Necessary cookies:</strong> Required for basic site functionality (always enabled)</li>
                    <li>• <strong>Analytics cookies:</strong> Help us understand site usage (optional)</li>
                    <li>• <strong>Advertising cookies:</strong> Enable personalized ads (optional)</li>
                    <li>• <strong>Functional cookies:</strong> Remember your preferences (optional)</li>
                  </ul>
                  <p className="text-muted-foreground mt-2">
                    You can change your cookie preferences at any time through our cookie banner or browser settings.
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Data Retention</h3>
                  <p className="text-muted-foreground">
                    We retain your personal data only as long as necessary to provide our services. Account data is kept while your account is active and for up to 90 days after deletion to allow for account recovery. Analytics data is automatically deleted after 26 months.
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">GDPR & CCPA Rights</h3>
                  <p className="text-muted-foreground">
                    If you're located in the EU or California, you have additional rights including:
                  </p>
                  <ul className="mt-2 space-y-1 text-sm text-muted-foreground ml-4">
                    <li>• Right to access your personal data</li>
                    <li>• Right to rectify inaccurate data</li>
                    <li>• Right to delete your data ("right to be forgotten")</li>
                    <li>• Right to data portability</li>
                    <li>• Right to withdraw consent</li>
                    <li>• Right to object to processing</li>
                  </ul>
                  <p className="text-muted-foreground mt-2">
                    Contact us at pomonest.legal@gmail.com to exercise these rights.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Children's Privacy (COPPA) */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Children's Privacy (COPPA Compliance)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  PomoNest is designed as a general audience productivity application and is not specifically directed at children under 13 years of age.
                </p>
                <div className="space-y-3">
                  <div>
                    <h3 className="font-semibold mb-2">Age Requirements</h3>
                    <p className="text-muted-foreground">
                      Users must be 13 years or older to create an account. We do not knowingly collect personal information from children under 13.
                    </p>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Parental Notice</h3>
                    <p className="text-muted-foreground">
                      If we become aware that we have collected personal information from a child under 13, we will take steps to delete such information promptly. Parents who believe their child has provided us with personal information should contact us immediately.
                    </p>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Ad Targeting</h3>
                    <p className="text-muted-foreground">
                      We do not use interest-based advertising to target children under 13 or on content directed at children under 13, in compliance with COPPA requirements.
                    </p>
                  </div>
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
                  <p>Email: pomonest.legal@gmail.com</p>
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