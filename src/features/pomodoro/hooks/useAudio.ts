'use client'

import { useState, useCallback, useRef, useEffect } from 'react'

interface UseAudioReturn {
  play: (url: string) => Promise<void>
  stop: () => void
  volume: number
  setVolume: (volume: number) => void
  playing: boolean
  error: string | null
}

export function useAudio(): UseAudioReturn {
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const [volume, setVolumeState] = useState(1)
  const [playing, setPlaying] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const setVolume = useCallback((newVolume: number) => {
    const clamped = Math.max(0, Math.min(1, newVolume))
    setVolumeState(clamped)
    if (audioRef.current) {
      audioRef.current.volume = clamped
    }
  }, [])

  const play = useCallback(async (url: string) => {
    try {
      setError(null)

      if (audioRef.current) {
        audioRef.current.pause()
        audioRef.current.src = ''
      }

      audioRef.current = new Audio(url)
      audioRef.current.volume = volume
      audioRef.current.preload = 'auto'

      await audioRef.current.play()
      setPlaying(true)

      audioRef.current.onended = () => {
        setPlaying(false)
      }

      audioRef.current.onerror = () => {
        setError('Erro ao reproduzir áudio')
        setPlaying(false)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao reproduzir áudio')
      setPlaying(false)
    }
  }, [volume])

  const stop = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause()
      audioRef.current.currentTime = 0
      setPlaying(false)
    }
  }, [])

  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause()
        audioRef.current.src = ''
      }
    }
  }, [])

  return {
    play,
    stop,
    volume,
    setVolume,
    playing,
    error,
  }
}

export function useNotificationSound() {
  const { play, stop, volume, setVolume, playing, error } = useAudio()

  const playBell = useCallback(() => play('/audio/bell.mp3'), [play])
  const playComplete = useCallback(() => play('/audio/complete.mp3'), [play])
  const playClick = useCallback(() => play('/audio/click.mp3'), [play])

  return {
    playBell,
    playComplete,
    playClick,
    stop,
    volume,
    setVolume,
    playing,
    error,
  }
}