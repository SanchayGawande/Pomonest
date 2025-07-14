# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

WorkStreak is an advanced productivity application featuring a sophisticated Pomodoro timer with extensive customization, habit tracking, progress visualization, authentication, and Pro features. It includes comprehensive animations, multiple themes, task management, analytics, and social features.

## Tech Stack

- **Frontend**: Next.js 14.1.0 with React 18.3.1 and TypeScript
- **UI Library**: shadcn/ui (Radix UI + Tailwind CSS)
- **Animation**: Framer Motion with extensive animations throughout the app
- **State Management**: TanStack Query (React Query)
- **Authentication**: Supabase with custom auth provider
- **Payments**: Stripe integration for Pro features
- **Database**: Supabase PostgreSQL
- **Styling**: Tailwind CSS with advanced custom WorkStreak theme system
- **Shared Logic**: Custom shared-timer package for timer engine
- **Package Manager**: pnpm with workspace support

## Development Commands

```bash
# Install dependencies (using pnpm for workspace support)
pnpm install

# Start development server (Next.js app on port 3005)
pnpm dev
# or directly: cd apps/web && pnpm run dev

# Build for production
pnpm build

# Run ESLint
pnpm lint

# Format code
pnpm format
```

## Project Structure

```
/apps/web/            # Main Next.js application
├── app/              # Next.js App Router
│   ├── page.tsx      # Main timer interface
│   ├── layout.tsx    # Root layout with providers
│   ├── auth/         # Authentication pages
│   ├── dashboard/    # Dashboard page
│   └── api/          # API routes (Stripe, notifications)
├── src/components/   # React components
│   ├── ui/           # shadcn/ui components library
│   ├── auth/         # Authentication components
│   ├── ads/          # Ad system components
│   ├── PomodoroTimer.tsx # Basic timer component
│   ├── EnhancedPomodoroTimer.tsx # Advanced timer
│   ├── TaskManager.tsx # Task management system
│   ├── AnalyticsDashboard.tsx # Analytics and reports
│   └── [many more]   # Theme providers, animations, etc.
└── src/lib/          # Utility functions and integrations

/packages/shared-timer/ # Shared timer engine
├── src/
│   ├── timer.ts      # Core timer logic
│   └── index.ts      # Exports
```

## Key Configuration

- **Path Alias**: `@` maps to `./src` directory  
- **Port**: Development server runs on port 3005
- **TypeScript**: Configured for Next.js
- **Theme**: Advanced WorkStreak theme system with multiple color schemes
- **Environment**: Comprehensive .env.local with Supabase, Stripe, etc.

## Component Architecture

The app uses shadcn/ui components with extensive customization. Components feature:
- Framer Motion animations throughout
- Multiple theme variants (Ocean, Forest, Sunset, etc.)
- Advanced settings system with tabs
- Custom hooks for authentication and state management

## Routing Structure

Next.js App Router structure:
- `/` - Advanced timer interface with all features
- `/auth/login` - Authentication page
- `/dashboard` - User dashboard (authenticated)
- `/demo` - Demo mode
- `/settings` - User settings
- `/admin/ads` - Ad management

## Testing

**Note**: No testing framework is currently configured. When implementing tests, consider adding Vitest (works well with Vite) or Jest.

## Important Notes

1. This is a Lovable project - changes can be made through the Lovable platform, locally, or in GitHub
2. No environment variables are currently required
3. The project uses relaxed TypeScript settings - be cautious about type safety
4. All UI components follow the shadcn/ui pattern with consistent styling
5. Custom theme colors: WorkStreak brand colors, gradients (streak, focus, hero), and animations are defined in Tailwind config

## Troubleshooting

If you encounter "localhost refused to connect" or server startup issues, see `TROUBLESHOOTING.md` for detailed solutions. Common fixes:

```bash
# Quick fix command for server issues
cd packages/shared-timer && pnpm run build
cd ../apps/web && pnpm run build && pnpm dev
```