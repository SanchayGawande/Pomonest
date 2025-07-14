'use client'

import { useState, useEffect, useCallback } from "react"
import { PomodoroTimer as Timer, formatTime, calculateProgress } from "@workstreak/shared-timer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { CircularProgress } from "@/components/CircularProgress"
import { Play, Pause, RotateCcw, Coffee, Focus, Flame } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface EnhancedPomodoroTimerProps {
  onSessionComplete?: () => void
}

export default function EnhancedPomodoroTimer({ onSessionComplete }: EnhancedPomodoroTimerProps) {
  const [timer] = useState(() => new Timer())
  const [state, setState] = useState(timer.getState())
  const [isAnimating, setIsAnimating] = useState(false)
  const { toast } = useToast()

  // Update component state when timer state changes
  useEffect(() => {
    const handleStateChange = (newState: typeof state) => {
      setState(newState)
    }

    const handleWorkSessionComplete = (sessionCount: number) => {
      setIsAnimating(true)
      setTimeout(() => setIsAnimating(false), 2000)
      
      onSessionComplete?.()
      toast({
        title: "🔥 Session Complete!",
        description: "Incredible focus! You've earned a 5-minute break. Your streak is alive!",
      })
    }

    const handleBreakComplete = () => {
      toast({
        title: "🧠 Break Complete!",
        description: "Refreshed and ready! Time for another productive session.",
      })
    }

    // Set up timer callbacks
    timer.callbacks = {
      onStateChange: handleStateChange,
      onWorkSessionComplete: handleWorkSessionComplete,
      onBreakComplete: handleBreakComplete
    }

    return () => {
      timer.destroy()
    }
  }, [timer, onSessionComplete, toast])

  const toggleTimer = () => {
    if (state.isActive) {
      timer.pause()
    } else {
      timer.start()
    }
  }

  const resetTimer = () => {
    timer.reset()
  }

  const workDuration = 25 * 60 // 25 minutes
  const breakDuration = 5 * 60 // 5 minutes
  const totalDuration = state.isBreak ? breakDuration : workDuration
  const progress = calculateProgress(state.timeLeft, totalDuration)

  const minutes = Math.floor(state.timeLeft / 60)
  const seconds = state.timeLeft % 60

  return (
    <Card className="relative overflow-hidden bg-gradient-to-br from-card via-card to-muted/30 border-2 border-border/50 shadow-2xl">
      {/* Animated background */}
      <div className="absolute inset-0 opacity-10">
        <div className={`absolute inset-0 bg-gradient-to-r ${
          state.isBreak 
            ? 'from-focus-calm via-focus-deep to-focus-calm' 
            : 'from-streak-fire via-streak-ember to-streak-fire'
        } ${state.isActive ? 'animate-pulse' : ''}`} />
      </div>

      <CardHeader className="text-center pb-4 relative z-10">
        <div className="flex items-center justify-center gap-2 mb-2">
          {state.isBreak ? (
            <Coffee className="h-6 w-6 text-focus-calm" />
          ) : (
            <Focus className="h-6 w-6 text-streak-fire" />
          )}
          <CardTitle className="text-2xl font-bold">
            {state.isBreak ? "Break Time" : "Focus Session"}
          </CardTitle>
          {state.isActive && (
            <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse" />
          )}
        </div>
        <CardDescription className="text-base">
          {state.isBreak 
            ? "Recharge your mind and prepare for the next challenge" 
            : "Enter deep focus mode. Eliminate all distractions."
          }
        </CardDescription>
      </CardHeader>

      <CardContent className="text-center space-y-8 relative z-10">
        {/* Circular Timer */}
        <div className="relative flex items-center justify-center">
          <CircularProgress
            size={280}
            strokeWidth={8}
            percentage={progress}
            color={state.isBreak ? 'stroke-focus-calm' : 'stroke-streak-fire'}
            className={`${isAnimating ? 'animate-pulse scale-105' : ''} transition-transform duration-500`}
          />
          
          {/* Timer Display */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <div className={`text-7xl font-bold font-mono tracking-tight ${
              state.isBreak ? "text-focus-calm" : "text-streak-fire"
            } ${state.isActive ? 'animate-pulse' : ''}`}>
              {String(minutes).padStart(2, '0')}
              <span className="text-5xl">:</span>
              {String(seconds).padStart(2, '0')}
            </div>
            <div className="text-sm text-muted-foreground mt-2 font-medium">
              {state.isActive ? 'IN PROGRESS' : state.timeLeft === (state.isBreak ? breakDuration : workDuration) ? 'READY TO START' : 'PAUSED'}
            </div>
          </div>

          {/* Animated ring for active state */}
          {state.isActive && (
            <div className="absolute inset-0 rounded-full border-4 border-dashed border-primary/30 animate-spin" 
                 style={{ animationDuration: '10s' }} />
          )}
        </div>

        {/* Controls */}
        <div className="flex justify-center gap-6">
          <Button
            onClick={toggleTimer}
            variant={state.isBreak ? "focus" : "streak"}
            size="lg"
            className={`min-w-40 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 ${
              state.isActive ? 'animate-pulse' : 'hover:scale-105'
            }`}
          >
            {state.isActive ? (
              <>
                <Pause className="h-6 w-6 mr-2" />
                Pause
              </>
            ) : (
              <>
                {state.isBreak ? <Coffee className="h-6 w-6 mr-2" /> : <Play className="h-6 w-6 mr-2" />}
                {state.isBreak ? "Start Break" : "Start Focus"}
              </>
            )}
          </Button>

          <Button
            onClick={resetTimer}
            variant="outline"
            size="lg"
            className="min-w-32 text-lg font-semibold shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300"
          >
            <RotateCcw className="h-6 w-6 mr-2" />
            Reset
          </Button>
        </div>

        {/* Session Counter */}
        {state.sessionCount > 0 && (
          <div className="pt-6 border-t border-border/50">
            <div className="flex items-center justify-center gap-2">
              <Flame className="h-5 w-5 text-streak-fire" />
              <p className="text-lg font-semibold">
                Sessions completed today: 
                <span className="ml-2 text-2xl font-bold text-streak-fire bg-streak-fire/10 px-3 py-1 rounded-full">
                  {state.sessionCount}
                </span>
              </p>
            </div>
          </div>
        )}

        {/* Progress Bar */}
        <div className="w-full">
          <div className="flex justify-between text-sm text-muted-foreground mb-2">
            <span>Progress</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <div className="w-full bg-muted rounded-full h-3 overflow-hidden">
            <div 
              className={`h-full transition-all duration-1000 ease-out rounded-full ${
                state.isBreak 
                  ? 'bg-gradient-to-r from-focus-calm to-focus-deep' 
                  : 'bg-gradient-to-r from-streak-fire to-streak-ember'
              }`}
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}