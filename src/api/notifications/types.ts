export interface NotificationRaw {
  id: string
  title: string
  body?: string
  date: string
  read?: boolean
}

export interface Notification {
  id: string
  title: string
  body?: string
  date: string
  read: boolean
}
