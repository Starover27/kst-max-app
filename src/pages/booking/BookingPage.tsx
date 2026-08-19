import { useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import doctors from '../../shared/data/doctors'
import { getNextDays } from '../../shared/utils/dates'
import { setAppointment, useAppointment } from '../../stores/bookingStore'

const TIMES = ['09:00', '09:30', '10:00', '10:30', '11:00', '11:30', '12:00', '12:30', '13:00', '14:30', '15:00', '15:30', '16:00']

function busyTimes(doctorId: string, dateISO: string): string[] {
  // детерминированная "занятость" слотов
  let h = 0
  const seed = doctorId + dateISO
  for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) >>> 0
  return TIMES.filter((_, i) => (h >> (i % 28)) & 1 ? false : (h + i * 7) % 5 === 0)
}

export function BookingPage() {
  const { doctorId } = useParams()
  const nav = useNavigate()
  const appointment = useAppointment()
  const doctor = useMemo(() => doctors.find((d) => d.id === doctorId) ?? (appointment ? doctors.find((d) => d.id === appointment.doctorId) : undefined), [doctorId, appointment])

  const days = useMemo(() => getNextDays(10), [])
  const [dateISO, setDateISO] = useState<string>(() => days[0]?.iso ?? new Date().toISOString().split('T')[0])
  const [time, setTime] = useState<string | null>(null)

  if (!doctor) {
    // выбор врача для записи
    return (
      <div className="page pageWide" style={{ paddingBottom: 96 }}>
        <div style={{ padding: '0 16px' }}>
          <div className="topBar">
            <span className="topBarTitle">Запись к врачу</span>
          </div>
          <p className="muted" style={{ marginBottom: 12 }}>Выберите специалиста</p>
        </div>
        {doctors.map((d) => (
          <div key={d.id} className="doctorCard" onClick={() => nav(`/booking/${d.id}`)}>
            <img className="doctorPhoto" src={d.photo} alt={d.name} />
            <div style={{ flex: 1 }}>
              <div className="doctorName">{d.name}</div>
              <div className="doctorSpec">{d.title}</div>
              <div className="doctorExp">Стаж {d.experience} лет</div>
            </div>
          </div>
        ))}
      </div>
    )
  }

  const busy = busyTimes(doctor.id, dateISO)

  return (
    <div className="page" style={{ paddingBottom: 110 }}>
      <div className="topBar" style={{ padding: '12px 0' }}>
        <button className="iconBtn" aria-label="Назад" onClick={() => nav(-1)}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M15 5l-7 7 7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
        </button>
        <span className="topBarTitle">Запись к врачу</span>
        <span style={{ width: 40 }} />
      </div>

      <div className="card docSummary">
        <img className="doctorPhoto" src={doctor.photo} alt={doctor.name} />
        <div>
          <div className="doctorName">{doctor.name}</div>
          <div className="doctorSpec">{doctor.title}</div>
          <div className="doctorExp">Стаж {doctor.experience} лет</div>
          <div className="rating" style={{ marginTop: 6 }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="var(--red)"><path d="M12 3.5l2.6 5.3 5.9.9-4.2 4.1 1 5.8-5.3-2.8-5.3 2.8 1-5.8L3.5 9.7l5.9-.9z" /></svg>
            {(doctor.rating ?? 5).toFixed(1).replace('.', ',')}
          </div>
        </div>
      </div>

      <h3 className="sectionTitle">Выберите дату и время</h3>

      <div className="dateRow">
        {days.map((d) => (
          <button key={d.iso} className={`dateCell ${dateISO === d.iso ? 'active' : ''}`} onClick={() => { setDateISO(d.iso); setTime(null) }}>
            <span className="wd">{d.weekday}</span>
            <span className="d">{d.day}</span>
            <span className="mo">{d.monthShort}</span>
          </button>
        ))}
      </div>

      <div className="timeGrid">
        {TIMES.map((t) => (
          <button key={t} disabled={busy.includes(t)} className={`timeCell ${time === t ? 'active' : ''}`} onClick={() => setTime(t)}>
            {t}
          </button>
        ))}
      </div>

      <div style={{ position: 'fixed', bottom: 70, left: 0, right: 0, padding: '12px 16px', background: 'linear-gradient(transparent, var(--bg) 40%)', maxWidth: 480, margin: '0 auto' }}>
        <button
          className="btnPrimary"
          disabled={!time}
          onClick={() => {
            if (!time) return
            setAppointment({ doctorId: doctor.id, dateISO, time, cabinet: 'Кабинет 203, 2 этаж' })
            nav('/appointment')
          }}
        >
          {time ? `Записаться на ${time}` : 'Выберите время'}
        </button>
      </div>
    </div>
  )
}
