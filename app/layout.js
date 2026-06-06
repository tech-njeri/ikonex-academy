'use client'
import { usePathname } from 'next/navigation'
import { Poppins } from 'next/font/google'
import Navbar from '@/app/components/Navbar'
import Providers from '@/app/components/Providers'
import './globals.css'

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-poppins',
  display: 'swap',
})

export default function RootLayout({ children }) {
  const pathname = usePathname()
  const showNavbar = pathname !== '/login'

  return (
    <html lang="en" className={`${poppins.variable}`}>
      <body style={{ margin: 0, background: '#0a0a0f' }}>
        <Providers>
          {showNavbar && <Navbar />}
          {children}
        </Providers>
      </body>
    </html>
  )
}