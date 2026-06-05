// © 2026 Joy Njeri. Submitted for Ikonex Systems Intern Assessment.
// Evaluation use only. All rights reserved.

import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

function getGrade(total) {
  if (total >= 80) return 'A'
  if (total >= 60) return 'B'
  if (total >= 50) return 'C'
  if (total >= 40) return 'D'
  return 'E'
}

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const streamId = parseInt(searchParams.get('streamId'))

    // Get all students in the stream
    const students = await prisma.student.findMany({
      where: { streamId },
      include: {
        scores: {
          include: { subject: true }
        }
      }
    })

    // Calculate results for each student
    const results = students.map(student => {
      const total = student.scores.reduce((sum, s) => sum + s.examScore + s.catScore, 0)
      const average = student.scores.length > 0 ? total / student.scores.length : 0
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

    // Rank students by total marks
    results.sort((a, b) => b.total - a.total)
    results.forEach((r, index) => r.position = index + 1)

    return NextResponse.json(results)
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}