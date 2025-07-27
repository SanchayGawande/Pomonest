export interface TimerState {
  timeLeft: number;
  isActive: boolean;
  isBreak: boolean;
  sessionCount: number;
  currentSession: 'work' | 'break';
  startTime?: number; // When timer was started
}

export interface TimerConfig {
  workDuration: number; // in seconds
  shortBreakDuration: number; // in seconds
  longBreakDuration: number; // in seconds
  longBreakInterval: number; // sessions before long break
}

export interface TimerCallbacks {
  onTick?: (timeLeft: number) => void;
  onWorkSessionComplete?: (sessionCount: number) => void;
  onBreakComplete?: () => void;
  onStateChange?: (state: TimerState) => void;
  onVisibilityChange?: (isVisible: boolean) => void;
}

export class PomodoroTimer {
  private state: TimerState;
  private config: TimerConfig;
  public callbacks: TimerCallbacks;
  private interval: NodeJS.Timeout | null = null;
  private heartbeatInterval: NodeJS.Timeout | null = null;
  private lastTickTime: number = Date.now();
  private isVisible: boolean = true;

  constructor(
    config: TimerConfig = { 
      workDuration: 25 * 60, 
      shortBreakDuration: 5 * 60, 
      longBreakDuration: 15 * 60,
      longBreakInterval: 4
    },
    callbacks: TimerCallbacks = {}
  ) {
    this.config = config;
    this.callbacks = callbacks;
    this.state = {
      timeLeft: config.workDuration,
      isActive: false,
      isBreak: false,
      sessionCount: 0,
      currentSession: 'work',
      startTime: undefined
    };
  }

  getState(): TimerState {
    return { ...this.state };
  }

  updateConfig(newConfig: Partial<TimerConfig>): void {
    this.config = { ...this.config, ...newConfig };
    
    // If timer is not running and we're updating durations, update current timeLeft
    if (!this.state.isActive) {
      if (this.state.isBreak) {
        const isLongBreak = this.state.sessionCount > 0 && this.state.sessionCount % this.config.longBreakInterval === 0;
        const breakDuration = isLongBreak ? this.config.longBreakDuration : this.config.shortBreakDuration;
        this.state.timeLeft = breakDuration;
      } else if (!this.state.isBreak && newConfig.workDuration !== undefined) {
        this.state.timeLeft = newConfig.workDuration;
      }
      this.notifyStateChange();
    }
  }

  start(): void {
    if (this.state.isActive) return;
    
    const now = Date.now();
    this.state.isActive = true;
    this.state.startTime = now;
    this.lastTickTime = now;
    this.notifyStateChange();
    
    this.interval = setInterval(() => {
      this.tick();
    }, 1000);
    
    // Start heartbeat to validate timer accuracy
    this.startHeartbeat();
    
    // Persist state
    this.persistState();
  }

  pause(): void {
    this.state.isActive = false;
    this.state.startTime = undefined;
    this.clearInterval();
    this.clearHeartbeat();
    this.notifyStateChange();
    this.persistState();
  }

  reset(): void {
    this.clearInterval();
    this.clearHeartbeat();
    let timeLeft = this.config.workDuration;
    
    if (this.state.isBreak) {
      const isLongBreak = this.state.sessionCount > 0 && this.state.sessionCount % this.config.longBreakInterval === 0;
      timeLeft = isLongBreak ? this.config.longBreakDuration : this.config.shortBreakDuration;
    }
    
    this.state = {
      timeLeft,
      isActive: false,
      isBreak: this.state.isBreak,
      sessionCount: this.state.sessionCount,
      currentSession: this.state.currentSession,
      startTime: undefined
    };
    this.notifyStateChange();
    this.persistState();
  }

  switchToBreak(): void {
    this.clearInterval();
    const isLongBreak = this.state.sessionCount > 0 && this.state.sessionCount % this.config.longBreakInterval === 0;
    const breakDuration = isLongBreak ? this.config.longBreakDuration : this.config.shortBreakDuration;
    
    this.state = {
      ...this.state,
      timeLeft: breakDuration,
      isActive: false,
      isBreak: true,
      currentSession: 'break'
    };
    this.notifyStateChange();
  }

  switchToShortBreak(): void {
    this.clearInterval();
    this.state = {
      ...this.state,
      timeLeft: this.config.shortBreakDuration,
      isActive: false,
      isBreak: true,
      currentSession: 'break'
    };
    this.notifyStateChange();
  }

  switchToLongBreak(): void {
    this.clearInterval();
    this.state = {
      ...this.state,
      timeLeft: this.config.longBreakDuration,
      isActive: false,
      isBreak: true,
      currentSession: 'break'
    };
    this.notifyStateChange();
  }

  switchToWork(): void {
    this.clearInterval();
    this.state = {
      ...this.state,
      timeLeft: this.config.workDuration,
      isActive: false,
      isBreak: false,
      currentSession: 'work'
    };
    this.notifyStateChange();
  }

  destroy(): void {
    this.clearInterval();
    this.clearHeartbeat();
  }

  setVisibility(isVisible: boolean): void {
    this.isVisible = isVisible;
    this.callbacks.onVisibilityChange?.(isVisible);
    
    if (!isVisible && this.state.isActive) {
      // Timer continues running in background but we stop visual updates
      console.log('🔍 Timer hidden - continuing in background');
    } else if (isVisible && this.state.isActive) {
      // Check for drift when becoming visible
      this.validateTimerAccuracy();
      console.log('👀 Timer visible - validating accuracy');
    }
  }

  private tick(): void {
    if (this.state.timeLeft > 0) {
      this.state.timeLeft -= 1;
      this.lastTickTime = Date.now();
      this.callbacks.onTick?.(this.state.timeLeft);
      this.notifyStateChange();
    } else {
      this.handleTimerComplete();
    }
  }

  private handleTimerComplete(): void {
    this.clearInterval();
    this.clearHeartbeat();
    this.state.isActive = false;

    if (this.state.isBreak) {
      // Break completed
      this.state.isBreak = false;
      this.state.timeLeft = this.config.workDuration;
      this.state.currentSession = 'work';
      this.callbacks.onBreakComplete?.();
    } else {
      // Work session completed
      this.state.sessionCount += 1;
      this.state.isBreak = true;
      
      // Determine if this should be a long break
      const isLongBreak = this.state.sessionCount % this.config.longBreakInterval === 0;
      this.state.timeLeft = isLongBreak ? this.config.longBreakDuration : this.config.shortBreakDuration;
      
      this.state.currentSession = 'break';
      this.callbacks.onWorkSessionComplete?.(this.state.sessionCount);
    }

    this.notifyStateChange();
  }

  private clearInterval(): void {
    if (this.interval) {
      clearInterval(this.interval);
      this.interval = null;
    }
  }

  private clearHeartbeat(): void {
    if (this.heartbeatInterval) {
      clearInterval(this.heartbeatInterval);
      this.heartbeatInterval = null;
    }
  }

  private startHeartbeat(): void {
    this.clearHeartbeat();
    this.heartbeatInterval = setInterval(() => {
      this.validateTimerAccuracy();
    }, 5000); // Check every 5 seconds
  }

  private validateTimerAccuracy(): void {
    if (!this.state.isActive) return;
    
    const now = Date.now();
    const timeSinceLastTick = now - this.lastTickTime;
    
    // If more than 2 seconds since last tick, we may have timer drift
    if (timeSinceLastTick > 2000) {
      const missedSeconds = Math.floor(timeSinceLastTick / 1000) - 1;
      if (missedSeconds > 0 && this.state.timeLeft > missedSeconds) {
        console.warn(`⚠️ Timer drift detected: ${missedSeconds}s behind, correcting...`);
        this.state.timeLeft -= missedSeconds;
        this.lastTickTime = now;
        this.notifyStateChange();
      }
    }
  }

  private persistState(): void {
    if (typeof localStorage !== 'undefined') {
      try {
        localStorage.setItem('pomonest_timer_state', JSON.stringify({
          ...this.state,
          config: this.config,
          lastUpdate: Date.now()
        }));
      } catch (error) {
        console.warn('Failed to persist timer state:', error);
      }
    }
  }

  loadPersistedState(): boolean {
    if (typeof localStorage === 'undefined') return false;
    
    try {
      const stored = localStorage.getItem('pomonest_timer_state');
      if (!stored) return false;
      
      const data = JSON.parse(stored);
      const timeSinceUpdate = Date.now() - (data.lastUpdate || 0);
      
      // Only restore if less than 1 hour old
      if (timeSinceUpdate > 60 * 60 * 1000) {
        localStorage.removeItem('pomonest_timer_state');
        return false;
      }
      
      // Restore state but recalculate time if timer was active
      if (data.isActive && data.startTime) {
        const elapsedSeconds = Math.floor((Date.now() - data.startTime) / 1000);
        const newTimeLeft = Math.max(0, data.timeLeft - elapsedSeconds);
        
        if (newTimeLeft <= 0) {
          // Timer completed while app was closed
          this.state = {
            ...data,
            isActive: false,
            timeLeft: data.isBreak ? this.config.workDuration : 
              (data.sessionCount % this.config.longBreakInterval === 0 ? 
                this.config.longBreakDuration : this.config.shortBreakDuration),
            isBreak: !data.isBreak,
            currentSession: data.isBreak ? 'work' : 'break',
            sessionCount: data.isBreak ? data.sessionCount : data.sessionCount + 1,
            startTime: undefined
          };
        } else {
          this.state = { ...data, timeLeft: newTimeLeft };
        }
      } else {
        this.state = data;
      }
      
      if (data.config) {
        this.config = data.config;
      }
      
      console.log('🔄 Timer state restored from localStorage');
      return true;
    } catch (error) {
      console.warn('Failed to load persisted timer state:', error);
      localStorage.removeItem('pomonest_timer_state');
      return false;
    }
  }

  private notifyStateChange(): void {
    this.callbacks.onStateChange?.(this.getState());
    this.persistState();
  }
}

export function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

export function calculateProgress(timeLeft: number, totalDuration: number): number {
  return ((totalDuration - timeLeft) / totalDuration) * 100;
}