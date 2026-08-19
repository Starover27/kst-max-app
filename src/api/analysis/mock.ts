import type { LabResultRaw } from './types'

const delay = (ms = 150) => new Promise((r) => setTimeout(r, ms))

const items: LabResultRaw[] = [
  { id: 'r1', name: 'Общий анализ крови', date: '2026-08-12', status: 'ready' },
  { id: 'r2', name: 'Биохимия крови', date: '2026-08-10', status: 'ready' },
]

export async function listResults(): Promise<LabResultRaw[]> {
  await delay(180)
  return [...items]
}

export async function getResult(id: string): Promise<LabResultRaw | null> {
  await delay(80)
  return items.find((i) => i.id === id) ?? null
}
