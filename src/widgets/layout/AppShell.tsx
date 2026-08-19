import { useEffect } from 'react'
import { NavLink, Outlet, useLocation } from 'react-router-dom'
import { PrivacyConsentModal } from '../consent/PrivacyConsentModal'
import { getMaxUser, requestMaxContactOrPhone } from '../../shared/platform/max-bridge'
import { checkMedregStaffByPhone } from '../../shared/api/medregService'
import { useAppStore } from '../../stores/appStore'
import type { UserRole } from '../../entities/User'

function IconHome({ a }: { a: boolean }) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      <path d="M3 10.5L12 3.5l9 7" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M5.5 9.5V20a1 1 0 0 0 1 1H10v-6h4v6h3.5a1 1 0 0 0 1-1V9.5" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" fill={a ? 'currentColor' : 'none'} />
    </svg>
  )
}
function IconCalendar() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      <rect x="3.5" y="5" width="17" height="16" rx="2.5" stroke="currentColor" strokeWidth="1.7" fill="none" />
      <path d="M8 3v4M16 3v4M3.5 10h17" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
    </svg>
  )
}
function IconFlask() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      <path d="M9 3h6M10 3v6.5L4.8 18a2.4 2.4 0 0 0 2.1 3.5h10.2a2.4 2.4 0 0 0 2.1-3.5L14 9.5V3" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M7.5 15h9" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
    </svg>
  )
}
function IconUser({ a }: { a: boolean }) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="8" r="3.5" stroke="currentColor" strokeWidth="1.7" fill={a ? 'currentColor' : 'none'} />
      <path d="M5 20c1.4-3.8 4-5 7-5s5.6 1.2 7 5" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" fill={a ? 'currentColor' : 'none'} />
    </svg>
  )
}

export function AppShell() {
  const { pathname } = useLocation()
  const isActive = (to: string) => (to === '/' ? pathname === '/' : pathname.startsWith(to))

  useEffect(() => {
    async function syncMaxUserOnInit() {
      try {
        const contactData = await requestMaxContactOrPhone()
        const maxUser = await getMaxUser()
        const currentStoreUser = useAppStore.getState().user

        if (maxUser || contactData) {
          const nameParts = [maxUser?.first_name, maxUser?.last_name].filter(Boolean)
          const fullName = nameParts.length > 0
            ? nameParts.join(' ')
            : contactData?.name || maxUser?.username || currentStoreUser?.fullName || 'Пользователь MAX'
          const phone = contactData?.phone || maxUser?.phone || currentStoreUser?.phone

          let isStaff = currentStoreUser?.isStaff ?? false
          let role: UserRole = currentStoreUser?.role || 'patient'
          let position = currentStoreUser?.position
          let specialty = currentStoreUser?.specialty
          let branch = currentStoreUser?.branch
          let cabinet = currentStoreUser?.cabinet

          if (phone) {
            const staffCheck = await checkMedregStaffByPhone(phone)
            if (staffCheck?.isStaff) {
              isStaff = true
              role = staffCheck.role || 'doctor'
              position = staffCheck.position || 'Врач-терапевт'
              specialty = staffCheck.specialty || 'Терапия'
              branch = staffCheck.branch || 'ул. Шеронова, 6'
              cabinet = staffCheck.cabinet || '204'
            }
          }

          useAppStore.getState().setUser({
            id: maxUser?.id || currentStoreUser?.id || 'max-user',
            fullName,
            phone,
            avatarUrl: maxUser?.avatar_url || currentStoreUser?.avatarUrl,
            email: currentStoreUser?.email,
            isStaff,
            role,
            position,
            specialty,
            branch,
            cabinet,
          })

          if (isStaff) {
            useAppStore.getState().setIsStaff(true)
          }
        }
      } catch (err) {
        console.warn('[MAX Bridge] Auto-init failed:', err)
      }
    }

    syncMaxUserOnInit()
  }, [])

  const items = [
    { label: 'Главная', to: '/', icon: <IconHome a={isActive('/')} /> },
    { label: 'Запись', to: '/booking', icon: <IconCalendar /> },
    { label: 'Анализы', to: '/analysis', icon: <IconFlask /> },
    { label: 'Профиль', to: '/profile', icon: <IconUser a={isActive('/profile')} /> },
  ]
  return (
    <div className="appShell">
      <PrivacyConsentModal />
      <main style={{ flex: 1, width: '100%' }}>
        <Outlet />
      </main>
      <nav className="bottomNav">
        {items.map((it) => (
          <NavLink key={it.to} to={it.to} end={it.to === '/'} className={isActive(it.to) ? 'active' : ''}>
            {it.icon}
            <span>{it.label}</span>
          </NavLink>
        ))}
      </nav>
    </div>
  )
}
