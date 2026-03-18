"use client"

// Internationalization support for English and Hindi

export type Language = 'en' | 'hi'

export const translations = {
  en: {
    // Navigation
    home: "Home",
    calendar: "Calendar",
    settings: "Settings",
    analytics: "Analytics",
    wellness: "Wellness",
    wellnessSubtitle: "Your daily dose of positivity",
    
    // Dashboard
    dashboard: "Dashboard",
    yourCycleAtAGlance: "Your cycle at a glance",
    cycleProgress: "Cycle Progress",
    day: "Day",
    of: "of",
    daysUntilPeriod: "Days Until Period",
    ovulationDay: "Ovulation Day",
    cycleLength: "Cycle Length",
    lastPeriod: "Last Period",
    days: "days",
    daysAgo: "days ago",
    fertileWindowNearby: "Fertile window nearby",
    currentSymptoms: "Current Symptoms",
    
    // Phases
    menstrualPhase: "Menstrual Phase",
    follicularPhase: "Follicular Phase",
    ovulationPhase: "Ovulation Phase",
    lutealPhase: "Luteal Phase",
    periodIsHere: "Your period is here. Take it easy and rest.",
    energyRising: "Energy is rising. Great time for new projects!",
    peakEnergy: "Peak energy and fertility window.",
    windingDown: "Winding down. Self-care is important.",
    
    // Calendar
    calendarNotAvailable: "Calendar Not Available",
    setLastPeriodDate: "Please set your last period date in Settings to view predictions",
    today: "Today",
    period: "Period",
    ovulation: "Ovulation",
    fertile: "Fertile",
    
    // Settings
    profile: "Profile",
    personalInfo: "Your personal information",
    name: "Name",
    yourName: "Your name",
    email: "Email",
    cycleSettings: "Cycle Settings",
    configureCycle: "Configure your menstrual cycle",
    lastPeriodStartDate: "Last Period Start Date",
    selectDate: "Select date",
    cycleLengthAvg: "Average cycle length is 28 days (21-40 days is normal)",
    symptoms: "Symptoms",
    trackSymptoms: "Track your current symptoms",
    saveChanges: "Save Changes",
    signOut: "Sign Out",
    
    // Analytics
    cycleAnalytics: "Cycle Analytics",
    insightsPatterns: "Insights and patterns",
    cycleLengthTrends: "Cycle Length Trends",
    averageCycle: "Average Cycle",
    shortestCycle: "Shortest Cycle",
    longestCycle: "Longest Cycle",
    totalCycles: "Total Cycles",
    symptomDistribution: "Symptom Distribution",
    moodPatterns: "Mood Patterns",
    flowPatterns: "Flow Patterns",
    avgPainLevel: "Avg Pain Level",
    noDataYet: "No data yet",
    startTracking: "Start tracking to see your patterns",
    
    // Symptom Logging
    logSymptoms: "Log Symptoms",
    howAreYouFeeling: "How are you feeling today?",
    mood: "Mood",
    painLevel: "Pain Level",
    flowIntensity: "Flow Intensity",
    notes: "Notes",
    addNotes: "Add any notes...",
    save: "Save",
    cancel: "Cancel",
    
    // Preferences
    preferences: "Preferences",
    darkMode: "Dark Mode",
    language: "Language",
    notifications: "Notifications",
    enableNotifications: "Enable Notifications",
    notifyBeforePeriod: "Notify before period",
    
    // Auth
    cycleTracker: "Cycle Tracker",
    trackYourHealth: "Track your menstrual health with ease",
    continueWithGoogle: "Continue with Google",
    continueAsGuest: "Continue as Guest",
    signingIn: "Signing in...",
    
    // Log Period
    logPeriod: "Log Period",
    periodStartDate: "Period Start Date",
    
    // Notifications
    periodReminder: "Period Reminder",
    periodStartingSoon: "Your period is expected to start in {days} days",
    ovulationToday: "Ovulation Day",
    todayIsOvulation: "Today is your predicted ovulation day",
    
    // Welcome
    welcomeTitle: "Welcome to Your Cycle Tracker",
    welcomeMessage: "Go to Settings to enter your last period date and start tracking",
  },
  hi: {
    // Navigation
    home: "होम",
    calendar: "कैलेंडर",
    settings: "सेटिंग्स",
    analytics: "एनालिटिक्स",
    wellness: "कल्याण",
    wellnessSubtitle: "आपकी दैनिक सकारात्मकता",
    
    // Dashboard
    dashboard: "डैशबोर्ड",
    yourCycleAtAGlance: "आपका चक्र एक नज़र में",
    cycleProgress: "चक्र प्रगति",
    day: "दिन",
    of: "का",
    daysUntilPeriod: "पीरियड तक दिन",
    ovulationDay: "ओव्यूलेशन का दिन",
    cycleLength: "चक्र की अवधि",
    lastPeriod: "पिछला पीरियड",
    days: "दिन",
    daysAgo: "दिन पहले",
    fertileWindowNearby: "फर्टाइल विंडो नज़दीक",
    currentSymptoms: "वर्तमान लक्षण",
    
    // Phases
    menstrualPhase: "मासिक धर्म चरण",
    follicularPhase: "फॉलिक्युलर चरण",
    ovulationPhase: "ओव्यूलेशन चरण",
    lutealPhase: "ल्यूटियल चरण",
    periodIsHere: "आपका पीरियड आ गया है। आराम करें।",
    energyRising: "ऊर्जा बढ़ रही है। नई परियोजनाओं के लिए अच्छा समय!",
    peakEnergy: "शीर्ष ऊर्जा और प्रजनन खिड़की।",
    windingDown: "धीरे-धीरे कम हो रहा है। आत्म-देखभाल महत्वपूर्ण है।",
    
    // Calendar
    calendarNotAvailable: "कैलेंडर उपलब्ध नहीं",
    setLastPeriodDate: "कृपया पूर्वानुमान देखने के लिए सेटिंग्स में अपनी अंतिम पीरियड तारीख दर्ज करें",
    today: "आज",
    period: "पीरियड",
    ovulation: "ओव्यूलेशन",
    fertile: "फर्टाइल",
    
    // Settings
    profile: "प्रोफ़ाइल",
    personalInfo: "आपकी व्यक्तिगत जानकारी",
    name: "नाम",
    yourName: "आपका नाम",
    email: "ईमेल",
    cycleSettings: "चक्र सेटिंग्स",
    configureCycle: "अपना मासिक चक्र कॉन्फ़िगर करें",
    lastPeriodStartDate: "पिछले पीरियड की शुरुआत की तारीख",
    selectDate: "तारीख चुनें",
    cycleLengthAvg: "औसत चक्र लंबाई 28 दिन है (21-40 दिन सामान्य है)",
    symptoms: "लक्षण",
    trackSymptoms: "अपने वर्तमान लक्षणों को ट्रैक करें",
    saveChanges: "बदलाव सेव करें",
    signOut: "साइन आउट",
    
    // Analytics
    cycleAnalytics: "चक्र एनालिटिक्स",
    insightsPatterns: "अंतर्दृष्टि और पैटर्न",
    cycleLengthTrends: "चक्र लंबाई के रुझान",
    averageCycle: "औसत चक्र",
    shortestCycle: "सबसे छोटा चक्र",
    longestCycle: "सबसे लंबा चक्र",
    totalCycles: "कुल चक्र",
    symptomDistribution: "लक्षण वितरण",
    moodPatterns: "मूड पैटर्न",
    flowPatterns: "फ्लो पैटर्न",
    avgPainLevel: "औसत दर्द स्तर",
    noDataYet: "अभी तक कोई डेटा नहीं",
    startTracking: "अपने पैटर्न देखने के लिए ट्रैकिंग शुरू करें",
    
    // Symptom Logging
    logSymptoms: "लक्षण लॉग करें",
    howAreYouFeeling: "आज आप कैसा महसूस कर रहे हैं?",
    mood: "मूड",
    painLevel: "दर्द का स्तर",
    flowIntensity: "फ्लो की तीव्रता",
    notes: "नोट्स",
    addNotes: "कोई नोट्स जोड़ें...",
    save: "सेव करें",
    cancel: "रद्द करें",
    
    // Preferences
    preferences: "प्राथमिकताएं",
    darkMode: "डार्क मोड",
    language: "भाषा",
    notifications: "सूचनाएं",
    enableNotifications: "सूचनाएं सक्षम करें",
    notifyBeforePeriod: "पीरियड से पहले सूचित करें",
    
    // Auth
    cycleTracker: "साइकल ट्रैकर",
    trackYourHealth: "आसानी से अपने मासिक स्वास्थ्य को ट्रैक करें",
    continueWithGoogle: "Google के साथ जारी रखें",
    continueAsGuest: "अतिथि के रूप में जारी रखें",
    signingIn: "साइन इन हो रहा है...",
    
    // Log Period
    logPeriod: "पीरियड लॉग करें",
    periodStartDate: "पीरियड शुरू होने की तारीख",
    
    // Notifications
    periodReminder: "पीरियड रिमाइंडर",
    periodStartingSoon: "आपका पीरियड {days} दिनों में शुरू होने वाला है",
    ovulationToday: "ओव्यूलेशन का दिन",
    todayIsOvulation: "आज आपका अनुमानित ओव्यूलेशन दिन है",
    
    // Welcome
    welcomeTitle: "आपके साइकल ट्रैकर में आपका स्वागत है",
    welcomeMessage: "ट्रैकिंग शुरू करने के लिए सेटिंग्स में जाकर अपनी अंतिम पीरियड तारीख दर्ज करें",
  },
} as const

export type TranslationKey = keyof typeof translations.en

export function getTranslation(lang: Language, key: TranslationKey): string {
  return translations[lang][key] || translations.en[key] || key
}

// React hook for translations
import { createContext, useContext, type ReactNode } from "react"

interface I18nContextType {
  language: Language
  t: (key: TranslationKey) => string
  setLanguage: (lang: Language) => void
}

export const I18nContext = createContext<I18nContextType | null>(null)

export function useI18n() {
  const context = useContext(I18nContext)
  if (!context) {
    // Return default values if not in provider
    return {
      language: 'en' as Language,
      t: (key: TranslationKey) => translations.en[key] || key,
      setLanguage: () => {},
    }
  }
  return context
}
