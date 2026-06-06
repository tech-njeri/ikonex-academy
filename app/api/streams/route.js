// © 2026 Joy Njeri. Submitted for Ikonex Systems Intern Assessment.
// Evaluation use only. All rights reserved.
export const dynamic = 'force-dynamic'

import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
// import { authOptions } from '@/lib/authOptions'
import prisma from '@/lib/prisma'

// GET — fetch all streams with their students
export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const streams = await prisma.stream.findMany({
      include: { students: true }
    })
    return NextResponse.json(streams)
  } catch (error) {
    console.error('[GET /api/streams]', error)
    return NextResponse.json({ error: 'Failed to fetch streams.' }, { status: 500 })
  }
}

// POST — create a new stream
export async function POST(request) {
  const session = await getServerSession(authOptions)
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const body = await request.json()
    const { name } = body

    if (!name || typeof name !== 'string' || name.trim() === '') {
      return NextResponse.json({ error: 'Stream name is required.' }, { status: 400 })
    }

    // Prevent duplicate stream names
    const existing = await prisma.stream.findFirst({
      where: { name: name.trim() }
    })
    if (existing) {
      return NextResponse.json(
        { error: 'A stream with this name already exists.' },
        { status: 409 }
      )
    }

    const stream = await prisma.stream.create({
      data: { name: name.trim() }
    })

    return NextResponse.json(stream, { status: 201 })
  } catch (error) {
    console.error('[POST /api/streams]', error)
    return NextResponse.json({ error: 'Failed to create stream.' }, { status: 500 })
  }
}

// PUT — update a stream name
export async function PUT(request) {
  const session = await getServerSession(authOptions)
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const body = await request.json()
    const { id, name } = body

    if (!id) {
      return NextResponse.json({ error: 'Stream id is required.' }, { status: 400 })
    }
    if (!name || typeof name !== 'string' || name.trim() === '') {
      return NextResponse.json({ error: 'Stream name is required.' }, { status: 400 })
    }

    // Confirm stream exists
    const existing = await prisma.stream.findUnique({ where: { id } })
    if (!existing) {
      return NextResponse.json({ error: 'Stream not found.' }, { status: 404 })
    }

    // Prevent renaming to a name that already exists on a different stream
    const duplicate = await prisma.stream.findFirst({
      where: { name: name.trim(), NOT: { id } }
    })
    if (duplicate) {
      return NextResponse.json(
        { error: 'A stream with this name already exists.' },
        { status: 409 }
      )
    }

    const stream = await prisma.stream.update({
      where: { id },
      data: { name: name.trim() }
    })

    return NextResponse.json(stream)
  } catch (error) {
    console.error('[PUT /api/streams]', error)
    return NextResponse.json({ error: 'Failed to update stream.' }, { status: 500 })
  }
}

// DELETE — remove a stream and all related data
export async function DELETE(request) {
  const session = await getServerSession(authOptions)
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const body = await request.json()
    const { id } = body

    if (!id) {
      return NextResponse.json({ error: 'Stream id is required.' }, { status: 400 })
    }

    // Confirm stream exists before attempting deletion
    const existing = await prisma.stream.findUnique({ where: { id } })
    if (!existing) {
      return NextResponse.json({ error: 'Stream not found.' }, { status: 404 })
    }

    // Wrap all deletes in a transaction — if any step fails, all steps are rolled back
    await prisma.$transaction(async (tx) => {
      // Get all student ids in this stream
      const students = await tx.student.findMany({
        where: { streamId: id },
        select: { id: true }
      })
      const studentIds = students.map(s => s.id)

      // Delete all scores for all students in one query
      await tx.score.deleteMany({
        where: { studentId: { in: studentIds } }
      })

      // Delete all stream-subject assignments
      await tx.streamSubject.deleteMany({
        where: { streamId: id }
      })

      // Delete all students in the stream
      await tx.student.deleteMany({
        where: { streamId: id }
      })

      // Finally delete the stream itself
      await tx.stream.delete({
        where: { id }
      })
    })

    return new NextResponse(null, { status: 204 })
  } catch (error) {
    console.error('[DELETE /api/streams]', error)
    return NextResponse.json({ error: 'Failed to delete stream.' }, { status: 500 })
  }
}