import type { Credentials, AuthResponse } from './types'

const delay = (ms = 250) => new Promise((r) => setTimeout(r, ms))

export async function loginMock(_creds: Credentials): Promise<AuthResponse> {
  await delay(300)
  return {
    user: { id: 'user-1', name: 'Денис Петров', email: 'denis@example.com', avatarUrl: '' },
    tokens: { accessToken: 'mock-token', refreshToken: 'mock-refresh', expiresIn: 3600 },
  }
}

export async function logoutMock(): Promise<void> {
  await delay(120)
}
