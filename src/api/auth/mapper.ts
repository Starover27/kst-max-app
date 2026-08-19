import type { AuthResponse, UserDto } from './types'

export function mapAuthResponse(resp: AuthResponse) {
  return {
    id: resp.user.id,
    name: resp.user.name,
    email: resp.user.email,
    avatarUrl: resp.user.avatarUrl,
    tokens: resp.tokens,
  }
}

export function mapUser(dto: UserDto) {
  return {
    id: dto.id,
    name: dto.name,
    email: dto.email,
    avatarUrl: dto.avatarUrl,
  }
}
