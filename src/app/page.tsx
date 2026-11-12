'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/Button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import {
  GraduationCap,
  Timer,
  Shuffle,
  Target,
  CheckCircle,
  ArrowRight,
} from 'lucide-react'

const features = [
  {
    icon: Shuffle,
    title: 'Sorteio de Cursos',
    description: 'Não sabe o que estudar? Sorteie entre cursos gratuitos e pagos curados.',
    href: '/dashboard/sorteio',
    color: 'from-purple-500 to-pink-500',
  },
  {
    icon: Timer,
    title: 'Pomodoro Timer',
    description: 'Técnica Pomodoro integrada com ciclos de trabalho e pausa personalizáveis.',
    href: '/dashboard/pomodoro',
    color: 'from-orange-500 to-red-500',
  },
  {
    icon: Target,
    title: 'Quadro Negro',
    description: 'Anote ideias, tarefas e organize seus estudos em um quadro visual.',
    href: '/dashboard/quadro-negro',
    color: 'from-green-500 to-teal-500',
  },
  {
    icon: GraduationCap,
    title: 'Questionários',
    description: 'Teste seus conhecimentos com quizzes interativos sobre diversos temas.',
    href: '/dashboard/questionarios',
    color: 'from-blue-500 to-indigo-500',
  },
]

const stats = [
  { label: 'Cursos Disponíveis', value: '16+' },
  { label: 'Usuários Ativos', value: '1.2k+' },
  { label: 'Horas de Estudo', value: '50k+' },
  { label: 'Avaliação Média', value: '4.9/5' },
]

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 lg:py-32">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
              </span>
              Nova versão 2.0 disponível!
            </div>
            <h1 className="text-4xl lg:text-6xl font-bold tracking-tight text-foreground mb-6">
              Sua Plataforma de{' '}
              <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                Estudos Inteligente
              </span>
            </h1>
            <p className="text-lg lg:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Organize seus estudos, descubra novos cursos, use técnicas de produtividade
              comprovadas e alcance seus objetivos de aprendizado de forma eficiente.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/auth/role-select">
                <Button size="lg" className="w-full sm:w-auto gap-2">
                  Começar Grátis
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
              <Link href="/dashboard/sorteio">
                <Button size="lg" variant="outline" className="w-full sm:w-auto">
                  Testar Sorteio
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-muted/30 border-y border-border">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, i) => (
              <div key={i} className="text-center">
                <div className="text-3xl lg:text-4xl font-bold text-foreground mb-1">{stat.value}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
              Tudo que você precisa para estudar melhor
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Ferramentas integradas para tornar seus estudos mais produtivos e organizados.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, i) => (
              <Link key={i} href={feature.href}>
                <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer group">
                  <CardHeader>
                    <div
                      className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center text-white mb-4 group-hover:scale-110 transition-transform`}
                    >
                      <feature.icon className="w-6 h-6" />
                    </div>
                    <CardTitle className="text-lg">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-base">{feature.description}</CardDescription>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary/5">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
            Pronto para transformar seus estudos?
          </h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            Junte-se a milhares de estudantes que já estão organizando sua rotina de estudos com o SABIO.
          </p>
          <Link href="/auth/role-select">
            <Button size="xl" className="gap-2">
              Começar Agora
              <ArrowRight className="w-5 h-5" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-border">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <GraduationCap className="w-6 h-6 text-primary" />
              <span className="font-bold text-xl">SABIO</span>
            </div>
            <p className="text-sm text-muted-foreground">
              © 2024 SABIO. Todos os direitos reservados.
            </p>
            <div className="flex items-center gap-6">
              <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Privacidade
              </a>
              <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Termos
              </a>
              <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Contato
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}