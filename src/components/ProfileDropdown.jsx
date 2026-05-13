import { useState, useRef, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const DOCTOR_PROFILE = {
  name: 'Dr. Arsalan Khan', id: '#ASK-99284',
  img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuATjjHmze-FPbpcsPti5gE9P6DmTWdj7N_V9NOsOwt2sGMXJiFOE0OuiMVrdsq_lsC5GrV3RjgcT80enDRKSfiQ_9oDOx4Jd0RELfP9PwU5r9t0WNsS4sCCiPtdEn7jcbfow-3oUoUt3LJNpvWa5wc6zABuVTDxD5_9K7jtcoP6Ulf2rH7VfKy0vrJZT8bMrtJDI6-dWqhsFZGtmZ4iiUxjGNOxOpy9DSk2Kq1WWaWu7BvsxElA4Vp_enUn2ZHwfVID-y-ToYzyE7w',
  links: [
    { href: '/doctor-dashboard', icon: 'person', label: 'View Profile' },
    { href: '/my-schedule', icon: 'medical_services', label: 'My Consultations' },
    { href: '/doctor-settings', icon: 'settings', label: 'Settings' },
  ],
}

const PATIENT_PROFILE = {
  name: 'Sarah Chen', id: '#88219',
  img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCh5YHMpg9q2P8To_WZo1zaP4I-WcSdeI5CxDkTosRo8kU9N_x8CQw7h4AgCatSdV88_tWcluJ28MGsDSVdYIQri0Ei8vA0B-ltLst3fBiarXF-MIp-RwyMdivtpmyea2kNLVsMoNqR_-my_EfSObYhEcdxDmc1P0yByP7nN--A3PAhD-6cRS7zW3eLrDfhrhyp8cJxRksbZertrCJuEz275ZTLwLbwwq7e-VXFAz8s6OpJt2iChKkMuxEm1JLHjZ-Sg8vLxxQdQys',
  links: [
    { href: '/patient-dashboard', icon: 'person', label: 'View Profile' },
    { href: '/appointments', icon: 'medical_services', label: 'My Consultations' },
    { href: '/patient-settings', icon: 'settings', label: 'Settings' },
  ],
}

export default function ProfileDropdown({ role = 'patient' }) {
  const [open, setOpen] = useState(false)
  const ref = useRef(null)
  const { logout } = useAuth()
  const navigate = useNavigate()
  const profile = role === 'doctor' ? DOCTOR_PROFILE : PATIENT_PROFILE

  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false) }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const handleLogout = () => { logout(); navigate('/login') }

  return (
    <div className="relative profile-dropdown" ref={ref}>
      <button className="profile-btn flex items-center gap-3 p-1 pr-3 rounded-full ring-1 ring-outline-variant/20 hover:bg-surface-container-high transition-all" onClick={() => setOpen(!open)}>
        <img alt={`${profile.name} profile`} className="w-9 h-9 rounded-full object-cover" src={profile.img} />
        <div className="text-left">
          <p className="text-xs font-bold text-on-surface leading-none">{profile.name}</p>
          <p className="text-[10px] text-secondary font-medium">{profile.id}</p>
        </div>
        <span className="material-symbols-outlined text-sm ml-1 text-secondary transition-transform">expand_more</span>
      </button>
      {open && (
        <div className="absolute right-0 mt-2 w-48 bg-surface-container-lowest rounded-xl shadow-xl border border-outline-variant/10 py-2 z-50">
          {profile.links.map((l, i) => (
            <Link key={i} className="flex items-center gap-3 px-4 py-2.5 text-sm text-on-surface hover:bg-surface-container-high transition-colors" to={l.href} onClick={() => setOpen(false)}>
              <span className="material-symbols-outlined text-lg">{l.icon}</span> {l.label}
            </Link>
          ))}
          <div className="h-px bg-outline-variant/10 my-1"></div>
          <button className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-error hover:bg-error-container/10 transition-colors" onClick={handleLogout}>
            <span className="material-symbols-outlined text-lg">logout</span> Sign Out
          </button>
        </div>
      )}
    </div>
  )
}
