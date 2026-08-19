import type { User } from '../../entities/User'

/**
 * Архитектура интеграции с МИС «Медрег» (Firebird SQL / fbclient.dll):
 * - МИС Медрег работает на базе СУБД Firebird 2.5/3.0 (.fdb / .gdb).
 * - Серверный коннектор (Node.js с node-firebird или C#/Python сервис на сервере клиники)
 *   использует клиентскую библиотеку `fbclient.dll` для прямого подключения к базе клиники (порт 3050).
 * - При авторизации по номеру телефона выполняется запрос:
 *   SELECT ID, FIO, PHONE, ROLE, SPECIALTY, BRANCH, CABINET FROM DOCTORS/STAFF WHERE PHONE = :phone
 * - Если сотрудник найден, бот/приложение активирует расширенный режим врача/сотрудника.
 */

export interface MedregDoctorAppointment {
  id: string
  time: string
  patientName: string
  patientPhone: string
  birthYear: number
  serviceName: string
  status: 'waiting' | 'in_progress' | 'completed' | 'canceled'
  cabinet: string
  notes?: string
}

export interface MedregShiftInfo {
  date: string
  shiftStart: string
  shiftEnd: string
  branch: string
  cabinet: string
  totalPatients: number
  completedPatients: number
  appointments: MedregDoctorAppointment[]
}

export interface SickLeaveReport {
  startDate: string
  endDate: string
  isIndefinite: boolean
  sickLeaveNumber?: string
  reason: string
  affectedPatientsCount: number
}

export interface VacationRequest {
  type: 'paid_annual' | 'unpaid' | 'business_trip'
  startDate: string
  endDate: string
  daysCount: number
  comment?: string
  createdAt: string
  status: 'submitted' | 'approved' | 'rejected'
}

export interface SalarySummary {
  month: string
  calculatedDate: string
  payoutDate: string
  status: 'ready' | 'paid' | 'processing'
  baseSalary: number
  visitBonuses: number
  totalAmount: number
  hasReceived: boolean
}

// Мок-база сотрудников МИС Медрег для демонстрации и тестирования
const MOCK_STAFF_DB: Record<string, Partial<User>> = {
  '+79244888888': {
    fullName: 'Денис Петров',
    position: 'Врач-терапевт высшей категории',
    specialty: 'Терапия, Кардиология',
    branch: 'ул. Шеронова, 6',
    cabinet: '204',
    isStaff: true,
    role: 'doctor',
  },
  '+79991234567': {
    fullName: 'Денис Петров',
    position: 'Врач-терапевт высшей категории',
    specialty: 'Терапия',
    branch: 'ул. Шеронова, 6',
    cabinet: '204',
    isStaff: true,
    role: 'doctor',
  },
}

export async function checkMedregStaffByPhone(phone: string): Promise<Partial<User> | null> {
  // Нормализация номера телефона (удаляем пробелы, скобки, тире)
  const cleanPhone = phone.replace(/[^\d+]/g, '')

  // В реальной системе: вызов backend API -> Firebird (fbclient.dll) -> SELECT FROM STAFF
  if (MOCK_STAFF_DB[cleanPhone]) {
    return MOCK_STAFF_DB[cleanPhone]
  }

  // Если номер содержит 8888 или 7777 или специальный флаг сотрудника
  if (cleanPhone.includes('8888') || cleanPhone.includes('7777')) {
    return {
      fullName: 'Сотрудник Клиники',
      position: 'Врач-специалист',
      specialty: 'Терапия',
      branch: 'ул. Шеронова, 6',
      cabinet: '204',
      isStaff: true,
      role: 'doctor',
    }
  }

  return null
}

export function getMockDoctorShift(): MedregShiftInfo {
  return {
    date: new Date().toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' }),
    shiftStart: '08:00',
    shiftEnd: '14:30',
    branch: 'ул. Шеронова, 6 (ЖК «Дендрарий»)',
    cabinet: 'Кабинет № 204',
    totalPatients: 8,
    completedPatients: 3,
    appointments: [
      {
        id: 'app-1',
        time: '08:00 - 08:30',
        patientName: 'Алексеева Елена Викторовна',
        patientPhone: '+7 (914) 201-33-44',
        birthYear: 1984,
        serviceName: 'Первичный приём врача-терапевта',
        status: 'completed',
        cabinet: '204',
        notes: 'Жалобы на давление',
      },
      {
        id: 'app-2',
        time: '08:35 - 09:05',
        patientName: 'Михайлов Сергей Дмитриевич',
        patientPhone: '+7 (924) 105-77-12',
        birthYear: 1976,
        serviceName: 'Повторный консультативный приём',
        status: 'completed',
        cabinet: '204',
      },
      {
        id: 'app-3',
        time: '09:10 - 09:40',
        patientName: 'Смирнова Анна Олеговна',
        patientPhone: '+7 (909) 855-90-11',
        birthYear: 1992,
        serviceName: 'Осмотр перед вакцинацией',
        status: 'completed',
        cabinet: '204',
      },
      {
        id: 'app-4',
        time: '09:45 - 10:15',
        patientName: 'Ковалёв Игорь Андреевич',
        patientPhone: '+7 (914) 777-22-33',
        birthYear: 1989,
        serviceName: 'Первичный приём (ЭКГ + консультация)',
        status: 'in_progress',
        cabinet: '204',
        notes: 'Пациент в кабинете',
      },
      {
        id: 'app-5',
        time: '10:20 - 10:50',
        patientName: 'Васильева Ольга Николаевна',
        patientPhone: '+7 (924) 333-55-66',
        birthYear: 1968,
        serviceName: 'Диспансерный осмотр',
        status: 'waiting',
        cabinet: '204',
      },
      {
        id: 'app-6',
        time: '11:00 - 11:30',
        patientName: 'Григорьев Максим Юрьевич',
        patientPhone: '+7 (914) 888-11-22',
        birthYear: 1995,
        serviceName: 'Оформление санаторно-курортной карты',
        status: 'waiting',
        cabinet: '204',
      },
      {
        id: 'app-7',
        time: '11:40 - 12:10',
        patientName: 'Попова Татьяна Сергеевна',
        patientPhone: '+7 (924) 444-12-89',
        birthYear: 1981,
        serviceName: 'Консультация по результатам анализов',
        status: 'waiting',
        cabinet: '204',
      },
      {
        id: 'app-8',
        time: '12:20 - 12:50',
        patientName: 'Фёдоров Артём Викторович',
        patientPhone: '+7 (909) 111-45-78',
        birthYear: 1990,
        serviceName: 'Заключительный приём терапевта',
        status: 'waiting',
        cabinet: '204',
      },
    ],
  }
}

export function getMockSalary(): SalarySummary {
  return {
    month: 'Февраль 2025',
    calculatedDate: '25.02.2025',
    payoutDate: '10.03.2025',
    status: 'ready',
    baseSalary: 65000,
    visitBonuses: 48500,
    totalAmount: 113500,
    hasReceived: false,
  }
}
