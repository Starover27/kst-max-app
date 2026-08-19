export interface LabResultRaw {
  id: string
  name: string
  date: string
  status: 'ready' | 'in_progress'
}

export interface LabResult {
  id: string
  title: string
  date: string
  status: string
}
