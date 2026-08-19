import type { NotificationRaw } from './types'

const delay = (ms = 150) => new Promise((r) => setTimeout(r, ms))

const store: NotificationRaw[] = [
  { id: 'n1', title: 'Напоминание о приёме', body: 'Приём завтра в 11:00', date: '2026-08-11', read: false },
]

export async function listNotifications(): Promise<NotificationRaw[]> {
  await delay(150)
  return [...store]
}

export async function markRead(id: string): Promise<void> {
  await delay(80)
  const it = store.find((s) => s.id === id)
  if (it) it.read = true
}
