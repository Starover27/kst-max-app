import type { AdminCredentials, AdminAuthResponse } from './types';

// Dev-учетные данные
const ADMIN_LOGIN = 'admin';
const ADMIN_PASSWORD = 'admin';

// Мок-ответ для успешной аутентификации администратора
export async function adminLoginMock(credentials: AdminCredentials): Promise<AdminAuthResponse> {
  if (credentials.login === ADMIN_LOGIN && credentials.password === ADMIN_PASSWORD) {
    // Имитация задержки API
    await new Promise(resolve => setTimeout(resolve, 500));

    return {
      user: {
        id: 'admin-1',
        fullName: 'Admin User',
        email: 'admin@example.com',
      },
      tokens: {
        accessToken: 'fake-admin-access-token',
        refreshToken: 'fake-admin-refresh-token',
      },
    };
  } else {
    // Имитация ошибки аутентификации
    await new Promise(resolve => setTimeout(resolve, 500));
    throw new Error('Invalid admin credentials');
  }
}

// Мок-функция для выхода администратора
export async function adminLogoutMock(): Promise<void> {
  // Имитация API вызова
  await new Promise(resolve => setTimeout(resolve, 300));
  // В реальности тут будет логика инвалидации токена на бэкенде
}