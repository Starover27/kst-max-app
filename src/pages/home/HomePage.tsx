import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import clinicPhoto from '../../assets/clinic.jpg'
import logo from '../../assets/logo.png'
import { Modal } from '../../shared/ui/Modal'
import { ReviewsModal } from '../../widgets/reviews/ReviewsModal'
import { useAppStore } from '../../stores/appStore'

function getGreetingName(fullName?: string): string {
  if (!fullName) return ''
  const clean = fullName.trim()
  if (!clean) return ''
  const parts = clean.split(/\s+/)
  if (parts.length === 0) return ''
  if (parts.length === 1) return parts[0]

  // Если 3 части: "Шуваев Денис Владимирович" -> parts[1] это "Денис"
  if (parts.length >= 3) {
    return parts[1]
  }

  // Если 2 части: проверяем, идет ли сначала фамилия (например: "Шуваев Денис")
  const surnameRegex = /(ов|ова|ев|ева|ин|ина|ский|ская|цкий|цкая|ын|ына|их|ых)$/i
  if (surnameRegex.test(parts[0]) && !surnameRegex.test(parts[1])) {
    return parts[1]
  }

  return parts[0]
}

type InfoKey = 'payment' | 'referral' | 'reviews' | 'route' | 'notify' | null

const I = {
  calendar: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><rect x="3.5" y="5" width="17" height="16" rx="2.5" stroke="var(--red)" strokeWidth="1.7" /><path d="M8 3v4M16 3v4M3.5 10h17" stroke="var(--red)" strokeWidth="1.7" strokeLinecap="round" /></svg>
  ),
  clipboard: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><rect x="5" y="4" width="14" height="17" rx="2" stroke="var(--red)" strokeWidth="1.7" /><path d="M9 4.5V3h6v1.5" stroke="var(--red)" strokeWidth="1.7" /><path d="M9 10h6M9 14h4" stroke="var(--red)" strokeWidth="1.7" strokeLinecap="round" /></svg>
  ),
  flask: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M9 3h6M10 3v6.5L4.8 18a2.4 2.4 0 0 0 2.1 3.5h10.2a2.4 2.4 0 0 0 2.1-3.5L14 9.5V3" stroke="var(--red)" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" /></svg>
  ),
  card: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><rect x="3" y="5.5" width="18" height="13" rx="2" stroke="var(--red)" strokeWidth="1.7" /><path d="M3 10h18" stroke="var(--red)" strokeWidth="1.7" /><path d="M7 15h4" stroke="var(--red)" strokeWidth="1.7" strokeLinecap="round" /></svg>
  ),
  user: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="8" r="3.5" stroke="var(--red)" strokeWidth="1.7" /><path d="M5 20c1.4-3.8 4-5 7-5s5.6 1.2 7 5" stroke="var(--red)" strokeWidth="1.7" strokeLinecap="round" /></svg>
  ),
  doc: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M7 3h7l4 4v14H7z" stroke="var(--red)" strokeWidth="1.7" strokeLinejoin="round" /><path d="M10 12h5M10 16h5" stroke="var(--red)" strokeWidth="1.7" strokeLinecap="round" /></svg>
  ),
  star: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M12 3.5l2.6 5.3 5.9.9-4.2 4.1 1 5.8-5.3-2.8-5.3 2.8 1-5.8L3.5 9.7l5.9-.9z" stroke="var(--red)" strokeWidth="1.7" strokeLinejoin="round" /></svg>
  ),
  pin: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M12 21s7-6.1 7-11a7 7 0 1 0-14 0c0 4.9 7 11 7 11z" stroke="var(--red)" strokeWidth="1.7" /><circle cx="12" cy="10" r="2.5" stroke="var(--red)" strokeWidth="1.7" /></svg>
  ),
  bell: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><path d="M6 9a6 6 0 1 1 12 0c0 5 2 6 2 6H4s2-1 2-6" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" /><path d="M10 19a2 2 0 0 0 4 0" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" /></svg>
  ),
}

export function HomePage() {
  const nav = useNavigate()
  const user = useAppStore((s) => s.user)
  const [info, setInfo] = useState<InfoKey>(null)
  const greetingName = getGreetingName(user?.fullName)

  const quick: { icon: keyof typeof I; label: string; onClick: () => void }[] = [
    { icon: 'calendar', label: 'Записаться к врачу', onClick: () => nav('/doctors') },
    { icon: 'clipboard', label: 'Мои записи', onClick: () => nav('/appointment') },
    { icon: 'flask', label: 'Анализы и результаты', onClick: () => nav('/analysis') },
    { icon: 'card', label: 'Оплата услуг', onClick: () => setInfo('payment') },
    { icon: 'user', label: 'Врачи', onClick: () => nav('/doctors') },
    { icon: 'doc', label: 'Направления', onClick: () => setInfo('referral') },
    { icon: 'star', label: 'Отзывы', onClick: () => setInfo('reviews') },
    { icon: 'pin', label: 'Как добраться', onClick: () => setInfo('route') },
  ]

  return (
    <div className="page pageWide" style={{ paddingBottom: 96 }}>
      <div style={{ padding: '0 16px' }}>
        <div className="topBar">
          <div className="homeLogo">
            <img className="homeLogoImg" src={logo} alt="Клиника современных технологий" />
            <div className="homeLogoText" style={{ fontSize: 13, fontWeight: 800, textTransform: 'uppercase', lineHeight: 1.25 }}>
              <span style={{ color: '#ea580c' }}>КЛИНИКА</span>{' '}
              <span style={{ color: '#2563eb' }}>СОВРЕМЕННЫХ</span>{' '}
              <span style={{ color: '#16a34a' }}>ТЕХНОЛОГИЙ</span>
              <small style={{ display: 'block', fontSize: 10, fontWeight: 500, color: 'var(--muted, #6b7280)', textTransform: 'none', marginTop: 2 }}>
                для взрослых и детей
              </small>
            </div>
          </div>
          <button className="iconBtn" aria-label="Уведомления" onClick={() => setInfo('notify')}>{I.bell}</button>
        </div>
      </div>

      <div className="homeHero">
        <div className="homeHeroInner">
          <h1>Здравствуйте{greetingName ? `, ${greetingName}` : ''}!</h1>
          <p>Мы заботимся о вашем здоровье и здоровье ваших близких</p>
        </div>
        <img className="homeHeroImg" src={clinicPhoto} alt="Здание клиники" />
      </div>

      <div className="quickGrid">
        {quick.map((q) => (
          <button key={q.label} className="quickBtn" onClick={q.onClick}>
            {I[q.icon]}
            <span>{q.label}</span>
          </button>
        ))}
      </div>

      <div className="promoBanner">
        <svg width="52" height="52" viewBox="0 0 52 52" fill="none">
          <path d="M26 46C14 37.5 7 29.5 7 21 7 14 12.4 9 18.6 9c3 0 5.8 1.6 7.4 4.2C27.6 10.6 30.4 9 33.4 9 39.6 9 45 14 45 21c0 8.5-7 16.5-19 25z" fill="#fff" />
          <path d="M14 26h7l3-6 4 10 3-6h7" stroke="var(--red)" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" fill="none" />
        </svg>
        <div>
          <h3>Ваше здоровье — наша главная цель</h3>
          <p>Современное оборудование, опытные специалисты, индивидуальный подход</p>
        </div>
        <button className="promoArrow" aria-label="Подробнее" onClick={() => setInfo('route')}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M9 5l7 7-7 7" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
        </button>
      </div>

      {info === 'payment' && (
        <Modal title="Оплата услуг" onClose={() => setInfo(null)}>
          <p>Оплатить услуги можно:</p>
          <ul style={{ paddingLeft: 18, margin: '8px 0' }}>
            <li>в кассе клиники (кабинет 101, 1 этаж);</li>
            <li>банковской картой у администратора;</li>
            <li>по СБП через приложение вашего банка.</li>
          </ul>
          <p className="muted">Онлайн-оплата в приложении появится в ближайшее время.</p>
        </Modal>
      )}
      {info === 'referral' && (
        <Modal title="Направления" onClose={() => setInfo(null)}>
          <p>Направления на анализы и консультации выдаёт врач терапевт на приёме.</p>
          <p className="muted" style={{ marginTop: 8 }}>Электронные направления отображаются в разделе «Анализы» после оформления. Записаться можно в разделе «Запись».</p>
          <button className="btnPrimary" style={{ marginTop: 14 }} onClick={() => { setInfo(null); nav('/doctors') }}>Записаться к врачу</button>
        </Modal>
      )}
      {info === 'reviews' && (
        <ReviewsModal onClose={() => setInfo(null)} />
      )}
      {info === 'route' && (
        <Modal title="Филиалы клиники" onClose={() => setInfo(null)}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div style={{ padding: '10px 12px', background: '#f9fafb', borderRadius: 12 }}>
              <strong style={{ color: '#111827' }}>Взрослое отделение</strong>
              <div style={{ fontSize: 13, color: '#374151', marginTop: 2 }}>ул. Шеронова, 6 (ЖК «Дендрарий»)</div>
              <div style={{ fontSize: 12, color: '#6b7280', marginTop: 2 }}>Пн-Пт: 08:00–21:00, Сб-Вс: 08:00–19:00</div>
            </div>
            <div style={{ padding: '10px 12px', background: '#f9fafb', borderRadius: 12 }}>
              <strong style={{ color: '#111827' }}>Центр здорового ребёнка</strong>
              <div style={{ fontSize: 13, color: '#374151', marginTop: 2 }}>ул. Шеронова, 8 к. 3 (1 и 2 этажи)</div>
              <div style={{ fontSize: 12, color: '#6b7280', marginTop: 2 }}>Пн-Пт: 08:00–21:00, Сб-Вс: 08:00–19:00</div>
            </div>
            <div style={{ padding: '10px 12px', background: '#f9fafb', borderRadius: 12 }}>
              <strong style={{ color: '#111827' }}>Многопрофильная клиника</strong>
              <div style={{ fontSize: 13, color: '#374151', marginTop: 2 }}>ул. Руднева, 17 (ост. «Победа»)</div>
              <div style={{ fontSize: 12, color: '#6b7280', marginTop: 2 }}>Пн-Пт: 08:00–21:00, Сб-Вс: 08:00–19:00</div>
            </div>
          </div>
          <a className="btnPrimary" style={{ display: 'block', textAlign: 'center', marginTop: 14, color: '#fff', textDecoration: 'none' }} href="tel:+74212488888">Позвонить: +7 (4212) 48-88-88</a>
        </Modal>
      )}
      {info === 'notify' && (
        <Modal title="Уведомления" onClose={() => setInfo(null)}>
          <p>Напоминание о приёме за 1 день до визита.</p>
          <p className="muted" style={{ marginTop: 6 }}>Результаты анализов доступны в разделе «Анализы».</p>
        </Modal>
      )}
    </div>
  )
}
