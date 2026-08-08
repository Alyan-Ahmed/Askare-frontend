import { Routes, Route, Navigate } from 'react-router-dom'
import {
  PublicLayout,
  DoctorLayout,
  PatientLayout,
  PatientSettingsLayout,
  DoctorSettingsLayout,
  DoctorScheduleLayout,
  BookingLayout,
  PatientPaymentLayout,
  AILayout,
  BareLayout,
  AdminLayout,
} from './components/layout/Layouts'

// Route guards
import { RequireAuth } from './routes'

// Public pages
import HomePage from './pages/public/HomePage'
import AboutPage from './pages/public/AboutPage'
import ContactPage from './pages/public/ContactPage'
import PrivacyPolicyPage from './pages/public/PrivacyPolicyPage'
import TermsOfUsePage from './pages/public/TermsOfUsePage'

// Auth pages
import LoginPage from './pages/auth/LoginPage'
import ForgotPasswordPage from './pages/auth/ForgotPasswordPage'
import ResetPasswordPage from './pages/auth/ResetPasswordPage'

// Patient pages
import PatientDashboardPage from './pages/patient/PatientDashboardPage'
import AppointmentsPage from './pages/patient/AppointmentsPage'
import MedicalRecordsPage from './pages/patient/MedicalRecordsPage'
import BookVideoCallPage from './pages/patient/BookVideoCallPage'
import PatientSettingsPage from './pages/patient/PatientSettingsPage'
import AIDiagnosisPage from './pages/patient/AIDiagnosisPage'
import PaymentDetailsPage from './pages/patient/PaymentDetailsPage'
import PaymentConfirmationPage from './pages/patient/PaymentConfirmationPage'
import VideoCallPage from './pages/shared/VideoCallPage'

// Doctor pages
import DoctorDashboardPage from './pages/doctor/DoctorDashboardPage'
import MySchedulePage from './pages/doctor/MySchedulePage'
import PatientRecordsPage from './pages/doctor/PatientRecordsPage'
import DoctorSettingsPage from './pages/doctor/DoctorSettingsPage'

// Admin pages
import AdminDashboardPage from './pages/admin/AdminDashboardPage'

// Utilities
import { useAuth } from './context/AuthContext'
import ScrollReveal from './components/common/ScrollReveal'

export default function App() {
  return (
    <>
    <ScrollReveal />
    <Routes>
      {/* Public Routes */}
      <Route element={<PublicLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/contact" element={<ContactPage />} />
      </Route>

      {/* Legal pages */}
      <Route element={<PublicLayout />}>
        <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
        <Route path="/terms-of-use" element={<TermsOfUsePage />} />
      </Route>

      {/* Auth Routes (no header/footer) */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      <Route path="/reset-password" element={<ResetPasswordPage />} />

      <Route element={<RequireAuth role="patient" />}>
        {/* Patient Portal (sidebar layout) */}
        <Route element={<PatientLayout />}>
          <Route path="/patient-dashboard" element={<PatientDashboardPage />} />
          <Route path="/appointments" element={<AppointmentsPage />} />
          <Route path="/medical-records" element={<MedicalRecordsPage />} />
        </Route>

        {/* Patient fixed-header pages (no sidebar) */}
        <Route element={<PatientSettingsLayout />}>
          <Route path="/patient-settings" element={<PatientSettingsPage />} />
        </Route>
        <Route element={<BookingLayout />}>
          <Route path="/book-video-call" element={<BookVideoCallPage />} />
        </Route>
        <Route element={<PatientPaymentLayout />}>
          <Route path="/payment-details" element={<PaymentDetailsPage />} />
          <Route path="/payment-confirmation" element={<PaymentConfirmationPage />} />
        </Route>

        {/* AI Diagnosis */}
        <Route element={<AILayout />}>
          <Route path="/ai-diagnosis" element={<AIDiagnosisPage />} />
        </Route>
      </Route>

      <Route element={<RequireAuth role="doctor" />}>
        {/* Doctor Portal (sidebar layout) */}
        <Route element={<DoctorLayout />}>
          <Route path="/doctor-dashboard" element={<DoctorDashboardPage />} />
          <Route path="/patient-records" element={<PatientRecordsPage />} />
        </Route>
        <Route element={<DoctorScheduleLayout />}>
          <Route path="/my-schedule" element={<MySchedulePage />} />
        </Route>

        {/* Doctor Settings */}
        <Route element={<DoctorSettingsLayout />}>
          <Route path="/doctor-settings" element={<DoctorSettingsPage />} />
        </Route>
      </Route>

      <Route element={<RequireAuth />}>
        {/* Video Call (bare layout) */}
        <Route element={<BareLayout />}>
          <Route path="/video-call" element={<VideoCallPage />} />
        </Route>
      </Route>

      <Route element={<RequireAuth role="admin" />}>
        <Route element={<AdminLayout />}>
          <Route path="/admin-dashboard" element={<AdminDashboardPage />} />
        </Route>
      </Route>

      {/* Catch all */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
    </>
  )
}
