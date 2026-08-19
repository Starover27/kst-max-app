import rawData from '../../data/doctors.json';

export interface Doctor {
  id: string;
  name: string;
  title?: string;
  photo: string;
  profileUrl?: string;
  experience?: number;
  rating?: number;
  price?: number;
  specialties: string[];
  department?: string;
  category?: string;
  description?: string;
}

interface RawDoctor {
  id: number;
  full_name: string;
  specialties: string[];
  specialty_text: string;
  experience_years: number | null;
  photo_url: string | null;
  detail_page_url: string | null;
  department: string | null;
  category: string | null;
  description: string | null;
}

interface DoctorsData {
  doctors: RawDoctor[];
}

const doctors: Doctor[] = (rawData as DoctorsData).doctors.map((doctor) => ({
  id: String(doctor.id),
  name: doctor.full_name,
  title: doctor.specialty_text || doctor.specialties.join(', ') || undefined,
  photo: doctor.photo_url ?? '',
  profileUrl: doctor.detail_page_url ?? undefined,
  experience: doctor.experience_years ?? undefined,
  specialties: doctor.specialties,
  department: doctor.department ?? undefined,
  category: doctor.category ?? undefined,
  description: doctor.description ?? undefined,
}));

export default doctors;