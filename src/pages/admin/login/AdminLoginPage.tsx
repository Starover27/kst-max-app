import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { adminLogin } from '../../../api/admin/auth/service'; // Импортируем сервис аутентификации администратора
import { useAppStore } from '../../../stores/appStore';
import Page from '../../../shared/ui/Page';

export default function AdminLoginPage() {
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const isLoading = useAppStore(state => state.isLoading);
  const setErrorStore = useAppStore(state => state.setError);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setErrorStore(null);

    try {
      // Выполняем аутентификацию администратора
      await adminLogin({ login, password });
      // Успешный вход администратора, перенаправляем на /admin
      navigate('/admin', { replace: true });
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Admin login failed');
    }
  };

  return (
    <Page>
      <main style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh', gap: '1rem', fontFamily: 'var(--font-family-base)', fontSize: 'var(--font-size-base)', lineHeight: 'var(--line-height-base)' }}>
        <h2 style={{ margin: '0 0 1rem 0', fontSize: 'var(--font-size-h2)', fontWeight: 700, lineHeight: 'var(--line-height-heading)' }}>Admin Login</h2>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', width: '100%', maxWidth: '300px' }}>
          {error && <div style={{ color: 'red', fontSize: 'var(--font-size-secondary)', lineHeight: 'var(--line-height-base)' }}>{error}</div>}
          <input
            type="text"
            placeholder="Login"
            value={login}
            onChange={(e) => setLogin(e.target.value)}
            required
            disabled={isLoading}
            style={{ padding: '0.5rem 1rem', borderRadius: 'var(--radius-button)', border: '1px solid var(--color-border)', background: 'var(--color-surface)', fontSize: 'var(--font-size-base)', lineHeight: 'var(--line-height-base)' }}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            disabled={isLoading}
            style={{ padding: '0.5rem 1rem', borderRadius: 'var(--radius-button)', border: '1px solid var(--color-border)', background: 'var(--color-surface)', fontSize: 'var(--font-size-base)', lineHeight: 'var(--line-height-base)' }}
          />
          <button type="submit" disabled={isLoading} style={{ padding: '0.5rem 1rem', borderRadius: 'var(--radius-button)', border: '1px solid var(--color-border)', background: 'var(--color-surface)', color: 'var(--color-accent)', fontWeight: 700, fontSize: 'var(--font-size-base)', lineHeight: 'var(--line-height-base)' }}>
            {isLoading ? 'Logging in...' : 'Login as Admin'}
          </button>
        </form>
      </main>
    </Page>
  );
}