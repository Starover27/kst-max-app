import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAppStore } from '../../stores/appStore'
import { getMaxUser, requestMaxContactOrPhone, isMaxBridgeAvailable } from '../../shared/platform/max-bridge'
import { checkMedregStaffByPhone } from '../../shared/api/medregService'

const stroke = { stroke: 'currentColor', strokeWidth: 1.7, strokeLinecap: 'round', strokeLinejoin: 'round' } as const

const IconBack = (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
    <path d="M15 19l-7-7 7-7" {...stroke} />
  </svg>
)

const IconCheck = (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
    <path d="M5 13l4 4L19 7" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

const IconMax = (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.8" />
    <path d="M8 12l3 3 5-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

export default function PersonalDataPage() {
  const navigate = useNavigate()
  const user = useAppStore((state) => state.user)
  const setUser = useAppStore((state) => state.setUser)

  const [fullName, setFullName] = useState(user?.fullName || 'Денис Петров')
  const [phone, setPhone] = useState(user?.phone || '+7 (924) 488-88-88')
  const [email, setEmail] = useState(user?.email || 'denis.petrov@kst27.ru')
  const [birthDate, setBirthDate] = useState('15.04.1988')
  const [avatarUrl, setAvatarUrl] = useState(user?.avatarUrl || '')
  const [saved, setSaved] = useState(false)
  const [syncStatus, setSyncStatus] = useState<string | null>(null)

  useEffect(() => {
    // Автоматическая попытка подгрузить данные из MAX при первом открытии
    async function tryLoadMaxData() {
      if (isMaxBridgeAvailable()) {
        try {
          const maxUser = await getMaxUser()
          if (maxUser) {
            const nameParts = [maxUser.first_name, maxUser.last_name].filter(Boolean)
            if (nameParts.length > 0) {
              setFullName(nameParts.join(' '))
            } else if (maxUser.username) {
              setFullName(maxUser.username)
            }
            if (maxUser.phone) {
              setPhone(maxUser.phone)
            }
            if (maxUser.avatar_url) {
              setAvatarUrl(maxUser.avatar_url)
            }
            setSyncStatus('Данные синхронизированы с профилем MAX')
          }
        } catch {
          // bridge not responding
        }
      }
    }
    tryLoadMaxData()
  }, [])

  const handleSyncMax = async () => {
    try {
      const contactData = await requestMaxContactOrPhone()
      if (contactData?.phone || contactData?.name) {
        if (contactData.name) setFullName(contactData.name)
        if (contactData.phone) setPhone(contactData.phone)
        setSyncStatus('Данные и номер телефона успешно подгружены из MAX!')
      } else if (isMaxBridgeAvailable()) {
        const maxUser = await getMaxUser()
        if (maxUser) {
          const nameParts = [maxUser.first_name, maxUser.last_name].filter(Boolean)
          const newName = nameParts.length > 0 ? nameParts.join(' ') : maxUser.username || fullName
          setFullName(newName)
          if (maxUser.phone) setPhone(maxUser.phone)
          if (maxUser.avatar_url) setAvatarUrl(maxUser.avatar_url)
          setSyncStatus('Данные профиля подгружены из MAX')
        } else {
          setSyncStatus('Разрешите доступ к контакту в диалоге MAX')
        }
      } else {
        // Тестовый режим в браузере
        setFullName('Денис Петров')
        setPhone('+7 (924) 488-88-88')
        setSyncStatus('MAX Bridge: тестовый номер телефона подгружен')
      }
    } catch {
      setSyncStatus('Не удалось подключиться к MAX Bridge')
    }
    setTimeout(() => setSyncStatus(null), 4000)
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()

    // Проверка номера в МИС Медрег
    const staffData = await checkMedregStaffByPhone(phone)
    const isStaffUser = !!staffData?.isStaff

    setUser({
      id: user?.id || 'current-user',
      fullName,
      phone,
      email,
      avatarUrl,
      isStaff: isStaffUser,
      role: staffData?.role || (isStaffUser ? 'doctor' : 'patient'),
      position: staffData?.position,
      specialty: staffData?.specialty,
      branch: staffData?.branch,
      cabinet: staffData?.cabinet,
    })

    if (isStaffUser) {
      setSyncStatus('Идентифицирован в КСТ: доступен кабинет сотрудника')
    }

    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  return (
    <div className="page" style={{ paddingBottom: 96 }}>
      {/* Top Bar */}
      <div className="topBar">
        <button className="iconBtn" aria-label="Назад" onClick={() => navigate(-1)}>
          {IconBack}
        </button>
        <span className="topBarTitle">Личные данные</span>
        <span style={{ width: 40 }} />
      </div>

      {/* MAX Sync Banner */}
      <div
        style={{
          background: 'linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%)',
          border: '1px solid #bfdbfe',
          borderRadius: 16,
          padding: '14px 16px',
          marginBottom: 16,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 12,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ color: '#2563eb', flex: 'none' }}>{IconMax}</div>
          <div>
            <div style={{ fontSize: 14, fontWeight: 700, color: '#1e40af' }}>Интеграция с MAX</div>
            <div style={{ fontSize: 12, color: '#3b82f6' }}>Имя и телефон из вашего мессенджера</div>
          </div>
        </div>
        <button
          type="button"
          onClick={handleSyncMax}
          style={{
            background: '#2563eb',
            color: '#fff',
            border: 'none',
            borderRadius: 10,
            padding: '8px 12px',
            fontSize: 12,
            fontWeight: 600,
            cursor: 'pointer',
            flex: 'none',
          }}
        >
          Обновить
        </button>
      </div>

      {syncStatus && (
        <div
          style={{
            background: '#ecfdf5',
            border: '1px solid #a7f3d0',
            color: '#065f46',
            borderRadius: 12,
            padding: '10px 14px',
            fontSize: 13,
            marginBottom: 16,
            display: 'flex',
            alignItems: 'center',
            gap: 8,
          }}
        >
          {IconCheck}
          <span>{syncStatus}</span>
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSave}>
        <div className="taxForm" style={{ margin: 0 }}>
          <div className="taxFormSection">
            <div className="taxFormSectionTitle">Основная информация</div>

            <div className="taxField">
              <label className="taxLabel">Фамилия, Имя и Отчество</label>
              <input
                type="text"
                className="taxInput"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Иванов Иван Иванович"
                required
              />
            </div>

            <div className="taxField">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                <label className="taxLabel" style={{ marginBottom: 0 }}>Номер телефона</label>
                <button
                  type="button"
                  onClick={handleSyncMax}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#2563eb',
                    fontSize: 12,
                    fontWeight: 600,
                    cursor: 'pointer',
                    padding: 0,
                  }}
                >
                  Запросить из MAX ➔
                </button>
              </div>
              <input
                type="tel"
                className="taxInput"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+7 (999) 123-45-67"
                required
              />
            </div>

            <div className="taxField">
              <label className="taxLabel">Электронная почта</label>
              <input
                type="email"
                className="taxInput"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="user@example.com"
              />
            </div>

            <div className="taxField">
              <label className="taxLabel">Дата рождения</label>
              <input
                type="text"
                className="taxInput"
                value={birthDate}
                onChange={(e) => setBirthDate(e.target.value)}
                placeholder="ДД.ММ.ГГГГ"
              />
            </div>
          </div>
        </div>

        {saved && (
          <div
            style={{
              background: '#ecfdf5',
              border: '1px solid #a7f3d0',
              color: '#065f46',
              borderRadius: 12,
              padding: '12px 16px',
              fontSize: 14,
              marginTop: 16,
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              fontWeight: 600,
            }}
          >
            {IconCheck}
            <span>Изменения успешно сохранены!</span>
          </div>
        )}

        <button type="submit" className="btnPrimary" style={{ width: '100%', marginTop: 20, padding: 14, fontSize: 15, fontWeight: 700 }}>
          Сохранить данные
        </button>
      </form>
    </div>
  )
}
