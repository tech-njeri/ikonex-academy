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

  useEffect(() => {
    fetchStudents()
    fetchStreams()
  }, [])

  async function fetchStudents() {
    const res = await fetch('/api/students')
    const data = await res.json()
    setStudents(data)
  }

  async function fetchStreams() {
    const res = await fetch('/api/streams')
    const data = await res.json()
    setStreams(data)
  }

  async function createStudent() {
    if (!name || !admissionNo || !streamId) return alert('Please fill all fields')
    setLoading(true)
    await fetch('/api/students', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, admissionNo, streamId: parseInt(streamId) })
    })
    setName('')
    setAdmissionNo('')
    setStreamId('')
    setLoading(false)
    fetchStudents()
  }

  async function updateStudent() {
    if (!name || !admissionNo || !streamId) return alert('Please fill all fields')
    setLoading(true)
    await fetch('/api/students', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: editingStudent.id, name, admissionNo, streamId: parseInt(streamId) })
    })
    setName('')
    setAdmissionNo('')
    setStreamId('')
    setEditingStudent(null)
    setLoading(false)
    fetchStudents()
  }

  function startEdit(student) {
    setEditingStudent(student)
    setName(student.name)
    setAdmissionNo(student.admissionNo)
    setStreamId(student.streamId)
  }

  function cancelEdit() {
    setEditingStudent(null)
    setName('')
    setAdmissionNo('')
    setStreamId('')
  }

  async function deleteStudent(id) {
    await fetch('/api/students', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id })
    })
    fetchStudents()
  }

  async function deleteAllStudents() {
    if (!confirm('Are you sure you want to delete ALL students? This cannot be undone.')) return
    for (const s of students) {
      await fetch('/api/students', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: s.id })
      })
    }
    await fetchStudents()
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
          onChange={(e) => setName(e.target.value)}
          className="border rounded px-4 py-2 w-full"
        />
        <input
          type="text"
          placeholder="Admission Number e.g. ADM001"
          value={admissionNo}
          onChange={(e) => setAdmissionNo(e.target.value)}
          className="border rounded px-4 py-2 w-full"
        />
        <select
          value={streamId}
          onChange={(e) => setStreamId(e.target.value)}
          className="border rounded px-4 py-2 w-full"
        >
          <option value="">Select Stream</option>
          {streams.map((stream) => (
            <option key={stream.id} value={stream.id}>
              {stream.name}
            </option>
          ))}
        </select>
        <div className="flex gap-3">
          <button
            onClick={editingStudent ? updateStudent : createStudent}
            disabled={loading}
            className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 flex-1"
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

      {/* Delete All */}
      {students.length > 0 && (
        <button
          onClick={deleteAllStudents}
          className="text-red-500 border border-red-300 px-4 py-2 rounded hover:bg-red-50 mb-4"
        >
          Delete All Students
        </button>
      )}

      {/* Students List */}
      {students.length === 0 ? (
        <p className="text-gray-500">No students yet. Register one above.</p>
      ) : (
        <ul className="space-y-3">
          {students.map((student) => (
            <li key={student.id} className="border rounded p-4 flex justify-between items-center">
              <div>
                <p className="font-medium">{student.name}</p>
                <p className="text-sm text-gray-500">{student.admissionNo} — {student.stream.name}</p>
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