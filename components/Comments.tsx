'use client'

import { useState, useEffect } from 'react'
import {
  collection,
  query,
  where,
  orderBy,
  onSnapshot,
  addDoc,
  serverTimestamp,
  Timestamp,
} from 'firebase/firestore'
import { db } from '../lib/firebase'

interface Comment {
  id: string
  name: string
  content: string
  createdAt: Timestamp | null
}

export default function Comments({ slug }: { slug: string }) {
  const [comments, setComments] = useState<Comment[]>([])
  const [name, setName] = useState('')
  const [content, setContent] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [isMounted, setIsMounted] = useState(false)

  // Initialize client mount and load saved name
  useEffect(() => {
    setIsMounted(true)
    const savedName = localStorage.getItem('comment-author-name')
    if (savedName) {
      setName(savedName)
    }
  }, [])

  // Real-time listener for comments
  useEffect(() => {
    if (!slug) return

    const commentsRef = collection(db, 'comments')
    const q = query(commentsRef, where('articleId', '==', slug))

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const fetchedComments: Comment[] = []
        snapshot.forEach((doc) => {
          const data = doc.data()
          fetchedComments.push({
            id: doc.id,
            name: data.name || 'Anonymous',
            content: data.content || '',
            createdAt: data.createdAt,
          })
        })

        // Sort client-side by createdAt descending
        fetchedComments.sort((a, b) => {
          const timeA = a.createdAt?.toMillis() || 0
          const timeB = b.createdAt?.toMillis() || 0
          return timeB - timeA
        })

        setComments(fetchedComments)
        setError('')
      },
      (err) => {
        console.error('Error fetching comments:', err)
        setError('Gagal memuat komentar. Pastikan aturan database dikonfigurasi dengan benar.')
      }
    )

    return () => unsubscribe()
  }, [slug])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim() || !content.trim()) {
      setError('Nama dan isi komentar tidak boleh kosong.')
      return
    }
    setError('')
    setSubmitting(true)

    try {
      const commentsRef = collection(db, 'comments')
      await addDoc(commentsRef, {
        articleId: slug,
        name: name.trim(),
        content: content.trim(),
        createdAt: serverTimestamp(),
      })
      setContent('') // Reset comment input
      localStorage.setItem('comment-author-name', name.trim()) // Save author name
    } catch (err) {
      console.error('Error adding comment:', err)
      setError('Gagal mengirim komentar. Silakan coba lagi.')
    } finally {
      setSubmitting(false)
    }
  }

  const getInitials = (nameString: string) => {
    return nameString.trim().charAt(0).toUpperCase() || 'A'
  }

  const formatDate = (timestamp: Timestamp | null | undefined) => {
    if (!timestamp) return 'Baru saja'
    const date = timestamp.toDate()
    return date.toLocaleString('id-ID', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  return (
    <div className="mx-auto mt-12 max-w-2xl border-t border-gray-200 pt-10 text-left dark:border-gray-800">
      <h3 className="mb-6 text-xl font-bold text-gray-900 dark:text-gray-100">
        Komentar ({comments.length})
      </h3>

      {/* Formulir Input Komentar */}
      <form onSubmit={handleSubmit} className="mb-8 space-y-4">
        <div>
          <label
            htmlFor="name"
            className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            Nama
          </label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            disabled={submitting}
            placeholder="Masukkan nama Anda"
            className="w-full rounded-md border border-gray-300 bg-white px-4 py-2 text-sm text-gray-900 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 focus:outline-none disabled:bg-gray-100 dark:border-gray-800 dark:bg-gray-950 dark:text-gray-100 dark:focus:border-cyan-400 dark:focus:ring-cyan-400 dark:disabled:bg-gray-900"
            required
          />
        </div>

        <div>
          <label
            htmlFor="comment"
            className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            Komentar
          </label>
          <textarea
            id="comment"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            disabled={submitting}
            placeholder="Tulis komentar Anda di sini..."
            rows={4}
            className="w-full rounded-md border border-gray-300 bg-white px-4 py-2 text-sm text-gray-900 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 focus:outline-none disabled:bg-gray-100 dark:border-gray-800 dark:bg-gray-950 dark:text-gray-100 dark:focus:border-cyan-400 dark:focus:ring-cyan-400 dark:disabled:bg-gray-900"
            required
          />
        </div>

        {error && <p className="text-sm font-medium text-red-500">{error}</p>}

        <button
          type="submit"
          disabled={submitting}
          className="inline-flex items-center justify-center rounded-md bg-emerald-600 px-6 py-2 text-sm font-medium text-white transition-colors hover:bg-emerald-700 focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 focus:outline-none disabled:bg-gray-400 dark:bg-cyan-500 dark:hover:bg-cyan-600 dark:focus:ring-cyan-400 dark:focus:ring-offset-gray-950"
        >
          {submitting ? 'Mengirim...' : 'Kirim Komentar'}
        </button>
      </form>

      {/* Daftar Komentar */}
      <div className="divide-y divide-gray-100 dark:divide-gray-800">
        {comments.length === 0 ? (
          <p className="py-6 text-center text-sm text-gray-500 dark:text-gray-400">
            Belum ada komentar. Jadilah yang pertama memberikan komentar!
          </p>
        ) : (
          comments.map((comment) => (
            <div key={comment.id} className="flex gap-4 py-6">
              {/* Avatar Bulat dengan Huruf Inisial */}
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-emerald-500/10 text-sm font-bold text-emerald-600 dark:bg-cyan-500/10 dark:text-cyan-400">
                {getInitials(comment.name)}
              </div>

              {/* Isi Komentar */}
              <div className="flex-1 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                    {comment.name}
                  </span>
                  <span className="text-xs text-gray-400 dark:text-gray-500">
                    {isMounted && comment.createdAt ? formatDate(comment.createdAt) : 'Loading...'}
                  </span>
                </div>
                <p className="text-sm leading-relaxed break-words whitespace-pre-line text-gray-600 dark:text-gray-300">
                  {comment.content}
                </p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
