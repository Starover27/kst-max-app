// Типы для аутентификации администратора

export interface AdminCredentials {
  login: string;
  password: string;
}

export interface AdminAuthResponse {
  user: {
    id: string;
    fullName: string;
    email: string;
    // isAdmin: boolean; // Мы можем добавить это, если бэкенд будет возвращать роль
  };
  tokens: {
    accessToken: string;
    refreshToken?: string;
  };
}