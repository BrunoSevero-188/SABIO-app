import { User } from './index'

export interface AuthState {
  user: User | null
  loading: boolean
  error: string | null
}

export interface LoginCredentials {
  email: string
  password: string
}

export interface RegisterData extends LoginCredentials {
  name: string
  role: 'student' | 'teacher'
}

export interface PasswordResetRequest {
  email: string
}

export interface PasswordResetConfirm {
  password: string
  confirmPassword: string
}