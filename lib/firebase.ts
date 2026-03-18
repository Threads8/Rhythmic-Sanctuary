"use client"

// Firebase module with lazy initialization
// Last updated: March 2026

import { initializeApp, getApps, type FirebaseApp } from "firebase/app"
import {
  getAuth,
  signInWithPopup,
  signInAnonymously,
  GoogleAuthProvider,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  type User,
  type Auth,
} from "firebase/auth"
import {
  getFirestore,
  doc,
  setDoc,
  getDoc,
  updateDoc,
  onSnapshot,
  serverTimestamp,
  type Timestamp,
  type Firestore,
} from "firebase/firestore"

// Firebase configuration
const FIREBASE_CONFIG = {
  apiKey: "AIzaSyDZi6luGCMXTC5goKtIkv3F2rN7YbGQ2gs",
  authDomain: "menstrual-cycle-tracker-f7f40.firebaseapp.com",
  projectId: "menstrual-cycle-tracker-f7f40",
  storageBucket: "menstrual-cycle-tracker-f7f40.firebasestorage.app",
  messagingSenderId: "65952804451",
  appId: "1:65952804451:web:0aa9bf746a86b9f7401256",
}

// Lazy singletons
let _app: FirebaseApp | null = null
let _auth: Auth | null = null
let _db: Firestore | null = null
let _provider: GoogleAuthProvider | null = null

function app(): FirebaseApp {
  if (_app === null) {
    _app = getApps().length > 0 ? getApps()[0] : initializeApp(FIREBASE_CONFIG)
  }
  return _app
}

function auth(): Auth {
  if (_auth === null) {
    _auth = getAuth(app())
  }
  return _auth
}

function db(): Firestore {
  if (_db === null) {
    _db = getFirestore(app())
  }
  return _db
}

function provider(): GoogleAuthProvider {
  if (_provider === null) {
    _provider = new GoogleAuthProvider()
  }
  return _provider
}

// Check config
export function isFirebaseConfigured(): boolean {
  return true
}

// Types
export interface SymptomLog {
  date: string
  mood: string
  painLevel: number
  flow: string
  notes?: string
}

export interface CycleHistoryEntry {
  startDate: string
  endDate: string
  cycleLength: number
}

export interface MoodLog {
  date: string
  mood: string
  energy: number
  stress: number
}

export interface UserData {
  uid: string
  name: string
  email: string
  cycleLength: number
  lastPeriodDate: string
  symptoms: string[]
  cycleHistory: CycleHistoryEntry[]
  symptomLogs: SymptomLog[]
  createdAt: Timestamp | null
  language: "en" | "hi"
  darkMode: boolean
  notificationsEnabled: boolean
  moodLogs: MoodLog[]
  streak: number
  goals: string[]
  preferences: {
    theme: string
    tone: string
  }
}

const DEFAULT_DATA = {
  name: "",
  cycleLength: 28,
  lastPeriodDate: "",
  symptoms: [] as string[],
  cycleHistory: [] as CycleHistoryEntry[],
  symptomLogs: [] as SymptomLog[],
  language: "en" as const,
  darkMode: false,
  notificationsEnabled: true,
  moodLogs: [] as MoodLog[],
  streak: 0,
  goals: [] as string[],
  preferences: {
    theme: "light",
    tone: "friendly",
  },
}

// Auth functions
export async function signInAsGuest() {
  const result = await signInAnonymously(auth())
  const userRef = doc(db(), "users", result.user.uid)
  const snap = await getDoc(userRef)
  if (!snap.exists()) {
    await setDoc(userRef, {
      ...DEFAULT_DATA,
      uid: result.user.uid,
      email: "",
      name: "Guest",
      createdAt: serverTimestamp(),
    })
  }
  return result
}

export async function signInWithGoogle() {
  const result = await signInWithPopup(auth(), provider())
  const userRef = doc(db(), "users", result.user.uid)
  const snap = await getDoc(userRef)
  if (!snap.exists()) {
    await setDoc(userRef, {
      ...DEFAULT_DATA,
      uid: result.user.uid,
      email: result.user.email,
      name: result.user.displayName || "",
      createdAt: serverTimestamp(),
    })
  }
  return result
}

export async function signOut() {
  return firebaseSignOut(auth())
}

// Data functions
export async function getUserData(uid: string): Promise<UserData | null> {
  const snap = await getDoc(doc(db(), "users", uid))
  return snap.exists() ? (snap.data() as UserData) : null
}

export async function updateUserData(uid: string, data: Partial<UserData>) {
  return updateDoc(doc(db(), "users", uid), data)
}

export function subscribeToUserData(
  uid: string,
  callback: (data: UserData | null) => void
) {
  return onSnapshot(doc(db(), "users", uid), (snap) => {
    callback(snap.exists() ? (snap.data() as UserData) : null)
  })
}

export function onAuthChange(callback: (user: User | null) => void) {
  return onAuthStateChanged(auth(), callback)
}

export type { User }
