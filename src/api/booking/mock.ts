import type { BookingDoctorRaw, BookingServiceRaw, TimeSlotRaw, BookingPayload, BookingResponseRaw } from './types'

const delay = (ms = 300) => new Promise((r) => setTimeout(r, ms))

const doctors: BookingDoctorRaw[] = [
  {
    id: '1',
    name: 'БелоКонь Константин Владимирович',
    specialty: 'Врач онколог',
    experience: 15,
    rating: 4.8,
    price: 2500,
  },
  {
    id: '2',
    name: 'Гайман Кирилл Николаевич',
    specialty: 'Врач хирург',
    experience: 12,
    rating: 4.9,
    price: 3000,
  },
  {
    id: '3',
    name: 'Зенюков Артем Сергеевич',
    specialty: 'Врач онколог',
    experience: 8,
    rating: 4.7,
    price: 2200,
  },
  {
    id: '4',
    name: 'Акунка Валерия Филипповна',
    specialty: 'Врач УЗД',
    experience: 10,
    rating: 4.6,
    price: 1800,
  },
]

const services: BookingServiceRaw[] = [
  { id: 's1', name: 'Консультация онколога', price: 2500, duration: 30, doctorId: '1' },
  { id: 's2', name: 'Повторный приём онколога', price: 2000, duration: 20, doctorId: '1' },
  { id: 's3', name: 'Биопсия под контролем УЗИ', price: 5500, duration: 45, doctorId: '1' },
  { id: 's4', name: 'Консультация хирурга', price: 3000, duration: 30, doctorId: '2' },
  { id: 's5', name: 'Малая хирургическая операция', price: 7000, duration: 60, doctorId: '2' },
  { id: 's6', name: 'Перевязка после операции', price: 1500, duration: 15, doctorId: '2' },
  { id: 's7', name: 'Консультация онколога', price: 2200, duration: 30, doctorId: '3' },
  { id: 's8', name: 'Повторный приём онколога', price: 1800, duration: 20, doctorId: '3' },
  { id: 's9', name: 'УЗИ органов брюшной полости', price: 1800, duration: 20, doctorId: '4' },
  { id: 's10', name: 'УЗИ молочных желёз', price: 2000, duration: 25, doctorId: '4' },
  { id: 's11', name: 'УЗИ щитовидной железы', price: 1600, duration: 20, doctorId: '4' },
]

// Генерация слотов: часть занята для реалистичности
function generateSlots(dateStr: string): TimeSlotRaw[] {
  const allTimes = [
    '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
    '12:00', '12:30', '13:00', '13:30', '14:00', '14:30',
    '15:00', '15:30', '16:00', '16:30', '17:00',
  ]
  // Детерминированная "случайность" на основе даты
  const seed = dateStr.split('').reduce((a, c) => a + c.charCodeAt(0), 0)
  return allTimes.map((time, i) => ({
    time,
    available: (seed + i) % 4 !== 0, // ~25% слотов заняты
  }))
}

export async function fetchDoctors(): Promise<BookingDoctorRaw[]> {
  await delay(250)
  return doctors
}

export async function fetchServices(doctorId: string): Promise<BookingServiceRaw[]> {
  await delay(200)
  return services.filter((s) => s.doctorId === doctorId)
}

export async function fetchAvailableDates(): Promise<string[]> {
  await delay(150)
  const dates: string[] = []
  const today = new Date()
  for (let i = 0; i < 14; i++) {
    const d = new Date(today)
    d.setDate(today.getDate() + i)
    // Пропускаем воскресенье
    if (d.getDay() === 0) continue
    dates.push(d.toISOString().split('T')[0])
  }
  return dates
}

export async function fetchTimeSlots(doctorId: string, date: string): Promise<TimeSlotRaw[]> {
  await delay(250)
  return generateSlots(`${doctorId}-${date}`)
}

export async function createAppointment(_payload: BookingPayload): Promise<BookingResponseRaw> {
  await delay(500)
  const id = `apt-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
  return { id, status: 'confirmed' }
}
