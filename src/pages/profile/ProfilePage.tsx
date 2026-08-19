import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { logout } from '../../api/auth/service'
import { useAppStore } from '../../stores/appStore'

function initials(name: string): string {
  return name
    .split(' ')
    .filter(Boolean)
    .map((w) => w[0])
    .slice(0, 2)
    .join('')
    .toUpperCase()
}

const stroke = { stroke: 'currentColor', strokeWidth: 1.7, strokeLinecap: 'round', strokeLinejoin: 'round' } as const

const MENU_ICONS = {
  user: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="8" r="3.5" {...stroke} /><path d="M5 20c1.4-3.8 4-5 7-5s5.6 1.2 7 5" {...stroke} /></svg>
  ),
  clock: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="8.5" {...stroke} /><path d="M12 7.5V12l3 2" {...stroke} /></svg>
  ),
  doc: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M7 3h7l4 4v14H7z" {...stroke} /><path d="M10 12h5M10 16h5" {...stroke} /></svg>
  ),
  bell: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M6 9a6 6 0 1 1 12 0c0 5 2 6 2 6H4s2-1 2-6" {...stroke} /><path d="M10 19a2 2 0 0 0 4 0" {...stroke} /></svg>
  ),
  info: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="8.5" {...stroke} /><path d="M12 11v5" {...stroke} /><path d="M12 7.8v.2" {...stroke} /></svg>
  ),
  help: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="8.5" {...stroke} /><path d="M9.6 9.5a2.5 2.5 0 0 1 4.9.6c0 1.6-2.5 2-2.5 3.4" {...stroke} /><path d="M12 16.5v.2" {...stroke} /></svg>
  ),
  tax: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M7 3h7l4 4v14H7z" {...stroke} /><path d="M14 3v4h4" {...stroke} /><path d="M10 12h4M10 15h4" {...stroke} /><path d="M10 18h1.5" {...stroke} /></svg>
  ),
}

const Arrow = (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M9 5l7 7-7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
)

export default function ProfilePage() {
  const user = useAppStore((state) => state.user)
  const isStaff = useAppStore((state) => state.isStaff)
  const setIsStaff = useAppStore((state) => state.setIsStaff)
  const isLoading = useAppStore((state) => state.isLoading)
  const navigate = useNavigate()
  const [remind, setRemind] = useState(true)

  const name = user?.fullName ?? 'Денис Петров'
  const phone = user?.phone ?? user?.email ?? '+7 (999) 123-45-67'

  const handleLogout = async () => {
    try {
      await logout()
    } catch (e) {
      console.error('Logout failed:', e)
    }
  }

  const menu: { icon: keyof typeof MENU_ICONS; label: string; onClick: () => void }[] = [
    { icon: 'user', label: 'Личные данные', onClick: () => navigate('/profile/personal') },
    { icon: 'clock', label: 'История посещений', onClick: () => navigate('/appointment') },
    { icon: 'doc', label: 'Документы', onClick: () => navigate('/profile/documents') },
  ]

  return (
    <div className="page" style={{ paddingBottom: 96 }}>
      <div className="profileHero">
        <button className="iconBtn profileSettings" aria-label="Настройки">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.7" /><path d="M12 2.8l1.2 2.4 2.6.5 1.9-1 1.6 1.6-1 1.9.5 2.6 2.4 1.2-1.2 1.2.5 2.6 1 1.9-1.6 1.6-1.9-1-2.6.5-1.2 2.4h-2.4l-1.2-2.4-2.6-.5-1.9 1-1.6-1.6 1-1.9-.5-2.6-2.4-1.2 1.2-1.2-.5-2.6-1-1.9 1.6-1.6 1.9 1 2.6-.5 1.2-2.4z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round" fill="none" /></svg>
        </button>
        <div className="profileAvatar">
          {user?.avatarUrl ? (
            <img src={user.avatarUrl} alt={name} style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }} />
          ) : (
            initials(name)
          )}
          <button className="profileEdit" aria-label="Редактировать профиль" onClick={() => navigate('/profile/personal')}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M4 20l1-4L16.5 4.5a2.1 2.1 0 0 1 3 3L8 19l-4 1z" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" /></svg>
          </button>
        </div>
        <div className="profileName">{name}</div>
        <div className="profilePhone">{phone}</div>
        {isStaff && (
          <div
            style={{
              marginTop: 8,
              background: 'linear-gradient(135deg, #0284c7 0%, #0369a1 100%)',
              color: '#fff',
              fontSize: 12,
              fontWeight: 700,
              padding: '4px 12px',
              borderRadius: 20,
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
            }}
          >
            <span>👨‍⚕️ КСТ: {user?.position || 'Врач-терапевт'}</span>
          </div>
        )}
      </div>

      {/* Staff / Doctor Mode Switcher & Tools */}
      <div style={{ margin: '0 16px 14px' }}>
        <div
          style={{
            background: isStaff ? 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)' : '#f8fafc',
            color: isStaff ? '#fff' : '#334155',
            border: isStaff ? '1px solid #334155' : '1px solid #e2e8f0',
            borderRadius: 16,
            padding: '14px 16px',
            boxShadow: isStaff ? '0 8px 20px rgba(15,23,42,0.15)' : 'none',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <div style={{ fontSize: 13, fontWeight: 700, color: isStaff ? '#38bdf8' : '#0f172a' }}>
                {isStaff ? 'Режим сотрудника КСТ' : 'Идентификация в КСТ'}
              </div>
              <div style={{ fontSize: 11, color: isStaff ? '#94a3b8' : '#64748b', marginTop: 2 }}>
                {isStaff ? 'Доступ к врачебному расписанию и сервисам' : 'Проверка номера телефона в базе сотрудников'}
              </div>
            </div>
            <button
              className={`toggle ${isStaff ? 'on' : ''}`}
              aria-label="Режим сотрудника"
              onClick={() => setIsStaff(!isStaff)}
            />
          </div>

          {isStaff && (
            <div style={{ marginTop: 12, paddingTop: 12, borderTop: '1px solid rgba(255,255,255,0.1)' }}>
              <button
                type="button"
                className="btnPrimary"
                style={{ width: '100%', padding: '10px 14px', fontSize: 13, fontWeight: 700, background: '#0284c7' }}
                onClick={() => navigate('/profile/staff')}
              >
                Открыть кабинет сотрудника КСТ ➔
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="profileMenu">
        {menu.map((m) => (
          <button key={m.label} className="menuRow" onClick={m.onClick} style={{ color: 'var(--text)' }}>
            <span style={{ color: 'var(--gray)', display: 'inline-flex' }}>{MENU_ICONS[m.icon]}</span>
            {m.label}
            <span className="arrow">{Arrow}</span>
          </button>
        ))}
        <div className="menuRow" style={{ cursor: 'default' }}>
          <span style={{ color: 'var(--gray)', display: 'inline-flex' }}>{MENU_ICONS.bell}</span>
          Уведомления
          <button
            className={`toggle ${remind ? 'on' : ''}`}
            aria-label="Уведомления"
            style={{ marginLeft: 'auto' }}
            onClick={() => setRemind((v) => !v)}
          />
        </div>
        <button className="menuRow" onClick={() => navigate('/about')}>
          <span style={{ color: 'var(--gray)', display: 'inline-flex' }}>{MENU_ICONS.info}</span>
          О клинике
          <span className="arrow">{Arrow}</span>
        </button>
        <button className="menuRow" onClick={() => alert('Служба поддержки: +7 (4212) 48-88-88, info@kst27.ru')}>
          <span style={{ color: 'var(--gray)', display: 'inline-flex' }}>{MENU_ICONS.help}</span>
          Помощь и поддержка
          <span className="arrow">{Arrow}</span>
        </button>
        <button className="logoutBtn" onClick={handleLogout} disabled={isLoading}>
          {isLoading ? 'Выход...' : 'Выйти'}
        </button>
      </div>
    </div>
  )
}
