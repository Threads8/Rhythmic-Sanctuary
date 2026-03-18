"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { useAuth } from "@/components/auth-provider"
import { updateUserData } from "@/lib/firebase"
import { toast } from "sonner"
import { format } from "date-fns"
import { cn } from "@/lib/utils"

const MOODS = [
  { emoji: "😊", label: "Happy" },
  { emoji: "😌", label: "Calm" },
  { emoji: "😴", label: "Tired" },
  { emoji: "😢", label: "Sad" },
  { emoji: "😡", label: "Irritable" },
]

interface DailyCheckInDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function DailyCheckInDialog({ open, onOpenChange }: DailyCheckInDialogProps) {
  const { user, userData } = useAuth()
  const [loading, setLoading] = useState(false)

  // Form State
  const [selectedMood, setSelectedMood] = useState<string | null>(null)
  const [energyList, setEnergyList] = useState([5])
  const [stressList, setStressList] = useState([5])

  const handleSave = async () => {
    if (!user || !selectedMood) {
      toast.error("Please select a mood at least.")
      return
    }

    setLoading(true)
    try {
      const todayStr = format(new Date(), "yyyy-MM-dd")
      const existing = userData?.moodLogs || []
      
      const newLog = {
        date: todayStr,
        mood: selectedMood,
        energy: energyList[0],
        stress: stressList[0]
      }
      
      const filtered = existing.filter(l => l.date !== todayStr)
      const newLogs = [...filtered, newLog]
      
      // Basic streak: increment if not logged today
      const alreadyLoggedToday = existing.some(l => l.date === todayStr)
      const newStreak = alreadyLoggedToday ? (userData?.streak || 0) : (userData?.streak || 0) + 1

      await updateUserData(user.uid, {
        moodLogs: newLogs,
        streak: newStreak
      })

      toast.success("Daily check-in saved! Streak updated 🔥")
      onOpenChange(false)
    } catch (error) {
      toast.error("Failed to save check-in.")
    } finally {
      setLoading(false)
    }
  }

  // Reset state when opening
  const handleOpenChange = (isOpen: boolean) => {
    if (isOpen) {
      setSelectedMood(null)
      setEnergyList([5])
      setStressList([5])
    }
    onOpenChange(isOpen)
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-md bg-background/95 backdrop-blur-xl border-border/50">
        <DialogHeader>
          <DialogTitle className="text-xl">Daily Check-In</DialogTitle>
          <DialogDescription>Take a moment to center yourself and record how you're doing.</DialogDescription>
        </DialogHeader>

        <div className="space-y-6 pt-4 pb-2">
          {/* Mood Check-In */}
          <div className="space-y-3">
            <h4 className="text-sm font-medium text-foreground">1. Overall Mood</h4>
            <div className="flex justify-between items-center sm:px-2">
              {MOODS.map((mood) => (
                <button
                  key={mood.label}
                  onClick={() => setSelectedMood(mood.label)}
                  className={cn(
                    "flex flex-col items-center gap-2 p-2 rounded-2xl transition-all duration-300",
                    selectedMood === mood.label 
                      ? "bg-primary/20 scale-110 shadow-sm ring-2 ring-primary/20" 
                      : "hover:bg-muted opacity-60 hover:opacity-100"
                  )}
                >
                  <span className="text-3xl drop-shadow-sm">{mood.emoji}</span>
                  <span className={cn(
                    "text-[10px] font-medium transition-colors",
                    selectedMood === mood.label ? "text-primary font-bold" : "text-muted-foreground"
                  )}>
                    {mood.label}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Energy Level */}
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h4 className="text-sm font-medium text-foreground">2. Energy Level</h4>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-500">
                {energyList[0]}/10
              </span>
            </div>
            <Slider
              value={energyList}
              onValueChange={setEnergyList}
              max={10}
              min={1}
              step={1}
              className="py-1"
            />
            <div className="flex justify-between text-xs text-muted-foreground mt-1">
              <span>Exhausted</span>
              <span>Balanced</span>
              <span>Energetic</span>
            </div>
          </div>

          {/* Stress Level */}
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h4 className="text-sm font-medium text-foreground">3. Stress Level</h4>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-rose-500/10 text-rose-500">
                {stressList[0]}/10
              </span>
            </div>
            <Slider
              value={stressList}
              onValueChange={setStressList}
              max={10}
              min={1}
              step={1}
              className="py-1"
            />
            <div className="flex justify-between text-xs text-muted-foreground mt-1">
              <span>Relaxed</span>
              <span>Managing</span>
              <span>Overwhelmed</span>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-2">
          <Button variant="ghost" onClick={() => onOpenChange(false)} disabled={loading}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={loading || !selectedMood}>
            {loading ? "Saving..." : "Save Check-In"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
