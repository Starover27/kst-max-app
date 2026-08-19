import type { AdminCredentials, AdminAuthResponse } from './types';
import { adminLoginMock, adminLogoutMock } from './mock';
import { mapAdminAuthResponse } from './mapper';
import { useAppStore } from '../../../stores/appStore'; // Импортируем store

// Используем мок для аутентификации администратора. Это dev/mock abstraction.
// В будущем будет заменено на реальный вызов API MedReg.
export async function adminLogin(credentials: AdminCredentials): Promise<AdminAuthResponse> {
  useAppStore.getState().setIsLoading(true);
  useAppStore.getState().setError(null);

  try {
    // Выполняем мок-аутентификацию
    const rawResponse = await adminLoginMock(credentials);
    // Маппим ответ
    const authData: AdminAuthResponse = mapAdminAuthResponse(rawResponse);

    // Обновляем store, устанавливаем статус администратора
    useAppStore.getState().adminLoginSuccess(
      { id: authData.user.id, fullName: authData.user.fullName, email: authData.user.email },
      authData.tokens
    );

    return authData;
  } catch (error: unknown) {
    console.error("Admin login failed:", error);
    useAppStore.getState().setError(error instanceof Error ? error.message : 'Admin login failed');
    throw error; // Пробрасываем ошибку наверх
  } finally {
    useAppStore.getState().setIsLoading(false);
  }
}

// Используем мок для выхода администратора.
export async function adminLogout(): Promise<void> {
  try {
    await adminLogoutMock();
    // Обновляем store, сбрасываем статус администратора
    useAppStore.getState().adminLogout();
  } catch (e) {
    console.error("Admin logout failed:", e);
    // Не устанавливаем глобальную ошибку для logout, так как пользователь всё равно будет разлогинен.
    // Но можно показать уведомление.
  }
}