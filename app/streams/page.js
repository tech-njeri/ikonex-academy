// © 2026 Joy Njeri. Submitted for Ikonex Systems Intern Assessment.
// Evaluation use only. All rights reserved.

'use client'

import { useEffect, useState } from 'react'

export default function StreamsPage() {
  const [streams, setStreams] = useState([])
  const [name, setName] = useState('')
  const [loading, setLoading] = useState(false)
  const [editingStream, setEditingStream] = useState(null)
  const [error, setError] = useState(null)
  const [formError, setFormError] = useState(null)
  const [deleteError, setDeleteError] = useState(null)

  useEffect(() => {
    fetchStreams()
  }, [])

  async function fetchStreams() {
    try {
      const res = await fetch('/api/streams')
      if (!res.ok) throw new Error('Failed to load streams.')
      const data = await res.json()
      setStreams(data)
    } catch (err) {
      setError(err.message)
    }
  }

  async function createStream() {
    if (!name.trim()) {
      setFormError('Stream name is required.')
      return
    }
    setFormError(null)
    setLoading(true)
    try {
      const res = await fetch('/api/streams', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: name.trim() })
      })
      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error ?? 'Failed to create stream.')
      }
      setName('')
      await fetchStreams()
    } catch (err) {
      setFormError(err.message)
    } finally {
      setLoading(false)
    }
  }

  async function updateStream() {
    if (!name.trim()) {
      setFormError('Stream name is required.')
      return
    }
    setFormError(null)
    setLoading(true)
    try {
      const res = await fetch('/api/streams', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: editingStream.id, name: name.trim() })
      })
      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error ?? 'Failed to update stream.')
      }
      setName('')
      setEditingStream(null)
      await fetchStreams()
    } catch (err) {
      setFormError(err.message)
    } finally {
      setLoading(false)
    }
  }

  function startEdit(stream) {
    setEditingStream(stream)
    setName(stream.name)
    setFormError(null)
    setDeleteError(null)
  }

  function cancelEdit() {
    setEditingStream(null)
    setName('')
    setFormError(null)
  }

  async function deleteStream(id) {
    setDeleteError(null)
    try {
      const res = await fetch('/api/streams', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id })
      })
      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error ?? 'Failed to delete stream.')
      }
      await fetchStreams()
    } catch (err) {
      setDeleteError(err.message)
    }
  }

  return (
    <div className="p-8 max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Class Streams</h1>

      {/* Create / Edit Form */}
      <div className="flex gap-3 mb-2">
        <input
          type="text"
          placeholder="e.g. Form 1A"
          value={name}
          onChange={(e) => {
            setName(e.target.value)
            setFormError(null)
          }}
          className="border rounded px-4 py-2 flex-1"
        />
        <button
          onClick={editingStream ? updateStream : createStream}
          disabled={loading}
          className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
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

      {/* Inline form error */}
      {formError && (
        <p className="text-red-500 text-sm mb-6">{formError}</p>
      )}

      {/* Streams load error */}
      {error && (
        <p className="text-red-500 mb-4">{error}</p>
      )}

      {/* Delete error */}
      {deleteError && (
        <p className="text-red-500 text-sm mb-4">{deleteError}</p>
      )}

      {/* Streams List */}
      {streams.length === 0 && !error ? (
        <p className="text-gray-500 mt-6">No streams yet. Create one above.</p>
      ) : (
        <ul className="space-y-3 mt-6">
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