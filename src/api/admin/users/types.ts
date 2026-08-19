import type { User } from '../../../entities/User';

// Тип для пользователя в админ-панели, расширяющий базовый User
export interface AdminUser extends User {
  maxId?: string; // ID пользователя в MAX
  registrationDate: string; // Дата регистрации (ISO string)
  lastActivity: string; // Последняя активность (ISO string)
  status: 'active' | 'inactive' | 'suspended'; // Статус пользователя
}

// Тип для ответа API при получении списка пользователей
export interface GetUsersResponse {
  users: AdminUser[];
  total: number;
}

// Тип для параметров запроса (поиск, фильтрация)
export interface GetUsersRequestParams {
  search?: string;
  status?: AdminUser['status'];
  // Можно добавить пагинацию, сортировку и т.д.
}