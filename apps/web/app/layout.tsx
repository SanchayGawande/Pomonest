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
  title: 'Pomodoro Timer Free - Focus Tracker & Habit Streaks',
  description: 'Free Pomodoro timer with streak tracking, save passes & analytics. Boost focus with the proven 25/5 technique. No signup required - start now!',
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
    title: 'Pomodoro Timer Free - Focus Tracker & Habit Streaks',
    description: 'Free Pomodoro timer with streak tracking, save passes & analytics. Boost focus with the proven 25/5 technique. No signup required - start now!',
    siteName: 'PomoNest',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'PomoNest - Free Pomodoro Timer with Habit Streaks',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Pomodoro Timer Free - Focus Tracker & Habit Streaks',
    description: 'Free Pomodoro timer with streak tracking, save passes & analytics. Boost focus with the proven 25/5 technique. No signup required!',
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
        
        {/* FAQ Schema for Homepage */}
        <Script id="faq-schema" type="application/ld+json" strategy="afterInteractive">
          {`
            {
              "@context": "https://schema.org",
              "@type": "FAQPage",
              "mainEntity": [
                {
                  "@type": "Question",
                  "name": "What is the Pomodoro Technique and how does it work?",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "The Pomodoro Technique is a time management method created by Francesco Cirillo that breaks work into 25-minute focused intervals called 'pomodoros,' followed by 5-minute breaks. After completing 4 pomodoros, you take a longer 15-30 minute break. This technique leverages the brain's natural attention cycles to maximize focus and prevent burnout."
                  }
                },
                {
                  "@type": "Question", 
                  "name": "How is PomoNest different from other Pomodoro timers?",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "PomoNest goes beyond basic timing by adding habit streak tracking, save passes that protect your streaks when life happens, comprehensive analytics to track your productivity patterns, and multiple themes. It's designed to build long-term focus habits, not just time individual sessions."
                  }
                },
                {
                  "@type": "Question",
                  "name": "Do I need to create an account to use PomoNest?", 
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "No account required! You can start using PomoNest immediately as a guest user. However, creating a free account unlocks streak tracking, analytics, and the ability to save your settings across devices. Pro users get additional features like save passes and ad-free experience."
                  }
                },
                {
                  "@type": "Question",
                  "name": "What are save passes and how do they work?",
                  "acceptedAnswer": {
                    "@type": "Answer", 
                    "text": "Save passes are a Pro feature that automatically protect your productivity streaks when you miss a day. Instead of losing your streak completely, a save pass is used to maintain your progress. Pro users get 3 save passes monthly or 12 yearly, ensuring life's interruptions don't derail your long-term habits."
                  }
                }
              ]
            }
          `}
        </Script>
        
        {/* HowTo Schema for Pomodoro Process */}
        <Script id="howto-schema" type="application/ld+json" strategy="afterInteractive">
          {`
            {
              "@context": "https://schema.org",
              "@type": "HowTo",
              "name": "How to Use the Pomodoro Technique",
              "description": "Step-by-step guide to implementing the Pomodoro Technique for better focus and productivity",
              "totalTime": "PT30M",
              "estimatedCost": {
                "@type": "MonetaryAmount",
                "currency": "USD", 
                "value": "0"
              },
              "supply": [
                {
                  "@type": "HowToSupply",
                  "name": "Timer or Pomodoro app"
                },
                {
                  "@type": "HowToSupply", 
                  "name": "Task or project to work on"
                },
                {
                  "@type": "HowToSupply",
                  "name": "Distraction-free workspace"
                }
              ],
              "step": [
                {
                  "@type": "HowToStep",
                  "name": "Choose Your Task",
                  "text": "Select a specific task or project you want to work on. Focus on a single objective rather than multitasking.",
                  "url": "https://pomonest.com#step-1"
                },
                {
                  "@type": "HowToStep", 
                  "name": "Set Timer for 25 Minutes",
                  "text": "Use a physical timer, smartphone app, or online Pomodoro timer. The 25-minute duration is scientifically optimized for sustained attention.",
                  "url": "https://pomonest.com#step-2"
                },
                {
                  "@type": "HowToStep",
                  "name": "Work With Complete Focus", 
                  "text": "During the 25-minute session, eliminate all distractions. Turn off notifications, close unnecessary browser tabs, and commit fully to your chosen task.",
                  "url": "https://pomonest.com#step-3"
                },
                {
                  "@type": "HowToStep",
                  "name": "Take a 5-Minute Break",
                  "text": "When the timer rings, immediately stop working and take a short break. Stand up, stretch, hydrate, or briefly step outside.",
                  "url": "https://pomonest.com#step-4"
                },
                {
                  "@type": "HowToStep",
                  "name": "Repeat the Cycle", 
                  "text": "Return to work for another 25-minute session. After completing four pomodoros, reward yourself with a longer break of 15-30 minutes.",
                  "url": "https://pomonest.com#step-5"
                }
              ]
            }
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