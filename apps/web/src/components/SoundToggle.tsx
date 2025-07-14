'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Volume2, VolumeX } from 'lucide-react'

interface SoundToggleProps {
  className?: string
}

export function SoundToggle({ className = '' }: SoundToggleProps) {
  const [soundEnabled, setSoundEnabled] = useState(false)

  useEffect(() => {
    // Load sound preference from localStorage
    const savedPreference = localStorage.getItem('workstreak-sound-enabled')
    setSoundEnabled(savedPreference === 'true')
  }, [])

  const toggleSound = () => {
    const newValue = !soundEnabled
    setSoundEnabled(newValue)
    localStorage.setItem('workstreak-sound-enabled', newValue.toString())
  }

  // Function to play completion sound
  const playCompletionSound = () => {
    if (!soundEnabled) return

    try {
      // Create audio context and generate a simple success sound
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
      
      // Success sound: Two ascending tones
      const playTone = (frequency: number, startTime: number, duration: number) => {
        const oscillator = audioContext.createOscillator()
        const gainNode = audioContext.createGain()
        
        oscillator.connect(gainNode)
        gainNode.connect(audioContext.destination)
        
        oscillator.frequency.setValueAtTime(frequency, startTime)
        oscillator.type = 'sine'
        
        gainNode.gain.setValueAtTime(0, startTime)
        gainNode.gain.linearRampToValueAtTime(0.3, startTime + 0.01)
        gainNode.gain.exponentialRampToValueAtTime(0.01, startTime + duration)
        
        oscillator.start(startTime)
        oscillator.stop(startTime + duration)
      }
      
      const currentTime = audioContext.currentTime
      playTone(523.25, currentTime, 0.2) // C5
      playTone(659.25, currentTime + 0.1, 0.3) // E5
      
    } catch (error) {
      console.warn('Could not play sound:', error)
    }
  }

  // Expose the playCompletionSound function globally so timer can use it
  useEffect(() => {
    ;(window as any).playWorkstreakCompletionSound = () => {
      if (soundEnabled) {
        playCompletionSound()
      }
    }
    
    return () => {
      delete (window as any).playWorkstreakCompletionSound
    }
  }, [soundEnabled])

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={toggleSound}
      className={`${className}`}
      title={soundEnabled ? 'Disable sounds' : 'Enable sounds'}
    >
      {soundEnabled ? (
        <Volume2 className="h-4 w-4" />
      ) : (
        <VolumeX className="h-4 w-4" />
      )}
    </Button>
  )
}