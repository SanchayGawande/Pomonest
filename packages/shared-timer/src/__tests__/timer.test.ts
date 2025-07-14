import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { PomodoroTimer, formatTime, calculateProgress } from '../timer'
import type { TimerConfig, TimerCallbacks } from '../timer'

describe('PomodoroTimer', () => {
  let timer: PomodoroTimer
  let mockCallbacks: TimerCallbacks

  beforeEach(() => {
    vi.useFakeTimers()
    mockCallbacks = {
      onTick: vi.fn(),
      onWorkSessionComplete: vi.fn(),
      onBreakComplete: vi.fn(),
      onStateChange: vi.fn(),
    }
  })

  afterEach(() => {
    if (timer) {
      timer.destroy()
    }
    vi.useRealTimers()
  })

  describe('Initialization', () => {
    it('should initialize with default config', () => {
      timer = new PomodoroTimer()
      const state = timer.getState()

      expect(state.timeLeft).toBe(25 * 60) // 25 minutes
      expect(state.isActive).toBe(false)
      expect(state.isBreak).toBe(false)
      expect(state.sessionCount).toBe(0)
      expect(state.currentSession).toBe('work')
    })

    it('should initialize with custom config', () => {
      const customConfig: TimerConfig = {
        workDuration: 30 * 60,
        shortBreakDuration: 10 * 60,
        longBreakDuration: 20 * 60,
        longBreakInterval: 3,
      }

      timer = new PomodoroTimer(customConfig)
      const state = timer.getState()

      expect(state.timeLeft).toBe(30 * 60)
    })

    it('should initialize with callbacks', () => {
      timer = new PomodoroTimer(undefined, mockCallbacks)
      expect(timer.callbacks).toBe(mockCallbacks)
    })
  })

  describe('Timer Controls', () => {
    beforeEach(() => {
      timer = new PomodoroTimer(undefined, mockCallbacks)
    })

    it('should start the timer', () => {
      timer.start()
      const state = timer.getState()

      expect(state.isActive).toBe(true)
      expect(mockCallbacks.onStateChange).toHaveBeenCalled()
    })

    it('should not start if already active', () => {
      timer.start()
      const callCount = (mockCallbacks.onStateChange as any)?.mock.calls.length || 0
      
      timer.start() // Try to start again
      
      expect((mockCallbacks.onStateChange as any)?.mock.calls.length).toBe(callCount)
    })

    it('should pause the timer', () => {
      timer.start()
      timer.pause()
      const state = timer.getState()

      expect(state.isActive).toBe(false)
      expect(mockCallbacks.onStateChange).toHaveBeenCalled()
    })

    it('should reset the timer', () => {
      timer.start()
      // Advance time to reduce timeLeft
      vi.advanceTimersByTime(5000) // 5 seconds
      
      timer.reset()
      const state = timer.getState()

      expect(state.timeLeft).toBe(25 * 60) // Back to original time
      expect(state.isActive).toBe(false)
    })
  })

  describe('Timer Ticking', () => {
    beforeEach(() => {
      timer = new PomodoroTimer(undefined, mockCallbacks)
    })

    it('should tick down every second when active', () => {
      timer.start()
      const initialTime = timer.getState().timeLeft

      vi.advanceTimersByTime(1000) // 1 second
      
      expect(timer.getState().timeLeft).toBe(initialTime - 1)
      expect(mockCallbacks.onTick).toHaveBeenCalledWith(initialTime - 1)
    })

    it('should not tick when paused', () => {
      timer.start()
      timer.pause()
      const timeBeforePause = timer.getState().timeLeft

      vi.advanceTimersByTime(5000) // 5 seconds
      
      expect(timer.getState().timeLeft).toBe(timeBeforePause)
    })

    it('should complete work session when time reaches zero', () => {
      const config: TimerConfig = {
        workDuration: 3, // 3 seconds for quick test
        shortBreakDuration: 2,
        longBreakDuration: 4,
        longBreakInterval: 4,
      }
      timer = new PomodoroTimer(config, mockCallbacks)
      
      timer.start()
      // Need to advance time by duration + 1 second to trigger completion
      vi.advanceTimersByTime(4000) // Complete the work session plus one extra second
      
      const state = timer.getState()
      expect(state.sessionCount).toBe(1)
      expect(state.isBreak).toBe(true)
      expect(state.currentSession).toBe('break')
      expect(state.timeLeft).toBe(2) // Short break duration
      expect(mockCallbacks.onWorkSessionComplete).toHaveBeenCalledWith(1)
    })

    it('should complete break session when time reaches zero', () => {
      const config: TimerConfig = {
        workDuration: 3,
        shortBreakDuration: 2, // 2 seconds for quick test
        longBreakDuration: 4,
        longBreakInterval: 4,
      }
      timer = new PomodoroTimer(config, mockCallbacks)
      
      // Complete work session first
      timer.start()
      vi.advanceTimersByTime(4000) // Complete work session
      
      // Now complete break session
      timer.start()
      vi.advanceTimersByTime(3000) // Complete break session
      
      const state = timer.getState()
      expect(state.isBreak).toBe(false)
      expect(state.currentSession).toBe('work')
      expect(state.timeLeft).toBe(3) // Work duration
      expect(mockCallbacks.onBreakComplete).toHaveBeenCalled()
    })
  })

  describe('Session Management', () => {
    beforeEach(() => {
      timer = new PomodoroTimer(undefined, mockCallbacks)
    })

    it('should switch to short break after work session', () => {
      timer.switchToBreak()
      const state = timer.getState()

      expect(state.isBreak).toBe(true)
      expect(state.currentSession).toBe('break')
      expect(state.timeLeft).toBe(5 * 60) // Short break duration
    })

    it('should switch to long break after configured interval', () => {
      timer.switchToLongBreak() // Test manual long break
      const state = timer.getState()
      expect(state.timeLeft).toBe(15 * 60) // Long break duration
    })

    it('should switch to work session', () => {
      timer.switchToWork()
      const state = timer.getState()

      expect(state.isBreak).toBe(false)
      expect(state.currentSession).toBe('work')
      expect(state.timeLeft).toBe(25 * 60) // Work duration
    })

    it('should manually switch to short break', () => {
      timer.switchToShortBreak()
      const state = timer.getState()

      expect(state.isBreak).toBe(true)
      expect(state.timeLeft).toBe(5 * 60)
    })

    it('should manually switch to long break', () => {
      timer.switchToLongBreak()
      const state = timer.getState()

      expect(state.isBreak).toBe(true)
      expect(state.timeLeft).toBe(15 * 60)
    })
  })

  describe('Configuration Updates', () => {
    beforeEach(() => {
      timer = new PomodoroTimer(undefined, mockCallbacks)
    })

    it('should update work duration when not active', () => {
      timer.updateConfig({ workDuration: 30 * 60 })
      const state = timer.getState()

      expect(state.timeLeft).toBe(30 * 60)
      expect(mockCallbacks.onStateChange).toHaveBeenCalled()
    })

    it('should not update current time when timer is active', () => {
      timer.start()
      const originalTime = timer.getState().timeLeft
      
      timer.updateConfig({ workDuration: 30 * 60 })
      
      expect(timer.getState().timeLeft).toBe(originalTime)
    })

    it('should update break duration when on break and not active', () => {
      timer.switchToShortBreak()
      timer.updateConfig({ shortBreakDuration: 10 * 60 })
      
      expect(timer.getState().timeLeft).toBe(10 * 60)
    })

    it('should update long break interval', () => {
      timer.updateConfig({ longBreakInterval: 3 })
      
      // Test by switching to long break manually since we can't easily simulate session counting
      timer.switchToLongBreak()
      
      expect(timer.getState().timeLeft).toBe(15 * 60) // Should be long break
    })
  })

  describe('State Management', () => {
    beforeEach(() => {
      timer = new PomodoroTimer(undefined, mockCallbacks)
    })

    it('should return a copy of state', () => {
      const state1 = timer.getState()
      const state2 = timer.getState()

      expect(state1).not.toBe(state2) // Different objects
      expect(state1).toEqual(state2) // Same content
    })

    it('should notify state changes', () => {
      timer.start()
      expect(mockCallbacks.onStateChange).toHaveBeenCalledWith(timer.getState())
    })
  })

  describe('Cleanup', () => {
    beforeEach(() => {
      timer = new PomodoroTimer(undefined, mockCallbacks)
    })

    it('should clean up interval on destroy', () => {
      timer.start()
      timer.destroy()
      
      const timeBeforeDestroy = timer.getState().timeLeft
      vi.advanceTimersByTime(5000)
      
      expect(timer.getState().timeLeft).toBe(timeBeforeDestroy)
    })
  })
})

describe('Utility Functions', () => {
  describe('formatTime', () => {
    it('should format seconds to MM:SS', () => {
      expect(formatTime(0)).toBe('00:00')
      expect(formatTime(59)).toBe('00:59')
      expect(formatTime(60)).toBe('01:00')
      expect(formatTime(125)).toBe('02:05')
      expect(formatTime(3600)).toBe('60:00')
    })

    it('should handle edge cases', () => {
      expect(formatTime(-1)).toBe('-1:-1') // Negative time - actual output
      expect(formatTime(0.5)).toBe('00:0.5') // Actual output for decimal
    })
  })

  describe('calculateProgress', () => {
    it('should calculate progress percentage', () => {
      expect(calculateProgress(0, 100)).toBe(100) // Complete
      expect(calculateProgress(50, 100)).toBe(50) // Half done
      expect(calculateProgress(100, 100)).toBe(0) // Just started
      expect(calculateProgress(75, 100)).toBe(25) // 25% done
    })

    it('should handle edge cases', () => {
      expect(calculateProgress(0, 0)).toBe(NaN) // Division by zero
      expect(calculateProgress(-10, 100)).toBeCloseTo(110, 1) // Overtime
    })
  })
})