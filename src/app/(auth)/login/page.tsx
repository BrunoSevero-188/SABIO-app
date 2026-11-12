import { Metadata } from 'next'
import Link from 'next/link'
import { AuthForm } from '@/features/auth/components/AuthForm'

export const metadata: Metadata = {
  title: 'Login - SABIO',
  description: 'Acesse sua conta no SABIO',
}

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-background">
      <div className="w-full max-w-md">
        <Link href="/" className="mb-8 inline-flex items-center gap-2 text-primary hover:underline">
          ← Voltar ao início
        </Link>
        <AuthForm />
      </div>
    </div>
  )
}