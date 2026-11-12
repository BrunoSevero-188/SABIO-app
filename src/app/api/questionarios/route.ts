import { NextRequest, NextResponse } from 'next/server'
import { quizzes } from '@/data/quizzes'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const id = searchParams.get('id')

  if (id) {
    const quiz = quizzes.find((q) => q.id === id)
    if (!quiz) {
      return NextResponse.json({ error: 'Quiz not found' }, { status: 404 })
    }
    return NextResponse.json(quiz)
  }

  return NextResponse.json(quizzes.map(({ questions, ...q }) => q))
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { quizId, answers } = body

    const quiz = quizzes.find((q) => q.id === quizId)
    if (!quiz) {
      return NextResponse.json({ error: 'Quiz not found' }, { status: 404 })
    }

    let score = 0
    const results = quiz.questions.map((q) => {
      const userAnswer = answers[q.id]
      const correct = userAnswer === q.correctAnswer
      if (correct) score++
      return {
        questionId: q.id,
        question: q.question,
        userAnswer,
        correctAnswer: q.correctAnswer,
        correct,
        explanation: q.explanation,
      }
    })

    return NextResponse.json({
      score,
      total: quiz.questions.length,
      percentage: Math.round((score / quiz.questions.length) * 100),
      results,
    })
  } catch {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
  }
}