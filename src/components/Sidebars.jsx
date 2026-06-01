import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

function SidebarLink({ to, icon, label, active }) {
  const cls = active
    ? 'flex items-center gap-3 px-4 py-3 bg-white text-[#006977] rounded-xl shadow-sm font-manrope text-sm font-medium transition-all duration-200 ease-in-out'
    : 'flex items-center gap-3 px-4 py-3 text-[#49636f] hover:text-[#006977] hover:bg-[#ffffff]/50 rounded-xl font-manrope text-sm font-medium transition-all duration-200 ease-in-out'
  return (
    <Link className={cls} to={to}>
      <span className="material-symbols-outlined" style={active ? { fontVariationSettings: "'FILL' 1" } : {}}>{icon}</span>
      {label}
    </Link>
  )
}

export function PatientSidebar() {
  const location = useLocation()
  const { logout } = useAuth()
  const navigate = useNavigate()
  const path = location.pathname

  const links = [
    { href: '/patient-dashboard', icon: 'dashboard', label: 'Health Overview' },
    { href: '/medical-records', icon: 'description', label: 'Medical Records' },
    { href: '/appointments', icon: 'calendar_today', label: 'Appointments' },
  ]

  return (
    <aside id="sidebar" className="h-screen w-64 fixed left-0 top-0 z-50 bg-[#f0f4f6] dark:bg-slate-900 flex flex-col p-4 gap-2 overflow-y-auto sidebar-mobile">
      <div className="px-4 py-6 mb-4">
        <h1 className="text-lg font-semibold text-[#006977]">Patient Portal</h1>
        <p className="text-xs text-secondary opacity-70">Askare Access</p>
      </div>
      <nav className="flex-1 space-y-1">
        {links.map((l, i) => <SidebarLink key={i} to={l.href} icon={l.icon} label={l.label} active={path === l.href} />)}
      </nav>
      <div className="mt-auto border-t border-outline-variant/10 pt-4 space-y-1">
        <Link to="/book-video-call" className="w-full flex items-center justify-center gap-2 bg-primary text-on-primary py-3 px-4 rounded-xl font-semibold mb-6 hover:bg-primary-dim transition-colors">
          Book Consultation
        </Link>
        <Link className="flex items-center gap-3 px-4 py-2 text-[#49636f] hover:text-[#006977] font-manrope text-sm font-medium" to="/contact">
          <span className="material-symbols-outlined">help</span> Help Center
        </Link>
        <button className="flex items-center gap-3 px-4 py-2 text-error hover:text-error-dim font-manrope text-sm font-medium w-full" onClick={() => { logout(); navigate('/login') }}>
          <span className="material-symbols-outlined">logout</span> Sign Out
        </button>
      </div>
    </aside>
  )
}

export function DoctorSidebar({ breakpoint = 'lg' }) {
  const location = useLocation()
  const { logout } = useAuth()
  const navigate = useNavigate()
  const path = location.pathname

  const links = [
    { href: '/doctor-dashboard', icon: 'dashboard', label: 'Dashboard' },
    { href: '/my-schedule', icon: 'calendar_today', label: 'My Schedule' },
    { href: '/patient-records', icon: 'medical_information', label: 'Patient Records' },
  ]
  const hiddenClass = breakpoint === 'lg' ? 'hidden lg:flex' : ''

  return (
    <aside id="sidebar" data-breakpoint={breakpoint} className={`h-screen w-64 fixed left-0 top-0 z-50 bg-[#f0f4f6] dark:bg-slate-900 flex flex-col p-4 gap-2 sidebar-mobile ${hiddenClass}`}>
      <div className="px-4 py-6 mb-4">
        <h1 className="text-lg font-semibold text-[#006977]">Doctor's Portal</h1>
        <p className="text-xs text-secondary opacity-70">Askare Access</p>
      </div>
      <nav className="flex-1 space-y-1">
        {links.map((l, i) => <SidebarLink key={i} to={l.href} icon={l.icon} label={l.label} active={path === l.href} />)}
      </nav>
      <div className="mt-auto border-t border-outline-variant/10 pt-4 space-y-1">
        <Link className="flex items-center gap-3 px-4 py-2 text-[#49636f] hover:text-[#006977] font-manrope text-sm font-medium" to="/contact">
          <span className="material-symbols-outlined">help</span> Help Center
        </Link>
        <button className="flex items-center gap-3 px-4 py-2 text-error hover:bg-error-container/10 rounded-xl font-manrope text-sm font-medium w-full" onClick={() => { logout(); navigate('/login') }}>
          <span className="material-symbols-outlined">logout</span> Sign Out
        </button>
      </div>
    </aside>
  )
}

export function AISidebar() {
  const location = useLocation()
  const path = location.pathname

  const links = [
    { href: '/ai-diagnosis', icon: 'psychology', label: 'AI Diagnosis' },
    { href: '/book-video-call', icon: 'videocam', label: 'Video Consultation' },
    { href: '/patient-dashboard', icon: 'monitor_heart', label: 'My Health' },
  ]

  return (
    <aside id="sidebar" className="h-screen w-64 fixed left-0 top-0 z-50 bg-[#f0f4f6] dark:bg-slate-900 flex flex-col p-4 gap-2 border-r border-outline-variant/10 hidden md:flex sidebar-mobile">
      <div className="px-4 py-6 mb-4">
        <h1 className="text-lg font-semibold text-[#006977]">Askare AI Core</h1>
        <p className="text-xs text-secondary opacity-70">Medical Assistant</p>
      </div>
      <nav className="flex-1 space-y-1">
        {links.map((l, i) => <SidebarLink key={i} to={l.href} icon={l.icon} label={l.label} active={path === l.href} />)}
      </nav>
    </aside>
  )
}

const adminSections = [
  { id: 'overview', icon: 'dashboard', label: 'Overview' },
  { id: 'doctors', icon: 'medical_services', label: 'Doctor Management' },
  { id: 'patients', icon: 'group', label: 'Patient Management' },
  { id: 'appointments', icon: 'calendar_month', label: 'Appointments' },
  { id: 'videocalls', icon: 'videocam', label: 'Video Call Logs' },
  { id: 'ai', icon: 'psychology', label: 'AI Monitoring' },
  { id: 'payments', icon: 'payments', label: 'Payments' },
  { id: 'reports', icon: 'analytics', label: 'Reports & Analytics' },
  { id: 'complaints', icon: 'support_agent', label: 'Complaints & Support' },
  { id: 'settings', icon: 'settings', label: 'Settings' },
]

export function AdminSidebar({ activeSection = 'overview', onSectionChange }) {
  const { logout } = useAuth()
  const navigate = useNavigate()

  return (
    <aside id="sidebar" className="h-screen w-64 fixed left-0 top-0 z-50 bg-[#0a1628] flex flex-col p-4 gap-2 overflow-y-auto sidebar-mobile">
      <div className="px-4 py-6 mb-2">
        <h1 className="text-lg font-semibold text-[#00d4aa]">Admin Console</h1>
        <p className="text-xs text-[#8899a6]">Askare Platform</p>
      </div>
      <nav className="flex-1 space-y-1">
        {adminSections.map((s) => {
          const isActive = activeSection === s.id
          return (
            <button
              key={s.id}
              onClick={() => onSectionChange?.(s.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ease-in-out ${
                isActive
                  ? 'bg-[#00d4aa]/10 text-[#00d4aa] shadow-sm'
                  : 'text-[#8899a6] hover:text-[#00d4aa] hover:bg-white/5'
              }`}
            >
              <span className="material-symbols-outlined" style={isActive ? { fontVariationSettings: "'FILL' 1" } : {}}>{s.icon}</span>
              {s.label}
            </button>
          )
        })}
      </nav>
      <div className="mt-auto border-t border-white/10 pt-4 space-y-1">
        <button className="flex items-center gap-3 px-4 py-2 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-xl text-sm font-medium w-full transition-colors" onClick={() => { logout(); navigate('/login') }}>
          <span className="material-symbols-outlined">logout</span> Sign Out
        </button>
      </div>
    </aside>
  )
}
