// import * as mock from './mock' // Удаляем импорт моков
import type { LabResultRaw } from './types'
import { mapResults, mapResult } from './mapper'
import { apiGet } from '../../shared/api/client';

export async function getResults() {
  const raw = await apiGet<LabResultRaw[]>('/analysis');
  return mapResults(raw)
}

export async function getResult(id: string) {
  try {
    const raw = await apiGet<LabResultRaw | null>(`/analysis/${id}`);
    return raw ? mapResult(raw) : null;
  } catch (e) {
    console.error("Failed to fetch analysis result:", e);
    return null;
  }
}
