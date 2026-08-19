import type { Credentials, AuthResponse } from './types'
import * as mock from './mock'
import { useAppStore } from '../../stores/appStore'
import { apiPost } from '../../shared/api/client'

/**
 * Вспомогательный метод для стандартизации обработки состояний загрузки, ошибок и store
 */
export async function executeAuthFlow<T>(
  action: () => Promise<T>,
  onSuccess: (data: T) => void,
  errorMessageFallback = 'Operation failed',
): Promise<T> {
  useAppStore.getState().setIsLoading(true)
  useAppStore.getState().setError(null)

  try {
    const result = await action()
    onSuccess(result)
    return result
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : errorMessageFallback
    useAppStore.getState().setError(message)
    throw error
  } finally {
    useAppStore.getState().setIsLoading(false)
  }
}

/**
 * Попытка реального API-вызова с fallback на мок.
 * Когда бэкенд будет готов — удалить fallback.
 */
export async function login(creds: Credentials): Promise<AuthResponse> {
  return executeAuthFlow(
    async () => {
      try {
        return await apiPost<AuthResponse>('/auth/login', creds)
      } catch {
        // API недоступен — используем мок
        console.warn('[auth] API unavailable, falling back to mock')
        return await mock.loginMock(creds)
      }
    },
    (authData) => {
      useAppStore.getState().loginSuccess(
        { id: authData.user.id, fullName: authData.user.name, email: authData.user.email, avatarUrl: authData.user.avatarUrl },
        authData.tokens,
      )
    },
    'Login failed',
  )
}

export async function logout(): Promise<void> {
  useAppStore.getState().logout()

  try {
    await apiPost('/auth/logout')
  } catch {
    // Ошибку logout API игнорируем — локальное состояние уже очищено
  }
}
