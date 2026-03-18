"use client"

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Textarea } from "@/components/ui/textarea"
import { Spinner } from "@/components/ui/spinner"
import { FieldGroup, Field, FieldLabel } from "@/components/ui/field"
import { useAuth } from "@/components/auth-provider"
import { updateUserData, type SymptomLog } from "@/lib/firebase"
import { MOODS, FLOW_INTENSITIES, type MoodId, type FlowId } from "@/lib/cycle-utils"
import { useI18n } from "@/lib/i18n"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import { toast } from "sonner"

interface SymptomLogDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  selectedDate?: Date
}

export function SymptomLogDialog({ open, onOpenChange, selectedDate }: SymptomLogDialogProps) {
  const { user, userData } = useAuth()
  const { t } = useI18n()
  const [loading, setLoading] = useState(false)
  const [mood, setMood] = useState<MoodId | "">("")
  const [painLevel, setPainLevel] = useState(0)
  const [flow, setFlow] = useState<FlowId>("none")
  const [notes, setNotes] = useState("")

  const date = selectedDate || new Date()
  const dateStr = format(date, "yyyy-MM-dd")

  const handleSave = async () => {
    if (!user) return

    setLoading(true)
    try {
      const newLog: SymptomLog = {
        date: dateStr,
        mood: mood || "",
        painLevel,
        flow,
        notes: notes.trim() || undefined,
      }

      const existingLogs = userData?.symptomLogs || []
      // Update existing log for the same date or add new one
      const updatedLogs = existingLogs.filter(log => log.date !== dateStr)
      updatedLogs.push(newLog)

      await updateUserData(user.uid, {
        symptomLogs: updatedLogs,
      })

      toast.success("Symptoms logged successfully")
      onOpenChange(false)
      // Reset form
      setMood("")
      setPainLevel(0)
      setFlow("none")
      setNotes("")
    } catch {
      toast.error("Failed to log symptoms")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{t('logSymptoms')}</DialogTitle>
          <p className="text-sm text-muted-foreground">
            {format(date, "EEEE, MMMM d, yyyy")}
          </p>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Mood Selection */}
          <Field>
            <FieldLabel>{t('mood')}</FieldLabel>
            <div className="grid grid-cols-4 gap-2">
              {MOODS.map((m) => (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => setMood(mood === m.id ? "" : m.id)}
                  className={cn(
                    "flex flex-col items-center gap-1 p-3 rounded-lg border transition-all",
                    mood === m.id
                      ? "border-primary bg-primary/10"
                      : "border-border hover:border-primary/50 hover:bg-muted/50"
                  )}
                >
                  <span className="text-2xl">{m.icon}</span>
                  <span className="text-xs font-medium">{m.label}</span>
                </button>
              ))}
            </div>
          </Field>

          {/* Pain Level */}
          <Field>
            <div className="flex items-center justify-between">
              <FieldLabel>{t('painLevel')}</FieldLabel>
              <span className="text-sm font-medium text-primary">{painLevel}/10</span>
            </div>
            <div className="pt-2">
              <Slider
                value={[painLevel]}
                onValueChange={([value]: number[]) => setPainLevel(value)}
                min={0}
                max={10}
                step={1}
              />
              <div className="flex justify-between text-xs text-muted-foreground mt-1">
                <span>None</span>
                <span>Severe</span>
              </div>
            </div>
          </Field>

          {/* Flow Intensity */}
          <Field>
            <FieldLabel>{t('flowIntensity')}</FieldLabel>
            <div className="grid grid-cols-5 gap-2">
              {FLOW_INTENSITIES.map((f) => (
                <button
                  key={f.id}
                  type="button"
                  onClick={() => setFlow(f.id)}
                  className={cn(
                    "flex flex-col items-center gap-1 p-2 rounded-lg border transition-all",
                    flow === f.id
                      ? "border-primary bg-primary/10"
                      : "border-border hover:border-primary/50 hover:bg-muted/50"
                  )}
                >
                  <div className={cn("w-4 h-4 rounded-full", f.color)} />
                  <span className="text-xs font-medium">{f.label}</span>
                </button>
              ))}
            </div>
          </Field>

          {/* Notes */}
          <Field>
            <FieldLabel>{t('notes')}</FieldLabel>
            <Textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder={t('addNotes')}
              rows={3}
            />
          </Field>
        </div>

        <div className="flex gap-3">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="flex-1"
          >
            {t('cancel')}
          </Button>
          <Button onClick={handleSave} disabled={loading} className="flex-1">
            {loading ? <Spinner className="mr-2" /> : null}
            {t('save')}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
