import { useState, useEffect, useMemo } from 'react';
import { getUsers } from '../../../api/admin/users/service'; // Импортируем сервис пользователей
import { useAppStore } from '../../../stores/appStore';
import Page from '../../../shared/ui/Page';

// Тип для пользователя админ-панели (дублирую здесь для примера, обычно импортируется)
interface AdminUser {
  id: string;
  fullName?: string;
  phone?: string;
  email?: string;
  maxId?: string;
  registrationDate: string; // ISO string
  lastActivity: string; // ISO string
  status: 'active' | 'inactive' | 'suspended';
}

export default function UsersPage() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const isLoadingGlobal = useAppStore(state => state.isLoading);
  const setErrorStore = useAppStore(state => state.setError);

  // Состояния для поиска и фильтрации
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<AdminUser['status'] | ''>('');

  // Состояния для сортировки
  const [sortBy, setSortBy] = useState<keyof AdminUser | null>(null);
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  // Параметры для запроса
  const requestParams = useMemo(() => ({
    search: searchTerm || undefined,
    status: statusFilter || undefined,
    sortBy: sortBy as string || undefined,
    sortOrder: sortOrder || undefined,
  }), [searchTerm, statusFilter, sortBy, sortOrder]);

  // Загружаем пользователей при изменении параметров
  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      setError('');
      setErrorStore(null);

      try {
        const response = await getUsers(requestParams);
        setUsers(response.users);
        setTotal(response.total);
      } catch (err: unknown) {
        console.error("Failed to fetch users:", err);
        setError(err instanceof Error ? err.message : 'Failed to fetch users');
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [requestParams, setErrorStore]);

  const handleSort = (field: keyof AdminUser) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('asc');
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ru-RU', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString('ru-RU');
  };

  const statusLabels: Record<AdminUser['status'], string> = {
    active: 'Активен',
    inactive: 'Неактивен',
    suspended: 'Заблокирован',
  };

  const statusColors: Record<AdminUser['status'], string> = {
    active: 'color-mix(in srgb, var(--color-success), transparent 80%)',
    inactive: 'color-mix(in srgb, var(--color-muted), transparent 80%)',
    suspended: 'color-mix(in srgb, var(--color-error), transparent 80%)',
  };

  return (
    <Page>
      <main style={{ padding: '0', maxWidth: '1200px', margin: '0 auto', width: '100%', fontFamily: 'var(--font-family-base)', fontSize: 'var(--font-size-base)', lineHeight: 'var(--line-height-base)' }}>
        <h1 style={{ padding: '0 1.5rem 1rem 1.5rem', margin: 0, borderBottom: '1px solid var(--color-border)', fontSize: 'var(--font-size-h1)', fontWeight: 700, lineHeight: 'var(--line-height-heading)' }}>Пользователи</h1>
        <section style={{ padding: '0 1.5rem 1.5rem 1.5rem' }}>
          <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <input
                type="text"
                placeholder="Поиск..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                disabled={isLoadingGlobal}
                style={{
                  padding: '0.5rem 1rem',
                  borderRadius: 'var(--radius-button)',
                  border: '1px solid var(--color-border)',
                  background: 'var(--color-surface)',
                  width: '300px',
                  fontSize: 'var(--font-size-base)',
                  lineHeight: 'var(--line-height-base)',
                }}
              />
            </div>
            <div>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as AdminUser['status'] || '')}
                disabled={isLoadingGlobal}
                style={{
                  padding: '0.5rem 1rem',
                  borderRadius: 'var(--radius-button)',
                  border: '1px solid var(--color-border)',
                  background: 'var(--color-surface)',
                  width: '200px',
                  fontSize: 'var(--font-size-base)',
                  lineHeight: 'var(--line-height-base)',
                }}
              >
                <option value="">Все статусы</option>
                <option value="active">Активен</option>
                <option value="inactive">Неактивен</option>
                <option value="suspended">Заблокирован</option>
              </select>
            </div>
          </div>

          {loading && <p style={{ fontSize: 'var(--font-size-secondary)', lineHeight: 'var(--line-height-base)' }}>Загрузка...</p>}
          {error && <p style={{ color: 'red', fontSize: 'var(--font-size-secondary)', lineHeight: 'var(--line-height-base)' }}>{error}</p>}
          {!loading && !error && (
            <div style={{ overflowX: 'auto' }}>
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: '2fr 1fr 1fr 1.5fr 1.5fr 1fr',
                  background: 'var(--color-surface)',
                  borderRadius: 'var(--radius-card)',
                  boxShadow: 'var(--shadow-card)',
                  overflow: 'hidden',
                }}
              >
                {/* Заголовки таблицы */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    padding: '0.75rem 1rem',
                    fontWeight: 'bold',
                    color: 'var(--color-text-secondary)',
                    borderBottom: '2px solid var(--color-border)',
                    cursor: 'pointer',
                    fontSize: 'var(--font-size-base)',
                    lineHeight: 'var(--line-height-base)',
                  }}
                  onClick={() => handleSort('fullName')}
                >
                  Имя
                  {sortBy === 'fullName' && (sortOrder === 'asc' ? ' ↑' : ' ↓')}
                </div>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    padding: '0.75rem 1rem',
                    fontWeight: 'bold',
                    color: 'var(--color-text-secondary)',
                    borderBottom: '2px solid var(--color-border)',
                    cursor: 'pointer',
                    fontSize: 'var(--font-size-base)',
                    lineHeight: 'var(--line-height-base)',
                  }}
                  onClick={() => handleSort('phone')}
                >
                  Телефон
                  {sortBy === 'phone' && (sortOrder === 'asc' ? ' ↑' : ' ↓')}
                </div>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    padding: '0.75rem 1rem',
                    fontWeight: 'bold',
                    color: 'var(--color-text-secondary)',
                    borderBottom: '2px solid var(--color-border)',
                    cursor: 'pointer',
                    fontSize: 'var(--font-size-base)',
                    lineHeight: 'var(--line-height-base)',
                  }}
                  onClick={() => handleSort('maxId')}
                >
                  MAX ID
                  {sortBy === 'maxId' && (sortOrder === 'asc' ? ' ↑' : ' ↓')}
                </div>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    padding: '0.75rem 1rem',
                    fontWeight: 'bold',
                    color: 'var(--color-text-secondary)',
                    borderBottom: '2px solid var(--color-border)',
                    cursor: 'pointer',
                    fontSize: 'var(--font-size-base)',
                    lineHeight: 'var(--line-height-base)',
                  }}
                  onClick={() => handleSort('registrationDate')}
                >
                  Дата регистрации
                  {sortBy === 'registrationDate' && (sortOrder === 'asc' ? ' ↑' : ' ↓')}
                </div>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    padding: '0.75rem 1rem',
                    fontWeight: 'bold',
                    color: 'var(--color-text-secondary)',
                    borderBottom: '2px solid var(--color-border)',
                    cursor: 'pointer',
                    fontSize: 'var(--font-size-base)',
                    lineHeight: 'var(--line-height-base)',
                  }}
                  onClick={() => handleSort('lastActivity')}
                >
                  Последняя активность
                  {sortBy === 'lastActivity' && (sortOrder === 'asc' ? ' ↑' : ' ↓')}
                </div>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    padding: '0.75rem 1rem',
                    fontWeight: 'bold',
                    color: 'var(--color-text-secondary)',
                    borderBottom: '2px solid var(--color-border)',
                    cursor: 'pointer',
                    fontSize: 'var(--font-size-base)',
                    lineHeight: 'var(--line-height-base)',
                  }}
                  onClick={() => handleSort('status')}
                >
                  Статус
                  {sortBy === 'status' && (sortOrder === 'asc' ? ' ↑' : ' ↓')}
                </div>

                {/* Тело таблицы */}
                <div
                  style={{
                    display: 'grid',
                    gridAutoRows: 'minmax(50px, auto)',
                  }}
                >
                  {users.length > 0 ? (
                    users.map(user => (
                      <div key={user.id} style={{ display: 'contents' }}>
                        <div style={{ padding: '0.75rem 1rem', borderBottom: '1px solid var(--color-border)', display: 'flex', alignItems: 'center', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontSize: 'var(--font-size-base)', lineHeight: 'var(--line-height-base)' }}>
                          {user.fullName || '-'}
                        </div>
                        <div style={{ padding: '0.75rem 1rem', borderBottom: '1px solid var(--color-border)', display: 'flex', alignItems: 'center', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontSize: 'var(--font-size-base)', lineHeight: 'var(--line-height-base)' }}>
                          {user.phone || '-'}
                        </div>
                        <div style={{ padding: '0.75rem 1rem', borderBottom: '1px solid var(--color-border)', display: 'flex', alignItems: 'center', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontSize: 'var(--font-size-base)', lineHeight: 'var(--line-height-base)' }}>
                          {user.maxId || '-'}
                        </div>
                        <div style={{ padding: '0.75rem 1rem', borderBottom: '1px solid var(--color-border)', display: 'flex', alignItems: 'center', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontSize: 'var(--font-size-base)', lineHeight: 'var(--line-height-base)' }}>
                          {user.registrationDate ? formatDate(user.registrationDate) : '-'}
                        </div>
                        <div style={{ padding: '0.75rem 1rem', borderBottom: '1px solid var(--color-border)', display: 'flex', alignItems: 'center', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontSize: 'var(--font-size-base)', lineHeight: 'var(--line-height-base)' }}>
                          {user.lastActivity ? formatDate(user.lastActivity) + ' ' + formatTime(user.lastActivity) : '-'}
                        </div>
                        <div style={{ padding: '0.75rem 1rem', borderBottom: '1px solid var(--color-border)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <span
                            style={{
                              display: 'inline-block',
                              padding: '0.25rem 0.75rem',
                              borderRadius: '999px',
                              fontWeight: 'medium',
                              color: 'white',
                              backgroundColor: statusColors[user.status],
                              fontSize: 'var(--font-size-secondary)', // Применяем secondary к статусу
                              lineHeight: 'var(--line-height-base)', // Применяем line-height к статусу
                            }}
                          >
                            {statusLabels[user.status]}
                          </span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div style={{ gridColumn: '1 / -1', padding: '1.5rem', textAlign: 'center', color: 'var(--color-text-secondary)', fontSize: 'var(--font-size-secondary)', lineHeight: 'var(--line-height-base)' }}>
                      Пользователей не найдено
                    </div>
                  )}
                </div>
              </div>
              <div style={{ marginTop: '1rem', textAlign: 'center', color: 'var(--color-text-secondary)', fontSize: 'var(--font-size-secondary)', lineHeight: 'var(--line-height-base)' }}>
                Всего: {total}
              </div>
            </div>
          )}
        </section>
      </main>
    </Page>
  );
}