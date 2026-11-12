import { Metadata } from 'next'
import Link from 'next/link'
import { AuthForm } from '@/features/auth/components/AuthForm'

export const metadata: Metadata = {
  title: 'Recuperar Senha - SABIO',
  description: 'Recupere o acesso à sua conta no SABIO',
}

export default function ForgotPasswordPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-background">
      <div className="w-full max-w-md">
        <Link href="/auth/login" className="mb-8 inline-flex items-center gap-2 text-primary hover:underline">
          ← Voltar ao login
        </Link>
        <AuthForm />
      </div>
    </div>
  )
}