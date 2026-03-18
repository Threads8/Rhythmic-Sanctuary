"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Spinner } from "@/components/ui/spinner"
import { FieldGroup, Field, FieldLabel } from "@/components/ui/field"
import { useAuth } from "@/components/auth-provider"
import { useTheme } from "@/components/app-providers"
import { useI18n, type Language } from "@/lib/i18n"
import { updateUserData, signOut } from "@/lib/firebase"
import { SYMPTOMS, type SymptomId } from "@/lib/cycle-utils"
import { format, parseISO } from "date-fns"
import { useNotifications } from "@/hooks/use-notifications"
import { CalendarIcon, User, Clock, Stethoscope, LogOut, Check, Moon, Sun, Globe, Bell } from "lucide-react"
import { cn } from "@/lib/utils"
import { toast } from "sonner"

export function Settings() {
  const { user, userData } = useAuth()
  const { darkMode, setDarkMode } = useTheme()
  const { t, language, setLanguage } = useI18n()
  const { permission, requestPermission, sendNotification } = useNotifications()
  const [loading, setLoading] = useState(false)
  const [name, setName] = useState("")
  const [cycleLength, setCycleLength] = useState(28)
  const [lastPeriodDate, setLastPeriodDate] = useState<Date | undefined>()
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([])
  const [calendarOpen, setCalendarOpen] = useState(false)
  const [notificationsEnabled, setNotificationsEnabled] = useState(true)

  // Load user data into form
  useEffect(() => {
    if (userData) {
      setName(userData.name || "")
      setCycleLength(userData.cycleLength || 28)
      setSelectedSymptoms(userData.symptoms || [])
      setNotificationsEnabled(userData.notificationsEnabled ?? true)
      if (userData.lastPeriodDate) {
        setLastPeriodDate(parseISO(userData.lastPeriodDate))
      }
    }
  }, [userData])

  const handleSave = async () => {
    if (!user) return

    setLoading(true)
    try {
      await updateUserData(user.uid, {
        name,
        cycleLength,
        lastPeriodDate: lastPeriodDate ? format(lastPeriodDate, "yyyy-MM-dd") : "",
        symptoms: selectedSymptoms,
        notificationsEnabled,
      })
      toast.success(t('saveChanges'))
    } catch {
      toast.error("Failed to save settings")
    } finally {
      setLoading(false)
    }
  }

  const toggleSymptom = (symptomId: string) => {
    setSelectedSymptoms((prev) =>
      prev.includes(symptomId)
        ? prev.filter((s) => s !== symptomId)
        : [...prev, symptomId]
    )
  }

  const handleSignOut = async () => {
    try {
      await signOut()
    } catch {
      toast.error("Failed to sign out")
    }
  }

  const handleLanguageChange = (lang: Language) => {
    setLanguage(lang)
  }

  return (
    <div className="space-y-6">
      {/* Profile Settings */}
      <Card className="border-border/50">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10">
              <User className="w-5 h-5 text-primary" />
            </div>
            <div>
              <CardTitle className="text-lg">{t('profile')}</CardTitle>
              <CardDescription>{t('personalInfo')}</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="name">{t('name')}</FieldLabel>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={t('yourName')}
              />
            </Field>
            <Field>
              <FieldLabel>{t('email')}</FieldLabel>
              <Input value={user?.email || ""} disabled className="bg-muted" />
            </Field>
          </FieldGroup>
        </CardContent>
      </Card>

      {/* Cycle Settings */}
      <Card className="border-border/50">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-rose-500/10">
              <Clock className="w-5 h-5 text-rose-500" />
            </div>
            <div>
              <CardTitle className="text-lg">{t('cycleSettings')}</CardTitle>
              <CardDescription>{t('configureCycle')}</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Last Period Date */}
          <Field>
            <FieldLabel>{t('lastPeriodStartDate')}</FieldLabel>
            <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !lastPeriodDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {lastPeriodDate ? format(lastPeriodDate, "PPP") : t('selectDate')}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={lastPeriodDate}
                  onSelect={(date) => {
                    setLastPeriodDate(date)
                    setCalendarOpen(false)
                  }}
                  disabled={(date) => date > new Date()}
                  defaultMonth={lastPeriodDate}
                />
              </PopoverContent>
            </Popover>
          </Field>

          {/* Cycle Length */}
          <Field>
            <div className="flex items-center justify-between">
              <FieldLabel>{t('cycleLength')}</FieldLabel>
              <span className="text-sm font-medium text-primary">{cycleLength} {t('days')}</span>
            </div>
            <Slider
              value={[cycleLength]}
              onValueChange={([value]: number[]) => setCycleLength(value)}
              min={21}
              max={40}
              step={1}
              className="mt-2"
            />
            <p className="text-xs text-muted-foreground mt-2">
              {t('cycleLengthAvg')}
            </p>
          </Field>
        </CardContent>
      </Card>

      {/* Symptoms Tracking */}
      <Card className="border-border/50">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-amber-500/10">
              <Stethoscope className="w-5 h-5 text-amber-500" />
            </div>
            <div>
              <CardTitle className="text-lg">{t('symptoms')}</CardTitle>
              <CardDescription>{t('trackSymptoms')}</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {SYMPTOMS.map((symptom) => {
              const isSelected = selectedSymptoms.includes(symptom.id)
              return (
                <button
                  key={symptom.id}
                  type="button"
                  onClick={() => toggleSymptom(symptom.id)}
                  className={cn(
                    "flex items-center gap-2 p-3 rounded-lg border transition-all text-left",
                    isSelected
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-border hover:border-primary/50 hover:bg-muted/50"
                  )}
                >
                  {isSelected && <Check className="w-4 h-4 shrink-0" />}
                  <span className="text-sm font-medium truncate">{symptom.label}</span>
                </button>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Preferences */}
      <Card className="border-border/50">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-indigo-500/10">
              <Sun className="w-5 h-5 text-indigo-500" />
            </div>
            <div>
              <CardTitle className="text-lg">{t('preferences')}</CardTitle>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Dark Mode Toggle */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {darkMode ? (
                <Moon className="w-5 h-5 text-muted-foreground" />
              ) : (
                <Sun className="w-5 h-5 text-muted-foreground" />
              )}
              <span className="font-medium">{t('darkMode')}</span>
            </div>
            <Switch
              checked={darkMode}
              onCheckedChange={setDarkMode}
            />
          </div>

          {/* Language Selection */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Globe className="w-5 h-5 text-muted-foreground" />
              <span className="font-medium">{t('language')}</span>
            </div>
            <div className="flex gap-2">
              <Button
                variant={language === 'en' ? 'default' : 'outline'}
                size="sm"
                onClick={() => handleLanguageChange('en')}
              >
                English
              </Button>
              <Button
                variant={language === 'hi' ? 'default' : 'outline'}
                size="sm"
                onClick={() => handleLanguageChange('hi')}
              >
                हिंदी
              </Button>
            </div>
          </div>

          {/* Notifications Toggle */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Bell className="w-5 h-5 text-muted-foreground" />
              <span className="font-medium">{t('enableNotifications')}</span>
            </div>
            <Switch
              checked={notificationsEnabled}
              onCheckedChange={async (checked: boolean) => {
                if (checked && permission !== "granted") {
                   const granted = await requestPermission()
                   if (!granted) {
                     toast.error("Please allow notifications in your browser settings")
                     return
                   }
                }
                setNotificationsEnabled(checked)
              }}
            />
          </div>

          {notificationsEnabled && permission === "granted" && (
            <div className="pt-2">
              <Button 
                variant="outline" 
                size="sm" 
                className="w-full border-dashed dark:border-white/20 dark:hover:bg-white/5"
                onClick={() => sendNotification("Test Reminder 🌟", { body: "Your push notifications are working flawlessly!" })}
              >
                <Bell className="w-4 h-4 mr-2" />
                Send Test Reminder Push
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Save Button */}
      <Button onClick={handleSave} disabled={loading} className="w-full">
        {loading ? <Spinner className="mr-2" /> : null}
        {t('saveChanges')}
      </Button>

      {/* Sign Out */}
      <Card className="border-border/50">
        <CardContent className="pt-6">
          <Button
            variant="outline"
            onClick={handleSignOut}
            className="w-full text-destructive hover:text-destructive"
          >
            <LogOut className="mr-2 h-4 w-4" />
            {t('signOut')}
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
