import { initializeApp, getApps, getApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'
import { getAnalytics, Analytics } from 'firebase/analytics'

const firebaseConfig = {
  apiKey: 'AIzaSyAtjxNppSd9H8PHVDjMhn8jqHDtdVYq7ak',
  authDomain: 'iman-logics.firebaseapp.com',
  projectId: 'iman-logics',
  storageBucket: 'iman-logics.firebasestorage.app',
  messagingSenderId: '767496730088',
  appId: '1:767496730088:web:c9b5af4da0afc458aae05d',
  measurementId: 'G-EZMGWZYQKT',
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
