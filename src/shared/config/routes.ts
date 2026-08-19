export const routes = {
  home: '/',
  doctors: '/doctors',
  booking: '/booking', // Добавлен
  appointments: '/appointments',
  analysis: '/analysis', // Добавлен
  profile: '/profile', // Добавлен
  documents: '/profile/documents',
  taxDeduction: '/profile/tax-deduction',
  // Старые, несуществующие маршруты, которые мы удалили из AppShell, можно удалить и здесь, но для совместимости с другими частями системы, оставим закомментированными или удалим, если уверены, что они не нужны.
  // patients: '/patients',
  // records: '/records',
  // settings: '/settings',

  // Маршруты для админ-панели
  admin: {
    root: '/admin',
    dashboard: '/admin/dashboard',
    users: '/admin/users',
    doctors: '/admin/doctors',
    appointments: '/admin/appointments',
    analyses: '/admin/analyses',
    medreg: '/admin/medreg',
    settings: '/admin/settings',
  }
} as const
