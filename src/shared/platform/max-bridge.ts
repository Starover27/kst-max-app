/**
 * MAX Bridge Integration
 * Официальный MAX Mini Apps Bridge
 */

export interface MaxUser {
  id: string;
  username?: string;
  first_name?: string;
  last_name?: string;
  phone?: string;
  email?: string;
  avatar_url?: string;
}

export interface MaxTheme {
  colorScheme: 'light' | 'dark';
  backgroundColor?: string;
  textColor?: string;
  accentColor?: string;
}

interface MaxWebApp {
  initData: string;
  initDataUnsafe?: {
    user?: {
      id: number;
      first_name?: string;
      last_name?: string;
      username?: string;
      photo_url?: string;
    };
  };

  platform?: string;
  version?: string;
  deviceName?: string;

  openLink(url: string): void;
  openMaxLink?(url: string): void;

  shareContent?(params: { text?: string; link?: string }): void;
  shareMaxContent?(params: { text?: string; link?: string }): void;

  requestContact?(): Promise<{
    phone: string;
    authDate: string;
    hash: string;
  }>;

  close(): void;

  enableClosingConfirmation?(): void;
  disableClosingConfirmation?(): void;
}

declare global {
  interface Window {
    WebApp?: MaxWebApp;
  }
}

/**
 * Проверка доступности MAX WebApp
 */
export function isMaxBridgeAvailable(): boolean {
  return typeof window !== 'undefined' && !!window.WebApp;
}

/**
 * Получение MAX WebApp
 */
export function getMaxBridge(): MaxWebApp | null {
  if (typeof window !== 'undefined' && window.WebApp) {
    return window.WebApp;
  }

  return null;
}

/**
 * Инициализация MAX Bridge
 *
 * MAX WebApp создаётся автоматически после подключения SDK.
 * Отдельный ready() вызывать не требуется.
 */
export function initMaxBridge(): void {
  const webApp = getMaxBridge();

  if (webApp) {
    console.log('[MAX Bridge] Initialized successfully');
    console.log('[MAX Bridge] Platform:', webApp.platform);
    console.log('[MAX Bridge] Version:', webApp.version);
  } else {
    console.log('[MAX Bridge] Not available, running in browser mode');
  }
}

/**
 * Запрос номера телефона через контактный API MAX
 */
export async function requestMaxContactOrPhone(): Promise<{ phone?: string; name?: string } | null> {
  const webApp = getMaxBridge();

  // 1. Проверяем уже имеющиеся данные в объекте
  const user = await getMaxUser();
  if (user?.phone) {
    return { phone: user.phone, name: [user.first_name, user.last_name].filter(Boolean).join(' ') || user.username };
  }

  // 2. Если доступен интерактивный запрос контакта через WebApp.requestContact
  if (webApp && typeof (webApp as unknown as { requestContact?: unknown }).requestContact === 'function') {
    try {
      const contactPromise = new Promise<{ phone?: string; name?: string }>((resolve) => {
        const fn = (webApp as unknown as { requestContact: (cb: (status: boolean, res?: { phone_number?: string; phone?: string; first_name?: string; last_name?: string }) => void) => unknown }).requestContact;

        const maybePromise = fn.call(webApp, (granted, res) => {
          if (granted && res) {
            const phone = res.phone_number || res.phone;
            const name = [res.first_name, res.last_name].filter(Boolean).join(' ');
            resolve({ phone, name });
          } else {
            resolve({});
          }
        });

        if (maybePromise && typeof (maybePromise as Promise<unknown>).then === 'function') {
          (maybePromise as Promise<{ phone_number?: string; phone?: string; first_name?: string; last_name?: string }>).then((res) => {
            if (res) {
              const phone = res.phone_number || res.phone;
              const name = [res.first_name, res.last_name].filter(Boolean).join(' ');
              resolve({ phone, name });
            }
          }).catch(() => resolve({}));
        }
      });

      const result = await contactPromise;
      if (result.phone) return result;
    } catch (err) {
      console.warn('[MAX Bridge] requestContact failed:', err);
    }
  }

  // 3. Fallback: параметры URL
  if (typeof window !== 'undefined') {
    const params = new URLSearchParams(window.location.search || window.location.hash.replace(/^#/, ''));
    const phone = params.get('phone') || params.get('max_phone');
    const name = params.get('name') || params.get('max_name');
    if (phone || name) {
      return { phone: phone || undefined, name: name || undefined };
    }
  }

  return user ? { phone: user.phone, name: [user.first_name, user.last_name].filter(Boolean).join(' ') || user.username } : null;
}
export async function getMaxUser(): Promise<MaxUser | null> {
  const webApp = getMaxBridge();

  // 1. Прямой доступ из initDataUnsafe.user
  if (webApp?.initDataUnsafe?.user) {
    const user = webApp.initDataUnsafe.user;
    const phone = (user as unknown as { phone?: string }).phone ||
                  (webApp.initDataUnsafe as unknown as { contact?: { phone_number?: string } })?.contact?.phone_number;
    return {
      id: String(user.id),
      username: user.username,
      first_name: user.first_name,
      last_name: user.last_name,
      phone: phone,
      avatar_url: user.photo_url,
    };
  }

  // 2. Парсинг initData (если initDataUnsafe не заполнено)
  if (webApp?.initData) {
    try {
      const params = new URLSearchParams(webApp.initData);
      const userRaw = params.get('user');
      if (userRaw) {
        const u = JSON.parse(decodeURIComponent(userRaw));
        return {
          id: String(u.id),
          username: u.username,
          first_name: u.first_name,
          last_name: u.last_name,
          phone: u.phone,
          avatar_url: u.photo_url,
        };
      }
    } catch {
      // ignore
    }
  }

  // 3. Проверка параметров запуска URL (при открытии во фрейме/браузере)
  if (typeof window !== 'undefined') {
    try {
      const searchParams = new URLSearchParams(window.location.search || window.location.hash.replace(/^#/, ''));
      const maxUserParam = searchParams.get('max_user') || searchParams.get('user');
      if (maxUserParam) {
        const u = JSON.parse(decodeURIComponent(maxUserParam));
        return {
          id: String(u.id || 'max-user'),
          username: u.username,
          first_name: u.first_name,
          last_name: u.last_name,
          phone: u.phone,
          avatar_url: u.photo_url,
        };
      }
      const maxPhone = searchParams.get('phone') || searchParams.get('max_phone');
      const maxName = searchParams.get('name') || searchParams.get('max_name');
      if (maxPhone || maxName) {
        return {
          id: 'max-user',
          first_name: maxName || 'Пользователь MAX',
          phone: maxPhone || undefined,
        };
      }
    } catch {
      // ignore
    }
  }

  return null;
}

/**
 * Получение темы MAX
 *
 * MAX Bridge не требует отдельного getTheme().
 * Пока используем тему интерфейса браузера/MAX.
 */
export async function getMaxTheme(): Promise<MaxTheme | null> {
  if (typeof window === 'undefined') {
    return null;
  }

  const colorScheme =
    window.matchMedia?.('(prefers-color-scheme: dark)').matches
      ? 'dark'
      : 'light';

  return {
    colorScheme,
  };
}

/**
 * Закрытие Mini App
 */
export function closeMaxApp(): void {
  const webApp = getMaxBridge();

  if (webApp) {
    webApp.close();
  }
}

/**
 * Открытие внешней ссылки
 */
export function openExternalLink(url: string): void {
  const webApp = getMaxBridge();

  if (webApp) {
    webApp.openLink(url);
  } else {
    window.open(url, '_blank', 'noopener,noreferrer');
  }
}

/**
 * Поделиться ссылкой
 */
export function shareLink(url: string, text?: string): void {
  const webApp = getMaxBridge();

  if (webApp?.shareContent) {
    webApp.shareContent({
      link: url,
      text,
    });

    return;
  }

  if (typeof navigator !== 'undefined' && navigator.share) {
    navigator.share({
      url,
      text,
    }).catch(() => {});
  }
}

/**
 * Показать сообщение
 */
export function showAlert(message: string): void {
  // MAX WebApp не требует отдельного alert API.
  // Используем стандартный alert.
  alert(message);
}