export interface TimerState {
  timeLeft: number;
  isActive: boolean;
  isBreak: boolean;
  sessionCount: number;
  currentSession: 'work' | 'break';
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
}

export class PomodoroTimer {
  private state: TimerState;
  private config: TimerConfig;
  public callbacks: TimerCallbacks;
  private interval: NodeJS.Timeout | null = null;

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
      currentSession: 'work'
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
    
    this.state.isActive = true;
    this.notifyStateChange();
    
    this.interval = setInterval(() => {
      this.tick();
    }, 1000);
  }

  pause(): void {
    this.state.isActive = false;
    this.clearInterval();
    this.notifyStateChange();
  }

  reset(): void {
    this.clearInterval();
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
      currentSession: this.state.currentSession
    };
    this.notifyStateChange();
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
  }

  private tick(): void {
    if (this.state.timeLeft > 0) {
      this.state.timeLeft -= 1;
      this.callbacks.onTick?.(this.state.timeLeft);
      this.notifyStateChange();
    } else {
      this.handleTimerComplete();
    }
  }

  private handleTimerComplete(): void {
    this.clearInterval();
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

  private notifyStateChange(): void {
    this.callbacks.onStateChange?.(this.getState());
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