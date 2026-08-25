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

interface CommentProps {
  slug: string
  language?: string
}

const UI_TEXT = {
  id: {
    heading: 'Komentar',
    nameLabel: 'Nama',
    namePlaceholder: 'Masukkan nama Anda',
    contentLabel: 'Komentar',
    contentPlaceholder: 'Tulis komentar Anda di sini...',
    submitBtn: 'Kirim Komentar',
    submittingBtn: 'Mengirim...',
    emptyState: 'Belum ada komentar. Jadilah yang pertama memberikan komentar!',
    errorEmpty: 'Nama dan isi komentar tidak boleh kosong.',
    errorSubmit: 'Gagal mengirim komentar. Silakan coba lagi.',
    errorFetch: 'Gagal memuat komentar. Pastikan aturan database dikonfigurasi dengan benar.',
    justNow: 'Baru saja',
    locale: 'id-ID',
  },
  en: {
    heading: 'Comments',
    nameLabel: 'Name',
    namePlaceholder: 'Enter your name',
    contentLabel: 'Comment',
    contentPlaceholder: 'Write your comment here...',
    submitBtn: 'Submit Comment',
    submittingBtn: 'Submitting...',
    emptyState: 'No comments yet. Be the first to join the discussion!',
    errorEmpty: 'Name and comment cannot be empty.',
    errorSubmit: 'Failed to submit comment. Please try again.',
    errorFetch: 'Failed to load comments. Please check database permissions.',
    justNow: 'Just now',
    locale: 'en-US',
  },
  ar: {
    heading: 'التعليقات',
    nameLabel: 'الاسم',
    namePlaceholder: 'أدخل اسمك الكريم',
    contentLabel: 'التعليق',
    contentPlaceholder: 'اكتب تعليقك أو رؤيتك هنا...',
    submitBtn: 'إرسال التعليق',
    submittingBtn: 'جاري الإرسال...',
    emptyState: 'لا توجد تعليقات حتى الآن. كن أول من يشارك برأيه!',
    errorEmpty: 'الاسم ومحتوى التعليق مطلوبان.',
    errorSubmit: 'تعذر إرسال التعليق. يرجى المحاولة مرة أخرى.',
    errorFetch: 'تعذر تحميل التعليقات. يرجى التحقق من الاتصال.',
    justNow: 'الآن',
    locale: 'ar-EG',
  },
}

export default function Comments({ slug, language = 'id' }: CommentProps) {
  const isRtl = language === 'ar' || slug.endsWith('.ar')
  const langKey = isRtl ? 'ar' : language === 'en' || slug.endsWith('.en') ? 'en' : 'id'
  const t = UI_TEXT[langKey]

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
            name: data.name || (langKey === 'ar' ? 'مشارك مجهول' : 'Anonymous'),
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
        setError(t.errorFetch)
      }
    )

    return () => unsubscribe()
  }, [slug, t.errorFetch, langKey])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim() || !content.trim()) {
      setError(t.errorEmpty)
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
      setError(t.errorSubmit)
    } finally {
      setSubmitting(false)
    }
  }

  const getInitials = (nameString: string) => {
    return nameString.trim().charAt(0).toUpperCase() || 'A'
  }

  const formatDate = (timestamp: Timestamp | null | undefined) => {
    if (!timestamp) return t.justNow
    const date = timestamp.toDate()
    return date.toLocaleString(t.locale, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  return (
    <div
      dir={isRtl ? 'rtl' : 'ltr'}
      className={`mx-auto mt-12 max-w-2xl border-t border-gray-200 pt-10 dark:border-gray-800 ${
        isRtl ? 'text-right' : 'text-left'
      }`}
    >
      <h3 className="mb-6 text-xl font-bold text-gray-900 dark:text-gray-100">
        {t.heading} ({comments.length})
      </h3>

      {/* Formulir Input Komentar */}
      <form onSubmit={handleSubmit} className="mb-8 space-y-4">
        <div>
          <label
            htmlFor="name"
            className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            {t.nameLabel}
          </label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            disabled={submitting}
            placeholder={t.namePlaceholder}
            className="w-full rounded-md border border-gray-300 bg-white px-4 py-2 text-sm text-gray-900 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 focus:outline-none disabled:bg-gray-100 dark:border-gray-800 dark:bg-gray-950 dark:text-gray-100 dark:focus:border-cyan-400 dark:focus:ring-cyan-400 dark:disabled:bg-gray-900"
            required
          />
        </div>

        <div>
          <label
            htmlFor="comment"
            className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            {t.contentLabel}
          </label>
          <textarea
            id="comment"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            disabled={submitting}
            placeholder={t.contentPlaceholder}
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
          {submitting ? t.submittingBtn : t.submitBtn}
        </button>
      </form>

      {/* Daftar Komentar */}
      <div className="divide-y divide-gray-100 dark:divide-gray-800">
        {comments.length === 0 ? (
          <p className="py-6 text-center text-sm text-gray-500 dark:text-gray-400">
            {t.emptyState}
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
                    {isMounted && comment.createdAt ? formatDate(comment.createdAt) : '...'}
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
