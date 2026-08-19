import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import type { User } from '../entities/User'; // Используем type-only импорт сущности User
import type { AuthTokens } from '../api/auth/types'; // Используем type-only импорт типа AuthTokens

interface AppStoreState {
  theme: 'light' | 'dark';
  user: User | null; // Добавляем состояние пользователя
  tokens: AuthTokens | null; // Добавляем состояние токенов
  isLoading: boolean; // Добавляем состояние загрузки
  error: string | null; // Добавляем состояние ошибки
  isAdmin: boolean; // Новое состояние для администратора
  isStaff: boolean; // Статус сотрудника (МИС Медрег)

  // Методы
  setTheme: (theme: 'light' | 'dark') => void;
  setUser: (user: User | null) => void;
  setTokens: (tokens: AuthTokens | null) => void;
  setIsLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
  setIsAdmin: (isAdmin: boolean) => void; // Новый метод для установки статуса администратора
  setIsStaff: (isStaff: boolean) => void; // Метод переключения статуса сотрудника
  loginSuccess: (user: User, tokens: AuthTokens) => void;
  logout: () => void;
  adminLoginSuccess: (user: User, tokens: AuthTokens) => void; // Новый метод для успешного входа администратора
  adminLogout: () => void; // Новый метод для выхода администратора
}

export const useAppStore = create<AppStoreState>()(
  persist(
    (set) => ({
      theme: 'light',
      user: null,
      tokens: null,
      isLoading: false,
      error: null,
      isAdmin: false, // По умолчанию не админ
      isStaff: false, // По умолчанию пациент

      setTheme: (theme) => set({ theme }),
      setUser: (user) => set({ user, isStaff: user?.isStaff ?? false }),
      setTokens: (tokens) => set({ tokens }),
      setIsLoading: (isLoading) => set({ isLoading }),
      setError: (error) => set({ error }),
      setIsAdmin: (isAdmin) => set({ isAdmin }), // Устанавливаем статус администратора
      setIsStaff: (isStaff) => set((state) => ({
        isStaff,
        user: state.user ? { ...state.user, isStaff } : null,
      })),
      loginSuccess: (user, tokens) => set({ user, tokens, error: null, isAdmin: false, isStaff: user.isStaff ?? false }),
      logout: () => set({ user: null, tokens: null, error: null, isAdmin: false, isStaff: false }),
      adminLoginSuccess: (user, tokens) => set({ user, tokens, error: null, isAdmin: true, isStaff: true }),
      adminLogout: () => set({ user: null, tokens: null, error: null, isAdmin: false, isStaff: false }),
    }),
    {
      name: 'mc_app_store',
      partialize: (state) => ({
        theme: state.theme,
        user: state.user,
        tokens: state.tokens,
        isAdmin: state.isAdmin,
        isStaff: state.isStaff,
      }),
      storage: createJSONStorage(() => localStorage),
    }
  )
);