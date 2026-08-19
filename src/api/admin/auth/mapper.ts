import type { AdminAuthResponse } from './types';

// Пока маппер простой, так как структура ответа уже соответствует типу.
// В будущем может понадобиться трансформация, если API MedReg возвращает другой формат.
export function mapAdminAuthResponse(raw: AdminAuthResponse): AdminAuthResponse {
  return {
    user: {
      id: raw.user.id,
      fullName: raw.user.fullName,
      email: raw.user.email,
    },
    tokens: {
      accessToken: raw.tokens.accessToken,
      refreshToken: raw.tokens.refreshToken,
    },
  };
}