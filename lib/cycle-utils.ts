// Menstrual cycle prediction utilities
import {
  addDays,
  differenceInDays,
  format,
  parseISO,
  isWithinInterval,
  startOfDay,
  isSameDay,
} from "date-fns"

// Calculate the next period date based on last period and cycle length
export function predictNextPeriod(lastPeriodDate: string, cycleLength: number): Date {
  if (!lastPeriodDate) return new Date()
  const lastDate = parseISO(lastPeriodDate)
  return addDays(lastDate, cycleLength)
}

// Calculate ovulation date (typically 14 days before next period)
export function predictOvulation(lastPeriodDate: string, cycleLength: number): Date {
  if (!lastPeriodDate) return new Date()
  const nextPeriod = predictNextPeriod(lastPeriodDate, cycleLength)
  return addDays(nextPeriod, -14)
}

// Calculate fertile window (5 days before and 1 day after ovulation)
export function getFertileWindow(
  lastPeriodDate: string,
  cycleLength: number
): { start: Date; end: Date } {
  const ovulationDate = predictOvulation(lastPeriodDate, cycleLength)
  return {
    start: addDays(ovulationDate, -5),
    end: addDays(ovulationDate, 1),
  }
}

// Get period days (typically 5 days starting from period date)
export function getPeriodDays(periodStartDate: Date, duration: number = 5): Date[] {
  const days: Date[] = []
  for (let i = 0; i < duration; i++) {
    days.push(addDays(periodStartDate, i))
  }
  return days
}

// Calculate days until next period
export function getDaysUntilPeriod(lastPeriodDate: string, cycleLength: number): number {
  if (!lastPeriodDate) return 0
  const nextPeriod = predictNextPeriod(lastPeriodDate, cycleLength)
  const today = startOfDay(new Date())
  const diff = differenceInDays(nextPeriod, today)
  return Math.max(0, diff)
}

export function getCurrentCycleDay(lastPeriodDate: string, targetDate?: Date): number {
  if (!lastPeriodDate) return 0
  const lastDate = parseISO(lastPeriodDate)
  const today = startOfDay(targetDate || new Date())
  return Math.max(0, differenceInDays(today, lastDate)) + 1
}

export function getCyclePhase(
  lastPeriodDate: string,
  cycleLength: number,
  targetDate?: Date
): "menstrual" | "follicular" | "ovulation" | "luteal" {
  const cycleDay = getCurrentCycleDay(lastPeriodDate, targetDate)

  if (cycleDay <= 5) return "menstrual"
  if (cycleDay <= cycleLength - 14 - 2) return "follicular"
  if (cycleDay <= cycleLength - 14 + 2) return "ovulation"
  return "luteal"
}

// Check if a date is a period day
export function isPeriodDay(
  date: Date,
  lastPeriodDate: string,
  cycleLength: number,
  periodDuration: number = 5
): boolean {
  if (!lastPeriodDate) return false

  const lastDate = parseISO(lastPeriodDate)
  const today = startOfDay(new Date())

  // Check current cycle period days
  const currentPeriodDays = getPeriodDays(lastDate, periodDuration)
  if (currentPeriodDays.some((d) => isSameDay(d, date))) return true

  // Check next period days (prediction)
  const nextPeriodStart = predictNextPeriod(lastPeriodDate, cycleLength)
  const nextPeriodDays = getPeriodDays(nextPeriodStart, periodDuration)
  if (nextPeriodDays.some((d) => isSameDay(d, date))) return true

  // Check future cycles (up to 3 months ahead)
  for (let i = 2; i <= 4; i++) {
    const futurePeriodStart = addDays(lastDate, cycleLength * i)
    const futurePeriodDays = getPeriodDays(futurePeriodStart, periodDuration)
    if (futurePeriodDays.some((d) => isSameDay(d, date))) return true
  }

  return false
}

// Check if a date is an ovulation day
export function isOvulationDay(date: Date, lastPeriodDate: string, cycleLength: number): boolean {
  if (!lastPeriodDate) return false

  const ovulationDate = predictOvulation(lastPeriodDate, cycleLength)
  if (isSameDay(date, ovulationDate)) return true

  // Check future ovulation dates
  const lastDate = parseISO(lastPeriodDate)
  for (let i = 2; i <= 4; i++) {
    const futureLastPeriod = format(addDays(lastDate, cycleLength * (i - 1)), "yyyy-MM-dd")
    const futureOvulation = predictOvulation(futureLastPeriod, cycleLength)
    if (isSameDay(date, futureOvulation)) return true
  }

  return false
}

// Check if date is in fertile window
export function isFertileDay(date: Date, lastPeriodDate: string, cycleLength: number): boolean {
  if (!lastPeriodDate) return false

  const { start, end } = getFertileWindow(lastPeriodDate, cycleLength)
  if (isWithinInterval(date, { start, end })) return true

  // Check future fertile windows
  const lastDate = parseISO(lastPeriodDate)
  for (let i = 2; i <= 4; i++) {
    const futureLastPeriod = format(addDays(lastDate, cycleLength * (i - 1)), "yyyy-MM-dd")
    const futureWindow = getFertileWindow(futureLastPeriod, cycleLength)
    if (isWithinInterval(date, { start: futureWindow.start, end: futureWindow.end })) return true
  }

  return false
}

// Format date for display
export function formatDate(date: Date | string, formatString: string = "MMM d, yyyy"): string {
  const d = typeof date === "string" ? parseISO(date) : date
  return format(d, formatString)
}

// Calculate average cycle length from history
export function calculateAverageCycle(cycleHistory: { cycleLength: number }[]): number {
  if (!cycleHistory || cycleHistory.length === 0) return 28
  const total = cycleHistory.reduce((sum, entry) => sum + entry.cycleLength, 0)
  return Math.round(total / cycleHistory.length)
}

// Get cycle statistics from history
export function getCycleStatistics(cycleHistory: { cycleLength: number }[]) {
  if (!cycleHistory || cycleHistory.length === 0) {
    return { average: 28, shortest: 28, longest: 28, count: 0 }
  }
  const lengths = cycleHistory.map(c => c.cycleLength)
  return {
    average: Math.round(lengths.reduce((a, b) => a + b, 0) / lengths.length),
    shortest: Math.min(...lengths),
    longest: Math.max(...lengths),
    count: cycleHistory.length,
  }
}

// Improved prediction using cycle history
export function predictNextPeriodWithHistory(
  lastPeriodDate: string,
  cycleLength: number,
  cycleHistory: { cycleLength: number }[]
): Date {
  if (!lastPeriodDate) return new Date()
  const avgLength = cycleHistory.length >= 3 
    ? calculateAverageCycle(cycleHistory) 
    : cycleLength
  const lastDate = parseISO(lastPeriodDate)
  return addDays(lastDate, avgLength)
}

// Moods for tracking
export const MOODS = [
  { id: "happy", label: "Happy", icon: "😊" },
  { id: "calm", label: "Calm", icon: "😌" },
  { id: "sad", label: "Sad", icon: "😢" },
  { id: "irritated", label: "Irritated", icon: "😤" },
  { id: "anxious", label: "Anxious", icon: "😰" },
  { id: "energetic", label: "Energetic", icon: "⚡" },
  { id: "tired", label: "Tired", icon: "😴" },
  { id: "sensitive", label: "Sensitive", icon: "💗" },
] as const

export type MoodId = (typeof MOODS)[number]["id"]

// Flow intensities
export const FLOW_INTENSITIES = [
  { id: "none", label: "None", color: "bg-gray-200" },
  { id: "spotting", label: "Spotting", color: "bg-rose-200" },
  { id: "light", label: "Light", color: "bg-rose-300" },
  { id: "medium", label: "Medium", color: "bg-rose-400" },
  { id: "heavy", label: "Heavy", color: "bg-rose-500" },
] as const

export type FlowId = (typeof FLOW_INTENSITIES)[number]["id"]

// Get symptom frequency from logs
export function getSymptomFrequency(symptomLogs: { mood: string; painLevel: number; flow: string }[]) {
  const moodCounts: Record<string, number> = {}
  const flowCounts: Record<string, number> = {}
  let totalPain = 0
  let painEntries = 0

  symptomLogs.forEach(log => {
    if (log.mood) {
      moodCounts[log.mood] = (moodCounts[log.mood] || 0) + 1
    }
    if (log.flow) {
      flowCounts[log.flow] = (flowCounts[log.flow] || 0) + 1
    }
    if (log.painLevel > 0) {
      totalPain += log.painLevel
      painEntries++
    }
  })

  return {
    moodCounts,
    flowCounts,
    avgPainLevel: painEntries > 0 ? Math.round(totalPain / painEntries * 10) / 10 : 0,
  }
}

// Available symptoms for tracking
export const SYMPTOMS = [
  { id: "cramps", label: "Cramps", icon: "⚡" },
  { id: "headache", label: "Headache", icon: "🤕" },
  { id: "fatigue", label: "Fatigue", icon: "😴" },
  { id: "mood_swings", label: "Mood Swings", icon: "🎭" },
  { id: "bloating", label: "Bloating", icon: "🎈" },
  { id: "breast_tenderness", label: "Breast Tenderness", icon: "💗" },
  { id: "acne", label: "Acne", icon: "🔴" },
  { id: "back_pain", label: "Back Pain", icon: "🔙" },
  { id: "nausea", label: "Nausea", icon: "🤢" },
  { id: "cravings", label: "Cravings", icon: "🍫" },
  { id: "insomnia", label: "Insomnia", icon: "🌙" },
  { id: "anxiety", label: "Anxiety", icon: "😰" },
] as const

export type SymptomId = (typeof SYMPTOMS)[number]["id"]
