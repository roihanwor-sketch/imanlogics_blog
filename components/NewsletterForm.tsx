'use client'

import { useState } from 'react'
import { db } from '../lib/firebase'
import { doc, setDoc, serverTimestamp } from 'firebase/firestore'

export default function NewsletterForm() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    const trimmedEmail = email.trim().toLowerCase()

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!trimmedEmail || !emailRegex.test(trimmedEmail)) {
      setError('Masukkan alamat email yang valid.')
      return
    }

    setLoading(true)

    try {
      // Use email as document ID to enforce uniqueness client-side
      const docRef = doc(db, 'subscribers', trimmedEmail)

      await setDoc(docRef, {
        email: trimmedEmail,
        subscribedAt: serverTimestamp(),
      })

      setSuccess('Terima kasih! Anda berhasil berlangganan newsletter kami.')
      setEmail('')
    } catch (err) {
      console.error('Newsletter error:', err)

      // If document already exists, 'update' operation is denied by security rules
      const firebaseError = err as { code?: string }
      if (firebaseError.code === 'permission-denied') {
        setError('Email Anda sudah terdaftar sebagai subscriber!')
      } else {
        setError('Gagal berlangganan. Silakan coba lagi nanti.')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="w-full max-w-md rounded-2xl border border-gray-200/50 bg-white/40 p-6 shadow-xl backdrop-blur-md dark:border-white/10 dark:bg-[#0B0F19]/40">
      <h3 className="mb-2 text-lg font-bold text-gray-900 dark:text-white">
        Berlangganan Newsletter
      </h3>
      <p className="mb-4 text-xs text-gray-500 dark:text-slate-400">
        Dapatkan artikel dan pembaruan terbaru langsung di kotak masuk email Anda.
      </p>

      <form onSubmit={handleSubmit} className="space-y-3">
        <div className="flex flex-col gap-2 sm:flex-row">
          <input
            type="email"
            placeholder="Alamat email Anda"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={loading}
            required
            className="w-full rounded-xl border border-gray-200 bg-white/60 px-4 py-3 text-sm text-gray-900 shadow-inner transition-all outline-none focus:border-emerald-500 focus:bg-white dark:border-white/10 dark:bg-black/20 dark:text-white dark:focus:border-cyan-500 dark:focus:bg-gray-950"
          />
          <button
            type="submit"
            disabled={loading}
            className="flex items-center justify-center rounded-xl bg-emerald-600 px-5 py-3 text-sm font-bold text-white shadow-md shadow-emerald-500/20 transition-all hover:bg-emerald-700 active:scale-[0.98] disabled:opacity-50 sm:w-auto dark:bg-cyan-600 dark:shadow-cyan-500/20 dark:hover:bg-cyan-700"
          >
            {loading ? (
              <svg
                className="h-5 w-5 animate-spin text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
            ) : (
              'Subscribe'
            )}
          </button>
        </div>

        {error && <p className="text-xs font-semibold text-rose-500 dark:text-rose-400">{error}</p>}
        {success && (
          <p className="text-xs font-semibold text-emerald-600 dark:text-cyan-400">{success}</p>
        )}
      </form>
    </div>
  )
}
