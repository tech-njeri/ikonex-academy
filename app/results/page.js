// © 2026 Joy Njeri. Submitted for Ikonex Systems Intern Assessment.
// Evaluation use only. All rights reserved.

'use client'

import { useEffect, useState } from 'react'

export default function ResultsPage() {
  const [streams, setStreams] = useState([])
  const [selectedStream, setSelectedStream] = useState('')
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(() => { fetchStreams()}, [])

  async function fetchStreams() {
    const res = await fetch('/api/streams')
    setStreams(await res.json())
  }

  async function fetchResults() {
    if (!selectedStream) return
    setLoading(true)
    const res = await fetch(`/api/results?streamId=${selectedStream}`)
    setResults(await res.json())
    setLoading(false)
  }

  function getGradeColor(grade) {
    if (grade === 'A') return 'text-green-600'
    if (grade === 'B') return 'text-blue-600'
    if (grade === 'C') return 'text-yellow-600'
    if (grade === 'D') return 'text-orange-600'
    return 'text-red-600'
  }

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Results</h1>

      {/* Select Stream */}
      <div className="flex gap-3 mb-8">
        <select
          value={selectedStream}
          onChange={(e) => setSelectedStream(e.target.value)}
          className="border rounded px-4 py-2 flex-1"
        >
          <option value="">Select Stream</option>
          {streams.map(s => (
            <option key={s.id} value={s.id}>{s.name}</option>
          ))}
        </select>
        <button
          onClick={fetchResults}
          disabled={loading}
          className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
        >
          {loading ? 'Loading...' : 'View Results'}
        </button>
      </div>

      {/* Results Table */}
      {results.length > 0 && (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse border rounded">
            <thead className="bg-gray-100">
              <tr>
                <th className="border px-4 py-2 text-left">Report</th>
                <th className="border px-4 py-2 text-left">Position</th>
                <th className="border px-4 py-2 text-left">Name</th>
                <th className="border px-4 py-2 text-left">Adm No</th>
                <th className="border px-4 py-2 text-left">Total</th>
                <th className="border px-4 py-2 text-left">Average</th>
                <th className="border px-4 py-2 text-left">Grade</th>
              </tr>
            </thead>
            <tbody>
             {results.map(result => (
                <tr key={result.id} className="hover:bg-gray-50">
                    <td className="border px-4 py-2">{result.position}</td>
                    <td className="border px-4 py-2 font-medium">{result.name}</td>
                    <td className="border px-4 py-2">{result.admissionNo}</td>
                    <td className="border px-4 py-2">{result.total}</td>
                    <td className="border px-4 py-2">{result.average}</td>
                    <td className={`border px-4 py-2 font-bold ${getGradeColor(result.grade)}`}>
                    {result.grade}
                    </td>
                    <td className="border px-4 py-2">
                   
                        <a href={`/reports/${result.id}`}
                            className="text-blue-600 hover:underline text-sm"
                        >
                            Report Card
                        </a>
                    </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {results.length === 0 && selectedStream && !loading && (
        <p className="text-gray-500">No results found. Make sure students have scores recorded.</p>
      )}
    </div>
  )
}