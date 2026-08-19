import type { DoctorRaw } from './types'
import doctorsData from '../../shared/data/doctors'

const delay = (ms = 200) => new Promise((r) => setTimeout(r, ms))

export async function listDoctors(): Promise<DoctorRaw[]> {
  await delay(250)
  // adapt shared/data/doctors entries shape to DoctorRaw
  return doctorsData.map((d) => ({ id: d.id, name: d.name, title: d.title, photo: d.photo, profileUrl: d.profileUrl }))
}

export async function getDoctor(id: string): Promise<DoctorRaw | null> {
  await delay(120)
  const found = (await listDoctors()).find((d) => d.id === id)
  return found ?? null
}
