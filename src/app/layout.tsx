import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import '@/styles/globals.css'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })

export const metadata: Metadata = {
  title: 'SABIO - Sua Plataforma de Estudos Inteligente',
  description: 'Gerencie seus estudos, faça sorteios de cursos, use Pomodoro e muito mais.',
  keywords: ['estudos', 'pomodoro', 'cursos', 'produtividade', 'educação'],
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR" className={`${inter.variable} antialiased`}>
      <body className="bg-background text-foreground min-h-screen">
        {children}
      </body>
    </html>
  )
}