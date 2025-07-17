import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { CleanAuthProvider } from '@/components/auth/CleanAuthProvider'
import { QueryProvider } from '@/components/QueryProvider'
import { ThemeProvider } from '@/components/ThemeProvider'
import { AdProvider } from '@/components/ads/AdProvider'
import { Footer } from '@/components/Footer'
import Script from 'next/script'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  metadataBase: new URL('https://pomonest.com'),
  title: 'PomoNest - Free Pomodoro Timer & Productivity App | Build Focus Habits',
  description: 'Free online Pomodoro timer with habit tracking, task management, and analytics. Build focus streaks and boost productivity with the proven 25/5 technique. No signup required.',
  keywords: 'pomodoro timer, productivity app, focus timer, habit tracker, time management, 25/5 technique, focus streaks, task management, free timer',
  authors: [{ name: 'PomoNest Team' }],
  creator: 'PomoNest',
  publisher: 'PomoNest',
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
    userScalable: false,
  },
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  icons: {
    icon: '/favicon.svg',
    shortcut: '/favicon.svg',
    apple: '/favicon.svg',
  },
  manifest: '/manifest.json',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://pomonest.com',
    title: 'PomoNest - Free Pomodoro Timer & Productivity App',
    description: 'Free online Pomodoro timer with habit tracking, task management, and analytics. Build focus streaks and boost productivity.',
    siteName: 'PomoNest',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'PomoNest - Pomodoro Timer App',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'PomoNest - Free Pomodoro Timer & Productivity App',
    description: 'Free online Pomodoro timer with habit tracking and analytics. Build focus streaks with the proven 25/5 technique.',
    images: ['/og-image.png'],
    creator: '@pomonest',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        {/* Google AdSense Verification */}
        <meta name="google-adsense-account" content="ca-pub-4205049019803904" />
        
        {/* Structured Data for Organization */}
        <Script id="organization-schema" type="application/ld+json" strategy="afterInteractive">
          {`
            {
              "@context": "https://schema.org",
              "@type": "Organization",
              "name": "PomoNest",
              "url": "https://pomonest.com",
              "logo": "https://pomonest.com/favicon.svg",
              "description": "Free Pomodoro timer and productivity app that helps users build focus habits and track productivity streaks.",
              "founder": {
                "@type": "Organization",
                "name": "PomoNest Team"
              },
              "contactPoint": {
                "@type": "ContactPoint",
                "telephone": "",
                "contactType": "customer service",
                "email": "pomonesthelpdesk@gmail.com",
                "availableLanguage": "English"
              },
              "sameAs": [
                "https://pomonest.com/about",
                "https://pomonest.com/blog"
              ]
            }
          `}
        </Script>
        
        {/* Structured Data for Website */}
        <Script id="website-schema" type="application/ld+json" strategy="afterInteractive">
          {`
            {
              "@context": "https://schema.org",
              "@type": "WebSite",
              "name": "PomoNest",
              "url": "https://pomonest.com",
              "description": "Free online Pomodoro timer with habit tracking, task management, and analytics. Build focus streaks and boost productivity with the proven 25/5 technique.",
              "potentialAction": {
                "@type": "SearchAction",
                "target": "https://pomonest.com/blog?q={search_term_string}",
                "query-input": "required name=search_term_string"
              },
              "publisher": {
                "@type": "Organization",
                "name": "PomoNest"
              }
            }
          `}
        </Script>
        
        {/* Structured Data for Software Application */}
        <Script id="software-application-schema" type="application/ld+json" strategy="afterInteractive">
          {`
            {
              "@context": "https://schema.org",
              "@type": "SoftwareApplication",
              "name": "PomoNest",
              "description": "Free Pomodoro timer and productivity app with habit tracking, task management, and analytics",
              "url": "https://pomonest.com",
              "applicationCategory": "ProductivityApplication",
              "operatingSystem": "Web Browser",
              "offers": {
                "@type": "Offer",
                "price": "0",
                "priceCurrency": "USD",
                "availability": "https://schema.org/InStock"
              },
              "aggregateRating": {
                "@type": "AggregateRating",
                "ratingValue": "4.8",
                "ratingCount": "127",
                "bestRating": "5",
                "worstRating": "1"
              },
              "featureList": [
                "25-minute Pomodoro timer",
                "Productivity streak tracking",
                "Task management",
                "Analytics and insights",
                "No signup required",
                "Mobile responsive"
              ]
            }
          `}
        </Script>
        
        {/* Google AdSense */}
        {process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID && (
          <Script
            async
            src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID}`}
            crossOrigin="anonymous"
            strategy="afterInteractive"
          />
        )}
        
        {/* Google Analytics 4 (GA4) - Your specific tracking ID */}
        <Script
          async
          src="https://www.googletagmanager.com/gtag/js?id=G-TXL346B71K"
          strategy="afterInteractive"
        />
        <Script id="google-analytics-4" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-TXL346B71K', {
              page_path: window.location.pathname,
              anonymize_ip: true,
              allow_google_signals: false,
              allow_ad_personalization_signals: false
            });
            console.log('📊 Google Analytics 4 initialized with ID: G-TXL346B71K');
          `}
        </Script>
      </head>
      <body className={inter.className}>
        <QueryProvider>
          <CleanAuthProvider>
            <ThemeProvider>
              <AdProvider>
                {children}
                <Footer />
              </AdProvider>
            </ThemeProvider>
          </CleanAuthProvider>
        </QueryProvider>
      </body>
    </html>
  )
}