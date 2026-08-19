import type { AppointmentRaw } from './types'

const delay = (ms = 200) => new Promise((r) => setTimeout(r, ms))

const store: AppointmentRaw[] = [
  { id: 'a1', doctorId: 'belokon', date: '2026-08-12', time: '11:00', room: '203', status: 'confirmed' },
]

export async function listAppointments(): Promise<AppointmentRaw[]> {
  await delay(200)
  return [...store]
}

export async function bookAppointment(payload: Omit<AppointmentRaw, 'id'>): Promise<AppointmentRaw> {
  await delay(200)
  const item: AppointmentRaw = { id: `a${Date.now()}`, ...payload }
  store.push(item)
  return item
}

export async function cancelAppointment(id: string): Promise<void> {
  await delay(120)
  const idx = store.findIndex((s) => s.id === id)
  if (idx >= 0) store.splice(idx, 1)
}
