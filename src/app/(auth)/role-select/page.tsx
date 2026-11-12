import { Metadata } from 'next'
import Link from 'next/link'
import { RoleSelector } from '@/features/auth/components/RoleSelector'

export const metadata: Metadata = {
  title: 'Escolha seu Perfil - SABIO',
  description: 'Selecione como você deseja usar o SABIO',
}

export default function RoleSelectPage() {
  return (
    <div className="min-h-screen bg-background">
      <Link
        href="/"
        className="fixed top-4 left-4 z-10 inline-flex items-center gap-2 text-primary hover:underline"
      >
        ← Início
      </Link>
      <RoleSelector />
    </div>
  )
}