// import * as mock from './mock' // Удаляем импорт моков
import type { NotificationRaw } from './types'
import { mapNotifications } from './mapper'
import { apiGet, apiPut } from '../../shared/api/client';

export async function getNotifications() {
  const raw = await apiGet<NotificationRaw[]>('/notifications');
  return mapNotifications(raw)
}

export async function markAsRead(id: string) { // Убрали useMock
  return apiPut(`/notifications/${id}/read`); // Заменяем на реальный вызов
}