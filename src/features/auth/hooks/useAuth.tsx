'use client'

import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { User as SupabaseUser, Session } from '@supabase/supabase-js'
import { supabase } from '@/lib/supabase'
import { User, AuthState } from '@/types'

interface AuthContextType extends AuthState {
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>
  signUp: (email: string, password: string, name: string, role: 'student' | 'teacher') => Promise<{ error: Error | null }>
  signOut: () => Promise<void>
  resetPassword: (email: string) => Promise<{ error: Error | null }>
  updatePassword: (password: string) => Promise<{ error: Error | null }>
  refreshUser: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AuthState>({
    user: null,
    loading: true,
    error: null,
  })

  const mapUser = async (supabaseUser: SupabaseUser | null): Promise<User | null> => {
    if (!supabaseUser) return null

    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', supabaseUser.id)
      .single()

    return {
      id: supabaseUser.id,
      email: supabaseUser.email!,
      name: profile?.name || supabaseUser.user_metadata?.name || '',
      role: profile?.role || supabaseUser.user_metadata?.role || 'student',
      avatar_url: profile?.avatar_url || supabaseUser.user_metadata?.avatar_url,
      created_at: supabaseUser.created_at,
      updated_at: new Date().toISOString(),
    }
  }

  const refreshUser = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    const mappedUser = await mapUser(user)
    setState((prev) => ({ ...prev, user: mappedUser, loading: false }))
  }

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
        const mappedUser = await mapUser(session?.user ?? null)
        setState((prev) => ({ ...prev, user: mappedUser, loading: false }))
      } else if (event === 'SIGNED_OUT') {
        setState((prev) => ({ ...prev, user: null, loading: false }))
      }
    })

    supabase.auth.getSession().then(async ({ data: { session } }) => {
      const mappedUser = await mapUser(session?.user ?? null)
      setState((prev) => ({ ...prev, user: mappedUser, loading: false }))
    })

    return () => subscription.unsubscribe()
  }, [])

  const signIn = async (email: string, password: string) => {
    setState((prev) => ({ ...prev, loading: true, error: null }))
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) {
      setState((prev) => ({ ...prev, loading: false, error: error.message }))
      return { error }
    }
    return { error: null }
  }

  const signUp = async (email: string, password: string, name: string, role: 'student' | 'teacher') => {
    setState((prev) => ({ ...prev, loading: true, error: null }))
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { name, role } },
    })
    if (error) {
      setState((prev) => ({ ...prev, loading: false, error: error.message }))
      return { error }
    }
    return { error: null }
  }

  const signOut = async () => {
    setState((prev) => ({ ...prev, loading: true }))
    await supabase.auth.signOut()
    setState((prev) => ({ ...prev, user: null, loading: false }))
  }

  const resetPassword = async (email: string) => {
    setState((prev) => ({ ...prev, loading: true, error: null }))
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/reset-password`,
    })
    setState((prev) => ({ ...prev, loading: false }))
    if (error) return { error }
    return { error: null }
  }

  const updatePassword = async (password: string) => {
    setState((prev) => ({ ...prev, loading: true, error: null }))
    const { error } = await supabase.auth.updateUser({ password })
    setState((prev) => ({ ...prev, loading: false }))
    if (error) return { error }
    return { error: null }
  }

  return (
    <AuthContext.Provider
      value={{
        user: state.user,
        loading: state.loading,
        error: state.error,
        signIn,
        signUp,
        signOut,
        resetPassword,
        updatePassword,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}