"use client"

import { useState } from "react"
import { AuthProvider, useAuth } from "@/components/auth-provider"
import { AppProviders } from "@/components/app-providers"
import { AuthForms } from "@/components/auth-forms"
import { Dashboard } from "@/components/dashboard"
import { CycleCalendar } from "@/components/cycle-calendar"
import { Analytics } from "@/components/analytics"
import { Settings } from "@/components/settings"
import { DailyLogger } from "@/components/daily-logger"
import { Wellness } from "@/components/wellness"
import { DeveloperCard } from "@/components/developer-card"
import { Navigation, Header, type TabType } from "@/components/navigation"
import { useNotifications } from "@/hooks/use-notifications"
import { LogPeriodDialog } from "@/components/log-period-dialog"
import { FirebaseSetup } from "@/components/firebase-setup"
import { Spinner } from "@/components/ui/spinner"
import { Toaster } from "@/components/ui/sonner"
import { useI18n } from "@/lib/i18n"

function AppContent() {
  const { user, loading, isConfigured } = useAuth()
  const { t } = useI18n()
  const [activeTab, setActiveTab] = useState<TabType>("dashboard")
  const [logPeriodOpen, setLogPeriodOpen] = useState(false)

  // Initializes background daily-reminder logic
  useNotifications()

  // Show Firebase setup instructions if not configured
  if (!isConfigured) {
    return <FirebaseSetup />
  }

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Spinner className="w-8 h-8" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    )
  }

  // Show auth forms if not logged in
  if (!user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <div className="mx-auto w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mb-4">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                className="w-10 h-10 text-primary"
                stroke="currentColor"
                strokeWidth="2"
              >
                <circle cx="12" cy="12" r="10" />
                <path d="M12 6v6l4 2" />
              </svg>
            </div>
            <h1 className="text-3xl font-bold text-foreground">{t('cycleTracker')}</h1>
            <p className="text-muted-foreground mt-2">
              {t('trackYourHealth')}
            </p>
          </div>
          <AuthForms />
        </div>
      </div>
    )
  }

  // Main app content
  const tabContent: Record<TabType, React.ReactElement> = {
    dashboard: <Dashboard />,
    calendar: <CycleCalendar />,
    "daily-logger": <DailyLogger />,
    wellness: <Wellness />,
    analytics: <Analytics />,
    settings: <Settings />,
    developer: <DeveloperCard />,
  }

  return (
    <div className="min-h-screen bg-white">
      <Navigation
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onAddPeriod={() => setLogPeriodOpen(true)}
      />

      <main className="flex-1 md:pl-64 flex flex-col min-h-screen">
        <Header />
        <div className="flex-1 p-4 pt-20 md:pt-4 md:p-8 lg:p-10 pb-24 md:pb-8 max-w-7xl mx-auto w-full">
          {tabContent[activeTab]}
        </div>
      </main>

      <Navigation
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onAddPeriod={() => setLogPeriodOpen(true)}
      />

      <LogPeriodDialog
        open={logPeriodOpen}
        onOpenChange={setLogPeriodOpen}
      />
    </div>
  )
}

export default function Page() {
  return (
    <AuthProvider>
      <AppProviders>
        <AppContent />
        <Toaster position="top-center" richColors />
      </AppProviders>
    </AuthProvider>
  )
}
