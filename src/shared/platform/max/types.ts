// Platform-agnostic types for MAX Mini Apps integration

export interface User {
  id: string
  name?: string
  avatarUrl?: string
  phone?: string
  email?: string
  [key: string]: unknown
}

export type Theme = 'light' | 'dark' | 'system'

export interface Viewport {
  width: number
  height: number
  scale?: number
}

export interface BackButton {
  onPress(handler: () => void): () => void
  enable(): void
  disable(): void
}

export interface MainButton {
  setText(text: string): void
  show(): void
  hide(): void
  onPress(handler: () => void): () => void
}

export interface CloudStorage {
  get<T = unknown>(key: string): Promise<T | null>
  set<T = unknown>(key: string, value: T): Promise<void>
  remove(key: string): Promise<void>
  list(prefix?: string): Promise<string[]>
}

export interface HapticFeedback {
  light(): void
  medium(): void
  heavy(): void
}

export interface MaxPlatformAdapter {
  getUser(): Promise<User | null>
  setTheme(theme: Theme): Promise<void>
  getViewport(): Promise<Viewport>
  backButton: BackButton
  mainButton: MainButton
  storage: CloudStorage
  haptics: HapticFeedback
}

// Note: do not export a default value here — this file only contains types
