"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { RefreshCw, Heart, Droplets, Activity, Brain, Moon, Wind, Sparkles, Star, CheckCircle2 } from "lucide-react"
import { cn } from "@/lib/utils"
import { useAuth } from "@/components/auth-provider"
import { updateUserData } from "@/lib/firebase"
import { getCyclePhase, calculateAverageCycle } from "@/lib/cycle-utils"

const MOTIVATIONS = [
  "You are strong, even on your toughest days 💜",
  "Listen to your body, it knows what you need 🌸",
  "Every phase of your cycle brings a unique strength ✨",
  "Be gentle with yourself today 🌱",
  "Your worth is not tied to your productivity 🌿",
  "Take up space, you deserve it 💫"
]

const AFFIRMATIONS = [
  "I am strong and capable.",
  "I honor my body's needs.",
  "I give myself permission to rest.",
  "I am entirely enough, just as I am.",
  "My feelings are valid and matter.",
  "I am in tune with my natural rhythm."
]

const MOODS = [
  { emoji: "😊", label: "Happy" },
  { emoji: "😌", label: "Calm" },
  { emoji: "😴", label: "Tired" },
  { emoji: "😢", label: "Sad" },
  { emoji: "😡", label: "Irritable" },
]

export function Wellness() {
  const { user, userData } = useAuth()
  const [motivationIdx, setMotivationIdx] = useState(0)
  const [isRefreshing, setIsRefreshing] = useState(false)
  
  const [favorites, setFavorites] = useState<number[]>([])
  const [goals, setGoals] = useState<string[]>(userData?.goals || [])
  const [breathingPhase, setBreathingPhase] = useState<"Breathe In" | "Hold" | "Breathe Out">("Breathe In")

  useEffect(() => {
    // Randomize initial motivation
    setMotivationIdx(Math.floor(Math.random() * MOTIVATIONS.length))
  }, [])

  useEffect(() => {
    // Simple breathing animation logic
    const interval = setInterval(() => {
      setBreathingPhase((prev) => {
        if (prev === "Breathe In") return "Hold"
        if (prev === "Hold") return "Breathe Out"
        return "Breathe In"
      })
    }, 4000)
    return () => clearInterval(interval)
  }, [])

  const refreshMotivation = () => {
    setIsRefreshing(true)
    setTimeout(() => {
      setMotivationIdx((prev) => (prev + 1) % MOTIVATIONS.length)
      setIsRefreshing(false)
    }, 500)
  }

  const toggleFavorite = (idx: number) => {
    setFavorites(prev => 
      prev.includes(idx) ? prev.filter(i => i !== idx) : [...prev, idx]
    )
  }

  const toggleGoal = async (goal: string) => {
    if (!user) return
    const newGoals = goals.includes(goal) 
      ? goals.filter(g => g !== goal) 
      : [...goals, goal]
    setGoals(newGoals)
    await updateUserData(user.uid, { goals: newGoals })
  }

  // Phase-based goals
  const cycleHistory = userData?.cycleHistory || []
  const avgCycleLength = cycleHistory.length >= 3 ? calculateAverageCycle(cycleHistory) : 28
  const phase = userData?.lastPeriodDate ? getCyclePhase(userData.lastPeriodDate, avgCycleLength) : "follicular"

  const phaseGoals: Record<string, string[]> = {
    menstrual: ["Rest deeply", "Drink warm herbal tea", "Gentle stretching"],
    follicular: ["Try a new workout", "Brainstorm new ideas", "Hydrate well"],
    ovulation: ["Socialize", "High-intensity exercise", "Express gratitude"],
    luteal: ["Prioritize sleep", "Eat nourishing foods", "Meditate for 5 mins"]
  }
  const suggestedGoals = phaseGoals[phase] || ["Drink water", "Sleep early", "Exercise"]

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-8">
      
      {/* Streak Badge Header */}
      <div className="flex justify-between items-center px-1 pt-2">
        <div>
          <h2 className="text-xl font-bold text-foreground tracking-tight">Wellness</h2>
          <p className="text-sm text-muted-foreground">Nourish your mind and body</p>
        </div>
        {(userData?.streak || 0) > 0 && (
          <div className="flex items-center gap-1.5 bg-amber-100 dark:bg-amber-950/40 text-amber-700 dark:text-amber-500 px-3 py-1.5 rounded-full text-xs font-bold shadow-sm">
            <Star className="w-4 h-4 fill-amber-500 text-amber-500" />
            {userData?.streak} Day Streak
          </div>
        )}
      </div>
      
      {/* Daily Motivation Card */}
      <Card className="border-none shadow-md bg-gradient-to-br from-pink-100/50 via-purple-100/50 to-rose-100/50 dark:from-pink-950/30 dark:via-purple-900/30 dark:to-rose-950/30">
        <CardContent className="pt-6 relative">
          <Button 
            variant="ghost" 
            size="icon" 
            className="absolute top-2 right-2 text-primary/60 hover:text-primary rounded-full hover:bg-primary/10 transition-colors"
            onClick={refreshMotivation}
          >
            <RefreshCw className={cn("w-4 h-4", isRefreshing && "animate-spin")} />
          </Button>
          <div className="flex flex-col items-center text-center space-y-4 py-4">
            <Sparkles className="w-8 h-8 text-purple-400" />
            <h3 className="text-sm font-medium tracking-widest uppercase text-muted-foreground">Daily Motivation</h3>
            <p className="text-xl font-medium text-foreground leading-relaxed transition-opacity duration-300">
              "{MOTIVATIONS[motivationIdx]}"
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Mood Check-In */}
      <div className="space-y-3 mt-6">
        <h3 className="font-semibold text-foreground px-1">How are you feeling today?</h3>
        <Card className="border-border/50 shadow-sm">
          <CardContent className="p-4">
            <div className="flex justify-between items-center gap-2 overflow-x-auto pb-2">
              {MOODS.map((mood) => (
                <button
                  key={mood.label}
                  className="flex flex-col items-center gap-2 p-3 rounded-2xl hover:bg-muted/50 transition-colors min-w-[70px] flex-1 focus:ring-2 focus:ring-primary/20"
                >
                  <span className="text-3xl">{mood.emoji}</span>
                  <span className="text-xs font-medium text-muted-foreground">{mood.label}</span>
                </button>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Daily Goals (Replaces inline mood) */}
      <div className="space-y-3 mt-6">
        <h3 className="font-semibold text-foreground px-1">Phase-Based Goals</h3>
        <Card className="border-border/50 shadow-sm">
          <CardContent className="p-4 space-y-3">
            {suggestedGoals.map((goal) => {
              const isActive = goals.includes(goal)
              return (
                <button
                  key={goal}
                  onClick={() => toggleGoal(goal)}
                  className={cn(
                    "flex items-center justify-between w-full p-3 rounded-xl text-left transition-all duration-300",
                    isActive 
                      ? "bg-primary/10 border-primary/20 text-primary border" 
                      : "bg-muted/50 hover:bg-muted text-muted-foreground border border-transparent"
                  )}
                >
                  <span className="text-sm font-medium">{goal}</span>
                  <CheckCircle2 className={cn("w-5 h-5", isActive ? "text-primary fill-primary/20" : "text-muted-foreground/30")} />
                </button>
              )
            })}
          </CardContent>
        </Card>
      </div>

      {/* Self-Care Suggestions */}
      <div className="space-y-3">
        <h3 className="font-semibold text-foreground px-1">Gentle Suggestions</h3>
        <div className="grid grid-cols-2 gap-3">
          <Card className="bg-blue-50/50 dark:bg-blue-950/20 border-none shadow-sm hover:shadow-md transition-all group cursor-pointer">
            <CardContent className="p-4 flex flex-col items-center text-center gap-2">
              <div className="p-3 bg-blue-100 dark:bg-blue-900/50 rounded-full group-hover:scale-110 transition-transform">
                <Droplets className="w-6 h-6 text-blue-500" />
              </div>
              <span className="font-medium text-sm text-foreground">Drink Water</span>
            </CardContent>
          </Card>
          
          <Card className="bg-emerald-50/50 dark:bg-emerald-950/20 border-none shadow-sm hover:shadow-md transition-all group cursor-pointer">
            <CardContent className="p-4 flex flex-col items-center text-center gap-2">
              <div className="p-3 bg-emerald-100 dark:bg-emerald-900/50 rounded-full group-hover:scale-110 transition-transform">
                <Activity className="w-6 h-6 text-emerald-500" />
              </div>
              <span className="font-medium text-sm text-foreground">Light Movement</span>
            </CardContent>
          </Card>

          <Card className="bg-purple-50/50 dark:bg-purple-950/20 border-none shadow-sm hover:shadow-md transition-all group cursor-pointer">
            <CardContent className="p-4 flex flex-col items-center text-center gap-2">
              <div className="p-3 bg-purple-100 dark:bg-purple-900/50 rounded-full group-hover:scale-110 transition-transform">
                <Brain className="w-6 h-6 text-purple-500" />
              </div>
              <span className="font-medium text-sm text-foreground">Meditation</span>
            </CardContent>
          </Card>

          <Card className="bg-indigo-50/50 dark:bg-indigo-950/20 border-none shadow-sm hover:shadow-md transition-all group cursor-pointer">
            <CardContent className="p-4 flex flex-col items-center text-center gap-2">
              <div className="p-3 bg-indigo-100 dark:bg-indigo-900/50 rounded-full group-hover:scale-110 transition-transform">
                <Moon className="w-6 h-6 text-indigo-500" />
              </div>
              <span className="font-medium text-sm text-foreground">Rest Deeply</span>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Calming Experience (Breathing Exercise) */}
      <div className="space-y-3">
        <h3 className="font-semibold text-foreground px-1">Take a Moment</h3>
        <Card className="border-border/50 shadow-sm overflow-hidden relative">
          <CardContent className="p-8 flex flex-col items-center justify-center min-h-[220px]">
            <Wind className="w-6 h-6 text-muted-foreground/30 absolute top-4 left-4" />
            <div className="relative flex items-center justify-center w-32 h-32">
              <div 
                className={cn(
                  "absolute inset-0 bg-primary/20 rounded-full transition-all duration-[4000ms] ease-in-out",
                  breathingPhase === "Breathe In" ? "scale-150 opacity-20" : 
                  breathingPhase === "Hold" ? "scale-150 opacity-10" : "scale-50 opacity-50"
                )}
              />
              <div 
                className={cn(
                  "absolute inset-4 bg-primary/30 rounded-full transition-all duration-[4000ms] ease-in-out",
                  breathingPhase === "Breathe In" ? "scale-125 opacity-30" : 
                  breathingPhase === "Hold" ? "scale-125 opacity-20" : "scale-75 opacity-60"
                )}
              />
              <div className="absolute inset-8 bg-background rounded-full flex items-center justify-center shadow-md z-10 transition-transform duration-[4000ms]">
                <span className="text-sm font-medium text-primary animate-pulse">{breathingPhase}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Affirmations */}
      <div className="space-y-3">
        <div className="flex justify-between items-center px-1">
          <h3 className="font-semibold text-foreground">Daily Affirmations</h3>
          <span className="text-xs text-muted-foreground">Tap heart to save</span>
        </div>
        <Card className="border-border/50 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-pink-400 to-purple-400" />
          <CardContent className="p-0 divide-y divide-border/50">
            {AFFIRMATIONS.map((text, idx) => {
              const isFav = favorites.includes(idx)
              return (
                <div key={idx} className="flex items-center justify-between p-4 hover:bg-muted/50 transition-colors pl-6">
                  <p className="text-sm text-foreground pr-4 leading-relaxed">{text}</p>
                  <button 
                    onClick={() => toggleFavorite(idx)}
                    className="shrink-0 p-2 -mr-2 rounded-full hover:bg-muted transition-colors"
                  >
                    <Heart 
                      className={cn(
                        "w-5 h-5 transition-all duration-300", 
                        isFav ? "fill-rose-500 text-rose-500 scale-110" : "text-muted-foreground hover:text-rose-400"
                      )} 
                    />
                  </button>
                </div>
              )
            })}
          </CardContent>
        </Card>
      </div>

    </div>
  )
}
