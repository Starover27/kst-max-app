export interface BookingDoctorRaw {
  id: string
  name: string
  specialty: string
  photo?: string
  experience?: number
  rating?: number
  price?: number
}

export interface BookingServiceRaw {
  id: string
  name: string
  price: number
  duration: number // минуты
  doctorId: string
}

export interface TimeSlotRaw {
  time: string
  available: boolean
}

export interface BookingPayload {
  doctorId: string
  serviceId: string
  date: string
  time: string
  patient: {
    fullName: string
    phone: string
    email?: string
    birthDate?: string
  }
}

export interface BookingResponseRaw {
  id: string
  status: 'confirmed'
}
