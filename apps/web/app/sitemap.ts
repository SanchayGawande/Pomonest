import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://pomonest.com'
  
  // Static pages
  const staticPages = [
    '',
    '/about',
    '/contact',
    '/privacy',
    '/terms', 
    '/cookies',
    '/faq',
    '/getting-started',
    '/resources',
    '/landing'
  ]
  
  // Blog pages
  const blogPages = [
    '/blog',
    '/blog/complete-pomodoro-technique-guide-2025',
    '/blog/pomodoro-technique-adhd',
    '/blog/how-to-focus-better',
    '/blog/productivity-tips-students',
    '/blog/building-focus-habits',
    '/blog/team-productivity-remote-work',
    '/blog/what-is-pomodoro-technique'
  ]
  
  const sitemap: MetadataRoute.Sitemap = [
    // Static pages
    ...staticPages.map(page => ({
      url: `${baseUrl}${page}`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: page === '' ? 1 : 0.8
    })),
    
    // Blog pages
    ...blogPages.map(page => ({
      url: `${baseUrl}${page}`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: page === '/blog' ? 0.9 : 0.7
    }))
  ]
  
  return sitemap
}