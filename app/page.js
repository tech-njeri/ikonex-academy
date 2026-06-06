'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

const quickActions = [
  { href: '/students',        label: 'Register student',  desc: 'Add to a stream',       icon: 'ti-user-plus',        color: '#7c5cfc', bg: '#7c5cfc18' },
  { href: '/scores',          label: 'Record scores',     desc: 'Exam + CAT entry',       icon: 'ti-pencil',           color: '#4caf82', bg: '#4caf8218' },
  { href: '/results',         label: 'View results',      desc: 'Rankings + grades',      icon: 'ti-chart-bar',        color: '#f59e0b', bg: '#f59e0b18' },
  { href: '/class-report',    label: 'Class report PDF',  desc: 'Download for stream',    icon: 'ti-file-text',        color: '#e2534a', bg: '#e2534a18' },
  { href: '/streams',         label: 'Manage streams',    desc: 'Create or edit',         icon: 'ti-layers-intersect', color: '#7c5cfc', bg: '#7c5cfc18' },
  { href: '/stream-subjects', label: 'Assign subjects',   desc: 'Link to streams',        icon: 'ti-link',             color: '#4caf82', bg: '#4caf8218' },
]

function greeting() {
  const h = new Date().getHours()
  if (h < 12) return 'Good morning'
  if (h < 17) return 'Good afternoon'
  return 'Good evening'
}

export default function DashboardPage() {
  const [streams, setStreams]   = useState([])
  const [students, setStudents] = useState([])
  const [subjects, setSubjects] = useState([])
  const [scores, setScores]     = useState([])
  const [loading, setLoading]   = useState(true)
  const [error, setError]       = useState(null)

  useEffect(() => {
    async function fetchAll() {
      try {
        const [streamsRes, studentsRes, subjectsRes] = await Promise.all([
          fetch('/api/streams'),
          fetch('/api/students'),
          fetch('/api/subjects'),
        ])

        if (!streamsRes.ok || !studentsRes.ok || !subjectsRes.ok) {
          throw new Error('Failed to load dashboard data.')
        }

        const [streamsData, studentsData, subjectsData] = await Promise.all([
          streamsRes.json(),
          studentsRes.json(),
          subjectsRes.json(),
        ])

        setStreams(streamsData)
        setStudents(studentsData)
        setSubjects(subjectsData)

        // Count total scores across all students
        const totalScores = studentsData.reduce(
          (sum, s) => sum + (s.scores?.length ?? 0), 0
        )
        setScores(totalScores)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchAll()
  }, [])

  // Expected scores = students × subjects (rough completion estimate)
  const expectedScores = students.length * subjects.length
  const completionPct  = expectedScores > 0
    ? Math.round((scores / expectedScores) * 100)
    : 0

  const stats = [
    { label: 'Streams',         value: loading ? '—' : streams.length,  sub: 'Active classes',        color: '#7c5cfc', icon: 'ti-layers-intersect' },
    { label: 'Students',        value: loading ? '—' : students.length, sub: 'Across all streams',    color: '#4caf82', icon: 'ti-users' },
    { label: 'Subjects',        value: loading ? '—' : subjects.length, sub: 'Active this term',      color: '#f59e0b', icon: 'ti-book' },
    { label: 'Scores recorded', value: loading ? '—' : scores.toLocaleString(), sub: `${completionPct}% complete`, color: '#e2534a', icon: 'ti-clipboard-check' },
  ]

  return (
    <div style={{ background: '#0a0a0f', minHeight: '100vh', fontFamily: "'Syne', sans-serif", color: '#e8e6f0', padding: '2.5rem 2rem' }}>
      <div style={{ maxWidth: '1100px', margin: '0 auto' }}>

        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: '2rem' }}>
          <div>
            <h1 style={{ fontSize: '26px', fontWeight: 700, color: '#fff', margin: '0 0 4px', letterSpacing: '-0.01em' }}>
              {greeting()}, Admin
            </h1>
            <p style={{ fontSize: '13px', color: '#5a5a7a', margin: 0, fontFamily: "'DM Mono', monospace" }}>
              {new Date().toLocaleDateString('en-KE', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: '#4caf82', background: '#4caf8218', border: '1px solid #4caf8230', borderRadius: '100px', padding: '5px 12px', fontFamily: "'DM Mono', monospace" }}>
            <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#4caf82', display: 'inline-block' }} />
            System online
          </div>
        </div>

        {/* Error */}
        {error && (
          <p style={{ color: '#e2534a', marginBottom: '1.5rem', fontSize: '14px' }}>{error}</p>
        )}

        {/* Stat Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem', marginBottom: '2rem' }}>
          {stats.map(({ label, value, sub, color, icon }) => (
            <div key={label} style={{ background: '#0f0f1a', border: '1px solid #1e1e30', borderRadius: '12px', padding: '1.25rem 1.5rem', position: 'relative', overflow: 'hidden' }}>
              <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '2px', background: color }} />
              <div style={{ fontSize: '18px', color, marginBottom: '1rem' }}>
                <i className={`ti ${icon}`} aria-hidden="true" />
              </div>
              <div style={{ fontSize: '11px', color: '#5a5a7a', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '6px', fontFamily: "'DM Mono', monospace" }}>
                {label}
              </div>
              <div style={{ fontSize: '32px', fontWeight: 700, color: '#fff', lineHeight: 1, marginBottom: '6px', letterSpacing: '-0.02em' }}>
                {value}
              </div>
              <div style={{ fontSize: '12px', color: '#5a5a7a', fontFamily: "'DM Mono', monospace" }}>{sub}</div>
            </div>
          ))}
        </div>

        {/* Streams + Quick Actions */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>

          {/* Streams list */}
          <div style={{ background: '#0f0f1a', border: '1px solid #1e1e30', borderRadius: '12px', padding: '1.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
              <div style={{ fontSize: '13px', fontWeight: 700, color: '#fff', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                Streams overview
              </div>
              <Link href="/streams" style={{ fontSize: '12px', color: '#7c5cfc', fontFamily: "'DM Mono', monospace", textDecoration: 'none' }}>
                View all →
              </Link>
            </div>

            {loading ? (
              <p style={{ color: '#5a5a7a', fontSize: '13px', fontFamily: "'DM Mono', monospace" }}>Loading...</p>
            ) : streams.length === 0 ? (
              <p style={{ color: '#5a5a7a', fontSize: '13px', fontFamily: "'DM Mono', monospace" }}>No streams yet.</p>
            ) : (
              streams.slice(0, 6).map((stream, i) => {
                const studentCount = students.filter(s => s.streamId === stream.id).length
                const isLast = i === Math.min(streams.length, 6) - 1
                return (
                  <div key={stream.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 0', borderBottom: isLast ? 'none' : '1px solid #1e1e30' }}>
                    <div>
                      <div style={{ fontSize: '14px', color: '#c8c6d8', fontWeight: 500 }}>{stream.name}</div>
                      <div style={{ fontSize: '12px', color: '#5a5a7a', fontFamily: "'DM Mono', monospace" }}>
                        {studentCount} student{studentCount !== 1 ? 's' : ''} · {subjects.length} subjects
                      </div>
                    </div>
                    <span style={{ fontSize: '11px', fontFamily: "'DM Mono', monospace", padding: '3px 8px', borderRadius: '4px', background: '#7c5cfc22', color: '#9d7eff', border: '1px solid #7c5cfc33' }}>
                      Active
                    </span>
                  </div>
                )
              })
            )}
          </div>

          {/* Quick actions */}
          <div style={{ background: '#0f0f1a', border: '1px solid #1e1e30', borderRadius: '12px', padding: '1.5rem' }}>
            <div style={{ fontSize: '13px', fontWeight: 700, color: '#fff', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '1.25rem' }}>
              Quick actions
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
              {quickActions.map(({ href, label, desc, icon, color, bg }) => (
                <Link key={href} href={href} style={{ background: '#0a0a0f', border: '1px solid #1e1e30', borderRadius: '10px', padding: '0.875rem', display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '8px', textDecoration: 'none', transition: 'border-color 0.2s' }}
                  onMouseEnter={e => e.currentTarget.style.borderColor = `${color}44`}
                  onMouseLeave={e => e.currentTarget.style.borderColor = '#1e1e30'}
                >
                  <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: bg, color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '15px' }}>
                    <i className={`ti ${icon}`} aria-hidden="true" />
                  </div>
                  <div>
                    <div style={{ fontSize: '13px', fontWeight: 500, color: '#c8c6d8' }}>{label}</div>
                    <div style={{ fontSize: '11px', color: '#5a5a7a', fontFamily: "'DM Mono', monospace" }}>{desc}</div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}