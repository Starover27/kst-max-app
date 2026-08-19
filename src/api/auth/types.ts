export interface Credentials {
  username: string
  password: string
}

export interface AuthTokens {
  accessToken: string
  refreshToken?: string
  expiresIn?: number
}

export interface UserDto {
  id: string
  name?: string
  email?: string
  avatarUrl?: string
}

export interface AuthResponse {
  user: UserDto
  tokens: AuthTokens
}
