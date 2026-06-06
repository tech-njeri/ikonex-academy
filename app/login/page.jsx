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

  function handleKeyDown(e) {
  if (e.key === 'Enter') handleLogin()
  }



  return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: '#0a0a0f' }}>
      <div className="border border-gray-700 rounded p-10 w-full max-w-sm space-y-4 shadow" style={{ background: '#1a1a2e' }}>
        <h1 className="text-2xl font-bold text-white">Ikonex Academy</h1>
        <p className="text-gray-400 text-sm">Sign in to continue</p>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          onKeyDown={handleKeyDown}
          className="border border-gray-600 rounded px-4 py-2 w-full bg-gray-900 text-white placeholder-gray-500"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          onKeyDown={handleKeyDown}
          className="border border-gray-600 rounded px-4 py-2 w-full bg-gray-900 text-white placeholder-gray-500"
        />
        {error && <p className="text-red-500 text-sm">{error}</p>}
        <button
          onClick={handleLogin}
          disabled={loading}
          className="bg-blue-600 text-white px-6 py-2 rounded w-full hover:bg-blue-700 disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z">
              </path>
              </svg>
              Signing in...
            </>
          ) : 'Sign In'}
        </button>
      </div>
    </div>
  )
}