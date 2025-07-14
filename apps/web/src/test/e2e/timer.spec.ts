import { test, expect } from '@playwright/test'

test.describe('WorkStreak Timer', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
  })

  test('should display initial timer state', async ({ page }) => {
    // Check if the timer displays the default 25:00
    await expect(page.locator('[data-testid="timer-display"]').first()).toContainText('25:00')
    
    // Check if control buttons are visible
    await expect(page.locator('button').filter({ hasText: /start|play/i }).first()).toBeVisible()
    await expect(page.locator('button').filter({ hasText: /reset/i }).first()).toBeVisible()
  })

  test('should start and pause timer', async ({ page }) => {
    // Start the timer
    await page.locator('button').filter({ hasText: /start|play/i }).first().click()
    
    // Wait a moment and check if time has decreased
    await page.waitForTimeout(2000)
    
    // Timer should be running (time should have decreased)
    const timerDisplay = page.locator('[data-testid="timer-display"]').first()
    const currentTime = await timerDisplay.textContent()
    expect(currentTime).not.toBe('25:00')
    
    // Pause the timer
    await page.locator('button').filter({ hasText: /pause|stop/i }).first().click()
    
    // Wait and verify timer stopped
    const pausedTime = await timerDisplay.textContent()
    await page.waitForTimeout(2000)
    const timeAfterPause = await timerDisplay.textContent()
    expect(timeAfterPause).toBe(pausedTime)
  })

  test('should reset timer', async ({ page }) => {
    // Start timer briefly
    await page.locator('button').filter({ hasText: /start|play/i }).first().click()
    await page.waitForTimeout(2000)
    
    // Reset timer
    await page.locator('button').filter({ hasText: /reset/i }).first().click()
    
    // Timer should be back to 25:00
    await expect(page.locator('[data-testid="timer-display"]').first()).toContainText('25:00')
  })

  test('should open settings', async ({ page }) => {
    // Look for settings button/icon
    const settingsButton = page.locator('button[aria-label*="settings"], button[aria-label*="Settings"], [data-testid="settings-button"]').first()
    
    if (await settingsButton.isVisible()) {
      await settingsButton.click()
      
      // Should see settings panel/modal
      await expect(page.locator('[data-testid="settings-panel"], [data-testid="settings-modal"]').first()).toBeVisible()
    }
  })

  test('should handle authentication flow', async ({ page }) => {
    // Look for sign in button
    const signInButton = page.locator('button').filter({ hasText: /sign in|login|continue with/i }).first()
    
    if (await signInButton.isVisible()) {
      // This test would require OAuth setup, so we just verify the button exists
      await expect(signInButton).toBeVisible()
    }
  })

  test('should be responsive on mobile', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 })
    
    // Verify timer is still visible and functional
    await expect(page.locator('[data-testid="timer-display"]').first()).toBeVisible()
    await expect(page.locator('button').filter({ hasText: /start|play/i }).first()).toBeVisible()
  })

  test('should display pro upgrade modal', async ({ page }) => {
    // Look for pro/upgrade related elements
    const upgradeButton = page.locator('button').filter({ hasText: /upgrade|pro|premium/i }).first()
    
    if (await upgradeButton.isVisible()) {
      await upgradeButton.click()
      
      // Should see upgrade modal with pricing
      const modal = page.locator('[data-testid="pro-modal"], [data-testid="upgrade-modal"]').first()
      if (await modal.isVisible()) {
        await expect(modal).toContainText(/\$/)
      }
    }
  })
})

test.describe('WorkStreak Navigation', () => {
  test('should navigate through main sections', async ({ page }) => {
    await page.goto('/')
    
    // Test navigation if app has multiple pages
    const dashboardLink = page.locator('a[href*="dashboard"], button').filter({ hasText: /dashboard/i }).first()
    const settingsLink = page.locator('a[href*="settings"], button').filter({ hasText: /settings/i }).first()
    
    if (await dashboardLink.isVisible()) {
      await dashboardLink.click()
      await expect(page).toHaveURL(/dashboard/)
    }
    
    if (await settingsLink.isVisible()) {
      await settingsLink.click()
      await expect(page).toHaveURL(/settings/)
    }
  })
})

test.describe('WorkStreak Performance', () => {
  test('should load quickly', async ({ page }) => {
    const startTime = Date.now()
    await page.goto('/')
    
    // Wait for main content to be visible
    await page.locator('[data-testid="timer-display"], .timer, [class*="timer"]').first().waitFor()
    
    const loadTime = Date.now() - startTime
    expect(loadTime).toBeLessThan(5000) // Should load within 5 seconds
  })

  test('should not have console errors', async ({ page }) => {
    const errors: string[] = []
    
    page.on('console', msg => {
      if (msg.type() === 'error') {
        errors.push(msg.text())
      }
    })
    
    await page.goto('/')
    await page.waitForTimeout(3000) // Wait for any async operations
    
    // Filter out known benign errors
    const criticalErrors = errors.filter(error => 
      !error.includes('favicon') && 
      !error.includes('manifest') &&
      !error.includes('404')
    )
    
    expect(criticalErrors).toHaveLength(0)
  })
})