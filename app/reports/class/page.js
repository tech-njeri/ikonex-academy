// © 2026 Joy Njeri. Submitted for Ikonex Systems Intern Assessment.
// Evaluation use only. All rights reserved.

'use client'

import { useEffect, useState } from 'react'
import { PDFDownloadLink, Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer'

const styles = StyleSheet.create({
  page: { padding: 40, fontFamily: 'Helvetica' },
  header: { textAlign: 'center', marginBottom: 20 },
  title: { fontSize: 20, fontWeight: 'bold', marginBottom: 4 },
  subtitle: { fontSize: 12, color: '#555', marginBottom: 4 },
  table: { marginTop: 10 },
  tableHeader: { flexDirection: 'row', backgroundColor: '#f3f4f6', paddingVertical: 6 },
  tableRow: { flexDirection: 'row', borderBottomWidth: 1, borderColor: '#eee', paddingVertical: 6 },
  col1: { width: '5%', fontSize: 9, paddingHorizontal: 2 },
  col2: { width: '30%', fontSize: 9, paddingHorizontal: 2 },
  col3: { width: '15%', fontSize: 9, paddingHorizontal: 2 },
  col4: { width: '15%', fontSize: 9, paddingHorizontal: 2 },
  col5: { width: '15%', fontSize: 9, paddingHorizontal: 2 },
  col6: { width: '10%', fontSize: 9, paddingHorizontal: 2 },
  col7: { width: '10%', fontSize: 9, paddingHorizontal: 2 },
  footer: { marginTop: 40, fontSize: 9, color: '#aaa', textAlign: 'center' }
})

function getGrade(avg) {
  if (avg >= 80) return 'A'
  if (avg >= 60) return 'B'
  if (avg >= 50) return 'C'
  if (avg >= 40) return 'D'
  return 'E'
}

function ClassReport({ results, streamName }) {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.title}>Ikonex Academy</Text>
          <Text style={styles.subtitle}>Class Performance Report — {streamName}</Text>
        </View>

        <View style={styles.table}>
          {/* PDF table header */}
          <View style={styles.tableHeader}>
            <Text style={styles.col1}>#</Text>
            <Text style={styles.col2}>Name</Text>
            <Text style={styles.col3}>Adm No</Text>
            <Text style={styles.col4}>Total</Text>
            <Text style={styles.col5}>Average</Text>
            <Text style={styles.col6}>Grade</Text>
            <Text style={styles.col7}>Position</Text>
          </View>

          {results.length > 0 ? (
            results.map((result, i) => (
              <View key={result.id ?? i} style={styles.tableRow}>
                <Text style={styles.col1}>{i + 1}</Text>
                <Text style={styles.col2}>{result.name}</Text>
                <Text style={styles.col3}>{result.admissionNo}</Text>
                <Text style={styles.col4}>{result.total}</Text>
                <Text style={styles.col5}>{result.average}</Text>
                <Text style={styles.col6}>{result.grade}</Text>
                <Text style={styles.col7}>{result.position}</Text>
              </View>
            ))
          ) : (
            <View style={styles.tableRow}>
              <Text style={styles.col2}>No results found.</Text>
            </View>
          )}
        </View>

        <Text style={styles.footer}>
          © 2026 Joy Njeri — Ikonex Academy Student Management System
        </Text>
      </Page>
    </Document>
  )
}

export default function ClassReportPage() {
  const [streams, setStreams] = useState([])
  const [selectedStream, setSelectedStream] = useState('')
  const [streamName, setStreamName] = useState('')
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(false)
  const [ready, setReady] = useState(false)
  const [fetchError, setFetchError] = useState(null)
  const [resultsError, setResultsError] = useState(null)

  useEffect(() => {
    async function loadStreams() {
      try {
        const res = await fetch('/api/streams')
        if (!res.ok) throw new Error('Failed to load streams.')
        setStreams(await res.json())
      } catch (err) {
        setFetchError(err.message)
      }
    }

    loadStreams()
  }, [])

  async function fetchResults() {
    if (!selectedStream) return
    setLoading(true)
    setReady(false)
    setResultsError(null)
    setResults([])

    try {
      const res = await fetch(`/api/results?streamId=${selectedStream}`)
      if (!res.ok) throw new Error('Failed to load results.')
      const data = await res.json()
      setResults(data)

      const stream = streams.find(s => s.id === parseInt(selectedStream))
      setStreamName(stream?.name ?? '')
      setReady(true)
    } catch (err) {
      setResultsError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-8 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Class Performance Report</h1>

      {/* Streams load error */}
      {fetchError && (
        <p className="text-red-500 mb-4">{fetchError}</p>
      )}

      <div className="flex gap-3 mb-8">
        <select
          value={selectedStream}
          onChange={(e) => {
            setSelectedStream(e.target.value)
            setReady(false)
            setResults([])
            setResultsError(null)
          }}
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
          className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? 'Loading...' : 'Load Results'}
        </button>
      </div>

      {/* Results fetch error */}
      {resultsError && (
        <p className="text-red-500 mb-4">{resultsError}</p>
      )}

      {ready && results.length > 0 && (
        <div>
          {/* Preview Table — columns match PDF exactly */}
          <div className="overflow-x-auto mb-6">
            <table className="w-full border-collapse border rounded">
              <thead className="bg-gray-100">
                <tr>
                  <th className="border px-4 py-2 text-left">#</th>
                  <th className="border px-4 py-2 text-left">Name</th>
                  <th className="border px-4 py-2 text-left">Adm No</th>
                  <th className="border px-4 py-2 text-left">Total</th>
                  <th className="border px-4 py-2 text-left">Average</th>
                  <th className="border px-4 py-2 text-left">Grade</th>
                  <th className="border px-4 py-2 text-left">Position</th>
                </tr>
              </thead>
              <tbody>
                {results.map((result, i) => (
                  <tr key={result.id} className="hover:bg-gray-50">
                    <td className="border px-4 py-2">{i + 1}</td>
                    <td className="border px-4 py-2 font-medium">{result.name}</td>
                    <td className="border px-4 py-2">{result.admissionNo}</td>
                    <td className="border px-4 py-2">{result.total}</td>
                    <td className="border px-4 py-2">{result.average}</td>
                    <td className="border px-4 py-2 font-bold">{result.grade}</td>
                    <td className="border px-4 py-2">{result.position}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Download Button */}
          <PDFDownloadLink
            document={<ClassReport results={results} streamName={streamName} />}
            fileName={`${streamName}-class-report.pdf`}
            className="bg-green-600 text-white px-6 py-3 rounded hover:bg-green-700 inline-block"
          >
            {({ loading }) => loading ? 'Preparing PDF...' : 'Download Class Report PDF'}
          </PDFDownloadLink>
        </div>
      )}

      {ready && results.length === 0 && (
        <p className="text-gray-500">No results found for this stream.</p>
      )}
    </div>
  )
}