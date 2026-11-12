'use client'

import { useState, useEffect, useCallback, useRef } from 'react'

type TimerStatus = 'idle' | 'running' | 'paused' | 'completed'

interface PomodoroState {
  status: TimerStatus
  timeLeft: number
  totalTime: number
  currentCycle: number
  totalCycles: number
  isWorkTime: boolean
}

const DEFAULT_WORK_TIME = 25 * 60 // 25 minutes
const DEFAULT_SHORT_BREAK = 5 * 60 // 5 minutes
const DEFAULT_LONG_BREAK = 15 * 60 // 15 minutes
const CYCLES_BEFORE_LONG_BREAK = 4

export function usePomodoro(
  initialWorkTime = DEFAULT_WORK_TIME,
  initialShortBreak = DEFAULT_SHORT_BREAK,
  initialLongBreak = DEFAULT_LONG_BREAK
) {
  const [state, setState] = useState<PomodoroState>({
    status: 'idle',
    timeLeft: initialWorkTime,
    totalTime: initialWorkTime,
    currentCycle: 1,
    totalCycles: CYCLES_BEFORE_LONG_BREAK,
    isWorkTime: true,
  })

  const intervalRef = useRef<NodeJS.Timeout | null>(null)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  const playNotificationSound = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.currentTime = 0
      audioRef.current.play().catch(() => {})
    }
  }, [])

  const setTimer = useCallback((seconds: number, isWork: boolean) => {
    setState((prev) => ({
      ...prev,
      timeLeft: seconds,
      totalTime: seconds,
      isWorkTime: isWork,
    }))
  }, [])

  const startTimer = useCallback(() => {
    setState((prev) => {
      if (prev.status === 'completed') return prev
      return { ...prev, status: 'running' as TimerStatus }
    })
  }, [])

  const pauseTimer = useCallback(() => {
    setState((prev) => ({ ...prev, status: 'paused' as TimerStatus }))
  }, [])

  const resetTimer = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
    setState({
      status: 'idle',
      timeLeft: initialWorkTime,
      totalTime: initialWorkTime,
      currentCycle: 1,
      totalCycles: CYCLES_BEFORE_LONG_BREAK,
      isWorkTime: true,
    })
  }, [initialWorkTime])

  const skipTimer = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
    completeCycle()
  }, [])

  const completeCycle = useCallback(() => {
    playNotificationSound()

    setState((prev) => {
      const isLastCycle = prev.currentCycle >= prev.totalCycles
      const nextIsWorkTime = !prev.isWorkTime

      if (prev.isWorkTime) {
        // Work completed, start break
        const breakTime = isLastCycle ? initialLongBreak : initialShortBreak
        return {
          ...prev,
          status: 'idle',
          timeLeft: breakTime,
          totalTime: breakTime,
          isWorkTime: false,
        }
      } else {
        // Break completed, start work or finish
        if (isLastCycle) {
          return {
            ...prev,
            status: 'completed',
            timeLeft: initialWorkTime,
            totalTime: initialWorkTime,
            currentCycle: 1,
            isWorkTime: true,
          }
        }
        return {
          ...prev,
          status: 'idle',
          timeLeft: initialWorkTime,
          totalTime: initialWorkTime,
          currentCycle: prev.currentCycle + 1,
          isWorkTime: true,
        }
      }
    })
  }, [initialWorkTime, initialShortBreak, initialLongBreak])

  // Timer countdown effect
  useEffect(() => {
    if (state.status === 'running') {
      intervalRef.current = setInterval(() => {
        setState((prev) => {
          if (prev.timeLeft <= 1) {
            if (intervalRef.current) {
              clearInterval(intervalRef.current)
              intervalRef.current = null
            }
            completeCycle()
            return { ...prev, timeLeft: 0 }
          }
          return { ...prev, timeLeft: prev.timeLeft - 1 }
        })
      }, 1000)
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
        intervalRef.current = null
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [state.status, completeCycle])

  // Initialize audio
  useEffect(() => {
    if (typeof window !== 'undefined') {
      audioRef.current = new Audio('/audio/bell.mp3')
      audioRef.current.preload = 'auto'
    }
  }, [])

  const progress = state.totalTime > 0 ? (state.totalTime - state.timeLeft) / state.totalTime : 0

  return {
    ...state,
    progress,
    startTimer,
    pauseTimer,
    resetTimer,
    skipTimer,
    setTimer,
    formattedTime: `${Math.floor(state.timeLeft / 60).toString().padStart(2, '0')}:${(state.timeLeft % 60).toString().padStart(2, '0')}`,
  }
}