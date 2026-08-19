// import * as mock from './mock' // Удаляем импорт моков
import type { DoctorRaw } from './types'
import { mapDoctors, mapDoctor } from './mapper'
import type { Doctor as EntityDoctor } from '../../entities/Doctor'
import { apiGet } from '../../shared/api/client';

export async function fetchDoctors(): Promise<EntityDoctor[]> {
  const raw = await apiGet<DoctorRaw[]>('/doctors');
  return mapDoctors(raw)
}

export async function fetchDoctor(id: string): Promise<EntityDoctor | null> {
  try {
    const raw = await apiGet<DoctorRaw | null>(`/doctors/${id}`);
    return raw ? mapDoctor(raw) : null;
  } catch (e) {
    console.error("Failed to fetch doctor:", e);
    return null;
  }
}
