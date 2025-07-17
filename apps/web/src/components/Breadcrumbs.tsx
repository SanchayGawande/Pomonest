'use client'

import { ChevronRight, Home } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

interface BreadcrumbItem {
  label: string
  href: string
}

interface BreadcrumbsProps {
  items?: BreadcrumbItem[]
  className?: string
}

export function Breadcrumbs({ items, className }: BreadcrumbsProps) {
  const pathname = usePathname()
  
  // Generate breadcrumbs from pathname if no items provided
  const breadcrumbs = items || generateBreadcrumbs(pathname)
  
  if (breadcrumbs.length <= 1) {
    return null // Don't show breadcrumbs for homepage or single-level pages
  }

  return (
    <nav className={`flex items-center space-x-1 text-sm text-muted-foreground mb-6 ${className || ''}`} aria-label="Breadcrumb">
      <ol className="flex items-center space-x-1">
        {breadcrumbs.map((item, index) => (
          <li key={item.href} className="flex items-center">
            {index > 0 && (
              <ChevronRight className="h-4 w-4 mx-1 text-muted-foreground/60" />
            )}
            {index === breadcrumbs.length - 1 ? (
              <span className="font-medium text-foreground" aria-current="page">
                {item.label}
              </span>
            ) : (
              <Link 
                href={item.href}
                className="hover:text-foreground transition-colors flex items-center gap-1"
              >
                {index === 0 && <Home className="h-4 w-4" />}
                {item.label}
              </Link>
            )}
          </li>
        ))}
      </ol>
    </nav>
  )
}

function generateBreadcrumbs(pathname: string): BreadcrumbItem[] {
  const pathSegments = pathname.split('/').filter(Boolean)
  
  // Always start with home
  const breadcrumbs: BreadcrumbItem[] = [
    { label: 'Home', href: '/' }
  ]

  // Map of path segments to user-friendly labels
  const labelMap: Record<string, string> = {
    'blog': 'Blog',
    'about': 'About',
    'contact': 'Contact',
    'faq': 'FAQ',
    'getting-started': 'Getting Started',
    'resources': 'Resources',
    'auth': 'Authentication',
    'login': 'Sign In',
    'dashboard': 'Dashboard',
    'settings': 'Settings',
    'privacy': 'Privacy Policy',
    'terms': 'Terms of Service',
    'admin': 'Admin',
    'ads': 'Ads Management',
    'complete-pomodoro-technique-guide-2025': 'Complete Pomodoro Guide',
    'how-to-focus-better-proven-techniques': 'Focus Better Guide',
    'productivity-tips-students': 'Student Productivity Tips',
    'building-focus-habits': 'Building Focus Habits',
    'pomodoro-technique-adhd': 'Pomodoro for ADHD',
    'team-productivity-remote-work': 'Team Productivity Guide'
  }

  let currentPath = ''
  
  pathSegments.forEach((segment, index) => {
    currentPath += `/${segment}`
    const label = labelMap[segment] || segment.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())
    
    breadcrumbs.push({
      label,
      href: currentPath
    })
  })

  return breadcrumbs
}