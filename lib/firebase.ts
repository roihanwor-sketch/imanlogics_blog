import { initializeApp, getApps, getApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'
import { getAnalytics, Analytics } from 'firebase/analytics'

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || 'AIzaSyAtjxNppSd9H8PHVDjMhn8jqHDtdVYq7ak',
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || 'iman-logics.firebaseapp.com',
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || 'iman-logics',
  storageBucket:
    process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || 'iman-logics.firebasestorage.app',
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || '767496730088',
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || '1:767496730088:web:c9b5af4da0afc458aae05d',
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID || 'G-EZMGWZYQKT',
}

// Initialize Firebase App
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp()
const db = getFirestore(app)

// Analytics only runs in browser environment
let analytics: Analytics | null = null
if (typeof window !== 'undefined') {
  analytics = getAnalytics(app)
}

export { app, db, analytics }
