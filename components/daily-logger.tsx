"use client"

import { useState } from "react"
import { useAuth } from "@/components/auth-provider"
import { format } from "date-fns"
import { getCurrentCycleDay } from "@/lib/cycle-utils"
import { Droplet, Wind, Frown, Zap, Heart, User, Sparkles } from "lucide-react"
import { cn } from "@/lib/utils"

export function DailyLogger() {
  const { userData } = useAuth()
  
  const cycleDay = userData?.lastPeriodDate ? getCurrentCycleDay(userData.lastPeriodDate) : 0
  const todayFormatted = format(new Date(), "EEEE, MMMM do")
  
  const [energyLevel, setEnergyLevel] = useState(50)
  const [flow, setFlow] = useState("Medium")
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>(["Bloating"])
  const [journalEntry, setJournalEntry] = useState("")

  const flowOptions = ["Light", "Medium", "Heavy"]
  const symptomOptions = [
    { id: "Cramps", icon: Droplet },
    { id: "Bloating", icon: Wind },
    { id: "Headache", icon: Frown },
    { id: "Fatigue", icon: Zap },
    { id: "Breast Tenderness", icon: Heart },
    { id: "Acne", icon: User },
  ]

  const toggleSymptom = (id: string) => {
    if (selectedSymptoms.includes(id)) {
      setSelectedSymptoms(selectedSymptoms.filter(s => s !== id))
    } else {
      setSelectedSymptoms([...selectedSymptoms, id])
    }
  }

  return (
    <div className="space-y-6 pb-10 max-w-4xl">
      
      {/* Header section */}
      <div className="pt-2 mb-8">
        <h1 className="text-[32px] font-extrabold text-[#111827] tracking-tight mb-1">
          Daily Logger
        </h1>
        <p className="text-[15px] text-[#64748b] dark:text-slate-400">
          {todayFormatted} — Day {cycleDay} of your cycle
        </p>
      </div>

      {/* Top Row: Emotional Balance & Flow */}
      <div className="flex flex-col md:flex-row gap-6">
        
        {/* Emotional Balance Slider */}
        <div className="flex-[2] bg-white dark:bg-slate-900 rounded-[2rem] p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 dark:border-white/5 flex flex-col justify-center relative overflow-hidden">
          <div className="absolute top-6 right-8">
             <Sparkles className="w-8 h-8 text-amber-300" />
          </div>
          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-1">
            Emotional Balance
          </p>
          <h2 className="text-2xl font-bold text-[#1e293b] dark:text-slate-200 mb-10">
            How are you feeling?
          </h2>

          <div className="px-2 mt-4">
            <input
              type="range"
              min="0"
              max="100"
              value={energyLevel}
              onChange={(e) => setEnergyLevel(parseInt(e.target.value))}
              className="w-full h-2 bg-blue-100 rounded-lg appearance-none cursor-pointer accent-[#8c494b]"
              style={{
                background: `linear-gradient(to right, #bfdbfe ${energyLevel}%, #e2e8f0 ${energyLevel}%)`
              }}
            />
            <div className="flex justify-between mt-4">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Low Energy</span>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Balanced</span>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Radiant</span>
            </div>
          </div>
        </div>

        {/* Vitals: Flow */}
        <div className="flex-1 bg-[#ecf4fa] dark:bg-pink-500/10 dark:backdrop-blur-sm/10 dark:backdrop-blur-sm rounded-[2rem] p-8 shadow-sm flex flex-col justify-center">
          <p className="text-[11px] font-bold text-slate-500 uppercase tracking-widest mb-1">
            Vitals
          </p>
          <h2 className="text-2xl font-bold text-[#1e293b] dark:text-slate-200 mb-6">
            Flow
          </h2>
          <div className="flex flex-col gap-3">
            {flowOptions.map((option) => (
              <button
                key={option}
                onClick={() => setFlow(option)}
                className={cn(
                  "flex items-center justify-between px-5 py-3.5 rounded-2xl transition-all font-semibold",
                  flow === option
                    ? "bg-[#8c494b] text-white dark:bg-gradient-to-r dark:from-pink-500/80 dark:to-purple-500/80 dark:text-white shadow-md"
                    : "bg-white dark:bg-slate-900 text-slate-700 hover:bg-white dark:bg-slate-900/80"
                )}
              >
                {option}
                <div className={cn(
                  "w-2.5 h-2.5 rounded-full",
                  flow === option ? "bg-white dark:bg-slate-900" : "bg-rose-300"
                )} />
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Symptom Tracking */}
      <div className="bg-[#f4f9fc] rounded-[2rem] p-8 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-[#1e293b] dark:text-slate-200">
            Symptom Tracking
          </h2>
          <span className="px-3 py-1 bg-rose-100/50 text-[#8c494b] dark:text-pink-400 text-[11px] font-bold tracking-wider rounded-full">
            Select multiple
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
          {symptomOptions.map((symptom) => {
            const isSelected = selectedSymptoms.includes(symptom.id)
            const Icon = symptom.icon
            return (
              <button
                key={symptom.id}
                onClick={() => toggleSymptom(symptom.id)}
                className={cn(
                  "flex flex-col items-center justify-center gap-3 w-full aspect-square rounded-[1.5rem] transition-all duration-300 shadow-sm",
                  isSelected
                    ? "bg-[#fcdec6] text-[#a85a44] transform scale-[1.02]"
                    : "bg-white dark:bg-slate-900 text-slate-500 hover:bg-white dark:bg-slate-900/80"
                )}
              >
                <div className={cn(
                  "w-10 h-10 rounded-full flex items-center justify-center",
                  isSelected ? "bg-white dark:bg-slate-900/50" : "bg-slate-50 dark:bg-white/5 dark:backdrop-blur-md"
                )}>
                  <Icon className="w-5 h-5" />
                </div>
                <span className="text-xs font-semibold px-2 text-center text-[#1e293b] dark:text-slate-200 break-words">
                  {symptom.id}
                </span>
              </button>
            )
          })}
        </div>
      </div>

      {/* Journal Entry */}
      <div className="bg-[#f4f9fc] rounded-[2rem] p-8 shadow-sm">
        <h2 className="text-2xl font-bold text-[#1e293b] dark:text-slate-200 mb-6">
          Journal Entry
        </h2>
        <textarea
          value={journalEntry}
          onChange={(e) => setJournalEntry(e.target.value)}
          placeholder="Reflect on your day, energy levels, or anything else on your mind..."
          className="w-full h-32 bg-white dark:bg-slate-900 rounded-2xl p-5 text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#f4e6e6] dark:ring-pink-500/30/20 resize-none font-medium shadow-sm border border-transparent"
        />
        
        <div className="flex justify-end mt-4">
           <button className="bg-[#8c494b] hover:bg-[#733b3d] text-white px-8 py-3.5 rounded-2xl font-semibold shadow-md transition-colors">
              Save Entry
           </button>
        </div>
      </div>

    </div>
  )
}
