# WorkStreak Manual Testing Checklist

## 🔒 Security Testing (COMPLETED)

- [x] API endpoints require authentication
- [x] Input validation with Zod schemas
- [x] No exposed credentials in repository
- [x] Insecure direct object references fixed
- [x] Environment variables properly protected

---

## 🔑 Authentication Flow Testing

### Test Environment: http://localhost:3005

### Landing Page
- [ ] Navigate to http://localhost:3005
- [ ] Verify landing page loads correctly
- [ ] Check "Try Demo" button works
- [ ] Verify "Sign In" redirects to authentication

### Google OAuth Flow
- [ ] Click "Sign in with Google"
- [ ] Complete Google authentication
- [ ] Verify redirect to dashboard after successful login
- [ ] Check that user profile is created in database
- [ ] Test signing out and verify redirect to landing page

### Session Management
- [ ] After signing in, refresh the browser page
- [ ] Verify user remains logged in
- [ ] Open new tab and navigate to app
- [ ] Verify user is automatically logged in
- [ ] Try accessing /dashboard while logged out
- [ ] Verify redirect to login

---

## ⏱️ Core Timer Functionality

### Basic Timer Operations
- [ ] Start a 25-minute Pomodoro session
- [ ] Verify timer displays correctly (25:00)
- [ ] Test pause button - timer should pause
- [ ] Test resume button - timer should continue
- [ ] Test reset button - timer should return to 25:00

### Timer Accuracy
- [ ] Let timer run for 30 seconds
- [ ] Verify countdown is accurate (24:30)
- [ ] Test in different browser tabs
- [ ] Verify timer continues when tab is backgrounded

### Session Completion
- [ ] Complete a full 25-minute session (or use browser dev tools to speed up)
- [ ] Verify celebration animation appears
- [ ] Check that session is saved to database
- [ ] Verify break mode activates (5-minute timer)
- [ ] Complete break and verify return to work mode

---

## 🔥 Streak System Testing

### First Session
- [ ] Complete first Pomodoro session ever
- [ ] Verify streak counter shows "1 day"
- [ ] Check database for streak record creation

### Daily Streaks
- [ ] Complete session on consecutive days
- [ ] Verify streak increments properly
- [ ] Check "longest streak" tracking

### Save Pass System (Pro Users Only)
- [ ] Upgrade to Pro (or simulate in database)
- [ ] Miss a day intentionally
- [ ] Verify save pass is consumed automatically
- [ ] Check save pass count decreases
- [ ] Test behavior when save passes are exhausted

---

## 💳 Payment Flow Testing

### Stripe Checkout
- [ ] Click "Upgrade to Pro" button
- [ ] Verify Stripe checkout modal opens
- [ ] Test monthly plan selection
- [ ] Test yearly plan selection
- [ ] Use Stripe test card: 4242 4242 4242 4242

### Payment Completion
- [ ] Complete test payment
- [ ] Verify redirect back to dashboard with success message
- [ ] Check that user is upgraded to Pro in database
- [ ] Verify save passes are allocated (3 for monthly, 12 for yearly)
- [ ] Test that ads are no longer displayed

### Payment Errors
- [ ] Use declined test card: 4000 0000 0000 0002
- [ ] Verify error handling and user feedback
- [ ] Test payment cancellation

---

## 📺 Ad System Testing

### Free User Experience
- [ ] Sign in as free user
- [ ] Verify banner ad displays at top of dashboard
- [ ] Check sidebar ads appear between stats cards
- [ ] Complete a Pomodoro session
- [ ] Verify interstitial ad appears during break
- [ ] Test ad click tracking (check console/analytics)

### Pro User Experience
- [ ] Sign in as Pro user
- [ ] Verify NO ads are displayed anywhere
- [ ] Complete sessions and verify ad-free experience

### Ad Blocker Detection
- [ ] Install ad blocker (uBlock Origin, etc.)
- [ ] Refresh page as free user
- [ ] Verify ad blocker detection message
- [ ] Check Pro upgrade prompt appears

---

## 📊 Admin Dashboard Testing

### Access Control
- [ ] Try accessing /admin/ads without admin privileges
- [ ] Verify access denied message
- [ ] Sign in as admin (check admin email in code)
- [ ] Verify admin dashboard loads

### Ad Analytics
- [ ] View ad performance metrics
- [ ] Check impression/click tracking
- [ ] Test export functionality
- [ ] Verify real-time updates

---

## ⚙️ Settings & Preferences

### Theme Toggle
- [ ] Test light/dark mode toggle
- [ ] Verify theme persists across page refreshes
- [ ] Check theme applies to all components

### Notification Settings
- [ ] Test notification permission request
- [ ] Enable/disable notifications
- [ ] Verify settings are saved

### Profile Management
- [ ] Update user profile information
- [ ] Verify changes are saved to database
- [ ] Test profile picture updates (if implemented)

---

## 📱 Cross-Platform Testing

### Desktop Browsers
- [ ] Chrome (latest)
  - [ ] Timer functionality
  - [ ] Payment flow
  - [ ] Authentication
- [ ] Firefox (latest)
  - [ ] Timer accuracy
  - [ ] Ad display
  - [ ] Session management
- [ ] Safari (latest)
  - [ ] OAuth flow
  - [ ] Local storage
  - [ ] Timer precision
- [ ] Edge (latest)
  - [ ] All core functionality
  - [ ] Payment processing

### Mobile Devices
- [ ] iOS Safari
  - [ ] Touch interactions
  - [ ] Timer display
  - [ ] Mobile payment flow
  - [ ] Responsive design
- [ ] Android Chrome
  - [ ] All functionality works
  - [ ] Notification permissions
  - [ ] Mobile ads display

### Responsive Design
- [ ] Test on tablet size (768px - 1024px)
- [ ] Test on mobile size (320px - 768px)
- [ ] Verify all buttons are touch-friendly
- [ ] Check text readability on small screens

---

## 🚀 Performance Testing

### Page Load Times
- [ ] Measure landing page load time
- [ ] Test dashboard load time after authentication
- [ ] Check bundle size and optimization

### Timer Performance
- [ ] Test timer accuracy over extended periods
- [ ] Check memory usage during long sessions
- [ ] Verify no memory leaks

### Database Performance
- [ ] Test response times for streak queries
- [ ] Check session save performance
- [ ] Monitor API endpoint response times

---

## 🚨 Error Handling Testing

### Network Errors
- [ ] Disconnect internet during timer session
- [ ] Verify graceful error handling
- [ ] Test offline capability (if any)
- [ ] Check error recovery when connection restored

### Database Errors
- [ ] Simulate database connection issues
- [ ] Test error messages for failed saves
- [ ] Verify retry mechanisms

### Payment Errors
- [ ] Test various Stripe error scenarios
- [ ] Verify user feedback for payment failures
- [ ] Check webhook failure handling

---

## 🔍 Edge Cases

### Time-Related Edge Cases
- [ ] Test timer at midnight (day boundary)
- [ ] Test across timezone changes
- [ ] Verify date handling for streaks

### Concurrent Usage
- [ ] Open app in multiple tabs
- [ ] Test simultaneous timer usage
- [ ] Verify data consistency

### Data Limits
- [ ] Test with very long streaks (100+ days)
- [ ] Test with many completed sessions
- [ ] Verify UI handles large numbers gracefully

---

## ✅ Production Deployment Checklist

### Environment Configuration
- [ ] Set up production Supabase project
- [ ] Configure production OAuth URLs
- [ ] Set up live Stripe webhooks
- [ ] Apply for Google AdSense account
- [ ] Configure production domain

### Security Hardening
- [ ] Rotate all API keys and secrets
- [ ] Set up proper environment variables
- [ ] Configure security headers
- [ ] Set up monitoring and alerts

### Final Validation
- [ ] Deploy to staging environment
- [ ] Run full test suite on staging
- [ ] Performance testing on production hardware
- [ ] Security scan of deployed application

---

**Testing Instructions:**
1. Work through each section systematically
2. Check off completed items
3. Document any issues found
4. Retest after fixes are applied
5. Get sign-off before production deployment

**Test Environment:** http://localhost:3005
**Testing Date:** July 13, 2025
**Tester:** [Your Name]
**Version:** WorkStreak v1.0 Pre-production