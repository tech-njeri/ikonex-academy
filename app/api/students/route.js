// © 2026 Joy Njeri. Submitted for Ikonex Systems Intern Assessment.
// Evaluation use only. All rights reserved.
export const dynamic = 'force-dynamic'

import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
// import { authOptions } from '@/lib/authOptions'
import prisma from '@/lib/prisma'

// GET — fetch all students
export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const students = await prisma.student.findMany({
      include: { stream: true }
    })
    return NextResponse.json(students)
  } catch (error) {
    console.error('[GET /api/students]', error)
    return NextResponse.json({ error: 'Failed to fetch students.' }, { status: 500 })
  }
}

// POST — register a new student
export async function POST(request) {
  const session = await getServerSession(authOptions)
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const body = await request.json()
    const { name, admissionNo, streamId } = body

    if (!name || typeof name !== 'string' || name.trim() === '') {
      return NextResponse.json({ error: 'Student name is required.' }, { status: 400 })
    }
    if (!admissionNo || typeof admissionNo !== 'string' || admissionNo.trim() === '') {
      return NextResponse.json({ error: 'Admission number is required.' }, { status: 400 })
    }
    if (!streamId) {
      return NextResponse.json({ error: 'streamId is required.' }, { status: 400 })
    }

    // Confirm stream exists
    const stream = await prisma.stream.findUnique({ where: { id: streamId } })
    if (!stream) {
      return NextResponse.json({ error: 'Stream not found.' }, { status: 404 })
    }

    // Prevent duplicate admission numbers
    const existing = await prisma.student.findFirst({
      where: { admissionNo: admissionNo.trim() }
    })
    if (existing) {
      return NextResponse.json(
        { error: 'A student with this admission number already exists.' },
        { status: 409 }
      )
    }

    const student = await prisma.student.create({
      data: {
        name: name.trim(),
        admissionNo: admissionNo.trim(),
        streamId
      }
    })

    return NextResponse.json(student, { status: 201 })
  } catch (error) {
    console.error('[POST /api/students]', error)
    return NextResponse.json({ error: 'Failed to create student.' }, { status: 500 })
  }
}

// PUT — update a student's details
export async function PUT(request) {
  const session = await getServerSession(authOptions)
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const body = await request.json()
    const { id, name, admissionNo, streamId } = body

    if (!id) {
      return NextResponse.json({ error: 'Student id is required.' }, { status: 400 })
    }
    if (!name || typeof name !== 'string' || name.trim() === '') {
      return NextResponse.json({ error: 'Student name is required.' }, { status: 400 })
    }
    if (!admissionNo || typeof admissionNo !== 'string' || admissionNo.trim() === '') {
      return NextResponse.json({ error: 'Admission number is required.' }, { status: 400 })
    }
    if (!streamId) {
      return NextResponse.json({ error: 'streamId is required.' }, { status: 400 })
    }

    // Confirm student exists
    const existing = await prisma.student.findUnique({ where: { id } })
    if (!existing) {
      return NextResponse.json({ error: 'Student not found.' }, { status: 404 })
    }

    // Confirm target stream exists
    const stream = await prisma.stream.findUnique({ where: { id: streamId } })
    if (!stream) {
      return NextResponse.json({ error: 'Stream not found.' }, { status: 404 })
    }

    // Prevent admission number collision with a different student
    const duplicate = await prisma.student.findFirst({
      where: { admissionNo: admissionNo.trim(), NOT: { id } }
    })
    if (duplicate) {
      return NextResponse.json(
        { error: 'A student with this admission number already exists.' },
        { status: 409 }
      )
    }

    const student = await prisma.student.update({
      where: { id },
      data: {
        name: name.trim(),
        admissionNo: admissionNo.trim(),
        streamId
      }
    })

    return NextResponse.json(student)
  } catch (error) {
    console.error('[PUT /api/students]', error)
    return NextResponse.json({ error: 'Failed to update student.' }, { status: 500 })
  }
}

// DELETE — remove a student and their scores
export async function DELETE(request) {
  const session = await getServerSession(authOptions)
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const body = await request.json()
    const { id } = body

    if (!id) {
      return NextResponse.json({ error: 'Student id is required.' }, { status: 400 })
    }

    // Confirm student exists
    const existing = await prisma.student.findUnique({ where: { id } })
    if (!existing) {
      return NextResponse.json({ error: 'Student not found.' }, { status: 404 })
    }

    // Wrap both deletes in a transaction
    await prisma.$transaction(async (tx) => {
      await tx.score.deleteMany({ where: { studentId: id } })
      await tx.student.delete({ where: { id } })
    })

    return new NextResponse(null, { status: 204 })
  } catch (error) {
    console.error('[DELETE /api/students]', error)
    return NextResponse.json({ error: 'Failed to delete student.' }, { status: 500 })
  }
}