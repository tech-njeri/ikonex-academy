// © 2026 Joy Njeri. Submitted for Ikonex Systems Intern Assessment.
// Evaluation use only. All rights reserved.

'use client'

import { useEffect, useState } from 'react'

export default function StudentsPage() {
  const [students, setStudents] = useState([])
  const [streams, setStreams] = useState([])
  const [name, setName] = useState('')
  const [admissionNo, setAdmissionNo] = useState('')
  const [streamId, setStreamId] = useState('')
  const [loading, setLoading] = useState(false)
  const [editingStudent, setEditingStudent] = useState(null)
  const [fetchError, setFetchError] = useState(null)
  const [formError, setFormError] = useState(null)
  const [deleteError, setDeleteError] = useState(null)

  useEffect(() => {
    fetchStudents()
    fetchStreams()
  }, [])

  async function fetchStudents() {
    try {
      const res = await fetch('/api/students')
      if (!res.ok) throw new Error('Failed to load students.')
      const data = await res.json()
      setStudents(data)
    } catch (err) {
      setFetchError(err.message)
    }
  }

  async function fetchStreams() {
    try {
      const res = await fetch('/api/streams')
      if (!res.ok) throw new Error('Failed to load streams.')
      const data = await res.json()
      setStreams(data)
    } catch (err) {
      setFetchError(err.message)
    }
  }

  async function createStudent() {
    if (!name.trim() || !admissionNo.trim() || !streamId) {
      setFormError('All fields are required.')
      return
    }
    setFormError(null)
    setLoading(true)
    try {
      const res = await fetch('/api/students', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          admissionNo: admissionNo.trim(),
          streamId: parseInt(streamId)
        })
      })
      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error ?? 'Failed to create student.')
      }
      setName('')
      setAdmissionNo('')
      setStreamId('')
      await fetchStudents()
    } catch (err) {
      setFormError(err.message)
    } finally {
      setLoading(false)
    }
  }

  async function updateStudent() {
    if (!name.trim() || !admissionNo.trim() || !streamId) {
      setFormError('All fields are required.')
      return
    }
    setFormError(null)
    setLoading(true)
    try {
      const res = await fetch('/api/students', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: editingStudent.id,
          name: name.trim(),
          admissionNo: admissionNo.trim(),
          streamId: parseInt(streamId)
        })
      })
      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error ?? 'Failed to update student.')
      }
      setName('')
      setAdmissionNo('')
      setStreamId('')
      setEditingStudent(null)
      await fetchStudents()
    } catch (err) {
      setFormError(err.message)
    } finally {
      setLoading(false)
    }
  }

  function startEdit(student) {
    setEditingStudent(student)
    setName(student.name)
    setAdmissionNo(student.admissionNo)
    setStreamId(student.streamId)
    setFormError(null)
    setDeleteError(null)
  }

  function cancelEdit() {
    setEditingStudent(null)
    setName('')
    setAdmissionNo('')
    setStreamId('')
    setFormError(null)
  }

  async function deleteStudent(id) {
    setDeleteError(null)
    try {
      const res = await fetch('/api/students', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id })
      })
      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error ?? 'Failed to delete student.')
      }
      await fetchStudents()
    } catch (err) {
      setDeleteError(err.message)
    }
  }

  return (
    <div className="p-8 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Students</h1>

      {/* Register / Edit Form */}
      <div className="border rounded p-6 mb-8 space-y-4">
        <h2 className="text-xl font-semibold">
          {editingStudent ? 'Edit Student' : 'Register New Student'}
        </h2>
        <input
          type="text"
          placeholder="Full Name"
          value={name}
          onChange={(e) => {
            setName(e.target.value)
            setFormError(null)
          }}
          className="border rounded px-4 py-2 w-full"
        />
        <input
          type="text"
          placeholder="Admission Number e.g. ADM001"
          value={admissionNo}
          onChange={(e) => {
            setAdmissionNo(e.target.value)
            setFormError(null)
          }}
          className="border rounded px-4 py-2 w-full"
        />
        <select
          value={streamId}
          onChange={(e) => {
            setStreamId(e.target.value)
            setFormError(null)
          }}
          className="border rounded px-4 py-2 w-full"
        >
          <option value="">Select Stream</option>
          {streams.map((stream) => (
            <option key={stream.id} value={stream.id}>
              {stream.name}
            </option>
          ))}
        </select>

        {/* Inline form error */}
        {formError && (
          <p className="text-red-500 text-sm">{formError}</p>
        )}

        <div className="flex gap-3">
          <button
            onClick={editingStudent ? updateStudent : createStudent}
            disabled={loading}
            className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 disabled:opacity-50 flex-1"
          >
            {loading ? 'Saving...' : editingStudent ? 'Update Student' : 'Register Student'}
          </button>
          {editingStudent && (
            <button
              onClick={cancelEdit}
              className="border px-6 py-2 rounded hover:bg-gray-50"
            >
              Cancel
            </button>
          )}
        </div>
      </div>

      {/* Fetch error */}
      {fetchError && (
        <p className="text-red-500 mb-4">{fetchError}</p>
      )}

      {/* Delete error */}
      {deleteError && (
        <p className="text-red-500 text-sm mb-4">{deleteError}</p>
      )}

      {/* Students List */}
      {students.length === 0 && !fetchError ? (
        <p className="text-gray-500">No students yet. Register one above.</p>
      ) : (
        <ul className="space-y-3">
          {students.map((student) => (
            <li key={student.id} className="border rounded p-4 flex justify-between items-center">
              <div>
                <p className="font-medium">{student.name}</p>
                <p className="text-sm text-gray-500">
                  {student.admissionNo} — {student.stream?.name ?? 'No stream'}
                </p>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => startEdit(student)}
                  className="text-blue-500 hover:text-blue-700 text-sm"
                >
                  Edit
                </button>
                <button
                  onClick={() => deleteStudent(student.id)}
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