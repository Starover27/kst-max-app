import type { GetUsersResponse } from './types';

// Пока маппер простой, так как структура ответа mock уже соответствует типу.
// В будущем может понадобиться трансформация, если API MedReg возвращает другой формат.
export function mapGetUsersResponse(raw: GetUsersResponse): GetUsersResponse {
  return {
    users: raw.users,
    total: raw.total,
  };
}