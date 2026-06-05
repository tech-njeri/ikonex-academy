// © 2026 Joy Njeri. Submitted for Ikonex Systems Intern Assessment.
// Evaluation use only. All rights reserved.
export const dynamic = 'force-dynamic'

import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

// GET — fetch all students
export async function GET() {
  try {
    const students = await prisma.student.findMany({
      include: { stream: true }
    })
    return NextResponse.json(students)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch students' }, { status: 500 })
  }
}

// POST — register a new student
export async function POST(request) {
  try {
    const body = await request.json()
    const student = await prisma.student.create({
      data: {
        name: body.name,
        admissionNo: body.admissionNo,
        streamId: body.streamId
      }
    })
    return NextResponse.json(student)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create student' }, { status: 500 })
  }
}

// DELETE — remove a student
export async function DELETE(request) {
  try {
    const body = await request.json()
    
    // Delete scores first
    await prisma.score.deleteMany({
      where: { studentId: body.id }
    })
    
    // Then delete student
    await prisma.student.delete({
      where: { id: body.id }
    })
    return NextResponse.json({ message: 'Student deleted' })
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}