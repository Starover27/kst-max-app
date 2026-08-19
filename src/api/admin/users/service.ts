import type { GetUsersRequestParams, GetUsersResponse } from './types';
import { getUsersMock } from './mock';
import { mapGetUsersResponse } from './mapper';

// Используем мок для получения пользователей. Это dev/mock abstraction.
// В будущем будет заменено на реальный вызов API MedReg.
export async function getUsers(params: GetUsersRequestParams = {}): Promise<GetUsersResponse> {
  // Выполняем мок-запрос
  const rawResponse = await getUsersMock(params);
  // Маппим ответ
  const response: GetUsersResponse = mapGetUsersResponse(rawResponse);

  return response;
}