import type { ProfileRaw } from './types'

const delay = (ms = 120) => new Promise((r) => setTimeout(r, ms))

let profile: ProfileRaw = { id: 'user-1', name: 'Денис Петров', phone: '+79991234567', email: 'denis@example.com' }

export async function getProfile(): Promise<ProfileRaw> {
  await delay(100)
  return profile
}

export async function updateProfile(p: Partial<ProfileRaw>): Promise<ProfileRaw> {
  await delay(120)
  profile = { ...profile, ...p }
  return profile
}
