import { createBrowserRouter } from 'react-router-dom'
import { AppShell } from '../widgets/layout/AppShell'
import { HomePage } from '../pages/home/HomePage'
import { DoctorsPage } from '../pages/doctors/DoctorsPage'
import { DoctorProfilePage } from '../pages/doctors/DoctorProfilePage'
import { BookingPage } from '../pages/booking/BookingPage'
import { AppointmentPage } from '../pages/appointments/AppointmentsPage'
import AnalysisPage from '../pages/analysis/AnalysisPage'
import ProfilePage from '../pages/profile/ProfilePage'
import LoginPage from '../pages/LoginPage'
import TaxDeductionPage from '../pages/tax-deduction/TaxDeductionPage'
import DocumentsPage from '../pages/documents/DocumentsPage'
import PersonalDataPage from '../pages/profile/PersonalDataPage'
import StaffDashboardPage from '../pages/staff/StaffDashboardPage'
import AboutClinicPage from '../pages/about/AboutClinicPage'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <AppShell />,
    children: [
      { index: true, element: <HomePage /> },
      { path: 'doctors', element: <DoctorsPage /> },
      { path: 'doctors/:doctorId', element: <DoctorProfilePage /> },
      { path: 'booking', element: <BookingPage /> },
      { path: 'booking/:doctorId', element: <BookingPage /> },
      { path: 'appointment', element: <AppointmentPage /> },
      { path: 'analysis', element: <AnalysisPage /> },
      {
        path: 'profile',
        children: [
          { index: true, element: <ProfilePage /> },
          { path: 'personal', element: <PersonalDataPage /> },
          { path: 'staff', element: <StaffDashboardPage /> },
          { path: 'tax-deduction', element: <TaxDeductionPage /> },
          { path: 'documents', element: <DocumentsPage /> },
          { path: 'about', element: <AboutClinicPage /> },
        ],
      },
      { path: 'staff', element: <StaffDashboardPage /> },
      { path: 'profile/staff', element: <StaffDashboardPage /> },
      { path: 'personal', element: <PersonalDataPage /> },
      { path: 'profile/personal', element: <PersonalDataPage /> },
      { path: 'tax-deduction', element: <TaxDeductionPage /> },
      { path: 'profile/tax-deduction', element: <TaxDeductionPage /> },
      { path: 'profile/documents', element: <DocumentsPage /> },
      { path: 'documents', element: <DocumentsPage /> },
      { path: 'about', element: <AboutClinicPage /> },
      { path: 'profile/about', element: <AboutClinicPage /> },
    ],
  },
  { path: '/login', element: <LoginPage /> },
])
