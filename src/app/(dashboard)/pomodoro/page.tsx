'use client'

import { usePomodoro } from '@/features/pomodoro/hooks/usePomodoro'
import { useNotificationSound } from '@/features/pomodoro/hooks/useAudio'
import { Button } from '@/components/ui/Button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import { Input } from '@/components/ui/Input'
import { Label } from '@/components/ui/Label'
import { Slider } from '@/components/ui/Slider'
import {
  Play,
  Pause,
  RotateCcw,
  SkipForward,
  Settings,
  X,
  Bell,
  Volume2,
  VolumeX,
  Clock,
  Coffee,
  Moon,
} from 'lucide-react'
import { cn, formatTime } from '@/lib/utils'
import { useState } from 'react'

export default function PomodoroPage() {
  const {
    status,
    timeLeft,
    totalTime,
    currentCycle,
    totalCycles,
    isWorkTime,
    progress,
    startTimer,
    pauseTimer,
    resetTimer,
    skipTimer,
    formattedTime,
  } = usePomodoro()

  const { playBell, playComplete, playClick, volume, setVolume, playing, stop } = useNotificationSound()
  const [settingsOpen, setSettingsOpen] = useState(false)
  const [workTime, setWorkTime] = useState(25)
  const [shortBreak, setShortBreak] = useState(5)
  const [longBreak, setLongBreak] = useState(15)
  const [soundEnabled, setSoundEnabled] = useState(true)

  const handleStart = () => {
    if (soundEnabled) playClick()
    startTimer()
  }

  const handlePause = () => {
    if (soundEnabled) playClick()
    pauseTimer()
  }

  const handleReset = () => {
    if (soundEnabled) playClick()
    resetTimer()
  }

  const handleSkip = () => {
    if (soundEnabled) playClick()
    skipTimer()
  }

  const handleApplySettings = () => {
    if (soundEnabled) playClick()
    setSettingsOpen(false)
    // Reset with new times would require reinitializing the hook
    // For now, just close settings
  }

  if (status === 'completed') {
    if (soundEnabled) playComplete()
  } else if (status === 'running' && timeLeft === 0) {
    if (soundEnabled) playBell()
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">⏱️ Pomodoro Timer</h1>
          <p className="text-muted-foreground">
            Técnica de produtividade com ciclos de foco e pausa
          </p>
        </div>
        <Button variant="ghost" size="icon" onClick={() => setSettingsOpen(true)}>
          <Settings className="w-5 h-5" />
        </Button>
      </div>

      {/* Timer Display */}
      <Card className="relative overflow-hidden">
        <div
          className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-accent/10"
        />
        <CardContent className="relative p-8 pt-12 pb-12 text-center">
          {/* Progress Ring */}
          <div className="relative w-64 h-64 mx-auto mb-8">
            <svg className="w-full h-full -rotate-90">
              <circle
                cx="128"
                cy="128"
                r="110"
                fill="none"
                stroke="currentColor"
                strokeWidth="8"
                className="text-muted-foreground/20"
              />
              <circle
                cx="128"
                cy="128"
                r="110"
                fill="none"
                stroke="currentColor"
                strokeWidth="8"
                strokeDasharray={691}
                strokeDashoffset={691 * (1 - progress)}
                strokeLinecap="round"
                className={cn(
                  'transition-all duration-1000 ease-linear',
                  isWorkTime ? 'text-primary' : 'text-green-500'
                )}
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <div className="text-5xl lg:text-7xl font-mono font-bold text-foreground">
                  {formattedTime}
                </div>
                <div className="flex items-center justify-center gap-2 mt-2">
                  <span
                    className={cn(
                      'px-3 py-1 rounded-full text-sm font-medium',
                      isWorkTime
                        ? 'bg-primary/20 text-primary'
                        : 'bg-green-500/20 text-green-500'
                    )}
                  >
                    {isWorkTime ? <Clock className="w-4 h-4 inline" /> : <Coffee className="w-4 h-4 inline" />}
                    {isWorkTime ? 'Foco' : 'Pausa'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Cycle Indicator */}
          <div className="flex items-center justify-center gap-2 mb-8">
            {[...Array(totalCycles)].map((_, i) => (
              <div
                key={i}
                className={cn(
                  'w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-all',
                  i < currentCycle - 1
                    ? 'bg-green-500 text-white'
                    : i === currentCycle - 1
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted text-muted-foreground'
                )}
              >
                {i + 1}
              </div>
            ))}
          </div>

          {/* Controls */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button
              variant="outline"
              size="lg"
              onClick={handleReset}
              className="gap-2"
            >
              <RotateCcw className="w-5 h-5" />
              Resetar
            </Button>

            {status === 'running' ? (
              <Button
                size="xl"
                onClick={handlePause}
                className="w-20 h-20 rounded-full gap-2"
              >
                <Pause className="w-7 h-7" />
              </Button>
            ) : (
              <Button
                size="xl"
                onClick={handleStart}
                className="w-20 h-20 rounded-full bg-primary text-primary-foreground hover:bg-primary/90 gap-2"
              >
                <Play className="w-7 h-7" />
              </Button>
            )}

            <Button
              variant="outline"
              size="lg"
              onClick={handleSkip}
              className="gap-2"
            >
              <SkipForward className="w-5 h-5" />
              Pular
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-6 text-center">
            <div className="text-2xl font-bold text-foreground">{currentCycle}/{totalCycles}</div>
            <div className="text-sm text-muted-foreground">Ciclos</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 text-center">
            <div className="text-2xl font-bold text-foreground">
              {isWorkTime ? 'Trabalhando' : 'Descansando'}
            </div>
            <div className="text-sm text-muted-foreground">Status</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 text-center">
            <div className="text-2xl font-bold text-foreground">
              {Math.round(progress * 100)}%
            </div>
            <div className="text-sm text-muted-foreground">Progresso</div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Presets */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Moon className="w-5 h-5" />
            Predefinições Rápidas
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-3">
            {[
              { label: 'Padrão', work: 25, short: 5, long: 15 },
              { label: 'Curto', work: 15, short: 3, long: 10 },
              { label: 'Longo', work: 50, short: 10, long: 20 },
            ].map((preset) => (
              <Button
                key={preset.label}
                variant="outline"
                onClick={() => {
                  if (soundEnabled) playClick()
                  setWorkTime(preset.work)
                  setShortBreak(preset.short)
                  setLongBreak(preset.long)
                }}
                className="py-3"
              >
                <div className="font-medium">{preset.label}</div>
                <div className="text-xs text-muted-foreground">
                  {preset.work}/{preset.short}/{preset.long}min
                </div>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Settings Modal */}
      {settingsOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                Configurações do Timer
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setSettingsOpen(false)}
                >
                  <X className="w-5 h-5" />
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="workTime">Tempo de Foco (min)</Label>
                  <div className="flex items-center gap-4">
                    <Input
                      id="workTime"
                      type="number"
                      value={workTime}
                      onChange={(e) => setWorkTime(Math.max(1, Math.min(120, parseInt(e.target.value) || 1)))}
                      className="w-24"
                    />
                    <Slider
                      value={[workTime]}
                      onValueChange={([v]) => setWorkTime(v)}
                      max={120}
                      min={1}
                      step={1}
                      className="flex-1"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="shortBreak">Pausa Curta (min)</Label>
                  <div className="flex items-center gap-4">
                    <Input
                      id="shortBreak"
                      type="number"
                      value={shortBreak}
                      onChange={(e) => setShortBreak(Math.max(1, Math.min(60, parseInt(e.target.value) || 1)))}
                      className="w-24"
                    />
                    <Slider
                      value={[shortBreak]}
                      onValueChange={([v]) => setShortBreak(v)}
                      max={60}
                      min={1}
                      step={1}
                      className="flex-1"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="longBreak">Pausa Longa (min)</Label>
                  <div className="flex items-center gap-4">
                    <Input
                      id="longBreak"
                      type="number"
                      value={longBreak}
                      onChange={(e) => setLongBreak(Math.max(1, Math.min(60, parseInt(e.target.value) || 1)))}
                      className="w-24"
                    />
                    <Slider
                      value={[longBreak]}
                      onValueChange={([v]) => setLongBreak(v)}
                      max={60}
                      min={1}
                      step={1}
                      className="flex-1"
                    />
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Bell className={cn('w-5 h-5', soundEnabled ? 'text-primary' : 'text-muted-foreground')} />
                  <span className="text-sm">Sons de notificação</span>
                </div>
                <Button
                  variant={soundEnabled ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSoundEnabled(!soundEnabled)}
                  className="gap-1"
                >
                  {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
                  {soundEnabled ? 'Ativado' : 'Desativado'}
                </Button>
              </div>

              <div className="flex gap-3 pt-4">
                <Button variant="outline" onClick={() => setSettingsOpen(false)} className="flex-1">
                  Cancelar
                </Button>
                <Button onClick={handleApplySettings} className="flex-1">
                  Aplicar
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}