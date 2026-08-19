import type { LabResultRaw } from './types'
import type { Analysis as EntityAnalysis } from '../../entities/Analysis'

export function mapResult(raw: LabResultRaw): EntityAnalysis {
  return { id: raw.id, title: raw.name, date: raw.date, status: raw.status }
}

export function mapResults(list: LabResultRaw[]): EntityAnalysis[] {
  return list.map(mapResult)
}
