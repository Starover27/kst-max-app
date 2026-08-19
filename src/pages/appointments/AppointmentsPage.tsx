import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import doctors from '../../shared/data/doctors'
import { formatDateParts } from '../../shared/utils/dates'
import { setAppointment, useAppointment } from '../../stores/bookingStore'
import { Modal } from '../../shared/ui/Modal'

export function AppointmentPage() {
  const nav = useNavigate()
  const appointment = useAppointment()
  const [remind, setRemind] = useState(true)
  const [confirmCancel, setConfirmCancel] = useState(false)
  const [toast, setToast] = useState<string | null>(null)

  const notify = (msg: string) => {
    setToast(msg)
    window.setTimeout(() => setToast(null), 2200)
  }

  if (!appointment) {
    return (
      <div className="page" style={{ paddingBottom: 96 }}>
        <div className="topBar" style={{ padding: '12px 0' }}>
          <button className="iconBtn" aria-label="Назад" onClick={() => nav(-1)}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M15 5l-7 7 7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
          </button>
          <span className="topBarTitle">Моя запись</span>
          <span style={{ width: 40 }} />
        </div>
        <div className="empty">
          У вас пока нет активных записей.
          <button className="btnPrimary" style={{ marginTop: 16 }} onClick={() => nav('/doctors')}>Записаться к врачу</button>
        </div>
      </div>
    )
  }

  const doctor = doctors.find((d) => d.id === appointment.doctorId)
  const date = formatDateParts(appointment.dateISO)
  const shortName = doctor ? `${doctor.name.split(' ')[0]} ${doctor.name.split(' ')[1]?.[0]}. ${doctor.name.split(' ')[2]?.[0]}.` : ''

  return (
    <div className="page" style={{ paddingBottom: 96 }}>
      <div className="topBar" style={{ padding: '12px 0' }}>
        <button className="iconBtn" aria-label="Назад" onClick={() => nav(-1)}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M15 5l-7 7 7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
        </button>
        <span className="topBarTitle">Моя запись</span>
        <span style={{ width: 40 }} />
      </div>

      <div className="apptHero">
        <div>
          <div className="day">{date.day}</div>
          <div className="month">{date.monthLong}</div>
        </div>
        <div className="apptInfo">
          <span className="big">Сегодня в {appointment.time}</span>
          <span>{shortName}</span>
          <span>{doctor?.title}</span>
          <span>{appointment.cabinet}</span>
        </div>
        <svg style={{ position: 'absolute', right: 10, bottom: 10, opacity: 0.5 }} width="90" height="40" viewBox="0 0 90 40" fill="none">
          <path d="M0 20h25l6-12 8 24 6-12h45" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>

      <div className="card" style={{ marginTop: 14 }}>
        <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 6 }}>О приёме</h3>
        <div className="infoRow"><span className="k">Причина обращения</span><span className="v">Консультация</span></div>
        <div className="infoRow"><span className="k">Длительность приёма</span><span className="v">30 минут</span></div>
        <div className="infoRow"><span className="k">Стоимость приёма</span><span className="v">{(doctor?.price ?? 2000).toLocaleString('ru-RU')} ₽</span></div>
        <div className="infoRow"><span className="k">Статус записи</span><span className="v">Подтверждена</span></div>
      </div>

      <div className="card" style={{ marginTop: 12, padding: '4px 12px' }}>
        <button className="actionRow" onClick={() => nav(`/booking/${appointment.doctorId}`)}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><rect x="4" y="5" width="16" height="16" rx="2.5" stroke="var(--orange)" strokeWidth="1.7" /><path d="M9 3v4M15 3v4" stroke="var(--orange)" strokeWidth="1.7" strokeLinecap="round" /><path d="M14.5 12.5l-3 3 1 1 3-3z" fill="var(--orange)" /></svg>
          Перенести запись
        </button>
        <button className="actionRow danger" onClick={() => setConfirmCancel(true)} style={{ borderTop: '1px solid var(--border)' }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="8.5" stroke="var(--red)" strokeWidth="1.7" /><path d="M9.5 9.5l5 5M14.5 9.5l-5 5" stroke="var(--red)" strokeWidth="1.7" strokeLinecap="round" /></svg>
          Отменить запись
        </button>
      </div>

      <div className="card" style={{ marginTop: 12, display: 'flex', alignItems: 'center', gap: 12 }}>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 14, fontWeight: 600 }}>Напомнить о приёме</div>
          <div className="muted" style={{ fontSize: 12, marginTop: 2 }}>Мы напомним вам о приёме за день до визита</div>
        </div>
        <button className={`toggle ${remind ? 'on' : ''}`} aria-label="Напоминание" onClick={() => setRemind((v) => !v)} />
      </div>

      {confirmCancel && (
        <Modal title="Отмена записи" onClose={() => setConfirmCancel(false)}>
          <p>Отменить запись на {date.day} {date.monthLong} в {appointment.time}?</p>
          <div style={{ display: 'flex', gap: 10, marginTop: 16 }}>
            <button className="btnGhost" style={{ flex: 1 }} onClick={() => setConfirmCancel(false)}>Нет</button>
            <button
              className="btnPrimary"
              style={{ flex: 1, background: 'var(--red)' }}
              onClick={() => {
                setAppointment(null)
                setConfirmCancel(false)
                notify('Запись отменена')
              }}
            >
              Да, отменить
            </button>
          </div>
        </Modal>
      )}

      {toast && <div className="toast">{toast}</div>}
    </div>
  )
}
