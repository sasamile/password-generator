"use server"

import { currentUser } from "@/lib/auth-user"
import { db } from "@/lib/db"



interface Notification {
  id: string
  title: string
  message: string
  type: 'warning' | 'info'
  createdAt: Date
}

export async function getNotificationsAndPasswordSecurity() {
    const session = await currentUser();
    if (!session?.email) return null;

  const user = await db.user.findUnique({
    where: { email: session.email },
    include: { element: true }
  })

  if (!user) return null

  const weakPasswords = user.element.filter(el => {
    const password = el.password || ''
    return password.length < 8 || !/[A-Z]/.test(password) || !/[0-9]/.test(password) || !/[^A-Za-z0-9]/.test(password)
  })

  const notifications: Notification[] = weakPasswords.map(pw => ({
    id: pw.id,
    title: 'Weak Password Detected',
    message: `Your password for ${pw.name} is insecure. Please update it.`,
    type: 'warning',
    createdAt: new Date()
  }))

  return {
    notifications,
    totalNotifications: notifications.length,
    weakPasswords: weakPasswords.length,
    totalPasswords: user.element.filter(el => el.password).length
  }
}

