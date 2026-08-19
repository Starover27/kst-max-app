import { useState, useEffect } from 'react';
import { getMedRegConfig, saveMedRegConfig, checkMedRegConnection, syncMedReg } from '../../../api/admin/medreg/service'; // Импортируем сервис MedReg
import { useAppStore } from '../../../stores/appStore';
import Page from '../../../shared/ui/Page';

export default function MedRegIntegrationPage() {
  const [apiUrl, setApiUrl] = useState('');
  const [apiToken, setApiToken] = useState('');
  const [isConnected, setIsConnected] = useState(false);
  const [lastSync, setLastSync] = useState<string | undefined>(undefined);
  const [lastError, setLastError] = useState<string | undefined>(undefined);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const isLoading = useAppStore(state => state.isLoading);
  const setErrorStore = useAppStore(state => state.setError);

  // Загружаем текущую конфигурацию при монтировании
  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const config = await getMedRegConfig();
        setApiUrl(config.apiUrl);
        // Токен не загружается для безопасности, оставляем поле пустым при редактировании
        // или можно передать флаг, что токен установлен
      } catch (err: unknown) {
        console.error("Failed to fetch MedReg config:", err);
        setError(err instanceof Error ? err.message : 'Failed to fetch MedReg config');
      }
    };

    fetchConfig();
  }, []);

  const handleSave = async () => {
    setError('');
    setMessage('');
    setErrorStore(null);

    try {
      const response = await saveMedRegConfig({ apiUrl, apiToken });
      setMessage(response.message);
      // После сохранения, возможно, стоит вызвать checkConnection
      // await handleCheckConnection();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to save MedReg config');
    }
  };

  const handleCheckConnection = async () => {
    setError('');
    setMessage('');
    setErrorStore(null);

    try {
      const response = await checkMedRegConnection();
      setIsConnected(response.status.isConnected);
      setLastSync(response.status.lastSync);
      setLastError(response.status.lastError);
      setMessage(response.message);
    } catch (err: unknown) {
        console.error("Check connection failed:", err);
      setError(err instanceof Error ? err.message : 'Check connection failed');
    }
  };

  const handleSync = async () => {
    setError('');
    setMessage('');
    setErrorStore(null);

    try {
      const response = await syncMedReg();
      setIsConnected(response.status.isConnected);
      setLastSync(response.status.lastSync);
      setLastError(response.status.lastError);
      setMessage(response.message);
    } catch (err: unknown) {
        console.error("Sync failed:", err);
      setError(err instanceof Error ? err.message : 'Sync failed');
    }
  };

  return (
    <Page>
      <main style={{ padding: '0', maxWidth: '800px', margin: '0 auto', width: '100%', fontFamily: 'var(--font-family-base)', fontSize: 'var(--font-size-base)', lineHeight: 'var(--line-height-base)' }}>
        <h1 style={{ padding: '0 1.5rem 1rem 1.5rem', margin: 0, borderBottom: '1px solid var(--color-border)', fontSize: 'var(--font-size-h1)', fontWeight: 700, lineHeight: 'var(--line-height-heading)' }}>MedReg Integration</h1>
        <section style={{ padding: '1.5rem' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxWidth: '600px' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold', fontSize: 'var(--font-size-base)', lineHeight: 'var(--line-height-base)' }}>API URL</label>
              <input
                type="text"
                value={apiUrl}
                onChange={(e) => setApiUrl(e.target.value)}
                placeholder="https://your-medreg-api.com"
                disabled={isLoading}
                style={{
                  width: '100%',
                  padding: '0.5rem 1rem',
                  borderRadius: 'var(--radius-button)',
                  border: '1px solid var(--color-border)',
                  background: 'var(--color-surface)',
                  fontSize: 'var(--font-size-base)',
                  lineHeight: 'var(--line-height-base)',
                }}
              />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold', fontSize: 'var(--font-size-base)', lineHeight: 'var(--line-height-base)' }}>API Token</label>
              <input
                type="password"
                value={apiToken}
                onChange={(e) => setApiToken(e.target.value)}
                placeholder="Enter API token"
                disabled={isLoading}
                style={{
                  width: '100%',
                  padding: '0.5rem 1rem',
                  borderRadius: 'var(--radius-button)',
                  border: '1px solid var(--color-border)',
                  background: 'var(--color-surface)',
                  fontSize: 'var(--font-size-base)',
                  lineHeight: 'var(--line-height-base)',
                }}
              />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', marginTop: '1rem' }}>
              <div style={{ background: 'var(--color-surface)', padding: '1rem', borderRadius: 'var(--radius-card)' }}>
                <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '0.9rem', color: 'var(--color-text-secondary)', fontWeight: 600, lineHeight: 'var(--line-height-base)' }}>Статус подключения</h3>
                <p style={{ margin: 0, color: isConnected ? 'var(--color-success)' : 'var(--color-error)', fontSize: 'var(--font-size-base)', lineHeight: 'var(--line-height-base)' }}>
                  {isConnected ? 'Подключено' : 'Не подключено'}
                </p>
              </div>
              <div style={{ background: 'var(--color-surface)', padding: '1rem', borderRadius: 'var(--radius-card)' }}>
                <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '0.9rem', color: 'var(--color-text-secondary)', fontWeight: 600, lineHeight: 'var(--line-height-base)' }}>Последняя синхронизация</h3>
                <p style={{ margin: 0, fontSize: 'var(--font-size-base)', lineHeight: 'var(--line-height-base)' }}>{lastSync ? new Date(lastSync).toLocaleString('ru-RU') : 'Нет данных'}</p>
              </div>
              <div style={{ background: 'var(--color-surface)', padding: '1rem', borderRadius: 'var(--radius-card)' }}>
                <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '0.9rem', color: 'var(--color-text-secondary)', fontWeight: 600, lineHeight: 'var(--line-height-base)' }}>Последняя ошибка</h3>
                <p style={{ margin: 0, color: lastError ? 'var(--color-error)' : 'var(--color-text-secondary)', fontSize: 'var(--font-size-base)', lineHeight: 'var(--line-height-base)' }}>
                  {lastError || 'Нет ошибок'}
                </p>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
              <button
                onClick={handleSave}
                disabled={isLoading}
                style={{
                  padding: '0.75rem 1.5rem',
                  borderRadius: 'var(--radius-button)',
                  border: '1px solid var(--color-border)',
                  background: 'var(--color-surface)',
                  cursor: 'pointer',
                  fontSize: 'var(--font-size-base)',
                  lineHeight: 'var(--line-height-base)',
                  fontWeight: 700,
                }}
              >
                {isLoading ? 'Saving...' : 'Сохранить'}
              </button>
              <button
                onClick={handleCheckConnection}
                disabled={isLoading}
                style={{
                  padding: '0.75rem 1.5rem',
                  borderRadius: 'var(--radius-button)',
                  border: '1px solid var(--color-border)',
                  background: 'var(--color-surface)',
                  cursor: 'pointer',
                  fontSize: 'var(--font-size-base)',
                  lineHeight: 'var(--line-height-base)',
                  fontWeight: 700,
                }}
              >
                {isLoading ? 'Checking...' : 'Проверить соединение'}
              </button>
              <button
                onClick={handleSync}
                disabled={isLoading}
                style={{
                  padding: '0.75rem 1.5rem',
                  borderRadius: 'var(--radius-button)',
                  border: '1px solid var(--color-border)',
                  background: 'var(--color-surface)',
                  cursor: 'pointer',
                  fontSize: 'var(--font-size-base)',
                  lineHeight: 'var(--line-height-base)',
                  fontWeight: 700,
                }}
              >
                {isLoading ? 'Syncing...' : 'Синхронизировать'}
              </button>
            </div>
            {(message || error) && (
              <div style={{ padding: '1rem', borderRadius: 'var(--radius-card)', background: error ? 'color-mix(in srgb, var(--color-error), transparent 90%)' : 'color-mix(in srgb, var(--color-success), transparent 90%)', fontSize: 'var(--font-size-base)', lineHeight: 'var(--line-height-base)' }}>
                {error && <p style={{ margin: 0, color: 'var(--color-error)', fontSize: 'var(--font-size-secondary)', lineHeight: 'var(--line-height-base)' }}>{error}</p>}
                {message && <p style={{ margin: 0, color: 'var(--color-success)', fontSize: 'var(--font-size-secondary)', lineHeight: 'var(--line-height-base)' }}>{message}</p>}
              </div>
            )}
          </div>
        </section>
      </main>
    </Page>
  );
}