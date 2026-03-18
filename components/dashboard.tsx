"use client"

import { useAuth } from "@/components/auth-provider"
import {
  predictOvulation,
  getDaysUntilPeriod,
  getCurrentCycleDay,
  getCyclePhase,
  calculateAverageCycle,
} from "@/lib/cycle-utils"
import { useState } from "react"
import { format } from "date-fns"
import { DailyCheckInDialog } from "@/components/daily-checkin-dialog"
import { BadDayDialog } from "@/components/bad-day-dialog"
import { Lightbulb, Leaf, Plus, Utensils, Brain, Moon, Activity, Zap, Smile, CloudRain } from "lucide-react"

export function Dashboard() {
  const { userData } = useAuth()
  const [checkInOpen, setCheckInOpen] = useState(false)
  const [badDayOpen, setBadDayOpen] = useState(false)

  if (!userData?.lastPeriodDate) {
    return (
      <div className="flex h-64 items-center justify-center">
        <p className="text-slate-500">Please connect your data or log a period.</p>
      </div>
    )
  }

  const cycleHistory = userData.cycleHistory || []
  const avgCycleLength = cycleHistory.length >= 3 
    ? calculateAverageCycle(cycleHistory) 
    : userData.cycleLength

  const daysUntil = getDaysUntilPeriod(userData.lastPeriodDate, avgCycleLength)
  const cycleDay = getCurrentCycleDay(userData.lastPeriodDate)
  const phase = getCyclePhase(userData.lastPeriodDate, avgCycleLength)
  const cycleProgress = Math.min((cycleDay / avgCycleLength) * 100, 100)

  // Map phases to dynamic text
  const phaseDetails = {
    menstrual: {
      name: "Menstrual",
      adjective: "restorative",
      insights: "Your energy might be lower today. It's perfectly fine to take things slow and prioritize comfort.",
      tip: "Stay warm and drink soothing teas like chamomile or ginger to help with cramps.",
      nutrition: "Focus on iron-rich foods like spinach and dark chocolate.",
      focus: "Gentle reflection, low-stakes tasks, and organizing.",
      rest: "Aim for 8-9 hours of sleep. Warm baths help relax muscles."
    },
    follicular: {
      name: "Follicular",
      adjective: "refreshing",
      insights: "Your energy is steadily rising. It's a fantastic time to start new projects or learn something new.",
      tip: "Harness this creative energy by brainstorming or planning your month ahead.",
      nutrition: "Incorporate light, fresh foods like salads, fermented foods, and lean proteins.",
      focus: "Creative tasks, problem-solving, and kicking off new initiatives.",
      rest: "You might need slightly less sleep, but keep a consistent routine."
    },
    ovulation: {
      name: "Ovulatory",
      adjective: "vibrant",
      insights: "Your energy levels are likely peaking. It's a great time for high-intensity workouts or social gatherings.",
      tip: "Hydration is key today to maintain that ovulatory glow. Aim for 2.5L of water infused with mint.",
      nutrition: "Raw veggies, lighter proteins, and anti-inflammatory foods.",
      focus: "Communication, presentations, and social collaborations flow easily.",
      rest: "You might feel like staying up later. Keep screens away before bed."
    },
    luteal: {
      name: "Luteal",
      adjective: "reflective",
      insights: "You may start to notice a gradual dip in energy. Honor your need for boundaries and nesting.",
      tip: "Engage in grounding exercises like yoga or simply walking in nature to stay centered.",
      nutrition: "Complex carbs like sweet potatoes and magnesium-rich foods to prevent cravings.",
      focus: "Wrapping up projects, admin work, and organizing your space.",
      rest: "Prioritize deep rest. Start winding down earlier in the evening."
    }
  }

  const currentPhase = phaseDetails[phase] || phaseDetails.follicular
  const userName = userData.name || "Elena"
  const firstName = userName.split(" ")[0]

  // Realtime logging:
  const todayDateStr = format(new Date(), "yyyy-MM-dd")
  const todayMoodLog = userData.moodLogs?.find(log => log.date === todayDateStr)
  const todaySymptomLog = userData.symptomLogs?.find(log => log.date === todayDateStr)

  let moodDesc = "Not Logged"
  if (todayMoodLog) {
     if (todayMoodLog.energy > 70) moodDesc = "Energetic & Social"
     else if (todayMoodLog.energy < 40) moodDesc = "Resting & Calm"
     else moodDesc = "Balanced"
  }
  
  let energyDesc = "Not Logged"
  if (todayMoodLog) {
     if (todayMoodLog.energy > 70) energyDesc = "High Productivity"
     else if (todayMoodLog.energy < 40) energyDesc = "Low Energy"
     else energyDesc = "Moderate"
  }

  let activityDesc = "Not Logged"
  if (userData.symptoms && userData.symptoms.length > 0) {
     activityDesc = userData.symptoms[0].replace("_", " ") 
  }
  if (todaySymptomLog && todaySymptomLog.flow !== 'none' && todaySymptomLog.flow !== '') {
     activityDesc = `Flow: ${todaySymptomLog.flow}`
  }

  // Donut chart math
  const radius = 60
  const circumference = 2 * Math.PI * radius
  const strokeDashoffset = circumference - (cycleProgress / 100) * circumference

  return (
    <div className="space-y-8 pb-10">
      
      {/* Header section */}
      <div className="pt-2">
        <h1 className="text-4xl font-extrabold text-[#1e293b] dark:text-slate-200 tracking-tight mb-2">
          Welcome home, {firstName}.
        </h1>
        <p className="text-lg text-[#64748b] dark:text-slate-400">
          Your body is in its {currentPhase.adjective} <span className="font-bold text-[#8c494b] dark:text-pink-400">{currentPhase.name} Phase</span> today.
        </p>
      </div>

      {/* Main Widgets */}
      <div className="flex flex-col lg:flex-row gap-6">
        
        {/* Left Card: Cycle Progress */}
        <div className="flex-1 bg-white dark:bg-slate-900 rounded-[2rem] p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 dark:border-white/5 flex items-center justify-between">
          <div className="space-y-4">
            <span className="inline-block px-3 py-1 bg-[#fcdbc6]/50 text-[#a85a44] text-[11px] font-bold tracking-wider uppercase rounded-full">
              Current Status
            </span>
            <h2 className="text-5xl font-extrabold text-[#1e293b] dark:text-slate-200 tracking-tight">
              {currentPhase.name}
            </h2>
            <div className="flex items-baseline gap-2 pt-2">
              <span className="text-5xl font-bold text-[#8c494b] dark:text-pink-400">{daysUntil}</span>
              <span className="text-lg font-medium text-[#64748b] dark:text-slate-400">days until next period</span>
            </div>
          </div>
          
          <div className="relative w-48 h-48 flex-shrink-0">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 140 140">
              {/* Background Circle */}
              <circle
                cx="70" cy="70" r={radius}
                fill="transparent"
                stroke="#dbeafe"
                strokeWidth="14"
              />
              {/* Foreground Circle */}
              <circle
                cx="70" cy="70" r={radius}
                fill="transparent"
                stroke="#8c494b"
                strokeWidth="14"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                className="transition-all duration-1000 ease-out"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-xs font-bold tracking-widest text-[#64748b] dark:text-slate-400 uppercase">Day</span>
              <span className="text-4xl font-extrabold text-[#1e293b] dark:text-slate-200">{cycleDay}</span>
            </div>
          </div>
        </div>

        {/* Right Cards: Insights & Tips */}
        <div className="w-full lg:w-80 flex flex-col gap-4">
          <div className="flex-1 bg-[#ecf4fa] dark:bg-blue-500/10 dark:backdrop-blur-sm rounded-3xl p-6 shadow-sm">
            <div className="flex items-center gap-2 mb-3">
              <Lightbulb className="w-5 h-5 text-[#8c494b] dark:text-pink-400" />
              <h3 className="font-bold text-[#8c494b] dark:text-pink-400">Daily Insights</h3>
            </div>
            <p className="text-[15px] text-slate-600 leading-relaxed font-medium">
              {currentPhase.insights}
            </p>
          </div>
          
          <div className="flex-1 bg-[#faeded] dark:bg-pink-500/10 dark:backdrop-blur-sm rounded-3xl p-6 shadow-sm">
            <div className="flex items-center gap-2 mb-3">
              <Leaf className="w-5 h-5 text-[#8c494b] dark:text-pink-400" />
              <h3 className="font-bold text-[#8c494b] dark:text-pink-400">Self-Care Tip</h3>
            </div>
            <p className="text-[15px] text-slate-600 leading-relaxed font-medium">
              {currentPhase.tip}
            </p>
          </div>
        </div>

      </div>

      {/* Today's Reflection */}
      <div>
        <div className="flex flex-col sm:flex-row sm:justify-between items-start sm:items-center mb-4 px-1 gap-2">
          <h2 className="text-xl font-bold text-[#1e293b] dark:text-slate-200">Today's Reflection</h2>
          <div className="flex gap-2">
            <button onClick={() => setCheckInOpen(true)} className="text-sm font-semibold text-[#8c494b] dark:text-pink-400 bg-rose-50 dark:bg-pink-500/10 px-4 py-2 rounded-xl hover:bg-rose-100 dark:hover:bg-pink-500/20 transition-colors">
              Daily Check-In
            </button>
            <button onClick={() => setBadDayOpen(true)} className="text-sm font-semibold text-slate-500 bg-slate-50 dark:bg-white/5 dark:text-slate-300 px-4 py-2 rounded-xl hover:bg-slate-100 transition-colors flex items-center gap-2">
              <CloudRain className="w-4 h-4" /> Tough Day?
            </button>
          </div>
        </div>
        
        <div className="flex flex-wrap gap-4 items-center">
          <div className="bg-white dark:bg-slate-900 rounded-2xl px-5 py-4 shadow-sm border border-slate-100 dark:border-white/5 flex items-center gap-4 flex-1 min-w-[200px]">
            <div className="w-10 h-10 rounded-full bg-rose-50 dark:bg-pink-500/10 flex items-center justify-center shrink-0">
              <Smile className="w-5 h-5 text-rose-500" />
            </div>
            <div>
              <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">Mood</p>
              <p className="font-bold text-[#1e293b] dark:text-slate-200 text-[15px]">{moodDesc}</p>
            </div>
          </div>
          
          <div className="bg-white dark:bg-slate-900 rounded-2xl px-5 py-4 shadow-sm border border-slate-100 dark:border-white/5 flex items-center gap-4 flex-1 min-w-[200px]">
            <div className="w-10 h-10 rounded-full bg-amber-50 dark:bg-amber-500/10 flex items-center justify-center shrink-0">
              <Zap className="w-5 h-5 text-amber-500" />
            </div>
            <div>
              <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">Energy</p>
              <p className="font-bold text-[#1e293b] dark:text-slate-200 text-[15px]">{energyDesc}</p>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-2xl px-5 py-4 shadow-sm border border-slate-100 dark:border-white/5 flex items-center gap-4 flex-1 min-w-[200px]">
            <div className="w-10 h-10 rounded-full bg-blue-50 dark:bg-blue-500/10 flex items-center justify-center shrink-0">
              <Activity className="w-5 h-5 text-blue-500" />
            </div>
            <div>
              <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">Activity</p>
              <p className="font-bold text-[#1e293b] dark:text-slate-200 text-[15px] capitalize">{activityDesc}</p>
            </div>
          </div>

          <button onClick={() => setCheckInOpen(true)} className="bg-[#f8fafc] dark:bg-white/5 dark:backdrop-blur-md hover:bg-[#f1f5f9] dark:hover:bg-slate-800 border-2 border-dashed border-[#cbd5e1] dark:border-white/10 rounded-2xl px-6 py-5 flex items-center gap-2 text-[#64748b] dark:text-slate-400 font-semibold transition-colors">
            <Plus className="w-5 h-5" /> Add Symptom
          </button>
        </div>
      </div>

      {/* Bottom Cards Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
        <div className="bg-[#f4f9fc] dark:bg-white/5 dark:backdrop-blur-md rounded-3xl p-8 transition-transform hover:-translate-y-1 duration-300">
          <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm mb-6">
            <Utensils className="w-5 h-5 text-[#8c494b]" />
          </div>
          <h3 className="font-bold text-lg text-[#1e293b] mb-3">Nutrition</h3>
          <p className="text-sm text-slate-600 leading-relaxed font-medium">
            {currentPhase.nutrition}
          </p>
        </div>

        <div className="bg-[#f4f9fc] dark:bg-white/5 dark:backdrop-blur-md rounded-3xl p-8 transition-transform hover:-translate-y-1 duration-300">
          <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm mb-6">
            <Brain className="w-5 h-5 text-[#8c494b]" />
          </div>
          <h3 className="font-bold text-lg text-[#1e293b] mb-3">Focus</h3>
          <p className="text-sm text-slate-600 leading-relaxed font-medium">
            {currentPhase.focus}
          </p>
        </div>

        <div className="bg-[#f4f9fc] dark:bg-slate-800/40 rounded-3xl p-8 transition-transform hover:-translate-y-1 duration-300">
          <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm mb-6">
            <Moon className="w-5 h-5 text-[#8c494b]" />
          </div>
          <h3 className="font-bold text-lg text-[#1e293b] mb-3">Rest</h3>
          <p className="text-sm text-slate-600 leading-relaxed font-medium">
            {currentPhase.rest}
          </p>
        </div>
      </div>
      
      <DailyCheckInDialog open={checkInOpen} onOpenChange={setCheckInOpen} />
      <BadDayDialog open={badDayOpen} onOpenChange={setBadDayOpen} />
    </div>
  )
}
