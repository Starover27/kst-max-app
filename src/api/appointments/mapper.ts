import type { AppointmentRaw } from './types'
import type { Appointment as EntityAppointment } from '../../entities/Appointment'

export function mapAppointment(raw: AppointmentRaw): EntityAppointment {
  return {
    id: raw.id,
    doctorId: raw.doctorId,
    datetime: `${raw.date}T${raw.time}`,
    room: raw.room,
    status: raw.status,
  }
}

export function mapAppointments(list: AppointmentRaw[]): EntityAppointment[] {
  return list.map(mapAppointment)
}
