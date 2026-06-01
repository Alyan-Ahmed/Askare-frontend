import { useState, useMemo, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

/* ═══════════════════════════════════════════════════════════════
   DATA
   ═══════════════════════════════════════════════════════════════ */
const DEFAULT_DOCTORS = [
  { id: 1, name: 'Dr. Arsalan Khan', email: 'arsalan@askare.health', spec: 'General Physician', location: 'Clifton, Karachi', rating: '4.9', price: 'PKR 2,500', gender: 'Male', status: 'Active', joined: 'Jan 15, 2024', patients: 128, img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBJ4LyJ5urRhYWaNc0fAHi1aTPLnVNXCr9Jt3_5dGQkr4oLP2ZKJVy6rIpZrwq0M2pRVXyd9husXHlkwbu953qA9NJcmVQTAwcoY5vO9R0WOEZVtm2ycNh4gYQqj8ef4G7tyZBVvySBVcnN79uOgWnsxrVhjq2L1tbDDu3svWyhtYP5QWFMxpJExQVH5qNCL1n71mb-T_7bbgRMoxc4ZKChtFLv2MhapV1uxN-3cexn7PW6JJV9r95g4ia08RxSTMZipeYxtApQyHQ', about: 'Experienced GP with 12+ years in family medicine.' },
  { id: 2, name: 'Dr. Sarah Ahmed', email: 'sarah.a@askare.health', spec: 'Pediatrician', location: 'DHA Phase VI, Karachi', rating: '5.0', price: 'PKR 3,000', gender: 'Female', status: 'Active', joined: 'Mar 22, 2024', patients: 95, img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD-KawnVanuKt14ZQFtYKaRGkXXXSy_dSCBaDU6_oWWDI5SkQxorawLqkFKaF28GKp9625EUcBiNzTKK07YeNngi0A4y91Wo6DBSKJSuFG4_A9Lqkh4KAeEXbCq0r8CxB8Q7egHxfNXcwNwJwjuFZtM2QXRDaEk3eaFm4b0dNFhihp70seNnWVEl5xw7SdlbO2ARt_0cMPWiTz7Z_ZGDtSwtYoXJQVrNdrAAXSne880taIH5w9NCdSq17vWdMaMszuEhamhlP5Ea58', about: 'Board-certified pediatrician at Aga Khan University Hospital.' },
  { id: 3, name: 'Dr. Mansoor Ali', email: 'mansoor@askare.health', spec: 'Psychiatrist', location: 'Gulshan-e-Iqbal, Karachi', rating: '4.8', price: 'PKR 5,000', gender: 'Male', status: 'Active', joined: 'Feb 10, 2024', patients: 67, img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC0R2oB8OJVQzikzuZsZ6-yi1yy7TSmFjQDJBvIqUptz-S9nkEMSg7m_2T8bN8g_MJqvKANbPxrqi0lLknSMt_nyI9WJBrd-_N38Hw2SvMNxS3IAr74fExUA_bY83zpTQVvIgt4QdZRoEmxfDVX84ATLqB64VZJCC1orZaIXsv38DyxOX1VgVLzUrqJ4_LSzdGgCGca54Kr2iMwFYlHICqj9RGSPgEb1rOvglrTyexlyQPcdJ-6hOenL48N__8-akZdUgGcu8bQ38A', about: 'Senior consultant psychiatrist specializing in CBT.' },
  { id: 4, name: 'Dr. Mariam Farooq', email: 'mariam@askare.health', spec: 'Pediatrician', location: 'PECHS, Karachi', rating: '4.7', price: 'PKR 2,800', gender: 'Female', status: 'Pending', joined: 'May 01, 2025', patients: 0, img: '', about: 'Pediatrics specialist with focus on neonatal care.' },
  { id: 5, name: 'Dr. Sarah Khalil', email: 'khalil@askare.health', spec: 'Cardiologist', location: 'North Nazimabad, Karachi', rating: '4.6', price: 'PKR 4,500', gender: 'Female', status: 'Active', joined: 'Apr 18, 2024', patients: 82, img: '', about: 'Interventional cardiologist with 8 years of experience.' },
  { id: 6, name: 'Dr. Ahmed Raza', email: 'raza@askare.health', spec: 'General Physician', location: 'Bahadurabad, Karachi', rating: '4.5', price: 'PKR 2,000', gender: 'Male', status: 'Suspended', joined: 'Jun 05, 2024', patients: 45, img: '', about: 'GP with interest in preventive medicine.' },
  { id: 7, name: 'Dr. Nadia Hassan', email: 'nadia@askare.health', spec: 'Cardiologist', location: 'Saddar, Karachi', rating: '4.7', price: 'PKR 4,000', gender: 'Female', status: 'Active', joined: 'Jul 20, 2024', patients: 54, img: '', about: 'Preventive cardiologist with research background.' },
  { id: 8, name: 'Dr. Usman Tariq', email: 'usman@askare.health', spec: 'Psychiatrist', location: 'Nazimabad, Karachi', rating: '4.4', price: 'PKR 4,500', gender: 'Male', status: 'Active', joined: 'Aug 03, 2024', patients: 39, img: '', about: 'Child & adolescent psychiatry specialist.' },
]

const DEFAULT_PATIENTS = [
  { uid: 'ASK-90210', name: 'Arsalan Khan', email: 'arsalan.k@gmail.com', gender: 'Male', status: 'Active', joined: 'Oct 12, 2023' },
  { uid: 'ASK-88420', name: 'Zainab Ahmed', email: 'zainab.a@gmail.com', gender: 'Female', status: 'Active', joined: 'Nov 05, 2023' },
  { uid: 'ASK-44120', name: 'Omar Malik', email: 'omar.m@gmail.com', gender: 'Male', status: 'Active', joined: 'Oct 28, 2023' },
  { uid: 'ASK-12560', name: 'Fatima Jinnah', email: 'fatima.j@gmail.com', gender: 'Female', status: 'Active', joined: 'Nov 01, 2023' },
  { uid: 'ASK-33900', name: 'Bilal Siddiqui', email: 'bilal.s@gmail.com', gender: 'Male', status: 'Active', joined: 'Oct 15, 2023' },
  { uid: 'ASK-77120', name: 'Sara Ahmed', email: 'sara.a@gmail.com', gender: 'Female', status: 'Active', joined: 'Oct 22, 2023' },
  { uid: 'ASK-19830', name: 'Hammad Ali', email: 'hammad.a@gmail.com', gender: 'Male', status: 'Blocked', joined: 'Sep 20, 2023' },
  { uid: 'ASK-55610', name: 'Aisha Noor', email: 'aisha.n@gmail.com', gender: 'Female', status: 'Active', joined: 'Dec 02, 2023' },
]

const ALL_APPOINTMENTS = [
  { id: 1, patient: 'Mrs. Sarah Jenkins', doctor: 'Dr. Arsalan Khan', date: 'Today', time: '09:00 AM', type: 'Check-up', status: 'Confirmed' },
  { id: 2, patient: 'Mr. David Ahmed', doctor: 'Dr. Arsalan Khan', date: 'Today', time: '10:30 AM', type: 'Video Consult', status: 'Live Now' },
  { id: 3, patient: 'Ms. Fatima Noor', doctor: 'Dr. Arsalan Khan', date: 'Tomorrow', time: '11:45 AM', type: 'Lab Review', status: 'Pending' },
  { id: 4, patient: 'Ayesha Khan', doctor: 'Dr. Sarah Ahmed', date: 'Tomorrow', time: '02:15 PM', type: 'Immunization', status: 'Confirmed' },
  { id: 5, patient: 'Mr. Rafiq Hussain', doctor: 'Dr. Arsalan Khan', date: 'Yesterday', time: '09:30 AM', type: 'Check-up', status: 'Completed' },
  { id: 6, patient: 'Mrs. Nadia Patel', doctor: 'Dr. Mansoor Ali', date: 'Yesterday', time: '11:00 AM', type: 'Video Consult', status: 'No-Show' },
  { id: 7, patient: 'Mr. Tariq Shah', doctor: 'Dr. Sarah Ahmed', date: 'Yesterday', time: '02:00 PM', type: 'Lab Review', status: 'Completed' },
  { id: 8, patient: 'Alyan Ahmed', doctor: 'Dr. Sarah Khalil', date: 'Oct 24', time: '10:30 AM', type: 'Cardiology', status: 'Confirmed' },
  { id: 9, patient: 'Alyan Ahmed', doctor: 'Dr. Ahmed Raza', date: 'Oct 28', time: '02:15 PM', type: 'General', status: 'Confirmed' },
  { id: 10, patient: 'Alyan Ahmed', doctor: 'Dr. Mariam Farooq', date: 'Sept 12', time: '10:00 AM', type: 'Pediatrics', status: 'Completed' },
  { id: 11, patient: 'Alyan Ahmed', doctor: 'Dr. Sarah Khalil', date: 'Aug 30', time: '11:00 AM', type: 'Cardiology', status: 'Not Attended' },
  { id: 12, patient: 'Alyan Ahmed', doctor: 'Dr. Ahmed Raza', date: 'Aug 15', time: '09:00 AM', type: 'General', status: 'Completed' },
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
  { id: 'TKT-101', from: 'Alyan Ahmed', role: 'Patient', subject: 'Video call kept freezing', date: 'Oct 20, 2026', status: 'Open', detail: 'The video call kept freezing during my consultation with Dr. Khalil. Had to reconnect 3 times.' },
  { id: 'TKT-102', from: 'Dr. Ahmed Raza', role: 'Doctor', subject: 'Schedule sync not working', date: 'Oct 18, 2026', status: 'In Progress', detail: 'Appointments accepted from dashboard are not appearing in My Schedule page.' },
  { id: 'TKT-103', from: 'Mrs. Nadia Patel', role: 'Patient', subject: 'Refund not processed', date: 'Oct 15, 2026', status: 'Open', detail: 'Doctor did not attend the call but I was charged PKR 5,000. Requesting full refund.' },
  { id: 'TKT-104', from: 'Dr. Sarah Ahmed', role: 'Doctor', subject: 'Patient no-show policy', date: 'Oct 12, 2026', status: 'Resolved', detail: 'Need clarity on the platform policy for repeated patient no-shows.' },
  { id: 'TKT-105', from: 'Omar Malik', role: 'Patient', subject: 'AI diagnosis inaccuracy', date: 'Oct 10, 2026', status: 'In Progress', detail: 'The AI suggested a condition that my doctor later ruled out.' },
]

const MONTHLY = [
  { month: 'Jul', appts: 38, rev: 95000, patients: 12, doctors: 2 },
  { month: 'Aug', appts: 45, rev: 112500, patients: 18, doctors: 3 },
  { month: 'Sep', appts: 52, rev: 130000, patients: 24, doctors: 4 },
  { month: 'Oct', appts: 61, rev: 152500, patients: 31, doctors: 5 },
  { month: 'Nov', appts: 48, rev: 120000, patients: 36, doctors: 5 },
  { month: 'Dec', appts: 55, rev: 137500, patients: 42, doctors: 6 },
]
const ALL_TIME_DATA = [
  { month: 'Jan', appts: 18, rev: 45000, patients: 3, doctors: 1 },
  { month: 'Feb', appts: 22, rev: 55000, patients: 5, doctors: 1 },
  { month: 'Mar', appts: 28, rev: 70000, patients: 7, doctors: 2 },
  { month: 'Apr', appts: 31, rev: 77500, patients: 9, doctors: 2 },
  { month: 'May', appts: 35, rev: 87500, patients: 11, doctors: 2 },
  { month: 'Jun', appts: 33, rev: 82500, patients: 12, doctors: 2 },
  ...MONTHLY,
]

const SPECS = ['General Physician', 'Pediatrician', 'Psychiatrist', 'Cardiologist', 'Neurologist', 'Dermatologist', 'Orthopedic Surgeon', 'Oncologist']

const NAV = [
  { id: 'overview', icon: 'space_dashboard', label: 'Overview' },
  { id: 'doctors', icon: 'stethoscope', label: 'Doctors' },
  { id: 'patients', icon: 'groups', label: 'Patients' },
  { id: 'appointments', icon: 'event_note', label: 'Appointments' },
  { id: 'videocalls', icon: 'video_camera_front', label: 'Video Calls' },
  { id: 'ai', icon: 'neurology', label: 'AI Monitoring' },
  { id: 'payments', icon: 'account_balance_wallet', label: 'Payments' },
  { id: 'complaints', icon: 'contact_support', label: 'Support' },
  { id: 'settings', icon: 'manufacturing', label: 'Settings' },
]

/* ═══════════════════════════════════════════════════════════════
   COMPONENTS
   ═══════════════════════════════════════════════════════════════ */
const bdg = s => ({ Active:'bg-emerald-50 text-emerald-700 ring-emerald-600/20', Pending:'bg-amber-50 text-amber-700 ring-amber-600/20', Suspended:'bg-red-50 text-red-700 ring-red-600/20', Completed:'bg-emerald-50 text-emerald-700 ring-emerald-600/20', Confirmed:'bg-blue-50 text-blue-700 ring-blue-600/20', 'Live Now':'bg-emerald-50 text-emerald-700 ring-emerald-600/20', 'No-Show':'bg-red-50 text-red-700 ring-red-600/20', 'Not Attended':'bg-red-50 text-red-700 ring-red-600/20', Live:'bg-emerald-50 text-emerald-700 ring-emerald-600/20', Missed:'bg-red-50 text-red-700 ring-red-600/20', 'Refund Requested':'bg-amber-50 text-amber-700 ring-amber-600/20', Open:'bg-red-50 text-red-700 ring-red-600/20', 'In Progress':'bg-amber-50 text-amber-700 ring-amber-600/20', Resolved:'bg-emerald-50 text-emerald-700 ring-emerald-600/20', Blocked:'bg-red-50 text-red-700 ring-red-600/20' })[s] || 'bg-gray-50 text-gray-600 ring-gray-500/20'

function B({ children }) { return <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ring-1 ring-inset ${bdg(children)}`}>{children}</span> }

function Kpi({ icon, label, value, sub, color = '#006977' }) {
  return (<div className="bg-white rounded-2xl p-6 shadow-[0_1px_3px_rgba(0,0,0,0.06)] border border-gray-100 hover:shadow-lg transition-all">
    <div className="flex items-center justify-between mb-4">
      <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ backgroundColor: color + '14' }}><span className="material-symbols-outlined text-2xl" style={{ color, fontVariationSettings: "'FILL' 1" }}>{icon}</span></div>
      {sub && <span className={`text-sm font-semibold px-2.5 py-0.5 rounded-full ${typeof sub === 'string' && sub.startsWith('+') ? 'bg-emerald-50 text-emerald-600' : 'bg-gray-100 text-gray-500'}`}>{sub}</span>}
    </div>
    <p className="text-3xl font-bold text-gray-900 tracking-tight">{value}</p>
    <p className="text-sm text-gray-500 mt-1.5 font-medium">{label}</p>
  </div>)
}

function Head({ icon, title, count, children }) { return (<div className="flex items-center justify-between mb-7 flex-wrap gap-3"><div className="flex items-center gap-3"><span className="material-symbols-outlined text-[#006977] text-3xl" style={{ fontVariationSettings: "'FILL' 1" }}>{icon}</span><h2 className="text-2xl font-bold text-gray-900">{title}</h2></div><div className="flex items-center gap-3">{count !== undefined && <span className="text-sm font-semibold text-gray-400 bg-gray-100 px-4 py-1.5 rounded-full">{count} total</span>}{children}</div></div>) }
function Card({ children, className = '' }) { return <div className={`bg-white rounded-2xl shadow-[0_1px_3px_rgba(0,0,0,0.06)] border border-gray-100 overflow-hidden ${className}`}>{children}</div> }
function SearchBar({ value, onChange, placeholder }) { return (<div className="relative mb-5"><span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-xl">search</span><input type="text" value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl text-base text-gray-900 placeholder:text-gray-400 focus:border-[#006977] focus:ring-2 focus:ring-[#006977]/10 outline-none transition-all" /></div>) }
function TH({ children, className = '' }) { return <th className={`px-5 py-4 text-left text-xs font-bold uppercase tracking-wider text-gray-500 ${className}`}>{children}</th> }

/* SVG Area Chart */
function AreaChart({ data, dataKey, color, height = 200 }) {
  if (!data.length) return null
  const vals = data.map(d => d[dataKey]), max = Math.max(...vals), min = Math.min(...vals), range = max - min || 1
  const W = 520, padT = 25, padB = 32, cH = height - padT - padB, stepX = W / (data.length - 1)
  const pts = data.map((d, i) => ({ x: i * stepX, y: padT + cH - ((d[dataKey] - min) / range) * cH }))
  const line = pts.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x},${p.y}`).join(' ')
  const area = `${line} L${W},${height - padB} L0,${height - padB} Z`
  const gId = `g-${color.replace('#', '')}-${dataKey}`
  return (<svg viewBox={`0 0 ${W} ${height}`} className="w-full" style={{ height }}>
    <defs><linearGradient id={gId} x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor={color} stopOpacity="0.3" /><stop offset="100%" stopColor={color} stopOpacity="0.02" /></linearGradient></defs>
    {[0, 0.25, 0.5, 0.75, 1].map(f => { const y = padT + cH * (1 - f); return <line key={f} x1="0" y1={y} x2={W} y2={y} stroke="#e5e7eb" strokeWidth="0.6" strokeDasharray="4,4" /> })}
    <path d={area} fill={`url(#${gId})`} /><path d={line} fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
    {pts.map((p, i) => (<g key={i}><circle cx={p.x} cy={p.y} r="4.5" fill="white" stroke={color} strokeWidth="2.5" /><text x={p.x} y={p.y - 13} textAnchor="middle" fill="#374151" style={{ fontSize: '11px', fontWeight: 600 }}>{dataKey === 'rev' ? `${(vals[i] / 1000).toFixed(0)}k` : vals[i]}</text><text x={p.x} y={height - 8} textAnchor="middle" fill="#9ca3af" style={{ fontSize: '11px' }}>{data[i].month}</text></g>))}
  </svg>)
}

/* Donut Chart */
function DonutChart({ segments, size = 160, centerLabel }) {
  const total = segments.reduce((s, seg) => s + seg.value, 0)
  const r = 56, cx = size / 2, cy = size / 2, circ = 2 * Math.PI * r
  let off = 0
  return (<svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
    <circle cx={cx} cy={cy} r={r} fill="none" stroke="#f3f4f6" strokeWidth="20" />
    {segments.map((seg, i) => { const pct = seg.value / total; const dash = circ * pct; const o = off; off += dash; return <circle key={i} cx={cx} cy={cy} r={r} fill="none" stroke={seg.color} strokeWidth="20" strokeDasharray={`${dash} ${circ - dash}`} strokeDashoffset={-o} transform={`rotate(-90 ${cx} ${cy})`} /> })}
    <text x={cx} y={cy - 6} textAnchor="middle" fill="#111827" style={{ fontSize: '26px', fontWeight: 700 }}>{total}</text>
    <text x={cx} y={cy + 14} textAnchor="middle" fill="#9ca3af" style={{ fontSize: '11px', fontWeight: 500 }}>{centerLabel || 'Total'}</text>
  </svg>)
}

/* Horizontal bar */
function HBar({ label, value, max, color }) {
  return (<div className="flex items-center gap-4"><span className="text-sm text-gray-700 font-medium" style={{ minWidth: 140 }}>{label}</span><div className="flex-1 h-3.5 bg-gray-100 rounded-full overflow-hidden"><div className="h-full rounded-full transition-all" style={{ width: `${Math.max((value / max) * 100, 8)}%`, backgroundColor: color }} /></div><span className="text-sm font-bold text-gray-800 w-6 text-right">{value}</span></div>)
}

/* ═══════════════════════════════════════════════════════════════
   MAIN
   ═══════════════════════════════════════════════════════════════ */
export default function AdminDashboardPage() {
  const { logout } = useAuth()
  const navigate = useNavigate()
  const [section, setSection] = useState('overview')
  const [doctors, setDoctors] = useState(DEFAULT_DOCTORS)
  const [patients, setPatients] = useState(DEFAULT_PATIENTS)
  const [apptFilter, setApptFilter] = useState('All')
  const [complaints, setComplaints] = useState(COMPLAINTS)
  const [specs, setSpecs] = useState(SPECS)
  const [newSpec, setNewSpec] = useState('')
  const [modal, setModal] = useState(null)
  const [toast, setToast] = useState('')
  const [docSearch, setDocSearch] = useState('')
  const [patSearch, setPatSearch] = useState('')
  const [chartRange, setChartRange] = useState('month')
  const [privacy, setPrivacy] = useState({ dataRetention: true, hipaa: true, patientConsent: true, anonAI: false, twoFactor: true, auditLog: true, encryptBackup: true, sessionTimeout: true })
  const toastTimer = useRef(null)

  const flash = m => {
    setToast(m)
    if (toastTimer.current) clearTimeout(toastTimer.current)
    toastTimer.current = setTimeout(() => {
      setToast('')
      toastTimer.current = null
    }, 3000)
  }
  const togglePrivacy = k => { setPrivacy(p => ({ ...p, [k]: !p[k] })); flash(`${k} ${privacy[k] ? 'disabled' : 'enabled'}`) }

  useEffect(() => () => {
    if (toastTimer.current) clearTimeout(toastTimer.current)
  }, [])

  // Load real signups from sessionStorage
  useEffect(() => {
    const tempUsers = JSON.parse(sessionStorage.getItem('askare_temp_users') || '[]')
    if (!tempUsers.length) return
    const newDocs = tempUsers.filter(u => u.role === 'doctor' && !doctors.find(d => d.email === u.email)).map((u, i) => ({
      id: 100 + i, name: u.name, email: u.email, spec: 'Pending Review', location: 'Karachi', rating: '—', price: 'Not Set',
      gender: u.gender || 'Not specified', status: 'Pending', joined: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      patients: 0, img: '', about: 'Newly registered — awaiting admin approval.', uid: u.uid,
    }))
    const newPats = tempUsers.filter(u => u.role === 'patient' && !patients.find(p => p.email === u.email)).map(u => ({
      uid: u.uid, name: u.name, email: u.email, gender: u.gender || 'Not specified', status: 'Active',
      joined: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
    }))
    if (newDocs.length) setDoctors(prev => [...prev, ...newDocs])
    if (newPats.length) setPatients(prev => [...prev, ...newPats])
  }, [])

  const filteredAppts = useMemo(() => apptFilter === 'All' ? ALL_APPOINTMENTS : ALL_APPOINTMENTS.filter(a => a.status === apptFilter), [apptFilter])
  const totalRev = TRANSACTIONS.filter(t => t.status === 'Completed').reduce((s, t) => s + t.amount, 0)
  const filteredDocs = useMemo(() => { const q = docSearch.toLowerCase(); return q ? doctors.filter(d => d.name.toLowerCase().includes(q) || d.id.toString().includes(q) || d.spec.toLowerCase().includes(q) || (d.email || '').toLowerCase().includes(q)) : doctors }, [docSearch, doctors])
  const filteredPats = useMemo(() => { const q = patSearch.toLowerCase(); return q ? patients.filter(p => p.name.toLowerCase().includes(q) || (p.uid || '').toLowerCase().includes(q) || (p.email || '').toLowerCase().includes(q)) : patients }, [patSearch, patients])
  const chartData = chartRange === 'month' ? MONTHLY : ALL_TIME_DATA

  /* ─── SIDEBAR ─── */
  const sidebar = (
    <aside className="fixed left-0 top-0 bottom-0 w-[270px] bg-white border-r border-gray-200/80 flex flex-col z-50">
      <div className="px-7 py-7 border-b border-gray-100"><div className="flex items-center gap-3"><div className="w-10 h-10 rounded-xl bg-[#006977] flex items-center justify-center"><span className="material-symbols-outlined text-white text-xl" style={{ fontVariationSettings: "'FILL' 1" }}>local_hospital</span></div><div><p className="text-base font-bold text-gray-900 leading-none">Askare</p><p className="text-xs text-gray-400 font-medium tracking-wider uppercase mt-0.5">Admin Console</p></div></div></div>
      <nav className="flex-1 px-4 py-5 space-y-1 overflow-y-auto">
        <p className="px-3 pt-1 pb-3 text-[11px] font-bold text-gray-400 uppercase tracking-[0.15em]">Navigation</p>
        {NAV.map(n => { const a = section === n.id; return (<button key={n.id} onClick={() => setSection(n.id)} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${a ? 'bg-[#006977]/[0.08] text-[#006977] font-semibold' : 'text-gray-500 hover:bg-gray-50 hover:text-gray-800'}`}><span className="material-symbols-outlined text-[22px]" style={a ? { fontVariationSettings: "'FILL' 1" } : {}}>{n.icon}</span>{n.label}</button>) })}
      </nav>
      <div className="px-4 pb-5 border-t border-gray-100 pt-4 space-y-2">
        <div className="px-4 py-3 flex items-center gap-3"><div className="w-9 h-9 rounded-full bg-[#006977] flex items-center justify-center"><span className="material-symbols-outlined text-white text-base">admin_panel_settings</span></div><div><p className="text-sm font-semibold text-gray-900">Admin</p><p className="text-xs text-gray-400">admin@askare.health</p></div></div>
        <button onClick={() => { logout(); navigate('/login') }} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-red-500 hover:bg-red-50 transition-colors"><span className="material-symbols-outlined text-[22px]">logout</span>Sign Out</button>
      </div>
    </aside>
  )

  /* ═══════════════════════════════════════════════════════════════
     OVERVIEW — ordered by importance (most critical → least)
     ═══════════════════════════════════════════════════════════════ */
  const renderOverview = () => {
    // Appointment status
    const apptS = ALL_APPOINTMENTS.reduce((a, x) => { const k = x.status === 'Live Now' ? 'Live' : x.status; a[k] = (a[k] || 0) + 1; return a }, {})
    const apptDonut = [
      { label: 'Completed', value: apptS.Completed || 0, color: '#059669' },
      { label: 'Confirmed', value: apptS.Confirmed || 0, color: '#2563eb' },
      { label: 'Pending', value: apptS.Pending || 0, color: '#f59e0b' },
      { label: 'No-Show', value: (apptS['No-Show'] || 0) + (apptS['Not Attended'] || 0), color: '#ef4444' },
      { label: 'Live', value: apptS.Live || 0, color: '#10b981' },
    ].filter(s => s.value > 0)
    // Doctor status
    const docS = doctors.reduce((a, d) => { a[d.status] = (a[d.status] || 0) + 1; return a }, {})
    const docDonut = [
      { label: 'Active', value: docS.Active || 0, color: '#059669' },
      { label: 'Pending', value: docS.Pending || 0, color: '#f59e0b' },
      { label: 'Suspended', value: docS.Suspended || 0, color: '#ef4444' },
    ].filter(s => s.value > 0)
    // Patient status (same style as doctor status)
    const patS = patients.reduce((a, p) => { a[p.status] = (a[p.status] || 0) + 1; return a }, {})
    const patStatusDonut = [
      { label: 'Active', value: patS.Active || 0, color: '#059669' },
      { label: 'Blocked', value: patS.Blocked || 0, color: '#ef4444' },
    ].filter(s => s.value > 0)
    // Patient gender
    const patG = patients.reduce((a, p) => { a[p.gender] = (a[p.gender] || 0) + 1; return a }, {})
    const genderDonut = [
      { label: 'Male', value: patG.Male || 0, color: '#2563eb' },
      { label: 'Female', value: patG.Female || 0, color: '#ec4899' },
      { label: 'Other', value: patG['Not specified'] || 0, color: '#9ca3af' },
    ].filter(s => s.value > 0)
    // Payment methods
    const payM = TRANSACTIONS.reduce((a, t) => { const k = t.method.startsWith('Crypto') ? 'Crypto' : t.method; a[k] = (a[k] || 0) + 1; return a }, {})
    const payDonut = Object.entries(payM).map(([k, v], i) => ({ label: k, value: v, color: ['#006977', '#6366f1', '#ec4899', '#f59e0b'][i % 4] }))
    // Specialization distribution
    const specDist = doctors.filter(d => d.spec !== 'Pending Review').reduce((a, d) => { a[d.spec] = (a[d.spec] || 0) + 1; return a }, {})
    const maxSpec = Math.max(...Object.values(specDist), 1)
    const specColors = ['#006977', '#6366f1', '#ec4899', '#f59e0b', '#059669', '#ef4444']
    // Top doctors
    const topDocs = [...doctors].filter(d => d.rating !== '—').sort((a, b) => parseFloat(b.rating) - parseFloat(a.rating)).slice(0, 5)
    // AI stats
    const flaggedCount = AI_QUERIES.filter(q => q.flag).length

    return (
      <>
        <div className="mb-8"><h1 className="text-3xl font-bold text-gray-900">Dashboard Overview</h1><p className="text-base text-gray-500 mt-2">Welcome back, Admin. Here&apos;s your complete platform analytics.</p></div>

        {/* ——— TIER 1: KPI Cards (most important) ——— */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
          <Kpi icon="account_balance_wallet" label="Total Revenue" value={`PKR ${totalRev.toLocaleString()}`} sub="+18%" color="#006977" />
          <Kpi icon="event_note" label="Total Appointments" value={ALL_APPOINTMENTS.length} sub={`${apptS.Completed || 0} completed`} color="#6366f1" />
          <Kpi icon="groups" label="Total Patients" value={patients.length} sub={`${patS.Active || 0} active`} />
          <Kpi icon="stethoscope" label="Total Doctors" value={doctors.length} sub={`${docS.Pending || 0} pending`} color="#f59e0b" />
        </div>

        {/* ——— TIER 2: Revenue & Appointment Trends (high importance) ——— */}
        <div className="flex items-center gap-2 mb-4">
          <span className="text-sm font-semibold text-gray-500 mr-2">Time Range:</span>
          {[{ id: 'month', label: 'Last 6 Months' }, { id: 'all', label: 'All Time (12M)' }].map(r => <button key={r.id} onClick={() => setChartRange(r.id)} className={`px-4 py-2 rounded-full text-sm font-semibold transition-all ${chartRange === r.id ? 'bg-[#006977] text-white shadow-sm' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'}`}>{r.label}</button>)}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <Card className="p-6"><div className="flex items-center justify-between mb-2"><h3 className="text-base font-bold text-gray-900">Revenue Trend (PKR)</h3><span className="text-sm text-gray-400">{chartRange === 'month' ? 'Jul – Dec' : 'Jan – Dec'}</span></div><AreaChart data={chartData} dataKey="rev" color="#006977" /></Card>
          <Card className="p-6"><div className="flex items-center justify-between mb-2"><h3 className="text-base font-bold text-gray-900">Appointments Trend</h3><span className="text-sm text-gray-400">{chartRange === 'month' ? 'Jul – Dec' : 'Jan – Dec'}</span></div><AreaChart data={chartData} dataKey="appts" color="#6366f1" /></Card>
        </div>

        {/* ——— TIER 3: Appointment + Doctor + Patient Status Donuts ——— */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="p-6">
            <h3 className="text-base font-bold text-gray-900 mb-4">Appointment Breakdown</h3>
            <div className="flex items-center gap-5">
              <DonutChart segments={apptDonut} centerLabel="Appts" />
              <div className="space-y-2 flex-1">{apptDonut.map(s => (<div key={s.label} className="flex items-center gap-2"><span className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: s.color }} /><span className="text-sm text-gray-600 flex-1">{s.label}</span><span className="text-sm font-bold text-gray-800">{s.value}</span></div>))}</div>
            </div>
          </Card>
          <Card className="p-6">
            <h3 className="text-base font-bold text-gray-900 mb-4">Doctor Status</h3>
            <div className="flex items-center gap-5">
              <DonutChart segments={docDonut} centerLabel="Doctors" />
              <div className="space-y-2 flex-1">{docDonut.map(s => (<div key={s.label} className="flex items-center gap-2"><span className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: s.color }} /><span className="text-sm text-gray-600 flex-1">{s.label}</span><span className="text-sm font-bold text-gray-800">{s.value}</span></div>))}</div>
            </div>
          </Card>
          <Card className="p-6">
            <h3 className="text-base font-bold text-gray-900 mb-4">Patient Status</h3>
            <div className="flex items-center gap-5">
              <DonutChart segments={patStatusDonut} centerLabel="Patients" />
              <div className="space-y-2 flex-1">{patStatusDonut.map(s => (<div key={s.label} className="flex items-center gap-2"><span className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: s.color }} /><span className="text-sm text-gray-600 flex-1">{s.label}</span><span className="text-sm font-bold text-gray-800">{s.value}</span></div>))}</div>
            </div>
          </Card>
        </div>

        {/* ——— TIER 4: Patient & Doctor Growth Charts ——— */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <Card className="p-6"><div className="flex items-center justify-between mb-2"><h3 className="text-base font-bold text-gray-900">Patient Signups</h3></div><AreaChart data={chartData} dataKey="patients" color="#ec4899" /></Card>
          <Card className="p-6"><div className="flex items-center justify-between mb-2"><h3 className="text-base font-bold text-gray-900">Doctor Onboarding</h3></div><AreaChart data={chartData} dataKey="doctors" color="#f59e0b" /></Card>
        </div>

        {/* ——— TIER 5: Patient Gender + AI Stats + Payments ——— */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="p-6">
            <h3 className="text-base font-bold text-gray-900 mb-4">Patient Gender</h3>
            <div className="flex items-center gap-5">
              <DonutChart segments={genderDonut} centerLabel="Patients" />
              <div className="space-y-2 flex-1">{genderDonut.map(s => (<div key={s.label} className="flex items-center gap-2"><span className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: s.color }} /><span className="text-sm text-gray-600 flex-1">{s.label}</span><span className="text-sm font-bold text-gray-800">{s.value}</span></div>))}</div>
            </div>
          </Card>
          <Card className="p-6">
            <h3 className="text-base font-bold text-gray-900 mb-4">AI Monitoring</h3>
            <div className="space-y-4 mt-2">
              <div className="flex items-center justify-between"><span className="text-sm text-gray-600">Total Queries</span><span className="text-xl font-bold text-gray-900">{AI_QUERIES.length}</span></div>
              <div className="flex items-center justify-between"><span className="text-sm text-gray-600">Avg Response</span><span className="text-xl font-bold text-gray-900">1.8s</span></div>
              <div className="flex items-center justify-between"><span className="text-sm text-gray-600">Flagged (Urgent)</span><span className="text-xl font-bold text-red-600">{flaggedCount}</span></div>
              <div className="flex items-center justify-between"><span className="text-sm text-gray-600">Safe Queries</span><span className="text-xl font-bold text-emerald-600">{AI_QUERIES.length - flaggedCount}</span></div>
            </div>
          </Card>
          <Card className="p-6">
            <h3 className="text-base font-bold text-gray-900 mb-4">Payment Methods</h3>
            <div className="flex items-center gap-5">
              <DonutChart segments={payDonut} centerLabel="Payments" />
              <div className="space-y-2 flex-1">{payDonut.map(s => (<div key={s.label} className="flex items-center gap-2"><span className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: s.color }} /><span className="text-sm text-gray-600 flex-1">{s.label}</span><span className="text-sm font-bold text-gray-800">{s.value}</span></div>))}</div>
            </div>
          </Card>
        </div>

        {/* ——— TIER 6: Specialization + Top Doctors ——— */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <Card className="p-6">
            <h3 className="text-base font-bold text-gray-900 mb-5">Specialization Distribution</h3>
            <div className="space-y-4">{Object.entries(specDist).map(([s, c], i) => <HBar key={s} label={s} value={c} max={maxSpec} color={specColors[i % specColors.length]} />)}</div>
          </Card>
          <Card className="p-6">
            <h3 className="text-base font-bold text-gray-900 mb-5">Top Rated Doctors</h3>
            <div className="space-y-4">{topDocs.map((d, i) => (
              <div key={d.id} className="flex items-center gap-4">
                <div className="w-9 h-9 rounded-full bg-[#006977] flex items-center justify-center shrink-0"><span className="text-white font-bold text-sm">#{i + 1}</span></div>
                <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden shrink-0">{d.img ? <img src={d.img} alt="" className="w-full h-full object-cover" /> : <span className="material-symbols-outlined text-gray-400 text-lg">person</span>}</div>
                <div className="flex-1 min-w-0"><p className="text-base font-semibold text-gray-900 truncate">{d.name}</p><p className="text-xs text-gray-400">{d.spec} · {d.patients} patients</p></div>
                <span className="text-amber-500 font-bold text-base">★ {d.rating}</span>
              </div>
            ))}</div>
          </Card>
        </div>

        {/* ——— TIER 7: Activity Feed (lowest priority) ——— */}
        <Card className="p-6">
          <h3 className="text-base font-bold text-gray-900 mb-5">Recent Activity</h3>
          {[{ icon: 'person_add', text: 'New patient registered on the platform', time: '2 min ago', c: '#006977' },
            { icon: 'check_circle', text: 'Dr. Arsalan Khan accepted appointment — Ayesha Gillani', time: '15 min ago', c: '#059669' },
            { icon: 'videocam', text: 'Video call started: Dr. Arsalan Khan ↔ Mr. David Ahmed', time: '30 min ago', c: '#6366f1' },
            { icon: 'flag', text: 'AI flagged urgent query — chest tightness (Arsalan Khan)', time: '1 hr ago', c: '#ef4444' },
            { icon: 'payments', text: 'Patient payment PKR 2,500 from Mrs. Sarah Jenkins', time: '2 hrs ago', c: '#006977' },
            { icon: 'person_add', text: 'Dr. Mariam Farooq registered — pending approval', time: '3 hrs ago', c: '#f59e0b' },
          ].map((a, i) => (<div key={i} className="flex items-center gap-4 py-4 border-b border-gray-100 last:border-0"><div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: a.c + '12' }}><span className="material-symbols-outlined text-lg" style={{ color: a.c, fontVariationSettings: "'FILL' 1" }}>{a.icon}</span></div><p className="flex-1 text-base text-gray-700">{a.text}</p><span className="text-sm text-gray-400 whitespace-nowrap">{a.time}</span></div>))}
        </Card>
      </>
    )
  }

  /* ─── DOCTORS ─── */
  const renderDoctors = () => (<>
    <Head icon="stethoscope" title="Doctor Management" count={doctors.length} />
    <SearchBar value={docSearch} onChange={setDocSearch} placeholder="Search by name, email, ID, or specialty…" />
    <Card><div className="overflow-x-auto"><table className="w-full"><thead><tr className="bg-gray-50/80 border-b border-gray-100"><TH>Doctor</TH><TH>Specialty</TH><TH>Location</TH><TH>Rating</TH><TH>Consult Fee</TH><TH>Status</TH><TH className="text-right">Actions</TH></tr></thead>
    <tbody className="divide-y divide-gray-50">{filteredDocs.map(d => (
      <tr key={d.id} className="hover:bg-gray-50/60 transition-colors">
        <td className="px-5 py-5"><div className="flex items-center gap-3"><div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden shrink-0">{d.img ? <img src={d.img} alt="" className="w-full h-full object-cover" /> : <span className="material-symbols-outlined text-gray-400">person</span>}</div><div><p className="text-base font-semibold text-gray-900">{d.name}</p><p className="text-xs text-gray-400">{d.email}</p></div></div></td>
        <td className="px-5 py-5 text-base text-gray-600">{d.spec}</td>
        <td className="px-5 py-5 text-sm text-gray-500">{d.location}</td>
        <td className="px-5 py-5"><span className="text-base font-semibold text-amber-500">{d.rating !== '—' ? `★ ${d.rating}` : '—'}</span></td>
        <td className="px-5 py-5 text-base text-gray-700 font-medium">{d.price}</td>
        <td className="px-5 py-5"><B>{d.status}</B></td>
        <td className="px-5 py-5 text-right"><div className="flex items-center justify-end gap-2">
          <button onClick={() => setModal({ t: 'doc', d })} className="px-3 py-2 rounded-lg text-sm font-semibold text-emerald-600 hover:text-emerald-700 transition-colors">View</button>
          {d.status === 'Pending' && <button onClick={() => { setDoctors(p => p.map(x => x.id === d.id ? { ...x, status: 'Active' } : x)); flash(`${d.name} approved`) }} className="px-3 py-2 rounded-lg text-sm font-semibold text-blue-600 hover:text-blue-700 transition-colors">Approve</button>}
          {d.status === 'Active' && <button onClick={() => { setDoctors(p => p.map(x => x.id === d.id ? { ...x, status: 'Suspended' } : x)); flash(`${d.name} suspended`) }} className="px-3 py-2 rounded-lg text-sm font-semibold text-red-600 hover:text-red-700 transition-colors">Suspend</button>}
          {d.status === 'Suspended' && <button onClick={() => { setDoctors(p => p.map(x => x.id === d.id ? { ...x, status: 'Active' } : x)); flash(`${d.name} reactivated`) }} className="px-3 py-2 rounded-lg text-sm font-semibold text-blue-600 hover:text-blue-700 transition-colors">Reactivate</button>}
        </div></td>
      </tr>
    ))}{filteredDocs.length === 0 && <tr><td colSpan={7} className="px-5 py-10 text-center text-base text-gray-400">No doctors found</td></tr>}</tbody></table></div></Card>
  </>)

  /* ─── PATIENTS (only signup data) ─── */
  const renderPatients = () => (<>
    <Head icon="groups" title="Patient Management" count={patients.length} />
    <SearchBar value={patSearch} onChange={setPatSearch} placeholder="Search by name, email, or UID…" />
    <Card><div className="overflow-x-auto"><table className="w-full"><thead><tr className="bg-gray-50/80 border-b border-gray-100"><TH>Patient</TH><TH>UID</TH><TH>Gender</TH><TH>Joined</TH><TH>Status</TH><TH className="text-right">Actions</TH></tr></thead>
    <tbody className="divide-y divide-gray-50">{filteredPats.map(p => (
      <tr key={p.uid} className="hover:bg-gray-50/60 transition-colors">
        <td className="px-5 py-5"><div><p className="text-base font-semibold text-gray-900">{p.name}</p><p className="text-xs text-gray-400">{p.email}</p></div></td>
        <td className="px-5 py-5 text-sm text-[#006977] font-mono font-bold">{p.uid}</td>
        <td className="px-5 py-5 text-base text-gray-600">{p.gender}</td>
        <td className="px-5 py-5 text-base text-gray-500">{p.joined}</td>
        <td className="px-5 py-5"><B>{p.status}</B></td>
        <td className="px-5 py-5 text-right"><div className="flex items-center justify-end gap-2">
          <button onClick={() => setModal({ t: 'pat', d: p })} className="px-3 py-2 rounded-lg text-sm font-semibold text-emerald-600 hover:text-emerald-700 transition-colors">View</button>
          {p.status !== 'Blocked' && <button onClick={() => { setPatients(prev => prev.map(x => x.uid === p.uid ? { ...x, status: 'Blocked' } : x)); flash(`${p.name} blocked`) }} className="px-3 py-2 rounded-lg text-sm font-semibold text-red-600 hover:text-red-700 transition-colors">Block</button>}
          {p.status === 'Blocked' && <button onClick={() => { setPatients(prev => prev.map(x => x.uid === p.uid ? { ...x, status: 'Active' } : x)); flash(`${p.name} unblocked`) }} className="px-3 py-2 rounded-lg text-sm font-semibold text-blue-600 hover:text-blue-700 transition-colors">Unblock</button>}
        </div></td>
      </tr>
    ))}{filteredPats.length === 0 && <tr><td colSpan={6} className="px-5 py-10 text-center text-base text-gray-400">No patients found</td></tr>}</tbody></table></div></Card>
  </>)

  /* ─── APPOINTMENTS ─── */
  const renderAppointments = () => (<>
    <Head icon="event_note" title="Appointment Management" count={ALL_APPOINTMENTS.length} />
    <div className="flex flex-wrap gap-2 mb-6">{['All', 'Confirmed', 'Completed', 'Pending', 'No-Show', 'Not Attended', 'Live Now'].map(f => <button key={f} onClick={() => setApptFilter(f)} className={`px-4 py-2 rounded-full text-sm font-semibold transition-all ${apptFilter === f ? 'bg-[#006977] text-white shadow-sm' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'}`}>{f}</button>)}</div>
    <Card><div className="overflow-x-auto"><table className="w-full"><thead><tr className="bg-gray-50/80 border-b border-gray-100"><TH>Patient</TH><TH>Doctor</TH><TH>Date</TH><TH>Time</TH><TH>Type</TH><TH>Status</TH></tr></thead>
    <tbody className="divide-y divide-gray-50">{filteredAppts.map(a => (<tr key={a.id} className="hover:bg-gray-50/60 transition-colors"><td className="px-5 py-5 text-base font-semibold text-gray-900">{a.patient}</td><td className="px-5 py-5 text-base text-gray-600">{a.doctor}</td><td className="px-5 py-5 text-base text-gray-500">{a.date}</td><td className="px-5 py-5 text-base text-gray-500">{a.time}</td><td className="px-5 py-5 text-sm text-gray-500">{a.type}</td><td className="px-5 py-5"><B>{a.status}</B></td></tr>))}</tbody></table></div>
    {filteredAppts.length === 0 && <p className="py-12 text-center text-base text-gray-400">No appointments match this filter.</p>}</Card>
  </>)

  /* ─── VIDEO CALLS ─── */
  const renderVideoCalls = () => (<><Head icon="video_camera_front" title="Video Call Logs" count={VIDEO_CALLS.length} /><Card><div className="overflow-x-auto"><table className="w-full"><thead><tr className="bg-gray-50/80 border-b border-gray-100"><TH>Doctor</TH><TH>Patient</TH><TH>Date</TH><TH>Time</TH><TH>Duration</TH><TH>Status</TH></tr></thead><tbody className="divide-y divide-gray-50">{VIDEO_CALLS.map(v => (<tr key={v.id} className="hover:bg-gray-50/60 transition-colors"><td className="px-5 py-5 text-base font-semibold text-gray-900">{v.doctor}</td><td className="px-5 py-5 text-base text-gray-600">{v.patient}</td><td className="px-5 py-5 text-base text-gray-500">{v.date}</td><td className="px-5 py-5 text-base text-gray-500">{v.time}</td><td className="px-5 py-5 text-base text-gray-700 font-medium">{v.duration}</td><td className="px-5 py-5"><B>{v.status}</B></td></tr>))}</tbody></table></div></Card></>)

  /* ─── AI ─── */
  const renderAI = () => (<><Head icon="neurology" title="AI Chat Monitoring" /><div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-8"><Kpi icon="forum" label="Total Queries" value={AI_QUERIES.length} color="#8b5cf6" /><Kpi icon="speed" label="Avg Response" value="1.8s" color="#06b6d4" /><Kpi icon="flag" label="Flagged" value={AI_QUERIES.filter(q => q.flag).length} sub="Review" color="#ef4444" /></div><Card><div className="overflow-x-auto"><table className="w-full"><thead><tr className="bg-gray-50/80 border-b border-gray-100"><TH>Patient</TH><TH>Query</TH><TH>AI Response</TH><TH>Time</TH><TH>Safety</TH></tr></thead><tbody className="divide-y divide-gray-50">{AI_QUERIES.map(q => (<tr key={q.id} className="hover:bg-gray-50/60 transition-colors"><td className="px-5 py-5 text-base font-semibold text-gray-900">{q.patient}</td><td className="px-5 py-5 text-base text-gray-600 max-w-[220px]">{q.query}</td><td className="px-5 py-5 text-sm text-gray-500 max-w-[220px]">{q.response}</td><td className="px-5 py-5 text-sm text-gray-400 whitespace-nowrap">{q.time}</td><td className="px-5 py-5">{q.flag ? <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-red-600"><span className="material-symbols-outlined text-base" style={{ fontVariationSettings: "'FILL' 1" }}>warning</span>Flagged</span> : <span className="text-sm font-semibold text-emerald-600">✓ Safe</span>}</td></tr>))}</tbody></table></div></Card></>)

  /* ─── PAYMENTS ─── */
  const renderPayments = () => { const pend = TRANSACTIONS.filter(t => t.status === 'Pending').reduce((s, t) => s + t.amount, 0); const ref = TRANSACTIONS.filter(t => t.status === 'Refund Requested').reduce((s, t) => s + t.amount, 0); return (<><Head icon="account_balance_wallet" title="Patient Payments" count={TRANSACTIONS.length} /><div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8"><Kpi icon="account_balance" label="Total Collected" value={`PKR ${totalRev.toLocaleString()}`} sub="+18%" /><Kpi icon="schedule" label="Pending" value={`PKR ${pend.toLocaleString()}`} color="#f59e0b" /><Kpi icon="undo" label="Refunds" value={`PKR ${ref.toLocaleString()}`} color="#ef4444" /><Kpi icon="trending_up" label="Avg Fee" value="PKR 3,250" color="#6366f1" /></div><Card><div className="overflow-x-auto"><table className="w-full"><thead><tr className="bg-gray-50/80 border-b border-gray-100"><TH>TX ID</TH><TH>Patient (Payer)</TH><TH>Doctor</TH><TH>Amount</TH><TH>Date</TH><TH>Method</TH><TH>Status</TH></tr></thead><tbody className="divide-y divide-gray-50">{TRANSACTIONS.map(t => (<tr key={t.id} className="hover:bg-gray-50/60 transition-colors"><td className="px-5 py-5 text-sm text-[#006977] font-mono font-bold">{t.id}</td><td className="px-5 py-5 text-base font-semibold text-gray-900">{t.patient}</td><td className="px-5 py-5 text-base text-gray-600">{t.doctor}</td><td className="px-5 py-5 text-base text-gray-900 font-bold">PKR {t.amount.toLocaleString()}</td><td className="px-5 py-5 text-base text-gray-500">{t.date}</td><td className="px-5 py-5 text-sm text-gray-500">{t.method}</td><td className="px-5 py-5"><B>{t.status}</B></td></tr>))}</tbody></table></div></Card></>) }

  /* ─── SUPPORT (no priority, amber resolve button) ─── */
  const renderComplaints = () => (<>
    <Head icon="contact_support" title="Complaints & Support" count={complaints.length} />
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-8"><Kpi icon="error_outline" label="Open" value={complaints.filter(c => c.status === 'Open').length} color="#ef4444" /><Kpi icon="hourglass_top" label="In Progress" value={complaints.filter(c => c.status === 'In Progress').length} color="#f59e0b" /><Kpi icon="task_alt" label="Resolved" value={complaints.filter(c => c.status === 'Resolved').length} /></div>
    <Card><div className="overflow-x-auto"><table className="w-full"><thead><tr className="bg-gray-50/80 border-b border-gray-100"><TH>Ticket</TH><TH>From</TH><TH>Role</TH><TH>Subject</TH><TH>Date</TH><TH>Status</TH><TH className="text-right">Actions</TH></tr></thead>
    <tbody className="divide-y divide-gray-50">{complaints.map(c => (
      <tr key={c.id} className="hover:bg-gray-50/60 transition-colors">
        <td className="px-5 py-5 text-sm text-[#006977] font-mono font-bold">{c.id}</td>
        <td className="px-5 py-5 text-base font-semibold text-gray-900">{c.from}</td>
        <td className="px-5 py-5 text-base text-gray-500">{c.role}</td>
        <td className="px-5 py-5 text-base text-gray-600 max-w-[220px] truncate">{c.subject}</td>
        <td className="px-5 py-5 text-base text-gray-500">{c.date}</td>
        <td className="px-5 py-5"><B>{c.status}</B></td>
        <td className="px-5 py-5 text-right"><div className="flex items-center justify-end gap-2">
          <button onClick={() => setModal({ t: 'cmp', d: c })} className="px-3 py-2 rounded-lg text-sm font-semibold text-emerald-600 hover:text-emerald-700 transition-colors">View</button>
          {c.status !== 'Resolved' && <button onClick={() => { setComplaints(p => p.map(x => x.id === c.id ? { ...x, status: 'Resolved' } : x)); flash(`${c.id} resolved`) }} className="px-3 py-2 rounded-lg text-sm font-semibold text-red-600 hover:text-red-700 transition-colors">Resolve</button>}
        </div></td>
      </tr>
    ))}</tbody></table></div></Card>
  </>)

  /* ─── SETTINGS ─── */
  const Toggle = ({ on, onToggle, label, desc }) => (<div className="flex items-center justify-between py-4 border-b border-gray-100 last:border-0"><div className="pr-4"><p className="text-base text-gray-800 font-medium">{label}</p><p className="text-sm text-gray-400 mt-0.5">{desc}</p></div><button onClick={onToggle} className={`relative w-12 h-6 rounded-full transition-colors shrink-0 ${on ? 'bg-[#006977]' : 'bg-gray-200'}`}><div className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow-sm transition-all ${on ? 'left-[26px]' : 'left-0.5'}`} /></button></div>)

  const renderSettings = () => (<><Head icon="manufacturing" title="Platform Settings" /><div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
    <Card className="p-6"><h3 className="text-base font-bold text-gray-900 mb-5 flex items-center gap-2.5"><span className="material-symbols-outlined text-[#006977] text-xl">category</span>Manage Specializations</h3><div className="flex gap-2 mb-5"><input type="text" value={newSpec} onChange={e => setNewSpec(e.target.value)} onKeyDown={e => { if (e.key === 'Enter' && newSpec.trim() && !specs.includes(newSpec.trim())) { setSpecs(p => [...p, newSpec.trim()]); setNewSpec(''); flash('Added') } }} placeholder="Add specialization…" className="flex-1 bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-base text-gray-900 placeholder:text-gray-400 focus:border-[#006977] focus:ring-2 focus:ring-[#006977]/10 outline-none transition-all" /><button onClick={() => { if (newSpec.trim() && !specs.includes(newSpec.trim())) { setSpecs(p => [...p, newSpec.trim()]); setNewSpec(''); flash('Added') } }} className="px-5 py-3 rounded-xl bg-[#006977] text-white text-sm font-semibold hover:bg-[#005a66] transition-colors">Add</button></div><div className="flex flex-wrap gap-2">{specs.map(s => <span key={s} className="inline-flex items-center gap-2 px-3.5 py-2 rounded-full bg-gray-50 text-gray-700 text-sm font-medium border border-gray-200">{s}<button onClick={() => { setSpecs(p => p.filter(x => x !== s)); flash(`Removed ${s}`) }} className="hover:text-red-500 transition-colors"><span className="material-symbols-outlined text-sm">close</span></button></span>)}</div></Card>
    <Card className="p-6"><h3 className="text-base font-bold text-gray-900 mb-5 flex items-center gap-2.5"><span className="material-symbols-outlined text-[#006977] text-xl">gavel</span>Platform Rules</h3>{[{ l: 'Cancellation Policy', v: 'Non-refundable after confirmation' }, { l: 'No-Show Policy', v: 'Repayment required' }, { l: 'Refund Window', v: '24 hours before appointment' }, { l: 'Max Reschedules', v: '2 per appointment' }].map(r => <div key={r.l} className="flex items-center justify-between py-4 border-b border-gray-100 last:border-0"><span className="text-base text-gray-700">{r.l}</span><span className="text-sm font-semibold text-[#006977] bg-[#006977]/5 px-4 py-1.5 rounded-lg">{r.v}</span></div>)}</Card>
    <Card className="p-6 lg:col-span-2"><h3 className="text-base font-bold text-gray-900 mb-2 flex items-center gap-2.5"><span className="material-symbols-outlined text-[#006977] text-xl">shield</span>Privacy & Compliance</h3><p className="text-sm text-gray-400 mb-5">Changes apply immediately.</p><div className="grid grid-cols-1 md:grid-cols-2 gap-x-10"><div><p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 mt-2">Data Protection</p><Toggle on={privacy.dataRetention} onToggle={() => togglePrivacy('dataRetention')} label="Data Retention (5 Years)" desc="Keep records for regulatory compliance" /><Toggle on={privacy.hipaa} onToggle={() => togglePrivacy('hipaa')} label="HIPAA Compliance Mode" desc="Enforce health data privacy regulations" /><Toggle on={privacy.encryptBackup} onToggle={() => togglePrivacy('encryptBackup')} label="Encrypted Backups" desc="AES-256 encryption for all backups" /><Toggle on={privacy.patientConsent} onToggle={() => togglePrivacy('patientConsent')} label="Patient Consent Required" desc="Require consent before data collection" /></div><div><p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 mt-2">Security</p><Toggle on={privacy.twoFactor} onToggle={() => togglePrivacy('twoFactor')} label="Two-Factor Authentication" desc="2FA for admin and doctor accounts" /><Toggle on={privacy.auditLog} onToggle={() => togglePrivacy('auditLog')} label="Audit Logging" desc="Track all admin actions and access" /><Toggle on={privacy.sessionTimeout} onToggle={() => togglePrivacy('sessionTimeout')} label="Session Timeout (30 min)" desc="Auto-logout inactive users" /><Toggle on={privacy.anonAI} onToggle={() => togglePrivacy('anonAI')} label="Anonymous AI Queries" desc="Allow AI use without identification" /></div></div></Card>
    <Card className="p-6"><h3 className="text-base font-bold text-gray-900 mb-5 flex items-center gap-2.5"><span className="material-symbols-outlined text-[#006977] text-xl">event_available</span>Appointment Types</h3>{['General Check-up', 'Video Consultation', 'Lab Review', 'Immunization', 'Follow-up', 'Emergency', 'Prescription Refill'].map(t => <div key={t} className="flex items-center gap-3 py-3 border-b border-gray-50 last:border-0"><span className="w-2 h-2 rounded-full bg-[#006977]" /><span className="text-base text-gray-700">{t}</span></div>)}</Card>
  </div></>)

  const views = { overview: renderOverview, doctors: renderDoctors, patients: renderPatients, appointments: renderAppointments, videocalls: renderVideoCalls, ai: renderAI, payments: renderPayments, complaints: renderComplaints, settings: renderSettings }

  return (
    <div className="min-h-screen bg-[#f8f9fb]">
      {sidebar}
      <main className="ml-[270px] p-8 max-w-[1400px]">{(views[section] || renderOverview)()}</main>

      {/* Modal */}
      {modal && (<div className="fixed inset-0 z-[100] flex items-center justify-center p-4"><div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={() => setModal(null)} /><div className="relative bg-white rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden border border-gray-100" style={{ animation: 'fadeIn 0.25s ease' }}>
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100"><h3 className="text-lg font-bold text-gray-900">{modal.t === 'doc' ? 'Doctor Profile' : modal.t === 'pat' ? 'Patient Details' : `Ticket ${modal.d.id}`}</h3><button onClick={() => setModal(null)} className="p-2 rounded-lg hover:bg-gray-100 text-gray-400 transition-colors"><span className="material-symbols-outlined text-xl">close</span></button></div>
        <div className="px-6 py-6 space-y-5 max-h-[65vh] overflow-y-auto">
          {modal.t === 'doc' && <><div className="flex items-center gap-4"><div className="w-14 h-14 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden">{modal.d.img ? <img src={modal.d.img} alt="" className="w-full h-full object-cover" /> : <span className="material-symbols-outlined text-gray-400 text-2xl">person</span>}</div><div><p className="text-lg font-bold text-gray-900">{modal.d.name}</p><p className="text-base text-[#006977]">{modal.d.spec}</p></div></div><div className="grid grid-cols-2 gap-x-6 gap-y-4">{[['Email', modal.d.email], ['Location', modal.d.location], ['Rating', modal.d.rating !== '—' ? `★ ${modal.d.rating}` : '—'], ['Fee', modal.d.price], ['Patients', modal.d.patients], ['Joined', modal.d.joined]].map(([l, v]) => <div key={l}><p className="text-xs text-gray-400 uppercase tracking-widest mb-1">{l}</p><p className="text-base text-gray-800 font-medium">{v}</p></div>)}</div><div><p className="text-xs text-gray-400 uppercase tracking-widest mb-1">Status</p><B>{modal.d.status}</B></div><div><p className="text-xs text-gray-400 uppercase tracking-widest mb-1">About</p><p className="text-base text-gray-600 leading-relaxed">{modal.d.about}</p></div></>}
          {modal.t === 'pat' && <><div className="grid grid-cols-2 gap-x-6 gap-y-4">{[['Name', modal.d.name], ['Email', modal.d.email], ['UID', modal.d.uid], ['Gender', modal.d.gender], ['Joined', modal.d.joined]].map(([l, v]) => <div key={l}><p className="text-xs text-gray-400 uppercase tracking-widest mb-1">{l}</p><p className="text-base text-gray-800 font-medium">{v}</p></div>)}</div><div><p className="text-xs text-gray-400 uppercase tracking-widest mb-1">Account Status</p><B>{modal.d.status}</B></div></>}
          {modal.t === 'cmp' && <><div className="grid grid-cols-2 gap-x-6 gap-y-4">{[['From', modal.d.from], ['Role', modal.d.role], ['Date', modal.d.date]].map(([l, v]) => <div key={l}><p className="text-xs text-gray-400 uppercase tracking-widest mb-1">{l}</p><p className="text-base text-gray-800 font-medium">{v}</p></div>)}</div><div><p className="text-xs text-gray-400 uppercase tracking-widest mb-1">Status</p><B>{modal.d.status}</B></div><div><p className="text-xs text-gray-400 uppercase tracking-widest mb-1">Subject</p><p className="text-base text-gray-800 font-medium">{modal.d.subject}</p></div><div><p className="text-xs text-gray-400 uppercase tracking-widest mb-1">Details</p><p className="text-base text-gray-600 leading-relaxed">{modal.d.detail}</p></div></>}
        </div></div></div>)}

      {toast && <div className="fixed bottom-6 right-6 z-[110]"><div className="bg-[#006977] text-white px-6 py-3.5 rounded-xl shadow-lg flex items-center gap-3 text-base font-semibold"><span className="material-symbols-outlined text-xl" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>{toast}</div></div>}
    </div>
  )
}
