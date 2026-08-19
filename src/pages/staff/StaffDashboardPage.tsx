import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAppStore } from '../../stores/appStore'
import { getMockDoctorShift, getMockSalary } from '../../shared/api/medregService'

const stroke = { stroke: 'currentColor', strokeWidth: 1.7, strokeLinecap: 'round', strokeLinejoin: 'round' } as const

const IconBack = (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
    <path d="M15 19l-7-7 7-7" {...stroke} />
  </svg>
)

const IconCheck = (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
    <path d="M5 13l4 4L19 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

type StaffTab = 'schedule' | 'sickleave' | 'salary' | 'tax' | 'vacation'

export default function StaffDashboardPage() {
  const navigate = useNavigate()
  const user = useAppStore((state) => state.user)
  const [activeTab, setActiveTab] = useState<StaffTab>('schedule')

  // Shift & Appointments state
  const shift = getMockDoctorShift()
  const [appointments, setAppointments] = useState(shift.appointments)
  const [notificationsEnabled, setNotificationsEnabled] = useState(true)

  // Sick leave state
  const [slStart, setSlStart] = useState('2025-03-01')
  const [slEnd, setSlEnd] = useState('2025-03-07')
  const [slNumber, setSlNumber] = useState('')
  const [slReason, setSlReason] = useState('ОРВИ / повышенная температура')
  const [slSent, setSlSent] = useState(false)

  // Salary state
  const salary = getMockSalary()
  const [salaryNotifSent, setSalaryNotifSent] = useState(false)

  // Tax certificate state
  const [taxYears, setTaxYears] = useState<string[]>(['2024'])
  const [taxBranch, setTaxBranch] = useState('ул. Шеронова, 6')
  const [taxSent, setTaxSent] = useState(false)

  // Vacation state
  const [vacType, setVacType] = useState<'paid_annual' | 'unpaid' | 'business_trip'>('paid_annual')
  const [vacStart, setVacStart] = useState('2025-06-01')
  const [vacEnd, setVacEnd] = useState('2025-06-14')
  const [vacComment, setVacComment] = useState('')
  const [vacSubmitted, setVacSubmitted] = useState(false)

  // Calculate vacation days
  const calculateDays = () => {
    try {
      const d1 = new Date(vacStart)
      const d2 = new Date(vacEnd)
      const diff = Math.ceil((d2.getTime() - d1.getTime()) / (1000 * 60 * 60 * 24)) + 1
      return diff > 0 ? diff : 0
    } catch {
      return 0
    }
  }

  const handleUpdateStatus = (appId: string, newStatus: 'waiting' | 'in_progress' | 'completed' | 'canceled') => {
    setAppointments((prev) =>
      prev.map((a) => (a.id === appId ? { ...a, status: newStatus } : a))
    )
  }

  return (
    <div className="page" style={{ paddingBottom: 96 }}>
      {/* Top Bar */}
      <div className="topBar">
        <button className="iconBtn" aria-label="Назад" onClick={() => navigate(-1)}>
          {IconBack}
        </button>
        <span className="topBarTitle">Кабинет сотрудника КСТ</span>
        <span style={{ width: 40 }} />
      </div>

      {/* Staff Doctor Header Card */}
      <div
        style={{
          background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
          color: '#fff',
          borderRadius: 18,
          padding: '16px 18px',
          marginBottom: 16,
          boxShadow: '0 8px 20px rgba(15,23,42,0.15)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <div style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: 1, color: '#38bdf8', fontWeight: 700 }}>
              КСТ · ВРАЧЕБНЫЙ ДОСТУП
            </div>
            <div style={{ fontSize: 17, fontWeight: 700, marginTop: 4 }}>
              {user?.fullName || 'Петров Денис Викторович'}
            </div>
            <div style={{ fontSize: 13, color: '#94a3b8', marginTop: 2 }}>
              {user?.position || 'Врач-терапевт высшей категории'} · {user?.branch || 'Шеронова, 6'} (Каб. 204)
            </div>
          </div>
          <div
            style={{
              background: '#0284c7',
              color: '#fff',
              padding: '6px 10px',
              borderRadius: 10,
              fontSize: 12,
              fontWeight: 700,
              textAlign: 'center',
            }}
          >
            Смена active
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div
        style={{
          display: 'flex',
          gap: 6,
          overflowX: 'auto',
          paddingBottom: 8,
          marginBottom: 16,
          scrollbarWidth: 'none',
        }}
      >
        <button
          type="button"
          onClick={() => setActiveTab('schedule')}
          style={{
            padding: '8px 12px',
            borderRadius: 10,
            fontSize: 13,
            fontWeight: 600,
            border: 'none',
            whiteSpace: 'nowrap',
            cursor: 'pointer',
            background: activeTab === 'schedule' ? 'var(--red, #e11d48)' : 'var(--border, #eee)',
            color: activeTab === 'schedule' ? '#fff' : 'var(--text, #111)',
          }}
        >
          1. Приёмы и смена
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('sickleave')}
          style={{
            padding: '8px 12px',
            borderRadius: 10,
            fontSize: 13,
            fontWeight: 600,
            border: 'none',
            whiteSpace: 'nowrap',
            cursor: 'pointer',
            background: activeTab === 'sickleave' ? 'var(--red, #e11d48)' : 'var(--border, #eee)',
            color: activeTab === 'sickleave' ? '#fff' : 'var(--text, #111)',
          }}
        >
          2. Больничный лист (БЛ)
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('salary')}
          style={{
            padding: '8px 12px',
            borderRadius: 10,
            fontSize: 13,
            fontWeight: 600,
            border: 'none',
            whiteSpace: 'nowrap',
            cursor: 'pointer',
            background: activeTab === 'salary' ? 'var(--red, #e11d48)' : 'var(--border, #eee)',
            color: activeTab === 'salary' ? '#fff' : 'var(--text, #111)',
          }}
        >
          3. Зарплата
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('tax')}
          style={{
            padding: '8px 12px',
            borderRadius: 10,
            fontSize: 13,
            fontWeight: 600,
            border: 'none',
            whiteSpace: 'nowrap',
            cursor: 'pointer',
            background: activeTab === 'tax' ? 'var(--red, #e11d48)' : 'var(--border, #eee)',
            color: activeTab === 'tax' ? '#fff' : 'var(--text, #111)',
          }}
        >
          4. Справка в налоговую
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('vacation')}
          style={{
            padding: '8px 12px',
            borderRadius: 10,
            fontSize: 13,
            fontWeight: 600,
            border: 'none',
            whiteSpace: 'nowrap',
            cursor: 'pointer',
            background: activeTab === 'vacation' ? 'var(--red, #e11d48)' : 'var(--border, #eee)',
            color: activeTab === 'vacation' ? '#fff' : 'var(--text, #111)',
          }}
        >
          5. Заявление на отпуск
        </button>
      </div>

      {/* TAB 1: SCHEDULE & APPOINTMENTS */}
      {activeTab === 'schedule' && (
        <div>
          {/* Shift info */}
          <div
            style={{
              background: '#f0fdf4',
              border: '1px solid #bbf7d0',
              borderRadius: 14,
              padding: 14,
              marginBottom: 16,
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <div>
              <div style={{ fontSize: 13, fontWeight: 700, color: '#166534' }}>
                Сегодня: {shift.date}
              </div>
              <div style={{ fontSize: 12, color: '#15803d', marginTop: 2 }}>
                Смена: {shift.shiftStart} – {shift.shiftEnd} · {shift.cabinet}
              </div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: 15, fontWeight: 800, color: '#166534' }}>
                {appointments.filter((a) => a.status === 'completed').length} / {appointments.length}
              </div>
              <div style={{ fontSize: 11, color: '#15803d' }}>принято пациентов</div>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <span style={{ fontSize: 14, fontWeight: 700 }}>Список пациентов на приём:</span>
            <label style={{ fontSize: 12, display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer', color: 'var(--muted)' }}>
              <input
                type="checkbox"
                checked={notificationsEnabled}
                onChange={(e) => setNotificationsEnabled(e.target.checked)}
              />
              Уведомления о приёме
            </label>
          </div>

          {/* List of appointments */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {appointments.map((app) => (
              <div
                key={app.id}
                style={{
                  background: 'var(--surface, #fff)',
                  border: '1px solid var(--border, #eee)',
                  borderRadius: 14,
                  padding: '12px 14px',
                  boxShadow: '0 2px 6px rgba(0,0,0,0.03)',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <span
                      style={{
                        background: '#f1f5f9',
                        padding: '3px 8px',
                        borderRadius: 6,
                        fontSize: 12,
                        fontWeight: 700,
                        color: '#334155',
                      }}
                    >
                      {app.time}
                    </span>
                    <div style={{ fontSize: 14, fontWeight: 700, marginTop: 6, color: 'var(--text)' }}>
                      {app.patientName} ({app.birthYear} г.р.)
                    </div>
                    <div style={{ fontSize: 12, color: 'var(--muted)', marginTop: 2 }}>
                      {app.serviceName}
                    </div>
                    <div style={{ fontSize: 12, color: '#2563eb', marginTop: 2 }}>
                      {app.patientPhone}
                    </div>
                    {app.notes && (
                      <div style={{ fontSize: 12, color: '#d97706', marginTop: 4, fontWeight: 500 }}>
                        Примечание: {app.notes}
                      </div>
                    )}
                  </div>
                  <div>
                    {app.status === 'completed' && (
                      <span style={{ background: '#dcfce7', color: '#15803d', padding: '4px 8px', borderRadius: 8, fontSize: 11, fontWeight: 700 }}>
                        Завершён
                      </span>
                    )}
                    {app.status === 'in_progress' && (
                      <span style={{ background: '#dbeafe', color: '#1d4ed8', padding: '4px 8px', borderRadius: 8, fontSize: 11, fontWeight: 700 }}>
                        В кабинете
                      </span>
                    )}
                    {app.status === 'waiting' && (
                      <span style={{ background: '#fef3c7', color: '#b45309', padding: '4px 8px', borderRadius: 8, fontSize: 11, fontWeight: 700 }}>
                        Ожидает
                      </span>
                    )}
                  </div>
                </div>

                {/* Status action buttons */}
                <div style={{ display: 'flex', gap: 8, marginTop: 10, paddingTop: 8, borderTop: '1px solid #f1f5f9' }}>
                  {app.status !== 'in_progress' && app.status !== 'completed' && (
                    <button
                      type="button"
                      onClick={() => handleUpdateStatus(app.id, 'in_progress')}
                      style={{
                        flex: 1,
                        padding: '6px 10px',
                        borderRadius: 8,
                        background: '#2563eb',
                        color: '#fff',
                        border: 'none',
                        fontSize: 12,
                        fontWeight: 600,
                        cursor: 'pointer',
                      }}
                    >
                      Вызвать в кабинет
                    </button>
                  )}
                  {app.status !== 'completed' && (
                    <button
                      type="button"
                      onClick={() => handleUpdateStatus(app.id, 'completed')}
                      style={{
                        flex: 1,
                        padding: '6px 10px',
                        borderRadius: 8,
                        background: '#16a34a',
                        color: '#fff',
                        border: 'none',
                        fontSize: 12,
                        fontWeight: 600,
                        cursor: 'pointer',
                      }}
                    >
                      Завершить приём
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 2: SICK LEAVE TO CALL CENTER */}
      {activeTab === 'sickleave' && (
        <div>
          <div
            style={{
              background: '#fef2f2',
              border: '1px solid #fecaca',
              borderRadius: 14,
              padding: 14,
              marginBottom: 16,
            }}
          >
            <div style={{ fontSize: 14, fontWeight: 700, color: '#991b1b' }}>
              Информирование колл-центра и регистратуры
            </div>
            <div style={{ fontSize: 12, color: '#b91c1c', marginTop: 4 }}>
              При открытии больничного листа МИС Медрег автоматически заблокирует запись и сформирует список пациентов для срочного обзвона и переноса приёмов.
            </div>
          </div>

          {slSent ? (
            <div style={{ background: '#ecfdf5', border: '1px solid #a7f3d0', padding: 18, borderRadius: 16, textAlign: 'center' }}>
              <div style={{ color: '#059669', marginBottom: 8 }}>{IconCheck}</div>
              <div style={{ fontSize: 16, fontWeight: 700, color: '#065f46' }}>Информация передана в колл-центр!</div>
              <div style={{ fontSize: 13, color: '#047857', marginTop: 6 }}>
                Записи пациентов на период {slStart} – {slEnd} заблокированы. Регистратура начала обзвон пациентов.
              </div>
              <button
                type="button"
                className="btnPrimary"
                style={{ marginTop: 14 }}
                onClick={() => setSlSent(false)}
              >
                Подать другое уведомление
              </button>
            </div>
          ) : (
            <form
              onSubmit={(e) => {
                e.preventDefault()
                setSlSent(true)
              }}
            >
              <div className="taxForm" style={{ margin: 0 }}>
                <div className="taxFormSection">
                  <div className="taxField">
                    <label className="taxLabel">Дата начала нетрудоспособности</label>
                    <input
                      type="date"
                      className="taxInput"
                      value={slStart}
                      onChange={(e) => setSlStart(e.target.value)}
                      required
                    />
                  </div>

                  <div className="taxField">
                    <label className="taxLabel">Планируемая дата окончания (включительно)</label>
                    <input
                      type="date"
                      className="taxInput"
                      value={slEnd}
                      onChange={(e) => setSlEnd(e.target.value)}
                      required
                    />
                  </div>

                  <div className="taxField">
                    <label className="taxLabel">Номер ЭЛН (электронного больничного, если открыт)</label>
                    <input
                      type="text"
                      className="taxInput"
                      value={slNumber}
                      onChange={(e) => setSlNumber(e.target.value)}
                      placeholder="999000123456"
                    />
                  </div>

                  <div className="taxField">
                    <label className="taxLabel">Причина / Комментарий для колл-центра</label>
                    <textarea
                      className="taxInput"
                      rows={3}
                      value={slReason}
                      onChange={(e) => setSlReason(e.target.value)}
                      placeholder="Укажите симптомы или инструкции для переноса пациентов"
                      required
                    />
                  </div>
                </div>
              </div>

              <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 12, padding: 12, margin: '14px 0', fontSize: 13, color: '#475569' }}>
                ⚠️ Будет отменено/перенесено: <strong>14 записей пациентов</strong> на филиале Шеронова, 6.
              </div>

              <button type="submit" className="btnPrimary" style={{ width: '100%', padding: 14, fontSize: 15, fontWeight: 700 }}>
                Отправить в колл-центр и регистратуру
              </button>
            </form>
          )}
        </div>
      )}

      {/* TAB 3: SALARY REMINDERS & STUB */}
      {activeTab === 'salary' && (
        <div>
          <div
            style={{
              background: 'linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)',
              border: '1px solid #86efac',
              borderRadius: 16,
              padding: 18,
              marginBottom: 16,
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ fontSize: 12, color: '#166534', fontWeight: 600 }}>Расчётный период</div>
                <div style={{ fontSize: 17, fontWeight: 800, color: '#14532d', marginTop: 2 }}>{salary.month}</div>
              </div>
              <span style={{ background: '#16a34a', color: '#fff', padding: '4px 10px', borderRadius: 8, fontSize: 12, fontWeight: 700 }}>
                Готова к выдаче
              </span>
            </div>

            <div style={{ marginTop: 14, paddingTop: 12, borderTop: '1px dashed #86efac', display: 'flex', justifyContent: 'space-between' }}>
              <div>
                <div style={{ fontSize: 11, color: '#166534' }}>Базовый оклад</div>
                <div style={{ fontSize: 14, fontWeight: 700, color: '#14532d' }}>{salary.baseSalary.toLocaleString()} ₽</div>
              </div>
              <div>
                <div style={{ fontSize: 11, color: '#166534' }}>Приёмы и бонусы</div>
                <div style={{ fontSize: 14, fontWeight: 700, color: '#14532d' }}>+{salary.visitBonuses.toLocaleString()} ₽</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: 11, color: '#166534' }}>К выплате</div>
                <div style={{ fontSize: 16, fontWeight: 900, color: '#14532d' }}>{salary.totalAmount.toLocaleString()} ₽</div>
              </div>
            </div>
          </div>

          <div style={{ background: '#f9fafb', border: '1px solid #e5e7eb', borderRadius: 14, padding: 14, marginBottom: 16 }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: '#111827', marginBottom: 6 }}>
              График выплат клиники:
            </div>
            <div style={{ fontSize: 12, color: '#4b5563', lineHeight: 1.6 }}>
              • Аванс: <strong>25-го числа</strong> каждого месяца<br />
              • Окончательный расчёт: <strong>10-го числа</strong> следующего месяца<br />
              • Место получения: Касса бухгалтерии (Шеронова 6, 3 этаж) / на карту МИР
            </div>
          </div>

          {salaryNotifSent ? (
            <div style={{ background: '#ecfdf5', border: '1px solid #a7f3d0', padding: 12, borderRadius: 12, color: '#065f46', fontSize: 13, display: 'flex', alignItems: 'center', gap: 8 }}>
              {IconCheck}
              <span>Напоминание о выдаче зарплаты отправлено в Telegram/MAX бот!</span>
            </div>
          ) : (
            <button
              type="button"
              className="btnPrimary"
              style={{ width: '100%', padding: 14, fontSize: 15, fontWeight: 700 }}
              onClick={() => {
                setSalaryNotifSent(true)
                setTimeout(() => setSalaryNotifSent(false), 5000)
              }}
            >
              🔔 Отправить напоминание о получении зарплаты в бот
            </button>
          )}
        </div>
      )}

      {/* TAB 4: TAX CERTIFICATES FOR STAFF */}
      {activeTab === 'tax' && (
        <div>
          <div style={{ background: '#fef2f2', border: '1px solid #fee2e2', borderRadius: 14, padding: 14, marginBottom: 16 }}>
            <div style={{ fontSize: 14, fontWeight: 700, color: '#991b1b' }}>
              Справка для налогового вычета сотрудника
            </div>
            <div style={{ fontSize: 12, color: '#b91c1c', marginTop: 4 }}>
              Ускоренный заказ справки об оплате медицинских услуг для себя или членов семьи с корпоративным учётом.
            </div>
          </div>

          {taxSent ? (
            <div style={{ background: '#ecfdf5', border: '1px solid #a7f3d0', padding: 18, borderRadius: 16, textAlign: 'center' }}>
              <div style={{ color: '#059669', marginBottom: 8 }}>{IconCheck}</div>
              <div style={{ fontSize: 16, fontWeight: 700, color: '#065f46' }}>Заявление принято бухгалтерией!</div>
              <div style={{ fontSize: 13, color: '#047857', marginTop: 6 }}>
                Справка за {taxYears.join(', ')} будет готова в течение 2 рабочих дней. Вы получите уведомление в бот.
              </div>
              <button
                type="button"
                className="btnPrimary"
                style={{ marginTop: 14 }}
                onClick={() => setTaxSent(false)}
              >
                Заказать ещё одну справку
              </button>
            </div>
          ) : (
            <form
              onSubmit={(e) => {
                e.preventDefault()
                setTaxSent(true)
              }}
            >
              <div className="taxForm" style={{ margin: 0 }}>
                <div className="taxFormSection">
                  <div className="taxField">
                    <label className="taxLabel">Сотрудник (ФИО)</label>
                    <input type="text" className="taxInput" value={user?.fullName || 'Петров Денис Викторович'} readOnly />
                  </div>

                  <div className="taxField">
                    <label className="taxLabel">Отчётные годы</label>
                    <div style={{ display: 'flex', gap: 8, marginTop: 4 }}>
                      {['2022', '2023', '2024', '2025'].map((yr) => (
                        <button
                          key={yr}
                          type="button"
                          onClick={() => {
                            setTaxYears((prev) =>
                              prev.includes(yr) ? prev.filter((y) => y !== yr) : [...prev, yr]
                            )
                          }}
                          style={{
                            flex: 1,
                            padding: '8px',
                            borderRadius: 8,
                            fontSize: 13,
                            fontWeight: 700,
                            border: taxYears.includes(yr) ? '2px solid var(--red, #e11d48)' : '1px solid #d1d5db',
                            background: taxYears.includes(yr) ? 'var(--red-light, #FBEAEA)' : '#fff',
                            color: taxYears.includes(yr) ? 'var(--red, #e11d48)' : '#374151',
                            cursor: 'pointer',
                          }}
                        >
                          {yr}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="taxField">
                    <label className="taxLabel">Филиал для получения готовой справки</label>
                    <select
                      className="taxInput"
                      value={taxBranch}
                      onChange={(e) => setTaxBranch(e.target.value)}
                    >
                      <option value="ул. Шеронова, 6">ул. Шеронова, 6 (Взрослое отделение)</option>
                      <option value="ул. Шеронова, 8 к. 3">ул. Шеронова, 8 к. 3 (Детское отделение)</option>
                      <option value="ул. Руднева, 17">ул. Руднева, 17 (Многопрофильная клиника)</option>
                      <option value="Электронно (на email и в бот)">Электронный скан (в бот и на почту)</option>
                    </select>
                  </div>
                </div>
              </div>

              <button type="submit" className="btnPrimary" style={{ width: '100%', marginTop: 14, padding: 14, fontSize: 15, fontWeight: 700 }}>
                Заказать справку в бухгалтерии
              </button>
            </form>
          )}
        </div>
      )}

      {/* TAB 5: AUTOMATED VACATION APPLICATION */}
      {activeTab === 'vacation' && (
        <div>
          <div style={{ background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: 14, padding: 14, marginBottom: 16 }}>
            <div style={{ fontSize: 14, fontWeight: 700, color: '#1e40af' }}>
              Автоматическое формирование заявления на отпуск
            </div>
            <div style={{ fontSize: 12, color: '#2563eb', marginTop: 4 }}>
              Выберите тип отпуска и даты. Система автоматически подсчитает количество дней и сформирует официальный документ для отдела кадров и главного врача.
            </div>
          </div>

          {vacSubmitted ? (
            <div style={{ background: '#ecfdf5', border: '1px solid #a7f3d0', padding: 18, borderRadius: 16, textAlign: 'center' }}>
              <div style={{ color: '#059669', marginBottom: 8 }}>{IconCheck}</div>
              <div style={{ fontSize: 16, fontWeight: 700, color: '#065f46' }}>Заявление успешно сформировано и передано в отдел кадров!</div>
              <div style={{ fontSize: 13, color: '#047857', marginTop: 6 }}>
                Срок: {vacStart} – {vacEnd} ({calculateDays()} календарных дней).
              </div>
              <button
                type="button"
                className="btnPrimary"
                style={{ marginTop: 14 }}
                onClick={() => setVacSubmitted(false)}
              >
                Сформировать новое заявление
              </button>
            </div>
          ) : (
            <form
              onSubmit={(e) => {
                e.preventDefault()
                setVacSubmitted(true)
              }}
            >
              <div className="taxForm" style={{ margin: 0 }}>
                <div className="taxFormSection">
                  <div className="taxField">
                    <label className="taxLabel">Тип заявления</label>
                    <select
                      className="taxInput"
                      value={vacType}
                      onChange={(e) => setVacType(e.target.value as 'paid_annual' | 'unpaid' | 'business_trip')}
                    >
                      <option value="paid_annual">Ежегодный оплачиваемый отпуск</option>
                      <option value="unpaid">Отпуск без сохранения заработной платы (за свой счёт)</option>
                      <option value="business_trip">Служебная командировка / повышение квалификации</option>
                    </select>
                  </div>

                  <div className="taxField">
                    <label className="taxLabel">Дата начала</label>
                    <input
                      type="date"
                      className="taxInput"
                      value={vacStart}
                      onChange={(e) => setVacStart(e.target.value)}
                      required
                    />
                  </div>

                  <div className="taxField">
                    <label className="taxLabel">Дата окончания (включительно)</label>
                    <input
                      type="date"
                      className="taxInput"
                      value={vacEnd}
                      onChange={(e) => setVacEnd(e.target.value)}
                      required
                    />
                  </div>

                  <div className="taxField">
                    <label className="taxLabel">Количество календарных дней</label>
                    <input
                      type="text"
                      className="taxInput"
                      value={`${calculateDays()} дн.`}
                      readOnly
                      style={{ fontWeight: 700, color: 'var(--red, #e11d48)' }}
                    />
                  </div>

                  <div className="taxField">
                    <label className="taxLabel">Обоснование / примечание (по необходимости)</label>
                    <input
                      type="text"
                      className="taxInput"
                      value={vacComment}
                      onChange={(e) => setVacComment(e.target.value)}
                      placeholder="По семейным обстоятельствам / конференция в Москве"
                    />
                  </div>
                </div>
              </div>

              {/* Live Preview of Application */}
              <div
                style={{
                  background: '#ffffff',
                  border: '1px solid #cbd5e1',
                  borderRadius: 12,
                  padding: '14px 16px',
                  margin: '14px 0',
                  fontSize: 12,
                  lineHeight: 1.6,
                  color: '#334155',
                  fontFamily: 'serif',
                }}
              >
                <div style={{ textAlign: 'right', marginBottom: 10 }}>
                  Главному врачу ООО «КСТ»<br />
                  от {user?.position || 'Врача-терапевта'}<br />
                  <strong>{user?.fullName || 'Петрова Д.В.'}</strong>
                </div>
                <div style={{ textAlign: 'center', fontWeight: 700, margin: '8px 0' }}>
                  ЗАЯВЛЕНИЕ
                </div>
                <div>
                  Прошу предоставить мне{' '}
                  {vacType === 'paid_annual'
                    ? 'ежегодный оплачиваемый отпуск'
                    : vacType === 'unpaid'
                      ? 'отпуск без сохранения заработной платы'
                      : 'направление в служебную командировку'}{' '}
                  продолжительностью <strong>{calculateDays()} календарных дней</strong> с {vacStart} по {vacEnd}.
                  {vacComment && <div>Причина: {vacComment}</div>}
                </div>
              </div>

              <button type="submit" className="btnPrimary" style={{ width: '100%', padding: 14, fontSize: 15, fontWeight: 700 }}>
                Подписать и отправить в отдел кадров
              </button>
            </form>
          )}
        </div>
      )}
    </div>
  )
}
