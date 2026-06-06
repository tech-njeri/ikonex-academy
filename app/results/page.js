// © 2026 Joy Njeri. Submitted for Ikonex Systems Intern Assessment.
// Evaluation use only. All rights reserved.
 
'use client'
 
import { useCallback, useEffect, useState } from 'react'
import Link from 'next/link'
 
// Grade colour map — explicit entries, neutral grey for anything unrecognised
const GRADE_COLORS = {
  A: 'text-green-600',
  B: 'text-blue-600',
  C: 'text-yellow-600',
  D: 'text-orange-600',
  E: 'text-red-600',
}
 
function getGradeColor(grade) {
  return GRADE_COLORS[grade] ?? 'text-gray-400'
}
 
// Skeleton rows shown while results are loading
function TableSkeleton() {
  return Array.from({ length: 5 }).map((_, i) => (
    <tr key={i} className="animate-pulse">
      {Array.from({ length: 7 }).map((_, j) => (
        <td key={j} className="border px-4 py-3">
          <div className="h-4 bg-gray-200 rounded w-full" />
        </td>
      ))}
    </tr>
  ))
}
 
export default function ResultsPage() {
  const [streams, setStreams] = useState([])
  const [selectedStream, setSelectedStream] = useState('')
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(false)
  const [hasFetched, setHasFetched] = useState(false)  // tracks whether a fetch has been attempted
  const [error, setError] = useState(null)
  const [streamsError, setStreamsError] = useState(null)
 
  useEffect(() => {
    async function loadStreams() {
      try {
        const res = await fetch('/api/streams')
        if (!res.ok) throw new Error('Failed to load streams.')
        const data = await res.json()
        setStreams(data)
      } catch (err) {
        setStreamsError(err.message)
      }
    }
 
    loadStreams()
  }, [])
 
  // useCallback ensures fetchResults is stable and explicitly depends on selectedStream
  const fetchResults = useCallback(async () => {
    if (!selectedStream) return
    setLoading(true)
    setError(null)
    setResults([])
    setHasFetched(false)
 
    try {
      const res = await fetch(`/api/results?streamId=${selectedStream}`)
      if (!res.ok) throw new Error('Failed to load results.')
      const data = await res.json()
      setResults(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
      setHasFetched(true)
    }
  }, [selectedStream])
 
  function handleStreamChange(e) {
    setSelectedStream(e.target.value)
    setResults([])
    setError(null)
    setHasFetched(false)
  }
 
  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Results</h1>
 
      {/* Stream load error */}
      {streamsError && (
        <p role="alert" className="text-red-500 mb-4">{streamsError}</p>
      )}
 
      {/* Stream selector + action button */}
      <fieldset className="mb-8">
        <legend className="sr-only">Select a stream to view results</legend>
        <div className="flex gap-3">
          <select
            value={selectedStream}
            onChange={handleStreamChange}
            aria-label="Select stream"
            className="border rounded px-4 py-2 flex-1"
          >
            <option value="">Select Stream</option>
            {streams.map(s => (
              <option key={s.id} value={s.id}>{s.name}</option>
            ))}
          </select>
          <button
            onClick={fetchResults}
            disabled={loading || !selectedStream}
            aria-label="View results for selected stream"
            className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? 'Loading...' : 'View Results'}
          </button>
        </div>
      </fieldset>
 
      {/* Fetch error */}
      {error && (
        <p role="alert" className="text-red-500 mb-4">{error}</p>
      )}
 
      {/* Results table — shows skeleton while loading, real data once loaded */}
      {(loading || results.length > 0) && (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse border rounded">
            <thead className="bg-gray-100">
              <tr>
                <th scope="col" className="border px-4 py-2 text-left">Position</th>
                <th scope="col" className="border px-4 py-2 text-left">Name</th>
                <th scope="col" className="border px-4 py-2 text-left">Adm No</th>
                <th scope="col" className="border px-4 py-2 text-left">Total</th>
                <th scope="col" className="border px-4 py-2 text-left">Average</th>
                <th scope="col" className="border px-4 py-2 text-left">Grade</th>
                <th scope="col" className="border px-4 py-2 text-left">Report</th>
              </tr>
            </thead>
            <tbody>
              {loading
                ? <TableSkeleton />
                : results.map(result => (
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
                      {/* Next.js Link for client-side navigation + prefetching */}
                      <Link
                        href={`/reports/${result.id}`}
                        className="text-blue-600 hover:underline text-sm"
                      >
                        Report Card
                      </Link>
                    </td>
                  </tr>
                ))
              }
            </tbody>
          </table>
        </div>
      )}
 
      {/* Empty state — uses hasFetched flag instead of selectedStream as a proxy */}
      {!loading && !error && hasFetched && results.length === 0 && (
        <p className="text-gray-500">
          No results found. Make sure students have scores recorded.
        </p>
      )}
    </div>
  )
}