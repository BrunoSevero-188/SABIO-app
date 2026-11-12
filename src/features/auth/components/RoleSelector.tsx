'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/Button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import { cn } from '@/lib/utils'

interface RoleOption {
  value: 'student' | 'teacher'
  label: string
  description: string
  icon: React.ReactNode
}

const roles: RoleOption[] = [
  {
    value: 'student',
    label: 'Estudante',
    description: 'Quero aprender, fazer cursos e acompanhar meu progresso',
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
      </svg>
    ),
  },
  {
    value: 'teacher',
    label: 'Professor/Instrutor',
    description: 'Quero ensinar, criar conteúdo e gerenciar alunos',
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    ),
  },
]

export function RoleSelector() {
  const router = useRouter()
  const [selectedRole, setSelectedRole] = useState<'student' | 'teacher' | null>(null)
  const [loading, setLoading] = useState(false)

  const handleContinue = async () => {
    if (!selectedRole) return
    setLoading(true)
    // Store role in localStorage for the registration flow
    localStorage.setItem('selectedRole', selectedRole)
    router.push('/auth/register')
    setLoading(false)
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-background">
      <div className="w-full max-w-2xl">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">Bem-vindo ao SABIO</h1>
          <p className="text-muted-foreground text-lg">
            Escolha como você deseja usar a plataforma
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          {roles.map((role) => (
            <button
              key={role.value}
              type="button"
              onClick={() => setSelectedRole(role.value)}
              className={cn(
                'relative p-6 rounded-xl border-2 transition-all text-left',
                selectedRole === role.value
                  ? 'border-primary bg-primary/10 shadow-lg shadow-primary/20'
                  : 'border-border hover:border-primary/50 hover:bg-accent/10'
              )}
            >
              <div className="flex items-start space-x-4">
                <div
                  className={cn(
                    'flex-shrink-0 w-14 h-14 rounded-lg flex items-center justify-center',
                    selectedRole === role.value
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted text-muted-foreground'
                  )}
                >
                  {role.icon}
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-foreground">{role.label}</h3>
                  <p className="text-sm text-muted-foreground mt-1">{role.description}</p>
                </div>
              </div>
              {selectedRole === role.value && (
                <div className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold">
                  ✓
                </div>
              )}
            </button>
          ))}
        </div>

        <Button
          className="w-full mt-8"
          size="lg"
          onClick={handleContinue}
          disabled={!selectedRole || loading}
          loading={loading}
        >
          Continuar
        </Button>

        <p className="text-center text-sm text-muted-foreground mt-6">
          Ao continuar, você concorda com nossos{' '}
          <a href="#" className="text-primary hover:underline">Termos de Uso</a>{' '}
          e{' '}
          <a href="#" className="text-primary hover:underline">Política de Privacidade</a>
        </p>
      </div>
    </div>
  )
}