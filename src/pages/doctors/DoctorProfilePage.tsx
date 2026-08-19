import { useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import doctorPricesData from '../../data/doctor-prices.json'
import doctors from '../../shared/data/doctors'
import { toggleFavorite, useFavorites } from '../../stores/bookingStore'
import styles from './DoctorsPage.module.css'

interface DoctorPriceRecord {
  doctorId: string
  serviceName: string | null
  price: number | null
  status: 'verified' | 'needs_review' | 'not_found'
}

function ProfilePhoto({ photo, name }: { photo: string; name: string }) {
  const [failed, setFailed] = useState(false)
  if (!photo || failed) {
    const initials = name.split(' ').slice(0, 2).map((part) => part[0]).join('')
    return <div className={styles.profilePhotoFallback}>{initials}</div>
  }
  return <img className={styles.profilePhoto} src={photo} alt={name} onError={() => setFailed(true)} />
}

export function DoctorProfilePage() {
  const { doctorId } = useParams()
  const nav = useNavigate()
  const favorites = useFavorites()
  const doctor = useMemo(() => doctors.find((item) => item.id === doctorId), [doctorId])
  const price = useMemo(
    () => (doctorPricesData.records as DoctorPriceRecord[])
      .find((record) => record.doctorId === doctorId && record.status === 'verified' && record.price !== null),
    [doctorId],
  )

  if (!doctor) {
    return (
      <div className="page" style={{ paddingBottom: 96 }}>
        <div className="topBar">
          <button className="iconBtn" aria-label="Назад" onClick={() => nav(-1)}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M15 5l-7 7 7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
          </button>
          <span className="topBarTitle">Профиль врача</span>
          <span style={{ width: 40 }} />
        </div>
        <div className={styles.state} role="alert">
          <strong>Врач не найден</strong>
          <span>Профиль отсутствует в актуальном списке КСТ.</span>
          <button className="chip active" onClick={() => nav('/doctors')}>К списку врачей</button>
        </div>
      </div>
    )
  }

  const favorite = favorites.includes(doctor.id)

  return (
    <div className="page" style={{ paddingBottom: 110 }}>
      <div className="topBar">
        <button className="iconBtn" aria-label="Назад" onClick={() => nav(-1)}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M15 5l-7 7 7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
        </button>
        <span className="topBarTitle">Профиль врача</span>
        <button
          className={`iconBtn ${favorite ? styles.favoriteActive : ''}`}
          aria-label={favorite ? 'Удалить из избранного' : 'Добавить в избранное'}
          aria-pressed={favorite}
          onClick={() => toggleFavorite(doctor.id)}
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill={favorite ? 'currentColor' : 'none'}>
            <path d="M12 20.5C7 16.5 3.5 13 3.5 9.3 3.5 6.4 5.7 4.5 8.3 4.5c1.5 0 2.9.8 3.7 2 .8-1.2 2.2-2 3.7-2 2.6 0 4.8 1.9 4.8 4.8 0 3.7-3.5 7.2-8.5 11.2z" stroke="currentColor" strokeWidth="1.7" />
          </svg>
        </button>
      </div>

      <section className={`card ${styles.profileHeader}`}>
        <ProfilePhoto photo={doctor.photo} name={doctor.name} />
        <div>
          <h1 className={styles.profileName}>{doctor.name}</h1>
          {doctor.title && <p className="doctorSpec">{doctor.title}</p>}
          {doctor.experience !== undefined && <p className="doctorExp">Стаж {doctor.experience} лет</p>}
          {price && <p className={styles.primaryPrice}>Первичный приём · {price.price?.toLocaleString('ru-RU')} ₽</p>}
        </div>
      </section>

      {(doctor.department || doctor.category || doctor.description) && (
        <section className={`card ${styles.profileDetails}`}>
          {doctor.department && <div><span>Направление</span><strong>{doctor.department}</strong></div>}
          {doctor.category && <div><span>Категория</span><strong>{doctor.category}</strong></div>}
          {doctor.description && <p>{doctor.description}</p>}
        </section>
      )}

      <button className="btnPrimary" onClick={() => nav(`/booking/${doctor.id}`)}>Записаться на приём</button>
    </div>
  )
}