// © 2026 Joy Njeri. Submitted for Ikonex Systems Intern Assessment.
// Evaluation use only. All rights reserved.

'use client'

import { useEffect, useState } from 'react'

const MAX_EXAM_SCORE = 70
const MAX_CAT_SCORE = 30

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
  const [fetchError, setFetchError] = useState(null)
  const [formError, setFormError] = useState(null)
  const [submitError, setSubmitError] = useState(null)
  const [submitSuccess, setSubmitSuccess] = useState(null)

  useEffect(() => {
    fetchStreams()
  }, [])

  useEffect(() => {
    if (selectedStream) {
      fetchStudentsInStream()
    }
  }, [selectedStream])

  useEffect(() => {
    if (selectedStudent) {
      fetchScores()
      fetchSubjectsForStream()
    }
  }, [selectedStudent])

  async function fetchStreams() {
    try {
      const res = await fetch('/api/streams')
      if (!res.ok) throw new Error('Failed to load streams.')
      setStreams(await res.json())
    } catch (err) {
      setFetchError(err.message)
    }
  }

  async function fetchStudentsInStream() {
    try {
      // Filter server-side by streamId instead of fetching all students
      const res = await fetch(`/api/students?streamId=${selectedStream}`)
      if (!res.ok) throw new Error('Failed to load students.')
      const data = await res.json()
      setStudents(data)
    } catch (err) {
      setFetchError(err.message)
    }
  }

  async function fetchSubjectsForStream() {
    try {
      const res = await fetch(`/api/stream-subjects?streamId=${selectedStream}`)
      if (!res.ok) throw new Error('Failed to load subjects.')
      const data = await res.json()
      setSubjects(data.map(a => a.subject))
    } catch (err) {
      setFetchError(err.message)
    }
  }

  async function fetchScores() {
    try {
      const res = await fetch(`/api/scores?studentId=${selectedStudent}`)
      if (!res.ok) throw new Error('Failed to load scores.')
      setScores(await res.json())
    } catch (err) {
      setFetchError(err.message)
    }
  }

  function validateScores() {
    if (!selectedStudent || !selectedSubject) {
      setFormError('Please select a student and subject.')
      return false
    }
    if (examScore === '' || catScore === '') {
      setFormError('Both exam score and CAT score are required.')
      return false
    }
    const exam = parseFloat(examScore)
    const cat = parseFloat(catScore)
    if (isNaN(exam) || isNaN(cat)) {
      setFormError('Scores must be valid numbers.')
      return false
    }
    if (exam < 0 || exam > MAX_EXAM_SCORE) {
      setFormError(`Exam score must be between 0 and ${MAX_EXAM_SCORE}.`)
      return false
    }
    if (cat < 0 || cat > MAX_CAT_SCORE) {
      setFormError(`CAT score must be between 0 and ${MAX_CAT_SCORE}.`)
      return false
    }
    return true
  }

  async function submitScore() {
    setFormError(null)
    setSubmitError(null)
    setSubmitSuccess(null)

    if (!validateScores()) return

    const exam = parseFloat(examScore)
    const cat = parseFloat(catScore)
    const existing = scores.find(s => s.subjectId === parseInt(selectedSubject))

    setLoading(true)
    try {
      const res = await fetch('/api/scores', {
        method: existing ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(
          existing
            ? { id: existing.id, examScore: exam, catScore: cat }
            : {
                studentId: parseInt(selectedStudent),
                subjectId: parseInt(selectedSubject),
                examScore: exam,
                catScore: cat
              }
        )
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error ?? 'Failed to save score.')
      }

      setExamScore('')
      setCatScore('')
      setSelectedSubject('')
      setSubmitSuccess(existing ? 'Score updated successfully.' : 'Score recorded successfully.')
      await fetchScores()
    } catch (err) {
      setSubmitError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-8 max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Record Scores</h1>

      {/* Fetch error */}
      {fetchError && (
        <p className="text-red-500 mb-4">{fetchError}</p>
      )}

      <div className="space-y-4 mb-6">
        {/* Select Stream */}
        <select
          value={selectedStream}
          onChange={(e) => {
            setSelectedStream(e.target.value)
            setSelectedStudent('')
            setFormError(null)
            setSubmitError(null)
            setSubmitSuccess(null)
          }}
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
            onChange={(e) => {
              setSelectedStudent(e.target.value)
              setFormError(null)
              setSubmitError(null)
              setSubmitSuccess(null)
            }}
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
              onChange={(e) => {
                setSelectedSubject(e.target.value)
                setFormError(null)
              }}
              className="border rounded px-4 py-2 w-full"
            >
              <option value="">Select Subject</option>
              {subjects.map(s => (
                <option key={s.id} value={s.id}>{s.name}</option>
              ))}
            </select>
            <div>
              <input
                type="number"
                placeholder={`Exam Score (out of ${MAX_EXAM_SCORE})`}
                value={examScore}
                min={0}
                max={MAX_EXAM_SCORE}
                onChange={(e) => {
                  setExamScore(e.target.value)
                  setFormError(null)
                }}
                className="border rounded px-4 py-2 w-full"
              />
            </div>
            <div>
              <input
                type="number"
                placeholder={`CAT Score (out of ${MAX_CAT_SCORE})`}
                value={catScore}
                min={0}
                max={MAX_CAT_SCORE}
                onChange={(e) => {
                  setCatScore(e.target.value)
                  setFormError(null)
                }}
                className="border rounded px-4 py-2 w-full"
              />
            </div>

            {/* Inline form error */}
            {formError && (
              <p className="text-red-500 text-sm">{formError}</p>
            )}

            {/* Submit error */}
            {submitError && (
              <p className="text-red-500 text-sm">{submitError}</p>
            )}

            {/* Success message */}
            {submitSuccess && (
              <p className="text-green-600 text-sm">{submitSuccess}</p>
            )}

            <button
              onClick={submitScore}
              disabled={loading}
              className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 disabled:opacity-50 w-full"
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
                <p className="font-medium">{score.subject?.name ?? 'Unknown'}</p>
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