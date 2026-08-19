// import * as mock from './mock' // Удаляем импорт моков
import type { ProfileRaw } from './types'
import { mapProfile } from './mapper'
import { apiGet, apiPut } from '../../shared/api/client';

export async function fetchProfile() {
  const raw = await apiGet<ProfileRaw>('/profile');
  return mapProfile(raw)
}

export async function saveProfile(data: Partial<ProfileRaw>) {
  const raw = await apiPut<ProfileRaw>('/profile', data);
  return mapProfile(raw)
}
