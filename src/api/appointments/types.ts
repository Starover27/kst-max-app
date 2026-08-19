export interface AppointmentRaw {
  id: string
  doctorId: string
  date: string // ISO
  time: string
  room?: string
  status?: 'pending' | 'confirmed' | 'cancelled'
}

export interface Appointment {
  id: string
  doctorId: string
  datetime: string
  room?: string
  status?: string
}
