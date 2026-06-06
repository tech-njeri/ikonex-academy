import { Poppins } from 'next/font/google'
import Providers from '@/app/components/Providers'
import NavbarWrapper from '@/app/components/NavbarWrapper'
import './globals.css'

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-poppins',
  display: 'swap',
})

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={poppins.variable}>
      <body style={{ margin: 0, background: '#0a0a0f' }}>
        <Providers>
          <NavbarWrapper />
          {children}
        </Providers>
      </body>
    </html>
  )
}