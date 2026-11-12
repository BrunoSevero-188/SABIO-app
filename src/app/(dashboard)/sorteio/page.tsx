'use client'

import { useState } from 'react'
import { courses, getCoursesByType, getRandomCourse } from '@/data/courses'
import { Course } from '@/types'
import { Button } from '@/components/ui/Button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import { Select } from '@/components/ui/Select'
import { Shuffle, ExternalLink, ArrowRotateCCW, Star, BookOpen } from 'lucide-react'
import { cn } from '@/lib/utils'

export default function SorteioPage() {
  const [selectedType, setSelectedType] = useState<'free' | 'paid'>('free')
  const [drawnCourse, setDrawnCourse] = useState<Course | null>(null)
  const [animating, setAnimating] = useState(false)
  const [showConfetti, setShowConfetti] = useState(false)

  const handleDraw = () => {
    setAnimating(true)
    setShowConfetti(false)

    // Simulate shuffling animation
    let shuffles = 0
    const shuffleInterval = setInterval(() => {
      const tempCourse = getRandomCourse(selectedType)
      setDrawnCourse(tempCourse)
      shuffles++
      if (shuffles >= 10) {
        clearInterval(shuffleInterval)
        const finalCourse = getRandomCourse(selectedType)
        setDrawnCourse(finalCourse)
        setAnimating(false)
        setShowConfetti(true)
        setTimeout(() => setShowConfetti(false), 3000)
      }
    }, 100)
  }

  const handleReset = () => {
    setDrawnCourse(null)
    setShowConfetti(false)
  }

  const typeOptions = [
    { value: 'free', label: '🆓 Cursos Gratuitos' },
    { value: 'paid', label: '💰 Cursos Pagos' },
  ]

  const availableCourses = getCoursesByType(selectedType)

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl lg:text-4xl font-bold text-foreground mb-2">
          🎲 Sorteio de Cursos
        </h1>
        <p className="text-muted-foreground text-lg">
          Não sabe o que estudar? Deixe o SABIO escolher por você!
        </p>
      </div>

      {/* Type Selector */}
      <Card>
        <CardContent className="p-6">
          <div className="grid sm:grid-cols-2 gap-4">
            {typeOptions.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => {
                  setSelectedType(option.value as 'free' | 'paid')
                  setDrawnCourse(null)
                }}
                className={cn(
                  'p-6 rounded-xl border-2 transition-all text-left',
                  selectedType === option.value
                    ? 'border-primary bg-primary/10 shadow-lg shadow-primary/20'
                    : 'border-border hover:border-primary/50 hover:bg-accent/10'
                )}
              >
                <p className="text-lg font-semibold text-foreground">{option.label}</p>
                <p className="text-sm text-muted-foreground mt-1">
                  {availableCourses.length} cursos disponíveis
                </p>
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Draw Button / Result */}
      {drawnCourse ? (
        <Card className="relative overflow-hidden">
          {showConfetti && (
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
              {[...Array(50)].map((_, i) => (
                <div
                  key={i}
                  className="absolute w-3 h-3 rounded-full animate-[confetti_1s_ease-out_forwards]"
                  style={{
                    left: `${Math.random() * 100}%`,
                    top: `-10px`,
                    backgroundColor: `hsl(${Math.random() * 360}, 70%, 60%)`,
                    animationDelay: `${Math.random() * 0.5}s`,
                  }}
                />
              ))}
            </div>
          )}

          <CardHeader className="text-center">
            <CardTitle className="text-2xl">🎉 Curso Sorteado!</CardTitle>
            <CardDescription>Seu próximo desafio de estudos</CardDescription>
          </CardHeader>
          <CardContent className="p-6 pt-0 text-center">
            <div className="mb-6">
              <span
                className={cn(
                  'inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium',
                  drawnCourse.type === 'free'
                    ? 'bg-green-500/20 text-green-400'
                    : 'bg-yellow-500/20 text-yellow-400'
                )}
              >
                {drawnCourse.type === 'free' ? '🆓 Gratuito' : '💰 Pago'}
              </span>
              {drawnCourse.category && (
                <span className="ml-2 px-3 py-1 rounded-full bg-muted text-sm text-muted-foreground">
                  {drawnCourse.category}
                </span>
              )}
            </div>

            <h2 className="text-2xl lg:text-3xl font-bold text-foreground mb-4">
              {drawnCourse.name}
            </h2>

            {drawnCourse.description && (
              <p className="text-muted-foreground mb-6 max-w-xl mx-auto">
                {drawnCourse.description}
              </p>
            )}

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href={drawnCourse.link}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2"
              >
                <Button size="lg" className="gap-2 w-full sm:w-auto">
                  <ExternalLink className="w-4 h-4" />
                  Acessar Curso
                </Button>
              </a>
              <Button
                variant="outline"
                size="lg"
                onClick={handleReset}
                className="gap-2 w-full sm:w-auto"
              >
                <ArrowRotateCCW className="w-4 h-4" />
                Sortear Outro
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="p-6 text-center">
            <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-muted flex items-center justify-center">
              <Shuffle className="w-12 h-12 text-muted-foreground/50" />
            </div>
            <h3 className="text-xl font-semibold text-foreground mb-2">
              Pronto para descobrir?
            </h3>
            <p className="text-muted-foreground mb-6">
              Clique no botão abaixo para sortear um curso {selectedType === 'free' ? 'gratuito' : 'pago'} aleatoriamente.
            </p>
            <Button size="xl" onClick={handleDraw} className="gap-2 w-full sm:w-auto" disabled={animating}>
              <Shuffle className="w-5 h-5" />
              {animating ? 'Sorteando...' : 'Sortear Curso'}
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Course List Preview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="w-5 h-5" />
            Cursos {selectedType === 'free' ? 'Gratuitos' : 'Pagos'} Disponíveis
          </CardTitle>
          <CardDescription>
            Total de {availableCourses.length} cursos na base
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid sm:grid-cols-2 gap-3 max-h-96 overflow-y-auto">
            {availableCourses.map((course) => (
              <div
                key={course.id}
                className="p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors flex items-center gap-3"
              >
                <span
                  className={cn(
                    'px-2 py-0.5 rounded text-xs font-medium',
                    course.type === 'free'
                      ? 'bg-green-500/20 text-green-400'
                      : 'bg-yellow-500/20 text-yellow-400'
                  )}
                >
                  {course.type === 'free' ? 'GRÁTIS' : 'PAGO'}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">{course.name}</p>
                  {course.category && (
                    <p className="text-xs text-muted-foreground">{course.category}</p>
                  )}
                </div>
                <Star className="w-4 h-4 text-yellow-500" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}