"use client"

import { cn } from "@/lib/utils"
import { Home, Calendar, Settings, Plus, BarChart3, Edit3, HelpCircle, Bell, Heart, Code2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useI18n } from "@/lib/i18n"
import { useAuth } from "@/components/auth-provider"

export type TabType = "dashboard" | "calendar" | "daily-logger" | "analytics" | "wellness" | "settings" | "developer"

interface NavigationProps {
  activeTab: TabType
  onTabChange: (tab: TabType) => void
  onAddPeriod: () => void
}

export function Navigation({ activeTab, onTabChange, onAddPeriod }: NavigationProps) {
  const { t } = useI18n()
  
  const mainTabs = [
    { id: "dashboard" as const, label: "Dashboard", icon: Home },
    { id: "calendar" as const, label: "Calendar", icon: Calendar },
    { id: "daily-logger" as const, label: "Daily Logger", icon: Edit3 },
    { id: "wellness" as const, label: "For You 💜", icon: Heart },
    { id: "analytics" as const, label: "Trends & Insights", icon: BarChart3 },
  ]

  const bottomTabs = [
    { id: "settings" as const, label: "Settings", icon: Settings },
    { id: "developer" as const, label: "Developer", icon: Code2 },
  ]

  return (
    <>
      <aside className="hidden md:flex flex-col w-64 h-screen fixed left-0 top-0 bg-[#f8f9fc] dark:bg-slate-900 border-r border-[#eef0f5] dark:border-slate-800 z-50 p-4 shadow-sm">
        <div className="mb-8 px-2 flex-shrink-0 mt-2">
          <h1 className="text-xl font-bold text-[#8c494b] dark:text-pink-400 tracking-tight">Rhythmic Sanctuary</h1>
        </div>
        
        <nav className="flex-1 space-y-2">
          {mainTabs.map((tab) => {
            const Icon = tab.icon
            const isActive = activeTab === tab.id
            return (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className={cn(
                  "w-full flex items-center gap-3 px-4 py-3 rounded-2xl transition-all duration-300 border-2",
                  isActive
                    ? "bg-white dark:bg-white/10 text-[#8c494b] dark:text-pink-400 font-semibold shadow-sm dark:shadow-[0_0_15px_rgba(236,72,153,0.15)] border-blue-200/50 dark:border-pink-500/20 border-dashed"
                    : "text-slate-500 hover:bg-white/50 dark:hover:bg-white/5 border-transparent hover:text-slate-800 dark:hover:text-slate-200"
                )}
              >
                <Icon className={cn("w-5 h-5", isActive ? "text-[#8c494b] dark:text-pink-400" : "text-slate-400")} />
                <span>{tab.label}</span>
              </button>
            )
          })}
        </nav>

        <div className="mt-auto space-y-4">
          <Button
            onClick={onAddPeriod}
            className="w-full justify-start h-12 bg-[#8c494b] hover:bg-[#733b3d] dark:bg-gradient-to-r dark:from-pink-500/80 dark:to-purple-500/80 dark:hover:from-pink-500 dark:hover:to-purple-500 dark:shadow-[0_0_15px_rgba(236,72,153,0.3)] dark:border-0 text-white rounded-xl shadow-md transition-all gap-2"
          >
            <Plus className="w-5 h-5" />
            <span className="font-medium text-sm">Log Period</span>
          </Button>

          <div className="space-y-1">
            {bottomTabs.map((tab) => {
              const Icon = tab.icon
              const isActive = activeTab === tab.id
              return (
                <button
                  key={tab.id}
                  onClick={() => onTabChange(tab.id)}
                  className={cn(
                    "w-full flex items-center gap-3 px-4 py-2 rounded-xl transition-all",
                    isActive
                      ? "text-[#8c494b] dark:text-pink-400 font-medium bg-white/50 dark:bg-white/10"
                      : "text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
                  )}
                >
                  <Icon className="w-5 h-5" />
                  <span className="text-sm">{tab.label}</span>
                </button>
              )
            })}
          </div>
        </div>
      </aside>

      <div className="md:hidden fixed top-0 left-0 right-0 z-[45] bg-white/80 dark:bg-[#0f172a]/80 backdrop-blur-xl border-b border-slate-100 dark:border-white/5 px-5 py-3.5 flex items-center justify-between shadow-sm">
        <h1 className="text-[22px] font-extrabold text-[#8c494b] dark:text-pink-400 tracking-tight leading-none">Rhythmic</h1>
        <div className="flex items-center gap-5">
          <button onClick={() => onTabChange("developer")} className={cn("transition-colors", activeTab === "developer" ? "text-[#8c494b] dark:text-pink-400" : "text-slate-400 hover:text-slate-700 dark:hover:text-slate-200")}>
            <Code2 className="w-[22px] h-[22px] stroke-[2.5]" />
          </button>
          <button onClick={() => onTabChange("settings")} className={cn("transition-colors", activeTab === "settings" ? "text-[#8c494b] dark:text-pink-400" : "text-slate-400 hover:text-slate-700 dark:hover:text-slate-200")}>
            <Settings className="w-[22px] h-[22px] stroke-[2.5]" />
          </button>
          <button className="relative text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-colors">
            <Bell className="w-[22px] h-[22px] stroke-[2.5]" />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-rose-500 rounded-full border-2 border-white dark:border-[#0f172a]" />
          </button>
        </div>
      </div>

      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white dark:bg-[#0f172a] border-t border-slate-100 dark:border-white/5 safe-area-pb shadow-[0_-4px_30px_rgba(0,0,0,0.08)]">
        <div className="flex items-center justify-around h-[68px] max-w-lg mx-auto px-2 pb-1">
          {mainTabs.map((tab) => {
            const Icon = tab.icon
            const isActive = activeTab === tab.id
            return (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className={cn(
                  "flex flex-col items-center justify-center gap-1 px-3 py-2 rounded-lg transition-colors min-w-[56px]",
                  isActive ? "text-[#8c494b] dark:text-pink-400" : "text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
                )}
              >
                <Icon className={cn("w-5 h-5", isActive && "scale-110")} />
                <span className="text-[10px] font-medium whitespace-nowrap">{tab.label}</span>
              </button>
            )
          })}
        </div>
      </nav>

      <Button
        onClick={onAddPeriod}
        size="icon"
        className="md:hidden fixed bottom-20 right-4 z-50 h-14 w-14 rounded-full shadow-lg bg-[#8c494b] hover:bg-[#733b3d] text-white"
      >
        <Plus className="w-6 h-6" />
      </Button>
    </>
  )
}

interface HeaderProps {
  title?: string
  subtitle?: string
}

export function Header({ title, subtitle }: HeaderProps) {
  const { userData } = useAuth()
  const name = userData?.name || "Elena Vance"
  const initials = name.split(" ").map(n => n[0]).join("").substring(0, 2).toUpperCase()
  
  return (
    <header className="md:flex hidden sticky top-0 z-[35] bg-white/80 dark:bg-[#0f172a]/80 backdrop-blur-md border-b border-transparent">
      <div className="flex-1 px-8 py-5 flex justify-end items-center gap-6">
         <button className="text-slate-400 hover:text-slate-600 transition-colors relative">
           <Bell className="w-5 h-5" />
           <span className="absolute top-0 right-0 w-2 h-2 bg-rose-400 rounded-full" />
         </button>
         <div className="flex items-center gap-3">
           <div className="text-right">
             <p className="text-sm font-semibold text-slate-800 dark:text-slate-200 leading-none">
               {userData?.name || "Elena Vance"}
             </p>
             <p className="text-xs text-slate-500 mt-1">
               Day 14 of cycle
             </p>
           </div>
           <div className="w-10 h-10 rounded-full bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center border border-orange-200 dark:border-orange-800 overflow-hidden">
              <span className="text-orange-500 dark:text-orange-400 font-bold text-sm">{initials}</span>
           </div>
         </div>
      </div>
    </header>
  )
}
