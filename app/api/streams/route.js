// © 2026 Joy Njeri. Submitted for Ikonex Systems Intern Assessment.
// Evaluation use only. All rights reserved.

import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

// GET — fetch all streams from the database
export async function GET() {
  try {
    const streams = await prisma.stream.findMany({
      include: { students: true }
    })
    return NextResponse.json(streams)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch streams' }, { status: 500 })
  }
}
//The POST handler processes HTTP POST requests. It reads the JSON data from the request body, meaning the information sent by the client, and uses Prisma, which is the application's database access tool, to create a new record in the database. If the operation succeeds, it returns the created record as a JSON response; otherwise, it returns an error response with status code 500


// POST — create a new stream
export async function POST(request) {
  try {
    const body = await request.json()
    const stream = await prisma.stream.create({
      data: { name: body.name }
    })
    return NextResponse.json(stream)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create stream' }, { status: 500 })
  }
}

//The GET handler retrieves all streams from the database using Prisma’s findMany method, including related students. It waits for the database query to complete and then returns the result as JSON. If an error occurs, it returns a 500 error response.

// DELETE — remove a stream
export async function DELETE(request) {
  try {
    const body = await request.json()
    await prisma.stream.delete({
      where: { id: body.id }
    })
    return NextResponse.json({ message: 'Stream deleted' })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete stream' }, { status: 500 })
  }
}