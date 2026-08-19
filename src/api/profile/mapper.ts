import type { ProfileRaw } from './types'
import type { User as EntityUser } from '../../entities/User'

export function mapProfile(raw: ProfileRaw): EntityUser {
  return { id: raw.id, fullName: raw.name, phone: raw.phone, email: raw.email }
}
