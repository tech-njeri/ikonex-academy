// © 2026 Joy Njeri. Submitted for Ikonex Systems Intern Assessment.
// Evaluation use only. All rights reserved.
export const dynamic = 'force-dynamic'

import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

// GET — fetch all subjects
export async function GET() {
  try {
    const subjects = await prisma.subject.findMany()
    console.log('Fetched subjects:', subjects)
    return NextResponse.json(subjects)
  } catch (error) {
    console.error('GET SUBJECTS ERROR:', error.message)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

// POST — create a new subject
export async function POST(request) {
  try {
    const body = await request.json()
    console.log('Creating subject with name:', body.name)
    const subject = await prisma.subject.create({
      data: { name: body.name }
    })
    return NextResponse.json(subject)
  } catch (error) {
    console.error('CREATE SUBJECT ERROR:', error.message)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

// DELETE — remove a subject
export async function DELETE(request) {
  try {
    const body = await request.json()
    await prisma.subject.delete({
      where: { id: body.id }
    })
    return NextResponse.json({ message: 'Subject deleted' })
  } catch (error) {
    console.error('DELETE SUBJECT ERROR:', error.message)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function PUT(request) {
  try {
    const body = await request.json()
    const subject = await prisma.subject.update({
      where: { id: body.id },
      data: { name: body.name }
    })
    return NextResponse.json(subject)
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}