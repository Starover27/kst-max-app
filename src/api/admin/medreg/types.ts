// Тип для настроек подключения MedReg
export interface MedRegConfig {
  apiUrl: string;
  apiToken: string;
}

// Тип для состояния подключения MedReg
export interface MedRegConnectionStatus {
  isConnected: boolean;
  lastSync?: string; // ISO string
  lastError?: string;
  // Можно добавить другие поля состояния
}

// Тип для ответа на проверку соединения
export interface CheckConnectionResponse {
  success: boolean;
  message: string;
  status: MedRegConnectionStatus;
}

// Тип для ответа на сохранение настроек
export interface SaveConfigResponse {
  success: boolean;
  message: string;
}

// Тип для ответа на синхронизацию
export interface SyncResponse {
  success: boolean;
  message: string;
  status: MedRegConnectionStatus;
}