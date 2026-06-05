// © 2026 Joy Njeri. Submitted for Ikonex Systems Intern Assessment.
// Evaluation use only. All rights reserved.

'use client'

import { useEffect, useState } from 'react'

export default function StreamSubjectsPage() {
  const [streams, setStreams] = useState([])
  const [subjects, setSubjects] = useState([])
  const [assignments, setAssignments] = useState([])
  const [selectedStream, setSelectedStream] = useState('')
  const [selectedSubject, setSelectedSubject] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    fetchStreams()
    fetchSubjects()
  }, [])

  useEffect(() => {
    if (selectedStream) fetchAssignments()
  }, [selectedStream])

  async function fetchStreams() {
    const res = await fetch('/api/streams')
    const data = await res.json()
    setStreams(data)
  }

  async function fetchSubjects() {
    const res = await fetch('/api/subjects')
    const data = await res.json()
    setSubjects(data)
  }

  async function fetchAssignments() {
    const res = await fetch(`/api/stream-subjects?streamId=${selectedStream}`)
    const data = await res.json()
    setAssignments(data)
  }

  async function assignSubject() {
    if (!selectedStream || !selectedSubject) return alert('Select both a stream and a subject')
    setLoading(true)
    await fetch('/api/stream-subjects', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        streamId: parseInt(selectedStream),
        subjectId: parseInt(selectedSubject)
      })
    })
    setSelectedSubject('')
    setLoading(false)
    fetchAssignments()
  }

  async function removeAssignment(id) {
    await fetch('/api/stream-subjects', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id })
    })
    fetchAssignments()
  }

  return (
    <div className="p-8 max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Assign Subjects to Streams</h1>

      {/* Select Stream */}
      <div className="space-y-4 mb-8">
        <select
          value={selectedStream}
          onChange={(e) => setSelectedStream(e.target.value)}
          className="border rounded px-4 py-2 w-full"
        >
          <option value="">Select a Stream</option>
          {streams.map((stream) => (
            <option key={stream.id} value={stream.id}>
              {stream.name}
            </option>
          ))}
        </select>

        {/* Select Subject to Assign */}
        {selectedStream && (
          <div className="flex gap-3">
            <select
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
              className="border rounded px-4 py-2 flex-1"
            >
              <option value="">Select a Subject</option>
              {subjects.map((subject) => (
                <option key={subject.id} value={subject.id}>
                  {subject.name}
                </option>
              ))}
            </select>
            <button
              onClick={assignSubject}
              disabled={loading}
              className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
            >
              {loading ? 'Assigning...' : 'Assign'}
            </button>
          </div>
        )}
      </div>

      {/* Assigned Subjects List */}
      {selectedStream && (
        <div>
          <h2 className="text-xl font-semibold mb-4">Assigned Subjects</h2>
          {assignments.length === 0 ? (
            <p className="text-gray-500">No subjects assigned yet.</p>
          ) : (
            <ul className="space-y-3">
              {assignments.map((assignment) => (
                <li key={assignment.id} className="border rounded p-4 flex justify-between items-center">
                  <span className="font-medium">{assignment.subject.name}</span>
                  <button
                    onClick={() => removeAssignment(assignment.id)}
                    className="text-red-500 hover:text-red-700 text-sm"
                  >
                    Remove
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  )
}