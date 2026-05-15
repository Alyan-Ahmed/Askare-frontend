import { Routes, Route, Navigate, Outlet, useLocation } from 'react-router-dom'
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
} from './components/Layouts'

// Pages
import HomePage from './pages/HomePage'
import AboutPage from './pages/AboutPage'
import ContactPage from './pages/ContactPage'
import LoginPage from './pages/LoginPage'
import ForgotPasswordPage from './pages/ForgotPasswordPage'
import ResetPasswordPage from './pages/ResetPasswordPage'
import PrivacyPolicyPage from './pages/PrivacyPolicyPage'
import TermsOfUsePage from './pages/TermsOfUsePage'
import PatientDashboardPage from './pages/PatientDashboardPage'
import DoctorDashboardPage from './pages/DoctorDashboardPage'
import AppointmentsPage from './pages/AppointmentsPage'
import MedicalRecordsPage from './pages/MedicalRecordsPage'
import BookVideoCallPage from './pages/BookVideoCallPage'
import MySchedulePage from './pages/MySchedulePage'
import PatientRecordsPage from './pages/PatientRecordsPage'
import PatientSettingsPage from './pages/PatientSettingsPage'
import DoctorSettingsPage from './pages/DoctorSettingsPage'
import AIDiagnosisPage from './pages/AIDiagnosisPage'
import PaymentDetailsPage from './pages/PaymentDetailsPage'
import PaymentConfirmationPage from './pages/PaymentConfirmationPage'
import VideoCallPage from './pages/VideoCallPage'
import { useAuth } from './context/AuthContext'
import ScrollReveal from './components/ScrollReveal'

function RequireAuth({ role }) {
  const { isLoggedIn, userRole } = useAuth()
  const location = useLocation()

  if (!isLoggedIn) return <Navigate to="/login" replace state={{ from: location }} />

  if (role && userRole !== role) {
    const fallback = userRole === 'doctor' ? '/doctor-dashboard' : userRole === 'patient' ? '/patient-dashboard' : '/login'
    return <Navigate to={fallback} replace />
  }

  return <Outlet />
}

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

      {/* Catch all */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
    </>
  )
}
