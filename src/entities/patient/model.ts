export interface Patient {
  id: string
  fullName: string
  phone: string
  email?: string
  birthDate?: string
  status: 'active' | 'pending' | 'archived'
}
