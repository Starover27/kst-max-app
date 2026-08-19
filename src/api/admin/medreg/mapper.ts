import type { MedRegConnectionStatus, CheckConnectionResponse, SaveConfigResponse, SyncResponse } from './types';

// Пока мапперы простые, так как структура ответа mock уже соответствует типу.
// В будущем может понадобиться трансформация, если API MedReg возвращает другой формат.
export function mapCheckConnectionResponse(raw: CheckConnectionResponse): CheckConnectionResponse {
  return {
    success: raw.success,
    message: raw.message,
    status: raw.status,
  };
}

export function mapSaveConfigResponse(raw: SaveConfigResponse): SaveConfigResponse {
  return {
    success: raw.success,
    message: raw.message,
  };
}

export function mapSyncResponse(raw: SyncResponse): SyncResponse {
  return {
    success: raw.success,
    message: raw.message,
    status: raw.status,
  };
}

export function mapConnectionStatus(raw: MedRegConnectionStatus): MedRegConnectionStatus {
  return {
    isConnected: raw.isConnected,
    lastSync: raw.lastSync,
    lastError: raw.lastError,
  };
}