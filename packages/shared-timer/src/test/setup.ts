import '@testing-library/jest-dom'
import { vi } from 'vitest'

// Mock timers for timer tests
vi.useFakeTimers()

// Global test utilities
;(global as any).mockTimerCallback = vi.fn()
;(global as any).mockStateCallback = vi.fn()