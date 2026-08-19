export interface DoctorRaw {
  id: string
  name: string
  title?: string
  photo?: string
  profileUrl?: string
}

export interface Doctor {
  id: string
  fullName: string
  specialty?: string
  avatar?: string
  profileUrl?: string
}
