import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

/* ═══════════════════════════════════════════════════════════════
   DATA
   ═══════════════════════════════════════════════════════════════ */
const ALL_DOCTORS = [
  { id: 1, name: 'Dr. Arsalan Khan', spec: 'General Physician', location: 'Clifton, Karachi', rating: '4.9', price: 'PKR 2,500', gender: 'Male', status: 'Active', joined: 'Jan 15, 2024', patients: 128, img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBJ4LyJ5urRhYWaNc0fAHi1aTPLnVNXCr9Jt3_5dGQkr4oLP2ZKJVy6rIpZrwq0M2pRVXyd9husXHlkwbu953qA9NJcmVQTAwcoY5vO9R0WOEZVtm2ycNh4gYQqj8ef4G7tyZBVvySBVcnN79uOgWnsxrVhjq2L1tbDDu3svWyhtYP5QWFMxpJExQVH5qNCL1n71mb-T_7bbgRMoxc4ZKChtFLv2MhapV1uxN-3cexn7PW6JJV9r95g4ia08RxSTMZipeYxtApQyHQ', about: 'Experienced GP with 12+ years in family medicine and chronic disease management.' },
  { id: 2, name: 'Dr. Sarah Ahmed', spec: 'Pediatrician', location: 'DHA Phase VI, Karachi', rating: '5.0', price: 'PKR 3,000', gender: 'Female', status: 'Active', joined: 'Mar 22, 2024', patients: 95, img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD-KawnVanuKt14ZQFtYKaRGkXXXSy_dSCBaDU6_oWWDI5SkQxorawLqkFKaF28GKp9625EUcBiNzTKK07YeNngi0A4y91Wo6DBSKJSuFG4_A9Lqkh4KAeEXbCq0r8CxB8Q7egHxfNXcwNwJwjuFZtM2QXRDaEk3eaFm4b0dNFhihp70seNnWVEl5xw7SdlbO2ARt_0cMPWiTz7Z_ZGDtSwtYoXJQVrNdrAAXSne880taIH5w9NCdSq17vWdMaMszuEhamhlP5Ea58', about: 'Board-certified pediatrician at Aga Khan University Hospital.' },
  { id: 3, name: 'Dr. Mansoor Ali', spec: 'Psychiatrist', location: 'Gulshan-e-Iqbal, Karachi', rating: '4.8', price: 'PKR 5,000', gender: 'Male', status: 'Active', joined: 'Feb 10, 2024', patients: 67, img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC0R2oB8OJVQzikzuZsZ6-yi1yy7TSmFjQDJBvIqUptz-S9nkEMSg7m_2T8bN8g_MJqvKANbPxrqi0lLknSMt_nyI9WJBrd-_N38Hw2SvMNxS3IAr74fExUA_bY83zpTQVvIgt4QdZRoEmxfDVX84ATLqB64VZJCC1orZaIXsv38DyxOX1VgVLzUrqJ4_LSzdGgCGca54Kr2iMwFYlHICqj9RGSPgEb1rOvglrTyexlyQPcdJ-6hOenL48N__8-akZdUgGcu8bQ38A', about: 'Senior consultant psychiatrist specializing in CBT and mood disorders.' },
  { id: 4, name: 'Dr. Mariam Farooq', spec: 'Pediatrics', location: 'PECHS, Karachi', rating: '4.7', price: 'PKR 2,800', gender: 'Female', status: 'Pending', joined: 'May 01, 2025', patients: 0, img: '', about: 'Pediatrics specialist with focus on neonatal care.' },
  { id: 5, name: 'Dr. Sarah Khalil', spec: 'Cardiology', location: 'North Nazimabad, Karachi', rating: '4.6', price: 'PKR 4,500', gender: 'Female', status: 'Active', joined: 'Apr 18, 2024', patients: 82, img: '', about: 'Interventional cardiologist with 8 years of experience.' },
  { id: 6, name: 'Dr. Ahmed Raza', spec: 'General Practitioner', location: 'Bahadurabad, Karachi', rating: '4.5', price: 'PKR 2,000', gender: 'Male', status: 'Suspended', joined: 'Jun 05, 2024', patients: 45, img: '', about: 'GP with interest in preventive medicine and wellness.' },
]

const ALL_PATIENTS = [
  { id: '#RE-9021', name: 'Arsalan Khan', status: 'Active', lastVisit: '12 Oct 2023', condition: 'Hypertension Management', medications: ['Lisinopril 10mg', 'Atorvastatin 20mg'], doctor: 'Dr. Arsalan Khan' },
  { id: '#RE-8842', name: 'Zainab Ahmed', status: 'Critical', lastVisit: '05 Nov 2023', condition: 'Post-operative Recovery', medications: ['Cefixime 400mg', 'Paracetamol 500mg'], doctor: 'Dr. Sarah Ahmed' },
  { id: '#RE-4412', name: 'Omar Malik', status: 'Stable', lastVisit: '28 Oct 2023', condition: 'Type 2 Diabetes', medications: ['Metformin 500mg'], doctor: 'Dr. Ahmed Raza' },
  { id: '#RE-1256', name: 'Fatima Jinnah', status: 'Active', lastVisit: '01 Nov 2023', condition: 'Vaccination Follow-up', medications: [], doctor: 'Dr. Mariam Farooq' },
  { id: '#RE-3390', name: 'Bilal Siddiqui', status: 'Stable', lastVisit: '15 Oct 2023', condition: 'Gastrointestinal Follow-up', medications: ['Omeprazole 20mg'], doctor: 'Dr. Arsalan Khan' },
  { id: '#RE-7712', name: 'Sara Ahmed', status: 'Observation', lastVisit: '22 Oct 2023', condition: 'Allergic Reaction', medications: ['Cetirizine 10mg'], doctor: 'Dr. Sarah Khalil' },
]

const ALL_APPOINTMENTS = [
  { id: 1, patient: 'Mrs. Sarah Jenkins', doctor: 'Dr. Arsalan Khan', date: 'Today', time: '09:00 AM', type: 'Check-up', status: 'Confirmed', location: 'Room 302' },
  { id: 2, patient: 'Mr. David Ahmed', doctor: 'Dr. Arsalan Khan', date: 'Today', time: '10:30 AM', type: 'Video Consult', status: 'Live Now', location: 'Online' },
  { id: 3, patient: 'Ms. Fatima Noor', doctor: 'Dr. Arsalan Khan', date: 'Tomorrow', time: '11:45 AM', type: 'Lab Review', status: 'Pending', location: 'In-Person' },
  { id: 4, patient: 'Ayesha Khan', doctor: 'Dr. Arsalan Khan', date: 'Tomorrow', time: '02:15 PM', type: 'Immunization', status: 'Confirmed', location: 'Room 104' },
  { id: 5, patient: 'Mr. Rafiq Hussain', doctor: 'Dr. Arsalan Khan', date: 'Yesterday', time: '09:30 AM', type: 'Check-up', status: 'Completed', location: 'Room 201' },
  { id: 6, patient: 'Mrs. Nadia Patel', doctor: 'Dr. Mansoor Ali', date: 'Yesterday', time: '11:00 AM', type: 'Video Consult', status: 'No-Show', location: 'Online' },
  { id: 7, patient: 'Mr. Tariq Shah', doctor: 'Dr. Sarah Ahmed', date: 'Yesterday', time: '02:00 PM', type: 'Lab Review', status: 'Completed', location: 'Room 302' },
  { id: 8, patient: 'Alyan Ahmed', doctor: 'Dr. Sarah Khalil', date: 'Oct 24, 2026', time: '10:30 AM', type: 'Cardiology', status: 'Confirmed', location: 'Online' },
  { id: 9, patient: 'Alyan Ahmed', doctor: 'Dr. Ahmed Raza', date: 'Oct 28, 2026', time: '02:15 PM', type: 'General', status: 'Confirmed', location: 'In-Person' },
  { id: 10, patient: 'Alyan Ahmed', doctor: 'Dr. Mariam Farooq', date: 'Sept 12, 2026', time: '10:00 AM', type: 'Pediatrics', status: 'Completed', location: 'In-Person' },
  { id: 11, patient: 'Alyan Ahmed', doctor: 'Dr. Sarah Khalil', date: 'Aug 30, 2026', time: '11:00 AM', type: 'Cardiology', status: 'Not Attended', location: 'Online' },
  { id: 12, patient: 'Alyan Ahmed', doctor: 'Dr. Ahmed Raza', date: 'Aug 15, 2026', time: '09:00 AM', type: 'General', status: 'Completed', location: 'In-Person' },
]

const VIDEO_CALLS = [
  { id: 1, doctor: 'Dr. Arsalan Khan', patient: 'Mr. David Ahmed', date: 'Today', time: '10:30 AM', duration: '32 min', status: 'Live' },
  { id: 2, doctor: 'Dr. Mansoor Ali', patient: 'Mrs. Nadia Patel', date: 'Yesterday', time: '11:00 AM', duration: '—', status: 'Missed' },
  { id: 3, doctor: 'Dr. Sarah Khalil', patient: 'Alyan Ahmed', date: 'Aug 30', time: '11:00 AM', duration: '—', status: 'Not Attended' },
  { id: 4, doctor: 'Dr. Sarah Ahmed', patient: 'Mrs. Sarah Jenkins', date: 'Oct 10', time: '03:00 PM', duration: '28 min', status: 'Completed' },
  { id: 5, doctor: 'Dr. Arsalan Khan', patient: 'Ayesha Gillani', date: 'Oct 08', time: '04:00 PM', duration: '41 min', status: 'Completed' },
  { id: 6, doctor: 'Dr. Mansoor Ali', patient: 'Haris Vohra', date: 'Oct 05', time: '09:00 AM', duration: '35 min', status: 'Completed' },
]

const AI_QUERIES = [
  { id: 1, patient: 'Alyan Ahmed', query: 'Persistent lower back pain for 3 days', response: 'Suggested physiotherapy evaluation', time: '09:31 AM, Today', flag: false },
  { id: 2, patient: 'Arsalan Khan', query: 'Chest tightness and shortness of breath', response: 'Flagged — urgent cardiology referral', time: '11:15 AM, Today', flag: true },
  { id: 3, patient: 'Zainab Ahmed', query: 'Post-surgery wound redness', response: 'Advised immediate doctor consultation', time: '02:20 PM, Yesterday', flag: true },
  { id: 4, patient: 'Omar Malik', query: 'Blood sugar reading of 180 mg/dL', response: 'Dietary adjustments recommended', time: '04:00 PM, Yesterday', flag: false },
  { id: 5, patient: 'Fatima Jinnah', query: 'Child has mild fever after vaccine', response: 'Normal post-vaccination response', time: '10:00 AM, Oct 20', flag: false },
  { id: 6, patient: 'Sara Ahmed', query: 'Recurring hives after shellfish', response: 'Allergy testing recommended', time: '03:30 PM, Oct 19', flag: false },
]

// Patients pay for consultations — doctors don't pay
const TRANSACTIONS = [
  { id: 'TXN-4821', patient: 'Alyan Ahmed', doctor: 'Dr. Arsalan Khan', amount: 2500, date: 'Oct 14, 2026', method: 'Debit Card', status: 'Completed' },
  { id: 'TXN-4822', patient: 'Alyan Ahmed', doctor: 'Dr. Sarah Khalil', amount: 4500, date: 'Oct 24, 2026', method: 'Credit Card', status: 'Completed' },
  { id: 'TXN-4823', patient: 'Alyan Ahmed', doctor: 'Dr. Ahmed Raza', amount: 2000, date: 'Oct 28, 2026', method: 'Crypto (BTC)', status: 'Completed' },
  { id: 'TXN-4824', patient: 'Mrs. Sarah Jenkins', doctor: 'Dr. Arsalan Khan', amount: 2500, date: 'Today', method: 'Debit Card', status: 'Completed' },
  { id: 'TXN-4825', patient: 'Mr. David Ahmed', doctor: 'Dr. Arsalan Khan', amount: 2500, date: 'Today', method: 'Credit Card', status: 'Pending' },
  { id: 'TXN-4826', patient: 'Mrs. Nadia Patel', doctor: 'Dr. Mansoor Ali', amount: 5000, date: 'Yesterday', method: 'Debit Card', status: 'Refund Requested' },
  { id: 'TXN-4827', patient: 'Ayesha Gillani', doctor: 'Dr. Arsalan Khan', amount: 2500, date: 'Oct 08', method: 'Debit Card', status: 'Completed' },
  { id: 'TXN-4828', patient: 'Haris Vohra', doctor: 'Dr. Mansoor Ali', amount: 5000, date: 'Oct 05', method: 'Crypto (USDT)', status: 'Completed' },
]

const COMPLAINTS = [
  { id: 'TKT-101', from: 'Alyan Ahmed', role: 'Patient', subject: 'Video call kept freezing', date: 'Oct 20, 2026', status: 'Open', priority: 'High', detail: 'The video call kept freezing during my consultation with Dr. Khalil. Had to reconnect 3 times.' },
  { id: 'TKT-102', from: 'Dr. Ahmed Raza', role: 'Doctor', subject: 'Schedule sync not working', date: 'Oct 18, 2026', status: 'In Progress', priority: 'Medium', detail: 'Appointments accepted from dashboard are not appearing in My Schedule page.' },
  { id: 'TKT-103', from: 'Mrs. Nadia Patel', role: 'Patient', subject: 'Refund not processed', date: 'Oct 15, 2026', status: 'Open', priority: 'High', detail: 'Doctor did not attend the call but I was charged PKR 5,000. Requesting full refund.' },
  { id: 'TKT-104', from: 'Dr. Sarah Ahmed', role: 'Doctor', subject: 'Patient no-show policy', date: 'Oct 12, 2026', status: 'Resolved', priority: 'Low', detail: 'Need clarity on the platform policy for repeated patient no-shows.' },
  { id: 'TKT-105', from: 'Omar Malik', role: 'Patient', subject: 'AI diagnosis inaccuracy', date: 'Oct 10, 2026', status: 'In Progress', priority: 'Medium', detail: 'The AI suggested a condition that my doctor later ruled out.' },
]

const MONTHLY = [
  { month: 'Jul', appts: 38, rev: 95000 }, { month: 'Aug', appts: 45, rev: 112500 },
  { month: 'Sep', appts: 52, rev: 130000 }, { month: 'Oct', appts: 61, rev: 152500 },
  { month: 'Nov', appts: 48, rev: 120000 }, { month: 'Dec', appts: 55, rev: 137500 },
]

const SPECS = ['General Physician', 'Pediatrician', 'Psychiatrist', 'Cardiologist', 'Neurologist', 'Dermatologist', 'Orthopedic Surgeon', 'Oncologist']

/* ═══════════════════════════════════════════════════════════════
   SIDEBAR SECTIONS
   ═══════════════════════════════════════════════════════════════ */
const NAV = [
  { id: 'overview', icon: 'space_dashboard', label: 'Overview' },
  { id: 'doctors', icon: 'stethoscope', label: 'Doctors' },
  { id: 'patients', icon: 'groups', label: 'Patients' },
  { id: 'appointments', icon: 'event_note', label: 'Appointments' },
  { id: 'videocalls', icon: 'video_camera_front', label: 'Video Calls' },
  { id: 'ai', icon: 'neurology', label: 'AI Monitoring' },
  { id: 'payments', icon: 'account_balance_wallet', label: 'Payments' },
  { id: 'reports', icon: 'insert_chart', label: 'Analytics' },
  { id: 'complaints', icon: 'contact_support', label: 'Support' },
  { id: 'settings', icon: 'manufacturing', label: 'Settings' },
]

/* ═══════════════════════════════════════════════════════════════
   HELPERS
   ═══════════════════════════════════════════════════════════════ */
const badge = (s) => {
  const m = {
    Active: 'bg-emerald-50 text-emerald-700 ring-emerald-600/20',
    Pending: 'bg-amber-50 text-amber-700 ring-amber-600/20',
    Suspended: 'bg-red-50 text-red-700 ring-red-600/20',
    Critical: 'bg-red-50 text-red-700 ring-red-600/20',
    Stable: 'bg-blue-50 text-blue-700 ring-blue-600/20',
    Observation: 'bg-violet-50 text-violet-700 ring-violet-600/20',
    Completed: 'bg-emerald-50 text-emerald-700 ring-emerald-600/20',
    Confirmed: 'bg-blue-50 text-blue-700 ring-blue-600/20',
    'Live Now': 'bg-emerald-50 text-emerald-700 ring-emerald-600/20',
    'No-Show': 'bg-red-50 text-red-700 ring-red-600/20',
    'Not Attended': 'bg-red-50 text-red-700 ring-red-600/20',
    Live: 'bg-emerald-50 text-emerald-700 ring-emerald-600/20',
    Missed: 'bg-red-50 text-red-700 ring-red-600/20',
    Paid: 'bg-emerald-50 text-emerald-700 ring-emerald-600/20',
    'Refund Requested': 'bg-amber-50 text-amber-700 ring-amber-600/20',
    Open: 'bg-red-50 text-red-700 ring-red-600/20',
    'In Progress': 'bg-amber-50 text-amber-700 ring-amber-600/20',
    Resolved: 'bg-emerald-50 text-emerald-700 ring-emerald-600/20',
    High: 'bg-red-50 text-red-700 ring-red-600/20',
    Medium: 'bg-amber-50 text-amber-700 ring-amber-600/20',
    Low: 'bg-blue-50 text-blue-700 ring-blue-600/20',
  }
  return m[s] || 'bg-gray-50 text-gray-600 ring-gray-500/20'
}

function B({ children }) { return <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-semibold ring-1 ring-inset ${badge(children)}`}>{children}</span> }

function Kpi({ icon, label, value, change, color = '#006977' }) {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-[0_1px_3px_rgba(0,0,0,0.04)] border border-gray-100 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between mb-4">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: color + '12' }}>
          <span className="material-symbols-outlined text-xl" style={{ color, fontVariationSettings: "'FILL' 1" }}>{icon}</span>
        </div>
        {change && <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${change.startsWith('+') ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'}`}>{change}</span>}
      </div>
      <p className="text-2xl font-bold text-gray-900 tracking-tight">{value}</p>
      <p className="text-[13px] text-gray-500 mt-1">{label}</p>
    </div>
  )
}

function Head({ icon, title, count }) {
  return (
    <div className="flex items-center justify-between mb-6">
      <div className="flex items-center gap-3">
        <span className="material-symbols-outlined text-[#006977] text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>{icon}</span>
        <h2 className="text-xl font-bold text-gray-900 tracking-tight">{title}</h2>
      </div>
      {count !== undefined && <span className="text-xs font-semibold text-gray-400 bg-gray-100 px-3 py-1 rounded-full">{count} total</span>}
    </div>
  )
}

function Card({ children, className = '' }) { return <div className={`bg-white rounded-2xl shadow-[0_1px_3px_rgba(0,0,0,0.04)] border border-gray-100 overflow-hidden ${className}`}>{children}</div> }

/* ═══════════════════════════════════════════════════════════════
   MAIN COMPONENT
   ═══════════════════════════════════════════════════════════════ */
export default function AdminDashboardPage() {
  const { logout } = useAuth()
  const navigate = useNavigate()
  const [section, setSection] = useState('overview')
  const [doctors, setDoctors] = useState(ALL_DOCTORS)
  const [apptFilter, setApptFilter] = useState('All')
  const [complaints, setComplaints] = useState(COMPLAINTS)
  const [specs, setSpecs] = useState(SPECS)
  const [newSpec, setNewSpec] = useState('')
  const [modal, setModal] = useState(null)
  const [toast, setToast] = useState('')
  const flash = (m) => { setToast(m); setTimeout(() => setToast(''), 3000) }
  const filteredAppts = useMemo(() => apptFilter === 'All' ? ALL_APPOINTMENTS : ALL_APPOINTMENTS.filter(a => a.status === apptFilter), [apptFilter])
  const totalRev = TRANSACTIONS.filter(t => t.status === 'Completed').reduce((s, t) => s + t.amount, 0)

  /* ─── SIDEBAR ─── */
  const sidebar = (
    <aside className="fixed left-0 top-0 bottom-0 w-[260px] bg-white border-r border-gray-200/80 flex flex-col z-50">
      {/* Logo */}
      <div className="px-6 py-7 border-b border-gray-100">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-[#006977] flex items-center justify-center"><span className="material-symbols-outlined text-white text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>local_hospital</span></div>
          <div><p className="text-[15px] font-bold text-gray-900 leading-none">Askare</p><p className="text-[10px] text-gray-400 font-medium tracking-wider uppercase mt-0.5">Admin Console</p></div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
        <p className="px-3 pt-2 pb-3 text-[10px] font-bold text-gray-400 uppercase tracking-[0.15em]">Menu</p>
        {NAV.map(n => {
          const active = section === n.id
          return (
            <button key={n.id} onClick={() => setSection(n.id)} className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] font-medium transition-all ${active ? 'bg-[#006977]/[0.07] text-[#006977] font-semibold' : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'}`}>
              <span className="material-symbols-outlined text-[20px]" style={active ? { fontVariationSettings: "'FILL' 1" } : {}}>{n.icon}</span>
              {n.label}
            </button>
          )
        })}
      </nav>

      {/* Bottom */}
      <div className="px-3 pb-4 border-t border-gray-100 pt-3 space-y-1">
        <div className="px-3 py-2 flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-[#006977] flex items-center justify-center"><span className="material-symbols-outlined text-white text-sm">admin_panel_settings</span></div>
          <div><p className="text-xs font-semibold text-gray-900">Admin</p><p className="text-[10px] text-gray-400">admin@askare.health</p></div>
        </div>
        <button onClick={() => { logout(); navigate('/login') }} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] font-medium text-red-500 hover:bg-red-50 transition-colors">
          <span className="material-symbols-outlined text-[20px]">logout</span>Sign Out
        </button>
      </div>
    </aside>
  )

  /* ─── OVERVIEW ─── */
  const renderOverview = () => {
    const mx = Math.max(...MONTHLY.map(m => m.appts))
    const mxR = Math.max(...MONTHLY.map(m => m.rev))
    return (
      <>
        <div className="mb-8"><h1 className="text-2xl font-bold text-gray-900 tracking-tight">Dashboard Overview</h1><p className="text-sm text-gray-500 mt-1">Welcome back, Admin. Here&apos;s what&apos;s happening on Askare.</p></div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
          <Kpi icon="groups" label="Total Patients" value={ALL_PATIENTS.length} change="+12%" />
          <Kpi icon="stethoscope" label="Total Doctors" value={ALL_DOCTORS.length} change="+2" color="#6366f1" />
          <Kpi icon="event_note" label="Total Appointments" value={ALL_APPOINTMENTS.length} color="#f59e0b" />
          <Kpi icon="account_balance_wallet" label="Revenue (Patients)" value={`PKR ${totalRev.toLocaleString()}`} change="+18%" color="#ec4899" />
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          {[
            { l: 'Active Cases', v: ALL_PATIENTS.filter(p => p.status === 'Active').length, c: 'text-emerald-600' },
            { l: 'Pending Approvals', v: doctors.filter(d => d.status === 'Pending').length, c: 'text-amber-600' },
            { l: 'Completed Today', v: ALL_APPOINTMENTS.filter(a => a.status === 'Completed').length, c: 'text-blue-600' },
            { l: 'No-Shows', v: ALL_APPOINTMENTS.filter(a => a.status === 'No-Show' || a.status === 'Not Attended').length, c: 'text-red-600' },
          ].map(s => (
            <div key={s.l} className="bg-white rounded-xl p-4 border border-gray-100 shadow-[0_1px_2px_rgba(0,0,0,0.04)]">
              <p className="text-xs text-gray-400 font-medium mb-1">{s.l}</p>
              <p className={`text-xl font-bold ${s.c}`}>{s.v}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <Card className="p-6">
            <h3 className="text-sm font-semibold text-gray-900 mb-5">Monthly Appointments</h3>
            <div className="flex items-end gap-4 h-36">
              {MONTHLY.map(m => (
                <div key={m.month} className="flex-1 flex flex-col items-center gap-1.5">
                  <span className="text-[10px] text-gray-500 font-semibold">{m.appts}</span>
                  <div className="w-full rounded-md bg-[#006977] transition-all hover:opacity-80" style={{ height: `${(m.appts / mx) * 100}%` }} />
                  <span className="text-[10px] text-gray-400 font-medium">{m.month}</span>
                </div>
              ))}
            </div>
          </Card>
          <Card className="p-6">
            <h3 className="text-sm font-semibold text-gray-900 mb-5">Patient Payments (PKR)</h3>
            <div className="flex items-end gap-4 h-36">
              {MONTHLY.map(m => (
                <div key={m.month} className="flex-1 flex flex-col items-center gap-1.5">
                  <span className="text-[10px] text-gray-500 font-semibold">{(m.rev / 1000).toFixed(0)}k</span>
                  <div className="w-full rounded-md bg-[#6366f1] transition-all hover:opacity-80" style={{ height: `${(m.rev / mxR) * 100}%` }} />
                  <span className="text-[10px] text-gray-400 font-medium">{m.month}</span>
                </div>
              ))}
            </div>
          </Card>
        </div>

        <Card className="p-6">
          <h3 className="text-sm font-semibold text-gray-900 mb-4">Recent Activity</h3>
          <div className="space-y-0">
            {[
              { icon: 'person_add', text: 'New patient Alyan Ahmed registered', time: '2 min ago', c: '#006977' },
              { icon: 'check_circle', text: 'Dr. Arsalan Khan accepted appointment — Ayesha Gillani', time: '15 min ago', c: '#059669' },
              { icon: 'videocam', text: 'Video call started: Dr. Arsalan Khan ↔ Mr. David Ahmed', time: '30 min ago', c: '#6366f1' },
              { icon: 'flag', text: 'AI flagged urgent query — chest tightness (Arsalan Khan)', time: '1 hr ago', c: '#ef4444' },
              { icon: 'payments', text: 'Payment PKR 2,500 received from Mrs. Sarah Jenkins', time: '2 hrs ago', c: '#006977' },
            ].map((a, i) => (
              <div key={i} className="flex items-center gap-4 py-3 border-b border-gray-50 last:border-0">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0" style={{ backgroundColor: a.c + '10' }}>
                  <span className="material-symbols-outlined text-base" style={{ color: a.c, fontVariationSettings: "'FILL' 1" }}>{a.icon}</span>
                </div>
                <p className="flex-1 text-sm text-gray-700">{a.text}</p>
                <span className="text-xs text-gray-400 whitespace-nowrap">{a.time}</span>
              </div>
            ))}
          </div>
        </Card>
      </>
    )
  }

  /* ─── DOCTORS ─── */
  const renderDoctors = () => (
    <>
      <Head icon="stethoscope" title="Doctor Management" count={doctors.length} />
      <Card>
        <table className="w-full"><thead><tr className="bg-gray-50/80 border-b border-gray-100"><th className="px-5 py-3 text-left text-[10px] font-bold uppercase tracking-widest text-gray-400">Doctor</th><th className="px-5 py-3 text-left text-[10px] font-bold uppercase tracking-widest text-gray-400">Specialty</th><th className="px-5 py-3 text-left text-[10px] font-bold uppercase tracking-widest text-gray-400">Location</th><th className="px-5 py-3 text-left text-[10px] font-bold uppercase tracking-widest text-gray-400">Rating</th><th className="px-5 py-3 text-left text-[10px] font-bold uppercase tracking-widest text-gray-400">Consult Fee</th><th className="px-5 py-3 text-left text-[10px] font-bold uppercase tracking-widest text-gray-400">Status</th><th className="px-5 py-3 text-right text-[10px] font-bold uppercase tracking-widest text-gray-400">Actions</th></tr></thead>
        <tbody className="divide-y divide-gray-50">
          {doctors.map(d => (
            <tr key={d.id} className="hover:bg-gray-50/50 transition-colors">
              <td className="px-5 py-4"><div className="flex items-center gap-3"><div className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden shrink-0">{d.img ? <img src={d.img} alt="" className="w-full h-full object-cover" /> : <span className="material-symbols-outlined text-gray-400 text-sm">person</span>}</div><div><p className="text-sm font-semibold text-gray-900">{d.name}</p><p className="text-[11px] text-gray-400">{d.gender} · {d.joined}</p></div></div></td>
              <td className="px-5 py-4 text-sm text-gray-600">{d.spec}</td>
              <td className="px-5 py-4 text-sm text-gray-500">{d.location}</td>
              <td className="px-5 py-4"><span className="text-sm font-semibold text-amber-500">★ {d.rating}</span></td>
              <td className="px-5 py-4 text-sm text-gray-700 font-medium">{d.price}</td>
              <td className="px-5 py-4"><B>{d.status}</B></td>
              <td className="px-5 py-4 text-right">
                <div className="flex items-center justify-end gap-1.5">
                  <button onClick={() => setModal({ t: 'doc', d })} className="px-2.5 py-1.5 rounded-lg text-xs font-semibold text-[#006977] hover:bg-[#006977]/5 transition-colors">View</button>
                  {d.status === 'Pending' && <button onClick={() => { setDoctors(p => p.map(x => x.id === d.id ? { ...x, status: 'Active' } : x)); flash(`${d.name} approved`) }} className="px-2.5 py-1.5 rounded-lg text-xs font-semibold text-emerald-600 bg-emerald-50 hover:bg-emerald-100 transition-colors">Approve</button>}
                  {d.status === 'Active' && <button onClick={() => { setDoctors(p => p.map(x => x.id === d.id ? { ...x, status: 'Suspended' } : x)); flash(`${d.name} suspended`) }} className="px-2.5 py-1.5 rounded-lg text-xs font-semibold text-red-600 hover:bg-red-50 transition-colors">Suspend</button>}
                  {d.status === 'Suspended' && <button onClick={() => { setDoctors(p => p.map(x => x.id === d.id ? { ...x, status: 'Active' } : x)); flash(`${d.name} reactivated`) }} className="px-2.5 py-1.5 rounded-lg text-xs font-semibold text-emerald-600 hover:bg-emerald-50 transition-colors">Reactivate</button>}
                </div>
              </td>
            </tr>
          ))}
        </tbody></table>
      </Card>
    </>
  )

  /* ─── PATIENTS ─── */
  const renderPatients = () => (
    <>
      <Head icon="groups" title="Patient Management" count={ALL_PATIENTS.length} />
      <Card>
        <table className="w-full"><thead><tr className="bg-gray-50/80 border-b border-gray-100"><th className="px-5 py-3 text-left text-[10px] font-bold uppercase tracking-widest text-gray-400">Patient</th><th className="px-5 py-3 text-left text-[10px] font-bold uppercase tracking-widest text-gray-400">ID</th><th className="px-5 py-3 text-left text-[10px] font-bold uppercase tracking-widest text-gray-400">Status</th><th className="px-5 py-3 text-left text-[10px] font-bold uppercase tracking-widest text-gray-400">Last Visit</th><th className="px-5 py-3 text-left text-[10px] font-bold uppercase tracking-widest text-gray-400">Condition</th><th className="px-5 py-3 text-left text-[10px] font-bold uppercase tracking-widest text-gray-400">Doctor</th><th className="px-5 py-3 text-right text-[10px] font-bold uppercase tracking-widest text-gray-400">Actions</th></tr></thead>
        <tbody className="divide-y divide-gray-50">
          {ALL_PATIENTS.map(p => (
            <tr key={p.id} className="hover:bg-gray-50/50 transition-colors">
              <td className="px-5 py-4 text-sm font-semibold text-gray-900">{p.name}</td>
              <td className="px-5 py-4 text-xs text-gray-400 font-mono">{p.id}</td>
              <td className="px-5 py-4"><B>{p.status}</B></td>
              <td className="px-5 py-4 text-sm text-gray-500">{p.lastVisit}</td>
              <td className="px-5 py-4 text-sm text-gray-600 max-w-[180px] truncate">{p.condition}</td>
              <td className="px-5 py-4 text-sm text-gray-500">{p.doctor}</td>
              <td className="px-5 py-4 text-right"><button onClick={() => setModal({ t: 'pat', d: p })} className="px-2.5 py-1.5 rounded-lg text-xs font-semibold text-[#006977] hover:bg-[#006977]/5 transition-colors">Details</button></td>
            </tr>
          ))}
        </tbody></table>
      </Card>
    </>
  )

  /* ─── APPOINTMENTS ─── */
  const renderAppointments = () => (
    <>
      <Head icon="event_note" title="Appointment Management" count={ALL_APPOINTMENTS.length} />
      <div className="flex flex-wrap gap-2 mb-5">{['All', 'Confirmed', 'Completed', 'Pending', 'No-Show', 'Not Attended', 'Live Now'].map(f => <button key={f} onClick={() => setApptFilter(f)} className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all ${apptFilter === f ? 'bg-[#006977] text-white shadow-sm' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'}`}>{f}</button>)}</div>
      <Card>
        <table className="w-full"><thead><tr className="bg-gray-50/80 border-b border-gray-100"><th className="px-5 py-3 text-left text-[10px] font-bold uppercase tracking-widest text-gray-400">Patient</th><th className="px-5 py-3 text-left text-[10px] font-bold uppercase tracking-widest text-gray-400">Doctor</th><th className="px-5 py-3 text-left text-[10px] font-bold uppercase tracking-widest text-gray-400">Date</th><th className="px-5 py-3 text-left text-[10px] font-bold uppercase tracking-widest text-gray-400">Time</th><th className="px-5 py-3 text-left text-[10px] font-bold uppercase tracking-widest text-gray-400">Type</th><th className="px-5 py-3 text-left text-[10px] font-bold uppercase tracking-widest text-gray-400">Status</th></tr></thead>
        <tbody className="divide-y divide-gray-50">{filteredAppts.map(a => (
          <tr key={a.id} className="hover:bg-gray-50/50 transition-colors"><td className="px-5 py-4 text-sm font-semibold text-gray-900">{a.patient}</td><td className="px-5 py-4 text-sm text-gray-600">{a.doctor}</td><td className="px-5 py-4 text-sm text-gray-500">{a.date}</td><td className="px-5 py-4 text-sm text-gray-500">{a.time}</td><td className="px-5 py-4 text-sm text-gray-500">{a.type}</td><td className="px-5 py-4"><B>{a.status}</B></td></tr>
        ))}</tbody></table>
        {filteredAppts.length === 0 && <p className="py-10 text-center text-sm text-gray-400">No appointments match this filter.</p>}
      </Card>
    </>
  )

  /* ─── VIDEO CALLS ─── */
  const renderVideoCalls = () => (
    <>
      <Head icon="video_camera_front" title="Video Call Logs" count={VIDEO_CALLS.length} />
      <Card>
        <table className="w-full"><thead><tr className="bg-gray-50/80 border-b border-gray-100"><th className="px-5 py-3 text-left text-[10px] font-bold uppercase tracking-widest text-gray-400">Doctor</th><th className="px-5 py-3 text-left text-[10px] font-bold uppercase tracking-widest text-gray-400">Patient</th><th className="px-5 py-3 text-left text-[10px] font-bold uppercase tracking-widest text-gray-400">Date</th><th className="px-5 py-3 text-left text-[10px] font-bold uppercase tracking-widest text-gray-400">Time</th><th className="px-5 py-3 text-left text-[10px] font-bold uppercase tracking-widest text-gray-400">Duration</th><th className="px-5 py-3 text-left text-[10px] font-bold uppercase tracking-widest text-gray-400">Status</th></tr></thead>
        <tbody className="divide-y divide-gray-50">{VIDEO_CALLS.map(v => (
          <tr key={v.id} className="hover:bg-gray-50/50 transition-colors"><td className="px-5 py-4 text-sm font-semibold text-gray-900">{v.doctor}</td><td className="px-5 py-4 text-sm text-gray-600">{v.patient}</td><td className="px-5 py-4 text-sm text-gray-500">{v.date}</td><td className="px-5 py-4 text-sm text-gray-500">{v.time}</td><td className="px-5 py-4 text-sm text-gray-700 font-medium">{v.duration}</td><td className="px-5 py-4"><B>{v.status}</B></td></tr>
        ))}</tbody></table>
      </Card>
    </>
  )

  /* ─── AI ─── */
  const renderAI = () => (
    <>
      <Head icon="neurology" title="AI Chat Monitoring" />
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-8">
        <Kpi icon="forum" label="Total Queries" value={AI_QUERIES.length} color="#8b5cf6" />
        <Kpi icon="speed" label="Avg Response" value="1.8s" color="#06b6d4" />
        <Kpi icon="flag" label="Flagged Queries" value={AI_QUERIES.filter(q => q.flag).length} change="Needs Review" color="#ef4444" />
      </div>
      <Card>
        <table className="w-full"><thead><tr className="bg-gray-50/80 border-b border-gray-100"><th className="px-5 py-3 text-left text-[10px] font-bold uppercase tracking-widest text-gray-400">Patient</th><th className="px-5 py-3 text-left text-[10px] font-bold uppercase tracking-widest text-gray-400">Query</th><th className="px-5 py-3 text-left text-[10px] font-bold uppercase tracking-widest text-gray-400">AI Response</th><th className="px-5 py-3 text-left text-[10px] font-bold uppercase tracking-widest text-gray-400">Time</th><th className="px-5 py-3 text-left text-[10px] font-bold uppercase tracking-widest text-gray-400">Safety</th></tr></thead>
        <tbody className="divide-y divide-gray-50">{AI_QUERIES.map(q => (
          <tr key={q.id} className="hover:bg-gray-50/50 transition-colors"><td className="px-5 py-4 text-sm font-semibold text-gray-900">{q.patient}</td><td className="px-5 py-4 text-sm text-gray-600 max-w-[200px] truncate">{q.query}</td><td className="px-5 py-4 text-sm text-gray-500 max-w-[200px] truncate">{q.response}</td><td className="px-5 py-4 text-xs text-gray-400 whitespace-nowrap">{q.time}</td><td className="px-5 py-4">{q.flag ? <span className="inline-flex items-center gap-1 text-xs font-semibold text-red-600"><span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>warning</span>Flagged</span> : <span className="text-xs font-semibold text-emerald-600">✓ Safe</span>}</td></tr>
        ))}</tbody></table>
      </Card>
    </>
  )

  /* ─── PAYMENTS (patients pay, not doctors) ─── */
  const renderPayments = () => {
    const pending = TRANSACTIONS.filter(t => t.status === 'Pending').reduce((s, t) => s + t.amount, 0)
    const refund = TRANSACTIONS.filter(t => t.status === 'Refund Requested').reduce((s, t) => s + t.amount, 0)
    return (
      <>
        <Head icon="account_balance_wallet" title="Patient Payments" count={TRANSACTIONS.length} />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
          <Kpi icon="account_balance" label="Total Collected" value={`PKR ${totalRev.toLocaleString()}`} change="+18%" />
          <Kpi icon="schedule" label="Pending" value={`PKR ${pending.toLocaleString()}`} color="#f59e0b" />
          <Kpi icon="undo" label="Refund Requests" value={`PKR ${refund.toLocaleString()}`} color="#ef4444" />
          <Kpi icon="trending_up" label="Avg Consultation Fee" value="PKR 3,250" color="#6366f1" />
        </div>
        <Card>
          <table className="w-full"><thead><tr className="bg-gray-50/80 border-b border-gray-100"><th className="px-5 py-3 text-left text-[10px] font-bold uppercase tracking-widest text-gray-400">TX ID</th><th className="px-5 py-3 text-left text-[10px] font-bold uppercase tracking-widest text-gray-400">Patient (Payer)</th><th className="px-5 py-3 text-left text-[10px] font-bold uppercase tracking-widest text-gray-400">Doctor</th><th className="px-5 py-3 text-left text-[10px] font-bold uppercase tracking-widest text-gray-400">Amount</th><th className="px-5 py-3 text-left text-[10px] font-bold uppercase tracking-widest text-gray-400">Date</th><th className="px-5 py-3 text-left text-[10px] font-bold uppercase tracking-widest text-gray-400">Method</th><th className="px-5 py-3 text-left text-[10px] font-bold uppercase tracking-widest text-gray-400">Status</th></tr></thead>
          <tbody className="divide-y divide-gray-50">{TRANSACTIONS.map(t => (
            <tr key={t.id} className="hover:bg-gray-50/50 transition-colors"><td className="px-5 py-4 text-xs text-[#006977] font-mono font-bold">{t.id}</td><td className="px-5 py-4 text-sm font-semibold text-gray-900">{t.patient}</td><td className="px-5 py-4 text-sm text-gray-600">{t.doctor}</td><td className="px-5 py-4 text-sm text-gray-900 font-bold">PKR {t.amount.toLocaleString()}</td><td className="px-5 py-4 text-sm text-gray-500">{t.date}</td><td className="px-5 py-4 text-sm text-gray-500">{t.method}</td><td className="px-5 py-4"><B>{t.status}</B></td></tr>
          ))}</tbody></table>
        </Card>
      </>
    )
  }

  /* ─── REPORTS ─── */
  const renderReports = () => {
    const sc = ALL_PATIENTS.reduce((a, p) => { a[p.status] = (a[p.status] || 0) + 1; return a }, {})
    const bar = { Active: '#059669', Critical: '#dc2626', Stable: '#2563eb', Observation: '#8b5cf6' }
    return (
      <>
        <Head icon="insert_chart" title="Reports & Analytics" />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <Card className="p-6">
            <h3 className="text-sm font-semibold text-gray-900 mb-5">Patient Status Distribution</h3>
            <div className="space-y-4">{Object.entries(sc).map(([s, c]) => (
              <div key={s} className="flex items-center gap-3"><B>{s}</B><div className="flex-1 h-2.5 bg-gray-100 rounded-full overflow-hidden"><div className="h-full rounded-full transition-all" style={{ width: `${(c / ALL_PATIENTS.length) * 100}%`, backgroundColor: bar[s] || '#9ca3af' }} /></div><span className="text-sm font-bold text-gray-700 w-6 text-right">{c}</span></div>
            ))}</div>
          </Card>
          <Card className="p-6">
            <h3 className="text-sm font-semibold text-gray-900 mb-5">Most Common Conditions</h3>
            <div className="space-y-3">{ALL_PATIENTS.map(p => (
              <div key={p.id} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0"><span className="text-sm text-gray-700">{p.condition}</span><span className="text-xs font-semibold text-[#006977] bg-[#006977]/5 px-2.5 py-1 rounded-full">1</span></div>
            ))}</div>
          </Card>
        </div>
        <Card className="p-6">
          <h3 className="text-sm font-semibold text-gray-900 mb-5">Top Rated Doctors</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">{[...ALL_DOCTORS].sort((a, b) => parseFloat(b.rating) - parseFloat(a.rating)).slice(0, 5).map((d, i) => (
            <div key={d.id} className="rounded-xl border border-gray-100 p-4 text-center hover:shadow-sm transition-shadow">
              <div className="w-10 h-10 rounded-full bg-[#006977] mx-auto flex items-center justify-center mb-3"><span className="text-white font-bold text-sm">#{i + 1}</span></div>
              <p className="text-sm font-semibold text-gray-900 mb-0.5">{d.name}</p>
              <p className="text-[10px] text-gray-400 mb-2">{d.spec}</p>
              <span className="text-amber-500 font-bold text-sm">★ {d.rating}</span>
            </div>
          ))}</div>
        </Card>
      </>
    )
  }

  /* ─── COMPLAINTS ─── */
  const renderComplaints = () => (
    <>
      <Head icon="contact_support" title="Complaints & Support" count={complaints.length} />
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-8">
        <Kpi icon="error_outline" label="Open Tickets" value={complaints.filter(c => c.status === 'Open').length} color="#ef4444" />
        <Kpi icon="hourglass_top" label="In Progress" value={complaints.filter(c => c.status === 'In Progress').length} color="#f59e0b" />
        <Kpi icon="task_alt" label="Resolved" value={complaints.filter(c => c.status === 'Resolved').length} />
      </div>
      <Card>
        <table className="w-full"><thead><tr className="bg-gray-50/80 border-b border-gray-100"><th className="px-5 py-3 text-left text-[10px] font-bold uppercase tracking-widest text-gray-400">Ticket</th><th className="px-5 py-3 text-left text-[10px] font-bold uppercase tracking-widest text-gray-400">From</th><th className="px-5 py-3 text-left text-[10px] font-bold uppercase tracking-widest text-gray-400">Role</th><th className="px-5 py-3 text-left text-[10px] font-bold uppercase tracking-widest text-gray-400">Subject</th><th className="px-5 py-3 text-left text-[10px] font-bold uppercase tracking-widest text-gray-400">Priority</th><th className="px-5 py-3 text-left text-[10px] font-bold uppercase tracking-widest text-gray-400">Status</th><th className="px-5 py-3 text-right text-[10px] font-bold uppercase tracking-widest text-gray-400">Actions</th></tr></thead>
        <tbody className="divide-y divide-gray-50">{complaints.map(c => (
          <tr key={c.id} className="hover:bg-gray-50/50 transition-colors"><td className="px-5 py-4 text-xs text-[#006977] font-mono font-bold">{c.id}</td><td className="px-5 py-4 text-sm font-semibold text-gray-900">{c.from}</td><td className="px-5 py-4 text-sm text-gray-500">{c.role}</td><td className="px-5 py-4 text-sm text-gray-600 max-w-[180px] truncate">{c.subject}</td><td className="px-5 py-4"><B>{c.priority}</B></td><td className="px-5 py-4"><B>{c.status}</B></td>
          <td className="px-5 py-4 text-right"><div className="flex items-center justify-end gap-1.5"><button onClick={() => setModal({ t: 'cmp', d: c })} className="px-2.5 py-1.5 rounded-lg text-xs font-semibold text-[#006977] hover:bg-[#006977]/5 transition-colors">View</button>{c.status !== 'Resolved' && <button onClick={() => { setComplaints(p => p.map(x => x.id === c.id ? { ...x, status: 'Resolved' } : x)); flash(`${c.id} resolved`) }} className="px-2.5 py-1.5 rounded-lg text-xs font-semibold text-emerald-600 bg-emerald-50 hover:bg-emerald-100 transition-colors">Resolve</button>}</div></td></tr>
        ))}</tbody></table>
      </Card>
    </>
  )

  /* ─── SETTINGS ─── */
  const renderSettings = () => (
    <>
      <Head icon="manufacturing" title="Platform Settings" />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <h3 className="text-sm font-semibold text-gray-900 mb-4 flex items-center gap-2"><span className="material-symbols-outlined text-[#006977] text-lg">category</span>Manage Specializations</h3>
          <div className="flex gap-2 mb-4">
            <input type="text" value={newSpec} onChange={e => setNewSpec(e.target.value)} onKeyDown={e => { if (e.key === 'Enter') { if (newSpec.trim() && !specs.includes(newSpec.trim())) { setSpecs(p => [...p, newSpec.trim()]); setNewSpec(''); flash('Added') } } }} placeholder="Add specialization…" className="flex-1 bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:border-[#006977] focus:ring-1 focus:ring-[#006977]/20 outline-none transition-all" />
            <button onClick={() => { if (newSpec.trim() && !specs.includes(newSpec.trim())) { setSpecs(p => [...p, newSpec.trim()]); setNewSpec(''); flash('Added') } }} className="px-4 py-2.5 rounded-xl bg-[#006977] text-white text-sm font-semibold hover:bg-[#005a66] transition-colors">Add</button>
          </div>
          <div className="flex flex-wrap gap-2">{specs.map(s => <span key={s} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gray-50 text-gray-700 text-xs font-medium border border-gray-200">{s}<button onClick={() => { setSpecs(p => p.filter(x => x !== s)); flash(`Removed ${s}`) }} className="hover:text-red-500 transition-colors"><span className="material-symbols-outlined text-xs">close</span></button></span>)}</div>
        </Card>
        <Card className="p-6">
          <h3 className="text-sm font-semibold text-gray-900 mb-4 flex items-center gap-2"><span className="material-symbols-outlined text-[#006977] text-lg">gavel</span>Platform Rules</h3>
          <div className="space-y-0">{[{ l: 'Cancellation Policy', v: 'Non-refundable after confirmation' }, { l: 'No-Show Policy', v: 'Repayment required to reschedule' }, { l: 'Refund Window', v: '24 hours before appointment' }, { l: 'Max Reschedules', v: '2 per appointment' }].map(r => <div key={r.l} className="flex items-center justify-between py-3 border-b border-gray-50 last:border-0"><span className="text-sm text-gray-700">{r.l}</span><span className="text-xs font-semibold text-[#006977] bg-[#006977]/5 px-3 py-1 rounded-lg">{r.v}</span></div>)}</div>
        </Card>
        <Card className="p-6">
          <h3 className="text-sm font-semibold text-gray-900 mb-4 flex items-center gap-2"><span className="material-symbols-outlined text-[#006977] text-lg">shield</span>Privacy & Compliance</h3>
          <div className="space-y-0">{[{ l: 'Data Retention', v: '5 Years', on: true }, { l: 'HIPAA Compliance', v: 'Enabled', on: true }, { l: 'Patient Consent', v: 'Required', on: true }, { l: 'Anonymous AI Queries', v: 'Disabled', on: false }].map(p => <div key={p.l} className="flex items-center justify-between py-3 border-b border-gray-50 last:border-0"><div><p className="text-sm text-gray-700">{p.l}</p><p className="text-[10px] text-gray-400">{p.v}</p></div><div className={`w-9 h-5 rounded-full relative cursor-pointer transition-colors ${p.on ? 'bg-[#006977]' : 'bg-gray-200'}`}><div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow-sm transition-all ${p.on ? 'left-[18px]' : 'left-0.5'}`} /></div></div>)}</div>
        </Card>
        <Card className="p-6">
          <h3 className="text-sm font-semibold text-gray-900 mb-4 flex items-center gap-2"><span className="material-symbols-outlined text-[#006977] text-lg">event_available</span>Appointment Types</h3>
          <div className="space-y-0">{['General Check-up', 'Video Consultation', 'Lab Review', 'Immunization', 'Follow-up', 'Emergency', 'Prescription Refill'].map(t => <div key={t} className="flex items-center gap-3 py-2.5 border-b border-gray-50 last:border-0"><span className="w-1.5 h-1.5 rounded-full bg-[#006977]" /><span className="text-sm text-gray-700">{t}</span></div>)}</div>
        </Card>
      </div>
    </>
  )

  const views = { overview: renderOverview, doctors: renderDoctors, patients: renderPatients, appointments: renderAppointments, videocalls: renderVideoCalls, ai: renderAI, payments: renderPayments, reports: renderReports, complaints: renderComplaints, settings: renderSettings }

  return (
    <div className="min-h-screen bg-[#f8f9fb]">
      {sidebar}
      <main className="ml-[260px] p-8 max-w-[1400px]">
        {(views[section] || renderOverview)()}
      </main>

      {/* Modal */}
      {modal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={() => setModal(null)} />
          <div className="relative bg-white rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden border border-gray-100" style={{ animation: 'fadeIn 0.25s ease' }}>
            <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
              <h3 className="text-base font-bold text-gray-900">{modal.t === 'doc' ? 'Doctor Profile' : modal.t === 'pat' ? 'Patient Details' : `Ticket ${modal.d.id}`}</h3>
              <button onClick={() => setModal(null)} className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 transition-colors"><span className="material-symbols-outlined text-xl">close</span></button>
            </div>
            <div className="px-6 py-5 space-y-4 max-h-[60vh] overflow-y-auto">
              {modal.t === 'doc' && <>
                <div className="flex items-center gap-4"><div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden">{modal.d.img ? <img src={modal.d.img} alt="" className="w-full h-full object-cover" /> : <span className="material-symbols-outlined text-gray-400">person</span>}</div><div><p className="font-bold text-gray-900">{modal.d.name}</p><p className="text-sm text-[#006977]">{modal.d.spec}</p></div></div>
                <div className="grid grid-cols-2 gap-x-6 gap-y-3">{[['Location', modal.d.location], ['Rating', `★ ${modal.d.rating}`], ['Consult Fee', modal.d.price], ['Patients', modal.d.patients], ['Gender', modal.d.gender], ['Joined', modal.d.joined]].map(([l, v]) => <div key={l}><p className="text-[10px] text-gray-400 uppercase tracking-widest mb-0.5">{l}</p><p className="text-sm text-gray-800 font-medium">{v}</p></div>)}</div>
                <div><p className="text-[10px] text-gray-400 uppercase tracking-widest mb-1">Status</p><B>{modal.d.status}</B></div>
                <div><p className="text-[10px] text-gray-400 uppercase tracking-widest mb-1">About</p><p className="text-sm text-gray-600 leading-relaxed">{modal.d.about}</p></div>
              </>}
              {modal.t === 'pat' && <>
                <div className="grid grid-cols-2 gap-x-6 gap-y-3">{[['Name', modal.d.name], ['ID', modal.d.id], ['Last Visit', modal.d.lastVisit], ['Doctor', modal.d.doctor]].map(([l, v]) => <div key={l}><p className="text-[10px] text-gray-400 uppercase tracking-widest mb-0.5">{l}</p><p className="text-sm text-gray-800 font-medium">{v}</p></div>)}</div>
                <div><p className="text-[10px] text-gray-400 uppercase tracking-widest mb-1">Status</p><B>{modal.d.status}</B></div>
                <div><p className="text-[10px] text-gray-400 uppercase tracking-widest mb-1">Condition</p><p className="text-sm text-gray-600">{modal.d.condition}</p></div>
                {modal.d.medications?.length > 0 && <div><p className="text-[10px] text-gray-400 uppercase tracking-widest mb-2">Medications</p><div className="flex flex-wrap gap-2">{modal.d.medications.map(m => <span key={m} className="px-3 py-1 rounded-full bg-gray-50 text-gray-600 text-xs border border-gray-200">{m}</span>)}</div></div>}
              </>}
              {modal.t === 'cmp' && <>
                <div className="grid grid-cols-2 gap-x-6 gap-y-3">{[['From', modal.d.from], ['Role', modal.d.role], ['Date', modal.d.date]].map(([l, v]) => <div key={l}><p className="text-[10px] text-gray-400 uppercase tracking-widest mb-0.5">{l}</p><p className="text-sm text-gray-800 font-medium">{v}</p></div>)}</div>
                <div className="flex gap-3"><div><p className="text-[10px] text-gray-400 uppercase tracking-widest mb-1">Priority</p><B>{modal.d.priority}</B></div><div><p className="text-[10px] text-gray-400 uppercase tracking-widest mb-1">Status</p><B>{modal.d.status}</B></div></div>
                <div><p className="text-[10px] text-gray-400 uppercase tracking-widest mb-1">Subject</p><p className="text-sm text-gray-800 font-medium">{modal.d.subject}</p></div>
                <div><p className="text-[10px] text-gray-400 uppercase tracking-widest mb-1">Details</p><p className="text-sm text-gray-600 leading-relaxed">{modal.d.detail}</p></div>
              </>}
            </div>
          </div>
        </div>
      )}

      {toast && <div className="fixed bottom-6 right-6 z-[110]"><div className="bg-[#006977] text-white px-5 py-3 rounded-xl shadow-lg flex items-center gap-2.5 text-sm font-semibold"><span className="material-symbols-outlined text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>{toast}</div></div>}
    </div>
  )
}
