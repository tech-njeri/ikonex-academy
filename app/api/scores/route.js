// © 2026 Joy Njeri. Submitted for Ikonex Systems Intern Assessment.
// Evaluation use only. All rights reserved.

import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

// GET — fetch scores for a specific student
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const studentId = parseInt(searchParams.get('studentId'))
    const scores = await prisma.score.findMany({
      where: { studentId },
      include: { subject: true }
    })
    return NextResponse.json(scores)
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

// POST — record a score
export async function POST(request) {
  try {
    const body = await request.json()
    const score = await prisma.score.create({
      data: {
        studentId: body.studentId,
        subjectId: body.subjectId,
        examScore: body.examScore,
        catScore: body.catScore
      }
    })
    return NextResponse.json(score)
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

// PUT — update an existing score
export async function PUT(request) {
  try {
    const body = await request.json()
    const score = await prisma.score.update({
      where: { id: body.id },
      data: {
        examScore: body.examScore,
        catScore: body.catScore
      }
    })
    return NextResponse.json(score)
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}