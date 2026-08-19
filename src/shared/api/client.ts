import { API_CONFIG } from '../config/api';
import { useAppStore } from '../../stores/appStore';

async function request<T>(url: string, options: RequestInit = {}): Promise<T> {
  const fullUrl = `${API_CONFIG.BASE_URL}${url}`;
  const tokens = useAppStore.getState().tokens;
  const authHeaders: Record<string, string> = {};

  if (tokens?.accessToken) {
    authHeaders['Authorization'] = `Bearer ${tokens.accessToken}`;
  }

  const defaultHeaders: Record<string, string> = {
    'Content-Type': 'application/json',
    ...authHeaders,
  };
  const headers = { ...defaultHeaders, ...options.headers };

  const response = await fetch(fullUrl, { ...options, headers });

  if (!response.ok) {
    let errorMessage = `Request failed: ${response.status} ${response.statusText}`;
    try {
      const errorData = await response.json();
      if (errorData && typeof errorData === 'object' && 'message' in errorData) {
        errorMessage = String((errorData as { message: unknown }).message);
      }
    } catch {
      // Игнорируем ошибку парсинга тела ответа с ошибкой
    }
    throw new Error(errorMessage);
  }

  // Для методов, не возвращающих тело (например, DELETE), не вызываем .json()
  if (response.status === 204 || response.headers.get('Content-Length') === '0') {
    return undefined as T;
  }

  const contentType = response.headers.get('Content-Type');
  if (contentType && contentType.includes('application/json')) {
    return response.json() as Promise<T>;
  }

  const text = await response.text();
  try {
    return (text ? JSON.parse(text) : undefined) as T;
  } catch {
    return text as unknown as T;
  }
}

// Явно указываем, что apiGet возвращает Promise<T>
export async function apiGet<T>(url: string): Promise<T> {
  return request<T>(url, { method: 'GET' });
}

export async function apiPost<T>(url: string, data?: unknown): Promise<T> {
  return request<T>(url, {
    method: 'POST',
    body: data ? JSON.stringify(data) : undefined,
  });
}

export async function apiPut<T>(url: string, data?: unknown): Promise<T> {
  return request<T>(url, {
    method: 'PUT',
    body: data ? JSON.stringify(data) : undefined,
  });
}

export async function apiDelete<T>(url: string): Promise<T> {
  return request<T>(url, { method: 'DELETE' });
}