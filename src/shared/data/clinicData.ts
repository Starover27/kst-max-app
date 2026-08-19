// Данные клиники КСТ (kst27.ru)
const clinicImage = 'https://kst27.ru/images/photo-clinika/p1dl48c2pp13vv2k01nnoovc1visu.jpg';

export const CLINIC_INFO = {
  name: 'Клиника современных технологий',
  tagline: 'для взрослых и детей',
  address: 'г. Хабаровск, ул. Шеронова, 6',
  phone: '+7 (4212) 48-88-88',
  phoneMobile: '+7 (4212) 48-22-22',
  email: 'kst-hv@yandex.ru',
  hours: 'Ежедневно с 8:00 до 21:00',
  about:
    'Клиника Современных Технологий — многопрофильный медицинский центр для взрослых и детей европейского класса. ' +
    'Главная задача – обеспечение пациентов высококвалифицированной, быстрой и эффективной медицинской помощью. ' +
    'Приём ведётся по направлениям: терапия, кардиология, неврология, хирургия, гинекология, педиатрия, ' +
    'офтальмология, оториноларингология, эндокринология, УЗД и лабораторная диагностика.',
  buildingPhoto: clinicImage,
};

export interface ClinicDoctor {
  id: string;
  lastName: string;
  firstName: string;
  middleName: string;
  specialty: string;
  category: string;
  experience: number;
  rating: number;
  price: number;
  photo: string;
}

import salnikov from '../../assets/doctors/salnikov-i-v.jpg';
import goncharov from '../../assets/doctors/goncharov-a-v.jpg';
import kovaleva from '../../assets/doctors/kovaleva-v-v.jpg';
import pankova from '../../assets/doctors/pankova-u-l.jpg';
import stepanenko from '../../assets/doctors/stepanenko-e-u.jpg';
import grigoryeva from '../../assets/doctors/grigoryeva-a-f.jpg';
import grelyo from '../../assets/doctors/grelyo-i-g.jpg';
import polyakova from '../../assets/doctors/polyakova-o-g.jpg';

export const DOCTORS: ClinicDoctor[] = [
  {
    id: 'salnikov',
    lastName: 'Сальников',
    firstName: 'Игорь',
    middleName: 'Валерьевич',
    specialty: 'Хирург',
    category: 'Хирург',
    experience: 22,
    rating: 4.9,
    price: 2500,
    photo: salnikov,
  },
  {
    id: 'goncharov',
    lastName: 'Гончаров',
    firstName: 'Александр',
    middleName: 'Валерьевич',
    specialty: 'Хирург, эндоскопист',
    category: 'Хирург',
    experience: 18,
    rating: 4.8,
    price: 2500,
    photo: goncharov,
  },
  {
    id: 'kovaleva',
    lastName: 'Ковалева',
    firstName: 'Веста',
    middleName: 'Владимировна',
    specialty: 'Невролог',
    category: 'Невролог',
    experience: 11,
    rating: 4.9,
    price: 2000,
    photo: kovaleva,
  },
  {
    id: 'pankova',
    lastName: 'Панкова',
    firstName: 'Юлия',
    middleName: 'Леонидовна',
    specialty: 'Оториноларинголог',
    category: 'ЛОР',
    experience: 10,
    rating: 4.8,
    price: 1700,
    photo: pankova,
  },
  {
    id: 'stepanenko',
    lastName: 'Степаненко',
    firstName: 'Елена',
    middleName: 'Юрьевна',
    specialty: 'Терапевт',
    category: 'Терапевт',
    experience: 15,
    rating: 4.8,
    price: 1500,
    photo: stepanenko,
  },
  {
    id: 'grigoryeva',
    lastName: 'Григорьева',
    firstName: 'Анна',
    middleName: 'Фёдоровна',
    specialty: 'Кардиолог',
    category: 'Кардиолог',
    experience: 12,
    rating: 4.9,
    price: 2000,
    photo: grigoryeva,
  },
  {
    id: 'grelyo',
    lastName: 'Грельо',
    firstName: 'Инна',
    middleName: 'Григорьевна',
    specialty: 'Кардиолог, терапевт',
    category: 'Кардиолог',
    experience: 14,
    rating: 4.7,
    price: 2000,
    photo: grelyo,
  },
  {
    id: 'polyakova',
    lastName: 'Полякова',
    firstName: 'Ольга',
    middleName: 'Григорьевна',
    specialty: 'Кардиолог',
    category: 'Кардиолог',
    experience: 16,
    rating: 4.8,
    price: 2000,
    photo: polyakova,
  },
];

export const DOCTOR_CATEGORIES = [
  'Все специалисты',
  'Терапевт',
  'Кардиолог',
  'Невролог',
  'Хирург',
  'Педиатр',
  'Офтальмолог',
  'ЛОР',
  'Эндокринолог',
  'Ортопед',
];

export interface ClinicService {
  id: string;
  name: string;
  price: number;
  duration: number;
  doctorId: string;
}

export const SERVICES: ClinicService[] = [
  { id: 's1', name: 'Консультация терапевта', price: 1500, duration: 30, doctorId: 'stepanenko' },
  { id: 's2', name: 'Консультация кардиолога', price: 2000, duration: 30, doctorId: 'grigoryeva' },
  { id: 's3', name: 'Консультация невролога', price: 2000, duration: 30, doctorId: 'kovaleva' },
  { id: 's4', name: 'Консультация хирурга', price: 2500, duration: 30, doctorId: 'salnikov' },
  { id: 's5', name: 'Консультация оториноларинголога', price: 1700, duration: 30, doctorId: 'pankova' },
  { id: 's6', name: 'Консультация педиатра', price: 1600, duration: 30, doctorId: 'stepanenko' },
  { id: 's7', name: 'Ультразвуковое исследование', price: 1500, duration: 40, doctorId: 'stepanenko' },
  { id: 's8', name: 'Общий анализ крови', price: 700, duration: 10, doctorId: 'stepanenko' },
  { id: 's9', name: 'Биохимический анализ крови', price: 1200, duration: 10, doctorId: 'stepanenko' },
  { id: 's10', name: 'Общий анализ мочи', price: 500, duration: 10, doctorId: 'stepanenko' },
  { id: 's11', name: 'Гормоны щитовидной железы', price: 1800, duration: 10, doctorId: 'stepanenko' },
  { id: 's12', name: 'Функциональная диагностика', price: 2200, duration: 40, doctorId: 'grigoryeva' },
  { id: 's13', name: 'Лабораторная диагностика', price: 900, duration: 10, doctorId: 'stepanenko' },
  { id: 's14', name: 'Консультация эндокринолога', price: 1900, duration: 30, doctorId: 'kovaleva' },
];

export const TIME_SLOTS = [
  '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
  '12:00', '12:30', '13:00', '14:00', '14:30', '15:00',
  '15:30', '16:00', '16:30',
];

export interface AnalysisItem {
  id: string;
  name: string;
  date: string;
  status: 'ready' | 'progress';
}

export const ANALYSES: AnalysisItem[] = [
  { id: 'a1', name: 'Общий анализ крови', date: '12 августа 2024', status: 'ready' },
  { id: 'a2', name: 'Биохимия крови', date: '10 августа 2024', status: 'ready' },
  { id: 'a3', name: 'Анализ мочи общий', date: '5 августа 2024', status: 'ready' },
  { id: 'a4', name: 'Гормоны щитовидной железы', date: '1 августа 2024', status: 'ready' },
  { id: 'a5', name: 'Липидный профиль', date: '14 августа 2024', status: 'progress' },
];
