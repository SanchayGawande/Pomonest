import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { CleanAuthProvider } from '@/components/auth/CleanAuthProvider'
import { QueryProvider } from '@/components/QueryProvider'
import { ThemeProvider } from '@/components/ThemeProvider'
import { AdProvider } from '@/components/ads/AdProvider'
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
        
        {/* Google AdSense */}
        {process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID && (
          <Script
            async
            src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID}`}
            crossOrigin="anonymous"
            strategy="afterInteractive"
          />
        )}
        
        {/* Google Analytics */}
        {process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID}`}
              strategy="afterInteractive"
            />
            <Script id="google-analytics" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID}');
              `}
            </Script>
          </>
        )}
      </head>
      <body className={inter.className}>
        <QueryProvider>
          <CleanAuthProvider>
            <ThemeProvider>
              <AdProvider>
                {children}
              </AdProvider>
            </ThemeProvider>
          </CleanAuthProvider>
        </QueryProvider>
      </body>
    </html>
  )
}