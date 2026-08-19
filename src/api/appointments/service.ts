// import * as mock from './mock' // Удаляем импорт моков
import { mapAppointments, mapAppointment } from './mapper'
import type { Appointment, AppointmentRaw } from './types'
import { apiGet, apiPost, apiDelete } from '../../shared/api/client';

export async function getAppointments(): Promise<Appointment[]> {
  const raw = await apiGet<AppointmentRaw[]>('/appointments');
  return mapAppointments(raw)
}

export async function createAppointment(payload: Omit<Appointment, 'id'>): Promise<Appointment> {
  const raw = await apiPost<AppointmentRaw>('/appointments', payload);
  return mapAppointment(raw)
}

export async function removeAppointment(id: string) { // Убрали useMock
  return apiDelete(`/appointments/${id}`); // Заменяем на реальный вызов
}