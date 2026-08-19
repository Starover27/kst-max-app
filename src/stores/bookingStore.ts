import { useSyncExternalStore } from 'react'

export interface Appointment {
  doctorId: string
  dateISO: string
  time: string
  cabinet: string
}

const listeners = new Set<() => void>()
const emit = () => listeners.forEach((l) => l())
const subscribe = (fn: () => void) => {
  listeners.add(fn)
  return () => {
    listeners.delete(fn)
  }
}

function load<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key)
    return raw ? (JSON.parse(raw) as T) : fallback
  } catch {
    return fallback
  }
}

function save<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch {
    // Игнорируем ошибки квоты или приватного режима
  }
}

let appointment: Appointment | null = load<Appointment | null>('mc_appointment', null)
let favorites: string[] = load<string[]>('mc_favorites', [])

export const getAppointment = () => appointment
export function setAppointment(a: Appointment | null) {
  appointment = a
  save('mc_appointment', a)
  emit()
}
export const useAppointment = () => useSyncExternalStore(subscribe, getAppointment)

export const getFavorites = () => favorites
export function toggleFavorite(id: string) {
  favorites = favorites.includes(id) ? favorites.filter((f) => f !== id) : [...favorites, id]
  save('mc_favorites', favorites)
  emit()
}
export const useFavorites = () => useSyncExternalStore(subscribe, getFavorites)
