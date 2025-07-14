# WorkStreak - Comprehensive Testing Guide

## Overview

This guide provides comprehensive testing procedures for the WorkStreak application before deployment. It covers both automated testing and manual browser testing to ensure all features work correctly.

## Prerequisites

### Development Environment Setup

1. **Install Dependencies**
   ```bash
   cd /path/to/streak-habit-forge
   pnpm install
   ```

2. **Environment Variables**
   Create `.env.local` file in `apps/web/` with:
   ```env
   # Supabase Configuration
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

   # Stripe Configuration (Use test keys)
   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
   STRIPE_SECRET_KEY=sk_test_...
   NEXT_PUBLIC_STRIPE_PRICE_ID_MONTHLY=price_test_monthly
   NEXT_PUBLIC_STRIPE_PRICE_ID_YEARLY=price_test_yearly
   STRIPE_WEBHOOK_SECRET=whsec_test_...

   # App Configuration
   NEXTAUTH_URL=http://localhost:3005
   NEXTAUTH_SECRET=your_secret_key
   ```

3. **Database Setup**
   - Ensure Supabase database is set up with proper tables
   - Verify RLS (Row Level Security) policies are active
   - Test database connectivity

## Automated Testing

### Running All Tests

```bash
# From project root
pnpm test

# Or from apps/web
cd apps/web && pnpm test
```

### Specific Test Suites

```bash
# Timer Engine Tests
cd packages/shared-timer && pnpm test

# Authentication Tests
cd apps/web && pnpm test auth

# API Route Tests
cd apps/web && pnpm test api

# UI Component Tests
cd apps/web && pnpm test ui
```

### End-to-End Tests

```bash
# Run E2E tests with Playwright
cd apps/web && pnpm test:e2e

# Run E2E tests with UI mode
cd apps/web && pnpm test:e2e:ui
```

## Manual Testing Checklist

### 1. Application Startup

- [ ] **Development Server**
  ```bash
  cd apps/web && pnpm dev
  ```
  - Verify server starts on http://localhost:3005
  - Check for console errors
  - Confirm page loads correctly

- [ ] **Browser Console**
  - No critical errors in browser console
  - Check Network tab for failed requests
  - Verify no 404 or 500 errors

### 2. Timer Functionality (Guest Mode)

#### Basic Timer Operations
- [ ] **Default Timer Display**
  - Shows 25:00 initially
  - Play/pause button visible
  - Reset button visible
  - Settings accessible

- [ ] **Start Timer**
  - Click play button
  - Timer begins counting down (25:00 → 24:59 → ...)
  - Button changes to pause
  - Timer displays correctly formatted time

- [ ] **Pause Timer**
  - Click pause during countdown
  - Timer stops at current time
  - Button changes back to play
  - Can resume from paused time

- [ ] **Reset Timer**
  - Click reset button
  - Timer returns to original duration
  - Confirms reset if timer was running

- [ ] **Timer Completion**
  - Let timer run to 00:00
  - Notification/alert appears
  - Automatically switches to break mode
  - Session count increments

#### Break Functionality
- [ ] **Short Break (5 minutes)**
  - Activates after work session
  - Shows 05:00 duration
  - Functions same as work timer
  - Returns to work after completion

- [ ] **Long Break (15 minutes)**
  - Activates after 4th work session
  - Shows 15:00 duration
  - Session counter resets appropriately

#### Settings Customization
- [ ] **Work Duration**
  - Change work duration (15-60 minutes)
  - Setting persists in localStorage
  - Timer updates immediately when not running

- [ ] **Break Durations**
  - Modify short break (1-15 minutes)
  - Modify long break (10-30 minutes)
  - Settings save correctly

- [ ] **Long Break Interval**
  - Change from default 4 sessions
  - Test different intervals (2, 3, 5, 6)
  - Verify long break triggers correctly

- [ ] **Auto-start Options**
  - Enable/disable auto-start breaks
  - Enable/disable auto-start work sessions
  - Test functionality with different combinations

### 3. Authentication System

#### Google OAuth
- [ ] **Sign In Process**
  - Click "Continue with Google"
  - Redirected to Google OAuth
  - Consent screen appears
  - Successful redirect back to app
  - User is logged in

- [ ] **Sign Out Process**
  - Sign out button visible when logged in
  - Click sign out
  - Redirected to login screen
  - Session cleared properly

#### Apple OAuth (if configured)
- [ ] **Sign In Process**
  - Click "Continue with Apple"
  - Apple OAuth flow
  - Successful authentication
  - User logged in

#### Session Management
- [ ] **Session Persistence**
  - Refresh page while logged in
  - User remains logged in
  - Session data preserved

- [ ] **Session Expiry**
  - Test with expired tokens
  - Proper redirect to login
  - Clean error handling

### 4. Pro Features & Payment System

#### Free vs Pro Feature Access
- [ ] **Free User Limitations**
  - Ads display properly (if implemented)
  - Pro features show upgrade prompts
  - Basic timer functionality works

- [ ] **Pro Upgrade Modal**
  - Click upgrade to Pro
  - Modal displays pricing plans
  - Plan details show correctly
  - Monthly vs Yearly options

#### Stripe Integration (Test Mode)
- [ ] **Monthly Plan Purchase**
  - Select monthly plan ($2.49)
  - Redirected to Stripe Checkout
  - Use test card: 4242 4242 4242 4242
  - Complete purchase successfully
  - Redirected back with success message

- [ ] **Yearly Plan Purchase**
  - Select yearly plan ($14.99)
  - Complete Stripe checkout
  - Verify discount messaging
  - Successful purchase flow

- [ ] **Payment Failure Handling**
  - Use declined test card: 4000 0000 0000 0002
  - Verify error handling
  - User can retry payment

#### Pro Status Verification
- [ ] **After Successful Payment**
  - Pro status updates immediately
  - Pro badge/indicator shows
  - Pro features become accessible
  - Ads removed (if applicable)

### 5. Data Persistence & Sync

#### Guest Mode (Local Storage)
- [ ] **Settings Persistence**
  - Change timer settings
  - Refresh page
  - Settings remain changed

- [ ] **Session Stats**
  - Complete several sessions
  - Stats saved locally
  - Survive page refresh

#### Authenticated Mode (Database)
- [ ] **User Profile Creation**
  - New user gets database entry
  - Profile data saved correctly
  - Pro status tracks accurately

- [ ] **Cross-Device Sync**
  - Sign in on different browser/device
  - Settings sync across devices
  - Session data available everywhere

### 6. User Interface & Experience

#### Responsive Design
- [ ] **Desktop (1920x1080)**
  - Layout looks proper
  - All elements accessible
  - Good spacing and typography

- [ ] **Tablet (768x1024)**
  - Responsive layout
  - Touch-friendly buttons
  - No horizontal scroll

- [ ] **Mobile (375x667)**
  - Mobile-optimized layout
  - Easy touch interactions
  - All features accessible

#### Theme & Styling
- [ ] **Light Theme**
  - Default theme loads
  - Good contrast and readability
  - Icons and buttons visible

- [ ] **Dark Theme** (Pro Feature)
  - Toggle works for Pro users
  - All elements properly themed
  - No color contrast issues

#### Animations & Interactions
- [ ] **Timer Animations**
  - Progress ring animates smoothly
  - Transitions are smooth
  - No performance issues

- [ ] **Button Interactions**
  - Hover states work
  - Click feedback clear
  - Loading states display

### 7. Performance Testing

#### Load Times
- [ ] **Initial Page Load**
  - Page loads in < 3 seconds
  - Critical content visible quickly
  - Progressive loading works

- [ ] **Navigation Performance**
  - Route changes are instant
  - No flickering during transitions
  - Smooth user experience

#### Memory Usage
- [ ] **Long-Running Timer**
  - Run timer for 2+ hours
  - No memory leaks detected
  - Performance remains stable

- [ ] **Multiple Sessions**
  - Complete 10+ timer sessions
  - Check for memory issues
  - Browser remains responsive

### 8. Error Handling & Edge Cases

#### Network Issues
- [ ] **Offline Behavior**
  - Disconnect internet
  - Timer continues working
  - Graceful degradation

- [ ] **API Failures**
  - Mock API failures
  - Error messages display
  - User can recover gracefully

#### Browser Compatibility
- [ ] **Chrome (Latest)**
  - Full functionality works
  - No console errors
  - Good performance

- [ ] **Firefox (Latest)**
  - Cross-browser compatibility
  - Feature parity with Chrome
  - No JavaScript errors

- [ ] **Safari (Latest)**
  - Works on macOS/iOS
  - WebKit compatibility
  - Timer accuracy maintained

- [ ] **Edge (Latest)**
  - Microsoft Edge support
  - Full feature compatibility
  - No browser-specific issues

### 9. Security Testing

#### Authentication Security
- [ ] **JWT Token Handling**
  - Tokens stored securely
  - Automatic refresh works
  - No tokens in URL/logs

- [ ] **Route Protection**
  - Protected routes require auth
  - Unauthorized access blocked
  - Proper redirects

#### Payment Security
- [ ] **Stripe Integration**
  - No sensitive data exposed
  - HTTPS enforced
  - Webhook verification works

- [ ] **Input Validation**
  - Form inputs validated
  - SQL injection prevented
  - XSS protection active

### 10. Database & Backend Testing

#### Database Operations
- [ ] **User CRUD Operations**
  - Create user profiles
  - Read user data
  - Update preferences
  - Delete operations (if applicable)

- [ ] **Session Tracking**
  - Sessions logged correctly
  - Statistics calculated properly
  - Data integrity maintained

#### API Endpoints
- [ ] **Authentication Endpoints**
  - `/api/check-pro-status` works
  - Proper error responses
  - Security headers present

- [ ] **Payment Endpoints**
  - `/api/create-checkout` functions
  - Webhook handling works
  - Pro status updates correctly

## Testing Scenarios

### Scenario 1: New User Journey
1. Open app for first time
2. Use timer in guest mode
3. Complete 2-3 sessions
4. Sign up with Google
5. Data syncs correctly
6. Settings preserved

### Scenario 2: Pro Upgrade Flow
1. Sign in as free user
2. Attempt to access Pro feature
3. See upgrade modal
4. Complete purchase (test mode)
5. Pro status activates
6. All Pro features accessible

### Scenario 3: Multi-Device Usage
1. Set up account on desktop
2. Customize timer settings
3. Complete some sessions
4. Sign in on mobile
5. Verify data sync
6. Use timer on mobile

### Scenario 4: Extended Usage
1. Use timer for full work day
2. Complete 8+ pomodoro sessions
3. Test different timer configurations
4. Verify performance remains good
5. Check data accuracy

## Common Issues & Solutions

### Timer Not Starting
- Check JavaScript console for errors
- Verify timer state management
- Ensure proper component mounting

### Authentication Failures
- Verify Supabase configuration
- Check environment variables
- Confirm OAuth provider setup

### Payment Issues
- Ensure Stripe test mode active
- Verify webhook endpoints
- Check environment variables

### Performance Problems
- Monitor memory usage
- Check for memory leaks
- Verify timer cleanup on unmount

## Deployment Readiness Checklist

- [ ] All automated tests pass
- [ ] Manual testing completed
- [ ] Performance benchmarks met
- [ ] Security review completed
- [ ] Environment variables configured
- [ ] Database migrations ready
- [ ] Error monitoring configured
- [ ] Analytics tracking verified

## Post-Deployment Verification

1. **Production Environment**
   - App loads correctly
   - All features functional
   - No console errors

2. **Payment Processing**
   - Switch to live Stripe keys
   - Test with real payment
   - Verify webhook delivery

3. **Performance Monitoring**
   - Set up monitoring alerts
   - Track key metrics
   - Monitor error rates

4. **User Feedback**
   - Collect initial user feedback
   - Monitor support requests
   - Track usage analytics

---

## Test Results Template

```markdown
# Test Results - [Date]

## Automated Tests
- [ ] Timer Engine Tests: PASS/FAIL
- [ ] Authentication Tests: PASS/FAIL
- [ ] API Tests: PASS/FAIL
- [ ] E2E Tests: PASS/FAIL

## Manual Testing
- [ ] Basic Timer: PASS/FAIL
- [ ] Authentication: PASS/FAIL
- [ ] Payment Flow: PASS/FAIL
- [ ] Performance: PASS/FAIL

## Issues Found
1. [Issue description]
2. [Issue description]

## Deployment Ready: YES/NO
```

---

**Note**: This testing guide should be updated as new features are added to the application. Each release should go through this complete testing process before deployment.