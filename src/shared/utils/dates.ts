export interface DayOption {
  iso: string
  weekday: string
  day: number
  monthShort: string
  monthLong: string
}

const WD = ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб']
const MS = ['янв', 'фев', 'мар', 'апр', 'май', 'июн', 'июл', 'авг', 'сен', 'окт', 'ноя', 'дек']
const ML = ['января', 'февраля', 'марта', 'апреля', 'мая', 'июня', 'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря']
const pad = (n: number) => String(n).padStart(2, '0')

export function getNextDays(count: number): DayOption[] {
  const now = new Date()
  const res: DayOption[] = []
  for (let i = 0; i < count; i++) {
    const d = new Date(now.getFullYear(), now.getMonth(), now.getDate() + i)
    res.push({
      iso: `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`,
      weekday: WD[d.getDay()],
      day: d.getDate(),
      monthShort: MS[d.getMonth()],
      monthLong: ML[d.getMonth()],
    })
  }
  return res
}

export function formatDateParts(iso: string): DayOption {
  const [y, m, d] = iso.split('-').map(Number)
  const date = new Date(y, m - 1, d)
  return { iso, weekday: WD[date.getDay()], day: d, monthShort: MS[m - 1], monthLong: ML[m - 1] }
}

export function todayISO(): string {
  return getNextDays(1)[0].iso
}
