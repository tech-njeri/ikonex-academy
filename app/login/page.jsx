'use client'

import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)

  async function handleLogin() {
    setError(null)
    setLoading(true)
    const res = await signIn('credentials', {
      email,
      password,
      redirect: false,
    })
    setLoading(false)
    if (res?.error) {
      setError('Invalid email or password.')
    } else {
      router.push('/')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="border rounded p-8 w-full max-w-sm space-y-4 bg-white shadow">
        <h1 className="text-2xl font-bold">Ikonex Academy</h1>
        <p className="text-gray-500 text-sm">Sign in to continue</p>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="border rounded px-4 py-2 w-full"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="border rounded px-4 py-2 w-full"
        />
        {error && <p className="text-red-500 text-sm">{error}</p>}
        <button
          onClick={handleLogin}
          disabled={loading}
          className="bg-blue-600 text-white px-6 py-2 rounded w-full hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? 'Signing in...' : 'Sign In'}
        </button>
      </div>
    </div>
  )
}