export const mockDoctors = [
  {
    id: '1',
    fullName: 'БелоКонь Константин Владимирович',
    specialty: 'Врач онколог',
    avatar: '/src/assets/doctors/belokon-k-v.webp',
    profileUrl: 'https://kst27.ru/index.php/nasha-komanda/vrachi/1636-belokon-konstantin-vladimirovich',
    experience: 15,
    rating: 4.8,
    price: 2500
  },
  {
    id: '2',
    fullName: 'Гайман Кирилл Николаевич',
    specialty: 'Врач хирург',
    avatar: '/src/assets/doctors/gayman-k-n.webp',
    profileUrl: 'https://kst27.ru/index.php/nasha-komanda/vrachi/1637-gajman-kirill-nikolaevich',
    experience: 12,
    rating: 4.9,
    price: 3000
  },
  {
    id: '3',
    fullName: 'Зенюков Артем Сергеевич',
    specialty: 'Врач онколог',
    avatar: '/src/assets/doctors/zenukov-a-s.webp',
    profileUrl: 'https://kst27.ru/index.php/nasha-komanda/vrachi/1638-zenyukov-artem-sergeevich',
    experience: 8,
    rating: 4.7,
    price: 2200
  },
  {
    id: '4',
    fullName: 'Акунка Валерия Филипповна',
    specialty: 'Врач УЗД',
    avatar: '/src/assets/doctors/akunka-v-f.webp',
    profileUrl: 'https://kst27.ru/index.php/nasha-komanda/vrachi/1635-akunka-valeriya-filippovna',
    experience: 10,
    rating: 4.6,
    price: 1800
  }
];

export const mockUser = {
  id: '1',
  fullName: 'Иванов Иван Иванович',
  phone: '+7 (999) 123-45-67',
  email: 'ivan@example.com',
  avatar: null
};

export const mockAppointments = [
  {
    id: '1',
    doctorId: '1',
    doctorName: 'БелоКонь Константин Владимирович',
    specialty: 'Врач онколог',
    date: '2026-08-20',
    time: '10:00',
    status: 'upcoming',
    price: 2500
  },
  {
    id: '2',
    doctorId: '4',
    doctorName: 'Акунка Валерия Филипповна',
    specialty: 'Врач УЗД',
    date: '2026-08-10',
    time: '14:30',
    status: 'completed',
    price: 1800
  }
];

export const mockAnalyses = [
  {
    id: '1',
    name: 'Общий анализ крови',
    date: '2026-08-01',
    status: 'ready',
    resultUrl: '#'
  },
  {
    id: '2',
    name: 'Биохимический анализ крови',
    date: '2026-08-05',
    status: 'processing',
    resultUrl: null
  }
];

export const mockServices = [
  { id: '1', name: 'Консультация онколога', price: 2500, duration: '30 мин' },
  { id: '2', name: 'Консультация хирурга', price: 3000, duration: '30 мин' },
  { id: '3', name: 'УЗИ органов брюшной полости', price: 1800, duration: '20 мин' },
  { id: '4', name: 'Первичный прием терапевта', price: 1500, duration: '30 мин' }
];