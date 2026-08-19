export interface Appointment {
  id: string
  doctorId: string
  datetime: string
  room?: string
  status?: string
}

// export default Appointment // Удален