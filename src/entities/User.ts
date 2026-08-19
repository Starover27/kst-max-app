export type UserRole = 'patient' | 'doctor' | 'staff' | 'admin'

export interface User {
  id: string
  fullName?: string
  phone?: string
  email?: string
  avatarUrl?: string
  role?: UserRole
  position?: string
  specialty?: string
  branch?: string
  cabinet?: string
  isStaff?: boolean
}

// export default User // Удален