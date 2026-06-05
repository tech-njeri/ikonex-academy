// © 2026 Joy Njeri. Submitted for Ikonex Systems Intern Assessment.
// Evaluation use only. All rights reserved.

'use client'

import { useEffect, useState } from 'react'

export default function ScoresPage() {
  const [streams, setStreams] = useState([])
  const [students, setStudents] = useState([])
  const [subjects, setSubjects] = useState([])
  const [scores, setScores] = useState([])
  const [selectedStream, setSelectedStream] = useState('')
  const [selectedStudent, setSelectedStudent] = useState('')
  const [selectedSubject, setSelectedSubject] = useState('')
  const [examScore, setExamScore] = useState('')
  const [catScore, setCatScore] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => { fetchStreams() }, [])

  useEffect(() => {
    if (selectedStream) fetchStudentsInStream()
  }, [selectedStream])

  useEffect(() => {
    if (selectedStudent) {
      fetchScores()
      fetchSubjectsForStream()
    }
  }, [selectedStudent])

  async function fetchStreams() {
    const res = await fetch('/api/streams')
    setStreams(await res.json())
  }

  async function fetchStudentsInStream() {
    const res = await fetch('/api/students')
    const data = await res.json()
    setStudents(data.filter(s => s.streamId === parseInt(selectedStream)))
  }

  async function fetchSubjectsForStream() {
    const res = await fetch(`/api/stream-subjects?streamId=${selectedStream}`)
    const data = await res.json()
    setSubjects(data.map(a => a.subject))
  }

  async function fetchScores() {
    const res = await fetch(`/api/scores?studentId=${selectedStudent}`)
    setScores(await res.json())
  }

  async function submitScore() {
    if (!selectedStudent || !selectedSubject || examScore === '' || catScore === '') {
      return alert('Please fill all fields')
    }

    const total = parseFloat(examScore) + parseFloat(catScore)
    if (total > 100) return alert('Total score cannot exceed 100')

    // Check if score already exists
    const existing = scores.find(s => s.subjectId === parseInt(selectedSubject))

    setLoading(true)
    if (existing) {
      // Update existing score
      await fetch('/api/scores', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: existing.id,
          examScore: parseFloat(examScore),
          catScore: parseFloat(catScore)
        })
      })
    } else {
      // Create new score
      await fetch('/api/scores', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          studentId: parseInt(selectedStudent),
          subjectId: parseInt(selectedSubject),
          examScore: parseFloat(examScore),
          catScore: parseFloat(catScore)
        })
      })
    }

    setExamScore('')
    setCatScore('')
    setSelectedSubject('')
    setLoading(false)
    fetchScores()
  }

  return (
    <div className="p-8 max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Record Scores</h1>

      {/* Select Stream */}
      <div className="space-y-4 mb-6">
        <select
          value={selectedStream}
          onChange={(e) => { setSelectedStream(e.target.value); setSelectedStudent('') }}
          className="border rounded px-4 py-2 w-full"
        >
          <option value="">Select Stream</option>
          {streams.map(s => (
            <option key={s.id} value={s.id}>{s.name}</option>
          ))}
        </select>

        {/* Select Student */}
        {selectedStream && (
          <select
            value={selectedStudent}
            onChange={(e) => setSelectedStudent(e.target.value)}
            className="border rounded px-4 py-2 w-full"
          >
            <option value="">Select Student</option>
            {students.map(s => (
              <option key={s.id} value={s.id}>{s.name} — {s.admissionNo}</option>
            ))}
          </select>
        )}

        {/* Enter Score */}
        {selectedStudent && (
          <div className="border rounded p-4 space-y-3">
            <h2 className="font-semibold text-lg">Enter Score</h2>
            <select
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
              className="border rounded px-4 py-2 w-full"
            >
              <option value="">Select Subject</option>
              {subjects.map(s => (
                <option key={s.id} value={s.id}>{s.name}</option>
              ))}
            </select>
            <input
              type="number"
              placeholder="Exam Score (out of 70)"
              value={examScore}
              onChange={(e) => setExamScore(e.target.value)}
              className="border rounded px-4 py-2 w-full"
            />
            <input
              type="number"
              placeholder="CAT Score (out of 30)"
              value={catScore}
              onChange={(e) => setCatScore(e.target.value)}
              className="border rounded px-4 py-2 w-full"
            />
            <button
              onClick={submitScore}
              disabled={loading}
              className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 w-full"
            >
              {loading ? 'Saving...' : 'Save Score'}
            </button>
          </div>
        )}
      </div>

      {/* Scores List */}
      {scores.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold mb-4">Recorded Scores</h2>
          <ul className="space-y-3">
            {scores.map(score => (
              <li key={score.id} className="border rounded p-4">
                <p className="font-medium">{score.subject.name}</p>
                <p className="text-sm text-gray-500">
                  Exam: {score.examScore} | CAT: {score.catScore} | Total: {score.examScore + score.catScore}
                </p>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}