import { Metadata } from 'next'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { FileText, Users, CreditCard, Shield, AlertTriangle } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Terms of Service - PomoNest',
  description: 'Terms of Service for PomoNest - Pomodoro timer and productivity application.',
}

export default function TermsOfService() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/50">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-3 mb-4">
              <FileText className="h-8 w-8 text-blue-600" />
              <h1 className="text-4xl font-bold">Terms of Service</h1>
            </div>
            <p className="text-lg text-muted-foreground">
              Terms and conditions for using PomoNest
            </p>
            <p className="text-sm text-muted-foreground mt-2">
              Last updated: {new Date().toLocaleDateString()}
            </p>
          </div>

          <div className="space-y-6">
            {/* Acceptance of Terms */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Acceptance of Terms
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  By accessing and using PomoNest, you accept and agree to be bound by the terms and provision of this agreement. 
                  If you do not agree to abide by the above, please do not use this service.
                </p>
              </CardContent>
            </Card>

            {/* Description of Service */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Description of Service
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">
                  PomoNest is a productivity application that provides:
                </p>
                <ul className="space-y-2 text-muted-foreground ml-4">
                  <li>• Pomodoro timer functionality (25/5 minute intervals)</li>
                  <li>• Habit tracking and streak monitoring</li>
                  <li>• Task management and productivity analytics</li>
                  <li>• Optional Pro subscription features</li>
                  <li>• Guest mode usage without account creation</li>
                </ul>
              </CardContent>
            </Card>

            {/* User Accounts */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  User Accounts and Responsibilities
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="font-semibold mb-2">Account Creation</h3>
                  <p className="text-muted-foreground">
                    You may create an account using Google or Apple OAuth. You are responsible for maintaining the confidentiality of your account credentials.
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Guest Usage</h3>
                  <p className="text-muted-foreground">
                    You may use PomoNest without creating an account. Guest data is stored locally in your browser and is not backed up.
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Acceptable Use</h3>
                  <p className="text-muted-foreground">
                    You agree to use PomoNest only for lawful purposes and in a way that does not infringe the rights of others or restrict their use of the service.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Pro Subscription */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5" />
                  Pro Subscription Terms
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="font-semibold mb-2">Subscription Plans</h3>
                  <p className="text-muted-foreground">
                    PomoNest Pro is available as monthly ($2.49) or yearly ($14.99) subscription plans, processed through Stripe.
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Pro Features</h3>
                  <ul className="space-y-1 text-muted-foreground ml-4">
                    <li>• Ad-free experience</li>
                    <li>• Advanced analytics and insights</li>
                    <li>• Cloud sync across devices</li>
                    <li>• Streak protection with Save Passes</li>
                    <li>• Premium visual themes</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Billing and Cancellation</h3>
                  <p className="text-muted-foreground">
                    Subscriptions renew automatically. You may cancel at any time through your account settings. 
                    Refunds are handled according to our refund policy and applicable laws.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Privacy and Data */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Privacy and Data Protection
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Your privacy is important to us. Please review our Privacy Policy to understand how we collect, 
                  use, and protect your information. By using PomoNest, you consent to the collection and use of 
                  information as outlined in our Privacy Policy.
                </p>
              </CardContent>
            </Card>

            {/* Intellectual Property */}
            <Card>
              <CardHeader>
                <CardTitle>Intellectual Property Rights</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">
                  The PomoNest service and its original content, features, and functionality are and will remain 
                  the exclusive property of PomoNest and its licensors. The service is protected by copyright, 
                  trademark, and other laws.
                </p>
                <p className="text-muted-foreground">
                  You retain ownership of any content you create using PomoNest (such as task lists and productivity data).
                </p>
              </CardContent>
            </Card>

            {/* Disclaimers */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5" />
                  Disclaimers and Limitations
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="font-semibold mb-2">Service Availability</h3>
                  <p className="text-muted-foreground">
                    We strive to maintain 99.9% uptime but cannot guarantee uninterrupted service. 
                    Maintenance, updates, and technical issues may occasionally affect availability.
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Data Backup</h3>
                  <p className="text-muted-foreground">
                    While we implement backup systems, you are encouraged to export your data regularly. 
                    We are not liable for data loss due to technical failures.
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Third-Party Services</h3>
                  <p className="text-muted-foreground">
                    PomoNest integrates with third-party services (Google, Apple, Stripe). 
                    We are not responsible for the availability or functionality of these external services.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Termination */}
            <Card>
              <CardHeader>
                <CardTitle>Termination</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  You may terminate your account at any time by contacting us or using account deletion features. 
                  We may terminate or suspend your account if you violate these terms. Upon termination, 
                  your right to use the service ceases immediately.
                </p>
              </CardContent>
            </Card>

            {/* Changes to Terms */}
            <Card>
              <CardHeader>
                <CardTitle>Changes to Terms</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  We reserve the right to modify these terms at any time. We will notify users of significant changes 
                  via email or through the application. Your continued use of PomoNest after changes constitutes 
                  acceptance of the new terms.
                </p>
              </CardContent>
            </Card>

            {/* Governing Law */}
            <Card>
              <CardHeader>
                <CardTitle>Governing Law</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  These terms are governed by and construed in accordance with the laws of the United States. 
                  Any disputes arising from these terms will be resolved through binding arbitration or in the courts of the United States.
                </p>
              </CardContent>
            </Card>

            {/* Contact Information */}
            <Card>
              <CardHeader>
                <CardTitle>Contact Information</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  If you have any questions about these Terms of Service, please contact us:
                </p>
                <div className="space-y-2 text-muted-foreground">
                  <p>Email: pomonest.legal@gmail.com</p>
                  <p>Response time: We aim to respond within 48 hours</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}