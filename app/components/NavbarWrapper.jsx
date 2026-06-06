'use client'

import { usePathname } from 'next/navigation'
import Navbar from '@/app/components/Navbar'

export default function NavbarWrapper() {
  const pathname = usePathname()
  if (pathname === '/login') return null
  return <Navbar />
}