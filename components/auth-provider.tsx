"use client"

import { createContext, useContext, useEffect, useState, type ReactNode } from "react"
import {
  onAuthChange,
  subscribeToUserData,
  isFirebaseConfigured,
  type User,
  type UserData,
} from "@/lib/firebase"

interface AuthContextType {
  user: User | null
  userData: UserData | null
  loading: boolean
  isConfigured: boolean
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  userData: null,
  loading: true,
  isConfigured: false,
})

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

interface AuthProviderProps {
  children: ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null)
  const [userData, setUserData] = useState<UserData | null>(null)
  const [loading, setLoading] = useState(true)

  // Check if Firebase is configured
  const isConfigured = isFirebaseConfigured()

  useEffect(() => {
    if (!isConfigured) {
      setLoading(false)
      return
    }

    const unsubscribeAuth = onAuthChange((authUser) => {
      setUser(authUser)
      if (!authUser) {
        setUserData(null)
        setLoading(false)
      }
    })

    return () => unsubscribeAuth()
  }, [isConfigured])

  useEffect(() => {
    if (!user || !isConfigured) return

    const unsubscribeData = subscribeToUserData(user.uid, (data) => {
      setUserData(data)
      setLoading(false)
    })

    return () => unsubscribeData()
  }, [user, isConfigured])

  return (
    <AuthContext.Provider value={{ user, userData, loading, isConfigured }}>
      {children}
    </AuthContext.Provider>
  )
}
