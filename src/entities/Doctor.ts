export interface Doctor {
  id: string
  fullName: string
  specialty?: string
  avatar?: string
  profileUrl?: string
  experience?: number // Добавляем опыт
  rating?: number // Добавляем рейтинг
  price?: number // Добавляем цену
}

// export default Doctor // Удален