import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import doctors from '../../shared/data/doctors'
import doctorPricesData from '../../data/doctor-prices.json'
import { toggleFavorite, useFavorites } from '../../stores/bookingStore'
import styles from './DoctorsPage.module.css'

const ALL_SPECIALISTS = 'Все специалисты'

interface DoctorPriceRecord {
  doctorId: string
  visitType: string
  price: number | null
  currency: string
  status: 'verified' | 'needs_review' | 'not_found'
}

function isDoctorPriceRecord(item: unknown): item is DoctorPriceRecord {
  if (!item || typeof item !== 'object') return false
  const r = item as Record<string, unknown>
  return (
    typeof r.doctorId === 'string' &&
    typeof r.visitType === 'string' &&
    (typeof r.price === 'number' || r.price === null) &&
    typeof r.currency === 'string' &&
    (r.status === 'verified' || r.status === 'needs_review' || r.status === 'not_found')
  )
}

function formatSpecialty(value: string) {
  if (value === value.toUpperCase()) return value
  return value.charAt(0).toUpperCase() + value.slice(1)
}

function DoctorPhoto({ photo, name }: { photo: string; name: string }) {
  const [failed, setFailed] = useState(false)

  if (!photo || failed) {
    const initials = name.split(' ').slice(0, 2).map((part) => part[0]).join('')
    return <div className={`${styles.photoFallback} doctorPhoto`} aria-label={`Нет фотографии: ${name}`}>{initials}</div>
  }

  return <img className="doctorPhoto" src={photo} alt={name} loading="lazy" onError={() => setFailed(true)} />
}

export function DoctorsPage() {
  const nav = useNavigate()
  const [spec, setSpec] = useState(ALL_SPECIALISTS)
  const [searchOpen, setSearchOpen] = useState(false)
  const [query, setQuery] = useState('')
  const favs = useFavorites()
  const loading = false
  const loadError = useMemo(() => {
    if (!Array.isArray(doctors)) return 'Некорректный формат списка врачей'
    return null
  }, [])

  const specialties = useMemo(
    () => [
      ALL_SPECIALISTS,
      ...Array.from(new Set(doctors.flatMap((doctor) => doctor.specialties)))
        .sort((a, b) => a.localeCompare(b, 'ru')),
    ],
    [],
  )

  const pricesByDoctor = useMemo(() => {
    const rawRecords = Array.isArray(doctorPricesData?.records) ? doctorPricesData.records : []
    return new Map(
      rawRecords
        .filter(isDoctorPriceRecord)
        .filter((record) => record.status === 'verified' && record.price !== null)
        .map((record) => [record.doctorId, record]),
    )
  }, [])

  const list = useMemo(() => {
    const normalizedQuery = query.trim().toLocaleLowerCase('ru')

    return doctors.filter((doctor) => {
      const matchesSpecialty = spec === ALL_SPECIALISTS || doctor.specialties.includes(spec)
      const searchableText = [
        doctor.name,
        doctor.title,
        doctor.department,
        doctor.category,
        doctor.description,
        ...doctor.specialties,
      ].filter(Boolean).join(' ').toLocaleLowerCase('ru')

      return matchesSpecialty && (!normalizedQuery || searchableText.includes(normalizedQuery))
    })
  }, [spec, query])

  const clearFilters = () => {
    setSpec(ALL_SPECIALISTS)
    setQuery('')
  }

  return (
    <div className="page pageWide" style={{ paddingBottom: 96 }}>
      <div style={{ padding: '0 16px' }}>
        <div className="topBar">
          <span className="pageTitle">Врачи</span>
          <button className="iconBtn" aria-label={searchOpen ? 'Закрыть поиск' : 'Открыть поиск'} onClick={() => setSearchOpen((v) => !v)}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><circle cx="11" cy="11" r="6.5" stroke="currentColor" strokeWidth="1.8" /><path d="M20 20l-4-4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" /></svg>
          </button>
        </div>
        {searchOpen && (
          <input
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="ФИО, специальность или направление"
            className={styles.searchInput}
            aria-label="Поиск врача"
          />
        )}
      </div>

      <div className="chipsRow">
        {specialties.map((specialty) => (
          <button
            key={specialty}
            className={`chip ${spec === specialty ? 'active' : ''}`}
            onClick={() => setSpec(specialty)}
            aria-pressed={spec === specialty}
          >
            {specialty === ALL_SPECIALISTS ? specialty : formatSpecialty(specialty)}
          </button>
        ))}
      </div>

      {loading && (
        <div className={styles.state} role="status">
          <span className={styles.spinner} aria-hidden="true" />
          Загружаем врачей…
        </div>
      )}

      {!loading && loadError && (
        <div className={styles.state} role="alert">
          <strong>Не удалось загрузить врачей</strong>
          <span>{loadError}</span>
          <button className="chip active" onClick={() => window.location.reload()}>Повторить</button>
        </div>
      )}

      {!loading && !loadError && list.length === 0 && (
        <div className={styles.state}>
          <strong>Врачи не найдены</strong>
          <span>Попробуйте изменить запрос или выбрать другую специальность.</span>
          <button className="chip" onClick={clearFilters}>Сбросить фильтры</button>
        </div>
      )}

      {!loading && !loadError && list.map((d) => {
        const primaryPrice = pricesByDoctor.get(d.id)

        return (
        <article
          key={d.id}
          className="doctorCard"
          onClick={() => nav(`/doctors/${d.id}`)}
          onKeyDown={(event) => {
            if (event.target === event.currentTarget && (event.key === 'Enter' || event.key === ' ')) {
              event.preventDefault()
              nav(`/doctors/${d.id}`)
            }
          }}
          role="link"
          tabIndex={0}
          aria-label={`Открыть профиль врача ${d.name}`}
        >
          <DoctorPhoto photo={d.photo} name={d.name} />
          <div style={{ flex: 1, minWidth: 0, paddingRight: 26 }}>
            <div className="doctorName">{d.name}</div>
            <div className="doctorSpec">{d.title}</div>
            {d.experience !== undefined && <div className="doctorExp">Стаж {d.experience} лет</div>}
            {primaryPrice && (
              <div className={styles.primaryPrice}>Первичный приём · {primaryPrice.price?.toLocaleString('ru-RU')} ₽</div>
            )}
          </div>
          <button
            className={`favBtn ${favs.includes(d.id) ? 'active' : ''}`}
            aria-label={favs.includes(d.id) ? `Удалить ${d.name} из избранного` : `Добавить ${d.name} в избранное`}
            aria-pressed={favs.includes(d.id)}
            onClick={(e) => {
              e.stopPropagation()
              toggleFavorite(d.id)
            }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill={favs.includes(d.id) ? 'currentColor' : 'none'}>
              <path d="M12 20.5C7 16.5 3.5 13 3.5 9.3 3.5 6.4 5.7 4.5 8.3 4.5c1.5 0 2.9.8 3.7 2 .8-1.2 2.2-2 3.7-2 2.6 0 4.8 1.9 4.8 4.8 0 3.7-3.5 7.2-8.5 11.2z" stroke="currentColor" strokeWidth="1.7" />
            </svg>
          </button>
        </article>
      )})}
    </div>
  )
}
