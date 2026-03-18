"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertTriangle, ExternalLink, CheckCircle2 } from "lucide-react"

export function FirebaseSetup() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl border-border/50 shadow-lg">
        <CardHeader className="text-center space-y-2">
          <div className="mx-auto w-16 h-16 bg-amber-500/10 rounded-full flex items-center justify-center mb-2">
            <AlertTriangle className="w-8 h-8 text-amber-500" />
          </div>
          <CardTitle className="text-2xl font-bold">Firebase Setup Required</CardTitle>
          <CardDescription>
            Please configure Firebase to use this application
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <Alert variant="destructive" className="border-amber-500/50 bg-amber-500/10">
            <AlertTriangle className="h-4 w-4 text-amber-500" />
            <AlertTitle className="text-amber-600 dark:text-amber-400">Configuration Missing</AlertTitle>
            <AlertDescription className="text-amber-600/80 dark:text-amber-400/80">
              Firebase environment variables are not configured. Follow the steps below to set up your project.
            </AlertDescription>
          </Alert>

          <div className="space-y-4">
            <h3 className="font-semibold text-foreground">Setup Instructions:</h3>

            <ol className="space-y-4 text-sm">
              <li className="flex gap-3">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary text-xs font-medium">1</span>
                <div>
                  <p className="font-medium text-foreground">Create a Firebase Project</p>
                  <p className="text-muted-foreground mt-1">
                    Go to{" "}
                    <a
                      href="https://console.firebase.google.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:underline inline-flex items-center gap-1"
                    >
                      Firebase Console <ExternalLink className="w-3 h-3" />
                    </a>
                    {" "}and create a new project.
                  </p>
                </div>
              </li>

              <li className="flex gap-3">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary text-xs font-medium">2</span>
                <div>
                  <p className="font-medium text-foreground">Enable Authentication</p>
                  <p className="text-muted-foreground mt-1">
                    In your Firebase project, go to Authentication and enable Email/Password and Google sign-in providers.
                  </p>
                </div>
              </li>

              <li className="flex gap-3">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary text-xs font-medium">3</span>
                <div>
                  <p className="font-medium text-foreground">Create Firestore Database</p>
                  <p className="text-muted-foreground mt-1">
                    Go to Firestore Database and create a database. Start in test mode for development.
                  </p>
                </div>
              </li>

              <li className="flex gap-3">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary text-xs font-medium">4</span>
                <div>
                  <p className="font-medium text-foreground">Get Configuration</p>
                  <p className="text-muted-foreground mt-1">
                    Go to Project Settings {">"} General {">"} Your apps {">"} Web app. Register a web app and copy the configuration.
                  </p>
                </div>
              </li>

              <li className="flex gap-3">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary text-xs font-medium">5</span>
                <div>
                  <p className="font-medium text-foreground">Add Environment Variables</p>
                  <p className="text-muted-foreground mt-1">
                    Click the Settings icon in the top right of this page and add these variables:
                  </p>
                  <div className="mt-3 p-3 bg-muted rounded-lg font-mono text-xs space-y-1">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                      <span>NEXT_PUBLIC_FIREBASE_API_KEY</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                      <span>NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                      <span>NEXT_PUBLIC_FIREBASE_PROJECT_ID</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                      <span>NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                      <span>NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                      <span>NEXT_PUBLIC_FIREBASE_APP_ID</span>
                    </div>
                  </div>
                </div>
              </li>
            </ol>
          </div>

          <Alert className="border-emerald-500/50 bg-emerald-500/10">
            <CheckCircle2 className="h-4 w-4 text-emerald-500" />
            <AlertTitle className="text-emerald-600 dark:text-emerald-400">Tip</AlertTitle>
            <AlertDescription className="text-emerald-600/80 dark:text-emerald-400/80">
              After adding the environment variables, the app will automatically reload and connect to Firebase.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    </div>
  )
}
