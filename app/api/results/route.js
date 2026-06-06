// © 2026 Joy Njeri. Submitted for Ikonex Systems Intern Assessment.
// Evaluation use only. All rights reserved.

export const dynamic = 'force-dynamic'

import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/authOptions'
import prisma from '@/lib/prisma'

function getGrade(average) {
  if (typeof average !== 'number' || isNaN(average)) return 'N/A'
  if (average >= 80) return 'A'
  if (average >= 60) return 'B'
  if (average >= 50) return 'C'
  if (average >= 40) return 'D'
  return 'E'
}

function assignPositions(results) {
  let position = 1
  results.forEach((student, index) => {
    if (index === 0) {
      student.position = 1
    } else if (student.total === results[index - 1].total) {
      // Tied — same position as previous student
      student.position = results[index - 1].position
    } else {
      // Skip positions equal to number of tied students above
      position = index + 1
      student.position = position
    }
  })
}

export async function GET(request) {
  const session = await getServerSession(authOptions)
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { searchParams } = new URL(request.url)
    const rawStreamId = searchParams.get('streamId')

    const streamId = parseInt(rawStreamId)
    if (!rawStreamId || isNaN(streamId)) {
      return NextResponse.json({ error: 'Invalid or missing streamId' }, { status: 400 })
    }

    const students = await prisma.student.findMany({
      where: { streamId },
      include: {
        scores: {
          include: { subject: true }
        }
      }
    })

    const results = students.map(student => {
      const validScores = student.scores.filter(
        s => typeof s.examScore === 'number' && typeof s.catScore === 'number'
        && !isNaN(s.examScore) && !isNaN(s.catScore)
      )

      const total = validScores.reduce((sum, s) => sum + s.examScore + s.catScore, 0)
      const average = validScores.length > 0 ? total / validScores.length : 0
      const grade = getGrade(average)

      return {
        id: student.id,
        name: student.name,
        admissionNo: student.admissionNo,
        scores: student.scores,
        total: parseFloat(total.toFixed(2)),
        average: parseFloat(average.toFixed(2)),
        grade
      }
    })

    results.sort((a, b) => b.total - a.total)
    assignPositions(results)

    return NextResponse.json(results)
  } catch (error) {
    console.error('[GET /api/results]', error)
    return NextResponse.json(
      { error: 'Failed to fetch results. Please try again.' },
      { status: 500 }
    )
  }
}


//auth
//error leaking
//NaN/null guards
//Tied positions