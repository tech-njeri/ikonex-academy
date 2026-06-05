import { Geist } from 'next/font/google'
import './globals.css'
import Link from 'next/link'

const geist = Geist({ subsets: ['latin'] })

export const metadata = {
  title: 'Ikonex Academy',
  description: 'Student Management System',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={geist.className}>
        <nav className="bg-blue-700 text-white px-8 py-4 flex gap-6 flex-wrap">
          <span className="font-bold text-lg mr-4">Ikonex Academy</span>
          <Link href="/streams" className="hover:underline">Streams</Link>
          <Link href="/students" className="hover:underline">Students</Link>
          <Link href="/subjects" className="hover:underline">Subjects</Link>
          <Link href="/stream-subjects" className="hover:underline">Assign Subjects</Link>
          <Link href="/scores" className="hover:underline">Scores</Link>
          <Link href="/results" className="hover:underline">Results</Link>
        </nav>
        <main>
          {children}
        </main>
      </body>
    </html>
  )
}