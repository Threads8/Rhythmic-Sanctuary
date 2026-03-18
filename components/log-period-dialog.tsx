"use client"

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Spinner } from "@/components/ui/spinner"
import { useAuth } from "@/components/auth-provider"
import { updateUserData, type CycleHistoryEntry } from "@/lib/firebase"
import { useI18n } from "@/lib/i18n"
import { format, differenceInDays, parseISO } from "date-fns"
import { toast } from "sonner"
import { Droplets } from "lucide-react"

interface LogPeriodDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function LogPeriodDialog({ open, onOpenChange }: LogPeriodDialogProps) {
  const { user, userData } = useAuth()
  const { t } = useI18n()
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date())
  const [loading, setLoading] = useState(false)

  const handleSave = async () => {
    if (!user || !selectedDate) return

    setLoading(true)
    try {
      const newPeriodDate = format(selectedDate, "yyyy-MM-dd")
      const existingHistory = userData?.cycleHistory || []
      
      // If there's a previous period, calculate cycle length and add to history
      if (userData?.lastPeriodDate) {
        const previousDate = parseISO(userData.lastPeriodDate)
        const cycleLength = differenceInDays(selectedDate, previousDate)
        
        // Only add to history if cycle length is reasonable (15-60 days)
        if (cycleLength >= 15 && cycleLength <= 60) {
          const newEntry: CycleHistoryEntry = {
            startDate: userData.lastPeriodDate,
            endDate: newPeriodDate,
            cycleLength,
          }
          
          // Add to history (keep last 12 cycles)
          const updatedHistory = [...existingHistory, newEntry].slice(-12)
          
          await updateUserData(user.uid, {
            lastPeriodDate: newPeriodDate,
            cycleHistory: updatedHistory,
          })
        } else {
          // Just update the date without adding to history
          await updateUserData(user.uid, {
            lastPeriodDate: newPeriodDate,
          })
        }
      } else {
        // First period entry
        await updateUserData(user.uid, {
          lastPeriodDate: newPeriodDate,
        })
      }
      
      toast.success("Period logged successfully")
      onOpenChange(false)
    } catch {
      toast.error("Failed to log period")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="text-center">
          <div className="mx-auto w-12 h-12 bg-rose-500/10 rounded-full flex items-center justify-center mb-2">
            <Droplets className="w-6 h-6 text-rose-500" />
          </div>
          <DialogTitle>{t('logPeriod')}</DialogTitle>
          <DialogDescription>
            {t('periodStartDate')}
          </DialogDescription>
        </DialogHeader>

        <div className="flex justify-center py-4">
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={setSelectedDate}
            disabled={(date) => date > new Date()}
            defaultMonth={selectedDate}
            className="rounded-lg border"
          />
        </div>

        <div className="flex gap-3">
          <Button
            variant="outline"
            className="flex-1"
            onClick={() => onOpenChange(false)}
          >
            {t('cancel')}
          </Button>
          <Button
            className="flex-1"
            onClick={handleSave}
            disabled={loading || !selectedDate}
          >
            {loading ? <Spinner className="mr-2" /> : null}
            {t('save')}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
