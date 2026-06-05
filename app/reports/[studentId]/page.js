// © 2026 Joy Njeri. Submitted for Ikonex Systems Intern Assessment.
// Evaluation use only. All rights reserved.

'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { PDFDownloadLink, Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer'

const styles = StyleSheet.create({
  page: { padding: 40, fontFamily: 'Helvetica' },
  header: { textAlign: 'center', marginBottom: 20 },
  title: { fontSize: 20, fontWeight: 'bold', marginBottom: 4 },
  subtitle: { fontSize: 12, color: '#555', marginBottom: 20 },
  section: { marginBottom: 16 },
  label: { fontSize: 10, color: '#888' },
  value: { fontSize: 12, marginBottom: 4 },
  table: { marginTop: 10 },
  tableRow: { flexDirection: 'row', borderBottomWidth: 1, borderColor: '#eee', paddingVertical: 6 },
  tableHeader: { flexDirection: 'row', backgroundColor: '#f3f4f6', paddingVertical: 6 },
  col1: { width: '40%', fontSize: 10, paddingHorizontal: 4 },
  col2: { width: '20%', fontSize: 10, paddingHorizontal: 4 },
  col3: { width: '20%', fontSize: 10, paddingHorizontal: 4 },
  col4: { width: '20%', fontSize: 10, paddingHorizontal: 4 },
  summary: { marginTop: 20, padding: 10, backgroundColor: '#f9fafb' },
  summaryText: { fontSize: 12, marginBottom: 4 },
  grade: { fontSize: 20, fontWeight: 'bold', color: '#2563eb', marginTop: 4 },
  footer: { marginTop: 40, fontSize: 9, color: '#aaa', textAlign: 'center' }
})

function ReportCard({ student }) {
  const total = student.scores.reduce((sum, s) => sum + s.examScore + s.catScore, 0)
  const average = student.scores.length > 0 ? (total / student.scores.length).toFixed(2) : 0

  function getGrade(avg) {
    if (avg >= 80) return 'A'
    if (avg >= 60) return 'B'
    if (avg >= 50) return 'C'
    if (avg >= 40) return 'D'
    return 'E'
  }

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Ikonex Academy</Text>
          <Text style={styles.subtitle}>Student Report Card</Text>
        </View>

        {/* Student Info */}
        <View style={styles.section}>
          <Text style={styles.label}>Student Name</Text>
          <Text style={styles.value}>{student.name}</Text>
          <Text style={styles.label}>Admission Number</Text>
          <Text style={styles.value}>{student.admissionNo}</Text>
          <Text style={styles.label}>Class Stream</Text>
          <Text style={styles.value}>{student.stream.name}</Text>
        </View>

        {/* Scores Table */}
        <View style={styles.table}>
          <View style={styles.tableHeader}>
            <Text style={styles.col1}>Subject</Text>
            <Text style={styles.col2}>Exam</Text>
            <Text style={styles.col3}>CAT</Text>
            <Text style={styles.col4}>Total</Text>
          </View>
          {student.scores.map((score, i) => (
            <View key={i} style={styles.tableRow}>
              <Text style={styles.col1}>{score.subject.name}</Text>
              <Text style={styles.col2}>{score.examScore}</Text>
              <Text style={styles.col3}>{score.catScore}</Text>
              <Text style={styles.col4}>{score.examScore + score.catScore}</Text>
            </View>
          ))}
        </View>

        {/* Summary */}
        <View style={styles.summary}>
          <Text style={styles.summaryText}>Total Marks: {total}</Text>
          <Text style={styles.summaryText}>Average: {average}</Text>
          <Text style={styles.summaryText}>Grade:</Text>
          <Text style={styles.grade}>{getGrade(average)}</Text>
        </View>

        {/* Footer */}
        <Text style={styles.footer}>
          © 2026 Joy Njeri — Ikonex Academy Student Management System
        </Text>
      </Page>
    </Document>
  )
}

export default function ReportPage() {
  const { studentId } = useParams()
  const [student, setStudent] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchStudent() {
      const res = await fetch(`/api/students/${studentId}`)
      const data = await res.json()
      console.log('student data:', data)
      setStudent(data)
      setLoading(false)
    }
    fetchStudent()
  }, [studentId])

  if (loading) return <div className="p-8">Loading report...</div>
  if (!student) return <div className="p-8">Student not found.</div>
   if (!student.stream) return <div className="p-8">Student data incomplete.</div>

  return (
    <div className="p-8 max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-2">Report Card</h1>
      <p className="text-gray-500 mb-6">{student.name} — {student.stream.name}</p>

      {/* Score Preview */}
      <div className="border rounded p-6 mb-6 space-y-2">
        {student.scores.map(score => (
          <div key={score.id} className="flex justify-between">
            <span>{score.subject.name}</span>
            <span className="text-gray-500">
              Exam: {score.examScore} | CAT: {score.catScore} | Total: {score.examScore + score.catScore}
            </span>
          </div>
        ))}
      </div>

      {/* Download Button */}
      <PDFDownloadLink
        document={<ReportCard student={student} />}
        fileName={`${student.name}-report-card.pdf`}
        className="bg-blue-600 text-white px-6 py-3 rounded hover:bg-blue-700 inline-block"
      >
        {({ loading }) => loading ? 'Preparing PDF...' : 'Download Report Card PDF'}
      </PDFDownloadLink>
    </div>
  )
}