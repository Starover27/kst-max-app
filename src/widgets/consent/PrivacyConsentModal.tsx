import { useState } from 'react'

const CONSENT_STORAGE_KEY = 'mc_privacy_consent_accepted'

export function PrivacyConsentModal() {
  const [isOpen, setIsOpen] = useState(() => {
    if (typeof window === 'undefined') return false
    try {
      return localStorage.getItem(CONSENT_STORAGE_KEY) !== 'true'
    } catch {
      return true
    }
  })

  const handleAccept = () => {
    try {
      localStorage.setItem(CONSENT_STORAGE_KEY, 'true')
    } catch {
      // ignore
    }
    setIsOpen(false)
  }

  if (!isOpen) return null

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        background: 'rgba(0, 0, 0, 0.75)',
        backdropFilter: 'blur(6px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px',
      }}
    >
      <div
        style={{
          background: '#ffffff',
          borderRadius: 20,
          maxWidth: 440,
          width: '100%',
          maxHeight: '85vh',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '0 20px 40px rgba(0,0,0,0.3)',
          overflow: 'hidden',
          animation: 'fadeIn 0.25s ease-out',
        }}
      >
        {/* Header */}
        <div style={{ padding: '24px 20px 16px', borderBottom: '1px solid var(--border, #eee)', textAlign: 'center' }}>
          <div
            style={{
              width: 52,
              height: 52,
              borderRadius: '50%',
              background: 'var(--red-light, #FBEAEA)',
              color: 'var(--red, #e11d48)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 12px',
            }}
          >
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <h2 style={{ fontSize: 18, fontWeight: 700, margin: 0, color: 'var(--text, #111)' }}>
            Согласие на обработку персональных данных
          </h2>
          <p style={{ fontSize: 13, color: 'var(--muted, #666)', marginTop: 6, marginBottom: 0 }}>
            ООО «Клиника современных технологий»
          </p>
        </div>

        {/* Content */}
        <div
          style={{
            padding: '16px 20px',
            overflowY: 'auto',
            fontSize: 13,
            lineHeight: 1.55,
            color: '#374151',
          }}
        >
          <p style={{ marginTop: 0 }}>
            В соответствии с Федеральным законом № 152-ФЗ «О персональных данных», для использования сервиса онлайн-записи, получения результатов анализов и медицинских документов необходимо ваше согласие.
          </p>
          <div style={{ background: '#f9fafb', borderRadius: 12, padding: '12px 14px', margin: '12px 0' }}>
            <div style={{ fontWeight: 600, color: '#111827', marginBottom: 6 }}>Цели обработки:</div>
            <ul style={{ margin: 0, paddingLeft: 18 }}>
              <li>Запись на приём к специалистам клиники;</li>
              <li>Предоставление результатов анализов и протоколов обследований;</li>
              <li>Информирование о статусе визитов и готовности документов;</li>
              <li>Оформление справок для налогового вычета.</li>
            </ul>
          </div>
          <p style={{ fontSize: 12, color: '#6b7280', marginBottom: 0 }}>
            Мы гарантируем конфиденциальность и безопасность передачи ваших медицинских и персональных данных.
          </p>
        </div>

        {/* Footer actions */}
        <div style={{ padding: '16px 20px', borderTop: '1px solid var(--border, #eee)', background: '#fafafa' }}>
          <button
            className="btnPrimary"
            style={{ width: '100%', padding: '14px', fontSize: 15, fontWeight: 700 }}
            onClick={handleAccept}
          >
            Принимаю и согласен
          </button>
        </div>
      </div>
    </div>
  )
}
