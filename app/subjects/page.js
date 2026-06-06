// © 2026 Joy Njeri. Submitted for Ikonex Systems Intern Assessment.
// Evaluation use only. All rights reserved.

'use client'

import { useEffect, useState } from 'react'

export default function SubjectsPage() {
  const [subjects, setSubjects] = useState([])
  const [name, setName] = useState('')
  const [loading, setLoading] = useState(false)
  const [editingSubject, setEditingSubject] = useState(null)
  const [fetchError, setFetchError] = useState(null)
  const [formError, setFormError] = useState(null)
  const [deleteError, setDeleteError] = useState(null)

  useEffect(() => {
    fetchSubjects()
  }, [])

  async function fetchSubjects() {
    try {
      const res = await fetch('/api/subjects')
      if (!res.ok) throw new Error('Failed to load subjects.')
      const data = await res.json()
      setSubjects(data)
    } catch (err) {
      setFetchError(err.message)
    }
  }

  async function createSubject() {
    if (!name.trim()) {
      setFormError('Subject name is required.')
      return
    }
    setFormError(null)
    setLoading(true)
    try {
      const res = await fetch('/api/subjects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: name.trim() })
      })
      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error ?? 'Failed to create subject.')
      }
      setName('')
      await fetchSubjects()
    } catch (err) {
      setFormError(err.message)
    } finally {
      setLoading(false)
    }
  }

  async function updateSubject() {
    if (!name.trim()) {
      setFormError('Subject name is required.')
      return
    }
    setFormError(null)
    setLoading(true)
    try {
      const res = await fetch('/api/subjects', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: editingSubject.id, name: name.trim() })
      })
      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error ?? 'Failed to update subject.')
      }
      setName('')
      setEditingSubject(null)
      await fetchSubjects()
    } catch (err) {
      setFormError(err.message)
    } finally {
      setLoading(false)
    }
  }

  function startEdit(subject) {
    setEditingSubject(subject)
    setName(subject.name)
    setFormError(null)
    setDeleteError(null)
  }

  function cancelEdit() {
    setEditingSubject(null)
    setName('')
    setFormError(null)
  }

  async function deleteSubject(id) {
    setDeleteError(null)
    try {
      const res = await fetch('/api/subjects', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id })
      })
      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error ?? 'Failed to delete subject.')
      }
      await fetchSubjects()
    } catch (err) {
      setDeleteError(err.message)
    }
  }

  return (
    <div className="p-8 max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Subjects</h1>

      {/* Create / Edit Form */}
      <div className="flex gap-3 mb-2">
        <input
          type="text"
          placeholder="e.g. Mathematics"
          value={name}
          onChange={(e) => {
            setName(e.target.value)
            setFormError(null)
          }}
          className="border rounded px-4 py-2 flex-1"
        />
        <button
          onClick={editingSubject ? updateSubject : createSubject}
          disabled={loading}
          className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? 'Saving...' : editingSubject ? 'Update' : 'Add Subject'}
        </button>
        {editingSubject && (
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

      {/* Fetch error */}
      {fetchError && (
        <p className="text-red-500 mb-4">{fetchError}</p>
      )}

      {/* Delete error */}
      {deleteError && (
        <p className="text-red-500 text-sm mb-4">{deleteError}</p>
      )}

      {/* Subjects List */}
      {subjects.length === 0 && !fetchError ? (
        <p className="text-gray-500 mt-6">No subjects yet. Add one above.</p>
      ) : (
        <ul className="space-y-3 mt-6">
          {subjects.map((subject) => (
            <li key={subject.id} className="border rounded p-4 flex justify-between items-center">
              <span className="font-medium">{subject.name}</span>
              <div className="flex gap-3">
                <button
                  onClick={() => startEdit(subject)}
                  className="text-blue-500 hover:text-blue-700 text-sm"
                >
                  Edit
                </button>
                <button
                  onClick={() => deleteSubject(subject.id)}
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