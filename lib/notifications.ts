"use client"

// Browser notifications utility

export async function requestNotificationPermission(): Promise<boolean> {
  if (!("Notification" in window)) {
    console.warn("This browser does not support notifications")
    return false
  }

  if (Notification.permission === "granted") {
    return true
  }

  if (Notification.permission !== "denied") {
    const permission = await Notification.requestPermission()
    return permission === "granted"
  }

  return false
}

export function getNotificationPermission(): NotificationPermission | "unsupported" {
  if (!("Notification" in window)) {
    return "unsupported"
  }
  return Notification.permission
}

export function showNotification(title: string, options?: NotificationOptions): Notification | null {
  if (!("Notification" in window)) {
    console.warn("Notifications not supported")
    return null
  }

  if (Notification.permission !== "granted") {
    console.warn("Notification permission not granted")
    return null
  }

  return new Notification(title, {
    icon: "/icon.svg",
    badge: "/icon.svg",
    ...options,
  })
}

// Check and send period reminder
export function checkPeriodReminder(
  daysUntilPeriod: number,
  notificationsEnabled: boolean,
  lastNotificationKey: string
): boolean {
  if (!notificationsEnabled) return false
  if (daysUntilPeriod > 2 || daysUntilPeriod < 0) return false

  // Check if we've already sent this notification today
  const today = new Date().toISOString().split("T")[0]
  const lastNotification = localStorage.getItem(lastNotificationKey)
  if (lastNotification === today) return false

  // Mark as sent
  localStorage.setItem(lastNotificationKey, today)
  return true
}

// Check and send ovulation reminder
export function checkOvulationReminder(
  isOvulationDay: boolean,
  notificationsEnabled: boolean,
  lastNotificationKey: string
): boolean {
  if (!notificationsEnabled) return false
  if (!isOvulationDay) return false

  // Check if we've already sent this notification today
  const today = new Date().toISOString().split("T")[0]
  const lastNotification = localStorage.getItem(lastNotificationKey)
  if (lastNotification === today) return false

  // Mark as sent
  localStorage.setItem(lastNotificationKey, today)
  return true
}
