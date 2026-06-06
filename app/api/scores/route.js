// © 2026 Joy Njeri. Submitted for Ikonex Systems Intern Assessment.
// Evaluation use only. All rights reserved.
export const dynamic = 'force-dynamic'

import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/authOptions'
import prisma from '@/lib/prisma'

const MAX_SCORE = 100
const MIN_SCORE = 0

function isValidScore(value) {
  return typeof value === 'number' && !isNaN(value) && value >= MIN_SCORE && value <= MAX_SCORE
}

// GET — fetch scores for a specific student
export async function GET(request) {
  const session = await getServerSession(authOptions)
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { searchParams } = new URL(request.url)
    const rawStudentId = searchParams.get('studentId')
    const studentId = parseInt(rawStudentId)

    if (!rawStudentId || isNaN(studentId)) {
      return NextResponse.json({ error: 'Invalid or missing studentId' }, { status: 400 })
    }

    const scores = await prisma.score.findMany({
      where: { studentId },
      include: { subject: true }
    })

    return NextResponse.json(scores)
  } catch (error) {
    console.error('[GET /api/scores]', error)
    return NextResponse.json({ error: 'Failed to fetch scores.' }, { status: 500 })
  }
}

// POST — record a score
export async function POST(request) {
  const session = await getServerSession(authOptions)
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const body = await request.json()
    const { studentId, subjectId, examScore, catScore } = body

    // Validate all required fields are present and correct types
    if (!studentId || !subjectId) {
      return NextResponse.json({ error: 'studentId and subjectId are required.' }, { status: 400 })
    }
    if (!isValidScore(examScore) || !isValidScore(catScore)) {
      return NextResponse.json(
        { error: `Scores must be numbers between ${MIN_SCORE} and ${MAX_SCORE}.` },
        { status: 400 }
      )
    }

    // Check student and subject actually exist
    const [student, subject] = await Promise.all([
      prisma.student.findUnique({ where: { id: studentId } }),
      prisma.subject.findUnique({ where: { id: subjectId } })
    ])

    if (!student) {
      return NextResponse.json({ error: 'Student not found.' }, { status: 404 })
    }
    if (!subject) {
      return NextResponse.json({ error: 'Subject not found.' }, { status: 404 })
    }

    // Prevent duplicate score for same student + subject
    const existing = await prisma.score.findFirst({
      where: { studentId, subjectId }
    })
    if (existing) {
      return NextResponse.json(
        { error: 'A score for this student and subject already exists. Use PUT to update it.' },
        { status: 409 }
      )
    }

    const score = await prisma.score.create({
      data: { studentId, subjectId, examScore, catScore }
    })

    return NextResponse.json(score, { status: 201 })
  } catch (error) {
    console.error('[POST /api/scores]', error)
    return NextResponse.json({ error: 'Failed to create score.' }, { status: 500 })
  }
}

// PUT — update an existing score
export async function PUT(request) {
  const session = await getServerSession(authOptions)
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const body = await request.json()
    const { id, examScore, catScore } = body

    if (!id) {
      return NextResponse.json({ error: 'Score id is required.' }, { status: 400 })
    }
    if (!isValidScore(examScore) || !isValidScore(catScore)) {
      return NextResponse.json(
        { error: `Scores must be numbers between ${MIN_SCORE} and ${MAX_SCORE}.` },
        { status: 400 }
      )
    }

    // Confirm the score record exists before attempting update
    const existing = await prisma.score.findUnique({ where: { id } })
    if (!existing) {
      return NextResponse.json({ error: 'Score not found.' }, { status: 404 })
    }

    // Ownership check — only allow update if the student belongs to the session user's stream
    // Adjust this logic to match your actual role/permission model
    const student = await prisma.student.findUnique({ where: { id: existing.studentId } })
    if (!student || student.teacherId !== session.user.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const score = await prisma.score.update({
      where: { id },
      data: { examScore, catScore }
    })

    return NextResponse.json(score)
  } catch (error) {
    console.error('[PUT /api/scores]', error)
    return NextResponse.json({ error: 'Failed to update score.' }, { status: 500 })
  }
}