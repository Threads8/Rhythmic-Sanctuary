"use client"

import { useAuth } from "@/components/auth-provider"
import { getCycleStatistics } from "@/lib/cycle-utils"
import { BarChart3, TrendingUp, Smile } from "lucide-react"

export function Analytics() {
  const { userData } = useAuth()
  
  const cycleHistory = userData?.cycleHistory || []
  const stats = getCycleStatistics(cycleHistory)

  if (cycleHistory.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-center">
        <BarChart3 className="w-12 h-12 text-slate-300 mb-4" />
        <h3 className="text-xl font-bold text-[#1e293b] dark:text-slate-200">Not enough data yet</h3>
        <p className="text-slate-500 mt-2">Log your periods to unlock insights.</p>
      </div>
    )
  }

  return (
    <div className="space-y-6 pb-10 max-w-5xl">
      
      {/* Header section */}
      <div className="pt-2 mb-8">
        <h1 className="text-[32px] font-extrabold text-[#111827] tracking-tight mb-1">
          Trends & Insights
        </h1>
        <p className="text-[15px] text-[#64748b] dark:text-slate-400">
          Understanding your body's natural rhythm over the last 6 months.
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        
        {/* Left Column */}
        <div className="flex-[2] flex flex-col gap-6">
          
          {/* Cycle Consistency Chart */}
          <div className="bg-white dark:bg-slate-900 rounded-[2rem] p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 dark:border-white/5 relative">
             <div className="flex items-start justify-between mb-10">
               <div>
                  <h2 className="text-xl font-bold text-[#1e293b] dark:text-slate-200">Cycle Consistency</h2>
                  <p className="text-sm text-slate-500 font-medium">Average length: {stats.average} days (+/- 2 days)</p>
               </div>
               <span className="px-3 py-1 bg-blue-50 text-blue-600 text-[10px] font-bold tracking-widest uppercase rounded-full">
                  Stable
               </span>
             </div>

             {/* Custom Bar Chart Aesthetic */}
             <div className="flex items-end justify-between h-48 px-2 md:px-8 mt-12 relative">
                {['May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct'].map((month, i) => {
                   const isCurrent = i === 5
                   return (
                     <div key={month} className="flex flex-col items-center gap-4 relative">
                        <div className="absolute -top-6 w-2.5 h-2.5 rounded-full bg-rose-300 shadow-sm" style={{ backgroundColor: isCurrent ? '#8c494b' : '#fda4af' }} />
                        <div className="w-1.5 h-32 rounded-full relative overflow-hidden" style={{ backgroundColor: isCurrent ? '#8c494b' : '#fda4af' }}>
                           {!isCurrent && i % 2 === 0 && (
                             <div className="absolute top-0 left-0 right-0 h-4 bg-blue-200" />
                           )}
                        </div>
                        <span className="text-[11px] font-bold text-slate-400">{month}</span>
                     </div>
                   )
                })}
             </div>
          </div>

          {/* Top Symptoms Grid */}
          <div className="bg-[#f8f9fc] dark:bg-white/5 dark:backdrop-blur-md rounded-[2rem] p-8 shadow-sm">
             <div className="flex items-center gap-2 mb-6">
               <TrendingUp className="w-5 h-5 text-[#8c494b] dark:text-pink-400" />
               <h2 className="text-xl font-bold text-[#1e293b] dark:text-slate-200">Top Symptoms</h2>
             </div>
             
             <div className="grid grid-cols-2 gap-4">
               {[
                 { name: "Bloating", days: 12 },
                 { name: "Fatigue", days: 8 },
                 { name: "Cramps", days: 4 },
                 { name: "Headaches", days: 2 },
               ].map((symptom) => (
                 <div key={symptom.name} className="bg-white dark:bg-slate-900 rounded-2xl p-5 shadow-sm border border-slate-100 dark:border-white/5 flex flex-col gap-1 border-b-4" style={{ borderBottomColor: symptom.name === 'Bloating' || symptom.name === 'Fatigue' ? '#fee2e2' : 'transparent' }}>
                    <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">{symptom.name}</p>
                    <div className="flex items-baseline gap-1">
                      <span className="text-2xl font-bold text-[#8c494b] dark:text-pink-400">{symptom.days}</span>
                      <span className="text-xs text-slate-500 font-medium tracking-tight">days/avg</span>
                    </div>
                 </div>
               ))}
             </div>
          </div>

        </div>

        {/* Right Column */}
        <div className="flex-1 flex flex-col gap-6">
          
          {/* Mood Trends */}
          <div className="bg-[#fcdec6] rounded-[2rem] p-8 shadow-sm">
             <h2 className="text-xl font-bold text-[#a85a44] mb-1">Mood Trends</h2>
             <p className="text-sm font-medium text-[#c0735e] mb-8">Dominant moods per phase.</p>

             <div className="space-y-8">
                {[
                  { phase: "Follicular", pct: 78, mood: "Energetic" },
                  { phase: "Ovulatory", pct: 92, mood: "Radiance" },
                  { phase: "Luteal", pct: 64, mood: "Reflective" },
                ].map((item) => (
                  <div key={item.phase} className="flex gap-4 items-center">
                     <div className="w-10 h-10 rounded-full bg-white dark:bg-white/5 dark:backdrop-blur-md flex items-center justify-center shrink-0">
                       <Smile className="w-5 h-5 text-[#a85a44]" />
                     </div>
                     <div className="flex-1">
                        <div className="flex justify-between items-end mb-1">
                          <span className="text-[10px] font-extrabold text-[#a85a44] uppercase tracking-widest">{item.phase} {item.pct}%</span>
                          <span className="text-[10px] font-extrabold text-[#c0735e] uppercase tracking-widest">{item.mood}</span>
                        </div>
                        <div className="w-full h-1.5 bg-white dark:bg-slate-900/40 rounded-full overflow-hidden">
                           <div className="h-full bg-white dark:bg-slate-900 rounded-full" style={{ width: `${item.pct}%` }} />
                        </div>
                     </div>
                  </div>
                ))}
             </div>
          </div>

          {/* Phase Distribution */}
          <div className="bg-white dark:bg-slate-900 rounded-[2rem] p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 dark:border-white/5 flex-1">
             <h2 className="text-xl font-bold text-[#1e293b] dark:text-slate-200 mb-1">Phase Distribution</h2>
             <p className="text-[13px] text-slate-500 font-medium mb-6">Average duration of your cycle phases.</p>

             <div className="flex flex-col items-center justify-center py-6">
               <div className="relative w-40 h-40">
                  <svg className="w-full h-full transform -rotate-90" viewBox="0 0 140 140">
                    {/* Menstruation: ~18% */}
                    <circle cx="70" cy="70" r="50" fill="transparent" strokeWidth="12" strokeDasharray="314" strokeDashoffset="257.48" className="stroke-[#8c494b] dark:stroke-pink-500/80" />
                    {/* Follicular: ~32% */}
                    <circle cx="70" cy="70" r="50" fill="transparent" stroke="#fda4af" strokeWidth="12" strokeDasharray="314" strokeDashoffset="213.52" className="-rotate-[64deg] origin-center" />
                    {/* Ovulatory: ~7% */}
                    <circle cx="70" cy="70" r="50" fill="transparent" stroke="#fed7aa" strokeWidth="12" strokeDasharray="314" strokeDashoffset="292.02" className="-rotate-[180deg] origin-center" />
                    {/* Luteal: ~43% */}
                    <circle cx="70" cy="70" r="50" fill="transparent" stroke="#bfdbfe" strokeWidth="12" strokeDasharray="314" strokeDashoffset="178.98" className="-rotate-[205deg] origin-center" />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-2xl font-extrabold text-[#1e293b] dark:text-slate-200">{stats.average}</span>
                    <span className="text-[9px] font-bold tracking-widest text-slate-400 uppercase">Day Avg</span>
                  </div>
               </div>

               <div className="w-full mt-8 space-y-3 pl-2">
                 {[
                   { label: "Menstruation", days: 5, color: "bg-[#8c494b] dark:bg-pink-500/80" },
                   { label: "Follicular", days: 9, color: "bg-rose-300" },
                   { label: "Ovulatory", days: 2, color: "bg-orange-200" },
                   { label: "Luteal", days: 12, color: "bg-blue-200" },
                 ].map(phase => (
                   <div key={phase.label} className="flex items-center gap-3">
                     <span className={`w-2.5 h-2.5 rounded-full ${phase.color}`} />
                     <span className="text-[13px] font-medium text-slate-600 flex-1">{phase.label}:</span>
                     <span className="text-[13px] font-bold text-[#1e293b] dark:text-slate-200">{phase.days} days</span>
                   </div>
                 ))}
               </div>
             </div>
          </div>

        </div>
      </div>

    </div>
  )
}
