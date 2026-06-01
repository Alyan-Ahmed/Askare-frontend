import { Outlet } from 'react-router-dom'
import { PublicHeader, PortalHeader } from './Headers'
import { PatientSidebar, DoctorSidebar, AISidebar, AdminSidebar } from './Sidebars'
import { Footer } from './Footer'

export function PublicLayout({ showNotifications = true }) {
  return (
    <div className="bg-background text-on-background antialiased min-h-screen flex flex-col">
      <PublicHeader showNotifications={showNotifications} />
      <Outlet />
      <Footer />
    </div>
  )
}

export function PatientLayout() {
  return (
    <div className="bg-background text-on-surface antialiased min-h-screen">
      <PatientSidebar />
      <main className="md:ml-64 min-h-screen flex flex-col">
        <PortalHeader role="patient" sidebarBreakpoint="md" />
        <Outlet />
        <Footer role="patient" />
      </main>
    </div>
  )
}

export function DoctorLayout({ sidebarBreakpoint = 'lg', mainClassName = 'lg:ml-64 min-h-screen flex flex-col' }) {
  return (
    <div className="bg-background text-on-surface antialiased min-h-screen">
      <DoctorSidebar breakpoint={sidebarBreakpoint} />
      <main className={mainClassName}>
        <PortalHeader role="doctor" sidebarBreakpoint={sidebarBreakpoint} />
        <Outlet />
        <Footer role="doctor" />
      </main>
    </div>
  )
}

export function AILayout() {
  return (
    <div className="bg-background text-on-background antialiased min-h-screen">
      <AISidebar />
      <main className="md:ml-64 min-h-screen flex flex-col">
        <PortalHeader role="patient" showAISettings sidebarBreakpoint="md" />
        <Outlet />
        <Footer role="patient" />
      </main>
    </div>
  )
}

export function FixedHeaderLayout({ role = 'patient', footer = false, bodyClassName = 'bg-background text-on-surface antialiased min-h-screen flex flex-col' }) {
  return (
    <div className={bodyClassName}>
      <PortalHeader role={role} variant="settings" />
      <Outlet />
      {footer && <Footer role={role} />}
    </div>
  )
}

export function BareLayout() {
  return (
    <div className="bg-background text-on-surface min-h-screen flex flex-col">
      <Outlet />
    </div>
  )
}

export function PatientSettingsLayout() {
  return <FixedHeaderLayout role="patient" footer />
}

export function DoctorSettingsLayout() {
  return <FixedHeaderLayout role="doctor" footer />
}

export function BookingLayout() {
  return <FixedHeaderLayout role="patient" footer bodyClassName="bg-surface text-on-surface antialiased min-h-screen flex flex-col" />
}

export function PatientPaymentLayout() {
  return <FixedHeaderLayout role="patient" footer />
}

export function DoctorScheduleLayout() {
  return <DoctorLayout sidebarBreakpoint="md" mainClassName="md:ml-64 min-h-screen flex flex-col" />
}

export function AdminLayout() {
  return (
    <div className="bg-[#f8f9fb] text-gray-900 antialiased min-h-screen">
      <Outlet />
    </div>
  )
}
