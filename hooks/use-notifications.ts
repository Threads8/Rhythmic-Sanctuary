"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/components/auth-provider"

export function useNotifications() {
  const [permission, setPermission] = useState<NotificationPermission>("default")
  const { userData } = useAuth()

  useEffect(() => {
    if (typeof window !== "undefined" && "Notification" in window) {
      setPermission(Notification.permission)
    }
  }, [])

  const requestPermission = async () => {
    if (typeof window === "undefined" || !("Notification" in window)) {
      console.warn("This browser does not support desktop notification")
      return false
    }

    const currentPermission = await Notification.requestPermission()
    setPermission(currentPermission)
    return currentPermission === "granted"
  }

  const sendNotification = (title: string, options?: NotificationOptions) => {
    if (permission === "granted") {
      new Notification(title, {
        icon: "/favicon.ico", // Ensures an icon is used if one is present
        badge: "/favicon.ico",
        ...options
      })
    }
  }

  // Daily symptom reminder architecture
  useEffect(() => {
    if (!userData || typeof window === "undefined" || !userData.notificationsEnabled || permission !== "granted") return
    
    const hasLoggedToday = () => {
        const todayStr = new Date().toISOString().split('T')[0];
        return userData.symptomLogs?.some((log: any) => log.date === todayStr);
    }

    // Check if we've already reminded them this browser session to prevent spamming
    const sessionKey = `dailyReminderSent_${new Date().toISOString().split('T')[0]}`
    const hasRemindedToday = sessionStorage.getItem(sessionKey) === "true"

    if (!hasLoggedToday() && !hasRemindedToday) {
      // Delay background pushes by 5 seconds to gracefully wait for app load
      const timer = setTimeout(() => {
        sendNotification("Time for your daily check-in! 💜", {
          body: "Don't forget to log your symptoms and mood today to keep your wellness streak going!",
          tag: "daily-reminder"
        })
        sessionStorage.setItem(sessionKey, "true")
      }, 5000)
      
      return () => clearTimeout(timer)
    }
  }, [userData, permission])

  return {
    permission,
    requestPermission,
    sendNotification
  }
}
