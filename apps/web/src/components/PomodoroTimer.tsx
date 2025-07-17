'use client'

import { useState, useEffect, useCallback } from "react"
import { PomodoroTimer as Timer, formatTime, calculateProgress } from "@pomonest/shared-timer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Play, Pause, RotateCcw, Coffee } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface PomodoroTimerProps {
  onSessionComplete?: () => void
}

export default function PomodoroTimer({ onSessionComplete }: PomodoroTimerProps) {
  const [timer] = useState(() => new Timer())
  const [state, setState] = useState(timer.getState())
  const { toast } = useToast()

  // Update component state when timer state changes
  useEffect(() => {
    const handleStateChange = (newState: typeof state) => {
      setState(newState)
    }

    const handleWorkSessionComplete = (sessionCount: number) => {
      onSessionComplete?.()
      toast({
        title: "Session Complete! 🔥",
        description: "Great job! You kept your streak alive. Take a 5-minute break.",
      })
    }

    const handleBreakComplete = () => {
      toast({
        title: "Break Complete! 🧠",
        description: "Ready for another focus session?",
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

  return (
    <Card className="p-8 text-center space-y-6">
      <CardHeader className="p-0">
        <CardTitle className="text-2xl">
          {state.isBreak ? "Break Time" : "Focus Session"}
        </CardTitle>
        <CardDescription>
          {state.isBreak 
            ? "Relax and recharge for the next session" 
            : "Stay focused and avoid distractions"
          }
        </CardDescription>
      </CardHeader>

      <CardContent className="p-0 space-y-6">
        <div className="text-7xl lg:text-8xl font-light tracking-tight text-foreground">
          {formatTime(state.timeLeft)}
        </div>

        <Progress 
          value={progress} 
          className="h-1"
        />

        <div className="flex justify-center gap-3">
          <Button
            onClick={toggleTimer}
            variant="default"
            size="lg"
            className="min-w-28 font-medium"
          >
            {state.isActive ? (
              <>
                <Pause className="h-4 w-4 mr-2" />
                Pause
              </>
            ) : (
              <>
                <Play className="h-4 w-4 mr-2" />
                {state.isBreak ? "Break" : "Focus"}
              </>
            )}
          </Button>

          <Button
            onClick={resetTimer}
            variant="ghost"
            size="lg"
            className="text-muted-foreground hover:text-foreground"
          >
            <RotateCcw className="h-4 w-4" />
          </Button>
        </div>

        {state.sessionCount > 0 && (
          <div className="pt-4 border-t border-border">
            <p className="text-sm text-muted-foreground">
              Sessions completed today: <span className="font-semibold text-foreground">{state.sessionCount}</span>
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}