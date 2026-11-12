import { NextRequest, NextResponse } from 'next/server'
import { courses, getCoursesByType, getRandomCourse } from '@/data/courses'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const type = searchParams.get('type') as 'free' | 'paid' | null
  const action = searchParams.get('action')

  if (action === 'random' && type) {
    const course = getRandomCourse(type)
    return NextResponse.json(course)
  }

  if (type) {
    const filtered = getCoursesByType(type)
    return NextResponse.json(filtered)
  }

  return NextResponse.json(courses)
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { type } = body

    if (!type || (type !== 'free' && type !== 'paid')) {
      return NextResponse.json({ error: 'Invalid type' }, { status: 400 })
    }

    const course = getRandomCourse(type)
    return NextResponse.json(course)
  } catch {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
  }
}