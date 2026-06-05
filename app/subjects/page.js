// © 2026 Joy Njeri. Submitted for Ikonex Systems Intern Assessment.
// Evaluation use only. All rights reserved.

'use client'

import { useEffect, useState } from 'react'

export default function SubjectsPage() {
  const [subjects, setSubjects] = useState([])
  const [name, setName] = useState('')
  const [loading, setLoading] = useState(false)
  const [editingSubject, setEditingSubject] = useState(null)

  useEffect(() => {
    fetchSubjects()
  }, [])

  async function fetchSubjects() {
    const res = await fetch('/api/subjects')
    const data = await res.json()
    setSubjects(data)
  }

  async function createSubject() {
    if (!name) return alert('Please enter a subject name')
    setLoading(true)
    await fetch('/api/subjects', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name })
    })
    setName('')
    setLoading(false)
    fetchSubjects()
  }

  async function updateSubject() {
    if (!name) return alert('Please enter a subject name')
    setLoading(true)
    await fetch('/api/subjects', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: editingSubject.id, name })
    })
    setName('')
    setEditingSubject(null)
    setLoading(false)
    fetchSubjects()
  }

  function startEdit(subject) {
    setEditingSubject(subject)
    setName(subject.name)
  }

  function cancelEdit() {
    setEditingSubject(null)
    setName('')
  }

  async function deleteSubject(id) {
    await fetch('/api/subjects', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id })
    })
    fetchSubjects()
  }

  return (
    <div className="p-8 max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Subjects</h1>

      {/* Create / Edit Form */}
      <div className="flex gap-3 mb-8">
        <input
          type="text"
          placeholder="e.g. Mathematics"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="border rounded px-4 py-2 flex-1"
        />
        <button
          onClick={editingSubject ? updateSubject : createSubject}
          disabled={loading}
          className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
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

      {/* Subjects List */}
      {subjects.length === 0 ? (
        <p className="text-gray-500">No subjects yet. Add one above.</p>
      ) : (
        <ul className="space-y-3">
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