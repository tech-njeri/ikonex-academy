'use client'
import { usePathname } from 'next/navigation'
import { Syne, DM_Mono } from 'next/font/google'
import Navbar from '@/app/components/Navbar'
import Providers from '@/app/components/Providers'
import './globals.css'

const syne = Syne({
  subsets: ['latin'],
  weight: ['400', '500', '700'],
  variable: '--font-syne',
  display: 'swap',
})
const dmMono = DM_Mono({
  subsets: ['latin'],
  weight: ['400', '500'],
  variable: '--font-dm-mono',
  display: 'swap',
})

export default function RootLayout({ children }) {
  const pathname = usePathname()
  const showNavbar = pathname !== '/login'

  return (
    <html lang="en" className={`${syne.variable} ${dmMono.variable}`}>
      <body style={{ margin: 0, background: '#0a0a0f' }}>
        <Providers>
          {showNavbar && <Navbar />}
          {children}
        </Providers>
      </body>
    </html>
  )
}