import type { MedRegConfig, MedRegConnectionStatus, CheckConnectionResponse, SaveConfigResponse, SyncResponse } from './types';

// Моковое состояние конфигурации MedReg
let mockMedRegConfig: MedRegConfig = {
  apiUrl: 'https://medreg-test-api.example.com',
  apiToken: '••••••••••••••••', // Маскированный токен
};

// Моковое состояние статуса подключения
let mockConnectionStatus: MedRegConnectionStatus = {
  isConnected: true,
  lastSync: '2023-10-26T12:00:00Z',
  lastError: undefined,
};

// Мок-функция для получения конфигурации
export async function getMedRegConfigMock(): Promise<MedRegConfig> {
  await new Promise(resolve => setTimeout(resolve, 300)); // Имитация задержки
  return { ...mockMedRegConfig };
}

// Мок-функция для сохранения конфигурации
export async function saveMedRegConfigMock(config: MedRegConfig): Promise<SaveConfigResponse> {
  await new Promise(resolve => setTimeout(resolve, 500)); // Имитация задержки

  // В реальности тут будет логика валидации и сохранения
  mockMedRegConfig = { ...config };
  // При сохранении токена, мы его маскируем
  mockMedRegConfig.apiToken = '••••••••••••••••';

  return {
    success: true,
    message: 'Настройки MedReg успешно сохранены.',
  };
}

// Мок-функция для проверки соединения
export async function checkMedRegConnectionMock(): Promise<CheckConnectionResponse> {
  await new Promise(resolve => setTimeout(resolve, 600)); // Имитация задержки

  // В реальности тут будет вызов API для проверки
  const isConnected = Math.random() > 0.2; // 80% успеха в моке

  mockConnectionStatus = {
    isConnected,
    lastSync: isConnected ? new Date().toISOString() : mockConnectionStatus.lastSync,
    lastError: isConnected ? undefined : 'Ошибка подключения к MedReg API',
  };

  return {
    success: isConnected,
    message: isConnected ? 'Соединение установлено.' : 'Соединение не установлено.',
    status: { ...mockConnectionStatus },
  };
}

// Мок-функция для синхронизации
export async function syncMedRegMock(): Promise<SyncResponse> {
  await new Promise(resolve => setTimeout(resolve, 1000)); // Имитация задержки

  // В реальности тут будет вызов API для синхронизации
  const success = Math.random() > 0.1; // 90% успеха в моке

  if (success) {
    mockConnectionStatus = {
      isConnected: true,
      lastSync: new Date().toISOString(),
      lastError: undefined,
    };
  } else {
    mockConnectionStatus = {
      isConnected: true, // Предположим, соединение есть, но синхронизация фейлится
      lastSync: mockConnectionStatus.lastSync,
      lastError: 'Ошибка синхронизации данных',
    };
  }

  return {
    success,
    message: success ? 'Синхронизация прошла успешно.' : 'Синхронизация завершилась с ошибкой.',
    status: { ...mockConnectionStatus },
  };
}