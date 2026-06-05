// © 2026 Joy Njeri. Submitted for Ikonex Systems Intern Assessment.
// Evaluation use only. All rights reserved.

'use client'

import { useEffect, useState } from 'react'

export default function StreamsPage() {
  const [streams, setStreams] = useState([])
  const [name, setName] = useState('')
  const [loading, setLoading] = useState(false)
  const [editingStream, setEditingStream] = useState(null)

  useEffect(() => {
    fetchStreams()
  }, [])

  async function fetchStreams() {
    const res = await fetch('/api/streams')
    const data = await res.json()
    setStreams(data)
  }

  async function createStream() {
    if (!name) return
    setLoading(true)
    await fetch('/api/streams', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name })
    })
    setName('')
    setLoading(false)
    fetchStreams()
  }

  async function updateStream() {
    if (!name) return
    setLoading(true)
    await fetch('/api/streams', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: editingStream.id, name })
    })
    setName('')
    setEditingStream(null)
    setLoading(false)
    fetchStreams()
  }

  function startEdit(stream) {
    setEditingStream(stream)
    setName(stream.name)
  }

  function cancelEdit() {
    setEditingStream(null)
    setName('')
  }

  async function deleteStream(id) {
    await fetch('/api/streams', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id })
    })
    fetchStreams()
  }

  return (
    <div className="p-8 max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Class Streams</h1>

      {/* Create / Edit Form */}
      <div className="flex gap-3 mb-8">
        <input
          type="text"
          placeholder="e.g. Form 1A"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="border rounded px-4 py-2 flex-1"
        />
        <button
          onClick={editingStream ? updateStream : createStream}
          disabled={loading}
          className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
        >
          {loading ? 'Saving...' : editingStream ? 'Update' : 'Create Stream'}
        </button>
        {editingStream && (
          <button
            onClick={cancelEdit}
            className="border px-4 py-2 rounded hover:bg-gray-50"
          >
            Cancel
          </button>
        )}
      </div>

      {/* Streams List */}
      {streams.length === 0 ? (
        <p className="text-gray-500">No streams yet. Create one above.</p>
      ) : (
        <ul className="space-y-3">
          {streams.map((stream) => (
            <li key={stream.id} className="border rounded p-4 flex justify-between items-center">
              <span className="font-medium">{stream.name}</span>
              <div className="flex items-center gap-4">
                <span className="text-gray-500 text-sm">
                  {stream.students.length} student(s)
                </span>
                <button
                  onClick={() => startEdit(stream)}
                  className="text-blue-500 hover:text-blue-700 text-sm"
                >
                  Edit
                </button>
                <button
                  onClick={() => deleteStream(stream.id)}
                  className="text-red-500 hover:text-red-700 text-sm"
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}