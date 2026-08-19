export interface Appointment {
  id: string
  patientId: string
  doctorId: string
  startsAt: string
  endsAt: string
  status: 'scheduled' | 'completed' | 'cancelled'
}
