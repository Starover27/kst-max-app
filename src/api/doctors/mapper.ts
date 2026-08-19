import type { DoctorRaw } from './types'
import type { Doctor as EntityDoctor } from '../../entities/Doctor'

export function mapDoctor(raw: DoctorRaw): EntityDoctor {
  return {
    id: raw.id,
    fullName: raw.name,
    specialty: raw.title,
    avatar: raw.photo,
    profileUrl: raw.profileUrl,
  }
}

export function mapDoctors(list: DoctorRaw[]): EntityDoctor[] {
  return list.map(mapDoctor)
}
