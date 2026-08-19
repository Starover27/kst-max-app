import * as mock from './mock'
import type { BookingDoctorRaw, BookingServiceRaw, TimeSlotRaw, BookingPayload, BookingResponseRaw } from './types'

const USE_MOCK = true

export async function getDoctors(): Promise<BookingDoctorRaw[]> {
  if (USE_MOCK) return mock.fetchDoctors()
  throw new Error('Real API not implemented yet')
}

export async function getServices(doctorId: string): Promise<BookingServiceRaw[]> {
  if (USE_MOCK) return mock.fetchServices(doctorId)
  throw new Error('Real API not implemented yet')
}

export async function getAvailableDates(): Promise<string[]> {
  if (USE_MOCK) return mock.fetchAvailableDates()
  throw new Error('Real API not implemented yet')
}

export async function getTimeSlots(doctorId: string, date: string): Promise<TimeSlotRaw[]> {
  if (USE_MOCK) return mock.fetchTimeSlots(doctorId, date)
  throw new Error('Real API not implemented yet')
}

export async function submitBooking(payload: BookingPayload): Promise<BookingResponseRaw> {
  if (USE_MOCK) return mock.createAppointment(payload)
  throw new Error('Real API not implemented yet')
}
