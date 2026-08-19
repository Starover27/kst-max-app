import type { MedRegConfig, CheckConnectionResponse, SaveConfigResponse, SyncResponse } from './types';
import { getMedRegConfigMock, saveMedRegConfigMock, checkMedRegConnectionMock, syncMedRegMock } from './mock';
import { mapCheckConnectionResponse, mapSaveConfigResponse, mapSyncResponse } from './mapper';

// Используем мок для получения конфигурации. Это dev/mock abstraction.
// В будущем будет заменено на реальный вызов API MedReg.
export async function getMedRegConfig(): Promise<MedRegConfig> {
  // Выполняем мок-запрос
  const config = await getMedRegConfigMock();
  return config;
}

// Используем мок для сохранения конфигурации.
// В будущем будет заменено на реальный вызов API MedReg.
export async function saveMedRegConfig(config: MedRegConfig): Promise<SaveConfigResponse> {
  // Выполняем мок-запрос
  const rawResponse = await saveMedRegConfigMock(config);
  // Маппим ответ
  const response: SaveConfigResponse = mapSaveConfigResponse(rawResponse);

  return response;
}

// Используем мок для проверки соединения.
// В будущем будет заменено на реальный вызов API MedReg.
export async function checkMedRegConnection(): Promise<CheckConnectionResponse> {
  // Выполняем мок-запрос
  const rawResponse = await checkMedRegConnectionMock();
  // Маппим ответ
  const response: CheckConnectionResponse = mapCheckConnectionResponse(rawResponse);

  return response;
}

// Используем мок для синхронизации.
// В будущем будет заменено на реальный вызов API MedReg.
export async function syncMedReg(): Promise<SyncResponse> {
  // Выполняем мок-запрос
  const rawResponse = await syncMedRegMock();
  // Маппим ответ
  const response: SyncResponse = mapSyncResponse(rawResponse);

  return response;
}