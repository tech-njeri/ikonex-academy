// © 2026 Joy Njeri. Submitted for Ikonex Systems Intern Assessment.
// Evaluation use only. All rights reserved.
export const dynamic = 'force-dynamic'

import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
// import { authOptions } from '@/lib/authOptions'
import prisma from '@/lib/prisma'

// GET — fetch all subjects
export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const subjects = await prisma.subject.findMany()
    return NextResponse.json(subjects)
  } catch (error) {
    console.error('[GET /api/subjects]', error)
    return NextResponse.json({ error: 'Failed to fetch subjects.' }, { status: 500 })
  }
}

// POST — create a new subject
export async function POST(request) {
  const session = await getServerSession(authOptions)
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const body = await request.json()
    const { name } = body

    if (!name || typeof name !== 'string' || name.trim() === '') {
      return NextResponse.json({ error: 'Subject name is required.' }, { status: 400 })
    }

    // Prevent duplicate subject names
    const existing = await prisma.subject.findFirst({
      where: { name: name.trim() }
    })
    if (existing) {
      return NextResponse.json(
        { error: 'A subject with this name already exists.' },
        { status: 409 }
      )
    }

    const subject = await prisma.subject.create({
      data: { name: name.trim() }
    })

    return NextResponse.json(subject, { status: 201 })
  } catch (error) {
    console.error('[POST /api/subjects]', error)
    return NextResponse.json({ error: 'Failed to create subject.' }, { status: 500 })
  }
}

// PUT — update a subject name
export async function PUT(request) {
  const session = await getServerSession(authOptions)
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const body = await request.json()
    const { id, name } = body

    if (!id) {
      return NextResponse.json({ error: 'Subject id is required.' }, { status: 400 })
    }
    if (!name || typeof name !== 'string' || name.trim() === '') {
      return NextResponse.json({ error: 'Subject name is required.' }, { status: 400 })
    }

    // Confirm subject exists
    const existing = await prisma.subject.findUnique({ where: { id } })
    if (!existing) {
      return NextResponse.json({ error: 'Subject not found.' }, { status: 404 })
    }

    // Prevent rename collision with a different subject
    const duplicate = await prisma.subject.findFirst({
      where: { name: name.trim(), NOT: { id } }
    })
    if (duplicate) {
      return NextResponse.json(
        { error: 'A subject with this name already exists.' },
        { status: 409 }
      )
    }

    const subject = await prisma.subject.update({
      where: { id },
      data: { name: name.trim() }
    })

    return NextResponse.json(subject)
  } catch (error) {
    console.error('[PUT /api/subjects]', error)
    return NextResponse.json({ error: 'Failed to update subject.' }, { status: 500 })
  }
}

// DELETE — remove a subject
export async function DELETE(request) {
  const session = await getServerSession(authOptions)
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const body = await request.json()
    const { id } = body

    if (!id) {
      return NextResponse.json({ error: 'Subject id is required.' }, { status: 400 })
    }

    // Confirm subject exists
    const existing = await prisma.subject.findUnique({ where: { id } })
    if (!existing) {
      return NextResponse.json({ error: 'Subject not found.' }, { status: 404 })
    }

    // Block deletion if scores exist against this subject
    const relatedScores = await prisma.score.findFirst({
      where: { subjectId: id }
    })
    if (relatedScores) {
      return NextResponse.json(
        { error: 'Cannot delete this subject — scores have already been recorded against it. Delete the scores first.' },
        { status: 409 }
      )
    }

    // Block deletion if subject is assigned to any stream
    const relatedStreams = await prisma.streamSubject.findFirst({
      where: { subjectId: id }
    })
    if (relatedStreams) {
      return NextResponse.json(
        { error: 'Cannot delete this subject — it is currently assigned to one or more streams. Remove those assignments first.' },
        { status: 409 }
      )
    }

    await prisma.subject.delete({ where: { id } })

    return new NextResponse(null, { status: 204 })
  } catch (error) {
    console.error('[DELETE /api/subjects]', error)
    return NextResponse.json({ error: 'Failed to delete subject.' }, { status: 500 })
  }
}