'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const navLinks = [
  { href: '/',               label: 'Dashboard',      icon: 'ti-layout-dashboard' },
  { href: '/streams',        label: 'Streams',         icon: 'ti-layers-intersect' },
  { href: '/students',       label: 'Students',        icon: 'ti-users' },
  { href: '/subjects',       label: 'Subjects',        icon: 'ti-book' },
  { href: '/stream-subjects',label: 'Assign Subjects', icon: 'ti-link' },
  { href: '/scores',         label: 'Scores',          icon: 'ti-pencil' },
  { href: '/results',        label: 'Results',         icon: 'ti-chart-bar' },
  { href: '/reports/class-report',   label: 'Class Report',    icon: 'ti-file-text' },
]

export default function Navbar() {
  const pathname = usePathname()

  return (
    <nav style={{
      display: 'flex',
      alignItems: 'center',
      padding: '0 2rem',
      height: '56px',
      background: '#0f0f1a',
      borderBottom: '1px solid #1e1e30',
      position: 'sticky',
      top: 0,
      zIndex: 100,
      overflowX: 'auto',
    }}>
      {/* Logo */}
      <Link href="/" style={{
        fontSize: '15px',
        fontWeight: 700,
        letterSpacing: '0.08em',
        color: '#fff',
        textTransform: 'uppercase',
        marginRight: '2rem',
        flexShrink: 0,
        textDecoration: 'none',
        fontFamily: "'Syne', sans-serif",
      }}>
        Ikonex<span style={{ color: '#7c5cfc' }}>.</span>
      </Link>

      {/* Links */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 0 }}>
        {navLinks.map(({ href, label, icon }) => {
          const isActive = pathname === href
          return (
            <Link
              key={href}
              href={href}
              style={{
                fontSize: '13px',
                fontWeight: 500,
                color: isActive ? '#fff' : '#7a7a9a',
                padding: '0 0.85rem',
                height: '56px',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                textDecoration: 'none',
                borderBottom: isActive ? '2px solid #7c5cfc' : '2px solid transparent',
                transition: 'color 0.15s, border-color 0.15s',
                letterSpacing: '0.02em',
                flexShrink: 0,
                fontFamily: "'Syne', sans-serif",
              }}
            >
              <i className={`ti ${icon}`} aria-hidden="true" style={{ fontSize: '15px' }} />
              {label}
            </Link>
          )
        })}
      </div>
    </nav>
  )
}