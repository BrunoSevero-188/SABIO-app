export interface User {
  id: string
  email: string
  name: string
  role: 'student' | 'teacher' | 'admin'
  avatar_url?: string
  created_at: string
  updated_at: string
}

export interface Course {
  id: string
  name: string
  link: string
  type: 'free' | 'paid'
  category?: string
  description?: string
  image_url?: string
}

export interface PomodoroSession {
  id: string
  user_id: string
  duration: number
  completed: boolean
  created_at: string
}

export interface Quiz {
  id: string
  title: string
  description: string
  questions: QuizQuestion[]
  created_at: string
}

export interface QuizQuestion {
  id: string
  question: string
  options: string[]
  correct_answer: number
}

export interface LotteryResult {
  course: Course
  drawn_at: string
}