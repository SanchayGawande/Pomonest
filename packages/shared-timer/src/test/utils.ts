import { vi, expect } from 'vitest'

// Timer test utilities
export const createMockTimer = () => {
  const callbacks: Array<() => void> = []
  let isRunning = false

  return {
    start: vi.fn(() => {
      isRunning = true
      callbacks.forEach(cb => cb())
    }),
    stop: vi.fn(() => {
      isRunning = false
    }),
    reset: vi.fn(() => {
      isRunning = false
    }),
    isRunning: () => isRunning,
    addCallback: (callback: () => void) => {
      callbacks.push(callback)
    },
    getCallbacks: () => callbacks,
  }
}

// Mock state for timer testing
export const createMockTimerState = (overrides = {}) => ({
  currentTime: 25 * 60, // 25 minutes in seconds
  isRunning: false,
  currentSession: 'work' as 'work' | 'shortBreak' | 'longBreak',
  sessionCount: 0,
  autoStart: false,
  workDuration: 25,
  shortBreakDuration: 5,
  longBreakDuration: 15,
  longBreakInterval: 4,
  ...overrides,
})

// Helper to advance time in tests
export const advanceTimerTime = (timer: any, seconds: number) => {
  for (let i = 0; i < seconds; i++) {
    vi.advanceTimersByTime(1000)
    // Manually trigger timer tick if needed
    if (timer.tick) {
      timer.tick()
    }
  }
}

// Mock callback functions for testing
export const createMockCallbacks = () => ({
  onStateChange: vi.fn(),
  onSessionComplete: vi.fn(),
  onTick: vi.fn(),
  onStart: vi.fn(),
  onPause: vi.fn(),
  onReset: vi.fn(),
})

// Test data generators
export const generateTimerTestData = () => ({
  workSession: {
    duration: 25 * 60, // 25 minutes
    type: 'work' as const,
    expectedNextSession: 'shortBreak' as const,
  },
  shortBreakSession: {
    duration: 5 * 60, // 5 minutes
    type: 'shortBreak' as const,
    expectedNextSession: 'work' as const,
  },
  longBreakSession: {
    duration: 15 * 60, // 15 minutes
    type: 'longBreak' as const,
    expectedNextSession: 'work' as const,
  },
})

// Utility to validate timer state transitions
export const validateTimerTransition = (
  fromState: any,
  toState: any,
  expectedChanges: Partial<any>
) => {
  Object.keys(expectedChanges).forEach(key => {
    expect(toState[key]).toBe(expectedChanges[key])
  })
}

// Mock performance.now for consistent timing tests
export const mockPerformanceNow = () => {
  let mockTime = 0
  vi.spyOn(performance, 'now').mockImplementation(() => mockTime)
  return {
    setTime: (time: number) => {
      mockTime = time
    },
    advanceTime: (ms: number) => {
      mockTime += ms
    },
  }
}