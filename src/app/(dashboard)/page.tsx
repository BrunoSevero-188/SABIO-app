'use client'

import { useAuth } from '@/features/auth/hooks/useAuth'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import Link from 'next/link'
import {
  Shuffle,
  Timer,
  Edit3,
  ClipboardList,
  Target,
  TrendingUp,
  Clock,
  Flame,
  BookOpen,
} from 'lucide-react'

const quickActions = [
  {
    name: 'Sortear Curso',
    description: 'Descubra seu próximo curso para estudar',
    href: '/dashboard/sorteio',
    icon: Shuffle,
    color: 'from-purple-500 to-pink-500',
  },
  {
    name: 'Iniciar Pomodoro',
    description: 'Foque nos estudos com a técnica Pomodoro',
    href: '/dashboard/pomodoro',
    icon: Timer,
    color: 'from-orange-500 to-red-500',
  },
  {
    name: 'Quadro Negro',
    description: 'Organize suas anotações e ideias',
    href: '/dashboard/quadro-negro',
    icon: Edit3,
    color: 'from-green-500 to-teal-500',
  },
  {
    name: 'Questionários',
    description: 'Teste seus conhecimentos',
    href: '/dashboard/questionarios',
    icon: ClipboardList,
    color: 'from-blue-500 to-indigo-500',
  },
]

const stats = [
  { label: 'Dias de Estudo', value: '12', icon: Flame, color: 'text-orange-500' },
  { label: 'Horas Totais', value: '48h', icon: Clock, color: 'text-blue-500' },
  { label: 'Cursos Concluídos', value: '3', icon: BookOpen, color: 'text-green-500' },
  { label: 'Sequência Atual', value: '5 dias', icon: Target, color: 'text-purple-500' },
]

export default function DashboardPage() {
  const { user } = useAuth()

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-foreground">
            Olá, {user?.name?.split(' ')[0] || 'Estudante'}! 👋
          </h1>
          <p className="text-muted-foreground mt-1">
            Pronto para continuar seus estudos hoje?
          </p>
        </div>
        <div className="flex gap-2">
          <Link href="/dashboard/sorteio">
            <Button size="lg" className="gap-2">
              <Shuffle className="w-4 h-4" />
              Sortear Curso
            </Button>
          </Link>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <Card key={i}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">{stat.label}</p>
                  <p className="text-2xl font-bold text-foreground mt-1">{stat.value}</p>
                </div>
                <div className={`p-3 rounded-xl bg-muted ${stat.color}`}>
                  <stat.icon className="w-6 h-6" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Actions */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl font-semibold text-foreground">Acesso Rápido</h2>
            <p className="text-sm text-muted-foreground">Escolha uma ferramenta para começar</p>
          </div>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {quickActions.map((action, i) => (
            <Link key={i} href={action.href}>
              <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer group">
                <CardContent className="p-6">
                  <div
                    className={`w-12 h-12 rounded-xl bg-gradient-to-br ${action.color} flex items-center justify-center text-white mb-4 group-hover:scale-110 transition-transform`}
                  >
                    <action.icon className="w-6 h-6" />
                  </div>
                  <h3 className="font-semibold text-foreground mb-1">{action.name}</h3>
                  <p className="text-sm text-muted-foreground">{action.description}</p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>

      {/* Progress Section */}
      <div className="grid lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Progresso da Semana</CardTitle>
            <CardDescription>Suas horas de estudo nos últimos 7 dias</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { day: 'Seg', hours: 2, max: 4 },
                { day: 'Ter', hours: 3, max: 4 },
                { day: 'Qua', hours: 1, max: 4 },
                { day: 'Qui', hours: 4, max: 4 },
                { day: 'Sex', hours: 2, max: 4 },
                { day: 'Sáb', hours: 3, max: 4 },
                { day: 'Dom', hours: 0, max: 4 },
              ].map((day) => (
                <div key={day.day} className="flex items-center gap-4">
                  <span className="w-10 text-sm text-muted-foreground">{day.day}</span>
                  <div className="flex-1 h-3 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary rounded-full transition-all"
                      style={{ width: `${(day.hours / day.max) * 100}%` }}
                    />
                  </div>
                  <span className="w-16 text-sm text-foreground text-right">
                    {day.hours}h
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Próximos Passos Sugeridos</CardTitle>
            <CardDescription>Baseado no seu perfil de estudos</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {[
              'Complete o módulo de JavaScript Básico',
              'Faça um Pomodoro de 25min para revisar conceitos',
              'Sorteie um novo curso de React',
              'Adicione anotações no Quadro Negro',
              'Responda ao questionário de TypeScript',
            ].map((step, i) => (
              <div
                key={i}
                className="flex items-center gap-3 p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
              >
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary text-sm font-medium">
                  {i + 1}
                </div>
                <span className="text-sm text-foreground">{step}</span>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}