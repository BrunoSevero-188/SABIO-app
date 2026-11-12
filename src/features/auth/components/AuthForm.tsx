'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Label } from '@/components/ui/Label'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/Card'
import { cn } from '@/lib/utils'

type AuthMode = 'login' | 'register' | 'forgot-password'

export function AuthForm() {
  const router = useRouter()
  const [mode, setMode] = useState<AuthMode>('login')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    name: '',
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }))
    setError(null)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      if (mode === 'login') {
        const { error } = await supabase.auth.signInWithPassword({
          email: formData.email,
          password: formData.password,
        })
        if (error) throw error
        router.push('/dashboard')
        router.refresh()
      } else if (mode === 'register') {
        if (formData.password !== formData.confirmPassword) {
          throw new Error('As senhas não coincidem')
        }
        const { error } = await supabase.auth.signUp({
          email: formData.email,
          password: formData.password,
          options: {
            data: { name: formData.name },
          },
        })
        if (error) throw error
        setMode('login')
        setFormData({ email: '', password: '', confirmPassword: '', name: '' })
        setError('Conta criada! Verifique seu email e faça login.')
      } else if (mode === 'forgot-password') {
        const { error } = await supabase.auth.resetPasswordForEmail(formData.email, {
          redirectTo: `${window.location.origin}/auth/reset-password`,
        })
        if (error) throw error
        setMode('login')
        setFormData({ email: '', password: '', confirmPassword: '', name: '' })
        setError('Email de recuperação enviado! Verifique sua caixa de entrada.')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro inesperado')
    } finally {
      setLoading(false)
    }
  }

  const switchMode = (newMode: AuthMode) => {
    setMode(newMode)
    setError(null)
    setFormData({ email: '', password: '', confirmPassword: '', name: '' })
  }

  const isRegister = mode === 'register'
  const isForgot = mode === 'forgot-password'

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl">
          {isRegister ? 'Criar conta' : isForgot ? 'Recuperar senha' : 'Entrar'}
        </CardTitle>
        <CardDescription>
          {isRegister
            ? 'Preencha os dados para começar'
            : isForgot
            ? 'Digite seu email para receber o link de recuperação'
            : 'Acesse sua conta para continuar'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div
              className={cn(
                'p-3 text-sm text-center rounded-md',
                error.startsWith('Conta') || error.startsWith('Email')
                  ? 'bg-green-500/20 text-green-400'
                  : 'bg-destructive/20 text-destructive'
              )}
              role="alert"
            >
              {error}
            </div>
          )}

          {isRegister && (
            <div className="space-y-2">
              <Label htmlFor="name">Nome</Label>
              <Input
                id="name"
                name="name"
                type="text"
                placeholder="Seu nome completo"
                value={formData.name}
                onChange={handleChange}
                required={isRegister}
                autoComplete="name"
                disabled={loading}
              />
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="seu@email.com"
              value={formData.email}
              onChange={handleChange}
              required
              autoComplete="email"
              disabled={loading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Senha</Label>
            <Input
              id="password"
              name="password"
              type="password"
              placeholder="••••••••"
              value={formData.password}
              onChange={handleChange}
              required={!isForgot}
              autoComplete={isRegister ? 'new-password' : 'current-password'}
              disabled={loading}
            />
          </div>

          {isRegister && (
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirmar senha</Label>
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                placeholder="••••••••"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                autoComplete="new-password"
                disabled={loading}
              />
            </div>
          )}

          <Button type="submit" className="w-full" size="lg" loading={loading}>
            {isRegister
              ? 'Criar conta'
              : isForgot
              ? 'Enviar link'
              : 'Entrar'}
          </Button>
        </form>
      </CardContent>
      <CardFooter className="flex flex-col space-y-3">
        {!isRegister && (
          <p className="text-sm text-muted-foreground text-center">
            Esqueceu a senha?{' '}
            <button
              type="button"
              onClick={() => switchMode('forgot-password')}
              className="text-primary hover:underline font-medium"
            >
              Recuperar
            </button>
          </p>
        )}
        <p className="text-sm text-muted-foreground text-center">
          {isRegister ? 'Já tem conta?' : 'Não tem conta?'} {' '}
          <button
            type="button"
            onClick={() => switchMode(isRegister ? 'login' : 'register')}
            className="text-primary hover:underline font-medium"
          >
            {isRegister ? 'Entrar' : 'Cadastrar'}
          </button>
        </p>
      </CardFooter>
    </Card>
  )
}