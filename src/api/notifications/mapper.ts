import type { NotificationRaw } from './types'
import type { Notification as EntityNotification } from '../../entities/Notification'

export function mapNotification(raw: NotificationRaw): EntityNotification {
  return { id: raw.id, title: raw.title, body: raw.body, date: raw.date, read: !!raw.read }
}

export function mapNotifications(list: NotificationRaw[]): EntityNotification[] {
  return list.map(mapNotification)
}
