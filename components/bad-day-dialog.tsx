"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Heart, Wind, Sparkles } from "lucide-react"
import { cn } from "@/lib/utils"

const SOOTHING_AFFIRMATIONS = [
  "You don't have to be perfect, you just have to be here.",
  "It's completely okay to pause and breathe.",
  "Your feelings are valid, but they do not define you.",
  "This moment is tough, but so are you.",
  "Allow yourself grace today. You deserve it."
]

interface BadDayDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function BadDayDialog({ open, onOpenChange }: BadDayDialogProps) {
  const [breathingPhase, setBreathingPhase] = useState<"Breathe In" | "Hold" | "Breathe Out">("Breathe In")
  const [affirmationIdx, setAffirmationIdx] = useState(0)

  // Handle breathing animation
  useEffect(() => {
    if (!open) return
    const interval = setInterval(() => {
      setBreathingPhase((prev) => {
        if (prev === "Breathe In") return "Hold"
        if (prev === "Hold") return "Breathe Out"
        return "Breathe In"
      })
    }, 4000)
    return () => clearInterval(interval)
  }, [open])

  // Randomize affirmation on open
  useEffect(() => {
    if (open) {
      setAffirmationIdx(Math.floor(Math.random() * SOOTHING_AFFIRMATIONS.length))
      setBreathingPhase("Breathe In")
    }
  }, [open])

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 dark:from-indigo-950 dark:via-purple-950 dark:to-pink-950 border-none shadow-2xl overflow-hidden p-0 sm:rounded-[2rem]">
        
        {/* Soft background aesthetic glow effects */}
        <div className="absolute top-0 right-0 p-8 w-64 h-64 bg-pink-400/10 blur-[60px] rounded-full pointer-events-none" />
        <div className="absolute bottom-0 left-0 p-8 w-64 h-64 bg-indigo-400/10 blur-[60px] rounded-full pointer-events-none" />

        <div className="p-6 pt-10 px-8 flex flex-col items-center">
          <div className="mx-auto w-16 h-16 bg-white/50 dark:bg-black/20 rounded-full flex items-center justify-center shadow-sm mb-6 relative">
            <Heart className="w-8 h-8 text-rose-400 animate-pulse fill-rose-400/20" />
            <Sparkles className="w-4 h-4 text-purple-400 absolute -top-1 -right-1" />
          </div>
          
          <DialogHeader className="text-center space-y-2 mb-8">
            <DialogTitle className="text-2xl font-semibold text-foreground tracking-tight">
              Take a steady breath
            </DialogTitle>
            <DialogDescription className="text-base text-muted-foreground">
              We all have hard days. You are safe here.
            </DialogDescription>
          </DialogHeader>

          {/* Calming Breathing Animation */}
          <div className="relative flex items-center justify-center w-40 h-40 mb-10">
            <Wind className="w-6 h-6 text-indigo-400/30 absolute -top-4 -left-4" />
            
            <div 
              className={cn(
                "absolute inset-0 bg-indigo-300/20 rounded-full transition-all duration-[4000ms] ease-in-out",
                breathingPhase === "Breathe In" ? "scale-150 opacity-20" : 
                breathingPhase === "Hold" ? "scale-150 opacity-10" : "scale-50 opacity-50"
              )}
            />
            <div 
              className={cn(
                "absolute inset-4 bg-indigo-400/30 rounded-full transition-all duration-[4000ms] ease-in-out",
                breathingPhase === "Breathe In" ? "scale-125 opacity-30" : 
                breathingPhase === "Hold" ? "scale-125 opacity-20" : "scale-75 opacity-60"
              )}
            />
            <div className="absolute inset-8 bg-white/80 dark:bg-black/50 rounded-full flex items-center justify-center shadow-md z-10 transition-transform duration-[4000ms] backdrop-blur-sm">
              <span className="text-sm font-medium text-indigo-600 dark:text-indigo-300 animate-pulse uppercase tracking-widest">{breathingPhase}</span>
            </div>
          </div>

          {/* Motivating Affirmation */}
          <div className="w-full bg-white/50 dark:bg-black/20 p-5 rounded-2xl backdrop-blur-md mb-8 border border-white/40 dark:border-white/5 text-center transition-all duration-500 hover:bg-white/60 dark:hover:bg-black/30">
            <p className="text-[15px] font-medium text-purple-800 dark:text-purple-200 leading-relaxed italic">
              "{SOOTHING_AFFIRMATIONS[affirmationIdx]}"
            </p>
          </div>

          <Button 
            onClick={() => onOpenChange(false)} 
            className="w-full rounded-2xl h-12 bg-indigo-600 hover:bg-indigo-700 shadow-md transition-all text-base"
          >
            I'm feeling a bit better
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
