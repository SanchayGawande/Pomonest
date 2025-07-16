import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Contact PomoNest - Get Support & Share Feedback',
  description: 'Contact PomoNest for support, feature requests, or bug reports. We love hearing from our users and are here to help you focus better.',
}

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}