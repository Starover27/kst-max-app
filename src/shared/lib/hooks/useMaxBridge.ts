import { useEffect, useState } from 'react';
import { 
  isMaxBridgeAvailable, 
  getMaxUser, 
  getMaxTheme,
  initMaxBridge,
  type MaxUser,
  type MaxTheme
} from '../../platform';

interface UseMaxBridgeResult {
  isAvailable: boolean;
  user: MaxUser | null;
  theme: MaxTheme | null;
  isLoading: boolean;
  error: Error | null;
}

/**
 * Хук для работы с MAX Bridge
 * Автоматически инициализирует bridge и получает информацию о пользователе
 */
export function useMaxBridge(): UseMaxBridgeResult {
  const [state, setState] = useState<UseMaxBridgeResult>({
    isAvailable: isMaxBridgeAvailable(),
    user: null,
    theme: null,
    isLoading: true,
    error: null,
  });

  useEffect(() => {
    let mounted = true;

    async function initialize() {
      try {
        // Инициализация bridge
        initMaxBridge();

        const isAvailable = isMaxBridgeAvailable();
        
        if (!isAvailable) {
          if (mounted) {
            setState(prev => ({ ...prev, isLoading: false }));
          }
          return;
        }

        // Получение информации о пользователе и теме параллельно
        const [user, theme] = await Promise.all([
          getMaxUser(),
          getMaxTheme(),
        ]);

        if (mounted) {
          setState({
            isAvailable: true,
            user,
            theme,
            isLoading: false,
            error: null,
          });
        }
      } catch (error) {
        if (mounted) {
          setState(prev => ({
            ...prev,
            isLoading: false,
            error: error instanceof Error ? error : new Error('Failed to initialize MAX Bridge'),
          }));
        }
      }
    }

    initialize();

    return () => {
      mounted = false;
    };
  }, []);

  return state;
}
