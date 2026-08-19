import { useState, useCallback, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'

/* ─── SVG icons ─── */
const stroke = { stroke: 'currentColor', strokeWidth: 1.7, strokeLinecap: 'round', strokeLinejoin: 'round' } as const

const IconBack = (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
    <path d="M15 19l-7-7 7-7" {...stroke} />
  </svg>
)

const IconCheck = (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
    <path d="M5 13l4 4L19 7" {...stroke} strokeWidth={2.2} />
  </svg>
)

/* ─── Constants ─── */
type ClinicAddress = 'sher6-8' | 'rudneva17'

const CLINIC_ADDRESSES: { key: ClinicAddress; label: string }[] = [
  { key: 'sher6-8', label: 'Выбор Шеронова 6/8' },
  { key: 'rudneva17', label: 'Руднева 17' },
]

type DeliveryMethod = 'sher8k3' | 'sher6' | 'rudneva17' | 'email' | 'cabinet'

const DELIVERY_METHODS: { key: DeliveryMethod; label: string }[] = [
  { key: 'sher8k3', label: 'Шеронова 8к3' },
  { key: 'sher6', label: 'Шеронова 6' },
  { key: 'rudneva17', label: 'Руднева 17' },
  { key: 'email', label: 'Эл. почта' },
  { key: 'cabinet', label: 'Личный кабинет' },
]

/* ─── Types ─── */
interface YearData {
  id: number
  year: string
  amount: string
}

interface FormData {
  fullName: string
  phone: string
  clinicAddress: ClinicAddress | ''
  birthDate: string
  deliveryMethod: DeliveryMethod | ''
  inn: string
  taxpayerFullName: string
  patientFullName: string
  isChild: boolean | null
  patientInn: string
  patientBirthDate: string
  years: YearData[]
}

type FieldErrors = Partial<Record<keyof FormData, string>>

/* ─── Helpers ─── */
let nextYearId = 1

function createYear(): YearData {
  return { id: nextYearId++, year: '', amount: '' }
}

function validatePhone(phone: string): boolean {
  const cleaned = phone.replace(/[\s\-()]/g, '')
  return /^\+?\d{10,12}$/.test(cleaned)
}

function validateInn(inn: string): boolean {
  return /^\d{12}$/.test(inn)
}

function validateDate(date: string): boolean {
  if (!/^\d{2}\.\d{2}\.\d{4}$/.test(date)) return false
  const [d, m, y] = date.split('.').map(Number)
  if (m < 1 || m > 12) return false
  if (d < 1 || d > 31) return false
  if (y < 1900 || y > 2026) return false
  return true
}

function formatPhone(value: string): string {
  const digits = value.replace(/\D/g, '')
  if (digits.length === 0) return ''
  if (digits.startsWith('8') || digits.startsWith('7')) {
    const d = digits.startsWith('8') ? '7' + digits.slice(1) : digits
    const parts = [`+${d[0]}`]
    if (d.length > 1) parts.push(` (${d.slice(1, 4)}`)
    if (d.length > 4) parts.push(`) ${d.slice(4, 7)}`)
    if (d.length > 7) parts.push(`-${d.slice(7, 9)}`)
    if (d.length > 9) parts.push(`-${d.slice(9, 11)}`)
    return parts.join('')
  }
  return value
}

function formatDate(value: string): string {
  const digits = value.replace(/\D/g, '')
  if (digits.length <= 2) return digits
  if (digits.length <= 4) return `${digits.slice(0, 2)}.${digits.slice(2)}`
  return `${digits.slice(0, 2)}.${digits.slice(2, 4)}.${digits.slice(4, 8)}`
}

/* ─── Component ─── */
export default function TaxDeductionPage() {
  const navigate = useNavigate()

  const [form, setForm] = useState<FormData>({
    fullName: '',
    phone: '',
    clinicAddress: '',
    birthDate: '',
    deliveryMethod: '',
    inn: '',
    taxpayerFullName: '',
    patientFullName: '',
    isChild: null,
    patientInn: '',
    patientBirthDate: '',
    years: [createYear()],
  })

  const [errors, setErrors] = useState<FieldErrors>({})
  const [submitted, setSubmitted] = useState(false)
  const [touched, setTouched] = useState<Record<string, boolean>>({})

  /* ─── Field updater ─── */
  const setField = useCallback(<K extends keyof FormData>(key: K, value: FormData[K]) => {
    setForm(prev => ({ ...prev, [key]: value }))
    setErrors(prev => {
      const next = { ...prev }
      delete next[key]
      return next
    })
  }, [])

  const markTouched = useCallback((key: string) => {
    setTouched(prev => ({ ...prev, [key]: true }))
  }, [])

  /* ─── Validation ─── */
  const validate = useCallback((): FieldErrors => {
    const errs: FieldErrors = {}

    if (!form.fullName.trim()) errs.fullName = 'Введите ФИО'
    else if (form.fullName.trim().split(/\s+/).length < 2) errs.fullName = 'Введите минимум фамилию и имя'

    if (!form.phone.trim()) errs.phone = 'Введите номер телефона'
    else if (!validatePhone(form.phone)) errs.phone = 'Неверный формат телефона'

    if (!form.clinicAddress) errs.clinicAddress = 'Выберите адрес клиники'

    if (!form.birthDate.trim()) errs.birthDate = 'Введите дату рождения'
    else if (!validateDate(form.birthDate)) errs.birthDate = 'Формат: ДД.ММ.ГГГГ'

    if (!form.deliveryMethod) errs.deliveryMethod = 'Выберите способ получения'

    if (!form.inn.trim()) errs.inn = 'Введите ИНН'
    else if (!validateInn(form.inn)) errs.inn = 'ИНН должен содержать 12 цифр'

    if (!form.taxpayerFullName.trim()) errs.taxpayerFullName = 'Введите ФИО налогоплательщика'
    else if (form.taxpayerFullName.trim().split(/\s+/).length < 2) errs.taxpayerFullName = 'Введите минимум фамилию и имя'

    if (!form.patientFullName.trim()) errs.patientFullName = 'Введите ФИО пациента'
    else if (form.patientFullName.trim().split(/\s+/).length < 2) errs.patientFullName = 'Введите минимум фамилию и имя'

    if (form.isChild === null) errs.isChild = 'Укажите, является ли пациент ребёнком'

    if (!form.patientInn.trim()) errs.patientInn = 'Введите ИНН пациента'
    else if (!validateInn(form.patientInn)) errs.patientInn = 'ИНН должен содержать 12 цифр'

    if (!form.patientBirthDate.trim()) errs.patientBirthDate = 'Введите дату рождения пациента'
    else if (!validateDate(form.patientBirthDate)) errs.patientBirthDate = 'Формат: ДД.ММ.ГГГГ'

    if (form.years.length === 0) {
      errs.years = 'Добавьте хотя бы один год'
    } else {
      form.years.forEach((yr, i) => {
        if (!yr.year.trim()) errs[`year_${i}` as keyof FormData] = 'Укажите год'
        else if (!/^\d{4}$/.test(yr.year) || +yr.year < 2000 || +yr.year > 2026) errs[`year_${i}` as keyof FormData] = 'Год от 2000 до 2026'
        if (!yr.amount.trim()) errs[`amount_${i}` as keyof FormData] = 'Укажите сумму'
        else if (isNaN(+yr.amount.replace(/\s/g, '')) || +yr.amount.replace(/\s/g, '') <= 0) errs[`amount_${i}` as keyof FormData] = 'Введите корректную сумму'
      })
    }

    return errs
  }, [form])

  /* ─── Submit ─── */
  const handleSubmit = useCallback((e: FormEvent) => {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length > 0) {
      setErrors(errs)
      setTouched({
        fullName: true, phone: true, clinicAddress: true, birthDate: true,
        deliveryMethod: true, inn: true, taxpayerFullName: true, patientFullName: true,
        isChild: true, patientInn: true, patientBirthDate: true,
      })
      return
    }
    // Mock submission
    console.log('[TaxDeduction] Mock submission:', form)
    setSubmitted(true)
  }, [form, validate])

  /* ─── Year management ─── */
  const addYear = useCallback(() => {
    setForm(prev => ({ ...prev, years: [...prev.years, createYear()] }))
  }, [])

  const removeYear = useCallback((id: number) => {
    setForm(prev => ({ ...prev, years: prev.years.filter(y => y.id !== id) }))
  }, [])

  const updateYear = useCallback((id: number, field: 'year' | 'amount', value: string) => {
    setForm(prev => ({
      ...prev,
      years: prev.years.map(y => y.id === id ? { ...y, [field]: value } : y),
    }))
  }, [])

  /* ─── Field renderer ─── */
  const renderField = (
    key: keyof FormData,
    label: string,
    opts: {
      type?: string
      placeholder?: string
      maxLength?: number
      inputMode?: 'text' | 'numeric' | 'tel'
      onChange?: (value: string) => string
    } = {},
  ) => {
    const hasError = touched[key] && errors[key]
    const rawValue = String(form[key] ?? '')
    return (
      <div className="taxField">
        <label className="taxLabel">{label}</label>
        <input
          type={opts.type ?? 'text'}
          inputMode={opts.inputMode}
          maxLength={opts.maxLength}
          className={`taxInput${hasError ? ' error' : ''}`}
          placeholder={opts.placeholder}
          value={rawValue}
          onChange={e => {
            const val = opts.onChange ? opts.onChange(e.target.value) : e.target.value
            setField(key, val as FormData[typeof key])
          }}
          onBlur={() => markTouched(key)}
        />
        {hasError && <div className="taxError">{errors[key]}</div>}
      </div>
    )
  }

  /* ─── Success screen ─── */
  if (submitted) {
    return (
      <div className="page" style={{ paddingBottom: 96 }}>
        <div className="topBar">
          <button className="iconBtn" aria-label="Назад" onClick={() => navigate(-1)}>
            {IconBack}
          </button>
          <span className="topBarTitle">Налоговый вычет</span>
          <span style={{ width: 40 }} />
        </div>

        <div className="taxSuccess">
          <div className="taxSuccessIcon">{IconCheck}</div>
          <div className="taxSuccessTitle">Заявление отправлено!</div>
          <div className="taxSuccessDesc">
            Ваша заявка на оформление налогового вычета принята.
            Мы свяжемся с вами в ближайшее время для уточнения деталей.
          </div>
          <button className="btnPrimary" onClick={() => navigate('/profile')}>
            Вернуться в профиль
          </button>
        </div>
      </div>
    )
  }

  /* ─── Main render ─── */
  return (
    <div className="page" style={{ paddingBottom: 96 }}>
      {/* Header */}
      <div className="topBar">
        <button className="iconBtn" aria-label="Назад" onClick={() => navigate(-1)}>
          {IconBack}
        </button>
        <span className="topBarTitle">Оформление вычета</span>
        <span style={{ width: 40 }} />
      </div>

      <form onSubmit={handleSubmit} noValidate>
        {/* Section: Personal data */}
        <div className="taxForm">
          <div className="taxFormSection">
            <div className="taxFormSectionTitle">Данные налогоплательщика</div>

            {renderField('fullName', 'ФИО', { placeholder: 'Иванов Иван Иванович' })}

            {renderField('phone', 'Номер телефона', {
              type: 'tel',
              placeholder: '+7 (999) 123-45-67',
              inputMode: 'tel',
              onChange: formatPhone,
            })}

            {/* Clinic address */}
            <div className="taxField">
              <span className="taxLabel">Пациент обслуживался по адресу</span>
              <div className="taxBtnGroup">
                {CLINIC_ADDRESSES.map(addr => (
                  <button
                    key={addr.key}
                    type="button"
                    className={`taxBtnOption${form.clinicAddress === addr.key ? ' selected' : ''}${touched.clinicAddress && errors.clinicAddress ? ' error' : ''}`}
                    onClick={() => {
                      setField('clinicAddress', addr.key)
                      markTouched('clinicAddress')
                    }}
                  >
                    {addr.label}
                  </button>
                ))}
              </div>
              {touched.clinicAddress && errors.clinicAddress && (
                <div className="taxError">{errors.clinicAddress}</div>
              )}
            </div>

            {renderField('birthDate', 'Дата рождения налогоплательщика', {
              placeholder: 'ДД.ММ.ГГГГ',
              inputMode: 'numeric',
              maxLength: 10,
              onChange: formatDate,
            })}
          </div>

          {/* Delivery method */}
          <div className="taxFormSection">
            <div className="taxFormSectionTitle">Способ получения</div>
            <div className="taxField">
              <div className="taxRadioGroup">
                {DELIVERY_METHODS.map(m => (
                  <button
                    key={m.key}
                    type="button"
                    className={`taxRadioOption${form.deliveryMethod === m.key ? ' selected' : ''}${touched.deliveryMethod && errors.deliveryMethod ? ' error' : ''}`}
                    onClick={() => {
                      setField('deliveryMethod', m.key)
                      markTouched('deliveryMethod')
                    }}
                  >
                    {m.label}
                  </button>
                ))}
              </div>
              {touched.deliveryMethod && errors.deliveryMethod && (
                <div className="taxError">{errors.deliveryMethod}</div>
              )}
            </div>
          </div>

          {/* INN & taxpayer name */}
          <div className="taxFormSection">
            <div className="taxFormSectionTitle">ИНН и ФИО</div>

            {renderField('inn', 'ИНН налогоплательщика', {
              placeholder: '123456789012',
              inputMode: 'numeric',
              maxLength: 12,
            })}

            {renderField('taxpayerFullName', 'ФИО налогоплательщика', {
              placeholder: 'Иванов Иван Иванович',
            })}
          </div>
        </div>

        {/* Section: Patient data */}
        <div className="taxForm">
          <div className="taxFormSection">
            <div className="taxFormSectionTitle">Данные пациента</div>

            {renderField('patientFullName', 'ФИО пациента', {
              placeholder: 'Иванов Иван Иванович',
            })}

            {/* Is child toggle */}
            <div className="taxField">
              <span className="taxLabel">Является ли пациент ребёнком?</span>
              <div className="taxToggle">
                <button
                  type="button"
                  className={`taxToggleBtn${form.isChild === true ? ' selected' : ''}${touched.isChild && errors.isChild ? ' error' : ''}`}
                  onClick={() => {
                    setField('isChild', true)
                    markTouched('isChild')
                  }}
                >
                  Да
                </button>
                <button
                  type="button"
                  className={`taxToggleBtn${form.isChild === false ? ' selected' : ''}${touched.isChild && errors.isChild ? ' error' : ''}`}
                  onClick={() => {
                    setField('isChild', false)
                    markTouched('isChild')
                  }}
                >
                  Нет
                </button>
              </div>
              {touched.isChild && errors.isChild && (
                <div className="taxError">{errors.isChild}</div>
              )}
            </div>

            {renderField('patientInn', 'ИНН пациента', {
              placeholder: '123456789012',
              inputMode: 'numeric',
              maxLength: 12,
            })}

            {renderField('patientBirthDate', 'Дата рождения пациента', {
              placeholder: 'ДД.ММ.ГГГГ',
              inputMode: 'numeric',
              maxLength: 10,
              onChange: formatDate,
            })}
          </div>
        </div>

        {/* Section: Years */}
        <div className="taxForm">
          <div className="taxFormSection">
            <div className="taxFormSectionTitle">Годы и суммы</div>

            {form.years.map((yr, idx) => (
              <div key={yr.id} className="taxYearBlock">
                <div className="taxYearHeader">
                  <span className="taxYearTitle">Год {idx + 1}</span>
                  {form.years.length > 1 && (
                    <button type="button" className="taxYearRemove" onClick={() => removeYear(yr.id)}>
                      Удалить
                    </button>
                  )}
                </div>

                <div className="taxField">
                  <label className="taxLabel">Год</label>
                  <input
                    type="text"
                    inputMode="numeric"
                    maxLength={4}
                    className={`taxInput${errors[`year_${idx}` as keyof FormData] ? ' error' : ''}`}
                    placeholder="2024"
                    value={yr.year}
                    onChange={e => updateYear(yr.id, 'year', e.target.value.replace(/\D/g, '').slice(0, 4))}
                  />
                  {errors[`year_${idx}` as keyof FormData] && (
                    <div className="taxError">{errors[`year_${idx}` as keyof FormData]}</div>
                  )}
                </div>

                <div className="taxField">
                  <label className="taxLabel">Сумма расходов (₽)</label>
                  <input
                    type="text"
                    inputMode="numeric"
                    className={`taxInput${errors[`amount_${idx}` as keyof FormData] ? ' error' : ''}`}
                    placeholder="50000"
                    value={yr.amount}
                    onChange={e => updateYear(yr.id, 'amount', e.target.value.replace(/[^\d\s]/g, ''))}
                  />
                  {errors[`amount_${idx}` as keyof FormData] && (
                    <div className="taxError">{errors[`amount_${idx}` as keyof FormData]}</div>
                  )}
                </div>
              </div>
            ))}

            <button type="button" className="taxAddYearBtn" onClick={addYear}>
              + Добавить ещё один год
            </button>
            {errors.years && <div className="taxError" style={{ marginTop: 8 }}>{errors.years}</div>}
          </div>
        </div>

        {/* Submit */}
        <button type="submit" className="btnPrimary taxSubmitBtn">
          Отправить заявление
        </button>

        <button type="button" className="btnGhost" style={{ marginTop: 10, justifyContent: 'center' }} onClick={() => navigate(-1)}>
          Завершить заполнение
        </button>
      </form>
    </div>
  )
}
