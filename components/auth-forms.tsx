"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Spinner } from "@/components/ui/spinner"
import { signInWithGoogle, signInAsGuest } from "@/lib/firebase"

interface AuthFormsProps {
  onSuccess?: () => void
}

export function AuthForms({ onSuccess }: AuthFormsProps) {
  const [loading, setLoading] = useState<"google" | "guest" | null>(null)
  const [error, setError] = useState("")

  const handleGoogleSignIn = async () => {
    setLoading("google")
    setError("")

    try {
      await signInWithGoogle()
      onSuccess?.()
    } catch (err: unknown) {
      const error = err as { code?: string; message?: string }
      if (error.code === "auth/unauthorized-domain") {
        setError("This domain is not authorized. Please add it to Firebase Console > Authentication > Settings > Authorized domains")
      } else if (error.code === "auth/popup-closed-by-user") {
        setError("Sign in was cancelled")
      } else {
        setError(error.message || "Google sign in failed")
      }
    } finally {
      setLoading(null)
    }
  }

  const handleGuestSignIn = async () => {
    setLoading("guest")
    setError("")

    try {
      await signInAsGuest()
      onSuccess?.()
    } catch (err: unknown) {
      const error = err as { code?: string; message?: string }
      if (error.code === "auth/operation-not-allowed") {
        setError("Anonymous sign-in is not enabled. Please enable it in Firebase Console > Authentication > Sign-in method")
      } else {
        setError(error.message || "Guest sign in failed")
      }
    } finally {
      setLoading(null)
    }
  }

  return (
    <Card className="w-full max-w-md mx-auto border-border/50 shadow-lg">
      <CardHeader className="text-center space-y-2">
        <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-2">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            className="w-8 h-8 text-primary"
            stroke="currentColor"
            strokeWidth="2"
          >
            <circle cx="12" cy="12" r="10" />
            <path d="M12 8v4l3 3" />
          </svg>
        </div>
        <CardTitle className="text-2xl font-bold">Cycle Tracker</CardTitle>
        <CardDescription>
          Track your menstrual cycle with ease
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {error && (
          <div className="p-3 text-sm text-destructive bg-destructive/10 rounded-md text-center">
            {error}
          </div>
        )}

        <Button
          type="button"
          variant="outline"
          className="w-full h-12"
          onClick={handleGoogleSignIn}
          disabled={loading !== null}
        >
          {loading === "google" ? (
            <Spinner className="mr-2" />
          ) : (
            <svg className="mr-2 h-5 w-5" viewBox="0 0 24 24">
              <path
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                fill="#4285F4"
              />
              <path
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                fill="#34A853"
              />
              <path
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                fill="#FBBC05"
              />
              <path
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                fill="#EA4335"
              />
            </svg>
          )}
          Continue with Google
        </Button>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-border" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-card px-2 text-muted-foreground">Or</span>
          </div>
        </div>

        <Button
          type="button"
          variant="secondary"
          className="w-full h-12"
          onClick={handleGuestSignIn}
          disabled={loading !== null}
        >
          {loading === "guest" ? (
            <Spinner className="mr-2" />
          ) : (
            <svg className="mr-2 h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
          )}
          Continue as Guest
        </Button>

        <p className="text-center text-xs text-muted-foreground pt-2">
          Guest data is stored locally and may be lost if you clear your browser data.
        </p>
      </CardContent>
    </Card>
  )
}
