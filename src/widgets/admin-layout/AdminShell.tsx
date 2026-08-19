import { NavLink, Outlet } from 'react-router-dom';
import { routes } from '../../shared/config/routes';
import { adminLogout } from '../../api/admin/auth/service'; // Импортируем adminLogout
import { useAppStore } from '../../stores/appStore'; // Импортируем store для проверки состояния (опционально для обработчика)

// Пример структуры для админ-панели. Пока без реальной логики.
const adminNavItems = [
  { label: 'Dashboard', to: routes.admin.dashboard },
  { label: 'Пользователи', to: routes.admin.users },
  { label: 'Врачи', to: routes.admin.doctors },
  { label: 'Записи', to: routes.admin.appointments },
  { label: 'Анализы', to: routes.admin.analyses },
  { label: 'MedReg', to: routes.admin.medreg },
  { label: 'Настройки', to: routes.admin.settings },
];

export function AdminShell() {
  const isLoading = useAppStore(state => state.isLoading); // Получаем состояние загрузки

  const handleLogout = async () => {
    try {
      await adminLogout(); // Вызываем adminLogout
      // После выхода, пользователь будет перенаправлен из-за AdminProtectedRoute
    } catch (e) {
      console.error("Admin logout failed:", e);
      // Здесь можно добавить уведомление об ошибке
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', background: 'var(--color-bg)', color: 'var(--color-text)', fontFamily: 'var(--font-family-base)', fontSize: 'var(--font-size-base)', lineHeight: 'var(--line-height-base)' }}>
      <aside style={{ width: 250, background: 'var(--color-surface)', borderRight: '1px solid var(--color-border)', padding: '1rem', display: 'flex', flexDirection: 'column' }}>
        <h2 style={{ margin: '0 0 1.5rem 0', fontSize: 'var(--font-size-h2)', fontWeight: 700, lineHeight: 'var(--line-height-heading)' }}>Admin Panel</h2>
        <nav style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          {adminNavItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              style={({ isActive }) => ({
                padding: '0.75rem 1rem',
                textDecoration: 'none',
                borderRadius: 'var(--radius-button)',
                color: isActive ? 'var(--color-accent)' : 'var(--color-text)',
                background: isActive ? 'color-mix(in srgb, var(--color-accent), transparent 90%)' : 'transparent',
                fontWeight: isActive ? 600 : 400,
                fontSize: 'var(--font-size-base)', // Применяем базовый размер шрифта к пунктам навигации
                lineHeight: 'var(--line-height-base)', // Применяем line-height к пунктам навигации
              })}
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
        <div style={{ marginTop: 'auto' }}>
          <button
            style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius-button)', background: 'var(--color-surface)', border: '1px solid var(--color-border)', color: 'var(--color-accent)', fontWeight: 700, fontSize: 'var(--font-size-base)', lineHeight: 'var(--line-height-base)' }}
            onClick={handleLogout}
            disabled={isLoading} // Отключаем кнопку во время загрузки
          >
            {isLoading ? 'Logging out...' : 'Выйти'}
          </button>
        </div>
      </aside>

      <main style={{ flex: 1, padding: '1.5rem', overflow: 'auto', fontFamily: 'var(--font-family-base)', fontSize: 'var(--font-size-base)', lineHeight: 'var(--line-height-base)' }}>
        <Outlet />
      </main>
    </div>
  );
}