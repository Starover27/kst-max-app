import type {
  MaxPlatformAdapter,
  User,
  Theme,
  Viewport,
  BackButton,
  MainButton,
  CloudStorage,
  HapticFeedback,
} from './types'

// No-op / safe defaults implementation. These adapters let the app run
// without the real MAX SDK. When SDK is available, call `setAdapter()`.

class NoopBackButton implements BackButton {
  onPress(_: () => void) {
    // return unsubscribe
    return () => {}
  }
  enable() {}
  disable() {}
}

class NoopMainButton implements MainButton {
  onPress(_: () => void) {
    return () => {}
  }
  setText(_: string) {}
  show() {}
  hide() {}
}

class NoopCloudStorage implements CloudStorage {
  private store = new Map<string, unknown>()
  async get<T = unknown>(key: string) {
    return (this.store.has(key) ? (this.store.get(key) as T) : null)
  }
  async set<T = unknown>(key: string, value: T) {
    this.store.set(key, value)
  }
  async remove(key: string) {
    this.store.delete(key)
  }
  async list(prefix = '') {
    const keys: string[] = []
    for (const k of this.store.keys()) if (k.startsWith(prefix)) keys.push(k)
    return keys
  }
}

class NoopHaptics implements HapticFeedback {
  light() {}
  medium() {}
  heavy() {}
}

class NoopAdapter implements MaxPlatformAdapter {
  backButton: BackButton = new NoopBackButton()
  mainButton: MainButton = new NoopMainButton()
  storage: CloudStorage = new NoopCloudStorage()
  haptics: HapticFeedback = new NoopHaptics()

  async getUser(): Promise<User | null> {
    return null
  }
  async setTheme(_: Theme) {
    return
  }
  async getViewport(): Promise<Viewport> {
    return { width: 1024, height: 768, scale: 1 }
  }
}

let adapter: MaxPlatformAdapter = new NoopAdapter()

export function setAdapter(a: MaxPlatformAdapter) {
  adapter = a
}

export function getAdapter() {
  return adapter
}

export const defaultAdapter = adapter

export { NoopAdapter, NoopBackButton, NoopMainButton, NoopCloudStorage, NoopHaptics }
