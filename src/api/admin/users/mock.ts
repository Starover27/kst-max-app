import type { AdminUser, GetUsersRequestParams, GetUsersResponse } from './types';

// Моковые данные пользователей
const mockAdminUsers: AdminUser[] = [
  {
    id: 'user-1',
    fullName: 'Иванов Иван Иванович',
    phone: '+7 (999) 123-45-67',
    email: 'ivanov@example.com',
    maxId: 'max-user-1',
    registrationDate: '2023-01-15T10:30:00Z',
    lastActivity: '2023-10-26T15:45:00Z',
    status: 'active',
  },
  {
    id: 'user-2',
    fullName: 'Петрова Мария Сидоровна',
    phone: '+7 (987) 654-32-10',
    email: 'petrova@example.com',
    maxId: 'max-user-2',
    registrationDate: '2023-02-20T14:22:00Z',
    lastActivity: '2023-10-25T09:15:00Z',
    status: 'inactive',
  },
  {
    id: 'user-3',
    fullName: 'Сидоров Петр Васильевич',
    phone: '+7 (976) 543-21-09',
    email: 'sidorov@example.com',
    maxId: 'max-user-3',
    registrationDate: '2023-03-10T18:05:00Z',
    lastActivity: '2023-10-20T11:30:00Z',
    status: 'suspended',
  },
  {
    id: 'user-4',
    fullName: 'Козлова Анна Сергеевна',
    phone: '+7 (965) 432-10-98',
    email: 'kozlова@example.com',
    maxId: 'max-user-4',
    registrationDate: '2023-04-05T12:40:00Z',
    lastActivity: '2023-10-26T17:00:00Z',
    status: 'active',
  },
  {
    id: 'user-5',
    fullName: 'Волков Дмитрий Николаевич',
    phone: '+7 (954) 321-09-87',
    email: 'volkov@example.com',
    maxId: 'max-user-5',
    registrationDate: '2023-05-12T08:15:00Z',
    lastActivity: '2023-10-24T13:20:00Z',
    status: 'active',
  },
];

// Мок-функция для получения списка пользователей
export async function getUsersMock(params: GetUsersRequestParams = {}): Promise<GetUsersResponse> {
  // Имитация задержки API
  await new Promise(resolve => setTimeout(resolve, 800));

  let filteredUsers = [...mockAdminUsers];

  if (params.search) { // Проверка на undefined для params.search
    const searchTerm = params.search.toLowerCase();
    filteredUsers = filteredUsers.filter(user =>
      (user.fullName && user.fullName.toLowerCase().includes(searchTerm)) ||
      (user.phone && params.search && user.phone.includes(params.search)) || // Проверка на undefined для phone и params.search
      (user.email && user.email.toLowerCase().includes(searchTerm))
    );
  }

  if (params.status) {
    filteredUsers = filteredUsers.filter(user => user.status === params.status);
  }

  return {
    users: filteredUsers,
    total: filteredUsers.length,
  };
}