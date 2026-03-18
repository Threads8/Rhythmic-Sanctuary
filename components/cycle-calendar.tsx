"use client"

import { useState } from "react"
import { useAuth } from "@/components/auth-provider"
import {
  isPeriodDay,
  isOvulationDay,
  isFertileDay,
  getCyclePhase,
  calculateAverageCycle,
  getCurrentCycleDay,
  getDaysUntilPeriod,
} from "@/lib/cycle-utils"
import { ChevronLeft, ChevronRight, Leaf } from "lucide-react"
import {
  addMonths,
  subMonths,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameMonth,
  isSameDay,
  getDay,
  format,
} from "date-fns"
import { cn } from "@/lib/utils"

export function CycleCalendar() {
  const { userData } = useAuth()
  const [currentMonth, setCurrentMonth] = useState(new Date())

  if (!userData?.lastPeriodDate) {
    return (
      <div className="flex justify-center items-center h-64 text-slate-500">
        Please log a period to activate your calendar.
      </div>
    )
  }

  const today = new Date()
  const monthStart = startOfMonth(currentMonth)
  const monthEnd = endOfMonth(currentMonth)
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd })

  const startDayOfWeek = getDay(monthStart)
  const emptyDays = Array(startDayOfWeek).fill(null)

  const previousMonth = () => setCurrentMonth(subMonths(currentMonth, 1))
  const nextMonth = () => setCurrentMonth(addMonths(currentMonth, 1))

  const weekDays = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"]

  const cycleHistory = userData.cycleHistory || []
  const avgCycleLength = cycleHistory.length >= 3 
    ? calculateAverageCycle(cycleHistory) 
    : userData.cycleLength

  const currentPhase = getCyclePhase(userData.lastPeriodDate, avgCycleLength)
  const cycleDay = getCurrentCycleDay(userData.lastPeriodDate)
  const ovulationDay = Math.round(avgCycleLength / 2)

  const phaseDetails = {
    menstrual: { name: "menstrual", advice: "Prioritize rest and warm, nourishing foods." },
    follicular: { name: "follicular", advice: "Focus on high-protein nourishment and strength building." },
    ovulation: { name: "ovulatory", advice: "Capitalize on high energy for intense workouts or social events." },
    luteal: { name: "luteal", advice: "Prepare for lower energy levels. Schedule restorative activities." }
  }
  const phaseInfo = phaseDetails[currentPhase] || phaseDetails.follicular

  let nextMilestoneTitle = ""
  let nextMilestoneDays = 0
  let nextMilestoneDesc = ""

  if (currentPhase === 'menstrual') {
    nextMilestoneTitle = "Follicular Phase"
    nextMilestoneDays = Math.max(1, 6 - cycleDay)
    nextMilestoneDesc = "Your energy will start to rise soon! Prep for higher activity levels."
  } else if (currentPhase === 'follicular') {
    nextMilestoneTitle = "Ovulation Phase"
    nextMilestoneDays = Math.max(1, ovulationDay - cycleDay)
    nextMilestoneDesc = "Peak energy is approaching. A great time for socializing and intense workouts."
  } else if (currentPhase === 'ovulation') {
    nextMilestoneTitle = "Luteal Phase"
    nextMilestoneDays = Math.max(1, (ovulationDay + 2) - cycleDay)
    nextMilestoneDesc = "Your energy will slowly decrease. Stock up on magnesium-rich snacks and schedule restorative yoga."
  } else {
    nextMilestoneTitle = "Menstrual Phase"
    nextMilestoneDays = getDaysUntilPeriod(userData.lastPeriodDate, avgCycleLength)
    nextMilestoneDesc = "Your period is coming. Prepare for rest, hydration, and warmth."
  }

  return (
    <div className="space-y-6 pb-10 max-w-5xl">
       {/* Header */}
       <div className="flex justify-between items-start mb-8 pt-2">
         <div>
           <h1 className="text-[40px] font-extrabold text-[#8c494b] dark:text-pink-400 tracking-tight mb-1">
             {format(currentMonth, "MMMM yyyy")}
           </h1>
           <p className="text-[15px] text-[#64748b] dark:text-slate-400">
             Your body is in the {phaseInfo.name} phase. {phaseInfo.advice}
           </p>
         </div>
         <div className="flex gap-2">
           <button onClick={previousMonth} className="w-10 h-10 rounded-xl bg-slate-50 hover:bg-slate-100 flex items-center justify-center text-slate-400 transition-colors">
             <ChevronLeft className="w-5 h-5" />
           </button>
           <button onClick={nextMonth} className="w-10 h-10 rounded-xl bg-slate-50 hover:bg-slate-100 flex items-center justify-center text-slate-400 transition-colors">
             <ChevronRight className="w-5 h-5" />
           </button>
         </div>
       </div>

       <div className="flex flex-col lg:flex-row gap-6">
         
         {/* Calendar Grid */}
         <div className="flex-[2] bg-white dark:bg-slate-900 rounded-[2rem] p-8 lg:p-12 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100">
            <div className="grid grid-cols-7 mb-6">
              {weekDays.map(day => (
                <div key={day} className="text-center text-[11px] font-extrabold text-slate-400 tracking-widest">{day}</div>
              ))}
            </div>

            <div className="grid grid-cols-7 gap-y-4 text-center">
              {emptyDays.map((_, i) => <div key={`empty-${i}`} className="h-16" />)}
              
              {days.map(day => {
                const isPeriod = isPeriodDay(day, userData.lastPeriodDate, userData.cycleLength)
                const isOvulation = isOvulationDay(day, userData.lastPeriodDate, userData.cycleLength)
                const isFertile = isFertileDay(day, userData.lastPeriodDate, userData.cycleLength) && !isOvulation
                const isToday = isSameDay(day, today)
                const isCurrentMonth = isSameMonth(day, currentMonth)

                let bgClass = "bg-transparent"
                if (isToday) bgClass = "bg-[#dbeafe] dark:bg-blue-500/20 rounded-2xl mx-1"
                else if (isPeriod) bgClass = "bg-[#f4e6e6] dark:bg-pink-500/10"
                else if (isOvulation || isFertile) bgClass = "bg-[#fef2eb] dark:bg-orange-500/10"

                return (
                  <div key={day.toISOString()} className={cn("relative flex flex-col items-center justify-center h-20 transition-all", bgClass, !isCurrentMonth && "opacity-30")}>
                    <span className={cn("text-[15px]", (isPeriod || isOvulation || isToday) ? "font-bold text-[#1e293b] dark:text-slate-200" : "font-semibold text-slate-600 dark:text-slate-400")}>
                      {format(day, "d")}
                    </span>

                    <div className="absolute top-3 right-4 flex justify-end">
                       {isOvulation && <Leaf className="w-3 h-3 text-[#a85a44]" />}
                    </div>

                    <div className="absolute bottom-3 flex flex-col items-center justify-center">
                      {isPeriod && !isToday && <div className="w-1.5 h-1.5 rounded-full bg-[#8c494b] dark:bg-pink-400" />}
                      {isToday && <span className="text-[8px] font-extrabold text-blue-500 uppercase tracking-widest mt-1">Today</span>}
                      {isOvulation && !isToday && <span className="text-[8px] font-extrabold text-[#a85a44] uppercase tracking-widest mt-1">Peak</span>}
                    </div>
                  </div>
                )
              })}
            </div>
         </div>

         {/* Right Sidebar Key & Milestones */}
         <div className="flex-1 flex flex-col gap-6">
           {/* Cycle Key */}
           <div className="bg-[#eef4fa] dark:bg-blue-500/10 dark:backdrop-blur-sm rounded-[2rem] p-8 shadow-sm">
             <h3 className="text-xl font-bold text-[#8c494b] dark:text-pink-400 mb-6">Cycle Key</h3>
             <div className="space-y-5">
               <div className="flex items-start gap-4">
                 <div className="w-8 h-8 rounded-xl bg-[#8c494b] dark:bg-pink-400 flex items-center justify-center shrink-0">
                   <div className="w-2 h-2 bg-white dark:bg-slate-900 rounded-full" />
                 </div>
                 <div>
                   <p className="font-bold text-[#1e293b] dark:text-slate-200 text-[15px]">Period</p>
                   <p className="text-xs font-medium text-slate-500">Confirmed bleeding days</p>
                 </div>
               </div>

               <div className="flex items-start gap-4">
                 <div className="w-8 h-8 rounded-xl bg-[#f4e6e6] dark:bg-pink-500/10 shrink-0" />
                 <div>
                   <p className="font-bold text-[#1e293b] dark:text-slate-200 text-[15px]">Predicted Period</p>
                   <p className="text-xs font-medium text-slate-500">Based on {avgCycleLength}-day average</p>
                 </div>
               </div>

               <div className="flex items-start gap-4">
                 <div className="w-8 h-8 rounded-xl bg-[#fef2eb] dark:bg-orange-500/10 flex items-center justify-center shrink-0">
                    <Leaf className="w-4 h-4 text-[#a85a44]" />
                 </div>
                 <div>
                   <p className="font-bold text-[#1e293b] dark:text-slate-200 text-[15px]">Peak Fertility</p>
                   <p className="text-xs font-medium text-slate-500">Ideal time for conception</p>
                 </div>
               </div>

               <div className="flex items-start gap-4">
                 <div className="w-8 h-8 rounded-xl bg-[#fef2eb] dark:bg-orange-500/10 shrink-0" />
                 <div>
                   <p className="font-bold text-[#1e293b] dark:text-slate-200 text-[15px]">High Fertility</p>
                   <p className="text-xs font-medium text-slate-500">Likely fertile window</p>
                 </div>
               </div>
             </div>
           </div>

           {/* Next Milestone */}
           <div className="bg-[#f8f9fc] dark:bg-white/5 dark:backdrop-blur-md rounded-[2rem] p-8 shadow-sm border border-slate-100">
             <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest mb-3">Next Milestone</p>
             <h3 className="text-3xl font-bold text-[#1e293b] dark:text-slate-200 mb-4 leading-tight">
               {nextMilestoneTitle}<br/> In {nextMilestoneDays} Day{nextMilestoneDays !== 1 ? 's' : ''}
             </h3>
             <p className="text-[13px] text-slate-500 font-medium leading-relaxed mb-6">
               {nextMilestoneDesc}
             </p>
             <p className="px-5 py-2.5 bg-white dark:bg-slate-900 border border-[#e2e8f0] dark:border-white/5 rounded-xl text-sm font-bold text-[#8c494b] dark:text-pink-400 shadow-sm inline-block">
               See "For You 💜" for guides
             </p>
           </div>
         </div>

       </div>
    </div>
  )
}
