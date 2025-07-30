import { Metadata } from 'next'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Cookie, Settings, Shield, Eye, Zap } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Cookie Policy - PomoNest',
  description: 'Learn about how PomoNest uses cookies to enhance your experience and protect your privacy.',
}

export default function CookiePolicy() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/50">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-3 mb-4">
              <Cookie className="h-8 w-8 text-orange-600" />
              <h1 className="text-4xl font-bold">Cookie Policy</h1>
            </div>
            <p className="text-lg text-muted-foreground">
              Learn how we use cookies to enhance your PomoNest experience
            </p>
            <p className="text-sm text-muted-foreground mt-2">
              Last updated: {new Date().toLocaleDateString()}
            </p>
          </div>

          <div className="space-y-6">
            {/* What Are Cookies */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Cookie className="h-5 w-5" />
                  What Are Cookies?
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Cookies are small text files that are stored on your device when you visit a website. They help websites remember your preferences and provide a better user experience. PomoNest uses cookies responsibly and always with your consent.
                </p>
              </CardContent>
            </Card>

            {/* Types of Cookies We Use */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  Types of Cookies We Use
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="border-l-4 border-blue-500 pl-4">
                  <h3 className="font-semibold text-blue-900 mb-2">Necessary Cookies (Always Active)</h3>
                  <p className="text-muted-foreground mb-2">
                    These cookies are essential for the website to function properly and cannot be disabled.
                  </p>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• <strong>Authentication:</strong> Keep you logged in to your account</li>
                    <li>• <strong>Security:</strong> Protect against cross-site request forgery</li>
                    <li>• <strong>Session management:</strong> Maintain your session state</li>
                    <li>• <strong>Cookie consent:</strong> Remember your cookie preferences</li>
                  </ul>
                  <p className="text-xs text-muted-foreground mt-2">
                    <strong>Retention:</strong> Session cookies expire when you close your browser; persistent cookies last up to 1 year
                  </p>
                </div>

                <div className="border-l-4 border-green-500 pl-4">
                  <h3 className="font-semibold text-green-900 mb-2">Analytics Cookies (Optional)</h3>
                  <p className="text-muted-foreground mb-2">
                    Help us understand how visitors interact with our website to improve user experience.
                  </p>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• <strong>Google Analytics 4:</strong> Track page views, user interactions, and site performance</li>
                    <li>• <strong>Usage patterns:</strong> Understand which features are most valuable</li>
                    <li>• <strong>Error tracking:</strong> Identify and fix technical issues</li>
                  </ul>
                  <p className="text-xs text-muted-foreground mt-2">
                    <strong>Provider:</strong> Google Analytics | <strong>Retention:</strong> 26 months | <strong>Data:</strong> Anonymized IP addresses
                  </p>
                </div>

                <div className="border-l-4 border-purple-500 pl-4">
                  <h3 className="font-semibold text-purple-900 mb-2">Advertising Cookies (Optional)</h3>
                  <p className="text-muted-foreground mb-2">
                    Enable personalized advertisements that support our free service.
                  </p>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• <strong>Google AdSense:</strong> Serve relevant ads based on your interests</li>
                    <li>• <strong>Ad personalization:</strong> Show ads tailored to your preferences</li>
                    <li>• <strong>Frequency capping:</strong> Limit how often you see the same ad</li>
                  </ul>
                  <p className="text-xs text-muted-foreground mt-2">
                    <strong>Provider:</strong> Google AdSense | <strong>Retention:</strong> Up to 13 months | <strong>Opt-out:</strong> Available anytime
                  </p>
                </div>

                <div className="border-l-4 border-orange-500 pl-4">
                  <h3 className="font-semibold text-orange-900 mb-2">Functional Cookies (Optional)</h3>
                  <p className="text-muted-foreground mb-2">
                    Remember your preferences and settings to enhance your experience.
                  </p>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• <strong>Theme preferences:</strong> Remember your chosen light/dark mode</li>
                    <li>• <strong>Timer settings:</strong> Save your preferred Pomodoro durations</li>
                    <li>• <strong>Language settings:</strong> Remember your language preference</li>
                    <li>• <strong>Sound preferences:</strong> Remember your notification sound settings</li>
                  </ul>
                  <p className="text-xs text-muted-foreground mt-2">
                    <strong>Storage:</strong> Local browser storage | <strong>Retention:</strong> Until you clear browser data
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Third-Party Cookies */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Third-Party Services
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="font-semibold mb-2">Google Services</h3>
                  <p className="text-muted-foreground mb-2">
                    We use several Google services that may set their own cookies:
                  </p>
                  <ul className="text-sm text-muted-foreground space-y-1 ml-4">
                    <li>• <strong>Google Analytics:</strong> Web analytics service</li>
                    <li>• <strong>Google AdSense:</strong> Advertising platform</li>
                    <li>• <strong>Google OAuth:</strong> Authentication service</li>
                  </ul>
                  <p className="text-xs text-muted-foreground mt-2">
                    Learn more: <a href="https://policies.google.com/privacy" className="text-blue-600 hover:underline">Google Privacy Policy</a>
                  </p>
                </div>
                
                <div>
                  <h3 className="font-semibold mb-2">Stripe</h3>
                  <p className="text-muted-foreground">
                    For secure payment processing. Stripe may set cookies to prevent fraud and process payments securely.
                  </p>
                  <p className="text-xs text-muted-foreground mt-2">
                    Learn more: <a href="https://stripe.com/privacy" className="text-blue-600 hover:underline">Stripe Privacy Policy</a>
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Managing Cookies */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Eye className="h-5 w-5" />
                  Managing Your Cookie Preferences
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="font-semibold mb-2">PomoNest Cookie Settings</h3>
                  <p className="text-muted-foreground">
                    You can change your cookie preferences at any time using our cookie consent banner. Your choices will be remembered for future visits.
                  </p>
                </div>
                
                <div>
                  <h3 className="font-semibold mb-2">Browser Settings</h3>
                  <p className="text-muted-foreground mb-2">
                    You can also control cookies through your browser settings:
                  </p>
                  <ul className="text-sm text-muted-foreground space-y-1 ml-4">
                    <li>• <strong>Chrome:</strong> Settings → Privacy and security → Cookies</li>
                    <li>• <strong>Firefox:</strong> Preferences → Privacy & Security → Cookies</li>
                    <li>• <strong>Safari:</strong> Preferences → Privacy → Manage Website Data</li>
                    <li>• <strong>Edge:</strong> Settings → Cookies and site permissions</li>
                  </ul>
                </div>

                <div>
                  <h3 className="font-semibold mb-2">Opt-Out Links</h3>
                  <p className="text-muted-foreground mb-2">
                    You can opt out of specific tracking services:
                  </p>
                  <ul className="text-sm text-muted-foreground space-y-1 ml-4">
                    <li>• <a href="https://tools.google.com/dlpage/gaoptout" className="text-blue-600 hover:underline">Google Analytics Opt-out</a></li>
                    <li>• <a href="https://www.google.com/settings/ads" className="text-blue-600 hover:underline">Google Ads Settings</a></li>
                    <li>• <a href="http://optout.aboutads.info/" className="text-blue-600 hover:underline">Digital Advertising Alliance Opt-out</a></li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            {/* Impact of Disabling Cookies */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="h-5 w-5" />
                  Impact of Disabling Cookies
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  While you can disable cookies, doing so may affect your experience:
                </p>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="p-4 bg-red-50 rounded-lg border border-red-200">
                    <h4 className="font-semibold text-red-900 mb-2">Disabled Analytics Cookies</h4>
                    <ul className="text-sm text-red-700 space-y-1">
                      <li>• We can't improve the service based on usage data</li>
                      <li>• Technical issues may take longer to identify</li>
                    </ul>
                  </div>
                  <div className="p-4 bg-orange-50 rounded-lg border border-orange-200">
                    <h4 className="font-semibold text-orange-900 mb-2">Disabled Advertising Cookies</h4>
                    <ul className="text-sm text-orange-700 space-y-1">
                      <li>• You'll still see ads, but they won't be personalized</li>
                      <li>• Ads may be less relevant to your interests</li>
                    </ul>
                  </div>
                  <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <h4 className="font-semibold text-blue-900 mb-2">Disabled Functional Cookies</h4>
                    <ul className="text-sm text-blue-700 space-y-1">
                      <li>• Your preferences won't be remembered</li>
                      <li>• You'll need to reconfigure settings each visit</li>
                    </ul>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                    <h4 className="font-semibold text-gray-900 mb-2">Disabled Necessary Cookies</h4>
                    <ul className="text-sm text-gray-700 space-y-1">
                      <li>• The website may not function properly</li>
                      <li>• You cannot stay logged in</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Contact */}
            <Card>
              <CardHeader>
                <CardTitle>Questions About Our Cookie Policy?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  If you have any questions about how we use cookies, please contact us:
                </p>
                <div className="space-y-2 text-muted-foreground">
                  <p>Email: <a href="mailto:pomonest.legal@gmail.com" className="text-blue-600 hover:underline">pomonest.legal@gmail.com</a></p>
                  <p>We aim to respond within 48 hours</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}