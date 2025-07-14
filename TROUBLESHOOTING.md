# WorkStreak Troubleshooting Guide

## Common Issues and Solutions

### 1. "localhost refused to connect" - Next.js Server Won't Start

**Problem:** Server fails to start or stops unexpectedly when running `pnpm dev`

**Root Causes & Solutions:**

#### A. Missing PostCSS Dependencies
```bash
# Error: Cannot find module 'autoprefixer'
cd apps/web
pnpm add -D autoprefixer postcss

# Ensure postcss.config.js exists with:
module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}
```

#### B. TypeScript Compilation Errors
```bash
# Error: Property 'callbacks' is private
# Fix: Make callbacks public in shared timer package
# In packages/shared-timer/src/timer.ts:
public callbacks: TimerCallbacks;  // instead of private

# Rebuild shared package
cd packages/shared-timer
pnpm run build
```

#### C. Supabase Import Issues
```bash
# Error: You're importing a component that needs next/headers
# Fix: Use direct Supabase client instead of auth helpers
# In src/lib/supabase.ts:
import { createClient } from '@supabase/supabase-js'
export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey)
```

#### D. Port Conflicts
```bash
# Check what's using ports
lsof -ti:3000,3001,3005

# Kill existing processes
pkill -f "next dev"

# Use different port
# In package.json: "dev": "next dev --port 3005"
```

### 2. Reliable Server Startup Process

**Step-by-step startup that works:**

```bash
# 1. Navigate to project
cd "/Users/sanchay/AI project/streak-habit-forge"

# 2. Build shared timer package first
cd packages/shared-timer && pnpm run build

# 3. Install dependencies if needed
cd ../apps/web && pnpm install

# 4. Test build for errors
pnpm run build

# 5. Start development server in background
nohup pnpm dev > server.log 2>&1 & echo $! > server.pid

# 6. Wait and test
sleep 5 && curl -s http://localhost:3005

# 7. Open browser
open http://localhost:3005
```

### 3. Server Management Commands

```bash
# Check if server is running
curl http://localhost:3005

# View real-time logs
tail -f apps/web/server.log

# Stop server
kill $(cat apps/web/server.pid)

# Check running processes
ps aux | grep "next dev"

# Kill all Next.js processes
pkill -f "next dev"
```

### 4. Build vs Development Issues

**Always test build before dev:**
```bash
# This catches TypeScript and compilation errors early
pnpm run build

# Only start dev server if build succeeds
pnpm dev
```

### 5. Environment Variables

**Required .env.local structure:**
```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://wljubwzufbjojzyqmyyf.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# App
NEXTAUTH_URL=http://localhost:3005
NEXTAUTH_SECRET=your-secret
```

## Prevention Checklist

- [ ] Build shared packages before web app
- [ ] Test build before starting dev server
- [ ] Check for port conflicts
- [ ] Verify all dependencies are installed
- [ ] Ensure PostCSS config exists
- [ ] Use background process for stable server

## Quick Fix Command

When everything fails, run this complete reset:

```bash
cd "/Users/sanchay/AI project/streak-habit-forge"
pkill -f "next dev" || true
cd packages/shared-timer && pnpm run build
cd ../apps/web && pnpm install && pnpm run build
nohup pnpm dev > server.log 2>&1 & echo $! > server.pid
sleep 5 && open http://localhost:3005
```

---

**Last Updated:** July 13, 2025  
**Works For:** WorkStreak TurboRepo + Next.js 14 + Supabase setup