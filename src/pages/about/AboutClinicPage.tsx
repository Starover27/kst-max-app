import { useNavigate } from 'react-router-dom'
import styles from './AboutClinicPage.module.css'

const stroke = { stroke: 'currentColor', strokeWidth: 1.7, strokeLinecap: 'round', strokeLinejoin: 'round' } as const

const IconBack = (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
    <path d="M15 19l-7-7 7-7" {...stroke} />
  </svg>
)

const IconPhone = (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.7 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" {...stroke} />
  </svg>
)

const IconClock = (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
    <circle cx="12" cy="12" r="9" {...stroke} />
    <path d="M12 7v5l3 2" {...stroke} />
  </svg>
)

const IconBuilding = (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
    <path d="M3 21h18M5 21V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16M9 9h1M14 9h1M9 13h1M14 13h1M9 17h1M14 17h1" {...stroke} />
  </svg>
)

const IconCheckCircle = (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
    <circle cx="12" cy="12" r="9" {...stroke} />
    <path d="M9 12l2 2 4-4" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

const IconUsers = (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
    <circle cx="9" cy="9" r="3" {...stroke} />
    <path d="M3.5 19c1.2-3.2 3.2-4.5 5.5-4.5s4.3 1.3 5.5 4.5" {...stroke} />
    <circle cx="16.5" cy="9.5" r="2.5" {...stroke} />
    <path d="M16 14.6c2 .2 3.6 1.5 4.6 4.4" {...stroke} />
  </svg>
)

const IconEquipment = (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
    <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" {...stroke} />
  </svg>
)

const IconHeartPulse = (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
    <path d="M19 14c1.49-1.28 3-2.6 3-4.5a4.5 4.5 0 0 0-7.78-3.07L12 8.58l-2.22-2.15A4.5 4.5 0 0 0 2 9.5c0 1.9 1.51 3.22 3 4.5l7 7z" {...stroke} />
  </svg>
)

const IconStar = (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" {...stroke} />
  </svg>
)

/* Branch data */
const BRANCHES = [
  {
    id: 'rudneva17',
    address: 'ул. Руднева, 17',
    badge: 'Многопрофильная клиника',
    desc: 'Полный комплекс амбулаторных услуг, терапия, хирургия, УЗИ-диагностика и процедурные кабинеты.',
    hours: 'Пн–Пт 08:00–21:00, Сб–Вс 08:00–19:00',
    image: 'https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 'sheronova8',
    address: 'ул. Шеронова, 8 к.3',
    badge: 'Детское отделение & Центр здорового ребенка',
    desc: 'Забота о самых маленьких: педиатрия, программа патронажа от 0 до 3 лет, вакцинопрофилактика.',
    hours: 'Пн–Пт 08:00–21:00, Сб–Вс 08:00–19:00',
    image: 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 'sheronova6',
    address: 'ул. Шеронова, 6',
    badge: 'Взрослое отделение (ЖК «Дендрарий»)',
    desc: 'Уузкопрофильные специалисты, кардиоцентр, гинекология, ФГДС, колоноскопия и экспертное УЗИ.',
    hours: 'Пн–Пт 08:00–21:00, Сб–Вс 08:00–19:00',
    image: 'https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 'sheronova10',
    address: 'ул. Шеронова, 10',
    badge: 'Лаборатория СМП & Диагностика',
    desc: 'Экспресс-лаборатория, экстренная выездная служба скорой медицинской помощи и забор анализов.',
    hours: 'Пн–Пт 08:00–21:00, Сб–Вс 08:00–19:00',
    image: 'https://images.unsplash.com/photo-1579154204601-01588f351e67?auto=format&fit=crop&w=600&q=80',
  },
]

/* Advantages list */
const ADVANTAGES = [
  {
    icon: IconBuilding,
    title: 'Многопрофильный центр',
    desc: 'Широкий спектр медицинских направлений в одном учреждении',
  },
  {
    icon: IconUsers,
    title: 'Взрослые и детские направления',
    desc: 'Специализированные отделения и патронаж для всей семьи',
  },
  {
    icon: IconStar,
    title: 'Опытные специалисты',
    desc: 'Врачи высшей категории, кандидаты наук и доктора',
  },
  {
    icon: IconEquipment,
    title: 'Современное оборудование',
    desc: 'Точная визуализация и высокотехнологичная диагностика',
  },
  {
    icon: IconHeartPulse,
    title: 'Диагностика и лечение',
    desc: 'Оперативное обследование и индивидуальные программы терапий',
  },
  {
    icon: IconCheckCircle,
    title: 'Индивидуальный подход',
    desc: 'Внимательный персонал, уют и отсутствие стресса',
  },
]

export default function AboutClinicPage() {
  const navigate = useNavigate()

  return (
    <div className={`page ${styles.page}`}>
      {/* Top Navigation Bar */}
      <div className="topBar">
        <button className="iconBtn" aria-label="Назад" onClick={() => navigate(-1)}>
          {IconBack}
        </button>
        <span className="topBarTitle">О клинике</span>
        <span style={{ width: 40 }} />
      </div>

      {/* Hero Header */}
      <div className={styles.hero}>
        <div className={styles.heroBadge}>
          <span>🏥 Медицинский центр европейского класса</span>
        </div>
        <h1 className={styles.heroTitle}>Клиника современных технологий</h1>
        <p className={styles.heroDesc}>
          Предоставляем высококвалифицированную, быструю и эффективную медицинскую помощь для взрослых и детей в Хабаровске.
        </p>

        <div className={styles.heroStats}>
          <div className={styles.statItem}>
            <div className={styles.statValue}>4</div>
            <div className={styles.statLabel}>Филиала в Хабаровске</div>
          </div>
          <div className={styles.statItem}>
            <div className={styles.statValue}>50+</div>
            <div className={styles.statLabel}>Врачей-экспертов</div>
          </div>
          <div className={styles.statItem}>
            <div className={styles.statValue}>20+</div>
            <div className={styles.statLabel}>Лет опыта и доверия</div>
          </div>
        </div>
      </div>

      {/* About Description */}
      <div className={styles.section}>
        <div className={styles.aboutTextCard}>
          <strong>«Клиника современных технологий»</strong> − медицинское учреждение с новейшим оборудованием и сплочённым коллективом профессионалов. В нашей врачебной практике мы охватываем ключевые сферы медицины, а вежливый персонал обеспечивает комфортные условия приема.
        </div>
      </div>

      {/* Key Advantages */}
      <div className={styles.section}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>Основные преимущества</h2>
        </div>
        <div className={styles.gridAdvantages}>
          {ADVANTAGES.map((adv, i) => {
            const IconComp = adv.icon
            return (
              <div key={i} className={styles.advantageCard}>
                <div className={styles.advantageIcon}>
                  {IconComp}
                </div>
                <div className={styles.advantageTitle}>{adv.title}</div>
                <div className={styles.advantageDesc}>{adv.desc}</div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Branches List */}
      <div className={styles.section}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>Филиалы клиники</h2>
        </div>

        {BRANCHES.map((branch) => (
          <div key={branch.id} className={styles.branchCard}>
            <img
              src={branch.image}
              alt={branch.address}
              className={styles.branchImg}
              loading="lazy"
              onError={(e) => {
                // Fallback placeholder background if image loading fails
                ; (e.target as HTMLElement).style.display = 'none'
              }}
            />
            <div className={styles.branchBody}>
              <span className={styles.branchTag}>{branch.badge}</span>
              <div className={styles.branchAddress}>{branch.address}</div>
              <div className={styles.branchDesc}>{branch.desc}</div>
              <div className={styles.branchMetaRow}>
                {IconClock}
                <span>{branch.hours}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Contact & Hours Info Card */}
      <div className={styles.section}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>Контакты и график работы</h2>
        </div>

        <div className={styles.contactsCard}>
          <div className={styles.contactRow}>
            <div className={styles.contactIcon}>{IconPhone}</div>
            <div>
              <div className={styles.contactLabel}>Единый справочный телефон</div>
              <a
                href="tel:+74212488888"
                className={styles.contactValue}
                style={{ color: 'var(--red, #e3232a)', textDecoration: 'none', display: 'inline-block' }}
              >
                +7 (4212) 48-88-88
              </a>
              <div className={styles.contactSubValue}>Единый многоканальный номер клиники</div>
            </div>
          </div>

          <div className={styles.contactRow}>
            <div className={styles.contactIcon}>{IconClock}</div>
            <div>
              <div className={styles.contactLabel}>График работы филиалов</div>
              <div className={styles.contactValue} style={{ fontSize: 14 }}>
                Пн–Пт: 08:00 – 21:00
              </div>
              <div className={styles.contactValue} style={{ fontSize: 14, marginTop: 2 }}>
                Сб–Вс: 08:00 – 19:00
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 24 }}>
        <button
          className="btnPrimary"
          onClick={() => navigate('/booking')}
        >
          Записаться на прием
        </button>

        <button
          className="btnGhost"
          style={{ justifyContent: 'center', fontWeight: 600 }}
          onClick={() => window.location.href = 'tel:+74212488888'}
        >
          {IconPhone}
          <span>Позвонить +7 (4212) 48-88-88</span>
        </button>
      </div>
    </div>
  )
}
